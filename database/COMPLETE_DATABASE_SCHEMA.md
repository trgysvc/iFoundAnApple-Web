# Complete Database Schema Documentation

Bu dosya Supabase'deki tüm tabloların yapısını ve RLS politikalarını içerir. Güncellemeler burada yapılır ve revize edilir.

**Son Güncelleme:** 20 Aralık 2024  
**Versiyon:** 4.1  
**Durum:** Test Aşamasında - Supabase Schema Sync Tamamlandı

## 📋 **REFERANS DOSYALAR**
- **`SYSTEM_ANALYSIS_REPORT.md`**: Sistem analizi raporu
- **`PROCESS_FLOW.md`**: Detaylı süreç akışı
- **`types.ts`**: DeviceStatus enum tanımları

## ⚠️ **RLS DURUMU - TEST AŞAMASINDA**

**RLS KAPALI TABLOLAR (Test tamamlanınca aktif edilecek):**
- `devices` - RLS: DISABLED (8 politika tanımlı)
- `escrow_accounts` - RLS: DISABLED (2 politika tanımlı)
- `financial_transactions` - RLS: DISABLED (2 politika tanımlı)
- `payments` - RLS: DISABLED (4 politika tanımlı)

**RLS AKTİF TABLOLAR (Yeni eklenenler):**
- `cargo_codes` - RLS: ENABLED (4 politika tanımlı)
- `delivery_confirmations` - RLS: ENABLED (4 politika tanımlı)
- `final_payment_distributions` - RLS: ENABLED (3 politika tanımlı)

**PRODUCTION'A GEÇMEDEN ÖNCE AKTİF EDİLECEK:**
```sql
-- Test ve ödeme süreci kesinleşince çalıştırılacak
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
```

**NOT:** Şu anda test ortamında RLS kapalı tutuluyor. Production'a geçmeden önce mutlaka aktif edilecek.

---

## 🔄 **DEVICE STATUS ENUM**

```typescript
export enum DeviceStatus {
  LOST = "lost",                    // Cihaz sahibi kayıp bildirimi
  REPORTED = "reported",            // Bulan kişi buldu bildirimi  
  MATCHED = "matched",              // Cihaz eşleşiyor
  PAYMENT_PENDING = "payment_pending", // Cihazı kaybeden ödemesini yapıyor
  PAYMENT_COMPLETE = "payment_completed", // Ödeme emanet sisteminde bekletiliyor
  CARGO_SHIPPED = "cargo_shipped",   // Cihazı bulan kargo firmasına kod ile teslim ediyor
  DELIVERED = "delivered",           // Kargo firması cihazı sahibine teslim ediyor
  CONFIRMED = "confirmed",           // Cihazın sahibi cihaz eline geçince onaylıyor
  COMPLETED = "completed",           // İşlem tamamlanıyor
}
```

**NOT:** Yeni süreç akışına göre güncellendi. `CARGO_SHIPPED`, `DELIVERED`, `CONFIRMED` status'ları eklendi.

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
| cargo_code | character varying(20) | YES | null | Kargo firmasına verilen kod |
| delivery_confirmation_id | uuid | YES | null | Teslimat onay ID'si (FK) |

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
| lost_date | date | YES | null | Date when device was lost (YYYY-MM-DD) |
| lost_location | text | YES | null | Location where device was lost |
| cargo_code_id | uuid | YES | null | Kargo kod ID'si (FK) |
| delivery_confirmed_at | timestamp with time zone | YES | null | Teslimat onay tarihi |
| final_payment_distributed_at | timestamp with time zone | YES | null | Son ödeme dağıtım tarihi |

### 6. **escrow_accounts**
Escrow hesaplarını tutan tablo.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| payment_id | uuid | NO | null | Payment ID (FK) |
| device_id | uuid | NO | null | Device ID (FK) |
| holder_user_id | uuid | NO | null | Holder user ID (FK) |
| beneficiary_user_id | uuid | NO | null | Beneficiary user ID (FK) |
| total_amount | numeric(10,2) | NO | null | Total amount |
| reward_amount | numeric(10,2) | NO | null | Reward amount |
| service_fee | numeric(10,2) | NO | 0.00 | Service fee |
| cargo_fee | numeric(10,2) | NO | 0.00 | Cargo fee |
| net_payout | numeric(10,2) | NO | 0.00 | Net payout |
| status | character varying(20) | NO | 'pending' | Escrow status |
| created_at | timestamp with time zone | YES | now() | Created timestamp |
| held_at | timestamp with time zone | YES | null | Held timestamp |
| released_at | timestamp with time zone | YES | null | Released timestamp |
| refunded_at | timestamp with time zone | YES | null | Refunded timestamp |
| release_conditions | jsonb | NO | '[]' | Emanet serbest bırakma koşulları |
| confirmations | jsonb | NO | '[]' | Onaylar listesi |
| currency | character varying(3) | YES | 'TRY' | Currency |
| notes | text | YES | null | Notes |
| admin_notes | text | YES | null | Admin notes |
| created_by | uuid | YES | null | Created by (FK) |
| released_by | uuid | YES | null | Released by (FK) |
| refunded_by | uuid | YES | null | Refunded by (FK) |
| escrow_type | character varying(20) | YES | 'standard' | Escrow type |
| auto_release_days | integer | YES | 30 | Otomatik serbest bırakma gün sayısı |
| escrow_fee | numeric(10,2) | YES | 0.00 | Escrow fee |
| insurance_amount | numeric(10,2) | YES | 0.00 | Insurance amount |
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
| processing_fee | numeric(10,2) | YES | 0.00 | Processing fee |
| platform_fee | numeric(10,2) | YES | 0.00 | Platform fee |
| total_fees | numeric(10,2) | YES | 0.00 | Total fees |
| net_amount | numeric(10,2) | YES | 0.00 | Net amount |
| metadata | jsonb | YES | '{}' | Metadata |
| tags | ARRAY | YES | null | Tags |
| priority | character varying(10) | YES | 'normal' | Priority |
| updated_at | timestamp with time zone | YES | now() | Updated timestamp |
| gross_amount | numeric(10,2) | NO | 0.00 | Gross amount |

### 7. **financial_transactions**
Finansal işlemleri tutan tablo.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| payment_id | uuid | YES | null | Payment ID (FK) |
| device_id | uuid | NO | null | Device ID (FK) |
| from_user_id | uuid | YES | null | From user ID (FK) |
| to_user_id | uuid | YES | null | To user ID (FK) |
| transaction_type | character varying(30) | NO | null | Transaction type |
| amount | numeric(10,2) | NO | null | Amount |
| currency | character varying(3) | YES | 'TRY' | Currency |
| status | character varying(20) | NO | 'pending' | Status |
| external_transaction_id | character varying(200) | YES | null | External transaction ID |
| external_reference | character varying(200) | YES | null | External reference |
| created_at | timestamp with time zone | YES | now() | Created timestamp |
| processed_at | timestamp with time zone | YES | null | Processed timestamp |
| completed_at | timestamp with time zone | YES | null | Completed timestamp |
| description | text | YES | null | Description |
| metadata | jsonb | YES | null | Metadata |
| notes | text | YES | null | Notes |
| debit_account | character varying(50) | YES | null | Debit account |
| credit_account | character varying(50) | YES | null | Credit account |
| created_by | uuid | YES | null | Created by (FK) |
| approved_by | uuid | YES | null | Approved by (FK) |
| updated_at | timestamp with time zone | YES | now() | Updated timestamp |

### 8. **notifications**
Kullanıcı bildirimlerini tutan tablo.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| user_id | uuid | NO | null | User ID (FK) |
| message_key | text | NO | null | Message key |
| link | text | YES | null | Link |
| is_read | boolean | NO | false | Is read |
| created_at | timestamp with time zone | NO | now() | Created timestamp |
| replacements | jsonb | YES | null | Message replacements |
| type | character varying(50) | NO | null | Notification type |

### 9. **payments**
Ödeme işlemlerini tutan tablo.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| device_id | uuid | NO | null | Device ID (FK) |
| payer_id | uuid | NO | null | Payer ID (FK) |
| receiver_id | uuid | YES | null | Receiver ID (FK) |
| total_amount | numeric(10,2) | NO | null | Total amount |
| reward_amount | numeric(10,2) | NO | null | Reward amount |
| cargo_fee | numeric(10,2) | NO | 25.00 | Cargo fee |
| payment_gateway_fee | numeric(10,2) | NO | 0.00 | Payment gateway fee |
| service_fee | numeric(10,2) | NO | 0.00 | Service fee |
| net_payout | numeric(10,2) | NO | 0.00 | Net payout |
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
| refund_amount | numeric(10,2) | YES | 0.00 | Refund amount |
| refund_reason_code | character varying(20) | YES | null | Refund reason code |
| dispute_status | character varying(20) | YES | 'none' | Dispute status |
| dispute_reason | text | YES | null | Dispute reason |
| processing_time_ms | integer | YES | null | Processing time |
| gateway_response_time_ms | integer | YES | null | Gateway response time |
| retry_count | integer | YES | 0 | Retry count |
| success_rate | numeric(5,2) | YES | null | Success rate |
| status | character varying(20) | NO | 'pending' | Status |
| gross_amount | numeric(10,2) | YES | 0.00 | Gross amount |
| net_amount | numeric(10,2) | YES | 0.00 | Net amount |
| iyzico_commission | numeric(10,2) | YES | 0.00 | Iyzico commission |

### 10. **userprofile**
Kullanıcı profil bilgilerini tutan tablo.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| user_id | uuid | NO | null | User ID (FK) |
| bank_info | text | YES | null | Bank information |
| phone_number | character varying(20) | YES | null | Phone number |
| address | text | YES | null | Address |
| city | character varying(100) | YES | null | City |
| country | character varying(100) | YES | null | Country |
| postal_code | character varying(20) | YES | null | Postal code |
| date_of_birth | date | YES | null | Date of birth |
| emergency_contact | text | YES | null | Emergency contact |
| preferences | jsonb | YES | '{}' | User preferences |
| created_at | timestamp with time zone | YES | now() | Created timestamp |
| updated_at | timestamp with time zone | YES | now() | Updated timestamp |
| tc_kimlik_no | character varying(11) | YES | null | Turkish ID number |
| iban | character varying(34) | YES | null | IBAN |
| first_name | character varying(100) | YES | null | First name |
| last_name | character varying(100) | YES | null | Last name |

### 11. **payment_summaries** (View/Summary Table)
Ödeme özetlerini tutan tablo.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | YES | null | Primary key |
| device_id | uuid | YES | null | Device ID (FK) |
| payer_id | uuid | YES | null | Payer ID (FK) |
| receiver_id | uuid | YES | null | Receiver ID (FK) |
| total_amount | numeric | YES | null | Total amount |
| reward_amount | numeric | YES | null | Reward amount |
| cargo_fee | numeric | YES | null | Cargo fee |
| payment_gateway_fee | numeric | YES | null | Payment gateway fee |
| service_fee | numeric | YES | null | Service fee |
| net_payout | numeric | YES | null | Net payout |
| payment_provider | character varying(50) | YES | null | Payment provider |
| provider_payment_id | character varying(200) | YES | null | Provider payment ID |
| provider_transaction_id | character varying(200) | YES | null | Provider transaction ID |
| provider_status | character varying(50) | YES | null | Provider status |
| provider_response | text | YES | null | Provider response |
| escrow_status | character varying(20) | YES | null | Escrow status |
| escrow_held_at | timestamp with time zone | YES | null | Escrow held timestamp |
| escrow_released_at | timestamp with time zone | YES | null | Escrow released timestamp |
| escrow_refunded_at | timestamp with time zone | YES | null | Escrow refunded timestamp |
| payment_status | character varying(20) | YES | null | Payment status |
| payment_method | character varying(50) | YES | null | Payment method |
| created_at | timestamp with time zone | YES | null | Created timestamp |
| updated_at | timestamp with time zone | YES | null | Updated timestamp |
| completed_at | timestamp with time zone | YES | null | Completed timestamp |
| currency | character varying(3) | YES | null | Currency |
| notes | text | YES | null | Notes |
| failure_reason | text | YES | null | Failure reason |
| refund_reason | text | YES | null | Refund reason |
| device_model | text | YES | null | Device model |
| device_serial | text | YES | null | Device serial |
| device_status | text | YES | null | Device status |
| payer_email | character varying(255) | YES | null | Payer email |
| receiver_email | character varying(255) | YES | null | Receiver email |

### 12. **shipment_tracking** (View/Summary Table)
Kargo takip bilgilerini tutan tablo.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | YES | null | Primary key |
| device_id | uuid | YES | null | Device ID (FK) |
| tracking_number | character varying(100) | YES | null | Tracking number |
| cargo_company | character varying(50) | YES | null | Cargo company |
| status | character varying(30) | YES | null | Shipment status |
| created_at | timestamp with time zone | YES | null | Created timestamp |
| picked_up_at | timestamp with time zone | YES | null | Picked up timestamp |
| delivered_at | timestamp with time zone | YES | null | Delivered timestamp |
| estimated_delivery_days | integer | YES | null | Estimated delivery days |
| delivery_confirmed_by_receiver | boolean | YES | null | Delivery confirmed |
| device_model | text | YES | null | Device model |
| user_anonymous_id | character varying | YES | null | User anonymous ID |
| user_role | text | YES | null | User role |

### 13. **user_escrow_history** (View/Summary Table)
Kullanıcı escrow geçmişini tutan tablo.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | YES | null | Primary key |
| payment_id | uuid | YES | null | Payment ID (FK) |
| device_id | uuid | YES | null | Device ID (FK) |
| total_amount | numeric | YES | null | Total amount |
| reward_amount | numeric | YES | null | Reward amount |
| net_payout | numeric | YES | null | Net payout |
| status | character varying(20) | YES | null | Escrow status |
| created_at | timestamp with time zone | YES | null | Created timestamp |
| held_at | timestamp with time zone | YES | null | Held timestamp |
| released_at | timestamp with time zone | YES | null | Released timestamp |
| refunded_at | timestamp with time zone | YES | null | Refunded timestamp |
| confirmations | jsonb | YES | null | Confirmations |
| device_model | text | YES | null | Device model |
| device_serial | text | YES | null | Device serial |
| user_role | text | YES | null | User role |
| user_role_description | text | YES | null | User role description |

### 14. **user_transaction_history** (View/Summary Table)
Kullanıcı işlem geçmişini tutan tablo.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | YES | null | Primary key |
| payment_id | uuid | YES | null | Payment ID (FK) |
| device_id | uuid | YES | null | Device ID (FK) |
| transaction_type | character varying(30) | YES | null | Transaction type |
| amount | numeric | YES | null | Amount |
| currency | character varying(3) | YES | null | Currency |
| status | character varying(20) | YES | null | Status |
| created_at | timestamp with time zone | YES | null | Created timestamp |
| completed_at | timestamp with time zone | YES | null | Completed timestamp |
| description | text | YES | null | Description |
| device_model | text | YES | null | Device model |
| device_serial | text | YES | null | Device serial |
| transaction_direction | text | YES | null | Transaction direction |

### 15. **financial_audit_trail** (Audit Table)
Mali denetim izini tutan tablo.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | YES | null | Primary key |
| event_type | character varying(50) | YES | null | Event type |
| event_category | character varying(30) | YES | null | Event category |
| event_action | character varying(30) | YES | null | Event action |
| event_severity | character varying(20) | YES | null | Event severity |
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
| event_description | text | YES | null | Event description |
| event_data | jsonb | YES | null | Event data |
| error_details | jsonb | YES | null | Error details |
| created_at | timestamp with time zone | YES | null | Created timestamp |
| request_id | character varying(255) | YES | null | Request ID |
| correlation_id | character varying(255) | YES | null | Correlation ID |
| is_sensitive | boolean | YES | null | Is sensitive |
| retention_period_days | integer | YES | null | Retention period |
| archived_at | timestamp with time zone | YES | null | Archived timestamp |
| application_version | character varying(50) | YES | null | Application version |
| environment | character varying(20) | YES | null | Environment |
| tags | ARRAY | YES | null | Tags |
| user_email | character varying(255) | YES | null | User email |
| amount | numeric | YES | null | Amount |

### 16. **security_audit_events** (Audit Table)
Güvenlik denetim olaylarını tutan tablo.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | YES | null | Primary key |
| event_type | character varying(50) | YES | null | Event type |
| event_category | character varying(30) | YES | null | Event category |
| event_action | character varying(30) | YES | null | Event action |
| event_severity | character varying(20) | YES | null | Event severity |
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
| event_description | text | YES | null | Event description |
| event_data | jsonb | YES | null | Event data |
| error_details | jsonb | YES | null | Error details |
| created_at | timestamp with time zone | YES | null | Created timestamp |
| request_id | character varying(255) | YES | null | Request ID |
| correlation_id | character varying(255) | YES | null | Correlation ID |
| is_sensitive | boolean | YES | null | Is sensitive |
| retention_period_days | integer | YES | null | Retention period |
| archived_at | timestamp with time zone | YES | null | Archived timestamp |
| application_version | character varying(50) | YES | null | Application version |
| environment | character varying(20) | YES | null | Environment |
| tags | ARRAY | YES | null | Tags |
| user_email | character varying(255) | YES | null | User email |

### 17. **cargo_codes** (Yeni Tablo - v4.0)
Kargo firmasına teslim edilecek kodları tutan tablo.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| device_id | uuid | NO | null | Device ID (FK) |
| payment_id | uuid | NO | null | Payment ID (FK) |
| code | character varying(20) | NO | null | Kargo firmasına verilecek kod |
| generated_by | uuid | NO | null | Bulan kişi ID'si (FK) |
| cargo_company | character varying(50) | NO | null | Hangi kargo firması |
| status | character varying(20) | YES | 'active' | Kod durumu (active, used, expired) |
| expires_at | timestamp with time zone | YES | null | Kod son kullanma tarihi |
| used_at | timestamp with time zone | YES | null | Kod kullanım tarihi |
| created_at | timestamp with time zone | YES | now() | Created timestamp |
| updated_at | timestamp with time zone | YES | now() | Updated timestamp |

### 18. **delivery_confirmations** (Yeni Tablo - v4.0)
Cihaz sahibinin teslimat onaylarını tutan tablo.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| device_id | uuid | NO | null | Device ID (FK) |
| payment_id | uuid | NO | null | Payment ID (FK) |
| cargo_shipment_id | uuid | NO | null | Cargo shipment ID (FK) |
| confirmed_by | uuid | NO | null | Cihaz sahibi ID'si (FK) |
| confirmation_type | character varying(30) | NO | null | Onay türü (device_received, device_verified, exchange_confirmed) |
| confirmation_data | jsonb | YES | '{}' | Ek bilgiler (fotoğraf, notlar, vb.) |
| confirmed_at | timestamp with time zone | YES | now() | Onay tarihi |
| created_at | timestamp with time zone | YES | now() | Created timestamp |

### 19. **final_payment_distributions** (Yeni Tablo - v4.0)
Emanet serbest bırakıldıktan sonra yapılan ödeme dağıtımlarını tutan tablo.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| device_id | uuid | NO | null | Device ID (FK) |
| payment_id | uuid | NO | null | Payment ID (FK) |
| escrow_account_id | uuid | NO | null | Escrow account ID (FK) |
| total_amount | numeric(10,2) | NO | 0.00 | Toplam dağıtım tutarı |
| cargo_fee | numeric(10,2) | NO | 0.00 | Kargo ücreti |
| reward_amount | numeric(10,2) | NO | 0.00 | Bulan kişi ödülü |
| service_fee | numeric(10,2) | NO | 0.00 | Servis ücreti |
| gateway_transfer_id | character varying(200) | YES | null | İyzico transfer ID |
| cargo_transfer_id | character varying(200) | YES | null | Kargo firması transfer ID |
| reward_transfer_id | character varying(200) | YES | null | Bulan kişi transfer ID |
| service_transfer_id | character varying(200) | YES | null | Platform transfer ID |
| status | character varying(20) | YES | 'pending' | Dağıtım durumu (pending, processing, completed, failed) |
| processed_at | timestamp with time zone | YES | null | İşlem tarihi |
| failed_reason | text | YES | null | Hata nedeni |
| created_at | timestamp with time zone | YES | now() | Created timestamp |
| updated_at | timestamp with time zone | YES | now() | Updated timestamp |
| gross_amount | numeric(10,2) | NO | 0.00 | Gross amount |
| net_amount | numeric(10,2) | NO | 0.00 | Net amount |
| distribution_type | character varying(20) | YES | 'automatic' | Distribution type |

### 20. **invoice_logs** (Yeni Tablo - v4.0)
Fatura yükleme ve doğrulama loglarını tutan tablo.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| user_id | uuid | NO | null | User ID (FK) |
| device_id | uuid | YES | null | Device ID (FK) |
| device_model | text | YES | null | Device model |
| file_name | text | NO | null | File name |
| file_path | text | NO | null | File path |
| file_size | bigint | NO | null | File size in bytes |
| file_type | text | NO | null | File type |
| upload_status | text | NO | 'pending' | Upload status |
| verification_status | text | NO | 'pending' | Verification status |
| verification_notes | text | YES | null | Verification notes |
| uploaded_at | timestamp with time zone | NO | now() | Upload timestamp |
| verified_at | timestamp with time zone | YES | null | Verification timestamp |
| verified_by | uuid | YES | null | Verified by (FK) |
| created_at | timestamp with time zone | NO | now() | Created timestamp |
| updated_at | timestamp with time zone | NO | now() | Updated timestamp |

### 21. **payment_transfers** (Yeni Tablo - v4.0)
Ödeme transferlerini detaylı olarak takip eden tablo.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | NO | gen_random_uuid() | Primary key |
| distribution_id | uuid | NO | null | Distribution ID (FK) |
| transfer_type | character varying(20) | NO | null | Transfer type |
| recipient_type | character varying(20) | NO | null | Recipient type |
| recipient_user_id | uuid | YES | null | Recipient user ID (FK) |
| recipient_name | character varying(100) | NO | null | Recipient name |
| amount | numeric(10,2) | NO | 0.00 | Transfer amount |
| transfer_method | character varying(20) | YES | 'bank_transfer' | Transfer method |
| transfer_reference | character varying(200) | YES | null | Transfer reference |
| status | character varying(20) | YES | 'pending' | Transfer status |
| processed_at | timestamp with time zone | YES | null | Processed timestamp |
| failed_reason | text | YES | null | Failed reason |
| notes | text | YES | null | Notes |
| metadata | jsonb | YES | '{}' | Metadata |
| created_at | timestamp with time zone | YES | now() | Created timestamp |
| updated_at | timestamp with time zone | YES | now() | Updated timestamp |

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

### **devices** (RLS: DISABLED - Test tamamlanınca aktif edilecek)
- **Users can delete own devices**: Users can delete their own devices
- **Users can insert own devices**: Users can insert their own devices
- **Users can update own devices**: Users can update their own devices
- **Users can view own devices**: Users can view their own devices
- **allow_delete_own_devices**: Duplicate policy for delete
- **allow_insert_own_devices**: Duplicate policy for insert
- **allow_select_own_devices**: Duplicate policy for select
- **allow_update_own_devices**: Duplicate policy for update
- **allow_view_for_matching**: Authenticated users can view devices with LOST/FOUND status for matching

### **escrow_accounts** (RLS: DISABLED - Test tamamlanınca aktif edilecek)
- **System can manage escrow accounts**: Authenticated users can manage escrow accounts
- **Users can view own escrow accounts**: Users can view their own escrow accounts (holder or beneficiary)

### **financial_transactions** (RLS: DISABLED - Test tamamlanınca aktif edilecek)
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

### **cargo_codes** (RLS: ENABLED - v4.0)
- **Users can view own cargo codes**: Users can view their own cargo codes
- **Users can create own cargo codes**: Users can create their own cargo codes
- **Users can update own cargo codes**: Users can update their own cargo codes
- **Admins can view all cargo codes**: Admins can view all cargo codes

### **delivery_confirmations** (RLS: ENABLED - v4.0)
- **Users can view own delivery confirmations**: Users can view their own delivery confirmations
- **Users can create own delivery confirmations**: Users can create their own delivery confirmations
- **Users can update own delivery confirmations**: Users can update their own delivery confirmations
- **Admins can view all delivery confirmations**: Admins can view all delivery confirmations

### **final_payment_distributions** (RLS: ENABLED - v4.0)
- **Admins can view all payment distributions**: Admins can view all payment distributions
- **Admins can create payment distributions**: Admins can create payment distributions
- **Admins can update payment distributions**: Admins can update payment distributions

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

### **cargo_codes** (Yeni - v4.0)
- `device_id` → `devices.id`
- `payment_id` → `payments.id`
- `generated_by` → `auth.users.id`

### **delivery_confirmations** (Yeni - v4.0)
- `device_id` → `devices.id`
- `payment_id` → `payments.id`
- `cargo_shipment_id` → `cargo_shipments.id`
- `confirmed_by` → `auth.users.id`

### **final_payment_distributions** (Yeni - v4.0)
- `device_id` → `devices.id`
- `payment_id` → `payments.id`
- `escrow_account_id` → `escrow_accounts.id`

### **invoice_logs** (Yeni - v4.0)
- `user_id` → `auth.users.id`
- `device_id` → `devices.id`
- `verified_by` → `auth.users.id`

### **payment_transfers** (Yeni - v4.0)
- `distribution_id` → `final_payment_distributions.id`
- `recipient_user_id` → `auth.users.id`

### **devices** (Güncellenmiş - v4.0)
- `userId` → `auth.users.id`
- `cargo_code_id` → `cargo_codes.id`

### **cargo_shipments** (Güncellenmiş - v4.0)
- `device_id` → `devices.id`
- `payment_id` → `payments.id`
- `sender_user_id` → `auth.users.id`
- `receiver_user_id` → `auth.users.id`
- `delivery_confirmation_id` → `delivery_confirmations.id`

---

## 📝 **NOTLAR**

1. **Duplicate Policies**: `devices` tablosunda bazı RLS politikaları duplicate olarak tanımlanmış. Temizlenmesi önerilir.

2. **Status Fields**: Birçok tabloda `status` field'ı var. Tutarlılık için standartlaştırılması önerilir.

3. **Timestamps**: Tüm tablolarda `created_at` ve `updated_at` field'ları mevcut.

4. **JSONB Fields**: `audit_logs`, `escrow_accounts`, `payments`, `userprofile`, `delivery_confirmations` tablolarında JSONB field'lar kullanılıyor.

5. **Encryption**: `cargo_shipments` tablosunda adres bilgileri encrypted olarak saklanıyor.

6. **Yeni Süreç Akışı** (v4.0): `CARGO_SHIPPED`, `DELIVERED`, `CONFIRMED` status'ları eklendi.

7. **Kargo Kod Sistemi**: `cargo_codes` tablosu ile kargo firmasına teslim sistemi eklendi.

8. **Teslimat Onay Sistemi**: `delivery_confirmations` tablosu ile detaylı onay süreci eklendi.

9. **Son Ödeme Dağıtımı**: `final_payment_distributions` tablosu ile 4 farklı transfer sistemi eklendi.

---

## 🔄 **GÜNCELLEME TALİMATLARI**

Bu dosyayı güncellerken:

1. **Tablo yapısı değişiklikleri** → İlgili tablo bölümünü güncelleyin
2. **RLS politikası değişiklikleri** → RLS politikaları bölümünü güncelleyin
3. **Foreign key değişiklikleri** → Foreign key ilişkileri bölümünü güncelleyin
4. **Versiyon numarasını** artırın
5. **Son güncelleme tarihini** güncelleyin

---

## 🧪 **TEST VE PRODUCTION HAZIRLIĞI**

### **Test Aşamasında Yapılacaklar**
1. **RLS Test**: Kritik tablolarda RLS politikalarını test et
2. **Payment Test**: İyzico sandbox ile ödeme sürecini test et
3. **Escrow Test**: Escrow release sürecini test et
4. **Performance Test**: Database performansını test et

### **Production'a Geçmeden Önce**
1. **RLS Aktifleştirme**: Kritik tablolarda RLS aç
   ```sql
   ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
   ALTER TABLE escrow_accounts ENABLE ROW LEVEL SECURITY;
   ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
   ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
   ```

2. **Environment Variables**: Production değerleri
3. **Monitoring**: Log ve error tracking
4. **Backup**: Database backup stratejisi

### **Kritik Güvenlik Notları**
- **RLS Kapalı Tablolar**: `devices`, `escrow_accounts`, `financial_transactions`, `payments`
- **Test Sonrası**: Mutlaka RLS aktif edilmeli
- **Audit Trail**: Tüm işlemler loglanıyor
- **Encryption**: Kargo adresleri encrypted

---

## 📚 **REFERANS BİLGİLER**

### **Enum Tutarsızlığı** ✅ ÇÖZÜLDÜ
- **Sorun**: `PAYMENT_COMPLETE = "payment_complete"` vs kodda `'payment_completed'`
- **Çözüm**: Enum değeri `"payment_completed"` olarak düzeltildi
- **Etkilenen Dosyalar**: `types.ts`, `DeviceCard.tsx`, `PROCESS_FLOW.md`

### **Ücret Hesaplama** ✅ GÜNCELLENDİ
- **Gateway Komisyonu**: %3.43 (toplam üzerinden)
- **Kargo Ücreti**: 250.00 TL (sabit)
- **Bulan Kişi Ödülü**: %20 (toplam üzerinden)
- **Hizmet Bedeli**: Geriye kalan tutar
- **Net Payout**: `rewardAmount` (bulan kişiye ödül)

---

## 🔄 **SCHEMA SYNCHRONIZATION - v4.1**

### **Yapılan Güncellemeler:**
1. **Eksik Tablolar Eklendi**: `invoice_logs`, `payment_transfers`
2. **Kolon Yapıları Düzeltildi**: Tüm tablolarda Supabase ile senkronizasyon
3. **Veri Tipleri Güncellendi**: `numeric(10,2)` formatına geçiş
4. **Foreign Key İlişkileri**: Yeni tablolar için FK tanımları eklendi
5. **Nullable/Default Değerler**: Supabase schema ile uyumlu hale getirildi

### **Kritik Değişiklikler:**
- `financial_transactions`: Kolon sırası ve ek alanlar eklendi
- `notifications`: `message_key` ve `replacements` alanları eklendi
- `payments`: `gross_amount`, `net_amount`, `iyzico_commission` alanları eklendi
- `escrow_accounts`: `gross_amount` alanı eklendi, `auto_release_days` 30'a güncellendi
- `final_payment_distributions`: `gross_amount`, `net_amount`, `distribution_type` alanları eklendi

### **Yeni Tablolar:**
- `invoice_logs`: Fatura yükleme ve doğrulama sistemi
- `payment_transfers`: Detaylı ödeme transfer takibi

---

**✅ Bu dosya Supabase schema analizi tamamlandıktan sonra güncellenmiştir. Artık gerçek veritabanı yapısı ile tam uyumlu.**

**Bu dosya sürekli güncel tutulmalı ve database değişikliklerinde referans olarak kullanılmalıdır.**
