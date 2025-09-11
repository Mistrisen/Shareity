import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Heart, 
  Users, 
  Globe, 
  Award, 
  ArrowRight, 
  CheckCircle,
  Star,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram
} from 'lucide-react'

const LandingPage = () => {
  const { user, isAuthenticated } = useAuth()
  const stats = [
    { label: 'Lives Impacted', value: '0', icon: Users },
    { label: 'NGOs Connected', value: '0', icon: Globe },
    { label: 'Donations Made', value: '0', icon: Heart },
    { label: 'Countries Reached', value: '0', icon: Award },
  ]

  const features = [
    {
      title: 'Easy Donation Process',
      description: 'Simple and secure donation process with real-time tracking',
      icon: Heart,
    },
    {
      title: 'Verified NGOs',
      description: 'All NGOs are thoroughly verified to ensure your donations reach the right people',
      icon: CheckCircle,
    },
    {
      title: 'Impact Tracking',
      description: 'See exactly how your donations are making a difference in real-time',
      icon: Award,
    },
    {
      title: 'Global Reach',
      description: 'Connect with NGOs worldwide and make a global impact',
      icon: Globe,
    },
  ]

  const testimonials = [
    {
      name: 'Ananya Rao',
      role: 'Donor from Bengaluru',
      rating: 5,
      avatar: 'https://i.pravatar.cc/80?img=32',
      content: 'I finally found a simple way to give what I don\'t use to people who truly need it. Seeing the impact made my week.'
    },
    {
      name: 'Hope Hands Foundation',
      role: 'NGO Partner',
      rating: 5,
      avatar: 'https://i.pravatar.cc/80?img=12',
      content: 'Donations arrive organised and on time. It helps us focus on families instead of logistics.'
    },
    {
      name: 'Vikram Singh',
      role: 'First-time Donor',
      rating: 4,
      avatar: 'https://i.pravatar.cc/80?img=5',
      content: 'The process was surprisingly easy. Pick-up was smooth and I got an update when items were delivered.'
    }
  ]

  const categories = [
    { name: 'Food & Nutrition', icon: '🍽️', count: 0 },
    { name: 'Education', icon: '📚', count: 0 },
    { name: 'Healthcare', icon: '🏥', count: 0 },
    { name: 'Clothing', icon: '👕', count: 0 },
    { name: 'Shelter', icon: '🏠', count: 0 },
    { name: 'Emergency Relief', icon: '🚨', count: 0 },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Connecting Hearts,
                  <span className="block text-yellow-300">Changing Lives</span>
                </h1>
                <p className="text-xl lg:text-2xl text-gray-100 max-w-2xl">
                  Join thousands of donors and NGOs working together to make a meaningful impact in communities worldwide.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to={isAuthenticated ? (user?.role === 'donor' ? '/donor/dashboard' : '/ngo/dashboard') : '/register'}
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg"
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Start Donating'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/browse-ngos"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors duration-200"
                >
                  Browse NGOs
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-6 pt-8">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-sm">Verified NGOs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-sm">Secure Donations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-sm">Impact Tracking</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-center">Make a Difference Today</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {stats.slice(0, 4).map((stat, index) => {
                      const Icon = stat.icon
                      return (
                        <div key={index} className="text-center">
                          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="text-2xl font-bold">{stat.value}</div>
                          <div className="text-sm text-gray-200">{stat.label}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Shareity?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              We make it easy for donors to connect with verified NGOs and track the impact of their sharing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="card text-center hover:shadow-lg transition-shadow duration-200">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Support Causes You Care About
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Browse NGOs by category and find the perfect match for your charitable goals.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to="/browse-ngos"
                className="group card text-center hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {category.count} NGOs
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Community Says
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Hear from donors and NGOs who are making a difference through our platform.
            </p>
          </div>

          {testimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="card">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Be the First to Share Your Story
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Join our community and help us build a collection of inspiring stories about making a difference.
              </p>
              <Link
                to={isAuthenticated ? (user?.role === 'donor' ? '/donor/dashboard' : '/ngo/dashboard') : '/register'}
                className="btn-primary"
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 text-gray-100">
            Join thousands of people who are already making an impact. Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={isAuthenticated ? (user?.role === 'donor' ? '/donor/dashboard' : '/ngo/dashboard') : '/register'}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/browse-ngos"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors duration-200"
            >
              Explore NGOs
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
