
import { Outlet, NavLink } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'

export default function App(){
  return (
    <div className="min-h-full">
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
