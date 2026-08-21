export type PlanCategory =
  | "health"
  | "dental"
  | "vision"
  | "life"
  | "travel"
  | "critical-illness"

export type PlanTier = "basic" | "standard" | "premium" | "elite"

export type PlanNetworkType = "HMO" | "PPO" | "EPO" | "POS"

export type PlanBadge = "Popular" | "Best Value" | "New"

export interface InsurancePlan {
  id: string
  slug: string
  name: string
  provider: string
  category: PlanCategory
  tier: PlanTier
  monthlyPriceUsd: number
  deductibleUsd: number
  outOfPocketMaxUsd: number
  networkType?: PlanNetworkType
  coverageHighlights: string[]
  rating: number
  badge?: PlanBadge
  description: string
  translations?: {
    ru?: {
      description?: string
      coverageHighlights?: string[]
    }
  }
}

export const PLAN_CATEGORIES: PlanCategory[] = [
  "health",
  "dental",
  "vision",
  "life",
  "travel",
  "critical-illness",
]

export const PLAN_TIERS: PlanTier[] = ["basic", "standard", "premium", "elite"]
