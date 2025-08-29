import z from "zod"
import { DetailsSchema, EditExtrasSchema, LocationSchema, VehicleSchema } from "../utils/zodSchema"

export type IncidentFormValues = z.infer<typeof DetailsSchema> & z.infer<typeof LocationSchema> & z.infer<typeof VehicleSchema> & z.infer<typeof EditExtrasSchema>
export type Severity = 'LOW' | 'MEDIUM' | 'HIGH'
export type IncidentType = 'COLLISION' | 'MECHANICAL' | 'OTHER'
export type Status = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED'

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
  incidentType: IncidentType
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
  odometer?: number
  estimatedCost?: number
  actualCost?: number
  assignedTo?:string,
  status: Status
  assignee?: string
  resolvedAt?: string,
  reportedAt:Date
  updates: { id:string; at:string; by:string; type:'COMMENT'|'STATUS'|'EDIT'; message:string }[]
}
