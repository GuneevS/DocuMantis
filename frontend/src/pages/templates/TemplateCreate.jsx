import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { FiChevronLeft, FiUpload } from 'react-icons/fi'
import { createTemplate } from '../../services/api'

const TemplateCreate = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const { register, handleSubmit, formState: { errors } } = useForm()
  
  const onFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Only PDF files are allowed')
        e.target.value = null
        return
      }
      setSelectedFile(file)
    }
  }
  
  const onSubmit = async (data) => {
    if (!selectedFile) {
      toast.error('Please select a PDF file')
      return
    }
    
    try {
      setLoading(true)
      const formData = {
        ...data,
        file: selectedFile
      }
      const response = await createTemplate(formData)
      toast.success('Template uploaded successfully')
      navigate(`/templates/${response.data.id}/mapping`)
    } catch (error) {
      console.error('Error uploading template:', error)
      toast.error('Failed to upload template')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <Link to="/templates" className="text-gray-500 hover:text-gray-700 mr-4">
          <FiChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="page-title mb-0">Upload PDF Template</h1>
      </div>
      
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <label htmlFor="name" className="form-label">Template Name</label>
            <input
              type="text"
              id="name"
              className={`input ${errors.name ? 'border-red-500' : ''}`}
              {...register('name', { required: 'Template name is required' })}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className="form-label">Description (Optional)</label>
            <textarea
              id="description"
              rows="3"
              className="input"
              {...register('description')}
            ></textarea>
          </div>
          
          <div className="mb-6">
            <label htmlFor="file" className="form-label">PDF Template File</label>
            <div className={`border-2 border-dashed rounded-md p-6 ${errors.file ? 'border-red-300' : 'border-gray-300'}`}>
              <div className="text-center">
                <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {selectedFile ? selectedFile.name : 'Drag and drop a PDF file, or click to select'}
                  </p>
                </div>
                <input
                  id="file"
                  name="file"
                  type="file"
                  accept=".pdf"
                  className="sr-only"
                  onChange={onFileChange}
                />
                <button 
                  type="button"
                  onClick={() => document.getElementById('file').click()}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Select PDF
                </button>
              </div>
            </div>
            {!selectedFile && (
              <p className="mt-1 text-sm text-red-600">Please select a PDF file</p>
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
              type="submit"
              className="btn-primary"
              disabled={loading || !selectedFile}
            >
              {loading ? 'Uploading...' : 'Upload Template'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TemplateCreate 