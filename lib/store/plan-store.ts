import { createStore } from "zustand/vanilla"
import type { InsurancePlan } from "@/lib/types/plan"

export interface PlanState {
  plansById: Record<string, InsurancePlan>
}

export type PlanStore = ReturnType<typeof createPlanStore>

export function createPlanStore(initialPlans: InsurancePlan[]) {
  const plansById = Object.fromEntries(initialPlans.map((plan) => [plan.id, plan]))
  return createStore<PlanState>()(() => ({ plansById }))
}
