import type { FavoritesRepository } from "@/lib/repositories/types"

export class InMemoryFavoritesRepository implements FavoritesRepository {
  private favoritesByUser = new Map<string, Set<string>>()

  async listByUser(userId: string): Promise<string[]> {
    return Array.from(this.favoritesByUser.get(userId) ?? [])
  }

  async isFavorite(userId: string, planId: string): Promise<boolean> {
    return this.favoritesByUser.get(userId)?.has(planId) ?? false
  }

  async add(userId: string, planId: string): Promise<void> {
    const existing = this.favoritesByUser.get(userId)
    if (existing) {
      existing.add(planId)
    } else {
      this.favoritesByUser.set(userId, new Set([planId]))
    }
  }

  async remove(userId: string, planId: string): Promise<void> {
    this.favoritesByUser.get(userId)?.delete(planId)
  }
}
