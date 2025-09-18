"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AppLayout from "@/components/AppLayout"
import ResponsiveTable, { Column } from "@/components/ui/responsive-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DeleteDialog } from "@/components/ui/delete-dialog"
import { Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { useEffect, useState } from "react"
import { useSettingsStore, CompanyData } from "@/app/_stores/admin/settingsStore"
import UpdateSettings from "./UpdateSettings"

export default function SettingsPage() {
  // Zustand store
  const {
    companies: settingsData,
    loading,
    isDrawerOpen,
    isEditMode,
    editingCompanyId,
    deleteModalOpen,
    companyToDelete,
    fetchCompanies,
    deleteCompany,
    openAddDrawer,
    openEditDrawer,
    closeDrawer,
    openDeleteModal,
    closeDeleteModal
  } = useSettingsStore()

  // Local state for sorting (not moved to store as it's UI-specific)
  const [sortBy, setSortBy] = useState("dateCreated")
  const [sortOrder, setSortOrder] = useState("desc")

  useEffect(() => {
    fetchCompanies()
  }, [fetchCompanies])

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

  const confirmDeleteCompany = async () => {
    if (!companyToDelete) return
    
    try {
      const result = await deleteCompany(companyToDelete.id);
      if (result.success) {
        closeDeleteModal();
      } else {
        alert(result.error || 'Failed to delete company');
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      alert('An unexpected error occurred. Please try again.')
    }
  }

  // Define columns for the ResponsiveTable
  const columns: Column<CompanyData>[] = [
    {
      key: 'company_name',
      title: 'Company Name'
    },
    {
      key: 'company_logo',
      title: 'Logo',
      align: 'center',
      render: (value, item) => (
        <div className="flex items-center justify-center w-full h-8">
          {value ? (
            <img 
              src={String(value)} 
              alt={`${item.company_name} logo`}
              className="max-w-full max-h-8 object-contain"
            />
          ) : (
            <div className="w-8 h-8 bg-slate-200 flex items-center justify-center rounded">
              <span className="text-xs font-bold text-slate-600">
                {item.company_name.charAt(0)}
              </span>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'company_address',
      title: 'Address',
      render: (value) => {
        const address = value as CompanyData['company_address']
        return (
          <span className="text-sm text-slate-600 max-w-xs truncate block">
            {address.street}, {address.city}, {address.state} {address.zip_code}, {address.country}
          </span>
        )
      }
    },
    {
      key: 'contacts',
      title: 'Contacts',
      render: (value) => {
        const contacts = value as CompanyData['contacts']
        return (
          <div className="space-y-1">
            <div className="text-sm text-slate-600">{contacts.email}</div>
            <div className="text-sm text-slate-500">{contacts.phone}</div>
          </div>
        )
      }
    },
    {
      key: 'social_media_links',
      title: 'Social Media',
      render: (value) => {
        const socialLinks = value as CompanyData['social_media_links']
        return (
          <div className="flex flex-wrap gap-1 justify-center">
            {socialLinks.map((social, index) => (
              <Badge key={index} variant="secondary" className="text-xs bg-slate-100 text-slate-700 hover:bg-slate-200">
                {social.platform_name}
              </Badge>
            ))}
          </div>
        )
      }
    },
    {
      key: 'actions',
      title: 'Actions',
      align: 'center',
      render: (_, item) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openEditDrawer(item.id)}
            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openDeleteModal(item)}
            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <AppLayout>
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h3 className="text-slate-700 text-xl sm:text-xl md:text-2xl lg:text-2xl font-bold tracking-tight">Settings</h3>
          <p className="text-slate-500 text-xs sm:text-sm md:text-base">
            Manage company settings and configurations
          </p>
        </div>
        <div className="flex gap-2">
          <UpdateSettings
            isDrawerOpen={isDrawerOpen}
            isEditMode={isEditMode}
            editingCompanyId={editingCompanyId}
            onOpenChange={(open) => !open && closeDrawer()}
            onCloseDrawer={closeDrawer}
            onOpenAddDrawer={openAddDrawer}
          />
        </div>
      </div>
      <div className="mt-2 h-2 w-full bg-gradient-to-b from-slate-200 to-transparent" />

      {/* Sorting Bar */}
      <div className="rounded-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <span className="text-sm font-medium text-slate-700">Sort by:</span>
              {sortOptions.map((option) => (
                <Button
                  key={option.key}
                  variant={sortBy === option.key ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleSort(option.key)}
                  className={`h-8 text-xs ${
                    sortBy === option.key 
                      ? 'bg-teal-600 hover:bg-teal-700 text-white hover:text-white' 
                      : 'text-slate-600 hover:text-white hover:bg-teal-600'
                  }`}
                >
                  {option.label}
                  {sortBy === option.key && (
                    sortOrder === "desc" ? <ChevronDown className="h-3 w-3 ml-1" /> : <ChevronUp className="h-3 w-3 ml-1" />
                  )}
                </Button>
              ))}
            </div>
            <div className="text-sm text-slate-600 font-medium px-3 py-2 rounded-lg border border-slate-200">
              {loading ? 'Loading...' : `${settingsData.length} companies`}
          </div>
        </div>
      </div>

        <ResponsiveTable
          columns={columns}
          data={settingsData}
          loading={loading}
          maxHeightDesktop={400}
        />

      {/* Delete Confirmation Modal */}
      <DeleteDialog
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteCompany}
        title="Confirm Delete"
        itemName={companyToDelete?.company_name}
        itemType="company"
        isLoading={loading}
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
      />
    </div>
    </AppLayout>
  )
}