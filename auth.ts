import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
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

const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET

if (!INTERNAL_API_SECRET) {
  throw new Error("INTERNAL_API_SECRET environment variable is not set")
}

// Bridges a verified Google sign-in to our own backend: finds or creates the
// matching account and returns the same kind of API token password login gets.
async function oauthLogin(name: string, email: string): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>(
    "/api/auth/oauth",
    { name, email },
    { headers: { "x-internal-secret": INTERNAL_API_SECRET } }
  )
  return data
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Google({}),
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
    async jwt({ token, user, account, profile }) {
      if (account?.provider === "google") {
        if (!profile?.email) return token
        const { user: backendUser, token: apiToken } = await oauthLogin(
          profile.name ?? profile.email,
          profile.email
        )
        token.id = backendUser.id
        token.email = backendUser.email
        token.name = backendUser.name
        token.createdAt = backendUser.createdAt
        token.apiToken = apiToken
        return token
      }

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
