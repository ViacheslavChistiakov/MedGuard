import { z } from "zod"

// Messages are translation-key codes (looked up under `auth.fieldErrors` in
// the messages), not display text, so the client form can render them in the
// user's language.
export const RegisterSchema = z
  .object({
    name: z.string().trim().min(2, "nameTooShort").max(80),
    email: z.email("invalidEmail").trim().toLowerCase(),
    password: z.string().min(8, "passwordTooShort").max(72),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwordsMismatch",
    path: ["confirmPassword"],
  })

export const LoginSchema = z.object({
  email: z.email("invalidEmail").trim().toLowerCase(),
  password: z.string().min(1, "passwordRequired"),
})

export type RegisterInput = z.infer<typeof RegisterSchema>
export type LoginInput = z.infer<typeof LoginSchema>
