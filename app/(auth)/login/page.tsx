import type { Metadata } from "next"
import { Card } from "@/components/ui/card"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Log in | MedGuard",
}

export default function LoginPage() {
  return (
    <Card
      title={<span className="text-xl">Welcome back</span>}
      description="Log in to view and manage your favorite plans."
    >
      <LoginForm />
    </Card>
  )
}
