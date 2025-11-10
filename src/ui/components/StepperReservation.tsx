import { useEffect, useMemo, useState } from 'react'
import { Button } from './primitives/Button'
import DatePicker from './DatePicker'
import TimePicker from './TimePicker'
import { Slot, findAlternatives, generateSlots } from '../../utils/slots'
import { useToast } from '../../providers/ToastProvider'
import { events } from '../../utils/logging'
import { useAppStore } from '../../store'
import { useNavigate } from 'react-router-dom'

export default function StepperReservation() {
  const [step, setStep] = useState(1)
  const [serviceSlug, setServiceSlug] = useState('')
  const [dateISO, setDateISO] = useState(new Date().toISOString().slice(0, 10))
  const [time, setTime] = useState<string | null>(null)
  const [people, setPeople] = useState(1)
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { push } = useToast()
  const { services, servicesLoading, user, createReservation } = useAppStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!serviceSlug && services.length > 0) {
      setServiceSlug(services[0].slug)
    }
  }, [services, serviceSlug])

  const currentService = services.find((s) => s.slug === serviceSlug)
  const allSlots = useMemo(() => generateSlots(), [])
  const daySlots: Slot[] = allSlots.filter((s) => s.dateISO === dateISO)

  if (servicesLoading) {
    return <div className="text-sm text-textMuted">Chargement des services...</div>
  }

  if (!currentService) {
    return <div className="text-sm text-textMuted">Aucun service disponible pour le moment.</div>
  }

  async function next() {
    if (step === 1) {
      setStep(2)
    } else if (step === 2) {
      if (!time) {
        push({ title: 'Sélectionnez un créneau', type: 'error' })
        return
      }
      setStep(3)
    } else if (step === 3) {
      if (!user) {
        push({ title: 'Connexion requise', description: 'Connectez-vous pour finaliser la réservation.', type: 'error' })
        events.form_validation_error({ formId: 'reservation-auth', fields: ['user'] })
        navigate('/account')
        return
      }
      const chosen = allSlots.find((sl) => sl.dateISO === dateISO && sl.time === time)
      events.reservation_attempt({ serviceId: currentService.slug, dateISO, time: time!, people })
      if (!chosen?.available) {
        events.reservation_conflict({ serviceId: currentService.slug, dateISO, time: time! })
        const alts = findAlternatives(allSlots, dateISO, time!, 3)
        push({
          title: 'Créneau indisponible',
          description: `Suggestions: ${alts.join(', ')}`,
          type: 'error',
        })
        return
      }
      const total = currentService.price * people
      setSubmitting(true)
      try {
        const reservation = await createReservation({
          serviceSlug: currentService.slug,
          dateISO,
          time: time!,
          people,
          note: note || null,
        })
        events.reservation_confirmed({ bookingId: reservation.id.toString(), amount: reservation.total })
        push({ title: 'Réservation confirmée', description: 'Votre moment de détente est réservée.', type: 'success' })
        navigate('/confirmation')
      } catch (error: any) {
        push({ title: 'Erreur', description: error?.message ?? 'Impossible de créer la réservation.', type: 'error' })
      } finally {
        setSubmitting(false)
      }
    }
  }

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-6">
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm opacity-80">
          <Step n={1} current={step} label="Service" />
          <hr className="flex-1 border-border" />
          <Step n={2} current={step} label="Date & heure" />
          <hr className="flex-1 border-border" />
          <Step n={3} current={step} label="Coordonnées" />
        </div>

        {step === 1 && (
          <section aria-label="Choisir un service" className="space-y-4">
              <select
              value={serviceSlug}
              onChange={(e) => setServiceSlug(e.target.value)}
              className="w-full h-12 rounded-xl bg-surface/70 border border-border px-3 focus-ring"
            >
              {services.map((s) => (
                <option key={s.id} value={s.slug}>
                  {s.title} – {s.durationMin} min – {s.price.toFixed(0)} €
                </option>
              ))}
            </select>
          </section>
        )}

        {step === 2 && (
          <section aria-label="Choisir la date et l'heure" className="space-y-4">
            <DatePicker value={dateISO} onChange={setDateISO} />
            <TimePicker slots={daySlots} value={time} onChange={setTime} />
            <div className="flex items-center gap-3">
              <label htmlFor="people" className="text-sm text-textMuted">Personnes</label>
              <input
                id="people"
                aria-label="Nombre de personnes"
                type="number"
                min={1}
                max={6}
                value={people}
                onChange={(e) => setPeople(Number(e.target.value))}
                className="w-24 h-10 rounded-xl bg-surface/70 border border-border px-3 focus-ring"
              />
            </div>
          </section>
        )}

        {step === 3 && (
          <section aria-label="Vos coordonnées" className="space-y-4">
            {user ? (
              <>
                <div className="grid sm:grid-cols-2 gap-3">
                  <input value={user.name} disabled className="h-11 rounded-xl bg-surface/50 border border-border px-3" />
                  <input value={user.email} disabled className="h-11 rounded-xl bg-surface/50 border border-border px-3" />
                </div>
                <textarea
                  placeholder="Ajouter une note (optionnel)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full min-h-24 rounded-xl bg-surface/70 border border-border px-3 py-2 focus-ring"
                />
              </>
            ) : (
              <div className="rounded-xl border border-border bg-surface/60 p-4">
                <p className="text-sm">
                  Vous devez créer un compte ou vous connecter avant de confirmer.{' '}
                  <button className="underline" onClick={() => navigate('/account')}>
                    Aller à mon compte
                  </button>
                </p>
              </div>
            )}
          </section>
        )}

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
            Retour
          </Button>
          <Button onClick={next} disabled={step === 3 && (!user || submitting)}>
            {step === 3 ? (submitting ? 'Validation...' : 'Confirmer') : 'Continuer'}
          </Button>
        </div>
      </div>

      <aside className="sticky top-24 h-fit space-y-4 rounded-2xl border border-border bg-surface/60 p-4">
        <div className="font-display text-lg">Résumé</div>
        <div className="text-sm text-textMuted">
          <div>Service: <span className="text-text">{currentService.title}</span></div>
          <div>Durée: <span className="text-text">{currentService.durationMin} min</span></div>
          <div>Date: <span className="text-text">{dateISO}</span></div>
          <div>Heure: <span className="text-text">{time ?? '-'}</span></div>
          <div>Personnes: <span className="text-text">{people}</span></div>
        </div>
        <div className="border-t border-border pt-2 flex items-center justify-between">
          <div>Total</div>
          <div className="text-gold font-medium">{(currentService.price * people).toFixed(0)} €</div>
        </div>
      </aside>
    </div>
  )
}

function Step({ n, current, label }: { n: number; current: number; label: string }) {
  const active = n <= current
  return (
    <div className="flex items-center gap-2">
      <div className={`size-6 rounded-full border text-xs grid place-items-center ${active ? 'border-gold text-gold' : 'border-border text-textMuted'}`}>{n}</div>
      <div className={`text-sm ${active ? 'text-text' : 'text-textMuted'}`}>{label}</div>
    </div>
  )
}
