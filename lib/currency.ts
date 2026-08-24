import "server-only"

// YooMoney only ever settles in rubles (no USD wallets/settlement exist), so
// plan prices - stored and always displayed in USD - are converted to
// rubles right before being charged. This conversion is deliberately NOT
// used for on-page price display, which stays in USD - see lib/utils.ts's
// formatCurrency.
//
// The rate is fetched live from the Central Bank of Russia's daily rates
// (via a public JSON mirror of the CBR's own data), cached for an hour via
// Next.js's fetch cache, and falls back to USD_TO_RUB_RATE if that lookup
// fails for any reason - checkout must not break just because an external
// API had a hiccup.
const CBR_RATES_URL = "https://www.cbr-xml-daily.ru/daily_json.js"
const FETCH_TIMEOUT_MS = 5000
const CACHE_REVALIDATE_SECONDS = 60 * 60

const FALLBACK_RATE = Number(process.env.USD_TO_RUB_RATE)

if (!process.env.USD_TO_RUB_RATE || !Number.isFinite(FALLBACK_RATE) || FALLBACK_RATE <= 0) {
  throw new Error(
    "USD_TO_RUB_RATE environment variable must be set to a positive number " +
      "(used as a fallback if the live rate lookup fails)"
  )
}

async function fetchLiveUsdToRubRate(): Promise<number> {
  const response = await fetch(CBR_RATES_URL, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    next: { revalidate: CACHE_REVALIDATE_SECONDS },
  })
  if (!response.ok) {
    throw new Error(`CBR rates request failed with status ${response.status}`)
  }

  const data = await response.json()
  const usd = data?.Valute?.USD
  const rate = usd ? usd.Value / usd.Nominal : NaN
  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error("CBR rates response did not contain a valid USD rate")
  }

  return rate
}

export async function getUsdToRubRate(): Promise<number> {
  try {
    return await fetchLiveUsdToRubRate()
  } catch (error) {
    console.error("Live USD/RUB rate lookup failed, falling back to USD_TO_RUB_RATE:", error)
    return FALLBACK_RATE
  }
}

export async function convertUsdToRub(amountUsd: number): Promise<number> {
  const rate = await getUsdToRubRate()
  return amountUsd * rate
}
