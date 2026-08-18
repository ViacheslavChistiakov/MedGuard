import { Router } from "express"
import {
  register,
  login,
  oauthLogin,
  getAllUsers,
  getUserById,
  getUserPlans,
  getUserFavorites,
  addUserFavorite,
  removeUserFavorite,
  uploadAvatar,
  removeAvatar,
} from "../controllers/auth.controller.js"
import { requireAuth, requireSelf } from "../middleware/auth.middleware.js"
import { requireInternalSecret } from "../middleware/internal.middleware.js"
import { uploadAvatarMiddleware } from "../middleware/upload.middleware.js"

export const authRouter = Router()

authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.post("/oauth", requireInternalSecret, oauthLogin)
authRouter.get("/users", getAllUsers)
authRouter.get("/users/:id", getUserById)
authRouter.get("/users/:id/plans", requireAuth, requireSelf, getUserPlans)
authRouter.get("/users/:id/favorites", requireAuth, requireSelf, getUserFavorites)
authRouter.post("/users/:id/favorites/:planId", requireAuth, requireSelf, addUserFavorite)
authRouter.delete("/users/:id/favorites/:planId", requireAuth, requireSelf, removeUserFavorite)
authRouter.post("/users/:id/avatar", requireAuth, requireSelf, uploadAvatarMiddleware, uploadAvatar)
authRouter.delete("/users/:id/avatar", requireAuth, requireSelf, removeAvatar)

