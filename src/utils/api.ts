import { Reservation, Service, User } from '../types'

const envApiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim()
const API_BASE = (envApiUrl && envApiUrl.length > 0 ? envApiUrl : 'http://localhost:4000/api').replace(/\/+$/, '')

let authToken: string | null = null

export function setAuthToken(token: string | null) {
  authToken = token
}

type RequestOptions = RequestInit & { skipAuth?: boolean }

async function request<T>(path: string, options: RequestOptions = {}) {
  const { skipAuth, ...init } = options
  const headers = new Headers(init.headers || {})
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }
  if (!skipAuth && authToken) {
    headers.set('Authorization', `Bearer ${authToken}`)
  }

  const payload =
    init.body && typeof init.body === 'object' && !(init.body instanceof FormData)
      ? JSON.stringify(init.body)
      : init.body

  let response: Response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers,
      body: payload,
    })
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : 'Network error'
    throw new Error(`API unreachable (${reason})`)
  }

  let data: any = null
  if (response.status !== 204) {
    try {
      data = await response.json()
    } catch {
      data = null
    }
  }

  if (!response.ok) {
    const message = data?.message ?? 'Erreur serveur'
    const error = new Error(message)
    ;(error as any).status = response.status
    ;(error as any).details = data?.details
    throw error
  }

  return data as T
}

type AuthResponse = {
  user: User
  token: string
}

export function apiRegister(payload: { name: string; email: string; password: string }) {
  return request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: payload,
    skipAuth: true,
  })
}

export function apiLogin(payload: { email: string; password: string }) {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: payload,
    skipAuth: true,
  })
}

export function apiLogout() {
  return request<void>('/auth/logout', { method: 'POST' })
}

export function apiFetchMe() {
  return request<{ user: User }>('/auth/me')
}

export function apiFetchServices() {
  return request<{ services: Service[] }>('/services', { method: 'GET', skipAuth: true })
}

export function apiFetchReservations() {
  return request<{ reservations: Reservation[] }>('/reservations')
}

export function apiCreateReservation(payload: {
  serviceSlug: string
  dateISO: string
  time: string
  people: number
  note?: string | null
}) {
  return request<{ reservation: Reservation }>('/reservations', { method: 'POST', body: payload })
}

export function apiCancelReservation(id: number) {
  return request<{ reservation: Reservation }>(`/reservations/${id}/cancel`, { method: 'PATCH' })
}

export function apiSendLog(payload: {
  level: 'info' | 'warn' | 'error' | 'security'
  name: string
  page?: string
  sessionId?: string
  userId?: number
  data?: Record<string, any>
}) {
  return request<{ ok: boolean }>('/logs', {
    method: 'POST',
    body: {
      level: payload.level,
      name: payload.name,
      page: payload.page,
      sessionId: payload.sessionId,
      payload: payload.data,
    },
    skipAuth: true,
  })
}
