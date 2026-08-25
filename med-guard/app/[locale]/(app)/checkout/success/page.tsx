import type { Metadata } from "next"
import { verifySession } from "@/lib/auth/dal"
import { ordersRepository } from "@/lib/repositories"
import { reconcilePendingOrder } from "@/lib/yookassa/reconcile"
import { Card } from "@/components/ui/card"
import initTranslations from "@/i18n"
import { isLocale, fallbackLng } from "@/i18n/settings"

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
  // Self-heal: in local dev, YooKassa's servers can never reach a
  // localhost webhook, so an order that genuinely succeeded can still show
  // "pending" by the time the browser lands back here. If so, check
  // directly with YooKassa and reconcile it now, rather than requiring a
  // manual `npm run reconcile:yookassa`. Best-effort - a failure here must
  // not break this page.
  const { invId } = await searchParams
  const invIdNumber = Number(invId)
  if (Number.isInteger(invIdNumber)) {
    try {
      const order = await ordersRepository.getByInvId(invIdNumber)
      if (order?.status === "pending") {
        await reconcilePendingOrder(invIdNumber)
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
