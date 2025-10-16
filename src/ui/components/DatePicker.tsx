import { addDays, formatISODate, humanDate } from '../../utils/date'

export default function DatePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const days = Array.from({ length: 7 }).map((_, i) => formatISODate(addDays(new Date(), i)))
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {days.map((d) => {
        const selected = d === value
        return (
          <button
            key={d}
            onClick={() => onChange(d)}
            className={`min-w-[140px] rounded-xl border px-3 py-2 text-left ${
              selected ? 'border-gold bg-gold/10' : 'border-border bg-surface/60 hover:bg-white/5'
            }`}
          >
            <div className="text-sm opacity-70">{humanDate(d).weekday}</div>
            <div className="font-medium">{humanDate(d).label}</div>
          </button>
        )
      })}
    </div>
  )
}

