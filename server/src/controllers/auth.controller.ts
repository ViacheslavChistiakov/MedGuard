import path from "node:path"
import fs from "node:fs"
import type { Request, Response, NextFunction } from "express"
import bcrypt from "bcryptjs"
import mongoose, { type HydratedDocument } from "mongoose"
import { User, type UserDocument } from "../models/user.model.js"
import { InsurancePlan } from "../models/insurance-plan.model.js"
import { RegisterBodySchema, LoginBodySchema, OAuthBodySchema } from "../validation/auth-schemas.js"
import { signAuthToken } from "../utils/jwt.js"
import { AVATARS_DIR } from "../middleware/upload.middleware.js"

const SALT_ROUNDS = 12
const AVATAR_URL_PREFIX = "/uploads/avatars/"

function toSafeUser(user: HydratedDocument<UserDocument>) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl ?? null,
    createdAt: user.createdAt.toISOString(),
  }
}

function deleteAvatarFile(avatarUrl: string | null | undefined) {
  if (!avatarUrl || !avatarUrl.startsWith(AVATAR_URL_PREFIX)) return
  const filename = avatarUrl.slice(AVATAR_URL_PREFIX.length)
  const filePath = path.join(AVATARS_DIR, filename)
  fs.unlink(filePath, () => {})
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const result = RegisterBodySchema.safeParse(req.body)
    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten().fieldErrors })
      return
    }

    const { name, email, password } = result.data

    const existingUser = await User.exists({ email })
    if (existingUser) {
      res.status(409).json({ error: "An account with this email already exists" })
      return
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
    const user = await User.create({ name, email, passwordHash })

    const token = signAuthToken({ sub: user._id.toString(), email: user.email })

    res.status(201).json({ user: toSafeUser(user), token })
  } catch (error) {
    next(error)
  }
}

export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await User.find().sort({ createdAt: -1 })
    res.status(200).json(users.map(toSafeUser))
  } catch (error) {
    next(error)
  }
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.params.id
    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ error: "User not found" })
      return
    }

    res.status(200).json(toSafeUser(user))
  } catch (error) {
    next(error)
  }
}

export async function getUserPlans(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.params.id
    if (typeof userId !== "string" || !mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: "Invalid user id" })
      return
    }

    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ error: "User not found" })
      return
    }

    const plans = await InsurancePlan.find({ id: { $in: user.favoritePlanIds } })
      .select("-_id")
      .lean()

    res.status(200).json(plans)
  } catch (error) {
    next(error)
  }
}

export async function getUserFavorites(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.params.id
    if (typeof userId !== "string" || !mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: "Invalid user id" })
      return
    }

    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ error: "User not found" })
      return
    }

    res.status(200).json(user.favoritePlanIds)
  } catch (error) {
    next(error)
  }
}

export async function addUserFavorite(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.params.id
    const planId = req.params.planId
    if (typeof userId !== "string" || !mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: "Invalid user id" })
      return
    }

    const planExists = await InsurancePlan.exists({ id: planId })
    if (!planExists) {
      res.status(404).json({ error: "Plan not found" })
      return
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favoritePlanIds: planId } },
      { new: true }
    )
    if (!user) {
      res.status(404).json({ error: "User not found" })
      return
    }

    res.status(200).json({ planId, favorited: true })
  } catch (error) {
    next(error)
  }
}

export async function removeUserFavorite(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.params.id
    const planId = req.params.planId
    if (typeof userId !== "string" || !mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ error: "Invalid user id" })
      return
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { favoritePlanIds: planId } },
      { new: true }
    )
    if (!user) {
      res.status(404).json({ error: "User not found" })
      return
    }

    res.status(200).json({ planId, favorited: false })
  } catch (error) {
    next(error)
  }
}

// Called by our Next.js server after it verifies a Google sign-in, to find
// or create the matching account and issue the same kind of token password
// login gets. Only reachable with the internal secret (see auth.routes.ts).
export async function oauthLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const result = OAuthBodySchema.safeParse(req.body)
    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten().fieldErrors })
      return
    }

    const { name, email, avatarUrl } = result.data

    let user = await User.findOne({ email })
    if (!user) {
      user = await User.create({
        name,
        email,
        ...(avatarUrl ? { avatarUrl, avatarSource: "google" } : {}),
      })
    } else if (avatarUrl && user.avatarSource !== "upload" && user.avatarUrl !== avatarUrl) {
      user.avatarUrl = avatarUrl
      user.avatarSource = "google"
      await user.save()
    }

    const token = signAuthToken({ sub: user._id.toString(), email: user.email })

    res.status(200).json({ user: toSafeUser(user), token })
  } catch (error) {
    next(error)
  }
}

export async function uploadAvatar(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.params.id
    const file = req.file
    if (!file) {
      res.status(400).json({ error: "No avatar file was provided" })
      return
    }

    const user = await User.findById(userId)
    if (!user) {
      fs.unlink(file.path, () => {})
      res.status(404).json({ error: "User not found" })
      return
    }

    deleteAvatarFile(user.avatarUrl)

    user.avatarUrl = `${AVATAR_URL_PREFIX}${file.filename}`
    user.avatarSource = "upload"
    await user.save()

    res.status(200).json(toSafeUser(user))
  } catch (error) {
    next(error)
  }
}

export async function removeAvatar(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.params.id
    const user = await User.findById(userId)
    if (!user) {
      res.status(404).json({ error: "User not found" })
      return
    }

    deleteAvatarFile(user.avatarUrl)
    user.avatarUrl = null
    user.avatarSource = null
    await user.save()

    res.status(200).json(toSafeUser(user))
  } catch (error) {
    next(error)
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = LoginBodySchema.safeParse(req.body)
    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten().fieldErrors })
      return
    }

    const { email, password } = result.data
    const invalidCredentialsError = { error: "Invalid email or password" }

    const user = await User.findOne({ email })
    if (!user || !user.passwordHash) {
      res.status(401).json(invalidCredentialsError)
      return
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) {
      res.status(401).json(invalidCredentialsError)
      return
    }

    const token = signAuthToken({ sub: user._id.toString(), email: user.email })

    res.status(200).json({ user: toSafeUser(user), token })
  } catch (error) {
    next(error)
  }
}
