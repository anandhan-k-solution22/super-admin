"use client"

import { useEffect, useMemo } from 'react'
import { useAdminAuthStore } from '@/app/_stores/admin/authStore'
import { useRouter, usePathname } from 'next/navigation'

export default function AuthInitializer() {
  const { initializeAuth, validateAuth, syncAuthState, signOut } = useAdminAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  // Public routes that should never be force-redirected by this initializer
  const isPublicRoute = useMemo(() => {
    const publicPrefixes = ['/sign-in', '/sign-up', '/forgot-password', '/reset-password', '/']
    return publicPrefixes.some((p) => pathname?.startsWith(p))
  }, [pathname])

  useEffect(() => {
    // Initialize authentication on app load
    initializeAuth()

    // Listen for localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' && e.newValue === null) {
        // authToken was removed from localStorage
        signOut()
        if (!isPublicRoute) router.push('/sign-in')
      } else if (e.key === 'admin-auth-storage') {
        // Admin storage changed, sync auth state
        syncAuthState()
      }
    }

    // Listen for storage events (from other tabs)
    window.addEventListener('storage', handleStorageChange)

    // Set up periodic validation (every 30 seconds)
    const validationInterval = setInterval(() => {
      const isValid = validateAuth()
      if (!isValid) {
        signOut()
        if (!isPublicRoute) router.push('/sign-in')
      }
    }, 30000)

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(validationInterval)
    }
  }, [initializeAuth, validateAuth, syncAuthState, signOut, router, isPublicRoute])

  return null // This component doesn't render anything
}
