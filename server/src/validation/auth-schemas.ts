import { z } from "zod"

export const RegisterBodySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.email("Enter a valid email address").trim().toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
  confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export const LoginBodySchema = z.object({
  email: z.email("Enter a valid email address").trim().toLowerCase(),
  password: z.string().min(1, "Password is required"),
})

export const OAuthBodySchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.email("Enter a valid email address").trim().toLowerCase(),
  avatarUrl: z.url().nullish(),
})
