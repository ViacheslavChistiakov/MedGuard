import "server-only"
import { cookies } from "next/headers"
import type { SessionPayload } from "@/lib/types/session"
import {
  SESSION_COOKIE_NAME,
  SESSION_DURATION_MS,
  encryptSessionToken,
  decryptSessionToken,
} from "@/lib/auth/jwt"

export async function createSessionCookie(userId: string): Promise<void> {
  const expiresAt = Date.now() + SESSION_DURATION_MS
  const token = await encryptSessionToken({ userId, expiresAt })
  const cookieStore = await cookies()

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(expiresAt),
    path: "/",
  })
}

export async function deleteSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function readSessionFromCookies(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  return decryptSessionToken(token)
}
