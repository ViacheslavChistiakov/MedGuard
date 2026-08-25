import type { Metadata } from "next"
import { Card } from "@/components/ui/card"
import { LoginForm } from "@/components/auth/login-form"
import initTranslations from "@/i18n"
import { isLocale, fallbackLng } from "@/i18n/settings"

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/login">): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale = isLocale(rawLocale) ? rawLocale : fallbackLng
  const { t } = await initTranslations(locale)
  return { title: t("auth.login.metaTitle") }
}

export default async function LoginPage({ params }: PageProps<"/[locale]/login">) {
  const { locale: rawLocale } = await params
  const locale = isLocale(rawLocale) ? rawLocale : fallbackLng
  const { t } = await initTranslations(locale)

  return (
    <Card
      title={<span className="text-xl">{t("auth.login.title")}</span>}
      description={t("auth.login.description")}
    >
      <LoginForm />
    </Card>
  )
}
