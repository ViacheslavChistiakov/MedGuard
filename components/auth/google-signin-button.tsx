import { googleSignInAction } from "@/lib/actions/auth-actions"
import { Button } from "@/components/ui/button"

export function GoogleSignInButton() {
  return (
    <form action={googleSignInAction}>
      <Button type="submit" variant="outline" className="w-full">
        Continue with Google
      </Button>
    </form>
  )
}
