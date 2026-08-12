"use client"

import { useState } from "react"
import Link from "next/link"
import { MenuIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { LogoutButton } from "@/components/auth/logout-button"
import type { UserDTO } from "@/lib/types/user"

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/plans", label: "Plans" },
]

export function MobileNav({ user }: { user: UserDTO | null }) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon" className="sm:hidden" />}>
        <MenuIcon />
        <span className="sr-only">Open menu</span>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>MedGuard</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2 text-sm font-medium hover:bg-muted"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-2 p-4">
          {user ? (
            <>
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2 text-sm font-medium hover:bg-muted"
              >
                Profile
              </Link>
              <LogoutButton className="w-full" />
            </>
          ) : (
            <>
              <Button
                variant="outline"
                render={<Link href="/login" onClick={() => setOpen(false)} />}
              >
                Log in
              </Button>
              <Button render={<Link href="/register" onClick={() => setOpen(false)} />}>
                Get started
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
