# iFoundAnApple - Tam Süreç Akışı

Bu dosya, platformun tüm süreç akışını detaylı olarak açıklar ve hangi bilginin hangi tabloya yazılacağını gösterir. Lütfen eksik veya yanlış kısımları düzeltin.
---

## TAM SÜREÇ ADIMLARI

1.  Cihaz kaybeden kayıt yapıyor. 
2.  Cihazı bulan kayıt yapıyor
3.  Cihaz eşleşiyor
4.  Cihazı kaybeden ödemesini yapıyor.
5.  Ödeme alınıp sistemnde bekletiliyor.
6.  Ödeme alındıktan sonra kargo firması teslim-takip numarası üretiliyor. 
7.  Cihazı bulan kargo firmasına teslim-takip numarası ile cihazı teslim ediyor. (kargo firmasının ekranında kimlik bilgileri gizli)
8.  Kargo firması cihazı sahibine teslim ediliyor
9.  Cihazın sahibi cihaz eline geçince onaylıyor
10. Sistemde bekletilen para para serbest bırakılarak ödeme altyapıcının işlem ücreti + kargo firması ücreti + bulan kişinin hediye Ücreti + iFoundAnApple servis ücreti ödeniyor. 
11. İşlem tamamlanıyor.
---

## 🔄 **DEVICE STATUS ENUM**

```typescript
export enum DeviceStatus {
  LOST = "lost",            // Cihaz sahibi kayıp bildirimi
  REPORTED = "reported",    // Bulan kişi buldu bildirimi  
  MATCHED = "matched",      // Cihaz eşleşiyor
  PAYMENT_PENDING = "payment_pending",   // Cihazı kaybeden ödemesini yapıyor
  PAYMENT_COMPLETED = "payment_completed", // Ödeme emanet sisteminde bekletiliyor
  CARGO_SHIPPED = "cargo_shipped",   // Cihazı bulan kargo firmasına kod ile teslim ediyor
  DELIVERED = "delivered",           // Kargo firması cihazı sahibine teslim ediyor
  CONFIRMED = "confirmed",           // Cihazın sahibi cihaz eline geçince onaylıyor
  COMPLETED = "completed",           // İşlem tamamlanıyor
  DISPUTED = "disputed",	           // İptal-iade bölümü
   // --- Yeni Eklenen İstisnai Durumlar ---
  CANCELLED = "cancelled",       // İşlem, kargoya verilmeden taraflardan biri veya sistem tarafından iptal edildi
  RETURNED = "returned",         // Cihaz, alıcıya teslim edilemediği için göndericiye iade sürecinde/edildi
  FAILED_DELIVERY = "failed_delivery" // Kargo firması teslimatı denedi ancak başarısız oldu (adres yanlış, alıcı yok vb.)
}
```
## 📦 **KARGO STATUS ENUM**

export enum CargoStatus {
  PENDING = "pending",          // Kargo kodu üretildi, bulan kişinin kargoya teslim etmesi bekleniyor
  PICKED_UP = "picked_up",      // Bulan kişi cihazı kargo firmasına teslim etti
  IN_TRANSIT = "in_transit",    // Cihaz kargo firması ile yolda, sahibine doğru gidiyor
  DELIVERED = "delivered",      // Kargo firması cihazı sahibinin adresine teslim etti, sahibinin onayı bekleniyor
  CONFIRMED = "confirmed"       // Cihaz sahibi teslim aldığını sistem üzerinden onayladı
    // --- Yeni Eklenen İstisnai Durumlar ---
  FAILED_DELIVERY = "failed_delivery", // Teslimat denendi, başarısız
  RETURNED = "returned",             // Göndericiye iade ediliyor/edildi
  CANCELLED = "cancelled"              // Kargo işlemi iptal edildi
}


## 📊 VERİTABANI TABLOLARI VE SÜREÇ İLİŞKİSİ

Ana İşlem Tabloları:
devices - Cihaz kayıtları (LOST/FOUND, DeviceStatus durumunu içerir)
payments - Ödeme işlemleri
escrow_accounts - Escrow hesapları
financial_transactions - Mali işlemler
cargo_shipments  -  Kargo gönderi kayıtları. Bizim ürettiğimiz teslim kodunu, kargo firmasının takip numarasını, kargo şirketini ve CargoStatus ENUM'u ile kargonun detaylı durumunu içerir.
notifications - Bildirimler
userprofile - Kullanıcı profilleri
device_models - Cihaz modelleri ve fiyatlandırma
cargo_companies - Kargo şirketleri
audit_logs - Denetim kayıtları
invoice_logs - Fatura yükleme ve doğrulama logları

Süreç Tabloları :
delivery_confirmations - Teslimat onay sistemi
final_payment_distributions - Son ödeme dağıtım sistemi
payment_transfers - Ödeme transfer kayıtları

View/Summary Tabloları:
payment_summaries - Ödeme özetleri
user_escrow_history - Kullanıcı escrow geçmişi
user_transaction_history - Kullanıcı işlem geçmişi
financial_audit_trail - Mali denetim izi
security_audit_events - Güvenlik denetim olayları




## 🔴 CİHAZ SAHİBİ (DEVICE OWNER) - KAYIP CİHAZ SÜRECİ

### **Adım 1: Kayıt ve Giriş**
```
Kullanıcı → Ana Sayfa → "Kayıt Ol" ; Ad + Soyad + Email + Şifre + Hizmet ŞArtları ve Gizlilik Politikası Kabulü → Giriş
Kullanıcı → Ana Sayfa → "Kayıt Ol" ; Google ile Giriş Yap veya Apple ile Giriş Yap → Giriş
```
Kayıt Formu (RegisterPage.tsx)
Kullanıcı kayıt formunda şu bilgiler toplanır:
Email (zorunlu)
Şifre (zorunlu)
Ad (firstName) (zorunlu)
Soyad (lastName) (zorunlu)
Kullanım şartları onayı (zorunlu)

Kayıt İşlemi (AppContext.tsx - register fonksiyonu)
const register = async (userData, pass: string): Promise<boolean> => {
  // Supabase Auth'a kayıt
  const { data: signUpData, error } = await supabase.auth.signUp({
    email: userData.email,
    password: pass,
    options: {
      data: {
        first_name: userData.firstName,
        last_name: userData.lastName,
        full_name: userData.fullName,
      },
    },
  });
  
  // Profil tablosuna kayıt
  await createUserProfile(signUpData.user.id, {
    firstName: userData.firstName,
    lastName: userData.lastName,
  });
}
---
Veri Yazılan Tablolar
A. Supabase Auth Tablosu (auth.users)
id (UUID) - Otomatik oluşturulan kullanıcı ID'si
email - Kullanıcı email adresi
encrypted_password - Şifrelenmiş şifre
user_metadata (JSONB) - İsim bilgileri:
first_name
last_name
full_name
created_at - Kayıt tarihi
email_confirmed_at - Email onay tarihi
B. userprofile Tablosu
INSERT INTO userprofile (
  user_id,           -- auth.users.id'ye referans
  first_name,        -- Ad
  last_name,         -- Soyad
  created_at,        -- Oluşturulma tarihi
  updated_at         -- Güncellenme tarihi
)
---
Profil Bilgileri Yönetimi
1. Profil Sayfası (ProfilePage.tsx)
Kullanıcı profil sayfasında şu bilgiler yönetilir:
Kişisel Bilgiler:
Ad (firstName) - zorunlu
Soyad (lastName) - zorunlu
Email - değiştirilemez
Doğum tarihi (dateOfBirth) - opsiyonel
TC Kimlik No (tcKimlikNo) - opsiyonel
Telefon numarası (phoneNumber) - opsiyonel
Adres (address) - opsiyonel
Banka Bilgileri:
IBAN (iban) - opsiyonel (ödül ödemeleri için)
2. Profil Güncelleme Süreci (AppContext.tsx - updateUserProfile)
const updateUserProfile = async (profileData) => {
  // 1. Supabase Auth metadata güncelleme
  await supabase.auth.updateUser({
    data: {
      first_name: profileData.firstName,
      last_name: profileData.lastName,
      full_name: fullName,
    },
  });

  // 2. userprofile tablosu güncelleme/ekleme
  await supabase.from("userprofile").upsert({
    user_id: currentUser.id,
    first_name: profileData.firstName,
    last_name: profileData.lastName,
    date_of_birth: profileData.dateOfBirth,
    tc_kimlik_no: profileData.tcKimlikNo,
    phone_number: profileData.phoneNumber,
    address: profileData.address,
    iban: profileData.iban,
    bank_info: profileData.iban, // Geriye uyumluluk için
    updated_at: new Date().toISOString(),
  });
}
---
3. Güncellenen Tablolar
A. Supabase Auth Tablosu (auth.users)
user_metadata güncellenir:
first_name
last_name
full_name
B. userprofile Tablosu
UPDATE userprofile SET
  first_name = ?,
  last_name = ?,
  date_of_birth = ?,
  tc_kimlik_no = ?,
  phone_number = ?,
  address = ?,
  iban = ?,
  bank_info = ?,  -- IBAN ile aynı değer
  updated_at = NOW()
WHERE user_id = ?
---


**Detaylar:**
Ad/Soyad: Zorunlu, text sanitization
Eposta: Zorunlu, e-mail formatı
Doğum tarihi: Geçerli tarih, gelecek tarih kontrolü, minimum 13 yaş (COPPA uyumu), Boş ise ödemeyi güvenle yap butonu pasif
TC Kimlik: 11 haneli, algoritma doğrulaması, Boş ise ödemeyi güvenle yap butonu pasif. veritabanında şifrelenerek (encryption at rest) sakla
Telefon: Zorunlu, Türk telefon numarası formatı
IBAN: TR ile başlayan 26 haneli format, Boş ise ödemeyi güvenle yap butonu pasif (Bu kural sadece Cihazı Bulan (Finder) kullanıcılar için geçerli olmalıdır. Cihaz Sahibi'nden IBAN istenmemeli veya zorunlu tutulmamalıdır.)
Adres: Boş ise ödemeyi güvenle yap butonu pasif. veritabanında şifrelenerek (encryption at rest) sakla
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

### **Adım 3: Eşleşme Bekleme**
```
Status: LOST → Sistem otomatik eşleştirme yapıyor
```

**Dashboard'da Görünen:**
- Cihaz kartı: "Eşleşme Bekleniyor"
- Durum rengi: Turuncu/Sarı
- Bildirim: Var mı? VAR

**DeviceDetailPage (Cihaz Detay Sayfası):**
```
Dashboard → Cihaz Kartına Tıkla → DeviceDetailPage açılır
```
DeviceDetailPage içeriği

-Başlık:
✅
Cihazınızın Kaydı Başarıyla Tamamlandı!
Kayıp cihazınız sisteme kaydedildi. Eşleşme bulunduğunda size bildirim gönderilecektir.
-"Kayıp Cihaz Detayları" Kartı
Kayıp Tarihi:
Kayıp Yeri:
Cihaz Modeli:
Cihaz Seri Numarası:
Cihaz Rengi:
Ek Detaylar:
Satın Alma Kanıtı (Fatura) Dosyası:
-"İşlem Durumu" Kartı
Durum:  Kayıtlı XXX seri numaralı YYY cihazı eşleşme bekleniyor.
-"Durum Bilgisi" Kartı (1 numarası seçenek aktif turuncu renk. diğerleri pasif durumda.)
1 Cihaz için eşleşme bekleniyor
2 Cihazınız bulundu
    Ödemenizi yapmak ve takas sürecini tamamlamak için "Ödemeyi güvenle yap Butonu"
3 Cihazınızın kargo ile teslim edilmesi bekleniyor
    Teslim/Takip için kargo numaranız: XXX
4 Cihaz Teslim Alındığında
    Cihazın seri numarasını kontrol edip teslim aldığınızı onaylayın "Onay Butonu"
5 İşlem Tamamlandı
    Cihazınıza kavuştuğunuz için mutluyuz.
---

**Eşleştirme Mantığı:**
- Model ve Seri Numarasına göre eşleştirme yapılır. 
- Sahte seri numaralı cihazlar için inceleme yapılacak farklı bir strateji ile daha sonra şekillenecek. 
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
- In-app notification 
- e-posta : (Supabase Edge Functions kullanarak Resend veya SendGrid gibi popüler e-posta servisleriyle çok kolay bir entegrasyon kurabilirsiniz)

**Dashboard'da Görünen:**
- Cihaz kartı mesajı: Eşleşti! Cihaz sahibi ödemesi bekleniyor.
- Durum rengi: Yeşil 
- Buton: YOK

**DeviceDetailPage (Cihaz Detay Sayfası):**
```
Dashboard → Cihaz Kartına Tıkla → DeviceDetailPage açılır
```
DeviceDetailPage içeriği

-Başlık:
✅
Eşleşme Bulundu!
Eşleşme Bulundu!, Ödeme Bekleniyor
-"Kayıp Cihaz Detayları" Kartı
Kayıp Tarihi:
Kayıp Yeri:
Cihaz Modeli:
Cihaz Seri Numarası:
Cihaz Rengi:
Ek Detaylar:
Satın Alma Kanıtı (Fatura) Dosyası:
-"İşlem Durumu" Kartı
Durum:  Kayıtlı XXX seri numaralı YYY cihazı eşleşme bulundu. Ödeme Bekleniyor.
-"Durum Bilgisi" Kartı (2 numarası seçenek aktif turuncu renk. diğerleri pasif durumda.)
1 Cihaz için eşleşme bekleniyor
2 Cihazınız bulundu
    Ödemenizi yapmak ve takas sürecini tamamlamak için "Ödemeyi güvenle yap Butonu"
3 Cihazınızın kargo ile teslim edilmesi bekleniyor
    Teslim/Takip için kargo numaranız: XXX
4 Cihaz Teslim Alındığında
    Cihazın seri numarasını kontrol edip teslim aldığınızı onaylayın "Onay Butonu"
5 İşlem Tamamlandı
    Cihazınıza kavuştuğunuz için mutluyuz.
---

**İşlem Mantığı:**
  - Buton: "Ödeme Yap" - Bu butona tıklayınca match-payment sayfasına gidiyor
  
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

**Ücret Yapısı:**
- Gateway komisyonu: %3.43 (toplam üzerinden)
- Kargo ücreti: 250.00 TL (sabit)
- Bulan kişi ödülü: %20 (toplam üzerinden)
- Hizmet bedeli: Geriye kalan tutar
---

**Ödeme Akışı:**
1. Ödeme yöntemi seçimi (Stripe/PAYNET-ApplePay-Kredi Kartı)
2. Kart bilgileri girişi
3. 3D Secure doğrulama
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

### **Adım 6: Ödeme Tamamlandı - Kargo Bekleme**
```
Status: payment_completed → Bulan kişi cihazı kargolayacak
```

**Dashboard'da Görünen:**
- Cihaz kartı mesajı: Ödeme alındı! Kargo bekleniyor.
- Durum rengi: Mavi


**DeviceDetailPage (Cihaz Detay Sayfası):**
```

Dashboard → Cihaz Kartına Tıkla → DeviceDetailPage açılır
```
DeviceDetailPage içeriği

-Başlık:
✅
Ödemeniz Başarıyla Tamamlandı!
Cihazınızın kargo firmasına teslim edilmesi bekleniliyor.
-"Kayıp Cihaz Detayları" Kartı
Kayıp Tarihi:
Kayıp Yeri:
Cihaz Modeli:
Cihaz Seri Numarası:
Cihaz Rengi:
Ek Detaylar:
Satın Alma Kanıtı (Fatura) Dosyası:
-"İşlem Durumu" Kartı
Durum:  Kayıtlı XXX seri numaralı YYY cihaz ödemesi alındı. Kargo firmasına teslimi bekleniliyor. 
-"Ödeme Detayları" Kartı
Ödeme ID:
Toplam Tutar:
Ödeme Durumu: Tamamlandı
Ödeme Sağlayıcı:
Ödeme Tarihi:
-"Escrow Durumu" Kartı
Escrow ID:
Durum: Beklemede
Escrow Tutarı:
-"Durum Bilgisi" Kartı (3 numaralı seçenek aktif turuncu renk. diğerleri pasif durumda.)
1 Cihaz için eşleşme bekleniyor
2 Cihazınız bulundu
    Ödemenizi yapmak ve takas sürecini tamamlamak için "Ödemeyi güvenle yap Butonu"
3 Cihazınızın kargo ile teslim edilmesi bekleniyor
    Kargoya verildiğinde takip numaranız burada görünecektir.
4 Cihaz Teslim Alındığında
    Cihazın seri numarasını kontrol edip teslim aldığınızı onaylayın "Onay Butonu"
5 İşlem Tamamlandı
    Cihazınıza kavuştuğunuz için mutluyuz.
---

**Bildirimler:**
- In-app: 
---
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
  message_key,          -- 'payment_received_finder'
  type,                 -- 'payment_success'
  is_read,              -- false
  created_at            -- now()
);
```

**7. `cargo_codes` tablosuna kayıt :**
```sql
-- Kargo kodu oluştur (tek kayıt - seri numarası bazlı)
INSERT INTO cargo_codes (
  id,                    -- gen_random_uuid()
  device_id,            -- Cihaz ID'si (sahibi için)
  payment_id,           -- Payment ID'si
  code,                 -- Kargo takip numarası (test: ABC123456)
  generated_by,         -- Bulan kişi ID'si
  cargo_company,        -- Kargo firması (test: Aras Kargo)
  status,               -- 'active'
  cargo_status,         -- 'pending', 'picked_up', 'in_transit', 'delivered', 'confirmed' (v5.1)
  expires_at,           -- 7 gün sonra
  created_at,           -- now()
  updated_at            -- now()
);
```

### **Adım 7: Kargo Gönderildi**
```
Bulan kişi kargo takip/teslim numarası ile kargo firmasına teslim etti. → Status: CARGO_SHIPPED (?)
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
- Cihaz kartı mesajı: Cihaz kargo firmasına teslim edildi. 
- Durum rengi: Mavi

**DeviceDetailPage (Cihaz Detay Sayfası):**
```
Dashboard → Cihaz Kartına Tıkla → DeviceDetailPage açılır
```

DeviceDetailPage içeriği
✅
Cihazınız Kargo Firmasına Teslim Edildi!
Cihazınız yolda! Lütfen takip numarası ile kontrol edin. 
-"Kayıp Cihaz Detayları" Kartı
Kayıp Tarihi:
Kayıp Yeri:
Cihaz Modeli:
Cihaz Seri Numarası:
Cihaz Rengi:
Ek Detaylar:
Satın Alma Kanıtı (Fatura) Dosyası:
-"İşlem Durumu" Kartı
Durum:  Kayıtlı XXX seri numaralı YYY cihaz yolda. Kargo firması cihazı teslim edecek.
-"Ödeme Detayları" Kartı
Ödeme ID:
Toplam Tutar:
Ödeme Durumu: Tamamlandı
Ödeme Sağlayıcı:
Ödeme Tarihi:
-"Escrow Durumu" Kartı
Escrow ID:
Durum: Beklemede
Escrow Tutarı:
-"Durum Bilgisi" Kartı (3 numaralı seçenek aktif turuncu renk. diğerleri pasif durumda.)
1 Cihaz için eşleşme bekleniyor
2 Cihazınız bulundu
    Ödemenizi yapmak ve takas sürecini tamamlamak için "Ödemeyi güvenle yap Butonu"
3 Cihazınızın size teslim edilmesi bekleniyor
    Teslim/Takip için kargo numaranız: XXX
4 Cihaz Teslim Alındığında
    Cihazın seri numarasını kontrol edip teslim aldığınızı onaylayın "Onay Butonu"
5 İşlem Tamamlandı
    Cihazınıza kavuştuğunuz için mutluyuz.

**Bildirimler:**
- In-APP

---

### **Adım 8: Kargo Teslim Alındı**
```
Cihaz sahibi kargosunu aldı → Manuel onay bekliyor
```
Süreç Analizi: Bu adım, kargo firması API'sinden "teslim edildi" bilgisi geldiğinde tetiklenir. Bu anda sistemin durumu değişir ve kullanıcıdan bir eylem beklenir.
Durum Güncellemesi:
shipments.cargo_status -> 'delivered'
devices.status -> 'delivered'
---

**Dashboard'da Görünen:**
- Mesaj: Cihazınız teslim edildi. Lütfen kontrol edip onaylayın.
- Butonlar:
  - "Cihazımı Teslim Aldım, Onayla" 
  - "Sorun Var, İtiraz Et" 

**DeviceDetailPage (Cihaz Detay Sayfası):**
```
Dashboard → Cihaz Kartına Tıkla → DeviceDetailPage açılır
```
DeviceDetailPage içeriği
✅
Cihazınız Size Teslim Edildi!
Cihazınız teslim edildi. Lütfen Seri Numarasını Kontrol Edin ve Onaylayın. 
-"Kayıp Cihaz Detayları" Kartı
Kayıp Tarihi:
Kayıp Yeri:
Cihaz Modeli:
Cihaz Seri Numarası:
Cihaz Rengi:
Ek Detaylar:
Satın Alma Kanıtı (Fatura) Dosyası:
-"İşlem Durumu" Kartı
Durum:  Kayıtlı XXX seri numaralı YYY cihaz teslim edildi. Teslim almayı onaylayın.
-"Ödeme Detayları" Kartı
Ödeme ID:
Toplam Tutar:
Ödeme Durumu: Tamamlandı
Ödeme Sağlayıcı:
Ödeme Tarihi:
-"Escrow Durumu" Kartı
Escrow ID:
Durum: Beklemede
Escrow Tutarı:
-"Durum Bilgisi" Kartı (4 numaralı seçenek aktif turuncu renk. diğerleri pasif durumda.)
1 Cihaz için eşleşme bekleniyor
2 Cihazınız bulundu
    Ödemenizi yapmak ve takas sürecini tamamlamak için "Ödemeyi güvenle yap Butonu"
3 Cihazınızın size teslim edilmesi bekleniyor
    Teslim/Takip için kargo numaranız: XXX
4 Cihaz Teslim Alındığında
    Cihazın seri numarasını kontrol edip teslim aldığınızı onaylayın "Onay Butonu"
5 İşlem Tamamlandı
    Cihazınıza kavuştuğunuz için mutluyuz.
---

### **Adım 9: Onay Verme**
```
Cihaz sahibi → "Onayla" → Escrow serbest bırakılıyor ve ödemeler yapılıyor. 
```
Süreç Analizi: Kullanıcı "Onayla" butonuna bastığında, sürecin en kritik otomasyonu tetiklenir: paranın serbest bırakılması ve dağıtımı.
Durum Güncellemesi:
Kullanıcı onayıyla devices.status -> 'confirmed' olur.
Bu durum değişikliği, escrow'u serbest bırakan (escrow_accounts.status -> 'released') ve ödeme dağıtımını başlatan bir tetikleyici (trigger/function) görevi görmelidir.
Tüm finansal işlemler (final_payment_distributions) başarıyla tamamlandıktan sonra, işlemin nihai durumu olan devices.status -> 'completed' olarak güncellenir.
---

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
status: "CONFIRMED" 
} 
```


**DeviceDetailPage (Cihaz Detay Sayfası):**
```
Dashboard → Cihaz Kartına Tıkla → DeviceDetailPage açılır
```

DeviceDetailPage içeriği
✅
Cihazınıza Kavuştuğunuz için Çok Mutluyuz!
Süreci başarı ile tamamladık. 
-"Kayıp Cihaz Detayları" Kartı
Kayıp Tarihi:
Kayıp Yeri:
Cihaz Modeli:
Cihaz Seri Numarası:
Cihaz Rengi:
Ek Detaylar:
Satın Alma Kanıtı (Fatura) Dosyası:
-"İşlem Durumu" Kartı
Durum:  Kayıtlı XXX seri numaralı YYY cihaz teslim edildi. Teslim almaa onaylandı.
-"Ödeme Detayları" Kartı
Ödeme ID:
Toplam Tutar:
Ödeme Durumu: Tamamlandı
Ödeme Sağlayıcı:
Ödeme Tarihi:
-"Escrow Durumu" Kartı
Escrow ID:
Durum: Serbest Bırakıldı.
Escrow Tutarı:
-"Durum Bilgisi" Kartı (5 numaralı seçenek aktif turuncu renk. diğerleri pasif durumda.)
1 Cihaz için eşleşme bekleniyor
2 Cihazınız bulundu
    Ödemenizi yapmak ve takas sürecini tamamlamak için "Ödemeyi güvenle yap Butonu"
3 Cihazınızın size teslim edilmesi bekleniyor
    Teslim/Takip için kargo numaranız: XXX
4 Cihaz Teslim Alındığında
    Cihazın seri numarasını kontrol edip teslim aldığınızı onaylayın "Onay Butonu"
5 İşlem Tamamlandı
    Cihazınıza kavuştuğunuz için mutluyuz.
---

**Bildirimler:**
- Cihaz sahibine: EVET
- Bulan kişiye: EVET
- In-App
---

## 🟢 CİHAZ BULAN (FINDER) - BULUNAN CİHAZ SÜRECİ

### **Adım 1: Kayıt ve Giriş**
```
Kullanıcı → Ana Sayfa → "Kayıt Ol" → Email + Şifre → Giriş
```

**Sorular:**
IBAN: Kayıt sırasında değil, eşleşme bulunduktan ve cihaz sahibi ödemeyi yaptıktan sonra zorunlu olmalıdır. Kullanıcıyı henüz bir ödül kazanmamışken IBAN girmeye zorlamak, kayıt oranını düşürebilir. Ödeme yapıldığı anda sistem, bulan kişiye "Ödülünüzü alabilmek ve kargo sürecini başlatmak için lütfen IBAN bilgilerinizi tamamlayın" uyarısını göstermelidir.
Kimlik Doğrulama: Güvenlik ve yasal sebeplerle, özellikle ödeme alacak (bulan) kişi için kimlik doğrulaması (TC Kimlik No doğrulaması gibi) yapılması şiddetle tavsiye edilir.

---

### **Adım 2: Bulunan Cihaz Ekleme**
```
Dashboard → "Cihaz Ekle" → "Buldum" Seçeneği
```

**Girilen Bilgiler:**
- Seri Numarası: Manuel giriş
- Renk: Dropdown
- Cihaz Modeli: Dropdown
- Bulunma Tarihi: Tarih seçici
- Bulunma Yeri: Serbest metin
- Ek Detaylar: Opsiyonel
- Bulunan Cihazın Fotoğrafı: "Dosya Ekle Butonu" (Ön ve Arka İki Fotoğraf Kaydı)

**Dashboard'da Görünen:**
- Mesaj: Buldunan cihazın sistem kaydı gerçekleşti.
- Durum: ?

**DeviceDetailPage (Cihaz Detay Sayfası):**
```
Dashboard → Cihaz Kartına Tıkla → DeviceDetailPage açılır
```

DeviceDetailPage içeriği
✅
Cihazın Kaydı Başarıyla Tamamlandı!
Bulduğun cihaz sisteme kaydedildi. Eşleşme bulunduğunda size bildirim gönderilecektir.
-"Bulunan Cihaz Detayları" Kartı
Bulunma Tarihi:
Bulunma Yeri:
Cihaz Modeli:
Cihaz Seri Numarası:
Cihaz Rengi:
Ek Detaylar:
Bulunan Cihaz Fotoğrafı (Ön ve Arka):
-"İşlem Durumu" Kartı
Durum:  Kayıtlı XXX seri numaralı YYY cihaz için eşleşme bekleniyor.
-"Durum Bilgisi" Kartı (1 numaralı seçenek aktif turuncu renk. diğerleri pasif durumda.)
1 Cihaz için eşleşme bekleniyor
2 Eşleşme bulundu
    Cihazın sahibinin ödeme yapması bekleniyor.
3 Cihazın Kargo Firmasına Teslim Edilmesi
    Teslim/Takip için kargo numaranız: XXX
4 Cihaz Sahibi Teslim Alındığında
    Kargo firması cihazı sahibine teslim etti. Onay bekleniyor. 
5 İşlem Tamamlandı
    Takas tamamlandığında ödülünüz hesabınıza aktarılacak.
---

**Database:**
```typescript
devices {
  id: UUID
  user_id: UUID  // Bulan kişinin ID'si
  model: string
  serial_number: string
  status: "REPORTED"
  device_type: "found"
  found_date: date
  found_location: string
  description: text
  created_at: timestamp
}
```

### **Adım 3: Eşleşme Bulundu**
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
- Mesaj: Eşleşme Bulundu! Ödeme Bekleniyor.

**DeviceDetailPage (Cihaz Detay Sayfası):**
```
Dashboard → Cihaz Kartına Tıkla → DeviceDetailPage açılır
```
DeviceDetailPage içeriği
✅
Eşleşme Bulundu!
Cihaz sahibinin ödeme yapması bekleniyor.
-"Bulunan Cihaz Detayları" Kartı
Bulunma Tarihi:
Bulunma Yeri:
Cihaz Modeli:
Cihaz Seri Numarası:
Cihaz Rengi:
Ek Detaylar:
Bulunan Cihaz Fotoğrafı (Ön ve Arka):
-"İşlem Durumu" Kartı
Durum:  Kayıtlı XXX seri numaralı YYY cihaz için eşleşme bulundu.
-"Durum Bilgisi" Kartı (2 numaralı seçenek aktif turuncu renk. diğerleri pasif durumda.)
1 Cihaz için eşleşme bekleniyor
2 Eşleşme bulundu
    Cihazın sahibinin ödeme yapması bekleniyor.
3 Cihazın Kargo Firmasına Teslim Edilmesi
    Teslim/Takip için kargo numaranız: XXX
4 Cihaz Sahibi Teslim Alındığında
    Kargo firması cihazı sahibine teslim etti. Onay bekleniyor. 
5 İşlem Tamamlandı
    Takas tamamlandığında ödülünüz hesabınıza aktarılacak.

**Bildirimler:**
- In-app: evet
---

### **Adım 4: Ödeme Tamamlandı**
```
Cihaz sahibi ödeme yaptı → Status: PAYMENT_COMPLETED
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
- Mesaj: "Ödeme alındı, cihazı kargo firmasına teslim edin.


**DeviceDetailPage (Cihaz Detay Sayfası):**
```
Dashboard → Cihaz Kartına Tıkla → DeviceDetailPage açılır
```

DeviceDetailPage içeriği
✅
Ödeme Süreci Tamamlandı!
Lütfen en kısa sürede cihazı kargo firmasına teslim edin.
⚠️ Ödülünüzü alabilmek için lütfen profil bilgilerinizi tamamlayın:
   [ ] TC Kimlik Numaranızı girin
   [ ] IBAN bilgilerinizi ekleyin

-"Bulunan Cihaz Detayları" Kartı
Bulunma Tarihi:
Bulunma Yeri:
Cihaz Modeli:
Cihaz Seri Numarası:
Cihaz Rengi:
Ek Detaylar:
Bulunan Cihaz Fotoğrafı (Ön ve Arka):
-"İşlem Durumu" Kartı
Durum:  Kayıtlı XXX seri numaralı YYY cihaz için ödeme tamamlandı.
-"Durum Bilgisi" Kartı (3 numaralı seçenek aktif turuncu renk. diğerleri pasif durumda.)
1 Cihaz için eşleşme bekleniyor
2 Eşleşme bulundu
    Cihazın sahibinin ödeme yapması bekleniyor.
3 Cihazın Kargo Firmasına Teslim Edilmesi
    Kargo firmasına vereceğiniz **Teslim Kodunuz: [TESLİM_KODU]
4 Cihaz Sahibi Teslim Aldığında
    Kargo firması cihazı sahibine teslim edecek. Onay bekleniyor. 
5 İşlem Tamamlandı
    Takas tamamlandığında ödülünüz hesabınıza aktarılacak.

**Bildirimler:**
- In-app: evet
---

### **Adım 7: Kargonun Firmaya Teslim Edilmesi**
```
Kargo Firması API → "Kargo Bilgilerini Gir" → Form

> 1.  Bulan kişi formu doldurmaz.
> 2.  Bulan kişi sadece **Teslim Kodu** ile kargo şubesine gider ve cihazı verir.
> 3.  Formu aslında kargo görevlisi (kendi ekranında) doldurur veya API otomatik olarak halleder.
> 4.  Kargo firması API'si bizim sistemimize "Teslim alındı, yeni takip numarası: 123456" bilgisini gönderir.
>
> Dolayısıyla bu adımda bulan kişinin yapacağı bir "veri girişi" yoktur, sadece fiziksel bir eylem (cihazı teslim etme) vardır.
```

**Girilen Bilgiler:**
- Kargo Şirketi: Dropdown (Aras, Yurtiçi, MNG, PTT)
- Kargo Takip Numarası: Manuel giriş
- Gönderinin alındığı tarih
- Gönderinin alındığı şube
- Kargo Takip Numarası: Manuel giriş
- Gönderinin teslim edildiği tarih:
---

### **Adım 8: Kargo Yolda**
```
Status: CARGO_SHIPPED → Teslimat bekleniyor
```

**Dashboard'da Görünen:**
- Mesaj: "Kargo Yolda"
---
DeviceDetailPage (Cihaz Detay Sayfası):
Dashboard → Cihaz Kartına Tıkla → DeviceDetailPage açılır

DeviceDetailPage içeriği
✅
Cihaz Yola Çıktı!
Cihazı başarıyla kargoya teslim ettin. Sahibine ulaşması bekleniyor.
-"Bulunan Cihaz Detayları" Kartı
Bulunma Tarihi:
Bulunma Yeri:
... (diğer detaylar)
-"İşlem Durumu" Kartı
Durum: Cihaz kargoya verildi. Sahibine teslim edilmesi bekleniyor.
-"Durum Bilgisi" Kartı (4 numaralı seçenek aktif turuncu renk. diğerleri pasif durumda.)
1 Cihaz için eşleşme bekleniyor
2 Eşleşme bulundu
3 Cihazın Kargo Firmasına Teslim Edilmesi
4 Cihaz Sahibi Teslim Alındığında
Kargo firması cihazı sahibine teslim edecek. Onay bekleniyor.
5 İşlem Tamamlandı
---


### **Adım 9: Teslimat ve Onay Bekleme**
```
Cihaz sahibi teslim aldı → Onay veriyor
```

**Dashboard'da Görünen:**
- Mesaj: "Onay bekleniyor"
---
DeviceDetailPage (Cihaz Detay Sayfası):
Dashboard → Cihaz Kartına Tıkla → DeviceDetailPage açılır
DeviceDetailPage içeriği
✅
Teslimat Tamamlandı! Onay Bekleniyor.
Kargo firması cihazı sahibine teslim etti. Ödülünün serbest bırakılması için cihaz sahibinin teslimatı onaylaması bekleniyor.
(Not: Cihaz sahibi 48 saat içinde onaylamazsa, sistem işlemi otomatik olarak onaylayacaktır.)
-"Bulunan Cihaz Detayları" Kartı
Bulunma Tarihi:
Bulunma Yeri:
... (diğer detaylar)
-"İşlem Durumu" Kartı
Durum: Cihaz sahibine teslim edildi. Onay bekleniyor.
-"Durum Bilgisi" Kartı (4 numaralı seçenek aktif turuncu renk. diğerleri pasif durumda.)
1 Cihaz için eşleşme bekleniyor
2 Eşleşme bulundu
3 Cihazın Kargo Firmasına Teslim Edilmesi
4 Cihaz Sahibi Teslim Alındığında
Kargo firması cihazı sahibine teslim etti. Onay bekleniyor.
5 İşlem Tamamlandı
---

### **Adım 10: Ödül Alma**
```
Cihaz sahibi onayladı → Escrow released → Para transfer
```
Status: COMPLETED → Ödül transfer edildi
---

**Dashboard'da Görünen:**
- Mesaj: "Ödülünüz hesabınıza aktarıldı" 
---
DeviceDetailPage (Cihaz Detay Sayfası):
Dashboard → Cihaz Kartına Tıkla → DeviceDetailPage açılır
DeviceDetailPage içeriği
✅
İşlem Başarıyla Tamamlandı!
Yardımın için teşekkür ederiz! Ödülün, belirttiğin IBAN adresine transfer edildi.
-"Bulunan Cihaz Detayları" Kartı
Bulunma Tarihi:
Bulunma Yeri:
... (diğer detaylar)
-"İşlem Durumu" Kartı
Durum: İşlem tamamlandı. Ödülün gönderildi.
-"Durum Bilgisi" Kartı (5 numaralı seçenek aktif yeşil renk. diğerleri pasif durumda.)
1 Cihaz için eşleşme bekleniyor
2 Eşleşme bulundu
3 Cihazın Kargo Firmasına Teslim Edilmesi
4 Cihaz Sahibi Teslim Aldığında
5 İşlem Tamamlandı
Takas tamamlandığında ödülünüz hesabınıza aktarılacak. (Metin "aktarıldı" olarak güncellenebilir)
---

**Transfer Süreci:**
- IBAN'a otomatik transfer 
- Ödeme sağlayıcı ile yapılıyor
- Transfer süresi: Anında mı, 1-3 iş günü mü?

**Bildirimler:**
- In-APP

---




## ❓ EKSİK DETAYLAR VE SORULAR

### **1. Profil Bilgileri**
- IBAN bulunan cihaz kaydı esnasında zorunlu
Cevap: Hayır, zorunlu olmamalı. IBAN bilgisi, cihazı bulan kullanıcı için, cihaz sahibi ödemeyi yaptıktan sonra (payment_completed durumunda) kargo sürecine geçmeden hemen önce zorunlu hale getirilmelidir. Cihaz sahibinden IBAN istenmesi gerekmez.
- Kimlik doğrulama var mı?
Olması şiddetle tavsiye edilir. Özellikle ödeme alacak olan cihazı bulan kişi için dolandırıcılığı önlemek ve yasal uyumluluk (KYC) amacıyla TC Kimlik No doğrulaması yapılmalıdır. Bu da IBAN gibi, ödeme yapıldıktan sonra istenebilir.
- TC Kimlik zorunlu
Cevap: Evet. Cihaz sahibi için ödeme güvenliği, cihazı bulan için ise ödül ödemesinin doğruluğu için zorunlu olmalıdır. Cihaz sahibi için ödeme adımından önce, bulan için ise ödeme alındıktan sonra zorunlu kılınmalıdır.
- Telefon zorunlu
- Adres bulunan cihaz kaydı için zorunlu değil. 

### **2. Kargo Detayları**
- Kargo ücreti ifoundanapple a ait
- Kargo adresi kargo firması ile şifreli olarak api üzerinden kimlik bilgileri ve adres gizli kalmak koşulu ile  paylaşılıyor. 
- Kargo takip entegrasyonunu API sağlayacak.

### **3. İletişim**
- cihaz sahibi ve bulan kişi kişisel bilgileri gizlenir. Asla paylaşılmaz. 
- Tamamen anonim.

### **4. Zaman Sınırları**
- Ödeme için zaman sınırı Sürecin kilitlenmemesi için 72 saat gibi bir zaman sınırı konulması, cihazı bulan kişinin mağduriyetini önler. Süre dolduğunda eşleşme iptal edilebilir.
- Kargo için zaman sınırı 3 gün
- Onay için otomatik onay süresi 2 gün
Kargo API'sinden "teslim edildi" bilgisi geldikten 48 saat sonra, eğer kullanıcı itiraz etmezse sistemin işlemi otomatik olarak CONFIRMED durumuna geçirmesi, bulan kişinin ödülünü almasını garanti altına alır.

### **5. İptal/İade ve İstisnai Durum Yönetimi**
Platform, sürecin sorunsuz ilerlemediği durumlar için aşağıdaki senaryoları yönetir:

A) Kullanıcı Kaynaklı İptal (Kargo Öncesi)
Senaryo: Cihaz sahibi ödeme yaptıktan sonra ama cihaz henüz kargoya verilmeden önce fikrini değiştirir.
Akış:
Cihaz sahibi "İşlemi İptal Et" talebinde bulunur.
devices.status -> CANCELLED olarak güncellenir.
Escrow'daki para, hizmet bedeli kesintisi yapılarak veya yapılmadan (iş kurallarına göre) cihaz sahibine tam iade edilir.
Cihazı bulan kişiye bildirim gönderilir.

B) Kargo Sürecindeki Sorunlar
Senaryo 1: Teslimat Başarısız (FAILED_DELIVERY)
Neden: Kargo firması API'sinden "adreste bulunamadı", "yanlış adres" gibi bir durum bildirimi gelir.
Akış:
shipments.status -> failed_delivery olarak güncellenir.
devices.status -> FAILED_DELIVERY olarak güncellenir.
Cihaz sahibine "Teslimat Başarısız" bildirimi gönderilir ve adresini kontrol etmesi veya kargo şubesiyle iletişime geçmesi istenir.
Belirli bir süre (örn: 24 saat) içinde sorun çözülmezse, süreç "İade" senaryosuna dönüşebilir.
Senaryo 2: Kargonun İade Edilmesi (RETURNED)
Neden: Teslimat birkaç denemeden sonra başarısız oldu veya alıcı kargoyu kabul etmedi. Kargo firması API'si "iade sürecinde" bilgisi geçer.
Akış:
shipments.status -> returned olarak güncellenir.
devices.status -> RETURNED olarak güncellenir.
Bu, bir admin müdahalesi gerektiren ciddi bir durumdur. Admin paneline bildirim düşer.
Admin, durumu inceledikten sonra paranın kısmi veya tam iadesine karar verir. Genellikle kargo ücreti kesilerek iade yapılır. Cihaz, bulan kişiye geri gönderilir.

C) Cihaz Sahibinin İtirazı (DISPUTED)
Senaryo: Cihaz teslim edildi (delivered) ancak cihaz sahibi "Sorun Var, İtiraz Et" butonuna bastı (yanlış cihaz, hasarlı vb.).
Akış:
devices.status -> DISPUTED olarak güncellenir.
Escrow'daki para kilitli kalır.
Admin incelemesi başlar ve süreci karara bağlar.

### **6. Güvenlik**
- Kimlik doğrulama zorunlu mu?
- Dolandırıcılık önleme var mı?
- Sahte cihaz kontrolü: kayıp cihaz kaydı sırasında cihazın faturası isteniliyor. 
- Sahte seri numarası kontrolü: Kayıp ilanı sırasında istenilen fatura ile kontrol sağlanacak. 
- Aynı kullanıcı, aynı model seri numaralı cihazı hem kayıp hem bulunan cihaz olarak kaydedemez.
- Aynı kullanıcı bir günde 2 den fazla bulunan cihaz kaydedemez. Sürekli bulunan cihaz kaydı gerçekleştiren hesaplar incelemeye alınır. 

### **7. Ödeme Transfer**
- Bulan kişiye para nasıl transfer ediliyor?
- Ödeme sağlayıcı ile yapılıyor
- IBAN'a otomatik transfer
- Transfer süresi Bu, kullanılan ödeme sağlayıcısına bağlıdır. Genellikle "1-3 iş günü" sürer. Kullanıcıya bu yönde bir bilgilendirme yapılmalıdır.
- Transfer ücreti yok

### **8. Bildirimler**
Hangi aşamalarda hangi bildirimler gidiyor?
- In-app notification
- Push notification (mobil için)

Bildirim Matrisi, süreç kontrol edilip onaylanacak

Olay	                                      Alıcı	Mesaj             Anahtarı	                                Tip
Cihaz kaydedildi	                          Kayıt eden	        device_registered	                            info
Eşleşme bulundu	                            Her iki taraf	      device_matched_owner / device_matched_finder	success
Ödeme bekleniyor	                          Cihaz sahibi	      payment_reminder	                            warning
Ödeme alındı	                              Bulan kişi	        payment_received_please_ship	                success
Teslim kodu oluşturuldu	                    Bulan kişi	        delivery_code_ready	                          info
Kargoya verildi	                            Cihaz sahibi	      package_shipped	                              info
Kargo yolda	                                Her iki taraf	      package_in_transit	                          info
Teslim edildi	                              Cihaz sahibi	      package_delivered_confirm	                    warning
Otomatik onay yaklaşıyor (24 saat kaldı)	  Cihaz sahibi	      auto_confirm_reminder	                        warning
Onay verildi	                              Bulan kişi	        reward_released	                              success
Para transfer edildi	                      Bulan kişi	        reward_transferred	                          success


### **9. Ücret Hesaplama** 
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

### **10. Escrow Release Conditions**
- Hangi koşullar sağlanmalı?
Escrow'u serbest bırakacak iki temel koşul vardır:
Manuel Onay: Cihaz sahibinin "Onayla" butonuna basması.
Otomatik Onay: Kargonun teslim edilmesinden itibaren "otomatik onay süresi" (48 saat) kadar beklemek ve bu sürede bir itiraz gelmemesi.

### **11. Eşleşme Mantığı**
- Model ve Seri Numarasına göre
- Bulan veya Kayıp cihaz kaydı aynı model ve seri numarası olamaz. 
- sistem ikinci kayda izin vermez
Evet. Bunu garanti altına almak için devices tablosunda (model, "serialNumber") sütunları üzerinde bir veritabanı seviyesinde UNIQUE kısıtlaması (constraint) oluşturulmalıdır.


### **12. Admin Paneli**
- Admin hangi aşamalara müdahale edebiliyor?
- Manuel escrow release yapabiliyor mu?
- İtirazları admin çözüyor
- İptal/iade işlemlerini admin yapıyor

---


## 🔄 SÜREÇ AKIŞ DİYAGRAMI


CİHAZ SAHİBİ                           SİSTEM                           CİHAZ BULAN
   ─────────────                          ──────                           ───────────

Cihaz Ekle (Kaybettim)                                                  		Cihaz Ekle (Buldum)
      ↓                                                                  		      ↓
     LOST ───────────────────────→   Eşleştirme Yap   ←────────────────────── REPORTED
      ↓                                    	  ↓                                		 ↓
   MATCHED  ←────────────────────────── Eşleşme Bildir ──────────────────────→ MATCHED
      ↓                                                                     			 ↓
  Ödeme Yap                                                            			 Ödeme Bekleniyor
      ↓                                                                     		         ↓
      └────────────────────────→   Ödemeyi Escrow'a Al   ───────────────────────┘
                                         	  ↓
payment_completed ←────────────────── Escrow'da Tutuluyor ─────────────────→ payment_completed
      ↓                                		  ↓                              	         ↓
 Kargo Bekleniyor                 	   Teslim Kodu Oluştur                 		  Teslim Kodu Alındı
      ↓                                   	   ↓                            	         ↓
      └───────────────────────   Kargoya Verilmesini Bekle   ────────────────→ Cihazı Kargola
                              		  (Kargo API'si dinleniyor)                 	         ↓
                                        	   ↓
 CARGO_SHIPPED ←────────────────── Kargo Takip Numarası Alındı ──────────────→ CARGO_SHIPPED
      ↓                              		     ↓                       		         ↓
  Kargo Takip Ediliyor                  Teslimat Takip Ediliyor            		  Teslimat Bekleniyor
      ↓                                		      ↓                        		         ↓
  DELIVERED ←─────────────────────── Teslim Edildi Bildirimi ────────────────→ DELIVERED
      ↓                                                                    			 ↓
   Onay Ver                                                               		    Onay Bekleniyor
      ↓
      └──────────────────────────┐
                               		  ↓
   CONFIRMED ←──────────────── Onay Alındı
                              	          ↓
                      	         Escrow Serbest Bırak
                                          ↓
                         Ödemeleri Dağıt (Ödül, Komisyon...)
                                          ↓
   COMPLETED ←────────────────── İşlem Tamamlandı ───────────────────────→ COMPLETED

