import { z } from 'zod'

export const logEventSchema = z.object({
  level: z.enum(['info', 'warn', 'error', 'security']),
  name: z.string().min(1),
  page: z.string().optional().nullable(),
  sessionId: z.string().max(64).optional().nullable(),
  payload: z.unknown().optional(),
})

export type LogEventInput = z.infer<typeof logEventSchema>
