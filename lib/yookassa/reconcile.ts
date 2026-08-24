import "server-only"
import { apiClient } from "@/lib/api/client"
import { getPayment, findPaymentByInvId, getAppUrl } from "@/lib/yookassa/client"
import { getPlanById } from "@/lib/data/insurance-plans"
import { sendPaymentConfirmedEmail } from "@/lib/resend/send"
import { isLocale, fallbackLng } from "@/i18n/settings"
import type { OrderDTO } from "@/lib/repositories/types"

interface UserApiResponse {
  id: string
  name: string
  email: string
}

// The one place that re-fetches a YooKassa payment from their API and, only
// if it's genuinely "succeeded", marks the matching order paid. Never trust
// a caller's claim about payment status - this always re-verifies against
// YooKassa's own authoritative response. Used by both the real webhook
// route and the checkout success page's self-heal check (for local dev,
// where YooKassa's servers can't reach a localhost webhook at all).
//
// Callers only invoke this for an order they've confirmed is still
// "pending", so the two call sites don't race in practice today - if this
// is ever deployed with the real webhook AND self-heal both live, a rare
// exact-timing overlap could send the confirmation email twice (the paid
// flip itself is safe either way, since markOrderPaid only transitions from
// "pending" once). Not worth the extra plumbing to close that gap yet.
export async function reconcilePayment(paymentId: string): Promise<OrderDTO | null> {
  const payment = await getPayment(paymentId)
  if (payment.status !== "succeeded") {
    return null
  }

  const invId = payment.metadata?.invId
  if (!invId) {
    return null
  }

  const { data: order } = await apiClient.patch<OrderDTO>(`/api/orders/${invId}/paid`, payment, {
    headers: { "x-internal-secret": process.env.INTERNAL_API_SECRET! },
  })

  const rawLocale = payment.metadata?.locale ?? ""
  const locale = isLocale(rawLocale) ? rawLocale : fallbackLng

  try {
    const [user, plan] = await Promise.all([
      apiClient.get<UserApiResponse>(`/api/auth/users/${order.userId}`).then((res) => res.data),
      getPlanById(order.planId),
    ])

    if (user && plan) {
      await sendPaymentConfirmedEmail({
        to: user.email,
        name: user.name,
        planName: plan.name,
        planDescription: plan.description,
        amountUsd: order.amount,
        viewPlanUrl: `${getAppUrl()}/${locale}/profile`,
        locale,
      })
    }
  } catch (error) {
    // The order is already correctly marked paid above regardless of
    // whether we can look up the user/plan to email - never let this fail
    // the caller.
    console.error("Failed to send payment confirmed email:", error)
  }

  return order
}

// For the checkout success page's self-heal check: we don't have a
// YooKassa payment id on hand there (see findPaymentByInvId), only our own
// invId - so resolve it first, then delegate to the same verified
// reconcilePayment path above.
export async function reconcilePendingOrder(invId: number): Promise<OrderDTO | null> {
  const payment = await findPaymentByInvId(invId)
  if (!payment) {
    return null
  }
  return reconcilePayment(payment.id)
}
