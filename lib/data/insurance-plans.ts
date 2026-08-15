import "server-only"
import { cache } from "react"
import { apiClient } from "@/lib/api/client"
import type { InsurancePlan, PlanCategory } from "@/lib/types/plan"

export const getAllPlans = cache(async (): Promise<InsurancePlan[]> => {
  const { data } = await apiClient.get<InsurancePlan[]>("/api/plans")
  return data
})

export const getPlansByCategory = cache(
  async (category: PlanCategory): Promise<InsurancePlan[]> => {
    const { data } = await apiClient.get<InsurancePlan[]>("/api/plans", {
      params: { category },
    })
    return data
  }
)
