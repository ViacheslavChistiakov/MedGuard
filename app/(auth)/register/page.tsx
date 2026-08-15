import type { Metadata } from "next"
import { Card } from "@/components/ui/card"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Create account | MedGuard",
}

export default function RegisterPage() {
  return (
    <Card
      title={<span className="text-xl">Create your account</span>}
      description="Save your favorite insurance plans in one place."
    >
      <RegisterForm />
    </Card>
  )
}
