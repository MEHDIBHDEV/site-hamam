import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler'
import { logEventSchema } from '../schemas/logSchemas'
import { createLogEvent } from '../repositories/logRepository'
import { verifyAccessToken } from '../lib/tokens'
import { findSessionWithUser } from '../repositories/sessionRepository'

export const logsRouter = Router()

logsRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const body = logEventSchema.parse(req.body)
    let userId: number | null = null
    let sessionToken: string | null = body.sessionId ?? null
    const header = req.headers.authorization
    if (!sessionToken && header && header.startsWith('Bearer ')) {
      try {
        const token = header.slice('Bearer '.length)
        const payload = verifyAccessToken(token)
        const session = await findSessionWithUser(payload.sid)
        if (session) {
          userId = session.user.id
          sessionToken = session.session.token
        }
      } catch {
        // ignore auth errors for logging
      }
    }
    await createLogEvent({
      level: body.level,
      name: body.name,
      page: body.page ?? null,
      sessionId: sessionToken ?? null,
      userId: userId ?? null,
      payload: body.payload,
    })
    res.status(201).json({ ok: true })
  }),
)
