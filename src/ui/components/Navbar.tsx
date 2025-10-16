import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Download } from 'lucide-react'
import { useCallback } from 'react'
import { Button } from './primitives/Button'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-xl text-sm transition-colors ${
    isActive ? 'text-gold' : 'text-textMuted hover:text-text'
  }`

export default function Navbar() {
  const navigate = useNavigate()

  const exportLogs = useCallback(() => {
    const logs = (window as any).__LOGS__ || []
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hammam-benkachour-logs-${new Date().toISOString()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-black/30 border-b border-border">
      <div className="container-app flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-3 focus-ring">
          <img src="/img/logo-mark.svg" alt="Logo Hammam Benkachour" className="h-8 w-8 rounded" />
          <span className="text-lg font-display tracking-wide text-text">
            <span className="text-gold">Hammam</span> Benkachour
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={navLinkClass} aria-label="Accueil">
            Accueil
          </NavLink>
          <NavLink to="/services" className={navLinkClass} aria-label="Services">
            Services
          </NavLink>
          <NavLink to="/reservation" className={navLinkClass} aria-label="Réserver">
            Réserver
          </NavLink>
          <NavLink to="/compte" className={navLinkClass} aria-label="Compte">
            Compte
          </NavLink>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="gap-2" onClick={exportLogs} aria-label="Exporter les logs">
            <Download className="size-4" />
            <span className="hidden sm:inline">Exporter les logs</span>
          </Button>
          <Button onClick={() => navigate('/reservation')} className="hidden sm:inline-flex">
            Réserver maintenant
          </Button>
        </div>
      </div>
    </header>
  )
}
