import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FiPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi'
import { fetchClients, deleteClient } from '../../services/api'

const ClientList = () => {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)

  const loadClients = async () => {
    try {
      setLoading(true)
      const response = await fetchClients()
      setClients(response.data)
    } catch (error) {
      console.error('Error loading clients:', error)
      toast.error('Failed to load clients')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClients()
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await deleteClient(id)
        toast.success('Client deleted successfully')
        loadClients()
      } catch (error) {
        console.error('Error deleting client:', error)
        toast.error('Failed to delete client')
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Clients</h1>
        <Link to="/clients/create" className="btn-primary">
          <FiPlus className="mr-2" /> Add Client
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Loading clients...</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {clients.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No clients found. Create your first client.</p>
              <Link to="/clients/create" className="btn-primary mt-4">
                <FiPlus className="mr-2" /> Add Client
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
                      ID Number
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clients.map((client) => (
                    <tr key={client.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {client.first_name} {client.last_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{client.id_number}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{client.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{client.phone_number}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link to={`/clients/${client.id}`} className="text-primary-600 hover:text-primary-900">
                            <FiEye />
                          </Link>
                          <Link to={`/clients/${client.id}/edit`} className="text-blue-600 hover:text-blue-900">
                            <FiEdit2 />
                          </Link>
                          <button 
                            onClick={() => handleDelete(client.id)} 
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

export default ClientList 