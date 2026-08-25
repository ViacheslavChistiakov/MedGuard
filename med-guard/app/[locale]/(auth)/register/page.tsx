import type { Metadata } from "next"
import { Card } from "@/components/ui/card"
import { RegisterForm } from "@/components/auth/register-form"
import initTranslations from "@/i18n"
import { isLocale, fallbackLng } from "@/i18n/settings"

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/register">): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale = isLocale(rawLocale) ? rawLocale : fallbackLng
  const { t } = await initTranslations(locale)
  return { title: t("auth.register.metaTitle") }
}

export default async function RegisterPage({ params }: PageProps<"/[locale]/register">) {
  const { locale: rawLocale } = await params
  const locale = isLocale(rawLocale) ? rawLocale : fallbackLng
  const { t } = await initTranslations(locale)

  return (
    <Card
      title={<span className="text-xl">{t("auth.register.title")}</span>}
      description={t("auth.register.description")}
    >
      <RegisterForm />
    </Card>
  )
}
