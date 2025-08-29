import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useIncidents } from '../../lib/queries/incidents'
import { Table, THead, TBody, TR, TH, TD } from '../../components/ui/table'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Select } from '../../components/ui/select'
import { Pagination } from '../../components/ui/pagination'
import { Incident } from '../../types/type' 
import { assignees } from '../../data'

export default function IncidentsList(){
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [severity, setSeverity] = useState('')
  const [type, setType] = useState('')
  const limit = 5
  const { data } = useIncidents({ page, limit, query, status, severity, type })
  const pageCount = Math.max(1, Math.ceil((data?.total ?? 0)/limit))
  const [expandedRow, setExpandedRow] = useState<string|null>(null)
  const nav = useNavigate()

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <Input placeholder="Search incidents…" value={query} onChange={e=>{setQuery(e.target.value); setPage(1)}} />
        <Select placeholder="All Status" value={status} onValueChange={v=>{setStatus(v); setPage(1)}} options={[{label:'All', value:''},{label:'Pending', value:'PENDING'},{label:'In Progress', value:'IN_PROGRESS'},{label:'Resolved', value:'RESOLVED'}]} />
        <Select placeholder="All Severity" value={severity} onValueChange={v=>{setSeverity(v); setPage(1)}} options={[{label:'All', value:''},{label:'Low', value:'LOW'},{label:'Medium', value:'MEDIUM'},{label:'High', value:'HIGH'}]} />
        <Select placeholder="All Types" value={type} onValueChange={v=>{setType(v); setPage(1)}} options={[{label:'All', value:''},{label:'Collision', value:'COLLISION'},{label:'Mechanical', value:'MECHANICAL'},{label:'Other', value:'OTHER'}]} />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <THead>
            <TR>
              <TH>Incident</TH><TH>Vehicle</TH><TH>Status</TH><TH>Severity</TH><TH>Type</TH><TH>Assigned To</TH><TH>Actions</TH>
            </TR>
          </THead>
          <TBody>
            {data?.items?.map((i:Incident)=> (
              <>
                <TR key={i.id}>
                  <TD>
                    <div className="font-medium">{i.title}</div>
                    <div className="text-xs text-gray-500">{i.id}</div>
                  </TD>
                  <TD>{i.carName}</TD>
                  <TD><Badge className={i.status==='PENDING'?'bg-yellow-50 border-yellow-200 text-yellow-800': i.status==='IN_PROGRESS'?'bg-blue-50 border-blue-200 text-blue-800':'bg-green-50 border-green-200 text-green-800'}>{i.status.replace('_',' ')}</Badge></TD>
                  <TD><Badge className={i.severity==='LOW'?'bg-green-50 border-green-200 text-green-800': i.severity==='MEDIUM'?'bg-yellow-50 border-yellow-200 text-yellow-800':'bg-red-50 border-red-200 text-red-800'}>{i.severity}</Badge></TD>
                  <TD><Badge className="bg-gray-50 border-gray-200">{i.incidentType}</Badge></TD>
                  <TD>{i.assignedTo || '-'}</TD>
                  <TD className="space-x-2">
                    <Button variant="outline" onClick={()=> setExpandedRow(r=> r===i.id? null : i.id)}>View</Button>
                    <Button variant="outline" onClick={()=> nav(`/incidents/${i.id}/edit`)}>Edit</Button>
                    <Link to={`/incidents/${i.id}`} className="text-primary text-sm underline">Open</Link>
                  </TD>
                </TR>
                {expandedRow===i.id && (
                  <TR key={i.id+'view'}>
                    <TD colSpan={7}>
                      <InlineView item={i} />
                    </TD>
                  </TR>
                )}
              </>
            ))}
          </TBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">Showing {data?.items?.length||0} of {data?.total||0} results</div>
        <Pagination page={page} pageCount={pageCount} onChange={setPage} />
      </div>
    </div>
  )
}

function InlineView({ item }: { item: Incident }){
  const [status, setStatus] = useState<string>(item.status)
  const [assignee, setAssignees] = useState('')
  const [assignedTo, setAssignedTo] = useState(item.assignedTo || '')

  // Dummy save function, you can replace with API call
  const handleSave = () => {
    console.log('Save', { id: item.id, status, assignedTo })
    // Call your API to update incident here
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl">
      <div>
        <div className="font-semibold">Description</div>
        <p className="text-sm text-gray-700">{item.description}</p>
      </div>
      <div>
        <div className="font-semibold">Location & Time</div>
        <p className="text-sm text-gray-700">{item.location}</p>
        <p className="text-sm text-gray-700">{new Date(item.occurredAt).toLocaleString()}</p>
      </div>
      <div>
        <div className="font-semibold">Attachments</div>
        <div className="flex flex-wrap gap-2">
          {item.attachments?.map(a=> a.type.startsWith('image/')? <img key={a.id} className="h-16 w-16 object-cover rounded" src={a.dataUrl} /> : <a key={a.id} href={a.dataUrl} download={a.name} className="text-xs underline">{a.name}</a>)}
        </div>
        <div className="mt-4">
          <div className="font-semibold mb-1">Edit Status</div>
          <Select value={status} onValueChange={setStatus} options={[{label:'Pending', value:'PENDING'},{label:'In Progress', value:'IN_PROGRESS'},{label:'Resolved', value:'RESOLVED'}]} />
          <div className="font-semibold mt-2 mb-1">Assigned To</div>
          <Select value={status} onValueChange={setAssignees} options={assignees} />
          <Button variant="outline" className="mt-2" onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>
  )
}
