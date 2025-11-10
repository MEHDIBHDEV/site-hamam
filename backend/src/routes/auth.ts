import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler'
import { loginSchema, registerSchema } from '../schemas/authSchemas'
import { findByEmail, createUser } from '../repositories/userRepository'
import { errors } from '../lib/errors'
import { hashPassword, verifyPassword } from '../lib/password'
import { env } from '../env'
import { createSession, deleteSessionByToken } from '../repositories/sessionRepository'
import { signAccessToken } from '../lib/tokens'
import { mapUser } from '../lib/mappers'
import { requireAuth } from '../middleware/auth'

export const authRouter = Router()

authRouter.post(
  '/register',
  asyncHandler(async (req, res) => {
    const body = registerSchema.parse(req.body)
    const existing = await findByEmail(body.email)
    if (existing) {
      throw errors.conflict('Email déjà utilisé')
    }
    const passwordHash = await hashPassword(body.password)
    const user = await createUser({ name: body.name, email: body.email, passwordHash })
    if (!user) throw errors.server('Echec création utilisateur')
    const session = await createSession({
      userId: user.id,
      ttlHours: env.sessionTtlHours,
      userAgent: req.headers['user-agent'] ?? null,
      ipAddress: req.ip ?? null,
    })
    const token = signAccessToken(session.token, user.id)
    res.status(201).json({
      user: mapUser(user),
      token,
      expiresAt: session.expiresAt,
    })
  }),
)

authRouter.post(
  '/login',
  asyncHandler(async (req, res) => {
    const body = loginSchema.parse(req.body)
    const user = await findByEmail(body.email)
    if (!user) throw errors.unauthorized('Identifiants invalides')
    const ok = await verifyPassword(body.password, user.password_hash)
    if (!ok) throw errors.unauthorized('Identifiants invalides')
    const session = await createSession({
      userId: user.id,
      ttlHours: env.sessionTtlHours,
      userAgent: req.headers['user-agent'] ?? null,
      ipAddress: req.ip ?? null,
    })
    const token = signAccessToken(session.token, user.id)
    res.json({
      user: mapUser(user),
      token,
      expiresAt: session.expiresAt,
    })
  }),
)

authRouter.post(
  '/logout',
  requireAuth,
  asyncHandler(async (req, res) => {
    if (req.authSessionToken) {
      await deleteSessionByToken(req.authSessionToken)
    }
    res.status(204).send()
  }),
)

authRouter.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({ user: req.user })
  }),
)
