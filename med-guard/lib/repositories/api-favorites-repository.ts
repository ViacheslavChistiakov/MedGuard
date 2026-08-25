import "server-only"
import { apiClient } from "@/lib/api/client"
import { getOptionalSession } from "@/lib/auth/dal"
import type { FavoritesRepository } from "@/lib/repositories/types"

async function authHeader() {
  const session = await getOptionalSession()
  if (!session) {
    throw new Error("Not authenticated")
  }
  return { Authorization: `Bearer ${session.apiToken}` }
}

export class ApiFavoritesRepository implements FavoritesRepository {
  async listByUser(userId: string): Promise<string[]> {
    const headers = await authHeader()
    const { data } = await apiClient.get<string[]>(`/api/auth/users/${userId}/favorites`, {
      headers,
    })
    return data
  }

  async isFavorite(userId: string, planId: string): Promise<boolean> {
    const favoriteIds = await this.listByUser(userId)
    return favoriteIds.includes(planId)
  }

  async add(userId: string, planId: string): Promise<void> {
    const headers = await authHeader()
    await apiClient.post(
      `/api/auth/users/${userId}/favorites/${encodeURIComponent(planId)}`,
      null,
      { headers }
    )
  }

  async remove(userId: string, planId: string): Promise<void> {
    const headers = await authHeader()
    await apiClient.delete(
      `/api/auth/users/${userId}/favorites/${encodeURIComponent(planId)}`,
      { headers }
    )
  }
}
