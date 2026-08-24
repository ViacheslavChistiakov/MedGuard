import { Schema, model, type InferSchemaType } from "mongoose"

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String },
    avatarUrl: { type: String, default: null },
    avatarSource: { type: String, enum: ["upload", "google"], default: null },
    favoritePlanIds: { type: [String], required: true, default: [] },
    currentPlanIds: { type: [String], default: [] },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

export type UserDocument = InferSchemaType<typeof userSchema>

export const User = model<UserDocument>("User", userSchema)
