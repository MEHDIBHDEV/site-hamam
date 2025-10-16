// Generate 7 days of slots every 30 minutes 10:00–20:00 with random unavailability

export type Slot = { dateISO: string; time: string; available: boolean }

export function generateSlots(): Slot[] {
  const slots: Slot[] = []
  const now = new Date()
  for (let d = 0; d < 7; d++) {
    const date = new Date(now)
    date.setDate(now.getDate() + d)
    const dateISO = date.toISOString().slice(0, 10)
    for (let h = 10; h <= 20; h++) {
      for (let m = 0; m < 60; m += 30) {
        if (h === 20 && m > 0) continue
        const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
        const seed = (d * 100 + h * 2 + (m === 30 ? 1 : 0)) % 7
        const available = seed !== 0 && seed !== 3 // simulate some unavailable
        slots.push({ dateISO, time, available })
      }
    }
  }
  return slots
}

export function findAlternatives(slots: Slot[], dateISO: string, time: string, count = 3) {
  const times = slots.filter((s) => s.dateISO === dateISO && s.available).map((s) => s.time)
  // Find closest times lexicographically around target
  times.sort()
  const idx = times.findIndex((t) => t >= time)
  const candidates = [times[idx - 1], times[idx], times[idx + 1], times[idx + 2], times[idx - 2]].filter(
    Boolean,
  ) as string[]
  const uniq: string[] = []
  for (const t of candidates) if (!uniq.includes(t)) uniq.push(t)
  return uniq.slice(0, count)
}

