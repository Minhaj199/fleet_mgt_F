import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useIncidents, useSeeds } from '../../lib/queries/incidents'
import { Table, THead, TBody, TR, TH, TD } from '../../components/ui/table'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Select } from '../../components/ui/select'
import { Incident, IncidentTable } from '../../types/type' 
import { AccidentOptions, assignees, severities, updateTypes } from '../../data'
import { Pagination } from '@mui/material'

export default function IncidentsList(){
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [cars, setCars] = useState('')
  const [severity, setSeverity] = useState('')
  const [type, setType] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const limit = 3
  const { data={total:0,items:[]} } = useIncidents({ page, limit, query, cars, severity, type, assignedTo, startDate, endDate })
  const pageCount=Math.ceil(data?.total/limit)
  const [expandedRow, setExpandedRow] = useState<string|null>(null)
  const nav = useNavigate()
  const [seed,setSeeds]=useState<{cars:{label:string,value:string}[],users:{label:string,value:string}[]}>({cars:[{label:'',value:''}],users:[]})
const {data:seeds}=useSeeds()
    useEffect(()=>{
      if(seeds&&'cars' in seeds&&'users' in seeds)
      setSeeds({cars:seeds.cars.map(el=>({label:el.model,value:String(el.id)})),users:seeds.users.map(el=>({label:el.name,value:String(el.id)}))})
    },[seeds])
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        <Input placeholder="Search incidents…" value={query} onChange={e=>{setQuery(e.target.value); setPage(1)}} />
        <Select value={cars}  onValueChange={v=>{setCars(v); setPage(1)}} options={[{label:'All cars', value:''},...seed?.cars]} />
        <Select value={severity} onValueChange={v=>{setSeverity(v); setPage(1)}} options={[{label:'All Severity', value:''},...severities]} />
        <Select value={type} onValueChange={v=>{setType(v); setPage(1)}} options={[{label:'All Types', value:''},...AccidentOptions]} />
        <Select value={assignedTo} onValueChange={v=>{setAssignedTo(v); setPage(1)}} options={[{label:'All Assignees', value:''},...seed?.users]} />
        <Input type="date" value={startDate} onChange={e=>{setStartDate(e.target.value); setPage(1)}} />
        <Input type="date" value={endDate} onChange={e=>{setEndDate(e.target.value); setPage(1)}} />
      </div>

      {/* Table */}
     {/* Table view for desktop */}
<div className="hidden md:block overflow-x-auto">
  <Table>
    <THead>
      <TR>
        <TH>Incident</TH><TH>Vehicle</TH><TH>Status</TH>
        <TH>Severity</TH><TH>Type</TH><TH>Assigned To</TH><TH>Actions</TH>
      </TR>
    </THead>
    <TBody>
      {data?.items?.map((i:Partial<IncidentTable>)=> (
        <>
          <TR key={i.id}>
            <TD>
              <div className="font-medium">{i.title}</div>
              <div className="text-xs text-gray-500">{i.id}</div>
            </TD>
            <TD>{i.carName}</TD>
            <TD>
              <Badge className={i.status==='PENDING'?'bg-yellow-50 border-yellow-200 text-yellow-800': i.status==='IN_PROGRESS'?'bg-blue-50 border-blue-200 text-blue-800':'bg-green-50 border-green-200 text-green-800'}>
                {i.status&&i.status.replace('_',' ')}
              </Badge>
            </TD>
            <TD>
              <Badge className={i.severity==='LOW'?'bg-green-50 border-green-200 text-green-800': i.severity==='MEDIUM'?'bg-yellow-50 border-yellow-200 text-yellow-800':'bg-red-50 border-red-200 text-red-800'}>
                {i.severity}
              </Badge>
            </TD>
            <TD><Badge className="bg-gray-50 border-gray-200">{i.type}</Badge></TD>
            <TD>{i.assignedTo || '-'}</TD>
            <TD className="space-x-2">
              <Button variant="outline" onClick={()=> setExpandedRow(r=> (i.id&&r===i.id)? null : i.id||'')}>View</Button>
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

{/* Card view for mobile */}
<div className="block md:hidden space-y-4">
  {data?.items?.map((i:Partial<IncidentTable>)=> (
    <div key={i.id} className="border rounded-xl p-4 shadow-sm bg-white">
      <div className="flex justify-between items-center">
        <div>
          <div className="font-medium">{i.title}</div>
          <div className="text-xs text-gray-500">{i.id}</div>
        </div>
        <Badge className={i.status==='PENDING'?'bg-yellow-50 border-yellow-200 text-yellow-800': i.status==='IN_PROGRESS'?'bg-blue-50 border-blue-200 text-blue-800':'bg-green-50 border-green-200 text-green-800'}>
          {i.status&&i.status.replace('_',' ')}
        </Badge>
      </div>

      <div className="mt-2 text-sm text-gray-700">Vehicle: {i.carName}</div>
      <div className="mt-1 text-sm">Severity: 
        <Badge className={`ml-1 ${i.severity==='LOW'?'bg-green-50 border-green-200 text-green-800': i.severity==='MEDIUM'?'bg-yellow-50 border-yellow-200 text-yellow-800':'bg-red-50 border-red-200 text-red-800'}`}>
          {i.severity}
        </Badge>
      </div>
      <div className="mt-1 text-sm">Type: {i.type}</div>
      <div className="mt-1 text-sm">Assigned To: {i.assignedTo || '-'}</div>

      <div className="flex gap-2 mt-3">
        <Button variant="outline" onClick={()=> setExpandedRow(r=> (i.id&&r===i.id)? null : i.id||'')}>View</Button>
        <Button variant="outline" onClick={()=> nav(`/incidents/${i.id}/edit`)}>Edit</Button>
        <Link to={`/incidents/${i.id}`} className="text-primary text-sm underline">Open</Link>
      </div>

      { i.id&&expandedRow===i.id && (
        <div className="mt-3">
          <InlineView item={i} />
        </div>
      )}
    </div>
  ))}
</div>


      {/* Pagination */}
      <div className="flex items-center justify-center">
        <Pagination page={page} count={pageCount} onChange={(_:unknown,currentPage:number)=>setPage(currentPage)} color="primary" />
      </div>
    </div>
  )
}

function InlineView({ item }: { item: Partial<IncidentTable> }){
  const [status, setStatus] = useState<string>(item.status||'')
  const [assignedTo, setAssignedTo] = useState(item.assignedTo || '')

  const handleSave = () => {
    console.log('Save', { id: item.id, status, assignedTo })
  
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
        <p className="text-sm text-gray-700">{new Date(item.occurredAt||'').toLocaleString()}</p>
      </div>
      <div>
        <div className="font-semibold">Attachments</div>
        <div className="flex flex-wrap gap-2">
          {item.attachments?.map(a=> 
            a.type.startsWith('image/') 
              ? <img key={a.id} className="h-16 w-16 object-cover rounded" src={a.dataUrl} /> 
              : <a key={a.id} href={a.dataUrl} download={a.name} className="text-xs underline">{a.name}</a>
          )}
        </div>
        <div className="mt-4">
          <div className="font-semibold mb-1">Edit Status</div>
          <Select value={status} onValueChange={setStatus} options={[
            {label:'Pending', value:'PENDING'},
            {label:'In Progress', value:'IN_PROGRESS'},
            {label:'Resolved', value:'RESOLVED'}
          ]} />
          <div className="font-semibold mt-2 mb-1">Assigned To</div>
          <Select value={assignedTo} onValueChange={setAssignedTo} options={assignees} />
          <Button variant="outline" className="mt-2" onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>
  )
}
