
export const queryKeys = {
  incidents: {
    lists: () => ['incidents'] as const,
    list: (filters:any) => ['incidents', filters] as const,
    detail: (id:string) => ['incident', id] as const,
    stats: () => ['incident-stats'] as const,
  }
}
