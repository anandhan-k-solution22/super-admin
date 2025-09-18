"use client"

import Sidebar from "./sidebar"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-slate-50 p-2">
      {/* App-specific Sidebar Only */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col bg-white min-w-0">
        <div className="md:hidden border-b p-4 bg-white">
          <Sidebar />
        </div>
        <div className="border-b bg-white">
          <div className="px-4 py-2 flex justify-end">
            <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </div>
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
