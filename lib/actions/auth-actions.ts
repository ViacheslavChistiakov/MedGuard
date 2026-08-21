"use server"

import { redirect } from "next/navigation"
import axios from "axios"
import { AuthError, CredentialsSignin } from "next-auth"
import { signIn, signOut } from "@/auth"
import { apiClient } from "@/lib/api/client"
import { RegisterSchema, LoginSchema } from "@/lib/validation/auth-schemas"
import { getLocale } from "@/lib/i18n/get-locale"

// Server actions run without knowledge of which locale the calling client is
// rendered in, so form-level failures are reported as translation-key codes
// (looked up under `auth.login`/`auth.register` in the messages) rather than
// hardcoded English strings, and the client form does the translating.
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

  const { name, email, password, confirmPassword } = result.data

  try {
    await apiClient.post("/api/auth/register", { name, email, password, confirmPassword })
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 409) {
        return { errors: { email: ["emailTaken"] } }
      }
      if (error.response?.status === 400 && error.response.data?.errors) {
        return { errors: error.response.data.errors }
      }
    }
    return { errors: { form: ["genericError"] } }
  }

  const locale = await getLocale()

  try {
    await signIn("credentials", { email, password, redirect: false })
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(`/${locale}/login`)
    }
    throw error
  }

  redirect(`/${locale}/profile`)
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

  try {
    await signIn("credentials", { email, password, redirect: false })
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      return { errors: { form: ["invalidCredentials"] } }
    }
    if (error instanceof AuthError) {
      return { errors: { form: ["genericError"] } }
    }
    throw error
  }

  redirect(`/${await getLocale()}/profile`)
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirect: false })
  redirect(`/${await getLocale()}`)
}

export async function googleSignInAction(): Promise<void> {
  await signIn("google", { redirectTo: `/${await getLocale()}/profile` })
}
