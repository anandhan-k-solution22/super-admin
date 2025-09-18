"use client"

import { useAdminAuthStore } from "@/app/_stores/admin/authStore"
import { DynamicDashboardLayout } from "./dynamic-dashboard-layout"
import { usePathname } from "next/navigation"

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const { admin, loading } = useAdminAuthStore()
  const pathname = usePathname()

  // Routes that should NOT show navbar (only login/auth pages)
  const noNavbarRoutes = [
    '/', // Root page (login page)
    '/sign-in', 
    '/sign-up', 
    '/forgot-password', 
    '/reset-password'
  ]
  
  // Show navbar for all app directory routes except login/auth pages
  // Always hide navbar for auth pages, regardless of authentication status
  const shouldShowNavbar = !noNavbarRoutes.includes(pathname)

  if (loading) {
    // Show loading state or just the children without navbar
    return <div className="min-h-screen">{children}</div>
  }

  if (shouldShowNavbar) {
    return (
      <DynamicDashboardLayout>
        {children}
      </DynamicDashboardLayout>
    )
  }

  // Show children without navbar (for auth pages only)
  return <div className="min-h-screen">{children}</div>
}
