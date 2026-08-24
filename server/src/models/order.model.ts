import { Schema, model, type InferSchemaType } from "mongoose"

export const ORDER_STATUSES = ["pending", "paid", "failed"] as const
export type OrderStatus = (typeof ORDER_STATUSES)[number]

const orderSchema = new Schema(
  {
    invId: { type: Number, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    planId: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ORDER_STATUSES, required: true, default: "pending" },
    yookassaPayload: { type: Schema.Types.Mixed, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

export type OrderDocument = InferSchemaType<typeof orderSchema>

export const Order = model<OrderDocument>("Order", orderSchema)
