import type { Request, Response, NextFunction } from "express"

if (!process.env.INTERNAL_API_SECRET) {
  throw new Error("INTERNAL_API_SECRET environment variable is not set")
}

const INTERNAL_API_SECRET: string = process.env.INTERNAL_API_SECRET

/**
 * Restricts a route to server-to-server calls from our own Next.js app
 * (e.g. the OAuth login bridge) rather than public clients.
 */
export function requireInternalSecret(req: Request, res: Response, next: NextFunction) {
  if (req.headers["x-internal-secret"] !== INTERNAL_API_SECRET) {
    res.status(401).json({ error: "Unauthorized" })
    return
  }

  next()
}
