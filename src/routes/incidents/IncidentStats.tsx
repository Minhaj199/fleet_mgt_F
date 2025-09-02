
import { useState } from 'react'
import { useIncidentStats } from '../../lib/queries/incidents'
import { Select } from '../../components/ui/select'
import { Input } from '../../components/ui/input'
import { Card, CardContent } from '../../components/ui/card'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, LineElement, LinearScale, PointElement, CategoryScale, Tooltip, Legend } from 'chart.js'

ChartJS.register(LineElement, LinearScale, PointElement, CategoryScale, Tooltip, Legend)

export default function IncidentStats(){
  const [status, setStatus] = useState('')
  const [severity, setSeverity] = useState('')
  const [startDate, setStart] = useState('')
  const [endDate, setEnd] = useState('')
  const { data } = useIncidentStats({ startDate, endDate, status, severity })

  const chartData = {
    labels: data?.trend.map(t=>t.label) ?? [],
    datasets: [{ label: 'Incidents', data: data?.trend.map(t=>t.value) ?? [] }]
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Select placeholder="All Status" value={status} onValueChange={(v)=>{
          if(typeof v==='string'){
            setStatus(v)
            }
        }} options={[{label:'All', value:''},{label:'Pending', value:'PENDING'},{label:'In Progress', value:'IN_PROGRESS'},{label:'Resolved', value:'RESOLVED'}]} />
        <Select placeholder="All Severity" value={severity} onValueChange={(v)=>{
          if(typeof v==='string'){
            setSeverity(v)
            }
        
        }} options={[{label:'All', value:''},{label:'Low', value:'LOW'},{label:'Medium', value:'MEDIUM'},{label:'High', value:'HIGH'}]} />
        <Input type="date" value={startDate} onChange={e=>setStart(e.target.value)} />
        <Input type="date" value={endDate} onChange={e=>setEnd(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Incidents" value={data?.total ?? 0} />
        <StatCard title="Open Incidents" value={data?.openIncidents ?? 0} />
        <StatCard title="Avg Resolution (days)" value={(data?.avgResolutionTime ?? 0).toFixed(1)} />
        <StatCard title="Critical Severity" value={data?.bySeverity?.['CRITICAL'] ?? 0} />
      </div>

      <Card><CardContent><Line data={chartData} /></CardContent></Card>
    </div>
  )
}

function StatCard({ title, value }:{ title:string; value:number|string }){
  return (
    <Card>
      <CardContent>
        <div className="p-4">
          <div className="text-sm text-gray-500">{title}</div>
          <div className="text-2xl font-semibold">{value}</div>
        </div>
      </CardContent>
    </Card>
  )
}
