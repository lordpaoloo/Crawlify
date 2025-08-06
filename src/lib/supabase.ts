import { createClient } from '@supabase/supabase-js'

// Supabase configuration - can use environment variables or hardcoded values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mhyctpwneumaxxpzzaty.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oeWN0cHduZXVtYXh4cHp6YXR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NTg1MjQsImV4cCI6MjA2OTQzNDUyNH0.BT-CnP-dMKSzuK6dgjv3gDHLNm7Q-kPpLbfJ42zeoEc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface UserProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  phone_number: string
  age?: number
  country: string
  business?: string
  role?: string
  credits: number
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email: string
  profile?: UserProfile
}