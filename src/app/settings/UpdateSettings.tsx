"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Edit, Trash2, Plus, X, Upload, Image, Loader2 } from "lucide-react"
import { useSettingsStore } from "@/app/_stores/admin/settingsStore"

interface UpdateSettingsProps {
  isDrawerOpen: boolean
  isEditMode: boolean
  editingCompanyId: string | null
  onOpenChange: (open: boolean) => void
  onCloseDrawer: () => void
  onOpenAddDrawer: () => void
}

export default function UpdateSettings({
  isDrawerOpen,
  isEditMode,
  editingCompanyId,
  onOpenChange,
  onCloseDrawer,
  onOpenAddDrawer
}: UpdateSettingsProps) {
  const {
    formData,
    logoFile,
    logoPreview,
    loading,
    socialMediaLogoFiles,
    socialMediaLogoPreviews,
    addCompany,
    updateCompany,
    resetForm,
    setLogoFile,
    setLogoPreview,
    setSocialMediaLogoFile,
    setSocialMediaLogoPreview,
    handleInputChange,
    handleSocialMediaChange,
    addSocialMediaLink,
    removeSocialMediaLink
  } = useSettingsStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      let result;
      if (isEditMode && editingCompanyId) {
        result = await updateCompany(editingCompanyId, formData);
      } else {
        result = await addCompany(formData);
      }
      
      if (result.success) {
        onCloseDrawer();
      } else {
        alert(result.error || 'An error occurred');
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      alert('An unexpected error occurred. Please try again.')
    }
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      const maxSize = 5 * 1024 * 1024 // 5MB
      
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)')
        return
      }
      
      if (file.size > maxSize) {
        alert('Image size must be less than 5MB')
        return
      }
      
      setLogoFile(file)
      handleInputChange("company_logo", file.name)
      
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setLogoFile(null)
    setLogoPreview(null)
    handleInputChange("company_logo", "")
  }

  const handleSocialMediaLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      const maxSize = 5 * 1024 * 1024 // 5MB
      
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)')
        return
      }
      
      if (file.size > maxSize) {
        alert('Image size must be less than 5MB')
        return
      }
      
      setSocialMediaLogoFile(index, file)
      handleSocialMediaChange(index, 'logo', file.name)
      
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setSocialMediaLogoPreview(index, e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeSocialMediaLogo = (index: number) => {
    setSocialMediaLogoFile(index, null)
    setSocialMediaLogoPreview(index, null)
    handleSocialMediaChange(index, 'logo', '')
  }

  return (
    <Sheet open={isDrawerOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button 
          onClick={onOpenAddDrawer}
          className="w-full sm:w-auto text-xs sm:text-sm bg-[#014451] text-white border-slate-300 hover:bg-[#014451] hover:text-white hover:border-[#014451] shadow-lg hover:shadow-xl transition-all duration-200 font-semibold h-8 px-3"
          variant="outline"
          size="sm"
        >
          Add New Company
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[40vw] min-w-[600px] max-w-[60vw] overflow-y-auto bg-white border-l border-slate-200">
        <SheetHeader className="bg-white border-b border-slate-200">
          <SheetTitle className="text-xl font-bold text-slate-900">
            {isEditMode ? "Edit Company" : "Add New Company"}
          </SheetTitle>
          <SheetDescription className="text-slate-600">
            {isEditMode 
              ? "Update the company details below." 
              : "Fill in the details below to add a new company to your settings."
            }
          </SheetDescription>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-6 bg-white p-4">
          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">Company Information</h3>
            
            <div className="space-y-4">
              {/* Logo Preview Area - Rectangular, First Row */}
              <div className="flex justify-center">
                <div className="w-48 h-24 border border-slate-300 rounded-md bg-slate-50 flex items-center justify-center relative">
                  {logoPreview ? (
                    <>
                      <img 
                        src={logoPreview} 
                        alt="Logo preview" 
                        className="w-full h-full object-contain p-2"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeLogo}
                        className="absolute top-1 right-1 h-5 w-5 p-0 bg-white/90 hover:bg-white border-red-300 text-red-600 hover:border-red-400 rounded-full z-10 shadow-sm"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </>
                  ) : (
                    <div className="text-center text-slate-400">
                      <Image className="w-8 h-8 mx-auto mb-1 opacity-50" />
                      <p className="text-xs">Logo</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Company Name and Logo Upload - Second Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Company Name */}
                <div className="space-y-2">
                  <Label htmlFor="company_name" className="text-sm font-medium text-slate-700">Company Name *</Label>
                  <Input
                    id="company_name"
                    type="text"
                    placeholder="Enter company name"
                    value={formData.company_name}
                    onChange={(e) => handleInputChange("company_name", e.target.value)}
                    required
                    className="border border-slate-300 focus:border-[#014451] focus:ring-1 focus:ring-[#014451]"
                  />
                </div>

                {/* Company Logo Upload */}
                <div className="space-y-2">
                  <Label htmlFor="company_logo" className="text-sm font-medium text-slate-700">Company Logo</Label>
                  <div className="relative">
                    <Input
                      id="company_logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <Label 
                      htmlFor="company_logo" 
                      className="flex items-center justify-center w-full h-10 border border-slate-300 rounded-md cursor-pointer hover:bg-slate-50 hover:border-slate-400 focus:border-[#014451] focus:ring-1 focus:ring-[#014451] transition-colors bg-white"
                    >
                      <div className="flex items-center justify-center">
                        <Upload className="w-4 h-4 mr-2 text-slate-400" />
                        <span className="text-sm text-slate-500">Upload logo</span>
                      </div>
                    </Label>
                  </div>
                  
                  {/* Hidden - no preview or file info shown */}
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">Address Information</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="street" className="text-sm font-medium text-slate-700">Street Address *</Label>
                <Input
                  id="street"
                  type="text"
                  placeholder="123 Business Ave"
                  value={formData.company_address.street}
                  onChange={(e) => handleInputChange("company_address", e.target.value, "street")}
                  required
                  className="border border-slate-300 focus:border-[#014451] focus:ring-1 focus:ring-[#014451]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium text-slate-700">City *</Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="New York"
                  value={formData.company_address.city}
                  onChange={(e) => handleInputChange("company_address", e.target.value, "city")}
                  required
                  className="border border-slate-300 focus:border-[#014451] focus:ring-1 focus:ring-[#014451]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-medium text-slate-700">State *</Label>
                <Input
                  id="state"
                  type="text"
                  placeholder="NY"
                  value={formData.company_address.state}
                  onChange={(e) => handleInputChange("company_address", e.target.value, "state")}
                  required
                  className="border border-slate-300 focus:border-[#014451] focus:ring-1 focus:ring-[#014451]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip_code" className="text-sm font-medium text-slate-700">ZIP Code *</Label>
                <Input
                  id="zip_code"
                  type="text"
                  placeholder="10001"
                  value={formData.company_address.zip_code}
                  onChange={(e) => handleInputChange("company_address", e.target.value, "zip_code")}
                  required
                  className="border border-slate-300 focus:border-[#014451] focus:ring-1 focus:ring-[#014451]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-medium text-slate-700">Country *</Label>
                <Input
                  id="country"
                  type="text"
                  placeholder="USA"
                  value={formData.company_address.country}
                  onChange={(e) => handleInputChange("company_address", e.target.value, "country")}
                  required
                  className="border border-slate-300 focus:border-[#014451] focus:ring-1 focus:ring-[#014451]"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">Contact Information</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@company.com"
                  value={formData.contacts.email}
                  onChange={(e) => handleInputChange("contacts", e.target.value, "email")}
                  required
                  className="border border-slate-300 focus:border-[#014451] focus:ring-1 focus:ring-[#014451]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-slate-700">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1-555-0123"
                  value={formData.contacts.phone}
                  onChange={(e) => handleInputChange("contacts", e.target.value, "phone")}
                  required
                  className="border border-slate-300 focus:border-[#014451] focus:ring-1 focus:ring-[#014451]"
                />
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">Social Media Links</h3>
            
            <div className="space-y-4">
              {/* Social Media Links */}
              {formData.social_media_links.map((social, index) => (
                <div key={index} className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
                  {/* Platform Name */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Platform Name</Label>
                    <Input
                      type="text"
                      placeholder="e.g., Facebook, Twitter, LinkedIn"
                      value={social.platform_name}
                      onChange={(e) => handleSocialMediaChange(index, 'platform_name', e.target.value)}
                      className="border border-slate-300 focus:border-[#014451] focus:ring-1 focus:ring-[#014451]"
                    />
                  </div>
                  
                  {/* URL */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">URL</Label>
                    <Input
                      type="url"
                      placeholder="https://platform.com/company"
                      value={social.url}
                      onChange={(e) => handleSocialMediaChange(index, 'url', e.target.value)}
                      className="border border-slate-300 focus:border-[#014451] focus:ring-1 focus:ring-[#014451]"
                    />
                  </div>
                  
                  {/* Platform Logo */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">Logo</Label>
                    <div className="relative">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleSocialMediaLogoUpload(e, index)}
                        className="hidden"
                        id={`social-logo-${index}`}
                      />
                      <Label 
                        htmlFor={`social-logo-${index}`}
                        className="flex items-center justify-center w-10 h-10 border border-slate-300 rounded-full cursor-pointer hover:bg-slate-50 hover:border-slate-400 focus:border-[#014451] focus:ring-1 focus:ring-[#014451] transition-colors bg-white relative overflow-hidden"
                      >
                        {socialMediaLogoPreviews[index] ? (
                          <div className="flex items-center justify-center w-full h-full">
                            <img 
                              src={socialMediaLogoPreviews[index]} 
                              alt="Logo preview"
                              className="w-full h-full object-cover rounded-full"
                              onError={(e) => {
                                // Clear the preview when image fails to load
                                setSocialMediaLogoPreview(index, null);
                              }}
                            />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <Upload className="w-3 h-3 text-slate-400" />
                          </div>
                        )}
                      </Label>
                      
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeSocialMediaLink(index)}
                      disabled={formData.social_media_links.length <= 1}
                      className="h-10 w-10 p-0 border-red-300 text-red-600 hover:bg-red-600 hover:border-red-400 disabled:opacity-30 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-red-600 hover:disabled:opacity-100 hover:disabled:text-red-600"
                      title={formData.social_media_links.length <= 1 ? "Cannot delete the last social media link" : "Delete social media link"}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addSocialMediaLink}
                      className="h-10 w-10 p-0 border-[#014451] text-[#014451] hover:bg-[#014451] hover:text-white transition-all duration-200"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={onCloseDrawer}
              className="w-32 border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="w-32 text-white border-[#014451] hover:bg-[#015a6b] shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#014451' }}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditMode ? "Updating..." : "Adding..."}
                </>
              ) : (
                isEditMode ? "Update" : "Add"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
