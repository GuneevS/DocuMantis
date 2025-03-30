import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { FiChevronLeft } from 'react-icons/fi'
import { createClient } from '../../services/api'

const ClientCreate = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()
  
  const onSubmit = async (data) => {
    try {
      setLoading(true)
      await createClient(data)
      toast.success('Client created successfully')
      navigate('/clients')
    } catch (error) {
      console.error('Error creating client:', error)
      toast.error('Failed to create client')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <Link to="/clients" className="text-gray-500 hover:text-gray-700 mr-4">
          <FiChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="page-title mb-0">Add New Client</h1>
      </div>
      
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
              
              <div className="mb-4">
                <label htmlFor="first_name" className="form-label">First Name</label>
                <input
                  type="text"
                  id="first_name"
                  className={`input ${errors.first_name ? 'border-red-500' : ''}`}
                  {...register('first_name', { required: 'First name is required' })}
                />
                {errors.first_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="last_name" className="form-label">Last Name</label>
                <input
                  type="text"
                  id="last_name"
                  className={`input ${errors.last_name ? 'border-red-500' : ''}`}
                  {...register('last_name', { required: 'Last name is required' })}
                />
                {errors.last_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="id_number" className="form-label">ID Number</label>
                <input
                  type="text"
                  id="id_number"
                  className={`input ${errors.id_number ? 'border-red-500' : ''}`}
                  {...register('id_number', { required: 'ID number is required' })}
                />
                {errors.id_number && (
                  <p className="mt-1 text-sm text-red-600">{errors.id_number.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="date_of_birth" className="form-label">Date of Birth</label>
                <input
                  type="date"
                  id="date_of_birth"
                  className={`input ${errors.date_of_birth ? 'border-red-500' : ''}`}
                  {...register('date_of_birth', { required: 'Date of birth is required' })}
                />
                {errors.date_of_birth && (
                  <p className="mt-1 text-sm text-red-600">{errors.date_of_birth.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="tax_number" className="form-label">Tax Number</label>
                <input
                  type="text"
                  id="tax_number"
                  className={`input ${errors.tax_number ? 'border-red-500' : ''}`}
                  {...register('tax_number', { required: 'Tax number is required' })}
                />
                {errors.tax_number && (
                  <p className="mt-1 text-sm text-red-600">{errors.tax_number.message}</p>
                )}
              </div>
            </div>
            
            {/* Contact Information */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
              
              <div className="mb-4">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  className={`input ${errors.email ? 'border-red-500' : ''}`}
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="phone_number" className="form-label">Phone Number</label>
                <input
                  type="text"
                  id="phone_number"
                  className={`input ${errors.phone_number ? 'border-red-500' : ''}`}
                  {...register('phone_number', { required: 'Phone number is required' })}
                />
                {errors.phone_number && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone_number.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="address" className="form-label">Address</label>
                <input
                  type="text"
                  id="address"
                  className={`input ${errors.address ? 'border-red-500' : ''}`}
                  {...register('address', { required: 'Address is required' })}
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="city" className="form-label">City</label>
                <input
                  type="text"
                  id="city"
                  className={`input ${errors.city ? 'border-red-500' : ''}`}
                  {...register('city', { required: 'City is required' })}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="postal_code" className="form-label">Postal Code</label>
                <input
                  type="text"
                  id="postal_code"
                  className={`input ${errors.postal_code ? 'border-red-500' : ''}`}
                  {...register('postal_code', { required: 'Postal code is required' })}
                />
                {errors.postal_code && (
                  <p className="mt-1 text-sm text-red-600">{errors.postal_code.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="country" className="form-label">Country</label>
                <input
                  type="text"
                  id="country"
                  className={`input ${errors.country ? 'border-red-500' : ''}`}
                  {...register('country', { required: 'Country is required' })}
                />
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Banking Details */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Banking Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="mb-4">
                <label htmlFor="bank_name" className="form-label">Bank Name</label>
                <input
                  type="text"
                  id="bank_name"
                  className={`input ${errors.bank_name ? 'border-red-500' : ''}`}
                  {...register('bank_name', { required: 'Bank name is required' })}
                />
                {errors.bank_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.bank_name.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="account_number" className="form-label">Account Number</label>
                <input
                  type="text"
                  id="account_number"
                  className={`input ${errors.account_number ? 'border-red-500' : ''}`}
                  {...register('account_number', { required: 'Account number is required' })}
                />
                {errors.account_number && (
                  <p className="mt-1 text-sm text-red-600">{errors.account_number.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="branch_code" className="form-label">Branch Code</label>
                <input
                  type="text"
                  id="branch_code"
                  className={`input ${errors.branch_code ? 'border-red-500' : ''}`}
                  {...register('branch_code', { required: 'Branch code is required' })}
                />
                {errors.branch_code && (
                  <p className="mt-1 text-sm text-red-600">{errors.branch_code.message}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="account_type" className="form-label">Account Type</label>
                <select
                  id="account_type"
                  className={`input ${errors.account_type ? 'border-red-500' : ''}`}
                  {...register('account_type', { required: 'Account type is required' })}
                >
                  <option value="">Select account type</option>
                  <option value="Savings">Savings</option>
                  <option value="Checking">Checking</option>
                  <option value="Current">Current</option>
                </select>
                {errors.account_type && (
                  <p className="mt-1 text-sm text-red-600">{errors.account_type.message}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Optional Details */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Employment Details (Optional)</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="mb-4">
                <label htmlFor="employer" className="form-label">Employer</label>
                <input
                  type="text"
                  id="employer"
                  className="input"
                  {...register('employer')}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="occupation" className="form-label">Occupation</label>
                <input
                  type="text"
                  id="occupation"
                  className="input"
                  {...register('occupation')}
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="income" className="form-label">Monthly Income</label>
                <input
                  type="text"
                  id="income"
                  className="input"
                  {...register('income')}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/clients')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ClientCreate 