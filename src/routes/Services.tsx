import { useMemo, useState } from 'react'
import { services as allServices } from '../data/services'
import ServiceCard from '../ui/components/ServiceCard'
import QuickViewService from '../ui/components/QuickViewService'

export default function Services() {
  const [q, setQ] = useState('')
  const [maxPrice, setMaxPrice] = useState<number | null>(null)
  const [minDuration, setMinDuration] = useState<number | null>(null)
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const filtered = useMemo(() => {
    return allServices.filter((s) =>
      (q ? s.title.toLowerCase().includes(q.toLowerCase()) : true) &&
      (maxPrice ? s.price <= maxPrice : true) &&
      (minDuration ? s.durationMin >= minDuration : true),
    )
  }, [q, maxPrice, minDuration])
  const service = allServices.find((s) => s.id === selected) || null

  return (
    <div className="container-app py-10 space-y-6">
      <h1 className="font-display text-3xl">Catalogue</h1>
      <div className="grid md:grid-cols-3 gap-3">
        <input
          placeholder="Rechercher…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="h-11 rounded-xl bg-surface/70 border border-border px-3 focus-ring"
        />
        <select
          value={maxPrice ?? ''}
          onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : null)}
          className="h-11 rounded-xl bg-surface/70 border border-border px-3 focus-ring"
        >
          <option value="">Prix max</option>
          <option value="50">50 €</option>
          <option value="70">70 €</option>
          <option value="100">100 €</option>
        </select>
        <select
          value={minDuration ?? ''}
          onChange={(e) => setMinDuration(e.target.value ? Number(e.target.value) : null)}
          className="h-11 rounded-xl bg-surface/70 border border-border px-3 focus-ring"
        >
          <option value="">Durée min</option>
          <option value="45">45 min</option>
          <option value="60">60 min</option>
          <option value="90">90 min</option>
        </select>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((s) => (
          <ServiceCard
            key={s.id}
            service={s}
            onReserve={() => (window.location.href = '/reservation')}
            onQuickView={() => {
              setSelected(s.id)
              setOpen(true)
            }}
          />
        ))}
      </div>

      <QuickViewService open={open} onClose={() => setOpen(false)} service={service} onReserve={() => (window.location.href = '/reservation')} />
    </div>
  )
}

