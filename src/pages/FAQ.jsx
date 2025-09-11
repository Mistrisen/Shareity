import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'How does Shareity work?',
    a: 'Donors add items, NGOs schedule pickup, and you receive updates on delivery and impact. We verify NGOs and keep communication simple.'
  },
  {
    q: 'Is there any cost to donate?',
    a: 'No. Donations are free. Some NGOs may suggest time windows or pickup coordination to keep operations efficient.'
  },
  {
    q: 'What items can I donate?',
    a: 'Common categories include food, clothing, books, electronics, and furniture. Please ensure items are clean, safe, and working.'
  },
  {
    q: 'Can I choose the NGO?',
    a: 'NGOs can claim and schedule donations based on their needs and capacity. This ensures items reach the right beneficiaries promptly.'
  },
]

const FAQ = () => {
  const [open, setOpen] = useState(-1)
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Quick answers to the most common questions from donors and NGOs.</p>

        <div className="space-y-3">
          {faqs.map((f, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
              <button
                className="w-full flex items-center justify-between text-left px-4 py-3"
                onClick={() => setOpen(open === idx ? -1 : idx)}
                aria-expanded={open === idx}
              >
                <span className="font-medium text-gray-900 dark:text-white">{f.q}</span>
                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${open === idx ? 'rotate-180' : ''}`} />
              </button>
              {open === idx && (
                <div className="px-4 pb-4 text-gray-700 dark:text-gray-300">{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FAQ


