import { Car, Incident, IncidentDetails, IncidentRow, Users } from "../types/type"
import { request } from "../utils/axiosUtil"
import { enqueueSnackbar } from "notistack"
import { rowIncidentFormater } from "../utils/incidentRowFormator"






function delay<T>(data:T, ms=300){ return new Promise<T>(res=>setTimeout(()=>res(data), ms)) }

export async function listIncidents({ page=1, limit=2, query='', cars='', severity='', type='',assignedTo='', startDate='', endDate='' }:any){
  const raw:{data:IncidentRow[],totoalCount:number} =await request({url:`/api/incidents?page=${page}&limit=${limit}&query=${query}&cars=${cars}&severity=${severity}&accidentOptions=${type}&assignedTo=${assignedTo}&startDate=${startDate}&endDate=${endDate}`})
  const total = raw.totoalCount
  const items =rowIncidentFormater(raw.data)||[]
  return ({ items, total, page, limit })
  
}

export async function getIncident(id:string){
  const item:IncidentDetails =  await request({url:`/api/incidents?from=get-incident&id=${id}`})
  console.log(item)
  console.log(item)
  if(!item) throw new Error('Not found')
  return (item)
}

export async function createIncident(data: Partial<Incident>){
  type ProcessedData=Omit<Partial<Incident>,'attachments'>&{images:string[],documents:string[]}
  let processedData:null|ProcessedData=null
  if(data.attachments?.length){
    processedData={...data,images:data.attachments.filter(el=>el.type==='image/jpeg').map(el=>el.dataUrl),documents:data.attachments.filter(el=>el.type==='application/pdf').map(el=>el.dataUrl)}
  }
  const response=await request({url:'/api/incidents',method:'POST',data:{data:processedData!==null?processedData:data}})
  console.log(response)
  const incident: Incident = {
    id:response.id,
    title: data.title||'Untitled',
    description: data.description||'',
    severity: (data.severity||'LOW') as any,
    type: (data.type||'OTHER') as any,
    location: data.location||'',
    latitude: data.latitude,
    longitude: data.longitude,
    occurredAt: data.occurredAt || new Date().toISOString(),
    carId: data.carId||'',
    carName: data.carName||'',
    reportedById: data.reportedById||'',
    reportedByName: data.reportedByName||'',
    attachments: data.attachments || [],
    images: (data.attachments||[]).filter(a=>a.type.startsWith('image/')).map(a=>a.dataUrl),
    odometer: data.odometer,
    estimatedCost: data.estimatedCost,
    actualCost: data.actualCost,
    status: 'PENDING',
    assignee: '',
    reportedAt:new Date(),
    updates: [{ id: crypto.randomUUID(), at: new Date().toISOString(), by: data.reportedByName||'User', type:'COMMENT', message:'Incident created' }]
  
  }
  return (incident)
}

export async function updateIncident(id:string, patch: Partial<Incident>){
  const all =await load()
  const idx = all.findIndex(i=>i.id===id)
  if (idx===-1) throw new Error('Not found')
  const merged = { ...all[idx], ...patch }
  merged.images = (merged.attachments||[]).filter(a=>a.type.startsWith('image/')).map(a=>a.dataUrl)
  all[idx] = merged; save(all)
  return delay(merged)
}

export async function addComment(id:string, by:string, message:string){
  const all =await load()
  const idx = all.findIndex(i=>i.id===id)
  if (idx===-1) throw new Error('Not found')
  all[idx].updates.unshift({ id: crypto.randomUUID(), at: new Date().toISOString(), by, type:'COMMENT', message })
  save(all)
  return delay(all[idx])
}

export async function getStats({ startDate='', endDate='', status='', severity='' }:{ startDate?:string; endDate?:string; status?:string; severity?:string }){
  const { items: list } = await listIncidents({ page:1, limit:10000, startDate, endDate, status, severity })
  const total = list.length
  const byStatus: Record<string, number> = {}
  const bySeverity: Record<string, number> = {}
  list.forEach(i=>{
    byStatus[i.status] = (byStatus[i.status]||0)+1
    bySeverity[i.severity] = (bySeverity[i.severity]||0)+1
  })
  const openIncidents = list.filter(i=> i.status!=='RESOLVED').length
  // avg resolution (days)
  const resolved = list.filter(i=> i.status==='RESOLVED' && i.resolvedAt)
  let avgResolutionTime = 0
  if(resolved.length){
    avgResolutionTime = resolved.reduce((sum,i)=> sum + (new Date(i.resolvedAt!).getTime() - new Date(i.occurredAt).getTime()), 0)/resolved.length/86400000
  }
  // trend by day
  const byDay: Record<string, number> = {}
  list.forEach(i=> {
    const day = new Date(i.occurredAt).toISOString().slice(0,10)
    byDay[day] = (byDay[day]||0)+1
  })
  const trend = Object.entries(byDay).sort((a,b)=> a[0].localeCompare(b[0])).map(([label, value])=>({ label, value }))
  return delay({ total, byStatus, bySeverity, openIncidents, avgResolutionTime, trend })
}
export async function fetchSeed():Promise<{cars:Car[],users:Users[]}>{
  try {
    const data=await request({url:'/api/fetch-seed'})
    return data
  } catch (error) {
    if(error instanceof Error){
      enqueueSnackbar(error.message,{variant:'error'})
      
    }
    throw new Error('error')
  }
}