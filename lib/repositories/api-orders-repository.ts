import "server-only"
import { apiClient } from "@/lib/api/client"
import { getOptionalSession } from "@/lib/auth/dal"
import type { OrderDTO, OrdersRepository } from "@/lib/repositories/types"

async function authHeader() {
  const session = await getOptionalSession()
  if (!session) {
    throw new Error("Not authenticated")
  }
  return { Authorization: `Bearer ${session.apiToken}` }
}

export class ApiOrdersRepository implements OrdersRepository {
  async create(planId: string): Promise<OrderDTO> {
    const headers = await authHeader()
    const { data } = await apiClient.post<OrderDTO>("/api/orders", { planId }, { headers })
    return data
  }

  async getByInvId(invId: number): Promise<OrderDTO | null> {
    const headers = await authHeader()
    try {
      const { data } = await apiClient.get<OrderDTO>(`/api/orders/${invId}`, { headers })
      return data
    } catch {
      return null
    }
  }

  async getCurrentPlans(): Promise<OrderDTO[]> {
    const headers = await authHeader()
    try {
      const { data } = await apiClient.get<OrderDTO[]>("/api/orders/current", { headers })
      return data
    } catch {
      return []
    }
  }
}
