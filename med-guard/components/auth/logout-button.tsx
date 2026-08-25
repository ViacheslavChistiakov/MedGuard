"use client"

import { useTransition } from "react"
import { useTranslation } from "react-i18next"
import { LogOutIcon, Loader2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logoutAction } from "@/lib/actions/auth-actions"

export function LogoutButton({
  className,
  variant = "outline",
}: {
  className?: string
  variant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const [isPending, startTransition] = useTransition()
  const { t } = useTranslation()

  return (
    <Button
      type="button"
      variant={variant}
      disabled={isPending}
      className={className}
      onClick={() => startTransition(() => logoutAction())}
    >
      {isPending ? <Loader2Icon className="animate-spin" /> : <LogOutIcon />}
      {t("nav.logout")}
    </Button>
  )
}
