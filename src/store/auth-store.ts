import { create } from 'zustand'
import { supabase, UserProfile, AuthUser } from '../lib/supabase'
import { User } from '@supabase/supabase-js'

interface AuthState {
  user: AuthUser | null
  profile: UserProfile | null
  loading: boolean
  error: string | null
  
  // Auth actions
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  
  // Profile actions
  createProfile: (profileData: Omit<UserProfile, 'id' | 'created_at' | 'updated_at' | 'credits'>) => Promise<{ success: boolean; error?: string }>
  updateProfile: (profileData: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>
  loadProfile: () => Promise<void>
  
  // Credits actions
  updateCredits: (amount: number) => Promise<{ success: boolean; error?: string }>
  
  // Utility actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  error: null,

  signUp: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null })
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        set({ error: error.message, loading: false })
        return { success: false, error: error.message }
      }

      if (data.user) {
        set({ user: { id: data.user.id, email: data.user.email! }, loading: false })
        return { success: true }
      }

      return { success: false, error: 'Unknown error occurred' }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      set({ error: errorMessage, loading: false })
      return { success: false, error: errorMessage }
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null })
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        set({ error: error.message, loading: false })
        return { success: false, error: error.message }
      }

      if (data.user) {
        const authUser = { id: data.user.id, email: data.user.email! }
        set({ user: authUser, loading: false })
        await get().loadProfile()
        return { success: true }
      }

      return { success: false, error: 'Unknown error occurred' }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      set({ error: errorMessage, loading: false })
      return { success: false, error: errorMessage }
    }
  },

  signOut: async () => {
    try {
      set({ loading: true })
      await supabase.auth.signOut()
      set({ user: null, profile: null, loading: false, error: null })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      set({ error: errorMessage, loading: false })
    }
  },

  createProfile: async (profileData) => {
    try {
      const { user } = get()
      if (!user) {
        return { success: false, error: 'No authenticated user' }
      }

      set({ loading: true, error: null })
      
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          ...profileData,
          credits: 100, // Default credits
        })
        .select()
        .single()

      if (error) {
        set({ error: error.message, loading: false })
        return { success: false, error: error.message }
      }

      set({ profile: data, loading: false })
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      set({ error: errorMessage, loading: false })
      return { success: false, error: errorMessage }
    }
  },

  updateProfile: async (profileData) => {
    try {
      const { user } = get()
      if (!user) {
        return { success: false, error: 'No authenticated user' }
      }

      set({ loading: true, error: null })
      
      const { data, error } = await supabase
        .from('user_profiles')
        .update(profileData)
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        set({ error: error.message, loading: false })
        return { success: false, error: error.message }
      }

      set({ profile: data, loading: false })
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      set({ error: errorMessage, loading: false })
      return { success: false, error: errorMessage }
    }
  },

  loadProfile: async () => {
    try {
      const { user } = get()
      if (!user) return

      set({ loading: true, error: null })
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        set({ error: error.message, loading: false })
        return
      }

      set({ profile: data || null, loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      set({ error: errorMessage, loading: false })
    }
  },

  updateCredits: async (amount: number) => {
    try {
      const { user, profile } = get()
      if (!user || !profile) {
        return { success: false, error: 'No authenticated user or profile' }
      }

      const newCredits = profile.credits + amount
      if (newCredits < 0) {
        return { success: false, error: 'Insufficient credits' }
      }

      return await get().updateProfile({ credits: newCredits })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return { success: false, error: errorMessage }
    }
  },

  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),

  initialize: async () => {
    try {
      set({ loading: true })
      
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        const authUser = { id: session.user.id, email: session.user.email! }
        set({ user: authUser })
        await get().loadProfile()
      }
      
      set({ loading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      set({ error: errorMessage, loading: false })
    }
  },
}))