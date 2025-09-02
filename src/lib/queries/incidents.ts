import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../query-keys'
import * as api from '../mockApi'
import { Incident, IncidentTable, IncidetInputs, UpdateInput } from '../../types/type'; 
import { useLoadingContext } from '../../context/context';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

export interface Filters { page?: number;status?:string, limit?: number; query?: string;assignedTo?:string ,cars?: string; severity?: string; type?: string; startDate?: string; endDate?: string }

export const useIncidents = (filters: Filters = {}) =>{
return useQuery({queryKey: queryKeys.incidents.list(filters),staleTime: 2 * 60 * 1000, queryFn: () => api.listIncidents(filters), placeholderData: p=>p })
} 

export const useIncidentDetail = (id: string) => useQuery({ queryKey: queryKeys.incidents.detail(id), queryFn: () => api.getIncident(id), enabled: !!id })

export const useSeeds = () =>useQuery({queryKey:queryKeys.incidents.seeds(),queryFn:()=>api.fetchSeed(),
  staleTime: Infinity,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
   gcTime: Infinity,
  
})




export const useCreateIncident = () => {
  const qc = useQueryClient()
    const {setLoading}=useLoadingContext()
  return useMutation({ mutationFn: (data: Partial<IncidetInputs>) => api.createIncident(data),onMutate:()=>{
    setLoading(true)
  },onSuccess: (data) =>{
   
    qc.invalidateQueries({ queryKey: queryKeys.incidents.lists() })
    setLoading(false)
  }    
  ,onError:(error)=>{
    enqueueSnackbar(error.message)
    setLoading(false)
  }} )
}

export const useUpdateIncident = () => {
  const qc = useQueryClient()
  const nav = useNavigate()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UpdateInput> }) => api.updateIncident(id, data),
    onMutate:async(newData)=>{
  
       await qc.cancelQueries({
        queryKey: queryKeys.incidents.list(newData.data.filters),
      })
      const previousData = qc.getQueryData<{ items: Incident[] }>(
        queryKeys.incidents.list(newData.data.filters)
      )
    if(newData.data.from){
      qc.setQueryData<{items:Incident[]}>(
    queryKeys.incidents.list(newData.data.filters),
    (old) => {
    
    if(!old)return old
       const updated = {
      ...old,
      items: old.items.map(el =>
        el.id === newData.id
          ? {
              ...el,
              status: newData.data.status ?? el.status,
              assignedTo: newData.data.assignedTo ?? el.assignedTo,
            }
          : el
      ),
    }

    return updated

  }
);
    }
    return { previousData }
    },
  
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.incidents.lists() })
      qc.invalidateQueries({ queryKey: queryKeys.incidents.stats() })
      if(vars.data.from=='MAIN_UPDATE'){
        nav(`/incidents`)
      }
      
    },
    onError: (_error, newData, context) => {
      if (context?.previousData) {
        qc.setQueryData(
          queryKeys.incidents.list(newData.data.filters),
          context.previousData
        )
      }
    }
  })
}

export const useAddIncidentComment = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: ({ id, by, comment }: { id: string; by: string; comment: string }) => api.addComment(id, by, comment), onSuccess: (_d, vars) =>{
     
    qc.invalidateQueries({ queryKey: queryKeys.incidents.detail(vars.id) })
      
     qc.setQueryData<Incident | undefined>(
        queryKeys.incidents.detail(String(vars.id)),
        (old) => {
          if (!old) return old
          return {
            ...old,
            updates: [
              {
                id: _d.id,
                incidentId: vars.id,
                user: {name:vars.by},
                message: vars.comment,
                updateType: "COMMENT",
                createdAt: new Date().toISOString(),
              },
               ...(old.updates || []),
            ],
          }
        }
      )
  } })
}

export const useIncidentStats = (filters: Pick<Filters, 'startDate'|'endDate'|'cars'|'severity'|'status'>) => useQuery({ queryKey: ['incident-stats', filters], queryFn: () => api.getStats(filters) })
