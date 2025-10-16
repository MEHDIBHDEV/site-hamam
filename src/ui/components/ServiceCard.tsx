import { Service } from '../../types'
import { Card, CardContent } from './primitives/Card'
import { Badge } from './primitives/Badge'
import { Button } from './primitives/Button'
import { events } from '../../utils/logging'
import { motion } from 'framer-motion'

export default function ServiceCard({ service, onReserve, onQuickView }: { service: Service; onReserve: () => void; onQuickView: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="overflow-hidden">
        <div className="relative">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              const fallback = service.image.replace(/\.jpg$/i, '.svg')
              if ((e.currentTarget as HTMLImageElement).src.endsWith('.jpg')) {
                ;(e.currentTarget as HTMLImageElement).src = fallback
              }
            }}
          />
          <div className="absolute top-3 left-3 flex gap-2">
            {service.isSignature && <Badge>Signature</Badge>}
            {service.tags?.map((t) => (
              <Badge key={t} className="bg-eucalyptus/10 border-eucalyptus/30 text-eucalyptus">
                {t}
              </Badge>
            ))}
          </div>
        </div>
        <CardContent className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-display text-lg">{service.title}</div>
              <div className="text-sm text-textMuted">{service.durationMin} min</div>
            </div>
            <div className="text-gold font-medium">{service.price.toFixed(0)} €</div>
          </div>
          <div className="text-sm opacity-80 line-clamp-2">{service.description}</div>
          <div className="flex gap-2">
            <Button onClick={() => { events.service_add_to_reserve({ serviceId: service.id }); onReserve() }}>Réserver</Button>
            <Button variant="outline" onClick={onQuickView}>Quick view</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
