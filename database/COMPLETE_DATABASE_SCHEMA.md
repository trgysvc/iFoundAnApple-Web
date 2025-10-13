# Complete Database Schema Documentation

Bu dosya Supabase'deki tüm tabloların yapısını ve RLS politikalarını içerir. Güncellemeler burada yapılır ve revize edilir.

**Son Güncelleme:** 13 Ekim 2025  
**Versiyon:** 1.0

---

## 📊 **TABLO YAPILARI**

### 1. **audit_logs**
Sistemdeki tüm işlemleri loglayan tablo.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| event_type | character varying(50) | NO | null | Event type |
| event_category | character varying(30) | NO | null | Event category |
| event_action | character varying(30) | NO | null | Event action |
| event_severity | character varying(20) | YES | 'info' | Event severity |
| user_id | uuid | YES | null | User ID |
| session_id | character varying(255) | YES | null | Session ID |
| ip_address | inet | YES | null | IP address |
| user_agent | text | YES | null | User agent |
| resource_type | character varying(50) | YES | null | Resource type |
| resource_id | uuid | YES | null | Resource ID |
| parent_resource_type | character varying(50) | YES | null | Parent resource type |
| parent_resource_id | uuid | YES | null | Parent resource ID |
| old_values | jsonb | YES | null | Old values |
| new_values | jsonb | YES | null | New values |
| changes | jsonb | YES | null | Changes |
| event_description | text | NO | null | Event description |
| event_data | jsonb | YES | null | Event data |
| error_details | jsonb | YES | null | Error details |
| created_at | timestamp with time zone | YES | now() | Created timestamp |
| request_id | character varying(255) | YES | null | Request ID |
| correlation_id | character varying(255) | YES | null | Correlation ID |
| is_sensitive | boolean | YES | false | Is sensitive |
| retention_period_days | integer | YES | 2555 | Retention period |
| archived_at | timestamp with time zone | YES | null | Archived timestamp |
| application_version | character varying(50) | YES | null | Application version |
| environment | character varying(20) | YES | 'production' | Environment |
| tags | ARRAY | YES | null | Tags |

### 2. **cargo_companies**
Kargo şirketleri bilgilerini tutan tablo.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| code | character varying(20) | NO | null | Company code |
| name | character varying(100) | NO | null | Company name |
| api_endpoint | character varying(255) | YES | null | API endpoint |
| tracking_url_template | character varying(255) | YES | null | Tracking URL template |
| standard_delivery_days | integer | YES | 2 | Standard delivery days |
| express_delivery_days | integer | YES | 1 | Express delivery days |
| base_fee | numeric | YES | 25.00 | Base fee |
| express_fee_multiplier | numeric | YES | 1.5 | Express fee multiplier |
| is_active | boolean | YES | true | Is active |
| created_at | timestamp with time zone | YES | now() | Created timestamp |

### 3. **cargo_shipments**
Kargo gönderilerini takip eden tablo.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| device_id | uuid | NO | null | Device ID (FK) |
| payment_id | uuid | YES | null | Payment ID (FK) |
| cargo_company | character varying(50) | NO | null | Cargo company |
| tracking_number | character varying(100) | YES | null | Tracking number |
| cargo_service_type | character varying(50) | YES | 'standard' | Service type |
| estimated_delivery_days | integer | YES | 2 | Estimated delivery days |
| sender_anonymous_id | character varying(20) | NO | null | Sender anonymous ID |
| receiver_anonymous_id | character varying(20) | NO | null | Receiver anonymous ID |
| sender_user_id | uuid | NO | null | Sender user ID (FK) |
| receiver_user_id | uuid | NO | null | Receiver user ID (FK) |
| sender_address_encrypted | text | YES | null | Sender address (encrypted) |
| receiver_address_encrypted | text | YES | null | Receiver address (encrypted) |
| status | character varying(30) | NO | 'created' | Shipment status |
| created_at | timestamp with time zone | YES | now() | Created timestamp |
| updated_at | timestamp with time zone | YES | now() | Updated timestamp |
| picked_up_at | timestamp with time zone | YES | null | Picked up timestamp |
| delivered_at | timestamp with time zone | YES | null | Delivered timestamp |
| package_weight | numeric | YES | null | Package weight |
| package_dimensions | character varying(50) | YES | null | Package dimensions |
| declared_value | numeric | YES | null | Declared value |
| cargo_fee | numeric | NO | 25.00 | Cargo fee |
| delivery_confirmed_by_receiver | boolean | YES | false | Delivery confirmed |
| delivery_confirmation_date | timestamp with time zone | YES | null | Delivery confirmation date |
| delivery_signature | text | YES | null | Delivery signature |
| delivery_photos | ARRAY | YES | null | Delivery photos |
| special_instructions | text | YES | null | Special instructions |
| notes | text | YES | null | Notes |
| failure_reason | text | YES | null | Failure reason |

### 4. **device_models**
Cihaz modellerini tutan tablo.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| name | text | NO | null | Device name |
| createdAt | timestamp with time zone | NO | now() | Created timestamp |
| category | character varying(50) | YES | null | Category |
| model_name | character varying(100) | YES | null | Model name |
| specifications | text | YES | null | Specifications |
| repair_price | numeric | YES | null | Repair price |
| ifoundanapple_fee | numeric | YES | null | iFoundAnApple fee |
| fee_percentage | numeric | YES | 10.00 | Fee percentage |
| is_active | boolean | YES | true | Is active |
| sort_order | integer | YES | 0 | Sort order |
| updated_at | timestamp with time zone | YES | now() | Updated timestamp |

### 5. **devices**
Kayıp/bulunan cihazları tutan ana tablo.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| userId | uuid | NO | null | User ID (FK) |
| model | text | NO | null | Device model |
| serialNumber | text | NO | null | Serial number |
| status | text | NO | 'LOST' | Device status |
| color | text | YES | null | Device color |
| description | text | YES | null | Description |
| rewardAmount | numeric | YES | null | Reward amount |
| invoiceDataUrl | text | YES | null | Invoice data URL |
| exchangeConfirmedBy | ARRAY | YES | '{}' | Exchange confirmed by |
| created_at | timestamp with time zone | NO | now() | Created timestamp |
| invoice_url | text | YES | null | Invoice URL |
| updated_at | timestamp with time zone | YES | now() | Updated timestamp |

### 6. **escrow_accounts**
Escrow hesaplarını tutan tablo.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| payment_id | uuid | NO | null | Payment ID (FK) |
| device_id | uuid | NO | null | Device ID (FK) |
| holder_user_id | uuid | NO | null | Holder user ID (FK) |
| beneficiary_user_id | uuid | NO | null | Beneficiary user ID (FK) |
| total_amount | numeric | NO | null | Total amount |
| reward_amount | numeric | NO | null | Reward amount |
| service_fee | numeric | NO | 0.00 | Service fee |
| gateway_fee | numeric | NO | 0.00 | Gateway fee |
| cargo_fee | numeric | NO | 0.00 | Cargo fee |
| net_payout | numeric | NO | 0.00 | Net payout |
| status | character varying(20) | NO | 'pending' | Escrow status |
| created_at | timestamp with time zone | YES | now() | Created timestamp |
| held_at | timestamp with time zone | YES | null | Held timestamp |
| released_at | timestamp with time zone | YES | null | Released timestamp |
| refunded_at | timestamp with time zone | YES | null | Refunded timestamp |
| release_conditions | jsonb | NO | '[]' | Release conditions |
| confirmations | jsonb | NO | '[]' | Confirmations |
| currency | character varying(3) | YES | 'TRY' | Currency |
| notes | text | YES | null | Notes |
| admin_notes | text | YES | null | Admin notes |
| created_by | uuid | YES | null | Created by (FK) |
| released_by | uuid | YES | null | Released by (FK) |
| refunded_by | uuid | YES | null | Refunded by (FK) |
| escrow_type | character varying(20) | YES | 'standard' | Escrow type |
| auto_release_days | integer | YES | 30 | Auto release days |
| escrow_fee | numeric | YES | 0.00 | Escrow fee |
| insurance_amount | numeric | YES | 0.00 | Insurance amount |
| risk_assessment | character varying(20) | YES | 'low' | Risk assessment |
| compliance_verified | boolean | YES | false | Compliance verified |
| release_reason | text | YES | null | Release reason |
| refund_reason | text | YES | null | Refund reason |
| notification_sent | boolean | YES | false | Notification sent |
| reminder_sent_at | timestamp with time zone | YES | null | Reminder sent timestamp |
| last_activity_at | timestamp with time zone | YES | now() | Last activity timestamp |
| activity_log | jsonb | YES | '[]' | Activity log |
| dispute_status | character varying(20) | YES | 'none' | Dispute status |
| dispute_reason | text | YES | null | Dispute reason |
| resolution_method | character varying(20) | YES | null | Resolution method |
| resolution_notes | text | YES | null | Resolution notes |
| processing_fee | numeric | YES | 0.00 | Processing fee |
| platform_fee | numeric | YES | 0.00 | Platform fee |
| total_fees | numeric | YES | 0.00 | Total fees |
| net_amount | numeric | YES | 0.00 | Net amount |
| metadata | jsonb | YES | '{}' | Metadata |
| tags | text[] | YES | null | Tags |
| priority | character varying(10) | YES | 'normal' | Priority |
| updated_at | timestamp with time zone | YES | now() | Updated timestamp |

### 7. **financial_transactions**
Finansal işlemleri tutan tablo.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| transaction_type | character varying(50) | NO | null | Transaction type |
| from_user_id | uuid | YES | null | From user ID (FK) |
| to_user_id | uuid | YES | null | To user ID (FK) |
| device_id | uuid | YES | null | Device ID (FK) |
| payment_id | uuid | YES | null | Payment ID (FK) |
| amount | numeric | NO | null | Amount |
| currency | character varying(3) | YES | 'TRY' | Currency |
| status | character varying(20) | NO | 'pending' | Status |
| description | text | YES | null | Description |
| created_at | timestamp with time zone | YES | now() | Created timestamp |
| updated_at | timestamp with time zone | YES | now() | Updated timestamp |

### 8. **notifications**
Kullanıcı bildirimlerini tutan tablo.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| user_id | uuid | NO | null | User ID (FK) |
| type | character varying(50) | NO | null | Notification type |
| title | text | NO | null | Title |
| message | text | NO | null | Message |
| is_read | boolean | YES | false | Is read |
| created_at | timestamp with time zone | YES | now() | Created timestamp |
| updated_at | timestamp with time zone | YES | now() | Updated timestamp |

### 9. **payments**
Ödeme işlemlerini tutan tablo.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| device_id | uuid | NO | null | Device ID (FK) |
| payer_id | uuid | NO | null | Payer ID (FK) |
| receiver_id | uuid | YES | null | Receiver ID (FK) |
| total_amount | numeric | NO | null | Total amount |
| reward_amount | numeric | NO | null | Reward amount |
| cargo_fee | numeric | NO | 25.00 | Cargo fee |
| payment_gateway_fee | numeric | NO | 0.00 | Payment gateway fee |
| service_fee | numeric | NO | 0.00 | Service fee |
| net_payout | numeric | NO | 0.00 | Net payout |
| payment_provider | character varying(50) | NO | 'iyzico' | Payment provider |
| provider_payment_id | character varying(200) | YES | null | Provider payment ID |
| provider_transaction_id | character varying(200) | YES | null | Provider transaction ID |
| provider_status | character varying(50) | YES | null | Provider status |
| provider_response | text | YES | null | Provider response |
| escrow_status | character varying(20) | NO | 'pending' | Escrow status |
| escrow_held_at | timestamp with time zone | YES | null | Escrow held timestamp |
| escrow_released_at | timestamp with time zone | YES | null | Escrow released timestamp |
| escrow_refunded_at | timestamp with time zone | YES | null | Escrow refunded timestamp |
| payment_status | character varying(20) | NO | 'pending' | Payment status |
| payment_method | character varying(50) | YES | null | Payment method |
| created_at | timestamp with time zone | YES | now() | Created timestamp |
| updated_at | timestamp with time zone | YES | now() | Updated timestamp |
| completed_at | timestamp with time zone | YES | null | Completed timestamp |
| currency | character varying(3) | YES | 'TRY' | Currency |
| notes | text | YES | null | Notes |
| failure_reason | text | YES | null | Failure reason |
| refund_reason | text | YES | null | Refund reason |
| payer_info | jsonb | YES | null | Payer info |
| device_info | jsonb | YES | null | Device info |
| billing_address | jsonb | YES | null | Billing address |
| shipping_address | jsonb | YES | null | Shipping address |
| card_last_four | character varying(4) | YES | null | Card last four |
| card_brand | character varying(20) | YES | null | Card brand |
| card_expiry_month | character varying(2) | YES | null | Card expiry month |
| card_expiry_year | character varying(4) | YES | null | Card expiry year |
| card_holder_name | character varying(100) | YES | null | Card holder name |
| fraud_score | integer | YES | 0 | Fraud score |
| ip_address | inet | YES | null | IP address |
| user_agent | text | YES | null | User agent |
| risk_level | character varying(20) | YES | 'low' | Risk level |
| threeds_enrolled | boolean | YES | false | 3DS enrolled |
| threeds_status | character varying(20) | YES | null | 3DS status |
| threeds_eci | character varying(2) | YES | null | 3DS ECI |
| threeds_cavv | character varying(50) | YES | null | 3DS CAVV |
| webhook_received_at | timestamp with time zone | YES | null | Webhook received timestamp |
| webhook_attempts | integer | YES | 0 | Webhook attempts |
| callback_url | text | YES | null | Callback URL |
| webhook_signature | text | YES | null | Webhook signature |
| compliance_status | character varying(20) | YES | 'pending' | Compliance status |
| kyc_verified | boolean | YES | false | KYC verified |
| aml_checked | boolean | YES | false | AML checked |
| audit_trail | jsonb | YES | null | Audit trail |
| refund_amount | numeric | YES | 0.00 | Refund amount |
| refund_reason_code | character varying(20) | YES | null | Refund reason code |
| dispute_status | character varying(20) | YES | 'none' | Dispute status |
| dispute_reason | text | YES | null | Dispute reason |
| processing_time_ms | integer | YES | null | Processing time |
| gateway_response_time_ms | integer | YES | null | Gateway response time |
| retry_count | integer | YES | 0 | Retry count |
| success_rate | numeric | YES | null | Success rate |
| status | character varying(20) | NO | 'pending' | Status |

### 10. **userprofile**
Kullanıcı profil bilgilerini tutan tablo.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| user_id | uuid | NO | null | User ID (FK) |
| first_name | character varying(100) | YES | null | First name |
| last_name | character varying(100) | YES | null | Last name |
| phone | character varying(20) | YES | null | Phone |
| address | jsonb | YES | null | Address |
| created_at | timestamp with time zone | YES | now() | Created timestamp |
| updated_at | timestamp with time zone | YES | now() | Updated timestamp |
| date_of_birth | date | YES | null | Date of birth |

---

## 🔒 **RLS POLİTİKALARI**

### **audit_logs**
- **Admins can view all audit logs**: Authenticated users can view all audit logs
- **System can insert audit logs**: Authenticated users can insert audit logs
- **Users can view own audit logs**: Users can view their own non-sensitive audit logs (excluding error/critical severity)

### **cargo_companies**
- **Allow read cargo companies**: Authenticated users can read cargo companies

### **cargo_shipments**
- **Users can create shipments**: Users can create shipments (sender or receiver)
- **Users can update own shipments**: Users can update their own shipments
- **Users can view own shipments**: Users can view their own shipments

### **device_models**
- **Allow public read access to device_models**: Public read access
- **Allow read access for authenticated users**: Authenticated users can read device models

### **devices**
- **Users can delete own devices**: Users can delete their own devices
- **Users can insert own devices**: Users can insert their own devices
- **Users can update own devices**: Users can update their own devices
- **Users can view own devices**: Users can view their own devices
- **allow_delete_own_devices**: Duplicate policy for delete
- **allow_insert_own_devices**: Duplicate policy for insert
- **allow_select_own_devices**: Duplicate policy for select
- **allow_update_own_devices**: Duplicate policy for update
- **allow_view_for_matching**: Authenticated users can view devices with LOST/FOUND status for matching

### **escrow_accounts**
- **System can manage escrow accounts**: Authenticated users can manage escrow accounts
- **Users can view own escrow accounts**: Users can view their own escrow accounts (holder or beneficiary)

### **financial_transactions**
- **System can manage transactions**: Authenticated users can manage transactions
- **Users can view own transactions**: Users can view their own transactions (from_user, to_user, or device owner)

### **notifications**
- **Allow authenticated users to insert their own notifications**: Users can insert their own notifications
- **Allow authenticated users to select their own notifications**: Users can select their own notifications
- **Allow authenticated users to update their own notifications**: Users can update their own notifications

### **payments**
- **Payers can create payments**: Users can create payments
- **System can update payments**: Authenticated users can update payments
- **Users can view own payments**: Users can view their own payments (payer or receiver)
- **Users can view payments by status**: Users can view payments by status (payer or receiver)

### **userprofile**
- **Users can delete own profile**: Users can delete their own profile
- **Users can insert own profile**: Users can insert their own profile
- **Users can update own profile**: Users can update their own profile
- **Users can view own profile**: Users can view their own profile

---

## 🔗 **FOREIGN KEY İLİŞKİLERİ**

### **cargo_shipments**
- `device_id` → `devices.id`
- `payment_id` → `payments.id`
- `sender_user_id` → `auth.users.id`
- `receiver_user_id` → `auth.users.id`

### **devices**
- `userId` → `auth.users.id`

### **escrow_accounts**
- `payment_id` → `payments.id`
- `device_id` → `devices.id`
- `holder_user_id` → `auth.users.id`
- `beneficiary_user_id` → `auth.users.id`
- `created_by` → `auth.users.id`
- `released_by` → `auth.users.id`
- `refunded_by` → `auth.users.id`

### **financial_transactions**
- `from_user_id` → `auth.users.id`
- `to_user_id` → `auth.users.id`
- `device_id` → `devices.id`
- `payment_id` → `payments.id`

### **notifications**
- `user_id` → `auth.users.id`

### **payments**
- `device_id` → `devices.id`
- `payer_id` → `auth.users.id`
- `receiver_id` → `auth.users.id`

### **userprofile**
- `user_id` → `auth.users.id`

---

## 📝 **NOTLAR**

1. **Duplicate Policies**: `devices` tablosunda bazı RLS politikaları duplicate olarak tanımlanmış. Temizlenmesi önerilir.

2. **Status Fields**: Birçok tabloda `status` field'ı var. Tutarlılık için standartlaştırılması önerilir.

3. **Timestamps**: Tüm tablolarda `created_at` ve `updated_at` field'ları mevcut.

4. **JSONB Fields**: `audit_logs`, `escrow_accounts`, `payments`, `userprofile` tablolarında JSONB field'lar kullanılıyor.

5. **Encryption**: `cargo_shipments` tablosunda adres bilgileri encrypted olarak saklanıyor.

---

## 🔄 **GÜNCELLEME TALİMATLARI**

Bu dosyayı güncellerken:

1. **Tablo yapısı değişiklikleri** → İlgili tablo bölümünü güncelleyin
2. **RLS politikası değişiklikleri** → RLS politikaları bölümünü güncelleyin
3. **Foreign key değişiklikleri** → Foreign key ilişkileri bölümünü güncelleyin
4. **Versiyon numarasını** artırın
5. **Son güncelleme tarihini** güncelleyin

---

**Bu dosya sürekli güncel tutulmalı ve database değişikliklerinde referans olarak kullanılmalıdır.**
