"use client"

import { InitialSidebarNav } from "./initial-sidebar-nav"
import Sidebar from "./sidebar"
import { useNavbar } from "@/contexts/navbar-context"
import { useSidebarStore } from "../app/_stores/admin/settingsStore"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface DynamicDashboardLayoutProps {
  children: React.ReactNode
}

export function DynamicDashboardLayout({ children }: DynamicDashboardLayoutProps) {
  const { navbarType } = useNavbar()
  const { collapsed } = useSidebarStore()

  return (
    <div className="h-screen bg-slate-50 p-4 overflow-hidden">
      <div className="flex h-full bg-slate-50 gap-2">
        {/* Conditional Sidebar Rendering */}
        <div className="hidden md:flex">
          {navbarType === 'initial' ? <InitialSidebarNav /> : <Sidebar />}
        </div>
        
        <div className="flex-1 flex flex-col bg-white min-w-0">
          {/* Mobile Navigation */}
          <div className="md:hidden border-b p-4 bg-white">
            {navbarType === 'initial' ? <InitialSidebarNav /> : <Sidebar />}
          </div>
          
          
          <main className="flex-1 p-0 bg-white overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

