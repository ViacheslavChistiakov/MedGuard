import { ShieldCheckIcon, SparklesIcon, HeartHandshakeIcon, ArrowRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LocaleLink } from "@/components/locale-link"
import { PlanGrid } from "@/components/plans/plan-grid"
import { getAllPlans } from "@/lib/data/insurance-plans"
import { getOptionalSession } from "@/lib/auth/dal"
import { favoritesRepository } from "@/lib/repositories"
import initTranslations from "@/i18n"
import { isLocale, fallbackLng } from "@/i18n/settings"

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale: rawLocale } = await params
  const locale = isLocale(rawLocale) ? rawLocale : fallbackLng
  const { t } = await initTranslations(locale)

  const VALUE_PROPS = [
    {
      icon: ShieldCheckIcon,
      title: t("home.valueProps.vetted.title"),
      description: t("home.valueProps.vetted.description"),
    },
    {
      icon: SparklesIcon,
      title: t("home.valueProps.compare.title"),
      description: t("home.valueProps.compare.description"),
    },
    {
      icon: HeartHandshakeIcon,
      title: t("home.valueProps.favorites.title"),
      description: t("home.valueProps.favorites.description"),
    },
  ]

  const session = await getOptionalSession()
  const isAuthenticated = Boolean(session)
  const favoritedPlanIds = session
    ? new Set(await favoritesRepository.listByUser(session.userId))
    : new Set<string>()

  const allPlans = await getAllPlans()
  const featuredPlans = allPlans.filter((plan) => plan.badge).slice(0, 3)

  return (
    <>
      <section className="border-b border-border/60 bg-gradient-to-b from-secondary/60 to-background">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-20 sm:px-6 sm:py-28">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {t("home.badge")}
          </span>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {t("home.title")}
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">{t("home.subtitle")}</p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" render={<LocaleLink href="/plans" />}>
              {t("home.browsePlans")}
              <ArrowRightIcon />
            </Button>
            <Button size="lg" variant="outline" render={<LocaleLink href="/register" />}>
              {t("home.createAccount")}
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {VALUE_PROPS.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              title={
                <>
                  <Icon className="mb-2 size-6 text-primary" />
                  <span className="block">{title}</span>
                </>
              }
              description={description}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">{t("home.popularPlans.title")}</h2>
            <p className="text-sm text-muted-foreground">{t("home.popularPlans.subtitle")}</p>
          </div>
          <LocaleLink
            href="/plans"
            className="hidden shrink-0 text-sm font-medium text-primary hover:underline sm:block"
          >
            {t("home.popularPlans.viewAll")}
          </LocaleLink>
        </div>
        <PlanGrid
          plans={featuredPlans}
          favoritedPlanIds={favoritedPlanIds}
          isAuthenticated={isAuthenticated}
          emptyMessage={t("plans.emptyMessage")}
        />
      </section>
    </>
  )
}
