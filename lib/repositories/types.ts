import type { UserRecord } from "@/lib/types/user"

export interface UserRepository {
  findByEmail(email: string): Promise<UserRecord | null>
  findById(id: string): Promise<UserRecord | null>
  create(input: { name: string; email: string; passwordHash: string }): Promise<UserRecord>
}

export interface FavoritesRepository {
  listByUser(userId: string): Promise<string[]>
  isFavorite(userId: string, planId: string): Promise<boolean>
  add(userId: string, planId: string): Promise<void>
  remove(userId: string, planId: string): Promise<void>
}
