import React, { useState } from 'react'
import { useAuthStore } from '../../store/auth-store'
import { CreditsManager } from './CreditsManager'
import { User, Mail, Phone, MapPin, Building, Briefcase, Calendar, Coins, LogOut, Edit, Save, X, Settings } from 'lucide-react'

export const UserProfile: React.FC = () => {
  const { user, profile, signOut, updateProfile, loading } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [showCreditsManager, setShowCreditsManager] = useState(false)
  const [editData, setEditData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    phone_number: profile?.phone_number || '',
    age: profile?.age?.toString() || '',
    business: profile?.business || '',
    role: profile?.role || ''
  })

  const handleEdit = () => {
    setEditData({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      phone_number: profile?.phone_number || '',
      age: profile?.age?.toString() || '',
      business: profile?.business || '',
      role: profile?.role || ''
    })
    setIsEditing(true)
  }

  const handleSave = async () => {
    const updateData: any = {
      first_name: editData.first_name,
      last_name: editData.last_name,
      phone_number: editData.phone_number,
      business: editData.business || undefined,
      role: editData.role || undefined
    }

    if (editData.age) {
      updateData.age = parseInt(editData.age)
    }

    const result = await updateProfile(updateData)
    
    if (result.success) {
      setIsEditing(false)
    } else {
      alert(result.error || 'Failed to update profile')
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await signOut()
    }
  }

  if (!user || !profile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#9C83FF] to-[#FF9051] bg-clip-text text-transparent">
            User Profile
          </h2>
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-[#9C83FF] text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Credits Display */}
        <div className="bg-gradient-to-r from-[#9C83FF] to-[#FF9051] rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center">
              <Coins className="w-6 h-6 mr-2" />
              <span className="text-xl font-bold">{profile.credits} Credits</span>
            </div>
            <button
              onClick={() => setShowCreditsManager(!showCreditsManager)}
              className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">Manage</span>
            </button>
          </div>
        </div>

        {/* Credits Manager */}
        {showCreditsManager && (
          <div className="mb-6">
            <CreditsManager />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h3>
            
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.first_name}
                    onChange={(e) => setEditData(prev => ({ ...prev, first_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[#9C83FF] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{profile.first_name}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.last_name}
                    onChange={(e) => setEditData(prev => ({ ...prev, last_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[#9C83FF] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{profile.last_name}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <p className="text-gray-900 dark:text-white">{profile.email}</p>
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editData.phone_number}
                    onChange={(e) => setEditData(prev => ({ ...prev, phone_number: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[#9C83FF] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{profile.phone_number}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Country
                </label>
                <p className="text-gray-900 dark:text-white">{profile.country}</p>
                <p className="text-xs text-gray-500">Country cannot be changed</p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Additional Information
            </h3>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Age
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    min="13"
                    max="120"
                    value={editData.age}
                    onChange={(e) => setEditData(prev => ({ ...prev, age: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[#9C83FF] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{profile.age || 'Not specified'}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Building className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Company/Business
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.business}
                    onChange={(e) => setEditData(prev => ({ ...prev, business: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[#9C83FF] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{profile.business || 'Not specified'}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Role
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.role}
                    onChange={(e) => setEditData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[#9C83FF] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{profile.role || 'Not specified'}</p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500">
                Member since: {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}