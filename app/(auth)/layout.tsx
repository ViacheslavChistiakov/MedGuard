import Link from "next/link"
import { ShieldPlusIcon } from "lucide-react"

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-8 bg-secondary/40 px-4 py-12">
      <Link href="/" className="flex items-center gap-2 font-heading text-lg font-semibold">
        <ShieldPlusIcon className="size-5 text-primary" />
        MedGuard
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  )
}
