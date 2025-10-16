import StepperReservation from '../ui/components/StepperReservation'

export default function Reservation() {
  return (
    <div className="container-app py-10 space-y-6">
      <h1 className="font-display text-3xl">Réservation</h1>
      <StepperReservation />
    </div>
  )
}

