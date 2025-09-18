"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { useAdminAuthStore } from '@/app/_stores/admin/authStore'

type NavbarType = 'initial' | 'app'

interface NavbarContextType {
  navbarType: NavbarType
  setNavbarType: (type: NavbarType) => void
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined)

// Routes that should show the initial navbar
const initialRoutes = ['/app-lists', '/add-app', '/settings']

// Routes that should show the app navbar
const appRoutes = ['/dashboard', '/analytics', '/reports', '/tasks', '/companies', '/notifications', '/users', '/contacts', '/messages', '/status', '/old', '/app-settings']

export function NavbarProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [navbarType, setNavbarType] = useState<NavbarType>('initial')

  useEffect(() => {
    // Determine navbar type based on current route
    if (initialRoutes.includes(pathname)) {
      setNavbarType('initial')
    } else if (appRoutes.some(route => pathname.startsWith(route))) {
      setNavbarType('app')
    } else {
      // Default to initial for unknown routes
      setNavbarType('initial')
    }
  }, [pathname])

  return (
    <NavbarContext.Provider value={{ navbarType, setNavbarType }}>
      {children}
    </NavbarContext.Provider>
  )
}

export function useNavbar() {
  const context = useContext(NavbarContext)
  if (context === undefined) {
    throw new Error('useNavbar must be used within a NavbarProvider')
  }
  return context
}
