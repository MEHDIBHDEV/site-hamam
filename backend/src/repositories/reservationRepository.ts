import { execute, queryRows } from '../db/client'
import type { ReservationRow } from '../types/db'

export type ReservationWithServiceRow = ReservationRow & {
  service_slug: string
  service_title: string
}

export async function listForUser(userId: number) {
  const rows = await queryRows<ReservationWithServiceRow>(
    `SELECT r.*, s.slug as service_slug, s.title as service_title
     FROM reservations r
     INNER JOIN services s ON s.id = r.service_id
     WHERE r.user_id = :userId
     ORDER BY r.start_at DESC`,
    { userId },
  )
  return rows
}

export async function createReservation({
  userId,
  serviceId,
  startAt,
  people,
  totalCents,
  note,
}: {
  userId: number
  serviceId: number
  startAt: Date
  people: number
  totalCents: number
  note?: string | null
}) {
  const result = await execute(
    `INSERT INTO reservations (user_id, service_id, start_at, people, total_cents, status, note)
     VALUES (:userId, :serviceId, :startAt, :people, :totalCents, 'confirmed', :note)`,
    { userId, serviceId, startAt, people, totalCents, note },
  )
  const rows = await queryRows<ReservationWithServiceRow>(
    `SELECT r.*, s.slug as service_slug, s.title as service_title
     FROM reservations r
     INNER JOIN services s ON s.id = r.service_id
     WHERE r.id = :id`,
    { id: result.insertId },
  )
  const row = rows[0]
  if (!row) {
    throw new Error('Reservation lookup failed')
  }
  return row
}

export async function findByIdForUser(id: number, userId: number) {
  const rows = await queryRows<ReservationWithServiceRow>(
    `SELECT r.*, s.slug as service_slug, s.title as service_title
     FROM reservations r
     INNER JOIN services s ON s.id = r.service_id
     WHERE r.id = :id AND r.user_id = :userId
     LIMIT 1`,
    { id, userId },
  )
  return rows[0] ?? null
}

export async function cancelReservation(id: number, userId: number) {
  await execute(
    `UPDATE reservations
     SET status = 'canceled'
     WHERE id = :id AND user_id = :userId`,
    { id, userId },
  )
}
