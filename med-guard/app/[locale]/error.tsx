"use client"

import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { TriangleAlertIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LocaleLink } from "@/components/locale-link"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { t } = useTranslation()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <TriangleAlertIcon className="size-10 text-destructive" />
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">{t("error.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("error.description")}</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={reset}>
          {t("error.tryAgain")}
        </Button>
        <Button render={<LocaleLink href="/" />}>{t("error.goHome")}</Button>
      </div>
    </div>
  )
}
