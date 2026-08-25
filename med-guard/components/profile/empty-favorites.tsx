"use client"

import { useTranslation } from "react-i18next"
import { HeartIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LocaleLink } from "@/components/locale-link"

export function EmptyFavorites() {
  const { t } = useTranslation()

  return (
    <Card>
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <HeartIcon className="size-8 text-muted-foreground" />
        <div className="flex flex-col gap-1">
          <p className="font-medium">{t("profile.empty.title")}</p>
          <p className="text-sm text-muted-foreground">{t("profile.empty.description")}</p>
        </div>
        <Button render={<LocaleLink href="/plans" />} className="mt-2">
          {t("profile.empty.browsePlans")}
        </Button>
      </div>
    </Card>
  )
}
