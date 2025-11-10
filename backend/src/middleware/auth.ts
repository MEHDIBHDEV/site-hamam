import type { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../lib/tokens'
import { errors } from '../lib/errors'
import { findSessionWithUser } from '../repositories/sessionRepository'
import { mapUser } from '../lib/mappers'

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization
    if (!header || !header.startsWith('Bearer ')) {
      throw errors.unauthorized()
    }
    const token = header.slice('Bearer '.length)
    const payload = verifyAccessToken(token)
    const session = await findSessionWithUser(payload.sid)
    if (!session) {
      throw errors.unauthorized('Session expired')
    }
    req.user = mapUser(session.user)
    req.authSessionToken = session.session.token
    next()
  } catch (err) {
    if ((err as any).name === 'JsonWebTokenError' || (err as any).name === 'TokenExpiredError') {
      next(errors.unauthorized('Invalid token'))
      return
    }
    next(err)
  }
}
