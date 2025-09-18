"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Save,
  X,
  Eye,
  EyeOff,
  Shield,
  Database,
  Mail,
  Bell,
  Globe,
  Lock,
  Users,
  Server,
  Activity,
  ChevronUp,
  ChevronDown
} from "lucide-react"

// Mock data for app settings
const appSettingsData = [
  {
    id: 1,
    category: "Company",
    name: "Acme Corporation",
    description: "Main company configuration",
    value: "Active",
    status: "active",
    lastModified: "2024-01-15",
    modifiedBy: "Admin User",
    details: {
      address: "123 Business Ave, New York, NY 10001",
      email: "contact@acme.com",
      phone: "+1-555-0123",
      website: "www.acme.com"
    }
  },
  {
    id: 2,
    category: "Company",
    name: "TechStart Inc",
    description: "Technology startup company",
    value: "Active",
    status: "active",
    lastModified: "2024-01-10",
    modifiedBy: "System Admin",
    details: {
      address: "456 Innovation Blvd, San Francisco, CA 94105",
      email: "hello@techstart.com",
      phone: "+1-555-0456",
      website: "www.techstart.com"
    }
  },
  {
    id: 3,
    category: "Security",
    name: "API Access Control",
    description: "Control API access permissions",
    value: "Restricted",
    status: "active",
    lastModified: "2024-01-12",
    modifiedBy: "Admin User",
    details: {
      apiKey: "sk-***-***-***-***",
      permissions: "Read, Write, Delete",
      rateLimit: "1000/hour"
    }
  },
  {
    id: 4,
    category: "Security",
    name: "Database Encryption",
    description: "Encrypt sensitive data in database",
    value: "Enabled",
    status: "active",
    lastModified: "2024-01-08",
    modifiedBy: "Admin User",
    details: {
      algorithm: "AES-256",
      keyRotation: "Monthly",
      compliance: "GDPR, HIPAA"
    }
  },
  {
    id: 5,
    category: "Notifications",
    name: "Email Alerts",
    description: "Send email notifications for system events",
    value: "Enabled",
    status: "active",
    lastModified: "2024-01-14",
    modifiedBy: "Admin User",
    details: {
      recipients: "admin@company.com, support@company.com",
      frequency: "Real-time",
      types: "Errors, Warnings, Info"
    }
  },
  {
    id: 6,
    category: "Notifications",
    name: "SMS Notifications",
    description: "Send SMS alerts for critical events",
    value: "Disabled",
    status: "inactive",
    lastModified: "2024-01-05",
    modifiedBy: "Admin User",
    details: {
      provider: "Twilio",
      phoneNumbers: "+1-555-0123, +1-555-0456",
      threshold: "Critical only"
    }
  },
  {
    id: 7,
    category: "Database",
    name: "Backup Schedule",
    description: "Automated database backup configuration",
    value: "Daily",
    status: "active",
    lastModified: "2024-01-11",
    modifiedBy: "System Admin",
    details: {
      frequency: "Daily at 2:00 AM",
      retention: "30 days",
      location: "AWS S3"
    }
  },
  {
    id: 8,
    category: "API",
    name: "Rate Limiting",
    description: "API request rate limiting settings",
    value: "1000/hour",
    status: "active",
    lastModified: "2024-01-09",
    modifiedBy: "Admin User",
    details: {
      limit: "1000 requests per hour",
      burst: "100 requests per minute",
      penalty: "1 hour block"
    }
  }
]

const categories = [
  { name: "All", icon: Settings, color: "bg-gray-50 text-gray-700" },
  { name: "Company", icon: Users, color: "bg-blue-50 text-blue-700" },
  { name: "Security", icon: Shield, color: "bg-red-50 text-red-700" },
  { name: "Notifications", icon: Bell, color: "bg-yellow-50 text-yellow-700" },
  { name: "Database", icon: Database, color: "bg-green-50 text-green-700" },
  { name: "API", icon: Globe, color: "bg-purple-50 text-purple-700" }
]

export default function AppSettingsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingSetting, setEditingSetting] = useState(null)
  const [settings, setSettings] = useState(appSettingsData)
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())

  const filteredSettings = settings.filter(setting => {
    const matchesSearch = setting.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         setting.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || setting.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Inactive</Badge>
    )
  }

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName)
    return category ? category.icon : Settings
  }

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName)
    return category ? category.color : "bg-gray-50 text-gray-700"
  }

  const toggleRowExpansion = (id: number) => {
    const newExpandedRows = new Set(expandedRows)
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id)
    } else {
      newExpandedRows.add(id)
    }
    setExpandedRows(newExpandedRows)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">App Settings</h1>
        <p className="text-slate-600">Manage application settings and configurations.</p>
      </div>

      {/* Search and Filter Section */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search settings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {categories.map((category) => {
                const CategoryIcon = category.icon
                return (
                  <Button
                    key={category.name}
                    variant={selectedCategory === category.name ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.name)}
                    className={`flex items-center gap-2 ${
                      selectedCategory === category.name 
                        ? "bg-teal-600 hover:bg-teal-700" 
                        : ""
                    }`}
                  >
                    <CategoryIcon className="h-4 w-4" />
                    {category.name}
                  </Button>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Application Settings</CardTitle>
              <CardDescription>
                View and manage all application settings and configurations
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Setting
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Setting</DialogTitle>
                  <DialogDescription>
                    Create a new application setting configuration.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <select className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md">
                      <option>Company</option>
                      <option>Security</option>
                      <option>Notifications</option>
                      <option>Database</option>
                      <option>API</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input placeholder="Setting name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Input placeholder="Setting description" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddDialogOpen(false)}>
                    Add Setting
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Modified</TableHead>
                  <TableHead>Modified By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSettings.map((setting) => {
                  const CategoryIcon = getCategoryIcon(setting.category)
                  const categoryColor = getCategoryColor(setting.category)
                  
                  return (
                    <>
                      <TableRow key={setting.id}>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleRowExpansion(setting.id)}
                            className="h-8 w-8 p-0"
                          >
                            {expandedRows.has(setting.id) ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${categoryColor}`}>
                            <CategoryIcon className="h-3 w-3" />
                            {setting.category}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{setting.name}</TableCell>
                        <TableCell className="text-slate-600">{setting.description}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{setting.value}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(setting.status)}</TableCell>
                        <TableCell className="text-slate-600">{setting.lastModified}</TableCell>
                        <TableCell className="text-slate-600">{setting.modifiedBy}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {expandedRows.has(setting.id) && (
                        <TableRow>
                          <TableCell colSpan={9} className="bg-slate-50">
                            <div className="p-4">
                              <h4 className="font-medium text-slate-900 mb-3">Setting Details</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(setting.details).map(([key, value]) => (
                                  <div key={key}>
                                    <span className="text-sm font-medium text-slate-700 capitalize">
                                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                                    </span>
                                    <p className="text-sm text-slate-600">{value}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}