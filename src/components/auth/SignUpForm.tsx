import React, { useState } from 'react'
import { useAuthStore } from '../../store/auth-store'
import { Eye, EyeOff, User, Mail, Phone, MapPin, Building, Briefcase, Calendar } from 'lucide-react'

interface SignUpFormProps {
  onSuccess: () => void
  onSwitchToSignIn: () => void
}

interface BasicInfo {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  phoneNumber: string
  country: string
}

interface AdditionalInfo {
  age: string
  business: string
  role: string
}

const countries = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Spain', 'Italy',
  'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Japan', 'South Korea', 'Singapore',
  'India', 'Brazil', 'Mexico', 'Argentina', 'Other'
]

const roles = [
  'Developer', 'Designer', 'Product Manager', 'Marketing Manager', 'Sales Representative',
  'Data Analyst', 'Business Analyst', 'Consultant', 'Entrepreneur', 'Student', 'Other'
]

export const SignUpForm: React.FC<SignUpFormProps> = ({ onSuccess, onSwitchToSignIn }) => {
  const { signUp, createProfile, loading, error } = useAuthStore()
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    country: ''
  })
  
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo>({
    age: '',
    business: '',
    role: ''
  })

  const handleBasicInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (basicInfo.password !== basicInfo.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    
    if (basicInfo.password.length < 6) {
      alert('Password must be at least 6 characters long')
      return
    }
    
    const result = await signUp(basicInfo.email, basicInfo.password)
    
    if (result.success) {
      setStep(2)
    } else {
      alert(result.error || 'Failed to create account')
    }
  }

  const handleAdditionalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const profileData = {
      email: basicInfo.email,
      first_name: basicInfo.firstName,
      last_name: basicInfo.lastName,
      phone_number: basicInfo.phoneNumber,
      country: basicInfo.country,
      age: additionalInfo.age ? parseInt(additionalInfo.age) : undefined,
      business: additionalInfo.business || undefined,
      role: additionalInfo.role || undefined
    }
    
    const result = await createProfile(profileData)
    
    if (result.success) {
      onSuccess()
    } else {
      alert(result.error || 'Failed to create profile')
    }
  }

  const updateBasicInfo = (field: keyof BasicInfo, value: string) => {
    setBasicInfo(prev => ({ ...prev, [field]: value }))
  }

  const updateAdditionalInfo = (field: keyof AdditionalInfo, value: string) => {
    setAdditionalInfo(prev => ({ ...prev, [field]: value }))
  }

  if (step === 1) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#9C83FF] to-[#FF9051] bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Step 1: Basic Information
          </p>
        </div>

        <form onSubmit={handleBasicInfoSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <User className="inline w-4 h-4 mr-2" />
                First Name *
              </label>
              <input
                type="text"
                required
                value={basicInfo.firstName}
                onChange={(e) => updateBasicInfo('firstName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#9C83FF] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                <User className="inline w-4 h-4 mr-2" />
                Last Name *
              </label>
              <input
                type="text"
                required
                value={basicInfo.lastName}
                onChange={(e) => updateBasicInfo('lastName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#9C83FF] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <Mail className="inline w-4 h-4 mr-2" />
              Email Address *
            </label>
            <input
              type="email"
              required
              value={basicInfo.email}
              onChange={(e) => updateBasicInfo('email', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#9C83FF] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <Phone className="inline w-4 h-4 mr-2" />
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={basicInfo.phoneNumber}
              onChange={(e) => updateBasicInfo('phoneNumber', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#9C83FF] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              <MapPin className="inline w-4 h-4 mr-2" />
              Country *
            </label>
            <select
              required
              value={basicInfo.country}
              onChange={(e) => updateBasicInfo('country', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#9C83FF] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">Select your country</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={basicInfo.password}
                onChange={(e) => updateBasicInfo('password', e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#9C83FF] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Enter your password"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={basicInfo.confirmPassword}
                onChange={(e) => updateBasicInfo('confirmPassword', e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#9C83FF] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Confirm your password"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#9C83FF] to-[#FF9051] text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Continue to Step 2'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={onSwitchToSignIn}
              className="text-[#9C83FF] hover:text-[#FF9051] transition-colors"
            >
              Already have an account? Sign in
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#9C83FF] to-[#FF9051] bg-clip-text text-transparent">
          Almost Done!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Step 2: Additional Information (Optional)
        </p>
      </div>

      <form onSubmit={handleAdditionalInfoSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            <Calendar className="inline w-4 h-4 mr-2" />
            Age
          </label>
          <input
            type="number"
            min="13"
            max="120"
            value={additionalInfo.age}
            onChange={(e) => updateAdditionalInfo('age', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#9C83FF] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="25"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            <Building className="inline w-4 h-4 mr-2" />
            Company/Business
          </label>
          <input
            type="text"
            value={additionalInfo.business}
            onChange={(e) => updateAdditionalInfo('business', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#9C83FF] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="Acme Corp"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            <Briefcase className="inline w-4 h-4 mr-2" />
            Role
          </label>
          <select
            value={additionalInfo.role}
            onChange={(e) => updateAdditionalInfo('role', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#9C83FF] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">Select your role</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-[#9C83FF] to-[#FF9051] text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Creating Profile...' : 'Complete Registration'}
          </button>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={onSwitchToSignIn}
            className="text-[#9C83FF] hover:text-[#FF9051] transition-colors"
          >
            Already have an account? Sign in
          </button>
        </div>
      </form>
    </div>
  )
}