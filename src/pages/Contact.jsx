import React from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'

const CONTACT_PHONE = '24324343242'
const CONTACT_EMAIL = 'shareityofficial@gmail.com'

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contact Us</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">We'd love to hear from you. Reach us through the details below.</p>
        </div>

        <div className="card space-y-4">
          <div className="flex items-center text-gray-800 dark:text-gray-100">
            <Phone className="w-5 h-5 mr-3 text-primary-600" />
            <span className="text-sm">{CONTACT_PHONE}</span>
          </div>
          <div className="flex items-center text-gray-800 dark:text-gray-100">
            <Mail className="w-5 h-5 mr-3 text-primary-600" />
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm hover:underline">{CONTACT_EMAIL}</a>
          </div>
          <div className="flex items-start text-gray-600 dark:text-gray-400 text-sm">
            <MapPin className="w-5 h-5 mr-3 text-primary-600" />
            <span>Our team is distributed. For mail correspondence, please reach out via email first.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact


