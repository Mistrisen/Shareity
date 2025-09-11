import React, { useMemo, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useDonation } from '../contexts/DonationContext'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, Star, Send } from 'lucide-react'

const Feedback = () => {
  const { isAuthenticated, user } = useAuth()
  const { getAllFeedbacks, createFeedback, loading } = useDonation()
  const navigate = useNavigate()

  const allFeedbacks = getAllFeedbacks()
  const [text, setText] = useState('')
  const [rating, setRating] = useState(5)

  const canSubmit = isAuthenticated && text.trim().length >= 10

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (!canSubmit) return
    await createFeedback({
      userId: user.id,
      userName: user.name,
      rating,
      text: text.trim(),
    })
    setText('')
    setRating(5)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Community Feedback</h1>
          <p className="text-gray-600 dark:text-gray-400">Read public feedback from our community. Share your thoughts to help us improve.</p>
        </div>

        {/* Submit box (shows login redirect if not authenticated) */}
        <div className="card mb-8">
          <div className="flex items-center mb-4">
            <MessageCircle className="w-5 h-5 text-primary-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Share your feedback</h2>
          </div>

          {!isAuthenticated ? (
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              Please <a href="/login" className="text-primary-600 hover:underline">log in</a> to submit feedback. You can still read feedback below.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Your Feedback *</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows="4"
                  className="input-field"
                  placeholder="Tell us what you like or what we can improve (min 10 chars)"
                  required
                />
              </div>
              <div>
                <label className="label">Rating</label>
                <div className="flex items-center space-x-2">
                  {[1,2,3,4,5].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${rating >= n ? 'text-yellow-400' : 'text-gray-400'}`}
                    >
                      <Star className="w-5 h-5" />
                    </button>
                  ))}
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">{rating}/5</span>
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" disabled={!canSubmit || loading} className="btn-primary flex items-center">
                  <Send className="w-4 h-4 mr-2" />
                  {loading ? 'Submitting...' : 'Post Feedback'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Public list */}
        <div className="space-y-4">
          {allFeedbacks.length > 0 ? (
            allFeedbacks.map(fb => (
              <div key={fb.id} className="card">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-semibold text-gray-900 dark:text-white">{fb.userName || 'User'}</div>
                  <div className="flex items-center">
                    {[1,2,3,4,5].map(n => (
                      <Star key={n} className={`w-4 h-4 ${n <= fb.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{new Date(fb.createdAt).toLocaleString()}</div>
                <p className="text-gray-700 dark:text-gray-300">{fb.text}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-600 dark:text-gray-400">No feedback yet. Be the first to share!</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Feedback


