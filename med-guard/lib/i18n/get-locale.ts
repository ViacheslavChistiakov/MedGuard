import "server-only"
import { cookies, headers } from "next/headers"
import { cookieName, fallbackLng, isLocale, type Locale } from "@/i18n/settings"

// For code that redirects (server actions, the auth DAL) and has no route
// params to read the locale from. Proxy keeps this cookie in sync with the
// current URL on every request, and falls back to the referer path so the
// very first navigation (before the cookie exists) still resolves correctly.
export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get(cookieName)?.value
  if (cookieLocale && isLocale(cookieLocale)) return cookieLocale

  const headerStore = await headers()
  const referer = headerStore.get("referer")
  if (referer) {
    const segment = new URL(referer).pathname.split("/")[1]
    if (segment && isLocale(segment)) return segment
  }

  return fallbackLng
}
