import type { Metadata } from "next"
import { verifySession } from "@/lib/auth/dal"
import { Card } from "@/components/ui/card"
import initTranslations from "@/i18n"
import { isLocale, fallbackLng } from "@/i18n/settings"

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/checkout/fail">): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale = isLocale(rawLocale) ? rawLocale : fallbackLng
  const { t } = await initTranslations(locale)
  return { title: t("checkout.metaTitle") }
}

export default async function CheckoutFailPage({ params }: PageProps<"/[locale]/checkout/fail">) {
  await verifySession()
  const { locale: rawLocale } = await params
  const locale = isLocale(rawLocale) ? rawLocale : fallbackLng
  const { t } = await initTranslations(locale)

  // YooKassa only has a single return_url (used regardless of outcome), so
  // the provider never sends users here specifically. This page only exists
  // for the user to navigate to manually, so there is nothing to verify -
  // it is purely informational.
  return (
    <div className="mx-auto w-full max-w-md px-4 py-12 text-center sm:px-6">
      <Card>
        <h1 className="mb-2 text-2xl font-semibold">{t("checkout.failTitle")}</h1>
        <p className="text-sm text-muted-foreground">{t("checkout.failSubtitle")}</p>
      </Card>
    </div>
  )
}
