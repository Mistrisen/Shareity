import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useDonation } from '../../contexts/DonationContext'
import { 
  Users, 
  Heart, 
  TrendingUp, 
  MapPin,
  Calendar,
  Award,
  BarChart3,
  PieChart,
  Download,
  Filter,
  Plus,
  Edit,
  Eye,
  X
} from 'lucide-react'

const BeneficiaryReports = () => {
  const { user } = useAuth()
  const { donations, getRequestsByNGO } = useDonation()
  const [timeFilter, setTimeFilter] = useState('all')
  const [showAddReport, setShowAddReport] = useState(false)
  
  const ngoDonations = donations.filter(donation => donation.ngoId === (user?.id || 1))
  const ngoRequests = getRequestsByNGO(user?.id || 1)
  
  // Initialize with empty beneficiary reports data
  const [beneficiaryReports, setBeneficiaryReports] = useState([])

  const [newReport, setNewReport] = useState({
    title: '',
    date: '',
    beneficiaries: '',
    itemsDistributed: '',
    location: '',
    impact: '',
    category: '',
    images: []
  })

  const timeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'year', label: 'This Year' },
    { value: 'month', label: 'This Month' },
    { value: 'week', label: 'This Week' },
  ]

  const categories = [
    { value: 'food', label: 'Food & Nutrition' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'education', label: 'Education' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'shelter', label: 'Shelter' },
    { value: 'other', label: 'Other' },
  ]

  // Calculate metrics
  const totalBeneficiaries = beneficiaryReports.reduce((sum, report) => sum + report.beneficiaries, 0)
  const totalItemsDistributed = beneficiaryReports.reduce((sum, report) => sum + report.itemsDistributed, 0)
  const totalReports = beneficiaryReports.length
  const avgBeneficiariesPerReport = totalReports > 0 ? Math.round(totalBeneficiaries / totalReports) : 0

  const stats = [
    {
      label: 'Total Reports',
      value: totalReports,
      icon: BarChart3,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      label: 'Beneficiaries Helped',
      value: totalBeneficiaries,
      icon: Users,
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      label: 'Items Distributed',
      value: totalItemsDistributed,
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-100 dark:bg-red-900/20'
    },
    {
      label: 'Avg. per Report',
      value: avgBeneficiariesPerReport,
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    }
  ]

  const categoryBreakdown = beneficiaryReports.reduce((acc, report) => {
    acc[report.category] = (acc[report.category] || 0) + report.beneficiaries
    return acc
  }, {})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewReport(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const report = {
      ...newReport,
      id: Date.now(),
      beneficiaries: parseInt(newReport.beneficiaries),
      itemsDistributed: parseInt(newReport.itemsDistributed)
    }
    setBeneficiaryReports(prev => [report, ...prev])
    setNewReport({
      title: '',
      date: '',
      beneficiaries: '',
      itemsDistributed: '',
      location: '',
      impact: '',
      category: '',
      images: []
    })
    setShowAddReport(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Beneficiary Reports
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track and report the impact of your donations on beneficiaries
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
              
              <button
                onClick={() => setShowAddReport(true)}
                className="btn-primary flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Report
              </button>
              
              <button className="btn-outline flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export
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
          {/* Category Breakdown */}
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Impact by Category
              </h2>
              
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
                      {count} people
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reports List */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Recent Reports
              </h2>
              
              {beneficiaryReports.length > 0 ? (
                <div className="space-y-6">
                  {beneficiaryReports.map((report) => (
                    <div key={report.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {report.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(report.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {report.location}
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {report.beneficiaries} beneficiaries
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-600 text-sm rounded-full capitalize">
                            {report.category}
                          </span>
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {report.impact}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {report.beneficiaries}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Beneficiaries Helped
                          </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {report.itemsDistributed}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Items Distributed
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <button className="btn-outline flex items-center">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No reports yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Start tracking your impact by creating beneficiary reports
                  </p>
                  <button
                    onClick={() => setShowAddReport(true)}
                    className="btn-primary"
                  >
                    Create First Report
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add Report Modal */}
        {showAddReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Add Beneficiary Report
                  </h2>
                  <button
                    onClick={() => setShowAddReport(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="label">Report Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={newReport.title}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="e.g., Winter Clothing Distribution"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Date *</label>
                      <input
                        type="date"
                        name="date"
                        value={newReport.date}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="label">Category *</label>
                      <select
                        name="category"
                        value={newReport.category}
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
                  </div>

                  <div>
                    <label className="label">Location *</label>
                    <input
                      type="text"
                      name="location"
                      value={newReport.location}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Where was the distribution held?"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Number of Beneficiaries *</label>
                      <input
                        type="number"
                        name="beneficiaries"
                        value={newReport.beneficiaries}
                        onChange={handleInputChange}
                        className="input-field"
                        min="1"
                        required
                      />
                    </div>

                    <div>
                      <label className="label">Items Distributed *</label>
                      <input
                        type="number"
                        name="itemsDistributed"
                        value={newReport.itemsDistributed}
                        onChange={handleInputChange}
                        className="input-field"
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">Impact Description *</label>
                    <textarea
                      name="impact"
                      value={newReport.impact}
                      onChange={handleInputChange}
                      className="input-field"
                      rows="3"
                      placeholder="Describe the impact and how it helped the beneficiaries..."
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddReport(false)}
                      className="btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      Add Report
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BeneficiaryReports
