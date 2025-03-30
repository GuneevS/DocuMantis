import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FiChevronLeft, FiCheck, FiArrowRight, FiInfo, FiLink, FiLink2 } from 'react-icons/fi'
import { fetchTemplate, fetchTemplateFields, updateFieldMappings } from '../../services/api'

const CLIENT_FIELDS = [
  { id: 'first_name', label: 'First Name' },
  { id: 'last_name', label: 'Last Name' },
  { id: 'id_number', label: 'ID Number' },
  { id: 'date_of_birth', label: 'Date of Birth' },
  { id: 'email', label: 'Email' },
  { id: 'phone_number', label: 'Phone Number' },
  { id: 'address', label: 'Address' },
  { id: 'city', label: 'City' },
  { id: 'postal_code', label: 'Postal Code' },
  { id: 'country', label: 'Country' },
  { id: 'tax_number', label: 'Tax Number' },
  { id: 'bank_name', label: 'Bank Name' },
  { id: 'account_number', label: 'Account Number' },
  { id: 'branch_code', label: 'Branch Code' },
  { id: 'account_type', label: 'Account Type' },
  { id: 'employer', label: 'Employer' },
  { id: 'occupation', label: 'Occupation' },
  { id: 'income', label: 'Income' }
]

const CATEGORY_LABELS = {
  "personal_info": "Personal Information",
  "contact_info": "Contact Information",
  "banking_info": "Banking Details",
  "employment_info": "Employment Information",
  "tax_info": "Tax Information",
  "signature": "Signatures",
  "other": "Other Fields"
}

const SEMANTIC_TYPE_LABELS = {
  "id_number": "ID Number Fields",
  "name": "Name Fields",
  "email": "Email Fields",
  "phone": "Phone Number Fields",
  "address": "Address Fields",
  "city": "City Fields",
  "postal_code": "Postal Code Fields",
  "country": "Country Fields",
  "date_of_birth": "Date of Birth Fields",
  "tax_number": "Tax Number Fields",
  "bank_name": "Bank Name Fields",
  "account_number": "Account Number Fields",
  "branch_code": "Branch Code Fields",
  "signature": "Signature Fields",
  "date": "Date Fields",
  "unclassified": "Other Fields"
}

const TemplateMapping = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [template, setTemplate] = useState(null)
  const [pdfFields, setPdfFields] = useState({})
  const [categories, setCategories] = useState({})
  const [semanticGroups, setSemanticGroups] = useState({})
  const [mappings, setMappings] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)
  const [viewMode, setViewMode] = useState('category') // 'category' or 'semantic'
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch template data
        const templateResponse = await fetchTemplate(id)
        setTemplate(templateResponse.data)
        
        // Fetch PDF fields with categories
        const fieldsResponse = await fetchTemplateFields(id)
        setPdfFields(fieldsResponse.data.fields || {})
        setCategories(fieldsResponse.data.categories || {})
        
        // Set initial mappings from template
        setMappings(fieldsResponse.data.current_mappings || {})
        
        // Extract semantic groups from fields
        const semanticGroups = extractSemanticGroups(fieldsResponse.data.fields || {})
        setSemanticGroups(semanticGroups)
        
        // Set the first category as active if available
        if (viewMode === 'category') {
          const categoryKeys = Object.keys(fieldsResponse.data.categories || {})
          if (categoryKeys.length > 0) {
            setActiveCategory(categoryKeys[0])
          }
        } else {
          const semanticKeys = Object.keys(semanticGroups)
          if (semanticKeys.length > 0) {
            setActiveCategory(semanticKeys[0])
          }
        }
      } catch (error) {
        console.error('Error fetching template data:', error)
        toast.error('Failed to load template data')
        navigate('/templates')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [id, navigate, viewMode])
  
  // Extract semantic groups from fields
  const extractSemanticGroups = (fields) => {
    const groups = {}
    
    // Group fields by semantic type
    Object.entries(fields).forEach(([fieldName, fieldInfo]) => {
      const fingerprint = fieldInfo.semantic_fingerprint
      if (!fingerprint) return
      
      const parts = fingerprint.split(':')
      if (parts.length < 2) return
      
      const semanticType = parts[0]
      const confidence = parseFloat(parts[1])
      
      if (!groups[semanticType]) {
        groups[semanticType] = {}
      }
      
      groups[semanticType][fieldName] = {
        confidence,
        display_name: fieldInfo.display_name
      }
    })
    
    // Filter out single-field groups
    return Object.fromEntries(
      Object.entries(groups)
        .filter(([_, fields]) => Object.keys(fields).length > 1)
    )
  }
  
  const handleMappingChange = (pdfFieldId, clientFieldId) => {
    setMappings({
      ...mappings,
      [pdfFieldId]: clientFieldId
    })
  }
  
  const handleSave = async () => {
    try {
      setSaving(true)
      await updateFieldMappings(id, mappings)
      toast.success('Field mappings saved successfully')
      navigate('/templates')
    } catch (error) {
      console.error('Error saving field mappings:', error)
      toast.error('Failed to save field mappings')
    } finally {
      setSaving(false)
    }
  }
  
  const handleBulkMapping = (groupName, clientFieldId, isSemanticGroup = false) => {
    // Map all fields in the group to the same client field
    const newMappings = { ...mappings }
    
    if (isSemanticGroup) {
      // For semantic groups
      const fieldsInGroup = semanticGroups[groupName] || {}
      Object.keys(fieldsInGroup).forEach(fieldName => {
        newMappings[fieldName] = clientFieldId
      })
      
      toast.success(`Mapped all ${SEMANTIC_TYPE_LABELS[groupName] || groupName} fields to ${CLIENT_FIELDS.find(f => f.id === clientFieldId)?.label}`)
    } else {
      // For category groups
      const fieldsInCategory = categories[groupName] || []
      fieldsInCategory.forEach(fieldName => {
        newMappings[fieldName] = clientFieldId
      })
      
      toast.success(`Mapped all ${CATEGORY_LABELS[groupName]} fields to ${CLIENT_FIELDS.find(f => f.id === clientFieldId)?.label}`)
    }
    
    setMappings(newMappings)
  }
  
  const getCategoryCompletionStatus = (categoryName) => {
    const fieldsInCategory = categories[categoryName] || []
    const mappedFields = fieldsInCategory.filter(fieldName => mappings[fieldName])
    return {
      total: fieldsInCategory.length,
      mapped: mappedFields.length,
      percentage: fieldsInCategory.length > 0 
        ? Math.round((mappedFields.length / fieldsInCategory.length) * 100) 
        : 0
    }
  }
  
  const getSemanticGroupCompletionStatus = (groupName) => {
    const fieldsInGroup = semanticGroups[groupName] || {}
    const fieldNames = Object.keys(fieldsInGroup)
    const mappedFields = fieldNames.filter(fieldName => mappings[fieldName])
    return {
      total: fieldNames.length,
      mapped: mappedFields.length,
      percentage: fieldNames.length > 0 
        ? Math.round((mappedFields.length / fieldNames.length) * 100) 
        : 0
    }
  }
  
  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Loading template data...</p>
      </div>
    )
  }
  
  // Generate sidebar buttons based on view mode
  const sidebarButtons = viewMode === 'category' 
    ? Object.keys(categories).map(categoryName => {
        const status = getCategoryCompletionStatus(categoryName)
        
        return (
          <button
            key={categoryName}
            className={`flex flex-col items-start p-4 rounded-md mb-2 w-full text-left ${
              activeCategory === categoryName && viewMode === 'category'
                ? 'bg-primary-100 border-l-4 border-primary-500'
                : 'bg-white hover:bg-gray-50 border-l-4 border-transparent'
            }`}
            onClick={() => {
              setActiveCategory(categoryName)
              setViewMode('category')
            }}
          >
            <div className="flex justify-between w-full">
              <span className="font-medium">{CATEGORY_LABELS[categoryName] || categoryName}</span>
              <span className="text-sm text-gray-500">{status.mapped}/{status.total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-primary-600 h-2 rounded-full" 
                style={{ width: `${status.percentage}%` }}
              ></div>
            </div>
          </button>
        )
      })
    : Object.keys(semanticGroups).map(groupName => {
        const status = getSemanticGroupCompletionStatus(groupName)
        
        return (
          <button
            key={groupName}
            className={`flex flex-col items-start p-4 rounded-md mb-2 w-full text-left ${
              activeCategory === groupName && viewMode === 'semantic'
                ? 'bg-indigo-100 border-l-4 border-indigo-500'
                : 'bg-white hover:bg-gray-50 border-l-4 border-transparent'
            }`}
            onClick={() => {
              setActiveCategory(groupName)
              setViewMode('semantic')
            }}
          >
            <div className="flex justify-between w-full">
              <span className="font-medium">{SEMANTIC_TYPE_LABELS[groupName] || groupName}</span>
              <span className="text-sm text-gray-500">{status.mapped}/{status.total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full" 
                style={{ width: `${status.percentage}%` }}
              ></div>
            </div>
          </button>
        )
      })
  
  // Fields to display based on view mode and active category
  const fieldsToDisplay = viewMode === 'category'
    ? (activeCategory ? categories[activeCategory] || [] : [])
    : (activeCategory ? Object.keys(semanticGroups[activeCategory] || {}) : [])
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <Link to="/templates" className="text-gray-500 hover:text-gray-700 mr-4">
          <FiChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="page-title mb-0">Map PDF Fields: {template?.name}</h1>
      </div>
      
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <FiInfo className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Fields can be viewed by category or by semantic type. Semantic grouping intelligently identifies fields that serve the same purpose across the document.
              You can map all fields in a group at once, or map individual fields.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Category List */}
        <div className="col-span-1">
          <div className="bg-white rounded-lg shadow p-4 sticky top-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-medium text-gray-700">Field Groups</h2>
              <div className="flex space-x-2">
                <button 
                  className={`px-2 py-1 text-xs rounded-md ${viewMode === 'category' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => setViewMode('category')}
                >
                  By Category
                </button>
                <button 
                  className={`px-2 py-1 text-xs rounded-md ${viewMode === 'semantic' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => setViewMode('semantic')}
                >
                  By Semantic Type
                </button>
              </div>
            </div>
            {sidebarButtons}
          </div>
        </div>
        
        {/* Field Mapping Panel */}
        <div className="col-span-3">
          <div className="card mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                {viewMode === 'category' 
                  ? (CATEGORY_LABELS[activeCategory] || 'Select a Category')
                  : (SEMANTIC_TYPE_LABELS[activeCategory] || 'Select a Semantic Group')}
              </h2>
              
              {/* Quick mapping dropdown */}
              {activeCategory && (
                <div className="flex items-center">
                  <span className="mr-2 text-sm text-gray-500">Map all to:</span>
                  <select 
                    className="form-select rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    onChange={(e) => handleBulkMapping(activeCategory, e.target.value, viewMode === 'semantic')}
                    value=""
                  >
                    <option value="" disabled>Select client field</option>
                    {CLIENT_FIELDS.map(clientField => (
                      <option key={clientField.id} value={clientField.id}>
                        {clientField.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            
            {fieldsToDisplay.length === 0 ? (
              <div className="bg-yellow-50 p-4 rounded-md">
                <p className="text-yellow-700">
                  {activeCategory 
                    ? 'No fields in this group. Select another group.'
                    : 'Select a group from the left to start mapping fields.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {fieldsToDisplay.map(fieldName => {
                  // Get confidence score for semantic view
                  const confidenceScore = viewMode === 'semantic' 
                    ? semanticGroups[activeCategory]?.[fieldName]?.confidence || 0
                    : 0
                  
                  return (
                    <div key={fieldName} className="grid grid-cols-12 items-center border border-gray-200 rounded-md p-3">
                      <div className="col-span-5">
                        <div className="flex items-center">
                          {viewMode === 'semantic' && (
                            <div className="mr-2">
                              <FiLink2 className="text-indigo-500" title="Semantically linked field" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium">{pdfFields[fieldName]?.display_name || fieldName}</p>
                            <p className="text-xs text-gray-500 truncate">{fieldName}</p>
                            {viewMode === 'semantic' && (
                              <div className="mt-1 flex items-center">
                                <div className="w-16 bg-gray-200 rounded-full h-1 mr-2">
                                  <div 
                                    className={`h-1 rounded-full ${
                                      confidenceScore > 0.7 ? 'bg-green-500' : 
                                      confidenceScore > 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${confidenceScore * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {Math.round(confidenceScore * 100)}% match
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-span-2 flex justify-center">
                        <FiArrowRight className="text-gray-400" />
                      </div>
                      <div className="col-span-5">
                        <select
                          className="input"
                          value={mappings[fieldName] || ''}
                          onChange={(e) => handleMappingChange(fieldName, e.target.value)}
                        >
                          <option value="">Select client field</option>
                          {CLIENT_FIELDS.map(clientField => (
                            <option key={clientField.id} value={clientField.id}>
                              {clientField.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/templates')}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-primary"
              disabled={saving}
              onClick={handleSave}
            >
              {saving ? 'Saving...' : (
                <>
                  <FiCheck className="mr-2" /> Save Mappings
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TemplateMapping 