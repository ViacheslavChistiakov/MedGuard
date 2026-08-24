import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Plan prices are always displayed in USD, regardless of what a payment
// provider actually settles in - see lib/currency.ts for the RUB conversion
// used only when charging via YooMoney.
export function formatCurrency(amountUsd: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: amountUsd % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amountUsd)
}
