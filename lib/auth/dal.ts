import "server-only"
import { cache } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { apiClient } from "@/lib/api/client"
import type { SessionPayload } from "@/lib/types/session"
import type { UserDTO } from "@/lib/types/user"

interface UserApiResponse {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  createdAt: string
}

// Uploaded avatars are stored as paths relative to our own API (e.g.
// "/uploads/avatars/…"); Google-synced avatars are already absolute URLs
// pointing at Google's CDN.
function resolveAvatarUrl(avatarUrl: string): string {
  if (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://")) {
    return avatarUrl
  }
  return `${process.env.API_BASE_URL}${avatarUrl}`
}

export const getOptionalSession = cache(async (): Promise<SessionPayload | null> => {
  const session = await auth()
  if (!session?.user?.id || !session.apiToken) return null
  return { userId: session.user.id, apiToken: session.apiToken }
})

export const verifySession = cache(async (): Promise<SessionPayload> => {
  const session = await getOptionalSession()
  if (!session) {
    redirect("/login")
  }
  return session
})

export const getCurrentUser = cache(async (): Promise<UserDTO | null> => {
  const session = await auth()
  if (!session?.user?.id) return null

  try {
    const { data } = await apiClient.get<UserApiResponse>(`/api/auth/users/${session.user.id}`)
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      avatarUrl: data.avatarUrl ? resolveAvatarUrl(data.avatarUrl) : null,
      createdAt: new Date(data.createdAt),
    }
  } catch {
    return null
  }
})
