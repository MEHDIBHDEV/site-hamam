export type Service = {
  id: string
  title: string
  slug: string
  description: string
  durationMin: number
  price: number
  image: string
  tags: string[]
  isSignature: boolean
}

export type BookingStatus = 'pending' | 'confirmed' | 'canceled'

export type Booking = {
  id: string
  serviceId: string
  userId?: string
  dateISO: string // YYYY-MM-DD
  time: string // HH:mm
  people: number
  total: number
  status: BookingStatus
}

export type User = {
  id: string
  name: string
  email: string
}

