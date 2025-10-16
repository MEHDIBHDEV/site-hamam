import { cn } from '../../../utils/cn'
import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants: Record<typeof variant, string> = {
      primary:
        'bg-gold text-white hover:bg-gold/90 shadow-xl2 border border-gold/20 disabled:opacity-50',
      ghost:
        'bg-transparent text-text hover:bg-white/5 border border-transparent disabled:opacity-50',
      outline:
        'bg-transparent text-text hover:bg-white/5 border border-border disabled:opacity-50',
    }
    const sizes: Record<typeof size, string> = {
      sm: 'h-8 px-3 text-sm rounded-xl',
      md: 'h-10 px-4 text-sm rounded-xl',
      lg: 'h-12 px-6 text-base rounded-2xl',
    }
    return (
      <button
        ref={ref}
        className={cn('inline-flex items-center justify-center gap-2 focus-ring', variants[variant], sizes[size], className)}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'
