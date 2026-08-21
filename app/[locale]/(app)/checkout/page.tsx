import type { Metadata } from "next"
import { verifySession } from "@/lib/auth/dal"
import { Card } from "@/components/ui/card"
import { CardPaymentForm } from "@/components/checkout/card-payment-form"
import initTranslations from "@/i18n"
import { isLocale, fallbackLng } from "@/i18n/settings"

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/checkout">): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale = isLocale(rawLocale) ? rawLocale : fallbackLng
  const { t } = await initTranslations(locale)
  return { title: t("checkout.metaTitle") }
}

export default async function CheckoutPage({ params }: PageProps<"/[locale]/checkout">) {
  await verifySession()
  const { locale: rawLocale } = await params
  const locale = isLocale(rawLocale) ? rawLocale : fallbackLng
  const { t } = await initTranslations(locale)

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12 sm:px-6">
      <h1 className="mb-1 text-2xl font-semibold">{t("checkout.title")}</h1>
      <p className="mb-6 text-sm text-muted-foreground">{t("checkout.subtitle")}</p>
      <Card>
        <CardPaymentForm />
      </Card>
    </div>
  )
}
