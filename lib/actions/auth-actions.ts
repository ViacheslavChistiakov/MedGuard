"use server"

import { redirect } from "next/navigation"
import { RegisterSchema, LoginSchema } from "@/lib/validation/auth-schemas"
import { hashPassword, verifyPassword } from "@/lib/auth/password"
import { createSessionCookie, deleteSessionCookie } from "@/lib/auth/session"
import { userRepository } from "@/lib/repositories"

export interface AuthActionState {
  errors?: {
    name?: string[]
    email?: string[]
    password?: string[]
    confirmPassword?: string[]
    form?: string[]
  }
}

export async function registerAction(
  _prevState: AuthActionState | undefined,
  formData: FormData
): Promise<AuthActionState> {
  const result = RegisterSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  })

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  const { name, email, password } = result.data

  const existingUser = await userRepository.findByEmail(email)
  if (existingUser) {
    return { errors: { email: ["An account with this email already exists"] } }
  }

  const passwordHash = await hashPassword(password)
  const user = await userRepository.create({ name, email, passwordHash })
  await createSessionCookie(user.id)

  redirect("/profile")
}

export async function loginAction(
  _prevState: AuthActionState | undefined,
  formData: FormData
): Promise<AuthActionState> {
  const result = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  const { email, password } = result.data
  const invalidCredentialsError = { errors: { form: ["Invalid email or password"] } }

  const user = await userRepository.findByEmail(email)
  if (!user) {
    return invalidCredentialsError
  }

  const isValidPassword = await verifyPassword(password, user.passwordHash)
  if (!isValidPassword) {
    return invalidCredentialsError
  }

  await createSessionCookie(user.id)
  redirect("/profile")
}

export async function logoutAction(): Promise<void> {
  await deleteSessionCookie()
  redirect("/")
}
