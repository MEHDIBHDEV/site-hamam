import { useState } from 'react'
import { Button } from '../ui/components/primitives/Button'
import { useAppStore } from '../store'
import { events } from '../utils/logging'
import { useToast } from '../providers/ToastProvider'

export default function Account() {
  const { user, login, logout, register, reservations, reservationsLoading, cancelReservation } = useAppStore()
  const { push } = useToast()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit() {
    if (!email.includes('@')) {
      push({ title: 'Email invalide', type: 'error' })
      return
    }
    if (!password || password.length < 8) {
      push({ title: 'Mot de passe trop court', description: '8 caractères minimum.', type: 'error' })
      return
    }
    setSubmitting(true)
    try {
      if (mode === 'register') {
        if (name.trim().length < 2) {
          push({ title: 'Nom requis', type: 'error' })
          setSubmitting(false)
          return
        }
        await register({ name: name.trim(), email, password })
        events.auth_signup({ method: 'email' })
      } else {
        await login({ email, password })
      }
      events.auth_login_success({ method: 'email' })
      setName('')
      setEmail('')
      setPassword('')
    } catch (error: any) {
      events.auth_login_failed({ method: 'email', reason: error?.message ?? 'unknown' })
      push({ title: 'Erreur', description: error?.message ?? 'Impossible de traiter la demande.', type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  if (!user)
    return (
      <div className="container-app py-10 space-y-6">
        <h1 className="font-display text-3xl">Mon compte</h1>
        <div className="max-w-md space-y-3">
          <div className="flex gap-2">
            <Button variant={mode === 'login' ? 'default' : 'outline'} onClick={() => setMode('login')}>
              Connexion
            </Button>
            <Button variant={mode === 'register' ? 'default' : 'outline'} onClick={() => setMode('register')}>
              Inscription
            </Button>
          </div>
          {mode === 'register' && (
            <input
              placeholder="Nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 w-full rounded-xl bg-surface/70 border border-border px-3 focus-ring"
            />
          )}
          <input
            placeholder="Email"
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 w-full rounded-xl bg-surface/70 border border-border px-3 focus-ring"
          />
          <input
            placeholder="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 w-full rounded-xl bg-surface/70 border border-border px-3 focus-ring"
          />
          <div className="flex gap-2">
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Patientez...' : mode === 'login' ? 'Se connecter' : "S'inscrire"}
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
        {reservationsLoading ? (
          <div className="rounded-xl border border-border bg-surface/60 p-6 text-textMuted">Chargement...</div>
        ) : reservations.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface/60 p-6 text-textMuted">
            Aucune réservation pour le moment.
          </div>
        ) : (
          <div className="space-y-3">
            {reservations.map((b) => (
              <div key={b.id} className="rounded-xl border border-border bg-surface/60 p-4 flex items-center justify-between">
                <div className="text-sm">
                  <div><span className="opacity-70">Service</span> {b.serviceTitle}</div>
                  <div><span className="opacity-70">Date</span> {b.dateISO} {b.time}</div>
                  <div><span className="opacity-70">Personnes</span> {b.people} • <span className="opacity-70">Total</span> {b.total.toFixed(2)} €</div>
                  <div className="opacity-70">Statut: {b.status}</div>
                </div>
                {b.status === 'confirmed' && (
                  <Button
                    variant="outline"
                    onClick={async () => {
                      try {
                        await cancelReservation(b.id)
                        events.reservation_cancelled({ bookingId: b.id.toString(), reason: 'user_action' })
                      } catch (error: any) {
                        push({ title: 'Erreur', description: error?.message ?? "Impossible d'annuler.", type: 'error' })
                      }
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
