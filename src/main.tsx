import React from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from './router'
import { ToastProvider } from './providers/ToastProvider'
import { AppStoreProvider } from './store'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppStoreProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </AppStoreProvider>
  </React.StrictMode>,
)

