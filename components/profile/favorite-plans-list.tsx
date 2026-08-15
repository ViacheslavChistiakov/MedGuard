import { PlanGrid } from "@/components/plans/plan-grid"
import { EmptyFavorites } from "@/components/profile/empty-favorites"
import { favoritesRepository } from "@/lib/repositories"
import { getAllPlans } from "@/lib/data/insurance-plans"

export async function FavoritePlansList({ userId }: { userId: string }) {
  const favoritePlanIds = await favoritesRepository.listByUser(userId)
  const favoritedIdSet = new Set(favoritePlanIds)

  // Fetch the full catalog once and filter in memory rather than issuing one
  // API request per favorited plan id.
  const allPlans = await getAllPlans()
  const favoritePlans = allPlans.filter((plan) => favoritedIdSet.has(plan.id))

  if (favoritePlans.length === 0) {
    return <EmptyFavorites />
  }

  return <PlanGrid plans={favoritePlans} favoritedPlanIds={favoritedIdSet} isAuthenticated />
}
