import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useDonation } from '../../contexts/DonationContext'
import { 
  Package, 
  Users, 
  TrendingUp, 
  Heart,
  MapPin,
  Calendar,
  Star,
  Bell,
  Plus,
  ArrowRight,
  CheckCircle,
  Clock,
  Truck,
  Search,
  X
} from 'lucide-react'

const NGODashboard = () => {
  const { user } = useAuth()
  const { getRequestsByNGO, donations, getUnassignedDonations, schedulePickup } = useDonation()
  const [scheduling, setScheduling] = useState(null)
  const [pickupDate, setPickupDate] = useState('')
  const [pickupTime, setPickupTime] = useState('')
  
  const ngoRequests = getRequestsByNGO(user?.id)
  const ngoDonations = donations.filter(donation => donation.ngoId === user?.id)
  const unassigned = useMemo(() => getUnassignedDonations(), [donations])
  const pendingDonations = ngoDonations.filter(d => d.status === 'pending')
  const inTransitDonations = ngoDonations.filter(d => d.status === 'in_transit')
  const deliveredDonations = ngoDonations.filter(d => d.status === 'delivered')
  
  const totalItemsReceived = deliveredDonations.reduce((sum, donation) => 
    sum + (donation.items ? donation.items.reduce((itemSum, item) => itemSum + item.quantity, 0) : 0), 0
  )

  const stats = [
    {
      label: 'Active Requests',
      value: ngoRequests.filter(r => r.status === 'active').length,
      icon: Package,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      label: 'Pending Donations',
      value: pendingDonations.length,
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
    },
    {
      label: 'Items Received',
      value: totalItemsReceived,
      icon: Heart,
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      label: 'Beneficiaries Helped',
      value: Math.floor(totalItemsReceived * 0.8), // Estimated
      icon: Users,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    }
  ]

  const quickActions = [
    {
      title: 'Post Needs',
      description: 'Share your organization\'s needs',
      icon: Plus,
      link: '/ngo/needs',
      color: 'bg-primary-600 hover:bg-primary-700'
    },
    {
      title: 'Usage Tracking',
      description: 'Document donation impact with media',
      icon: Heart,
      link: '/ngo/usage-tracking',
      color: 'bg-red-600 hover:bg-red-700'
    },
    {
      title: 'Manage Inventory',
      description: 'Track received donations',
      icon: Package,
      link: '/ngo/inventory',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'Search Items',
      description: 'Find donated items by category or name',
      icon: Search,
      link: '/ngo/item-search',
      color: 'bg-teal-600 hover:bg-teal-700'
    },
    {
      title: 'Update Profile',
      description: 'Keep your NGO information current',
      icon: Users,
      link: '/ngo/profile',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'View Reports',
      description: 'Track your impact and beneficiaries',
      icon: TrendingUp,
      link: '/ngo/beneficiaries',
      color: 'bg-purple-600 hover:bg-purple-700'
    }
  ]

  const recentRequests = ngoRequests.slice(0, 3)
  const recentDonations = ngoDonations.slice(0, 3)

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'in_transit':
        return <Truck className="w-4 h-4 text-blue-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your NGO operations and track donations
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Quick Actions
              </h2>
              <div className="space-y-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <Link
                      key={index}
                      to={action.link}
                      className={`block p-4 rounded-lg text-white transition-colors duration-200 ${action.color}`}
                    >
                      <div className="flex items-center">
                        <Icon className="w-6 h-6 mr-3" />
                        <div>
                          <h3 className="font-semibold">{action.title}</h3>
                          <p className="text-sm opacity-90">{action.description}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 ml-auto" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Recent Activity
              </h2>
              
              <div className="space-y-4">
                {/* Recent Donations */}
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                    Recent Donations
                  </h3>
                  {recentDonations.length > 0 ? (
                    <div className="space-y-3">
                      {recentDonations.map((donation) => (
                        <div key={donation.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {getStatusIcon(donation.status)}
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {donation.items.length} item{donation.items.length !== 1 ? 's' : ''} received
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {new Date(donation.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                              {donation.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      No donations received yet
                    </p>
                  )}
                </div>

                {/* Recent Requests */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                    Recent Requests
                  </h3>
                  {recentRequests.length > 0 ? (
                    <div className="space-y-3">
                      {recentRequests.map((request) => (
                        <div key={request.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {request.title}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {request.currentQuantity}/{request.targetQuantity} items received
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              request.status === 'active' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                            }`}>
                              {request.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      No requests created yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Unassigned Donations needing NGO scheduling */}
        {unassigned.length > 0 && (
          <div className="mt-8">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Unassigned Donations</h2>
              <div className="space-y-3">
                {unassigned.map(donation => (
                  <div key={donation.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{donation.items.length} item{donation.items.length !== 1 ? 's' : ''}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">From donor #{donation.donorId} • {new Date(donation.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button className="btn-primary" onClick={() => { setScheduling(donation); setPickupDate(''); setPickupTime('') }}>Schedule Pickup</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Urgent Actions */}
        {(pendingDonations.length > 0 || ngoRequests.filter(r => r.priority === 'high').length > 0) && (
          <div className="mt-8">
            <div className="card border-l-4 border-red-500">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Urgent Actions Required
              </h2>
              
              <div className="space-y-4">
                {pendingDonations.length > 0 && (
                  <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-yellow-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {pendingDonations.length} donation{pendingDonations.length !== 1 ? 's' : ''} pending approval
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Review and approve incoming donations
                        </p>
                      </div>
                    </div>
                    <Link
                      to="/ngo/inventory"
                      className="btn-primary"
                    >
                      Review Now
                    </Link>
                  </div>
                )}

                {ngoRequests.filter(r => r.priority === 'high').length > 0 && (
                  <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="flex items-center">
                      <Bell className="w-5 h-5 text-red-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          High priority requests need attention
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Update request status or create new requests
                        </p>
                      </div>
                    </div>
                    <Link
                      to="/ngo/requests"
                      className="btn-primary"
                    >
                      Manage Requests
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Schedule Modal */}
      {scheduling && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Schedule Pickup</h3>
              <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" onClick={() => setScheduling(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label">Pickup Date</label>
                <input type="date" className="input-field" value={pickupDate} onChange={e => setPickupDate(e.target.value)} />
              </div>
              <div>
                <label className="label">Pickup Time</label>
                <input type="time" className="input-field" value={pickupTime} onChange={e => setPickupTime(e.target.value)} />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">This will assign the donation to your NGO and notify the donor.</div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button className="btn-outline" onClick={() => setScheduling(null)}>Cancel</button>
              <button className="btn-primary" onClick={async () => {
                if (!pickupDate || !pickupTime) return
                const res = await schedulePickup({ donationId: scheduling.id, ngoId: user.id, pickupDate, pickupTime })
                if (res.success) setScheduling(null)
              }}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NGODashboard

