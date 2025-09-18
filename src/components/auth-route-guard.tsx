"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuthStore } from '@/app/_stores/admin/authStore'

interface AuthRouteGuardProps {
  children: React.ReactNode
}

export default function AuthRouteGuard({ children }: AuthRouteGuardProps) {
  const { admin, initializeAuth, loading, validateAuth } = useAdminAuthStore()
  const router = useRouter()

  useEffect(() => {
    // Initialize auth on component mount
    initializeAuth()
  }, [initializeAuth])

  useEffect(() => {
    // Check authentication status and redirect if not authenticated
    if (!loading && !validateAuth()) {
      router.push('/sign-in')
    }
  }, [validateAuth, loading, router])

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render children if not authenticated
  if (!validateAuth() || !admin) {
    return null
  }

  // Render children if authenticated
  return <>{children}</>
}
