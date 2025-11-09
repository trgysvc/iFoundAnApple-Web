# Status Değiştirme ile Süreç Testi - Yol Haritası

Bu doküman, Supabase'de status enum'larını değiştirerek tüm sürecin ekranlarını ve tetikleme mekanizmalarını test etmek için adım adım yol haritasını içerir.

**⚠️ ÖNEMLİ:** Bu test yol haritası `device_role` sütununa göre çalışmaktadır. DeviceDetailPage'de gösterilen ekranlar `device_role` değerine göre belirlenir:
- `device_role = 'owner'` → Cihaz Sahibi ekranları gösterilir
- `device_role = 'finder'` → Bulan Kişi ekranları gösterilir

**Status değişse bile ekranlar doğru gösterilir çünkü `device_role` kayıt sırasında belirlenir ve değişmez.**

---

## 📋 ÖN HAZIRLIK

### Gereksinimler:
1. İki farklı kullanıcı hesabı (Kullanıcı A: Cihaz Sahibi, Kullanıcı B: Bulan Kişi)
2. Supabase Dashboard erişimi
3. Aynı model ve seri numaralı iki cihaz kaydı
4. `device_role` sütunu Supabase'de oluşturulmuş olmalı (migration çalıştırılmış olmalı)

### Hazırlık Adımları:
1. **Kullanıcı A** ile giriş yap → "Kayıp Cihaz Ekle" → Model: `iPhone 17 Pro Max`, Seri: `ABC123XYZ456`
   - Bu kayıt otomatik olarak `device_role = 'owner'` ile oluşturulacak
2. **Kullanıcı B** ile giriş yap → "Bulunan Cihaz Bildir" → Model: `iPhone 17 Pro Max`, Seri: `ABC123XYZ456`
   - Bu kayıt otomatik olarak `device_role = 'finder'` ile oluşturulacak
3. Sistem otomatik olarak eşleşme yapacak → Her iki cihazın status'u `matched` olacak
4. **device_role Kontrolü:**
   ```sql
   -- Owner'ın device_role'ü kontrol et
   SELECT id, status, device_role, "userId" 
   FROM devices 
   WHERE id = 'f61eccbe-c0d1-423b-9766-709dd5c8b06f';
   -- Beklenen: device_role = 'owner'
   
   -- Finder'ın device_role'ü kontrol et
   SELECT id, status, device_role, "userId" 
   FROM devices 
   WHERE id = '1f7aca93-a046-48b9-b471-8ae18843bcec';
   -- Beklenen: device_role = 'finder'
   ```

### 📌 Gerçek Değerler:
- **OWNER_DEVICE_ID:** `f61eccbe-c0d1-423b-9766-709dd5c8b06f`
- **FINDER_DEVICE_ID:** `1f7aca93-a046-48b9-b471-8ae18843bcec`
- **KULLANICI_A_USER_ID (Owner):** `81550ccd-bc38-4757-b94f-1bf4616f622f`
- **KULLANICI_B_USER_ID (Finder):** `df612602-69f0-4e3c-ac31-f23c5ada8d77`
- **Seri Numarası:** `ABC123XYZ456`
- **Model:** `iPhone 17 Pro Max`

---

## 🗺️ TEST SENARYOSU: Status Değiştirme ile Süreç Kontrolü

### **ADIM 1: Eşleşme Durumu Kontrolü (MATCHED)**

**Supabase'de Yapılacak İşlem:**
- Herhangi bir değişiklik gerekmez (eşleşme zaten otomatik yapılmış olmalı)

**Kontrol Edilecekler:**

**Kullanıcı A (Cihaz Sahibi) Ekranı - device_role='owner':**
- ✅ DeviceDetailPage açıldığında:
  - **Kontrol:** `device_role = 'owner'` olduğu için owner ekranı gösterilmeli
  - Başlık: "Eşleşme Bulundu! Ödeme Bekleniyor"
  - "Kayıp Cihaz Detayları" kartı görünüyor mu?
  - "İşlem Durumu" kartında "Ödeme Bekleniyor" mesajı var mı?
  - Durum Bilgisi'nde 2. adım aktif (turuncu renk) görünüyor mu?
  - "Ödemeyi Güvenle Yap" butonu görünüyor ve aktif mi?
  - "İşlemi İptal Et" butonu görünüyor mu? (paymentId varsa)
  - Console'da `isOriginalOwnerPerspective: true` görünüyor mu?

**Kullanıcı B (Bulan Kişi) Ekranı - device_role='finder':**
- ✅ DeviceDetailPage açıldığında:
  - **Kontrol:** `device_role = 'finder'` olduğu için finder ekranı gösterilmeli
  - Başlık: "Eşleşme Bulundu! Cihaz sahibinin ödeme yapması bekleniyor"
  - "Bulunan Cihaz Detayları" kartı görünüyor mu?
  - "İşlem Durumu" kartında "Eşleşme bulundu" mesajı var mı?
  - Durum Bilgisi'nde 2. adım aktif (turuncu renk) görünüyor mu?
  - Ödeme bilgisi gösterilmiyor mu?
  - Console'da `isOriginalOwnerPerspective: false` görünüyor mu?

**Real-time Kontrol:**
- ✅ Kullanıcı A'da status değiştiğinde, sayfa otomatik yenileniyor mu? (AppContext.tsx real-time subscription)

**SQL Kontrolü:**
```sql
-- Her iki cihazın da status'u 'matched' ve device_role'leri doğru olmalı
SELECT id, status, device_role, "userId", model, "serialNumber" 
FROM devices 
WHERE "serialNumber" = 'ABC123XYZ456' 
ORDER BY created_at;
-- Beklenen:
-- Owner: status='matched', device_role='owner'
-- Finder: status='matched', device_role='finder'
```

---

### **ADIM 2: Ödeme Başlatıldı Durumu (PAYMENT_PENDING)**

**Supabase'de Yapılacak İşlem:**
```sql
-- Kullanıcı A'nın cihazının status'unu güncelle
UPDATE devices 
SET status = 'payment_pending', updated_at = now()
WHERE "userId" = '81550ccd-bc38-4757-b94f-1bf4616f622f' 
  AND "serialNumber" = 'ABC123XYZ456' 
  AND status = 'lost';
```

**Not:** Eşleşme sonrası her iki cihazın status'u `matched` olur. Eğer sadece owner'ın cihazını güncellemek istiyorsanız:
```sql
-- Owner'ın cihazını bul (status = 'lost' olan)
UPDATE devices 
SET status = 'payment_pending', updated_at = now()
WHERE id = 'f61eccbe-c0d1-423b-9766-709dd5c8b06f';
```

**Kontrol Edilecekler:**

**Kullanıcı A (Cihaz Sahibi) Ekranı:**
- ✅ DeviceDetailPage yenilendiğinde:
  - Aynı MATCHED ekranı görünüyor mu? (çünkü PAYMENT_PENDING için özel ekran yok)
  - "Ödemeyi Güvenle Yap" butonu hala görünüyor mu?

**Kullanıcı B (Bulan Kişi) Ekranı:**
- ✅ DeviceDetailPage'de değişiklik var mı? (beklenen: yok)

**Real-time Kontrol:**
- ✅ Status değişikliği sayfada otomatik görünüyor mu?

**SQL Kontrolü:**
```sql
-- Status'un güncellendiğini kontrol et
SELECT id, status, updated_at 
FROM devices 
WHERE id = 'f61eccbe-c0d1-423b-9766-709dd5c8b06f';
```

---

### **ADIM 3: Ödeme Tamamlandı Durumu (PAYMENT_COMPLETED)**

**Supabase'de Yapılacak İşlem:**
```sql
-- Önce payment kaydı oluştur (eğer yoksa)
INSERT INTO payments (
  id,
  device_id,
  payer_id,
  receiver_id,
  total_amount,
  reward_amount,
  cargo_fee,
  payment_gateway_fee,
  service_fee,
  net_payout,
  payment_provider,
  payment_status,
  escrow_status,
  currency,
  completed_at,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'f61eccbe-c0d1-423b-9766-709dd5c8b06f',
  '81550ccd-bc38-4757-b94f-1bf4616f622f',
  'df612602-69f0-4e3c-ac31-f23c5ada8d77',
  2000.00,  -- total_amount
  400.00,   -- reward_amount (%20)
  250.00,   -- cargo_fee
  68.60,    -- gateway_fee (%3.43)
  1281.40,  -- service_fee
  400.00,   -- net_payout
  'test',
  'completed',
  'held',
  'TRY',
  now(),
  now(),
  now()
)
ON CONFLICT DO NOTHING;

-- Escrow kaydı oluştur (eğer yoksa)
INSERT INTO escrow_accounts (
  id,
  payment_id,
  device_id,
  holder_user_id,
  beneficiary_user_id,
  total_amount,
  reward_amount,
  service_fee,
  gateway_fee,
  cargo_fee,
  net_payout,
  status,
  currency,
  held_at,
  created_at,
  updated_at
) 
SELECT 
  gen_random_uuid(),
  p.id,
  p.device_id,
  p.payer_id,
  p.receiver_id,
  p.total_amount,
  p.reward_amount,
  p.service_fee,
  p.payment_gateway_fee,
  p.cargo_fee,
  p.net_payout,
  'held',
  p.currency,
  now(),
  now(),
  now()
FROM payments p
WHERE p.device_id = 'f61eccbe-c0d1-423b-9766-709dd5c8b06f'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Owner'ın cihazının status'unu güncelle
UPDATE devices 
SET status = 'payment_completed', updated_at = now()
WHERE id = 'f61eccbe-c0d1-423b-9766-709dd5c8b06f';

-- Finder'ın cihazının status'unu da güncelle
UPDATE devices 
SET status = 'payment_completed', updated_at = now()
WHERE id = '1f7aca93-a046-48b9-b471-8ae18843bcec';
```

**Kontrol Edilecekler:**

**Kullanıcı A (Cihaz Sahibi) Ekranı - device_role='owner':**
- ✅ DeviceDetailPage yenilendiğinde:
  - **Kontrol:** Status `payment_completed` olsa bile `device_role='owner'` olduğu için owner ekranı gösterilmeli
  - Başlık: "Ödemeniz Başarıyla Tamamlandı!"
  - "Kayıp Cihaz Detayları" kartı görünüyor mu?
  - "Ödeme Detayları" kartı görünüyor mu?
  - "Escrow Durumu" kartı görünüyor mu?
  - Durum Bilgisi'nde 3. adım aktif (turuncu renk) görünüyor mu?
  - "Kargoya verildiğinde takip numaranız burada görünecektir" mesajı var mı?
  - Console'da `isOriginalOwnerPerspective: true` görünüyor mu?

**Kullanıcı B (Bulan Kişi) Ekranı - device_role='finder':**
- ✅ DeviceDetailPage yenilendiğinde:
  - **Kontrol:** Status `payment_completed` olsa bile `device_role='finder'` olduğu için finder ekranı gösterilmeli
  - Başlık: "Ödeme Süreci Tamamlandı!"
  - "Bulunan Cihaz Detayları" kartı görünüyor mu?
    - ✅ Bulunma Tarihi: Görünüyor mu? (eğer null ise "Belirtilmemiş" yazmalı)
    - ✅ Bulunma Yeri: Görünüyor mu? (eğer null ise "Belirtilmemiş" yazmalı)
    - ✅ Cihaz Modeli: Görünüyor mu?
    - ✅ Cihaz Seri Numarası: Görünüyor mu?
    - ✅ Cihaz Rengi: Görünüyor mu?
    - ✅ Ek Detaylar: Görünüyor mu?
    - ✅ Bulunan Cihaz Fotoğrafı (Ön ve Arka): Görünüyor mu? (fotoğraf varsa tıklanabilir linkler olmalı, yoksa "Fotoğraf eklenmemiş" yazmalı)
  - "Cihazı kargo firmasına teslim edin" mesajı var mı?
  - IBAN bilgisi uyarısı görünüyor mu?
    - ✅ "⚠️ Ödülünüzü alabilmek için lütfen profil bilgilerinizi tamamlayın:" mesajı var mı?
    - ✅ "☐ TC Kimlik Numaranızı girin" checkbox'ı var mı?
    - ✅ "☐ IBAN bilgilerinizi ekleyin" checkbox'ı var mı?
  - Durum Bilgisi'nde 3. adım aktif (turuncu renk) görünüyor mu?
  - Teslim kodu gösteriliyor mu? (eğer cargo_shipments kaydı varsa)
    - ✅ "Kargo firmasına vereceğiniz **Teslim Kodunuz:**" mesajı var mı?
    - ✅ Teslim kodu numarası görünüyor mu? (cargo_shipments.code değeri)
  - Console'da `isOriginalOwnerPerspective: false` görünüyor mu?

**Real-time Kontrol:**
- ✅ Her iki kullanıcıda da sayfa otomatik yenileniyor mu?

**SQL Kontrolü:**
```sql
-- Payment ve escrow kayıtlarını kontrol et
SELECT p.*, e.status as escrow_status 
FROM payments p
LEFT JOIN escrow_accounts e ON e.payment_id = p.id
WHERE p.device_id = 'f61eccbe-c0d1-423b-9766-709dd5c8b06f';

-- Her iki cihazın status ve device_role'ünü kontrol et
SELECT id, status, device_role, "userId" 
FROM devices 
WHERE "serialNumber" = 'ABC123XYZ456';
-- Beklenen:
-- Owner: status='payment_completed', device_role='owner'
-- Finder: status='payment_completed', device_role='finder'
```

---

### **ADIM 4: Kargo Gönderildi Durumu (CARGO_SHIPPED)**

**Supabase'de Yapılacak İşlem:**
```sql
-- Önce cargo_shipments kaydı oluştur (eğer yoksa)
INSERT INTO cargo_shipments (
  id,
  device_id,
  payment_id,
  cargo_company,
  code,
  tracking_number,
  cargo_service_type,
  estimated_delivery_days,
  sender_anonymous_id,
  receiver_anonymous_id,
  sender_user_id,
  receiver_user_id,
  sender_address_encrypted,
  receiver_address_encrypted,
  status,
  cargo_status,
  cargo_fee,
  declared_value,
  generated_by,
  expires_at,
  picked_up_at,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'f61eccbe-c0d1-423b-9766-709dd5c8b06f',
  (SELECT id FROM payments WHERE device_id = 'f61eccbe-c0d1-423b-9766-709dd5c8b06f' LIMIT 1),
  'aras',
  'TEST123456',  -- Teslim kodu (kargo firması API'sinden gelir)
  'TRACK789012', -- Takip numarası
  'standard',
  2,
  'FND123456',  -- Bulan kişi anonim ID
  'OWN789012',  -- Cihaz sahibi anonim ID
  'df612602-69f0-4e3c-ac31-f23c5ada8d77',  -- Bulan kişi
  '81550ccd-bc38-4757-b94f-1bf4616f622f',  -- Cihaz sahibi
  'encrypted_sender_address',
  'encrypted_receiver_address',
  'used',        -- Teslim kodu kullanıldı
  'picked_up',   -- Kargo alındı
  250.00,
  2000.00,
  'df612602-69f0-4e3c-ac31-f23c5ada8d77',  -- Bulan kişi tarafından oluşturuldu
  now() + interval '7 days',
  now(),  -- Kargo alındı tarihi
  now(),
  now()
)
ON CONFLICT DO NOTHING;

-- Owner'ın cihazının status'unu güncelle
UPDATE devices 
SET status = 'cargo_shipped', updated_at = now()
WHERE id = 'f61eccbe-c0d1-423b-9766-709dd5c8b06f';

-- Finder'ın cihazının status'unu da güncelle
UPDATE devices 
SET status = 'cargo_shipped', updated_at = now()
WHERE id = '1f7aca93-a046-48b9-b471-8ae18843bcec';
```

**Kontrol Edilecekler:**

**Kullanıcı A (Cihaz Sahibi) Ekranı - device_role='owner':**
- ✅ DeviceDetailPage yenilendiğinde:
  - **Kontrol:** Status `cargo_shipped` olsa bile `device_role='owner'` olduğu için owner ekranı gösterilmeli
  - Başlık: "Cihazınız Kargo Firmasına Teslim Edildi!"
  - "Cihazınız yolda! Lütfen takip numarası ile kontrol edin." mesajı var mı?
  - Kargo takip numarası görünüyor mu? (cargo_shipments.tracking_number)
    - ✅ "Teslim/Takip için kargo numaranız: XXX" mesajı var mı?
    - ✅ Takip numarası görünüyor mu?
  - "Kayıp Cihaz Detayları" kartı görünüyor mu?
    - ✅ Kayıp Tarihi: Görünüyor mu?
    - ✅ Kayıp Yeri: Görünüyor mu?
    - ✅ Cihaz Modeli: Görünüyor mu?
    - ✅ Cihaz Seri Numarası: Görünüyor mu?
    - ✅ Cihaz Rengi: Görünüyor mu?
    - ✅ Ek Detaylar: Görünüyor mu?
    - ✅ Satın Alma Kanıtı (Fatura) Dosyası: Görünüyor mu? (varsa tıklanabilir link)
  - "İşlem Durumu" kartı görünüyor mu?
    - ✅ Durum mesajı: "Kayıtlı XXX seri numaralı YYY cihaz yolda. Kargo firması cihazı teslim edecek."
  - "Ödeme Detayları" kartı görünüyor mu? (varsa)
    - ✅ Ödeme ID: Görünüyor mu?
    - ✅ Toplam Tutar: Görünüyor mu?
    - ✅ Ödeme Durumu: "Tamamlandı" görünüyor mu?
    - ✅ Ödeme Sağlayıcı: Görünüyor mu? (varsa)
    - ✅ Ödeme Tarihi: Görünüyor mu? (varsa)
  - "Escrow Durumu" kartı görünüyor mu? (varsa)
    - ✅ Escrow ID: Görünüyor mu?
    - ✅ Durum: "Beklemede" görünüyor mu?
    - ✅ Escrow Tutarı: Görünüyor mu?
  - Durum Bilgisi'nde 3. adım aktif (turuncu renk) görünüyor mu?
    - ✅ 3. adım: "Cihazınızın size teslim edilmesi bekleniyor" görünüyor mu?
    - ✅ Takip numarası bu adımda gösteriliyor mu?
  - Console'da `isOriginalOwnerPerspective: true` görünüyor mu?

**Kullanıcı B (Bulan Kişi) Ekranı - device_role='finder':**
- ✅ DeviceDetailPage yenilendiğinde:
  - **Kontrol:** Status `cargo_shipped` olsa bile `device_role='finder'` olduğu için finder ekranı gösterilmeli
  - Başlık: "Cihaz Yola Çıktı!"
  - "Cihazı başarıyla kargoya teslim ettin. Sahibine ulaşması bekleniyor." mesajı var mı?
  - "Bulunan Cihaz Detayları" kartı görünüyor mu?
    - ✅ Bulunma Tarihi: Görünüyor mu?
    - ✅ Bulunma Yeri: Görünüyor mu?
    - ✅ Cihaz Modeli: Görünüyor mu?
    - ✅ Cihaz Seri Numarası: Görünüyor mu?
    - ✅ Cihaz Rengi: Görünüyor mu?
    - ✅ Ek Detaylar: Görünüyor mu?
    - ✅ Bulunan Cihaz Fotoğrafı (Ön ve Arka): Görünüyor mu? (varsa tıklanabilir linkler)
  - "İşlem Durumu" kartı görünüyor mu?
    - ✅ Durum mesajı: "Cihaz kargoya verildi. Sahibine teslim edilmesi bekleniyor."
  - Durum Bilgisi'nde 4. adım aktif (turuncu renk) görünüyor mu?
    - ✅ 4. adım: "Cihaz Sahibi Teslim Alındığında" görünüyor mu?
    - ✅ "Kargo firması cihazı sahibine teslim edecek. Onay bekleniyor." mesajı var mı?
  - Console'da `isOriginalOwnerPerspective: false` görünüyor mu?

**Real-time Kontrol:**
- ✅ Sayfa otomatik yenileniyor mu?

**SQL Kontrolü:**
```sql
-- Cargo shipment kaydını kontrol et
SELECT cs.*, d.status as device_status, d.device_role
FROM cargo_shipments cs
JOIN devices d ON d.id = cs.device_id
WHERE cs.device_id = 'f61eccbe-c0d1-423b-9766-709dd5c8b06f';

-- Her iki cihazın status ve device_role'ünü kontrol et
SELECT id, status, device_role, "userId" 
FROM devices 
WHERE "serialNumber" = 'ABC123XYZ456';
-- Beklenen:
-- Owner: status='cargo_shipped', device_role='owner'
-- Finder: status='cargo_shipped', device_role='finder'

-- Cargo shipment'te tracking_number var mı kontrol et
SELECT tracking_number, cargo_status, cargo_company
FROM cargo_shipments
WHERE device_id = 'f61eccbe-c0d1-423b-9766-709dd5c8b06f';
-- Beklenen: tracking_number dolu olmalı (örn: 'TRACK789012')

---

### **ADIM 5: Kargo Teslim Edildi Durumu (DELIVERED)**

**Supabase'de Yapılacak İşlem:**
```sql
-- Cargo shipment'in cargo_status'unu güncelle
UPDATE cargo_shipments 
SET 
  cargo_status = 'delivered',
  delivered_at = now(),
  updated_at = now()
WHERE device_id = 'f61eccbe-c0d1-423b-9766-709dd5c8b06f';

-- Owner'ın cihazının status'unu güncelle
UPDATE devices 
SET status = 'delivered', updated_at = now()
WHERE id = 'f61eccbe-c0d1-423b-9766-709dd5c8b06f';

-- Finder'ın cihazının status'unu da güncelle
UPDATE devices 
SET status = 'delivered', updated_at = now()
WHERE id = '1f7aca93-a046-48b9-b471-8ae18843bcec';
```

**Kontrol Edilecekler:**

**Kullanıcı A (Cihaz Sahibi) Ekranı - device_role='owner':**
- ✅ DeviceDetailPage yenilendiğinde:
  - **Kontrol:** Status `delivered` olsa bile `device_role='owner'` olduğu için owner ekranı gösterilmeli
  - Başlık: "Cihazınız Size Teslim Edildi!"
  - "Cihazınız teslim edildi. Lütfen Seri Numarasını Kontrol Edin ve Onaylayın" mesajı var mı?
  - "Kayıp Cihaz Detayları" kartı görünüyor mu?
  - Durum Bilgisi'nde 4. adım aktif (turuncu renk) görünüyor mu?
  - "Cihazımı Teslim Aldım, Onayla" butonu görünüyor ve aktif mi?
  - "Sorun Var, İtiraz Et" butonu görünüyor mu?
  - Console'da `isOriginalOwnerPerspective: true` görünüyor mu?

**Kullanıcı B (Bulan Kişi) Ekranı - device_role='finder':**
- ✅ DeviceDetailPage yenilendiğinde:
  - **Kontrol:** Status `delivered` olsa bile `device_role='finder'` olduğu için finder ekranı gösterilmeli
  - Başlık: "Teslimat Tamamlandı! Onay Bekleniyor."
  - "Bulunan Cihaz Detayları" kartı görünüyor mu?
  - "Kargo firması cihazı sahibine teslim etti" mesajı var mı?
  - "48 saat içinde onaylanmazsa otomatik onaylanacak" uyarısı var mı?
  - Durum Bilgisi'nde 4. adım aktif (turuncu renk) görünüyor mu?
  - Console'da `isOriginalOwnerPerspective: false` görünüyor mu?

**Real-time Kontrol:**
- ✅ Sayfa otomatik yenileniyor mu?

**SQL Kontrolü:**
```sql
-- Cargo shipment durumunu kontrol et
SELECT cs.cargo_status, cs.delivered_at, d.status as device_status, d.device_role
FROM cargo_shipments cs
JOIN devices d ON d.id = cs.device_id
WHERE cs.device_id = 'f61eccbe-c0d1-423b-9766-709dd5c8b06f';

-- Her iki cihazın status ve device_role'ünü kontrol et
SELECT id, status, device_role, "userId" 
FROM devices 
WHERE "serialNumber" = 'ABC123XYZ456';
-- Beklenen:
-- Owner: status='delivered', device_role='owner'
-- Finder: status='delivered', device_role='finder'
```

---

### **ADIM 6: Teslim Onaylandı Durumu (CONFIRMED → COMPLETED)**

**⚠️ ÖNEMLİ HAZIRLIK:**
1. Önce şu migration script'lerini çalıştırın:
   - `database/migrations/add_escrow_fields_to_financial_transactions.sql`
   - `database/migrations/add_escrow_release_to_transaction_type.sql`
2. Migration'ların başarılı olduğunu kontrol edin:
   ```sql
   -- escrow_id, confirmed_by, confirmation_type sütunları var mı?
   SELECT column_name FROM information_schema.columns 
   WHERE table_name = 'financial_transactions' 
   AND column_name IN ('escrow_id', 'confirmed_by', 'confirmation_type');
   
   -- Constraint'te escrow_release var mı?
   SELECT pg_get_constraintdef(oid) 
   FROM pg_constraint 
   WHERE conname = 'financial_transactions_transaction_type_check';
   ```

**Supabase'de Yapılacak İşlem:**
```sql
-- ============================================
-- ADIM 1: Delivery confirmation kaydı oluştur
-- ============================================
INSERT INTO delivery_confirmations (
  id,
  device_id,
  payment_id,
  cargo_shipment_id,
  confirmed_by,
  confirmation_type,
  confirmation_data,
  confirmed_at,
  created_at
) VALUES (
  gen_random_uuid(),
  'f61eccbe-c0d1-423b-9766-709dd5c8b06f',
  (SELECT id FROM payments WHERE device_id = 'f61eccbe-c0d1-423b-9766-709dd5c8b06f' LIMIT 1),
  (SELECT id FROM cargo_shipments WHERE device_id = 'f61eccbe-c0d1-423b-9766-709dd5c8b06f' LIMIT 1),
  '81550ccd-bc38-4757-b94f-1bf4616f622f',
  'device_received',
  '{"serial_number_verified": true, "condition": "good"}'::jsonb,
  now(),
  now()
);

-- ============================================
-- ADIM 2: Cargo shipment'i güncelle
-- ============================================
UPDATE cargo_shipments 
SET 
  delivery_confirmed_by_receiver = true,
  delivery_confirmation_date = now(),
  delivery_confirmation_id = (SELECT id FROM delivery_confirmations WHERE device_id = 'f61eccbe-c0d1-423b-9766-709dd5c8b06f' ORDER BY created_at DESC LIMIT 1),
  cargo_status = 'confirmed',
  updated_at = now()
WHERE device_id = 'f61eccbe-c0d1-423b-9766-709dd5c8b06f';

-- ============================================
-- ADIM 3: Escrow'u serbest bırak
-- ============================================
UPDATE escrow_accounts 
SET 
  status = 'released',
  released_at = now(),
  release_reason = 'Device received and confirmed by owner',
  released_by = '81550ccd-bc38-4757-b94f-1bf4616f622f',
  updated_at = now()
WHERE payment_id = (SELECT id FROM payments WHERE device_id = 'f61eccbe-c0d1-423b-9766-709dd5c8b06f' LIMIT 1);

-- ============================================
-- ADIM 4: Payment'ı tamamlandı olarak işaretle
-- ============================================
UPDATE payments 
SET 
  payment_status = 'completed',
  escrow_status = 'released',
  escrow_released_at = now(),
  completed_at = now(),
  updated_at = now()
WHERE device_id = 'f61eccbe-c0d1-423b-9766-709dd5c8b06f';

-- ============================================
-- ADIM 5: Constraint'i düzelt (ZORUNLU!)
-- ============================================
-- Bu adımı her zaman çalıştırın (idempotent)
ALTER TABLE public.financial_transactions 
DROP CONSTRAINT IF EXISTS financial_transactions_transaction_type_check;

ALTER TABLE public.financial_transactions
ADD CONSTRAINT financial_transactions_transaction_type_check
CHECK (transaction_type IN ('payment', 'refund', 'refund_issued', 'escrow_release', 'escrow_refund', 'escrow_hold', 'transfer', 'fee', 'adjustment', 'reward_payout', 'reward_transfer'));

-- ============================================
-- ADIM 6: Financial transaction kaydı oluştur
-- ============================================
INSERT INTO financial_transactions (
  id,
  escrow_id,
  payment_id,
  device_id,
  transaction_type,
  amount,
  currency,
  status,
  description,
  from_user_id,
  to_user_id,
  confirmed_by,
  confirmation_type,
  completed_at,
  created_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM escrow_accounts WHERE payment_id = (SELECT id FROM payments WHERE device_id = 'f61eccbe-c0d1-423b-9766-709dd5c8b06f' LIMIT 1) LIMIT 1),
  (SELECT id FROM payments WHERE device_id = 'f61eccbe-c0d1-423b-9766-709dd5c8b06f' LIMIT 1),
  'f61eccbe-c0d1-423b-9766-709dd5c8b06f',
  'escrow_release',
  (SELECT net_payout FROM escrow_accounts WHERE payment_id = (SELECT id FROM payments WHERE device_id = 'f61eccbe-c0d1-423b-9766-709dd5c8b06f' LIMIT 1) LIMIT 1),
  'TRY',
  'completed',
  'Escrow release: Device received and confirmed',
  NULL,  -- Platform/Escrow hesabı
  'df612602-69f0-4e3c-ac31-f23c5ada8d77',  -- Bulan kişi
  '81550ccd-bc38-4757-b94f-1bf4616f622f',  -- Cihaz sahibi (confirmed_by)
  'device_received',
  now(),
  now()
);

-- ============================================
-- ADIM 7: Owner'ın cihazının status'unu güncelle
-- ============================================
UPDATE devices 
SET 
  status = 'completed',
  delivery_confirmed_at = now(),
  final_payment_distributed_at = now(),
  updated_at = now()
WHERE id = 'f61eccbe-c0d1-423b-9766-709dd5c8b06f';

-- ============================================
-- ADIM 8: Finder'ın cihazının status'unu güncelle
-- ============================================
UPDATE devices 
SET 
  status = 'completed',
  updated_at = now()
WHERE id = '1f7aca93-a046-48b9-b471-8ae18843bcec';

-- ============================================
-- ADIM 9: Bildirimler oluştur
-- ============================================
-- Bulan kişiye bildirim (ödül serbest bırakıldı)
INSERT INTO notifications (
  id,
  user_id,
  message_key,
  link,
  is_read,
  created_at,
  type
) VALUES (
  gen_random_uuid(),
  'df612602-69f0-4e3c-ac31-f23c5ada8d77',  -- Bulan kişi
  'reward_released',
  '/device/1f7aca93-a046-48b9-b471-8ae18843bcec',
  false,
  now(),
  'success'
);

-- Cihaz sahibine bildirim (işlem tamamlandı)
INSERT INTO notifications (
  id,
  user_id,
  message_key,
  link,
  is_read,
  created_at,
  type
) VALUES (
  gen_random_uuid(),
  '81550ccd-bc38-4757-b94f-1bf4616f622f',  -- Cihaz sahibi
  'transactionCompletedOwner',
  '/device/f61eccbe-c0d1-423b-9766-709dd5c8b06f',
  false,
  now(),
  'success'
);

-- ============================================
-- ADIM 10: Audit log kaydı oluştur
-- ============================================
INSERT INTO audit_logs (
  id,
  event_type,
  event_category,
  event_action,
  event_severity,
  user_id,
  resource_type,
  resource_id,
  event_description,
  event_data,
  created_at
) VALUES (
  gen_random_uuid(),
  'escrow_released',
  'financial',
  'release',
  'info',
  '81550ccd-bc38-4757-b94f-1bf4616f622f',  -- Cihaz sahibi
  'escrow',
  (SELECT id FROM escrow_accounts WHERE payment_id = (SELECT id FROM payments WHERE device_id = 'f61eccbe-c0d1-423b-9766-709dd5c8b06f' LIMIT 1) LIMIT 1),
  'Escrow released after device confirmation',
  jsonb_build_object(
    'payment_id', (SELECT id FROM payments WHERE device_id = 'f61eccbe-c0d1-423b-9766-709dd5c8b06f' LIMIT 1),
    'device_id', 'f61eccbe-c0d1-423b-9766-709dd5c8b06f',
    'net_payout', (SELECT net_payout FROM escrow_accounts WHERE payment_id = (SELECT id FROM payments WHERE device_id = 'f61eccbe-c0d1-423b-9766-709dd5c8b06f' LIMIT 1) LIMIT 1),
    'released_at', now()
  ),
  now()
);

**Kontrol Edilecekler:**

**Kullanıcı A (Cihaz Sahibi) Ekranı - device_role='owner':**
- ✅ DeviceDetailPage yenilendiğinde:
  - **Kontrol:** Status `completed` olsa bile `device_role='owner'` olduğu için owner ekranı gösterilmeli
  - Başlık: "Cihazınıza Kavuştuğunuz için Çok Mutluyuz!"
  - "Süreci başarı ile tamamladık" mesajı var mı?
  - "Kayıp Cihaz Detayları" kartı görünüyor mu?
    - ✅ Kayıp Tarihi: Görünüyor mu?
    - ✅ Kayıp Yeri: Görünüyor mu?
    - ✅ Cihaz Modeli: Görünüyor mu?
    - ✅ Cihaz Seri Numarası: Görünüyor mu?
    - ✅ Cihaz Rengi: Görünüyor mu?
    - ✅ Ek Detaylar: Görünüyor mu?
    - ✅ Satın Alma Kanıtı (Fatura) Dosyası: Görünüyor mu? (varsa tıklanabilir link)
  - "İşlem Durumu" kartı görünüyor mu?
    - ✅ Durum mesajı: "Kayıtlı XXX seri numaralı YYY cihaz teslim edildi. Teslim alma onaylandı."
  - "Ödeme Detayları" kartı görünüyor mu? (varsa)
    - ✅ Ödeme ID: Görünüyor mu?
    - ✅ Toplam Tutar: Görünüyor mu? (formatlanmış)
    - ✅ Ödeme Durumu: "Tamamlandı" görünüyor mu?
    - ✅ Ödeme Sağlayıcı: Görünüyor mu? (varsa)
    - ✅ Ödeme Tarihi: Görünüyor mu? (varsa)
  - "Escrow Durumu" kartı görünüyor mu? (varsa)
    - ✅ Escrow ID: Görünüyor mu?
    - ✅ Durum: "Serbest Bırakıldı" görünüyor mu?
    - ✅ Escrow Tutarı: Görünüyor mu? (formatlanmış)
    - ✅ Serbest Bırakılma Tarihi: Görünüyor mu? (varsa)
  - Durum Bilgisi'nde 5. adım aktif (yeşil renk) görünüyor mu?
    - ✅ 5. adım: "İşlem Tamamlandı" görünüyor mu?
    - ✅ "Cihazınıza kavuştuğunuz için mutluyuz" mesajı var mı?
  - "CİHAZLARIM LİSTESİNE GERİ DÖN" butonu görünüyor mu?
  - Console'da `isOriginalOwnerPerspective: true` görünüyor mu?

**Kullanıcı B (Bulan Kişi) Ekranı - device_role='finder':**
- ✅ DeviceDetailPage yenilendiğinde:
  - **Kontrol:** Status `completed` olsa bile `device_role='finder'` olduğu için finder ekranı gösterilmeli
  - Başlık: "İşlem Başarıyla Tamamlandı!"
  - "Yardımın için teşekkür ederiz! Ödülün, belirttiğin IBAN adresine transfer edildi" mesajı var mı?
  - "Bulunan Cihaz Detayları" kartı görünüyor mu?
    - ✅ Bulunma Tarihi: Görünüyor mu?
    - ✅ Bulunma Yeri: Görünüyor mu?
    - ✅ Cihaz Modeli: Görünüyor mu?
    - ✅ Cihaz Seri Numarası: Görünüyor mu?
    - ✅ Cihaz Rengi: Görünüyor mu?
    - ✅ Ek Detaylar: Görünüyor mu?
    - ✅ Bulunan Cihaz Fotoğrafı (Ön ve Arka): Görünüyor mu? (varsa tıklanabilir linkler)
  - "İşlem Durumu" kartı görünüyor mu?
    - ✅ Durum mesajı: "İşlem tamamlandı. Ödülün gönderildi."
  - Durum Bilgisi'nde 5. adım aktif (yeşil renk) görünüyor mu?
    - ✅ 5. adım: "İşlem Tamamlandı" görünüyor mu?
    - ✅ "Takas tamamlandığında ödülünüz hesabınıza aktarıldı" mesajı var mı?
  - "DASHBOARDA DÖN" butonu görünüyor mu?
  - Console'da `isOriginalOwnerPerspective: false` görünüyor mu?

**Real-time Kontrol:**
- ✅ Sayfa otomatik yenileniyor mu?

**SQL Kontrolü:**

NOT: Bu sorguları tek tek çalıştırın. ```sql bloğunu kopyalamayın, sadece SQL sorgusunu çalıştırın.

-- 1. Delivery confirmation kaydını kontrol et
SELECT dc.*, cs.cargo_status, cs.delivery_confirmed_by_receiver
FROM delivery_confirmations dc
JOIN cargo_shipments cs ON cs.id = dc.cargo_shipment_id
WHERE dc.device_id = 'f61eccbe-c0d1-423b-9766-709dd5c8b06f';
-- Beklenen: delivery_confirmed_by_receiver=true, cargo_status='confirmed'

-- 2. Escrow durumunu kontrol et
SELECT ea.status, ea.released_at, ea.released_by, p.payment_status, p.escrow_status, p.escrow_released_at
FROM escrow_accounts ea
JOIN payments p ON p.id = ea.payment_id
WHERE ea.payment_id = (SELECT id FROM payments WHERE device_id = 'f61eccbe-c0d1-423b-9766-709dd5c8b06f' LIMIT 1);
-- Beklenen: ea.status='released', p.payment_status='completed', p.escrow_status='released'

-- 3. Financial transaction kaydını kontrol et
SELECT ft.*, ea.status as escrow_status
FROM financial_transactions ft
LEFT JOIN escrow_accounts ea ON ea.id = ft.escrow_id
WHERE ft.device_id = 'f61eccbe-c0d1-423b-9766-709dd5c8b06f'
  AND ft.transaction_type = 'escrow_release'
ORDER BY ft.created_at DESC
LIMIT 1;
-- Beklenen: transaction_type='escrow_release', status='completed', confirmed_by IS NOT NULL

-- 4. Bildirimleri kontrol et
SELECT id, user_id, message_key, type, is_read, created_at 
FROM notifications 
WHERE user_id IN ('81550ccd-bc38-4757-b94f-1bf4616f622f', 'df612602-69f0-4e3c-ac31-f23c5ada8d77')
  AND message_key IN ('reward_released', 'transactionCompletedOwner')
ORDER BY created_at DESC;
-- Beklenen: 
-- Bulan kişiye: message_key='reward_released'
-- Cihaz sahibine: message_key='transactionCompletedOwner'

-- 5. Audit log kaydını kontrol et
SELECT event_type, event_category, event_action, event_description, user_id, resource_type, created_at
FROM audit_logs
WHERE event_type = 'escrow_released'
  AND resource_type = 'escrow'
ORDER BY created_at DESC
LIMIT 1;
-- Beklenen: event_type='escrow_released', event_action='release', event_category='financial'

-- 6. Her iki cihazın status ve device_role'ünü kontrol et
SELECT id, status, device_role, "userId", delivery_confirmed_at, final_payment_distributed_at
FROM devices 
WHERE "serialNumber" = 'ABC123XYZ456';
-- Beklenen:
-- Owner: status='completed', device_role='owner', delivery_confirmed_at IS NOT NULL, final_payment_distributed_at IS NOT NULL
-- Finder: status='completed', device_role='finder'

---

## 🔍 TETİKLEME MEKANİZMALARI KONTROLÜ

### Real-time Subscription Kontrolü

**Kontrol Edilecekler:**
1. ✅ `AppContext.tsx` içinde real-time subscription aktif mi?
2. ✅ Status değiştiğinde sayfa otomatik yenileniyor mu?
3. ✅ Console'da "Real-time device change received" log'u görünüyor mu?

**Test Senaryosu:**
```sql
-- Supabase'de status'u değiştir
UPDATE devices SET status = 'matched' WHERE id = 'f61eccbe-c0d1-423b-9766-709dd5c8b06f';
```
→ Sayfa otomatik yenilenmeli ve yeni status görünmeli

---

### Bildirim Sistemi Kontrolü

**Kontrol Edilecekler:**
Her status değişikliğinde uygun bildirimler oluşturuluyor mu?

**Test Senaryosu:**
```sql
-- Bildirimleri kontrol et
SELECT id, user_id, message_key, type, is_read, created_at 
FROM notifications 
WHERE user_id IN ('81550ccd-bc38-4757-b94f-1bf4616f622f', 'df612602-69f0-4e3c-ac31-f23c5ada8d77')
ORDER BY created_at DESC;
```

**Beklenen Bildirimler:**
- `matchFoundOwner` / `matchFoundFinder` (MATCHED durumunda)
- `payment_completed_owner` / `payment_received_finder` (PAYMENT_COMPLETED durumunda)
- `package_shipped` (CARGO_SHIPPED durumunda)
- `package_delivered_confirm` (DELIVERED durumunda)
- `reward_released` / `transactionCompletedOwner` (COMPLETED durumunda)

---

### Audit Log Kontrolü

**Kontrol Edilecekler:**
Her status değişikliğinde audit log kaydı oluşturuluyor mu?

**Test Senaryosu:**
```sql
-- Audit logları kontrol et
SELECT event_type, event_category, event_action, event_description, created_at
FROM audit_logs
WHERE resource_id = 'f61eccbe-c0d1-423b-9766-709dd5c8b06f'
ORDER BY created_at DESC;
```

---

## ⚠️ ÖNEMLİ NOTLAR

1. **Device ID ve device_role Bulma:**
   ```sql
   -- Owner'ın device ID'sini ve device_role'ünü bul
   SELECT id, device_role, status FROM devices 
   WHERE "userId" = '81550ccd-bc38-4757-b94f-1bf4616f622f' 
     AND "serialNumber" = 'ABC123XYZ456';
   -- Sonuç: id='f61eccbe-c0d1-423b-9766-709dd5c8b06f', device_role='owner'
   
   -- Finder'ın device ID'sini ve device_role'ünü bul
   SELECT id, device_role, status FROM devices 
   WHERE "userId" = 'df612602-69f0-4e3c-ac31-f23c5ada8d77' 
     AND "serialNumber" = 'ABC123XYZ456';
   -- Sonuç: id='1f7aca93-a046-48b9-b471-8ae18843bcec', device_role='finder'
   
   -- Her iki cihazı birlikte kontrol et
   SELECT id, device_role, status, "userId" 
   FROM devices 
   WHERE "serialNumber" = 'ABC123XYZ456' 
   ORDER BY device_role;
   ```

2. **Payment ID Bulma:**
   ```sql
   SELECT id FROM payments WHERE device_id = 'f61eccbe-c0d1-423b-9766-709dd5c8b06f';
   ```

3. **Cargo Shipment ID Bulma:**
   ```sql
   SELECT id FROM cargo_shipments WHERE device_id = 'f61eccbe-c0d1-423b-9766-709dd5c8b06f';
   ```

4. **Escrow ID Bulma:**
   ```sql
   SELECT id FROM escrow_accounts 
   WHERE payment_id = (SELECT id FROM payments WHERE device_id = 'f61eccbe-c0d1-423b-9766-709dd5c8b06f' LIMIT 1);
   ```

---

## 📊 TEST SONUÇLARI TABLOSU

| Adım | Status | Owner Ekranı<br/>(device_role='owner') | Finder Ekranı<br/>(device_role='finder') | Real-time | Bildirim | Audit Log |
|------|--------|----------------------------------------|-------------------------------------------|-----------|----------|-----------|
| 1 | MATCHED | ✅ | ✅ | ✅ | ✅ | ✅ |
| 2 | PAYMENT_PENDING | ✅ | ✅ | ✅ | - | ✅ |
| 3 | PAYMENT_COMPLETED | ✅ | ✅ | ✅ | ✅ | ✅ |
| 4 | CARGO_SHIPPED | ✅ | ✅ | ✅ | ✅ | ✅ |
| 5 | DELIVERED | ✅ | ✅ | ✅ | ✅ | ✅ |
| 6 | COMPLETED | ✅ | ✅ | ✅ | ✅ | ✅ |

**Not:** Tüm durumlarda ekranlar `device_role` sütununa göre belirlenir. Status değişse bile doğru ekran gösterilir.

---

## 🚀 HIZLI TEST KOMUTLARI

### Tüm Süreci Hızlıca Test Etmek İçin:

```sql
-- 1. MATCHED durumuna getir
UPDATE devices SET status = 'matched' WHERE "serialNumber" = 'ABC123XYZ456';

-- 2. PAYMENT_COMPLETED durumuna getir
UPDATE devices SET status = 'payment_completed' WHERE "serialNumber" = 'ABC123XYZ456';

-- 3. CARGO_SHIPPED durumuna getir
UPDATE devices SET status = 'cargo_shipped' WHERE "serialNumber" = 'ABC123XYZ456';

-- 4. DELIVERED durumuna getir
UPDATE devices SET status = 'delivered' WHERE "serialNumber" = 'ABC123XYZ456';

-- 5. COMPLETED durumuna getir
UPDATE devices SET status = 'completed' WHERE "serialNumber" = 'ABC123XYZ456';
```

**Not:** Bu hızlı komutlar sadece device status'unu değiştirir. Tam test için yukarıdaki detaylı adımları takip edin.

---

## 📝 TEST RAPORU ŞABLONU

Her adım için şu bilgileri not edin:

- [ ] Status değişikliği başarılı mı?
- [ ] Ekran doğru görüntüleniyor mu?
- [ ] Real-time güncelleme çalışıyor mu?
- [ ] Bildirimler oluşturuluyor mu?
- [ ] Audit log kaydediliyor mu?
- [ ] Hata var mı? (varsa detaylı açıklama)

---

## 🔑 device_role Kontrolü

**Her test adımında kontrol edilmesi gerekenler:**

1. **device_role Doğru mu?**
   ```sql
   SELECT id, device_role, status, "userId" 
   FROM devices 
   WHERE "serialNumber" = 'ABC123XYZ456';
   ```
   - Owner kaydı: `device_role = 'owner'` olmalı
   - Finder kaydı: `device_role = 'finder'` olmalı

2. **Console Log Kontrolü:**
   - Browser Console'da şu log'lar görünmeli:
     ```
     DeviceDetailPage: Device role: owner (veya finder)
     DeviceDetailPage: isOriginalOwnerPerspective: true/false (determined from device_role)
     ```

3. **Ekran Kontrolü:**
   - Owner için: "Kayıp Cihaz Detayları" kartı görünmeli
   - Finder için: "Bulunan Cihaz Detayları" kartı görünmeli
   - Status ne olursa olsun bu ayrım korunmalı

---

**Son Güncelleme:** 2025-01-XX
**Test Sürümü:** 2.0 (device_role entegrasyonu ile güncellendi)

