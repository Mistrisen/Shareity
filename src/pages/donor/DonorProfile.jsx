import React, { useRef, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Camera, Save, X } from 'lucide-react'

const DonorProfile = () => {
  const { user, updateProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
  })
  const fileRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAvatarClick = () => fileRef.current && fileRef.current.click()

  const handleAvatarChange = async (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    try {
      const form = new FormData()
      form.append('images', file)
      const res = await fetch('/api/uploads', { method: 'POST', body: form })
      const json = await res.json()
      if (json.success && json.urls && json.urls.length > 0) {
        updateProfile({ avatar: json.urls[0] })
      }
    } catch (_) {}
    finally { if (fileRef.current) fileRef.current.value = '' }
  }

  const submit = (e) => {
    e.preventDefault()
    updateProfile(formData)
    setIsEditing(false)
  }

  const cancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || '',
    })
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">Update your details to help NGOs coordinate smoothly.</p>
        </div>

        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="card text-center">
              <div className="relative inline-block mb-4">
                <img src={user?.avatar || '/placeholder-ngo.jpg'} alt={formData.name} className="w-28 h-28 rounded-full object-cover mx-auto" />
                <button type="button" onClick={handleAvatarClick} className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700">
                  <Camera className="w-4 h-4" />
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">{user?.name}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="card space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Contact Information</h2>
                {!isEditing ? (
                  <button type="button" className="btn-outline" onClick={() => setIsEditing(true)}>Edit</button>
                ) : null}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Name</label>
                  <input disabled={!isEditing} name="name" value={formData.name} onChange={handleChange} className="input-field disabled:opacity-70" />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input disabled name="email" value={formData.email} onChange={handleChange} className="input-field disabled:opacity-70" />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input disabled={!isEditing} name="phone" value={formData.phone} onChange={handleChange} className="input-field disabled:opacity-70" />
                </div>
                <div>
                  <label className="label">Location</label>
                  <input disabled={!isEditing} name="location" value={formData.location} onChange={handleChange} className="input-field disabled:opacity-70" />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={cancel} className="btn-outline flex items-center"><X className="w-4 h-4 mr-2" />Cancel</button>
                  <button type="submit" className="btn-primary flex items-center"><Save className="w-4 h-4 mr-2" />Save Changes</button>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DonorProfile


