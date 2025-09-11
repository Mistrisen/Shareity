import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useDonation } from '../../contexts/DonationContext'
import { 
  Calendar, 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle,
  Truck,
  AlertCircle,
  Filter,
  Search,
  Download,
  Pencil,
  Trash2,
  X
} from 'lucide-react'

const DonationHistory = () => {
  const { user } = useAuth()
  const { getDonationsByUser, getNGOById, updateDonation, deleteDonation } = useDonation()
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [editing, setEditing] = useState(null)
  const [draftDonation, setDraftDonation] = useState(null)
  const [details, setDetails] = useState(null) // { donation, item }
  
  const userDonations = getDonationsByUser(user?.id)
  
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_transit', label: 'In Transit' },
    { value: 'delivered', label: 'Delivered' },
  ]

  const filteredDonations = userDonations.filter(donation => {
    const matchesStatus = statusFilter === 'all' || donation.status === statusFilter
    const matchesSearch = searchQuery === '' || 
      (getNGOById(donation.ngoId)?.name || donation.ngoSnapshot?.name || '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      donation.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesStatus && matchesSearch
  })

  const canModify = (donation) => donation.status === 'pending'

  const openEditDonation = (donation) => {
    setEditing(donation)
    setDraftDonation(JSON.parse(JSON.stringify(donation)))
  }

  const closeEdit = () => {
    setEditing(null)
    setDraftDonation(null)
  }

  const onChangePickup = (field, value) => {
    setDraftDonation(prev => ({ ...prev, [field]: value }))
  }

  const onChangeItem = (index, field, value) => {
    setDraftDonation(prev => {
      const items = [...prev.items]
      items[index] = { ...items[index], [field]: value }
      return { ...prev, items }
    })
  }

  const addEditItem = () => {
    setDraftDonation(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: 1, category: '', description: '', condition: 'good' }]
    }))
  }

  const removeEditItem = (index) => {
    setDraftDonation(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const saveEdit = async () => {
    if (!draftDonation) return
    const { id, items, pickupLocation, pickupDate, pickupTime, contactPhone, notes } = draftDonation
    const result = await updateDonation(id, { items, pickupLocation, pickupDate, pickupTime, contactPhone, notes })
    if (result.success) closeEdit()
  }

  const onDeleteDonation = async (id) => {
    const ok = window.confirm('Delete this donation? This cannot be undone.')
    if (!ok) return
    await deleteDonation(id)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'in_transit':
        return <Truck className="w-5 h-5 text-blue-500" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Donation History
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track all your donations and their impact
          </p>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search donations by NGO or item..."
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

            <button className="btn-outline flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Donations List */}
        {filteredDonations.length > 0 ? (
          <div className="space-y-6">
            {filteredDonations.map((donation) => {
              const ngo = getNGOById(donation.ngoId) || donation.ngoSnapshot
              return (
                <div key={donation.id} className="card">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* NGO Info */}
                    {ngo ? (
                      <div className="flex items-start space-x-4">
                        <img
                          src={ngo.image}
                          alt={ngo.name}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {ngo.name}
                          </h3>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            {ngo.location}
                          </div>
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
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          NGO assignment pending
                        </div>
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
                    )}

                    {/* Status */}
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(donation.status)}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(donation.status)}`}>
                          {donation.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      {donation.deliveredAt && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Delivered: {formatDate(donation.deliveredAt)}
                        </div>
                      )}
                      
                      {donation.estimatedDelivery && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Est. Delivery: {formatDate(donation.estimatedDelivery)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                      Donated Items
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {donation.items.map((item, index) => (
                        <button key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                          onClick={() => setDetails({ donation, item, ngo })}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-gray-900 dark:text-white">
                              {item.name}
                            </h5>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Qty: {item.quantity}
                            </span>
                          </div>
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded mb-2" />
                          )}
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            <div>Category: {item.category}</div>
                            <div>Condition: {item.condition}</div>
                            {item.description && (
                              <div className="mt-1 italic">"{item.description}"</div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Impact */}
                  {donation.impact && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Impact
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {donation.impact}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                    {canModify(donation) && (
                      <>
                        <button
                          className="btn-outline flex items-center"
                          onClick={() => openEditDonation(donation)}
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </button>
                        <button
                          className="btn-outline text-red-600 border-red-300 dark:border-red-700 flex items-center"
                          onClick={() => onDeleteDonation(donation.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </button>
                      </>
                    )}
                    <button className="btn-outline">View Details</button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No donations yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters.'
                : 'Your first donation can brighten someone’s day. Ready to start?'
              }
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <a
                href="/donor/donate"
                className="btn-primary"
              >
                Make your first donation
              </a>
            )}
          </div>
        )}
      </div>
      {/* Edit Modal */}
      {editing && draftDonation && (
        <EditDonationModal
          donation={editing}
          draft={draftDonation}
          onClose={closeEdit}
          onChangePickup={onChangePickup}
          onChangeItem={onChangeItem}
          addItem={addEditItem}
          removeItem={removeEditItem}
          onSave={saveEdit}
        />
      )}
      {/* Item Details Modal */}
      {details && (
        <ItemDetailsModal
          details={details}
          onClose={() => setDetails(null)}
        />
      )}
    </div>
  )
}

const EditDonationModal = ({ donation, draft, onClose, onChangePickup, onChangeItem, addItem, removeItem, onSave }) => {
  if (!donation || !draft) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Donation</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4 max-h-[70vh] overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Pickup Location</label>
              <input className="input-field" value={draft.pickupLocation || ''} onChange={e => onChangePickup('pickupLocation', e.target.value)} />
            </div>
            <div>
              <label className="label">Contact Phone</label>
              <input className="input-field" value={draft.contactPhone || ''} onChange={e => onChangePickup('contactPhone', e.target.value)} />
            </div>
            <div>
              <label className="label">Pickup Date</label>
              <input type="date" className="input-field" value={draft.pickupDate || ''} onChange={e => onChangePickup('pickupDate', e.target.value)} />
            </div>
            <div>
              <label className="label">Pickup Time</label>
              <input type="time" className="input-field" value={draft.pickupTime || ''} onChange={e => onChangePickup('pickupTime', e.target.value)} />
            </div>
          </div>

          <div>
            <label className="label">Notes</label>
            <textarea className="input-field" rows="2" value={draft.notes || ''} onChange={e => onChangePickup('notes', e.target.value)} />
          </div>

          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900 dark:text-white">Items</h4>
            <button className="btn-outline" onClick={addItem}>Add Item</button>
          </div>
          <div className="space-y-3">
            {draft.items.map((item, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <input className="input-field" placeholder="Name" value={item.name} onChange={e => onChangeItem(index, 'name', e.target.value)} />
                  <input type="number" min="1" className="input-field" placeholder="Qty" value={item.quantity} onChange={e => onChangeItem(index, 'quantity', parseInt(e.target.value) || 1)} />
                  <input className="input-field" placeholder="Category" value={item.category} onChange={e => onChangeItem(index, 'category', e.target.value)} />
                  <select className="input-field" value={item.condition || 'good'} onChange={e => onChangeItem(index, 'condition', e.target.value)}>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <textarea className="input-field flex-1" rows="1" placeholder="Description" value={item.description || ''} onChange={e => onChangeItem(index, 'description', e.target.value)} />
                  <button className="text-red-600 hover:text-red-700" onClick={() => removeItem(index)}>
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button className="btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={onSave}>Save Changes</button>
        </div>
      </div>
    </div>
  )
}

export default DonationHistory

const ItemDetailsModal = ({ details, onClose }) => {
  const { donation, item, ngo } = details
  const imageUrl = (details.item && details.item.image)
    ? details.item.image
    : (Array.isArray(donation.images) && donation.images.length ? donation.images[0] : '/placeholder-ngo.jpg')
  const locationText = donation.pickupLocation || ngo?.location || 'Unknown Location'
  const uploadedAt = new Date(donation.createdAt).toLocaleString()
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Item Details</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          {/* Image */}
          <img src={imageUrl} alt={item.name} className="w-full h-56 object-cover rounded-lg" />
          {/* Item name */}
          <div className="text-xl font-semibold text-gray-900 dark:text-white">{item.name}</div>
          {/* Location */}
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-2" /> {locationText}
          </div>
          {/* Date and time of upload */}
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4 mr-2" /> {uploadedAt}
          </div>
          {/* Number of items */}
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Package className="w-4 h-4 mr-2" /> Quantity: {item.quantity}
          </div>
          {/* Status */}
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            donation.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
            : donation.status === 'in_transit' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
          }`}>
            {donation.status.replace('_', ' ')}
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button className="btn-outline" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
