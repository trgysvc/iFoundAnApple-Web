# PAYNET Ödeme Süreci Dokümantasyonu
## Backend ve iOS Entegrasyon Rehberi

---

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Mimari Prensipler](#mimari-prensipler)
3. [Backend API Endpoints](#backend-api-endpoints)
4. [iOS Entegrasyonu](#ios-entegrasyonu)
5. [Webhook İşleme](#webhook-işleme)
6. [Escrow Serbest Bırakma](#escrow-serbest-bırakma)
7. [Hata Senaryoları](#hata-senaryoları)
8. [Güvenlik Kontrolleri](#güvenlik-kontrolleri)
9. [Test Senaryoları](#test-senaryoları)

---

## 🎯 Genel Bakış

Bu dokümantasyon, PAYNET ödeme sürecinin Backend ve iOS platformlarında nasıl çalıştığını açıklar.

### Önemli Notlar

- ✅ **Backend:** Sadece PAYNET API ile iletişim kurar, veritabanına **ASLA YAZMAZ**
- ✅ **Backend:** Veritabanından **SADECE OKUMA** yapar (kontrol amaçlı)
- ✅ **iOS:** Veritabanına **YAZMA** işlemlerini yapar
- ✅ **Ödeme Kayıtları:** **SADECE** ödeme başarılı olduğunda oluşturulur

### Ödeme Akışı Özeti

```
1. iOS → Backend: Ödeme başlatma isteği
2. Backend → PAYNET: 3D Secure başlatma (is_escrow: true)
3. Kullanıcı → PAYNET: 3D Secure doğrulama
4. PAYNET → iOS: Callback (session_id, token_id)
5. iOS → Backend: 3D Secure tamamlama
6. PAYNET → Backend: Webhook (ödeme başarılı)
7. Backend → iOS: Webhook bildirimi
8. iOS → Supabase: Payment ve Escrow kayıtları oluşturma
```

---

## 🏗️ Mimari Prensipler

### Backend Sorumlulukları

1. ✅ PAYNET API ile iletişim (3D Secure başlatma/tamamlama)
2. ✅ PAYNET'e `is_escrow: true` parametresi gönderme
3. ✅ PAYNET escrow serbest bırakma (cihaz teslim edildiğinde)
4. ✅ Veritabanından **SADECE OKUMA** (kontrol amaçlı)
5. ✅ Webhook doğrulama ve işleme
6. ❌ **VERİTABANINA YAZMAZ**

### iOS Sorumlulukları

1. ✅ Veritabanına **YAZMA** işlemlerini yapar
2. ✅ Payment kaydı oluşturma (webhook geldiğinde)
3. ✅ Escrow kaydı oluşturma (webhook geldiğinde)
4. ✅ Device status güncelleme
5. ✅ Backend API'ye istek gönderme
6. ✅ Webhook bildirimlerini dinleme (Supabase Realtime)

---

## 🔌 Backend API Endpoints

### Base URL

**Development:**
```
http://localhost:3000/v1
```

**Production:**
```
https://api.ifoundanapple.com/v1
```

### 1. Ödeme Başlatma

**Endpoint:** `POST /v1/payments/process`

**Authentication:** Bearer Token (Required)

**Request Body:**
```json
{
  "deviceId": "123e4567-e89b-12d3-a456-426614174000",
  "totalAmount": 2000.0
}
```

**Request Fields:**
- `deviceId` (string, UUID, **ZORUNLU**): Ödeme yapılacak cihazın ID'si
- `totalAmount` (number, **ZORUNLU**): Frontend'den gelen toplam tutar (backend'de doğrulanır)

**Backend İşlemleri:**
1. ✅ Token doğrulama
2. ✅ Device bilgilerini veritabanından **OKUR** (kontrol amaçlı)
   - Device status = 'matched' kontrolü
   - User ID kontrolü (sadece device sahibi ödeme yapabilir)
   - Total amount doğrulama
3. ✅ Ücret hesaplama (backend'de hesaplanır)
4. ✅ PAYNET API'ye 3D Secure başlatma isteği gönderir
   ```json
   {
     "amount": 2000.0,
     "is_escrow": true,  // ✅ Escrow aktif
     "callback_url": "https://ifoundanapple.com/payment/callback",
     ...
   }
   ```
5. ❌ **VERİTABANINA YAZMAZ**

**Response:**
```json
{
  "id": "payment-uuid-123",
  "deviceId": "123e4567-e89b-12d3-a456-426614174000",
  "paymentStatus": "pending",
  "totalAmount": 2000.0,
  "providerTransactionId": "paynet-txn-123",
  "publishableKey": "pk_test_...",
  "paymentUrl": "https://api.paynet.com.tr/v2/transaction/tds_initial",
  "feeBreakdown": {
    "totalAmount": 2000.0,
    "gatewayFee": 68.6,
    "cargoFee": 250.0,
    "rewardAmount": 400.0,
    "serviceFee": 1281.4,
    "netPayout": 400.0
  }
}
```

**Response Fields:**
- `id` (string): Payment ID (UUID) - iOS tarafında saklanmalı
- `deviceId` (string): Device ID
- `paymentStatus` (string): Ödeme durumu (`pending`, `completed`, `failed`)
- `totalAmount` (number): Toplam tutar
- `providerTransactionId` (string, opsiyonel): PAYNET transaction ID
- `publishableKey` (string, opsiyonel): PAYNET publishable key
- `paymentUrl` (string, opsiyonel): 3D Secure ödeme URL'i - iOS tarafında açılmalı
- `feeBreakdown` (object): Ücret detayları - Webhook geldiğinde kullanılacak

**Status Codes:**
- `201 Created` - Ödeme başarıyla başlatıldı
- `400 Bad Request` - Geçersiz request veya tutar uyuşmazlığı
- `401 Unauthorized` - Geçersiz token
- `404 Not Found` - Cihaz bulunamadı

**Önemli Notlar:**

1. **Tutar Doğrulama:** Backend, frontend'den gelen `totalAmount` değerini veritabanındaki `device_models.ifoundanapple_fee` değeri ile karşılaştırır. Eğer tutarlar eşleşmezse `400 Bad Request` döner.

2. **Ücret Hesaplama:** Backend'de ücretler şu formüle göre hesaplanır:
   ```
   totalAmount = device_models.ifoundanapple_fee
   gatewayFee = totalAmount * 0.0343 (3.43%)
   cargoFee = 250.00 TL (sabit)
   rewardAmount = totalAmount * 0.20 (20%)
   serviceFee = totalAmount - gatewayFee - cargoFee - rewardAmount
   netPayout = rewardAmount
   ```

3. **Cihaz Durumu:** Cihaz `status = 'matched'` olmalıdır. Aksi halde `400 Bad Request` döner.

4. **Kullanıcı Kontrolü:** Sadece cihaz sahibi (device.userId) ödeme yapabilir. Başka kullanıcı denerse `400 Bad Request` döner.

5. **PAYNET Entegrasyonu:** Ödeme PAYNET 3D Secure ile başlatılır. `is_escrow: true` parametresi ile gönderilir (ödeme PAYNET tarafında tutulur).

---

### 2. 3D Secure Tamamlama

**Endpoint:** `POST /v1/payments/complete-3d`

**Authentication:** Bearer Token (Required)

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

**Backend İşlemleri:**
1. ✅ Token doğrulama
2. ✅ Payment bilgilerini veritabanından **OKUR** (kontrol amaçlı)
   - Payment'ın kullanıcıya ait olduğu kontrolü
   - Payment status = 'pending' kontrolü
3. ✅ PAYNET API'ye 3D Secure tamamlama isteği gönderir
4. ❌ **VERİTABANINA YAZMAZ**

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
1. Bu endpoint, 3D Secure doğrulaması sonrası çağrılmalıdır
2. Final payment status webhook ile güncellenir (`POST /v1/webhooks/paynet-callback`)
3. iOS, webhook gelene kadar payment status'u polling veya real-time subscription ile takip edebilir

---

### 3. Ödeme Durumu Sorgulama

**Endpoint:** `GET /v1/payments/{paymentId}/status`

**Authentication:** Bearer Token (Required)

**Path Parameters:**
- `paymentId` (string, UUID, **ZORUNLU**): Payment ID

**Backend İşlemleri:**
1. ✅ Token doğrulama
2. ✅ Payment bilgilerini veritabanından **OKUR**
3. ✅ PAYNET API'den payment status sorgular
4. ❌ **VERİTABANINA YAZMAZ**

**Response:**
```json
{
  "paymentId": "payment-uuid-123",
  "status": "completed",
  "providerStatus": "SUCCESS",
  "webhookReceived": true
}
```

**Status Codes:**
- `200 OK` - Payment status döndü
- `401 Unauthorized` - Geçersiz token
- `404 Not Found` - Payment bulunamadı

---

### 4. Escrow Serbest Bırakma

**Endpoint:** `POST /v1/payments/release-escrow`

**Authentication:** Bearer Token (Required)

**Request Body:**
```json
{
  "paymentId": "payment-uuid-123",
  "deviceId": "device-uuid-123",
  "releaseReason": "Device received and confirmed by owner"
}
```

**Request Fields:**
- `paymentId` (string, UUID, **ZORUNLU**): Payment ID
- `deviceId` (string, UUID, **ZORUNLU**): Device ID
- `releaseReason` (string, **ZORUNLU**): Serbest bırakma nedeni

**Backend İşlemleri:**
1. ✅ Token doğrulama
2. ✅ Payment bilgilerini veritabanından **OKUR** (kontrol amaçlı)
3. ✅ PAYNET API'ye escrow release isteği gönderir
   ```http
   POST /v1/transaction/escrow_status_update
   {
     "xact_id": "paynet-transaction-id",
     "status": 2,  // Release
     "note": "Device received and confirmed by owner"
   }
   ```
4. ❌ **VERİTABANINA YAZMAZ**

**Response:**
```json
{
  "success": true,
  "message": "Escrow released successfully"
}
```

**Status Codes:**
- `200 OK` - Escrow başarıyla serbest bırakıldı
- `400 Bad Request` - Geçersiz request
- `401 Unauthorized` - Geçersiz token
- `404 Not Found` - Payment bulunamadı

---

### 5. Webhook Endpoint (Backend İçin)

**Endpoint:** `POST /v1/webhooks/paynet-callback`

**Authentication:** Gerekmez (IP whitelist ile korunur)

**IP Whitelist:** PAYNET'in IP adresleri `.env` dosyasında `PAYNET_ALLOWED_IPS` olarak tanımlanmalıdır.

**Request Body (PAYNET Webhook Payload):**
```json
{
  "reference_no": "payment-uuid-123",
  "is_succeed": true,
  "amount": 2000.0,
  "netAmount": 1931.4,
  "comission": 68.6,
  "authorization_code": "AUTH123",
  "order_id": "ORDER123",
  "xact_date": "2025-01-15T10:30:00.000Z"
}
```

**Backend İşlemleri:**
1. ✅ IP whitelist kontrolü
2. ✅ Signature doğrulama
3. ✅ Idempotency kontrolü (duplicate webhook kontrolü)
4. ✅ Payment bilgilerini veritabanından **OKUR** (kontrol amaçlı)
5. ✅ Webhook'u doğrular
6. ❌ **VERİTABANINA YAZMAZ**
7. ✅ iOS'a webhook bildirimi gönderir (Supabase Realtime veya Push Notification)

**Response:**
```json
{
  "received": true
}
```

**Status Codes:**
- `200 OK` - Webhook başarıyla işlendi
- `400 Bad Request` - Geçersiz payload veya signature
- `401 Unauthorized` - IP adresi whitelist'te değil

---

## 📱 iOS Entegrasyonu

### 1. Ödeme Başlatma

**Swift Kodu:**

```swift
import Foundation

struct PaymentProcessRequest: Codable {
    let deviceId: String
    let totalAmount: Double
}

struct PaymentProcessResponse: Codable {
    let id: String
    let deviceId: String
    let paymentStatus: String
    let totalAmount: Double
    let providerTransactionId: String?
    let publishableKey: String?
    let paymentUrl: String?
    let feeBreakdown: FeeBreakdown?
}

struct FeeBreakdown: Codable {
    let totalAmount: Double
    let gatewayFee: Double
    let cargoFee: Double
    let rewardAmount: Double
    let serviceFee: Double
    let netPayout: Double
}

class PaymentService {
    private let baseURL = "https://api.ifoundanapple.com/v1"
    private let authToken: String
    
    init(authToken: String) {
        self.authToken = authToken
    }
    
    func initiatePayment(deviceId: String, totalAmount: Double) async throws -> PaymentProcessResponse {
        let url = URL(string: "\(baseURL)/payments/process")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(authToken)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let requestBody = PaymentProcessRequest(
            deviceId: deviceId,
            totalAmount: totalAmount
        )
        request.httpBody = try JSONEncoder().encode(requestBody)
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw PaymentError.invalidResponse
        }
        
        guard httpResponse.statusCode == 201 else {
            throw PaymentError.serverError(httpResponse.statusCode)
        }
        
        let paymentResponse = try JSONDecoder().decode(PaymentProcessResponse.self, from: data)
        
        // Payment ID'yi UserDefaults'a kaydet
        UserDefaults.standard.set(paymentResponse.id, forKey: "current_payment_id")
        
        // Fee breakdown'ı UserDefaults'a kaydet (webhook geldiğinde kullanılacak)
        if let feeBreakdown = paymentResponse.feeBreakdown {
            if let feeData = try? JSONEncoder().encode(feeBreakdown) {
                UserDefaults.standard.set(feeData, forKey: "current_payment_fee_breakdown")
            }
        }
        
        return paymentResponse
    }
}

enum PaymentError: Error {
    case invalidResponse
    case serverError(Int)
    case decodingError
}
```

**Kullanım:**

```swift
let paymentService = PaymentService(authToken: userToken)

do {
    let response = try await paymentService.initiatePayment(
        deviceId: device.id,
        totalAmount: 2000.0
    )
    
    // Payment URL'i aç (3D Secure sayfası)
    if let paymentUrl = response.paymentUrl,
       let url = URL(string: paymentUrl) {
        await UIApplication.shared.open(url)
    }
} catch {
    print("Payment initiation failed: \(error)")
}
```

---

### 2. 3D Secure Tamamlama

**Swift Kodu:**

```swift
struct Complete3DRequest: Codable {
    let paymentId: String
    let sessionId: String
    let tokenId: String
}

struct Complete3DResponse: Codable {
    let success: Bool
    let paymentId: String
    let message: String
}

extension PaymentService {
    func complete3DSecure(
        paymentId: String,
        sessionId: String,
        tokenId: String
    ) async throws -> Complete3DResponse {
        let url = URL(string: "\(baseURL)/payments/complete-3d")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(authToken)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let requestBody = Complete3DRequest(
            paymentId: paymentId,
            sessionId: sessionId,
            tokenId: tokenId
        )
        request.httpBody = try JSONEncoder().encode(requestBody)
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw PaymentError.invalidResponse
        }
        
        guard httpResponse.statusCode == 200 else {
            throw PaymentError.serverError(httpResponse.statusCode)
        }
        
        return try JSONDecoder().decode(Complete3DResponse.self, from: data)
    }
}
```

**Callback URL Handler (SceneDelegate veya AppDelegate):**

```swift
func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
    guard let url = URLContexts.first?.url else { return }
    
    // Callback URL formatı: ifoundanapple://payment/callback?session_id=xxx&token_id=yyy
    if url.scheme == "ifoundanapple" && url.host == "payment" {
        let components = URLComponents(url: url, resolvingAgainstBaseURL: false)
        let sessionId = components?.queryItems?.first(where: { $0.name == "session_id" })?.value
        let tokenId = components?.queryItems?.first(where: { $0.name == "token_id" })?.value
        
        if let sessionId = sessionId,
           let tokenId = tokenId,
           let paymentId = UserDefaults.standard.string(forKey: "current_payment_id") {
            
            Task {
                do {
                    let response = try await paymentService.complete3DSecure(
                        paymentId: paymentId,
                        sessionId: sessionId,
                        tokenId: tokenId
                    )
                    
                    if response.success {
                        // Success sayfasına yönlendir
                        // Webhook bekleniyor - polling başlat
                        startPaymentStatusPolling(paymentId: paymentId)
                    }
                } catch {
                    print("3D Secure completion failed: \(error)")
                }
            }
        }
    }
}
```

---

### 3. Webhook İşleme

**Supabase Realtime Subscription:**

```swift
import Supabase

class PaymentWebhookHandler {
    private let supabase: SupabaseClient
    
    init(supabase: SupabaseClient) {
        self.supabase = supabase
    }
    
    func listenForPaymentWebhook(paymentId: String) {
        // Supabase Realtime subscription
        let channel = supabase.channel("payment_\(paymentId)")
        
        channel.on("postgres_changes", filter: "id=eq.\(paymentId)", table: "payments") { payload in
            if let payment = payload.new as? [String: Any],
               let status = payment["payment_status"] as? String,
               status == "completed" {
                // Webhook geldi - payment ve escrow kayıtlarını oluştur
                Task {
                    await self.createPaymentRecords(paymentId: paymentId)
                }
            }
        }
        
        supabase.realtime.connect()
        channel.subscribe()
    }
    
    private func createPaymentRecords(paymentId: String) async {
        // Backend'den webhook payload'ını al (veya Supabase'den oku)
        // Payment ve escrow kayıtlarını oluştur
        // Detaylar aşağıda
    }
}
```

**Payment ve Escrow Kayıtları Oluşturma:**

```swift
extension PaymentWebhookHandler {
    func createPaymentRecords(
        paymentId: String,
        webhookData: PaynetWebhookPayload,
        feeBreakdown: FeeBreakdown,
        deviceId: String,
        matchedUserId: String
    ) async throws {
        // 1. Payment kaydı oluştur
        let paymentData: [String: Any] = [
            "id": paymentId,
            "device_id": deviceId,
            "payer_id": currentUser.id,
            "receiver_id": matchedUserId,
            "total_amount": webhookData.amount,
            "reward_amount": feeBreakdown.rewardAmount,
            "cargo_fee": feeBreakdown.cargoFee,
            "service_fee": feeBreakdown.serviceFee,
            "payment_gateway_fee": feeBreakdown.gatewayFee,
            "net_payout": feeBreakdown.netPayout,
            "payment_provider": "paynet",
            "payment_status": "completed",
            "provider_payment_id": webhookData.order_id,
            "provider_transaction_id": webhookData.reference_no,
            "authorization_code": webhookData.authorization_code,
            "currency": "TRY",
            "completed_at": webhookData.xact_date,
            "created_at": ISO8601DateFormatter().string(from: Date()),
            "updated_at": ISO8601DateFormatter().string(from: Date())
        ]
        
        let { error: paymentError } = try await supabase
            .from("payments")
            .insert(paymentData)
            .execute()
        
        if let error = paymentError {
            throw error
        }
        
        // 2. Escrow kaydı oluştur
        let escrowId = UUID().uuidString
        let escrowData: [String: Any] = [
            "id": escrowId,
            "payment_id": paymentId,
            "device_id": deviceId,
            "holder_user_id": currentUser.id,
            "beneficiary_user_id": matchedUserId,
            "total_amount": feeBreakdown.totalAmount,
            "reward_amount": feeBreakdown.rewardAmount,
            "service_fee": feeBreakdown.serviceFee,
            "gateway_fee": feeBreakdown.gatewayFee,
            "cargo_fee": feeBreakdown.cargoFee,
            "net_payout": feeBreakdown.netPayout,
            "status": "held",
            "escrow_type": "standard",
            "auto_release_days": 30,
            "release_conditions": [
                [
                    "type": "device_received",
                    "description": "Device must be received by finder",
                    "met": false
                ],
                [
                    "type": "exchange_confirmed",
                    "description": "Both parties must confirm exchange",
                    "met": false
                ]
            ],
            "confirmations": [],
            "held_at": ISO8601DateFormatter().string(from: Date()),
            "created_at": ISO8601DateFormatter().string(from: Date()),
            "updated_at": ISO8601DateFormatter().string(from: Date())
        ]
        
        let { error: escrowError } = try await supabase
            .from("escrow_accounts")
            .insert(escrowData)
            .execute()
        
        if let error = escrowError {
            throw error
        }
        
        // 3. Device status güncelle
        let { error: deviceError } = try await supabase
            .from("devices")
            .update([
                "status": "payment_completed",
                "updated_at": ISO8601DateFormatter().string(from: Date())
            ])
            .eq("id", value: deviceId)
            .execute()
        
        if let error = deviceError {
            throw error
        }
        
        // 4. Audit log kaydı oluştur
        let auditLogData: [String: Any] = [
            "event_type": "payment_completed",
            "event_category": "payment",
            "event_action": "complete",
            "event_severity": "info",
            "user_id": currentUser.id,
            "resource_type": "payment",
            "resource_id": paymentId,
            "event_description": "Payment completed successfully via PAYNET",
            "event_data": [
                "amount": webhookData.amount,
                "provider": "paynet",
                "authorization_code": webhookData.authorization_code
            ],
            "created_at": ISO8601DateFormatter().string(from: Date())
        ]
        
        let { error: auditError } = try await supabase
            .from("audit_logs")
            .insert(auditLogData)
            .execute()
        
        if let error = auditError {
            print("Audit log error: \(error)")
            // Audit log hatası kritik değil, devam et
        }
    }
}

struct PaynetWebhookPayload: Codable {
    let reference_no: String
    let is_succeed: Bool
    let amount: Double
    let netAmount: Double?
    let comission: Double?
    let authorization_code: String?
    let order_id: String?
    let xact_date: String
}
```

---

### 4. Payment Status Polling

**Swift Kodu:**

```swift
extension PaymentService {
    func checkPaymentStatus(paymentId: String) async throws -> PaymentStatusResponse {
        let url = URL(string: "\(baseURL)/payments/\(paymentId)/status")!
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(authToken)", forHTTPHeaderField: "Authorization")
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw PaymentError.invalidResponse
        }
        
        guard httpResponse.statusCode == 200 else {
            throw PaymentError.serverError(httpResponse.statusCode)
        }
        
        return try JSONDecoder().decode(PaymentStatusResponse.self, from: data)
    }
}

struct PaymentStatusResponse: Codable {
    let paymentId: String
    let status: String
    let providerStatus: String?
    let webhookReceived: Bool
}

func startPaymentStatusPolling(paymentId: String) {
    Task {
        var attempts = 0
        let maxAttempts = 30 // 5 dakika (10 saniye * 30)
        
        while attempts < maxAttempts {
            do {
                let status = try await paymentService.checkPaymentStatus(paymentId: paymentId)
                
                if status.webhookReceived && status.status == "completed" {
                    // Webhook geldi, kayıtları oluştur
                    await createPaymentRecordsFromWebhook(paymentId: paymentId)
                    break
                }
                
                // 10 saniye bekle
                try await Task.sleep(nanoseconds: 10_000_000_000)
                attempts += 1
            } catch {
                print("Status check error: \(error)")
                break
            }
        }
    }
}
```

---

### 5. Escrow Serbest Bırakma

**Swift Kodu:**

```swift
struct ReleaseEscrowRequest: Codable {
    let paymentId: String
    let deviceId: String
    let releaseReason: String
}

struct ReleaseEscrowResponse: Codable {
    let success: Bool
    let message: String
}

extension PaymentService {
    func releaseEscrow(
        paymentId: String,
        deviceId: String,
        releaseReason: String
    ) async throws -> ReleaseEscrowResponse {
        let url = URL(string: "\(baseURL)/payments/release-escrow")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(authToken)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let requestBody = ReleaseEscrowRequest(
            paymentId: paymentId,
            deviceId: deviceId,
            releaseReason: releaseReason
        )
        request.httpBody = try JSONEncoder().encode(requestBody)
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw PaymentError.invalidResponse
        }
        
        guard httpResponse.statusCode == 200 else {
            throw PaymentError.serverError(httpResponse.statusCode)
        }
        
        let releaseResponse = try JSONDecoder().decode(ReleaseEscrowResponse.self, from: data)
        
        // Backend escrow'u serbest bıraktı, şimdi veritabanını güncelle
        if releaseResponse.success {
            await updateEscrowStatusInDatabase(paymentId: paymentId)
        }
        
        return releaseResponse
    }
    
    private func updateEscrowStatusInDatabase(paymentId: String) async {
        // Escrow kaydını güncelle
        let { error } = try await supabase
            .from("escrow_accounts")
            .update([
                "status": "released",
                "released_at": ISO8601DateFormatter().string(from: Date()),
                "updated_at": ISO8601DateFormatter().string(from: Date())
            ])
            .eq("payment_id", value: paymentId)
            .execute()
        
        // Financial transaction kaydı oluştur
        // Device status güncelle
        // Audit log kaydı oluştur
    }
}
```

---

## 🔔 Webhook İşleme

### Backend Webhook Handler

**Backend'de webhook geldiğinde:**

1. ✅ Webhook'u doğrula (IP, signature)
2. ✅ Payment bilgilerini veritabanından oku
3. ✅ iOS'a bildirim gönder (Supabase Realtime veya Push Notification)

**Supabase Realtime Kullanımı:**

Backend, webhook geldiğinde Supabase Realtime üzerinden iOS'a bildirim gönderebilir:

```javascript
// Backend (Node.js örneği)
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Webhook geldiğinde
await supabase
  .channel('payment_webhooks')
  .send({
    type: 'broadcast',
    event: 'payment_completed',
    payload: {
      paymentId: webhookData.reference_no,
      webhookData: webhookData,
      feeBreakdown: feeBreakdown
    }
  });
```

**iOS'ta Dinleme:**

```swift
func listenForWebhookNotifications() {
    let channel = supabase.channel("payment_webhooks")
    
    channel.on("broadcast", event: "payment_completed") { payload in
        if let data = payload.payload as? [String: Any],
           let paymentId = data["paymentId"] as? String,
           let webhookData = data["webhookData"] as? [String: Any],
           let feeBreakdown = data["feeBreakdown"] as? [String: Any] {
            
            // Payment ve escrow kayıtlarını oluştur
            Task {
                await createPaymentRecords(
                    paymentId: paymentId,
                    webhookData: webhookData,
                    feeBreakdown: feeBreakdown
                )
            }
        }
    }
    
    supabase.realtime.connect()
    channel.subscribe()
}
```

---

## 🔓 Escrow Serbest Bırakma

### iOS'tan Escrow Serbest Bırakma

Cihaz teslim edildiğinde iOS, backend'e escrow serbest bırakma isteği gönderir:

```swift
// Cihaz teslim onayı verildiğinde
let releaseResponse = try await paymentService.releaseEscrow(
    paymentId: payment.id,
    deviceId: device.id,
    releaseReason: "Device received and confirmed by owner"
)

if releaseResponse.success {
    // Escrow serbest bırakıldı
    // Veritabanı güncellemeleri yapılır
}
```

---

## ⚠️ Hata Senaryoları

### Senaryo 1: Ödeme Başarısız

**PAYNET Webhook (Başarısız):**
```json
{
  "reference_no": "payment-uuid-123",
  "is_succeed": false,
  "error_message": "Insufficient funds"
}
```

**Backend İşlemleri:**
1. ✅ Webhook'u doğrular
2. ✅ iOS'a bildirim gönderir
3. ❌ **VERİTABANINA YAZMAZ**

**iOS İşlemleri:**
1. ✅ Hata mesajını göster
2. ❌ **VERİTABANINA YAZMAZ** (ödeme başarısız)

### Senaryo 2: Webhook Gecikmesi

Eğer webhook gecikirse:
1. iOS polling yapabilir (30 deneme, 10 saniye aralık)
2. Backend, PAYNET API'den status sorgular
3. Webhook geldiğinde normal akış devam eder

### Senaryo 3: Duplicate Webhook

Backend idempotency kontrolü yapar:
- Aynı `reference_no` ile gelen webhook'lar tekrar işlenmez
- iOS tarafında da duplicate kayıt kontrolü yapılmalı

---

## 🔐 Güvenlik Kontrolleri

### Backend Güvenlik Kontrolleri

1. ✅ Token doğrulama (her istekte)
2. ✅ User ID kontrolü (sadece device sahibi ödeme yapabilir)
3. ✅ Device status kontrolü (sadece 'matched' device'lar için)
4. ✅ Amount doğrulama (backend'de hesaplanan tutar ile karşılaştırma)
5. ✅ IP whitelist (webhook için)
6. ✅ Signature doğrulama (webhook için)

### iOS Güvenlik Kontrolleri

1. ✅ RLS (Row Level Security) politikaları
2. ✅ User authentication
3. ✅ Webhook payload doğrulama
4. ✅ Idempotency kontrolü (duplicate kayıt önleme)
5. ✅ Payment ID doğrulama (kullanıcıya ait mi?)

---

## 🧪 Test Senaryoları

### Test 1: Ödeme Başlatma

1. ✅ Device status = 'matched' kontrolü
2. ✅ User ID kontrolü (sadece device sahibi)
3. ✅ Amount doğrulama
4. ✅ Backend response kontrolü
5. ✅ Payment ID saklama

### Test 2: 3D Secure Tamamlama

1. ✅ Session ID ve Token ID doğrulama
2. ✅ Payment ID doğrulama
3. ✅ Backend response kontrolü
4. ✅ Polling başlatma

### Test 3: Webhook İşleme

1. ✅ Webhook payload doğrulama
2. ✅ Payment kaydı oluşturma
3. ✅ Escrow kaydı oluşturma
4. ✅ Device status güncelleme
5. ✅ Audit log kaydı

### Test 4: Escrow Serbest Bırakma

1. ✅ Backend API çağrısı
2. ✅ Escrow status güncelleme
3. ✅ Financial transaction kaydı
4. ✅ Device status güncelleme

---

## 📊 Veritabanı Tabloları

### `payments` Tablosu

**Oluşturma Zamanı:** ✅ Sadece ödeme başarılı olduğunda (webhook geldiğinde)

**Oluşturan:** iOS

**Backend Erişimi:** ✅ Sadece OKUMA (kontrol amaçlı)

### `escrow_accounts` Tablosu

**Oluşturma Zamanı:** ✅ Sadece ödeme başarılı olduğunda (webhook geldiğinde)

**Oluşturan:** iOS

**Backend Erişimi:** ✅ Sadece OKUMA (kontrol amaçlı)

### `devices` Tablosu

**Güncelleme Zamanı:** ✅ Ödeme başarılı olduğunda

**Güncelleyen:** iOS

**Backend Erişimi:** ✅ Sadece OKUMA (kontrol amaçlı)

---

## 📝 Özet

### Backend Sorumlulukları
- ✅ PAYNET API ile iletişim
- ✅ PAYNET escrow yönetimi (başlatma ve serbest bırakma)
- ✅ Veritabanından **SADECE OKUMA** (kontrol amaçlı)
- ❌ Veritabanına **ASLA YAZMAZ**

### iOS Sorumlulukları
- ✅ Veritabanına **YAZMA** işlemleri
- ✅ Payment kaydı oluşturma (ödeme başarılı olduğunda)
- ✅ Escrow kaydı oluşturma (ödeme başarılı olduğunda)
- ✅ Device status güncelleme
- ✅ Backend API'ye istek gönderme
- ✅ Webhook bildirimlerini dinleme

### Önemli Kurallar
1. ❌ Ödeme başlatıldığında veritabanına kayıt **OLUŞTURULMAZ**
2. ✅ Ödeme başarılı olduğunda (webhook geldiğinde) kayıtlar oluşturulur
3. ✅ Backend sadece kontrol amaçlı veritabanından okur
4. ✅ Tüm yazma işlemleri iOS tarafından yapılır
5. ✅ Backend PAYNET escrow'u yönetir (başlatma ve serbest bırakma)

---

## 🔗 İlgili Dokümantasyonlar

- [Backend API Dokümantasyonu](./BACKEND_API_DOCUMENTATION.md)
- [iOS Development Prompt](./IOS_DEVELOPMENT_PROMPT.md)
- [Process Flow](./PROCESS_FLOW.md)

---

**Son Güncelleme:** 2025-01-15
**Versiyon:** 1.0.0

