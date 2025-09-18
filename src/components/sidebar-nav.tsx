"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Crown,
  FlagTriangleRight,
  Settings,
  FileText,
  LogOut,
  PanelLeft,
  Menu,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { useAdminAuthStore } from "@/app/_stores/admin/authStore"
import { toast } from 'sonner'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Analytics', href: '/analytics', icon: Users },
  { name: 'Companies', href: '/companies', icon: FlagTriangleRight },
  { name: 'Users', href: '/users', icon: ShoppingCart },
  { name: 'Contacts', href: '/contacts', icon: Users },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Server Status', href: '/status', icon: Crown },
  { name: 'Settings', href: '/app-settings', icon: Settings },
]


export function SidebarNav({ className }: { className?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(true)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const { signOut, admin, loading } = useAdminAuthStore()
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)

  const SidebarContentMobile = () => (
    <div className="flex h-full flex-col overflow-hidden">
      <div className='flex flex-col h-full bg-sidebar rounded-lg'>
        <div className="flex h-16 items-center px-3 overflow-hidden ml-0.5">
          <Link href="/">
            <img
              src="/logo.webp"
              alt="logo"
              width={130}
              height={130}
              className="min-w-[130px]"
            />
          </Link>
        </div>
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href) || pathname.includes(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center rounded-lg px-3 pl-2 py-2 text-sm font-medium transition-colors ${isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-primary-hover hover:text-sidebar-accent-foreground'
                  }`}
                onClick={() => setOpen(false)}
              >
                <item.icon
                  className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-sidebar-primary-foreground' : 'text-sidebar-foreground'
                    }`}
                  aria-hidden="true"
                />
                <span className="ml-5 whitespace-nowrap">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="flex-col items-center justify-between space-y-3 whitespace-nowrap overflow-hidden min-w-[20px] px-3 py-4 ml-1">
          <div className='flex items-start justify-start gap-2 cursor-pointer px-1.5' onClick={() => setOpen(false)}>
            <Menu className='w-5 h-5 text-sidebar-primary-foreground min-w-5 min-h-5' />
            <p className='text-sm font-medium text-sidebar-primary-foreground ml-2.5 select-none'>Close</p>
          </div>
          <hr className='w-full border-sidebar-foreground' />
          <div className='flex items-center justify-between gap-2'>
            <div className="flex items-center justify-center gap-2 overflow-hidden min-w-max cursor-pointer" onClick={() => router.push("/profile")}>
              {loading ? (
                <>
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex flex-col overflow-hidden ml-1 gap-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-semibold">{admin?.name?.charAt(0)} {admin?.name?.charAt(1)}</span>
                  </div>
                  <div className="flex flex-col overflow-hidden ml-1">
                    <p className="text-sm font-medium text-sidebar-primary-foreground truncate max-w-[110px]">{admin?.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{admin?.role}</p>
                  </div>
                </>
              )}
            </div>
            <LogOut className="w-8 min-w-8 h-8 min-h-8 text-sidebar-foreground border border-sidebar-foreground rounded-md p-1.5 cursor-pointer hover:text-sidebar-primary-foreground transition-colors duration-300" onClick={() => setShowLogoutDialog(true)} />
          </div>  
        </div>
      </div>
    </div>
  )


  const SidebarContent = () => (
    <div
      className={`flex h-full flex-col overflow-hidden transition-all duration-300 ${isExpanded ? 'w-[265px]' : 'w-21'}`}
    >
      <div className='flex flex-col h-full bg-sidebar rounded-lg'>
        <div className="flex h-16 items-center px-3 overflow-hidden ml-0.5">
          <Link href="/">
            <img
              src="/logo.webp"
              alt="logo"
              width={130}
              height={130}
              className="min-w-[130px]"
            />
          </Link>
        </div>
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href) || pathname.includes(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center rounded-lg px-3 pl-2 py-2 text-sm font-medium transition-colors ${isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-primary-hover hover:text-sidebar-accent-foreground'
                  }`}
              >
                <item.icon
                  className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-sidebar-primary-foreground' : 'text-sidebar-foreground'
                    }`}
                  aria-hidden="true"
                />
                <span className="ml-5 whitespace-nowrap">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="flex-col items-center justify-between space-y-3 whitespace-nowrap overflow-hidden min-w-[20px] px-3 py-4 ml-1">
          <div className='flex items-start justify-start gap-2 cursor-pointer px-1.5' onClick={() => setIsExpanded(!isExpanded)}>
            <PanelLeft className='w-5 h-5 text-sidebar-primary-foreground min-w-5 min-h-5' />
            <p className='text-sm font-medium text-sidebar-primary-foreground ml-2.5 select-none'>{isExpanded ? "Collapse" : "Expand"}</p>
          </div>
          <hr className='w-full border-sidebar-foreground' />
          <div className='flex items-center justify-between gap-2'>
            <div className="flex items-center justify-center gap-2 overflow-hidden min-w-max cursor-pointer" onClick={() => router.push("/profile")}>
              {loading ? (
                <>
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex flex-col overflow-hidden ml-1 gap-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-semibold">{admin?.name?.charAt(0)} {admin?.name?.charAt(1)}</span>
                  </div>
                  <div className="flex flex-col overflow-hidden ml-1">
                    <p className="text-sm font-medium text-sidebar-primary-foreground truncate max-w-[110px]">{admin?.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{admin?.role}</p>
                  </div>
                </>
              )}
            </div>
            <LogOut className="w-8 min-w-8 h-8 min-h-8 text-sidebar-foreground border border-sidebar-foreground rounded-md p-1.5 cursor-pointer hover:text-sidebar-primary-foreground transition-colors duration-300" onClick={() => setShowLogoutDialog(true)} />
          </div>  
        </div>
      </div>
    </div>
  )


  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden hover:bg-blue-50 hover:text-blue-600"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <SheetContent side="left" className="p-0 w-80">
          <SidebarContentMobile />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <>
      <div className={cn("transition-all duration-300 flex items-center justify-center", isExpanded ? "w-[265px]" : "w-21", className)}>
        <SidebarContent />
      </div>
      
      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout? You will need to sign in again to access the admin panel.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowLogoutDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={async () => {
                toast.loading("Logging out...");
                await signOut();
                toast.dismiss();
                setShowLogoutDialog(false);
                router.push("/sign-in");
                toast.success("Logged out successfully");
              }}
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

