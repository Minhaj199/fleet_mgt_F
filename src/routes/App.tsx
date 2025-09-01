
import { Outlet, NavLink, useLoaderData } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import LoadingAnimations from '../components/ui/loading'
import { useContext } from 'react'
import { IncidentContext, useLoadingContext} from '../context/context'



export default function App(){
  const {isLoading}=useLoadingContext()
  return (
    <div className="min-h-full">
     
          {isLoading&&<div className="w-full z-50 flex items-center justify-center  h-full  fixed">
                <LoadingAnimations variant="spinner" size="lg" />
              </div>}
          
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Fleet Manager</h1>
          <nav className="flex items-center gap-6">
            <NavLink to="/incidents" className={({isActive})=> isActive? 'font-semibold text-primary': ''}>Incidents</NavLink>
            <NavLink to="/incidents/new" className={({isActive})=> isActive? 'font-semibold text-primary': ''}>New Incident</NavLink>
            <NavLink to="/incidents/stats" className={({isActive})=> isActive? 'font-semibold text-primary': ''}>Statistics</NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-6">
        <Card>
          <CardHeader><CardTitle>Vehicle Incidents</CardTitle></CardHeader>
          <CardContent><Outlet /></CardContent>
        </Card>
      </main>
    </div>
  )
}
