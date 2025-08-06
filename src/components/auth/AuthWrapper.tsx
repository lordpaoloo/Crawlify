import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/auth-store'
import { SignInForm } from './SignInForm'
import { SignUpForm } from './SignUpForm'
import { UserProfile } from './UserProfile'
import { useThemeStore } from '../../lib/theme'

interface AuthWrapperProps {
  children: React.ReactNode
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { user, profile, loading, initialize } = useAuthStore()
  const isDarkMode = useThemeStore(state => state.isDarkMode)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [showProfile, setShowProfile] = useState(false)

  useEffect(() => {
    initialize()
  }, [])

  // Show loading spinner while initializing
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-200 ${
        isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-[#fcfbf7] text-slate-900'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9C83FF] mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is authenticated and has a profile, show the main app
  if (user && profile && !showProfile) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${
        isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-[#fcfbf7] text-slate-900'
      }`}>
        {/* User info bar */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <img src="/logo.png" alt="Crawlify" className="w-8 h-8" />
                  <span className="font-bold text-lg bg-gradient-to-r from-[#9C83FF] to-[#FF9051] bg-clip-text text-transparent">
                    Crawlify
                  </span>
                </div>
                <div className="hidden sm:block text-sm text-gray-600 dark:text-gray-400">
                  Welcome back, {profile.first_name}!
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-gradient-to-r from-[#9C83FF] to-[#FF9051] text-white px-3 py-1 rounded-full text-sm">
                  <span className="font-medium">{profile.credits} Credits</span>
                </div>
                <button
                  onClick={() => setShowProfile(true)}
                  className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-[#9C83FF] to-[#FF9051] rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {profile.first_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium">
                    {profile.first_name} {profile.last_name}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main app content */}
        {children}
      </div>
    )
  }

  // If user is authenticated but showing profile
  if (user && profile && showProfile) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${
        isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-[#fcfbf7] text-slate-900'
      }`}>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-6">
              <button
                onClick={() => setShowProfile(false)}
                className="flex items-center gap-2 text-[#9C83FF] hover:text-[#FF9051] transition-colors"
              >
                ← Back to App
              </button>
            </div>
            <UserProfile />
          </div>
        </div>
      </div>
    )
  }

  // If user is authenticated but no profile, they need to complete registration
  if (user && !profile) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-200 ${
        isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-[#fcfbf7] text-slate-900'
      }`}>
        <div className="w-full max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#9C83FF] to-[#FF9051] bg-clip-text text-transparent">
              Complete Your Profile
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Please complete your profile to continue
            </p>
          </div>
          {/* Show step 2 of signup form */}
          <SignUpForm 
            onSuccess={() => window.location.reload()} 
            onSwitchToSignIn={() => {}} 
          />
        </div>
      </div>
    )
  }

  // Show authentication forms
  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-200 ${
      isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-[#fcfbf7] text-slate-900'
    }`}>
      <div className="w-full max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/logo.png" alt="Crawlify Icon" className="w-12 h-12" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#9C83FF] to-[#FF9051] bg-clip-text text-transparent">
              Crawlify
            </h1>
          </div>
          <p className="text-lg bg-gradient-to-r from-[#9C83FF] to-[#FF9051] bg-clip-text text-transparent">
            Scraping Made Simple.
          </p>
        </div>

        {authMode === 'signin' ? (
          <SignInForm
            onSuccess={() => window.location.reload()}
            onSwitchToSignUp={() => setAuthMode('signup')}
          />
        ) : (
          <SignUpForm
            onSuccess={() => window.location.reload()}
            onSwitchToSignIn={() => setAuthMode('signin')}
          />
        )}
      </div>
    </div>
  )
}