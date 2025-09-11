import React, { useState } from 'react'
import { useDonation } from '../../contexts/DonationContext'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar,
  Users,
  Package,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  Search,
  X,
  Heart,
  MapPin,
  Star,
  Share2,
  Copy
} from 'lucide-react'
import toast from 'react-hot-toast'

const NGONeedsPage = () => {
  const { createRequest, updateRequest, getRequestsByNGO } = useDonation()
  const { user } = useAuth()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingRequest, setEditingRequest] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  const ngoRequests = getRequestsByNGO(user?.id)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    targetQuantity: 1,
    deadline: '',
    needs: [],
    location: '',
    contactInfo: '',
    urgency: 'normal'
  })

  const categories = [
    { value: 'food', label: 'Food & Nutrition' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'education', label: 'Education' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'books', label: 'Books' },
    { value: 'toys', label: 'Toys' },
    { value: 'other', label: 'Other' },
  ]

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
    { value: 'high', label: 'High', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' },
  ]

  const urgencyLevels = [
    { value: 'normal', label: 'Normal', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
    { value: 'urgent', label: 'Urgent', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' },
    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' },
  ]

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ]

  const filteredRequests = ngoRequests.filter(request => {
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter
    const matchesSearch = searchQuery === '' || 
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesStatus && matchesPriority && matchesSearch
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const requestData = {
      ...formData,
      ngoId: user.id,
      currentQuantity: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      shareableLink: `${window.location.origin}/needs/${Date.now()}`
    }

    if (editingRequest) {
      await updateRequest(editingRequest.id, requestData)
      setEditingRequest(null)
    } else {
      await createRequest(requestData)
    }
    
    setShowCreateForm(false)
    setFormData({
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      targetQuantity: 1,
      deadline: '',
      needs: [],
      location: '',
      contactInfo: '',
      urgency: 'normal'
    })
  }

  const handleEdit = (request) => {
    setEditingRequest(request)
    setFormData({
      title: request.title,
      description: request.description,
      category: request.category,
      priority: request.priority,
      targetQuantity: request.targetQuantity,
      deadline: request.deadline,
      needs: request.needs || [],
      location: request.location || '',
      contactInfo: request.contactInfo || '',
      urgency: request.urgency || 'normal'
    })
    setShowCreateForm(true)
  }

  const handleDelete = (requestId) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      updateRequest(requestId, { status: 'cancelled' })
    }
  }

  const copyShareableLink = (link) => {
    navigator.clipboard.writeText(link)
    toast.success('Link copied to clipboard!')
  }

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100)
  }

  const getPriorityColor = (priority) => {
    const priorityObj = priorities.find(p => p.value === priority)
    return priorityObj ? priorityObj.color : 'bg-gray-100 text-gray-800'
  }

  const getUrgencyColor = (urgency) => {
    const urgencyObj = urgencyLevels.find(u => u.value === urgency)
    return urgencyObj ? urgencyObj.color : 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                NGO Needs & Requests
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Post your organization's needs and share them with potential donors
              </p>
            </div>
            
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary flex items-center mt-4 md:mt-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Post New Need
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-4">
                <Package className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {ngoRequests.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Requests
                </p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-4">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {ngoRequests.filter(r => r.status === 'active').length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Active Requests
                </p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center mr-4">
                <AlertCircle className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {ngoRequests.filter(r => r.priority === 'high').length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  High Priority
                </p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mr-4">
                <Heart className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {ngoRequests.reduce((sum, r) => sum + r.currentQuantity, 0)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Items Received
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:w-48">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Priorities</option>
                {priorities.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Create/Edit Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {editingRequest ? 'Edit Request' : 'Post New Need'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowCreateForm(false)
                      setEditingRequest(null)
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="label">Need Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="e.g., Winter Clothing for Homeless Families"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="input-field"
                      rows="3"
                      placeholder="Describe what you need and why it's important..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="label">Category *</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      >
                        <option value="">Select category</option>
                        {categories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="label">Priority *</label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      >
                        {priorities.map((priority) => (
                          <option key={priority.value} value={priority.value}>
                            {priority.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="label">Urgency *</label>
                      <select
                        name="urgency"
                        value={formData.urgency}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      >
                        {urgencyLevels.map((urgency) => (
                          <option key={urgency.value} value={urgency.value}>
                            {urgency.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Target Quantity *</label>
                      <input
                        type="number"
                        name="targetQuantity"
                        value={formData.targetQuantity}
                        onChange={handleInputChange}
                        className="input-field"
                        min="1"
                        required
                      />
                    </div>

                    <div>
                      <label className="label">Deadline</label>
                      <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleInputChange}
                        className="input-field"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Where should donations be sent?"
                      />
                    </div>

                    <div>
                      <label className="label">Contact Information</label>
                      <input
                        type="text"
                        name="contactInfo"
                        value={formData.contactInfo}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Phone, email, or other contact details"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateForm(false)
                        setEditingRequest(null)
                      }}
                      className="btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      {editingRequest ? 'Update Request' : 'Post Need'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Requests List */}
        {filteredRequests.length > 0 ? (
          <div className="space-y-6">
            {filteredRequests.map((request) => (
              <div key={request.id} className="card">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {request.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {request.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(request.priority)}`}>
                          {request.priority}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(request.urgency)}`}>
                          {request.urgency}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          request.status === 'active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Package className="w-4 h-4 mr-2" />
                        {request.currentQuantity}/{request.targetQuantity} items
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        Created: {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                      {request.deadline && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4 mr-2" />
                          Deadline: {new Date(request.deadline).toLocaleDateString()}
                        </div>
                      )}
                      {request.location && (
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="w-4 h-4 mr-2" />
                          {request.location}
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{Math.round(getProgressPercentage(request.currentQuantity, request.targetQuantity))}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getProgressPercentage(request.currentQuantity, request.targetQuantity)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Shareable Link */}
                    {request.shareableLink && (
                      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                              Shareable Link:
                            </p>
                            <p className="text-sm text-blue-700 dark:text-blue-400 break-all">
                              {request.shareableLink}
                            </p>
                          </div>
                          <button
                            onClick={() => copyShareableLink(request.shareableLink)}
                            className="btn-outline text-sm flex items-center"
                          >
                            <Copy className="w-4 h-4 mr-1" />
                            Copy
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => handleEdit(request)}
                      className="btn-outline flex items-center justify-center"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(request.id)}
                      className="btn-outline text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No requests found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'Try adjusting your search criteria'
                : 'Post your first need to start receiving donations'
              }
            </p>
            {!searchQuery && statusFilter === 'all' && priorityFilter === 'all' && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="btn-primary"
              >
                Post Your First Need
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default NGONeedsPage
