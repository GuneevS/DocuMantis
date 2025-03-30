import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiUser, FiFileText, FiFilePlus, FiUserPlus } from 'react-icons/fi'
import axios from 'axios'

const Dashboard = () => {
  const [stats, setStats] = useState({
    clients: 0,
    templates: 0,
    recentPDFs: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real implementation, you'd fetch actual stats from the API
    const fetchStats = async () => {
      try {
        // Simulate API call to get dashboard statistics
        // const response = await axios.get('http://localhost:8000/stats')
        // setStats(response.data)
        
        // For now, we'll use dummy data
        setTimeout(() => {
          setStats({
            clients: 12,
            templates: 5,
            recentPDFs: [
              { id: 1, clientName: 'John Smith', templateName: 'Risk Profile Questionnaire', date: '2023-03-01' },
              { id: 2, clientName: 'Sarah Johnson', templateName: 'Introduction Letter', date: '2023-02-28' },
              { id: 3, clientName: 'Michael Brown', templateName: 'RA Builder App', date: '2023-02-27' }
            ]
          })
          setLoading(false)
        }, 500)
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      
      {loading ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      ) : (
        <>
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="card bg-white shadow rounded-lg p-6 flex items-center">
              <div className="p-3 rounded-full bg-primary-100 text-primary-600 mr-4">
                <FiUser className="h-8 w-8" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Clients</p>
                <p className="text-2xl font-bold">{stats.clients}</p>
                <Link to="/clients" className="text-primary-600 hover:text-primary-800 text-sm">
                  View all clients
                </Link>
              </div>
            </div>
            
            <div className="card bg-white shadow rounded-lg p-6 flex items-center">
              <div className="p-3 rounded-full bg-primary-100 text-primary-600 mr-4">
                <FiFileText className="h-8 w-8" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">PDF Templates</p>
                <p className="text-2xl font-bold">{stats.templates}</p>
                <Link to="/templates" className="text-primary-600 hover:text-primary-800 text-sm">
                  View all templates
                </Link>
              </div>
            </div>
          </div>
          
          {/* Quick actions */}
          <div className="card mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/clients/create"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="p-2 rounded-full bg-primary-100 text-primary-600 mr-3">
                  <FiUserPlus className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Add New Client</p>
                  <p className="text-sm text-gray-500">Create a new client record</p>
                </div>
              </Link>
              
              <Link
                to="/generate-pdf"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="p-2 rounded-full bg-primary-100 text-primary-600 mr-3">
                  <FiFilePlus className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Generate PDF</p>
                  <p className="text-sm text-gray-500">Fill PDF forms with client data</p>
                </div>
              </Link>
            </div>
          </div>
          
          {/* Recent PDF generations */}
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recently Generated PDFs</h2>
            {stats.recentPDFs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Template
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.recentPDFs.map((pdf) => (
                      <tr key={pdf.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {pdf.clientName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pdf.templateName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pdf.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <a href="#" className="text-primary-600 hover:text-primary-900">
                            Download
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No PDFs have been generated yet.</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard 