import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        <Link href="/app-lists">
          <Button variant="outline" className="flex items-center gap-2 border-gray-300">
            Back
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            View and manage all users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Users page content will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  )
}

