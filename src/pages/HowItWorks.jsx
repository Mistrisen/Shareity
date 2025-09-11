import React from 'react'
import { Heart, Users, Package, CheckCircle, Bell, Camera, ArrowRight } from 'lucide-react'

const StepCard = ({ icon: Icon, title, children }) => (
  <div className="card">
    <div className="flex items-start">
      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center mr-4">
        <Icon className="w-6 h-6 text-primary-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <div className="text-gray-600 dark:text-gray-400 text-sm">
          {children}
        </div>
      </div>
    </div>
  </div>
)

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">How Shareity Works</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">A simple way for donors and NGOs to connect, fulfill needs, and track real impact.</p>
        </div>

        {/* Two Tracks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div className="card">
            <div className="flex items-center mb-2">
              <Heart className="w-5 h-5 text-red-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">For Donors</h2>
            </div>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 text-sm space-y-2">
              <li>Browse NGOs or open Needs at "NGO Needs".</li>
              <li>Click Donate or Accept a Request to pledge support.</li>
              <li>Fill the donation form with items, pickup details, and notes.</li>
              <li>Track your donation status and see impact reports with photos/videos.</li>
            </ul>
          </div>

          <div className="card">
            <div className="flex items-center mb-2">
              <Users className="w-5 h-5 text-blue-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">For NGOs</h2>
            </div>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 text-sm space-y-2">
              <li>Post your Needs with title, category, and urgency.</li>
              <li>Set collection keywords to auto-notify you of matching donations.</li>
              <li>Search donated items, manage inventory, and update statuses.</li>
              <li>Create Usage Reports with images/videos to thank donors.</li>
            </ul>
          </div>
        </div>

        {/* Step-by-step */}
        <div className="space-y-4">
          <StepCard icon={Package} title="1. Post Needs or Make a Donation">
            NGOs post specific needs; donors submit items via the donation form. Smart matching connects donations to relevant needs.
          </StepCard>
          <StepCard icon={Bell} title="2. Get Matched and Notified">
            Donors are notified when new requests match their items. NGOs are notified when donations match requests or keywords.
          </StepCard>
          <StepCard icon={CheckCircle} title="3. Accept and Coordinate">
            Donors can accept a request. Pickup details and statuses (pending, in transit, delivered) help coordinate logistics.
          </StepCard>
          <StepCard icon={Camera} title="4. Share Impact with Media">
            NGOs publish usage reports with photos/videos showing exactly how donations were used and who benefited.
          </StepCard>
          <StepCard icon={Heart} title="5. Track Your Impact">
            Donors view consolidated impact on their dashboard and Impact Reports, including media from NGOs.
          </StepCard>
        </div>

        {/* CTA */}
        <div className="mt-10 card bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-2xl font-semibold mb-1">Ready to start?</h3>
              <p className="opacity-90">Join as a donor or NGO and make a difference today.</p>
            </div>
            <div className="flex gap-3">
              <a href="/register" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center">
                Get Started <ArrowRight className="w-4 h-4 ml-2" />
              </a>
              <a href="/needs" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-2 px-4 rounded-lg transition-all duration-300">
                View NGO Needs
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HowItWorks


