"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface Admin {
  id: string
  email: string
  name?: string
  role?: string
  created_at?: string
  updated_at?: string
}

interface AuthState {
  admin: Admin | null
  loading: boolean
  forgotPasswordEmail: string
  signIn: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>
  signUp: (userData: { usercode: string; email: string; password: string }) => Promise<{ success: boolean; error?: string; data?: any }>
  forgotPassword: (credentials: { email: string }) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  initializeAuth: () => Promise<void>
  validateAuth: () => boolean
  syncAuthState: () => void
  setLoading: (loading: boolean) => void
  setForgotPasswordEmail: (email: string) => void
  clearForgotPasswordEmail: () => void
}

export const useAdminAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      admin: null,
      loading: false,
      forgotPasswordEmail: "",
      
      signIn: async ({ email, password }) => {
        set({ loading: true })
        
        try {
          const supabase = createClient()
          const normalizedEmail = (email || '').toLowerCase()
          
          // Custom authentication with your users table
          const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('user_email', normalizedEmail)
            .eq('user_password', password)
            .single()
          
          if (error || !user) {
            set({ loading: false })
            return { success: false, error: 'Invalid email or password' }
          }
          
          const admin: Admin = {
            id: user.id,
            email: (user.user_email || '').toLowerCase(),
            name: user.user_name || 'Admin User',
            role: 'admin',
            created_at: user.created_at,
            updated_at: user.updated_at
          }
          
          set({ admin, loading: false })
          
          // Set auth token cookie for middleware
          const tokenData = {
            userId: admin.id,
            email: admin.email,
            expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
          }
          const token = btoa(JSON.stringify(tokenData))
          document.cookie = `authToken=${token}; path=/; max-age=${24 * 60 * 60}; secure; samesite=strict`
          
          // Also store token in localStorage for easy access
          localStorage.setItem('authToken', token)
          
          return { success: true }
        } catch (error) {
          set({ loading: false })
          return { success: false, error: 'Something went wrong. Please try again.' }
        }
      },
      
      forgotPassword: async ({ email }) => {
        set({ loading: true })
        try {
          const supabase = createClient()
          const normalizedEmail = (email || '').toLowerCase()

          // Ensure the email exists in your custom users table for UX
          const { data: user } = await supabase
            .from('users')
            .select('user_email')
            .eq('user_email', normalizedEmail)
            .maybeSingle()

          if (!user) {
            set({ loading: false })
            return { success: false, error: 'Email not found' }
          }

          // Send Supabase Auth reset email. Make sure your Supabase Project → Authentication → URL settings
          // allow this origin, and set the Site URL accordingly.
          const redirectTo = `${window.location.origin}/reset-password`
          const { error: resetError } = await supabase.auth.resetPasswordForEmail(normalizedEmail, { redirectTo })
          if (resetError) {
            set({ loading: false })
            return { success: false, error: resetError.message }
          }

          set({ loading: false })
          return { success: true }
        } catch (error) {
          set({ loading: false })
          return { success: false, error: 'Something went wrong. Please try again.' }
        }
      },
      
      signOut: async () => {
        try {
          // Clear the local state
          set({ admin: null })
          
          // Clear auth token cookie
          document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
          
          // Clear auth token from localStorage
          localStorage.removeItem('authToken')
        } catch (error) {
          console.error('Error signing out:', error)
          set({ admin: null })
        }
      },

      initializeAuth: async () => {
        try {
          // Validate existing auth state on app initialization
          const isValid = get().validateAuth()
          if (!isValid) {
            get().signOut()
          }
        } catch (error) {
          console.error('Error initializing auth:', error)
          get().signOut()
        }
      },

      validateAuth: () => {
        try {
          const { admin } = get()
          
          // Check if admin exists in store
          if (!admin) {
            return false
          }
          
          // Check if authToken exists in localStorage
          const token = localStorage.getItem('authToken')
          if (!token) {
            return false
          }
          
          // Check if token is expired
          try {
            const tokenData = JSON.parse(atob(token))
            const now = Date.now()
            if (tokenData.expiresAt && now >= tokenData.expiresAt) {
              return false
            }
          } catch (error) {
            return false
          }
          
          return true
        } catch (error) {
          return false
        }
      },

      syncAuthState: () => {
        const { admin } = get()
        const token = localStorage.getItem('authToken')
        
        // If admin exists but no token, or token exists but no admin, sync them
        if (admin && !token) {
          // Admin exists but no token - create token
          const tokenData = {
            userId: admin.id,
            email: admin.email,
            expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
          }
          const newToken = btoa(JSON.stringify(tokenData))
          localStorage.setItem('authToken', newToken)
          document.cookie = `authToken=${newToken}; path=/; max-age=${24 * 60 * 60}; secure; samesite=strict`
        } else if (!admin && token) {
          // Token exists but no admin - clear everything
          get().signOut()
        }
      },

      signUp: async (userData: { usercode: string; email: string; password: string }) => {
        set({ loading: true })
        
        try {
          const supabase = createClient()
          const normalizedEmail = (userData.email || '').toLowerCase()
          
          // Check if user already exists (use maybeSingle to avoid throwing on 0 rows)
          const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('user_email', normalizedEmail)
            .maybeSingle()
          
          if (existingUser) {
            set({ loading: false })
            return { success: false, error: 'User with this email already exists' }
          }
          
          // Create new user (only insert columns that exist)
          const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert([
              {
                user_name: userData.usercode,
                user_email: normalizedEmail,
                user_password: userData.password
              }
            ])
            .select()
            .single()
          
          if (insertError) {
            // Handle unique constraint violation if DB enforces it
            // Postgres error code 23505 => unique_violation
            // Supabase may surface as insertError.code
            if ((insertError as any).code === '23505') {
              set({ loading: false })
              return { success: false, error: 'User with this email already exists' }
            }
            set({ loading: false })
            return { success: false, error: insertError.message }
          }
          
          set({ loading: false })
          return { success: true, data: newUser }
        } catch (error) {
          set({ loading: false })
          return { success: false, error: 'Something went wrong. Please try again.' }
        }
      },
      
      setLoading: (loading) => {
        set({ loading })
      },

      setForgotPasswordEmail: (email) => {
        set({ forgotPasswordEmail: email })
      },

      clearForgotPasswordEmail: () => {
        set({ forgotPasswordEmail: "" })
      }
    }),
    {
      name: 'admin-auth-storage',
      partialize: (state) => ({ admin: state.admin })
    }
  )
)
