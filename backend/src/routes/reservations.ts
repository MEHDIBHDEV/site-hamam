import { Router } from 'express'
import { asyncHandler } from '../middleware/asyncHandler'
import { requireAuth } from '../middleware/auth'
import { createReservationSchema, cancelReservationSchema } from '../schemas/reservationSchemas'
import { listForUser, createReservation, cancelReservation, findByIdForUser } from '../repositories/reservationRepository'
import { findBySlug } from '../repositories/serviceRepository'
import { errors } from '../lib/errors'
import { mapReservation } from '../lib/mappers'
import { createLogEvent } from '../repositories/logRepository'

const router = Router()

router.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const rows = await listForUser(req.user!.id)
    res.json({ reservations: rows.map(mapReservation) })
  }),
)

function combineDateTime(dateISO: string, time: string) {
  const [year, month, day] = dateISO.split('-').map(Number) as [number, number, number]
  const [hour, minute] = time.split(':').map(Number) as [number, number]
  return new Date(Date.UTC(year, month - 1, day, hour, minute, 0))
}

router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const body = createReservationSchema.parse(req.body)
    const service = await findBySlug(body.serviceSlug)
    if (!service || !service.is_active) {
      throw errors.badRequest('Service indisponible')
    }
    const startAt = combineDateTime(body.dateISO, body.time)
    const totalCents = service.price_cents * body.people
    try {
      const reservation = await createReservation({
        userId: req.user!.id,
        serviceId: service.id,
        startAt,
        people: body.people,
        totalCents,
        note: body.note ?? null,
      })
      await createLogEvent({
        level: 'info',
        name: 'reservation_confirmed',
        sessionId: req.authSessionToken ?? null,
        userId: req.user!.id,
        page: '/reservation',
        payload: {
          reservationId: reservation.id,
          serviceSlug: reservation.service_slug,
          people: reservation.people,
          totalCents,
        },
      })
      res.status(201).json({ reservation: mapReservation(reservation) })
    } catch (err: any) {
      if (err?.code === 'ER_DUP_ENTRY') {
        throw errors.conflict('Ce créneau est déjà réservé')
      }
      throw err
    }
  }),
)

router.patch(
  '/:id/cancel',
  requireAuth,
  asyncHandler(async (req, res) => {
    const params = cancelReservationSchema.parse({ id: req.params.id })
    const existing = await findByIdForUser(params.id, req.user!.id)
    if (!existing) throw errors.notFound('Réservation introuvable')
    if (existing.status === 'canceled') {
      return res.json({ reservation: mapReservation(existing) })
    }
    await cancelReservation(params.id, req.user!.id)
    await createLogEvent({
      level: 'info',
      name: 'reservation_cancelled',
      sessionId: req.authSessionToken ?? null,
      userId: req.user!.id,
      page: '/account',
      payload: { reservationId: existing.id, reason: 'user_action' },
    })
    const updated = await findByIdForUser(params.id, req.user!.id)
    if (!updated) throw errors.server('Impossible de retrouver la réservation')
    res.json({ reservation: mapReservation(updated) })
  }),
)

export const reservationsRouter = router
