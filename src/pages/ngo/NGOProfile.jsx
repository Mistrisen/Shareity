import React, { useRef, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useDonation } from '../../contexts/DonationContext'
import { 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Edit, 
  Save, 
  X,
  Upload,
  Camera,
  CheckCircle,
  Star,
  Users,
  Heart
} from 'lucide-react'

const NGOProfile = () => {
  const { user, updateProfile } = useAuth()
  const fileInputRef = useRef(null)

  const handleAvatarClick = () => {
    if (fileInputRef.current) fileInputRef.current.click()
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    try {
      const form = new FormData()
      form.append('images', file)
      const res = await fetch('/api/uploads', { method: 'POST', body: form })
      const json = await res.json()
      if (json.success && json.urls && json.urls.length > 0) {
        updateProfile({ avatar: json.urls[0] })
      }
    } catch (_) {
      // noop
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }
  const { ngoKeywordsById, updateNGOKeywords } = useDonation()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    organizationName: user?.organizationName || '',
    organizationType: user?.organizationType || '',
    description: user?.description || '',
    location: user?.location || '',
    phone: user?.phone || '',
    email: user?.email || '',
    website: user?.website || '',
    mission: user?.mission || '',
    focusAreas: user?.focusAreas || [],
    establishedYear: user?.establishedYear || '',
    teamSize: user?.teamSize || '',
    beneficiaries: user?.beneficiaries || '',
    verificationStatus: user?.verificationStatus || 'pending'
  })
  const [keywordsInput, setKeywordsInput] = useState((ngoKeywordsById[user?.id] || []).join(', '))

  const organizationTypes = [
    { value: 'nonprofit', label: 'Non-profit Organization' },
    { value: 'charity', label: 'Charity' },
    { value: 'foundation', label: 'Foundation' },
    { value: 'ngo', label: 'NGO' },
    { value: 'religious', label: 'Religious Organization' },
    { value: 'community', label: 'Community Organization' },
  ]

  const focusAreas = [
    'Food & Nutrition',
    'Education',
    'Healthcare',
    'Clothing',
    'Shelter',
    'Emergency Relief',
    'Children & Youth',
    'Elderly Care',
    'Environmental',
    'Animal Welfare',
    'Women Empowerment',
    'Disability Support'
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFocusAreaToggle = (area) => {
    setFormData(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter(a => a !== area)
        : [...prev.focusAreas, area]
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateProfile(formData)
    // Save collection keywords
    const parsed = keywordsInput
      .split(',')
      .map(k => k.trim())
      .filter(Boolean)
    updateNGOKeywords(user.id, parsed)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      organizationName: user?.organizationName || '',
      organizationType: user?.organizationType || '',
      description: user?.description || '',
      location: user?.location || '',
      phone: user?.phone || '',
      email: user?.email || '',
      website: user?.website || '',
      mission: user?.mission || '',
      focusAreas: user?.focusAreas || [],
      establishedYear: user?.establishedYear || '',
      teamSize: user?.teamSize || '',
      beneficiaries: user?.beneficiaries || '',
      verificationStatus: user?.verificationStatus || 'pending'
    })
    setIsEditing(false)
  }

  const getVerificationStatus = () => {
    switch (formData.verificationStatus) {
      case 'verified':
        return { color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20', text: 'Verified' }
      case 'pending':
        return { color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/20', text: 'Pending Review' }
      case 'rejected':
        return { color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/20', text: 'Rejected' }
      default:
        return { color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-900/20', text: 'Not Verified' }
    }
  }

  const verificationStatus = getVerificationStatus()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                NGO Profile
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your organization's information and settings
              </p>
            </div>
            
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary flex items-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="card">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <img
                      src={user?.avatar || '/placeholder-ngo.jpg'}
                      alt={formData.organizationName}
                      className="w-32 h-32 rounded-full object-cover mx-auto"
                    />
                    {isEditing && (
                      <button
                        type="button"
                        className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700"
                        onClick={handleAvatarClick}
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </div>
                  
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {formData.organizationName || 'Organization Name'}
                  </h2>
                  
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${verificationStatus.bg} ${verificationStatus.color} mb-4`}>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {verificationStatus.text}
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center justify-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {formData.location || 'Location not set'}
                    </div>
                    <div className="flex items-center justify-center">
                      <Building className="w-4 h-4 mr-2" />
                      {formData.organizationType || 'Organization type not set'}
                    </div>
                    {formData.website && (
                      <div className="flex items-center justify-center">
                        <Globe className="w-4 h-4 mr-2" />
                        <a href={formData.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600">
                          Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="card mt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-blue-500 mr-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Team Size</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formData.teamSize || 'Not specified'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 text-red-500 mr-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Beneficiaries</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formData.beneficiaries || 'Not specified'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Established</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formData.establishedYear || 'Not specified'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Organization Information
                </h3>

                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Contact Person Name *</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="input-field"
                          required
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white py-2">
                          {formData.name || 'Not specified'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="label">Organization Name *</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="organizationName"
                          value={formData.organizationName}
                          onChange={handleInputChange}
                          className="input-field"
                          required
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white py-2">
                          {formData.organizationName || 'Not specified'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="label">Organization Type *</label>
                      {isEditing ? (
                        <select
                          name="organizationType"
                          value={formData.organizationType}
                          onChange={handleInputChange}
                          className="input-field"
                          required
                        >
                          <option value="">Select type</option>
                          {organizationTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-gray-900 dark:text-white py-2">
                          {formData.organizationType || 'Not specified'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="label">Location *</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="input-field"
                          placeholder="City, State, Country"
                          required
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white py-2">
                          {formData.location || 'Not specified'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="label">Phone Number</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="input-field"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white py-2">
                          {formData.phone || 'Not specified'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="label">Email Address</label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="input-field"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white py-2">
                          {formData.email || 'Not specified'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="label">Website</label>
                      {isEditing ? (
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          className="input-field"
                          placeholder="https://your-website.org"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white py-2">
                          {formData.website || 'Not specified'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="label">Established Year</label>
                      {isEditing ? (
                        <input
                          type="number"
                          name="establishedYear"
                          value={formData.establishedYear}
                          onChange={handleInputChange}
                          className="input-field"
                          min="1900"
                          max={new Date().getFullYear()}
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white py-2">
                          {formData.establishedYear || 'Not specified'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="label">Organization Description *</label>
                    {isEditing ? (
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="input-field"
                        rows="4"
                        placeholder="Describe your organization's mission and activities..."
                        required
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white py-2">
                        {formData.description || 'No description provided'}
                      </p>
                    )}
                  </div>

                  {/* Mission */}
                  <div>
                    <label className="label">Mission Statement</label>
                    {isEditing ? (
                      <textarea
                        name="mission"
                        value={formData.mission}
                        onChange={handleInputChange}
                        className="input-field"
                        rows="3"
                        placeholder="Your organization's mission statement..."
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white py-2">
                        {formData.mission || 'No mission statement provided'}
                      </p>
                    )}
                  </div>

                  {/* Focus Areas */}
                  <div>
                    <label className="label">Focus Areas</label>
                    {isEditing ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {focusAreas.map((area) => (
                          <label key={area} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.focusAreas.includes(area)}
                              onChange={() => handleFocusAreaToggle(area)}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                              {area}
                            </span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {formData.focusAreas.length > 0 ? (
                          formData.focusAreas.map((area) => (
                            <span
                              key={area}
                              className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-600 text-sm rounded-full"
                            >
                              {area}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400">No focus areas specified</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Team Size</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="teamSize"
                          value={formData.teamSize}
                          onChange={handleInputChange}
                          className="input-field"
                          placeholder="e.g., 10-20 people"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white py-2">
                          {formData.teamSize || 'Not specified'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="label">Number of Beneficiaries</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="beneficiaries"
                          value={formData.beneficiaries}
                          onChange={handleInputChange}
                          className="input-field"
                          placeholder="e.g., 500+ people"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white py-2">
                          {formData.beneficiaries || 'Not specified'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Collection Keywords */}
          <div>
            <label className="label">Items You Collect (keywords)</label>
            {isEditing ? (
              <input
                type="text"
                value={keywordsInput}
                onChange={(e) => setKeywordsInput(e.target.value)}
                className="input-field"
                placeholder="e.g., winter jacket, rice, textbooks, laptop, toys"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {(ngoKeywordsById[user?.id] || []).length > 0 ? (
                  (ngoKeywordsById[user?.id] || []).map((kw) => (
                    <span key={kw} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full">
                      {kw}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No keywords set</p>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex justify-end space-x-4 mt-8">
              <button
                type="button"
                onClick={handleCancel}
                className="btn-outline flex items-center"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default NGOProfile
