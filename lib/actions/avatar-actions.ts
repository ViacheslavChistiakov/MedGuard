"use server"

import { revalidatePath } from "next/cache"
import { verifySession } from "@/lib/auth/dal"

const API_BASE_URL = process.env.API_BASE_URL

if (!API_BASE_URL) {
  throw new Error("API_BASE_URL environment variable is not set")
}

// `error` is either a translation-key code (looked up under `profile.avatar`
// in the messages) or, when the backend responds with its own message, that
// raw string passed through as-is — the client falls back to displaying it
// untranslated in that case.
export interface AvatarActionState {
  error?: string
}

async function parseErrorMessage(response: Response, fallback: string): Promise<string> {
  const data = await response.json().catch(() => null)
  return typeof data?.error === "string" ? data.error : fallback
}

export async function uploadAvatarAction(
  _prevState: AvatarActionState | undefined,
  formData: FormData
): Promise<AvatarActionState> {
  const session = await verifySession()

  const file = formData.get("avatar")
  if (!(file instanceof File) || file.size === 0) {
    return { error: "chooseImage" }
  }

  const uploadForm = new FormData()
  uploadForm.append("avatar", file)

  const response = await fetch(`${API_BASE_URL}/api/auth/users/${session.userId}/avatar`, {
    method: "POST",
    headers: { Authorization: `Bearer ${session.apiToken}` },
    body: uploadForm,
  })

  if (!response.ok) {
    return { error: await parseErrorMessage(response, "uploadError") }
  }

  revalidatePath("/[locale]/profile", "page")
  return {}
}

export async function removeAvatarAction(): Promise<AvatarActionState> {
  const session = await verifySession()

  const response = await fetch(`${API_BASE_URL}/api/auth/users/${session.userId}/avatar`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${session.apiToken}` },
  })

  if (!response.ok) {
    return { error: await parseErrorMessage(response, "removeError") }
  }

  revalidatePath("/[locale]/profile", "page")
  return {}
}
