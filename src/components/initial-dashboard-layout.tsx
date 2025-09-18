"use client"

import { InitialSidebarNav } from "./initial-sidebar-nav"

interface InitialDashboardLayoutProps {
  children: React.ReactNode
}

export function InitialDashboardLayout({ children }: InitialDashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-slate-50 pt-2">
      <div className="hidden md:flex">
        <InitialSidebarNav />
      </div>
      <div className="flex-1 flex flex-col bg-white">
        <div className="md:hidden border-b p-4 bg-white">
          <InitialSidebarNav />
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
