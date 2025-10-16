# iFoundAnApple - Sistem Analizi Raporu

**Tarih:** 20 Aralık 2024  
**Versiyon:** 1.0  
**Durum:** Test Aşamasında

---

## 📋 **GENEL SİSTEM ÖZETİ**

### **Platform Amacı**
iFoundAnApple, kayıp Apple cihazlarını bulan kişiler ile cihaz sahipleri arasında güvenli bir değişim platformu sağlar. Escrow sistemi ile ödemeleri güvence altına alır.

### **Ana Süreçler**
1. **Cihaz Sahibi (Device Owner)**: Kayıp cihaz kaydı → Eşleşme → Ödeme → Kargo alma → Onay
2. **Cihaz Bulan (Finder)**: Bulunan cihaz kaydı → Eşleşme → Ödeme bekleme → Kargo gönderme → Ödül alma

### **Teknoloji Stack**
- **Frontend**: React + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Payment**: İyzico (3D Secure)
- **Deployment**: Coolify

---

## 🗄️ **VERİTABANI YAPISI**

### **Ana Tablolar (16 adet)**
1. **`devices`** - Cihaz kayıtları (LOST/FOUND)
2. **`payments`** - Ödeme işlemleri (62 sütun)
3. **`escrow_accounts`** - Escrow hesapları (47 sütun)
4. **`financial_transactions`** - Mali işlemler
5. **`cargo_shipments`** - Kargo gönderileri
6. **`notifications`** - Bildirimler
7. **`userprofile`** - Kullanıcı profilleri
8. **`device_models`** - Cihaz modelleri ve fiyatlandırma
9. **`cargo_companies`** - Kargo şirketleri
10. **`audit_logs`** - Denetim kayıtları

### **Yardımcı Tablolar (6 adet)**
- **`payment_summaries`** - Ödeme özetleri
- **`shipment_tracking`** - Kargo takibi
- **`user_escrow_history`** - Kullanıcı escrow geçmişi
- **`user_transaction_history`** - Kullanıcı işlem geçmişi
- **`financial_audit_trail`** - Mali denetim izi
- **`security_audit_events`** - Güvenlik denetim olayları

### **Güvenlik Durumu**
- **RLS Aktif**: `audit_logs`, `cargo_companies`, `cargo_shipments`, `device_models`, `notifications`, `userprofile`
- **RLS Kapalı (Test)**: `devices`, `escrow_accounts`, `financial_transactions`, `payments`

---

## 🔄 **SÜREÇ AKIŞI**

### **Device Status Enum**
```typescript
export enum DeviceStatus {
  LOST = "lost",                    // Cihaz sahibi kayıp bildirimi
  REPORTED = "reported",            // Bulan kişi buldu bildirimi
  MATCHED = "matched",              // Eşleşme bulundu
  PAYMENT_PENDING = "payment_pending", // Ödeme bekleniyor
  PAYMENT_COMPLETE = "payment_completed", // Ödeme tamamlandı ✅
  EXCHANGE_PENDING = "exchange_pending", // Değişim bekleniyor
  COMPLETED = "completed",           // İşlem tamamlandı
}
```

### **Ödeme Süreci**
1. **Ödeme Başlatma**: `payments` + `escrow_accounts` tablolarına kayıt
2. **İyzico 3D Secure**: Callback ile ödeme doğrulama
3. **Status Güncelleme**: `devices.status = 'payment_completed'`
4. **Escrow Aktif**: `escrow_accounts.status = 'held'`

### **Kargo Süreci**
1. **Kargo Bilgileri**: `cargo_shipments` tablosuna kayıt
2. **Status Güncelleme**: `devices.status = 'CARGO_SHIPPED'`
3. **Takip**: Kargo şirketi API entegrasyonu

### **Onay Süreci**
1. **Teslimat**: Cihaz sahibi kargoyu alır
2. **Onay**: Manuel onay veya otomatik onay (7 gün)
3. **Escrow Release**: `escrow_accounts.status = 'released'`
4. **Para Transfer**: Bulan kişiye ödül transferi

---

## 💰 **ÜCRET HESAPLAMA**

### **Manuel İşlemler (Admin Tarafından):**
```sql
-- device_models tablosunda
repair_price = 5000 TL (manuel girilen)
ifoundanapple_fee = repair_price * 0.40 = 2000 TL (manuel hesaplanan)
```

### **Sistem Hesaplaması:**
```typescript
// ifoundanapple_fee = 2000 TL (müşteriden alınacak toplam)
const totalAmount = ifoundanappleFee;           // 2000 TL (toplam)
const gatewayFee = totalAmount * 0.0343;       // 68.60 TL (%3.43)
const cargoFee = 250;                           // 250 TL (sabit)
const rewardAmount = totalAmount * 0.20;       // 400 TL (%20 - bulan kişi)
const serviceFee = totalAmount - gatewayFee - cargoFee - rewardAmount; // 1281.40 TL (geriye kalan)
```

### **Ücret Yapısı:**
```
Toplam Tutar: 2,000.00 TL (ifoundanapple_fee)
├── Gateway Komisyonu: 68.60 TL (%3.43)
├── Kargo Ücreti: 250.00 TL (sabit)
├── Bulan Kişi Ödülü: 400.00 TL (%20)
└── Hizmet Bedeli: 1,281.40 TL (geriye kalan)
─────────────────────────────────────────
Toplam: 68.60 + 250 + 400 + 1,281.40 = 2,000.00 TL ✅
```

### **Net Payout Hesaplama:**
```
net_payout = rewardAmount = 400.00 TL
```

---

## 🔒 **GÜVENLİK ÖZELLİKLERİ**

### **RLS Politikaları**
- **Kullanıcı Bazlı**: Her kullanıcı sadece kendi verilerini görebilir
- **Admin Yetkileri**: Sistem yöneticileri tüm verilere erişebilir
- **Eşleşme Görünürlüğü**: LOST/FOUND status'undaki cihazlar tüm kullanıcılara görünür

### **Veri Şifreleme**
- **Kargo Adresleri**: `cargo_shipments` tablosunda encrypted
- **Kart Bilgileri**: İyzico tarafında saklanıyor
- **Kişisel Bilgiler**: Supabase Auth ile korunuyor

### **Audit Trail**
- **Tüm İşlemler**: `audit_logs` tablosunda loglanıyor
- **Mali İşlemler**: `financial_audit_trail` tablosunda
- **Güvenlik Olayları**: `security_audit_events` tablosunda

---

## 🚨 **KRİTİK SORUNLAR VE ÇÖZÜMLERİ**

### **1. Enum Tutarsızlığı** ✅ ÇÖZÜLDÜ
- **Sorun**: `PAYMENT_COMPLETE = "payment_complete"` vs kodda `'payment_completed'`
- **Çözüm**: Enum değeri `"payment_completed"` olarak düzeltildi

### **2. RLS Güvenlik Açığı** ⚠️ TEST AŞAMASINDA
- **Sorun**: Kritik tablolarda RLS kapalı
- **Durum**: Test tamamlanınca aktif edilecek
- **Risk**: Production'a geçmeden önce mutlaka aktif edilmeli

### **3. Hardcoded Fallback'ler** ✅ ÇÖZÜLDÜ
- **Sorun**: DeviceCard.tsx'de hardcoded status mapping
- **Çözüm**: Enum düzeltildikten sonra kaldırıldı

---

## 📊 **TEST SENARYOLARI**

### **Temel Test Akışı**
1. **Kayıt**: Email/şifre ile kayıt
2. **Cihaz Ekleme**: Kayıp cihaz kaydı
3. **Eşleşme**: Seri numarası ile eşleşme
4. **Ödeme**: İyzico ile ödeme
5. **Kargo**: Kargo bilgileri girme
6. **Onay**: Teslimat onayı
7. **Escrow Release**: Para transferi

### **Test Verileri**
- **Cihaz Modelleri**: `device_models` tablosundan
- **Kargo Şirketleri**: `cargo_companies` tablosundan
- **Test Kartları**: İyzico sandbox kartları

---

## 🔧 **TEKNİK DETAYLAR**

### **Payment Gateway**
- **Provider**: İyzico
- **3D Secure**: Aktif
- **Callback**: `/api/webhooks/iyzico-3d-callback.ts`
- **Webhook**: `/api/webhooks/iyzico-callback.ts`

### **File Upload**
- **Storage**: Supabase Storage
- **Bucket**: `device-documents`
- **Security**: RLS ile korunuyor

### **Notifications**
- **Types**: Email, In-app
- **Message Keys**: i18n sistemi
- **Real-time**: Supabase Realtime

---

## 📈 **PERFORMANS VE ÖLÇEKLENEBİLİRLİK**

### **Database Optimizasyonu**
- **Indexes**: Primary keys ve foreign keys
- **Views**: Summary tabloları
- **Partitioning**: Audit logları için

### **Caching**
- **Device Models**: Frontend'de cache
- **User Sessions**: Supabase Auth
- **Static Assets**: CDN

---

## 🎯 **SONRAKI ADIMLAR**

### **Test Aşaması**
1. **Manuel Test**: Tüm süreçleri test et
2. **Payment Test**: İyzico sandbox ile test
3. **RLS Test**: Güvenlik politikalarını test et
4. **Performance Test**: Yük testi

### **Production Hazırlığı**
1. **RLS Aktifleştirme**: Kritik tablolarda RLS aç
2. **Environment Variables**: Production değerleri
3. **Monitoring**: Log ve error tracking
4. **Backup**: Database backup stratejisi

---

## 📚 **REFERANS DOSYALAR**

### **Ana Dokümantasyon**
- **`PROCESS_FLOW.md`**: Detaylı süreç akışı
- **`COMPLETE_DATABASE_SCHEMA.md`**: Veritabanı yapısı
- **`SYSTEM_ANALYSIS_REPORT.md`**: Bu rapor

### **Teknik Dokümantasyon**
- **`IYZICO_PRODUCTION_SETUP.md`**: İyzico kurulumu
- **`SECURITY_GUIDE.md`**: Güvenlik rehberi
- **`DEPLOYMENT_CHECKLIST.md`**: Deployment listesi

---

**Bu rapor, sistemin mevcut durumunu ve test sürecini başlatmak için gerekli tüm bilgileri içerir. Sonraki konuşmalarda bu raporu referans olarak kullanın.**
