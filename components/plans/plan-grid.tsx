import { PlanCard } from "@/components/plans/plan-card"
import type { InsurancePlan } from "@/lib/types/plan"

interface PlanGridProps {
  plans: InsurancePlan[]
  favoritedPlanIds: Set<string>
  isAuthenticated: boolean
  emptyMessage?: string
}

export function PlanGrid({
  plans,
  favoritedPlanIds,
  isAuthenticated,
  emptyMessage = "No plans match these filters yet.",
}: PlanGridProps) {
  if (plans.length === 0) {
    return <p className="py-12 text-center text-muted-foreground">{emptyMessage}</p>
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          initialFavorited={favoritedPlanIds.has(plan.id)}
          isAuthenticated={isAuthenticated}
        />
      ))}
    </div>
  )
}
