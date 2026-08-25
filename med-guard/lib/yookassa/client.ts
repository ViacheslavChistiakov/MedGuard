import "server-only"
import { randomUUID } from "crypto"

const YOOKASSA_AUTH = process.env.YOOKASSA_AUTH

if (!YOOKASSA_AUTH) {
  throw new Error("YOOKASSA_AUTH environment variable must be set")
}

const API_BASE = "https://api.yookassa.ru/v3"

export function getAppUrl(): string {
  const appUrl = process.env.APP_URL
  if (!appUrl) {
    throw new Error("APP_URL environment variable is not set")
  }
  return appUrl
}

interface YooKassaPayment {
  id: string
  status: string
  metadata: Record<string, string>
  confirmation?: { confirmation_url: string }
}

export async function createPayment(params: {
  amountRub: string
  description: string
  invId: number
  customerEmail: string
  returnUrl: string
  locale: string
}): Promise<{ confirmationUrl: string }> {
  const response = await fetch(`${API_BASE}/payments`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${YOOKASSA_AUTH}`,
      "Content-Type": "application/json",
      "Idempotence-Key": randomUUID(),
    },
    body: JSON.stringify({
      amount: { value: params.amountRub, currency: "RUB" },
      confirmation: { type: "redirect", return_url: params.returnUrl },
      description: params.description,
      capture: true,
      // locale has no other home once we're back in the webhook - it has no
      // request/locale context of its own, so this is how it knows which
      // language to send the payment-confirmed email in.
      metadata: { invId: String(params.invId), locale: params.locale },
      receipt: {
        customer: { email: params.customerEmail },
        items: [
          {
            description: params.description,
            quantity: 1,
            amount: { value: params.amountRub, currency: "RUB" },
            // Insurance is VAT-exempt in Russia (matches the "tax: none" the
            // original Robokassa integration used).
            vat_code: 1,
            payment_subject: "service",
            payment_mode: "full_payment",
          },
        ],
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`YooKassa payment creation failed with status ${response.status}: ${await response.text()}`)
  }

  const payment: YooKassaPayment = await response.json()
  if (!payment.confirmation?.confirmation_url) {
    throw new Error("YooKassa payment response did not include a confirmation_url")
  }

  return { confirmationUrl: payment.confirmation.confirmation_url }
}

// Used server-to-server (webhook route, and the checkout success page's
// self-heal check) to authoritatively confirm a payment's real status - a
// caller's own claim about status is never trusted, since YooKassa
// notifications carry no signature to verify.
export async function getPayment(paymentId: string): Promise<YooKassaPayment> {
  const response = await fetch(`${API_BASE}/payments/${paymentId}`, {
    headers: { Authorization: `Basic ${YOOKASSA_AUTH}` },
  })

  if (!response.ok) {
    throw new Error(`YooKassa payment lookup failed with status ${response.status}: ${await response.text()}`)
  }

  return response.json()
}

// We don't persist YooKassa's own payment id anywhere (no schema change for
// this) - it's only known once YooKassa creates the payment, after we've
// already sent them our return_url, so there's no way to thread it back in
// beforehand. Instead, resolve invId -> payment by searching recent
// payments for the matching metadata, same technique
// server/scripts/reconcile-yookassa-payments.ts uses.
export async function findPaymentByInvId(invId: number): Promise<YooKassaPayment | null> {
  const response = await fetch(`${API_BASE}/payments?limit=100`, {
    headers: { Authorization: `Basic ${YOOKASSA_AUTH}` },
  })

  if (!response.ok) {
    throw new Error(`YooKassa payments list failed with status ${response.status}: ${await response.text()}`)
  }

  const data: { items: YooKassaPayment[] } = await response.json()
  return data.items.find((payment) => payment.metadata?.invId === String(invId)) ?? null
}
