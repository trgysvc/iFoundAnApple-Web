# Dispute/İtiraz Yönetim Sistemi Test Rehberi

## 🧪 **Test Senaryoları ve Adımları**

### **1. Temel Sistem Testleri**

#### **A. DisputeForm Component Testi**
```bash
# Test Adımları:
1. Bir cihaz için ödeme tamamlandıktan sonra
2. DeviceDetailPage'de "Sorun Bildir" butonuna tıkla
3. DisputeForm açılmalı
4. Form alanlarını test et:
   - İtiraz nedeni seçimi (zorunlu)
   - Detaylı açıklama (zorunlu)
   - Fotoğraf yükleme (opsiyonel)
   - Form validasyonu
5. "İtiraz Et" butonuna tıkla
6. Başarı mesajı görünmeli
```

**Beklenen Sonuç:**
- Form doğru şekilde açılır
- Validasyon çalışır (boş alanlar için hata mesajı)
- Fotoğraflar yüklenir ve önizleme gösterilir
- İtiraz başarıyla oluşturulur

#### **B. DisputeStatusCard Component Testi**
```bash
# Test Adımları:
1. DisputeManagementPage'e git
2. DisputeStatusCard'ları kontrol et:
   - Status renkleri doğru mu?
   - Tüm bilgiler görünüyor mu?
   - Fotoğraflar gösteriliyor mu?
   - Tarihler doğru formatlanmış mı?
3. "Detayları Görüntüle" butonuna tıkla
4. Modal açılmalı ve detaylar gösterilmeli
```

**Beklenen Sonuç:**
- Kartlar doğru bilgilerle görüntülenir
- Status renkleri tutarlı
- Modal detayları doğru şekilde gösterir

### **2. Kullanıcı Arayüzü Testleri**

#### **A. DisputeManagementPage Testi**
```bash
# Test Adımları:
1. /disputes sayfasına git
2. Filtreleme testleri:
   - "Tümü" sekmesi - tüm itirazlar görünmeli
   - "Beklemede" sekmesi - sadece pending status'lu itirazlar
   - "İnceleniyor" sekmesi - sadece under_review status'lu itirazlar
   - "Çözüldü" sekmesi - sadece resolved status'lu itirazlar
   - "Reddedildi" sekmesi - sadece rejected status'lu itirazlar
3. Sayı sayaçları doğru mu kontrol et
4. Boş durum mesajları test et
5. Loading durumları test et
```

**Beklenen Sonuç:**
- Filtreleme doğru çalışır
- Sayaçlar güncel
- Boş durumlar için uygun mesajlar
- Loading animasyonları çalışır

#### **B. AdminDisputePage Testi**
```bash
# Test Adımları:
1. /admin/disputes sayfasına git (admin yetkisi gerekli)
2. Tüm admin özelliklerini test et:
   - Tüm itirazları görüntüleme
   - Filtreleme (escalated dahil)
   - "İncelemeye Al" hızlı aksiyonu
   - Detay modalı
   - Çözüm formu
3. Çözüm süreci test et:
   - Status değiştirme
   - Admin notları ekleme
   - Çözüm açıklaması ekleme
   - Form validasyonu
```

**Beklenen Sonuç:**
- Admin arayüzü tam fonksiyonel
- Çözüm süreci doğru çalışır
- Validasyonlar çalışır

### **3. API Endpoint Testleri**

#### **A. Dispute Oluşturma API Testi**
```bash
# Test Komutu:
curl -X POST http://localhost:5173/api/escrow/raise-dispute \
  -H "Content-Type: application/json" \
  -H "user-id: test-user-id" \
  -d '{
    "device_id": "test-device-id",
    "payment_id": "test-payment-id", 
    "cargo_shipment_id": "test-cargo-id",
    "dispute_reason": "device_damaged",
    "notes": "Test dispute notes",
    "photos": []
  }'
```

**Beklenen Sonuç:**
```json
{
  "success": true,
  "dispute_id": "generated-dispute-id",
  "message": "Dispute raised successfully"
}
```

#### **B. Kullanıcı İtirazları API Testi**
```bash
# Test Komutu:
curl -X GET http://localhost:3000/api/disputes/user-disputes \
  -H "user-id: test-user-id"
```

**Beklenen Sonuç:**
```json
{
  "success": true,
  "disputes": [
    {
      "id": "dispute-id",
      "device_id": "device-id",
      "payment_id": "payment-id",
      "dispute_reason": "device_damaged",
      "status": "pending",
      "created_at": "2025-01-XX...",
      "notes": "Test notes"
    }
  ]
}
```

#### **C. Admin İtirazları API Testi**
```bash
# Test Komutu:
curl -X GET http://localhost:3000/api/admin/disputes \
  -H "user-id: admin-user-id"
```

#### **D. İtiraz Çözümü API Testi**
```bash
# Test Komutu:
curl -X POST http://localhost:3000/api/admin/disputes/test-dispute-id/resolve \
  -H "Content-Type: application/json" \
  -H "user-id: admin-user-id" \
  -d '{
    "status": "resolved",
    "admin_notes": "Test admin notes",
    "resolution": "Test resolution"
  }'
```

### **4. Veritabanı Testleri**

#### **A. Dispute Kayıt Testi**
```sql
-- Escrow tablosunda dispute kaydı kontrolü
SELECT 
  id,
  device_id,
  payment_id,
  dispute_status,
  dispute_reason,
  resolution_notes,
  admin_notes,
  created_at,
  updated_at
FROM escrow_accounts 
WHERE dispute_status IS NOT NULL
ORDER BY created_at DESC;

-- Payments tablosunda dispute kaydı kontrolü  
SELECT 
  id,
  device_id,
  dispute_status,
  dispute_reason,
  updated_at
FROM payments 
WHERE dispute_status IS NOT NULL
ORDER BY updated_at DESC;
```

#### **B. Audit Log Kontrolü**
```sql
-- Dispute ile ilgili audit logları
SELECT 
  event_type,
  event_category,
  event_action,
  event_description,
  event_data,
  created_at
FROM audit_logs 
WHERE event_category = 'dispute'
ORDER BY created_at DESC;
```

### **5. Workflow Testleri**

#### **A. Dispute Status Geçişleri**
```bash
# Test Senaryoları:
1. PENDING → UNDER_REVIEW (✅ Geçerli)
2. PENDING → REJECTED (✅ Geçerli)  
3. UNDER_REVIEW → RESOLVED (✅ Geçerli)
4. UNDER_REVIEW → REJECTED (✅ Geçerli)
5. UNDER_REVIEW → ESCALATED (✅ Geçerli)
6. REJECTED → ESCALATED (✅ Geçerli)
7. RESOLVED → PENDING (❌ Geçersiz - test et)
8. ESCALATED → UNDER_REVIEW (❌ Geçersiz - test et)
```

#### **B. DisputeManager Utility Testi**
```typescript
// Test kodu (test dosyasında çalıştır)
import { DisputeManager } from '../utils/disputeManager';

// Test dispute oluşturma
const result = await DisputeManager.raiseDispute(
  'test-device-id',
  'test-payment-id', 
  'test-cargo-id',
  'device_damaged',
  'Test dispute notes',
  [],
  'test-user-id'
);

console.log('Dispute creation result:', result);

// Test status güncelleme
const updateResult = await DisputeManager.updateDisputeStatus(
  'dispute-id',
  'resolved',
  'Admin resolved the dispute',
  'Device was replaced',
  'admin-user-id'
);

console.log('Status update result:', updateResult);

// Test workflow step bilgisi
const workflowStep = DisputeManager.getWorkflowStep('pending');
console.log('Workflow step:', workflowStep);
```

### **6. Hata Durumu Testleri**

#### **A. API Hata Testleri**
```bash
# Eksik parametreler
curl -X POST http://localhost:5173/api/escrow/raise-dispute \
  -H "Content-Type: application/json" \
  -d '{"device_id": "test-id"}'  # Eksik parametreler

# Geçersiz dispute_reason
curl -X POST http://localhost:5173/api/escrow/raise-dispute \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "test-id",
    "payment_id": "test-id",
    "cargo_shipment_id": "test-id", 
    "dispute_reason": "invalid_reason",
    "notes": "test"
  }'

# Yetkisiz erişim
curl -X GET http://localhost:3000/api/admin/disputes  # user-id header yok
```

#### **B. Frontend Hata Testleri**
```bash
# Test Senaryoları:
1. Ağ bağlantısı kesildiğinde
2. API hata döndürdüğünde  
3. Geçersiz veri geldiğinde
4. Yetkisiz erişim durumunda
5. Form validasyon hatalarında
```

### **7. Performans Testleri**

#### **A. Yük Testi**
```bash
# Çoklu dispute oluşturma
for i in {1..10}; do
  curl -X POST http://localhost:5173/api/escrow/raise-dispute \
    -H "Content-Type: application/json" \
    -H "user-id: test-user-$i" \
    -d "{
      \"device_id\": \"device-$i\",
      \"payment_id\": \"payment-$i\",
      \"cargo_shipment_id\": \"cargo-$i\",
      \"dispute_reason\": \"device_damaged\",
      \"notes\": \"Test dispute $i\"
    }" &
done
wait
```

#### **B. Büyük Veri Seti Testi**
```sql
-- Çok sayıda dispute ile test
-- 100+ dispute kaydı oluştur ve sayfa yükleme sürelerini test et
```

### **8. Güvenlik Testleri**

#### **A. Yetkilendirme Testleri**
```bash
# Normal kullanıcı admin API'sine erişim
curl -X GET http://localhost:3000/api/admin/disputes \
  -H "user-id: normal-user-id"

# Geçersiz user-id ile erişim
curl -X GET http://localhost:3000/api/disputes/user-disputes \
  -H "user-id: invalid-user-id"
```

#### **B. SQL Injection Testleri**
```bash
# Dispute notes alanında SQL injection testi
curl -X POST http://localhost:5173/api/escrow/raise-dispute \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "test-id",
    "payment_id": "test-id",
    "cargo_shipment_id": "test-id",
    "dispute_reason": "device_damaged", 
    "notes": "'; DROP TABLE escrow_accounts; --"
  }'
```

### **9. Entegrasyon Testleri**

#### **A. Escrow Sistemi Entegrasyonu**
```bash
# Test Adımları:
1. Normal escrow süreci başlat
2. Dispute oluştur
3. Escrow durumunu kontrol et
4. Dispute çözümü sonrası escrow durumunu kontrol et
```

#### **B. Bildirim Sistemi Entegrasyonu**
```bash
# Test Adımları:
1. Dispute oluşturulduğunda bildirim gönderiliyor mu?
2. Status değiştiğinde bildirim gönderiliyor mu?
3. Çözüm tamamlandığında bildirim gönderiliyor mu?
```

### **10. Test Verisi Hazırlama**

#### **A. Test Veritabanı Kurulumu**
```sql
-- Test dispute verileri oluştur
INSERT INTO escrow_accounts (
  id, device_id, payment_id, holder_user_id, beneficiary_user_id,
  total_amount, reward_amount, service_fee, cargo_fee, net_payout,
  status, dispute_status, dispute_reason, resolution_notes,
  created_at, updated_at
) VALUES 
('test-dispute-1', 'test-device-1', 'test-payment-1', 'user-1', 'user-2',
 1000, 800, 100, 100, 800, 'held', 'pending', 'device_damaged', 'Test dispute 1',
 NOW(), NOW()),
('test-dispute-2', 'test-device-2', 'test-payment-2', 'user-3', 'user-4', 
 1500, 1200, 150, 150, 1200, 'held', 'under_review', 'wrong_device', 'Test dispute 2',
 NOW(), NOW());
```

#### **B. Test Kullanıcıları**
```sql
-- Test kullanıcıları oluştur
INSERT INTO userprofile (user_id, first_name, last_name, email) VALUES
('test-user-1', 'Test', 'User1', 'test1@example.com'),
('test-user-2', 'Test', 'User2', 'test2@example.com'),
('admin-user', 'Admin', 'User', 'admin@example.com');
```

## **📋 Test Checklist**

### **✅ Temel Fonksiyonalite**
- [ ] DisputeForm açılıyor ve çalışıyor
- [ ] Form validasyonu çalışıyor
- [ ] Fotoğraf yükleme çalışıyor
- [ ] DisputeStatusCard doğru bilgileri gösteriyor
- [ ] DisputeManagementPage filtreleme çalışıyor
- [ ] AdminDisputePage admin fonksiyonları çalışıyor

### **✅ API Endpoints**
- [ ] POST /api/escrow/raise-dispute
- [ ] GET /api/disputes/user-disputes  
- [ ] GET /api/admin/disputes
- [ ] POST /api/admin/disputes/[id]/resolve
- [ ] POST /api/admin/disputes/[id]/start-review

### **✅ Veritabanı**
- [ ] Escrow tablosunda dispute kayıtları
- [ ] Payments tablosunda dispute kayıtları
- [ ] Audit log kayıtları
- [ ] Status güncellemeleri

### **✅ Workflow**
- [ ] Status geçişleri doğru çalışıyor
- [ ] Geçersiz geçişler engelleniyor
- [ ] Admin notları kaydediliyor
- [ ] Çözüm detayları kaydediliyor

### **✅ Hata Durumları**
- [ ] API hataları doğru işleniyor
- [ ] Frontend hata mesajları gösteriliyor
- [ ] Yetkisiz erişim engelleniyor
- [ ] Geçersiz veriler reddediliyor

## **🚀 Test Çalıştırma**

### **1. Manuel Test**
```bash
# Development server başlat
npm run dev

# Tarayıcıda test et:
# 1. http://localhost:5173/disputes
# 2. http://localhost:5173/admin/disputes
# 3. http://localhost:5173/dispute-test (test sayfası)
# 4. Bir cihaz detay sayfasında dispute formu
```

### **2. API Test**
```bash
# Postman veya curl ile API testleri
# Yukarıdaki curl komutlarını kullan
```

### **3. Veritabanı Test**
```bash
# Supabase Dashboard'da SQL sorguları çalıştır
# Yukarıdaki SQL komutlarını kullan
```

Bu test rehberi ile Dispute/İtiraz Yönetim Sistemi'ni kapsamlı bir şekilde test edebilirsiniz. Her test senaryosu için beklenen sonuçlar belirtilmiştir.
