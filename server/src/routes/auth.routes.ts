import { Router } from "express"
import {
  register,
  login,
  getAllUsers,
  getUserById,
  getUserPlans,
  getUserFavorites,
  addUserFavorite,
  removeUserFavorite,
} from "../controllers/auth.controller.js"
import { requireAuth, requireSelf } from "../middleware/auth.middleware.js"

export const authRouter = Router()

authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.get("/users", getAllUsers)
authRouter.get("/users/:id", getUserById)
authRouter.get("/users/:id/plans", requireAuth, requireSelf, getUserPlans)
authRouter.get("/users/:id/favorites", requireAuth, requireSelf, getUserFavorites)
authRouter.post("/users/:id/favorites/:planId", requireAuth, requireSelf, addUserFavorite)
authRouter.delete("/users/:id/favorites/:planId", requireAuth, requireSelf, removeUserFavorite)

