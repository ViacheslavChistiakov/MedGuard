import { Badge } from "@/components/ui/badge"
import { AvatarUpload } from "@/components/profile/avatar-upload"
import initTranslations from "@/i18n"
import type { Locale } from "@/i18n/settings"
import type { UserDTO } from "@/lib/types/user"

const DATE_LOCALES: Record<Locale, string> = { en: "en-US", ru: "ru-RU" }

export async function ProfileHeader({
  user,
  favoriteCount,
  locale,
}: {
  user: UserDTO
  favoriteCount: number
  locale: Locale
}) {
  const { t } = await initTranslations(locale)
  const memberSince = user.createdAt.toLocaleDateString(DATE_LOCALES[locale], {
    month: "long",
    year: "numeric",
  })

  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
      <AvatarUpload name={user.name} avatarUrl={user.avatarUrl} />
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">{user.name}</h1>
        <p className="text-sm text-muted-foreground">{user.email}</p>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Badge variant="secondary">{t("profile.favoritesCount", { count: favoriteCount })}</Badge>
          <span className="text-xs text-muted-foreground">
            {t("profile.memberSince", { date: memberSince })}
          </span>
        </div>
      </div>
    </div>
  )
}
