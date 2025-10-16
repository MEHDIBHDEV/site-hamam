import React, { createContext, useCallback, useContext, useState } from 'react'
import { cn } from '../utils/cn'

type Toast = { id: string; title: string; description?: string; type?: 'success' | 'error' | 'info' }

type Ctx = {
  toasts: Toast[]
  push: (t: Omit<Toast, 'id'>) => void
  remove: (id: string) => void
}

const ToastCtx = createContext<Ctx | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const remove = useCallback((id: string) => setToasts((t) => t.filter((i) => i.id !== id)), [])
  const push = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { ...t, id }])
    setTimeout(() => remove(id), 3500)
  }, [remove])

  return (
    <ToastCtx.Provider value={{ toasts, push, remove }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              'rounded-2xl border p-4 shadow-xl2 backdrop-blur',
              t.type === 'error'
                ? 'border-red-500/30 bg-red-500/10 text-red-200'
                : t.type === 'success'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                : 'border-border bg-surface/80 text-text',
            )}
          >
            <div className="font-medium">{t.title}</div>
            {t.description && <div className="text-sm opacity-80">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

