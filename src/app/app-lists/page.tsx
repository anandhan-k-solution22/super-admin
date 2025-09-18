import Link from "next/link";
import { Activity, FileText, Ticket, Calendar, BellRing } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const apps = [
  { title: "Sports App", href: "/dashboard", icon: Activity, color: "bg-blue-50 text-blue-700" },
  { title: "Exam App", href: "/dashboard", icon: FileText, color: "bg-indigo-50 text-indigo-700" },
  { title: "Ticket App", href: "/dashboard", icon: Ticket, color: "bg-emerald-50 text-emerald-700" },
  { title: "Booking App", href: "/dashboard", icon: Calendar, color: "bg-teal-50 text-teal-700" },
  { title: "Reminder App", href: "/dashboard", icon: BellRing, color: "bg-amber-50 text-amber-700" },
];

export default function AppListPage() {
  return (
    <AppLayout>
      <div className="p-0">
      <div className="mb-4 sm:mb-6">
        <h3 className="mt-0 text-xl sm:text-xl md:text-2xl lg:text-2xl font-bold tracking-tight">App Lists</h3>
        <p className="text-muted-foreground text-xs sm:text-sm md:text-base">Choose an app to open the old UI.</p>
      </div>
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {apps.map((app) => (
          <Link key={app.title} href={app.href} className="group">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 hover:shadow-md transition-shadow h-full">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${app.color}`}>
                  <app.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-slate-900 font-medium">{app.title}</p>
                  <p className="text-slate-500 text-sm">Open {app.title}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      </div>
    </AppLayout>
  );
}
