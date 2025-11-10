import type { PublicUser } from '.'

declare global {
  namespace Express {
    interface Request {
      user?: PublicUser
      authSessionToken?: string
    }
  }
}

export {}
