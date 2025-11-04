# Backend Entegrasyon Dokümantasyonu

Bu dokümantasyon, **iFoundAnApple-Web** frontend projesi için ayrı bir backend repository açarken gerekli tüm bilgileri içerir.

## 📋 İçindekiler

1. [Proje Bilgileri](#proje-bilgileri)
2. [Veritabanı Şeması](#veritabanı-şeması)
3. [API Endpoint'leri](#api-endpointleri)
4. [Veri Modelleri](#veri-modelleri)
5. [Konfigürasyon](#konfigürasyon)
6. [Ödeme Gateway Entegrasyonu](#ödeme-gateway-entegrasyonu)
7. [Paynet Entegrasyonu](#paynet-entegrasyonu)
8. [Kargo API Entegrasyonu](#kargo-api-entegrasyonu)
9. [Admin Paneli API'leri](#admin-paneli-apileri)
10. [Webhook Endpoint'leri](#webhook-endpointleri)
11. [Güvenlik Gereksinimleri](#güvenlik-gereksinimleri)
12. [Local Test ve Geliştirme](#local-test-ve-geliştirme)
13. [Örnek API İstekleri](#örnek-api-istekleri)

---

## 📦 Proje Bilgileri

### Proje Adı
**iFoundAnApple** - Lost & Found Platform for Apple Devices

### Versiyon
**Frontend Version:** 2.2.0

### Proje Tipi
- Frontend: React + TypeScript + Vite (SPA)
- Backend: Supabase (PostgreSQL + Auth + Storage)
- Ödeme Gateway: İyzico, Paynet (sandbox/production)
- Kargo Entegrasyonu: Kargo API'leri (MNG, Yurtiçi, Aras, vb.)
- Admin Paneli: Backend üzerinden yönetim paneli

### Repository Bilgileri
- **Frontend Repo:** `iFoundAnApple-Web`
- **Backend Repo:** (Yeni oluşturulacak)
- **Database:** Supabase PostgreSQL (cloud-hosted)

---

## 🗄️ Veritabanı Şeması

### Veritabanı Yönetimi
- **Provider:** Supabase (PostgreSQL)
- **Schema:** `public`
- **RLS:** Row Level Security aktif (tüm tablolarda)

### Önemli Tablolar ve İlişkiler

#### 1. **users** (Supabase Auth)
- Supabase Auth tarafından yönetilir
- Ek profil bilgileri için `userprofile` tablosu kullanılır

#### 2. **devices**
```sql
- id: uuid (PK)
- user_id: uuid (FK → auth.users)
- model: text
- serial_number: text
- status: text (DeviceStatus enum)
- color: text
- description: text
- reward_amount: numeric
- invoice_url: text (Supabase Storage URL)
- lost_date: date
- lost_location: text
- found_date: date
- found_location: text
- device_role: varchar(10) ('owner' | 'finder')
- created_at: timestamp
- updated_at: timestamp
```

**Status Değerleri:**
- `lost` - Sahip cihazı kaybetti
- `reported` - Bulan kişi cihazı bildirdi
- `matched` - Sistem eşleşme buldu
- `payment_pending` - Ödeme bekleniyor
- `payment_completed` - Ödeme tamamlandı
- `cargo_shipped` - Kargo gönderildi
- `delivered` - Teslim edildi
- `confirmed` - Sahip teslim aldı
- `completed` - İşlem tamamlandı
- `disputed` - İhtilaflı
- `cancelled` - İptal edildi
- `returned` - İade edildi
- `failed_delivery` - Teslimat başarısız

#### 3. **payments**
```sql
- id: uuid (PK)
- device_id: uuid (FK → devices)
- payer_id: uuid (FK → auth.users)
- receiver_id: uuid (FK → auth.users)
- total_amount: numeric(10,2)
- reward_amount: numeric(10,2)
- cargo_fee: numeric(10,2)
- payment_gateway_fee: numeric(10,2)
- service_fee: numeric(10,2)
- net_payout: numeric(10,2)
- payment_provider: varchar(50) ('iyzico' | 'stripe' | 'test')
- provider_payment_id: varchar(200)
- provider_transaction_id: varchar(200)
- provider_status: varchar(50)
- payment_status: varchar(20) ('pending' | 'processing' | 'completed' | 'failed')
- escrow_status: varchar(20) ('pending' | 'held' | 'released' | 'refunded')
- payment_method: varchar(50)
- currency: varchar(3) ('TRY')
- payer_info: jsonb
- device_info: jsonb
- billing_address: jsonb
- shipping_address: jsonb
- created_at: timestamp
- updated_at: timestamp
- completed_at: timestamp
```

#### 4. **escrow_accounts**
```sql
- id: uuid (PK)
- payment_id: uuid (FK → payments)
- device_id: uuid (FK → devices)
- holder_user_id: uuid (FK → auth.users)
- beneficiary_user_id: uuid (FK → auth.users)
- total_amount: numeric(10,2)
- reward_amount: numeric(10,2)
- service_fee: numeric(10,2)
- gateway_fee: numeric(10,2)
- cargo_fee: numeric(10,2)
- net_payout: numeric(10,2)
- status: varchar(20) ('pending' | 'held' | 'released' | 'refunded')
- release_conditions: jsonb
- confirmations: jsonb
- created_at: timestamp
- held_at: timestamp
- released_at: timestamp
- refunded_at: timestamp
```

#### 5. **device_models**
```sql
- id: uuid (PK)
- name: text
- model_name: varchar(100)
- category: varchar(50)
- repair_price: numeric(10,2)
- ifoundanapple_fee: numeric(10,2)
- fee_percentage: numeric(5,2) (default: 10.00)
- is_active: boolean
- created_at: timestamp
- updated_at: timestamp
```

#### 6. **cargo_shipments**
```sql
- id: uuid (PK)
- device_id: uuid (FK → devices)
- payment_id: uuid (FK → payments)
- cargo_company: varchar(50)
- tracking_number: varchar(100)
- sender_user_id: uuid (FK → auth.users)
- receiver_user_id: uuid (FK → auth.users)
- sender_address_encrypted: text
- receiver_address_encrypted: text
- status: varchar(30) ('created' | 'picked_up' | 'in_transit' | 'delivered' | 'failed')
- cargo_fee: numeric(8,2)
- created_at: timestamp
- updated_at: timestamp
```

#### 7. **userprofile**
```sql
- id: uuid (PK)
- user_id: uuid (FK → auth.users) UNIQUE
- first_name: varchar(100)
- last_name: varchar(100)
- tc_kimlik_no: varchar(11) (encrypted)
- phone_number: varchar(20)
- address: text (encrypted)
- iban: varchar(34) (encrypted)
- date_of_birth: date
- created_at: timestamp
- updated_at: timestamp
```

#### 8. **notifications**
```sql
- id: uuid (PK)
- user_id: uuid (FK → auth.users)
- message_key: text
- link: text
- is_read: boolean
- replacements: jsonb
- created_at: timestamp
```

#### 9. **audit_logs**
```sql
- id: uuid (PK)
- event_type: varchar(50)
- event_category: varchar(30)
- event_action: varchar(30)
- event_severity: varchar(20)
- user_id: uuid
- resource_type: varchar(50)
- resource_id: uuid
- old_values: jsonb
- new_values: jsonb
- event_description: text
- event_data: jsonb
- created_at: timestamp
```

### Detaylı Veritabanı Şeması
Tüm tablo yapıları, RLS politikaları ve foreign key ilişkileri için:
📄 **`database/COMPLETE_DATABASE_SCHEMA.md`** dosyasına bakın.

---

## 🔌 API Endpoint'leri

### Base URL
```
Production: https://your-backend-domain.com/api
Development: http://localhost:3001/api
```

### Authentication
Tüm endpoint'ler (public olanlar hariç) Supabase JWT token gerektirir:
```
Authorization: Bearer <supabase_jwt_token>
```

### 1. Health Check
```
GET /api/health
Response: { status: 'ok', message: 'Payment Server çalışıyor' }
```

### 2. Ücret Hesaplama
```
POST /api/calculate-fees
Request Body:
{
  deviceModelId?: string;
  deviceModelName?: string;
  customRewardAmount?: number;
}

Response:
{
  rewardAmount: number;
  cargoFee: number;
  serviceFee: number;
  gatewayFee: number;
  totalAmount: number;
  netPayout: number;
  originalRepairPrice: number;
  deviceModel: string;
  category: string;
}
```

### 3. Ödeme İşleme
```
POST /api/process-payment
Request Body:
{
  deviceId: string;
  payerId: string;
  receiverId?: string;
  feeBreakdown: {
    rewardAmount: number;
    cargoFee: number;
    serviceFee: number;
    gatewayFee: number;
    totalAmount: number;
    netPayout: number;
  };
  deviceInfo: {
    model: string;
    serialNumber: string;
    description?: string;
  };
  payerInfo: {
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      district: string;
      postalCode: string;
    };
  };
  paymentProvider?: 'iyzico' | 'paynet' | 'stripe' | 'test';
}

Response:
{
  success: boolean;
  paymentId?: string;
  escrowId?: string;
  providerPaymentId?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'held';
  errorMessage?: string;
  redirectUrl?: string;
  providerResponse?: any;
}
```

### 4. Escrow Serbest Bırakma
```
POST /api/release-escrow
Request Body:
{
  paymentId: string;
  deviceId: string;
  releaseReason: string;
  confirmedBy?: string;
}

Response:
{
  success: boolean;
  escrowId?: string;
  status?: string;
  releasedAt?: string;
  errorMessage?: string;
}
```

### 5. Ödeme İptal
```
POST /api/cancel-transaction
Request Body:
{
  paymentId: string;
  reason: string;
}

Response:
{
  success: boolean;
  paymentId?: string;
  status?: string;
  cancelledAt?: string;
  errorMessage?: string;
}
```

### 6. Ödeme İade
```
POST /api/refund-transaction
Request Body:
{
  paymentId: string;
  amount?: number; // Partial refund için
  reason: string;
}

Response:
{
  success: boolean;
  refundId?: string;
  status?: string;
  refundedAt?: string;
  errorMessage?: string;
}
```

### 7. İhtilaf Başlatma
```
POST /api/dispute-transaction
Request Body:
{
  paymentId: string;
  deviceId: string;
  reason: string;
  description: string;
}

Response:
{
  success: boolean;
  disputeId?: string;
  status?: string;
  errorMessage?: string;
}
```

---

## 📐 Veri Modelleri

### TypeScript Interfaces

#### User
```typescript
enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email: string;
  role: UserRole;
  dateOfBirth?: string;
  tcKimlikNo?: string;
  phoneNumber?: string;
  address?: string;
  iban?: string;
}
```

#### Device
```typescript
enum DeviceStatus {
  LOST = "lost",
  REPORTED = "reported",
  MATCHED = "matched",
  PAYMENT_PENDING = "payment_pending",
  PAYMENT_COMPLETED = "payment_completed",
  CARGO_SHIPPED = "cargo_shipped",
  DELIVERED = "delivered",
  CONFIRMED = "confirmed",
  EXCHANGE_PENDING = "exchange_pending",
  COMPLETED = "completed",
  DISPUTED = "disputed",
  CANCELLED = "cancelled",
  RETURNED = "returned",
  FAILED_DELIVERY = "failed_delivery",
}

interface Device {
  id: string;
  userId: string;
  model: string;
  serialNumber: string;
  color: string;
  invoice_url?: string;
  description?: string;
  status: DeviceStatus;
  rewardAmount?: number;
  marketValue?: number;
  exchangeConfirmedBy?: string[];
  lost_date?: string;
  lost_location?: string;
  found_date?: string;
  found_location?: string;
  device_role?: 'owner' | 'finder';
}
```

#### Payment
```typescript
interface Payment {
  id: string;
  device_id: string;
  payer_id: string;
  receiver_id?: string;
  total_amount: number;
  reward_amount: number;
  cargo_fee: number;
  payment_gateway_fee: number;
  service_fee: number;
  net_payout: number;
  payment_provider: 'iyzico' | 'paynet' | 'stripe' | 'test';
  provider_payment_id?: string;
  provider_transaction_id?: string;
  payment_status: 'pending' | 'processing' | 'completed' | 'failed';
  escrow_status: 'pending' | 'held' | 'released' | 'refunded';
  payment_method?: string;
  currency: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}
```

#### FeeBreakdown
```typescript
interface FeeBreakdown {
  rewardAmount: number;
  cargoFee: number;
  serviceFee: number;
  gatewayFee: number;
  totalAmount: number;
  netPayout: number;
  originalRepairPrice: number;
  deviceModel: string;
  category: string;
}
```

**Tüm TypeScript tipleri için:** 📄 **`types.ts`** dosyasına bakın.

---

## ⚙️ Konfigürasyon

### Environment Variables

#### Supabase
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### İyzico Payment Gateway
```env
VITE_IYZICO_API_KEY=your-iyzico-api-key
VITE_IYZICO_SECRET_KEY=your-iyzico-secret-key
VITE_IYZICO_BASE_URL=https://sandbox-api.iyzipay.com
VITE_IYZICO_CALLBACK_URL=https://your-domain.com/api/webhooks/iyzico-callback
```

#### Paynet Payment Gateway
```env
PAYNET_API_URL=https://api.paynet.com.tr
PAYNET_MERCHANT_ID=your-merchant-id
PAYNET_API_KEY=your-api-key
PAYNET_SECRET_KEY=your-secret-key
PAYNET_CALLBACK_URL=https://your-domain.com/api/webhooks/paynet-callback
PAYNET_FAILURE_URL=https://your-domain.com/payment-failed
PAYNET_SUCCESS_URL=https://your-domain.com/payment-success
```

#### Stripe (Opsiyonel)
```env
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
VITE_STRIPE_SECRET_KEY=your-stripe-secret-key
VITE_STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

#### Kargo API'leri
```env
# MNG Kargo
MNG_API_URL=https://api.mngkargo.com.tr
MNG_API_KEY=your-mng-api-key
MNG_API_SECRET=your-mng-api-secret

# Yurtiçi Kargo
YURTICI_API_URL=https://api.yurticikargo.com
YURTICI_API_KEY=your-yurtici-api-key
YURTICI_API_SECRET=your-yurtici-api-secret

# Aras Kargo
ARAS_API_URL=https://api.araskargo.com.tr
ARAS_API_KEY=your-aras-api-key
ARAS_API_SECRET=your-aras-api-secret

# Kargo Webhook Secret
CARGO_WEBHOOK_SECRET=your-webhook-secret
```

#### Google Gemini AI (Opsiyonel)
```env
VITE_GEMINI_API_KEY=your-gemini-api-key
```

#### Encryption
```env
VITE_ENCRYPTION_KEY=your-encryption-key (32 karakter hex)
```

### Ücret Hesaplama Sabitleri
```typescript
const FIXED_FEES = {
  CARGO_FEE: 250.0,                    // TL
  GATEWAY_FEE_PERCENTAGE: 3.43,        // %
  REWARD_PERCENTAGE: 20,               // %
  MIN_REWARD_AMOUNT: 100,              // TL
  MAX_REWARD_AMOUNT: 5000,              // TL
};
```

### Ücret Hesaplama Formülü
```
totalAmount = ifoundanapple_fee (device_models tablosundan)
gatewayFee = totalAmount * 0.0343 (%3.43)
cargoFee = 250.00 TL (sabit)
rewardAmount = totalAmount * 0.20 (%20)
serviceFee = totalAmount - gatewayFee - cargoFee - rewardAmount
netPayout = rewardAmount
```

---

## 💳 Ödeme Gateway Entegrasyonu

### İyzico Entegrasyonu

#### Ödeme İsteği Oluşturma
```typescript
import Iyzipay from 'iyzipay';

const iyzico = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri: process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com'
});

const request = {
  locale: Iyzipay.LOCALE.TR,
  conversationId: paymentId,
  price: amount.toFixed(2),
  paidPrice: amount.toFixed(2),
  currency: 'TRY',
  installment: 1,
  basketId: paymentId,
  paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
  paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
  callbackUrl: `${CALLBACK_URL}?conversationId=${paymentId}`,
  buyer: {
    id: buyerId,
    name: buyerName,
    surname: buyerSurname,
    email: buyerEmail,
    gsmNumber: buyerPhone,
    identityNumber: buyerTCKimlik,
    city: buyerCity,
    country: 'Turkey',
    address: buyerAddress,
    zipCode: buyerZipCode
  },
  billingAddress: { /* ... */ },
  shippingAddress: { /* ... */ },
  basketItems: [/* ... */]
};

iyzico.payment.create(request, (err, result) => {
  // Handle response
});
```

#### Ödeme Durumu Sorgulama
```typescript
iyzico.payment.retrieve({
  locale: Iyzipay.LOCALE.TR,
  conversationId: paymentId,
  paymentId: paymentId
}, (err, result) => {
  // Handle response
});
```

#### İade İşlemi
```typescript
iyzico.cancel.create({
  locale: Iyzipay.LOCALE.TR,
  conversationId: paymentId,
  paymentId: paymentId,
  ip: requestIp
}, (err, result) => {
  // Handle response
});
```

**Detaylı İyzico entegrasyonu için:** 📄 **`utils/iyzicoConfig.ts`** dosyasına bakın.

---

## 💳 Paynet Entegrasyonu

### Paynet Ödeme Sistemi

Paynet, Türkiye'de yaygın kullanılan bir ödeme gateway'idir. Platform bağımsız REST API servisleri sunar ve escrow (emanet) sistemi desteği sağlar. [Paynet API Dokümantasyonu](https://doc.paynet.com.tr/)

### Paynet Gereksinimleri

Paynet API kullanımı için gerekli bilgiler:
- **API Anahtarı**: Paynet API KEY gereklidir ([odeme.paynet.com.tr](https://odeme.paynet.com.tr) veya [email protected] üzerinden talep edilebilir)
- **Statik IP Adresi**: Paynet hizmetlerine erişim için statik IP adresi gereklidir
- **Güvenli İletişim**: TLS 1.1 ve TLS 1.2 protokolleri desteklenir
- **Authentication**: `secret_key` ile Basic Authentication kullanılır

### Paynet Konfigürasyonu

```env
# Paynet Configuration
PAYNET_API_URL=https://api.paynet.com.tr
PAYNET_API_KEY=your-api-key
PAYNET_SECRET_KEY=your-secret-key
PAYNET_CALLBACK_URL=https://your-domain.com/api/webhooks/paynet-callback
PAYNET_FAILURE_URL=https://your-domain.com/payment-failed
PAYNET_SUCCESS_URL=https://your-domain.com/payment-success

# Test Environment (if available)
PAYNET_TEST_API_URL=https://test-api.paynet.com.tr
PAYNET_TEST_API_KEY=your-test-api-key
PAYNET_TEST_SECRET_KEY=your-test-secret-key
```

### Paynet Ödeme Metotları

Paynet, farklı ödeme entegrasyon yöntemleri sunar:
1. **API Entegrasyonu**: REST API servisleri ile entegrasyon (önerilen backend için)
   - 3D Secure ile ödeme
   - 3D Secure olmadan ödeme (tek çekim, taksitli, saklı kart)
   - PayLink entegrasyonu
2. **PayLink**: SMS/E-posta ile gönderilen güvenli ödeme linki
3. **Hazır Form**: JavaScript ile eklenen hazır ödeme formu
4. **Özelleştirilebilir Form**: Kendi tasarımınıza uygun ödeme formu

**Backend için önerilen:** API Entegrasyonu yöntemi, escrow desteği ve tam kontrol sağladığı için tercih edilmelidir.

### Paynet Ödeme İşleme Endpoint'i

#### Escrow ile Ödeme (Önerilen)

Escrow sistemi için ödeme isteğinde `is_escrow: true` parametresi gönderilmelidir. Bu sayede ödeme ana firma onayıyla gerçekleşir.

```
POST /api/process-payment-paynet
Headers:
  Authorization: Basic <base64(secret_key:)>
  Content-Type: application/json

Request Body:
{
  deviceId: string;
  payerId: string;
  receiverId?: string;
  feeBreakdown: {
    rewardAmount: number;
    cargoFee: number;
    serviceFee: number;
    gatewayFee: number;
    totalAmount: number;
    netPayout: number;
  };
  deviceInfo: {
    model: string;
    serialNumber: string;
    description?: string;
  };
  payerInfo: {
    name: string;
    email: string;
    phone: string;
    tcKimlikNo?: string;
    address: {
      street: string;
      city: string;
      district: string;
      postalCode: string;
    };
  };
  isEscrow: boolean; // true = Escrow işlemi, false = Normal ödeme
}

Response:
{
  success: boolean;
  paymentId?: string;
  escrowId?: string;
  providerPaymentId?: string;
  providerTransactionId?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  errorMessage?: string;
  redirectUrl?: string; // 3D Secure için yönlendirme URL'i
  providerResponse?: any;
}
```

#### Paynet API Ödeme İsteği Formatı

```typescript
// Paynet API ödeme isteği örneği
interface PaynetPaymentRequest {
  amount: number;                    // Ödeme tutarı (TL)
  currency: string;                  // "TRY"
  order_id: string;                 // Benzersiz sipariş ID
  customer: {
    name: string;
    surname: string;
    email: string;
    phone: string;
    tc_no?: string;                 // TC Kimlik No (opsiyonel)
    address: string;
    city: string;
    district?: string;
    postal_code?: string;
  };
  payment_method: {
    card_number?: string;            // Kart numarası (3D Secure olmadan)
    card_holder_name?: string;
    card_expiry_month?: string;
    card_expiry_year?: string;
    card_cvv?: string;
    installments?: number;           // Taksit sayısı
  };
  is_escrow: boolean;                // Escrow işlemi için true
  callback_url: string;             // Webhook callback URL
  success_url: string;              // Başarılı ödeme sonrası yönlendirme
  failure_url: string;             // Başarısız ödeme sonrası yönlendirme
  items?: Array<{                   // Sepet ürünleri
    name: string;
    quantity: number;
    price: number;
  }>;
}

// Basic Authentication ile API çağrısı
const response = await fetch('https://api.paynet.com.tr/api/payment', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(paynetRequest)
});
```

### Paynet Ödeme Durumu Sorgulama

```
POST /api/check-paynet-payment-status
Headers:
  Authorization: Basic <base64(secret_key:)>
  Content-Type: application/json

Request Body:
{
  paymentId: string;              // Paynet transaction ID
  orderId?: string;               // Sistem order ID (opsiyonel)
}

Response:
{
  success: boolean;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  paymentDate?: string;
  transactionId?: string;
  orderId?: string;
  amount?: number;
  currency?: string;
  isEscrow?: boolean;
  escrowStatus?: 'pending' | 'released' | 'refunded';
  errorMessage?: string;
  providerResponse?: any;
}
```

#### Paynet API Transaction Sorgulama

```typescript
// Paynet transaction sorgulama
const response = await fetch(`https://api.paynet.com.tr/api/transaction/${transactionId}`, {
  method: 'GET',
  headers: {
    'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
    'Content-Type': 'application/json'
  }
});
```

### Paynet İptal/İade İşlemi

Paynet API'de iptal ve iade işlemleri ayrı endpoint'ler olarak sunulur.

#### İptal İşlemi (Tam İade)

```
POST /api/cancel-paynet-payment
Headers:
  Authorization: Basic <base64(secret_key:)>
  Content-Type: application/json

Request Body:
{
  paymentId: string;              // Paynet transaction ID
  orderId?: string;               // Sistem order ID
  reason: string;                 // İptal nedeni
}

Response:
{
  success: boolean;
  refundId?: string;
  status?: 'cancelled';
  cancelledAt?: string;
  errorMessage?: string;
  providerResponse?: any;
}
```

#### İade İşlemi (Kısmi veya Tam İade)

```
POST /api/refund-paynet-payment
Headers:
  Authorization: Basic <base64(secret_key:)>
  Content-Type: application/json

Request Body:
{
  paymentId: string;              // Paynet transaction ID
  orderId?: string;               // Sistem order ID
  amount?: number;                // İade tutarı (belirtilmezse tam iade)
  reason: string;                 // İade nedeni
}

Response:
{
  success: boolean;
  refundId?: string;
  refundAmount?: number;
  status?: 'refunded' | 'partial_refunded';
  refundedAt?: string;
  errorMessage?: string;
  providerResponse?: any;
}
```

#### Paynet API İptal/İade Örneği

```typescript
// İptal işlemi
const cancelResponse = await fetch(`https://api.paynet.com.tr/api/transaction/${transactionId}/cancel`, {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    reason: 'Customer request'
  })
});

// İade işlemi (kısmi veya tam)
const refundResponse = await fetch(`https://api.paynet.com.tr/api/transaction/${transactionId}/refund`, {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    amount: refundAmount, // Belirtilmezse tam iade
    reason: 'Customer request'
  })
});
```

### Paynet Escrow Serbest Bırakma

Escrow işlemlerinde, ödeme tamamlandıktan sonra belirli koşullar sağlandığında (cihaz teslim edildi, onaylandı vb.) escrow'dan para serbest bırakılmalıdır.

```
POST /api/release-paynet-escrow
Headers:
  Authorization: Basic <base64(secret_key:)>
  Content-Type: application/json

Request Body:
{
  paymentId: string;              // Paynet transaction ID
  escrowId: string;              // Sistem escrow ID
  releaseReason: string;         // Serbest bırakma nedeni
  confirmedBy?: string;           // Onaylayan kullanıcı ID
}

Response:
{
  success: boolean;
  escrowId?: string;
  releasedAt?: string;
  status?: 'released';
  errorMessage?: string;
  providerResponse?: any;
}
```

#### Paynet Escrow Release API

```typescript
// Paynet escrow serbest bırakma (Paynet API dokümantasyonuna göre)
// Not: Paynet'in escrow release endpoint'i dokümantasyonda belirtilmemiş olabilir
// Bu durumda Paynet destek ekibiyle iletişime geçilmelidir

// Alternatif: Cari Hesap Entegrasyonu kullanılabilir (escrow benzeri)
const releaseResponse = await fetch(`https://api.paynet.com.tr/api/escrow/${transactionId}/release`, {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    reason: releaseReason
  })
});
```

### Paynet Webhook Handler

Paynet, ödeme durumu değişikliklerini webhook ile bildirir.

```
POST /api/webhooks/paynet-callback
Headers:
  x-paynet-signature?: <signature>    // Paynet webhook signature (varsa)
  Content-Type: application/json

Request Body:
{
  transaction_id: string;
  order_id: string;
  status: 'success' | 'failure' | 'pending' | 'cancelled';
  amount: number;
  currency: string;
  transaction_date: string;
  is_escrow?: boolean;
  escrow_status?: 'pending' | 'released' | 'refunded';
  // ... diğer Paynet alanları
}

Response:
{
  success: boolean;
  message: string;
  transactionId: string;
  status: string;
}
```

### Paynet Signature Doğrulama

```typescript
import crypto from 'crypto';

function verifyPaynetWebhook(signature: string, body: string, timestamp?: string): boolean {
  const secretKey = process.env.PAYNET_SECRET_KEY;
  
  // Paynet webhook signature doğrulama yöntemi dokümantasyonda belirtilmemiş olabilir
  // Paynet destek ekibiyle doğrulama yöntemi teyit edilmelidir
  
  // Örnek HMAC-SHA256 doğrulama (Paynet'in kullandığı yöntem değişebilir)
  if (timestamp) {
    const message = `${timestamp}.${body}`;
    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(message);
    const expectedSignature = hmac.digest('hex');
    return signature === expectedSignature;
  }
  
  // Sadece body ile doğrulama (alternatif)
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(body);
  const expectedSignature = hmac.digest('hex');
  return signature === expectedSignature;
}
```

### Paynet Servisleri

Paynet API aşağıdaki servisleri sunar:
- **İşlem (Transaction)**: Ödeme işlemleri
- **İptal/İade (Cancellation/Refund)**: İptal ve iade işlemleri
- **Oran (Rate)**: Komisyon oranları sorgulama
- **Bayi (Agent)**: Bayi yönetimi
- **Abonelik (Subscription)**: Tekrarlayan ödemeler
- **Kart Saklama (Card Save)**: Müşteri kartlarını güvenli saklama
- **Cari Hesap Entegrasyonu**: Escrow benzeri cari hesap işlemleri
- **Fatura**: Fatura oluşturma ve yönetimi
- **Başvuru**: API erişim başvurusu

### Paynet Test Kartları

Paynet test ortamında kullanılabilecek test kartları dokümantasyonda belirtilmiştir. [Test Kartları](https://doc.paynet.com.tr/genel-bilgiler/test-kartlari) sayfasına bakın.

### Paynet Hata Kodları

Paynet API hata kodları ve açıklamaları için [Hata Kodları](https://doc.paynet.com.tr/genel-bilgiler/hata-kodlari) sayfasına bakın.

### Ödeme Gateway Seçimi

`payment_provider` alanına göre ödeme gateway'i seçilmeli:
- `'iyzico'` → İyzico API kullanılır
- `'paynet'` → Paynet API kullanılır
- `'stripe'` → Stripe API kullanılır
- `'test'` → Test modu (mock payment)

---

## 📦 Kargo API Entegrasyonu

### Kargo Şirketleri

Sistemde desteklenen kargo şirketleri `cargo_companies` tablosunda tutulur:
- MNG Kargo
- Yurtiçi Kargo
- Aras Kargo
- Sürat Kargo
- PTT Kargo
- ve diğerleri...

### Kargo API Endpoint'leri

#### 1. Kargo Şirketlerini Listele
```
GET /api/cargo/companies
Response:
{
  success: boolean;
  companies: Array<{
    id: string;
    code: string;
    name: string;
    api_endpoint?: string;
    tracking_url_template: string;
    standard_delivery_days: number;
    express_delivery_days: number;
    base_fee: number;
    express_fee_multiplier: number;
    is_active: boolean;
  }>;
}
```

#### 2. Kargo Ücreti Hesapla
```
POST /api/cargo/calculate-fee
Request Body:
{
  cargoCompanyCode: string;
  serviceType: 'standard' | 'express' | 'same_day';
  declaredValue?: number;
  packageWeight?: number;
  packageDimensions?: string;
}

Response:
{
  success: boolean;
  cargoFee: number;
  estimatedDeliveryDays: number;
  serviceType: string;
}
```

#### 3. Kargo Gönderisi Oluştur
```
POST /api/cargo/create-shipment
Request Body:
{
  deviceId: string;
  paymentId: string;
  cargoCompanyCode: string;
  serviceType: 'standard' | 'express';
  senderUserId: string;
  receiverUserId: string;
  senderAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    postalCode: string;
  };
  receiverAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    postalCode: string;
  };
  declaredValue: number;
  packageWeight?: number;
  packageDimensions?: string;
  specialInstructions?: string;
}

Response:
{
  success: boolean;
  shipmentId?: string;
  trackingNumber?: string;
  cargoLabelUrl?: string; // Kargo etiketi PDF URL'i
  cargoFee?: number;
  estimatedDeliveryDays?: number;
  errorMessage?: string;
}
```

#### 4. Kargo Takip Sorgula
```
GET /api/cargo/track/{trackingNumber}
Query Parameters:
  cargoCompanyCode: string (required)

Response:
{
  success: boolean;
  trackingNumber: string;
  cargoCompany: string;
  status: 'created' | 'label_printed' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed' | 'returned';
  currentLocation?: string;
  estimatedDeliveryDate?: string;
  events: Array<{
    timestamp: string;
    location: string;
    status: string;
    description: string;
  }>;
  deliveredAt?: string;
  deliveredTo?: string;
  errorMessage?: string;
}
```

#### 5. Kargo Durumu Güncelle (Webhook)
```
POST /api/cargo/webhook/{cargoCompanyCode}
Request Body:
{
  trackingNumber: string;
  status: string;
  location?: string;
  timestamp: string;
  description?: string;
  // Kargo şirketine özel ek alanlar
}

Response:
{
  success: boolean;
  message: string;
  shipmentId?: string;
}
```

#### 6. Teslimat Onayı
```
POST /api/cargo/confirm-delivery
Request Body:
{
  shipmentId: string;
  userId: string;
  signature?: string; // Dijital imza veya fotoğraf URL'i
  photos?: string[]; // Teslimat fotoğrafları URL'leri
  notes?: string;
}

Response:
{
  success: boolean;
  confirmationId?: string;
  confirmedAt?: string;
  errorMessage?: string;
}
```

### Kargo API Entegrasyonu Gereksinimleri

#### MNG Kargo API
```typescript
// MNG Kargo API örneği
interface MNGKargoRequest {
  referenceNumber: string;
  sender: MNGAddress;
  receiver: MNGAddress;
  cargo: {
    weight: number;
    declaredValue: number;
    serviceType: 'standard' | 'express';
  };
}

// API çağrısı
const mngResponse = await fetch('https://api.mngkargo.com.tr/shipment/create', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${MNG_API_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(mngRequest)
});
```

#### Yurtiçi Kargo API
```typescript
// Yurtiçi Kargo API örneği
const yurticiResponse = await fetch('https://api.yurticikargo.com/shipment', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${YURTICI_AUTH}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(yurticiRequest)
});
```

### Kargo Şirketi Konfigürasyonu

```env
# MNG Kargo
MNG_API_URL=https://api.mngkargo.com.tr
MNG_API_KEY=your-mng-api-key
MNG_API_SECRET=your-mng-api-secret

# Yurtiçi Kargo
YURTICI_API_URL=https://api.yurticikargo.com
YURTICI_API_KEY=your-yurtici-api-key
YURTICI_API_SECRET=your-yurtici-api-secret

# Aras Kargo
ARAS_API_URL=https://api.araskargo.com.tr
ARAS_API_KEY=your-aras-api-key
ARAS_API_SECRET=your-aras-api-secret

# Kargo Webhook Secret
CARGO_WEBHOOK_SECRET=your-webhook-secret
```

### Anonim Kargo Sistemi

Kargo gönderilerinde gönderen ve alıcı bilgileri şifrelenmiş olarak saklanır ve anonim ID'ler kullanılır:
- `sender_anonymous_id`: "FND" + random ID (örn: FND-ABC123)
- `receiver_anonymous_id`: "OWN" + random ID (örn: OWN-XYZ789)

Bu ID'ler kargo takip sayfasında gösterilir ve gerçek kullanıcı bilgileri gizlenir.

---

## 👨‍💼 Admin Paneli API'leri

### Admin Yetkilendirme

Admin paneli için `admin_permissions` tablosu kullanılır. Kullanıcıların admin rolü ve yetkileri bu tabloda tutulur.

### Admin API Endpoint'leri

#### 1. Admin Girişi
```
POST /api/admin/login
Request Body:
{
  email: string;
  password: string;
}

Response:
{
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    role: 'admin' | 'super_admin';
    permissions: Record<string, boolean>;
  };
  errorMessage?: string;
}
```

#### 2. Dashboard İstatistikleri
```
GET /api/admin/dashboard/stats
Headers:
  Authorization: Bearer <admin_token>

Response:
{
  success: boolean;
  stats: {
    totalUsers: number;
    totalDevices: number;
    activeDevices: number;
    matchedDevices: number;
    completedTransactions: number;
    pendingPayments: number;
    totalRevenue: number;
    pendingEscrows: number;
    activeCargoShipments: number;
    disputes: number;
  };
  period: {
    startDate: string;
    endDate: string;
  };
}
```

#### 3. Kullanıcı Yönetimi

##### Kullanıcıları Listele
```
GET /api/admin/users
Query Parameters:
  page?: number (default: 1)
  limit?: number (default: 20)
  search?: string
  role?: 'user' | 'admin'
  status?: 'active' | 'banned' | 'suspended'

Response:
{
  success: boolean;
  users: Array<User>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

##### Kullanıcı Detayı
```
GET /api/admin/users/{userId}
Response:
{
  success: boolean;
  user: User;
  profile: UserProfile;
  devices: Device[];
  payments: Payment[];
  statistics: {
    totalDevices: number;
    totalPayments: number;
    totalEarnings: number;
    rating: number;
  };
}
```

##### Kullanıcı Durumu Güncelle
```
PATCH /api/admin/users/{userId}/status
Request Body:
{
  status: 'active' | 'banned' | 'suspended';
  reason?: string;
}

Response:
{
  success: boolean;
  message: string;
}
```

#### 4. Cihaz Yönetimi

##### Cihazları Listele
```
GET /api/admin/devices
Query Parameters:
  page?: number
  limit?: number
  status?: DeviceStatus
  search?: string
  dateFrom?: string
  dateTo?: string

Response:
{
  success: boolean;
  devices: Array<Device>;
  pagination: Pagination;
}
```

##### Cihaz Durumu Manuel Güncelle
```
PATCH /api/admin/devices/{deviceId}/status
Request Body:
{
  status: DeviceStatus;
  reason: string;
  notes?: string;
}

Response:
{
  success: boolean;
  device: Device;
  message: string;
}
```

#### 5. Ödeme ve Escrow Yönetimi

##### Ödemeleri Listele
```
GET /api/admin/payments
Query Parameters:
  page?: number
  limit?: number
  status?: string
  paymentProvider?: string
  dateFrom?: string
  dateTo?: string

Response:
{
  success: boolean;
  payments: Array<Payment>;
  pagination: Pagination;
  summary: {
    totalAmount: number;
    totalCompleted: number;
    totalPending: number;
    totalFailed: number;
  };
}
```

##### Escrow Manuel Serbest Bırakma
```
POST /api/admin/escrow/release
Request Body:
{
  escrowId: string;
  reason: string;
  adminNotes?: string;
}

Response:
{
  success: boolean;
  escrowId?: string;
  releasedAt?: string;
  errorMessage?: string;
}
```

##### Ödeme İade (Admin)
```
POST /api/admin/payments/{paymentId}/refund
Request Body:
{
  amount?: number; // Full refund için belirtilmez
  reason: string;
  adminNotes?: string;
}

Response:
{
  success: boolean;
  refundId?: string;
  refundedAt?: string;
  errorMessage?: string;
}
```

#### 6. İhtilaf Yönetimi

##### İhtilafları Listele
```
GET /api/admin/disputes
Query Parameters:
  status?: 'open' | 'in_review' | 'resolved' | 'closed'
  page?: number
  limit?: number

Response:
{
  success: boolean;
  disputes: Array<{
    id: string;
    paymentId: string;
    deviceId: string;
    initiatorUserId: string;
    reason: string;
    description: string;
    status: string;
    createdAt: string;
    resolvedAt?: string;
    resolution?: string;
  }>;
  pagination: Pagination;
}
```

##### İhtilaf Çözümü
```
POST /api/admin/disputes/{disputeId}/resolve
Request Body:
{
  resolution: 'refund_payer' | 'release_to_beneficiary' | 'partial_refund' | 'reject';
  resolutionAmount?: number; // Partial refund için
  adminNotes: string;
}

Response:
{
  success: boolean;
  disputeId?: string;
  resolution?: string;
  resolvedAt?: string;
  errorMessage?: string;
}
```

#### 7. Kargo Yönetimi

##### Kargo Gönderilerini Listele
```
GET /api/admin/cargo/shipments
Query Parameters:
  status?: CargoStatus
  cargoCompany?: string
  page?: number
  limit?: number

Response:
{
  success: boolean;
  shipments: Array<CargoShipment>;
  pagination: Pagination;
}
```

##### Kargo Durumu Manuel Güncelle
```
PATCH /api/admin/cargo/shipments/{shipmentId}/status
Request Body:
{
  status: CargoStatus;
  trackingNumber?: string;
  notes?: string;
}

Response:
{
  success: boolean;
  shipment: CargoShipment;
  message: string;
}
```

#### 8. Sistem Ayarları

##### Cihaz Model Ücretlerini Güncelle
```
PATCH /api/admin/device-models/{modelId}/fees
Request Body:
{
  repairPrice?: number;
  ifoundanappleFee?: number;
  feePercentage?: number;
}

Response:
{
  success: boolean;
  model: DeviceModel;
  message: string;
}
```

##### Kargo Şirketi Ayarları
```
GET /api/admin/cargo/companies
Response:
{
  success: boolean;
  companies: Array<CargoCompany>;
}

PATCH /api/admin/cargo/companies/{companyId}
Request Body:
{
  name?: string;
  baseFee?: number;
  expressFeeMultiplier?: number;
  standardDeliveryDays?: number;
  expressDeliveryDays?: number;
  isActive?: boolean;
  apiEndpoint?: string;
  trackingUrlTemplate?: string;
}

Response:
{
  success: boolean;
  company: CargoCompany;
}
```

#### 9. Audit Log ve Raporlama

##### Audit Logları Listele
```
GET /api/admin/audit-logs
Query Parameters:
  eventType?: string
  eventCategory?: string
  userId?: string
  resourceType?: string
  resourceId?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number

Response:
{
  success: boolean;
  logs: Array<AuditLog>;
  pagination: Pagination;
}
```

##### Finansal Raporlar
```
GET /api/admin/reports/financial
Query Parameters:
  period: 'daily' | 'weekly' | 'monthly' | 'yearly'
  dateFrom?: string
  dateTo?: string

Response:
{
  success: boolean;
  report: {
    period: string;
    totalRevenue: number;
    totalPayments: number;
    completedPayments: number;
    failedPayments: number;
    totalEscrows: number;
    releasedEscrows: number;
    refundedEscrows: number;
    totalCargoFees: number;
    totalServiceFees: number;
    totalGatewayFees: number;
    breakdown: Array<{
      date: string;
      revenue: number;
      payments: number;
    }>;
  };
}
```

#### 10. Güvenlik ve İzleme

##### Güvenlik Dashboard
```
GET /api/admin/security/dashboard
Response:
{
  success: boolean;
  security: {
    failedLoginAttempts: number;
    suspiciousActivities: number;
    blockedIPs: number;
    activeSessions: number;
    recentSecurityEvents: Array<SecurityEvent>;
  };
}
```

##### Sistem Performans Metrikleri
```
GET /api/admin/system/metrics
Response:
{
  success: boolean;
  metrics: {
    apiResponseTime: number;
    databaseQueryTime: number;
    activeUsers: number;
    apiRequestsPerMinute: number;
    errorRate: number;
    systemUptime: number;
  };
}
```

### Admin Yetki Kontrolü

Tüm admin endpoint'lerinde yetki kontrolü yapılmalı:

```typescript
// Middleware örneği
async function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const user = await verifyAdminToken(token);
  
  if (!user || user.role !== 'admin' && user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  req.admin = user;
  next();
}

// Özel yetki kontrolü
async function requirePermission(permission: string) {
  return async (req, res, next) => {
    if (!req.admin.permissions[permission]) {
      return res.status(403).json({ error: `Permission required: ${permission}` });
    }
    next();
  };
}
```

### Admin Panel Özellikleri

- **Kullanıcı Yönetimi**: Kullanıcı listeleme, detay görüntüleme, durum değiştirme
- **Cihaz Yönetimi**: Cihaz listeleme, durum güncelleme, manuel eşleştirme
- **Ödeme Yönetimi**: Ödeme takibi, escrow yönetimi, manuel iade
- **İhtilaf Yönetimi**: İhtilaf çözümleme, karar verme
- **Kargo Yönetimi**: Kargo takibi, durum güncelleme
- **Raporlama**: Finansal raporlar, istatistikler, audit loglar
- **Sistem Ayarları**: Ücret yönetimi, kargo şirketi ayarları
- **Güvenlik**: Güvenlik izleme, şüpheli aktivite takibi

---

## 🔔 Webhook Endpoint'leri

### İyzico Webhook
```
POST /api/webhooks/iyzico-callback
Headers:
  x-iyzico-signature: <signature>
  Content-Type: application/json

Request Body:
{
  paymentId: string;
  conversationId: string;
  status: 'success' | 'failure';
  paidPrice?: string;
  currency?: string;
  // ... diğer İyzico alanları
}

Response:
{
  success: boolean;
  message: string;
  paymentId: string;
  status: string;
}
```

### Webhook Signature Doğrulama
```typescript
import crypto from 'crypto';

function verifyIyzicoWebhook(signature: string, body: string): boolean {
  const secretKey = process.env.IYZICO_SECRET_KEY;
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(body);
  const expectedSignature = hmac.digest('base64');
  return signature === expectedSignature;
}
```

**Detaylı webhook handler için:** 📄 **`api/webhooks/iyzico-callback.ts`** dosyasına bakın.

### 3D Secure Callback
```
POST /api/webhooks/iyzico-3d-callback
```
İyzico 3D Secure doğrulamasından sonra yönlendirilen endpoint.

---

## 🔒 Güvenlik Gereksinimleri

### Row Level Security (RLS)
Tüm tablolarda RLS aktif olmalı. Kullanıcılar sadece kendi verilerine erişebilir.

### Authentication
- Supabase JWT token ile authentication
- Token'lar her request'te `Authorization` header'ında gönderilmeli

### Data Encryption
- TC Kimlik No: Şifrelenmiş saklanmalı
- IBAN: Şifrelenmiş saklanmalı
- Adres Bilgileri: Şifrelenmiş saklanmalı (cargo_shipments)

### Input Validation
- Email format kontrolü
- TC Kimlik No algoritma kontrolü (11 haneli, doğrulama algoritması)
- IBAN format kontrolü (TR ile başlayan 26 haneli, Mod 97)
- Telefon numarası format kontrolü (Türkiye formatı)
- Seri numarası format kontrolü

**Validation fonksiyonları için:** 📄 **`utils/security.ts`** dosyasına bakın.

### Rate Limiting
- API endpoint'lerinde rate limiting uygulanmalı
- Ödeme işlemlerinde özellikle dikkatli olunmalı

### Audit Logging
Tüm önemli işlemler `audit_logs` tablosuna kaydedilmeli:
- Ödeme işlemleri
- Escrow işlemleri
- Cihaz durumu değişiklikleri
- Kullanıcı işlemleri

---

## 🧪 Local Test ve Geliştirme

### Backend Kurulumu

#### 1. Proje Oluşturma
```bash
# Yeni backend projesi oluştur
mkdir iFoundAnApple-Back
cd iFoundAnApple-Back

# npm ile proje başlat
npm init -y

# TypeScript ve temel bağımlılıkları yükle
npm install express cors dotenv
npm install -D typescript @types/node @types/express @types/cors ts-node nodemon
```

#### 2. TypeScript Konfigürasyonu
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### 3. package.json Scripts
```json
{
  "scripts": {
    "dev": "nodemon --watch src --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.ts"
  }
}
```

### Local Test Araçları

#### 1. Postman Collection
Postman ile API testleri için collection oluşturun:

```json
// postman_collection.json örneği
{
  "info": {
    "name": "iFoundAnApple Backend API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:3001/api/health",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3001",
          "path": ["api", "health"]
        }
      }
    }
  ]
}
```

#### 2. REST Client (VS Code Extension)
VS Code'da REST Client extension'ı kullanarak test dosyaları oluşturun:

```http
# tests/api.http

### Health Check
GET http://localhost:3001/api/health

### Calculate Fees
POST http://localhost:3001/api/calculate-fees
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "deviceModelName": "iPhone 14 Pro"
}

### Process Payment (Test Mode)
POST http://localhost:3001/api/process-payment
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "deviceId": "test-device-id",
  "payerId": "test-user-id",
  "feeBreakdown": {
    "rewardAmount": 500,
    "cargoFee": 250,
    "serviceFee": 750,
    "gatewayFee": 85.75,
    "totalAmount": 1585.75,
    "netPayout": 500
  },
  "deviceInfo": {
    "model": "iPhone 14 Pro",
    "serialNumber": "TEST123"
  },
  "payerInfo": {
    "name": "Test User",
    "email": "test@example.com",
    "phone": "05551234567",
    "address": {
      "street": "Test Street",
      "city": "İstanbul",
      "district": "Kadıköy",
      "postalCode": "34000"
    }
  },
  "paymentProvider": "test"
}
```

#### 3. cURL ile Test
```bash
# Health check
curl http://localhost:3001/api/health

# Calculate fees
curl -X POST http://localhost:3001/api/calculate-fees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"deviceModelName": "iPhone 14 Pro"}'

# Process payment (test mode)
curl -X POST http://localhost:3001/api/process-payment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "deviceId": "test-device-id",
    "payerId": "test-user-id",
    "feeBreakdown": {
      "rewardAmount": 500,
      "cargoFee": 250,
      "serviceFee": 750,
      "gatewayFee": 85.75,
      "totalAmount": 1585.75,
      "netPayout": 500
    },
    "deviceInfo": {
      "model": "iPhone 14 Pro",
      "serialNumber": "TEST123"
    },
    "payerInfo": {
      "name": "Test User",
      "email": "test@example.com",
      "phone": "05551234567",
      "address": {
        "street": "Test Street",
        "city": "İstanbul",
        "district": "Kadıköy",
        "postalCode": "34000"
      }
    },
    "paymentProvider": "test"
  }'
```

#### 4. npm Script ile Otomatik Test
```json
// package.json
{
  "scripts": {
    "test:api": "node scripts/test-api.js",
    "test:integration": "jest --testPathPattern=integration",
    "test:unit": "jest --testPathPattern=unit"
  }
}
```

```javascript
// scripts/test-api.js
const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testHealthCheck() {
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check:', response.data);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
  }
}

async function testCalculateFees() {
  try {
    const response = await axios.post(`${BASE_URL}/calculate-fees`, {
      deviceModelName: 'iPhone 14 Pro'
    });
    console.log('✅ Calculate fees:', response.data);
  } catch (error) {
    console.error('❌ Calculate fees failed:', error.message);
  }
}

async function runTests() {
  console.log('🧪 Running API tests...\n');
  await testHealthCheck();
  await testCalculateFees();
  console.log('\n✨ Tests completed!');
}

runTests();
```

### Test Ortamı Konfigürasyonu

#### .env.test
```env
# Test Environment
NODE_ENV=test
PORT=3001

# Supabase Test
SUPABASE_URL=your-test-supabase-url
SUPABASE_ANON_KEY=your-test-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-test-service-key

# Payment Gateway Test
IYZICO_API_KEY=test-api-key
IYZICO_SECRET_KEY=test-secret-key
IYZICO_BASE_URL=https://sandbox-api.iyzipay.com

PAYNET_API_KEY=test-api-key
PAYNET_SECRET_KEY=test-secret-key
PAYNET_API_URL=https://test-api.paynet.com.tr

# Cargo API Test
MNG_API_KEY=test-api-key
MNG_API_SECRET=test-secret-key

# Test Mode
PAYMENT_PROVIDER=test
```

### Mock Servisler

#### Mock Payment Gateway
```typescript
// src/services/mocks/paymentMock.ts
export const mockPaymentGateway = {
  processPayment: async (request: PaymentRequest) => {
    // Simüle edilmiş ödeme işlemi
    return {
      success: true,
      paymentId: `mock_${Date.now()}`,
      status: 'completed',
      providerResponse: { mock: true }
    };
  },
  
  checkStatus: async (paymentId: string) => {
    return {
      success: true,
      status: 'completed',
      paymentId
    };
  },
  
  refund: async (paymentId: string, amount?: number) => {
    return {
      success: true,
      refundId: `refund_${Date.now()}`,
      status: 'refunded'
    };
  }
};
```

#### Mock Cargo API
```typescript
// src/services/mocks/cargoMock.ts
export const mockCargoAPI = {
  createShipment: async (request: ShipmentRequest) => {
    return {
      success: true,
      shipmentId: `mock_shipment_${Date.now()}`,
      trackingNumber: `MOCK${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      cargoLabelUrl: 'https://example.com/mock-label.pdf'
    };
  },
  
  trackShipment: async (trackingNumber: string) => {
    return {
      success: true,
      trackingNumber,
      status: 'in_transit',
      events: [
        {
          timestamp: new Date().toISOString(),
          location: 'İstanbul',
          status: 'picked_up',
          description: 'Package picked up'
        }
      ]
    };
  }
};
```

### Jest Test Örnekleri

```typescript
// tests/unit/paymentService.test.ts
import { PaymentService } from '../../src/services/paymentService';

describe('PaymentService', () => {
  let paymentService: PaymentService;

  beforeEach(() => {
    paymentService = new PaymentService();
  });

  test('should calculate fees correctly', async () => {
    const fees = await paymentService.calculateFees({
      deviceModelName: 'iPhone 14 Pro'
    });

    expect(fees).toHaveProperty('totalAmount');
    expect(fees.totalAmount).toBeGreaterThan(0);
    expect(fees.cargoFee).toBe(250);
  });

  test('should process test payment', async () => {
    const result = await paymentService.processPayment({
      deviceId: 'test-device',
      payerId: 'test-user',
      feeBreakdown: {
        totalAmount: 1000,
        rewardAmount: 200,
        cargoFee: 250,
        serviceFee: 550,
        gatewayFee: 0,
        netPayout: 200
      },
      deviceInfo: {
        model: 'iPhone 14 Pro',
        serialNumber: 'TEST123'
      },
      payerInfo: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '05551234567',
        address: {
          street: 'Test',
          city: 'İstanbul',
          district: 'Kadıköy',
          postalCode: '34000'
        }
      },
      paymentProvider: 'test'
    });

    expect(result.success).toBe(true);
    expect(result.paymentId).toBeDefined();
  });
});
```

### Integration Test Örnekleri

```typescript
// tests/integration/api.test.ts
import request from 'supertest';
import app from '../../src/app';

describe('API Integration Tests', () => {
  test('GET /api/health should return 200', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'ok');
  });

  test('POST /api/calculate-fees should calculate fees', async () => {
    const response = await request(app)
      .post('/api/calculate-fees')
      .send({ deviceModelName: 'iPhone 14 Pro' })
      .expect(200);

    expect(response.body).toHaveProperty('totalAmount');
    expect(response.body.totalAmount).toBeGreaterThan(0);
  });
});
```

### Hot Reload ile Geliştirme

#### nodemon.json
```json
{
  "watch": ["src"],
  "ext": "ts,json",
  "ignore": ["src/**/*.test.ts"],
  "exec": "ts-node src/index.ts",
  "env": {
    "NODE_ENV": "development"
  }
}
```

#### Kullanım
```bash
# Development mode (hot reload)
npm run dev

# Build ve production
npm run build
npm start
```

### Webhook Test için Local Tunnel

#### ngrok ile Webhook Test
```bash
# ngrok kurulumu
npm install -g ngrok

# Local server'ı expose et
ngrok http 3001

# Çıkan URL'i webhook callback URL olarak kullan
# Örn: https://abc123.ngrok.io/api/webhooks/paynet-callback
```

#### localtunnel ile Alternatif
```bash
# localtunnel kurulumu
npm install -g localtunnel

# Tunnel oluştur
lt --port 3001 --subdomain ifoundanapple-backend

# Çıkan URL: https://ifoundanapple-backend.loca.lt
```

### Test Veritabanı

#### Supabase Local Development
```bash
# Supabase CLI kurulumu
npm install -g supabase

# Local Supabase başlat
supabase start

# Migration'ları çalıştır
supabase db reset
```

### Debugging

#### VS Code launch.json
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "program": "${workspaceFolder}/src/index.ts",
      "runtimeExecutable": "ts-node",
      "restart": true,
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Test Komutları Özeti

```bash
# Development server (hot reload)
npm run dev

# Build
npm run build

# Production start
npm start

# Unit tests
npm test

# Integration tests
npm run test:integration

# Watch mode tests
npm run test:watch

# Coverage
npm run test:coverage

# Lint
npm run lint

# Format code
npm run format
```

### Örnek Test Senaryoları

1. **Health Check Test**
   ```bash
   curl http://localhost:3001/api/health
   ```

2. **Ücret Hesaplama Test**
   ```bash
   npm run test:api
   ```

3. **Test Payment (Mock)**
   ```bash
   # paymentProvider: "test" kullanarak gerçek ödeme yapmadan test
   ```

4. **Webhook Simulation**
   ```bash
   # Postman veya curl ile webhook endpoint'ine istek gönder
   curl -X POST http://localhost:3001/api/webhooks/paynet-callback \
     -H "Content-Type: application/json" \
     -d '{"transaction_id": "test123", "status": "success"}'
   ```

---

## 📝 Örnek API İstekleri

### 1. Ücret Hesaplama
```bash
curl -X POST http://localhost:3001/api/calculate-fees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "deviceModelName": "iPhone 14 Pro"
  }'
```

### 2. Ödeme İşleme
```bash
curl -X POST http://localhost:3001/api/process-payment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "deviceId": "device-uuid",
    "payerId": "user-uuid",
    "receiverId": "receiver-uuid",
    "feeBreakdown": {
      "rewardAmount": 500,
      "cargoFee": 250,
      "serviceFee": 750,
      "gatewayFee": 85.75,
      "totalAmount": 1585.75,
      "netPayout": 500
    },
    "deviceInfo": {
      "model": "iPhone 14 Pro",
      "serialNumber": "ABC123XYZ"
    },
    "payerInfo": {
      "name": "Ahmet Yılmaz",
      "email": "ahmet@example.com",
      "phone": "05551234567",
      "address": {
        "street": "Örnek Mahalle, Örnek Sokak No:1",
        "city": "İstanbul",
        "district": "Kadıköy",
        "postalCode": "34000"
      }
    },
    "paymentProvider": "iyzico"
  }'
```

### 3. Escrow Serbest Bırakma
```bash
curl -X POST http://localhost:3001/api/release-escrow \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "paymentId": "payment-uuid",
    "deviceId": "device-uuid",
    "releaseReason": "Device received and confirmed",
    "confirmedBy": "user-uuid"
  }'
```

---

## 🔗 Frontend-Backend Entegrasyon Noktaları

### Frontend'den Backend'e Çağrılar

Frontend'de şu dosyalar backend API'lerini çağırır:

1. **`api/calculate-fees.ts`** → `/api/calculate-fees`
2. **`api/process-payment.ts`** → `/api/process-payment`
3. **`api/release-escrow.ts`** → `/api/release-escrow`
4. **`api/cancel-transaction.ts`** → `/api/cancel-transaction`
5. **`api/refund-transaction.ts`** → `/api/refund-transaction`
6. **`api/dispute-transaction.ts`** → `/api/dispute-transaction`

### Supabase Client Kullanımı
Frontend direkt Supabase client kullanır:
- Authentication (sign up, sign in, sign out)
- Database queries (devices, payments, escrow_accounts, etc.)
- Real-time subscriptions
- File uploads (Supabase Storage)

Backend'de Supabase Service Role Key kullanılmalı (RLS bypass için gerekli yerlerde).

---

## 📚 Referans Dosyalar

### Frontend'deki Önemli Dosyalar

1. **Veritabanı Şeması:** `database/COMPLETE_DATABASE_SCHEMA.md`
2. **Type Definitions:** `types.ts`
3. **Konfigürasyon:** `utils/security.ts`
4. **Ödeme Gateway:** `utils/iyzicoConfig.ts`
5. **API Functions:** `api/*.ts`
6. **Webhook Handlers:** `api/webhooks/*.ts`
7. **Ücret Hesaplama:** `api/calculate-fees.ts`
8. **Proje Dokümantasyonu:** `README.md`

### İş Akışı Dokümantasyonu
- **`PROCESS_FLOW.md`** - İş akışı ve süreçler
- **`PROJECT_DESIGN_DOCUMENTATION.md`** - Proje tasarım dokümantasyonu

---

## 🚀 Backend Geliştirme Önerileri

### Teknoloji Önerileri
- **Framework:** Express.js veya Fastify
- **Database Client:** Supabase JS Client (@supabase/supabase-js)
- **Payment SDK:** İyzico Node.js SDK (iyzipay)
- **Validation:** Zod veya Joi
- **Error Handling:** Custom error handler middleware
- **Logging:** Winston veya Pino
- **Testing:** Jest veya Vitest

### Proje Yapısı Önerisi
```
backend/
├── src/
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── models/           # Data models
│   ├── middleware/       # Auth, validation, etc.
│   ├── routes/           # API routes
│   ├── utils/            # Helper functions
│   ├── config/           # Configuration
│   └── types/            # TypeScript types
├── tests/
├── .env.example
├── package.json
└── README.md
```

### Endpoint Naming Convention
- RESTful API standartlarına uygun
- `/api/v1/` prefix kullanılabilir (versiyonlama için)
- Resource-based naming (örn: `/api/devices`, `/api/payments`)

---

## 📞 İletişim ve Destek

### Sorular İçin
- GitHub Issues: Frontend repository'de issue açın
- Email: (Backend repo için belirlenecek)

### Notlar
- Bu dokümantasyon frontend projesindeki mevcut yapıya göre hazırlanmıştır
- Backend geliştirilirken database şeması değişiklikleri frontend ile senkronize edilmelidir
- Yeni endpoint'ler eklendiğinde bu dokümantasyon güncellenmelidir

---

**Son Güncelleme:** 2025-01-XX
**Versiyon:** 1.0.0

