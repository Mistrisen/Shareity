import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useDonation } from '../../contexts/DonationContext'
import { 
  Heart, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  User, 
  LogOut, 
  Settings,
  Search,
  Bell,
  Check
} from 'lucide-react'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchText, setSearchText] = useState('')
  const userInitial = ((user?.name || user?.email || 'U').trim().charAt(0) || 'U').toUpperCase()

  useEffect(() => {
    const q = new URLSearchParams(location.search).get('q') || ''
    setSearchText(q)
  }, [location.search])

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsProfileOpen(false)
  }

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Browse NGOs', path: '/browse-ngos' },
    { name: 'NGO Needs', path: '/needs' },
  ]

  const donorNavItems = [
    { name: 'Dashboard', path: '/donor/dashboard' },
    { name: 'Donate', path: '/donor/donate' },
    { name: 'History', path: '/donor/history' },
    { name: 'Impact', path: '/donor/impact' },
  ]

  const ngoNavItems = [
    { name: 'Dashboard', path: '/ngo/dashboard' },
    { name: 'Post Needs', path: '/ngo/needs' },
    { name: 'Usage Tracking', path: '/ngo/usage-tracking' },
    { name: 'Inventory', path: '/ngo/inventory' },
    { name: 'Reports', path: '/ngo/beneficiaries' },
  ]

  const getNavItems = () => {
    if (!isAuthenticated) return navItems
    return user?.role === 'donor' ? donorNavItems : ngoNavItems
  }

  const isActivePath = (path) => {
    return location.pathname === path
  }

  const { getNotificationsByUser, markNotificationRead } = useDonation()
  const notifications = isAuthenticated ? getNotificationsByUser(user?.id) : []

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 min-w-0">
            <img
              src="/logo.png"
              alt="Shareity"
              className="w-8 h-8 rounded object-contain"
              onError={(e) => {
                const target = e.currentTarget
                const stage = target.getAttribute('data-fallback') || '0'
                if (stage === '0') {
                  target.setAttribute('data-fallback', '1')
                  target.src = '/logo.jpg'
                } else if (stage === '1') {
                  target.setAttribute('data-fallback', '2')
                  target.src = '/logo.svg'
                } else {
                  target.style.display = 'none'
                }
              }}
            />
            <span className="hidden sm:inline text-xl font-bold text-gray-900 dark:text-white truncate">Shareity</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 flex-1 overflow-x-auto">
            {getNavItems().map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActivePath(item.path)
                    ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {/* Global Search (only when authenticated) */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const targetPath = user?.role === 'ngo' ? '/ngo/item-search' : '/browse-ngos'
                        navigate(`${targetPath}?q=${encodeURIComponent(searchText.trim())}`)
                      }
                    }}
                    placeholder={user?.role === 'ngo' ? 'Search items...' : 'Search NGOs...'}
                    className="pl-9 pr-3 py-2 w-64 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            )}

            {/* Notifications */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 max-h-96 overflow-auto">
                    <div className="px-4 pb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Notifications</div>
                    {notifications.length === 0 && (
                      <div className="px-4 py-6 text-sm text-gray-500 dark:text-gray-400">No notifications</div>
                    )}
                    {notifications.map(n => (
                      <div key={n.id} className={`px-4 py-3 text-sm ${n.read ? 'text-gray-500' : 'text-gray-800 dark:text-gray-200'} border-t border-gray-100 dark:border-gray-700`}> 
                        <div className="font-semibold">{n.title}</div>
                        <div className="text-xs opacity-80">{n.message}</div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</span>
                          {!n.read && (
                            <button onClick={() => markNotificationRead(n.id)} className="inline-flex items-center text-xs text-primary-600 hover:underline">
                              <Check className="w-3 h-3 mr-1" /> Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-semibold" aria-hidden="true">
                    {userInitial}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[140px] truncate" title={user.name}>
                    {user.name}
                  </span>
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                    <Link
                      to={user.role === 'donor' ? '/donor/dashboard' : '/ngo/dashboard'}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User className="w-4 h-4 mr-3" />
                      Dashboard
                    </Link>
                    <Link
                      to={user.role === 'donor' ? '/donor/profile' : '/ngo/profile'}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Profile Settings
                    </Link>
                    <hr className="my-1 border-gray-200 dark:border-gray-700" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
            <div className="space-y-2">
              {getNavItems().map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActivePath(item.path)
                      ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
