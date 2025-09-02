import z from "zod"
import { DetailsSchema, EditExtrasSchema, LocationSchema, VehicleSchema } from "../lib/zodSchema"
import { Dispatch, SetStateAction } from "react"
import { Filters } from "../lib/queries/incidents"

export type IncidentFormValues = z.infer<typeof DetailsSchema> & z.infer<typeof LocationSchema> & z.infer<typeof VehicleSchema> & z.infer<typeof EditExtrasSchema>

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH'|'CRITICAL'
export type IncidentType = 'ACCIDENT'
  |'BREAKDOWN'
  |'THEFT'
  |'VANDALISM'
  |"MAINTENANCE_ISSUE"
  |"TRAFFIC_VIOLATION"
  |"FUEL_ISSUE"
  |"OTHER"
export type Status =  'PENDING'|'IN_PROGRESS'|'RESOLVED'|'CLOSED'|'CANCELLED'
export type IncidentUpdateType='STATUS_CHANGE'|
  'ASSIGNMENT'|
  'COMMENT'|
  'COST_UPDATE'|
  'RESOLUTION'
export type IncidentFormValuesType=Omit<IncidentFormValues,'assignedTo'>&{assignedTo:string|{name:string,id:string}}
export interface Attachment {
  id: string
  name: string
  type: string
  dataUrl: string
  size: number
}

export interface Incident {
  id: string
  title: string
  description: string
  severity: Severity
  type: IncidentType
  location: string
  latitude?: number
  longitude?: number
  occurredAt: string
  carId: string
  carName: string
  reportedById: string
  reportedByName: string
  attachments: Attachment[]
  images: string[]
  estimatedCost?: number
  actualCost?: number
  assignedTo?:{name:string,id:string}|string,
  status: Status
  assignee?: string
  resolvedAt?: string,
  reportedAt:Date|string
  updates: { id:string; createdAt:string; user:{name:string}; updateType:IncidentUpdateType; message:string }[]
}
 export type IncidentTable=Omit<Incident,'assignedTo'|'id'|'reportedAt'>&{id:string,assignedTo?:{name:string,id:string},reportedAt:string}
  export type IncidentDetails=Omit<Incident,'assignedTo'|'reportedAt'>&{car:{make:string,model:string},resolutionNotes?:string,assignedTo?:{name:string,id:number},reportedAt:string,tbId:string,images:string[],documents:string[]}
   type WithourAssinnedTo=Omit<Incident,'assignedTo'>
  export type IncidetInputs=WithourAssinnedTo&{
    assignedTo:string|{name:string,id:string}
  }
  
   export type UpdateInput = WithourAssinnedTo& {
    from:UPDATE_FROM
    filters?:Filters
    userId:string
    assignedTo?:{name:string,id:string}|string
    documents:string[]
  }


type UPDATE_FROM='INLINE'|'MAIN_UPDATE'

  export type IncidentRow={
    id: number,
    title: string,
    description: string,
    car: {model:string,make:string},
    assignedTo?: {name:string,id:string},
    severity: Severity,
    status: Status,
    type:IncidentType,
    location: string,
    occurredAt: string,
    resolvedAt?:string,
    reportedBy:{name:string,id:string}
}

/////car type//

export type Car={
    id: number,
    make: string,
    model: string,
    year: 2020,
    plateNumber: "AB123CD"
}

//////////////useres

export type Users={
    id: number,
    name: string,
    email: string,
}


export type ContextType={
  isLoading:boolean,
  setLoading:Dispatch<SetStateAction<boolean>>
}

