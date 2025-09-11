import React, { useState } from 'react'
import { useDonation } from '../../contexts/DonationContext'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Camera, 
  Video, 
  Upload, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar,
  Users,
  Package,
  Heart,
  X,
  Play,
  Image as ImageIcon,
  FileText
} from 'lucide-react'

const DonationUsageTracking = () => {
  const { createUsageReport, getUsageReportsByNGO, donations } = useDonation()
  const { user } = useAuth()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingReport, setEditingReport] = useState(null)
  
  const ngoReports = getUsageReportsByNGO(user?.id)
  const ngoDonations = donations.filter(donation => donation.ngoId === user?.id && donation.status === 'delivered')
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    donationId: '',
    beneficiariesCount: 0,
    impact: '',
    images: [],
    videos: [],
    location: '',
    date: new Date().toISOString().split('T')[0]
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileUpload = (e, type) => {
    const files = Array.from(e.target.files)
    const fileUrls = files.map(file => URL.createObjectURL(file))
    
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], ...fileUrls]
    }))
  }

  const removeFile = (index, type) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const reportData = {
      ...formData,
      ngoId: user.id,
      createdAt: new Date().toISOString()
    }

    if (editingReport) {
      // Update existing report
      setEditingReport(null)
    } else {
      await createUsageReport(reportData)
    }
    
    setShowCreateForm(false)
    setFormData({
      title: '',
      description: '',
      donationId: '',
      beneficiariesCount: 0,
      impact: '',
      images: [],
      videos: [],
      location: '',
      date: new Date().toISOString().split('T')[0]
    })
  }

  const handleEdit = (report) => {
    setEditingReport(report)
    setFormData({
      title: report.title,
      description: report.description,
      donationId: report.donationId,
      beneficiariesCount: report.beneficiariesCount,
      impact: report.impact,
      images: report.images || [],
      videos: report.videos || [],
      location: report.location,
      date: report.date
    })
    setShowCreateForm(true)
  }

  const getDonationById = (donationId) => {
    return donations.find(donation => donation.id === donationId)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Donation Usage Tracking
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Document how donations are being used to help beneficiaries
              </p>
            </div>
            
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary flex items-center mt-4 md:mt-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Usage Report
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-4">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {ngoReports.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Usage Reports
                </p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {ngoReports.reduce((sum, report) => sum + report.beneficiariesCount, 0)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Beneficiaries Helped
                </p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mr-4">
                <Package className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {ngoDonations.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Delivered Donations
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Create/Edit Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {editingReport ? 'Edit Usage Report' : 'Create Usage Report'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowCreateForm(false)
                      setEditingReport(null)
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Report Title *</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="e.g., Winter Clothing Distribution"
                        required
                      />
                    </div>

                    <div>
                      <label className="label">Related Donation *</label>
                      <select
                        name="donationId"
                        value={formData.donationId}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      >
                        <option value="">Select donation</option>
                        {ngoDonations.map((donation) => (
                          <option key={donation.id} value={donation.id}>
                            {donation.items.map(item => `${item.quantity}x ${item.name}`).join(', ')} - {new Date(donation.createdAt).toLocaleDateString()}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="label">Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="input-field"
                      rows="3"
                      placeholder="Describe how the donations were used and their impact..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="label">Beneficiaries Count *</label>
                      <input
                        type="number"
                        name="beneficiariesCount"
                        value={formData.beneficiariesCount}
                        onChange={handleInputChange}
                        className="input-field"
                        min="1"
                        required
                      />
                    </div>

                    <div>
                      <label className="label">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Where was this used?"
                      />
                    </div>

                    <div>
                      <label className="label">Date *</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">Impact Description</label>
                    <textarea
                      name="impact"
                      value={formData.impact}
                      onChange={handleInputChange}
                      className="input-field"
                      rows="2"
                      placeholder="Describe the positive impact on beneficiaries..."
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="label">Upload Images</label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileUpload(e, 'images')}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 dark:text-gray-400">
                          Click to upload images or drag and drop
                        </p>
                      </label>
                    </div>
                    
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeFile(index, 'images')}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Video Upload */}
                  <div>
                    <label className="label">Upload Videos</label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="video/*"
                        multiple
                        onChange={(e) => handleFileUpload(e, 'videos')}
                        className="hidden"
                        id="video-upload"
                      />
                      <label htmlFor="video-upload" className="cursor-pointer">
                        <Video className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 dark:text-gray-400">
                          Click to upload videos or drag and drop
                        </p>
                      </label>
                    </div>
                    
                    {formData.videos.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {formData.videos.map((video, index) => (
                          <div key={index} className="relative">
                            <video
                              src={video}
                              className="w-full h-32 object-cover rounded-lg"
                              controls
                            />
                            <button
                              type="button"
                              onClick={() => removeFile(index, 'videos')}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateForm(false)
                        setEditingReport(null)
                      }}
                      className="btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      {editingReport ? 'Update Report' : 'Create Report'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Usage Reports List */}
        {ngoReports.length > 0 ? (
          <div className="space-y-6">
            {ngoReports.map((report) => {
              const donation = getDonationById(report.donationId)
              return (
                <div key={report.id} className="card">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {report.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-3">
                            {report.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full text-sm font-medium">
                            Published
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Users className="w-4 h-4 mr-2" />
                          {report.beneficiariesCount} beneficiaries helped
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(report.date).toLocaleDateString()}
                        </div>
                        {report.location && (
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Package className="w-4 h-4 mr-2" />
                            {report.location}
                          </div>
                        )}
                      </div>

                      {donation && (
                        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            Related Donation:
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {donation.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                          </p>
                        </div>
                      )}

                      {report.impact && (
                        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                            Impact:
                          </p>
                          <p className="text-sm text-blue-700 dark:text-blue-400">
                            {report.impact}
                          </p>
                        </div>
                      )}

                      {/* Media Display */}
                      {(report.images?.length > 0 || report.videos?.length > 0) && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Media:
                          </p>
                          
                          {report.images?.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                              {report.images.map((image, index) => (
                                <img
                                  key={index}
                                  src={image}
                                  alt={`Usage ${index + 1}`}
                                  className="w-full h-20 object-cover rounded-lg hover-scale cursor-pointer"
                                />
                              ))}
                            </div>
                          )}
                          
                          {report.videos?.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {report.videos.map((video, index) => (
                                <video
                                  key={index}
                                  src={video}
                                  className="w-full h-32 object-cover rounded-lg"
                                  controls
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => handleEdit(report)}
                        className="btn-outline flex items-center justify-center"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No usage reports yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first usage report to show donors how their contributions are making a difference
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary"
            >
              Create Your First Report
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default DonationUsageTracking
