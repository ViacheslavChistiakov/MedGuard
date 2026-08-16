import type { Metadata } from "next"
import { verifySession } from "@/lib/auth/dal"
import { Card } from "@/components/ui/card"
import { CardPaymentForm } from "@/components/checkout/card-payment-form"

export const metadata: Metadata = {
  title: "Checkout | MedGuard",
}

export default async function CheckoutPage() {
  await verifySession()

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12 sm:px-6">
      <h1 className="mb-1 text-2xl font-semibold">Payment details</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Enter your card information to complete your purchase.
      </p>
      <Card>
        <CardPaymentForm />
      </Card>
    </div>
  )
}
