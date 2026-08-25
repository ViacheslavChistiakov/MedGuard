"use client"

import { useActionState } from "react"
import { useTranslation } from "react-i18next"
import { registerAction, type AuthActionState } from "@/lib/actions/auth-actions"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubmitButton } from "@/components/auth/submit-button"
import { GoogleSignInButton } from "@/components/auth/google-signin-button"
import { LocaleLink } from "@/components/locale-link"

const initialState: AuthActionState = {}

export function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, initialState)
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-4">
      <GoogleSignInButton />

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        {t("auth.or")}
        <span className="h-px flex-1 bg-border" />
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        {state.errors?.form && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {t(`auth.register.${state.errors.form[0]}`, state.errors.form[0])}
          </p>
        )}

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">{t("auth.fields.fullName")}</Label>
          <Input id="name" name="name" type="text" autoComplete="name" placeholder="Jane Doe" required />
          {state.errors?.name && (
            <p className="text-sm text-destructive">
              {t(`auth.fieldErrors.${state.errors.name[0]}`, state.errors.name[0])}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">{t("auth.fields.email")}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
          {state.errors?.email && (
            <p className="text-sm text-destructive">
              {t(`auth.fieldErrors.${state.errors.email[0]}`, state.errors.email[0])}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">{t("auth.fields.password")}</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
          />
          {state.errors?.password && (
            <p className="text-sm text-destructive">
              {t(`auth.fieldErrors.${state.errors.password[0]}`, state.errors.password[0])}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirmPassword">{t("auth.fields.confirmPassword")}</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
          />
          {state.errors?.confirmPassword && (
            <p className="text-sm text-destructive">
              {t(`auth.fieldErrors.${state.errors.confirmPassword[0]}`, state.errors.confirmPassword[0])}
            </p>
          )}
        </div>

        <SubmitButton className="mt-1 w-full">{t("auth.register.submit")}</SubmitButton>

        <p className="text-center text-sm text-muted-foreground">
          {t("auth.register.haveAccount")}{" "}
          <LocaleLink href="/login" className="font-medium text-primary hover:underline">
            {t("auth.register.logIn")}
          </LocaleLink>
        </p>
      </form>
    </div>
  )
}
