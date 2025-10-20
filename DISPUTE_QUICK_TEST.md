# Dispute/İtiraz Yönetim Sistemi - Hızlı Test Rehberi

## 🚀 **Hızlı Başlangıç**

### **1. Test Sayfası ile Test**
```bash
# Development server başlat
npm run dev

# Tarayıcıda test sayfasını aç
http://localhost:5173/dispute-test
```

### **2. Manuel Test Adımları**

#### **A. DisputeForm Testi**
1. Test sayfasında "Testleri Başlat" butonuna tıkla
2. DisputeForm açılacak
3. Form alanlarını doldur:
   - İtiraz nedeni: "Cihaz hasarlı teslim edildi"
   - Detaylı açıklama: "Test açıklaması"
   - Fotoğraf yükle (opsiyonel)
4. "İtiraz Et" butonuna tıkla
5. Başarı mesajını kontrol et

#### **B. DisputeStatusCard Testi**
1. Test sayfasında kart bileşeni görünecek
2. Status rengini kontrol et (sarı - beklemede)
3. Tüm bilgilerin göründüğünü kontrol et
4. "Detayları Görüntüle" butonuna tıkla

### **3. API Testleri**

#### **A. Dispute Oluşturma**
```bash
curl -X POST http://localhost:5173/api/escrow/raise-dispute \
  -H "Content-Type: application/json" \
  -H "user-id: test-user-123" \
  -d '{
    "device_id": "test-device-123",
    "payment_id": "test-payment-123",
    "cargo_shipment_id": "test-cargo-123",
    "dispute_reason": "device_damaged",
    "notes": "Test dispute notes",
    "photos": []
  }'
```

#### **B. Kullanıcı İtirazları**
```bash
curl -X GET http://localhost:5173/api/disputes/user-disputes \
  -H "user-id: test-user-123"
```

#### **C. Admin İtirazları**
```bash
curl -X GET http://localhost:5173/api/admin/disputes \
  -H "user-id: admin-user-123"
```

### **4. Veritabanı Kontrolü**

#### **A. Supabase Dashboard'da SQL Sorguları**
```sql
-- Tüm dispute kayıtları
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

-- Dispute istatistikleri
SELECT 
  dispute_status,
  COUNT(*) as count
FROM escrow_accounts 
WHERE dispute_status IS NOT NULL
GROUP BY dispute_status;
```

### **5. Sayfa Testleri**

#### **A. Kullanıcı Dispute Sayfası**
```
http://localhost:5173/disputes
```
- Filtreleme testleri
- Dispute kartları
- Modal detayları

#### **B. Admin Dispute Sayfası**
```
http://localhost:5173/admin/disputes
```
- Admin fonksiyonları
- Çözüm formu
- Status güncellemeleri

### **6. Hata Durumu Testleri**

#### **A. Geçersiz API Çağrıları**
```bash
# Eksik parametreler
curl -X POST http://localhost:5173/api/escrow/raise-dispute \
  -H "Content-Type: application/json" \
  -d '{"device_id": "test"}'

# Yetkisiz erişim
curl -X GET http://localhost:5173/api/admin/disputes
```

#### **B. Frontend Hata Testleri**
- Ağ bağlantısını kes
- Geçersiz veri gönder
- Form validasyonlarını test et

## 📋 **Test Checklist**

### **✅ Temel Fonksiyonalite**
- [ ] DisputeForm açılıyor
- [ ] Form validasyonu çalışıyor
- [ ] Fotoğraf yükleme çalışıyor
- [ ] DisputeStatusCard render ediliyor
- [ ] Status renkleri doğru
- [ ] Modal detayları açılıyor

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

### **✅ Sayfa Fonksiyonları**
- [ ] DisputeManagementPage filtreleme
- [ ] AdminDisputePage admin fonksiyonları
- [ ] Test sayfası otomatik testleri
- [ ] Hata mesajları gösteriliyor

## 🔧 **Sorun Giderme**

### **A. API Hataları**
```bash
# API loglarını kontrol et
# Browser Developer Tools > Network tab
# Console'da hata mesajlarını kontrol et
```

### **B. Veritabanı Hataları**
```sql
-- Supabase Dashboard'da SQL Editor
-- Hata mesajlarını kontrol et
-- Tablo yapısını kontrol et
```

### **C. Frontend Hataları**
```bash
# Browser Developer Tools > Console
# React DevTools ile component state'ini kontrol et
# Network tab'da API çağrılarını kontrol et
```

## 📊 **Test Sonuçları**

### **Başarılı Test Sonuçları**
- ✅ DisputeForm: Form elementleri mevcut
- ✅ DisputeStatusCard: Kart bileşeni doğru render edildi
- ✅ API Endpoints: Raise dispute API çalışıyor
- ✅ User Disputes API: API çalışıyor, X dispute bulundu
- ✅ Admin Disputes API: API çalışıyor, X dispute bulundu
- ✅ Form Validation: Form validasyonu çalışıyor

### **Beklenen Hata Durumları**
- ❌ Geçersiz parametreler: 400 Bad Request
- ❌ Yetkisiz erişim: 401 Unauthorized
- ❌ Geçersiz status geçişi: Invalid status transition
- ❌ Form validasyonu: Boş alanlar için hata mesajı

## 🎯 **Test Tamamlama**

Tüm testler başarılı olduğunda:
1. ✅ Tüm API endpoints çalışıyor
2. ✅ Frontend bileşenleri doğru render ediliyor
3. ✅ Veritabanı kayıtları doğru oluşturuluyor
4. ✅ Form validasyonları çalışıyor
5. ✅ Hata durumları doğru işleniyor

**Dispute/İtiraz Yönetim Sistemi test edilmiş ve production'a hazır! 🚀**
