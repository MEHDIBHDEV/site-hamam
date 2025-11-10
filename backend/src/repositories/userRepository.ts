import { queryRows, execute } from '../db/client'
import type { UserRow } from '../types/db'

export async function findByEmail(email: string) {
  const rows = await queryRows<UserRow & any>('SELECT * FROM users WHERE email = :email LIMIT 1', { email })
  return rows[0] ?? null
}

export async function findById(id: number) {
  const rows = await queryRows<UserRow & any>('SELECT * FROM users WHERE id = :id LIMIT 1', { id })
  return rows[0] ?? null
}

export async function createUser({ name, email, passwordHash }: { name: string; email: string; passwordHash: string }) {
  const result = await execute(
    'INSERT INTO users (name, email, password_hash) VALUES (:name, :email, :passwordHash)',
    { name, email, passwordHash },
  )
  return findById(result.insertId)
}
