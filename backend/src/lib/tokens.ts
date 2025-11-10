import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { env } from '../env'

export function createSessionToken() {
  return crypto.randomBytes(32).toString('hex')
}

export type AccessTokenPayload = {
  sid: string
  sub: number
  iat: number
  exp: number
}

export function signAccessToken(sessionToken: string, userId: number) {
  return jwt.sign(
    {
      sid: sessionToken,
      sub: userId,
    },
    env.jwtSecret,
    { expiresIn: `${env.sessionTtlHours}h` },
  )
}

function isAccessPayload(payload: any): payload is AccessTokenPayload {
  return (
    payload &&
    typeof payload === 'object' &&
    'sid' in payload &&
    'sub' in payload
  )
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const payload = jwt.verify(token, env.jwtSecret)
  if (!isAccessPayload(payload)) {
    throw new Error('Invalid token payload')
  }
  return payload
}
