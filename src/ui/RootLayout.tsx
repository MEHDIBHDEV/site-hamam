import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { useEffect } from 'react'
import { logEvent } from '../utils/logging'

export function RootLayout() {
  const location = useLocation()

  useEffect(() => {
    logEvent('info', 'page_view', {
      page: location.pathname,
      referrer: document.referrer || null,
    })
  }, [location])

  return (
    <div className="min-h-full flex flex-col">
      <Navbar />
      <main className="flex-1"> 
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default RootLayout

