import type { Metadata } from "next"
import { verifySession, getCurrentUser } from "@/lib/auth/dal"
import { favoritesRepository } from "@/lib/repositories"
import { ProfileHeader } from "@/components/profile/profile-header"
import { FavoritePlansList } from "@/components/profile/favorite-plans-list"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Your profile | MedGuard",
}

export default async function ProfilePage() {
  const session = await verifySession()
  const user = await getCurrentUser()

  if (!user) {
    // Session referenced a user record that no longer exists (e.g. dev-server
    // restart wiped the in-memory store while an old session cookie survived).
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-12 text-center sm:px-6">
        <p className="text-muted-foreground">
          We couldn&apos;t find your account. Please log in again.
        </p>
      </div>
    )
  }

  const favoriteCount = (await favoritesRepository.listByUser(session.userId)).length

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <ProfileHeader user={user} favoriteCount={favoriteCount} />
      <Separator className="my-8" />
      <h2 className="mb-4 text-xl font-semibold">Your favorite plans</h2>
      <FavoritePlansList userId={session.userId} />
    </div>
  )
}
