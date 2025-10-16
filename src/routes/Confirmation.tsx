import { useAppStore } from '../store'
import { useMemo } from 'react'
import { Button } from '../ui/components/primitives/Button'

export default function Confirmation() {
  const { bookings } = useAppStore()
  const last = useMemo(() => bookings[bookings.length - 1], [bookings])

  if (!last)
    return (
      <div className="container-app py-10">
        <div className="rounded-xl border border-border bg-surface/60 p-6">Aucune réservation.</div>
      </div>
    )

  function addToCalendar() {
    const start = `${last.dateISO}T${last.time}:00`
    const end = start // simplified
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${start.replace(/[-:]/g, '')}Z\nDTEND:${end.replace(/[-:]/g, '')}Z\nSUMMARY:Hammam Benkachour\nEND:VEVENT\nEND:VCALENDAR`
    const blob = new Blob([ics], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'hammam-royale.ics'
    a.click()
    URL.revokeObjectURL(url)
  }

  function downloadConfirmation() {
    const html = `<html><body><h1>Confirmation</h1><p>Réservé le ${last.dateISO} ${last.time} pour ${last.people} personne(s). Montant: ${last.total} €.</p></body></html>`
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'confirmation.html'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container-app py-10 space-y-6">
      <h1 className="font-display text-3xl">Votre moment de détente est réservé.</h1>
      <div className="rounded-2xl border border-border bg-surface/60 p-6 space-y-3">
        <div>Date: {last.dateISO} • {last.time}</div>
        <div>Personnes: {last.people}</div>
        <div>Montant: {last.total} €</div>
        <div className="flex gap-2 pt-2">
          <Button onClick={addToCalendar}>Ajouter à mon calendrier</Button>
          <Button variant="outline" onClick={downloadConfirmation}>Télécharger confirmation (PDF simulé)</Button>
        </div>
      </div>
    </div>
  )
}
