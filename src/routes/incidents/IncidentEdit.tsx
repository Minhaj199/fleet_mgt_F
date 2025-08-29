
import IncidentForm from './IncidentForm'
import { useIncidentDetail, useUpdateIncident } from '../../lib/queries/incidents'
import { useNavigate, useParams } from 'react-router-dom'
import { IncidentFormValues } from '../../types/type'

export default function IncidentEdit(){
  const { id='' } = useParams()
  const { data } = useIncidentDetail(id)
  const update = useUpdateIncident()
  const nav = useNavigate()
  if(!data) return <div>Loading...</div>
  return (
    <IncidentForm isEdit defaultValues={{
      title: data.title, description: data.description, severity: data.severity as any, incidentType: data.incidentType as any,
      location: data.location, occurredAt: data.occurredAt, latitude: data.latitude, longitude: data.longitude,
      carName: data.carName, reportedByName: data.reportedByName, odometer: data.odometer, estimatedCost: data.estimatedCost, actualCost: data.actualCost,
      attachments: data.attachments
    }} onSubmit={(v: IncidentFormValues)=>{
      update.mutate({ id, data: { ...data, ...v } }, { onSuccess: ()=> nav(`/incidents/${id}`) })
    }}/>
  )
}
