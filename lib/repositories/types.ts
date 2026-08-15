export interface FavoritesRepository {
  listByUser(userId: string): Promise<string[]>
  isFavorite(userId: string, planId: string): Promise<boolean>
  add(userId: string, planId: string): Promise<void>
  remove(userId: string, planId: string): Promise<void>
}
