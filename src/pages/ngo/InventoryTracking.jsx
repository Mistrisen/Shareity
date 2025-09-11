import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useDonation } from '../../contexts/DonationContext'
import { 
  Package, 
  CheckCircle, 
  Clock, 
  Truck,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  Filter,
  Search,
  Eye,
  Check,
  X
} from 'lucide-react'

const InventoryTracking = () => {
  const { user } = useAuth()
  const { donations, updateDonationStatus } = useDonation()
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  const ngoDonations = donations.filter(donation => donation.ngoId === user?.id)
  
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_transit', label: 'In Transit' },
    { value: 'delivered', label: 'Delivered' },
  ]

  const filteredDonations = ngoDonations.filter(donation => {
    const matchesStatus = statusFilter === 'all' || donation.status === statusFilter
    const matchesSearch = searchQuery === '' || 
      donation.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      donation.donorId.toString().includes(searchQuery)
    
    return matchesStatus && matchesSearch
  })

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'in_transit':
        return <Truck className="w-5 h-5 text-blue-500" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'in_transit':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const handleStatusUpdate = (donationId, newStatus) => {
    updateDonationStatus(donationId, newStatus)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const stats = [
    {
      label: 'Total Donations',
      value: ngoDonations.length,
      icon: Package,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      label: 'Pending',
      value: ngoDonations.filter(d => d.status === 'pending').length,
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
    },
    {
      label: 'In Transit',
      value: ngoDonations.filter(d => d.status === 'in_transit').length,
      icon: Truck,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      label: 'Delivered',
      value: ngoDonations.filter(d => d.status === 'delivered').length,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Inventory Tracking
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track and manage incoming donations to your NGO
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="card">
                <div className="flex items-center">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mr-4`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search donations by item or donor..."
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
          </div>
        </div>

        {/* Donations List */}
        {filteredDonations.length > 0 ? (
          <div className="space-y-6">
            {filteredDonations.map((donation) => (
              <div key={donation.id} className="card">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Donation Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          Donation #{donation.id}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(donation.createdAt)}
                          </div>
                          <div className="flex items-center">
                            <Package className="w-4 h-4 mr-1" />
                            {donation.items.length} item{donation.items.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(donation.status)}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(donation.status)}`}>
                          {donation.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Donated Items
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {donation.items.map((item, index) => (
                          <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="font-medium text-gray-900 dark:text-white">
                                {item.name}
                              </h5>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Qty: {item.quantity}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              <div>Category: {item.category}</div>
                              <div>Condition: {item.condition}</div>
                              {item.description && (
                                <div className="mt-1 italic">"{item.description}"</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Donor Info */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                        Donor Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                            <MapPin className="w-4 h-4 mr-2" />
                            Pickup Location
                          </div>
                          <p className="text-gray-900 dark:text-white">
                            {donation.pickupLocation}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                            <Phone className="w-4 h-4 mr-2" />
                            Contact Phone
                          </div>
                          <p className="text-gray-900 dark:text-white">
                            {donation.contactPhone}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                            <Calendar className="w-4 h-4 mr-2" />
                            Pickup Date
                          </div>
                          <p className="text-gray-900 dark:text-white">
                            {donation.pickupDate} at {donation.pickupTime}
                          </p>
                        </div>
                        {donation.notes && (
                          <div>
                            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                              <Mail className="w-4 h-4 mr-2" />
                              Notes
                            </div>
                            <p className="text-gray-900 dark:text-white">
                              {donation.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="lg:w-64 flex flex-col space-y-3">
                    {donation.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(donation.id, 'in_transit')}
                          className="btn-primary flex items-center justify-center"
                        >
                          <Truck className="w-4 h-4 mr-2" />
                          Mark In Transit
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(donation.id, 'delivered')}
                          className="btn-secondary flex items-center justify-center"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark Delivered
                        </button>
                      </>
                    )}
                    
                    {donation.status === 'in_transit' && (
                      <button
                        onClick={() => handleStatusUpdate(donation.id, 'delivered')}
                        className="btn-primary flex items-center justify-center"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark Delivered
                      </button>
                    )}

                    <button className="btn-outline flex items-center justify-center">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
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
              No donations found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search criteria'
                : 'Donations will appear here once donors start contributing to your NGO'
              }
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <a
                href="/ngo/requests"
                className="btn-primary"
              >
                Create Donation Requests
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default InventoryTracking
