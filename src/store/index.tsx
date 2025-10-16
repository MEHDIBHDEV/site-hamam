import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Booking, User } from '../types'

type Store = {
  bookings: Booking[]
  addBooking: (b: Omit<Booking, 'status'> & { status?: Booking['status'] }) => void
  cancelBooking: (id: string) => void
  user: User | null
  login: (u: User) => void
  logout: () => void
}

const Ctx = createContext<Store | null>(null)

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('hr_user')
    if (saved) setUser(JSON.parse(saved))
  }, [])

  const value: Store = useMemo(
    () => ({
      bookings,
      addBooking: (b) => setBookings((prev) => [...prev, { ...b, status: b.status ?? 'confirmed' } as Booking]),
      cancelBooking: (id) => setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'canceled' } : b))),
      user,
      login: (u) => {
        setUser(u)
        localStorage.setItem('hr_user', JSON.stringify(u))
      },
      logout: () => {
        setUser(null)
        localStorage.removeItem('hr_user')
      },
    }),
    [bookings, user],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAppStore() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAppStore must be used within AppStoreProvider')
  return ctx
}

