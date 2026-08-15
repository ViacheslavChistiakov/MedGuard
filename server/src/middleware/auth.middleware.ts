import type { Request, Response, NextFunction } from "express"
import { verifyAuthToken, type AuthTokenPayload } from "../utils/jwt.js"

export interface AuthenticatedRequest extends Request {
  auth?: AuthTokenPayload
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid Authorization header" })
    return
  }

  const token = authHeader.slice("Bearer ".length)

  try {
    req.auth = verifyAuthToken(token)
    next()
  } catch {
    res.status(401).json({ error: "Invalid or expired token" })
  }
}

export function requireSelf(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (req.auth?.sub !== req.params.id) {
    res.status(403).json({ error: "You can only access your own resource" })
    return
  }

  next()
}
