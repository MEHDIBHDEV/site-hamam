import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/components/primitives/Button'
import ServiceCard from '../ui/components/ServiceCard'
import { useState } from 'react'
import QuickViewService from '../ui/components/QuickViewService'
import { events } from '../utils/logging'
import { useAppStore } from '../store'

export default function Home() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const { services, servicesLoading } = useAppStore()
  const service = services.find((s) => s.id === selected) || null

  return (
    <div>
      <section className="relative h-[70vh] grid place-items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="/img/steam-hero.svg" alt="" className="w-full h-full object-cover opacity-60" />
        </div>
        <div className="relative container-app text-center space-y-6">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-tight">
            Hammam Benkachour — L’art du bien-être marocain
          </h1>
          <p className="text-textMuted max-w-2xl mx-auto">
            Une expérience premium mêlant tradition et modernité. Découvrez nos rituels signature et réservez votre moment de détente.
          </p>
          <Button
            size="lg"
            onClick={() => {
              events.cta_click({ id: 'hero_reserver', page: 'home' })
              navigate('/reservation')
            }}
          >
            Réserver maintenant
          </Button>
        </div>
      </section>

      <section className="container-app py-12 space-y-6">
        <h2 className="font-display text-2xl">Nos services signature</h2>
        {servicesLoading ? (
          <div className="text-textMuted text-sm">Chargement des services...</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 3).map((s) => (
              <ServiceCard
                key={s.id}
                service={s}
                onReserve={() => navigate('/reservation')}
                onQuickView={() => {
                  setSelected(s.id)
                  setOpen(true)
                }}
              />
            ))}
          </div>
        )}
      </section>

      <section className="container-app pb-16 space-y-6">
        <h2 className="font-display text-2xl">Ils nous font confiance</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 opacity-70">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 rounded-xl border border-border bg-surface/50 grid place-items-center">
              <span className="text-sm">Marque {i + 1}</span>
            </div>
          ))}
        </div>
      </section>

      <QuickViewService
        open={open}
        onClose={() => setOpen(false)}
        service={service}
        onReserve={() => navigate('/reservation')}
      />
    </div>
  )
}
