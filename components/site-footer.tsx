import { LocaleLink } from "@/components/locale-link"
import initTranslations from "@/i18n"
import type { Locale } from "@/i18n/settings"

export async function SiteFooter({ locale }: { locale: Locale }) {
  const { t } = await initTranslations(locale)

  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
        <div className="flex gap-4">
          <LocaleLink href="/plans" className="hover:text-foreground">
            {t("footer.browsePlans")}
          </LocaleLink>
          <LocaleLink href="/register" className="hover:text-foreground">
            {t("footer.getStarted")}
          </LocaleLink>
        </div>
      </div>
    </footer>
  )
}
