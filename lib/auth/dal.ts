import "server-only"
import { cache } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import type { SessionPayload } from "@/lib/types/session"
import type { UserDTO } from "@/lib/types/user"

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
  if (!session?.user?.id || !session.user.email) return null

  return {
    id: session.user.id,
    name: session.user.name ?? "",
    email: session.user.email,
    createdAt: new Date(session.user.createdAt),
  }
})
