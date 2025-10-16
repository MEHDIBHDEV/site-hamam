export type LogLevel = 'info' | 'warn' | 'error' | 'security'

declare global {
  interface Window { __LOGS__?: any[] }
}

export function logEvent(level: LogLevel, name: string, payload: Record<string, any> = {}) {
  const entry = {
    ts: new Date().toISOString(),
    level,
    name,
    payload,
  }
  if (level === 'error') console.error(`[${level}] ${name}`, payload)
  else if (level === 'warn') console.warn(`[${level}] ${name}`, payload)
  else console.log(`[${level}] ${name}`, payload)

  if (!window.__LOGS__) window.__LOGS__ = []
  window.__LOGS__!.push(entry)
  return entry
}

// Common event wrappers
export const events = {
  page_view: (payload: { page: string; referrer?: string | null }) => logEvent('info', 'page_view', payload),
  cta_click: (payload: { id: string; page: string }) => logEvent('info', 'cta_click', payload),
  service_view: (payload: { serviceId: string }) => logEvent('info', 'service_view', payload),
  service_add_to_reserve: (payload: { serviceId: string }) => logEvent('info', 'service_add_to_reserve', payload),
  reservation_attempt: (payload: { serviceId: string; dateISO: string; time: string; people: number }) =>
    logEvent('info', 'reservation_attempt', payload),
  reservation_conflict: (payload: { serviceId: string; dateISO: string; time: string }) =>
    logEvent('warn', 'reservation_conflict', payload),
  reservation_confirmed: (payload: { bookingId: string; amount: number }) =>
    logEvent('info', 'reservation_confirmed', payload),
  reservation_cancelled: (payload: { bookingId: string; reason: string }) =>
    logEvent('info', 'reservation_cancelled', payload),
  auth_signup: (payload: { method: 'email' }) => logEvent('security', 'auth_signup', payload),
  auth_login_success: (payload: { method: 'email' }) => logEvent('security', 'auth_login_success', payload),
  auth_login_failed: (payload: { method: 'email'; reason: string }) => logEvent('security', 'auth_login_failed', payload),
  form_validation_error: (payload: { formId: string; fields: string[] }) =>
    logEvent('warn', 'form_validation_error', payload),
}

