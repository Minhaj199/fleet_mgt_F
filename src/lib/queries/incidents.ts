
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../query-keys'
import * as api from '../mockApi'
import { Incident, UpdateInput } from '../../types/type'; 

export interface Filters { page?: number;status?:string, limit?: number; query?: string;assignedTo?:string ,cars?: string; severity?: string; type?: string; startDate?: string; endDate?: string }

export const useIncidents = (filters: Filters = {}) => useQuery({ queryKey: queryKeys.incidents.list(filters), queryFn: () => api.listIncidents(filters), placeholderData: p=>p })

export const useIncidentDetail = (id: string) => useQuery({ queryKey: queryKeys.incidents.detail(id), queryFn: () => api.getIncident(id), enabled: !!id })

export const useSeeds = () =>useQuery({queryKey:queryKeys.incidents.seeds(),queryFn:()=>api.fetchSeed(),
  staleTime: Infinity,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
   gcTime: Infinity,
  
})




export const useCreateIncident = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: (data: Partial<Incident>) => api.createIncident(data), onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.incidents.lists() }) })
}

export const useUpdateIncident = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UpdateInput> }) => api.updateIncident(id, data),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.incidents.lists() })
      qc.invalidateQueries({ queryKey: queryKeys.incidents.detail(String(vars.id)) })
     
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
