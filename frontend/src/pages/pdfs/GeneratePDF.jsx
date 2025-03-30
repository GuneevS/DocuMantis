import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FiChevronLeft, FiFileText, FiDownload, FiInfo } from 'react-icons/fi'
import { fetchClients, fetchTemplates, generatePDF, downloadGeneratedPDF, fetchTemplateFields } from '../../services/api'

const GeneratePDF = () => {
  const navigate = useNavigate()
  
  const [clients, setClients] = useState([])
  const [templates, setTemplates] = useState([])
  const [selectedClient, setSelectedClient] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [templateInfo, setTemplateInfo] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [generatedPDFId, setGeneratedPDFId] = useState(null)
  const [downloading, setDownloading] = useState(false)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch clients and templates
        const [clientsResponse, templatesResponse] = await Promise.all([
          fetchClients(),
          fetchTemplates()
        ])
        
        setClients(clientsResponse.data)
        setTemplates(templatesResponse.data)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  // Fetch template fields and semantic information when a template is selected
  useEffect(() => {
    const fetchTemplateInfo = async () => {
      if (!selectedTemplate) {
        setTemplateInfo(null)
        return
      }
      
      try {
        const response = await fetchTemplateFields(selectedTemplate)
        setTemplateInfo(response.data)
      } catch (error) {
        console.error('Error fetching template info:', error)
        toast.error('Failed to load template field information')
      }
    }
    
    fetchTemplateInfo()
  }, [selectedTemplate])
  
  const handleGenerate = async () => {
    if (!selectedClient || !selectedTemplate) {
      toast.error('Please select a client and a template')
      return
    }
    
    try {
      setGenerating(true)
      setGeneratedPDFId(null)
      
      const response = await generatePDF({
        client_id: parseInt(selectedClient),
        template_id: parseInt(selectedTemplate)
      })
      
      setGeneratedPDFId(response.data.id)
      toast.success('PDF generated successfully with intelligent field mapping')
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Failed to generate PDF')
    } finally {
      setGenerating(false)
    }
  }
  
  const handleDownload = async () => {
    if (!generatedPDFId) return
    
    try {
      setDownloading(true)
      
      const response = await downloadGeneratedPDF(generatedPDFId)
      
      // Create a blob from the response data
      const blob = new Blob([response.data], { type: 'application/pdf' })
      
      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // Find client and template names for the filename
      const client = clients.find(c => c.id === parseInt(selectedClient))
      const template = templates.find(t => t.id === parseInt(selectedTemplate))
      const filename = `${template?.name}_${client?.last_name}_${client?.first_name}.pdf`
      
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success('PDF downloaded successfully')
    } catch (error) {
      console.error('Error downloading PDF:', error)
      toast.error('Failed to download PDF')
    } finally {
      setDownloading(false)
    }
  }
  
  // Get semantic mapping statistics
  const getSemanticMappingStats = () => {
    if (!templateInfo || !templateInfo.semantic_groups) {
      return { groups: 0, fields: 0 };
    }
    
    const groups = Object.keys(templateInfo.semantic_groups).length;
    const fields = Object.values(templateInfo.semantic_groups).reduce((count, group) => {
      return count + Object.keys(group).length;
    }, 0);
    
    return { groups, fields };
  }
  
  // Get explicitly mapped fields count
  const getExplicitMappingCount = () => {
    if (!templateInfo || !templateInfo.current_mappings) {
      return 0;
    }
    return Object.keys(templateInfo.current_mappings).length;
  }
  
  const stats = getSemanticMappingStats();
  const explicitMappings = getExplicitMappingCount();
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <Link to="/" className="text-gray-500 hover:text-gray-700 mr-4">
          <FiChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="page-title mb-0">Generate PDF</h1>
      </div>
      
      <div className="card mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Generate a PDF for a Client</h2>
        
        {loading ? (
          <div className="text-center py-4">
            <p className="text-gray-500">Loading data...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="mb-4">
              <label className="form-label">Select Client</label>
              <select
                className="input"
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                disabled={generating}
              >
                <option value="">-- Select a client --</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.first_name} {client.last_name} ({client.id_number})
                  </option>
                ))}
              </select>
              {clients.length === 0 && (
                <p className="mt-1 text-sm text-red-600">
                  No clients found. <Link to="/clients/create" className="text-primary-600">Add a client</Link>
                </p>
              )}
            </div>
            
            <div className="mb-4">
              <label className="form-label">Select PDF Template</label>
              <select
                className="input"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                disabled={generating}
              >
                <option value="">-- Select a template --</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
              {templates.length === 0 && (
                <p className="mt-1 text-sm text-red-600">
                  No templates found. <Link to="/templates/create" className="text-primary-600">Add a template</Link>
                </p>
              )}
            </div>
            
            {templateInfo && selectedTemplate && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <FiInfo className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Intelligent Field Mapping Information</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>This template contains:</p>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>
                          <span className="font-medium">{Object.keys(templateInfo.fields || {}).length}</span> total form fields
                        </li>
                        <li>
                          <span className="font-medium">{explicitMappings}</span> explicitly mapped fields
                        </li>
                        <li>
                          <span className="font-medium">{stats.groups}</span> semantic field groups containing{' '}
                          <span className="font-medium">{stats.fields}</span> related fields
                        </li>
                      </ul>
                      <p className="mt-2">
                        Our intelligent mapping system will automatically fill related fields with the same data type, 
                        ensuring complete and consistent form filling with minimal manual mapping.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                className="btn-primary"
                onClick={handleGenerate}
                disabled={generating || !selectedClient || !selectedTemplate}
              >
                {generating ? 'Generating...' : (
                  <>
                    <FiFileText className="mr-2" /> Generate PDF
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {generatedPDFId && (
        <div className="card bg-green-50 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-green-800">PDF Generated Successfully</h3>
              <p className="text-sm text-green-700 mt-1">
                Your PDF has been generated with intelligent field mapping and is ready for download.
              </p>
            </div>
            <button
              className="btn-primary bg-green-600 hover:bg-green-700 focus:ring-green-500"
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? 'Downloading...' : (
                <>
                  <FiDownload className="mr-2" /> Download PDF
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default GeneratePDF 