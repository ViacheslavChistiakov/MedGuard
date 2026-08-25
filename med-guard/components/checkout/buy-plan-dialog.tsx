"use client"

import { useParams } from "next/navigation"
import { useTranslation } from "react-i18next"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BuyButton } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { initiatePayment } from "@/lib/actions/payment-actions"
import { isLocale, fallbackLng } from "@/i18n/settings"
import { formatCurrency } from "@/lib/utils"
import type { InsurancePlan } from "@/lib/types/plan"

export function BuyPlanDialog({ plan }: { plan: InsurancePlan }) {
  const { t } = useTranslation()
  const { locale: rawLocale } = useParams<{ locale?: string }>()
  const locale = isLocale(rawLocale ?? "") ? (rawLocale as string) : fallbackLng
  const payWithYookassa = initiatePayment.bind(null, plan.id, locale)

  return (
    <Dialog>
      <DialogTrigger render={<BuyButton aria-label={t("plans.buyThisPlanAria")} />}>
        {t("plans.buyInsurance")}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("checkout.title")}</DialogTitle>
          <DialogDescription>{t("checkout.subtitle")}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <span className="font-medium">{plan.name}</span>
            <span className="text-lg font-semibold">
              {formatCurrency(plan.monthlyPriceUsd)}
              <span className="text-sm text-muted-foreground"> {t("plans.perMonth")}</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{plan.description}</p>
        </div>
        <DialogFooter>
          <form action={payWithYookassa} className="w-full">
            <Button type="submit" size="lg" className="w-full">
              {t("checkout.payWithYookassa")}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
