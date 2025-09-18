"use client"

import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import { uploadImageToSupabase, deleteImageFromSupabase, validateImageFile } from '@/lib/imageUpload'

// Type definition for company data
export interface CompanyData extends Record<string, unknown> {
  id: string;
  created_at: string;
  company_name: string;
  company_logo: string;
  company_address: {
    city: string;
    state: string;
    street: string;
    country: string;
    zip_code: string;
  };
  contacts: {
    email: string;
    phone: string;
  };
  social_media_links: Array<{
    url: string;
    platform_name: string;
    logo: string;
  }>;
  actions?: unknown; // For table actions column
}

export interface FormData {
  company_name: string;
  company_logo: string;
  company_address: {
    street: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
  };
  contacts: {
    email: string;
    phone: string;
  };
  social_media_links: Array<{
    platform_name: string;
    url: string;
    logo: string;
  }>;
}

interface SettingsState {
  // Data
  companies: CompanyData[];
  loading: boolean;
  
  // UI State
  isDrawerOpen: boolean;
  isEditMode: boolean;
  editingCompanyId: string | null;
  deleteModalOpen: boolean;
  companyToDelete: CompanyData | null;
  
  // Form State
  formData: FormData;
  logoFile: File | null;
  logoPreview: string | null;
  socialMediaLogoFiles: { [index: number]: File | null };
  socialMediaLogoPreviews: { [index: number]: string | null };
  
  // Actions
  fetchCompanies: () => Promise<void>;
  addCompany: (companyData: FormData) => Promise<{ success: boolean; error?: string }>;
  updateCompany: (id: string, companyData: FormData) => Promise<{ success: boolean; error?: string }>;
  deleteCompany: (id: string) => Promise<{ success: boolean; error?: string }>;
  
  // UI Actions
  openAddDrawer: () => void;
  openEditDrawer: (companyId: string) => void;
  closeDrawer: () => void;
  openDeleteModal: (company: CompanyData) => void;
  closeDeleteModal: () => void;
  
  // Form Actions
  setFormData: (data: Partial<FormData>) => void;
  resetForm: () => void;
  setLogoFile: (file: File | null) => void;
  setLogoPreview: (preview: string | null) => void;
  setSocialMediaLogoFile: (index: number, file: File | null) => void;
  setSocialMediaLogoPreview: (index: number, preview: string | null) => void;
  handleInputChange: (field: string, value: string, nestedField?: string) => void;
  handleSocialMediaChange: (index: number, field: 'platform_name' | 'url' | 'logo', value: string) => void;
  addSocialMediaLink: () => void;
  removeSocialMediaLink: (index: number) => void;
}

const initialFormData: FormData = {
  company_name: "",
  company_logo: "",
  company_address: {
    street: "",
    city: "",
    state: "",
    zip_code: "",
    country: ""
  },
  contacts: {
    email: "",
    phone: ""
  },
  social_media_links: [
    {
      platform_name: "",
      url: "",
      logo: ""
    }
  ]
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  // Initial state
  companies: [],
  loading: false,
  isDrawerOpen: false,
  isEditMode: false,
  editingCompanyId: null,
  deleteModalOpen: false,
  companyToDelete: null,
  formData: initialFormData,
  logoFile: null,
  logoPreview: null,
  socialMediaLogoFiles: {},
  socialMediaLogoPreviews: {},

  // Data fetching
  fetchCompanies: async () => {
    set({ loading: true });
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('admin-settings')
        .select('*');
      
      if (error) {
        console.error('Error fetching companies:', error);
        set({ loading: false });
        return;
      }
      
      set({ 
        companies: data as CompanyData[] || [], 
        loading: false 
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      set({ loading: false });
    }
  },

  // CRUD operations
  addCompany: async (companyData: FormData) => {
    set({ loading: true });
    
    try {
      const state = get();
      let logoUrl = companyData.company_logo;
      
      // Handle image upload if logoFile exists
      if (state.logoFile) {
        // Validate the image file
        const validation = validateImageFile(state.logoFile);
        if (!validation.valid) {
          set({ loading: false });
          return { success: false, error: validation.error };
        }
        
        // Upload image to Supabase Storage
        const uploadResult = await uploadImageToSupabase(state.logoFile);
        if (!uploadResult.success) {
          set({ loading: false });
          return { success: false, error: uploadResult.error };
        }
        
        logoUrl = uploadResult.url!;
      }

      // Handle social media logo uploads
      let updatedSocialMediaLinks;
      try {
        updatedSocialMediaLinks = await Promise.all(
          companyData.social_media_links.map(async (link, index) => {
            let logoUrl = link.logo;
            
            if (state.socialMediaLogoFiles[index]) {
              const validation = validateImageFile(state.socialMediaLogoFiles[index]!);
              if (!validation.valid) {
                throw new Error(`Invalid logo for ${link.platform_name}: ${validation.error}`);
              }
              
              const uploadResult = await uploadImageToSupabase(state.socialMediaLogoFiles[index]!, 'company-logos', 'social-media-logo');
              if (!uploadResult.success) {
                throw new Error(`Failed to upload logo for ${link.platform_name}: ${uploadResult.error}`);
              }
              
              logoUrl = uploadResult.url!;
            }
            
            return {
              ...link,
              logo: logoUrl
            };
          })
        );
      } catch (uploadError) {
        console.error('Error uploading social media logos:', uploadError);
        set({ loading: false });
        return { success: false, error: uploadError instanceof Error ? uploadError.message : 'Failed to upload social media logos' };
      }
      
      const supabase = createClient();
      const { error } = await supabase
        .from('admin-settings')
        .insert([{
          company_name: companyData.company_name,
          company_logo: logoUrl,
          company_address: companyData.company_address,
          contacts: companyData.contacts,
          social_media_links: updatedSocialMediaLinks
        }]);
      
      if (error) {
        console.error('Error adding company:', error);
        set({ loading: false });
        return { success: false, error: 'Failed to add company. Please try again.' };
      }
      
      // Refresh the data
      await get().fetchCompanies();
      set({ loading: false });
      return { success: true };
    } catch (err) {
      console.error('Unexpected error:', err);
      set({ loading: false });
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  },

  updateCompany: async (id: string, companyData: FormData) => {
    set({ loading: true });
    
    try {
      const state = get();
      let logoUrl = companyData.company_logo;
      
      // Handle image upload if logoFile exists
      if (state.logoFile) {
        // Validate the image file
        const validation = validateImageFile(state.logoFile);
        if (!validation.valid) {
          set({ loading: false });
          return { success: false, error: validation.error };
        }
        
        // Upload image to Supabase Storage
        const uploadResult = await uploadImageToSupabase(state.logoFile);
        if (!uploadResult.success) {
          set({ loading: false });
          return { success: false, error: uploadResult.error };
        }
        
        logoUrl = uploadResult.url!;
        
        // If updating and there was a previous logo, delete the old one
        const currentCompany = state.companies.find(company => company.id === id);
        if (currentCompany?.company_logo && currentCompany.company_logo !== companyData.company_logo) {
          // Only delete if it's a Supabase storage URL (contains the bucket name)
          if (currentCompany.company_logo.includes('supabase') || currentCompany.company_logo.includes('storage')) {
            await deleteImageFromSupabase(currentCompany.company_logo);
          }
        }
      }

      // Handle social media logo uploads
      let updatedSocialMediaLinks;
      try {
        updatedSocialMediaLinks = await Promise.all(
          companyData.social_media_links.map(async (link, index) => {
            let logoUrl = link.logo;
            
            if (state.socialMediaLogoFiles[index]) {
              const validation = validateImageFile(state.socialMediaLogoFiles[index]!);
              if (!validation.valid) {
                throw new Error(`Invalid logo for ${link.platform_name}: ${validation.error}`);
              }
              
              const uploadResult = await uploadImageToSupabase(state.socialMediaLogoFiles[index]!, 'company-logos', 'social-media-logo');
              if (!uploadResult.success) {
                throw new Error(`Failed to upload logo for ${link.platform_name}: ${uploadResult.error}`);
              }
              
              logoUrl = uploadResult.url!;
            }
            
            return {
              ...link,
              logo: logoUrl
            };
          })
        );
      } catch (uploadError) {
        console.error('Error uploading social media logos:', uploadError);
        set({ loading: false });
        return { success: false, error: uploadError instanceof Error ? uploadError.message : 'Failed to upload social media logos' };
      }
      
      const supabase = createClient();
      const { error } = await supabase
        .from('admin-settings')
        .update({
          company_name: companyData.company_name,
          company_logo: logoUrl,
          company_address: companyData.company_address,
          contacts: companyData.contacts,
          social_media_links: updatedSocialMediaLinks
        })
        .eq('id', id);
      
      if (error) {
        console.error('Error updating company:', error);
        set({ loading: false });
        return { success: false, error: 'Failed to update company. Please try again.' };
      }
      
      // Refresh the data
      await get().fetchCompanies();
      set({ loading: false });
      return { success: true };
    } catch (err) {
      console.error('Unexpected error:', err);
      set({ loading: false });
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  },

  deleteCompany: async (id: string) => {
    set({ loading: true });
    
    try {
      const state = get();
      const companyToDelete = state.companies.find(company => company.id === id);
      
      // Delete the company logo from storage if it exists
      if (companyToDelete?.company_logo) {
        // Only delete if it's a Supabase storage URL
        if (companyToDelete.company_logo.includes('supabase') || companyToDelete.company_logo.includes('storage')) {
          await deleteImageFromSupabase(companyToDelete.company_logo);
        }
      }
      
      const supabase = createClient();
      const { error } = await supabase
        .from('admin-settings')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting company:', error);
        set({ loading: false });
        return { success: false, error: 'Failed to delete company. Please try again.' };
      }
      
      // Refresh the data
      await get().fetchCompanies();
      set({ loading: false });
      return { success: true };
    } catch (err) {
      console.error('Unexpected error:', err);
      set({ loading: false });
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  },

  // UI Actions
  openAddDrawer: () => {
    set({
      isDrawerOpen: true,
      isEditMode: false,
      editingCompanyId: null,
      formData: initialFormData,
      logoFile: null,
      logoPreview: null
    });
  },

  openEditDrawer: (companyId: string) => {
    const company = get().companies.find(c => c.id === companyId);
    if (company) {
      // Create social media logo previews from existing data
      const socialMediaLogoPreviews: { [index: number]: string | null } = {};
      company.social_media_links.forEach((link, index) => {
        // Only set preview if this specific link has a logo
        if (link.logo && link.logo.trim() !== '' && link.logo !== '""' && link.logo !== 'null') {
          socialMediaLogoPreviews[index] = link.logo.replace(/"/g, '');
        }
      });
      
      // Debug: Log the previews to see what's being set
      console.log('Setting social media logo previews:', socialMediaLogoPreviews);

      set({
        isDrawerOpen: true,
        isEditMode: true,
        editingCompanyId: companyId,
        formData: {
          company_name: company.company_name,
          company_logo: company.company_logo,
          company_address: {
            street: company.company_address.street,
            city: company.company_address.city,
            state: company.company_address.state,
            zip_code: company.company_address.zip_code,
            country: company.company_address.country
          },
          contacts: {
            email: company.contacts.email,
            phone: company.contacts.phone
          },
          social_media_links: company.social_media_links
        },
        logoPreview: company.company_logo ? company.company_logo.replace(/"/g, '') : null,
        socialMediaLogoFiles: {},
        socialMediaLogoPreviews: socialMediaLogoPreviews
      });
    }
  },

  closeDrawer: () => {
    set({
      isDrawerOpen: false,
      isEditMode: false,
      editingCompanyId: null,
      formData: initialFormData,
      logoFile: null,
      logoPreview: null,
      socialMediaLogoFiles: {},
      socialMediaLogoPreviews: {}
    });
  },

  openDeleteModal: (company: CompanyData) => {
    set({
      deleteModalOpen: true,
      companyToDelete: company
    });
  },

  closeDeleteModal: () => {
    set({
      deleteModalOpen: false,
      companyToDelete: null
    });
  },

  // Form Actions
  setFormData: (data: Partial<FormData>) => {
    set(state => ({
      formData: { ...state.formData, ...data }
    }));
  },

  resetForm: () => {
    set({
      formData: initialFormData,
      logoFile: null,
      logoPreview: null,
      socialMediaLogoFiles: {},
      socialMediaLogoPreviews: {}
    });
  },

  setLogoFile: (file: File | null) => {
    set({ logoFile: file });
  },

  setLogoPreview: (preview: string | null) => {
    set({ logoPreview: preview });
  },

  setSocialMediaLogoFile: (index: number, file: File | null) => {
    set(state => ({
      socialMediaLogoFiles: {
        ...state.socialMediaLogoFiles,
        [index]: file
      }
    }));
  },

  setSocialMediaLogoPreview: (index: number, preview: string | null) => {
    console.log(`Setting social media logo preview for index ${index}:`, preview);
    set(state => ({
      socialMediaLogoPreviews: {
        ...state.socialMediaLogoPreviews,
        [index]: preview
      }
    }));
  },

  handleInputChange: (field: string, value: string, nestedField?: string) => {
    set(state => {
      if (nestedField) {
        return {
          formData: {
            ...state.formData,
            [field]: {
              ...(state.formData[field as keyof FormData] as Record<string, string>),
              [nestedField]: value
            }
          }
        };
      } else {
        return {
          formData: {
            ...state.formData,
            [field]: value
          }
        };
      }
    });
  },

  handleSocialMediaChange: (index: number, field: 'platform_name' | 'url' | 'logo', value: string) => {
    set(state => {
      const newSocialLinks = [...state.formData.social_media_links];
      newSocialLinks[index] = { ...newSocialLinks[index], [field]: value };
      return {
        formData: {
          ...state.formData,
          social_media_links: newSocialLinks
        }
      };
    });
  },

  addSocialMediaLink: () => {
    set(state => ({
      formData: {
        ...state.formData,
        social_media_links: [...state.formData.social_media_links, { platform_name: "", url: "", logo: "" }]
      }
    }));
  },

  removeSocialMediaLink: (index: number) => {
    set(state => {
      // Don't allow removing the last social media link
      if (state.formData.social_media_links.length <= 1) {
        return state; // Return unchanged state
      }
      
      return {
        formData: {
          ...state.formData,
          social_media_links: state.formData.social_media_links.filter((_, i) => i !== index)
        }
      };
    });
  }
}));

// Sidebar UI collapse/expand shared store
type SidebarState = {
  collapsed: boolean;
  toggle: () => void;
  setCollapsed: (value: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  collapsed: false,
  toggle: () => set((s) => ({ collapsed: !s.collapsed })),
  setCollapsed: (value: boolean) => set({ collapsed: value }),
}));