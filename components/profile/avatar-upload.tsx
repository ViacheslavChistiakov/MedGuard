"use client"

import { useActionState, useEffect, useRef, useTransition } from "react"
import { CameraIcon, Loader2Icon, XIcon } from "lucide-react"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  uploadAvatarAction,
  removeAvatarAction,
  type AvatarActionState,
} from "@/lib/actions/avatar-actions"

const initialState: AvatarActionState = {}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("")
}

export function AvatarUpload({
  name,
  avatarUrl,
}: {
  name: string
  avatarUrl: string | null
}) {
  const formRef = useRef<HTMLFormElement>(null)
  const [uploadState, uploadAction, isUploading] = useActionState(uploadAvatarAction, initialState)
  const [isRemoving, startRemoveTransition] = useTransition()

  useEffect(() => {
    if (uploadState.error) {
      toast.error(uploadState.error)
      formRef.current?.reset()
    }
  }, [uploadState])

  function handleRemove() {
    startRemoveTransition(async () => {
      const result = await removeAvatarAction()
      if (result.error) {
        toast.error(result.error)
      }
    })
  }

  const isPending = isUploading || isRemoving

  return (
    <div className="relative">
      <Avatar size="lg">
        {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>

      <form ref={formRef} action={uploadAction}>
        <label
          htmlFor="avatar"
          className="absolute -right-1 -bottom-1 inline-flex size-6 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background hover:opacity-90"
        >
          {isPending ? (
            <Loader2Icon className="size-3 animate-spin" />
          ) : (
            <CameraIcon className="size-3" />
          )}
          <span className="sr-only">Change avatar</span>
        </label>
        <input
          id="avatar"
          name="avatar"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          disabled={isPending}
          onChange={(event) => {
            if (event.target.files?.length) {
              formRef.current?.requestSubmit()
            }
          }}
        />
      </form>

      {avatarUrl && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          disabled={isPending}
          onClick={handleRemove}
          className="absolute -top-1 -right-1 rounded-full bg-muted text-muted-foreground hover:text-foreground"
        >
          <XIcon className="size-3" />
          <span className="sr-only">Remove avatar</span>
        </Button>
      )}
    </div>
  )
}
