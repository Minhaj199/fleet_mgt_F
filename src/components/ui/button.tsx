
import * as React from 'react'
import { cn } from '../../lib/utils'
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm'|'md'|'lg'
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant='default', size='md', ...props }, ref) => {
    const variants = {
      default: 'bg-primary text-white hover:opacity-90',
      secondary: 'bg-secondary text-foreground hover:bg-gray-100',
      outline: 'border border-border bg-white hover:bg-gray-50',
      ghost: 'bg-transparent hover:bg-gray-100'
    }
    const sizes = { sm:'px-2 py-1 text-sm rounded-md', md:'px-3 py-2 rounded-lg', lg:'px-4 py-3 text-base rounded-lg'}
    return <button ref={ref} className={cn('inline-flex items-center justify-center font-medium', variants[variant], sizes[size], className)} {...props} />
  }
); Button.displayName='Button'
