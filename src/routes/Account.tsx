import { useState } from 'react'
import { Button } from '../ui/components/primitives/Button'
import { useAppStore } from '../store'
import { events } from '../utils/logging'

export default function Account() {
  const { user, login, logout, bookings, cancelBooking } = useAppStore()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')

  if (!user)
    return (
      <div className="container-app py-10 space-y-6">
        <h1 className="font-display text-3xl">Mon compte</h1>
        <div className="max-w-md space-y-3">
          <input
            placeholder="Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 w-full rounded-xl bg-surface/70 border border-border px-3 focus-ring"
          />
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 w-full rounded-xl bg-surface/70 border border-border px-3 focus-ring"
          />
          <div className="flex gap-2">
            <Button
              onClick={() => {
                if (!email.includes('@')) {
                  events.auth_login_failed({ method: 'email', reason: 'invalid_email' })
                  return
                }
                events.auth_signup({ method: 'email' })
                events.auth_login_success({ method: 'email' })
                login({ id: Math.random().toString(36).slice(2), name: name || 'Client', email })
              }}
            >
              Se connecter / S'inscrire
            </Button>
          </div>
        </div>
      </div>
    )

  return (
    <div className="container-app py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Bonjour {user.name}</h1>
        <Button variant="outline" onClick={logout}>Se déconnecter</Button>
      </div>
      <section className="space-y-3">
        <h2 className="font-display text-xl">Mes réservations</h2>
        {bookings.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface/60 p-6 text-textMuted">
            Aucune réservation pour le moment.
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <div key={b.id} className="rounded-xl border border-border bg-surface/60 p-4 flex items-center justify-between">
                <div className="text-sm">
                  <div><span className="opacity-70">Date</span> {b.dateISO} {b.time}</div>
                  <div><span className="opacity-70">Personnes</span> {b.people} • <span className="opacity-70">Total</span> {b.total} €</div>
                  <div className="opacity-70">Statut: {b.status}</div>
                </div>
                {b.status === 'confirmed' && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      cancelBooking(b.id)
                      events.reservation_cancelled({ bookingId: b.id, reason: 'user_action' })
                    }}
                  >
                    Annuler
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
