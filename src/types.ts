export type Service = {
  id: number
  title: string
  slug: string
  description: string | null
  durationMin: number
  price: number
  priceCents: number
  image: string
  tags: string[]
  isSignature: boolean
  isActive: boolean
}

export type ReservationStatus = 'pending' | 'confirmed' | 'canceled'

export type Reservation = {
  id: number
  serviceId: number
  serviceSlug: string
  serviceTitle: string
  startAt: string
  dateISO: string
  time: string
  people: number
  total: number
  totalCents: number
  status: ReservationStatus
  note: string | null
}

export type User = {
  id: number
  name: string
  email: string
}
