import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import MainLayout from "@/components/MainLayout"
import { 
  Users, 
  Building2, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  BarChart3,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <MainLayout>
      <div>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
            <p className="text-slate-600">Overview of your system and applications.</p>
          </div>
          <Link href="/app-lists">
            <Button variant="outline" className="flex items-center gap-2 border-gray-300">
              Back
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,350</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              +3 new this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Apps</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current status of all services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">API Server</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Database</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Email Service</span>
              </div>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Warning</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">File Storage</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">Online</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New user registered</p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">System backup completed</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">High memory usage detected</p>
                <p className="text-xs text-muted-foreground">3 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New company added</p>
                <p className="text-xs text-muted-foreground">5 hours ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">View Analytics</p>
                <p className="text-xs text-muted-foreground">Check system metrics</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Manage Users</p>
                <p className="text-xs text-muted-foreground">User administration</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
              <Building2 className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Company Settings</p>
                <p className="text-xs text-muted-foreground">Configure companies</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </MainLayout>
  )
}
