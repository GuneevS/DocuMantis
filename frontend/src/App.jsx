import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

// Pages
import Dashboard from './pages/Dashboard'
import ClientList from './pages/clients/ClientList'
import ClientCreate from './pages/clients/ClientCreate'
import ClientView from './pages/clients/ClientView'
import ClientEdit from './pages/clients/ClientEdit'
import TemplateList from './pages/templates/TemplateList'
import TemplateCreate from './pages/templates/TemplateCreate'
import TemplateView from './pages/templates/TemplateView'
import TemplateMapping from './pages/templates/TemplateMapping'
import GeneratePDF from './pages/pdfs/GeneratePDF'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        
        {/* Client Routes */}
        <Route path="clients">
          <Route index element={<ClientList />} />
          <Route path="create" element={<ClientCreate />} />
          <Route path=":id" element={<ClientView />} />
          <Route path=":id/edit" element={<ClientEdit />} />
        </Route>
        
        {/* Template Routes */}
        <Route path="templates">
          <Route index element={<TemplateList />} />
          <Route path="create" element={<TemplateCreate />} />
          <Route path=":id" element={<TemplateView />} />
          <Route path=":id/mapping" element={<TemplateMapping />} />
        </Route>
        
        {/* PDF Generation */}
        <Route path="generate-pdf" element={<GeneratePDF />} />
      </Route>
    </Routes>
  )
}

export default App 