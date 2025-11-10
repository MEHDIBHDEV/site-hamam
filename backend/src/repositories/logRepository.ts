import { execute } from '../db/client'

export async function createLogEvent({
  level,
  name,
  page,
  sessionId,
  userId,
  payload,
}: {
  level: 'info' | 'warn' | 'error' | 'security'
  name: string
  page?: string | null
  sessionId?: string | null
  userId?: number | null
  payload?: any
}) {
  await execute(
    `INSERT INTO log_events (level, name, page, session_id, user_id, payload, ts)
     VALUES (:level, :name, :page, :sessionId, :userId, CAST(:payload AS JSON), NOW())`,
    { level, name, page, sessionId, userId, payload: JSON.stringify(payload ?? {}) },
  )
}
