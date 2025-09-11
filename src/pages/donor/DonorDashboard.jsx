import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useDonation } from '../../contexts/DonationContext'
import { 
  Heart, 
  TrendingUp, 
  Package, 
  MapPin, 
  Calendar,
  Star,
  Users,
  Award,
  ArrowRight,
  Plus
} from 'lucide-react'

const DonorDashboard = () => {
  const { user } = useAuth()
  const { getDonationsByUser, ngos } = useDonation()
  
  const userDonations = getDonationsByUser(user?.id)
  const recentDonations = userDonations.slice(0, 3)
  const totalDonations = userDonations.length
  const totalItems = userDonations.reduce((sum, donation) => 
    sum + (donation.items ? donation.items.reduce((itemSum, item) => itemSum + item.quantity, 0) : 0), 0
  )

  const stats = [
    {
      label: 'Total Donations',
      value: totalDonations,
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-100 dark:bg-red-900/20'
    },
    {
      label: 'Items Donated',
      value: totalItems,
      icon: Package,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      label: 'NGOs Supported',
      value: new Set(userDonations.map(d => d.ngoId)).size,
      icon: Users,
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      label: 'Impact Score',
      value: totalDonations * 10,
      icon: Award,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
    }
  ]

  const quickActions = [
    {
      title: 'Make a Donation',
      description: 'Donate items to help those in need',
      icon: Plus,
      link: '/donor/donate',
      color: 'bg-primary-600 hover:bg-primary-700'
    },
    {
      title: 'View NGO Needs',
      description: 'See what NGOs need and donate directly',
      icon: Heart,
      link: '/needs',
      color: 'bg-red-600 hover:bg-red-700'
    },
    {
      title: 'Browse NGOs',
      description: 'Discover verified NGOs in your area',
      icon: MapPin,
      link: '/browse-ngos',
      color: 'bg-secondary-600 hover:bg-secondary-700'
    },
    {
      title: 'View Impact',
      description: 'See how your donations are making a difference',
      icon: TrendingUp,
      link: '/donor/impact',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'Donation History',
      description: 'Track all your past donations',
      icon: Calendar,
      link: '/donor/history',
      color: 'bg-purple-600 hover:bg-purple-700'
    }
  ]

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

  const getNGOById = (ngoId) => {
    return ngos.find(ngo => ngo.id === ngoId)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's an overview of your donation activity and impact
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

          {/* Recent Donations */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Recent Donations
                </h2>
                <Link
                  to="/donor/history"
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              {recentDonations.length > 0 ? (
                <div className="space-y-4">
                  {recentDonations.map((donation) => {
                    const ngo = getNGOById(donation.ngoId) || donation.ngoSnapshot
                    return (
                      <div key={donation.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              {ngo && (
                                <img
                                  src={ngo.image}
                                  alt={ngo.name}
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                              )}
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                  {ngo ? ngo.name : 'NGO assignment pending'}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {donation.items.length} item{donation.items.length !== 1 ? 's' : ''} donated
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-1 mb-2">
                              {donation.items.slice(0, 3).map((item, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                                >
                                  {item.quantity}x {item.name}
                                </span>
                              ))}
                              {donation.items.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                                  +{donation.items.length - 3} more
                                </span>
                              )}
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(donation.createdAt).toLocaleDateString()}
                              </div>
                              {donation.impact && (
                                <div className="flex items-center">
                                  <Heart className="w-4 h-4 mr-1" />
                                  Impact: {donation.impact}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="ml-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                              {donation.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No donations yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Start making a difference by donating items to verified NGOs
                  </p>
                  <Link
                    to="/donor/donate"
                    className="btn-primary"
                  >
                    Make Your First Donation
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Featured NGOs */}
        <div className="mt-8">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Featured NGOs
              </h2>
              <Link
                to="/browse-ngos"
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
              >
                Browse All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ngos.slice(0, 3).map((ngo) => (
                <div key={ngo.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={ngo.image}
                      alt={ngo.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {ngo.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4 mr-1" />
                        {ngo.location}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {ngo.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(ngo.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                        ({ngo.rating})
                      </span>
                    </div>
                    <Link
                      to="/donor/donate"
                      state={{ ngoId: ngo.id }}
                      className="btn-primary text-sm"
                    >
                      Donate
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DonorDashboard
