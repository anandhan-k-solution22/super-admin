import { createClient } from './supabase/client'

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

/**
 * Creates a storage bucket if it doesn't exist
 * @param supabase - Supabase client instance
 * @param bucketName - The bucket name to create
 * @returns Promise with creation result
 */
async function ensureBucketExists(supabase: any, bucketName: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('Error listing buckets:', listError)
      return { success: false, error: listError.message }
    }
    
    const bucketExists = buckets?.some((bucket: any) => bucket.name === bucketName)
    
    if (!bucketExists) {
      // Try to create the bucket with minimal configuration
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true
      })
      
      if (createError) {
        console.error('Error creating bucket:', createError)
        // If bucket creation fails due to RLS, we'll provide a helpful error message
        if (createError.message.includes('row-level security policy')) {
          return { 
            success: false, 
            error: `Storage bucket '${bucketName}' does not exist and cannot be created automatically due to security policies. Please create it manually in your Supabase dashboard.` 
          }
        }
        return { success: false, error: createError.message }
      }
      
      console.log(`Bucket '${bucketName}' created successfully`)
    }
    
    return { success: true }
  } catch (error) {
    console.error('Unexpected error ensuring bucket exists:', error)
    return { success: false, error: 'Failed to ensure bucket exists' }
  }
}

/**
 * Uploads an image file to Supabase Storage
 * @param file - The image file to upload
 * @param bucketName - The storage bucket name (default: 'company-logos')
 * @param folder - The folder path within the bucket (default: 'logos')
 * @returns Promise with upload result containing success status and URL
 */
export async function uploadImageToSupabase(
  file: File,
  bucketName: string = 'company-logos',
  folder: string = 'logos'
): Promise<UploadResult> {
  try {
    const supabase = createClient()
    
    // Try to ensure bucket exists (this might fail due to RLS)
    const bucketResult = await ensureBucketExists(supabase, bucketName)
    if (!bucketResult.success) {
      // If bucket creation fails, try to upload anyway (bucket might exist but creation failed due to RLS)
      console.warn('Bucket creation failed, attempting upload anyway:', bucketResult.error)
    }
    
    // Generate unique filename with timestamp and random string
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop()
    const fileName = `${timestamp}_${randomString}.${fileExtension}`
    const filePath = `${folder}/${fileName}`
    
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (error) {
      console.error('Error uploading image:', error)
      
      // Provide specific error messages for common issues
      if (error.message.includes('Bucket not found')) {
        return {
          success: false,
          error: `Storage bucket '${bucketName}' does not exist. Please create it manually in your Supabase dashboard under Storage section.`
        }
      }
      
      if (error.message.includes('row-level security policy')) {
        return {
          success: false,
          error: `Upload failed due to security policies. Please ensure the '${bucketName}' bucket exists and has proper permissions set in your Supabase dashboard.`
        }
      }
      
      return {
        success: false,
        error: `Failed to upload image: ${error.message}`
      }
    }
    
    // Get public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath)
    
    if (!urlData.publicUrl) {
      return {
        success: false,
        error: 'Failed to get public URL for uploaded image'
      }
    }
    
    return {
      success: true,
      url: urlData.publicUrl
    }
  } catch (error) {
    console.error('Unexpected error during image upload:', error)
    return {
      success: false,
      error: 'An unexpected error occurred during image upload'
    }
  }
}

/**
 * Deletes an image from Supabase Storage
 * @param imageUrl - The public URL of the image to delete
 * @param bucketName - The storage bucket name (default: 'company-logos')
 * @returns Promise with deletion result
 */
export async function deleteImageFromSupabase(
  imageUrl: string,
  bucketName: string = 'company-logos'
): Promise<UploadResult> {
  try {
    const supabase = createClient()
    
    // Extract file path from URL
    const url = new URL(imageUrl)
    const pathParts = url.pathname.split('/')
    const bucketIndex = pathParts.findIndex(part => part === bucketName)
    
    if (bucketIndex === -1) {
      return {
        success: false,
        error: 'Invalid image URL format'
      }
    }
    
    const filePath = pathParts.slice(bucketIndex + 1).join('/')
    
    // Delete file from Supabase Storage
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath])
    
    if (error) {
      console.error('Error deleting image:', error)
      return {
        success: false,
        error: `Failed to delete image: ${error.message}`
      }
    }
    
    return {
      success: true
    }
  } catch (error) {
    console.error('Unexpected error during image deletion:', error)
    return {
      success: false,
      error: 'An unexpected error occurred during image deletion'
    }
  }
}

/**
 * Validates if a file is a valid image
 * @param file - The file to validate
 * @returns boolean indicating if the file is valid
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Please select a valid image file (JPEG, PNG, GIF, or WebP)'
    }
  }
  
  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB in bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Image size must be less than 5MB'
    }
  }
  
  return { valid: true }
}
