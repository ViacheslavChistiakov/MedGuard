"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useParams } from "next/navigation"
import { useStore } from "zustand"
import { createPlanStore, type PlanStore, type PlanState } from "@/lib/store/plan-store"
import type { InsurancePlan } from "@/lib/types/plan"
import { fallbackLng, isLocale } from "@/i18n/settings"

const PlanStoreContext = createContext<PlanStore | null>(null)

export function PlanStoreProvider({
  plans,
  children,
}: {
  plans: InsurancePlan[]
  children: ReactNode
}) {
  const [store] = useState(() => createPlanStore(plans))

  return <PlanStoreContext.Provider value={store}>{children}</PlanStoreContext.Provider>
}

export function usePlanStore<T>(selector: (state: PlanState) => T): T {
  const store = useContext(PlanStoreContext)
  if (!store) {
    throw new Error("usePlanStore must be used within a PlanStoreProvider")
  }
  return useStore(store, selector)
}

// The store holds every plan with both English and (where translated)
// Russian content side by side; this resolves the one to display from the
// current URL locale, falling back to English when a translation is missing.
export function useLocalizedPlan(planId: string): InsurancePlan | undefined {
  const plan = usePlanStore((state) => state.plansById[planId])
  const params = useParams<{ locale?: string }>()
  const rawLocale = params.locale ?? ""
  const locale = isLocale(rawLocale) ? rawLocale : fallbackLng

  if (!plan) return undefined
  if (locale !== "ru" || !plan.translations?.ru) return plan

  return {
    ...plan,
    description: plan.translations.ru.description ?? plan.description,
    coverageHighlights: plan.translations.ru.coverageHighlights ?? plan.coverageHighlights,
  }
}
