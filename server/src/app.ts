import express, { type Express } from "express"
import cors from "cors"
import morgan from "morgan"

export function createApp(): Express {
  const app = express()

  app.use(cors())
  app.use(express.json())
  app.use(morgan("dev"))

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" })
  })

  return app
}
