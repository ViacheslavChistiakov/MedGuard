import { z } from "zod"

export const CreateOrderBodySchema = z.object({
  planId: z.string().trim().min(1),
})
