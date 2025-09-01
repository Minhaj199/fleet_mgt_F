
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import './styles.css'
import App from './routes/App'
import IncidentsList from './routes/incidents/IncidentsList'
import IncidentNew from './routes/incidents/IncidentNew'
import IncidentDetail from './routes/incidents/IncidentDetail'
import IncidentEdit from './routes/incidents/IncidentEdit'
import IncidentStats from './routes/incidents/IncidentStats'
import { SnackbarProvider} from 'notistack'
import { IncidentProvider } from './context/context'


const router = createBrowserRouter([
  { path: '/', element: <App />, children: [
    { index: true, element: <IncidentsList /> },
    { path: 'incidents', element: <IncidentsList /> },
    { path: 'incidents/new', element: <IncidentNew /> },
    { path: 'incidents/:i_id', element: <IncidentDetail /> },
    { path: 'incidents/:id/edit', element: <IncidentEdit /> },
    { path: 'incidents/stats', element: <IncidentStats /> },
  ]}
])

const qc = new QueryClient()
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SnackbarProvider maxSnack={1}>

  
    <QueryClientProvider client={qc}>
      <IncidentProvider>
      <RouterProvider router={router} />
      <Toaster />

      </IncidentProvider>
    </QueryClientProvider>
      </SnackbarProvider>
  </React.StrictMode>
)
