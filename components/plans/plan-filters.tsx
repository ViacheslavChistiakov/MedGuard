import Link from "next/link"
import { cn } from "@/lib/utils"
import { PLAN_CATEGORY_LABELS, type PlanCategory } from "@/lib/types/plan"

const CATEGORIES = Object.keys(PLAN_CATEGORY_LABELS) as PlanCategory[]

function chipClasses(active: boolean) {
  return cn(
    "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
    active
      ? "border-primary bg-primary text-primary-foreground"
      : "border-border text-foreground hover:bg-muted"
  )
}

export function PlanFilters({ activeCategory }: { activeCategory?: PlanCategory }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link href="/plans" className={chipClasses(!activeCategory)}>
        All plans
      </Link>
      {CATEGORIES.map((category) => (
        <Link
          key={category}
          href={`/plans?category=${category}`}
          className={chipClasses(activeCategory === category)}
        >
          {PLAN_CATEGORY_LABELS[category]}
        </Link>
      ))}
    </div>
  )
}
