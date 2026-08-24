import type { Request, Response, NextFunction } from "express"
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js"
import { Order, type OrderDocument } from "../models/order.model.js"
import { getNextSequence } from "../models/counter.model.js"
import { InsurancePlan } from "../models/insurance-plan.model.js"
import { User } from "../models/user.model.js"
import { CreateOrderBodySchema } from "../validation/order-schemas.js"

// Structural (not HydratedDocument<OrderDocument>) so it also accepts the
// plain objects an aggregation pipeline returns, not just Mongoose docs.
interface OrderLike {
  invId: number
  userId: string
  planId: string
  amount: number
  description: string
  status: OrderDocument["status"]
  createdAt: Date
}

function toSafeOrder(order: OrderLike) {
  return {
    invId: order.invId,
    userId: order.userId,
    planId: order.planId,
    amount: order.amount,
    description: order.description,
    status: order.status,
    createdAt: order.createdAt.toISOString(),
  }
}

export async function createOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const result = CreateOrderBodySchema.safeParse(req.body)
    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten().fieldErrors })
      return
    }

    const userId = req.auth!.sub
    const plan = await InsurancePlan.findOne({ id: result.data.planId }).lean()
    if (!plan) {
      res.status(404).json({ error: "Plan not found" })
      return
    }

    const invId = await getNextSequence("orderInvId")
    const order = await Order.create({
      invId,
      userId,
      planId: plan.id,
      amount: plan.monthlyPriceUsd,
      description: `${plan.name} — monthly plan`,
      status: "pending",
    })

    res.status(201).json(toSafeOrder(order))
  } catch (error) {
    next(error)
  }
}

// "Current plans" = User.currentPlanIds is the authoritative list of which
// plans are current (updated the moment a payment is confirmed - see
// markOrderPaid below); for each id in it, the matching most-recent paid
// Order is looked up just for its createdAt date (the progress bar needs
// a purchase date, which a plain string[] can't hold on its own).
export async function getCurrentOrders(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.auth!.sub).lean()
    if (!user || user.currentPlanIds.length === 0) {
      res.status(200).json([])
      return
    }

    const grouped = await Order.aggregate<{ doc: OrderLike }>([
      { $match: { userId: req.auth!.sub, status: "paid", planId: { $in: user.currentPlanIds } } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: "$planId", doc: { $first: "$$ROOT" } } },
      { $sort: { "doc.createdAt": -1 } },
    ])

    res.status(200).json(grouped.map((entry) => toSafeOrder(entry.doc)))
  } catch (error) {
    next(error)
  }
}

export async function getOrderByInvId(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const invId = Number(req.params.invId)
    if (!Number.isInteger(invId)) {
      res.status(400).json({ error: "Invalid invId" })
      return
    }

    const order = await Order.findOne({ invId })
    if (!order) {
      res.status(404).json({ error: "Order not found" })
      return
    }

    if (order.userId !== req.auth!.sub) {
      res.status(403).json({ error: "You can only access your own orders" })
      return
    }

    res.status(200).json(toSafeOrder(order))
  } catch (error) {
    next(error)
  }
}

// Called by our Next.js server after it re-verifies a YooKassa payment
// server-to-server, to mark the matching order paid. Only reachable with
// the internal secret (see orders.routes.ts).
export async function markOrderPaid(req: Request, res: Response, next: NextFunction) {
  try {
    const invId = Number(req.params.invId)
    if (!Number.isInteger(invId)) {
      res.status(400).json({ error: "Invalid invId" })
      return
    }

    const order = await Order.findOne({ invId })
    if (!order) {
      res.status(404).json({ error: "Order not found" })
      return
    }

    if (order.status === "pending") {
      order.status = "paid"
      order.yookassaPayload = req.body
      await order.save()
      await User.updateOne({ _id: order.userId }, { $addToSet: { currentPlanIds: order.planId } })
    }

    res.status(200).json(toSafeOrder(order))
  } catch (error) {
    next(error)
  }
}
