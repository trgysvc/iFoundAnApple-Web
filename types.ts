import { translations } from './constants';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  password_hash?: string; // In a real app, never store plain text passwords
  role: UserRole;
  // Extended profile information
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
  tc_kimlik_no?: string;
  phone_number?: string;
  address?: string;
  iban?: string;
  bank_info?: string; // Legacy field
  updated_at: string;
  created_at: string;
}

export enum DeviceStatus {
  LOST = 'lost', // Owner adds device
  REPORTED = 'reported', // Finder adds device
  MATCHED = 'matched', // System finds a match
  PAYMENT_PENDING = 'payment_pending', // Owner needs to pay
  PAYMENT_COMPLETE = 'payment_complete', // Owner has paid
  EXCHANGE_PENDING = 'exchange_pending', // Physical exchange in progress
  COMPLETED = 'completed', // Exchange confirmed by both
}

export interface Device {
  id: string;
  userId: string; // The ID of the user who owns/reported the device
  model: string;
  serialNumber: string;
  color: string;
  invoiceDataUrl?: string; // Storing as base64 data URL for localStorage friendliness
  description?: string;
  status: DeviceStatus;
  rewardAmount?: number;
  exchangeConfirmedBy?: string[]; // Array of user IDs who confirmed
}

export interface AppNotification {
  id: string;
  user_id: string;
  message_key: keyof (typeof translations.en.notifications);
  link: string; // e.g., /device/deviceId
  is_read: boolean;
  created_at: string; // ISO string
  replacements?: Record<string, string | number>;
}