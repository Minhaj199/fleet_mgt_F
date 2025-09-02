
import * as React from 'react'
import { cn } from '../../lib/utils'
export interface SelectProps { value?: string; onValueChange?: (v: string|{value:string,label:string}) => void; options: { label: string, value: string }[]; placeholder?: string; className?: string ,objNeeded?:boolean}
export function Select({ value, onValueChange, options, placeholder='Select', className,objNeeded=false }: SelectProps) {
    const handleChange=(e:React.ChangeEvent<HTMLSelectElement>)=>{
  if(!onValueChange)return
  if(objNeeded){
    onValueChange({
      value:e.target.value,
      label:e.target.selectedOptions[0].text
    })
  }else{
    onValueChange(e.target.value)
  }
  }
  return (
    
    <select value={value ?? ''} onChange={handleChange} className={cn('w-full rounded-lg border border-input px-3 py-2 outline-none focus:ring-2 focus:ring-ring bg-white', className)}>
      {options.map(o => <option key={o.value}  value={o.value}>{o.label}</option>)}
    </select>
  )

}




