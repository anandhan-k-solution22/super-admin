import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Settings } from "lucide-react"
import Link from "next/link"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            View detailed analytics and insights
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/app-lists">
            <Button variant="outline" className="flex items-center gap-2 border-gray-300">
              Back
            </Button>
          </Link>
          <Link href="/app-settings">
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
          <CardDescription>
            Comprehensive analytics and reporting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Analytics page content will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  )
}

