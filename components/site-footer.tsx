import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>&copy; {new Date().getFullYear()} MedGuard. All plans shown are illustrative.</p>
        <div className="flex gap-4">
          <Link href="/plans" className="hover:text-foreground">
            Browse plans
          </Link>
          <Link href="/register" className="hover:text-foreground">
            Get started
          </Link>
        </div>
      </div>
    </footer>
  )
}
