import "server-only"
import { resend, RESEND_FROM_EMAIL } from "@/lib/resend/client"
import { PaymentLinkEmail } from "@/lib/resend/emails/payment-link-email"
import { PaymentConfirmedEmail } from "@/lib/resend/emails/payment-confirmed-email"
import initTranslations from "@/i18n"
import type { Locale } from "@/i18n/settings"
import { formatCurrency } from "@/lib/utils"

export async function sendPaymentLinkEmail(params: {
  to: string
  name: string
  planName: string
  planDescription: string
  amountUsd: number
  paymentUrl: string
  locale: Locale
}): Promise<void> {
  if (!resend) {
    console.error("Skipping payment link email: RESEND_API_KEY is not set")
    return
  }

  try {
    const { t } = await initTranslations(params.locale)

    const { error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: params.to,
      subject: t("email.paymentLink.subject", { planName: params.planName }),
      react: PaymentLinkEmail({
        heading: t("email.paymentLink.heading"),
        greeting: t("email.greeting", { name: params.name }),
        body: t("email.paymentLink.body", { planName: params.planName }),
        planName: params.planName,
        planDescription: params.planDescription,
        priceLabel: t("email.paymentLink.priceLabel"),
        priceValue: formatCurrency(params.amountUsd),
        buttonLabel: t("email.paymentLink.button"),
        paymentUrl: params.paymentUrl,
      }),
    })

    // The Resend SDK does NOT throw on API-level failures (bad `from`
    // address, unverified recipient in sandbox mode, etc.) - it resolves
    // with { data: null, error } instead, so this has to be checked
    // explicitly or a real failure silently disappears.
    if (error) {
      console.error("Resend rejected the payment link email:", error)
    }
  } catch (error) {
    // Must never break checkout - the redirect to the payment page still
    // has to happen even if the email fails to send.
    console.error("Failed to send payment link email:", error)
  }
}

export async function sendPaymentConfirmedEmail(params: {
  to: string
  name: string
  planName: string
  planDescription: string
  amountUsd: number
  viewPlanUrl: string
  locale: Locale
}): Promise<void> {
  if (!resend) {
    console.error("Skipping payment confirmed email: RESEND_API_KEY is not set")
    return
  }

  try {
    const { t } = await initTranslations(params.locale)

    const { error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: params.to,
      subject: t("email.paymentConfirmed.subject", { planName: params.planName }),
      react: PaymentConfirmedEmail({
        heading: t("email.paymentConfirmed.heading"),
        greeting: t("email.greeting", { name: params.name }),
        body: t("email.paymentConfirmed.body", { planName: params.planName }),
        planName: params.planName,
        planDescription: params.planDescription,
        priceLabel: t("email.paymentConfirmed.priceLabel"),
        priceValue: formatCurrency(params.amountUsd),
        viewPlanLabel: t("email.paymentConfirmed.viewPlan"),
        viewPlanUrl: params.viewPlanUrl,
      }),
    })

    // See sendPaymentLinkEmail - the SDK returns API-level errors rather
    // than throwing, so this has to be checked explicitly.
    if (error) {
      console.error("Resend rejected the payment confirmed email:", error)
    }
  } catch (error) {
    // Must never break the webhook - the order is already correctly marked
    // paid by the time this runs, regardless of whether the email succeeds.
    console.error("Failed to send payment confirmed email:", error)
  }
}
