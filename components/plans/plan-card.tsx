"use client"

import { useOptimistic, useTransition } from "react"
import { useTranslation } from "react-i18next"
import { HeartIcon, CheckIcon } from "lucide-react"
import { Card, BuyButton } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LocaleLink } from "@/components/locale-link"
import { BuyPlanDialog } from "@/components/checkout/buy-plan-dialog"
import { useLocalizedPlan } from "@/components/plan-store-provider"
import { toggleFavoriteAction } from "@/lib/actions/favorites-actions"
import type { PlanBadge } from "@/lib/types/plan"
import { cn, formatCurrency } from "@/lib/utils"

interface PlanCardProps {
  planId: string
  initialFavorited: boolean
  isAuthenticated: boolean
}

const BADGE_KEYS: Record<PlanBadge, string> = {
  Popular: "popular",
  "Best Value": "bestValue",
  New: "new",
}

export function PlanCard({ planId, initialFavorited, isAuthenticated }: PlanCardProps) {
  const { t } = useTranslation()
  const plan = useLocalizedPlan(planId)
  const [optimisticFavorited, setOptimisticFavorited] = useOptimistic(
    initialFavorited,
    (_state: boolean, next: boolean) => next
  )
  const [isPending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => {
      setOptimisticFavorited(!optimisticFavorited)
      await toggleFavoriteAction(planId)
    })
  }

  if (!plan) return null

  return (
    <Card
      className="flex h-full flex-col"
      title={
        <>
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary">{t(`plans.categories.${plan.category}`)}</Badge>
            <Badge variant="outline">{t(`plans.tiers.${plan.tier}`)}</Badge>
            {plan.badge && <Badge>{t(`plans.badges.${BADGE_KEYS[plan.badge]}`)}</Badge>}
          </div>
          <span className="text-lg">{plan.name}</span>
        </>
      }
      description={plan.provider}
      action={
        isAuthenticated ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={isPending}
            onClick={handleToggle}
            aria-pressed={optimisticFavorited}
            aria-label={optimisticFavorited ? t("plans.favoriteRemove") : t("plans.favoriteAdd")}
          >
            <HeartIcon
              className={cn(
                "size-4 transition-colors",
                optimisticFavorited && "fill-primary text-primary"
              )}
            />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            render={<LocaleLink href="/login" aria-label={t("plans.loginToFavoriteAria")} />}
          >
            <HeartIcon className="size-4" />
          </Button>
        )
      }
      footer={
        <div className="flex w-full flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-semibold">
                {formatCurrency(plan.monthlyPriceUsd)}
              </span>
              <span className="text-sm text-muted-foreground">{t("plans.perMonth")}</span>
            </div>
            <span className="text-sm text-muted-foreground">★ {plan.rating.toFixed(1)}</span>
          </div>
          {isAuthenticated ? (
            <BuyPlanDialog plan={plan} />
          ) : (
            <BuyButton render={<LocaleLink href="/login" aria-label={t("plans.loginToBuyAria")} />}>
              {t("plans.loginToBuy")}
            </BuyButton>
          )}
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">{plan.description}</p>
        <ul className="flex flex-col gap-1.5 text-sm">
          {plan.coverageHighlights.map((point) => (
            <li key={point} className="flex items-start gap-1.5">
              <CheckIcon className="mt-0.5 size-3.5 shrink-0 text-primary" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}
