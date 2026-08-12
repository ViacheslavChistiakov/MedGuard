import type { UserRecord } from "@/lib/types/user"
import type { UserRepository } from "@/lib/repositories/types"

export class InMemoryUserRepository implements UserRepository {
  private usersById = new Map<string, UserRecord>()
  private idByEmail = new Map<string, string>()

  async findByEmail(email: string): Promise<UserRecord | null> {
    const normalized = email.toLowerCase()
    const id = this.idByEmail.get(normalized)
    if (!id) return null
    return this.usersById.get(id) ?? null
  }

  async findById(id: string): Promise<UserRecord | null> {
    return this.usersById.get(id) ?? null
  }

  async create(input: { name: string; email: string; passwordHash: string }): Promise<UserRecord> {
    const normalized = input.email.toLowerCase()
    if (this.idByEmail.has(normalized)) {
      throw new Error("A user with this email already exists")
    }

    const user: UserRecord = {
      id: crypto.randomUUID(),
      name: input.name,
      email: normalized,
      passwordHash: input.passwordHash,
      createdAt: new Date(),
    }

    this.usersById.set(user.id, user)
    this.idByEmail.set(normalized, user.id)
    return user
  }
}
