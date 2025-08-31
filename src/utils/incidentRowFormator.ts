import { Incident, IncidentRow, IncidentTable } from "../types/type";



export function rowIncidentFormater(data:IncidentRow[]){
    try {
        const processedData:Partial<IncidentTable>[]= data?.map(el=>{
        return {
            id:String(el.id),
            title:el.title,
            description:el.title,
            carName:el.car.model,
            assignedTo:el.assignedTo,
            severity:el.severity,
            status:el.status,
            incidentType:el.type,
            location:el.location,
            occurredAt:el.occurredAt,
            tbId:'INC-' + String(el.id).padStart(3,'0')
        }
    })
    return processedData
    } catch (error) {
        console.log(error)
        return []
    }
   
}