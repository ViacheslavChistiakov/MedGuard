import type { Request, Response, NextFunction } from "express"
import { InsurancePlan, PLAN_CATEGORIES, type PlanCategory } from "../models/insurance-plan.model.js"

function isPlanCategory(value: unknown): value is PlanCategory {
  return typeof value === "string" && (PLAN_CATEGORIES as readonly string[]).includes(value)
}

export async function listPlans(req: Request, res: Response, next: NextFunction) {
  try {
    const { category } = req.query
    const filter = isPlanCategory(category) ? { category } : {}
    const plans = await InsurancePlan.find(filter).select("-_id").lean()
    res.json(plans)
  } catch (error) {
    next(error)
  }
}

export async function getPlanById(req: Request, res: Response, next: NextFunction) {
  try {
    const plan = await InsurancePlan.findOne({ id: req.params.id }).select("-_id").lean()

    if (!plan) {
      res.status(404).json({ error: "Plan not found" })
      return
    }

    res.json(plan)
  } catch (error) {
    next(error)
  }
}
