"use client"

import { useState } from "react"
import AppLayout from "@/components/AppLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Upload, Save, X } from "lucide-react"
import Link from "next/link"

const iconOptions = [
  { name: "Activity", value: "activity" },
  { name: "Calendar", value: "calendar" },
  { name: "File", value: "file" },
  { name: "Grid", value: "grid" },
  { name: "Settings", value: "settings" },
  { name: "Users", value: "users" },
  { name: "Bar Chart", value: "bar-chart" },
  { name: "Bell", value: "bell" },
  { name: "Star", value: "star" },
  { name: "Clock", value: "clock" },
]

const categoryOptions = [
  "Productivity",
  "Communication", 
  "Analytics",
  "Management",
  "Development",
  "Design",
  "Marketing",
  "Finance",
  "Other"
]

export default function AddAppPage() {
  const [formData, setFormData] = useState({
    appName: "",
    description: "",
    icon: "",
    category: "",
    version: "",
    developer: "",
    website: "",
    supportEmail: "",
    tags: "",
    isPublic: true,
    isActive: true
  })

  const [selectedIcon, setSelectedIcon] = useState("")

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Add your form submission logic here
    alert("App added successfully!")
  }

  return (
    <AppLayout>
      <div className="p-0">
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h3 className="text-slate-700 text-xl sm:text-xl md:text-2xl lg:text-2xl font-bold tracking-tight">Add New App</h3>
            <p className="text-slate-500 text-xs sm:text-sm md:text-base">Create a new application for your dashboard.</p>
          </div>
          <Link href="/app-lists">
            <Button variant="outline" className="flex items-center gap-2 border-gray-300">Back</Button>
          </Link>
        </div>
      </div>
      

      <form onSubmit={handleSubmit} className="max-w-6xl">
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Basic Information */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Basic Information</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  App Name *
                </label>
                <Input
                  type="text"
                  value={formData.appName}
                  onChange={(e) => handleInputChange("appName", e.target.value)}
                  placeholder="Enter app name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description *
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe what this app does"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category *
                </label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  required
                >
                  <option value="">Select category</option>
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tags
                </label>
                <Input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => handleInputChange("tags", e.target.value)}
                  placeholder="Enter tags separated by commas"
                />
              </div>
            </div>
          </Card>

          {/* App Icon */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">App Icon</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Icon *
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon.value}
                      type="button"
                      className={`p-2 rounded-lg border-2 transition-colors ${
                        selectedIcon === icon.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                      onClick={() => {
                        setSelectedIcon(icon.value)
                        handleInputChange("icon", icon.value)
                      }}
                    >
                      <div className="text-center">
                        <div className="text-lg mb-1">📱</div>
                        <div className="text-xs text-slate-600">{icon.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Or Upload Custom Icon
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
                  <Upload className="h-6 w-6 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-500">PNG, JPG up to 2MB</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Technical Details */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Technical Details</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Version
                </label>
                <Input
                  type="text"
                  value={formData.version}
                  onChange={(e) => handleInputChange("version", e.target.value)}
                  placeholder="e.g., 1.0.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Developer
                </label>
                <Input
                  type="text"
                  value={formData.developer}
                  onChange={(e) => handleInputChange("developer", e.target.value)}
                  placeholder="Developer or company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Website
                </label>
                <Input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Support Email
                </label>
                <Input
                  type="email"
                  value={formData.supportEmail}
                  onChange={(e) => handleInputChange("supportEmail", e.target.value)}
                  placeholder="support@example.com"
                />
              </div>
            </div>
          </Card>

          {/* App Settings */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">App Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-slate-700">Public App</label>
                  <p className="text-xs text-slate-500">Make this app visible to all users</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => handleInputChange("isPublic", e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-slate-700">Active</label>
                  <p className="text-xs text-slate-500">Enable this app immediately</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange("isActive", e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 mt-6">
          <Button type="submit" className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Create App
          </Button>
          <Link href="/">
            <Button type="button" variant="outline" className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </Link>
        </div>
      </form>
      </div>
    </AppLayout>
  )
}

