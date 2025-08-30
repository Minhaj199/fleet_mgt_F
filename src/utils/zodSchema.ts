import z from "zod"

export const DetailsSchema = z.object({
  title: z.string().trim().min(2, 'Title is required').max(30,'max limit is 30'),
  description: z.string().min(2, 'Description is required').max(50,'max limit 50'),
  severity: z.enum(['LOW','MEDIUM','HIGH','CRITICAL'], { message:'Select severity' }),
  incidentType: z.enum(['ACCIDENT'
  ,'BREAKDOWN'
  ,'THEFT'
  ,'VANDALISM'
  ,"MAINTENANCE_ISSUE"
  ,"TRAFFIC_VIOLATION"
  ,"FUEL_ISSUE"
  ,"OTHER"],{ message:'Select type'})
})
export const LocationSchema = z.object({
  location: z.string().min(1, 'Location required').max(15,'max limit reached'),
  latitude: z.preprocess(val => val === ''? undefined : Number(val), z.number().optional()),
  longitude: z.preprocess(val => val === ''? undefined : Number(val), z.number().optional()),
  occurredAt: z.string().min(1, 'Date & time required'),
})
export const VehicleSchema = z.object({
  carName: z.string().min(1,'Car required'),
  reportedByName: z.string().min(1,'Reported by required'),
  images: z.array(z.string()).max(5).optional(),
  attachments: z.array(z.any()).optional(),
  odometer: z.preprocess(v=> v===''? undefined : Number(v), z.number().optional()),
  estimatedCost: z.preprocess(v=> v===''? undefined : Number(v), z.number().optional()),
})
export const EditExtrasSchema = z.object({
  changedBy: z.string().optional(),
  updateType: z.string().optional(),
  assignedTo: z.string().optional(),
  status: z.enum([
  'PENDING',
  'IN_PROGRESS',
  'RESOLVED',
  'CLOSED',
  'CANCELLED'
]).optional(),
  logMessage: z.string().optional(),
  actualCost: z.preprocess(v=> v===''? undefined : Number(v), z.number().optional()),
})