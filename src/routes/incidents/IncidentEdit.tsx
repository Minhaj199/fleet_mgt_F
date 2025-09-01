
import IncidentForm from './IncidentForm'
import { useIncidentDetail, useUpdateIncident } from '../../lib/queries/incidents'
import { useNavigate, useParams } from 'react-router-dom'
import { IncidentFormValues } from '../../types/type'

export default function IncidentEdit(){
  const { id='' } = useParams()
  const { data } = useIncidentDetail(id)
  console.log('i ma data',data)
  const update = useUpdateIncident()

  const nav = useNavigate()
  if(!data) return <div>Loading...</div>
  return (
    <IncidentForm isEdit defaultValues={{
      title: data.title, description: data.description, severity: data.severity as any, incidentType: data.type as any,
      location: data.location, occurredAt: data.occurredAt.slice(0,16), latitude: data.latitude, longitude: data.longitude,
      carName:String(data.carId),assignedTo:data.assignedTo?.id?String(data.assignedTo?.id):'',status:data.status,reportedByName:String(data.reportedById), odometer: data.odometer, estimatedCost: data.estimatedCost, actualCost: data.actualCost,
      attachments:[...data.images?.map((el,index)=>({dataUrl:el,name:index,type:'image/jpeg'})),...data.documents?.map((el,index)=>({dataUrl:el,name:'document',type:'application/pdf'}))]
    }} onSubmit={(v: IncidentFormValues)=>{
      update.mutate({ id, data: { ...data, ...v,updates:[],images:v.attachments?.filter(el=>el.type==='image/jpeg').map(el=>el.dataUrl),documents:v.attachments?.filter(el=>el.type==='application/pdf').map(el=>el.dataUrl),from:'MAIN_UPDATE',attachments:[]} }, { onSuccess: ()=> nav(`/incidents/${id}`)})
    }}/>
  )
}
