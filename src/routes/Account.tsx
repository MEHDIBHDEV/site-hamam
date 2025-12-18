import { useState } from 'react'
import { Button } from '../ui/components/primitives/Button'
import { useAppStore } from '../store'
import { events } from '../utils/logging'
import { useToast } from '../providers/ToastProvider'

type Reservation = {
  id: number
  serviceTitle: string
  dateISO: string
  time: string
  people: number
  total: number
  status: 'confirmed' | 'cancelled' | 'pending' | string
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export default function Account() {
  const { user, login, logout, register, reservations, reservationsLoading, cancelReservation } = useAppStore()
  const { push } = useToast()

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit() {
    if (submitting) return

    const cleanEmail = email.trim().toLowerCase()
    const cleanName = name.trim()

    if (!cleanEmail.includes('@')) {
      push({ title: 'Email invalide', type: 'error' })
      return
    }
    if (!password || password.length < 8) {
      push({ title: 'Mot de passe trop court', description: '8 caracteres minimum.', type: 'error' })
      return
    }
    if (mode === 'register' && cleanName.length < 2) {
      push({ title: 'Nom requis', description: '2 caracteres minimum.', type: 'error' })
      return
    }

    setSubmitting(true)
    try {
      if (mode === 'register') {
        await register({ name: cleanName, email: cleanEmail, password })
        events.auth_signup({ method: 'email' })
      } else {
        await login({ email: cleanEmail, password })
      }

      events.auth_login_success({ method: 'email' })
      setName('')
      setEmail('')
      setPassword('')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Impossible de traiter la demande.'
      events.auth_login_failed({ method: 'email', reason: message })
      push({ title: 'Erreur', description: message, type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const onEnterSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') void handleSubmit()
  }

  if (!user) {
    const tabBase = 'px-4 h-11 rounded-xl border border-border transition focus-ring'
    const tabActive = 'bg-white text-black'
    const tabInactive = 'bg-transparent text-white/80 hover:bg-white/10'

    return (
      <div className="container-app py-10 space-y-6">
        <h1 className="font-display text-3xl">Mon compte</h1>

        <div className="max-w-md space-y-3">
          <div className="flex gap-2">
            <Button className={cx(tabBase, mode === 'login' ? tabActive : tabInactive)} onClick={() => setMode('login')}>
              Connexion
            </Button>
            <Button
              className={cx(tabBase, mode === 'register' ? tabActive : tabInactive)}
              onClick={() => setMode('register')}
            >
              Inscription
            </Button>
          </div>

          {mode === 'register' && (
            <input
              placeholder="Nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={onEnterSubmit}
              className="h-11 w-full rounded-xl bg-surface/70 border border-border px-3 focus-ring"
              autoComplete="name"
            />
          )}

          <input
            placeholder="Email"
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={onEnterSubmit}
            className="h-11 w-full rounded-xl bg-surface/70 border border-border px-3 focus-ring"
            autoComplete="email"
          />

          <input
            placeholder="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={onEnterSubmit}
            className="h-11 w-full rounded-xl bg-surface/70 border border-border px-3 focus-ring"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />

          <div className="flex gap-2">
            <Button onClick={() => void handleSubmit()} disabled={submitting}>
              {submitting ? 'Patientez...' : mode === 'login' ? 'Se connecter' : "S'inscrire"}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const list = (reservations ?? []) as Reservation[]

  return (
    <div className="container-app py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Bonjour {user.name}</h1>
        <Button onClick={logout}>Se deconnecter</Button>
      </div>

      <section className="space-y-3">
        <h2 className="font-display text-xl">Mes reservations</h2>

        {reservationsLoading ? (
          <div className="rounded-xl border border-border bg-surface/60 p-6 text-textMuted">Chargement...</div>
        ) : list.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface/60 p-6 text-textMuted">
            Aucune reservation pour le moment.
          </div>
        ) : (
          <div className="space-y-3">
            {list.map((b) => (
              <div
                key={b.id}
                className="rounded-xl border border-border bg-surface/60 p-4 flex items-center justify-between"
              >
                <div className="text-sm">
                  <div>
                    <span className="opacity-70">Service</span> {b.serviceTitle}
                  </div>
                  <div>
                    <span className="opacity-70">Date</span> {b.dateISO} {b.time}
                  </div>
                  <div>
                    <span className="opacity-70">Personnes</span> {b.people} - <span className="opacity-70">Total</span>{' '}
                    {Number(b.total).toFixed(2)} EUR
                  </div>
                  <div className="opacity-70">Statut: {b.status}</div>
                </div>

                {b.status === 'confirmed' && (
                  <Button
                    onClick={async () => {
                      try {
                        await cancelReservation(b.id)
                        events.reservation_cancelled({ bookingId: String(b.id), reason: 'user_action' })
                      } catch (error: unknown) {
                        const message = error instanceof Error ? error.message : "Impossible d'annuler."
                        push({ title: 'Erreur', description: message, type: 'error' })
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
