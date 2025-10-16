import { Slot } from '../../utils/slots'

export default function TimePicker({ slots, value, onChange }: { slots: Slot[]; value: string | null; onChange: (v: string) => void }) {
  const available = slots.filter((s) => s.available)
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
      {available.map((s) => {
        const selected = s.time === value
        return (
          <button
            key={s.time}
            onClick={() => onChange(s.time)}
            className={`h-10 rounded-xl border text-sm ${
              selected ? 'border-gold bg-gold/10 text-gold' : 'border-border bg-surface/60 hover:bg-white/5'
            }`}
          >
            {s.time}
          </button>
        )
      })}
    </div>
  )
}

