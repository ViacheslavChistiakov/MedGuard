import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/auth"
import acceptLanguage from "accept-language"
import { languages, fallbackLng, cookieName, type Locale } from "@/i18n/settings"

acceptLanguage.languages([...languages])

const PROTECTED_ROUTES = ["/profile"]
const AUTH_ROUTES = ["/login", "/register"]

function localeOf(pathname: string): Locale | undefined {
  return languages.find((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`))
}

function detectLocale(request: NextRequest): Locale {
  const cookieValue = request.cookies.get(cookieName)?.value
  if (cookieValue) {
    const fromCookie = acceptLanguage.get(cookieValue)
    if (fromCookie) return fromCookie as Locale
  }
  const headerValue = request.headers.get("Accept-Language")
  if (headerValue) {
    const fromHeader = acceptLanguage.get(headerValue)
    if (fromHeader) return fromHeader as Locale
  }
  return fallbackLng
}

export const proxy = auth((request) => {
  const { pathname } = request.nextUrl

  const currentLocale = localeOf(pathname)
  if (!currentLocale) {
    const locale = detectLocale(request)
    return NextResponse.redirect(
      new URL(`/${locale}${pathname === "/" ? "" : pathname}${request.nextUrl.search}`, request.url)
    )
  }

  const localeFreePath = pathname.slice(`/${currentLocale}`.length) || "/"
  const isAuthenticated = Boolean(request.auth)
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => localeFreePath.startsWith(route))
  const isAuthRoute = AUTH_ROUTES.some((route) => localeFreePath.startsWith(route))

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL(`/${currentLocale}/login`, request.url))
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL(`/${currentLocale}/profile`, request.url))
  }

  const response = NextResponse.next()
  response.cookies.set(cookieName, currentLocale)
  return response
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|api|favicon.ico).*)"],
}
