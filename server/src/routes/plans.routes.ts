import { Router } from "express"
import { listPlans, getPlanById } from "../controllers/plans.controller.js"

export const plansRouter = Router()

plansRouter.get("/", listPlans)
plansRouter.get("/:id", getPlanById)
