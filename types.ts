import { translations } from "./constants.ts";

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export interface User {
  id: string;
  firstName?: string; // Ad
  lastName?: string; // Soyad
  fullName?: string; // Tam ad (geriye uyumluluk için)
  email: string;
  password_hash?: string; // In a real app, never store plain text passwords
  role: UserRole;
  // Extended profile information
  dateOfBirth?: string; // Doğum tarihi (YYYY-MM-DD)
  tcKimlikNo?: string; // TC Kimlik Numarası
  phoneNumber?: string; // Telefon Numarası
  address?: string; // Adres
  iban?: string; // IBAN numarası
  bankInfo?: string; // Eski alan - geriye uyumluluk için
}

// New interface for comprehensive user profile data
export interface UserProfile {
  id: string;
  user_id: string;
  first_name?: string; // Ad
  last_name?: string; // Soyad
  date_of_birth?: string; // Doğum tarihi (YYYY-MM-DD)
  tc_kimlik_no?: string;
  phone_number?: string;
  address?: string;
  iban?: string;
  bank_info?: string; // Legacy field
  updated_at: string;
  created_at: string;
}

export enum DeviceStatus {
  LOST = "lost", // Owner adds device
  REPORTED = "reported", // Finder adds device
  MATCHED = "matched", // System finds a match
  PAYMENT_PENDING = "payment_pending", // Owner needs to pay
  PAYMENT_COMPLETED = "payment_completed", // Owner has paid
  CARGO_SHIPPED = "cargo_shipped", // Device shipped by finder
  DELIVERED = "delivered", // Cargo delivered to owner
  CONFIRMED = "confirmed", // Owner confirmed receipt
  EXCHANGE_PENDING = "exchange_pending", // Physical exchange in progress
  COMPLETED = "completed", // Exchange confirmed by both
  DISPUTED = "disputed", // Dispute case
  CANCELLED = "cancelled", // Cancelled
  RETURNED = "returned", // Returned to sender
  FAILED_DELIVERY = "failed_delivery", // Delivery failed
}

export interface Device {
  id: string;
  userId: string; // The ID of the user who owns/reported the device (maps to user_id in DB)
  model: string;
  serialNumber: string; // Maps to serialnumber in DB
  color: string;
  invoice_url?: string; // URL to file in Supabase Storage: invoice for lost devices, device photos (comma-separated) for found devices
  invoiceDataUrl?: string; // Legacy field - will be removed after migration
  description?: string;
  status: DeviceStatus;
  rewardAmount?: number; // Maps to rewardamount in DB
  marketValue?: number; // AI estimated market value (maps to marketvalue in DB)
  exchangeConfirmedBy?: string[]; // Array of user IDs who confirmed (maps to exchangeconfirmedby in DB)
  lost_date?: string; // Date when the device was lost (YYYY-MM-DD format)
  lost_location?: string; // Location where the device was lost (free text description)
  found_date?: string; // Date when the device was found (YYYY-MM-DD format)
  found_location?: string; // Location where the device was found (free text description)
}

export interface AppNotification {
  id: string;
  user_id: string;
  message_key: keyof typeof translations.en.notifications;
  link: string; // e.g., /device/deviceId
  is_read: boolean;
  created_at: string; // ISO string
  replacements?: Record<string, string | number>;
}
