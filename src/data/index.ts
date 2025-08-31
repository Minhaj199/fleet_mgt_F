import { IncidentType, IncidentUpdateType, Severity, Status } from "../types/type"

export const cars = [
  { label: 'Toyota Corolla', value: 'toyota-corolla' },
  { label: 'Honda Civic', value: 'honda-civic' },
  { label: 'Ford Focus', value: 'ford-focus' },
]



export const statusArray:Status[]=["CANCELLED","PENDING","RESOLVED","CLOSED","IN_PROGRESS" ]
export const updateTypes:{label:string,value:IncidentUpdateType}[] =  [
  { label: "Status Change", value: "STATUS_CHANGE" },
  { label: "Comment Added", value: "COMMENT" },
  { label: "Assignment", value: "ASSIGNMENT" },
  { label: "Cost Update", value: "COST_UPDATE" },
  { label: "Resolution", value: "RESOLUTION" },
]
export const assignees = [
  { label: "Alice Johnson", value: "alice" },
  { label: "Bob Smith", value: "bob" },
  { label: "Charlie Davis", value: "charlie" },
]

export const statuses:{label:string,value:Status}[] = [
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Pending", value: "PENDING" },
  { label: "Resolved", value: "RESOLVED" },
  { label: "Closed", value: "CLOSED" },
  { label: "In Progress", value: "IN_PROGRESS" },
]
export const severities:{label:string,value:Severity}[] = [
  { label: "Low", value: "LOW" },
  { label: "Medium", value: "MEDIUM" },
  { label: "High", value: "HIGH" },
  { label: "Critical", value: "CRITICAL" }
];

export const AccidentOptions:{label:string,value:IncidentType}[] =[
  { label: "Accident", value: "ACCIDENT" },
  { label: "Breakdown", value: "BREAKDOWN" },
  { label: "Fuel Issue", value: "FUEL_ISSUE" },
  { label: "Maintenance Issue", value: "MAINTENANCE_ISSUE" },
  { label: "Theft", value: "THEFT" },
  { label: "Traffic Violation", value: "TRAFFIC_VIOLATION" },
  { label: "Vandalism", value: "VANDALISM" },
  { label: "Other", value: "OTHER" },
];

