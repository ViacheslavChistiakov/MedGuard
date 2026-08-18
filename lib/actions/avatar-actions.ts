"use server"

import { revalidatePath } from "next/cache"
import { verifySession } from "@/lib/auth/dal"

const API_BASE_URL = process.env.API_BASE_URL

if (!API_BASE_URL) {
  throw new Error("API_BASE_URL environment variable is not set")
}

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
    return { error: "Please choose an image to upload" }
  }

  const uploadForm = new FormData()
  uploadForm.append("avatar", file)

  const response = await fetch(`${API_BASE_URL}/api/auth/users/${session.userId}/avatar`, {
    method: "POST",
    headers: { Authorization: `Bearer ${session.apiToken}` },
    body: uploadForm,
  })

  if (!response.ok) {
    return {
      error: await parseErrorMessage(
        response,
        "Something went wrong uploading your avatar. Please try again."
      ),
    }
  }

  revalidatePath("/profile")
  return {}
}

export async function removeAvatarAction(): Promise<AvatarActionState> {
  const session = await verifySession()

  const response = await fetch(`${API_BASE_URL}/api/auth/users/${session.userId}/avatar`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${session.apiToken}` },
  })

  if (!response.ok) {
    return {
      error: await parseErrorMessage(
        response,
        "Something went wrong removing your avatar. Please try again."
      ),
    }
  }

  revalidatePath("/profile")
  return {}
}
