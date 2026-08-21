"use client"

import { useTranslation } from "react-i18next"
import { Loader2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCardPaymentForm, type CardDetails } from "@/lib/hooks/use-card-payment-form"

interface CardPaymentFormProps {
  onSubmit?: (details: CardDetails) => void
}

export const CardPaymentForm: React.FC<CardPaymentFormProps> = ({ onSubmit }) => {
  const {
    fields,
    isValid,
    submitting,
    setCardholderName,
    handleCardNumberChange,
    handleExpiryChange,
    handleCvcChange,
    handleSubmit,
  } = useCardPaymentForm(onSubmit)
  const { t } = useTranslation()

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cardholderName">{t("checkout.nameOnCard")}</Label>
        <Input
          id="cardholderName"
          name="cardholderName"
          placeholder="Jane Doe"
          autoComplete="cc-name"
          value={fields.cardholderName}
          onChange={(event) => setCardholderName(event.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cardNumber">{t("checkout.cardNumber")}</Label>
        <Input
          id="cardNumber"
          name="cardNumber"
          inputMode="numeric"
          placeholder="1234 5678 9012 3456"
          autoComplete="cc-number"
          value={fields.cardNumber}
          onChange={(event) => handleCardNumberChange(event.target.value)}
          maxLength={19}
          required
        />
      </div>

      <div className="flex gap-4">
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="expiry">{t("checkout.expiry")}</Label>
          <Input
            id="expiry"
            name="expiry"
            inputMode="numeric"
            placeholder="MM/YY"
            autoComplete="cc-exp"
            value={fields.expiry}
            onChange={(event) => handleExpiryChange(event.target.value)}
            maxLength={5}
            required
          />
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="cvc">{t("checkout.cvc")}</Label>
          <Input
            id="cvc"
            name="cvc"
            inputMode="numeric"
            placeholder="123"
            autoComplete="cc-csc"
            value={fields.cvc}
            onChange={(event) => handleCvcChange(event.target.value)}
            maxLength={4}
            required
          />
        </div>
      </div>

      <Button type="submit" size="lg" disabled={!isValid || submitting} className="mt-1 w-full gap-2">
        {submitting && <Loader2Icon className="size-4 animate-spin" />}
        {submitting ? t("checkout.processing") : t("checkout.confirmPayment")}
      </Button>
    </form>
  )
}
