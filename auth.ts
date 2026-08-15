import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import axios from "axios"
import { apiClient } from "@/lib/api/client"
import { LoginSchema } from "@/lib/validation/auth-schemas"

interface LoginUser {
  id: string
  name: string
  email: string
  createdAt: string
}

interface LoginResponse {
  user: LoginUser
  token: string
}

interface AuthorizedUser extends LoginUser {
  apiToken: string
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const parsed = LoginSchema.safeParse(credentials)
        if (!parsed.success) return null

        try {
          const { data } = await apiClient.post<LoginResponse>("/api/auth/login", parsed.data)
          return { ...data.user, apiToken: data.token }
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            return null
          }
          throw error
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.createdAt = (user as AuthorizedUser).createdAt
        token.apiToken = (user as AuthorizedUser).apiToken
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.createdAt = token.createdAt as string
      session.apiToken = token.apiToken as string
      return session
    },
  },
})
