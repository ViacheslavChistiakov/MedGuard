import { useState } from "react"

export interface CardDetails {
  cardholderName: string
  cardNumber: string
  expiry: string
  cvc: string
}

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16)
  return (digits.match(/.{1,4}/g) ?? []).join(" ")
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4)
  return digits.length < 3 ? digits : `${digits.slice(0, 2)}/${digits.slice(2)}`
}

export function useCardPaymentForm(onSubmit?: (details: CardDetails) => void) {
  const [cardholderName, setCardholderName] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvc, setCvc] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const isValid =
    cardholderName.trim().length > 1 &&
    cardNumber.replace(/\s/g, "").length === 16 &&
    /^\d{2}\/\d{2}$/.test(expiry) &&
    cvc.length >= 3

  function handleCardNumberChange(value: string) {
    setCardNumber(formatCardNumber(value))
  }

  function handleExpiryChange(value: string) {
    setExpiry(formatExpiry(value))
  }

  function handleCvcChange(value: string) {
    setCvc(value.replace(/\D/g, "").slice(0, 4))
  }

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isValid) return

    setSubmitting(true)
    // TODO: wire up to a real payment processor once one exists.
    onSubmit?.({ cardholderName, cardNumber, expiry, cvc })
  }

  return {
    fields: { cardholderName, cardNumber, expiry, cvc },
    isValid,
    submitting,
    setCardholderName,
    handleCardNumberChange,
    handleExpiryChange,
    handleCvcChange,
    handleSubmit,
  }
}
