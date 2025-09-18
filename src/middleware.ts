import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/app-lists',
  '/settings',
  '/companies',
  '/users',
  '/analytics',
  '/reports',
  '/tasks',
  '/notifications',
  '/contacts',
  '/add-app',
  '/app-settings'
]

// Define public routes that don't require authentication
const publicRoutes = [
  '/sign-in',
  '/sign-up',
  '/forgot-password',
  '/reset-password'
]

// Define root route that should redirect authenticated users
const rootRoute = '/'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Get auth token from cookies or localStorage (we'll use cookies for server-side)
  const authToken = request.cookies.get('authToken')?.value
  
  // If accessing a protected route without auth token, redirect to sign-in
  if (isProtectedRoute && !authToken) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }
  
  // Allow authenticated users to stay on login pages if they want to
  // Only redirect if they're trying to access protected routes without auth
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
