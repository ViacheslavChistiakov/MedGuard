import "dotenv/config"
import { createApp } from "./app.js"
import { connectDB } from "./config/db.js"

// The Next.js frontend already owns port 3000 (its dev server falls back to
// 3001 if that's busy) - this API server must live on a different port so
// both can run side by side. Override via .env if 4000 is ever taken.
const PORT = Number(process.env.PORT) || 4000

async function main() {
  try {
    await connectDB()
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error)
    process.exit(1)
  }

  const app = createApp()

  app.listen(PORT, () => {
    console.log(`MedGuard API server listening on http://localhost:${PORT}`)
  })
}

main()
