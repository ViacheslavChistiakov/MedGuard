import "server-only"
import { ApiFavoritesRepository } from "@/lib/repositories/api-favorites-repository"
import type { FavoritesRepository } from "@/lib/repositories/types"

export const favoritesRepository: FavoritesRepository = new ApiFavoritesRepository()
