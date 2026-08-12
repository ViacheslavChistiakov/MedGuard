import { PlanGrid } from "@/components/plans/plan-grid"
import { EmptyFavorites } from "@/components/profile/empty-favorites"
import { favoritesRepository } from "@/lib/repositories"
import { getPlanById } from "@/lib/data/insurance-plans"
import type { InsurancePlan } from "@/lib/types/plan"

export async function FavoritePlansList({ userId }: { userId: string }) {
  const favoritePlanIds = await favoritesRepository.listByUser(userId)
  const favoritePlans = favoritePlanIds
    .map((id) => getPlanById(id))
    .filter((plan): plan is InsurancePlan => Boolean(plan))

  if (favoritePlans.length === 0) {
    return <EmptyFavorites />
  }

  return (
    <PlanGrid
      plans={favoritePlans}
      favoritedPlanIds={new Set(favoritePlanIds)}
      isAuthenticated
    />
  )
}
