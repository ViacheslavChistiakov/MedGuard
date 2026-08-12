import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { UserDTO } from "@/lib/types/user"

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("")
}

export function ProfileHeader({
  user,
  favoriteCount,
}: {
  user: UserDTO
  favoriteCount: number
}) {
  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
      <Avatar size="lg">
        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">{user.name}</h1>
        <p className="text-sm text-muted-foreground">{user.email}</p>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Badge variant="secondary">
            {favoriteCount} favorite{favoriteCount === 1 ? "" : "s"}
          </Badge>
          <span className="text-xs text-muted-foreground">
            Member since{" "}
            {user.createdAt.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </span>
        </div>
      </div>
    </div>
  )
}
