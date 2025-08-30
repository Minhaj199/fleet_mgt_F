
import IncidentForm from './IncidentForm'
import { useCreateIncident } from '../../lib/queries/incidents'
import { useNavigate } from 'react-router-dom'
import { IncidentFormValues } from '../../types/type'

export default function IncidentNew(){
  const create = useCreateIncident()
  const nav = useNavigate()
  return (
    <IncidentForm onSubmit={(v: IncidentFormValues)=>{
      create.mutate(v, { onSuccess: (data)=>{
        nav(`/incidents/${data.id}`)
      }  })
    }}/>
  )
}
