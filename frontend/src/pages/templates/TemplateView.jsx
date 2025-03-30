import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FiChevronLeft, FiEdit2, FiMap } from 'react-icons/fi'
import { fetchTemplate, fetchTemplateFields } from '../../services/api'

const TemplateView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [template, setTemplate] = useState(null)
  const [fields, setFields] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch template data
        const templateResponse = await fetchTemplate(id)
        setTemplate(templateResponse.data)
        
        // Fetch PDF fields
        const fieldsResponse = await fetchTemplateFields(id)
        const fieldNames = Object.keys(fieldsResponse.data.fields)
        setFields(fieldNames)
      } catch (error) {
        console.error('Error fetching template data:', error)
        toast.error('Failed to load template data')
        navigate('/templates')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [id, navigate])
  
  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Loading template data...</p>
      </div>
    )
  }
  
  if (!template) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Template not found</p>
        <Link to="/templates" className="btn-primary mt-4">
          Back to Templates
        </Link>
      </div>
    )
  }
  
  // Get mapped fields
  const mappedFields = Object.entries(template.field_mappings || {}).map(([pdfField, clientField]) => ({
    pdfField,
    clientField
  }))
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <Link to="/templates" className="text-gray-500 hover:text-gray-700 mr-4">
          <FiChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="page-title mb-0">Template Details</h1>
        <div className="flex-grow"></div>
        <Link to={`/templates/${id}/mapping`} className="btn-primary">
          <FiMap className="mr-2" /> Edit Mappings
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Template Info */}
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Template Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-base">{template.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p className="text-base">{template.description || 'No description'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Created At</p>
              <p className="text-base">{new Date(template.created_at).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Last Updated</p>
              <p className="text-base">{new Date(template.updated_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        {/* Form Fields */}
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">PDF Form Fields</h2>
          {fields.length === 0 ? (
            <p className="text-gray-500">No fillable fields found in this PDF.</p>
          ) : (
            <div className="space-y-2">
              {fields.map(field => (
                <div key={field} className="p-2 bg-gray-50 rounded-md">
                  <p className="text-sm">{field}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Field Mappings */}
        <div className="card md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Field Mappings</h2>
            <Link to={`/templates/${id}/mapping`} className="text-primary-600 hover:text-primary-800 text-sm flex items-center">
              <FiEdit2 className="mr-1" /> Edit Mappings
            </Link>
          </div>
          
          {mappedFields.length === 0 ? (
            <p className="text-gray-500">No field mappings configured yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PDF Field
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client Field
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mappedFields.map((mapping, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {mapping.pdfField}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {mapping.clientField}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TemplateView 