import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    createdAt: string
    apiToken: string
  }

  interface Session {
    apiToken: string
    user: {
      id: string
      createdAt: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    createdAt: string
    apiToken: string
  }
}
