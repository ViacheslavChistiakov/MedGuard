import "server-only"
import { ApiFavoritesRepository } from "@/lib/repositories/api-favorites-repository"
import { ApiOrdersRepository } from "@/lib/repositories/api-orders-repository"
import type { FavoritesRepository, OrdersRepository } from "@/lib/repositories/types"

export const favoritesRepository: FavoritesRepository = new ApiFavoritesRepository()
export const ordersRepository: OrdersRepository = new ApiOrdersRepository()
