import { PlanGrid } from "@/components/plans/plan-grid"
import { EmptyFavorites } from "@/components/profile/empty-favorites"
import { favoritesRepository } from "@/lib/repositories"
import { getAllPlans } from "@/lib/data/insurance-plans"
import initTranslations from "@/i18n"
import type { Locale } from "@/i18n/settings"

export async function FavoritePlansList({ userId, locale }: { userId: string; locale: Locale }) {
  const favoritePlanIds = await favoritesRepository.listByUser(userId)
  const favoritedIdSet = new Set(favoritePlanIds)

  // Fetch the full catalog once and filter in memory rather than issuing one
  // API request per favorited plan id.
  const allPlans = await getAllPlans()
  const favoritePlans = allPlans.filter((plan) => favoritedIdSet.has(plan.id))

  if (favoritePlans.length === 0) {
    return <EmptyFavorites />
  }

  const { t } = await initTranslations(locale)

  return (
    <PlanGrid
      plans={favoritePlans}
      favoritedPlanIds={favoritedIdSet}
      isAuthenticated
      emptyMessage={t("plans.emptyMessage")}
    />
  )
}
