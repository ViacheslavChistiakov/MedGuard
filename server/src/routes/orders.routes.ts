import { Router } from "express"
import {
  createOrder,
  getCurrentOrders,
  getOrderByInvId,
  markOrderPaid,
} from "../controllers/orders.controller.js"
import { requireAuth } from "../middleware/auth.middleware.js"
import { requireInternalSecret } from "../middleware/internal.middleware.js"

export const ordersRouter = Router()

ordersRouter.post("/", requireAuth, createOrder)
ordersRouter.get("/current", requireAuth, getCurrentOrders)
ordersRouter.get("/:invId", requireAuth, getOrderByInvId)
ordersRouter.patch("/:invId/paid", requireInternalSecret, markOrderPaid)
