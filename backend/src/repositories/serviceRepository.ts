import { queryRows } from '../db/client'
import type { ServiceRow } from '../types/db'

export async function listActiveServices() {
  return queryRows<ServiceRow>('SELECT * FROM services WHERE is_active = 1 ORDER BY is_signature DESC, title ASC')
}

export async function findBySlug(slug: string) {
  const rows = await queryRows<ServiceRow>('SELECT * FROM services WHERE slug = :slug LIMIT 1', { slug })
  return rows[0] ?? null
}

export async function findById(id: number) {
  const rows = await queryRows<ServiceRow>('SELECT * FROM services WHERE id = :id LIMIT 1', { id })
  return rows[0] ?? null
}
