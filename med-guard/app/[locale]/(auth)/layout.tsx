import { ShieldPlusIcon } from "lucide-react"
import { LocaleLink } from "@/components/locale-link"
import initTranslations from "@/i18n"
import { isLocale, fallbackLng } from "@/i18n/settings"

export default async function AuthLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale: rawLocale } = await params
  const locale = isLocale(rawLocale) ? rawLocale : fallbackLng
  const { t } = await initTranslations(locale)

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-8 bg-secondary/40 px-4 py-12">
      <LocaleLink href="/" className="flex items-center gap-2 font-heading text-lg font-semibold">
        <ShieldPlusIcon className="size-5 text-primary" />
        {t("appName")}
      </LocaleLink>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  )
}
