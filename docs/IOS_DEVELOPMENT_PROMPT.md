# iFoundAnApple iOS Uygulaması Geliştirme Prompt Dokümanı

## 📋 Genel Bakış

Bu doküman, iFoundAnApple web uygulamasının iOS versiyonunu geliştirmek için kapsamlı bir rehberdir. Web uygulaması: https://github.com/trgysvc/iFoundAnApple-Web/tree/master

### 🎯 Doküman Kullanımı

**Bu doküman Cursor'a verilecek ve iOS uygulaması bu dokümana göre geliştirilecek.**

**Çalışma Yöntemi:**
1. **Cursor**: Kod yazma ve düzenleme (AI asistanı ile)
2. **Xcode**: Proje yönetimi, build, debug, canlı görüntüleme
3. **Aynı Klasör**: Cursor ve Xcode aynı proje klasöründe çalışır
   - Cursor: Dosyaları düzenler
   - Xcode: Değişiklikleri otomatik algılar ve canlı görüntüler

**Doküman Yeterliliği:**
- ✅ Tüm ekranlar detaylandırıldı (38-42 ekran)
- ✅ Navigasyon yapısı belirtildi
- ✅ Teknik gereksinimler listelendi
- ✅ Proje yapısı ve dosya organizasyonu eklendi
- ✅ Xcode konfigürasyonu detaylandırıldı
- ✅ Swift Package dependencies listelendi
- ✅ Info.plist konfigürasyonu eklendi
- ✅ Environment variables yönetimi eklendi
- ✅ Asset catalog yapısı eklendi
- ✅ Localization desteği eklendi
- ✅ Dark mode desteği eklendi
- ✅ Accessibility detayları eklendi
- ✅ Logging ve debugging stratejisi eklendi
- ✅ Test stratejisi detaylandırıldı
- ✅ Deployment süreci detaylandırıldı
- ✅ Git yapısı ve .gitignore eklendi

**Bu doküman iOS uygulamasını geliştirmek için YETERLİDİR.**

### Proje Bilgileri
- **Platform**: iOS (sadece iPhone, iPad desteği yok)
- **Dil**: Swift 5.9+
- **Framework**: SwiftUI
- **Minimum iOS Versiyonu**: iOS 17.0
- **Desteklenen Versiyonlar**: iOS 17, 18, 20+
- **Xcode Versiyonu**: Xcode 15.0+ (iOS 17 SDK gerektirir)
- **Geliştirme Ortamı**: 
  - **Cursor**: Kod yazma ve düzenleme
  - **Xcode**: Proje yönetimi, build, debug, canlı görüntüleme
  - **Aynı Klasör**: Cursor ve Xcode aynı proje klasöründe çalışır
- **Local Proje Konumu**: `/Users/trgysvc/Documents/Developer/iFoundAnApple`
- **Github Proje Konumu**: `https://github.com/trgysvc/iFoundAnApple-APP.git`
- **Bundle Identifier**: `com.ifoundanapple.app`
- **App Name**: "iFoundAnApple"

---

## 🎯 Tasarım Prensipleri ve Referanslar

### Apple Human Interface Guidelines (HIG) Uyumluluğu
Tüm tasarım kararları Apple'ın resmi HIG dokümantasyonuna uygun olmalıdır:
- **Referans**: https://developer.apple.com/design/human-interface-guidelines/
- **Design Resources**: https://developer.apple.com/design/resources/
- **Design Pathway**: https://developer.apple.com/design/get-started/
- **SF Symbols 7**: https://developer.apple.com/sf-symbols/

### Tasarım İlkeleri
1. **Minimalist ve Temiz**: Gereksiz elementlerden kaçınılmalı
2. **Sezgisel Navigasyon**: Kullanıcı her ekranda nerede olduğunu bilmeli
3. **Tutarlılık**: Tüm ekranlarda aynı tasarım dili kullanılmalı
4. **Erişilebilirlik**: VoiceOver, Dynamic Type, Color Contrast desteği
5. **Native iOS Deneyimi**: iOS'un native bileşenleri ve animasyonları kullanılmalı

### Teknik Dokümantasyon
- **Swift Programming Language**: https://docs.swift.org/swift-book/documentation/the-swift-programming-language/
- **SwiftUI Tutorials**: https://developer.apple.com/tutorials/swiftui/creating-and-combining-views
- **Xcode Documentation**: https://developer.apple.com/xcode/documentation/
- **Apple Developer Documentation**: https://developer.apple.com/documentation

---

## 🏗️ Mimari Yaklaşım: Hybrid Model

### Genel Prensip
iOS uygulaması **hibrit bir yaklaşım** kullanacak:
- **Normal işlemler** (devices, notifications, profile, file upload) → **Supabase SDK**
- **Ödeme işlemleri** (payment processing, 3D Secure) → **Backend API**

### Supabase SDK Kullanım Alanları
1. **Authentication**: Email/şifre, OAuth (Google/Apple Sign-In)
2. **Devices Management**: CRUD işlemleri (listeleme, ekleme, güncelleme, silme)
3. **Notifications**: Bildirim listesi, okundu işaretleme
4. **User Profile**: Profil bilgileri, güncelleme
5. **File Upload**: Fotoğraf ve fatura yükleme (Supabase Storage)
6. **Real-time Subscriptions**: Devices ve notifications için anlık güncellemeler
7. **Payment Status Monitoring**: Supabase'den payment status okuma (real-time)

### Backend API Kullanım Alanları

#### Health Check Endpoints
| Method | Endpoint | Auth | Açıklama |
|--------|----------|------|----------|
| GET | `/v1/health` | Public | Health check - Backend durumu kontrolü |

#### Authentication & Session Endpoints
| Method | Endpoint | Auth | Açıklama |
|--------|----------|------|----------|
| GET | `/v1/session` | JWT Required | Mevcut kullanıcı oturum bilgisi |

#### Payment Endpoints
| Method | Endpoint | Auth | Açıklama |
|--------|----------|------|----------|
| POST | `/v1/payments/process` | JWT Required | Eşleşmiş cihaz için ödeme başlatma |
| POST | `/v1/payments/complete-3d` | JWT Required | 3D Secure doğrulama sonrası ödeme tamamlama |
| GET | `/v1/payments/test-paynet-connection` | JWT Required | PAYNET API bağlantı testi |

**Payment Endpoint Detayları:**

1. **POST `/v1/payments/process`** - Ödeme başlatma
   
   **ÖNEMLİ:** Backend sadece Paynet API ile iletişim kurar ve veritabanına yazmaz. Tüm veritabanı kayıtları iOS tarafından webhook geldiğinde oluşturulur.
   
   **Request Body:**
   ```json
   {
     "deviceId": "123e4567-e89b-12d3-a456-426614174000",
     "totalAmount": 2000.0,
     "feeBreakdown": {
       "rewardAmount": 400.0,
       "cargoFee": 250.0,
       "serviceFee": 1281.4,
       "gatewayFee": 68.6,
       "totalAmount": 2000.0,
       "netPayout": 400.0
     }
   }
   ```
   
   **Request Fields:**
   - `deviceId` (string, UUID, **ZORUNLU**): Ödeme yapılacak cihazın ID'si
   - `totalAmount` (number, **ZORUNLU**): Toplam tutar (backend'de doğrulanır)
   - `feeBreakdown` (object, **ZORUNLU**): Ücret dökümü (iOS tarafından hesaplanır, webhook geldiğinde kullanılır)
   
   **Response:**
   ```json
   {
     "id": "payment-uuid-123",
     "deviceId": "123e4567-e89b-12d3-a456-426614174000",
     "paymentStatus": "pending",
     "escrowStatus": "pending",
     "totalAmount": 2000.0,
     "providerTransactionId": "paynet-txn-123",
     "publishableKey": "pk_test_...",
     "paymentUrl": "https://api.paynet.com.tr/v2/transaction/tds_initial",
     "feeBreakdown": {
       "rewardAmount": 400.0,
       "cargoFee": 250.0,
       "serviceFee": 1281.4,
       "gatewayFee": 68.6,
       "totalAmount": 2000.0,
       "netPayout": 400.0
     }
   }
   ```
   
   **Response Fields:**
   - `id` (string): Payment ID (UUID) - iOS tarafından UserDefaults'a kaydedilir
   - `deviceId` (string): Device ID - iOS tarafından UserDefaults'a kaydedilir
   - `paymentStatus` (string): Ödeme durumu (`pending`, `completed`, `failed`)
   - `escrowStatus` (string): Escrow durumu (`pending`, `held`, `released`)
   - `totalAmount` (number): Toplam tutar
   - `providerTransactionId` (string, opsiyonel): PAYNET transaction ID
   - `publishableKey` (string, opsiyonel): PAYNET publishable key (iOS için)
   - `paymentUrl` (string, opsiyonel): 3D Secure ödeme URL'i
   - `feeBreakdown` (object, opsiyonel): Ücret dökümü - iOS tarafından UserDefaults'a kaydedilir
   
   **Status Codes:**
   - `201 Created` - Ödeme başarıyla başlatıldı
   - `400 Bad Request` - Geçersiz request veya tutar uyuşmazlığı
   - `401 Unauthorized` - Geçersiz token
   - `404 Not Found` - Cihaz bulunamadı
   
   **Önemli Notlar:**
   - Backend, frontend'den gelen `totalAmount` değerini veritabanındaki `device_models.ifoundanapple_fee` değeri ile karşılaştırır
   - Cihaz `status = 'matched'` olmalıdır
   - Sadece cihaz sahibi (device.userId) ödeme yapabilir
   - Backend veritabanına yazmaz, sadece Paynet API ile iletişim kurar
   - iOS tarafından `deviceId` ve `feeBreakdown` UserDefaults'a kaydedilir (webhook geldiğinde kullanılır)
   - Kullanım: Device Detail Screen'den ödeme başlatıldığında

2. **POST `/v1/payments/complete-3d`** - 3D Secure tamamlama
   
   **Request Body:**
   ```json
   {
     "paymentId": "123e4567-e89b-12d3-a456-426614174000",
     "sessionId": "session_abc123xyz",
     "tokenId": "token_xyz789abc"
   }
   ```
   
   **Request Fields:**
   - `paymentId` (string, UUID, **ZORUNLU**): Ödeme başlatma sırasında alınan payment ID
   - `sessionId` (string, **ZORUNLU**): PAYNET 3D Secure callback'inden gelen session ID
   - `tokenId` (string, **ZORUNLU**): PAYNET 3D Secure callback'inden gelen token ID
   
   **Response:**
   ```json
   {
     "success": true,
     "paymentId": "123e4567-e89b-12d3-a456-426614174000",
     "message": "3D Secure payment completed. Waiting for webhook confirmation."
   }
   ```
   
   **Status Codes:**
   - `200 OK` - 3D Secure ödeme başarıyla tamamlandı
   - `400 Bad Request` - Geçersiz request, payment zaten işlenmiş veya kullanıcıya ait değil
   - `401 Unauthorized` - Geçersiz token
   - `404 Not Found` - Payment bulunamadı
   
   **Önemli Notlar:**
   - Payment'ın kullanıcıya ait olduğu doğrulanır
   - Payment'ın `pending` status'ünde olduğu kontrol edilir
   - Backend veritabanına yazmaz, sadece Paynet API'ye 3D Secure sonucu gönderir
   - Final payment status webhook ile güncellenir
   - iOS tarafından webhook gelene kadar polling yapılır
   - Kullanım: 3D Secure WebView'den callback geldiğinde

3. **GET `/v1/payments/{paymentId}/status`** - Payment status kontrolü
   
   **ÖNEMLİ:** iOS tarafından webhook gelene kadar polling yapılır. Webhook geldiğinde veritabanı kayıtları oluşturulur.
   
   **Path Parameters:**
   - `paymentId` (string, UUID, **ZORUNLU**): Payment ID
   
   **Response:**
   ```json
   {
     "id": "payment-uuid-123",
     "deviceId": "123e4567-e89b-12d3-a456-426614174000",
     "paymentStatus": "completed",
     "escrowStatus": "held",
     "webhookReceived": true,
     "totalAmount": 2000.0,
     "providerTransactionId": "paynet-txn-123"
   }
   ```
   
   **Response Fields:**
   - `id` (string): Payment ID
   - `deviceId` (string): Device ID
   - `paymentStatus` (string): Ödeme durumu (`pending`, `completed`, `failed`)
   - `escrowStatus` (string): Escrow durumu (`pending`, `held`, `released`)
   - `webhookReceived` (boolean): Webhook geldi mi?
   - `totalAmount` (number): Toplam tutar
   - `providerTransactionId` (string, opsiyonel): PAYNET transaction ID
   
   **Status Codes:**
   - `200 OK` - Payment status başarıyla alındı
   - `401 Unauthorized` - Geçersiz token
   - `404 Not Found` - Payment bulunamadı
   
   **Önemli Notlar:**
   - iOS tarafından webhook gelene kadar polling yapılır (30 deneme, 10 saniye aralık)
   - `webhookReceived: true` olduğunda iOS webhook data'yı alır ve veritabanı kayıtlarını oluşturur
   - Kullanım: Payment Success Screen'de webhook beklenirken

4. **GET `/v1/payments/{paymentId}/webhook-data`** - Webhook data çekme
   
   **ÖNEMLİ:** iOS tarafından webhook geldiğinde ve ödeme başarılı olduğunda çağrılır. Bu data ile veritabanı kayıtları oluşturulur.
   
   **Path Parameters:**
   - `paymentId` (string, UUID, **ZORUNLU**): Payment ID
   
   **Response:**
   ```json
   {
     "success": true,
     "webhookData": {
       "reference_no": "REF123456",
       "is_succeed": true,
       "amount": 2000.0,
       "netAmount": 1931.4,
       "comission": 68.6,
       "authorization_code": "AUTH123",
       "order_id": "ORDER123",
       "xact_date": "2025-01-15T10:30:00Z"
     }
   }
   ```
   
   **Response Fields:**
   - `success` (boolean): İşlem başarılı mı?
   - `webhookData` (object, opsiyonel): Webhook payload
     - `reference_no` (string): Paynet referans numarası
     - `is_succeed` (boolean): Ödeme başarılı mı?
     - `amount` (number): Toplam tutar
     - `netAmount` (number): Net tutar
     - `comission` (number): Komisyon
     - `authorization_code` (string): Yetkilendirme kodu
     - `order_id` (string): Sipariş ID
     - `xact_date` (string): İşlem tarihi (ISO 8601)
   - `error` (string, opsiyonel): Hata mesajı
   
   **Status Codes:**
   - `200 OK` - Webhook data başarıyla alındı
   - `401 Unauthorized` - Geçersiz token
   - `404 Not Found` - Payment veya webhook data bulunamadı
   
   **Önemli Notlar:**
   - iOS tarafından `webhookReceived: true` olduğunda çağrılır
   - Bu data ile `payments` ve `escrow_accounts` tablolarına kayıt oluşturulur
   - Kullanım: Payment Success Screen'de webhook geldiğinde

5. **GET `/v1/payments/test-paynet-connection`** - PAYNET bağlantı testi
   
   **Response:**
   ```json
   {
     "success": true,
     "message": "PAYNET API connection tests passed. Ready for integration testing.",
     "config": {
       "apiUrl": "https://api.paynet.com.tr",
       "hasApiKey": true,
       "hasSecretKey": true,
       "hasPublishableKey": true
     }
   }
   ```
   
   **Kullanım:** Development/test ortamında bağlantı kontrolü için

#### Webhook Endpoints
| Method | Endpoint | Auth | Açıklama |
|--------|----------|------|----------|
| POST | `/v1/webhooks/paynet-callback` | IP Whitelist | PAYNET ödeme callback webhook'u |

**Webhook Endpoint Detayları:**
- **POST `/v1/webhooks/paynet-callback`** - PAYNET callback
  - **Not:** iOS uygulaması bu endpoint'i **DOĞRUDAN KULLANMAZ**
  - Bu endpoint PAYNET tarafından çağrılır (IP whitelist ile korunur)
  - Backend webhook'u alır, doğrular ve saklar (veritabanına yazmaz)
  - iOS uygulaması payment status'u polling ile kontrol eder (`GET /v1/payments/{paymentId}/status`)
  - Webhook geldiğinde iOS uygulaması webhook data'yı alır (`GET /v1/payments/{paymentId}/webhook-data`)
  - iOS uygulaması Supabase'e yazar (payments, escrow_accounts, devices, audit_logs)

#### Admin Endpoints
| Method | Endpoint | Auth | Açıklama |
|--------|----------|------|----------|
| GET | `/v1/admin/diagnostics` | Admin Only | Admin tanılama endpoint'i |

**Admin Endpoint Detayları:**
- **GET `/v1/admin/diagnostics`** - Admin tanılama
  - **Not:** iOS uygulaması bu endpoint'i **KULLANMAZ**
  - Sadece admin paneli veya backend yönetimi için
  - Normal kullanıcılar için erişim yok

#### Documentation Endpoint
| Endpoint | Açıklama |
|----------|----------|
| `/v1/docs` | Swagger/OpenAPI interaktif dokümantasyon |

### Backend API Konfigürasyonu

**Base URL:**
- **Development**: `http://localhost:3000/v1`
- **Production**: `https://api.ifoundanapple.com/v1`

**Authentication:**
- JWT gerektiren endpoint'ler için: `Authorization: Bearer <supabase_jwt_token>` header'ı gerekir
- Token Supabase Auth ile alınır: `supabase.auth.session()?.access_token`
- Public endpoint'ler authentication gerektirmez
- Admin endpoint'leri AdminGuard ile korunur (iOS uygulaması kullanmaz)
- Webhook endpoint'i IP whitelist ile korunur (iOS uygulaması kullanmaz)

**Content-Type:**
- Tüm request'ler: `application/json`
- Character Encoding: `UTF-8`

**Error Handling:**
- `400 Bad Request` - Geçersiz request body veya parametreler
- `401 Unauthorized` - Geçersiz veya eksik token
- `404 Not Found` - Kaynak bulunamadı
- `500 Internal Server Error` - Backend hatası

**Error Response Format:**
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### iOS Uygulaması İçin Kullanılacak Endpoint'ler

**iOS uygulaması sadece şu endpoint'leri kullanır:**
1. ✅ `GET /v1/health` - Health check (opsiyonel, debug için)
2. ✅ `GET /v1/session` - Session kontrolü (opsiyonel)
3. ✅ `POST /v1/payments/process` - Ödeme başlatma (**KULLANILIR**)
4. ✅ `POST /v1/payments/complete-3d` - 3D Secure tamamlama (**KULLANILIR**)
5. ✅ `GET /v1/payments/test-paynet-connection` - Test bağlantısı (development için)

**iOS uygulaması kullanmayacak endpoint'ler:**
- ❌ `POST /v1/webhooks/paynet-callback` - Backend tarafından işlenir
- ❌ `GET /v1/admin/diagnostics` - Admin only
- ❌ `GET /v1/docs` - Dokümantasyon (browser'da görüntülenir)

**Toplam:** iOS uygulaması **5 endpoint** kullanır (3 payment, 1 health, 1 session)

---

## 📱 Ekran Listesi ve İş Akışları

### Toplam Ekran Sayısı: 38-42 Ekran

**Not:** Ekran listesi iOS geliştirme için kritik öneme sahiptir. Her ekranın amacı, içeriği ve navigasyon akışı net olmalıdır.

**Önemli:** Kargo bilgileri ayrı bir ekran değil, **Device Detail Screen içinde** gösterilir. Kullanıcı kargo bilgilerini ilgili cihazın detay sayfasından görür.

### 1. Authentication (Kimlik Doğrulama) - 5 Ekran

#### 1.1 Splash/Launch Screen
- **Amaç**: Uygulama açılış ekranı
- **İçerik**: Logo, loading indicator
- **Süre**: 2-3 saniye
- **Sonraki Adım**: Kullanıcı oturumu varsa Dashboard, yoksa Onboarding

#### 1.2 Onboarding/Welcome Screen
- **Amaç**: İlk kullanım tanıtımı
- **İçerik**: 
  - Uygulamanın amacı (kayıp Apple cihazlarını bulma)
  - Nasıl çalışır (3-4 adım görsel açıklama)
  - "Başla" butonu
- **Sonraki Adım**: Login veya Register

#### 1.3 Login Screen
- **Amaç**: Mevcut kullanıcı girişi
- **İçerik**:
  - Email input field
  - Password input field (güvenli giriş)
  - "Giriş Yap" butonu
  - "Şifremi Unuttum" linki
  - "Google ile Giriş" butonu
  - "Apple ile Giriş" butonu (Sign in with Apple)
  - "Hesabınız yok mu? Kayıt Ol" linki
- **Validasyon**: Email format, şifre minimum 6 karakter
- **Sonraki Adım**: Dashboard (başarılı giriş)

#### 1.4 Register Screen
- **Amaç**: Yeni kullanıcı kaydı
- **İçerik**:
  - Ad (firstName) - zorunlu
  - Soyad (lastName) - zorunlu
  - Email - zorunlu
  - Şifre - zorunlu (minimum 6 karakter)
  - Şifre Tekrar - zorunlu
  - "Kullanım Şartları" checkbox (zorunlu)
  - "Gizlilik Politikası" checkbox (zorunlu)
  - "Kayıt Ol" butonu
  - "Google ile Kayıt Ol" butonu
  - "Apple ile Kayıt Ol" butonu
  - "Zaten hesabınız var mı? Giriş Yap" linki
- **Validasyon**: Tüm alanlar zorunlu, email format, şifre eşleşmesi
- **Sonraki Adım**: Email doğrulama (opsiyonel) → Dashboard

#### 1.5 Reset Password Screen
- **Amaç**: Şifre sıfırlama
- **İçerik**:
  - Email input field
  - "Şifre Sıfırlama Linki Gönder" butonu
  - Bilgilendirme mesajı
- **Sonraki Adım**: Email gönderildi onay ekranı

---

### 2. Ana Navigasyon - 3 Ekran

#### 2.1 Tab Bar Controller (Ana Navigasyon)
- **Tab'lar**:
  1. **Dashboard** (Ana Sayfa) - Home icon
  2. **Cihazlarım** - Devices icon
  3. **Bildirimler** - Bell icon (badge ile okunmamış sayısı)
  4. **Profil** - Person icon
- **Tasarım**: Native iOS Tab Bar, SF Symbols kullanılmalı

#### 2.2 Home/Dashboard Screen
- **Amaç**: Ana dashboard, cihaz listesi ve istatistikler
- **İçerik**:
  - Hoş geldin mesajı (kullanıcı adı ile)
  - İstatistik kartları (opsiyonel):
    - Toplam cihaz sayısı
    - Eşleşen cihazlar
    - Bekleyen ödemeler
  - "Eşleşen Cihazlar" bölümü (varsa)
    - Özel vurgu, farklı renk
    - "Ödemeyi Yap" butonu
  - "Tüm Cihazlarım" bölümü
    - Cihaz kartları listesi
    - Durum badge'leri
  - Floating Action Button: "+" (Cihaz Ekle)
- **Real-time**: Supabase subscription ile anlık güncellemeler

#### 2.3 Notifications Screen
- **Amaç**: Bildirimler listesi
- **İçerik**:
  - Okunmamış bildirimler (üstte, farklı stil)
  - Okunmuş bildirimler
  - Her bildirim kartı:
    - İkon (duruma göre)
    - Mesaj
    - Tarih
    - Okundu/okunmadı göstergesi
  - Bildirime tıklama → İlgili ekrana yönlendirme
- **Real-time**: Supabase subscription ile yeni bildirimler anlık gelir

---

### 3. Cihaz Yönetimi - 8 Ekran

#### 3.1 Device List Screen
- **Amaç**: Tüm cihazların listesi
- **İçerik**:
  - Filtreler:
    - Durum filtresi (Tümü, Kayıp, Bulunan, Eşleşen, vb.)
    - Rol filtresi (Sahip, Bulan)
  - Arama barı (model, seri no ile)
  - Cihaz kartları:
    - Cihaz modeli
    - Seri numarası
    - Durum badge
    - Son güncelleme tarihi
  - Pull-to-refresh
- **Navigasyon**: Cihaz kartına tıklama → Device Detail

#### 3.2 Add Device Screen (Cihaz Ekleme Seçimi)
- **Amaç**: Cihaz ekleme tipi seçimi
- **İçerik**:
  - İki büyük buton:
    1. "Kayıp Cihaz Bildir" (Lost Device)
    2. "Bulunan Cihaz Bildir" (Found Device)
  - Her buton altında kısa açıklama
- **Sonraki Adım**: Seçime göre Add Lost Device veya Add Found Device

#### 3.3 Add Lost Device Form
- **Amaç**: Kayıp cihaz kaydı
- **Form Alanları**:
  - Cihaz Modeli (Picker/Dropdown) - zorunlu
  - Seri Numarası (Text Input) - zorunlu
  - Renk (Picker, model'e göre dinamik) - zorunlu
  - Kayıp Tarihi (Date Picker) - zorunlu
  - Kayıp Yeri (Text Input) - zorunlu
  - Açıklama (Text Area) - opsiyonel
  - Fatura/Fiş Yükleme (Image Picker) - opsiyonel ama önerilir
- **Validasyon**: Zorunlu alanlar kontrolü
- **Sonraki Adım**: Form kaydedilir → Device Detail (LOST status)

#### 3.4 Add Found Device Form
- **Amaç**: Bulunan cihaz kaydı
- **Form Alanları**:
  - Cihaz Modeli (Picker) - zorunlu
  - Seri Numarası (Text Input) - zorunlu
  - Renk (Picker) - zorunlu
  - Bulunma Tarihi (Date Picker) - zorunlu
  - Bulunma Yeri (Text Input) - zorunlu
  - Açıklama (Text Area) - opsiyonel
  - Cihaz Fotoğrafları (Image Picker, çoklu seçim, ön ve arka) - zorunlu
- **Validasyon**: Zorunlu alanlar, minimum 2 fotoğraf
- **Sonraki Adım**: Form kaydedilir → Device Detail (REPORTED status)

#### 3.5 Device Detail Screen
- **Amaç**: Cihaz detay sayfası (duruma göre dinamik içerik)
- **KRİTİK**: UI rendering'de `device.status` yerine `device.device_role` kullanılmalı!
- **Durum Bazlı Görünümler**:

  **LOST Status (device_role = 'owner')**:
  - Başlık: "Cihazınızın Kaydı Başarıyla Tamamlandı!"
  - Mesaj: "Kayıp cihazınız sisteme kaydedildi. Eşleşme bulunduğunda size bildirim gönderilecektir."
  - Cihaz bilgileri kartı:
    - Kayıp Tarihi
    - Kayıp Yeri
    - Cihaz Modeli
    - Cihaz Seri Numarası
    - Cihaz Rengi
    - Ek Detaylar
    - Satın Alma Kanıtı (Fatura) Dosyası (secure URL)
  - İşlem durumu kartı: "Kayıtlı XXX seri numaralı YYY cihazı eşleşme bekleniyor."
  - Durum Bilgisi (5 adımlı timeline):
    1. ✅ Cihaz için eşleşme bekleniyor (aktif, turuncu)
    2. ⏳ Cihazınız bulundu
    3. ⏳ Cihazınızın kargo ile teslim edilmesi bekleniyor
    4. ⏳ Cihaz Teslim Alındığında
    5. ⏳ İşlem Tamamlandı
  - "KAYDI SİL" butonu (kırmızı, destructive)
  - "CİHAZLARIM LİSTESİNE GERİ DÖN" butonu

  **REPORTED Status (device_role = 'finder')**:
  - Başlık: "Cihazın Kaydı Başarıyla Tamamlandı!"
  - Mesaj: "Bulduğun cihaz sisteme kaydedildi. Eşleşme bulunduğunda size bildirim gönderilecektir."
  - Bulunan cihaz bilgileri kartı:
    - Bulunma Tarihi
    - Bulunma Yeri
    - Cihaz Modeli
    - Cihaz Seri Numarası
    - Cihaz Rengi
    - Ek Detaylar
    - Bulunan Cihaz Fotoğrafı (Ön ve Arka) - secure URLs
  - İşlem durumu kartı: "Kayıtlı XXX seri numaralı YYY cihaz için eşleşme bekleniyor."
  - Durum Bilgisi (5 adımlı timeline):
    1. ✅ Cihaz için eşleşme bekleniyor (aktif, turuncu)
    2. ⏳ Eşleşme bulundu
    3. ⏳ Cihazın Kargo Firmasına Teslim Edilmesi
    4. ⏳ Cihaz Sahibi Teslim Alındığında
    5. ⏳ İşlem Tamamlandı
  - Teşekkür mesajı: "ÇOK TEŞEKKÜR EDERİZ! iFoundAnApple olarak, dürüstlüğünüzü ve yardımseverliğinizi yürekten takdir ederiz!"

  **MATCHED Status (device_role = 'owner')**:
  - Başlık: "Eşleşme Bulundu!"
  - Mesaj: "Eşleşme Bulundu!, Ödeme Bekleniyor"
  - Cihaz bilgileri kartı (yukarıdaki gibi)
  - İşlem durumu kartı: "Kayıtlı XXX seri numaralı YYY cihazı için eşleşme bulundu. Ödeme Bekleniyor."
  - Durum Bilgisi (5 adımlı timeline):
    1. ✅ Cihaz için eşleşme bekleniyor
    2. ✅ Cihazınız bulundu (aktif, turuncu)
    3. ⏳ Cihazınızın kargo ile teslim edilmesi bekleniyor
    4. ⏳ Cihaz Teslim Alındığında
    5. ⏳ İşlem Tamamlandı
  - **"Ödemeyi Güvenle Yap" butonu** (büyük, mavi, vurgulu) → Match Payment Screen'e yönlendirir

  **MATCHED Status (device_role = 'finder')**:
  - Başlık: "Eşleşme Bulundu!"
  - Mesaj: "Cihaz sahibinin ödeme yapması bekleniyor."
  - Bulunan cihaz bilgileri kartı (yukarıdaki gibi)
  - Fotoğraflar (ön ve arka)
  - İşlem durumu kartı: "Kayıtlı XXX seri numaralı YYY cihaz için eşleşme bulundu."
  - Durum Bilgisi (5 adımlı timeline):
    1. ✅ Cihaz için eşleşme bekleniyor
    2. ✅ Eşleşme bulundu (aktif, turuncu)
    3. ⏳ Cihazın Kargo Firmasına Teslim Edilmesi
    4. ⏳ Cihaz Sahibi Teslim Alındığında
    5. ⏳ İşlem Tamamlandı
  - Uyarı: "💡 Önemli: Cihaz eşleşmesi gerçekleştiği zaman lütfen kimlik ve IBAN bilgilerinizin doğruluğunu profil sayfasından kontrol ediniz."

  **PAYMENT_PENDING Status (device_role = 'owner')**:
  - Ödeme işlemi başlatıldı, 3D Secure bekleniyor
  - Loading indicator
  - "Ödeme işleniyor..." mesajı

  **PAYMENT_COMPLETED Status (device_role = 'owner')**:
  - **Not:** Database'de status değeri `"payment_completed"` (TypeScript'te `PAYMENT_COMPLETE = "payment_complete"` olsa bile, backend `payment_completed` yazıyor)
  - Başlık: "Ödemeniz Başarıyla Tamamlandı!"
  - Mesaj: "Cihazınızın kargo firmasına teslim edilmesi bekleniliyor."
  - Cihaz bilgileri kartı
  - İşlem durumu kartı: "Kayıtlı XXX seri numaralı YYY cihaz ödemesi alındı. Kargo firmasına teslimi bekleniliyor."
  - Ödeme Detayları kartı:
    - Ödeme ID
    - Toplam Tutar
    - Ödeme Durumu: Tamamlandı
    - Ödeme Sağlayıcı
    - Ödeme Tarihi
  - Escrow Durumu kartı:
    - Escrow ID
    - Durum: Beklemede
    - Escrow Tutarı
  - Durum Bilgisi (5 adımlı timeline):
    1. ✅ Cihaz için eşleşme bekleniyor
    2. ✅ Cihazınız bulundu
    3. ✅ Cihazınızın kargo ile teslim edilmesi bekleniyor (aktif, turuncu)
    4. ⏳ Cihaz Teslim Alındığında
    5. ⏳ İşlem Tamamlandı
  - Not: "Kargoya verildiğinde takip numaranız burada görünecektir."

  **PAYMENT_COMPLETED Status (device_role = 'finder')**:
  - **Not:** Database'de status değeri `"payment_completed"`
  - Başlık: "Ödeme Süreci Tamamlandı!"
  - Mesaj: "Lütfen en kısa sürede cihazı kargo firmasına teslim edin."
  - Uyarı kartı: "⚠️ Ödülünüzü alabilmek için lütfen profil bilgilerinizi tamamlayın:"
    - [ ] TC Kimlik Numaranızı girin
    - [ ] IBAN bilgilerinizi ekleyin
  - Bulunan cihaz bilgileri kartı
  - İşlem durumu kartı: "Kayıtlı XXX seri numaralı YYY cihaz için ödeme tamamlandı."
  - **Teslim Kodu Kartı** (Device Detail Screen içinde, büyük ve vurgulu):
    - Başlık: "Kargo Firmasına Vereceğiniz Teslim Kodunuz"
    - **Teslim Kodu:** `cargo_shipments.code` (büyük font, monospace, vurgulu gösterim)
    - Kopyalama butonu
    - QR kod gösterimi (opsiyonel, kargo firması için)
    - Açıklama: "Bu kodu kargo firması şubesine göstererek cihazı teslim edebilirsiniz."
    - Kargo Firması: `cargo_shipments.cargo_company`
    - Anonim Kimlik: `sender_anonymous_id` (bulan kişi için)
  - Durum Bilgisi (5 adımlı timeline):
    1. ✅ Cihaz için eşleşme bekleniyor
    2. ✅ Eşleşme bulundu
    3. ✅ Cihazın Kargo Firmasına Teslim Edilmesi (aktif, turuncu)
    4. ⏳ Cihaz Sahibi Teslim Alındığında
    5. ⏳ İşlem Tamamlandı
  - **Not:** Tüm kargo bilgileri Device Detail Screen içinde gösterilir. Ayrı bir ekran yok.

  **CARGO_SHIPPED Status (device_role = 'owner')**:
  - Başlık: "Cihazınız Kargo Firmasına Teslim Edildi!"
  - Mesaj: "Cihazınız yolda! Lütfen takip numarası ile kontrol edin."
  - Cihaz bilgileri kartı
  - İşlem durumu kartı: "Kayıtlı XXX seri numaralı YYY cihaz yolda. Kargo firması cihazı teslim edecek."
  - Ödeme Detayları kartı
  - Escrow Durumu kartı
  - **Kargo Takip Bilgileri kartı** (Device Detail Screen içinde):
    - Takip Numarası: `cargo_shipments.tracking_number` (varsa, monospace font, kopyalama butonu ile)
    - Kargo Firması: `cargo_shipments.cargo_company` (capitalize)
    - Kargo Durumu: `cargo_shipments.cargo_status` (badge ile: picked_up, in_transit, out_for_delivery)
    - Tahmini Teslimat: `estimated_delivery_days` gün
    - Teslim Alındı Tarihi: `picked_up_at` (varsa)
    - "Kargo Firması Web Sitesinde Takip Et" linki (opsiyonel, harici link)
  - Durum Bilgisi (5 adımlı timeline):
    1. ✅ Cihaz için eşleşme bekleniyor
    2. ✅ Cihazınız bulundu
    3. ✅ Cihazınızın size teslim edilmesi bekleniyor (aktif, turuncu)
    4. ⏳ Cihaz Teslim Alındığında
    5. ⏳ İşlem Tamamlandı
  - **Not:** Ayrı bir "Cargo Management" ekranı yok. Tüm kargo bilgileri Device Detail Screen içinde gösterilir.

  **CARGO_SHIPPED Status (device_role = 'finder')**:
  - Başlık: "Cihaz Yola Çıktı!"
  - Mesaj: "Cihazı başarıyla kargoya teslim ettin. Sahibine ulaşması bekleniyor."
  - Bulunan cihaz bilgileri kartı
  - İşlem durumu kartı: "Cihaz kargoya verildi. Sahibine teslim edilmesi bekleniyor."
  - Durum Bilgisi (5 adımlı timeline):
    1. ✅ Cihaz için eşleşme bekleniyor
    2. ✅ Eşleşme bulundu
    3. ✅ Cihazın Kargo Firmasına Teslim Edilmesi
    4. ✅ Cihaz Sahibi Teslim Alındığında (aktif, turuncu)
    5. ⏳ İşlem Tamamlandı

  **DELIVERED Status (device_role = 'owner')**:
  - Başlık: "Cihazınız Size Teslim Edildi!"
  - Mesaj: "Cihazınız teslim edildi. Lütfen Seri Numarasını Kontrol Edin ve Onaylayın."
  - Cihaz bilgileri kartı
  - İşlem durumu kartı: "Kayıtlı XXX seri numaralı YYY cihaz teslim edildi. Teslim almayı onaylayın."
  - Ödeme Detayları kartı
  - Escrow Durumu kartı: "Durum: Beklemede"
  - Durum Bilgisi (5 adımlı timeline):
    1. ✅ Cihaz için eşleşme bekleniyor
    2. ✅ Cihazınız bulundu
    3. ✅ Cihazınızın size teslim edilmesi bekleniyor
    4. ✅ Cihaz Teslim Alındığında (aktif, turuncu)
    5. ⏳ İşlem Tamamlandı
  - **"Onay Butonu"** (büyük, yeşil) → Delivery Confirmation Screen
  - "Sorun Var, İtiraz Et" butonu (kırmızı) → Dispute Screen

  **DELIVERED Status (device_role = 'finder')**:
  - Başlık: "Teslimat Tamamlandı! Onay Bekleniyor."
  - Mesaj: "Kargo firması cihazı sahibine teslim etti. Ödülünün serbest bırakılması için cihaz sahibinin teslimatı onaylaması bekleniyor."
  - Not: "Cihaz sahibi 48 saat içinde onaylamazsa, sistem işlemi otomatik olarak onaylayacaktır."
  - Bulunan cihaz bilgileri kartı
  - İşlem durumu kartı: "Cihaz sahibine teslim edildi. Onay bekleniyor."
  - Durum Bilgisi (5 adımlı timeline):
    1. ✅ Cihaz için eşleşme bekleniyor
    2. ✅ Eşleşme bulundu
    3. ✅ Cihazın Kargo Firmasına Teslim Edilmesi
    4. ✅ Cihaz Sahibi Teslim Alındığında (aktif, turuncu)
    5. ⏳ İşlem Tamamlandı

  **CONFIRMED Status (device_role = 'owner')**:
  - Geçici durum, hemen COMPLETED'e geçer

  **COMPLETED Status (device_role = 'owner')**:
  - Başlık: "Cihazınıza Kavuştuğunuz için Çok Mutluyuz!"
  - Mesaj: "Süreci başarı ile tamamladık."
  - Cihaz bilgileri kartı
  - İşlem durumu kartı: "Kayıtlı XXX seri numaralı YYY cihaz teslim edildi. Teslim alma onaylandı."
  - Ödeme Detayları kartı
  - Escrow Durumu kartı: "Durum: Serbest Bırakıldı."
  - Durum Bilgisi (5 adımlı timeline):
    1. ✅ Cihaz için eşleşme bekleniyor
    2. ✅ Cihazınız bulundu
    3. ✅ Cihazınızın size teslim edilmesi bekleniyor
    4. ✅ Cihaz Teslim Alındığında
    5. ✅ İşlem Tamamlandı (aktif, yeşil)

  **COMPLETED Status (device_role = 'finder')**:
  - Başlık: "İşlem Başarıyla Tamamlandı!"
  - Mesaj: "Yardımın için teşekkür ederiz! Ödülün, belirttiğin IBAN adresine transfer edildi."
  - Bulunan cihaz bilgileri kartı
  - İşlem durumu kartı: "İşlem tamamlandı. Ödülün gönderildi."
  - Durum Bilgisi (5 adımlı timeline):
    1. ✅ Cihaz için eşleşme bekleniyor
    2. ✅ Eşleşme bulundu
    3. ✅ Cihazın Kargo Firmasına Teslim Edilmesi
    4. ✅ Cihaz Sahibi Teslim Alındığında
    5. ✅ İşlem Tamamlandı (aktif, yeşil)
  - Not: "Takas tamamlandığında ödülünüz hesabınıza aktarılacak." (Metin "aktarıldı" olarak güncellenebilir)

  **DISPUTED Status**:
  - Başlık: "İtiraz Başlatıldı"
  - Mesaj: "İtirazınız admin tarafından inceleniyor. Sonuç size bildirilecektir."
  - İtiraz detayları
  - Admin yanıtı (varsa)

  **CANCELLED Status**:
  - Başlık: "İşlem İptal Edildi"
  - Mesaj: "İşlem iptal edildi. Para iadesi yapıldı." (eğer ödeme yapıldıysa)
  - İptal nedeni

  **RETURNED Status**:
  - Başlık: "Cihaz İade Edildi"
  - Mesaj: "Cihaz göndericiye iade edildi."
  - İade detayları

  **FAILED_DELIVERY Status**:
  - Başlık: "Teslimat Başarısız"
  - Mesaj: "Kargo firması teslimatı denedi ancak başarısız oldu."
  - Hata nedeni
  - "Adresi Güncelle" butonu

#### 3.6 Image Preview Screen
- **Amaç**: Fotoğraf/fatura tam ekran görüntüleme
- **Özellikler**:
  - Zoom in/out (pinch gesture)
  - Swipe ile diğer fotoğraflara geçiş
  - "X" butonu ile kapatma

#### 3.7 Delete Device Confirmation
- **Amaç**: Cihaz silme onayı
- **İçerik**: Alert dialog
  - "Bu cihazın kaydını silmek istediğinizden emin misiniz?" mesajı
  - "İptal" ve "Sil" butonları

---

### 4. Ödeme İşlemleri - 7 Ekran

#### 4.1 Match Payment Screen
- **Amaç**: Eşleşme bulundu, ödeme ekranı
- **İçerik**:
  - Sayfa Başlığı: "Eşleşme Ödemesi - Güvenli ödeme garantisi"
  - Sol Panel - Ücret Döküm Kartı (Mavi-Mor Gradient Arka Plan):
    - Ücret Detayları başlığı
    - Cihaz Modeli (örn: iPhone 17 Pro Max)
    - Detaylı Fiyatlandırma Listesi:
      - ✓ Bulan Kişiye Ödül: Cihazı bulan kişiye ödenecek ₺XXX
      - ✓ Kargo Ücreti: Hızlı karşılaştırma ₺YYY
      - ✓ Hizmet bedeli: Platform hizmet bedeli ₺ZZZ
      - ✓ Ödeme komisyonu: Güvenli ödeme işlem ücreti ₺KKK
      - ─────────────────────────────────
      - Toplam Ödenecek (Güvenli emanet ile tutulan) ₺TTT
  - Sağ Panel - Kayıp Cihaz Detayları:
    - Kayıp Cihaz Detayları başlığı
    - Kaybeden Zaman: Belirtilmemiş
    - Kayıp Lokasyon: Belirtilmemiş
    - Cihaz Modeli: iPhone 17 Pro Max
    - Cihaz Seri: Gizli bilgi
    - Cihaz Rengi: Belirtilmemiş
    - Ek Detaylar: Belirtilmemiş
    - [Ödemeye Geç →] butonu (Mavi Buton, tüm genişlik)
  - Alt Bilgilendirme Paneli - Güvenlik Garantileri:
    - ✓ iFoundAnApple'da ödeme sürecin tamamen güvenliğinizi düşünerek tasarlandı.
    - 🔒 Güvenli Emanet (Escrow) Sistemi açıklaması
    - ✓ Ödeme Altyapısı Güvencesiyle açıklaması
    - ⚖️ İptal Hakkınız Saklıdır açıklaması
    - ↩️ Şeffaf İade Politikası açıklaması
  - Yasal Uyarı (Footer)
- **Ücret Hesaplama Formülü:**
  ```swift
  // Ücret hesaplama (device_models tablosundan ifoundanapple_fee alınır)
  let totalAmount = deviceModel.ifoundanappleFee  // Toplam tutar
  let gatewayFee = totalAmount * 0.0343            // Gateway komisyonu: %3.43
  let cargoFee = 250.00                           // Kargo ücreti: 250.00 TL (sabit)
  let rewardAmount = totalAmount * 0.20           // Bulan kişi ödülü: %20
  let serviceFee = totalAmount - gatewayFee - cargoFee - rewardAmount  // Hizmet bedeli: Geriye kalan
  let netPayout = rewardAmount                     // Bulan kişiye gidecek net tutar
  ```
- **API**: Backend API'den ücret hesaplama (opsiyonel, Supabase'den de okunabilir)

#### 4.2 Payment Summary Screen
- **Amaç**: Ödeme özeti ve onay
- **İçerik**:
  - Ücret detayları (detaylı breakdown)
  - Kullanım şartları checkbox
  - "Ödemeyi Tamamla" butonu
- **Sonraki Adım**: 3D Secure ekranı

#### 4.3 Payment Method Selection
- **Amaç**: Ödeme yöntemi seçimi (şu an sadece PAYNET)
- **Not**: Gelecekte farklı ödeme yöntemleri eklenebilir

#### 4.4 3D Secure Payment Screen
- **Amaç**: 3D Secure doğrulama
- **Teknoloji**: WKWebView
- **İçerik**: Backend'den gelen `paymentUrl` WebView'de açılır
- **Özellikler**:
  - Loading indicator
  - JavaScript injection desteği
  - Cookie yönetimi
  - Deep linking callback handling
- **Sonraki Adım**: Callback handler

#### 4.5 Payment Processing Screen
- **Amaç**: Ödeme işleniyor göstergesi
- **İçerik**:
  - Loading spinner
  - "Ödeme işleniyor, lütfen bekleyin..." mesajı
  - İptal butonu (opsiyonel)
- **Süre**: Backend'den yanıt gelene kadar

#### 4.6 Payment Success Screen
- **Amaç**: Ödeme başarılı ekranı
- **İçerik**:
  - Başarı ikonu (checkmark)
  - "Ödemeniz başarıyla tamamlandı!" mesajı
  - Ödeme özeti
  - Escrow bilgisi
  - "Dashboard'a Dön" butonu
- **Real-time**: Supabase subscription ile payment status takibi

#### 4.7 Payment Callback Handler
- **Amaç**: 3D Secure callback işleme
- **Teknoloji**: Deep Linking (Universal Links veya URL Scheme)
- **URL Format**: 
  - `ifoundanapple://payment/callback?session_id=xxx&token_id=yyy`
  - veya `https://ifoundanapple.com/payment/callback?session_id=xxx&token_id=yyy`
- **İşlem**: 
  - `session_id` ve `token_id` alınır
  - Backend API'ye `POST /v1/payments/complete-3d` gönderilir
  - Başarılı ise → Payment Success
  - Hata ise → Error Screen

---

### 5. Kargo Takibi - 2 Ekran

**ÖNEMLİ NOT:** Kargo bilgileri **Device Detail Screen** içinde gösterilir. Ayrı bir "Cargo Management" ekranı **GEREKSİZDİR**. Kullanıcı kargo bilgilerini ilgili cihazın detay sayfasından görür.

#### 5.1 Cargo Information in Device Detail Screen
- **Amaç**: Kargo bilgileri Device Detail Screen'de gösterilir
- **Gösterim Yeri**: Device Detail Screen içinde, ilgili status'larda (PAYMENT_COMPLETED, CARGO_SHIPPED, DELIVERED)
- **Veri Kaynağı**: `cargo_shipments` tablosundan `device_id` ile sorgulanır
- **İçerik** (Device Detail Screen içinde, status'a göre dinamik):

  **PAYMENT_COMPLETED Status (finder için):**
  - **Teslim Kodu Kartı** (büyük ve vurgulu):
    - Başlık: "Kargo Firmasına Vereceğiniz Teslim Kodunuz"
    - Teslim Kodu: `cargo_shipments.code` (büyük font, monospace, vurgulu)
    - Kopyalama butonu
    - QR kod (opsiyonel)
    - Açıklama: "Bu kodu kargo firması şubesine göstererek cihazı teslim edebilirsiniz."
    - Kargo Firması: `cargo_shipments.cargo_company`
    - Anonim Kimlik: `sender_anonymous_id`

  **CARGO_SHIPPED Status (owner için):**
  - **Kargo Takip Bilgileri Kartı**:
    - Takip Numarası: `cargo_shipments.tracking_number` (varsa, monospace font, kopyalama butonu)
    - Kargo Firması: `cargo_shipments.cargo_company` (capitalize)
    - Kargo Durumu: `cargo_shipments.cargo_status` (badge ile: picked_up, in_transit, out_for_delivery)
    - Tahmini Teslimat: `estimated_delivery_days` gün
    - Teslim Alındı Tarihi: `picked_up_at` (varsa)
    - "Kargo Firması Web Sitesinde Takip Et" linki (harici link, kargo firmasının tracking URL'i)

  **DELIVERED Status (her iki rol için):**
  - **Kargo Takip Bilgileri Kartı** (yukarıdaki gibi, + teslim edildi bilgisi):
    - Teslim Edildi Tarihi: `delivered_at`
    - Teslim Onayı: `delivery_confirmed_by_receiver` (true/false)

  **Kargo Durum Timeline** (5 adım, Device Detail Screen içinde):
    1. Oluşturuldu (created/pending)
    2. Alındı (picked_up)
    3. Yolda (in_transit)
    4. Teslimat İçin Çıktı (out_for_delivery)
    5. Teslim Edildi (delivered)
    - Aktif adım vurgulanır (turuncu)
    - Tamamlanan adımlar yeşil checkmark
    - Timeline, `cargo_shipments.cargo_status` değerine göre dinamik olarak güncellenir

**Not:** 
- Kullanıcı birden fazla cihazı varsa, her cihazın kargo bilgileri o cihazın Device Detail Screen'inde gösterilir
- Dashboard'dan ilgili cihaza gidilir
- **Ayrı bir "Cargo Management" ekranı GEREKSİZDİR** - tüm kargo bilgileri Device Detail Screen içinde gösterilir

#### 5.2 Cargo Tracking Screen (Harita Görünümü - Opsiyonel)
- **Amaç**: Kargo takip (harita görünümü)
- **Navigasyon**: Device Detail Screen'den "Haritada Görüntüle" butonu (opsiyonel)
- **İçerik**:
  - MapView (Apple Maps)
  - Kargo konumu güncellemeleri (eğer kargo firması API'si sağlıyorsa)
  - Timeline görünümü
- **Not**: Bu ekran opsiyoneldir. Kargo firması API'si real-time tracking sağlamıyorsa, sadece takip numarası gösterilir ve kullanıcı kargo firmasının web sitesinden takip eder.

#### 5.3 Delivery Confirmation Screen
- **Amaç**: Teslimat onayı
- **İçerik**:
  - Cihaz bilgileri
  - Seri numarası kontrolü (kullanıcıdan onay)
  - "Teslim Aldım" butonu
  - Fotoğraf çekme (opsiyonel, kanıt için)
- **Validasyon**: Seri numarası eşleşmesi kontrolü
- **Sonraki Adım**: Onay sonrası → COMPLETED status

---

### 6. Profil ve Ayarlar - 6 Ekran

#### 6.1 Profile Screen
- **Amaç**: Profil ana ekran
- **İçerik**:
  - Kullanıcı bilgileri özeti:
    - Ad Soyad
    - Email
    - Profil fotoğrafı (opsiyonel)
  - "Profili Düzenle" butonu
  - "Banka Hesabı" bölümü
  - "Ayarlar" bölümü

#### 6.2 Edit Profile Screen
- **Amaç**: Profil düzenleme
- **Form Alanları**:
  - Ad (firstName) - zorunlu
  - Soyad (lastName) - zorunlu
  - Email - değiştirilemez (gri, disabled)
  - Doğum Tarihi (Date Picker) - opsiyonel
    - **Not**: Ödeme için önerilir (minimum 13 yaş, COPPA uyumu)
    - Boş ise ödemeyi güvenle yap butonu pasif olabilir
  - TC Kimlik No (Text Input, masked, 11 haneli) - opsiyonel
    - **Validasyon**: 11 haneli, algoritma doğrulaması
    - **Zorunluluk**: 
      - Cihaz sahibi için ödeme adımından önce zorunlu
      - Bulan kişi için ödeme alındıktan sonra zorunlu
    - **Güvenlik**: Veritabanında AES-256-GCM ile şifrelenmiş saklanır
    - Boş ise ödemeyi güvenle yap butonu pasif olabilir
  - Telefon Numarası (Text Input, masked, Türk formatı) - zorunlu
    - **Validasyon**: Türk telefon numarası formatı
  - Adres (Text Area) - opsiyonel
    - **Zorunluluk**: Ödeme için zorunlu (kargo adresi için)
    - **Güvenlik**: Veritabanında AES-256-GCM ile şifrelenmiş saklanır
    - Boş ise ödemeyi güvenle yap butonu pasif olabilir
  - "Kaydet" butonu
- **Validasyon**: TC Kimlik No formatı, telefon formatı
- **Şifreleme Notu**: TC Kimlik No, Telefon, Adres alanları kaydedilirken Supabase'e gönderilmeden önce şifrelenmelidir (iOS tarafında encryption yapılmaz, backend'de yapılır veya Supabase Edge Function'da yapılır)

#### 6.3 Bank Account Screen
- **Amaç**: Banka hesabı bilgileri
- **İçerik**:
  - IBAN input field (masked, TR ile başlamalı)
  - Açıklama: "Bu bilgi ödül ödemeleri için kullanılır"
  - "Kaydet" butonu
- **Validasyon**: IBAN formatı (TR + 24 digit)
- **Zorunluluk**: 
  - **Sadece bulan kişi için zorunlu** (ödül almak için)
  - Cihaz sahibinden IBAN istenmez veya zorunlu tutulmamalıdır
  - Ödeme yapıldığı anda sistem, bulan kişiye "Ödülünüzü alabilmek ve kargo sürecini başlatmak için lütfen IBAN bilgilerinizi tamamlayın" uyarısını göstermelidir
- **Güvenlik**: Veritabanında AES-256-GCM ile şifrelenmiş saklanır

#### 6.4 Settings Screen
- **Amaç**: Uygulama ayarları
- **İçerik**:
  - "Bildirimler" toggle
  - "Dil" seçimi (Türkçe/İngilizce)
  - "Hakkında" linki
  - "Yardım ve Destek" linki
  - "Çıkış Yap" butonu (kırmızı, son sırada)

#### 6.5 Terms & Conditions Screen
- **Amaç**: Kullanım şartları
- **İçerik**: Web'deki içerik ile aynı, scrollable text view

#### 6.6 Privacy Policy Screen
- **Amaç**: Gizlilik politikası
- **İçerik**: Web'deki içerik ile aynı, scrollable text view

---

### 7. Bilgi ve Destek - 4 Ekran

#### 7.1 FAQ Screen
- **Amaç**: Sık sorulan sorular
- **İçerik**: Accordion style soru-cevap listesi
- **Navigasyon**: Settings veya Profile'dan erişilebilir

#### 7.2 Contact Screen
- **Amaç**: İletişim formu
- **İçerik**:
  - İsim input
  - Email input
  - Konu input
  - Mesaj text area
  - "Gönder" butonu
- **API**: Backend'e form gönderimi (opsiyonel, email gönderimi)

#### 7.3 About Screen
- **Amaç**: Uygulama hakkında
- **İçerik**:
  - Uygulama versiyonu
  - Geliştirici bilgileri
  - Logo

#### 7.4 Help & Support Screen
- **Amaç**: Yardım ve destek
- **İçerik**:
  - FAQ linki
  - İletişim linki
  - Yardım dokümantasyonu linkleri

---

### 8. Admin Ekranları (Opsiyonel) - 2 Ekran

#### 8.1 Admin Dashboard
- **Amaç**: Admin ana ekran
- **Erişim**: Sadece admin rolüne sahip kullanıcılar
- **İçerik**: İstatistikler, raporlar (gelecekte eklenebilir)

#### 8.2 Admin Security Dashboard
- **Amaç**: Güvenlik paneli
- **İçerik**: Audit logs, kullanıcı yönetimi (gelecekte eklenebilir)

---

## 🔄 İş Akışları (User Flows)

### Akış 1: Kayıt ve İlk Kullanım
```
Splash Screen
  ↓
Onboarding Screen (ilk kullanım)
  ↓
Register Screen
  ↓ (Email/Şifre veya OAuth)
Email Doğrulama (opsiyonel)
  ↓
Dashboard (ilk cihaz ekleme önerisi)
```

### Akış 2: Kayıp Cihaz Bildirme
```
Dashboard
  ↓
Add Device Screen (Cihaz Ekle)
  ↓
"Kayıp Cihaz Bildir" seçimi
  ↓
Add Lost Device Form
  ↓ (Form doldur, fatura yükle)
Device Detail Screen (LOST status)
  ↓
Eşleşme Bekle (Real-time subscription)
```

### Akış 3: Bulunan Cihaz Bildirme
```
Dashboard
  ↓
Add Device Screen
  ↓
"Bulunan Cihaz Bildir" seçimi
  ↓
Add Found Device Form
  ↓ (Form doldur, fotoğraf yükle)
Device Detail Screen (REPORTED status)
  ↓
Eşleşme Bekle (Real-time subscription)
```

### Akış 4: Eşleşme ve Ödeme (Sahip Perspektifi)
```
Real-time Notification: "Eşleşme Bulundu!"
  ↓
Device Detail Screen (MATCHED status)
  ↓
"Ödemeyi Güvenle Yap" butonu
  ↓
Match Payment Screen
  ↓
Payment Summary Screen
  ↓
"Ödemeyi Tamamla" butonu
  ↓
Backend API: POST /v1/payments/process
  ↓
3D Secure Payment Screen (WKWebView)
  ↓
Banka doğrulaması
  ↓
Deep Link Callback: ifoundanapple://payment/callback
  ↓
Backend API: POST /v1/payments/complete-3d
  ↓
Payment Processing Screen
  ↓
Polling: GET /v1/payments/{paymentId}/status (webhook bekleniyor)
  ↓
Webhook geldi: GET /v1/payments/{paymentId}/webhook-data
  ↓
iOS: Supabase'e yaz (payments, escrow_accounts, devices, audit_logs)
  ↓
Payment Success Screen
  ↓
Dashboard (kargo bekleniyor)
```

### Akış 5: Kargo ve Teslim (Sahip Perspektifi)
```
Payment Success
  ↓
Real-time Notification: "Kargo yola çıktı"
  ↓
Device Detail Screen (CARGO_SHIPPED status)
  ↓
Kargo Takip Bilgileri görüntüleme (Device Detail Screen içinde)
  ↓
Real-time Notification: "Kargo teslim edildi"
  ↓
Device Detail Screen (DELIVERED status)
  ↓
Delivery Confirmation Screen (Device Detail Screen içinde veya modal)
  ↓
Seri numarası kontrolü
  ↓
"Teslim Aldım" onayı
  ↓
Device Detail Screen (COMPLETED status)
```

### Akış 6: Ödeme ve Kargo (Bulan Perspektifi)
```
Real-time Notification: "Ödeme alındı"
  ↓
Device Detail Screen (PAYMENT_COMPLETED status)
  ↓
Teslim kodu görüntüleme (Device Detail Screen içinde, büyük ve vurgulu)
  ↓
Kargo firmasına git (teslim kodu ile)
  ↓
Cihazı teslim et
  ↓
Real-time Updates: cargo_status → picked_up → in_transit → out_for_delivery → delivered
  ↓
Device Detail Screen (CARGO_SHIPPED → DELIVERED status güncellemeleri)
  ↓
Real-time Notification: "Cihaz sahibi teslim aldı"
  ↓
Device Detail Screen (COMPLETED status)
  ↓
Ödül transfer edildi bildirimi
```

---

## 🛠️ Teknik Gereksinimler

### 1. Supabase Swift SDK Kurulumu
```swift
// Package.swift veya Xcode Package Dependencies
dependencies: [
    .package(url: "https://github.com/supabase/supabase-swift", from: "2.0.0")
]
```

### 2. Backend API Client
- Base URL: Environment variable'dan alınmalı
- Authentication: Supabase JWT token her istekte gönderilmeli
- Error Handling: HTTP status kodlarına göre
- Retry Mechanism: Network hatalarında exponential backoff

### 3. Deep Linking Konfigürasyonu
- **URL Scheme**: `ifoundanapple://`
- **Universal Links**: `https://ifoundanapple.com/*`
- **Associated Domains**: `applinks:ifoundanapple.com`
- **Info.plist**: URL Types ve Associated Domains tanımlanmalı

### 4. Push Notifications
- **APNs**: Apple Push Notification service
- **Device Token**: Supabase'e kaydedilmeli
- **Notification Types**:
  - Eşleşme bulundu
  - Ödeme tamamlandı
  - Kargo durumu güncellemesi
  - Teslim onayı

### 5. Keychain Storage
- **Kullanım**: Hassas bilgiler (token'lar) için
- **Framework**: Security.framework
- **Alternatif**: SwiftKeychainWrapper library

### 6. Image Picker
- **Framework**: PhotosUI (iOS 14+)
- **Özellikler**: 
  - Çoklu seçim (bulunan cihaz fotoğrafları için)
  - Kamera erişimi
  - Fotoğraf düzenleme (crop, rotate)

### 7. Date Picker
- **Framework**: Native SwiftUI DatePicker
- **Format**: YYYY-MM-DD (ISO 8601)

### 8. WebView (3D Secure)
- **Framework**: WKWebView
- **Özellikler**:
  - JavaScript injection
  - Cookie management
  - Navigation delegate
  - Loading indicator

---

## 📐 Tasarım Sistemi ve Kod Standartları

### ⚠️ KRİTİK KURALLAR - MUTLAKA UYGULANMALI

Bu kurallar iOS uygulamasının bakımını ve geliştirmesini kolaylaştırmak için kritik öneme sahiptir. **Tüm kod bu kurallara göre yazılmalıdır.**

#### 📋 Kural Özeti (Basit Versiyon)

**3 Temel Kural - MUTLAKA UYGULA:**

1. **Rengi elle yazma** → Değişkene ata (Asset Catalog kullan)
   - ❌ `Color(hex: "#007AFF")` 
   - ✅ `Color("PrimaryColor")` (Asset Catalog'dan)

2. **Butonu kopyala-yapıştır yapma** → Component yap (Reusable component)
   - ❌ Her ekranda aynı buton kodunu tekrar yazma
   - ✅ `PrimaryButton` component'i oluştur, her yerde kullan

3. **Mantığı arayüze gömme** → ViewModel kullan (MVVM pattern)
   - ❌ View içinde `if device.status == .matched { ... }` gibi mantık
   - ✅ Mantık ViewModel'de, View sadece görüntü

**Neden Bu Kurallar Önemli?**
- Tasarımcı "Butonlar artık yuvarlak değil köşeli olacak" dediğinde → Tek bir dosyayı değiştir
- Tasarımcı "Primary renk artık mavi değil yeşil olacak" dediğinde → Sadece Asset Catalog'u güncelle
- Tasarımı komple değiştirmek istediğinde → View dosyalarını değiştir, mantık bozulmaz
- Kod tekrarı yok → Tutarlılık garantisi

#### 📋 Detaylı Kural Listesi

1. **Sabit Değerler (Hardcoded Values) Kullanma** → Semantic İsimlendirme
2. **UI Bileşenlerini (Components) Ayır** → Reusable Components
3. **Mantık (Logic) ve Tasarımı (UI) Birbirinden Ayır** → MVVM Pattern
4. **Xcode Asset Catalog Kullanımı** → Renkler ve İkonlar Asset Catalog'da

---

### ⚠️ KRİTİK KURALLAR - DETAYLI AÇIKLAMALAR

#### 1. Sabit Değerler (Hardcoded Values) Kullanma - Semantic İsimlendirme

**YANLIŞ ❌:**
```swift
Button("Giriş Yap")
    .background(Color(hex: "#007AFF"))
    .foregroundColor(.white)
    .cornerRadius(8)
    .padding(16)
```

**DOĞRU ✅:**
```swift
Button("Giriş Yap")
    .buttonStyle(.primary)
    .padding(.standard)
```

**Neden?**
- Tasarımcı "Butonlar artık yuvarlak değil köşeli olacak" dediğinde, sadece `PrimaryButtonStyle` dosyasını değiştirirsin
- Tüm uygulamadaki butonlar otomatik güncellenir
- Renk değişikliği için sadece Asset Catalog'u güncellemek yeterli

**Semantic İsimlendirme Örnekleri:**
- `Color.primary` (Asset Catalog'dan) → `Color("PrimaryColor")`
- `Spacing.standard` → `16.0` (Constants.swift'te)
- `CornerRadius.card` → `12.0` (Constants.swift'te)
- `FontStyle.headline` → SF Pro Text, 17pt, Semibold

#### 2. UI Bileşenlerini (Components) Ayır - Reusable Components

**YANLIŞ ❌:**
```swift
// Her ekranda aynı buton kodu tekrar yazılıyor
struct LoginView: View {
    var body: some View {
        Button("Giriş Yap") {
            // ...
        }
        .background(Color.blue)
        .foregroundColor(.white)
        .cornerRadius(8)
        .padding(16)
    }
}

struct RegisterView: View {
    var body: some View {
        Button("Kayıt Ol") {
            // ...
        }
        .background(Color.blue)  // Aynı kod tekrar ediyor!
        .foregroundColor(.white)
        .cornerRadius(8)
        .padding(16)
    }
}
```

**DOĞRU ✅:**
```swift
// Components/PrimaryButton.swift
struct PrimaryButton: View {
    let title: String
    let action: () -> Void
    
    var body: some View {
        Button(title, action: action)
            .buttonStyle(PrimaryButtonStyle())
    }
}

// ButtonStyles/PrimaryButtonStyle.swift
struct PrimaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .foregroundColor(Color("PrimaryText"))
            .background(Color("PrimaryColor"))
            .cornerRadius(CornerRadius.button)
            .padding(.standard)
    }
}

// Kullanım
PrimaryButton(title: "Giriş Yap") {
    // action
}
```

**Component Yapısı:**
```
Views/Common/Components/
├── Buttons/
│   ├── PrimaryButton.swift
│   ├── SecondaryButton.swift
│   ├── DestructiveButton.swift
│   └── ButtonStyles/
│       ├── PrimaryButtonStyle.swift
│       ├── SecondaryButtonStyle.swift
│       └── DestructiveButtonStyle.swift
├── Cards/
│   ├── DeviceCard.swift
│   ├── NotificationCard.swift
│   └── InfoCard.swift
├── Inputs/
│   ├── TextFieldView.swift
│   ├── SecureTextFieldView.swift
│   └── DatePickerView.swift
└── Status/
    ├── StatusBadge.swift
    └── TimelineView.swift
```

**Faydaları:**
- Tasarımcı "Butonlar artık yuvarlak değil köşeli olacak" dediğinde → Sadece `PrimaryButtonStyle.swift` dosyasını değiştir
- Tüm uygulamadaki butonlar otomatik güncellenir
- Kod tekrarı yok
- Tutarlılık garantisi

#### 3. Mantık (Logic) ve Tasarımı (UI) Birbirinden Ayır - MVVM Pattern

**YANLIŞ ❌:**
```swift
// View içinde çok fazla mantık var
struct DeviceDetailView: View {
    @State var device: Device?
    
    var body: some View {
        if let device = device {
            if device.status == .matched {
                if device.device_role == "owner" {
                    Button("Ödemeyi Yap") {
                        // API çağrısı
                        // Navigation
                        // State update
                    }
                } else {
                    Text("Ödeme bekleniyor")
                }
            } else if device.status == .payment_completed {
                // ...
            }
        }
    }
}
```

**DOĞRU ✅:**
```swift
// ViewModel - Mantık burada
class DeviceDetailViewModel: ObservableObject {
    @Published var device: Device?
    @Published var showPaymentButton: Bool = false
    @Published var paymentButtonTitle: String = ""
    @Published var isLoading: Bool = false
    
    func loadDevice(id: String) {
        // API çağrısı
        // State update
        updateUIState()
    }
    
    private func updateUIState() {
        guard let device = device else { return }
        
        if device.status == .matched && device.device_role == "owner" {
            showPaymentButton = true
            paymentButtonTitle = "Ödemeyi Güvenle Yap"
        } else {
            showPaymentButton = false
        }
    }
    
    func handlePayment() {
        // Payment logic
    }
}

// View - Sadece görüntü
struct DeviceDetailView: View {
    @StateObject var viewModel = DeviceDetailViewModel()
    
    var body: some View {
        VStack {
            if viewModel.showPaymentButton {
                PrimaryButton(title: viewModel.paymentButtonTitle) {
                    viewModel.handlePayment()
                }
            }
        }
        .onAppear {
            viewModel.loadDevice(id: deviceId)
        }
    }
}
```

**MVVM Yapısı:**
- **View**: Sadece görüntü. Rengi, şekli bilir. Verinin nereden geldiğini bilmez.
- **ViewModel**: Veriyi işler, API çağrıları yapar, state yönetir.
- **Model**: Veri yapıları (Device, User, Payment, vb.)

**Faydaları:**
- Tasarımı değiştirmek istediğinde View dosyasını komple silip yeni tasarımla baştan yazsan bile uygulama çalışmaya devam eder
- Mantık ViewModel'de olduğu için test edilebilir
- View'lar basit ve okunabilir kalır

#### 4. Xcode Asset Catalog Kullanımı - Renkler ve İkonlar

**YANLIŞ ❌:**
```swift
// Renkler kod içine gömülmüş
Button("Giriş Yap")
    .background(Color(red: 0, green: 0.48, blue: 1.0))
    .foregroundColor(.white)
```

**DOĞRU ✅:**
```swift
// Asset Catalog'dan semantic isimlerle
Button("Giriş Yap")
    .background(Color("PrimaryColor"))
    .foregroundColor(Color("PrimaryText"))
```

**Asset Catalog Yapısı (Assets.xcassets/Colors/):**

1. **PrimaryColor**
   - Light: `#007AFF`
   - Dark: `#0A84FF`
   - Semantic Name: "PrimaryColor"

2. **PrimaryText**
   - Light: `#FFFFFF`
   - Dark: `#FFFFFF`
   - Semantic Name: "PrimaryText"

3. **SuccessColor**
   - Light: `#34C759`
   - Dark: `#30D158`
   - Semantic Name: "SuccessColor"

4. **WarningColor**
   - Light: `#FF9500`
   - Dark: `#FF9F0A`
   - Semantic Name: "WarningColor"

5. **ErrorColor**
   - Light: `#FF3B30`
   - Dark: `#FF453A`
   - Semantic Name: "ErrorColor"

6. **BackgroundColor**
   - Light: `#F2F2F7`
   - Dark: `#000000`
   - Semantic Name: "BackgroundColor"

7. **CardBackgroundColor**
   - Light: `#FFFFFF`
   - Dark: `#1C1C1E`
   - Semantic Name: "CardBackgroundColor"

8. **TextPrimary**
   - Light: `#000000`
   - Dark: `#FFFFFF`
   - Semantic Name: "TextPrimary"

9. **TextSecondary**
   - Light: `#6E6E73`
   - Dark: `#98989D`
   - Semantic Name: "TextSecondary"

**Kullanım:**
```swift
// Kod içinde
Color("PrimaryColor")  // Asset Catalog'dan
Color("SuccessColor")
Color("BackgroundColor")

// Dark mode otomatik desteklenir
```

**Faydaları:**
- Tasarımcı "Primary renk artık mavi değil yeşil olacak" dediğinde → Sadece Asset Catalog'daki `PrimaryColor` değerini değiştir
- Tüm uygulamadaki primary renkler otomatik güncellenir
- Dark mode desteği otomatik (Light/Dark variant'lar)
- Koduna dokunmana gerek kalmaz

**İkonlar:**
- **SF Symbols**: Asset Catalog'a eklenmez, direkt kod içinde kullanılır
  ```swift
  Image(systemName: "house.fill")
  ```
- **Custom Icons**: Asset Catalog'a eklenir (eğer varsa)
  ```swift
  Image("custom-icon-name")
  ```

---

### Renk Paleti (Asset Catalog)

**Tüm renkler Asset Catalog'da tanımlanmalı:**

**Assets.xcassets/Colors/ klasöründe:**
- `PrimaryColor` (Light/Dark)
- `PrimaryText` (Light/Dark)
- `SuccessColor` (Light/Dark)
- `WarningColor` (Light/Dark)
- `ErrorColor` (Light/Dark)
- `BackgroundColor` (Light/Dark)
- `CardBackgroundColor` (Light/Dark)
- `TextPrimary` (Light/Dark)
- `TextSecondary` (Light/Dark)
- `BorderColor` (Light/Dark)
- `SeparatorColor` (Light/Dark)

**Kod İçinde Kullanım:**
```swift
// ❌ YANLIŞ
Color(hex: "#007AFF")
Color.blue

// ✅ DOĞRU
Color("PrimaryColor")
Color("BackgroundColor")
```

### Typography (Semantic Font Styles)

**Constants.swift'te tanımlanmalı:**

```swift
// Constants.swift
enum FontStyle {
    static let largeTitle = Font.system(size: 34, weight: .bold, design: .default)
    static let title1 = Font.system(size: 28, weight: .regular, design: .default)
    static let title2 = Font.system(size: 22, weight: .regular, design: .default)
    static let headline = Font.system(size: 17, weight: .semibold, design: .default)
    static let body = Font.system(size: 17, weight: .regular, design: .default)
    static let callout = Font.system(size: 16, weight: .regular, design: .default)
    static let subhead = Font.system(size: 15, weight: .regular, design: .default)
    static let footnote = Font.system(size: 13, weight: .regular, design: .default)
    static let caption = Font.system(size: 12, weight: .regular, design: .default)
}
```

**Kullanım:**
```swift
// ❌ YANLIŞ
Text("Başlık")
    .font(.system(size: 28, weight: .regular))

// ✅ DOĞRU
Text("Başlık")
    .font(FontStyle.title1)
```

### Spacing (Semantic Spacing)

**Constants.swift'te tanımlanmalı:**

```swift
// Constants.swift
enum Spacing {
    static let tiny: CGFloat = 4
    static let small: CGFloat = 8
    static let standard: CGFloat = 16
    static let large: CGFloat = 24
    static let extraLarge: CGFloat = 32
}
```

**Kullanım:**
```swift
// ❌ YANLIŞ
.padding(16)
.padding(.leading, 8)

// ✅ DOĞRU
.padding(.standard)
.padding(.leading, .small)
```

### Corner Radius (Semantic Values)

**Constants.swift'te tanımlanmalı:**

```swift
// Constants.swift
enum CornerRadius {
    static let small: CGFloat = 4
    static let medium: CGFloat = 8
    static let button: CGFloat = 8
    static let card: CGFloat = 12
    static let large: CGFloat = 16
}
```

**Kullanım:**
```swift
// ❌ YANLIŞ
.cornerRadius(12)
.cornerRadius(8)

// ✅ DOĞRU
.cornerRadius(CornerRadius.card)
.cornerRadius(CornerRadius.button)
```

### Icons
- **SF Symbols 7**: Tüm ikonlar SF Symbols'dan kullanılmalı
  ```swift
  Image(systemName: "house.fill")
  Image(systemName: "bell.fill")
  ```
- **Custom Icons**: Gerekirse, Asset Catalog'a eklenmeli ve semantic isimlerle kullanılmalı
  ```swift
  Image("icon-app-logo")
  ```

### Reusable Components Yapısı

**Views/Common/Components/ klasöründe:**

1. **Buttons/**
   - `PrimaryButton.swift` - Primary buton component'i
   - `SecondaryButton.swift` - Secondary buton component'i
   - `DestructiveButton.swift` - Destructive buton component'i
   - `ButtonStyles/` - ButtonStyle'lar (PrimaryButtonStyle, SecondaryButtonStyle, vb.)

2. **Cards/**
   - `DeviceCard.swift` - Cihaz kartı component'i
   - `NotificationCard.swift` - Bildirim kartı component'i
   - `InfoCard.swift` - Bilgi kartı component'i

3. **Inputs/**
   - `TextFieldView.swift` - Text input component'i
   - `SecureTextFieldView.swift` - Secure text input component'i
   - `DatePickerView.swift` - Date picker component'i

4. **Status/**
   - `StatusBadge.swift` - Durum badge component'i
   - `TimelineView.swift` - Timeline component'i

5. **Loading/**
   - `LoadingView.swift` - Loading indicator component'i
   - `SkeletonView.swift` - Skeleton loader component'i

**Component Kullanım Örneği:**
```swift
// Her ekranda aynı component kullanılır
PrimaryButton(title: "Giriş Yap") {
    viewModel.login()
}

DeviceCard(device: device) {
    // Device detail'e git
}
```

**Faydaları:**
- Tasarım değişikliği → Sadece component dosyasını değiştir
- Tutarlılık garantisi
- Kod tekrarı yok

---

## 🔐 Güvenlik Gereksinimleri

### 1. Authentication
- **Token Storage**: Keychain (asla UserDefaults'a yazılmamalı)
- **Token Refresh**: Otomatik refresh mekanizması
- **Biometric Auth**: Face ID/Touch ID (opsiyonel, gelecekte)

### 2. Data Encryption
- **Sensitive Data**: Keychain'de şifrelenmiş
- **Network**: HTTPS only
- **Certificate Pinning**: Production'da (opsiyonel)
- **Veritabanında Şifreleme:**
  - **Not**: iOS uygulaması veritabanına veri yazarken şifreleme yapmaz
  - Şifreleme backend'de (Supabase Edge Function) veya Supabase'de yapılır
  - iOS uygulaması sadece plain text veri gönderir, Supabase şifreler
  - Okuma: Supabase'den gelen veri otomatik decrypt edilir (backend'de)
  - **Şifrelenen Alanlar:**
    - TC Kimlik No (`userprofile.tc_kimlik_no`)
    - IBAN (`userprofile.iban`)
    - Telefon Numarası (`userprofile.phone_number`)
    - Adres (`userprofile.address`)
    - Kargo Gönderici Adresi (`cargo_shipments.sender_address_encrypted`)
    - Kargo Alıcı Adresi (`cargo_shipments.receiver_address_encrypted`)
  - **Algoritma**: AES-256-GCM (backend'de)
  - **iOS Tarafı**: Sadece plain text input alır ve Supabase'e gönderir

### 3. File Upload Security
- **File Validation**: Type, size kontrolü
- **Virus Scanning**: Backend'de (opsiyonel)
- **Secure URLs**: Signed URLs (Supabase Storage)

### 4. API Security
- **JWT Token**: Her istekte gönderilmeli
- **Token Expiry**: Otomatik refresh
- **Error Handling**: Hassas bilgi sızıntısı olmamalı

---

## 📊 State Management ve Mimari (MVVM)

### MVVM Pattern (Model-View-ViewModel)

**Mimari Yapı:**
```
Model (Data)
    ↓
ViewModel (Business Logic)
    ↓
View (UI)
```

#### Model (Data Layer)
- **Amaç**: Veri yapıları, API response modelleri
- **Konum**: `Models/` klasörü
- **Örnek**: `Device.swift`, `User.swift`, `Payment.swift`

#### ViewModel (Business Logic Layer)
- **Amaç**: Veri işleme, API çağrıları, state yönetimi
- **Konum**: `ViewModels/` klasörü
- **Özellikler**:
  - `ObservableObject` protocol'ünü implement eder
  - `@Published` property'ler ile state yönetir
  - View'dan bağımsızdır (test edilebilir)
  - API çağrıları, veri işleme, validasyon burada yapılır

#### View (UI Layer)
- **Amaç**: Sadece görüntü, kullanıcı etkileşimi
- **Konum**: `Views/` klasörü
- **Özellikler**:
  - `@StateObject` veya `@ObservedObject` ile ViewModel'i bağlar
  - Mantık içermez (if-else, API çağrıları, vb.)
  - Sadece UI rendering ve kullanıcı input'larını ViewModel'e iletir

**MVVM Kullanım Örneği:**

```swift
// Model
struct Device: Codable, Identifiable {
    let id: String
    let status: DeviceStatus
    let device_role: String
    // ...
}

// ViewModel
class DeviceDetailViewModel: ObservableObject {
    @Published var device: Device?
    @Published var isLoading: Bool = false
    @Published var errorMessage: String?
    
    // Computed properties - UI state'i belirler
    var showPaymentButton: Bool {
        guard let device = device else { return false }
        return device.status == .matched && device.device_role == "owner"
    }
    
    var paymentButtonTitle: String {
        "Ödemeyi Güvenle Yap"
    }
    
    // Business logic
    func loadDevice(id: String) {
        isLoading = true
        DeviceService.shared.getDevice(id: id) { [weak self] result in
            DispatchQueue.main.async {
                self?.isLoading = false
                switch result {
                case .success(let device):
                    self?.device = device
                case .failure(let error):
                    self?.errorMessage = error.localizedDescription
                }
            }
        }
    }
    
    func handlePayment() {
        guard let device = device else { return }
        PaymentService.shared.initiatePayment(deviceId: device.id) { [weak self] result in
            // Handle payment result
        }
    }
}

// View - Sadece UI
struct DeviceDetailView: View {
    @StateObject private var viewModel = DeviceDetailViewModel()
    let deviceId: String
    
    var body: some View {
        VStack {
            if viewModel.isLoading {
                LoadingView()
            } else if let error = viewModel.errorMessage {
                ErrorView(message: error)
            } else if let device = viewModel.device {
                DeviceContent(device: device)
                
                if viewModel.showPaymentButton {
                    PrimaryButton(title: viewModel.paymentButtonTitle) {
                        viewModel.handlePayment()
                    }
                }
            }
        }
        .onAppear {
            viewModel.loadDevice(id: deviceId)
        }
    }
}
```

**MVVM Kuralları:**
1. ✅ **View içinde mantık olmamalı**: `if user.isLoggedIn { ... }` gibi mantık ViewModel'de olmalı
2. ✅ **View sadece görüntü**: Rengi, şekli bilir, verinin nereden geldiğini bilmez
3. ✅ **ViewModel test edilebilir**: Unit testler ViewModel'de yazılır
4. ✅ **Tasarım değişikliği kolay**: View dosyasını komple silip yeni tasarımla baştan yazsan bile çalışır

### Önerilen Yaklaşım: Combine + @StateObject
- **Global State**: `@StateObject` ile ObservableObject
- **Local State**: `@State`, `@Binding`
- **Real-time Updates**: Combine publishers + Supabase subscriptions

### State Yapısı
```swift
// Global App State
class AppState: ObservableObject {
    @Published var currentUser: User?
    @Published var devices: [Device] = []
    @Published var notifications: [AppNotification] = []
    @Published var isLoading = false
}

// ViewModel'ler AppState'i kullanabilir
class DeviceListViewModel: ObservableObject {
    @Published var devices: [Device] = []
    @Published var isLoading = false
    
    private var appState: AppState
    
    init(appState: AppState) {
        self.appState = appState
    }
}
```

---

## 🧪 Test Stratejisi

### 1. Unit Tests
- Business logic (ViewModels, Services)
- API client (mock responses)
- Data models (Codable, validation)
- Utility functions
- **Test Coverage**: Minimum %70

### 2. UI Tests
- Critical user flows:
  - Authentication flow (Login → Register → Dashboard)
  - Device add flow (Add Device → Form → Detail)
  - Payment flow (Match Payment → 3D Secure → Success)
- Navigation (Tab bar, Push, Modal)
- Form validations
- **Test Framework**: XCTest

### 3. Integration Tests
- Supabase SDK integration (real Supabase instance - test environment)
- Backend API integration (mock server veya test backend)
- Deep linking (URL scheme ve Universal Links)
- Real-time subscriptions

### 4. Snapshot Tests (Opsiyonel)
- UI component'lerin görsel doğruluğu
- **Framework**: SwiftUI Snapshot Testing

---

## 📦 Deployment

### 1. Development
- Xcode ile local development
- Simulator ve gerçek cihaz testi
- **Simulator**: iPhone 15 Pro (iOS 17+)
- **Test Devices**: Gerçek iPhone cihazları (iOS 17, 18, 20+)

### 2. TestFlight
- Beta test için
- Internal ve external testers
- **Build Upload**: Xcode → Product → Archive → Distribute App → App Store Connect
- **TestFlight Configuration**: App Store Connect'te test grubu oluşturma

### 3. App Store
- App Store Connect'te uygulama oluşturma
- Privacy policy ve terms ekleme
- Screenshot'lar ve metadata
- Review süreci
- **App Store Metadata**:
  - App Name: "iFoundAnApple"
  - Subtitle: "Kayıp Apple Cihazlarını Bulun"
  - Description: Uygulama açıklaması
  - Keywords: "kayıp, apple, cihaz, bul, iphone, ipad"
  - Category: Utilities
  - Privacy Policy URL: `https://ifoundanapple.com/privacy`
  - Support URL: `https://ifoundanapple.com/contact`
  - Screenshots: iPhone 6.7" ve 6.5" için (App Store Connect gereksinimleri)

---

## ⚠️ KRİTİK UYARILAR VE TUTARSIZLIKLAR

### 0. Test Sonuçları (2025-01-15)

**Gerçek Database Durumu:**
- **Toplam Device:** 8
- **Device Role Dağılımı:** 6 owner, 2 finder
- **Mevcut Status'lar:** `lost`, `matched`, `payment_pending`, `reported`
- **Payment Status:** Sadece `payment_pending` var (henüz `payment_completed` yok - normal)
- **Cargo Shipments:** 0 (henüz kargo sürecine geçilmemiş - normal)

**iOS Geliştirme İçin Önemli Notlar:**
1. ✅ Mevcut status'lar: `lost`, `matched`, `payment_pending`, `reported` - iOS uygulaması bunları handle etmeli
2. ℹ️ `payment_completed`, `cargo_shipped`, `delivered` gibi status'lar henüz database'de yok (normal - henüz bu aşamalara gelinmemiş, ancak iOS uygulaması bunları da handle etmeli)
3. ✅ **Device Role Constraint:** Database'de `device_role` sadece `'owner'` veya `'finder'` değerlerini alabilir, NULL olamaz. iOS uygulaması sadece bu iki değeri handle etmeli, NULL kontrolü gerekmez.
4. ✅ Cargo shipments tablosu yapısı doğru (hem `status` hem `cargo_status` sütunları var)

---

### 1. Device Status Tutarsızlığı
**SORUN:** TypeScript `types.ts` dosyasında `PAYMENT_COMPLETE = "payment_complete"` tanımlı, ancak backend ve database `"payment_completed"` kullanıyor.

**ÇÖZÜM:**
- iOS uygulaması **Supabase'den gelen raw string değerlerini** kullanmalı
- Enum tanımı: `case paymentCompleted = "payment_completed"` (NOT `"payment_complete"`)
- Database'den gelen değer her zaman `"payment_completed"` olacak
- Web uygulaması backward compatibility için her ikisini de handle ediyor, iOS sadece `payment_completed` kullanmalı

**Doğrulama:**
```swift
// Database'den gelen değeri kontrol et
let statusFromDB = device.status // "payment_completed"
// Enum'da eşleşmeli:
enum DeviceStatus: String {
    case paymentCompleted = "payment_completed" // ✅ DOĞRU
    // case paymentComplete = "payment_complete" // ❌ YANLIŞ
}
```

### 2. Device Status Enum Eksiklikleri
**SORUN:** TypeScript `types.ts`'de sadece 8 status var, ancak database ve backend'de daha fazla status kullanılıyor.

**TypeScript types.ts (8 status):**
- LOST, REPORTED, MATCHED, PAYMENT_PENDING, PAYMENT_COMPLETE, EXCHANGE_PENDING, COMPLETED

**Database/Backend (11+ status):**
- LOST, REPORTED, MATCHED, PAYMENT_PENDING, **PAYMENT_COMPLETED**, **CARGO_SHIPPED**, **DELIVERED**, **CONFIRMED**, EXCHANGE_PENDING, COMPLETED, **DISPUTED**, **CANCELLED**, **RETURNED**, **FAILED_DELIVERY**

**ÇÖZÜM:** iOS uygulaması **tüm status'ları** handle etmeli. Database'den gelen herhangi bir status değeri için fallback mekanizması olmalı.

### 3. Cargo Status İki Sütun Sorunu
**SORUN:** `cargo_shipments` tablosunda iki farklı status sütunu var:
1. `status` → Teslim kodunun durumu ('active', 'used', 'expired')
2. `cargo_status` → Kargo sürecinin durumu ('pending', 'picked_up', 'in_transit', vb.)

**ÇÖZÜM:** iOS uygulaması **her iki sütunu da** okumalı:
- `cargo_shipments.status` → Teslim kodunun durumu (bulan kişi için önemli)
- `cargo_shipments.cargo_status` → Kargo takip durumu (her iki taraf için önemli)

### 4. Device Role vs Status Karışıklığı
**SORUN:** UI rendering'de `device.status` kullanılırsa yanlış ekran gösterilebilir.

**GERÇEK DURUM (Test Sonuçları):**
- Database'de **1 adet NULL device_role** var (düzeltilmeli)
- iOS uygulaması NULL device_role değerlerini handle etmeli

**ÇÖZÜM:** **MUTLAKA** `device.device_role` kullanılmalı:
```swift
// YANLIŞ ❌
if device.status == .matched {
    // Hangi ekranı göstereceğim? Owner mı finder mı?
}

// DOĞRU ✅
// device_role sadece "owner" veya "finder" olabilir (database constraint)
if device.device_role == "owner" {
    if device.status == .matched {
        // Owner ekranını göster: "Ödemeyi Güvenle Yap" butonu
    }
} else if device.device_role == "finder" {
    if device.status == .matched {
        // Finder ekranını göster: "Cihaz sahibinin ödeme yapması bekleniyor"
    }
}
```

### 5. Backend API Endpoint Tutarsızlığı
**SORUN:** Dokümantasyonda `/v1` endpoint'leri var, ancak `server.cjs`'de `/api` endpoint'leri var.

**GERÇEK DURUM:**
- **Backend API (Ayrı servis):** `/v1/payments/*` (PAYNET için)
- **Local server.cjs:** `/api/iyzico-*` (Iyzico için)
- **iOS Uygulaması:** `/v1/payments/*` endpoint'lerini kullanmalı (PAYNET entegrasyonu için)

**ÇÖZÜM:** iOS uygulaması `https://api.ifoundanapple.com/v1` base URL'ini kullanmalı.

---

## 📝 Önemli Notlar

### 1. Device Status Enum (Swift)
**KRİTİK NOT:** Database'de kullanılan status değerleri ile TypeScript enum'u arasında tutarsızlık var. iOS uygulaması **database'deki gerçek değerleri** kullanmalıdır.

**Gerçek Database Status Değerleri (Test Sonuçları - 2025-01-15):**
- **Mevcut Status'lar:** `lost`, `matched`, `payment_pending`, `reported`
- **Henüz Kullanılmayan Status'lar:** `payment_completed`, `cargo_shipped`, `delivered`, `confirmed`, `completed`, `disputed`, `cancelled`, `returned`, `failed_delivery`
- **Not:** Henüz kullanılmayan status'lar da iOS uygulamasında handle edilmeli (gelecekte kullanılacak)

**Gerçek Database Status Değerleri (Supabase'den gelen - Tüm Olası Değerler):**
```swift
enum DeviceStatus: String, Codable {
    case lost = "lost"                    // Cihaz sahibi kayıp bildirimi
    case reported = "reported"            // Bulan kişi buldu bildirimi
    case matched = "matched"               // Cihaz eşleşiyor
    case paymentPending = "payment_pending"      // Cihazı kaybeden ödemesini yapıyor
    case paymentCompleted = "payment_completed"  // ⚠️ ÖNEMLİ: "payment_complete" DEĞİL, "payment_completed" kullanılmalı!
    case cargoShipped = "cargo_shipped"         // Cihazı bulan kargo firmasına kod ile teslim ediyor
    case delivered = "delivered"                // Kargo firması cihazı sahibine teslim ediyor
    case confirmed = "confirmed"                // Cihazın sahibi cihaz eline geçince onaylıyor
    case exchangePending = "exchange_pending"   // Fiziksel takas sürecinde
    case completed = "completed"                // İşlem tamamlanıyor
    case disputed = "disputed"                   // İptal-iade bölümü
    case cancelled = "cancelled"                // İşlem, kargoya verilmeden iptal edildi
    case returned = "returned"                  // Cihaz, alıcıya teslim edilemediği için göndericiye iade edildi
    case failedDelivery = "failed_delivery"     // Kargo firması teslimatı denedi ancak başarısız oldu
}
```

**⚠️ TUTARSIZLIK UYARISI:**
- **TypeScript types.ts:** `PAYMENT_COMPLETE = "payment_complete"` (YANLIŞ - eski değer)
- **Backend (server.cjs):** `status: 'payment_completed'` (DOĞRU - database'e yazılan)
- **Database:** `'payment_completed'` (DOĞRU - gerçek değer)
- **iOS Uygulaması:** `payment_completed` kullanmalı (database'den gelen değer)

**Çözüm:** iOS uygulaması Supabase'den gelen raw string değerlerini kullanmalı. Enum sadece type safety için, ama database'den gelen değer `"payment_completed"` ise, enum'da da `paymentCompleted = "payment_completed"` olmalı.

**Backward Compatibility:** Web uygulaması hem `payment_complete` hem `payment_completed` değerlerini handle ediyor (DeviceCard.tsx'te her ikisi de var). iOS uygulaması sadece `payment_completed` kullanmalı çünkü backend her zaman `payment_completed` yazıyor.

### 2. Cargo Status Enum (Swift)
iOS uygulamasında kullanılacak Cargo Status enum'u:

```swift
enum CargoStatus: String, Codable {
    case created = "created"              // Kargo kaydı oluşturuldu
    case labelPrinted = "label_printed"    // Kargo etiketi yazdırıldı
    case pickedUp = "picked_up"           // Bulan kişi cihazı kargo firmasına teslim etti
    case inTransit = "in_transit"         // Cihaz kargo firması ile yolda, sahibine doğru gidiyor
    case outForDelivery = "out_for_delivery"  // Teslimata çıktı
    case delivered = "delivered"           // Kargo firması cihazı sahibinin adresine teslim etti, sahibinin onayı bekleniyor
    case failedDelivery = "failed_delivery"    // Teslimat denendi, başarısız
    case returned = "returned"             // Göndericiye iade ediliyor/edildi
    case cancelled = "cancelled"           // Kargo işlemi iptal edildi
    case confirmed = "confirmed"          // Cihaz sahibi teslim aldığını onayladı
    case pending = "pending"               // Kargo kaydı oluşturuldu, teslim kodu üretildi, bulan kişinin kargoya teslim etmesi bekleniyor
}
```

**Önemli:** `cargo_shipments` tablosunda iki farklı status sütunu bulunur:
1. **`status` sütunu:** Teslim kodunun durumunu takip eder ('active', 'used', 'expired')
2. **`cargo_status` sütunu:** Kargo sürecinin detaylı durumunu takip eder (yukarıdaki enum)

### 3. Device Role Ayrımı
**KRİTİK**: UI'da `device.status` yerine `device.device_role` kullanılmalı!
- `device_role = 'owner'` → Sahip perspektifi
- `device_role = 'finder'` → Bulan perspektifi
- Bir kullanıcı aynı anda her iki rolü de üstlenebilir
- **UI Rendering Mantığı:**
  ```swift
  // YANLIŞ ❌
  if device.status == .matched {
      // Hangi ekranı göstereceğim?
  }
  
  // DOĞRU ✅
  if device.device_role == "owner" {
      // Sahip ekranını göster
      if device.status == .matched {
          // "Ödemeyi Güvenle Yap" butonu göster
      }
  } else if device.device_role == "finder" {
      // Bulan ekranını göster
      if device.status == .matched {
          // "Cihaz sahibinin ödeme yapması bekleniyor" mesajı göster
      }
  }
  ```

### 2. Real-time Subscriptions
- Devices ve notifications için Supabase real-time kullanılmalı
- Memory leak'leri önlemek için subscription'lar düzgün temizlenmeli
- Background'da subscription'lar pause edilmeli

### 3. Payment Status Monitoring
- Backend API'den payment status endpoint'i yok
- Supabase'den `payments` tablosunu real-time dinle
- `payment_status = 'completed'` olduğunda UI güncelle
- **Payment Status Enum (Swift):**
  ```swift
  enum PaymentStatus: String, Codable {
      case pending = "pending"
      case processing = "processing"
      case completed = "completed"
      case failed = "failed"
      case cancelled = "cancelled"
      case refunded = "refunded"
  }
  ```
- **Escrow Status Enum (Swift):**
  ```swift
  enum EscrowStatus: String, Codable {
      case pending = "pending"
      case held = "held"
      case released = "released"
      case refunded = "refunded"
  }
  ```

### 4. Offline Support
- Core data için local cache (Core Data veya SwiftData)
- Offline durumda kullanıcıya bilgi ver
- Sync mekanizması (network geldiğinde)
- **Önerilen Yaklaşım:**
  - SwiftData veya Core Data ile local database
  - Devices, notifications, user profile cache'lenmeli
  - Network durumu kontrolü (Network framework)
  - Sync queue (offline'da yapılan işlemler queue'ya alınır, network geldiğinde sync edilir)

### 5. Error Handling
- Network hataları: Kullanıcı dostu mesajlar
- Validation hataları: Inline feedback
- API hataları: Backend'den gelen mesajları göster

### 6. Performance
- **Image Caching**: Kingfisher veya native ImageCache kullanımı
  - Supabase Storage'dan gelen secure URLs kullanılmalı
  - Signed URLs 1 saat geçerli, yenileme mekanizması gerekli
  - Image cache: NSCache veya Kingfisher library
  - Cache size limiti: 100MB (ayarlanabilir)
- **Lazy Loading**: List'lerde lazy loading (LazyVStack, LazyHStack)
  - Devices listesi için pagination (örn: 20'şer)
  - Notifications listesi için pagination
  - Pull-to-refresh desteği
- **Memory Management**:
  - Weak references (delegate pattern'lerde)
  - Image cache size limiti
  - Background task'ların doğru yönetimi
  - Heavy computation'ların background thread'de yapılması
- **Network Optimization**:
  - Request caching (HTTP cache headers)
  - Request batching (birden fazla istek birleştirme)
  - Retry mechanism (exponential backoff)
- **UI Performance**:
  - View updates'lerin optimize edilmesi
  - SwiftUI view'lerin optimize edilmesi (id modifier, Equatable)
  - Skeleton loader'lar (yükleme sırasında)

### 7. Escrow Release Koşulları
**A. Manuel Onay:**
- Cihaz sahibinin "Onayla" butonuna basması
- `delivery_confirmations` kaydı oluşturulması
- `confirmation_type` = 'device_received'
- Backend API: `POST /v1/payments/release-escrow` (eğer varsa)

**B. Otomatik Onay (48 Saat):**
- Kargonun teslim edilmesinden (`cargo_shipments.delivered_at`) itibaren 48 saat geçmesi
- Bu süre içinde kullanıcıdan itiraz gelmemesi (`devices.status` != 'disputed')
- Sistem otomatik olarak `delivery_confirmations` kaydı oluşturur
- `confirmation_type` = 'timeout_release'
- **iOS Uygulaması:** Kullanıcıya "48 saat sonra otomatik onaylanacak" bildirimi gösterilmeli

**C. Admin Manuel Serbest Bırakma:**
- Admin panelinden manuel olarak escrow serbest bırakılabilir
- `confirmation_type` = 'manual_release'
- Sadece admin kullanıcılar bu işlemi yapabilir

### 8. Bildirim Matrisi
iOS uygulamasında gösterilecek bildirimler:

| Olay | Alıcı | Mesaj Anahtarı | Tip | iOS Push Notification |
|------|-------|----------------|-----|----------------------|
| Cihaz kaydedildi | Kayıt eden | `device_registered` | info | Hayır |
| Eşleşme bulundu | Her iki taraf | `matchFoundOwner` / `matchFoundFinder` | success | Evet |
| Ödeme bekleniyor | Cihaz sahibi | `payment_reminder` | warning | Evet (72 saat sonra) |
| Ödeme alındı | Bulan kişi | `payment_received_please_ship` | success | Evet |
| Teslim kodu oluşturuldu | Bulan kişi | `delivery_code_ready` | info | Evet |
| Kargoya verildi | Cihaz sahibi | `package_shipped` | info | Evet |
| Kargo yolda | Her iki taraf | `package_in_transit` | info | Evet |
| Teslim edildi | Cihaz sahibi | `package_delivered_confirm` | warning | Evet |
| Otomatik onay yaklaşıyor (24 saat kaldı) | Cihaz sahibi | `auto_confirm_reminder` | warning | Evet |
| Onay verildi | Bulan kişi | `reward_released` | success | Evet |
| Para transfer edildi | Bulan kişi | `reward_transferred` | success | Evet |

**Bildirim Gösterimi:**
- In-app notification: Notification ekranında gösterilir
- Push notification: APNs üzerinden gönderilir (background'da)
- Badge: Notification ekranında okunmamış sayısı gösterilir
- Deep linking: Bildirime tıklama → İlgili ekrana yönlendirme

### 9. Eşleşme Mantığı
**Eşleştirme Kriterleri:**
- Aynı `model` (büyük/küçük harf duyarsız)
- Aynı `serialNumber` (büyük/küçük harf duyarsız)
- Farklı `userId` (aynı kullanıcı kendi cihazı ile eşleşemez)
- Biri `status = 'lost'`, diğeri `status = 'reported'` olmalı

**Güvenlik Kısıtlamaları:**
- Aynı kullanıcı, aynı model + seri numaralı cihazı hem kayıp hem bulunan olarak kaydedemez (uygulama seviyesinde kontrol)
- Günde 2'den fazla bulunan cihaz kaydı yapan hesaplar incelemeye alınır
- Sahte seri numarası kontrolü (fatura ile doğrulama)

**Eşleştirme Kodu (iOS):**
```swift
// Yeni cihaz LOST ise, REPORTED olanı ara
if newDevice.status == .lost {
    let matchedDevice = try await supabase
        .from("devices")
        .select("*")
        .eq("status", "reported")
        .eq("serialNumber", newDevice.serialNumber)
        .eq("model", newDevice.model)
        .neq("userId", newDevice.userId)
        .maybeSingle()
    
    if let matched = matchedDevice {
        // Eşleşme bulundu!
        // Her iki cihazın status'unu 'matched' olarak güncelle
        // Her iki tarafa bildirim gönder
    }
}

// Yeni cihaz REPORTED ise, LOST olanı ara
if newDevice.status == .reported {
    let matchedDevice = try await supabase
        .from("devices")
        .select("*")
        .eq("status", "lost")
        .eq("serialNumber", newDevice.serialNumber)
        .eq("model", newDevice.model)
        .neq("userId", newDevice.userId)
        .maybeSingle()
    
    if let matched = matchedDevice {
        // Eşleşme bulundu!
    }
}
```

**Eşleşme Bulunduğunda:**
- Her iki cihazın `status`'u `'matched'` olarak güncellenir
- Her iki tarafa bildirim gönderilir (`matchFoundOwner`, `matchFoundFinder`)
- In-app notification + Push notification
- E-posta bildirimi (opsiyonel)

### 10. Zaman Sınırları
**Ödeme İçin Zaman Sınırı:**
- Eşleşme bulunduktan sonra 72 saat içinde ödeme yapılmalı
- Süre dolduğunda eşleşme iptal edilebilir
- Kullanıcıya bildirim gönderilir: "Ödeme için 24 saat kaldı" (48 saat sonra)

**Kargo İçin Zaman Sınırı:**
- Ödeme tamamlandıktan sonra bulan kişi 3 gün içinde cihazı kargoya teslim etmeli
- Süre dolduğunda uyarı bildirimi gönderilir

**Onay İçin Otomatik Onay Süresi:**
- Kargo API'sinden "teslim edildi" bilgisi geldikten 48 saat sonra
- Eğer kullanıcı itiraz etmezse sistemin işlemi otomatik olarak CONFIRMED durumuna geçirmesi
- Bulan kişinin ödülünü almasını garanti altına alır
- Kullanıcıya bildirim gönderilir: "24 saat sonra otomatik onaylanacak" (24 saat kaldığında)

**iOS Uygulaması:**
- Countdown timer gösterilebilir (opsiyonel)
- Push notification ile hatırlatma
- Background task ile zaman kontrolü (opsiyonel)

### 11. İptal/İade ve İstisnai Durum Yönetimi
**A) Kullanıcı Kaynaklı İptal (Kargo Öncesi):**
- Senaryo: Cihaz sahibi ödeme yaptıktan sonra ama cihaz henüz kargoya verilmeden önce fikrini değiştirir
- Akış:
  - Cihaz sahibi "İşlemi İptal Et" talebinde bulunur
  - `devices.status` → `CANCELLED` olarak güncellenir
  - Escrow'daki para, hizmet bedeli kesintisi yapılarak veya yapılmadan (iş kurallarına göre) cihaz sahibine tam iade edilir
  - Cihazı bulan kişiye bildirim gönderilir
- **iOS Ekranı:** Device Detail Screen'de "İşlemi İptal Et" butonu (kırmızı, destructive)

**B) Kargo Sürecindeki Sorunlar:**
- **Senaryo 1: Teslimat Başarısız (FAILED_DELIVERY)**
  - Neden: Kargo firması API'sinden "adreste bulunamadı", "yanlış adres" gibi bir durum bildirimi gelir
  - Akış:
    - `cargo_shipments.cargo_status` → `failed_delivery` olarak güncellenir
    - `devices.status` → `FAILED_DELIVERY` olarak güncellenir
    - Cihaz sahibine "Teslimat Başarısız" bildirimi gönderilir
    - Adresini kontrol etmesi veya kargo şubesiyle iletişime geçmesi istenir
    - Belirli bir süre (örn: 24 saat) içinde sorun çözülmezse, süreç "İade" senaryosuna dönüşebilir
  - **iOS Ekranı:** Device Detail Screen'de "Adresi Güncelle" butonu

- **Senaryo 2: Kargonun İade Edilmesi (RETURNED)**
  - Neden: Teslimat birkaç denemeden sonra başarısız oldu veya alıcı kargoyu kabul etmedi
  - Akış:
    - `cargo_shipments.cargo_status` → `returned` olarak güncellenir
    - `devices.status` → `RETURNED` olarak güncellenir
    - Bu, bir admin müdahalesi gerektiren ciddi bir durumdur
    - Admin paneline bildirim düşer
    - Admin, durumu inceledikten sonra paranın kısmi veya tam iadesine karar verir
    - Genellikle kargo ücreti kesilerek iade yapılır
    - Cihaz, bulan kişiye geri gönderilir
  - **iOS Ekranı:** Device Detail Screen'de "İade Edildi" mesajı

**C) Cihaz Sahibinin İtirazı (DISPUTED):**
- Senaryo: Cihaz teslim edildi (delivered) ancak cihaz sahibi "Sorun Var, İtiraz Et" butonuna bastı (yanlış cihaz, hasarlı vb.)
- Akış:
  - `devices.status` → `DISPUTED` olarak güncellenir
  - Escrow'daki para kilitli kalır
  - Admin incelemesi başlar ve süreci karara bağlar
- **iOS Ekranı:** Device Detail Screen'de "Sorun Var, İtiraz Et" butonu (kırmızı) → Dispute Form Screen

### 12. Güvenlik Kontrolleri
**Kimlik Doğrulama:**
- TC Kimlik No doğrulaması (algoritma kontrolü)
- Özellikle ödeme alacak (bulan) kişi için şiddetle tavsiye edilir
- Dolandırıcılığı önlemek ve yasal uyumluluk (KYC) amacıyla

**Sahte Cihaz Kontrolü:**
- Kayıp cihaz kaydı sırasında cihazın faturası isteniliyor
- Sahte seri numarası kontrolü: Kayıp ilanı sırasında istenilen fatura ile kontrol sağlanacak

**Kullanıcı Kısıtlamaları:**
- Aynı kullanıcı, aynı model seri numaralı cihazı hem kayıp hem bulunan olarak kaydedemez
- Aynı kullanıcı bir günde 2'den fazla bulunan cihaz kaydedemez
- Sürekli bulunan cihaz kaydı gerçekleştiren hesaplar incelemeye alınır

**iOS Uygulaması:**
- Client-side validation (UX için)
- Server-side validation (güvenlik için, backend'de)
- Rate limiting (gelecekte)

### 13. Real-time Subscriptions Detayları
**Supabase Real-time Kullanımı:**

**Devices Subscription:**
```swift
// Device status değişikliklerini dinle
let channel = supabase.channel("device:\(deviceId)")
    .on("postgres_changes", 
        filter: ChannelFilter(event: "UPDATE", schema: "public", table: "devices", filter: "id=eq.\(deviceId)"),
        callback: { payload in
            // Device güncellendi, UI'ı güncelle
            if let newStatus = payload.new["status"] as? String {
                // Status değişti, Device Detail Screen'i güncelle
            }
        })
    .subscribe()
```

**Notifications Subscription:**
```swift
// Yeni bildirimleri dinle
let channel = supabase.channel("notifications:\(userId)")
    .on("postgres_changes",
        filter: ChannelFilter(event: "INSERT", schema: "public", table: "notifications", filter: "user_id=eq.\(userId)"),
        callback: { payload in
            // Yeni bildirim geldi
            // Notification ekranını güncelle
            // Badge sayısını artır
            // Push notification gönder (opsiyonel)
        })
    .subscribe()
```

**Payments Subscription:**
```swift
// Payment status değişikliklerini dinle
let channel = supabase.channel("payment:\(paymentId)")
    .on("postgres_changes",
        filter: ChannelFilter(event: "UPDATE", schema: "public", table: "payments", filter: "id=eq.\(paymentId)"),
        callback: { payload in
            if let newStatus = payload.new["payment_status"] as? String {
                if newStatus == "completed" {
                    // Ödeme tamamlandı, UI'ı güncelle
                }
            }
        })
    .subscribe()
```

**Memory Management:**
- Subscription'lar view lifecycle'a bağlı olmalı
- `onAppear` → subscribe
- `onDisappear` → unsubscribe
- Background'da subscription'lar pause edilmeli

### 14. Kargo Teslim Kodu Sistemi
**Önemli:** Teslim kodu (`cargo_shipments.code`) **kargo firmasının API'si tarafından üretilir**, sistem tarafından değil.

**Süreç:**
1. Ödeme tamamlandıktan sonra sistem kargo firmasının API'sine gönderi bilgilerini gönderir
2. Kargo firması API'si gönderi kaydı oluşturur ve teslim kodunu (`code`) üretir, API yanıtında döndürür
3. Sistem bu kodu `cargo_shipments.code` sütununa yazar
4. Bulan kişiye gösterilir: "Kargo firmasına vereceğiniz **Teslim Kodunuz:** `ABC12345`"
5. Bulan kişi bu kod ile kargo firmasına gidip cihazı teslim eder
6. Kargo firması şubesinde işlem tamamlandığında, kargo firması API'si bizim sistemimize webhook gönderir
7. Webhook'ta `tracking_number` (eğer henüz yoksa) ve kargo durumu güncellemesi gelir
8. Sistem otomatik olarak `cargo_shipments` kaydını günceller:
   - `cargo_shipments.status` → 'used' olur (kod kullanıldı)
   - `cargo_shipments.cargo_status` → 'picked_up' olur
   - `cargo_shipments.tracking_number` → Kargo firmasından gelen takip numarası

**iOS Uygulaması:**
- Bulan kişi için: Teslim kodu büyük, vurgulu gösterilmeli
- Kopyalama butonu eklenebilir
- QR kod gösterilebilir (kargo firması için)

---

## 📁 Proje Yapısı ve Dosya Organizasyonu

### Xcode Proje Yapısı

```
iFoundAnApple/
├── iFoundAnApple.xcodeproj          # Xcode proje dosyası
├── iFoundAnApple/                   # Ana uygulama klasörü
│   ├── App/
│   │   ├── iFoundAnAppleApp.swift   # SwiftUI App entry point
│   │   └── AppDelegate.swift        # AppDelegate (opsiyonel, SwiftUI App kullanılıyorsa gerekli değil)
│   │
│   ├── Models/                      # Data Models
│   │   ├── User.swift
│   │   ├── Device.swift
│   │   ├── Payment.swift
│   │   ├── CargoShipment.swift
│   │   ├── Notification.swift
│   │   └── Enums.swift              # DeviceStatus, CargoStatus, vb.
│   │
│   ├── Views/                       # SwiftUI Views
│   │   ├── Authentication/
│   │   │   ├── SplashView.swift
│   │   │   ├── OnboardingView.swift
│   │   │   ├── LoginView.swift
│   │   │   ├── RegisterView.swift
│   │   │   └── ResetPasswordView.swift
│   │   │
│   │   ├── Main/
│   │   │   ├── TabBarView.swift
│   │   │   ├── DashboardView.swift
│   │   │   ├── DeviceListView.swift
│   │   │   └── NotificationsView.swift
│   │   │
│   │   ├── Device/
│   │   │   ├── DeviceDetailView.swift
│   │   │   ├── AddDeviceView.swift
│   │   │   ├── AddLostDeviceView.swift
│   │   │   ├── AddFoundDeviceView.swift
│   │   │   └── ImagePreviewView.swift
│   │   │
│   │   ├── Payment/
│   │   │   ├── MatchPaymentView.swift
│   │   │   ├── PaymentSummaryView.swift
│   │   │   ├── PaymentMethodSelectionView.swift
│   │   │   ├── SecurePaymentView.swift      # 3D Secure WebView
│   │   │   ├── PaymentProcessingView.swift
│   │   │   └── PaymentSuccessView.swift
│   │   │
│   │   ├── Profile/
│   │   │   ├── ProfileView.swift
│   │   │   ├── EditProfileView.swift
│   │   │   └── BankAccountView.swift
│   │   │
│   │   ├── Support/
│   │   │   ├── FAQView.swift
│   │   │   ├── ContactView.swift
│   │   │   ├── AboutView.swift
│   │   │   └── HelpSupportView.swift
│   │   │
│   │   └── Common/
│   │       ├── Components/
│   │       │   ├── DeviceCard.swift
│   │       │   ├── NotificationCard.swift
│   │       │   ├── StatusBadge.swift
│   │       │   ├── TimelineView.swift
│   │       │   └── LoadingView.swift
│   │       ├── EmptyStateView.swift
│   │       └── ErrorView.swift
│   │
│   ├── ViewModels/                  # ViewModels (MVVM pattern)
│   │   ├── AuthenticationViewModel.swift
│   │   ├── DeviceListViewModel.swift
│   │   ├── DeviceDetailViewModel.swift
│   │   ├── PaymentViewModel.swift
│   │   └── ProfileViewModel.swift
│   │
│   ├── Services/                    # Business Logic Services
│   │   ├── SupabaseService.swift
│   │   ├── APIService.swift         # Backend API client
│   │   ├── AuthService.swift
│   │   ├── DeviceService.swift
│   │   ├── PaymentService.swift
│   │   ├── NotificationService.swift
│   │   ├── FileUploadService.swift
│   │   └── DeepLinkService.swift
│   │
│   ├── Managers/                    # Utility Managers
│   │   ├── KeychainManager.swift
│   │   ├── ImageCacheManager.swift
│   │   ├── LoggingManager.swift
│   │   └── NetworkManager.swift
│   │
│   ├── Utilities/                   # Helper Functions
│   │   ├── Extensions/
│   │   │   ├── String+Extensions.swift
│   │   │   ├── Date+Extensions.swift
│   │   │   └── View+Extensions.swift
│   │   ├── Constants.swift          # Semantic değerler (Spacing, CornerRadius, FontStyle, vb.)
│   │   └── Helpers.swift
│   │
│   ├── Resources/
│   │   ├── Assets.xcassets/         # Asset Catalog
│   │   │   ├── AppIcon.appiconset/
│   │   │   ├── Colors/
│   │   │   │   ├── PrimaryBlue.colorset
│   │   │   │   ├── SuccessGreen.colorset
│   │   │   │   └── ...
│   │   │   └── Images/
│   │   ├── Localizable.strings      # Localization (Türkçe)
│   │   └── Localizable.stringsdict  # Pluralization rules
│   │
│   ├── Info.plist                   # App configuration
│   └── Preview Content/             # SwiftUI Previews için
│       └── Preview Assets.xcassets/
│
├── iFoundAnAppleTests/              # Unit Tests
│   ├── Models/
│   ├── ViewModels/
│   └── Services/
│
└── iFoundAnAppleUITests/           # UI Tests
    └── Screens/
```

### Dosya İsimlendirme Kuralları
- **Views**: PascalCase + "View" suffix (örn: `LoginView.swift`)
- **ViewModels**: PascalCase + "ViewModel" suffix (örn: `DeviceListViewModel.swift`)
- **Services**: PascalCase + "Service" suffix (örn: `AuthService.swift`)
- **Models**: PascalCase, singular (örn: `Device.swift`)
- **Components**: PascalCase, descriptive (örn: `PrimaryButton.swift`, `DeviceCard.swift`)
- **ButtonStyles**: PascalCase + "ButtonStyle" suffix (örn: `PrimaryButtonStyle.swift`)
- **Extensions**: "Type+Extensions" format (örn: `String+Extensions.swift`)
- **Constants**: PascalCase (örn: `Constants.swift`)

### Kod Standartları ve Best Practices

#### 1. Semantic İsimlendirme (Sabit Değerler Yerine)

**Constants.swift Dosyası:**
```swift
// Constants.swift
import SwiftUI

// Spacing
enum Spacing {
    static let tiny: CGFloat = 4
    static let small: CGFloat = 8
    static let standard: CGFloat = 16
    static let large: CGFloat = 24
    static let extraLarge: CGFloat = 32
}

// Corner Radius
enum CornerRadius {
    static let small: CGFloat = 4
    static let medium: CGFloat = 8
    static let button: CGFloat = 8
    static let card: CGFloat = 12
    static let large: CGFloat = 16
}

// Font Styles
enum FontStyle {
    static let largeTitle = Font.system(size: 34, weight: .bold, design: .default)
    static let title1 = Font.system(size: 28, weight: .regular, design: .default)
    static let title2 = Font.system(size: 22, weight: .regular, design: .default)
    static let headline = Font.system(size: 17, weight: .semibold, design: .default)
    static let body = Font.system(size: 17, weight: .regular, design: .default)
    static let callout = Font.system(size: 16, weight: .regular, design: .default)
    static let subhead = Font.system(size: 15, weight: .regular, design: .default)
    static let footnote = Font.system(size: 13, weight: .regular, design: .default)
    static let caption = Font.system(size: 12, weight: .regular, design: .default)
}

// Animation Durations
enum AnimationDuration {
    static let fast: Double = 0.2
    static let standard: Double = 0.3
    static let slow: Double = 0.5
}
```

**Kullanım:**
```swift
// ❌ YANLIŞ
.padding(16)
.cornerRadius(12)
.font(.system(size: 17, weight: .regular))

// ✅ DOĞRU
.padding(.standard)
.cornerRadius(CornerRadius.card)
.font(FontStyle.body)
```

#### 2. Reusable Components Yapısı

**Component Örnekleri:**

```swift
// Components/PrimaryButton.swift
struct PrimaryButton: View {
    let title: String
    let action: () -> Void
    var isDisabled: Bool = false
    
    var body: some View {
        Button(action: action) {
            Text(title)
                .font(FontStyle.headline)
                .foregroundColor(Color("PrimaryText"))
                .frame(maxWidth: .infinity)
                .padding(.standard)
                .background(Color("PrimaryColor"))
                .cornerRadius(CornerRadius.button)
        }
        .disabled(isDisabled)
        .buttonStyle(PrimaryButtonStyle())
    }
}

// ButtonStyles/PrimaryButtonStyle.swift
struct PrimaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
            .opacity(configuration.isPressed ? 0.8 : 1.0)
            .animation(.easeInOut(duration: AnimationDuration.fast), value: configuration.isPressed)
    }
}
```

**Kullanım:**
```swift
// Her ekranda aynı component
PrimaryButton(title: "Giriş Yap") {
    viewModel.login()
}
```

#### 3. MVVM Pattern Uygulaması

**View İçinde Mantık Olmamalı:**

```swift
// ❌ YANLIŞ - View içinde mantık
struct DeviceDetailView: View {
    @State var device: Device?
    
    var body: some View {
        if let device = device {
            if device.status == .matched {
                if device.device_role == "owner" {
                    Button("Ödemeyi Yap") {
                        // API çağrısı burada - YANLIŞ!
                    }
                }
            }
        }
    }
}

// ✅ DOĞRU - Mantık ViewModel'de
struct DeviceDetailView: View {
    @StateObject private var viewModel = DeviceDetailViewModel()
    
    var body: some View {
        if viewModel.showPaymentButton {
            PrimaryButton(title: viewModel.paymentButtonTitle) {
                viewModel.handlePayment()
            }
        }
    }
}
```

#### 4. Asset Catalog Kullanımı

**Renkler:**
```swift
// ❌ YANLIŞ
Color(hex: "#007AFF")
Color.blue

// ✅ DOĞRU
Color("PrimaryColor")
Color("BackgroundColor")
```

**Asset Catalog Yapısı:**
- `Assets.xcassets/Colors/PrimaryColor.colorset/` (Light/Dark variant'lar)
- `Assets.xcassets/Colors/SuccessColor.colorset/`
- `Assets.xcassets/Colors/BackgroundColor.colorset/`
- vb.

**İkonlar:**
- SF Symbols: `Image(systemName: "house.fill")`
- Custom Icons: `Image("icon-name")` (Asset Catalog'da)

---

## ⚙️ Xcode Proje Konfigürasyonu

### 1. Proje Oluşturma
- **Template**: iOS App (SwiftUI)
- **Interface**: SwiftUI
- **Language**: Swift
- **Storage**: None (Core Data kullanılmıyor)
- **Include Tests**: Yes

### 2. Build Settings

**General:**
- **Display Name**: iFoundAnApple
- **Bundle Identifier**: `com.ifoundanapple.app`
- **Version**: 1.0.0
- **Build**: 1
- **Minimum Deployments**: iOS 17.0
- **Supported Platforms**: iPhone (iPad desteği yok)

**Signing & Capabilities:**
- **Team**: Apple Developer Team seçilmeli
- **Automatically manage signing**: Yes
- **Capabilities**:
  - Push Notifications
  - Associated Domains (Universal Links için)
  - Sign in with Apple (opsiyonel)

**Build Configurations:**
- **Debug**: Development ortamı
- **Release**: Production ortamı
- **TestFlight**: Release ile aynı (opsiyonel ayrı config)

### 3. Info.plist Konfigürasyonu

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <!-- App Information -->
    <key>CFBundleDisplayName</key>
    <string>iFoundAnApple</string>
    <key>CFBundleName</key>
    <string>iFoundAnApple</string>
    <key>CFBundleIdentifier</key>
    <string>com.ifoundanapple.app</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    
    <!-- URL Schemes (Deep Linking) -->
    <key>CFBundleURLTypes</key>
    <array>
        <dict>
            <key>CFBundleTypeRole</key>
            <string>Editor</string>
            <key>CFBundleURLSchemes</key>
            <array>
                <string>ifoundanapple</string>
            </array>
        </dict>
    </array>
    
    <!-- Associated Domains (Universal Links) -->
    <key>com.apple.developer.associated-domains</key>
    <array>
        <string>applinks:ifoundanapple.com</string>
    </array>
    
    <!-- Privacy Permissions -->
    <key>NSCameraUsageDescription</key>
    <string>Cihaz fotoğrafları çekmek için kamera erişimi gereklidir.</string>
    <key>NSPhotoLibraryUsageDescription</key>
    <string>Fatura ve cihaz fotoğrafları yüklemek için fotoğraf kütüphanesi erişimi gereklidir.</string>
    <key>NSPhotoLibraryAddUsageDescription</key>
    <string>Fotoğrafları kaydetmek için fotoğraf kütüphanesi yazma erişimi gereklidir.</string>
    
    <!-- Network Security -->
    <key>NSAppTransportSecurity</key>
    <dict>
        <key>NSAllowsArbitraryLoads</key>
        <false/>
        <key>NSExceptionDomains</key>
        <dict>
            <key>api.ifoundanapple.com</key>
            <dict>
                <key>NSExceptionAllowsInsecureHTTPLoads</key>
                <false/>
                <key>NSIncludesSubdomains</key>
                <true/>
            </dict>
        </dict>
    </dict>
    
    <!-- Supported Interface Orientations -->
    <key>UISupportedInterfaceOrientations</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
    </array>
    <key>UISupportedInterfaceOrientations~ipad</key>
    <array>
        <!-- iPad desteği yok -->
    </array>
    
    <!-- Status Bar -->
    <key>UIStatusBarStyle</key>
    <string>UIStatusBarStyleDefault</string>
    <key>UIViewControllerBasedStatusBarAppearance</key>
    <true/>
</dict>
</plist>
```

### 4. SwiftUI App Yapısı

```swift
// iFoundAnAppleApp.swift
import SwiftUI
import Supabase

@main
struct iFoundAnAppleApp: App {
    @StateObject private var appState = AppState()
    
    init() {
        // Supabase client initialization
        // Environment variables setup
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
                .onOpenURL { url in
                    // Deep linking handling
                    DeepLinkService.shared.handle(url: url)
                }
        }
    }
}
```

---

## 📦 Swift Package Dependencies

### Xcode Package Dependencies

**File → Add Package Dependencies...** ile eklenmeli:

1. **Supabase Swift SDK**
   - URL: `https://github.com/supabase/supabase-swift`
   - Version: `2.0.0` veya daha yeni
   - Products: `Supabase`

2. **Alamofire** (HTTP Client - Backend API için)
   - URL: `https://github.com/Alamofire/Alamofire`
   - Version: `5.8.0` veya daha yeni
   - Products: `Alamofire`

3. **KeychainAccess** (Keychain yönetimi)
   - URL: `https://github.com/kishikawakatsumi/KeychainAccess`
   - Version: `4.2.2` veya daha yeni
   - Products: `KeychainAccess`

4. **Kingfisher** (Image caching - opsiyonel)
   - URL: `https://github.com/onevcat/Kingfisher`
   - Version: `7.9.0` veya daha yeni
   - Products: `Kingfisher`

### Package.swift (Alternatif - Swift Package Manager)

```swift
// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "iFoundAnApple",
    platforms: [
        .iOS(.v17)
    ],
    products: [
        .library(
            name: "iFoundAnApple",
            targets: ["iFoundAnApple"]),
    ],
    dependencies: [
        .package(url: "https://github.com/supabase/supabase-swift", from: "2.0.0"),
        .package(url: "https://github.com/Alamofire/Alamofire", from: "5.8.0"),
        .package(url: "https://github.com/kishikawakatsumi/KeychainAccess", from: "4.2.2"),
        .package(url: "https://github.com/onevcat/Kingfisher", from: "7.9.0")
    ],
    targets: [
        .target(
            name: "iFoundAnApple",
            dependencies: [
                .product(name: "Supabase", package: "supabase-swift"),
                .product(name: "Alamofire", package: "Alamofire"),
                .product(name: "KeychainAccess", package: "KeychainAccess"),
                .product(name: "Kingfisher", package: "Kingfisher")
            ])
    ]
)
```

---

## 🔧 Environment Variables ve Konfigürasyon

### Configuration File Yapısı

```swift
// Configuration.swift
import Foundation

enum Configuration {
    enum Environment {
        case development
        case production
    }
    
    static var current: Environment {
        #if DEBUG
        return .development
        #else
        return .production
        #endif
    }
    
    static var supabaseURL: String {
        switch current {
        case .development:
            return "https://your-dev-project.supabase.co"
        case .production:
            return "https://your-prod-project.supabase.co"
        }
    }
    
    static var supabaseAnonKey: String {
        switch current {
        case .development:
            return "your-dev-anon-key"
        case .production:
            return "your-prod-anon-key"
        }
    }
    
    static var backendAPIBaseURL: String {
        switch current {
        case .development:
            return "http://localhost:3000/v1"
        case .production:
            return "https://api.ifoundanapple.com/v1"
        }
    }
}
```

### Xcode Scheme Configuration

**Debug Scheme:**
- Environment variables:
  - `SUPABASE_URL` = Development URL
  - `SUPABASE_ANON_KEY` = Development Key
  - `BACKEND_API_URL` = `http://localhost:3000/v1`

**Release Scheme:**
- Environment variables:
  - `SUPABASE_URL` = Production URL
  - `SUPABASE_ANON_KEY` = Production Key
  - `BACKEND_API_URL` = `https://api.ifoundanapple.com/v1`

**Not:** Production'da environment variables yerine hardcoded değerler kullanılabilir (güvenlik için).

---

## 🎨 Asset Catalog Konfigürasyonu

### Colors (Assets.xcassets/Colors/)

**⚠️ KRİTİK KURAL:** Tüm renkler Asset Catalog'da semantic isimlerle tanımlanmalı. Kod içinde hardcoded renk kullanılmamalı!

**Semantic İsimlendirme Kullanılmalı:**

1. **PrimaryColor** (PrimaryBlue değil!)
   - Light: `#007AFF`
   - Dark: `#0A84FF`
   - Kullanım: `Color("PrimaryColor")`

2. **PrimaryText** (Buton text rengi)
   - Light: `#FFFFFF`
   - Dark: `#FFFFFF`
   - Kullanım: `Color("PrimaryText")`

3. **SuccessColor** (SuccessGreen değil!)
   - Light: `#34C759`
   - Dark: `#30D158`
   - Kullanım: `Color("SuccessColor")`

4. **WarningColor** (WarningYellow değil!)
   - Light: `#FF9500`
   - Dark: `#FF9F0A`
   - Kullanım: `Color("WarningColor")`

5. **ErrorColor** (ErrorRed değil!)
   - Light: `#FF3B30`
   - Dark: `#FF453A`
   - Kullanım: `Color("ErrorColor")`

6. **BackgroundColor** (Background değil!)
   - Light: `#F2F2F7`
   - Dark: `#000000`
   - Kullanım: `Color("BackgroundColor")`

7. **CardBackgroundColor** (CardBackground değil!)
   - Light: `#FFFFFF`
   - Dark: `#1C1C1E`
   - Kullanım: `Color("CardBackgroundColor")`

8. **TextPrimary** (Ana text rengi)
   - Light: `#000000`
   - Dark: `#FFFFFF`
   - Kullanım: `Color("TextPrimary")`

9. **TextSecondary** (İkincil text rengi)
   - Light: `#6E6E73`
   - Dark: `#98989D`
   - Kullanım: `Color("TextSecondary")`

10. **BorderColor** (Border rengi)
    - Light: `#C6C6C8`
    - Dark: `#38383A`
    - Kullanım: `Color("BorderColor")`

11. **SeparatorColor** (Ayırıcı çizgi rengi)
    - Light: `#C6C6C8`
    - Dark: `#38383A`
    - Kullanım: `Color("SeparatorColor")`

**Kod İçinde Kullanım:**
```swift
// ❌ YANLIŞ - Hardcoded renk
.background(Color(hex: "#007AFF"))
.foregroundColor(.white)

// ✅ DOĞRU - Asset Catalog'dan semantic isim
.background(Color("PrimaryColor"))
.foregroundColor(Color("PrimaryText"))
```

**Faydaları:**
- Tasarımcı "Primary renk artık mavi değil yeşil olacak" dediğinde → Sadece Asset Catalog'daki `PrimaryColor` değerini değiştir
- Tüm uygulamadaki primary renkler otomatik güncellenir
- Dark mode desteği otomatik (Light/Dark variant'lar)
- Koduna dokunmana gerek kalmaz

### App Icon (Assets.xcassets/AppIcon.appiconset/)

- **Sizes**: 20pt, 29pt, 40pt, 60pt, 76pt, 83.5pt, 1024pt
- **Format**: PNG (alpha channel destekli)
- **Design**: Apple HIG uyumlu, rounded corners otomatik

---

## 🌍 Localization (Çoklu Dil Desteği)

### Desteklenen Diller
- **Türkçe** (tr) - Primary
- **İngilizce** (en) - Secondary
- **Fransızca** (fr) - Gelecekte
- **Japonca** (ja) - Gelecekte
- **İspanyolca** (es) - Gelecekte

### Localizable.strings Yapısı

```swift
// Localizable.strings (Türkçe)
"app.name" = "iFoundAnApple";
"auth.login" = "Giriş Yap";
"auth.register" = "Kayıt Ol";
"device.add" = "Cihaz Ekle";
"device.detail" = "Cihaz Detayı";
"payment.process" = "Ödeme Yap";
// ... (200+ çeviri anahtarı)
```

### Kullanım

```swift
// SwiftUI'de
Text("auth.login", bundle: .main)

// veya
Text(LocalizedStringKey("auth.login"))
```

### Xcode Project Settings
- **Localizations**: Turkish (Base), English
- **Development Language**: Turkish
- **Use Base Internationalization**: Yes

---

## 🚀 Geliştirme Sırası (Önerilen)

### Faz 1: Temel Altyapı (1-2 hafta)
1. Xcode projesi oluşturma
2. Proje yapısı ve klasör organizasyonu
3. Swift Package dependencies kurulumu
4. Configuration file oluşturma
5. Supabase SDK kurulumu ve konfigürasyonu
6. Backend API client kurulumu
7. Keychain manager kurulumu
8. Authentication servisi
9. Deep linking konfigürasyonu
10. Asset catalog setup (renkler, app icon)

### Faz 2: Core Özellikler (2-3 hafta)
1. Authentication ekranları (Login, Register)
2. Dashboard ekranı
3. Device list ve detail ekranları
4. Add device formları
5. Profile ekranı

### Faz 3: Ödeme Entegrasyonu (1-2 hafta)
1. Payment flow ekranları
2. Backend API entegrasyonu
3. 3D Secure WebView
4. Deep linking callback
5. Payment status monitoring

### Faz 4: Real-time ve Notifications (1 hafta)
1. Real-time subscriptions
2. Push notifications
3. Notification ekranı
4. Badge management

### Faz 5: Kargo ve Teslim (1 hafta)
1. Device Detail Screen'e kargo bilgileri entegrasyonu
2. Kargo takip bilgileri gösterimi
3. Delivery confirmation (Device Detail Screen içinde)
4. Map integration (opsiyonel, harici kargo firması web sitesi linki yeterli olabilir)

### Faz 6: İyileştirmeler (1-2 hafta)
1. Offline support
2. Error handling iyileştirmeleri
3. Performance optimizasyonu
4. UI/UX polish
5. Testing

---

## 📚 Ek Kaynaklar

### Web Uygulaması Dokümantasyonu
- `docs/BACKEND_API_DOCUMENTATION.md` - Backend API referansı
- `docs/PROCESS_FLOW.md` - İş akışları detayları (TÜM STATUS'LAR VE SÜREÇLER)
- `docs/PROJECT_DESIGN_DOCUMENTATION.md` - Proje tasarım dokümantasyonu
- `docs/COMPLETE_DATABASE_SCHEMA.md` - Veritabanı şeması (TÜM TABLOLAR VE RLS POLİTİKALARI)

### Kod Referansları
- `contexts/AppContext.tsx` - State management örneği (real-time subscriptions, device matching)
- `utils/apiClient.ts` - Backend API client örneği (JWT token yönetimi)
- `utils/supabaseClient.ts` - Supabase client konfigürasyonu
- `utils/paynetPayment.ts` - PAYNET ödeme entegrasyonu
- `utils/fileUpload.ts` - Supabase Storage file upload
- `pages/DeviceDetailPage.tsx` - Device detail implementasyonu (TÜM STATUS'LAR İÇİN)
- `pages/DeviceDetailPage.tsx` - Kargo bilgileri burada gösterilir (CargoManagementPage ayrı ekran değil)
- `pages/MatchPaymentPage.tsx` - Ödeme sayfası implementasyonu
- `pages/PaymentCallbackPage.tsx` - 3D Secure callback handling
- `components/` - UI component'leri

### Veritabanı Şeması Referansları
- **devices tablosu**: `device_role` kolonu (owner/finder ayrımı için KRİTİK)
- **cargo_shipments tablosu**: `code` (teslim kodu), `cargo_status` (kargo durumu), `status` (kod durumu)
- **payments tablosu**: `payment_status`, `escrow_status`
- **userprofile tablosu**: Şifrelenmiş alanlar (tc_kimlik_no, iban, phone_number, address)
- **notifications tablosu**: `message_key`, `link`, `is_read`

### Süreç Akışı Referansları
- **PROCESS_FLOW.md** dosyasındaki tüm adımlar iOS uygulaması için referans alınmalıdır
- Her status için database kayıt detayları (SQL örnekleri) mevcuttur
- Bildirim matrisi ve zaman sınırları detaylandırılmıştır

---

## 📝 Logging ve Debugging

### Logging Stratejisi

```swift
// LoggingManager.swift
import OSLog

enum LogLevel {
    case debug
    case info
    case warning
    case error
}

class LoggingManager {
    static let shared = LoggingManager()
    private let logger = Logger(subsystem: "com.ifoundanapple.app", category: "App")
    
    func log(_ message: String, level: LogLevel = .info) {
        #if DEBUG
        switch level {
        case .debug:
            logger.debug("\(message)")
        case .info:
            logger.info("\(message)")
        case .warning:
            logger.warning("\(message)")
        case .error:
            logger.error("\(message)")
        }
        #endif
    }
}
```

### Debugging Tools
- **Xcode Console**: OSLog ile log görüntüleme
- **Network Debugging**: Charles Proxy veya Proxyman (opsiyonel)
- **Memory Debugging**: Xcode Instruments (Leaks, Allocations)
- **Performance Profiling**: Xcode Instruments (Time Profiler)

### Error Tracking (Opsiyonel - Production)
- **Firebase Crashlytics**: Crash reporting
- **Sentry**: Error tracking ve monitoring
- **Analytics**: Firebase Analytics veya Mixpanel (opsiyonel)

---

## 🌙 Dark Mode Desteği

### Color Scheme Yönetimi

```swift
// ColorSchemeManager.swift
import SwiftUI

class ColorSchemeManager: ObservableObject {
    @Published var colorScheme: ColorScheme = .light
    
    func toggle() {
        colorScheme = colorScheme == .light ? .dark : .light
    }
}
```

### Asset Catalog Colors
- Tüm renkler Asset Catalog'da Light ve Dark variant'lara sahip olmalı
- System colors kullanılabilir (iOS 13+):
  - `Color.primary` (otomatik dark mode desteği)
  - `Color.secondary`
  - `Color.systemBackground`
  - `Color.systemGroupedBackground`

### View Modifiers
```swift
// Dark mode desteği için
.environment(\.colorScheme, .dark) // Test için
```

---

## ♿ Accessibility (Erişilebilirlik) Detayları

### VoiceOver Desteği
- Tüm butonlar için `accessibilityLabel`
- Görsel içerikler için `accessibilityHint`
- Form alanları için `accessibilityValue`
- Navigation için `accessibilityTraits`

### Dynamic Type
- Tüm text'ler Dynamic Type desteklemeli
- Custom font size'lar yerine system font kullanılmalı
- `Text` view'lerde `.font(.body)` gibi system font'lar kullanılmalı

### Color Contrast
- Text ve background arasında minimum 4.5:1 contrast ratio
- WCAG AA standardı

### Accessibility Traits
```swift
Button("Giriş Yap")
    .accessibilityLabel("Giriş yap butonu")
    .accessibilityHint("Email ve şifre ile giriş yapabilirsiniz")
    .accessibilityTraits(.button)
```

---

## 📦 Git Yapısı ve .gitignore

### .gitignore

```
# Xcode
*.xcodeproj/*
!*.xcodeproj/project.pbxproj
!*.xcodeproj/xcshareddata/
*.xcworkspace/*
!*.xcworkspace/contents.xcworkspacedata
!*.xcworkspace/xcshareddata/

# Build
build/
DerivedData/
*.hmap
*.ipa
*.dSYM.zip
*.dSYM

# Swift Package Manager
.build/
.swiftpm/
Package.resolved

# CocoaPods (eğer kullanılıyorsa)
Pods/
*.xcworkspace

# Environment Variables
.env
.env.local
*.plist (Info.plist hariç, eğer sensitive data varsa)

# User-specific
*.swp
*.swo
*~
.DS_Store

# App-specific
Configuration.swift (eğer API keys içeriyorsa)
```

### Branch Strategy
- **main**: Production-ready code
- **develop**: Development branch
- **feature/**: Feature branches
- **hotfix/**: Hotfix branches

---

## ✅ Kontrol Listesi

### Geliştirme Öncesi
- [ ] Xcode projesi oluşturuldu (iOS App, SwiftUI)
- [ ] Proje yapısı ve klasör organizasyonu tamamlandı
- [ ] Swift Package dependencies kuruldu (Supabase, Alamofire, KeychainAccess)
- [ ] Configuration.swift dosyası oluşturuldu
- [ ] Info.plist konfigüre edildi (URL Schemes, Associated Domains, Privacy Permissions)
- [ ] Asset Catalog setup (renkler, app icon)
- [ ] Supabase SDK kuruldu ve konfigüre edildi
- [ ] Backend API client kuruldu
- [ ] Backend API URL'leri konfigüre edildi (Development ve Production)
- [ ] Deep linking konfigüre edildi (URL Scheme + Universal Links)
- [ ] Keychain manager kuruldu
- [ ] Environment variables ayarlandı (Xcode Scheme'lerde)
- [ ] Localization dosyaları oluşturuldu (Türkçe, İngilizce)
- [ ] .gitignore dosyası oluşturuldu

### Geliştirme Sırası
- [ ] Tüm ekranlar HIG uyumlu
- [ ] Dark mode desteği eklendi (tüm ekranlar)
- [ ] Accessibility (VoiceOver, Dynamic Type) implementasyonu
- [ ] Real-time subscriptions çalışıyor
- [ ] Payment flow test edildi (3D Secure dahil)
- [ ] Deep linking test edildi (URL Scheme + Universal Links)
- [ ] Error handling implementasyonu (tüm API çağrıları)
- [ ] Offline support eklendi (Core Data veya local cache)
- [ ] Image caching implementasyonu
- [ ] Logging sistemi kuruldu
- [ ] Unit testler yazıldı (minimum %70 coverage)
- [ ] UI testler yazıldı (critical flows)
- [ ] Memory leak kontrolü yapıldı (Instruments)
- [ ] Performance profiling yapıldı

### Deployment Öncesi
- [ ] Tüm testler geçti (Unit, UI, Integration)
- [ ] Code review yapıldı
- [ ] Memory leak kontrolü yapıldı (Instruments)
- [ ] Performance test edildi (slow network, low memory)
- [ ] Accessibility test edildi (VoiceOver, Dynamic Type)
- [ ] Dark mode test edildi (tüm ekranlar)
- [ ] Localization test edildi (Türkçe, İngilizce)
- [ ] Deep linking test edildi (gerçek cihazda)
- [ ] Push notifications test edildi
- [ ] Privacy policy URL eklendi
- [ ] Terms & Conditions URL eklendi
- [ ] App Store metadata hazır (description, keywords, screenshots)
- [ ] Screenshot'lar hazır (iPhone 6.7" ve 6.5" için)
- [ ] App icon hazır (tüm boyutlar)
- [ ] Code signing yapıldı (Production certificate)
- [ ] Provisioning profile oluşturuldu
- [ ] App Store Connect'te uygulama oluşturuldu
- [ ] TestFlight build yüklendi ve test edildi
- [ ] Crash reporting kuruldu (opsiyonel - Firebase Crashlytics)

---

## 📞 İletişim ve Destek

Geliştirme sırasında sorular için:
- Web uygulaması kodunu referans al
- Backend API dokümantasyonunu kontrol et
- Supabase dokümantasyonunu incele

---

---

## 📋 Ekran Hiyerarşisi (Navigation Structure)

### iOS Navigasyon Yapısı

```
App Launch
├── Splash/Launch Screen (2-3 saniye)
│   ├── Kullanıcı oturumu varsa → Tab Bar Controller
│   └── Kullanıcı oturumu yoksa → Onboarding Screen
│
├── Onboarding/Welcome Screen
│   ├── "Başla" → Login Screen veya Register Screen
│
├── Authentication Flow (Modal Stack)
│   ├── Login Screen
│   │   ├── "Giriş Yap" → Tab Bar Controller (Dashboard)
│   │   ├── "Şifremi Unuttum" → Reset Password Screen
│   │   ├── "Google ile Giriş" → OAuth Flow → Tab Bar Controller
│   │   ├── "Apple ile Giriş" → Sign in with Apple → Tab Bar Controller
│   │   └── "Kayıt Ol" → Register Screen
│   │
│   ├── Register Screen
│   │   ├── "Kayıt Ol" → Tab Bar Controller (Dashboard)
│   │   ├── "Google ile Kayıt" → OAuth Flow → Tab Bar Controller
│   │   ├── "Apple ile Kayıt" → Sign in with Apple → Tab Bar Controller
│   │   └── "Giriş Yap" → Login Screen
│   │
│   └── Reset Password Screen
│       └── "Şifre Sıfırlama Linki Gönder" → Email Sent Confirmation
│
└── Tab Bar Controller (Ana Navigasyon - Authenticated Users)
    │
    ├── Tab 1: Dashboard (Home)
    │   ├── Home/Dashboard Screen
    │   │   ├── Cihaz kartına tıklama → Device Detail Screen (Push)
    │   │   ├── "+" Floating Button → Add Device Screen (Modal)
    │   │   └── "Eşleşen Cihazlar" → Device Detail Screen (Push)
    │   │
    │   └── Device Detail Screen (Navigation Stack)
    │       ├── Status: LOST → LOST View
    │       ├── Status: REPORTED → REPORTED View
    │       ├── Status: MATCHED → MATCHED View
    │       │   └── "Ödemeyi Güvenle Yap" → Match Payment Screen (Modal)
    │       ├── Status: PAYMENT_PENDING → Loading View
    │       ├── Status: PAYMENT_COMPLETED → PAYMENT_COMPLETED View
    │       │   └── (Finder için) Teslim Kodu görüntüleme
    │       ├── Status: CARGO_SHIPPED → CARGO_SHIPPED View
    │       │   └── Kargo Takip Bilgileri (Device Detail Screen içinde)
    │       ├── Status: DELIVERED → DELIVERED View
    │       │   ├── "Onay Butonu" → Delivery Confirmation Screen (Modal)
    │       │   └── "Sorun Var, İtiraz Et" → Dispute Screen (Modal)
    │       ├── Status: CONFIRMED → CONFIRMED View (geçici)
    │       ├── Status: COMPLETED → COMPLETED View
    │       ├── Status: DISPUTED → DISPUTED View
    │       ├── Status: CANCELLED → CANCELLED View
    │       ├── Status: RETURNED → RETURNED View
    │       └── Status: FAILED_DELIVERY → FAILED_DELIVERY View
    │       │
    │       ├── Fotoğraf/Fatura tıklama → Image Preview Screen (Modal)
    │       ├── "KAYDI SİL" → Delete Device Confirmation (Alert)
    │       └── "CİHAZLARIM LİSTESİNE GERİ DÖN" → Dashboard (Pop)
    │
    ├── Tab 2: Cihazlarım (Devices)
    │   ├── Device List Screen
    │   │   ├── Cihaz kartına tıklama → Device Detail Screen (Push)
    │   │   ├── "+" Button → Add Device Screen (Modal)
    │   │   └── Filtreler (Durum, Rol, Arama)
    │   │
    │   └── Add Device Screen (Modal)
    │       ├── "Kayıp Cihaz Bildir" → Add Lost Device Form (Push)
    │       └── "Bulunan Cihaz Bildir" → Add Found Device Form (Push)
    │       │
    │       ├── Add Lost Device Form
    │       │   └── "Kaydet" → Device Detail Screen (LOST status) (Push)
    │       │
    │       └── Add Found Device Form
    │           └── "Kaydet" → Device Detail Screen (REPORTED status) (Push)
    │
    ├── Tab 3: Bildirimler (Notifications)
    │   └── Notifications Screen
    │       └── Bildirime tıklama → İlgili ekrana yönlendirme (Push)
    │           ├── Device Detail Screen (eğer device ile ilgiliyse)
    │           └── Payment Success Screen (eğer ödeme ile ilgiliyse)
    │
    └── Tab 4: Profil (Profile)
        ├── Profile Screen
        │   ├── "Düzenle" → Edit Profile Screen (Push)
        │   ├── "Banka Hesabı" → Bank Account Screen (Push)
        │   ├── "Ayarlar" → Settings Screen (Push)
        │   ├── "Kullanım Şartları" → Terms & Conditions Screen (Modal)
        │   ├── "Gizlilik Politikası" → Privacy Policy Screen (Modal)
        │   └── "Çıkış Yap" → Login Screen (Root'a dön)
        │
        ├── Edit Profile Screen (Navigation Stack)
        │   └── "Kaydet" → Profile Screen (Pop)
        │
        └── Bank Account Screen (Navigation Stack)
            └── "Kaydet" → Profile Screen (Pop)
│
├── Payment Flow (Modal Stack)
│   ├── Match Payment Screen
│   │   ├── "Ödemeye Devam Et" → Payment Summary Screen (Push)
│   │   └── "İptal" → Device Detail Screen (Dismiss)
│   │
│   ├── Payment Summary Screen
│   │   ├── "Ödeme Yöntemi Seç" → Payment Method Selection (Push)
│   │   └── "Geri" → Match Payment Screen (Pop)
│   │
│   ├── Payment Method Selection
│   │   ├── "Kredi Kartı" → 3D Secure Payment Screen (Push)
│   │   └── "Geri" → Payment Summary Screen (Pop)
│   │
│   ├── 3D Secure Payment Screen (WKWebView)
│   │   ├── Başarılı → Payment Processing Screen (Push)
│   │   └── Hata → Error Screen (Push)
│   │
│   ├── Payment Processing Screen
│   │   └── İşlem tamamlanınca → Payment Success Screen (Push)
│   │
│   └── Payment Success Screen
│       └── "Tamam" → Device Detail Screen (PAYMENT_COMPLETED) (Dismiss Modal, Navigate)
│
├── Cargo & Delivery (Modal/Sheet)
│   ├── Cargo Tracking Screen (Opsiyonel - Harita)
│   │   └── Device Detail Screen'den "Haritada Görüntüle" → Bu ekran
│   │
│   └── Delivery Confirmation Screen (Modal/Sheet)
│       ├── "Onayla" → Device Detail Screen (COMPLETED) (Dismiss)
│       └── "İptal" → Device Detail Screen (DELIVERED) (Dismiss)
│
├── Support & Info (Modal/Sheet)
│   ├── FAQ Screen
│   ├── Contact Screen
│   ├── About Screen
│   └── Help & Support Screen
│       └── Profile Screen'den veya Settings'den erişilir
│
├── Settings Screen (Navigation Stack)
│   ├── "Kullanım Şartları" → Terms & Conditions Screen (Modal)
│   ├── "Gizlilik Politikası" → Privacy Policy Screen (Modal)
│   └── "Geri" → Profile Screen (Pop)
│
└── Utility Screens
    ├── Image Preview Screen (Modal - Full Screen)
    ├── Delete Device Confirmation (Alert)
    ├── Error Screen (Modal/Alert)
    ├── Loading Screen (Overlay)
    └── Empty State Screens (Inline - Dashboard, Device List, Notifications içinde)
```

### Navigasyon Tipleri

**1. Tab Bar Navigation (Ana Navigasyon)**
- Dashboard (Home)
- Cihazlarım (Devices)
- Bildirimler (Notifications)
- Profil (Profile)

**2. Navigation Stack (Push/Pop)**
- Device Detail Screen → Device List'ten veya Dashboard'dan
- Add Lost Device Form → Add Device Screen'den
- Add Found Device Form → Add Device Screen'den
- Edit Profile Screen → Profile Screen'den
- Bank Account Screen → Profile Screen'den
- Payment Summary Screen → Match Payment Screen'den
- Payment Method Selection → Payment Summary Screen'den
- 3D Secure Payment Screen → Payment Method Selection'den
- Payment Processing Screen → 3D Secure Payment Screen'den

**3. Modal Presentation (Sheet/Full Screen)**
- Add Device Screen → Dashboard veya Device List'ten
- Match Payment Screen → Device Detail Screen'den
- Payment Success Screen → Payment Processing Screen'den
- Delivery Confirmation Screen → Device Detail Screen'den
- Image Preview Screen → Device Detail Screen'den
- Terms & Conditions Screen → Profile veya Settings'den
- Privacy Policy Screen → Profile veya Settings'den
- FAQ Screen → Support menüsünden
- Contact Screen → Support menüsünden
- About Screen → Support menüsünden
- Help & Support Screen → Support menüsünden

**4. Alert/Dialog**
- Delete Device Confirmation
- Error Messages
- Success Messages

**5. Overlay**
- Loading Screen (tüm ekranların üzerinde)
- Toast Messages

---

## 📋 Detaylı Ekran Listesi

### Toplam: 38-42 Ekran

**Not:** Cargo Management ekranı **GEREKSİZDİR**. Kargo bilgileri Device Detail Screen içinde gösterilir.

---

## 🔐 1. Authentication (Kimlik Doğrulama) - 5 Ekran

### 1.1 Splash/Launch Screen
- **Ekran Tipi:** Root Screen (Full Screen)
- **Amaç:** Uygulama açılış ekranı, kullanıcı oturum kontrolü
- **İçerik:**
  - Logo (iFoundAnApple)
  - Loading indicator (spinner)
  - Arka plan (gradient veya solid color)
- **Süre:** 2-3 saniye
- **Mantık:**
  - Supabase'den kullanıcı oturumu kontrol edilir
  - Oturum varsa → Tab Bar Controller (Dashboard)
  - Oturum yoksa → Onboarding Screen
- **Navigasyon:** Otomatik (timer sonrası)
- **Özellikler:**
  - Network kontrolü (opsiyonel)
  - Version check (opsiyonel)

### 1.2 Onboarding/Welcome Screen
- **Ekran Tipi:** Full Screen (Modal)
- **Amaç:** İlk kullanım tanıtımı
- **İçerik:**
  - Uygulama logosu
  - Başlık: "iFoundAnApple'a Hoş Geldiniz"
  - Alt başlık: "Kayıp Apple cihazlarınızı bulun"
  - Nasıl çalışır bölümü (3-4 adım, görsel + açıklama):
    1. Cihazınızı kaydedin (kayıp veya bulunan)
    2. Sistem eşleşme bulur
    3. Güvenli ödeme yapın
    4. Cihazınıza kavuşun
  - "Başla" butonu (büyük, primary color)
  - "Zaten hesabınız var mı? Giriş Yap" linki (alt kısım)
- **Navigasyon:**
  - "Başla" → Register Screen
  - "Giriş Yap" → Login Screen
- **Özellikler:**
  - Sadece ilk açılışta gösterilir (UserDefaults ile kontrol)
  - Swipe gesture ile geçiş (opsiyonel)

### 1.3 Login Screen
- **Ekran Tipi:** Full Screen (Modal)
- **Amaç:** Mevcut kullanıcı girişi
- **İçerik:**
  - Başlık: "Giriş Yap"
  - Email input field
    - Placeholder: "E-posta adresiniz"
    - Keyboard type: EmailAddress
    - Auto-capitalization: None
    - Validation: Email format kontrolü
  - Password input field
    - Placeholder: "Şifreniz"
    - Secure text entry: true
    - Show/Hide password toggle (göz ikonu)
    - Validation: Minimum 6 karakter
  - "Giriş Yap" butonu (primary, büyük)
    - Disabled state: Email ve şifre geçerli değilse
  - "Şifremi Unuttum" linki (alt kısım, küçük)
  - Divider: "veya"
  - "Google ile Giriş" butonu
    - Google logo + "Google ile Giriş Yap"
  - "Apple ile Giriş" butonu (Sign in with Apple)
    - Apple logo + "Apple ile Giriş Yap"
  - "Hesabınız yok mu? Kayıt Ol" linki (alt kısım)
- **Validasyon:**
  - Email format kontrolü (real-time)
  - Şifre minimum 6 karakter
  - Buton disabled/enabled durumu
- **Navigasyon:**
  - "Giriş Yap" → Tab Bar Controller (Dashboard) - başarılı giriş
  - "Şifremi Unuttum" → Reset Password Screen
  - "Google ile Giriş" → OAuth Flow → Tab Bar Controller
  - "Apple ile Giriş" → Sign in with Apple → Tab Bar Controller
  - "Kayıt Ol" → Register Screen
- **Error Handling:**
  - Geçersiz email/şifre → Alert göster
  - Network hatası → Alert göster
  - Loading state → Buton disabled, spinner göster

### 1.4 Register Screen
- **Ekran Tipi:** Full Screen (Modal)
- **Amaç:** Yeni kullanıcı kaydı
- **İçerik:**
  - Başlık: "Kayıt Ol"
  - Ad (firstName) input field - zorunlu
    - Placeholder: "Adınız"
    - Auto-capitalization: Words
  - Soyad (lastName) input field - zorunlu
    - Placeholder: "Soyadınız"
    - Auto-capitalization: Words
  - Email input field - zorunlu
    - Placeholder: "E-posta adresiniz"
    - Keyboard type: EmailAddress
  - Şifre input field - zorunlu
    - Placeholder: "Şifreniz (min. 6 karakter)"
    - Secure text entry: true
    - Show/Hide password toggle
  - Şifre Tekrar input field - zorunlu
    - Placeholder: "Şifrenizi tekrar girin"
    - Secure text entry: true
    - Validation: Şifre eşleşmesi kontrolü
  - Checkbox: "Kullanım Şartları'nı kabul ediyorum" - zorunlu
    - Tıklanabilir link: "Kullanım Şartları" → Terms & Conditions Screen
  - Checkbox: "Gizlilik Politikası'nı kabul ediyorum" - zorunlu
    - Tıklanabilir link: "Gizlilik Politikası" → Privacy Policy Screen
  - "Kayıt Ol" butonu (primary, büyük)
    - Disabled state: Tüm alanlar geçerli değilse
  - Divider: "veya"
  - "Google ile Kayıt Ol" butonu
  - "Apple ile Kayıt Ol" butonu
  - "Zaten hesabınız var mı? Giriş Yap" linki (alt kısım)
- **Validasyon:**
  - Tüm alanlar zorunlu
  - Email format kontrolü
  - Şifre minimum 6 karakter
  - Şifre eşleşmesi kontrolü
  - Checkbox'lar işaretli olmalı
- **Navigasyon:**
  - "Kayıt Ol" → Tab Bar Controller (Dashboard) - başarılı kayıt
  - "Google ile Kayıt" → OAuth Flow → Tab Bar Controller
  - "Apple ile Kayıt" → Sign in with Apple → Tab Bar Controller
  - "Giriş Yap" → Login Screen
- **Error Handling:**
  - Email zaten kullanılıyor → Alert
  - Geçersiz email format → Inline error
  - Şifre eşleşmiyor → Inline error
  - Network hatası → Alert

### 1.5 Reset Password Screen
- **Ekran Tipi:** Full Screen (Modal)
- **Amaç:** Şifre sıfırlama
- **İçerik:**
  - Başlık: "Şifremi Unuttum"
  - Açıklama: "E-posta adresinize şifre sıfırlama linki göndereceğiz."
  - Email input field
    - Placeholder: "E-posta adresiniz"
    - Keyboard type: EmailAddress
  - "Şifre Sıfırlama Linki Gönder" butonu (primary)
  - "Geri" butonu (sol üst, navigation bar)
- **Validasyon:**
  - Email format kontrolü
- **Navigasyon:**
  - "Şifre Sıfırlama Linki Gönder" → Email Sent Confirmation (Alert veya yeni ekran)
  - "Geri" → Login Screen
- **Success State:**
  - Email gönderildi mesajı
  - "Giriş ekranına dön" butonu

---

## 📱 2. Ana Navigasyon - 3 Ekran

### 2.1 Tab Bar Controller
- **Ekran Tipi:** Container (Root Navigation)
- **Amaç:** Ana navigasyon yapısı
- **Tab'lar:**
  1. **Dashboard** (Home)
     - Icon: SF Symbol `house.fill`
     - Title: "Ana Sayfa"
     - Badge: Yok
  2. **Cihazlarım** (Devices)
     - Icon: SF Symbol `iphone`
     - Title: "Cihazlarım"
     - Badge: Yok
  3. **Bildirimler** (Notifications)
     - Icon: SF Symbol `bell.fill`
     - Title: "Bildirimler"
     - Badge: Okunmamış bildirim sayısı (kırmızı badge)
  4. **Profil** (Profile)
     - Icon: SF Symbol `person.fill`
     - Title: "Profil"
     - Badge: Yok
- **Tasarım:**
  - Native iOS Tab Bar
  - SF Symbols kullanılmalı
  - Active tab vurgusu
  - Badge renkleri (kırmızı)
- **Özellikler:**
  - Tab değişiminde state korunur
  - Deep linking desteği

### 2.2 Home/Dashboard Screen
- **Ekran Tipi:** Tab Content (Navigation Stack Root)
- **Amaç:** Ana dashboard, cihaz listesi ve istatistikler
- **İçerik:**
  - Navigation Bar:
    - Title: "Ana Sayfa"
    - Right button: Yok (veya Settings icon - opsiyonel)
  - Scroll View (Vertical)
  - Hoş geldin kartı:
    - "Hoş geldin, [Kullanıcı Adı]!" mesajı
    - Kullanıcı avatarı (opsiyonel)
  - İstatistik kartları (opsiyonel, grid layout):
    - Toplam cihaz sayısı (büyük sayı, icon)
    - Eşleşen cihazlar (sarı/turuncu vurgu)
    - Bekleyen ödemeler (mavi vurgu)
    - Tamamlanan işlemler (yeşil vurgu)
  - "Eşleşen Cihazlar" bölümü (varsa):
    - Başlık: "Eşleşme Bulundu! 🎉"
    - Özel vurgu (farklı renk, border)
    - Cihaz kartları (DeviceCard component)
    - Her kartta "Ödemeyi Yap" butonu (primary, küçük)
  - "Tüm Cihazlarım" bölümü:
    - Başlık: "Tüm Cihazlarım"
    - Cihaz kartları listesi (DeviceCard component)
    - Durum badge'leri (renkli)
    - Pull-to-refresh desteği
  - Floating Action Button: "+" (sağ alt köşe)
    - Tıklama → Add Device Screen (Modal)
- **Real-time:**
  - Supabase subscription ile anlık güncellemeler
  - Yeni eşleşme → Bildirim + ekran güncelleme
  - Status değişikliği → Kart güncelleme
- **Navigasyon:**
  - Cihaz kartına tıklama → Device Detail Screen (Push)
  - "Ödemeyi Yap" butonu → Match Payment Screen (Modal)
  - "+" Floating Button → Add Device Screen (Modal)
- **Empty State:**
  - Cihaz yoksa: "Henüz cihaz eklemediniz" mesajı + "Cihaz Ekle" butonu
- **Loading State:**
  - İlk yüklemede skeleton loader veya spinner

### 2.3 Notifications Screen
- **Ekran Tipi:** Tab Content (Navigation Stack Root)
- **Amaç:** Bildirimler listesi
- **İçerik:**
  - Navigation Bar:
    - Title: "Bildirimler"
    - Right button: "Tümünü Okundu İşaretle" (opsiyonel)
  - Scroll View (Vertical)
  - Okunmamış bildirimler bölümü (üstte):
    - Başlık: "Yeni Bildirimler"
    - Farklı stil (bold, farklı arka plan rengi)
    - Bildirim kartları (NotificationCard component)
  - Okunmuş bildirimler bölümü (altta):
    - Başlık: "Önceki Bildirimler"
    - Daha soluk stil
    - Bildirim kartları
  - Her bildirim kartı:
    - İkon (duruma göre: eşleşme, ödeme, kargo, vb.)
    - Mesaj (bold, büyük font)
    - Tarih (küçük, gri)
    - Okundu/okunmadı göstergesi (nokta veya badge)
    - Swipe action: "Okundu İşaretle" (sağdan sola)
- **Real-time:**
  - Supabase subscription ile yeni bildirimler anlık gelir
  - Yeni bildirim → Tab badge güncelleme + liste güncelleme
- **Navigasyon:**
  - Bildirime tıklama → İlgili ekrana yönlendirme (Push)
    - Device ile ilgiliyse → Device Detail Screen
    - Payment ile ilgiliyse → Payment Success Screen veya Device Detail Screen
    - Kargo ile ilgiliyse → Device Detail Screen
- **Empty State:**
  - Bildirim yoksa: "Henüz bildiriminiz yok" mesajı
- **Pull-to-Refresh:**
  - Liste yenileme desteği

---

## 📱 3. Cihaz Yönetimi - 8 Ekran

### 3.1 Device List Screen
- **Ekran Tipi:** Tab Content (Navigation Stack Root)
- **Amaç:** Tüm cihazların listesi
- **İçerik:**
  - Navigation Bar:
    - Title: "Cihazlarım"
    - Right button: "+" (Add Device) veya Filter icon
  - Filtreler bölümü (üstte, sticky):
    - Durum filtresi (Segmented Control veya Picker):
      - Tümü
      - Kayıp (LOST)
      - Bulunan (REPORTED)
      - Eşleşen (MATCHED)
      - Ödeme Bekliyor (PAYMENT_PENDING)
      - Kargo Yolda (CARGO_SHIPPED)
      - Teslim Edildi (DELIVERED)
      - Tamamlandı (COMPLETED)
    - Rol filtresi (Segmented Control):
      - Tümü
      - Sahip (owner)
      - Bulan (finder)
    - Arama barı (SearchBar component):
      - Placeholder: "Model, seri no ile ara..."
      - Real-time arama
  - Cihaz listesi (LazyVStack veya List):
    - Cihaz kartları (DeviceCard component)
    - Her kart:
      - Cihaz modeli (bold, büyük)
      - Seri numarası (monospace font, küçük)
      - Durum badge (renkli, yuvarlak)
      - Son güncelleme tarihi (küçük, gri)
      - Swipe action: "Sil" (kırmızı, soldan sağa)
  - Pull-to-refresh desteği
- **Navigasyon:**
  - Cihaz kartına tıklama → Device Detail Screen (Push)
  - "+" Button → Add Device Screen (Modal)
- **Empty State:**
  - Filtre sonucu boşsa: "Bu kriterlere uygun cihaz bulunamadı"
  - Hiç cihaz yoksa: "Henüz cihaz eklemediniz" + "Cihaz Ekle" butonu
- **Loading State:**
  - Skeleton loader veya spinner

### 3.2 Add Device Screen (Cihaz Ekleme Seçimi)
- **Ekran Tipi:** Modal (Sheet veya Full Screen)
- **Amaç:** Cihaz ekleme tipi seçimi
- **İçerik:**
  - Navigation Bar:
    - Title: "Cihaz Ekle"
    - Left button: "İptal" (dismiss)
  - İki büyük buton (card style, yan yana veya alt alta):
    1. "Kayıp Cihaz Bildir" (Lost Device)
       - Icon: SF Symbol `exclamationmark.triangle.fill` (sarı)
       - Başlık: "Kayıp Cihaz Bildir"
       - Açıklama: "Cihazınızı kaybettiyseniz buraya tıklayın"
       - Arka plan: Açık mavi/turuncu gradient
    2. "Bulunan Cihaz Bildir" (Found Device)
       - Icon: SF Symbol `checkmark.circle.fill` (yeşil)
       - Başlık: "Bulunan Cihaz Bildir"
       - Açıklama: "Bir cihaz bulduysanız buraya tıklayın"
       - Arka plan: Açık yeşil gradient
- **Navigasyon:**
  - "Kayıp Cihaz Bildir" → Add Lost Device Form (Push)
  - "Bulunan Cihaz Bildir" → Add Found Device Form (Push)
  - "İptal" → Dismiss modal

### 3.3 Add Lost Device Form
- **Ekran Tipi:** Navigation Stack (Push)
- **Amaç:** Kayıp cihaz kaydı
- **İçerik:**
  - Navigation Bar:
    - Title: "Kayıp Cihaz Ekle"
    - Left button: "Geri"
    - Right button: "Kaydet" (disabled state)
  - Scroll View (Vertical)
  - Form alanları:
    - **Cihaz Modeli** (Picker/Dropdown) - zorunlu
      - Placeholder: "Cihaz modelini seçin"
      - Supabase'den `device_models` tablosundan çekilir
      - Arama özelliği (opsiyonel)
    - **Seri Numarası** (Text Input) - zorunlu
      - Placeholder: "Seri numarası"
      - Keyboard type: Default
      - Auto-capitalization: AllCharacters
      - Validation: Boş olamaz, minimum karakter kontrolü
    - **Renk** (Picker, model'e göre dinamik) - zorunlu
      - Placeholder: "Renk seçin"
      - Model seçildikten sonra o modele özel renkler gösterilir
    - **Kayıp Tarihi** (Date Picker) - zorunlu
      - Placeholder: "Kayıp tarihi"
      - Date picker modal veya inline
      - Maksimum tarih: Bugün
    - **Kayıp Yeri** (Text Input) - zorunlu
      - Placeholder: "Kayıp yeri (örn: İstanbul, Kadıköy)"
      - Keyboard type: Default
    - **Açıklama** (Text Area) - opsiyonel
      - Placeholder: "Ek açıklama (opsiyonel)"
      - Multi-line input
    - **Fatura/Fiş Yükleme** (Image Picker) - opsiyonel ama önerilir
      - "Fotoğraf Ekle" butonu
      - Seçilen fotoğraf önizlemesi
      - Birden fazla fotoğraf seçilebilir (max 5)
      - Supabase Storage'a yüklenir
  - "Kaydet" butonu (alt kısım, sticky)
    - Disabled state: Zorunlu alanlar dolu değilse
- **Validasyon:**
  - Zorunlu alanlar kontrolü (real-time)
  - Seri numarası format kontrolü (opsiyonel)
  - Fotoğraf boyut kontrolü (max 10MB per image)
- **Navigasyon:**
  - "Kaydet" → Device Detail Screen (LOST status) (Push)
  - "Geri" → Add Device Screen (Pop)
- **Error Handling:**
  - Network hatası → Alert
  - Fotoğraf yükleme hatası → Alert
  - Seri numarası zaten kayıtlı → Alert (opsiyonel)

### 3.4 Add Found Device Form
- **Ekran Tipi:** Navigation Stack (Push)
- **Amaç:** Bulunan cihaz kaydı
- **İçerik:**
  - Navigation Bar:
    - Title: "Bulunan Cihaz Ekle"
    - Left button: "Geri"
    - Right button: "Kaydet" (disabled state)
  - Scroll View (Vertical)
  - Form alanları:
    - **Cihaz Modeli** (Picker) - zorunlu
      - Placeholder: "Cihaz modelini seçin"
    - **Seri Numarası** (Text Input) - zorunlu
      - Placeholder: "Seri numarası"
    - **Renk** (Picker) - zorunlu
      - Placeholder: "Renk seçin"
    - **Bulunma Tarihi** (Date Picker) - zorunlu
      - Placeholder: "Bulunma tarihi"
      - Maksimum tarih: Bugün
    - **Bulunma Yeri** (Text Input) - zorunlu
      - Placeholder: "Bulunma yeri"
    - **Açıklama** (Text Area) - opsiyonel
      - Placeholder: "Ek açıklama"
    - **Cihaz Fotoğrafları** (Image Picker, çoklu seçim) - zorunlu
      - "Fotoğraf Ekle" butonu
      - Minimum 2 fotoğraf (ön ve arka)
      - Maksimum 5 fotoğraf
      - Fotoğraf önizlemeleri (grid layout)
      - Her fotoğraf için "Sil" butonu
      - Supabase Storage'a yüklenir
- **Validasyon:**
  - Zorunlu alanlar kontrolü
  - Minimum 2 fotoğraf kontrolü
  - Fotoğraf boyut kontrolü
- **Navigasyon:**
  - "Kaydet" → Device Detail Screen (REPORTED status) (Push)
  - "Geri" → Add Device Screen (Pop)
- **Error Handling:**
  - Fotoğraf yükleme hatası → Alert
  - Minimum fotoğraf kontrolü → Inline error

### 3.5 Device Detail Screen
- **Ekran Tipi:** Navigation Stack (Push)
- **Amaç:** Cihaz detay sayfası (duruma göre dinamik içerik)
- **KRİTİK:** UI rendering'de `device.status` yerine `device.device_role` kullanılmalı!
- **Navigation Bar:**
  - Title: Cihaz modeli (örn: "iPhone 17 Pro Max")
  - Left button: "Geri" (back arrow)
  - Right button: "Paylaş" (opsiyonel) veya "Sil" (sadece LOST/REPORTED status'unda)
- **İçerik:** Status ve device_role'e göre dinamik (yukarıdaki detaylı açıklamalara bakın)
- **Ortak Özellikler:**
  - Scroll View (Vertical)
  - Cihaz bilgileri kartı
  - İşlem durumu kartı
  - Durum Bilgisi (5 adımlı timeline)
  - Action butonları (status'e göre)
- **Navigasyon:**
  - Fotoğraf/Fatura tıklama → Image Preview Screen (Modal)
  - "Ödemeyi Güvenle Yap" → Match Payment Screen (Modal)
  - "Onay Butonu" → Delivery Confirmation Screen (Modal)
  - "Sorun Var, İtiraz Et" → Dispute Screen (Modal)
  - "KAYDI SİL" → Delete Device Confirmation (Alert)
  - "CİHAZLARIM LİSTESİNE GERİ DÖN" → Dashboard (Pop)
- **Real-time:**
  - Supabase subscription ile status değişikliklerini dinler
  - Status değiştiğinde ekran otomatik güncellenir

### 3.6 Image Preview Screen
- **Ekran Tipi:** Modal (Full Screen)
- **Amaç:** Fotoğraf/fatura tam ekran görüntüleme
- **İçerik:**
  - Full screen image view
  - Navigation Bar:
    - Title: "Fotoğraf" veya "Fatura"
    - Right button: "Kapat" (X icon)
  - Image viewer (ZoomableScrollView)
- **Özellikler:**
  - Zoom in/out (pinch gesture)
  - Double tap to zoom
  - Swipe ile diğer fotoğraflara geçiş (eğer birden fazla varsa)
  - Page indicator (eğer birden fazla fotoğraf varsa)
- **Navigasyon:**
  - "Kapat" → Dismiss modal
  - Swipe down → Dismiss modal (gesture)

### 3.7 Delete Device Confirmation
- **Ekran Tipi:** Alert (Dialog)
- **Amaç:** Cihaz silme onayı
- **İçerik:**
  - Title: "Cihazı Sil"
  - Message: "Bu cihazın kaydını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
  - Butonlar:
    - "İptal" (cancel, default style)
    - "Sil" (destructive, kırmızı)
- **Navigasyon:**
  - "İptal" → Alert dismiss
  - "Sil" → Device silinir → Device List veya Dashboard'a dön

---

## 💳 4. Ödeme İşlemleri - 7 Ekran

### 4.1 Match Payment Screen
- **Ekran Tipi:** Modal (Sheet veya Full Screen)
- **Amaç:** Eşleşme bulundu, ödeme ekranı
- **İçerik:**
  - Navigation Bar:
    - Title: "Eşleşme Ödemesi"
    - Left button: "İptal" (dismiss)
  - Scroll View (Vertical)
  - Sol Panel - Ücret Döküm Kartı (Mavi-Mor Gradient Arka Plan):
    - Başlık: "Ücret Detayları"
    - Cihaz Modeli (örn: iPhone 17 Pro Max)
    - Detaylı Fiyatlandırma Listesi:
      - ✓ Bulan Kişiye Ödül: ₺XXX (büyük, vurgulu)
      - ✓ Kargo Ücreti: ₺YYY
      - ✓ Hizmet bedeli: ₺ZZZ
      - ✓ Ödeme ağ geçidi ücreti: ₺WWW
      - ─────────────────────
      - **Toplam:** ₺TTTT (büyük, bold)
  - Sağ Panel - Güvenlik Bilgileri:
    - "Güvenli ödeme garantisi" başlığı
    - Güvenlik özellikleri listesi (kilit ikonları ile)
    - Escrow açıklaması
  - "Ödemeye Devam Et" butonu (büyük, primary, alt kısım sticky)
- **Navigasyon:**
  - "Ödemeye Devam Et" → Payment Summary Screen (Push)
  - "İptal" → Dismiss modal → Device Detail Screen
- **Validasyon:**
  - Ücret hesaplaması backend'den gelir
  - Device status kontrolü (MATCHED olmalı)

### 4.2 Payment Summary Screen
- **Ekran Tipi:** Navigation Stack (Push)
- **Amaç:** Ödeme özeti ve yöntem seçimi
- **İçerik:**
  - Navigation Bar:
    - Title: "Ödeme Özeti"
    - Left button: "Geri"
  - Scroll View (Vertical)
  - Özet kartı:
    - Cihaz bilgileri
    - Toplam tutar (büyük, vurgulu)
    - Ödeme yöntemi seçimi
  - "Ödeme Yöntemi Seç" butonu → Payment Method Selection
- **Navigasyon:**
  - "Ödeme Yöntemi Seç" → Payment Method Selection (Push)
  - "Geri" → Match Payment Screen (Pop)

### 4.3 Payment Method Selection
- **Ekran Tipi:** Navigation Stack (Push)
- **Amaç:** Ödeme yöntemi seçimi
- **İçerik:**
  - Navigation Bar:
    - Title: "Ödeme Yöntemi"
    - Left button: "Geri"
  - Ödeme yöntemleri listesi:
    - Kredi Kartı (varsayılan)
    - Diğer yöntemler (gelecekte eklenebilir)
  - "Devam Et" butonu
- **Navigasyon:**
  - "Kredi Kartı" seçimi → 3D Secure Payment Screen (Push)
  - "Geri" → Payment Summary Screen (Pop)

### 4.4 3D Secure Payment Screen
- **Ekran Tipi:** Navigation Stack (Push)
- **Amaç:** 3D Secure doğrulama
- **İçerik:**
  - Navigation Bar:
    - Title: "Güvenli Ödeme"
    - Left button: "İptal"
  - WKWebView (Full Screen):
    - Backend'den gelen `paymentUrl` yüklenir
    - 3D Secure formu gösterilir
    - JavaScript bridge ile callback dinlenir
  - Loading indicator (WebView yüklenirken)
- **Navigasyon:**
  - Başarılı → Payment Processing Screen (Push)
  - Hata → Error Screen (Push)
  - "İptal" → Match Payment Screen (Pop to root)
- **Deep Linking:**
  - 3D Secure callback URL'i handle edilir
  - `session_id` ve `token_id` alınır
  - Backend API'ye gönderilir

### 4.5 Payment Processing Screen
- **Ekran Tipi:** Navigation Stack (Push)
- **Amaç:** Ödeme işleme durumu
- **İçerik:**
  - Loading indicator (büyük spinner)
  - "Ödeme işleniyor..." mesajı
  - Arka planda:
    - Backend API'ye `POST /v1/payments/complete-3d` gönderilir
    - Supabase'den payment status real-time dinlenir
- **Navigasyon:**
  - İşlem tamamlanınca → Payment Success Screen (Push)
  - Hata → Error Screen (Push)
- **Timeout:**
  - 30 saniye sonra timeout → Error Screen

### 4.6 Payment Success Screen
- **Ekran Tipi:** Navigation Stack (Push)
- **Amaç:** Ödeme başarılı onay ekranı
- **İçerik:**
  - Başarı ikonu (yeşil checkmark, büyük)
  - "Ödeme Başarılı!" başlığı
  - "Ödemeniz başarıyla tamamlandı" mesajı
  - Ödeme detayları kartı:
    - Ödeme ID
    - Tutar
    - Tarih
  - "Tamam" butonu (büyük, primary)
- **Navigasyon:**
  - "Tamam" → Device Detail Screen (PAYMENT_COMPLETED) (Dismiss Modal, Navigate)
- **Real-time:**
  - Supabase'den payment status kontrol edilir
  - Device status güncellenir

### 4.7 Payment Callback Handler
- **Ekran Tipi:** Utility (Background)
- **Amaç:** Deep link callback'i handle etme
- **İşlev:**
  - Universal Link veya Custom URL Scheme handle edilir
  - `session_id` ve `token_id` parse edilir
  - Payment Processing Screen'e yönlendirilir
- **Navigasyon:**
  - Başarılı parse → Payment Processing Screen
  - Hata → Error Screen

---

## 📦 5. Kargo Takibi - 2-3 Ekran

### 5.1 Cargo Information in Device Detail Screen
- **Ekran Tipi:** Device Detail Screen içinde (ayrı ekran değil)
- **Amaç:** Kargo bilgileri gösterimi
- **Gösterim Yeri:** Device Detail Screen içinde, ilgili status'larda
- **İçerik:** Status'a göre dinamik (yukarıdaki detaylı açıklamalara bakın)

### 5.2 Cargo Tracking Screen (Harita - Opsiyonel)
- **Ekran Tipi:** Modal (Full Screen)
- **Amaç:** Kargo takip (harita görünümü)
- **İçerik:**
  - Navigation Bar:
    - Title: "Kargo Takibi"
    - Left button: "Kapat"
  - MapView (Apple Maps):
    - Kargo konumu güncellemeleri (eğer kargo firması API'si sağlıyorsa)
    - Marker'lar (başlangıç, hedef, mevcut konum)
  - Timeline görünümü (altta, sheet):
    - Kargo durum geçmişi
    - Her adım için tarih ve saat
- **Navigasyon:**
  - Device Detail Screen'den "Haritada Görüntüle" butonu → Bu ekran
  - "Kapat" → Dismiss modal
- **Not:** Bu ekran opsiyoneldir. Kargo firması API'si real-time tracking sağlamıyorsa, sadece takip numarası gösterilir.

### 5.3 Delivery Confirmation Screen
- **Ekran Tipi:** Modal (Sheet)
- **Amaç:** Teslim onayı
- **İçerik:**
  - Navigation Bar:
    - Title: "Teslim Onayı"
    - Left button: "İptal"
  - Scroll View (Vertical)
  - Uyarı mesajı:
    - "Lütfen cihazın seri numarasını kontrol edin"
    - Seri numarası (büyük, monospace font, vurgulu)
  - Onay checkbox'ları:
    - [ ] Cihazın seri numarası doğru
    - [ ] Cihaz çalışıyor
    - [ ] Cihaz hasar görmemiş
  - "Teslim Aldım, Onayla" butonu (büyük, yeşil)
    - Disabled state: Tüm checkbox'lar işaretli değilse
- **Validasyon:**
  - Tüm checkbox'lar işaretli olmalı
- **Navigasyon:**
  - "Onayla" → Device Detail Screen (COMPLETED) (Dismiss)
  - "İptal" → Device Detail Screen (DELIVERED) (Dismiss)
- **Backend:**
  - `POST /v1/payments/release-escrow` (eğer varsa)
  - Supabase'de device status güncellenir

---

## 👤 6. Profil ve Ayarlar - 6 Ekran

### 6.1 Profile Screen
- **Ekran Tipi:** Tab Content (Navigation Stack Root)
- **Amaç:** Kullanıcı profili görüntüleme ve yönetimi
- **İçerik:**
  - Navigation Bar:
    - Title: "Profil"
    - Right button: "Düzenle"
  - Scroll View (Vertical)
  - Profil başlığı:
    - Avatar (kullanıcı adının baş harfleri, yuvarlak)
    - Kullanıcı adı (bold, büyük)
    - Email (küçük, gri)
  - Kişisel Bilgiler kartı:
    - Ad Soyad
    - Doğum Tarihi
    - Telefon Numarası
    - Adres
    - TC Kimlik No (maskelenmiş: XXX XX XXX XX)
  - Banka Hesabı kartı:
    - IBAN (maskelenmiş: TRXX XXXX XXXX XXXX XXXX XXXX XX)
    - "Düzenle" butonu
  - Ayarlar listesi:
    - "Ayarlar" → Settings Screen
    - "Kullanım Şartları" → Terms & Conditions Screen
    - "Gizlilik Politikası" → Privacy Policy Screen
    - "Yardım ve Destek" → Help & Support Screen
  - "Çıkış Yap" butonu (kırmızı, destructive, alt kısım)
- **Navigasyon:**
  - "Düzenle" → Edit Profile Screen (Push)
  - "Banka Hesabı Düzenle" → Bank Account Screen (Push)
  - "Ayarlar" → Settings Screen (Push)
  - "Çıkış Yap" → Login Screen (Root'a dön, tüm stack temizlenir)
- **Real-time:**
  - Profil bilgileri Supabase'den çekilir
  - Güncellemeler anlık yansır

### 6.2 Edit Profile Screen
- **Ekran Tipi:** Navigation Stack (Push)
- **Amaç:** Profil bilgilerini düzenleme
- **İçerik:**
  - Navigation Bar:
    - Title: "Profili Düzenle"
    - Left button: "İptal"
    - Right button: "Kaydet" (disabled state)
  - Scroll View (Vertical)
  - Form alanları:
    - Ad (firstName) - zorunlu
    - Soyad (lastName) - zorunlu
    - Doğum Tarihi (Date Picker) - opsiyonel
    - Telefon Numarası (Text Input) - opsiyonel
      - Format: +90 XXX XXX XX XX
    - Adres (Text Area) - opsiyonel
    - TC Kimlik No (Text Input) - opsiyonel (finder için zorunlu olabilir)
      - Format: XXX XX XXX XX
      - Maskelenmiş input
  - "Kaydet" butonu (alt kısım, sticky)
- **Validasyon:**
  - Ad ve Soyad zorunlu
  - TC Kimlik No format kontrolü (11 karakter)
  - Telefon format kontrolü
- **Navigasyon:**
  - "Kaydet" → Profile Screen (Pop, güncellenmiş bilgilerle)
  - "İptal" → Profile Screen (Pop, değişiklikler kaydedilmez)
- **Backend:**
  - Supabase `userprofile` tablosuna güncelleme
  - Şifreleme: TC Kimlik, Telefon, Adres şifrelenir

### 6.3 Bank Account Screen
- **Ekran Tipi:** Navigation Stack (Push)
- **Amaç:** Banka hesabı bilgilerini düzenleme
- **İçerik:**
  - Navigation Bar:
    - Title: "Banka Hesabı"
    - Left button: "Geri"
    - Right button: "Kaydet" (disabled state)
  - Scroll View (Vertical)
  - Uyarı mesajı:
    - "Ödül alabilmek için IBAN bilgilerinizi girin"
  - Form alanları:
    - IBAN (Text Input) - zorunlu (finder için)
      - Placeholder: "TRXX XXXX XXXX XXXX XXXX XXXX XX"
      - Format: TR + 26 karakter
      - Maskelenmiş input
      - Validation: IBAN format kontrolü
  - "Kaydet" butonu (alt kısım, sticky)
- **Validasyon:**
  - IBAN format kontrolü (TR + 26 karakter)
  - IBAN checksum kontrolü (opsiyonel)
- **Navigasyon:**
  - "Kaydet" → Profile Screen (Pop)
  - "Geri" → Profile Screen (Pop)
- **Backend:**
  - Supabase `userprofile` tablosuna güncelleme
  - Şifreleme: IBAN şifrelenir

### 6.4 Settings Screen
- **Ekran Tipi:** Navigation Stack (Push)
- **Amaç:** Uygulama ayarları
- **İçerik:**
  - Navigation Bar:
    - Title: "Ayarlar"
    - Left button: "Geri"
  - Settings listesi:
    - Bildirim Ayarları (Toggle):
      - Push bildirimleri (açık/kapalı)
      - Email bildirimleri (açık/kapalı)
    - Dil Seçimi (Picker):
      - Türkçe (varsayılan)
      - İngilizce (gelecekte)
    - Tema (Picker):
      - Sistem
      - Açık
      - Koyu
    - Hakkında:
      - Uygulama versiyonu
      - "Kullanım Şartları" → Terms & Conditions Screen
      - "Gizlilik Politikası" → Privacy Policy Screen
    - Yardım:
      - "SSS" → FAQ Screen
      - "İletişim" → Contact Screen
      - "Hakkında" → About Screen
- **Navigasyon:**
  - Her ayar kendi ekranına yönlendirir (Modal veya Push)
  - "Geri" → Profile Screen (Pop)

### 6.5 Terms & Conditions Screen
- **Ekran Tipi:** Modal (Sheet veya Full Screen)
- **Amaç:** Kullanım şartları görüntüleme
- **İçerik:**
  - Navigation Bar:
    - Title: "Kullanım Şartları"
    - Right button: "Kapat"
  - Scroll View (Vertical)
  - Terms & Conditions içeriği (HTML veya Markdown)
  - "Kabul Ediyorum" butonu (alt kısım, sticky)
- **Navigasyon:**
  - "Kapat" → Dismiss modal
  - "Kabul Ediyorum" → Dismiss modal (Register Screen'de kullanılır)

### 6.6 Privacy Policy Screen
- **Ekran Tipi:** Modal (Sheet veya Full Screen)
- **Amaç:** Gizlilik politikası görüntüleme
- **İçerik:**
  - Navigation Bar:
    - Title: "Gizlilik Politikası"
    - Right button: "Kapat"
  - Scroll View (Vertical)
  - Privacy Policy içeriği (HTML veya Markdown)
  - "Kabul Ediyorum" butonu (alt kısım, sticky)
- **Navigasyon:**
  - "Kapat" → Dismiss modal
  - "Kabul Ediyorum" → Dismiss modal (Register Screen'de kullanılır)

---

## 📚 7. Bilgi ve Destek - 4 Ekran

### 7.1 FAQ Screen
- **Ekran Tipi:** Modal (Sheet veya Full Screen)
- **Amaç:** Sık sorulan sorular
- **İçerik:**
  - Navigation Bar:
    - Title: "Sık Sorulan Sorular"
    - Right button: "Kapat"
  - Scroll View (Vertical)
  - FAQ listesi (Accordion style):
    - Her soru tıklanabilir
    - Tıklanınca cevap açılır/kapanır
    - Kategoriler (opsiyonel):
      - Genel Sorular
      - Ödeme Soruları
      - Kargo Soruları
      - Teknik Sorular
- **Navigasyon:**
  - "Kapat" → Dismiss modal

### 7.2 Contact Screen
- **Ekran Tipi:** Modal (Sheet veya Full Screen)
- **Amaç:** İletişim formu
- **İçerik:**
  - Navigation Bar:
    - Title: "İletişim"
    - Right button: "Kapat"
  - Scroll View (Vertical)
  - İletişim formu:
    - Ad Soyad (Text Input)
    - Email (Text Input)
    - Konu (Picker veya Text Input)
    - Mesaj (Text Area)
    - "Gönder" butonu
  - İletişim bilgileri:
    - Email: support@ifoundanapple.com
    - Telefon: +90 XXX XXX XX XX
- **Navigasyon:**
  - "Gönder" → Success message (Alert)
  - "Kapat" → Dismiss modal

### 7.3 About Screen
- **Ekran Tipi:** Modal (Sheet veya Full Screen)
- **Amaç:** Uygulama hakkında bilgi
- **İçerik:**
  - Navigation Bar:
    - Title: "Hakkında"
    - Right button: "Kapat"
  - Scroll View (Vertical)
  - Uygulama bilgileri:
    - Logo
    - Uygulama adı: "iFoundAnApple"
    - Versiyon: "1.0.0"
    - Açıklama
    - Telif hakkı bilgisi
    - Sosyal medya linkleri (opsiyonel)
- **Navigasyon:**
  - "Kapat" → Dismiss modal

### 7.4 Help & Support Screen
- **Ekran Tipi:** Modal (Sheet veya Full Screen)
- **Amaç:** Yardım ve destek menüsü
- **İçerik:**
  - Navigation Bar:
    - Title: "Yardım ve Destek"
    - Right button: "Kapat"
  - Yardım seçenekleri listesi:
    - "Sık Sorulan Sorular" → FAQ Screen
    - "İletişim" → Contact Screen
    - "Hakkında" → About Screen
    - "Kullanım Kılavuzu" (opsiyonel)
- **Navigasyon:**
  - Her seçenek ilgili ekrana yönlendirir
  - "Kapat" → Dismiss modal

---

## 🔧 8. Admin Ekranları (Opsiyonel) - 2 Ekran

### 8.1 Admin Dashboard
- **Ekran Tipi:** Tab Content (sadece admin kullanıcılar için)
- **Amaç:** Admin paneli
- **Erişim:** Sadece `user.role = 'admin'` olan kullanıcılar
- **İçerik:**
  - İstatistikler
  - Cihaz yönetimi
  - Kullanıcı yönetimi
  - Ödeme yönetimi
- **Not:** Normal kullanıcılar bu ekranı görmez

### 8.2 Admin Security Dashboard
- **Ekran Tipi:** Navigation Stack (Push)
- **Amaç:** Güvenlik yönetimi
- **İçerik:**
  - Güvenlik logları
  - Şüpheli aktiviteler
  - Kullanıcı bloklama
- **Not:** Sadece admin kullanıcılar için

---

## ⚠️ 9. Utility Screens - 3-7 Ekran

### 9.1 Error Screen
- **Ekran Tipi:** Modal (Full Screen) veya Alert
- **Amaç:** Hata mesajı gösterimi
- **İçerik:**
  - Hata ikonu (kırmızı X)
  - Hata başlığı
  - Hata mesajı
  - "Tamam" butonu
  - "Tekrar Dene" butonu (opsiyonel)
- **Kullanım:**
  - Network hataları
  - API hataları
  - Validation hataları

### 9.2 Loading Screen
- **Ekran Tipi:** Overlay (tüm ekranların üzerinde)
- **Amaç:** Yükleme göstergesi
- **İçerik:**
  - Spinner (büyük)
  - "Yükleniyor..." mesajı (opsiyonel)
- **Kullanım:**
  - API çağrıları sırasında
  - Sayfa yüklenirken
  - İşlem yapılırken

### 9.3 Empty State Screens
- **Ekran Tipi:** Inline (Dashboard, Device List, Notifications içinde)
- **Amaç:** Boş durum gösterimi
- **İçerik:**
  - İkon (büyük, gri)
  - Başlık: "Henüz [içerik] yok"
  - Açıklama mesajı
  - Action butonu (opsiyonel)
- **Kullanım:**
  - Cihaz yoksa: "Henüz cihaz eklemediniz" + "Cihaz Ekle" butonu
  - Bildirim yoksa: "Henüz bildiriminiz yok"
  - Arama sonucu boşsa: "Bu kriterlere uygun sonuç bulunamadı"

---

## 📋 Ekran Listesi Özeti (Hızlı Referans)

### Toplam: 38-42 Ekran

**Not:** Cargo Management ekranı **GEREKSİZDİR**. Kargo bilgileri Device Detail Screen içinde gösterilir.

---

**Son Güncelleme**: 2025-01-15
**Versiyon**: 2.0.0
**Hazırlayan**: AI Assistant (Cursor)
**Güncelleme Notları**: 
- ✅ Tüm device status'ları eklendi (LOST, REPORTED, MATCHED, PAYMENT_PENDING, PAYMENT_COMPLETED, CARGO_SHIPPED, DELIVERED, CONFIRMED, COMPLETED, DISPUTED, CANCELLED, RETURNED, FAILED_DELIVERY)
- ✅ **KRİTİK DÜZELTME:** PAYMENT_COMPLETE → PAYMENT_COMPLETED (database'deki gerçek değer)
- ✅ Cargo status enum'ları eklendi
- ✅ Device Detail Screen için tüm status'lar detaylandırıldı
- ✅ Ücret hesaplama formülü eklendi
- ✅ Bildirim matrisi eklendi
- ✅ Profil zorunlulukları detaylandırıldı
- ✅ Escrow release koşulları eklendi
- ✅ Kargo teslim kodu sistemi açıklandı
- ✅ Şifreleme bilgileri güncellendi
- ✅ Backend API endpoint'leri detaylandırıldı
- ✅ Cargo Management ekranı kaldırıldı (kargo bilgileri Device Detail Screen içinde)
- ✅ **KRİTİK UYARILAR bölümü eklendi** (tutarsızlıklar ve çözümleri)
- ✅ **Proje yapısı ve dosya organizasyonu** detaylandırıldı
- ✅ **Xcode proje konfigürasyonu** eklendi (Build Settings, Info.plist, Capabilities)
- ✅ **Swift Package dependencies** listelendi (Supabase, Alamofire, KeychainAccess, Kingfisher)
- ✅ **Environment variables yönetimi** eklendi (Configuration.swift)
- ✅ **Asset Catalog konfigürasyonu** eklendi (renkler, app icon)
- ✅ **Localization desteği** eklendi (Türkçe, İngilizce)
- ✅ **Dark mode desteği** detaylandırıldı
- ✅ **Accessibility detayları** eklendi (VoiceOver, Dynamic Type)
- ✅ **Logging ve debugging stratejisi** eklendi
- ✅ **Test stratejisi** detaylandırıldı (Unit, UI, Integration, Snapshot)
- ✅ **Deployment süreci** detaylandırıldı (Development, TestFlight, App Store)
- ✅ **Git yapısı ve .gitignore** eklendi
- ✅ **Ekran hiyerarşisi** eklendi (navigasyon yapısı)
- ✅ **Detaylı ekran listesi** eklendi (her ekran için tam detaylar)

**Hata Yapma Olasılığı Değerlendirmesi:**
- **Yüksek Risk Alanları:**
  1. ⚠️ **Device Status Enum tutarsızlığı** (PAYMENT_COMPLETE vs PAYMENT_COMPLETED) → YÜKSEK RİSK
  2. ⚠️ **Device Role vs Status karışıklığı** → YÜKSEK RİSK
  3. ⚠️ **Cargo status iki sütun sorunu** → ORTA RİSK
  4. ⚠️ **Backend API endpoint belirsizliği** → ORTA RİSK

- **Düşük Risk Alanları:**
  - ✅ Ekran listesi ve içerikleri → NET
  - ✅ İş akışları → NET
  - ✅ Tasarım prensipleri → NET
  - ✅ Teknik gereksinimler → NET

**Öneri:** iOS geliştirme başlamadan önce:
1. ✅ Supabase'de gerçek status değerlerini kontrol edin (SQL query ile) - **YAPILDI**
2. Backend API endpoint'lerini test edin
3. ✅ Device role ayrımını test edin - **YAPILDI (constraint doğru: sadece 'owner' veya 'finder')**
4. ✅ Cargo status sütunlarını kontrol edin - **YAPILDI (tablo yapısı doğru)**

**Test Sonuçları Özeti:**
- ✅ Device role dağılımı: 6 owner, 2 finder (1 NULL - düzeltilmeli)
- ✅ Mevcut status'lar: `lost`, `matched`, `payment_pending`, `reported`
- ✅ Cargo shipments tablosu yapısı doğru (hem `status` hem `cargo_status` var)
- ⚠️ **Aksiyon Gerekli:** NULL device_role düzeltilmeli (script yukarıda)

---

## 🧪 iOS GELİŞTİRME ÖNCESİ TEST REHBERİ

Bu bölüm, iOS geliştirmeye başlamadan önce Supabase'de yapılması gereken testleri içerir.

### 1. Device Role Ayrımını Test Etme

**Amaç:** `device_role` sütununun doğru çalıştığını ve iOS uygulamasında doğru ekranların gösterileceğini doğrulamak.

#### Adım 1: Mevcut Device Role Değerlerini Kontrol Et

Supabase SQL Editor'de çalıştırın:

```sql
-- Tüm device'ların device_role değerlerini listele
SELECT 
    id,
    "userId",
    status,
    device_role,
    model,
    "serialNumber",
    created_at
FROM devices
ORDER BY created_at DESC
LIMIT 20;
```

**Beklenen Sonuç:**
- Her device'ın `device_role` değeri olmalı: `'owner'` veya `'finder'`
- `NULL` değer olmamalı

#### Adım 2: Owner ve Finder Ayrımını Kontrol Et

```sql
-- Owner kayıtlarını listele
SELECT 
    id,
    status,
    device_role,
    "userId",
    model,
    "serialNumber"
FROM devices
WHERE device_role = 'owner'
ORDER BY created_at DESC
LIMIT 10;

-- Finder kayıtlarını listele
SELECT 
    id,
    status,
    device_role,
    "userId",
    model,
    "serialNumber"
FROM devices
WHERE device_role = 'finder'
ORDER BY created_at DESC
LIMIT 10;
```

**Beklenen Sonuç:**
- Owner kayıtları: `device_role = 'owner'` olmalı
- Finder kayıtları: `device_role = 'finder'` olmalı

#### Adım 3: Aynı Seri Numaralı Cihazların Role Ayrımını Kontrol Et

```sql
-- Aynı seri numaralı cihazların device_role'lerini kontrol et
SELECT 
    "serialNumber",
    device_role,
    status,
    "userId",
    id
FROM devices
WHERE "serialNumber" IN (
    SELECT "serialNumber"
    FROM devices
    GROUP BY "serialNumber"
    HAVING COUNT(*) > 1
)
ORDER BY "serialNumber", device_role;
```

**Beklenen Sonuç:**
- Aynı seri numaralı her iki cihaz için:
  - Biri `device_role = 'owner'` olmalı
  - Diğeri `device_role = 'finder'` olmalı

#### Adım 4: Device Role ve Status Kombinasyonunu Test Et

```sql
-- Her status için device_role dağılımını kontrol et
SELECT 
    status,
    device_role,
    COUNT(*) as count
FROM devices
GROUP BY status, device_role
ORDER BY status, device_role;
```

**Beklenen Sonuç:**
- Her status için hem `owner` hem `finder` kayıtları olabilir
- Örnek: `matched` status'unda hem owner hem finder kayıtları olmalı

#### Adım 5: NULL Device Role Kontrolü

```sql
-- device_role NULL olan kayıtları bul
SELECT 
    id,
    status,
    device_role,
    "userId",
    model,
    "serialNumber"
FROM devices
WHERE device_role IS NULL;
```

**Beklenen Sonuç:**
- Sonuç boş olmalı (NULL device_role olmamalı)
- Eğer NULL kayıt varsa, bunları düzeltmek gerekir:

```sql
-- NULL device_role'leri düzelt (örnek - gerçek duruma göre güncellenmeli)
-- Önce hangi kayıtların owner, hangilerinin finder olduğunu belirle
UPDATE devices
SET device_role = 'owner'
WHERE device_role IS NULL 
  AND status = 'lost';

UPDATE devices
SET device_role = 'finder'
WHERE device_role IS NULL 
  AND status = 'reported';
```

---

### 2. Payment Status Değerlerini Test Etme

**Amaç:** `payment_completed` status değerinin database'de doğru kullanıldığını doğrulamak.

#### Adım 1: Tüm Device Status Değerlerini Listele

```sql
-- Database'deki tüm unique status değerlerini listele
SELECT DISTINCT status
FROM devices
ORDER BY status;
```

**Beklenen Sonuç:**
- `payment_completed` değeri görünmeli (NOT `payment_complete`)
- Diğer status'lar: `lost`, `reported`, `matched`, `payment_pending`, `cargo_shipped`, `delivered`, `completed`, vb.

#### Adım 2: Payment Status Kullanımını Kontrol Et

```sql
-- Payment ile ilgili tüm status'ları listele
SELECT 
    status,
    device_role,
    COUNT(*) as count
FROM devices
WHERE status IN ('payment_pending', 'payment_completed', 'payment_complete')
GROUP BY status, device_role
ORDER BY status;
```

**Beklenen Sonuç:**
- `payment_completed` değeri kullanılmalı
- `payment_complete` (eski değer) olmamalı veya çok az olmalı
- Eğer `payment_complete` varsa, bunları `payment_completed`'e güncelle:

```sql
-- Eski payment_complete değerlerini payment_completed'e güncelle
UPDATE devices
SET status = 'payment_completed'
WHERE status = 'payment_complete';
```

#### Adım 3: Payments Tablosu ile Device Status Uyumunu Kontrol Et

```sql
-- Payment kayıtları ile device status'larını karşılaştır
SELECT 
    d.id as device_id,
    d.status as device_status,
    d.device_role,
    p.id as payment_id,
    p.payment_status,
    p.escrow_status,
    p.total_amount
FROM devices d
LEFT JOIN payments p ON p.device_id = d.id
WHERE d.status IN ('payment_pending', 'payment_completed')
ORDER BY d.status, d.device_role;
```

**Beklenen Sonuç:**
- `payment_pending` status'undaki device'lar için payment kaydı olabilir veya olmayabilir
- `payment_completed` status'undaki device'lar için mutlaka payment kaydı olmalı
- Payment kaydı varsa, `payment_status = 'completed'` olmalı

#### Adım 4: Payment Completed Status ve Device Role Kombinasyonu

```sql
-- payment_completed status'undaki device'ların device_role dağılımı
SELECT 
    device_role,
    COUNT(*) as count
FROM devices
WHERE status = 'payment_completed'
GROUP BY device_role;
```

**Beklenen Sonuç:**
- Hem `owner` hem `finder` kayıtları olmalı
- Her iki role için de payment_completed durumu mantıklı olmalı

---

### 3. Cargo Status Sütunlarını Test Etme

**Amaç:** `cargo_shipments` tablosundaki iki farklı status sütununun doğru kullanıldığını doğrulamak.

#### Adım 1: Cargo Shipments Tablosu Yapısını Kontrol Et

```sql
-- cargo_shipments tablosunun sütunlarını listele
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'cargo_shipments'
ORDER BY ordinal_position;
```

**Beklenen Sonuç:**
- `status` sütunu olmalı (teslim kodunun durumu: 'active', 'used', 'expired')
- `cargo_status` sütunu olmalı (kargo sürecinin durumu: 'created', 'picked_up', 'in_transit', vb.)

#### Adım 2: Status Sütunu Değerlerini Kontrol Et

```sql
-- status sütunundaki unique değerleri listele (teslim kodu durumu)
SELECT DISTINCT status
FROM cargo_shipments
ORDER BY status;
```

**Beklenen Sonuç:**
- `'active'` - Teslim kodu aktif
- `'used'` - Teslim kodu kullanıldı
- `'expired'` - Teslim kodu süresi doldu
- NULL olabilir (henüz kod oluşturulmamış)

#### Adım 3: Cargo Status Sütunu Değerlerini Kontrol Et

```sql
-- cargo_status sütunundaki unique değerleri listele (kargo süreci durumu)
SELECT DISTINCT cargo_status
FROM cargo_shipments
ORDER BY cargo_status;
```

**Beklenen Sonuç:**
- `'created'` - Kargo kaydı oluşturuldu
- `'label_printed'` - Kargo etiketi yazdırıldı
- `'picked_up'` - Bulan kişi cihazı kargo firmasına teslim etti
- `'in_transit'` - Cihaz yolda
- `'out_for_delivery'` - Teslimata çıktı
- `'delivered'` - Teslim edildi
- `'failed_delivery'` - Teslimat başarısız
- `'returned'` - İade edildi
- `'cancelled'` - İptal edildi

#### Adım 4: İki Status Sütununun Birlikte Kullanımını Kontrol Et

```sql
-- Her iki status sütununu birlikte göster
SELECT 
    id,
    device_id,
    status as code_status,  -- Teslim kodu durumu
    cargo_status,            -- Kargo süreci durumu
    tracking_number,
    cargo_company,
    created_at
FROM cargo_shipments
ORDER BY created_at DESC
LIMIT 20;
```

**Beklenen Sonuç:**
- `code_status` (status): Teslim kodunun durumu
- `cargo_status`: Kargo sürecinin durumu
- Her iki sütun da dolu olabilir veya biri NULL olabilir

#### Adım 5: Cargo Status ve Device Status Uyumunu Kontrol Et

```sql
-- Cargo status ile device status'u karşılaştır
SELECT 
    d.id as device_id,
    d.status as device_status,
    d.device_role,
    cs.id as cargo_shipment_id,
    cs.status as code_status,
    cs.cargo_status,
    cs.tracking_number
FROM devices d
LEFT JOIN cargo_shipments cs ON cs.device_id = d.id
WHERE d.status IN ('payment_completed', 'cargo_shipped', 'delivered')
ORDER BY d.status, d.device_role;
```

**Beklenen Sonuç:**
- `payment_completed` → Cargo kaydı olabilir veya olmayabilir
- `cargo_shipped` → Mutlaka cargo kaydı olmalı, `cargo_status` dolu olmalı
- `delivered` → Cargo kaydı olmalı, `cargo_status = 'delivered'` olmalı

#### Adım 6: Cargo Status Geçişlerini Kontrol Et

```sql
-- Cargo status geçişlerini timeline olarak göster
SELECT 
    cs.id,
    cs.device_id,
    cs.cargo_status,
    cs.status as code_status,
    cs.tracking_number,
    cs.created_at,
    cs.updated_at,
    d.status as device_status
FROM cargo_shipments cs
JOIN devices d ON d.id = cs.device_id
ORDER BY cs.created_at DESC
LIMIT 10;
```

**Beklenen Sonuç:**
- `cargo_status` değerleri mantıklı bir sırayla değişmeli:
  1. `created` → 2. `label_printed` → 3. `picked_up` → 4. `in_transit` → 5. `out_for_delivery` → 6. `delivered`

---

---

