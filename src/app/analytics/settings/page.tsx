"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Plus, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

// Static data for the analytics app settings table
const settingsData = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    company_name: "Acme Corporation",
    company_logo: "acme-logo.png",
    company_address: {
      street: "123 Business Ave",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA"
    },
    contacts: {
      email: "contact@acme.com",
      phone: "+1-555-0123",
      website: "www.acme.com"
    },
    social_media_links: {
      facebook: "https://facebook.com/acme",
      twitter: "https://twitter.com/acme",
      linkedin: "https://linkedin.com/company/acme"
    }
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    company_name: "TechStart Inc",
    company_logo: "techstart-logo.png",
    company_address: {
      street: "456 Innovation Blvd",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "USA"
    },
    contacts: {
      email: "hello@techstart.com",
      phone: "+1-555-0456",
      website: "www.techstart.com"
    },
    social_media_links: {
      facebook: "https://facebook.com/techstart",
      twitter: "https://twitter.com/techstart",
      linkedin: "https://linkedin.com/company/techstart"
    }
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    company_name: "Global Solutions Ltd",
    company_logo: "global-logo.png",
    company_address: {
      street: "789 Enterprise St",
      city: "London",
      state: "England",
      zipCode: "SW1A 1AA",
      country: "UK"
    },
    contacts: {
      email: "info@globalsolutions.com",
      phone: "+44-20-7946-0958",
      website: "www.globalsolutions.com"
    },
    social_media_links: {
      facebook: "https://facebook.com/globalsolutions",
      twitter: "https://twitter.com/globalsolutions",
      linkedin: "https://linkedin.com/company/globalsolutions"
    }
  }
]

export default function AnalyticsSettingsPage() {
  const [sortBy, setSortBy] = useState("dateCreated")
  const [sortOrder, setSortOrder] = useState("desc")

  const sortOptions = [
    { key: "dateCreated", label: "Date Created", icon: ChevronDown },
    { key: "startDate", label: "Start Date", icon: ChevronUp },
    { key: "amount", label: "Amount", icon: ChevronUp },
    { key: "status", label: "Status", icon: ChevronUp },
    { key: "payment", label: "Payment", icon: ChevronUp },
  ]

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(key)
      setSortOrder("asc")
    }
  }

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h3 className="text-xl sm:text-xl md:text-2xl lg:text-2xl font-bold tracking-tight">Analytics App Settings</h3>
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
            Manage analytics app settings and configurations
          </p>
        </div>
        <div className="flex gap-2">
          <Link 
            href="/analytics" 
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Analytics
          </Link>
          <Button 
            className="w-full sm:w-auto text-sm sm:text-base bg-white text-slate-700 border-slate-300 hover:bg-[#014451] hover:text-white hover:border-[#014451] shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
            variant="outline"
          >
            <Plus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            Add Company
          </Button>
        </div>
      </div>

      {/* Sorting Bar */}
      <div className="rounded-xl">
        {/* Mobile Layout */}
        <div className="block sm:hidden space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-800">Sort & Filter</span>
            <span className="text-xs text-slate-600 px-3 py-1 rounded-full font-medium border border-slate-200">
              {settingsData.length} companies
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {sortOptions.map((option) => {
              const isActive = sortBy === option.key
              const Icon = option.icon
              return (
                <Button
                  key={option.key}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSort(option.key)}
                  className={`text-xs px-3 py-2 h-8 transition-all duration-200 ${
                    isActive 
                      ? "text-white border-[#014451] hover:bg-[#015a6b] shadow-md" 
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400"
                  }`}
                  style={isActive ? { backgroundColor: '#014451' } : {}}
                >
                  <Icon className="mr-1 h-3 w-3" />
                  {option.label}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Tablet & Desktop Layout */}
        <div className="hidden sm:block">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-sm font-semibold text-slate-800">Sort by:</span>
              <div className="flex flex-wrap gap-2">
                {sortOptions.map((option) => {
                  const isActive = sortBy === option.key
                  const Icon = option.icon
                  return (
                    <Button
                      key={option.key}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSort(option.key)}
                      className={`text-sm px-3 py-2 h-8 transition-all duration-200 ${
                        isActive 
                          ? "text-white border-[#014451] hover:bg-[#015a6b] shadow-md" 
                          : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400"
                      }`}
                      style={isActive ? { backgroundColor: '#014451' } : {}}
                    >
                      {option.label}
                      <Icon className="ml-1 h-3 w-3" />
                    </Button>
                  )
                })}
              </div>
            </div>
            <div className="text-sm text-slate-600 font-medium px-3 py-2 rounded-lg border border-slate-200">
              {settingsData.length} companies
            </div>
          </div>
        </div>
      </div>

      <Card className="bg-white shadow-lg rounded-xl overflow-hidden py-0">
        <CardContent className="p-0 m-0">
          {/* Desktop Table View - Show on xl screens and up */}
          <div className="hidden xl:block overflow-hidden p-0">
            <Table className="m-0">
              <TableHeader style={{ backgroundColor: '#014451' }}>
                <TableRow className="border-b-0">
                  <TableHead className="text-center text-white font-bold text-sm border-r border-white/20 py-2 px-0 rounded-tl-lg" style={{ backgroundColor: '#014451' }}>ID</TableHead>
                  <TableHead className="text-center text-white font-bold text-sm border-r border-white/20 py-2 px-0" style={{ backgroundColor: '#014451' }}>Company Name</TableHead>
                  <TableHead className="text-center text-white font-bold text-sm border-r border-white/20 py-2 px-0" style={{ backgroundColor: '#014451' }}>Logo</TableHead>
                  <TableHead className="text-center text-white font-bold text-sm border-r border-white/20 py-2 px-0" style={{ backgroundColor: '#014451' }}>Address</TableHead>
                  <TableHead className="text-center text-white font-bold text-sm border-r border-white/20 py-2 px-0" style={{ backgroundColor: '#014451' }}>Contacts</TableHead>
                  <TableHead className="text-center text-white font-bold text-sm border-r border-white/20 py-2 px-0" style={{ backgroundColor: '#014451' }}>Social Media</TableHead>
                  <TableHead className="text-center text-white font-bold text-sm py-2 px-0 rounded-tr-lg" style={{ backgroundColor: '#014451' }}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settingsData.map((company, index) => (
                  <TableRow 
                    key={company.id} 
                    className={`${index === settingsData.length - 1 ? '' : 'border-b border-slate-100'} hover:bg-gradient-to-r hover:from-blue-50 hover:to-slate-50 transition-all duration-200 bg-white group`}
                  >
                    <TableCell className="text-center font-mono text-xs text-slate-500 px-2 py-2 border-r border-slate-100">
                      <span className="bg-slate-100 px-2 py-1 rounded-md font-medium">
                        {company.id.slice(0, 8)}...
                      </span>
                    </TableCell>
                    <TableCell className="text-center font-bold text-slate-900 px-2 py-2 border-r border-slate-100">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="font-semibold">{company.company_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center px-2 py-2 border-r border-slate-100">
                      <Badge variant="outline" className="text-white border-slate-300 font-medium px-3 py-1" style={{ backgroundColor: '#014451' }}>
                        {company.company_logo}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center px-2 py-2 border-r border-slate-100">
                      <div className="text-sm space-y-1">
                        <div className="font-semibold text-slate-900">{company.company_address.street}</div>
                        <div className="text-slate-600">
                          {company.company_address.city}, {company.company_address.state} {company.company_address.zipCode}
                        </div>
                        <div className="text-slate-500 text-xs font-medium bg-slate-100 px-2 py-1 rounded-full inline-block">
                          {company.company_address.country}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center px-2 py-2 border-r border-slate-100">
                      <div className="text-sm space-y-1">
                        <div className="font-semibold text-slate-900">{company.contacts.email}</div>
                        <div className="text-slate-600">{company.contacts.phone}</div>
                        <div className="text-slate-500 text-xs font-medium bg-slate-100 px-2 py-1 rounded-full inline-block">{company.contacts.website}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center px-2 py-2 border-r border-slate-100">
                      <div className="flex flex-wrap gap-1.5 justify-center">
                        {Object.entries(company.social_media_links).map(([platform, url]) => (
                          <Badge key={platform} variant="secondary" className="text-xs bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 hover:from-slate-200 hover:to-slate-300 font-medium px-2 py-1 transition-all duration-200">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-center px-2 py-2">
                      <div className="flex gap-1.5 justify-center">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 transition-all duration-200 rounded-lg">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 transition-all duration-200 rounded-lg">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Tablet Table View - Show on lg screens */}
          <div className="hidden lg:block xl:hidden overflow-hidden p-0">
            <Table className="m-0">
              <TableHeader style={{ backgroundColor: '#014451' }}>
                <TableRow>
                  <TableHead className="text-center text-white font-semibold text-sm border-r border-slate-300 py-2 px-0 rounded-tl-lg" style={{ backgroundColor: '#014451' }}>Company</TableHead>
                  <TableHead className="text-center text-white font-semibold text-sm border-r border-slate-300 py-2 px-0" style={{ backgroundColor: '#014451' }}>Address</TableHead>
                  <TableHead className="text-center text-white font-semibold text-sm border-r border-slate-300 py-2 px-0" style={{ backgroundColor: '#014451' }}>Contacts</TableHead>
                  <TableHead className="text-center text-white font-semibold text-sm py-2 px-0 rounded-tr-lg" style={{ backgroundColor: '#014451' }}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settingsData.map((company, index) => (
                  <TableRow 
                    key={company.id} 
                    className={`${index === settingsData.length - 1 ? '' : 'border-b border-slate-200'} hover:bg-slate-50 transition-colors bg-white`}
                  >
                    <TableCell className="border-r border-slate-200">
                      <div className="space-y-1">
                        <div className="font-semibold text-slate-800 text-sm">{company.company_name}</div>
                        <div className="text-xs text-slate-500 font-mono">{company.id}</div>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                          {company.company_logo}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="px-2 py-3 border-r border-slate-200">
                      <div className="text-sm space-y-1">
                        <div className="font-medium text-slate-900">{company.company_address.street}</div>
                        <div className="text-slate-600">
                          {company.company_address.city}, {company.company_address.state} {company.company_address.zipCode}
                        </div>
                        <div className="text-slate-500 text-xs font-medium">
                          {company.company_address.country}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="border-r border-slate-200">
                      <div className="text-sm space-y-1">
                        <div className="font-medium text-slate-800">{company.contacts.email}</div>
                        <div className="text-slate-600">{company.contacts.phone}</div>
                        <div className="text-slate-500 text-xs">{company.contacts.website}</div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {Object.entries(company.social_media_links).map(([platform, url]) => (
                            <Badge key={platform} variant="secondary" className="text-xs bg-slate-100 text-slate-700 hover:bg-slate-200">
                              {platform}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center px-2 py-3">
                      <div className="flex justify-center gap-2">
                        <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="hover:bg-red-50 hover:border-red-200 hover:text-red-700 h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View - Show on screens smaller than lg */}
          <div className="lg:hidden">
            <div className="space-y-3 sm:space-y-4 p-3 sm:p-4">
              {settingsData.map((company, index) => (
                <div key={company.id} className="bg-white border border-slate-200 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
                  {/* Company Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-800 text-base sm:text-lg truncate">{company.company_name}</h3>
                      <p className="text-xs text-slate-500 font-mono mt-1 truncate">{company.id}</p>
                    </div>
                    <div className="flex gap-1 sm:gap-2 ml-2">
                      <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 h-8 w-8 sm:h-9 sm:w-auto">
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline ml-1">Edit</span>
                      </Button>
                      <Button variant="outline" size="sm" className="hover:bg-red-50 hover:border-red-200 hover:text-red-700 h-8 w-8 sm:h-9 sm:w-auto">
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline ml-1">Delete</span>
                      </Button>
                    </div>
                  </div>

                  {/* Logo */}
                  <div>
                    <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Logo</label>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 mt-1 text-xs">
                      {company.company_logo}
                    </Badge>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Address</label>
                    <div className="text-xs sm:text-sm mt-1">
                      <div className="font-medium text-slate-800">{company.company_address.street}</div>
                      <div className="text-slate-600">
                        {company.company_address.city}, {company.company_address.state} {company.company_address.zipCode}
                      </div>
                      <div className="text-slate-500 text-xs">
                        {company.company_address.country}
                      </div>
                    </div>
                  </div>

                  {/* Contacts */}
                  <div>
                    <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Contacts</label>
                    <div className="text-xs sm:text-sm space-y-1 mt-1">
                      <div className="font-medium text-slate-800 break-all">{company.contacts.email}</div>
                      <div className="text-slate-600">{company.contacts.phone}</div>
                      <div className="text-slate-500 text-xs break-all">{company.contacts.website}</div>
                    </div>
                  </div>

                  {/* Social Media */}
                  <div>
                    <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Social Media</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Object.entries(company.social_media_links).map(([platform, url]) => (
                        <Badge key={platform} variant="secondary" className="text-xs bg-slate-100 text-slate-700 hover:bg-slate-200">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
