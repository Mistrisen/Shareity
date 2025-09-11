import React, { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const DonationContext = createContext()

export const useDonation = () => {
  const context = useContext(DonationContext)
  if (!context) {
    throw new Error('useDonation must be used within a DonationProvider')
  }
  return context
}

export const DonationProvider = ({ children }) => {
  const [ngos, setNgos] = useState([])
  const [donations, setDonations] = useState([])
  const [requests, setRequests] = useState([])
  const [usageReports, setUsageReports] = useState([])
  const [notifications, setNotifications] = useState([])
  const [ngoKeywordsById, setNgoKeywordsById] = useState({})
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(false)

  // Initialize with empty data for fresh start
  useEffect(() => {
    setNgos([])
    setDonations([])
    setRequests([])
    setUsageReports([])
    setNotifications([])
    setNgoKeywordsById({})
    setFeedbacks([])
  }, [])

  const createDonation = async (donationData) => {
    try {
      setLoading(true)
      // Persist to backend
      let imageUrls = donationData.images
      // If images are File objects, upload them first
      if (Array.isArray(donationData.images) && donationData.images.length && donationData.images[0] instanceof File) {
        const form = new FormData()
        donationData.images.forEach(file => form.append('images', file))
        const uploadRes = await fetch('/api/uploads', { method: 'POST', body: form })
        const uploadJson = await uploadRes.json()
        if (uploadJson.success) imageUrls = uploadJson.urls
      }
      const payload = { ...donationData, images: imageUrls }
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const api = await res.json()
      if (!api.success) throw new Error('Failed to create donation')
      
      const newDonation = api.donation
      
      setDonations(prev => [newDonation, ...prev])
      // Notify NGOs whose active requests match donated items
      try {
        const activeRequests = requests.filter(r => r.status === 'active')
        const matchedByRequest = new Set()
        for (const request of activeRequests) {
          const hasMatch = (newDonation.items || []).some(item => {
            const name = (item.name || '').toLowerCase()
            const category = (item.category || '').toLowerCase()
            const title = (request.title || '').toLowerCase()
            const description = (request.description || '').toLowerCase()
            return category && request.category && category === String(request.category).toLowerCase()
              || (title && name && name.includes(title.split(' ')[0]))
              || (description && name && description.includes(name))
          })
          if (hasMatch && request.ngoId) {
            matchedByRequest.add(request.ngoId)
          }
        }
        matchedByRequest.forEach(ngoId => {
          addNotification({
            userId: ngoId,
            type: 'donation_match',
            title: 'New donation may match your needs',
            message: 'A donor added items that match one of your active requests.',
            meta: { donationId: newDonation.id },
          })
        })
      } catch (_) { /* noop */ }

      // Notify NGOs by collection keywords match
      try {
        const itemsText = (newDonation.items || []).map(i => `${i.name} ${i.category}`).join(' ').toLowerCase()
        Object.entries(ngoKeywordsById).forEach(([ngoId, keywords]) => {
          const hasKeyword = (keywords || []).some(kw => kw && itemsText.includes(String(kw).toLowerCase()))
          if (hasKeyword) {
            addNotification({
              userId: Number(ngoId),
              type: 'keyword_match',
              title: 'New donation matches your collection keywords',
              message: 'A donor added items related to your collection preferences.',
              meta: { donationId: newDonation.id },
            })
          }
        })
      } catch (_) { /* noop */ }
      toast.success('Thank you! Your donation was submitted. We’ll notify you when an NGO schedules pickup.')
      return { success: true, donation: newDonation }
    } catch (error) {
      // Log for debugging and show a helpful message
      // eslint-disable-next-line no-console
      console.error('createDonation error:', error)
      toast.error('We couldn’t submit your donation right now. Please check your connection and try again.')
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const updateDonationStatus = (donationId, status) => {
    setDonations(prev => 
      prev.map(donation => 
        donation.id === donationId 
          ? { ...donation, status, updatedAt: new Date().toISOString() }
          : donation
      )
    )
    toast.success(`Donation status updated to ${status.replace('_', ' ')}`)
  }

  const updateDonation = async (donationId, updates) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/donations/${donationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      const api = await res.json()
      if (!api.success) throw new Error('Failed to update donation')
      const updated = api.donation
      setDonations(prev => prev.map(d => (d.id === donationId ? updated : d)))
      toast.success('Donation updated')
      return { success: true, donation: updated }
    } catch (error) {
      toast.error('Failed to update donation')
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const deleteDonation = async (donationId) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/donations/${donationId}`, { method: 'DELETE' })
      const api = await res.json()
      if (!api.success) throw new Error('Failed to delete donation')
      setDonations(prev => prev.filter(d => d.id !== donationId))
      toast.success('Donation deleted')
      return { success: true }
    } catch (error) {
      toast.error('Failed to delete donation')
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const getUnassignedDonations = () => {
    return donations.filter(d => !d.ngoId)
  }

  const schedulePickup = async ({ donationId, ngoId, pickupDate, pickupTime }) => {
    try {
      setLoading(true)
      const updates = { ngoId, pickupDate, pickupTime, status: 'in_transit' }
      const res = await fetch(`/api/donations/${donationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      const api = await res.json()
      if (!api.success) throw new Error('Failed to schedule pickup')
      const updated = api.donation
      setDonations(prev => prev.map(d => (d.id === donationId ? updated : d)))
      toast.success('Pickup scheduled and NGO assigned')
      return { success: true, donation: updated }
    } catch (error) {
      toast.error('Failed to schedule pickup')
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const createRequest = async (requestData) => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newRequest = {
        id: Date.now(),
        ...requestData,
        status: 'active',
        currentQuantity: 0,
        createdAt: new Date().toISOString(),
      }
      
      setRequests(prev => [newRequest, ...prev])
      // Notify donors who have pending donations that may match this request
      try {
        const candidateDonations = donations.filter(d => d.status === 'pending')
        const notifiedDonors = new Set()
        for (const d of candidateDonations) {
          const hasMatch = (d.items || []).some(item => {
            const name = (item.name || '').toLowerCase()
            const category = (item.category || '').toLowerCase()
            const title = (newRequest.title || '').toLowerCase()
            const description = (newRequest.description || '').toLowerCase()
            return (newRequest.category && category === String(newRequest.category).toLowerCase())
              || (title && name && title.includes(name))
              || (description && name && description.includes(name))
          })
          if (hasMatch && d.donorId) {
            notifiedDonors.add(d.donorId)
          }
        }
        notifiedDonors.forEach(donorId => {
          addNotification({
            userId: donorId,
            type: 'request_match',
            title: 'An NGO needs items you can provide',
            message: `${(requestData.title || 'A request')} may match your donation items.`,
            meta: { requestId: newRequest.id, ngoId: newRequest.ngoId },
          })
        })
      } catch (_) { /* noop */ }
      toast.success('Request created successfully!')
      return { success: true, request: newRequest }
    } catch (error) {
      toast.error('Failed to create request. Please try again.')
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const updateRequest = (requestId, updates) => {
    setRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { ...request, ...updates, updatedAt: new Date().toISOString() }
          : request
      )
    )
    toast.success('Request updated')
  }

  const getNGOById = (id) => {
    return ngos.find(ngo => ngo.id === parseInt(id))
  }

  // NGO keywords management (what items they collect)
  const updateNGOKeywords = (ngoId, keywords) => {
    setNgoKeywordsById(prev => ({ ...prev, [ngoId]: keywords }))
    toast.success('Collection keywords updated')
  }

  const getDonationsByUser = (userId) => {
    return donations.filter(donation => donation.donorId === userId)
  }

  const getRequestsByNGO = (ngoId) => {
    return requests.filter(request => request.ngoId === ngoId)
  }

  const getNGOsByCategory = (category) => {
    if (!category) return ngos
    return ngos.filter(ngo => ngo.category === category)
  }

  const searchNGOs = (query) => {
    if (!query) return ngos
    return ngos.filter(ngo => 
      ngo.name.toLowerCase().includes(query.toLowerCase()) ||
      ngo.description.toLowerCase().includes(query.toLowerCase()) ||
      ngo.location.toLowerCase().includes(query.toLowerCase())
    )
  }

  // Feedback API (publicly readable, submission requires login at UI level)
  const createFeedback = async (feedbackData) => {
    try {
      setLoading(true)
      await new Promise(r => setTimeout(r, 500))
      const newFeedback = {
        id: Date.now(),
        ...feedbackData,
        createdAt: new Date().toISOString(),
      }
      setFeedbacks(prev => [newFeedback, ...prev])
      toast.success('Thanks for your feedback!')
      return { success: true, feedback: newFeedback }
    } catch (e) {
      toast.error('Failed to submit feedback. Please try again.')
      return { success: false, error: e.message }
    } finally {
      setLoading(false)
    }
  }

  const getAllFeedbacks = () => feedbacks

  // Notifications API
  const addNotification = ({ userId, type, title, message, meta }) => {
    const note = {
      id: Date.now() + Math.random(),
      userId,
      type,
      title,
      message,
      meta: meta || {},
      read: false,
      createdAt: new Date().toISOString(),
    }
    setNotifications(prev => [note, ...prev])
  }

  const getNotificationsByUser = (userId) => {
    return notifications.filter(n => n.userId === userId)
  }

  const markNotificationRead = (notificationId) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n))
  }

  // Donor accepts a request (pledge)
  const acceptRequest = (requestId, donorId) => {
    const request = requests.find(r => r.id === requestId)
    if (!request) return
    // Minimal serverless update: keep status, just notify NGO
    addNotification({
      userId: request.ngoId,
      type: 'request_accepted',
      title: 'A donor pledged to your request',
      message: 'A donor has accepted to fulfill part of your request.',
      meta: { requestId, donorId },
    })
    toast.success('You have accepted this request. The NGO has been notified.')
  }

  const createUsageReport = async (reportData) => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newReport = {
        id: Date.now(),
        ...reportData,
        createdAt: new Date().toISOString(),
      }
      
      setUsageReports(prev => [newReport, ...prev])
      toast.success('Usage report created successfully!')
      return { success: true, report: newReport }
    } catch (error) {
      toast.error('Failed to create usage report. Please try again.')
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const getUsageReportsByNGO = (ngoId) => {
    return usageReports.filter(report => report.ngoId === ngoId)
  }

  const getUsageReportsByDonation = (donationId) => {
    return usageReports.filter(report => report.donationId === donationId)
  }

  const value = {
    ngos,
    donations,
    requests,
    usageReports,
    notifications,
    ngoKeywordsById,
    feedbacks,
    loading,
    createDonation,
    updateDonationStatus,
    updateDonation,
    deleteDonation,
    getUnassignedDonations,
    schedulePickup,
    createRequest,
    updateRequest,
    acceptRequest,
    addNotification,
    getNotificationsByUser,
    markNotificationRead,
    updateNGOKeywords,
    createFeedback,
    getAllFeedbacks,
    createUsageReport,
    getNGOById,
    getDonationsByUser,
    getRequestsByNGO,
    getUsageReportsByNGO,
    getUsageReportsByDonation,
    getNGOsByCategory,
    searchNGOs,
  }

  return (
    <DonationContext.Provider value={value}>
      {children}
    </DonationContext.Provider>
  )
}
