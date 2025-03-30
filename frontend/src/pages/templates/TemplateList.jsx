import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FiPlus, FiEdit2, FiTrash2, FiMap } from 'react-icons/fi'
import { fetchTemplates, deleteTemplate } from '../../services/api'

const TemplateList = () => {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  
  const loadTemplates = async () => {
    try {
      setLoading(true)
      const response = await fetchTemplates()
      setTemplates(response.data)
    } catch (error) {
      console.error('Error loading templates:', error)
      toast.error('Failed to load PDF templates')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadTemplates()
  }, [])
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await deleteTemplate(id)
        toast.success('Template deleted successfully')
        loadTemplates()
      } catch (error) {
        console.error('Error deleting template:', error)
        toast.error('Failed to delete template')
      }
    }
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">PDF Templates</h1>
        <Link to="/templates/create" className="btn-primary">
          <FiPlus className="mr-2" /> Add Template
        </Link>
      </div>
      
      {loading ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Loading templates...</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {templates.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No PDF templates found. Upload your first template.</p>
              <Link to="/templates/create" className="btn-primary mt-4">
                <FiPlus className="mr-2" /> Add Template
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fields Mapped
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {templates.map((template) => (
                    <tr key={template.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {template.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {template.description || 'No description'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(template.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {Object.keys(template.field_mappings || {}).length} fields
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <Link to={`/templates/${template.id}/mapping`} className="text-indigo-600 hover:text-indigo-900">
                            <FiMap />
                          </Link>
                          <Link to={`/templates/${template.id}`} className="text-blue-600 hover:text-blue-900">
                            <FiEdit2 />
                          </Link>
                          <button
                            onClick={() => handleDelete(template.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default TemplateList 