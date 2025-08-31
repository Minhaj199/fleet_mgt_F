
import * as React from 'react'
import { cn } from '../../lib/utils'
export interface SelectProps { value?: string; onValueChange?: (v: string) => void; options: { label: string, value: string }[]; placeholder?: string; className?: string }
export function Select({ value, onValueChange, options, placeholder='Select', className }: SelectProps) {
  return (
    
    <select value={value ?? ''} onChange={e => onValueChange?.(e.target.value)} className={cn('w-full rounded-lg border border-input px-3 py-2 outline-none focus:ring-2 focus:ring-ring bg-white', className)}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}
