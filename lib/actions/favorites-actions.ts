"use server"

import { revalidatePath } from "next/cache"
import { getOptionalSession } from "@/lib/auth/dal"
import { favoritesRepository } from "@/lib/repositories"

export async function toggleFavoriteAction(planId: string): Promise<{ favorited: boolean }> {
  const session = await getOptionalSession()
  if (!session) {
    throw new Error("You must be logged in to favorite a plan")
  }

  const isFavorite = await favoritesRepository.isFavorite(session.userId, planId)
  if (isFavorite) {
    await favoritesRepository.remove(session.userId, planId)
  } else {
    await favoritesRepository.add(session.userId, planId)
  }

  revalidatePath("/[locale]/plans", "page")
  revalidatePath("/[locale]/profile", "page")

  return { favorited: !isFavorite }
}
