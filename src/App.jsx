import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { DonationProvider } from './contexts/DonationContext'

// Layout Components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DonorDashboard from './pages/donor/DonorDashboard'
import DonorProfile from './pages/donor/DonorProfile'
import NGODashboard from './pages/ngo/NGODashboard'
import BrowseNGOs from './pages/donor/BrowseNGOs'
import DonationForm from './pages/donor/DonationForm'
import DonationHistory from './pages/donor/DonationHistory'
import ImpactReports from './pages/donor/ImpactReports'
import NGOProfile from './pages/ngo/NGOProfile'
import RequestManagement from './pages/ngo/RequestManagement'
import InventoryTracking from './pages/ngo/InventoryTracking'
import BeneficiaryReports from './pages/ngo/BeneficiaryReports'
import DonationUsageTracking from './pages/ngo/DonationUsageTracking'
import NGONeedsPage from './pages/ngo/NGONeedsPage'
import DonorNeedsView from './pages/DonorNeedsView'
import ItemSearch from './pages/ngo/ItemSearch'
import HowItWorks from './pages/HowItWorks'
import Feedback from './pages/Feedback'
import ReportIssue from './pages/ReportIssue'
import Contact from './pages/Contact'
import ProtectedRoute from './components/auth/ProtectedRoute'
import FAQ from './pages/FAQ'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DonationProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
              <Navbar />
              <main className="pt-16 flex-1">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/browse-ngos" element={<BrowseNGOs />} />
                  <Route path="/needs" element={<DonorNeedsView />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/feedback" element={<Feedback />} />
                  <Route path="/report" element={
                    <ProtectedRoute>
                      <ReportIssue />
                    </ProtectedRoute>
                  } />
                  <Route path="/contact" element={<Contact />} />
                  
                  {/* Donor Routes */}
                  <Route path="/donor/dashboard" element={
                    <ProtectedRoute role="donor">
                      <DonorDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/donor/donate" element={
                    <ProtectedRoute role="donor">
                      <DonationForm />
                    </ProtectedRoute>
                  } />
                  <Route path="/donor/history" element={
                    <ProtectedRoute role="donor">
                      <DonationHistory />
                    </ProtectedRoute>
                  } />
                  <Route path="/donor/impact" element={
                    <ProtectedRoute role="donor">
                      <ImpactReports />
                    </ProtectedRoute>
                  } />
                  <Route path="/donor/profile" element={
                    <ProtectedRoute role="donor">
                      <DonorProfile />
                    </ProtectedRoute>
                  } />
                  
                  {/* NGO Routes */}
                  <Route path="/ngo/dashboard" element={
                    <ProtectedRoute role="ngo">
                      <NGODashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/ngo/profile" element={
                    <ProtectedRoute role="ngo">
                      <NGOProfile />
                    </ProtectedRoute>
                  } />
                  <Route path="/ngo/requests" element={
                    <ProtectedRoute role="ngo">
                      <RequestManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="/ngo/inventory" element={
                    <ProtectedRoute role="ngo">
                      <InventoryTracking />
                    </ProtectedRoute>
                  } />
                  <Route path="/ngo/beneficiaries" element={
                    <ProtectedRoute role="ngo">
                      <BeneficiaryReports />
                    </ProtectedRoute>
                  } />
                  <Route path="/ngo/usage-tracking" element={
                    <ProtectedRoute role="ngo">
                      <DonationUsageTracking />
                    </ProtectedRoute>
                  } />
                  <Route path="/ngo/needs" element={
                    <ProtectedRoute role="ngo">
                      <NGONeedsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/ngo/item-search" element={
                    <ProtectedRoute role="ngo">
                      <ItemSearch />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
              <Footer />
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                }}
              />
            </div>
          </Router>
        </DonationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
