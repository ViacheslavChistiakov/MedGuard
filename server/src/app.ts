import path from "node:path"
import { fileURLToPath } from "node:url"
import express, { type Express, type Request, type Response, type NextFunction } from "express"
import cors from "cors"
import morgan from "morgan"
import { MulterError } from "multer"
import { plansRouter } from "./routes/plans.routes.js"
import { authRouter } from "./routes/auth.routes.js"
import { ordersRouter } from "./routes/orders.routes.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export function createApp(): Express {
  const app = express()

  app.use(cors())
  app.use(express.json())
  app.use(morgan("dev"))

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" })
  })

  app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")))

  app.use("/api/plans", plansRouter)
  app.use("/api/auth", authRouter)
  app.use("/api/orders", ordersRouter)

  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" })
  })

  app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (error instanceof MulterError) {
      const message =
        error.code === "LIMIT_FILE_SIZE"
          ? "Avatar image must be 5MB or smaller"
          : error.code === "LIMIT_UNEXPECTED_FILE"
            ? "Avatar must be a JPEG, PNG, or WebP image"
            : error.message
      res.status(400).json({ error: message })
      return
    }

    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  })

  return app
}
