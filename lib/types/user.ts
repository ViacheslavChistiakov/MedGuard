export interface UserRecord {
  id: string
  name: string
  email: string
  passwordHash: string
  createdAt: Date
}

export interface UserDTO {
  id: string
  name: string
  email: string
  createdAt: Date
}

export function toUserDTO(user: UserRecord): UserDTO {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  }
}
