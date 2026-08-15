import { PlanFilters } from "@/components/plans/plan-filters"
import { PlanGrid } from "@/components/plans/plan-grid"
import { getAllPlans, getPlansByCategory } from "@/lib/data/insurance-plans"
import { getOptionalSession } from "@/lib/auth/dal"
import { favoritesRepository } from "@/lib/repositories"
import { PLAN_CATEGORY_LABELS, type PlanCategory } from "@/lib/types/plan"

function isPlanCategory(value: string | undefined): value is PlanCategory {
  return Boolean(value) && value! in PLAN_CATEGORY_LABELS
}

export default async function PlansPage(props: PageProps<"/plans">) {
  const searchParams = await props.searchParams
  const rawCategory = searchParams.category
  const categoryParam = Array.isArray(rawCategory) ? rawCategory[0] : rawCategory
  const activeCategory = isPlanCategory(categoryParam) ? categoryParam : undefined

  const session = await getOptionalSession()
  const isAuthenticated = Boolean(session)
  const favoritedPlanIds = session
    ? new Set(await favoritesRepository.listByUser(session.userId))
    : new Set<string>()

  const plans = activeCategory
    ? await getPlansByCategory(activeCategory)
    : await getAllPlans()

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Browse insurance plans</h1>
          <p className="mt-1 text-muted-foreground">
            Filter by category to compare coverage and pricing side by side.
          </p>
        </div>
        <PlanFilters activeCategory={activeCategory} />
      </div>
      <PlanGrid
        plans={plans}
        favoritedPlanIds={favoritedPlanIds}
        isAuthenticated={isAuthenticated}
      />
    </div>
  )
}
