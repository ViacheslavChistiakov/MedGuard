export interface FavoritesRepository {
  listByUser(userId: string): Promise<string[]>
  isFavorite(userId: string, planId: string): Promise<boolean>
  add(userId: string, planId: string): Promise<void>
  remove(userId: string, planId: string): Promise<void>
}

export interface OrderDTO {
  invId: number
  userId: string
  planId: string
  amount: number
  description: string
  status: "pending" | "paid" | "failed"
  createdAt: string
}

export interface OrdersRepository {
  create(planId: string): Promise<OrderDTO>
  getByInvId(invId: number): Promise<OrderDTO | null>
  getCurrentPlans(): Promise<OrderDTO[]>
}
