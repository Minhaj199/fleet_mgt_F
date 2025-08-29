
import * as React from 'react'
import { Button } from './button'
export function Pagination({ page, pageCount, onChange }:{ page:number; pageCount:number; onChange:(p:number)=>void }){
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={()=>onChange(1)} disabled={page===1}>« First</Button>
      <Button variant="outline" onClick={()=>onChange(Math.max(1,page-1))} disabled={page===1}>‹ Prev</Button>
      <span className="px-2 text-sm">Page {page} / {pageCount}</span>
      <Button variant="outline" onClick={()=>onChange(Math.min(pageCount,page+1))} disabled={page===pageCount}>Next ›</Button>
      <Button variant="outline" onClick={()=>onChange(pageCount)} disabled={page===pageCount}>Last »</Button>
    </div>
  )
}
