"use client"

import { useActionState } from "react"
import { useTranslation } from "react-i18next"
import { loginAction, type AuthActionState } from "@/lib/actions/auth-actions"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubmitButton } from "@/components/auth/submit-button"
import { GoogleSignInButton } from "@/components/auth/google-signin-button"
import { LocaleLink } from "@/components/locale-link"

const initialState: AuthActionState = {}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState)
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
            {t(`auth.login.${state.errors.form[0]}`, state.errors.form[0])}
          </p>
        )}

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
            autoComplete="current-password"
            required
          />
          {state.errors?.password && (
            <p className="text-sm text-destructive">
              {t(`auth.fieldErrors.${state.errors.password[0]}`, state.errors.password[0])}
            </p>
          )}
        </div>

        <SubmitButton className="mt-1 w-full">{t("auth.login.submit")}</SubmitButton>

        <p className="text-center text-sm text-muted-foreground">
          {t("auth.login.noAccount")}{" "}
          <LocaleLink href="/register" className="font-medium text-primary hover:underline">
            {t("auth.login.createOne")}
          </LocaleLink>
        </p>
      </form>
    </div>
  )
}
