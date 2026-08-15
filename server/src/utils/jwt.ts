import jwt from "jsonwebtoken"

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set")
}

const JWT_SECRET: string = process.env.JWT_SECRET

export type AuthTokenPayload = {
  sub: string
  email: string
}

export function signAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions)
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  return jwt.verify(token, JWT_SECRET) as AuthTokenPayload
}
