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
  LOST = "lost", // Cihaz sahibi kayıp bildirimi
  REPORTED = "reported", // Bulan kişi buldu bildirimi
  MATCHED = "matched", // Cihaz eşleşiyor
  PAYMENT_PENDING = "payment_pending", // Cihazı kaybeden ödemesini yapıyor
  PAYMENT_COMPLETE = "payment_completed", // Ödeme emanet sisteminde bekletiliyor
  EXCHANGE_PENDING = "exchange_pending", // Değişim bekleniyor (eksikti)
  CARGO_SHIPPED = "cargo_shipped", // Cihazı bulan kargo firmasına kod ile teslim ediyor
  DELIVERED = "delivered", // Kargo firması cihazı sahibine teslim ediyor
  CONFIRMED = "confirmed", // Cihazın sahibi cihaz eline geçince onaylıyor
  COMPLETED = "completed", // İşlem tamamlanıyor
}

export interface Device {
  id: string;
  userId: string; // The ID of the user who owns/reported the device (maps to user_id in DB)
  model: string;
  serialNumber: string; // Maps to serialnumber in DB
  color: string;
  invoice_url?: string; // URL to invoice file in Supabase Storage
  invoiceDataUrl?: string; // Legacy field - will be removed after migration
  description?: string;
  status: DeviceStatus;
  rewardAmount?: number; // Maps to rewardamount in DB
  marketValue?: number; // AI estimated market value (maps to marketvalue in DB)
  exchangeConfirmedBy?: string[]; // Array of user IDs who confirmed (maps to exchangeconfirmedby in DB)
  lost_date?: string; // Date when the device was lost (YYYY-MM-DD format)
  lost_location?: string; // Location where the device was lost (free text description)
  
  // Yeni süreç için eklenen alanlar
  cargo_code_id?: string; // Kargo kod ID'si
  delivery_confirmed_at?: string; // Teslimat onay tarihi
  final_payment_distributed_at?: string; // Son ödeme dağıtım tarihi
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

// Yeni süreç için eklenen interface'ler

export interface CargoCode {
  id: string;
  device_id: string;
  payment_id: string;
  code: string; // Kargo firmasına verilecek kod
  generated_by: string; // Bulan kişi ID'si
  cargo_company: string; // Hangi kargo firması
  status: 'active' | 'used' | 'expired';
  expires_at?: string;
  used_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DeliveryConfirmation {
  id: string;
  device_id: string;
  payment_id: string;
  cargo_shipment_id: string;
  confirmed_by: string; // Cihaz sahibi ID'si
  confirmation_type: 'device_received' | 'device_verified' | 'exchange_confirmed';
  confirmation_data?: Record<string, any>; // Ek bilgiler (fotoğraf, notlar, vb.)
  confirmed_at: string;
  created_at: string;
}

export interface FinalPaymentDistribution {
  id: string;
  device_id: string;
  payment_id: string;
  escrow_account_id: string;
  
  // Dağıtım tutarları
  total_amount: number;
  gateway_fee: number;
  cargo_fee: number;
  reward_amount: number;
  service_fee: number;
  
  // Transfer bilgileri
  gateway_transfer_id?: string; // İyzico transfer ID
  cargo_transfer_id?: string; // Kargo firması transfer ID
  reward_transfer_id?: string; // Bulan kişi transfer ID
  service_transfer_id?: string; // Platform transfer ID
  
  // Durum
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processed_at?: string;
  failed_reason?: string;
  
  created_at: string;
  updated_at: string;
}

// Escrow Release Koşulları
export interface EscrowReleaseConditions {
  device_received: boolean;        // Cihaz teslim alındı
  device_verified: boolean;        // Cihaz doğrulandı
  exchange_confirmed: boolean;     // Değişim onaylandı
  auto_release_days?: number;     // Otomatik serbest bırakma (7 gün)
}
