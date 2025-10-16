export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface/50">
      <div className="container-app py-8 grid gap-4 sm:flex sm:items-center sm:justify-between text-sm text-textMuted">
        <div>
          <div className="font-display text-text">Hammam Benkachour</div>
          <div>Oujda, Maroc</div>
          <div>Ouvert 10:00 – 20:00</div>
        </div>
        <div className="opacity-80">© {new Date().getFullYear()} Hammam Benkachour</div>
      </div>
    </footer>
  )
}
