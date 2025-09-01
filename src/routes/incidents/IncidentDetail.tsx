import { useParams, Link } from 'react-router-dom'
import { useIncidentDetail, useAddIncidentComment } from '../../lib/queries/incidents'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { useState } from 'react'

export default function IncidentDetail() {
  const {i_id = '' } = useParams ()

  const { data={title:'',id:'',carName:'',images:[],documents:[],carId:'',description:'',occurredAt:'',car:{model:''},status:'PENDING',severity:'LOW',type:'OTHER',updates:[],assignedTo:{name:''},location:1,latitude:'',longitude:'',reportedAt:'',reportedByName:'',estimatedCost:'',actualCost:''} } = useIncidentDetail(i_id!)
  const [msg, setMsg] = useState('')
  const add = useAddIncidentComment()

  if (!data) return <div>Loading...</div>
  const i = data
  return (
   
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {i.title} <span className="text-gray-400">({i.id})</span>
          </h2>
          <div className="text-sm text-gray-600">
            {i.carName} • {new Date(i.occurredAt).toLocaleString()} 
          </div>
        </div>
        <div className="space-x-2">
          <Badge
            className={
              i.status === 'PENDING'
                ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                : i.status === 'IN_PROGRESS'
                ? 'bg-blue-50 border-blue-200 text-blue-800'
                : 'bg-green-50 border-green-200 text-green-800'
            }
          >
            {i.status.replace('_', ' ')}
          </Badge>
          <Badge
            className={
              i.severity === 'LOW'
                ? 'bg-green-50 border-green-200 text-green-800'
                : i.severity === 'MEDIUM'
                ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }
          >
            {i.severity}
          </Badge>
          <Badge className="bg-gray-50 border-gray-200">{i.type}</Badge>
          <Link
            to={`/incidents/${i.id}/edit`}
            className="text-primary underline text-sm"
          >
            Edit
          </Link>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-4">
          {/* Description */}
          <section className="space-y-2">
            <h3 className="font-semibold">Description</h3>
            <p className="text-sm text-gray-700">{i.description}</p>
          </section>

          {/* Attachments */}
          <section className="space-y-2">
            <h3 className="font-semibold">Attachments</h3>
            <div className="flex flex-wrap gap-2">
              {i.images?.map((a) =>
                 (
                  <img
                    key={a}
                    src={a}
                    className="h-24 w-24 object-cover rounded"
                  />
                ) 
              )}
              {i.documents?.map((el)=>{
                return(
                  <a
                  target="_blank"
                    key={el}
                    href={el}
                    download={el}
                    className="text-sm underline"
                  >
                    {el}
                  </a>
                )
              })}
            </div>
          </section>

          {/* Messages */}
          <section className="space-y-2">
            <h3 className="font-semibold">Messages&time line</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Write a message..."
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
              />
              <Button
                onClick={() => {
                  if (!msg) return
                  add.mutate({ id: i.id, by: 'user', comment: msg })
                  setMsg('')
                }}
              >
                Send
              </Button>
            </div>
            <ul className="divide-y border rounded-xl max-h-72 overflow-y-auto">
              {i.updates?.map((u) => (
                <li key={u.id} className="p-3 text-sm overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{u.user.name}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(u.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-gray-700">{u.message}</div>
                  <div className="text-xs text-gray-500 italic">
                    Type: {u.updateType ?? 'GENERAL'}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-2">
          <div>
            <span className="font-semibold">Vehicle</span>
            <div className="text-sm text-gray-700">{i.car.model}</div>
          </div>
          <div>
            <span className="font-semibold">Assigned To</span>
            <div className="text-sm text-gray-700">{i.assignedTo?i.assignedTo.name:'un assingned'}</div>
          </div>
          <div>
            <span className="font-semibold">Location</span>
            <div className="text-sm text-gray-700">{i.location}</div>
          </div>
          <div>
            <span className="font-semibold">Latitude</span>
            <div className="text-sm text-gray-700">{i.latitude ?? '-'}</div>
          </div>
          <div>
            <span className="font-semibold">Longitude</span>
            <div className="text-sm text-gray-700">{i.longitude ?? '-'}</div>
          </div>
          <div>
            <span className="font-semibold">Reported At</span>
            <div className="text-sm text-gray-700">
              {i.reportedAt ? new Date(i.reportedAt).toLocaleString() : '-'}
            </div>
          </div>
          <div>
            <span className="font-semibold">Reported By</span>
            <div className="text-sm text-gray-700">{i.reportedByName}</div>
          </div>
          <div>
            <span className="font-semibold">Costs</span>
            <div className="text-sm text-gray-700">
              Estimated: ${i.estimatedCost ?? 0} • Actual: ${i.actualCost ?? 0}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
