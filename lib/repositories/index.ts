import "server-only"
import { InMemoryUserRepository } from "@/lib/repositories/in-memory-user-repository"
import { InMemoryFavoritesRepository } from "@/lib/repositories/in-memory-favorites-repository"
import type { UserRepository, FavoritesRepository } from "@/lib/repositories/types"

// Turbopack Fast Refresh re-evaluates this module on edit, which would
// otherwise wipe the in-memory store on every hot reload. Cache the
// singletons on globalThis so they survive Fast Refresh (a full `next dev`
// restart still resets them - expected for this mock-data phase).
const globalForRepos = globalThis as unknown as {
  userRepository?: UserRepository
  favoritesRepository?: FavoritesRepository
}

export const userRepository: UserRepository =
  globalForRepos.userRepository ?? new InMemoryUserRepository()

export const favoritesRepository: FavoritesRepository =
  globalForRepos.favoritesRepository ?? new InMemoryFavoritesRepository()

if (process.env.NODE_ENV !== "production") {
  globalForRepos.userRepository = userRepository
  globalForRepos.favoritesRepository = favoritesRepository
}
