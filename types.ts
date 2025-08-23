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
  bankInfo?: string; // For finders
}

export enum DeviceStatus {
  LOST = 'Lost', // Owner adds device
  REPORTED = 'Reported', // Finder adds device
  MATCHED = 'Matched', // System finds a match
  PAYMENT_PENDING = 'Payment Pending', // Owner needs to pay
  PAYMENT_COMPLETE = 'Payment Complete', // Owner has paid
  EXCHANGE_PENDING = 'Exchange Pending', // Physical exchange in progress
  COMPLETED = 'Completed', // Exchange confirmed by both
}

export interface Device {
  id: string;
  userId: string;
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
  userId: string;
  messageKey: keyof (typeof translations.en.notifications);
  link: string; // e.g., /device/deviceId
  isRead: boolean;
  createdAt: string; // ISO string
  replacements?: Record<string, string | number>;
}