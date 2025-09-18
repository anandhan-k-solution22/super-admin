"use client"

import Sidebar from "./sidebar"
import { InitialSidebarNav } from "./initial-sidebar-nav"

interface CombinedDashboardLayoutProps {
  children: React.ReactNode
}

export function CombinedDashboardLayout({ children }: CombinedDashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-slate-50 pt-2">
      {/* Initial Sidebar - Always visible */}
      <div className="hidden md:flex">
        <InitialSidebarNav />
      </div>
      {/* Nested Sidebar - For app-specific navigation */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col bg-white">
        <div className="md:hidden border-b p-4 bg-white">
          <InitialSidebarNav />
        </div>
        <div className="md:hidden border-b p-4 bg-white">
          <Sidebar />
        </div>
        <main className="flex-1 p-6 bg-white overflow-hidden">
          <div className="h-full overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}



