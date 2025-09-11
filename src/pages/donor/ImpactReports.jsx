import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useDonation } from '../../contexts/DonationContext'
import { 
  TrendingUp, 
  Users, 
  Heart, 
  MapPin, 
  Calendar,
  Award,
  BarChart3,
  PieChart,
  Download,
  Filter
} from 'lucide-react'

const ImpactReports = () => {
  const { user } = useAuth()
  const { getDonationsByUser, getNGOById, getUsageReportsByDonation, usageReports } = useDonation()
  const [timeFilter, setTimeFilter] = useState('all')
  
  const userDonations = getDonationsByUser(user?.id)
  
  const timeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'year', label: 'This Year' },
    { value: 'month', label: 'This Month' },
    { value: 'week', label: 'This Week' },
  ]

  // Calculate impact metrics
  const totalDonations = userDonations.length
  const totalItems = userDonations.reduce((sum, donation) => 
    sum + donation.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
  )
  const ngosSupported = new Set(userDonations.map(d => d.ngoId)).size
  const deliveredDonations = userDonations.filter(d => d.status === 'delivered').length
  
  // Category breakdown
  const categoryBreakdown = userDonations.reduce((acc, donation) => {
    donation.items.forEach(item => {
      acc[item.category] = (acc[item.category] || 0) + item.quantity
    })
    return acc
  }, {})

  // NGO breakdown
  const ngoBreakdown = userDonations.reduce((acc, donation) => {
    const ngo = getNGOById(donation.ngoId)
    if (ngo) {
      acc[ngo.name] = (acc[ngo.name] || 0) + 1
    }
    return acc
  }, {})

  const impactMetrics = [
    {
      label: 'Total Donations',
      value: totalDonations,
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
      description: 'Donations made'
    },
    {
      label: 'Items Donated',
      value: totalItems,
      icon: TrendingUp,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      description: 'Individual items'
    },
    {
      label: 'NGOs Supported',
      value: ngosSupported,
      icon: Users,
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      description: 'Organizations helped'
    },
    {
      label: 'Delivered',
      value: deliveredDonations,
      icon: Award,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      description: 'Successfully delivered'
    }
  ]

  // Get usage reports for user's donations
  const userUsageReports = userDonations.flatMap(donation => 
    getUsageReportsByDonation(donation.id)
  )

  const recentImpact = userDonations
    .filter(d => d.impact)
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Impact Reports
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                See how your donations are making a real difference in communities
              </p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="input-field w-40"
              >
                {timeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <button className="btn-outline flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Impact Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {impactMetrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <div key={index} className="card">
                <div className="flex items-center">
                  <div className={`w-12 h-12 ${metric.bgColor} rounded-lg flex items-center justify-center mr-4`}>
                    <Icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {metric.value}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {metric.label}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {metric.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Breakdown */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Donations by Category
              </h2>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {Object.entries(categoryBreakdown).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary-600 rounded-full mr-3"></div>
                    <span className="text-gray-900 dark:text-white capitalize">
                      {category.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {count} items
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* NGO Breakdown */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                NGOs Supported
              </h2>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {Object.entries(ngoBreakdown).map(([ngoName, count]) => (
                <div key={ngoName} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-secondary-600 rounded-full mr-3"></div>
                    <span className="text-gray-900 dark:text-white">
                      {ngoName}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {count} donation{count !== 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Usage Reports from NGOs */}
        {userUsageReports.length > 0 && (
          <div className="mt-8">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                How Your Donations Are Being Used
              </h2>
              
              <div className="space-y-6">
                {userUsageReports.map((report) => {
                  const ngo = getNGOById(report.ngoId)
                  return (
                    <div key={report.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Heart className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {report.title}
                            </h3>
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-xs rounded-full">
                              Usage Report
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-3">
                            {report.description}
                          </p>
                          
                          {report.impact && (
                            <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                              <p className="text-sm font-medium text-green-900 dark:text-green-300 mb-1">
                                Impact:
                              </p>
                              <p className="text-sm text-green-700 dark:text-green-400">
                                {report.impact}
                              </p>
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
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
                                <MapPin className="w-4 h-4 mr-2" />
                                {report.location}
                              </div>
                            )}
                          </div>

                          {/* Media Display */}
                          {(report.images?.length > 0 || report.videos?.length > 0) && (
                            <div className="mb-3">
                              <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                Photos & Videos:
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

                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-500">
                            <span className="font-medium">Reported by:</span>
                            <span className="ml-1">{ngo?.name || 'Unknown NGO'}</span>
                            <Calendar className="w-4 h-4 ml-4 mr-1" />
                            {new Date(report.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Recent Impact Stories */}
        <div className="mt-8">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Recent Impact Stories
            </h2>
            
            {recentImpact.length > 0 ? (
              <div className="space-y-6">
                {recentImpact.map((donation) => {
                  const ngo = getNGOById(donation.ngoId)
                  return (
                    <div key={donation.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Heart className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {ngo?.name || 'Unknown NGO'}
                            </h3>
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-xs rounded-full">
                              Delivered
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-3">
                            {donation.impact}
                          </p>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(donation.deliveredAt || donation.createdAt).toLocaleDateString()}
                          </div>
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
                  No impact stories yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Impact stories will appear here once your donations are delivered
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Impact Summary */}
        <div className="mt-8">
          <div className="card bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">
                Your Impact Summary
              </h2>
              <p className="text-lg mb-6 opacity-90">
                Through your generous donations, you've helped {ngosSupported} organizations 
                and donated {totalItems} items that have made a real difference in people's lives.
              </p>
              <div className="flex justify-center space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-bold">{totalDonations}</div>
                  <div className="text-sm opacity-90">Donations Made</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{totalItems}</div>
                  <div className="text-sm opacity-90">Items Donated</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{ngosSupported}</div>
                  <div className="text-sm opacity-90">NGOs Supported</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImpactReports
