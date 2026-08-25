import { ShieldCheckIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { LocaleLink } from "@/components/locale-link"
import initTranslations from "@/i18n"
import type { Locale } from "@/i18n/settings"
import type { OrderDTO } from "@/lib/repositories/types"
import type { InsurancePlan } from "@/lib/types/plan"
import { formatCurrency } from "@/lib/utils"

const DATE_LOCALES: Record<Locale, string> = { en: "en-US", ru: "ru-RU" }
const MS_PER_DAY = 24 * 60 * 60 * 1000

// Orders are one-off purchases (no recurring billing yet), but every plan is
// sold as "monthly" (see the order description built in orders.controller.ts)
// - so a purchase's coverage period is modeled as exactly one calendar month
// from the order date.
function addOneMonth(date: Date): Date {
  const result = new Date(date)
  result.setMonth(result.getMonth() + 1)
  return result
}

function formatDate(date: Date, locale: Locale): string {
  return date.toLocaleDateString(DATE_LOCALES[locale], {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export async function CurrentPlanCard({
  order,
  plan,
  locale,
}: {
  order: OrderDTO | null
  plan: InsurancePlan | null
  locale: Locale
}) {
  const { t } = await initTranslations(locale)

  if (!order || !plan) {
    return (
      <Card>
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <ShieldCheckIcon className="size-8 text-muted-foreground" />
          <div className="flex flex-col gap-1">
            <p className="font-medium">{t("profile.currentPlan.empty.title")}</p>
            <p className="text-sm text-muted-foreground">
              {t("profile.currentPlan.empty.description")}
            </p>
          </div>
          <Button render={<LocaleLink href="/plans" />} className="mt-2">
            {t("profile.currentPlan.empty.browsePlans")}
          </Button>
        </div>
      </Card>
    )
  }

  const startDate = new Date(order.createdAt)
  const expiresDate = addOneMonth(startDate)
  const now = new Date()

  const totalMs = expiresDate.getTime() - startDate.getTime()
  const elapsedMs = now.getTime() - startDate.getTime()
  const progressPercent = Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100))
  const daysLeft = Math.max(0, Math.ceil((expiresDate.getTime() - now.getTime()) / MS_PER_DAY))
  const isExpired = now >= expiresDate

  return (
    <Card
      title={
        <>
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary">{t(`plans.categories.${plan.category}`)}</Badge>
            <Badge variant="outline">{t(`plans.tiers.${plan.tier}`)}</Badge>
            {isExpired && <Badge variant="destructive">{t("profile.currentPlan.expired")}</Badge>}
          </div>
          <span className="text-lg">{plan.name}</span>
        </>
      }
      description={plan.provider}
    >
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-semibold">{formatCurrency(plan.monthlyPriceUsd)}</span>
            <span className="text-sm text-muted-foreground">{t("plans.perMonth")}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {t("profile.currentPlan.activeSince", { date: formatDate(startDate, locale) })}
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <Progress value={progressPercent} />
          <p className="text-xs text-muted-foreground">
            {isExpired
              ? t("profile.currentPlan.expired")
              : t("profile.currentPlan.daysLeft", { count: daysLeft })}
            {" · "}
            {t("profile.currentPlan.expiresOn", { date: formatDate(expiresDate, locale) })}
          </p>
        </div>
      </div>
    </Card>
  )
}
