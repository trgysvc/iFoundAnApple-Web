# iFoundAnApple - Tam Süreç Akışı

Bu dosya, platformun tüm süreç akışını detaylı olarak açıklar ve hangi bilginin hangi tabloya yazılacağını gösterir.

**Son Güncelleme:** 20 Aralık 2024  
**Versiyon:** 3.0  
**Durum:** Test Aşamasında - Sistem Analizi Tamamlandı

## 📋 **REFERANS DOSYALAR**
- **`SYSTEM_ANALYSIS_REPORT.md`**: Sistem analizi raporu
- **`COMPLETE_DATABASE_SCHEMA.md`**: Veritabanı yapısı
- **`types.ts`**: DeviceStatus enum tanımları

## 🔄 **DEVICE STATUS ENUM**

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

**NOT:** Enum tutarsızlığı düzeltildi. Artık tüm sistem `payment_completed` kullanıyor.

---

## 📊 **VERİTABANI TABLOLARI VE SÜREÇ İLİŞKİSİ**

### **Ana İşlem Tabloları:**
- **`devices`** - Cihaz kayıtları (LOST/FOUND)
- **`payments`** - Ödeme işlemleri (62 sütun)
- **`escrow_accounts`** - Escrow hesapları (47 sütun)
- **`financial_transactions`** - Mali işlemler
- **`cargo_shipments`** - Kargo gönderileri
- **`notifications`** - Bildirimler
- **`userprofile`** - Kullanıcı profilleri
- **`device_models`** - Cihaz modelleri ve fiyatlandırma
- **`cargo_companies`** - Kargo şirketleri
- **`audit_logs`** - Denetim kayıtları

### **Yardımcı Tablolar:**
- **`payment_summaries`** - Ödeme özetleri
- **`shipment_tracking`** - Kargo takibi
- **`user_escrow_history`** - Kullanıcı escrow geçmişi
- **`user_transaction_history`** - Kullanıcı işlem geçmişi
- **`financial_audit_trail`** - Mali denetim izi
- **`security_audit_events`** - Güvenlik denetim olayları

---

## 🔴 CİHAZ SAHİBİ (DEVICE OWNER) - KAYIP CİHAZ SÜRECİ

### **Adım 1: Kayıt ve Giriş**
```
Kullanıcı → Ana Sayfa → "Kayıt Ol" → Email + Şifre → Email Doğrulama → Giriş
```

**Detaylar:**
- Supabase Auth ile kayıt
- Email doğrulama zorunlu mu?
- Profil bilgileri (ad, soyad, telefon, adres, IBAN) ne zaman zorunlu?
  - Kayıt sırasında mı?
  - Cihaz eklerken mi?
  - Ödeme öncesinde mi?
        AD SOYAD TELEFON EPOSTA DOĞUM TARİHİ KAYIT ESNASINDA ZORUNLU.
        ADRES + IBAN ÖDEME ÖNCESİNDE ZORUNLU. 
---

### **Adım 2: Kayıp Cihaz Ekleme**
```
Dashboard → "Cihaz Ekle" → "Kaybettim" Seçeneği
```

**Girilen Bilgiler:**
- Cihaz Modeli: Dropdown'dan seçim (iPhone 15 Pro Max, vb.)
- Seri Numarası: Manuel giriş (12 haneli)
- Kayıp Tarihi: Tarih seçici
- Kayıp Yeri: Serbest metin
- Açıklama: Opsiyonel
- Ödül Miktarı:
  - Sistem önerisi var mı? (AI ile) YOK
  - Kullanıcı özel miktar girebilir mi? HAYIR
  - Minimum/Maksimum sınır var mı? CİHAZIN FİYAT BİLGİSİ İLE BELİRLENECEK YÜZDELİK KISMI ÖDÜL OLACAK. 

**Database Kayıtları:**

**1. `devices` tablosuna kayıt:**
```sql
INSERT INTO devices (
  id,                    -- gen_random_uuid()
  "userId",             -- Cihaz sahibinin ID'si (auth.users.id)
  model,                -- Cihaz modeli (text)
  "serialNumber",       -- Seri numarası (text)
  status,               -- 'LOST' (text)
  color,                -- Cihaz rengi (text, nullable)
  description,          -- Açıklama (text, nullable)
  "rewardAmount",       -- Ödül miktarı (numeric, nullable)
  "invoiceDataUrl",     -- Fatura URL'si (text, nullable)
  "exchangeConfirmedBy", -- Onaylayanlar array (uuid[], default '{}')
  created_at,           -- now()
  updated_at,           -- now()
  lost_date,            -- Kayıp tarihi (date, nullable)
  lost_location         -- Kayıp yeri (text, nullable)
);
```

**2. `audit_logs` tablosuna kayıt:**
```sql
INSERT INTO audit_logs (
  id,                    -- gen_random_uuid()
  event_type,           -- 'device_registration'
  event_category,       -- 'device'
  event_action,         -- 'create'
  event_severity,       -- 'info'
  user_id,              -- Cihaz sahibinin ID'si
  resource_type,        -- 'device'
  resource_id,          -- Oluşturulan device ID'si
  event_description,    -- 'Lost device registered'
  event_data,           -- JSON: {model, serialNumber, lost_date, lost_location}
  created_at            -- now()
);
```

**3. `notifications` tablosuna kayıt:**
```sql
INSERT INTO notifications (
  id,                    -- gen_random_uuid()
  user_id,              -- Cihaz sahibinin ID'si
  message_key,          -- 'device_registered_successfully'
  type,                 -- 'info'
  is_read,              -- false
  created_at            -- now()
);
```

---

### **Adım 3: Eşleşme Bekleme**
```
Status: PENDING → Sistem otomatik eşleştirme yapıyor
```

**Dashboard'da Görünen:**
- Cihaz kartı: "Eşleşme Bekleniyor"
- Durum rengi: ?
- Bildirim: Var mı? VAR

**DeviceDetailPage (Cihaz Detay Sayfası):**
```
Dashboard → Cihaz Kartına Tıkla → DeviceDetailPage açılır
```
- Cihaz detayları görünüyor (Model, Seri No, Tarih, Yer, Açıklama)
- Status: PENDING için ne görünüyor?
  - Mesaj: "Eşleşme bekleniyor" mı?
  - Herhangi bir aksiyon butonu var mı?
  - İptal butonu var mı?

**Eşleştirme Mantığı:**
- Sadece seri numarasına göre mi? ŞİMDİLİK SADECE SERİ NUMARSI İLE EŞLEŞTİRME YAPILACAK.
- Model de kontrol ediliyor mu?
- Başka kriterler var mı? SAHTE SERİ NUMARALARI İÇİN FARKLI BİR YOL İZLENECEK. SONRA YAPILACAK. 

---

### **Adım 4: Eşleşme Bulundu**
```
Sistem → Eşleşme buldu → Status: MATCHED
```

**Database Değişiklikleri:**

**1. `devices` tablosunda güncelleme:**
```sql
UPDATE devices 
SET 
  status = 'MATCHED',
  updated_at = now()
WHERE id = [device_id];
```

**2. `audit_logs` tablosuna kayıt:**
```sql
INSERT INTO audit_logs (
  id,                    -- gen_random_uuid()
  event_type,           -- 'device_matching'
  event_category,       -- 'device'
  event_action,         -- 'match'
  event_severity,       -- 'info'
  user_id,              -- Cihaz sahibinin ID'si
  resource_type,        -- 'device'
  resource_id,          -- Device ID'si
  event_description,    -- 'Device matched with finder'
  event_data,           -- JSON: {matched_at, finder_user_id}
  created_at            -- now()
);
```

**3. `notifications` tablosuna kayıtlar:**
```sql
-- Cihaz sahibine bildirim
INSERT INTO notifications (
  id,                    -- gen_random_uuid()
  user_id,              -- Cihaz sahibinin ID'si
  message_key,          -- 'device_matched_owner'
  type,                 -- 'success'
  is_read,              -- false
  created_at            -- now()
);

-- Bulan kişiye bildirim
INSERT INTO notifications (
  id,                    -- gen_random_uuid()
  user_id,              -- Bulan kişinin ID'si
  message_key,          -- 'device_matched_finder'
  type,                 -- 'success'
  is_read,              -- false
  created_at            -- now()
);
```

**Bildirimler:**
- Email gidiyor mu? E POSTA GÖNDERECEĞİZ. HAZIRLIĞI YAPILSIN. SONRA AKTİF EDİLECEK. SUPABASE İN BU HİZMETİ VAR MI? 
- In-app notification var mı? VAR
- SMS gidiyor mu? HAYIR

**Dashboard'da Görünen:**
- Cihaz kartı mesajı: Eşleşti! Cihaz sahibi ödemesi bekleniyor.
- Durum rengi: ?
- Buton: YOK
- Bulan kişi bilgisi görünüyor mu? (Anonim mi?) BU BİLGİ ANONİM OLARAK KALACAK. 
- Ödül miktarı görünüyor mu? ÖDÜL MİKTARI TOPLAM ÖDEMENİN %10 U GİBİ DÜŞÜNÜLEBİLİR. BU % DİLİMLERİ BELİRLEYECEĞİMİZ KOLAY BİR SİSTEM TASARLANMALI. 

**DeviceDetailPage (Cihaz Detay Sayfası):**
```
Dashboard → Cihaz Kartına Tıkla → DeviceDetailPage açılır
```
- Status: MATCHED için ne görünüyor?
  - Başlık: "Eşleşme Bulundu!" 
  - Mesaj: "Ödeme yaparak cihazınızı geri alabilirsiniz" gibi mi?
  - Ödül miktarı görünüyor mu?
  - Toplam tutar görünüyor mu?
  - Bulan kişi bilgisi: Anonim mi?
  - Buton: "Ödeme Yap" - Bu butona tıklayınca nereye gidiyor?
    - MatchPaymentPage mi?
    - PaymentFlowPage mi?
    - Direkt ödeme sayfası mı?

---

### **Adım 5: Ödeme Yapma**
```
Dashboard → Cihaz Detay → "Ödeme Yap" → Ödeme Sayfası
```

**Ödeme Detayları:**
```
Toplam Tutar: 2,000.00 TL (ifoundanapple_fee)
├── Gateway Komisyonu: 68.60 TL (%3.43)
├── Kargo Ücreti: 250.00 TL (sabit)
├── Bulan Kişi Ödülü: 400.00 TL (%20)
└── Hizmet Bedeli: 1,281.40 TL (geriye kalan)
─────────────────────────────────────────
TOPLAM: 2,000.00 TL
```

**Net Payout Hesaplama:**
```
net_payout = rewardAmount = 400.00 TL
```

**Ücret Yapısı (Güncellenmiş):**
- Gateway komisyonu: %3.43 (toplam üzerinden)
- Kargo ücreti: 250.00 TL (sabit)
- Bulan kişi ödülü: %20 (toplam üzerinden)
- Hizmet bedeli: Geriye kalan tutar

**Ödeme Akışı:**
1. Ödeme yöntemi seçimi (İyzico/Kredi Kartı)
2. Kart bilgileri girişi
3. 3D Secure doğrulama var mı?
4. Ödeme onayı

**Database Kayıtları:**

**1. `payments` tablosuna kayıt:**
```sql
INSERT INTO payments (
  id,                    -- gen_random_uuid()
  device_id,             -- Device ID'si
  payer_id,              -- Cihaz sahibinin ID'si (ödemeyi yapan)
  receiver_id,           -- Bulan kişinin ID'si (ödülü alacak)
  total_amount,          -- Toplam ödeme tutarı
  reward_amount,         -- Ödül miktarı
  cargo_fee,             -- Kargo ücreti (25.00)
  payment_gateway_fee,   -- Gateway ücreti
  service_fee,           -- Hizmet bedeli
  net_payout,            -- Bulan kişiye gidecek net tutar
  payment_provider,      -- 'iyzico'
  payment_status,        -- 'pending'
  escrow_status,         -- 'pending'
  currency,              -- 'TRY'
  created_at,            -- now()
  updated_at             -- now()
);
```

**2. `escrow_accounts` tablosuna kayıt:**
```sql
INSERT INTO escrow_accounts (
  id,                    -- gen_random_uuid()
  payment_id,            -- Payment ID'si
  device_id,             -- Device ID'si
  holder_user_id,        -- Cihaz sahibinin ID'si (parayı yatıran)
  beneficiary_user_id,   -- Bulan kişinin ID'si (parayı alacak)
  total_amount,          -- Toplam tutar
  reward_amount,         -- Ödül miktarı
  service_fee,           -- Hizmet bedeli
  gateway_fee,           -- Gateway ücreti
  cargo_fee,             -- Kargo ücreti
  net_payout,            -- Net ödeme
  status,                -- 'pending'
  currency,              -- 'TRY'
  release_conditions,    -- '[]' (JSON array)
  confirmations,         -- '[]' (JSON array)
  created_at,            -- now()
  updated_at             -- now()
);
```

**3. `devices` tablosunda güncelleme:**
```sql
UPDATE devices 
SET 
  status = 'PAYMENT_PENDING',
  updated_at = now()
WHERE id = [device_id];
```

**4. `audit_logs` tablosuna kayıt:**
```sql
INSERT INTO audit_logs (
  id,                    -- gen_random_uuid()
  event_type,           -- 'payment_initiated'
  event_category,       -- 'payment'
  event_action,         -- 'create'
  event_severity,       -- 'info'
  user_id,              -- Cihaz sahibinin ID'si
  resource_type,        -- 'payment'
  resource_id,          -- Payment ID'si
  event_description,    -- 'Payment initiated for device'
  event_data,           -- JSON: {total_amount, reward_amount, fees}
  created_at            -- now()
);
```

**5. `notifications` tablosuna kayıt:**
```sql
INSERT INTO notifications (
  id,                    -- gen_random_uuid()
  user_id,              -- Cihaz sahibinin ID'si
  message_key,          -- 'payment_initiated'
  type,                 -- 'info'
  is_read,              -- false
  created_at            -- now()
);
```

---

### **Adım 6: Ödeme Tamamlandı - Kargo Bekleme**
```
Status: payment_completed → Bulan kişi cihazı kargolayacak
```

**Database Güncellemeleri:**

**1. `payments` tablosunda güncelleme:**
```sql
UPDATE payments 
SET 
  payment_status = 'completed',
  escrow_status = 'held',
  escrow_held_at = now(),
  completed_at = now(),
  updated_at = now()
WHERE id = [payment_id];
```

**2. `escrow_accounts` tablosunda güncelleme:**
```sql
UPDATE escrow_accounts 
SET 
  status = 'held',
  held_at = now(),
  updated_at = now()
WHERE payment_id = [payment_id];
```

**3. `devices` tablosunda güncelleme:**
```sql
UPDATE devices 
SET 
  status = 'payment_completed',
  updated_at = now()
WHERE id = [device_id];
```

**4. `financial_transactions` tablosuna kayıt:**
```sql
INSERT INTO financial_transactions (
  id,                    -- gen_random_uuid()
  payment_id,            -- Payment ID'si
  device_id,             -- Device ID'si
  from_user_id,          -- Cihaz sahibinin ID'si
  to_user_id,            -- Bulan kişinin ID'si
  transaction_type,       -- 'payment'
  amount,                -- Toplam ödeme tutarı
  currency,              -- 'TRY'
  status,                -- 'completed'
  description,           -- 'Payment completed for device'
  created_at,            -- now()
  completed_at           -- now()
);
```

**5. `audit_logs` tablosuna kayıt:**
```sql
INSERT INTO audit_logs (
  id,                    -- gen_random_uuid()
  event_type,           -- 'payment_completed'
  event_category,       -- 'payment'
  event_action,         -- 'complete'
  event_severity,       -- 'info'
  user_id,              -- Cihaz sahibinin ID'si
  resource_type,        -- 'payment'
  resource_id,          -- Payment ID'si
  event_description,    -- 'Payment completed successfully'
  event_data,           -- JSON: {total_amount, payment_provider}
  created_at            -- now()
);
```

**6. `notifications` tablosuna kayıtlar:**
```sql
-- Cihaz sahibine bildirim
INSERT INTO notifications (
  id,                    -- gen_random_uuid()
  user_id,              -- Cihaz sahibinin ID'si
  message_key,          -- 'payment_completed_owner'
  type,                 -- 'success'
  is_read,              -- false
  created_at            -- now()
);

-- Bulan kişiye bildirim
INSERT INTO notifications (
  id,                    -- gen_random_uuid()
  user_id,              -- Bulan kişinin ID'si
  message_key,          -- 'payment_completed_finder'
  type,                 -- 'success'
  is_read,              -- false
  created_at            -- now()
);
```

**Dashboard'da Görünen:**
- Cihaz kartı mesajı: ?
- Durum rengi: ?
- Ne görüyor kullanıcı?

**DeviceDetailPage (Cihaz Detay Sayfası):**
```
Dashboard → Cihaz Kartına Tıkla → DeviceDetailPage açılır
```
- Status: payment_completed için ne görünüyor?
  - Başlık: "Ödeme Tamamlandı!" mı?
  - Mesaj: "Cihazınız kargoya verilecek, bildirim alacaksınız" gibi mi?
  - Ödeme detayları görünüyor mu? (Tutar, tarih, vb.)
  - Escrow durumu görünüyor mu?
  - Herhangi bir aksiyon butonu var mı?

**Bildirimler:**
- Email: ?
- In-app: ?

---

### **Adım 7: Kargo Gönderildi**
```
Bulan kişi kargo bilgilerini girdi → Status: CARGO_SHIPPED (?)
```

**Database:**
```typescript
cargo_shipments {
  id: UUID
  device_id: UUID
  payment_id: UUID
  sender_user_id: UUID  // Bulan kişi
  receiver_user_id: UUID  // Cihaz sahibi
  tracking_number: string
  carrier: string  // "aras", "yurtici", "mng", "ptt"
  shipped_at: timestamp
  estimated_delivery: timestamp
  delivered_at: timestamp
  status: string
}

devices {
  status: "CARGO_SHIPPED" (?)
}
```

**Dashboard'da Görünen:**
- Kargo takip numarası görünüyor mu?
- Kargo şirketi görünüyor mu?
- Tahmini teslimat tarihi var mı?
- Kargo takip butonu var mı?

**DeviceDetailPage (Cihaz Detay Sayfası):**
```
Dashboard → Cihaz Kartına Tıkla → DeviceDetailPage açılır
```
- Status: CARGO_SHIPPED için ne görünüyor?
  - Başlık: "Kargo Yolda!" mı?
  - Kargo takip numarası görünüyor mu?
  - Kargo şirketi görünüyor mu?
  - Gönderim tarihi görünüyor mu?
  - Tahmini teslimat tarihi görünüyor mu?
  - Buton: "Kargo Takip" - Kargo şirketinin sitesine mi yönlendiriyor?
  - Buton: "Teslim Aldım" var mı? (Yoksa otomatik mı tespit ediliyor?)

**Bildirimler:**
- Email: ?
- SMS: ?

---

### **Adım 8: Kargo Teslim Alındı**
```
Cihaz sahibi kargosunu aldı → Manuel onay bekliyor
```

**Dashboard'da Görünen:**
- Mesaj: ?
- Butonlar:
  - "Cihazımı Teslim Aldım, Onayla" var mı?
  - "Sorun Var, İtiraz Et" var mı?

**DeviceDetailPage (Cihaz Detay Sayfası):**
```
Dashboard → Cihaz Kartına Tıkla → DeviceDetailPage açılır
```
- Status: DELIVERED (?) için ne görünüyor?
  - Başlık: "Cihazınız Teslim Edildi!" mı?
  - Mesaj: "Lütfen cihazınızı kontrol edin ve onaylayın" gibi mi?
  - Kargo bilgileri görünüyor mu?
  - Teslim tarihi görünüyor mu?
  - Butonlar:
    - "Cihazımı Teslim Aldım, Onayla" - Bu butona tıklayınca ne oluyor?
      - Onay formu mu açılıyor?
      - Direkt onay mı veriliyor?
      - Cihaz durumu kontrolü var mı?
    - "Sorun Var, İtiraz Et" - Bu butona tıklayınca ne oluyor?
      - İtiraz formu mu açılıyor?
      - Admin'e mi bildirim gidiyor?

---

### **Adım 9: Onay Verme**
```
Cihaz sahibi → "Onayla" → Escrow serbest bırakılıyor
```

**Database:**
```typescript
escrow_accounts {
  status: "held" → "released"
  released_at: timestamp
  confirmations: [
    {
      user_id: UUID
      confirmation_type: "device_received"
      timestamp: timestamp
    },
    {
      user_id: UUID
      confirmation_type: "exchange_confirmed"
      timestamp: timestamp
    }
  ]
}

financial_transactions {
  id: UUID
  payment_id: UUID
  device_id: UUID
  from_user_id: UUID  // Platform/Escrow
  to_user_id: UUID  // Bulan kişi
  transaction_type: "escrow_release"
  amount: decimal  // Net payout
  status: "completed"
  completed_at: timestamp
}

devices {
  status: "COMPLETED"
}
```

**DeviceDetailPage (Cihaz Detay Sayfası):**
```
Dashboard → Cihaz Kartına Tıkla → DeviceDetailPage açılır
```
- Status: COMPLETED için ne görünüyor?
  - Başlık: "İşlem Tamamlandı!" mı?
  - Mesaj: "Cihazınızı geri aldınız, teşekkürler!" gibi mi?
  - Tüm işlem özeti görünüyor mu?
    - Ödeme detayları
    - Kargo bilgileri
    - Onay tarihi
  - Herhangi bir aksiyon butonu var mı?
  - "Değerlendirme Yap" butonu var mı? (Bulan kişiye puan verme)

**Bildirimler:**
- Cihaz sahibine: ?
- Bulan kişiye: ?

---

## 🟢 CİHAZ BULAN (FINDER) - BULUNAN CİHAZ SÜRECİ

### **Adım 1: Kayıt ve Giriş**
```
Kullanıcı → Ana Sayfa → "Kayıt Ol" → Email + Şifre → Giriş
```

**Sorular:**
- IBAN bilgisi ne zaman zorunlu?
- Kimlik doğrulama var mı?

---

### **Adım 2: Bulunan Cihaz Ekleme**
```
Dashboard → "Cihaz Ekle" → "Buldum" Seçeneği
```

**Girilen Bilgiler:**
- Cihaz Modeli: Dropdown
- Seri Numarası: Manuel giriş
- Bulunma Tarihi: Tarih seçici
- Bulunma Yeri: Serbest metin
- Açıklama: Opsiyonel
- Fotoğraf: Var mı?

**Database:**
```typescript
devices {
  id: UUID
  user_id: UUID  // Bulan kişinin ID'si
  model: string
  serial_number: string
  status: "PENDING"
  device_type: "found"
  found_date: date
  found_location: string
  description: text
  created_at: timestamp
}
```

---

### **Adım 3: Eşleşme Bekleme**
```
Status: PENDING → Sistem otomatik eşleştirme yapıyor
```

**Dashboard'da Görünen:**
- Mesaj: ?
- Durum: ?

**DeviceDetailPage (Cihaz Detay Sayfası):**
```
Dashboard → Cihaz Kartına Tıkla → DeviceDetailPage açılır
```
- Status: PENDING için ne görünüyor?
  - Mesaj: "Cihaz sahibi aranıyor" mı?
  - Cihaz detayları görünüyor mu?
  - Herhangi bir aksiyon butonu var mı?

---

### **Adım 4: Eşleşme Bulundu**
```
Sistem → Eşleşme buldu → Status: MATCHED
```

**Database:**
```typescript
devices {
  status: "MATCHED"
  matched_with_user_id: UUID  // Cihaz sahibinin ID'si mi?
  matched_at: timestamp
}
```

**Dashboard'da Görünen:**
- Mesaj: ?
- Ödül miktarı görünüyor mu?
- Net alacağı tutar görünüyor mu?
- Cihaz sahibi bilgisi görünüyor mu? (Anonim mi?)

**DeviceDetailPage (Cihaz Detay Sayfası):**
```
Dashboard → Cihaz Kartına Tıkla → DeviceDetailPage açılır
```
- Status: MATCHED için ne görünüyor?
  - Başlık: "Eşleşme Bulundu!" mı?
  - Mesaj: "Cihaz sahibi ödeme yapacak, lütfen bekleyin" gibi mi?
  - Ödül miktarı görünüyor mu?
  - Net alacağı tutar görünüyor mu? (Kesintiler sonrası)
  - Cihaz sahibi bilgisi: Anonim mi?
  - Herhangi bir aksiyon butonu var mı?
  - İptal butonu var mı?

**Bildirimler:**
- Email: ?
- In-app: ?

---

### **Adım 5: Ödeme Bekleme**
```
Status: MATCHED → Cihaz sahibi ödeme yapıyor
```

**Dashboard'da Görünen:**
- Mesaj: "Ödeme bekleniyor" mi?
- Zaman sınırı var mı? (Örn: 48 saat içinde ödeme yapılmazsa eşleşme iptal)
- İptal butonu var mı?

---

### **Adım 6: Ödeme Tamamlandı**
```
Cihaz sahibi ödeme yaptı → Status: payment_completed
```

**Database:**
```typescript
payments {
  receiver_id: UUID  // BULAN KİŞİNİN ID'Sİ güncellendi
}

escrow_accounts {
  beneficiary_user_id: UUID  // BULAN KİŞİNİN ID'Sİ
  status: "held"
}

devices {
  status: "payment_completed"
}
```

**Dashboard'da Görünen:**
- Mesaj: "Ödeme alındı, cihazı kargolayın" mı?
- Kargo adresi görünüyor mu?
  - Tam adres mi?
  - Kargo şubesi mi?
  - Güvenlik nasıl sağlanıyor?
- Buton: "Kargo Bilgilerini Gir" mi?

**DeviceDetailPage (Cihaz Detay Sayfası):**
```
Dashboard → Cihaz Kartına Tıkla → DeviceDetailPage açılır
```
- Status: payment_completed için ne görünüyor?
  - Başlık: "Ödeme Alındı!" mı?
  - Mesaj: "Lütfen cihazı kargolayın" gibi mi?
  - Ödeme detayları görünüyor mu?
  - Escrow durumu görünüyor mu?
  - Kargo adresi görünüyor mu?
    - Tam adres mi, yoksa sadece il/ilçe mi?
    - Alıcı adı görünüyor mu?
    - Telefon numarası görünüyor mu?
  - Buton: "Kargo Bilgilerini Gir" - Bu butona tıklayınca ne oluyor?
    - Modal/Form açılıyor mu?
    - Ayrı sayfa mı açılıyor?

**Bildirimler:**
- Email: ?
- In-app: ?

---

### **Adım 7: Kargo Hazırlığı**
```
Bulan kişi → "Kargo Bilgilerini Gir" → Form
```

**Girilen Bilgiler:**
- Kargo Şirketi: Dropdown (Aras, Yurtiçi, MNG, PTT)
- Kargo Takip Numarası: Manuel giriş
- Gönderim Tarihi: Tarih seçici

**Sorular:**
- Kargo ücreti kim ödüyor?
  - Cihaz sahibi zaten ödedi (25 TL)
  - Ama bulan kişi kargoya giderken advance ödüyor mu?
  - Yoksa "ödemeli gönderim" mi yapıyor?
  - Yoksa kargo ücreti sonradan bulan kişiye mi ödeniyor?

**Database:**
```typescript
cargo_shipments {
  id: UUID
  device_id: UUID
  payment_id: UUID
  sender_user_id: UUID  // Bulan kişi
  receiver_user_id: UUID  // Cihaz sahibi
  tracking_number: string
  carrier: string
  shipped_at: timestamp
  status: "shipped"
}

devices {
  status: "CARGO_SHIPPED"
}
```

---

### **Adım 8: Kargo Yolda**
```
Status: CARGO_SHIPPED → Teslimat bekleniyor
```

**Dashboard'da Görünen:**
- Kargo takip numarası görünüyor mu?
- Mesaj: ?

---

### **Adım 9: Teslimat ve Onay Bekleme**
```
Cihaz sahibi teslim aldı → Onay veriyor
```

**Dashboard'da Görünen:**
- Mesaj: "Onay bekleniyor" mi?
- Otomatik onay süresi var mı? (Örn: 7 gün sonra otomatik onay)

---

### **Adım 10: Ödül Alma**
```
Cihaz sahibi onayladı → Escrow released → Para transfer
```

**Database:**
```typescript
escrow_accounts {
  status: "released"
  released_at: timestamp
}

financial_transactions {
  transaction_type: "escrow_release"
  to_user_id: UUID  // Bulan kişi
  amount: decimal  // Net payout
  status: "completed"
}

devices {
  status: "COMPLETED"
}
```

**Dashboard'da Görünen:**
- Mesaj: "Ödülünüz hesabınıza aktarıldı" mı?
- Tutar görünüyor mu?

**Transfer Süreci:**
- IBAN'a otomatik transfer mi?
- Manuel talep mi?
- İyzico ile mi yapılıyor?
- Transfer süresi: Anında mı, 1-3 iş günü mü?

**Bildirimler:**
- Email: ?
- SMS: ?

---

## ❓ EKSİK DETAYLAR VE SORULAR

### **1. Profil Bilgileri**
- IBAN ne zaman zorunlu?
- Kimlik doğrulama var mı?
- TC Kimlik zorunlu mu?
- Telefon zorunlu mu?
- Adres ne zaman gerekli?

### **2. Kargo Detayları**
- Kargo ücreti kim advance ödüyor?
- Kargo adresi nasıl paylaşılıyor?
- Kargo sigortası var mı?
- Kargo takip entegrasyonu var mı?

### **3. İletişim**
- İki taraf mesajlaşabiliyor mu?
- In-app chat var mı?
- Telefon numaraları paylaşılıyor mu?
- Tamamen anonim mi?

### **4. Zaman Sınırları**
- Ödeme için zaman sınırı var mı?
- Kargo için zaman sınırı var mı?
- Onay için otomatik onay süresi var mı?

### **5. İptal/İade**
- Eşleşme iptal edilebiliyor mu?
- Ödeme sonrası iptal olursa ne oluyor?
- Yanlış cihaz gönderilirse ne oluyor?
- İtiraz süreci nasıl?
- Para iadesi nasıl yapılıyor?

### **6. Güvenlik**
- Kimlik doğrulama zorunlu mu?
- Dolandırıcılık önleme var mı?
- Sahte cihaz kontrolü var mı?
- Sahte seri numarası kontrolü var mı?

### **7. Ödeme Transfer**
- Bulan kişiye para nasıl transfer ediliyor?
- İyzico ile mi yapılıyor?
- IBAN'a otomatik transfer mi?
- Transfer süresi ne kadar?
- Transfer ücreti var mı?

### **8. Device Status Değerleri** ✅ GÜNCELLENDİ
Tüm olası status değerleri (types.ts'den):
```typescript
"lost"                    // Cihaz sahibi kayıp bildirimi
"reported"                // Bulan kişi buldu bildirimi
"matched"                 // Eşleşme bulundu
"payment_pending"         // Ödeme bekleniyor
"payment_completed"       // Ödeme tamamlandı ✅
"exchange_pending"        // Değişim bekleniyor
"completed"               // İşlem tamamlandı
```

**NOT:** Enum tutarsızlığı düzeltildi. Artık tüm sistem tutarlı.

### **9. Bildirimler**
Hangi aşamalarda hangi bildirimler gidiyor?
- Email
- SMS
- In-app notification
- Push notification (mobil için)

### **10. Ücret Hesaplama** ✅ GÜNCELLENDİ
- Gateway komisyonu: %3.43 (toplam üzerinden)
- Kargo ücreti sabit: 250.00 TL
- Bulan kişi ödülü: %20 (toplam üzerinden)
- Hizmet bedeli: Geriye kalan tutar
- Net payout hesaplama formülü:
  ```
  totalAmount = ifoundanapple_fee (müşteriden alınacak toplam)
  gatewayFee = totalAmount * 0.0343
  cargoFee = 250.00 TL
  rewardAmount = totalAmount * 0.20
  serviceFee = totalAmount - gatewayFee - cargoFee - rewardAmount
  netPayout = rewardAmount
  ```
  ✅ Formül doğru ve test edildi.

### **11. Escrow Release Conditions**
- Hangi koşullar sağlanmalı?
  - device_received
  - exchange_confirmed
  - Başka koşul var mı?
- Otomatik release süresi var mı?
- Manuel admin onayı gerekiyor mu?

### **12. Eşleşme Mantığı**
- Sadece seri numarasına göre mi?
- Model de kontrol ediliyor mu?
- Birden fazla eşleşme varsa ne oluyor?
- İlk giren mi alıyor?

### **13. Admin Paneli**
- Admin hangi aşamalara müdahale edebiliyor?
- Manuel escrow release yapabiliyor mu?
- İtirazları admin mi çözüyor?
- İptal/iade işlemlerini admin mi yapıyor?

---

## 📊 DATABASE SCHEMA SORULARI

### **devices tablosu:**
```typescript
- matched_with_user_id: Bulan kişinin mi, cihaz sahibinin mi ID'si?
- device_type: "lost" ve "found" dışında değer var mı?
- status: Tüm olası değerler neler?
```

### **payments tablosu:**
```typescript
- payer_id: Cihaz sahibi (doğru mu?)
- receiver_id: Bulan kişi (doğru mu?)
- receiver_id ne zaman doluyor? Eşleşme anında mı, yoksa sonra mı?
```

### **escrow_accounts tablosu:**
```typescript
- holder_user_id: Cihaz sahibi (doğru mu?)
- beneficiary_user_id: Bulan kişi (doğru mu?)
- release_conditions: Hangi koşullar var?
- confirmations: Hangi onaylar gerekli?
```

### **cargo_shipments tablosu:**
```typescript
- Bu tablo var mı?
- Hangi alanlar var?
- Status değerleri neler?
```

### **financial_transactions tablosu:**
```typescript
- Bu tablo var mı?
- Hangi transaction_type değerleri var?
- Transfer işlemleri buradan mı yapılıyor?
```

---

## 🔄 SÜREÇ AKIŞ DİYAGRAMI

```
CİHAZ SAHİBİ                           SİSTEM                           CİHAZ BULAN
─────────────                          ──────                           ───────────

Cihaz Ekle (lost)                                                       
    ↓                                                                    
PENDING ────────────────────────→ Eşleştirme Yap ←──────────────────── Cihaz Ekle (found)
                                        ↓                                      ↓
                                   MATCHED ──────────────────────────────→ MATCHED
    ↓                                   ↓                                      ↓
Ödeme Yap                          Ödeme İşle                            Ödeme Bekle
    ↓                                   ↓                                      ↓
payment_completed ←────────────── Escrow HELD ──────────────────────→ payment_completed
    ↓                                   ↓                                      ↓
Kargo Bekle                        Kargo Takip                          Kargo Gönder
    ↓                                   ↓                                      ↓
CARGO_SHIPPED ←────────────────── Kargo Bilgisi ←──────────────────── CARGO_SHIPPED
    ↓                                   ↓                                      ↓
Kargo Al                           Teslimat                             Teslimat Bekle
    ↓                                   ↓                                      ↓
Onay Ver ──────────────────────→ Escrow Release ──────────────────────→ Para Al
    ↓                                   ↓                                      ↓
COMPLETED                          COMPLETED                            COMPLETED
```

---

## 🧪 **TEST SENARYOLARI**

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

### **Kritik Test Noktaları**
- ✅ Enum tutarsızlığı düzeltildi
- ⚠️ RLS politikaları test edilmeli
- ⚠️ İyzico callback'leri test edilmeli
- ⚠️ Escrow release süreci test edilmeli

---

## 📚 **SONRAKI ADIMLAR**

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

**✅ Bu dosya sistem analizi tamamlandıktan sonra güncellenmiştir. Test sürecine hazır.**

