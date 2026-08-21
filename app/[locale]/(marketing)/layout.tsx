import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { isLocale, fallbackLng } from "@/i18n/settings"

export default async function MarketingLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale: rawLocale } = await params
  const locale = isLocale(rawLocale) ? rawLocale : fallbackLng

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader locale={locale} />
      <main className="flex flex-1 flex-col">{children}</main>
      <SiteFooter locale={locale} />
    </div>
  )
}
