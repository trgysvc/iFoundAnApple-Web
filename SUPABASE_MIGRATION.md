# Supabase Database Migration - Profil Alanları Genişletme

## Değişiklik Özeti

Kullanıcıların profil bilgilerini daha detaylı kaydedebilmesi için `userProfile` tablosuna yeni alanlar eklendi:

- TC Kimlik Numarası
- Telefon Numarası  
- Adres
- IBAN Numarası

## Gerekli Supabase SQL Komutları

### 1. userProfile Tablosunu Güncelle

Mevcut `userProfile` tablosuna yeni kolonlar ekleyin:

```sql
-- userProfile tablosuna yeni alanlar ekle
ALTER TABLE userProfile 
ADD COLUMN tc_kimlik_no VARCHAR(11),
ADD COLUMN phone_number VARCHAR(20),
ADD COLUMN address TEXT,
ADD COLUMN iban VARCHAR(34);

-- İndeksler ekle (performans için)
CREATE INDEX idx_userprofile_tc_kimlik ON userProfile(tc_kimlik_no);
CREATE INDEX idx_userprofile_phone ON userProfile(phone_number);
CREATE INDEX idx_userprofile_iban ON userProfile(iban);
```

### 2. Row Level Security (RLS) Politikaları

Mevcut RLS politikalarının yeni alanları da kapsadığından emin olun:

```sql
-- Mevcut politikaları kontrol et
SELECT * FROM pg_policies WHERE tablename = 'userProfile';

-- Eğer yoksa, kullanıcıların sadece kendi profillerini görebilmesi için:
ALTER TABLE userProfile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON userProfile
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON userProfile  
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON userProfile
FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 3. Güvenlik Kontrolleri

TC Kimlik numarası ve IBAN için validation fonksiyonları (opsiyonel):

```sql
-- TC Kimlik numarası validation fonksiyonu
CREATE OR REPLACE FUNCTION validate_tc_kimlik(tc_no TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- TC Kimlik numarası 11 haneli olmalı ve sadece rakamlardan oluşmalı
    IF tc_no IS NULL OR LENGTH(tc_no) != 11 OR tc_no !~ '^[0-9]+$' THEN
        RETURN FALSE;
    END IF;
    
    -- İlk hane 0 olamaz
    IF LEFT(tc_no, 1) = '0' THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- IBAN validation fonksiyonu  
CREATE OR REPLACE FUNCTION validate_iban(iban_no TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- IBAN Türkiye için TR ile başlamalı ve 26 karakter olmalı
    IF iban_no IS NULL THEN
        RETURN TRUE; -- NULL değerlere izin ver
    END IF;
    
    -- TR ile başlamalı ve 26 karakter olmalı
    IF NOT (iban_no ~ '^TR[0-9]{24}$') THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Validation constraint'leri ekle
ALTER TABLE userProfile 
ADD CONSTRAINT check_tc_kimlik_valid 
CHECK (tc_kimlik_no IS NULL OR validate_tc_kimlik(tc_kimlik_no));

ALTER TABLE userProfile 
ADD CONSTRAINT check_iban_valid 
CHECK (iban IS NULL OR validate_iban(iban));
```

### 4. Veri Şifreleme (Önerilen)

Hassas bilgiler için şifreleme ekleyin:

```sql
-- pgcrypto extension'ını etkinleştir (eğer yoksa)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Şifrelenmiş alanlar için yeni kolonlar
ALTER TABLE userProfile 
ADD COLUMN tc_kimlik_no_encrypted TEXT,
ADD COLUMN phone_number_encrypted TEXT,
ADD COLUMN iban_encrypted TEXT;

-- Şifreleme fonksiyonları
CREATE OR REPLACE FUNCTION encrypt_sensitive_data()
RETURNS TRIGGER AS $$
BEGIN
    -- TC Kimlik numarasını şifrele
    IF NEW.tc_kimlik_no IS NOT NULL THEN
        NEW.tc_kimlik_no_encrypted = pgp_sym_encrypt(NEW.tc_kimlik_no, current_setting('app.encryption_key'));
        NEW.tc_kimlik_no = NULL; -- Düz metni temizle
    END IF;
    
    -- Telefon numarasını şifrele
    IF NEW.phone_number IS NOT NULL THEN
        NEW.phone_number_encrypted = pgp_sym_encrypt(NEW.phone_number, current_setting('app.encryption_key'));
        NEW.phone_number = NULL; -- Düz metni temizle
    END IF;
    
    -- IBAN'ı şifrele
    IF NEW.iban IS NOT NULL THEN
        NEW.iban_encrypted = pgp_sym_encrypt(NEW.iban, current_setting('app.encryption_key'));
        NEW.iban = NULL; -- Düz metni temizle
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger oluştur
CREATE TRIGGER encrypt_profile_data
    BEFORE INSERT OR UPDATE ON userProfile
    FOR EACH ROW
    EXECUTE FUNCTION encrypt_sensitive_data();
```

## Uygulama Kodu Değişiklikleri

### Frontend Değişiklikleri ✅

1. **types.ts** - User ve UserProfile interface'leri güncellendi
2. **ProfilePage.tsx** - Yeni form alanları eklendi
3. **AppContext.tsx** - updateUserProfile fonksiyonu genişletildi
4. **constants.ts** - Yeni alanlar için çeviriler eklendi

### Test Edilmesi Gerekenler

1. Profil sayfasında yeni alanların görüntülenmesi
2. Form validation'ların çalışması
3. Veri kaydetme ve güncelleme işlemlerinin başarılı olması
4. RLS politikalarının doğru çalışması
5. Şifreleme/çözümleme işlemlerinin sorunsuz olması

## Güvenlik Notları

⚠️ **ÖNEMLİ GÜVENLIK UYARILARI:**

1. **TC Kimlik Numarası**: Çok hassas bir veri olduğu için mutlaka şifrelenmeli
2. **IBAN Bilgileri**: Finansal bilgiler için ek güvenlik önlemleri alınmalı
3. **Telefon Numarası**: GDPR uyumluluğu için kullanıcı onayı gerekli
4. **Adres Bilgisi**: Kişisel veri koruma yasalarına uygun işlenmeli

### Önerilen Güvenlik Uygulamaları

1. Tüm hassas alanları şifreleyin
2. Audit logging ekleyin
3. Veri erişim loglarını tutun
4. Düzenli güvenlik taramaları yapın
5. GDPR uyumlu veri silme prosedürleri oluşturun

## Rollback Planı

Eğer değişiklikleri geri almak gerekirse:

```sql
-- Yeni kolonları kaldır
ALTER TABLE userProfile 
DROP COLUMN IF EXISTS tc_kimlik_no,
DROP COLUMN IF EXISTS phone_number,
DROP COLUMN IF EXISTS address,
DROP COLUMN IF EXISTS iban,
DROP COLUMN IF EXISTS tc_kimlik_no_encrypted,
DROP COLUMN IF EXISTS phone_number_encrypted,
DROP COLUMN IF EXISTS iban_encrypted;

-- Constraint'leri kaldır
ALTER TABLE userProfile 
DROP CONSTRAINT IF EXISTS check_tc_kimlik_valid,
DROP CONSTRAINT IF EXISTS check_iban_valid;

-- Trigger'ı kaldır
DROP TRIGGER IF EXISTS encrypt_profile_data ON userProfile;

-- Fonksiyonları kaldır
DROP FUNCTION IF EXISTS validate_tc_kimlik(TEXT);
DROP FUNCTION IF EXISTS validate_iban(TEXT);
DROP FUNCTION IF EXISTS encrypt_sensitive_data();
```

## Migration Checklist

- [ ] Supabase'de backup alındı
- [ ] Test ortamında migration çalıştırıldı
- [ ] RLS politikaları test edildi
- [ ] Frontend kodu güncellendi
- [ ] Validation fonksiyonları test edildi
- [ ] Şifreleme çalışıyor (eğer uygulandıysa)
- [ ] Production'da migration çalıştırıldı
- [ ] Kullanıcı testleri yapıldı
- [ ] Monitoring ve alerting ayarlandı
