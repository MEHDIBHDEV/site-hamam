import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Reservation, Service, User } from '../types'
import {
  apiCancelReservation,
  apiCreateReservation,
  apiFetchMe,
  apiFetchReservations,
  apiFetchServices,
  apiLogin,
  apiLogout,
  apiRegister,
  setAuthToken,
} from '../utils/api'
import { fallbackServices } from '../data/services'

type AuthCredentials = { email: string; password: string }
type RegisterPayload = AuthCredentials & { name: string }

type ReservationPayload = {
  serviceSlug: string
  dateISO: string
  time: string
  people: number
  note?: string | null
}

type Store = {
  services: Service[]
  servicesLoading: boolean
  user: User | null
  authLoading: boolean
  reservations: Reservation[]
  reservationsLoading: boolean
  register: (payload: RegisterPayload) => Promise<void>
  login: (payload: AuthCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshReservations: () => Promise<void>
  createReservation: (payload: ReservationPayload) => Promise<Reservation>
  cancelReservation: (id: number) => Promise<Reservation>
}

const Ctx = createContext<Store | null>(null)

const TOKEN_KEY = 'hr_token'

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [services, setServices] = useState<Service[]>(fallbackServices)
  const [servicesLoading, setServicesLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(Boolean(token))
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [reservationsLoading, setReservationsLoading] = useState(false)

  const persistToken = useCallback((value: string | null) => {
    setTokenState(value)
    setAuthToken(value)
    if (value) localStorage.setItem(TOKEN_KEY, value)
    else localStorage.removeItem(TOKEN_KEY)
  }, [])

  useEffect(() => {
    setAuthToken(token)
    if (!token) {
      setUser(null)
      setAuthLoading(false)
      setReservations([])
    }
  }, [token])

  useEffect(() => {
    let alive = true
    setServicesLoading(true)
    apiFetchServices()
      .then(({ services: remote }) => {
        if (alive) setServices(remote)
      })
      .catch(() => {
        if (alive) setServices(fallbackServices)
      })
      .finally(() => {
        if (alive) setServicesLoading(false)
      })
    return () => {
      alive = false
    }
  }, [])

  const loadUser = useCallback(async () => {
    if (!token) return
    try {
      setAuthLoading(true)
      const { user } = await apiFetchMe()
      setUser(user)
      await apiFetchReservations()
        .then(({ reservations }) => setReservations(reservations))
        .catch(() => setReservations([]))
    } catch {
      persistToken(null)
    } finally {
      setAuthLoading(false)
    }
  }, [token, persistToken])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const refreshReservations = useCallback(async () => {
    if (!token) return
    setReservationsLoading(true)
    try {
      const { reservations } = await apiFetchReservations()
      setReservations(reservations)
    } finally {
      setReservationsLoading(false)
    }
  }, [token])

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const { user, token } = await apiRegister(payload)
      setUser(user)
      persistToken(token)
      await refreshReservations()
    },
    [persistToken, refreshReservations],
  )

  const login = useCallback(
    async (payload: AuthCredentials) => {
      const { user, token } = await apiLogin(payload)
      setUser(user)
      persistToken(token)
      await refreshReservations()
    },
    [persistToken, refreshReservations],
  )

  const logout = useCallback(async () => {
    try {
      await apiLogout()
    } catch {
      // ignore
    } finally {
      persistToken(null)
      setUser(null)
      setReservations([])
    }
  }, [persistToken])

  const createReservation = useCallback(
    async (payload: ReservationPayload) => {
      const { reservation } = await apiCreateReservation(payload)
      setReservations((prev) => [reservation, ...prev])
      return reservation
    },
    [],
  )

  const cancelReservation = useCallback(async (id: number) => {
    const { reservation } = await apiCancelReservation(id)
    setReservations((prev) => prev.map((r) => (r.id === id ? reservation : r)))
    return reservation
  }, [])

  const value = useMemo<Store>(
    () => ({
      services,
      servicesLoading,
      user,
      authLoading,
      reservations,
      reservationsLoading,
      register,
      login,
      logout,
      refreshReservations,
      createReservation,
      cancelReservation,
    }),
    [
      services,
      servicesLoading,
      user,
      authLoading,
      reservations,
      reservationsLoading,
      register,
      login,
      logout,
      refreshReservations,
      createReservation,
      cancelReservation,
    ],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAppStore() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAppStore must be used within AppStoreProvider')
  return ctx
}
