import React from 'react'
import { cn } from '../../../utils/cn'

type Props = React.InputHTMLAttributes<HTMLInputElement>

export const Input = React.forwardRef<HTMLInputElement, Props>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        'w-full h-10 rounded-xl bg-surface/70 border border-border px-3 text-sm placeholder:text-textMuted focus-ring',
        className,
      )}
      {...props}
    />
  )
})
Input.displayName = 'Input'

