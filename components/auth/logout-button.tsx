"use client"

import { useTransition } from "react"
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

  return (
    <Button
      type="button"
      variant={variant}
      disabled={isPending}
      className={className}
      onClick={() => startTransition(() => logoutAction())}
    >
      {isPending ? <Loader2Icon className="animate-spin" /> : <LogOutIcon />}
      Log out
    </Button>
  )
}
