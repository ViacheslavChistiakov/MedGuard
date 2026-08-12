import Link from "next/link"
import { ShieldCheckIcon, SparklesIcon, HeartHandshakeIcon, ArrowRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PlanGrid } from "@/components/plans/plan-grid"
import { getAllPlans } from "@/lib/data/insurance-plans"
import { getOptionalSession } from "@/lib/auth/dal"
import { favoritesRepository } from "@/lib/repositories"

const VALUE_PROPS = [
  {
    icon: ShieldCheckIcon,
    title: "Vetted coverage",
    description: "Every plan is reviewed for clear terms, so you know exactly what's covered.",
  },
  {
    icon: SparklesIcon,
    title: "Compare in minutes",
    description: "Filter by category and tier to find the plan that fits your budget and needs.",
  },
  {
    icon: HeartHandshakeIcon,
    title: "Save your favorites",
    description: "Create an account to bookmark plans and pick up right where you left off.",
  },
]

export default async function HomePage() {
  const session = await getOptionalSession()
  const isAuthenticated = Boolean(session)
  const favoritedPlanIds = session
    ? new Set(await favoritesRepository.listByUser(session.userId))
    : new Set<string>()

  const featuredPlans = getAllPlans()
    .filter((plan) => plan.badge)
    .slice(0, 3)

  return (
    <>
      <section className="border-b border-border/60 bg-gradient-to-b from-secondary/60 to-background">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-20 sm:px-6 sm:py-28">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            Health, dental, vision, life &amp; more
          </span>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Insurance coverage that&apos;s simple to compare and easy to trust
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            MedGuard brings every type of insurance plan into one place, so you can compare
            prices and coverage side by side, then save the ones you like to your profile.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" render={<Link href="/plans" />}>
              Browse plans
              <ArrowRightIcon />
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/register" />}>
              Create a free account
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {VALUE_PROPS.map(({ icon: Icon, title, description }) => (
            <Card key={title}>
              <CardHeader>
                <Icon className="size-6 text-primary" />
                <CardTitle className="pt-2">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Popular plans</h2>
            <p className="text-sm text-muted-foreground">
              A few favorites among MedGuard members right now.
            </p>
          </div>
          <Link
            href="/plans"
            className="hidden shrink-0 text-sm font-medium text-primary hover:underline sm:block"
          >
            View all plans
          </Link>
        </div>
        <PlanGrid
          plans={featuredPlans}
          favoritedPlanIds={favoritedPlanIds}
          isAuthenticated={isAuthenticated}
        />
      </section>
    </>
  )
}
