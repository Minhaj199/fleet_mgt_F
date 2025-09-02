
import IncidentForm from './IncidentForm'
import { useCreateIncident } from '../../lib/queries/incidents'
import { useNavigate } from 'react-router-dom'
import { IncidentFormValues, IncidentFormValuesType } from '../../types/type'

import { useLoadingContext } from '../../context/context'

export default function IncidentNew(){
  const create = useCreateIncident()

  const nav = useNavigate()
  return (
    <IncidentForm  onSubmit={(v: IncidentFormValuesType)=>{
            create.mutate(v,{onSuccess: (data)=>{
              nav(`/incidents/${data.id}`)

            }})
    }}/>
  )
}
