import { Schema, model, type InferSchemaType } from "mongoose"

export const PLAN_CATEGORIES = [
  "health",
  "dental",
  "vision",
  "life",
  "travel",
  "critical-illness",
] as const
export type PlanCategory = (typeof PLAN_CATEGORIES)[number]
const PLAN_TIERS = ["basic", "standard", "premium", "elite"] as const
const PLAN_NETWORK_TYPES = ["HMO", "PPO", "EPO", "POS"] as const
const PLAN_BADGES = ["Popular", "Best Value", "New"] as const

const insurancePlanSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    slug: { type: String, required: true },
    name: { type: String, required: true },
    provider: { type: String, required: true },
    category: { type: String, required: true, enum: PLAN_CATEGORIES },
    tier: { type: String, required: true, enum: PLAN_TIERS },
    monthlyPriceUsd: { type: Number, required: true },
    deductibleUsd: { type: Number, required: true },
    outOfPocketMaxUsd: { type: Number, required: true },
    networkType: { type: String, enum: PLAN_NETWORK_TYPES },
    coverageHighlights: { type: [String], required: true, default: [] },
    rating: { type: Number, required: true },
    badge: { type: String, enum: PLAN_BADGES },
    description: { type: String, required: true },
  },
  {
    // The Atlas collection was created by hand as "Insuarances" (typo and
    // all) - pin the exact name rather than letting Mongoose derive one
    // from the model name, which would look for "insuranceplans" instead.
    collection: "Insuarances",
    versionKey: false,
  }
)

export type InsurancePlanDocument = InferSchemaType<typeof insurancePlanSchema>

export const InsurancePlan = model<InsurancePlanDocument>("InsurancePlan", insurancePlanSchema)
