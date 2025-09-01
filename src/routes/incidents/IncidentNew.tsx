
import IncidentForm from './IncidentForm'
import { useCreateIncident } from '../../lib/queries/incidents'
import { useNavigate } from 'react-router-dom'
import { IncidentFormValues } from '../../types/type'

import { useLoadingContext } from '../../context/context'

export default function IncidentNew(){
  const create = useCreateIncident()
  const {setLoading}=useLoadingContext()

  const nav = useNavigate()
  return (
    <IncidentForm isPending={create.isPending} onSubmit={(v: IncidentFormValues)=>{
            create.mutate(v,{onSuccess: (data)=>{
              nav(`/incidents/${data.id}`)

            }})
    }}/>
  )
}
