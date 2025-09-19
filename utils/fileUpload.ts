import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zokkxkyhabihxjskdcfg.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpva2t4a3loYWJpaHhqc2tkY2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MTQyMDMsImV4cCI6MjA3MTE5MDIwM30.Dvnl7lUwezVDGY9I6IIgfoJXWtaw1Un_idOxTlI0xwQ";

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export interface FileUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload a file to Supabase Storage
 * @param file - File to upload
 * @param bucket - Storage bucket name
 * @param folder - Folder path within bucket
 * @param userId - User ID for organizing files
 * @returns Upload result with URL or error
 */
export const uploadFileToStorage = async (
  file: File,
  bucket: string,
  folder: string,
  userId: string
): Promise<FileUploadResult> => {
  try {
    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: "File size exceeds 10MB limit"
      };
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'application/pdf'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: "Invalid file type. Only JPEG, PNG, WebP and PDF files are allowed."
      };
    }

    // Generate unique file name
    const fileExtension = file.name.split('.').pop();
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `${folder}/${userId}/${timestamp}_${randomString}.${fileExtension}`;

    console.log("uploadFileToStorage: Uploading file:", fileName);

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600', // 1 hour cache
        upsert: false // Don't overwrite existing files
      });

    if (error) {
      console.error("uploadFileToStorage: Upload error:", error);
      return {
        success: false,
        error: `Upload failed: ${error.message}`
      };
    }

    console.log("uploadFileToStorage: File uploaded successfully:", data);

    // For private buckets, we'll store the file path instead of public URL
    // The actual signed URL will be generated when needed
    const filePath = fileName;

    console.log("uploadFileToStorage: File path stored:", filePath);

    return {
      success: true,
      url: filePath // Store file path, not public URL
    };

  } catch (error) {
    console.error("uploadFileToStorage: Unexpected error:", error);
    return {
      success: false,
      error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

/**
 * Upload invoice document for a device
 * @param file - Invoice file to upload
 * @param userId - User ID who owns the device
 * @returns Upload result with URL or error
 */
export const uploadInvoiceDocument = async (
  file: File,
  userId: string
): Promise<FileUploadResult> => {
  return uploadFileToStorage(file, 'device-documents', 'invoices', userId);
};

/**
 * Delete a file from Supabase Storage
 * @param url - Public URL of the file to delete
 * @param bucket - Storage bucket name
 * @returns Success status
 */
export const deleteFileFromStorage = async (
  url: string,
  bucket: string
): Promise<boolean> => {
  try {
    // Extract file path from public URL
    const urlParts = url.split('/');
    const bucketIndex = urlParts.findIndex(part => part === bucket);
    if (bucketIndex === -1 || bucketIndex === urlParts.length - 1) {
      console.error("deleteFileFromStorage: Invalid URL format");
      return false;
    }
    
    const filePath = urlParts.slice(bucketIndex + 1).join('/');
    
    console.log("deleteFileFromStorage: Deleting file:", filePath);

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error("deleteFileFromStorage: Delete error:", error);
      return false;
    }

    console.log("deleteFileFromStorage: File deleted successfully");
    return true;

  } catch (error) {
    console.error("deleteFileFromStorage: Unexpected error:", error);
    return false;
  }
};

/**
 * Generate a secure signed URL for accessing private files
 * @param filePath - File path in storage (not public URL)
 * @param bucket - Storage bucket name
 * @param expiresIn - URL expiration time in seconds (default: 1 hour)
 * @returns Signed URL or null
 */
export const getSecureFileUrl = async (
  filePath: string,
  bucket: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<string | null> => {
  try {
    console.log("getSecureFileUrl: Generating signed URL for:", filePath);

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      console.error("getSecureFileUrl: Error generating signed URL:", error);
      return null;
    }

    if (!data.signedUrl) {
      console.error("getSecureFileUrl: No signed URL returned");
      return null;
    }

    console.log("getSecureFileUrl: Signed URL generated successfully");
    return data.signedUrl;

  } catch (error) {
    console.error("getSecureFileUrl: Unexpected error:", error);
    return null;
  }
};

/**
 * Get secure URL for invoice document
 * @param filePath - File path stored in database
 * @returns Signed URL valid for 1 hour
 */
export const getSecureInvoiceUrl = async (filePath: string): Promise<string | null> => {
  return getSecureFileUrl(filePath, 'device-documents', 3600); // 1 hour
};

/**
 * Get file info from Supabase Storage
 * @param filePath - File path in storage
 * @param bucket - Storage bucket name
 * @returns File info or null
 */
export const getFileInfo = async (filePath: string, bucket: string) => {
  try {
    const pathParts = filePath.split('/');
    const fileName = pathParts.pop();
    const folderPath = pathParts.join('/');
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folderPath);

    if (error) {
      console.error("getFileInfo: Error:", error);
      return null;
    }

    const fileInfo = data.find(file => file.name === fileName);
    return fileInfo || null;

  } catch (error) {
    console.error("getFileInfo: Unexpected error:", error);
    return null;
  }
};
