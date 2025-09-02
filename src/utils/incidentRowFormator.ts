import { Incident, IncidentRow, IncidentTable } from "../types/type";



export function rowIncidentFormater(data:IncidentRow[]){
    
      
        const processedData:Partial<IncidentTable>[]= data?.map(el=>{
        return {
            id:String(el.id),
            title:el.title,
            description:el.title,
            carName:el.car.model,
            assignedTo:el.assignedTo,
            severity:el.severity,
            status:el.status,
            type:el.type,
            location:el.location,
            occurredAt:el.occurredAt,
            tbId:'INC-' + String(el.id).padStart(3,'0'),
            resolvedAt:el.resolvedAt,
            reportedByName:el.reportedBy.name
        }
    })
    return processedData
}