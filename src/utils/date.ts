export function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function formatISODate(date: Date) {
  return date.toISOString().slice(0, 10)
}

export function humanDate(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  const weekday = d.toLocaleDateString('fr-FR', { weekday: 'long' })
  const label = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long' })
  return { weekday, label }
}

