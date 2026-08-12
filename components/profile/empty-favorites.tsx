import Link from "next/link"
import { HeartIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function EmptyFavorites() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
        <HeartIcon className="size-8 text-muted-foreground" />
        <div className="flex flex-col gap-1">
          <p className="font-medium">No favorite plans yet</p>
          <p className="text-sm text-muted-foreground">
            Browse our plans and tap the heart icon to save the ones you like.
          </p>
        </div>
        <Button render={<Link href="/plans" />} className="mt-2">
          Browse plans
        </Button>
      </CardContent>
    </Card>
  )
}
