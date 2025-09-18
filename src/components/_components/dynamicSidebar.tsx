'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
    LayoutGrid,
    PlusCircle,
    Plus,
    List
} from 'lucide-react';
import { useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useAdminAuthStore } from '@/app/_stores/admin/authStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Dashboard navigation items
const dashboardNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Staff Management', href: '/staff-management', icon: Users },
    { name: 'Sports Management', href: '/sports-management', icon: FlagTriangleRight },
    { name: 'Products Management', href: '/products-management', icon: ShoppingCart },
    { name: 'Customers Management', href: '/customers-management', icon: Users },
    { name: 'Reports & Analytics', href: '/reports', icon: FileText },
    { name: 'Memberships', href: '/memberships', icon: Crown },
    { name: 'Settings', href: '/settings', icon: Settings },
];

// App navigation items
const appNavigation = [
    { name: 'App Lists', href: '/app-lists', icon: LayoutGrid },
    { name: 'Add App', href: '/add-app', icon: PlusCircle },
    { name: 'Settings', href: '/settings', icon: Settings },
];

// Booking navigation items
const bookingNavigation = [
    { name: 'New Booking', href: '/new-booking', icon: Plus },
    { name: 'My Bookings', href: '/my-bookings', icon: List },
];

export default function DynamicSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(true);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const { signOut, admin, loading } = useAdminAuthStore();
    
    // Determine which navigation to use based on current route
    const isAppRoute = pathname.startsWith('/app-lists') || pathname.startsWith('/add-app') || pathname.startsWith('/settings');
    const isBookingRoute = pathname.startsWith('/new-booking') || pathname.startsWith('/my-bookings');
    
    let navigation;
    if (isBookingRoute) {
        navigation = bookingNavigation;
    } else if (isAppRoute) {
        navigation = appNavigation;
    } else {
        navigation = dashboardNavigation;
    }
    
    return (
        <div
            className={`flex h-full flex-col overflow-hidden p-3 transition-all duration-300 ${isExpanded ? 'w-[265px]' : 'w-21'}`}
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
                <nav className="flex-1 space-y-1 px-3 pb-4 pt-3">
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
        </div>
    );
}
