import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          Generate and view system reports
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reports</CardTitle>
          <CardDescription>
            Generate and manage system reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Reports page content will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
