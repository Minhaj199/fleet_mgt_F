import z from "zod"

export const DetailsSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().min(2, 'Description is required'),
  severity: z.enum(['LOW','MEDIUM','HIGH'], { message:'Select severity' }),
  incidentType: z.enum(['COLLISION','MECHANICAL','OTHER'],{ message:'Select type'})
})
export const LocationSchema = z.object({
  location: z.string().min(1, 'Location required'),
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
  status: z.enum(['PENDING','IN_PROGRESS','RESOLVED']).optional(),
  logMessage: z.string().optional(),
  actualCost: z.preprocess(v=> v===''? undefined : Number(v), z.number().optional()),
})