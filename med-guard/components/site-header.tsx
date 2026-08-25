import { ShieldPlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserMenu } from "@/components/user-menu"
import { MobileNav } from "@/components/mobile-nav"
import { LocaleLink } from "@/components/locale-link"
import { LanguageSwitcher } from "@/components/language-switcher"
import { getCurrentUser } from "@/lib/auth/dal"
import initTranslations from "@/i18n"
import type { Locale } from "@/i18n/settings"

export async function SiteHeader({ locale }: { locale: Locale }) {
  const user = await getCurrentUser()
  const { t } = await initTranslations(locale)

  const NAV_LINKS = [
    { href: "/", label: t("nav.home") },
    { href: "/plans", label: t("nav.plans") },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <LocaleLink href="/" className="flex items-center gap-2 font-heading text-lg font-semibold">
          <ShieldPlusIcon className="size-5 text-primary" />
          {t("appName")}
        </LocaleLink>

        <nav className="hidden items-center gap-6 sm:flex">
          {NAV_LINKS.map((link) => (
            <LocaleLink
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </LocaleLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher className="hidden sm:flex" />
          {user ? (
            <div className="hidden sm:block">
              <UserMenu user={user} />
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button variant="ghost" render={<LocaleLink href="/login" />}>
                {t("nav.login")}
              </Button>
              <Button render={<LocaleLink href="/register" />}>{t("nav.getStarted")}</Button>
            </div>
          )}
          <MobileNav user={user} />
        </div>
      </div>
    </header>
  )
}
