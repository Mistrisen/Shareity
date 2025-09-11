import React, { useEffect, useMemo, useState } from 'react'
import { useDonation } from '../../contexts/DonationContext'
import { useAuth } from '../../contexts/AuthContext'
import { Search, Filter, Package, Calendar, MapPin, CheckCircle, Truck, Clock } from 'lucide-react'

const ItemSearch = () => {
  const { user } = useAuth()
  const { donations, getNGOById } = useDonation()
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  
  // Hydrate search from ?q= to integrate with navbar search
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const q = params.get('q') || ''
    if (q) setSearchQuery(q)
  }, [])

  const categories = [
    { value: '', label: 'All Categories' },
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

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_transit', label: 'In Transit' },
    { value: 'delivered', label: 'Delivered' },
  ]

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

  const filteredDonations = useMemo(() => {
    return donations
      .filter(d => !user?.id || d.ngoId === user.id || !d.ngoId)
      .filter(d => statusFilter === 'all' || d.status === statusFilter)
      .filter(d => {
        if (!searchQuery && !categoryFilter) return true
        const itemMatch = (d.items || []).some(item => {
          const q = searchQuery.trim().toLowerCase()
          const name = (item.name || '').toLowerCase()
          const desc = (item.description || '').toLowerCase()
          const cat = (item.category || '').toLowerCase()
          const categoryOk = !categoryFilter || cat === categoryFilter
          const queryOk = !q || name.includes(q) || desc.includes(q)
          return categoryOk && queryOk
        })
        return itemMatch
      })
  }, [donations, user, statusFilter, searchQuery, categoryFilter])

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Search Donated Items</h1>
          <p className="text-gray-600 dark:text-gray-400">Find items from donor submissions by name, category, or status</p>
        </div>

        <div className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search items..."
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
                {categories.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
              >
                {statusOptions.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredDonations.length > 0 ? (
          <div className="space-y-6">
            {filteredDonations.map((donation) => (
              <div key={donation.id} className="card">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      {getStatusIcon(donation.status)}
                      <span className="text-sm px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 capitalize">{donation.status.replace('_', ' ')}</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" /> {formatDate(donation.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(donation.items || []).map((item, idx) => (
                    <div key={idx} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                        <span className="text-xs text-gray-600 dark:text-gray-400">Qty: {item.quantity}</span>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        <div>Category: {item.category || '—'}</div>
                        <div>Condition: {item.condition || '—'}</div>
                        {item.description && (
                          <div className="mt-1 italic">"{item.description}"</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No items found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try a different search or remove filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ItemSearch
