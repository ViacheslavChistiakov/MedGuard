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
}

export const PLAN_CATEGORY_LABELS: Record<PlanCategory, string> = {
  health: "Health",
  dental: "Dental",
  vision: "Vision",
  life: "Life",
  travel: "Travel",
  "critical-illness": "Critical Illness",
}

export const PLAN_TIER_LABELS: Record<PlanTier, string> = {
  basic: "Basic",
  standard: "Standard",
  premium: "Premium",
  elite: "Elite",
}
