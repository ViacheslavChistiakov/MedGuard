"use client"

import { useOptimistic, useTransition } from "react"
import Link from "next/link"
import { HeartIcon, CheckIcon } from "lucide-react"
import { Card, BuyButton } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toggleFavoriteAction } from "@/lib/actions/favorites-actions"
import { PLAN_CATEGORY_LABELS, PLAN_TIER_LABELS, type InsurancePlan } from "@/lib/types/plan"
import { cn, formatCurrency } from "@/lib/utils"

interface PlanCardProps {
  plan: InsurancePlan
  initialFavorited: boolean
  isAuthenticated: boolean
}

export function PlanCard({ plan, initialFavorited, isAuthenticated }: PlanCardProps) {
  const [optimisticFavorited, setOptimisticFavorited] = useOptimistic(
    initialFavorited,
    (_state: boolean, next: boolean) => next
  )
  const [isPending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => {
      setOptimisticFavorited(!optimisticFavorited)
      await toggleFavoriteAction(plan.id)
    })
  }

  return (
    <Card
      className="flex h-full flex-col"
      title={
        <>
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary">{PLAN_CATEGORY_LABELS[plan.category]}</Badge>
            <Badge variant="outline">{PLAN_TIER_LABELS[plan.tier]}</Badge>
            {plan.badge && <Badge>{plan.badge}</Badge>}
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
            aria-label={optimisticFavorited ? "Remove from favorites" : "Add to favorites"}
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
            render={<Link href="/login" aria-label="Log in to favorite this plan" />}
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
              <span className="text-sm text-muted-foreground">/mo</span>
            </div>
            <span className="text-sm text-muted-foreground">★ {plan.rating.toFixed(1)}</span>
          </div>
          {isAuthenticated ? (
            <BuyButton render={<Link href="/checkout" aria-label="Buy this plan" />}>
              Buy Insurance
            </BuyButton>
          ) : (
            <BuyButton render={<Link href="/login" aria-label="Log in to buy this plan" />}>
              Log in to buy
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
