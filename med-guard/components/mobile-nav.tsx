"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { MenuIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { LocaleLink } from "@/components/locale-link"
import { LanguageSwitcher } from "@/components/language-switcher"
import { LogoutButton } from "@/components/auth/logout-button"
import type { UserDTO } from "@/lib/types/user"

export function MobileNav({ user }: { user: UserDTO | null }) {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()

  const NAV_LINKS = [
    { href: "/", label: t("nav.home") },
    { href: "/plans", label: t("nav.plans") },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon" className="sm:hidden" />}>
        <MenuIcon />
        <span className="sr-only">{t("nav.openMenu")}</span>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>{t("appName")}</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          {NAV_LINKS.map((link) => (
            <LocaleLink
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2 text-sm font-medium hover:bg-muted"
            >
              {link.label}
            </LocaleLink>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-2 p-4">
          <LanguageSwitcher className="mb-2" />
          {user ? (
            <>
              <LocaleLink
                href="/profile"
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2 text-sm font-medium hover:bg-muted"
              >
                {t("nav.profile")}
              </LocaleLink>
              <LogoutButton className="w-full" />
            </>
          ) : (
            <>
              <Button
                variant="outline"
                render={<LocaleLink href="/login" onClick={() => setOpen(false)} />}
              >
                {t("nav.login")}
              </Button>
              <Button render={<LocaleLink href="/register" onClick={() => setOpen(false)} />}>
                {t("nav.getStarted")}
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
