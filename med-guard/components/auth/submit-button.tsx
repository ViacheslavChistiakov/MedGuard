"use client"

import { useFormStatus } from "react-dom"
import { Loader2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SubmitButton({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className={className} {...props}>
      {pending && <Loader2Icon className="animate-spin" />}
      {children}
    </Button>
  )
}
