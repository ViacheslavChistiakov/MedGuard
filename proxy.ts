import { NextResponse } from "next/server"
import { auth } from "@/auth"

const PROTECTED_ROUTES = ["/profile"]
const AUTH_ROUTES = ["/login", "/register"]

export const proxy = auth((request) => {
  const { pathname } = request.nextUrl
  const isAuthenticated = Boolean(request.auth)

  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/profile", request.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
