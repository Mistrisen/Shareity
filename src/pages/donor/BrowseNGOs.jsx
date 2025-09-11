import React, { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDonation } from '../../contexts/DonationContext'
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Users, 
  Heart,
  ChevronDown,
  Grid,
  List
} from 'lucide-react'

const BrowseNGOs = () => {
  const { ngos, searchNGOs, getNGOsByCategory } = useDonation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('rating')
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)

  // Hydrate from ?q= query param for navbar search
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const q = params.get('q') || ''
    if (q) setSearchQuery(q)
  }, [])

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'food', label: 'Food & Nutrition' },
    { value: 'education', label: 'Education' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'shelter', label: 'Shelter' },
    { value: 'emergency', label: 'Emergency Relief' },
  ]

  const sortOptions = [
    { value: 'rating', label: 'Highest Rated' },
    { value: 'donations', label: 'Most Donations' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'location', label: 'Location' },
  ]

  const filteredNGOs = useMemo(() => {
    let filtered = ngos

    // Apply search filter
    if (searchQuery) {
      filtered = searchNGOs(searchQuery)
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = getNGOsByCategory(selectedCategory)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'donations':
          return b.donationsReceived - a.donationsReceived
        case 'name':
          return a.name.localeCompare(b.name)
        case 'location':
          return a.location.localeCompare(b.location)
        default:
          return 0
      }
    })

    return filtered
  }, [ngos, searchQuery, selectedCategory, sortBy, searchNGOs, getNGOsByCategory])

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const NGOCard = ({ ngo }) => (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="relative">
        <img
          src={ngo.image}
          alt={ngo.name}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        {ngo.verified && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Verified
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
            {ngo.name}
          </h3>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            {ngo.location}
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
          {ngo.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {renderStars(ngo.rating)}
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
              ({ngo.rating})
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4 mr-1" />
            {ngo.donationsReceived} donations
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {ngo.needs.slice(0, 3).map((need, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-600 text-xs rounded-full"
            >
              {need}
            </span>
          ))}
          {ngo.needs.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
              +{ngo.needs.length - 3} more
            </span>
          )}
        </div>

        <div className="flex space-x-2 pt-2">
          <Link
            to={`/ngo/${ngo.id}`}
            className="flex-1 btn-outline text-center"
          >
            View Details
          </Link>
          <Link
            to="/donor/donate"
            state={{ ngoId: ngo.id }}
            className="flex-1 btn-primary text-center"
          >
            Donate
          </Link>
        </div>
      </div>
    </div>
  )

  const NGOListItem = ({ ngo }) => (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative md:w-48 flex-shrink-0">
          <img
            src={ngo.image}
            alt={ngo.name}
            className="w-full h-32 md:h-full object-cover rounded-lg"
          />
          {ngo.verified && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Verified
            </div>
          )}
        </div>
        
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              {ngo.name}
            </h3>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              {ngo.location}
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {ngo.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {renderStars(ngo.rating)}
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                ({ngo.rating})
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4 mr-1" />
              {ngo.donationsReceived} donations
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {ngo.needs.slice(0, 4).map((need, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-600 text-xs rounded-full"
              >
                {need}
              </span>
            ))}
            {ngo.needs.length > 4 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                +{ngo.needs.length - 4} more
              </span>
            )}
          </div>

          <div className="flex space-x-2">
            <Link
              to={`/ngo/${ngo.id}`}
              className="btn-outline"
            >
              View Details
            </Link>
            <Link
              to="/donor/donate"
              state={{ ngoId: ngo.id }}
              className="btn-primary"
            >
              Donate
            </Link>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Browse NGOs
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover verified NGOs making a difference in communities worldwide
          </p>
        </div>

        {/* Search and Filters */}
        <div className="card mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search NGOs by name, location, or cause..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Try “food”, “education”, or your city.</p>
              </div>
            </div>

            {/* Category Filter */}
            <div className="lg:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredNGOs.length} NGOs
          </p>
        </div>

        {/* NGO Grid/List */}
        {filteredNGOs.length > 0 ? (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-6'
          }>
            {filteredNGOs.map((ngo) => (
              viewMode === 'grid' ? (
                <NGOCard key={ngo.id} ngo={ngo} />
              ) : (
                <NGOListItem key={ngo.id} ngo={ngo} />
              )
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              We couldn’t find a match
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try different keywords or browse all categories to discover inspiring organisations.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('')
              }}
              className="btn-primary"
            >
              Show all NGOs
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default BrowseNGOs
