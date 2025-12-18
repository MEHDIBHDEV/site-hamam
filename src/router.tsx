import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from './ui/RootLayout'
import Home from './routes/Home'
import Services from './routes/Services'
import Reservation from './routes/Reservation'
import Account from './routes/Account'
import Confirmation from './routes/Confirmation'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'services', element: <Services /> },
      { path: 'reservation', element: <Reservation /> },
      // keep both spellings so /account and /compte stay valid
      { path: 'account', element: <Account /> },
      { path: 'compte', element: <Account /> },
      { path: 'confirmation', element: <Confirmation /> },
    ],
  },
])
