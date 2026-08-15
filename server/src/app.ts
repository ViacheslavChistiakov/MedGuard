import express, { type Express, type Request, type Response, type NextFunction } from "express"
import cors from "cors"
import morgan from "morgan"
import { plansRouter } from "./routes/plans.routes.js"
import { authRouter } from "./routes/auth.routes.js"

export function createApp(): Express {
  const app = express()

  app.use(cors())
  app.use(express.json())
  app.use(morgan("dev"))

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" })
  })

  app.use("/api/plans", plansRouter)
  app.use("/api/auth", authRouter)

  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" })
  })

  app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  })

  return app
}
