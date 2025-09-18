import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">
          View and manage system notifications
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification Center</CardTitle>
          <CardDescription>
            View and manage all notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Notifications page content will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
