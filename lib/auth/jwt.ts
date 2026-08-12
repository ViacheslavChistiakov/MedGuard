import "server-only"
import { SignJWT, jwtVerify } from "jose"
import type { SessionPayload } from "@/lib/types/session"

export const SESSION_COOKIE_NAME = "session"
export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set")
}

const encodedSecret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function encryptSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ userId: payload.userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(payload.expiresAt / 1000))
    .sign(encodedSecret)
}

export async function decryptSessionToken(
  token: string | undefined
): Promise<SessionPayload | null> {
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, encodedSecret, { algorithms: ["HS256"] })
    if (typeof payload.userId !== "string" || typeof payload.exp !== "number") return null
    return { userId: payload.userId, expiresAt: payload.exp * 1000 }
  } catch {
    return null
  }
}
