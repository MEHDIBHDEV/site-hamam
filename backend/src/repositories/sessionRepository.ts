import { execute, queryRows } from '../db/client'
import { createSessionToken } from '../lib/tokens'
import type { SessionRow, UserRow } from '../types/db'

const TTL_MS = (hours: number) => hours * 60 * 60 * 1000

export async function createSession({
  userId,
  ttlHours,
  userAgent,
  ipAddress,
}: {
  userId: number
  ttlHours: number
  userAgent?: string | null
  ipAddress?: string | null
}) {
  const token = createSessionToken()
  const expiresAt = new Date(Date.now() + TTL_MS(ttlHours))
  await execute(
    `INSERT INTO sessions (user_id, token, user_agent, ip_address, expires_at)
     VALUES (:userId, :token, :userAgent, :ipAddress, :expiresAt)`,
    { userId, token, userAgent, ipAddress, expiresAt },
  )
  return { token, expiresAt }
}

export async function deleteSessionByToken(token: string) {
  await execute('DELETE FROM sessions WHERE token = :token', { token })
}

export type SessionWithUser = {
  session: SessionRow
  user: UserRow
}

export async function findSessionWithUser(token: string): Promise<SessionWithUser | null> {
  const rows = await queryRows<
    SessionRow & {
      user_name: string
      user_email: string
      user_password_hash: string
      user_created_at: string
      user_updated_at: string
    }
  >(
    `SELECT s.*, u.name as user_name, u.email as user_email, u.password_hash as user_password_hash,
            u.created_at as user_created_at, u.updated_at as user_updated_at
     FROM sessions s
     INNER JOIN users u ON u.id = s.user_id
     WHERE s.token = :token AND s.expires_at > NOW()`,
    { token },
  )
  const row = rows[0]
  if (!row) return null
  const session: SessionRow = {
    id: row.id,
    user_id: row.user_id,
    token: row.token,
    user_agent: row.user_agent,
    ip_address: row.ip_address,
    created_at: row.created_at,
    expires_at: row.expires_at,
  }
  const user: UserRow = {
    id: row.user_id,
    name: row.user_name,
    email: row.user_email,
    password_hash: row.user_password_hash,
    created_at: row.user_created_at,
    updated_at: row.user_updated_at,
  }
  return { session, user }
}
