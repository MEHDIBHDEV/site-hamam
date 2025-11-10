import { z } from 'zod'

export const createReservationSchema = z.object({
  serviceSlug: z.string().min(1),
  dateISO: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'dateISO must be YYYY-MM-DD'),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'time must be HH:mm'),
  people: z.number().int().min(1).max(8),
  note: z.string().max(500).optional().nullable(),
})

export const cancelReservationSchema = z.object({
  id: z.preprocess((val) => Number(val), z.number().int().positive()),
})

export type CreateReservationInput = z.infer<typeof createReservationSchema>
