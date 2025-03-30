import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FiEdit2, FiChevronLeft, FiFileText } from 'react-icons/fi'
import { fetchClient } from '../../services/api'

const ClientView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [client, setClient] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadClient = async () => {
      try {
        setLoading(true)
        const response = await fetchClient(id)
        setClient(response.data)
      } catch (error) {
        console.error('Error loading client:', error)
        toast.error('Failed to load client details')
        navigate('/clients')
      } finally {
        setLoading(false)
      }
    }

    loadClient()
  }, [id, navigate])

  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Loading client details...</p>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Client not found</p>
        <Link to="/clients" className="btn-primary mt-4">
          Back to Clients
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link to="/clients" className="text-gray-500 hover:text-gray-700 mr-4">
          <FiChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="page-title mb-0">Client Details</h1>
        <div className="flex-grow"></div>
        <Link to={`/clients/${id}/edit`} className="btn-primary">
          <FiEdit2 className="mr-2" /> Edit Client
        </Link>
        <Link to="/generate-pdf" className="btn-secondary ml-3">
          <FiFileText className="mr-2" /> Generate PDF
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Full Name</p>
              <p className="text-base">{client.first_name} {client.last_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">ID Number</p>
              <p className="text-base">{client.id_number}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Date of Birth</p>
              <p className="text-base">{new Date(client.date_of_birth).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Tax Number</p>
              <p className="text-base">{client.tax_number}</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-base">{client.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="text-base">{client.phone_number}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Address</p>
              <p className="text-base">{client.address}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">City / Postal Code</p>
              <p className="text-base">{client.city}, {client.postal_code}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Country</p>
              <p className="text-base">{client.country}</p>
            </div>
          </div>
        </div>

        {/* Banking Details */}
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Banking Details</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Bank Name</p>
              <p className="text-base">{client.bank_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Account Number</p>
              <p className="text-base">{client.account_number}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Branch Code</p>
              <p className="text-base">{client.branch_code}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Account Type</p>
              <p className="text-base">{client.account_type}</p>
            </div>
          </div>
        </div>

        {/* Employment Details */}
        <div className="card">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Employment Details</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Employer</p>
              <p className="text-base">{client.employer || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Occupation</p>
              <p className="text-base">{client.occupation || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Monthly Income</p>
              <p className="text-base">{client.income || 'Not specified'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientView 