import { PlanFilters } from "@/components/plans/plan-filters"
import { PlanGrid } from "@/components/plans/plan-grid"
import { getAllPlans, getPlansByCategory } from "@/lib/data/insurance-plans"
import { getOptionalSession } from "@/lib/auth/dal"
import { favoritesRepository } from "@/lib/repositories"
import { PLAN_CATEGORIES, type PlanCategory } from "@/lib/types/plan"
import initTranslations from "@/i18n"
import { isLocale, fallbackLng } from "@/i18n/settings"
import type { Metadata } from "next"

function isPlanCategory(value: string | undefined): value is PlanCategory {
  return Boolean(value) && (PLAN_CATEGORIES as readonly string[]).includes(value!)
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/plans">): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale = isLocale(rawLocale) ? rawLocale : fallbackLng
  const { t } = await initTranslations(locale)
  return { title: t("plans.metaTitle") }
}

export default async function PlansPage(props: PageProps<"/[locale]/plans">) {
  const { locale: rawLocale } = await props.params
  const locale = isLocale(rawLocale) ? rawLocale : fallbackLng
  const { t } = await initTranslations(locale)

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
          <h1 className="text-3xl font-semibold">{t("plans.title")}</h1>
          <p className="mt-1 text-muted-foreground">{t("plans.subtitle")}</p>
        </div>
        <PlanFilters activeCategory={activeCategory} />
      </div>
      <PlanGrid
        plans={plans}
        favoritedPlanIds={favoritedPlanIds}
        isAuthenticated={isAuthenticated}
        emptyMessage={t("plans.emptyMessage")}
      />
    </div>
  )
}
