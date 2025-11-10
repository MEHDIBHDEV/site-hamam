import type { ResultSetHeader } from 'mysql2/promise'
import { pool } from './pool'

export async function queryRows<Row>(sql: string, params?: Record<string, any>) {
  const [rows] = await pool.query(sql, params)
  return rows as Row[]
}

export async function execute(sql: string, params?: Record<string, any>) {
  const [result] = await pool.execute(sql, params)
  return result as ResultSetHeader
}
