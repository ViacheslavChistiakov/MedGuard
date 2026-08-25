"use client"

import { useTranslation } from "react-i18next"
import { googleSignInAction } from "@/lib/actions/auth-actions"
import { Button } from "@/components/ui/button"

export function GoogleSignInButton() {
  const { t } = useTranslation()

  return (
    <form action={googleSignInAction}>
      <Button type="submit" variant="outline" className="w-full">
        {t("auth.continueWithGoogle")}
      </Button>
    </form>
  )
}
