"use client"

import { useTranslation } from "react-i18next"
import { LocaleLink } from "@/components/locale-link"
import { cn } from "@/lib/utils"
import { PLAN_CATEGORIES, type PlanCategory } from "@/lib/types/plan"

function chipClasses(active: boolean) {
  return cn(
    "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
    active
      ? "border-primary bg-primary text-primary-foreground"
      : "border-border text-foreground hover:bg-muted"
  )
}

export function PlanFilters({ activeCategory }: { activeCategory?: PlanCategory }) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-wrap gap-2">
      <LocaleLink href="/plans" className={chipClasses(!activeCategory)}>
        {t("plans.allPlans")}
      </LocaleLink>
      {PLAN_CATEGORIES.map((category) => (
        <LocaleLink
          key={category}
          href={`/plans?category=${category}`}
          className={chipClasses(activeCategory === category)}
        >
          {t(`plans.categories.${category}`)}
        </LocaleLink>
      ))}
    </div>
  )
}
