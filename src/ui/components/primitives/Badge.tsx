import { cn } from '../../../utils/cn'

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 text-[11px] uppercase tracking-wide text-gold',
        className,
      )}
    >
      {children}
    </span>
  )
}

