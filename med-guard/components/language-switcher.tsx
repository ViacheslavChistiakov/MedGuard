"use client"

import { usePathname, useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { languages, isLocale, fallbackLng, type Locale } from "@/i18n/settings"
import { cn } from "@/lib/utils"

function withLocale(pathname: string, locale: Locale, currentLocale: Locale) {
  if (!pathname.startsWith(`/${currentLocale}`)) return `/${locale}`
  const rest = pathname.slice(`/${currentLocale}`.length)
  return `/${locale}${rest}`
}

export function LanguageSwitcher({ className }: { className?: string }) {
  const { t } = useTranslation()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const search = searchParams.toString()
  const params = useParams<{ locale?: string }>()
  const rawLocale = params.locale ?? ""
  const currentLocale = isLocale(rawLocale) ? rawLocale : fallbackLng

  return (
    <div
      className={cn("flex items-center gap-1 text-sm text-muted-foreground", className)}
      aria-label={t("language.switchLabel")}
    >
      {languages.map((locale, index) => (
        <span key={locale} className="flex items-center gap-1">
          {index > 0 && <span className="text-border">/</span>}
          <Link
            href={`${withLocale(pathname, locale, currentLocale)}${search ? `?${search}` : ""}`}
            className={cn(
              "rounded px-1 py-0.5 font-medium uppercase transition-colors hover:text-foreground",
              locale === currentLocale && "text-foreground"
            )}
            aria-current={locale === currentLocale ? "true" : undefined}
          >
            {locale}
          </Link>
        </span>
      ))}
    </div>
  )
}
