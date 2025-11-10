import { ReservationRow, ServiceRow, UserRow } from '../types/db'
import { PublicUser, ReservationDto, ServiceDto } from '../types'
import { getServiceMeta } from './serviceMeta'

export function mapUser(row: UserRow): PublicUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function mapService(row: ServiceRow): ServiceDto {
  const meta = getServiceMeta(row.slug)
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    durationMin: row.duration_min,
    priceCents: row.price_cents,
    price: row.price_cents / 100,
    isSignature: !!row.is_signature,
    isActive: !!row.is_active,
    image: meta.image,
    tags: meta.tags,
  }
}

type ReservationRowWithService = ReservationRow & {
  service_slug: string
  service_title: string
}

export function mapReservation(row: ReservationRowWithService): ReservationDto {
  const start = new Date(row.start_at)
  const dateISO = start.toISOString().slice(0, 10)
  const time = start.toISOString().slice(11, 16)
  return {
    id: row.id,
    serviceId: row.service_id,
    serviceSlug: row.service_slug,
    serviceTitle: row.service_title,
    startAt: row.start_at,
    dateISO,
    time,
    people: row.people,
    status: row.status,
    totalCents: row.total_cents,
    total: row.total_cents / 100,
    note: row.note,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
