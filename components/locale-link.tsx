"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import type { ComponentProps } from "react"
import { fallbackLng, isLocale } from "@/i18n/settings"

// Wraps next/link so every in-app href picks up the current URL's locale
// segment automatically, without threading `locale` through every component.
export function LocaleLink({ href, ...props }: ComponentProps<typeof Link>) {
  const params = useParams<{ locale?: string }>()
  const rawLocale = params.locale ?? ""
  const locale = isLocale(rawLocale) ? rawLocale : fallbackLng

  const resolvedHref =
    typeof href === "string" && href.startsWith("/")
      ? `/${locale}${href === "/" ? "" : href}`
      : href

  return <Link href={resolvedHref} {...props} />
}
