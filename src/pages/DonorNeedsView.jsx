import React, { useState } from 'react'
import { useDonation } from '../contexts/DonationContext'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { 
  Search,
  Filter,
  MapPin,
  Calendar,
  Clock,
  Users,
  Package,
  Heart,
  Star,
  ArrowRight,
  Phone,
  Mail,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  TrendingUp
} from 'lucide-react'

const DonorNeedsView = () => {
  const { requests, ngos, createDonation, acceptRequest } = useDonation()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [urgencyFilter, setUrgencyFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('')

  const categories = [
    { value: 'all', label: 'All Categories' },
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
    { value: 'all', label: 'All Priorities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ]

  const urgencyLevels = [
    { value: 'all', label: 'All Urgency' },
    { value: 'normal', label: 'Normal' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'critical', label: 'Critical' },
  ]

  const filteredRequests = requests.filter(request => {
    const matchesSearch = searchQuery === '' || 
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || request.category === categoryFilter
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter
    const matchesUrgency = urgencyFilter === 'all' || request.urgency === urgencyFilter
    const matchesLocation = locationFilter === '' || 
      (request.location && request.location.toLowerCase().includes(locationFilter.toLowerCase()))
    
    return matchesSearch && matchesCategory && matchesPriority && matchesUrgency && matchesLocation && request.status === 'active'
  })

  const getNGOById = (ngoId) => {
    return ngos.find(ngo => ngo.id === ngoId)
  }

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'urgent':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      case 'normal':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'food':
        return '🍎'
      case 'clothing':
        return '👕'
      case 'education':
        return '📚'
      case 'healthcare':
        return '🏥'
      case 'furniture':
        return '🪑'
      case 'electronics':
        return '📱'
      case 'books':
        return '📖'
      case 'toys':
        return '🧸'
      default:
        return '📦'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              NGO Needs & Requests
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Discover what NGOs need and make a direct impact with your donations
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Package className="w-6 h-6 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {requests.filter(r => r.status === 'active').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Active Requests
            </p>
          </div>
          
          <div className="card text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {new Set(requests.filter(r => r.status === 'active').map(r => r.ngoId)).size}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              NGOs Seeking Help
            </p>
          </div>
          
          <div className="card text-center">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {requests.filter(r => r.priority === 'high' && r.status === 'active').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              High Priority Needs
            </p>
          </div>
          
          <div className="card text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {requests.filter(r => r.urgency === 'critical' && r.status === 'active').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Critical Needs
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search needs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="input-field"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="input-field"
              >
                {priorities.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="input-field"
              >
                {urgencyLevels.map((urgency) => (
                  <option key={urgency.value} value={urgency.value}>
                    {urgency.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Needs List */}
        {filteredRequests.length > 0 ? (
          <div className="space-y-6">
            {filteredRequests.map((request) => {
              const ngo = getNGOById(request.ngoId)
              return (
                <div key={request.id} className="card interactive-card">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="text-3xl">
                            {getCategoryIcon(request.category)}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                              {request.title}
                            </h3>
                            <div className="flex items-center space-x-2 mb-2">
                              {ngo && (
                                <img
                                  src={ngo.image}
                                  alt={ngo.name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              )}
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {ngo?.name || 'Unknown NGO'}
                              </span>
                              {ngo && (
                                <div className="flex items-center space-x-1">
                                  {Array.from({ length: 5 }, (_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${
                                        i < Math.floor(ngo.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                  <span className="text-xs text-gray-500">
                                    ({ngo.rating})
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(request.priority)}`}>
                            {request.priority}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(request.urgency)}`}>
                            {request.urgency}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {request.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Package className="w-4 h-4 mr-2" />
                          {request.currentQuantity}/{request.targetQuantity} items needed
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4 mr-2" />
                          Posted: {new Date(request.createdAt).toLocaleDateString()}
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

                      {/* Contact Information */}
                      {request.contactInfo && (
                        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            Contact Information:
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {request.contactInfo}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-3">
                      {user ? (
                        <Link
                          to="/donor/donate"
                          state={{ 
                            ngoId: request.ngoId,
                            requestId: request.id,
                            requestTitle: request.title
                          }}
                          className="btn-primary flex items-center justify-center"
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Donate Now
                        </Link>
                      ) : (
                        <Link
                          to="/login"
                          className="btn-primary flex items-center justify-center"
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Login to Donate
                        </Link>
                      )}
                      {user && (
                        <button
                          onClick={() => acceptRequest(request.id, user.id)}
                          className="btn-outline flex items-center justify-center"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Accept Request
                        </button>
                      )}
                      
                      <Link
                        to="/browse-ngos"
                        state={{ ngoId: request.ngoId }}
                        className="btn-outline flex items-center justify-center"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View NGO
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No needs found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery || categoryFilter !== 'all' || priorityFilter !== 'all' || urgencyFilter !== 'all'
                ? 'Try adjusting your search criteria'
                : 'No active requests at the moment. Check back later!'
              }
            </p>
            <Link
              to="/browse-ngos"
              className="btn-primary"
            >
              Browse All NGOs
            </Link>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="card bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Join thousands of donors who are making a positive impact in their communities
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link
                  to="/donor/donate"
                  className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Start Donating
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center"
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Join as Donor
                </Link>
              )}
              <Link
                to="/browse-ngos"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                <Users className="w-5 h-5 mr-2" />
                Browse NGOs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DonorNeedsView
