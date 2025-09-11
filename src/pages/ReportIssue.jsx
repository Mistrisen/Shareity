import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { AlertCircle, Send, Mail, Phone } from 'lucide-react'

const SUPPORT_EMAIL = 'sharity.support@gmail.com'
const SUPPORT_PHONE = '235354646'

const ReportIssue = () => {
  const { user } = useAuth()
  const [subject, setSubject] = useState('Issue Report')
  const [description, setDescription] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const bodyLines = [
      `Reported by: ${user?.name || 'Guest'}`,
      user?.email ? `Email: ${user.email}` : '',
      '',
      'Issue Details:',
      description.trim(),
    ].filter(Boolean)

    const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`
    window.location.href = mailto
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Report an Issue</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Tell us what went wrong. We’ll look into it as soon as possible.</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="input-field"
                placeholder="Short summary of the issue"
              />
            </div>

            <div>
              <label className="label">Describe the issue *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-field"
                rows="6"
                placeholder="Steps to reproduce, what you expected, what happened..."
                required
              />
            </div>

            <div className="flex justify-end">
              <button type="submit" className="btn-primary flex items-center">
                <Send className="w-4 h-4 mr-2" />
                Send to Support
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Contact Support</h2>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <div className="flex items-center"><Mail className="w-4 h-4 mr-2" /> {SUPPORT_EMAIL}</div>
            <div className="flex items-center"><Phone className="w-4 h-4 mr-2" /> {SUPPORT_PHONE}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportIssue


