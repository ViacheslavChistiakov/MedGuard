import "server-only"
import { cache } from "react"
import { redirect } from "next/navigation"
import { readSessionFromCookies } from "@/lib/auth/session"
import { userRepository } from "@/lib/repositories"
import { toUserDTO, type UserDTO } from "@/lib/types/user"
import type { SessionPayload } from "@/lib/types/session"

export const getOptionalSession = cache(async (): Promise<SessionPayload | null> => {
  return readSessionFromCookies()
})

export const verifySession = cache(async (): Promise<SessionPayload> => {
  const session = await getOptionalSession()
  if (!session) {
    redirect("/login")
  }
  return session
})

export const getCurrentUser = cache(async (): Promise<UserDTO | null> => {
  const session = await getOptionalSession()
  if (!session) return null

  const user = await userRepository.findById(session.userId)
  if (!user) return null

  return toUserDTO(user)
})
