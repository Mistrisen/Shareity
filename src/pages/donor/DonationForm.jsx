import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDonation } from '../../contexts/DonationContext'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Plus, 
  Minus, 
  Upload, 
  MapPin, 
  Calendar,
  Package,
  Heart,
  X
} from 'lucide-react'

const DonationForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { createDonation, getNGOById } = useDonation()
  const { user } = useAuth()
  
  const [formData, setFormData] = useState({
    ngoId: location.state?.ngoId || '',
    items: [{ name: '', quantity: 1, category: '', description: '', condition: 'good' }],
    pickupLocation: '',
    // pickupDate and pickupTime will be assigned by NGO
    contactPhone: user?.phone || '',
    notes: '',
    images: []
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [selectedNGO, setSelectedNGO] = useState(null)

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

  const conditions = [
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' },
  ]

  useEffect(() => {
    if (formData.ngoId) {
      const ngo = getNGOById(formData.ngoId)
      setSelectedNGO(ngo)
    }
  }, [formData.ngoId, getNGOById])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items]
    newItems[index][field] = value
    setFormData(prev => ({
      ...prev,
      items: newItems
    }))
  }

  const handleItemImageChange = (index, file) => {
    const newItems = [...formData.items]
    newItems[index].imageFile = file
    newItems[index].imagePreview = file ? URL.createObjectURL(file) : undefined
    setFormData(prev => ({ ...prev, items: newItems }))
  }

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: 1, category: '', description: '', condition: 'good' }]
    }))
  }

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        items: newItems
      }))
    }
  }

  // Removed donation-level image upload; images are attached per item

  const validateForm = () => {
    const newErrors = {}

    // ngoId is optional now; routing/matching will assign later

    if (!formData.pickupLocation) {
      newErrors.pickupLocation = 'Pickup location is required'
    }

    // date/time are set by NGO

    if (!formData.contactPhone) {
      newErrors.contactPhone = 'Contact phone is required'
    }

    // Validate items
    formData.items.forEach((item, index) => {
      if (!item.name) {
        newErrors[`item_${index}_name`] = 'Item name is required'
      }
      if (!item.category) {
        newErrors[`item_${index}_category`] = 'Item category is required'
      }
      if (item.quantity < 1) {
        newErrors[`item_${index}_quantity`] = 'Quantity must be at least 1'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    
    // Upload per-item images if provided
    const itemsWithImages = []
    for (const it of formData.items) {
      const copy = { ...it }
      if (it.imageFile) {
        try {
          const form = new FormData()
          form.append('images', it.imageFile)
          const uploadRes = await fetch('/api/uploads', { method: 'POST', body: form })
          const uploadJson = await uploadRes.json()
          if (uploadJson.success && uploadJson.urls && uploadJson.urls.length > 0) {
            copy.image = uploadJson.urls[0]
          }
        } catch (_) { /* ignore and continue */ }
        delete copy.imageFile
        delete copy.imagePreview
      }
      itemsWithImages.push(copy)
    }

    const donationData = {
      ...formData,
      items: itemsWithImages,
      donorId: user.id,
      status: 'pending',
      createdAt: new Date().toISOString(),
      // Save a snapshot of NGO details so UI doesn't show "Unknown NGO" when list isn't loaded
      ngoSnapshot: selectedNGO
        ? {
            id: selectedNGO.id,
            name: selectedNGO.name,
            location: selectedNGO.location,
            image: selectedNGO.image,
          }
        : undefined,
    }

    const result = await createDonation(donationData)
    
    if (result.success) {
      navigate('/donor/history')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Thank you for sharing
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            A few details help us get your items to the right people quickly and safely.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* NGO Note */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              NGO
            </h2>
            {selectedNGO ? (
              <div className="flex items-start space-x-4">
                <img src={selectedNGO.image} alt={selectedNGO.name} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{selectedNGO.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedNGO.description}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                This donation will be routed after matching with NGO needs. You can also start from an NGO need to prefill this.
              </p>
            )}
          </div>

          {/* Donation Items */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Donation Items
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add each item separately so NGOs know exactly what\'s available. Photos help a lot.
              </p>
              <button
                type="button"
                onClick={addItem}
                className="btn-outline flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Item {index + 1}
                    </h3>
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Item Name *</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                        className={`input-field ${errors[`item_${index}_name`] ? 'border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="e.g., Winter Jacket, Canned Food"
                      />
                      {errors[`item_${index}_name`] && (
                        <p className="mt-1 text-sm text-red-600">{errors[`item_${index}_name`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="label">Category *</label>
                      <select
                        value={item.category}
                        onChange={(e) => handleItemChange(index, 'category', e.target.value)}
                        className={`input-field ${errors[`item_${index}_category`] ? 'border-red-500 focus:ring-red-500' : ''}`}
                      >
                        <option value="">Select category</option>
                        {categories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                      {errors[`item_${index}_category`] && (
                        <p className="mt-1 text-sm text-red-600">{errors[`item_${index}_category`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="label">Quantity *</label>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleItemChange(index, 'quantity', Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                          className={`input-field text-center w-20 ${errors[`item_${index}_quantity`] ? 'border-red-500 focus:ring-red-500' : ''}`}
                        />
                        <button
                          type="button"
                          onClick={() => handleItemChange(index, 'quantity', item.quantity + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      {errors[`item_${index}_quantity`] && (
                        <p className="mt-1 text-sm text-red-600">{errors[`item_${index}_quantity`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="label">Condition</label>
                      <select
                        value={item.condition}
                        onChange={(e) => handleItemChange(index, 'condition', e.target.value)}
                        className="input-field"
                      >
                        {conditions.map((condition) => (
                          <option key={condition.value} value={condition.value}>
                            {condition.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="label">Description</label>
                    <textarea
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      className="input-field"
                      rows="2"
                      placeholder="Additional details about the item..."
                    />
                  </div>

                  <div className="mt-4">
                    <label className="label">Item Photo (Optional)</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleItemImageChange(index, e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                      />
                      {item.imagePreview && (
                        <img src={item.imagePreview} alt={`Item ${index + 1}`} className="w-16 h-16 object-cover rounded" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pickup Details */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Pickup Details
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">We\'ll share these with the assigned NGO so they can coordinate with you.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Pickup Location *</label>
                <input
                  type="text"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleInputChange}
                  className={`input-field ${errors.pickupLocation ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Enter your address"
                />
                {errors.pickupLocation && (
                  <p className="mt-1 text-sm text-red-600">{errors.pickupLocation}</p>
                )}
              </div>

              <div>
                <label className="label">Contact Phone *</label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  className={`input-field ${errors.contactPhone ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Your phone number"
                />
                {errors.contactPhone && (
                  <p className="mt-1 text-sm text-red-600">{errors.contactPhone}</p>
                )}
              </div>

              <div className="md:col-span-2 text-sm text-gray-600 dark:text-gray-400">
                Pickup date and time will be assigned by the NGO after matching.
              </div>
            </div>

            <div className="mt-4">
              <label className="label">Additional Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="input-field"
                rows="3"
                placeholder="Any special instructions for pickup..."
              />
            </div>
          </div>

          {/* Removed donation-level image upload block; images are handled per item */}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/donor/dashboard')}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 mr-2" />
                  Submit Donation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DonationForm
