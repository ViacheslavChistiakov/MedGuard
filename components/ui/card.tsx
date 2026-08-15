import * as React from "react"
import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CardProps extends Omit<React.ComponentProps<"div">, "title"> {
  size?: "default" | "sm"
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  footer?: React.ReactNode
}

const Card: React.FC<CardProps> = ({
  className,
  size = "default",
  title,
  description,
  action,
  footer,
  children,
  ...props
}) => {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl bg-card py-(--card-spacing) text-sm text-card-foreground ring-1 ring-foreground/10 [--card-spacing:--spacing(4)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        className
      )}
      {...props}
    >
      {(title || description || action) && (
        <div
          data-slot="card-header"
          className="group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)"
        >
          {title && (
            <div
              data-slot="card-title"
              className="font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm"
            >
              {title}
            </div>
          )}
          {description && (
            <div
              data-slot="card-description"
              className="text-sm text-muted-foreground"
            >
              {description}
            </div>
          )}
          {action && (
            <div
              data-slot="card-action"
              className="col-start-2 row-span-2 row-start-1 self-start justify-self-end"
            >
              {action}
            </div>
          )}
        </div>
      )}
      {children && (
        <div data-slot="card-content" className="flex-1 px-(--card-spacing)">
          {children}
        </div>
      )}
      {footer && (
        <div
          data-slot="card-footer"
          className="flex items-center rounded-b-xl border-t bg-muted/50 p-(--card-spacing)"
        >
          {footer}
        </div>
      )}
    </div>
  )
}

interface BuyButtonProps extends Omit<React.ComponentProps<typeof Button>, "children"> {
  loading?: boolean
  children?: React.ReactNode
}

const BuyButton: React.FC<BuyButtonProps> = ({
  loading = false,
  disabled,
  className,
  children = "Buy Insurance",
  ...props
}) => {
  return (
    <Button
      type="button"
      size="lg"
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn(
        "w-full gap-2 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/20 active:translate-y-0 active:shadow-sm",
        className
      )}
      {...props}
    >
      {loading && <Loader2Icon className="size-4 animate-spin" />}
      {loading ? "Processing…" : children}
    </Button>
  )
}

export { Card, BuyButton }
export type { CardProps, BuyButtonProps }
