
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../query-keys'
import * as api from '../mockApi'
import { Incident } from '../../types/type'; 

export interface Filters { page?: number; limit?: number; query?: string; status?: string; severity?: string; type?: string; startDate?: string; endDate?: string }

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
    mutationFn: ({ id, data }: { id: string; data: Partial<Incident> }) => api.updateIncident(id, data),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.incidents.lists() })
      qc.invalidateQueries({ queryKey: queryKeys.incidents.detail(vars.id) })
    }
  })
}

export const useAddIncidentComment = () => {
  const qc = useQueryClient()
  return useMutation({ mutationFn: ({ id, by, comment }: { id: string; by: string; comment: string }) => api.addComment(id, by, comment), onSuccess: (_d, vars) => qc.invalidateQueries({ queryKey: queryKeys.incidents.detail(vars.id) }) })
}

export const useIncidentStats = (filters: Pick<Filters, 'startDate'|'endDate'|'status'|'severity'>) => useQuery({ queryKey: ['incident-stats', filters], queryFn: () => api.getStats(filters) })
