import type { Metadata } from "next"
import { verifySession } from "@/lib/auth/dal"
import { ordersRepository } from "@/lib/repositories"
import { reconcilePendingOrder } from "@/lib/yookassa/reconcile"
import { Card } from "@/components/ui/card"
import initTranslations from "@/i18n"
import { isLocale, fallbackLng } from "@/i18n/settings"

const RECONCILE_ATTEMPTS = 4
const RECONCILE_RETRY_DELAY_MS = 1500

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/checkout/success">): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale = isLocale(rawLocale) ? rawLocale : fallbackLng
  const { t } = await initTranslations(locale)
  return { title: t("checkout.metaTitle") }
}

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: PageProps<"/[locale]/checkout/success">) {
  await verifySession()
  const { locale: rawLocale } = await params
  const locale = isLocale(rawLocale) ? rawLocale : fallbackLng
  const { t } = await initTranslations(locale)

  // YooKassa's return_url carries no signature and its query params aren't
  // meant to be trusted, so there is nothing to verify client-side here.
  // The order's status in MongoDB is the only authoritative source of
  // truth; this page is UX only.
  //
  // Self-heal: this is the only confirmation path when the real webhook
  // (med-guard/app/api/payments/yookassa/result/route.ts) either can't
  // reach us (e.g. localhost in dev) or was never registered with YooKassa
  // at all. Even with a working webhook, the browser can land back here
  // before YooKassa's own API reports the payment as "succeeded" yet - so
  // this retries a few times with a short delay rather than giving up
  // after a single check. Best-effort - a failure here must not break this
  // page.
  const { invId } = await searchParams
  const invIdNumber = Number(invId)
  if (Number.isInteger(invIdNumber)) {
    try {
      const order = await ordersRepository.getByInvId(invIdNumber)
      if (order?.status === "pending") {
        for (let attempt = 1; attempt <= RECONCILE_ATTEMPTS; attempt++) {
          const reconciled = await reconcilePendingOrder(invIdNumber)
          if (reconciled) break
          if (attempt < RECONCILE_ATTEMPTS) {
            await sleep(RECONCILE_RETRY_DELAY_MS)
          }
        }
      }
    } catch (error) {
      console.error("Checkout success self-heal check failed:", error)
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12 text-center sm:px-6">
      <Card>
        <h1 className="mb-2 text-2xl font-semibold">{t("checkout.successTitle")}</h1>
        <p className="text-sm text-muted-foreground">{t("checkout.successSubtitle")}</p>
      </Card>
    </div>
  )
}
