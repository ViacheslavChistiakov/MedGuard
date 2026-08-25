"use server"

import { redirect } from "next/navigation"
import { verifySession, getCurrentUser } from "@/lib/auth/dal"
import { ordersRepository } from "@/lib/repositories"
import { getPlanById } from "@/lib/data/insurance-plans"
import { createPayment, getAppUrl } from "@/lib/yookassa/client"
import { convertUsdToRub } from "@/lib/currency"
import { sendPaymentLinkEmail } from "@/lib/resend/send"
import { isLocale, fallbackLng } from "@/i18n/settings"

export async function initiatePayment(planId: string, rawLocale: string): Promise<void> {
  await verifySession()
  const locale = isLocale(rawLocale) ? rawLocale : fallbackLng

  const plan = await getPlanById(planId)
  if (!plan) {
    throw new Error("Plan not found")
  }

  const user = await getCurrentUser()
  if (!user) {
    throw new Error("User not found")
  }

  const order = await ordersRepository.create(planId)
  const appUrl = getAppUrl()
  // order.amount is the plan's USD price, always shown as-is on the site;
  // YooKassa only ever settles in rubles, so convert right here, at the
  // charge boundary, without touching how the price is displayed elsewhere.
  const amountRub = (await convertUsdToRub(order.amount)).toFixed(2)

  const { confirmationUrl } = await createPayment({
    amountRub,
    description: order.description,
    invId: order.invId,
    customerEmail: user.email,
    returnUrl: `${appUrl}/${locale}/checkout/success?invId=${order.invId}`,
    locale,
  })

  await sendPaymentLinkEmail({
    to: user.email,
    name: user.name,
    planName: plan.name,
    planDescription: plan.description,
    amountUsd: order.amount,
    paymentUrl: confirmationUrl,
    locale,
  })

  redirect(confirmationUrl)
}
