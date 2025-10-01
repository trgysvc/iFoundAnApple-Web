/**
 * Invoice Management Utilities
 * Enhanced security and tracking for invoice documents
 */

import { createClient } from "@supabase/supabase-js";
import { getSecureConfig, secureLogger } from "./security.ts";

const { supabaseUrl, supabaseAnonKey } = getSecureConfig();
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface InvoiceMetadata {
  id: string;
  userId: string;
  deviceId: string;
  fileName: string;
  originalFileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  deviceModel?: string;
  status: "pending" | "verified" | "rejected";
  verifiedBy?: string;
  verificationNotes?: string;
}

/**
 * Log invoice upload for audit trail
 */
export const logInvoiceUpload = async (
  metadata: Omit<InvoiceMetadata, "id" | "uploadedAt" | "status">
) => {
  try {
    const { data, error } = await supabase.from("invoice_logs").insert([
      {
        ...metadata,
        status: "pending",
        uploaded_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      secureLogger.error("Error logging invoice upload", error);
      return null;
    }

    secureLogger.info("Invoice upload logged successfully");
    return data;
  } catch (error) {
    secureLogger.error("Unexpected error logging invoice", error);
    return null;
  }
};

/**
 * Get invoice statistics for admin dashboard
 */
export const getInvoiceStats = async () => {
  try {
    const { data, error } = await supabase
      .from("invoice_logs")
      .select("status")
      .order("uploaded_at", { ascending: false });

    if (error) {
      secureLogger.error("Error fetching invoice stats", error);
      return null;
    }

    const stats = {
      total: data.length,
      pending: data.filter((item) => item.status === "pending").length,
      verified: data.filter((item) => item.status === "verified").length,
      rejected: data.filter((item) => item.status === "rejected").length,
    };

    return stats;
  } catch (error) {
    secureLogger.error("Unexpected error fetching invoice stats", error);
    return null;
  }
};

/**
 * Parse invoice filename to extract metadata
 */
export const parseInvoiceFileName = (fileName: string) => {
  // Format: invoice_{userId}_{date}_{deviceModel}_{timestamp}_{random}.{ext}
  const parts = fileName.split("_");

  if (parts.length >= 5 && parts[0] === "invoice") {
    return {
      userId: parts[1],
      date: parts[2],
      deviceModel: parts[3],
      timestamp: parts[4],
      isValid: true,
    };
  }

  return {
    isValid: false,
    error: "Invalid invoice filename format",
  };
};

/**
 * Generate secure invoice filename
 */
export const generateInvoiceFileName = (
  userId: string,
  deviceModel: string,
  fileExtension: string
): string => {
  const timestamp = Date.now();
  const dateStr = new Date().toISOString().split("T")[0].replace(/-/g, "");
  const randomString = Math.random().toString(36).substring(2, 8);

  // Sanitize device model
  const sanitizedDeviceModel = deviceModel
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, 20)
    .toLowerCase();

  return `invoice_${userId}_${dateStr}_${sanitizedDeviceModel}_${timestamp}_${randomString}.${fileExtension}`;
};

/**
 * Security validation for invoice files
 */
export const validateInvoiceFile = (
  file: File
): { valid: boolean; error?: string } => {
  // File type validation
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error:
        "Invalid file type. Only PDF, JPEG, PNG, and WebP files are allowed.",
    };
  }

  // File size validation (max 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: "File size exceeds 10MB limit.",
    };
  }

  // File name validation
  if (file.name.length > 255) {
    return {
      valid: false,
      error: "File name is too long.",
    };
  }

  // Check for suspicious file names
  const suspiciousPatterns = [
    /\.\./, // Directory traversal
    /[<>:"\/\\|?*]/, // Invalid characters
    /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i, // Windows reserved names
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(file.name)) {
      return {
        valid: false,
        error: "File name contains invalid characters.",
      };
    }
  }

  return { valid: true };
};

export default {
  logInvoiceUpload,
  getInvoiceStats,
  parseInvoiceFileName,
  generateInvoiceFileName,
  validateInvoiceFile,
};
