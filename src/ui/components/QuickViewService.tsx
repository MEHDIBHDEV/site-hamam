import { useEffect } from 'react'
import { Service } from '../../types'
import { Dialog } from './primitives/Dialog'
import { Button } from './primitives/Button'
import { events } from '../../utils/logging'

export default function QuickViewService({ open, onClose, service, onReserve }: { open: boolean; onClose: () => void; service: Service | null; onReserve: () => void }) {
  if (!service) return null
  useEffect(() => {
    if (open && service) {
      events.service_view({ serviceId: service.id })
    }
  }, [open, service])
  return (
    <Dialog open={open} onClose={onClose}>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <img
            src={service.image}
            alt=""
            className="w-20 h-20 rounded-xl object-cover"
            onError={(e) => {
              const el = e.currentTarget as HTMLImageElement
              if (el.src.endsWith('.jpg')) el.src = service.image.replace(/\.jpg$/i, '.svg')
            }}
          />
          <div>
            <div className="font-display text-xl">{service.title}</div>
            <div className="text-textMuted text-sm">{service.durationMin} min • {service.price} €</div>
          </div>
        </div>
        <p className="opacity-90 text-sm">{service.description}</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Fermer</Button>
          <Button onClick={() => { onReserve(); onClose() }}>Réserver</Button>
        </div>
      </div>
    </Dialog>
  )
}
