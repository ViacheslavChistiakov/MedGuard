import type { Metadata } from "next"
import { verifySession, getCurrentUser } from "@/lib/auth/dal"
import { favoritesRepository } from "@/lib/repositories"
import { ProfileHeader } from "@/components/profile/profile-header"
import { FavoritePlansList } from "@/components/profile/favorite-plans-list"
import { Separator } from "@/components/ui/separator"
import initTranslations from "@/i18n"
import { isLocale, fallbackLng } from "@/i18n/settings"

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/profile">): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale = isLocale(rawLocale) ? rawLocale : fallbackLng
  const { t } = await initTranslations(locale)
  return { title: t("profile.metaTitle") }
}

export default async function ProfilePage({ params }: PageProps<"/[locale]/profile">) {
  const { locale: rawLocale } = await params
  const locale = isLocale(rawLocale) ? rawLocale : fallbackLng
  const { t } = await initTranslations(locale)

  const session = await verifySession()
  const user = await getCurrentUser()

  if (!user) {
    // Session referenced a user record that no longer exists (e.g. dev-server
    // restart wiped the in-memory store while an old session cookie survived).
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-12 text-center sm:px-6">
        <p className="text-muted-foreground">{t("profile.notFound")}</p>
      </div>
    )
  }

  const favoriteCount = (await favoritesRepository.listByUser(session.userId)).length

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <ProfileHeader user={user} favoriteCount={favoriteCount} locale={locale} />
      <Separator className="my-8" />
      <h2 className="mb-4 text-xl font-semibold">{t("profile.favoritePlans")}</h2>
      <FavoritePlansList userId={session.userId} locale={locale} />
    </div>
  )
}
