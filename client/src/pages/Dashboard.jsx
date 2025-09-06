import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { User, Mail, Edit2, Save, X } from 'lucide-react'

const Dashboard = () => {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await updateProfile(formData)
      if (result.success) {
        setSuccess('Profile updated successfully!')
        setIsEditing(false)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || ''
    })
    setIsEditing(false)
    setError('')
    setSuccess('')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Dashboard</h1>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        {/* Profile Picture Placeholder */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <User className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">{user?.username}</h2>
          <p className="text-gray-600">{user?.email}</p>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                disabled={!isEditing}
                className={`input-field ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                placeholder="Enter your username"
              />
              {!isEditing && (
                <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              )}
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className={`input-field ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                placeholder="Enter your email"
              />
              {!isEditing && (
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Edit2 className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
                
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </>
            )}
          </div>
        </form>

        {/* Trust & Safety Stats */}
        <div className="mt-8 pt-6 border-t">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Trust & Safety</h3>
          
          {/* Verification Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-blue-900">Account Verification</h4>
                <p className="text-sm text-blue-700">
                  {user?.is_verified ? 'Your account is verified' : 'Verify your account to build trust'}
                </p>
              </div>
              {!user?.is_verified && (
                <button className="btn-primary text-sm">
                  Verify Now
                </button>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-primary-600">{user?.total_sales || 0}</p>
              <p className="text-sm text-gray-600">Items Sold</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {user?.average_rating ? user.average_rating.toFixed(1) : '0.0'}⭐
              </p>
              <p className="text-sm text-gray-600">Average Rating</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">85</p>
              <p className="text-sm text-gray-600">Trust Score</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600">12.5kg</p>
              <p className="text-sm text-gray-600">CO₂ Saved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard