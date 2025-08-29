import { Incident } from "../types/type"



const LS_KEY = 'fleet-incidents-data-v2'

function load(): Incident[] {
  const raw = localStorage.getItem(LS_KEY)
  if (!raw) return seed()
  try { return JSON.parse(raw) as Incident[] } catch { return seed() }
}
function save(data: Incident[]) { localStorage.setItem(LS_KEY, JSON.stringify(data)) }

function seed(): Incident[] {
  const now = Date.now()
  const data: Incident[] = [
    {
      id: 'INC-001', title: 'Minor Collision at Parking Lot', description: 'Scratched bumper.',
      reportedAt:new Date(),
      severity: 'LOW', incidentType: 'COLLISION', location: 'Parking Lot A', latitude: 12.9, longitude: 77.6,
      occurredAt: new Date(now - 3*86400000).toISOString(), carId: 'ABC-123', carName: 'Toyota Camry',
      reportedById: 'U1', reportedByName: 'John Doe', attachments: [], images: [], odometer: 45231, estimatedCost: 500, status: 'PENDING', assignee: 'John Doe',
      updates: [{ id:'U-1', at: new Date(now-3*86400000).toISOString(), by:'System', type:'COMMENT', message:'Incident created'}]
    },
    {
      id: 'INC-002', title: 'Engine Overheating', description: 'Temp warning during drive.',reportedAt:new Date(),
      severity: 'HIGH', incidentType: 'MECHANICAL', location: 'Highway 5', latitude: 13.0, longitude: 77.7,
      occurredAt: new Date(now - 7*86400000).toISOString(), carId: 'XYZ-789', carName: 'Ford Transit',
      reportedById: 'U2', reportedByName: 'Mike Johnson', attachments: [], images: [], odometer: 91000, estimatedCost: 1200, status: 'IN_PROGRESS', assignee: 'Mike Johnson',
      updates: [{ id:'U-2', at: new Date(now-7*86400000).toISOString(), by:'System', type:'COMMENT', message:'Investigation started' }]
    },
    {
      id: 'INC-003', title: 'Windshield Crack', description: 'Small crack found after trip.',reportedAt:new Date(),
      severity: 'MEDIUM', incidentType: 'OTHER', location: 'Garage', occurredAt: new Date(now - 15*86400000).toISOString(),
      carId: 'DEF-456', carName: 'Honda Civic', reportedById:'U3', reportedByName:'Sara Lee', attachments: [], images: [], status: 'RESOLVED', assignee:'Sara Lee',
      updates: [{ id:'U-3', at: new Date(now-15*86400000).toISOString(), by:'System', type:'COMMENT', message:'Resolved' }], odometer: 67000, estimatedCost: 200, actualCost: 220, resolvedAt: new Date(now-14*86400000).toISOString()
    }
  ]
  save(data); return data
}

function delay<T>(data:T, ms=300){ return new Promise<T>(res=>setTimeout(()=>res(data), ms)) }

export async function listIncidents({ page=1, limit=10, query='', status='', severity='', type='', startDate='', endDate='' }:any){
  const all = load()
  let filtered = all.filter(i =>
    (query? (i.title+i.description+i.carName+i.id).toLowerCase().includes(query.toLowerCase()):true) &&
    (status? i.status===status: true) &&
    (severity? i.severity===severity: true) &&
    (type? i.incidentType===type: true) &&
    (startDate? new Date(i.occurredAt) >= new Date(startDate): true) &&
    (endDate? new Date(i.occurredAt) <= new Date(endDate): true)
  )
  const total = filtered.length
  const start = (page-1)*limit
  const items = filtered.slice(start, start+limit)
  return delay({ items, total, page, limit })
}

export async function getIncident(id:string){
  const all = load()
  const item = all.find(i=>i.id===id)
  if(!item) throw new Error('Not found')
  return delay(item)
}

export async function createIncident(data: Partial<Incident>){
  const all = load()
  const id = 'INC-' + String(all.length+1).padStart(3,'0')
  const incident: Incident = {
    id,
    title: data.title||'Untitled',
    description: data.description||'',
    severity: (data.severity||'LOW') as any,
    incidentType: (data.incidentType||'OTHER') as any,
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
  all.unshift(incident); save(all)
  return delay(incident)
}

export async function updateIncident(id:string, patch: Partial<Incident>){
  const all = load()
  const idx = all.findIndex(i=>i.id===id)
  if (idx===-1) throw new Error('Not found')
  const merged = { ...all[idx], ...patch }
  merged.images = (merged.attachments||[]).filter(a=>a.type.startsWith('image/')).map(a=>a.dataUrl)
  all[idx] = merged; save(all)
  return delay(merged)
}

export async function addComment(id:string, by:string, message:string){
  const all = load()
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
