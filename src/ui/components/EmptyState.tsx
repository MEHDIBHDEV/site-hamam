export default function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/60 p-6 text-center text-textMuted">
      <div className="font-display text-text">{title}</div>
      {description && <div className="text-sm opacity-80">{description}</div>}
    </div>
  )
}

