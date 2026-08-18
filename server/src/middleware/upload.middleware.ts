import path from "node:path"
import fs from "node:fs"
import { fileURLToPath } from "node:url"
import multer from "multer"
import type { Request } from "express"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const AVATARS_DIR = path.join(__dirname, "..", "..", "uploads", "avatars")
fs.mkdirSync(AVATARS_DIR, { recursive: true })

const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
}

const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, AVATARS_DIR)
  },
  filename: (req: Request, file, callback) => {
    const extension = ALLOWED_MIME_TYPES[file.mimetype]
    const userId = req.params.id
    callback(null, `${userId}-${Date.now()}${extension}`)
  },
})

export const uploadAvatarMiddleware = multer({
  storage,
  limits: { fileSize: MAX_AVATAR_SIZE_BYTES },
  fileFilter: (_req, file, callback) => {
    if (!ALLOWED_MIME_TYPES[file.mimetype]) {
      callback(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "avatar"))
      return
    }
    callback(null, true)
  },
}).single("avatar")
