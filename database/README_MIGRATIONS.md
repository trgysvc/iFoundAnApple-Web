# Database Migrations Guide

Bu klasördeki SQL migration dosyaları veritabanı şemasını oluşturmak ve güncellemek için kullanılır.

## 📋 Migration Dosyaları (Sıralı)

### Temel Tablolar
1. **01_create_device_models_table.sql** - Cihaz modelleri tablosu
2. **02_create_payments_table.sql** - Ödeme kayıtları tablosu
3. **03_create_cargo_shipments_table.sql** - Kargo takip tablosu
4. **04_create_financial_transactions_table.sql** - Finansal işlemler tablosu
5. **05_create_escrow_accounts_table.sql** - Escrow hesapları tablosu
6. **06_create_audit_logs_table.sql** - Denetim logları tablosu

### Profil Güncellemeleri
7. **07_add_name_columns_to_userprofile.sql** ⭐ **YENİ**
   - `first_name` ve `last_name` sütunları ekler
   - OAuth kullanıcıları için otomatik profil oluşturma
   - Mevcut `full_name` verilerini parse eder

### Ek Güncellemeler
- **add_escrow_columns.sql** - Escrow sütun güncellemeleri
- **add_payments_columns.sql** - Ödeme sütun güncellemeleri
- **add_updated_at_columns.sql** - Timestamp sütun güncellemeleri
- **create_fee_update_logs_table.sql** - Ücret güncelleme logları
- **create_invoice_logs_table.sql** - Fatura logları
- **fix_matching_rls_policies.sql** - RLS policy düzeltmeleri
- **fix_rls_policies_correct.sql** - RLS policy iyileştirmeleri

### Veri Ekleme
- **insert_complete_apple_devices_correct.sql** - Apple cihaz verileri
- **insert_device_models_data.sql** - Cihaz modeli verileri

## 🚀 Migration Nasıl Çalıştırılır?

### Supabase Dashboard'da (Önerilen)
1. [Supabase Dashboard](https://app.supabase.com) → Projenizi seçin
2. Sol menüden **SQL Editor** sekmesine gidin
3. **New Query** butonuna tıklayın
4. Migration dosyasını açın ve içeriğini kopyalayın
5. SQL Editor'a yapıştırın
6. **Run** (F5) butonuna tıklayın
7. ✅ "Success" mesajını görünce işlem tamamlanmıştır

### Supabase CLI ile
```bash
# CLI'yi yükleyin
npm install -g supabase

# Projeye bağlanın
supabase link --project-ref <your-project-ref>

# Migration'ı çalıştırın
supabase db push --file database/07_add_name_columns_to_userprofile.sql
```

## ⚠️ Önemli Notlar

### 1. Migration Sırası Önemli
Migration dosyalarını **numaralı sırayla** çalıştırın (01, 02, 03...). Yanlış sıralama hatalara neden olabilir.

### 2. userprofile Tablosu Gerekli
`07_add_name_columns_to_userprofile.sql` çalıştırılmadan önce `userprofile` tablosu mevcut olmalıdır. Eğer yoksa:

```sql
-- userprofile tablosunu oluştur
CREATE TABLE IF NOT EXISTS userprofile (
  id SERIAL PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  tc_kimlik_no VARCHAR(11),
  phone_number VARCHAR(20),
  address TEXT,
  iban VARCHAR(26),
  bank_info VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- RLS'yi etkinleştir
ALTER TABLE userprofile ENABLE ROW LEVEL SECURITY;

-- Policy'leri ekle
CREATE POLICY "Users can view own profile"
  ON userprofile FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON userprofile FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON userprofile FOR UPDATE
  USING (auth.uid() = user_id);
```

### 3. Backup Önemi
Production'da migration çalıştırmadan önce **mutlaka backup alın**:

```sql
-- Backup almak için
pg_dump -h your-host -U postgres -d your-database > backup_$(date +%Y%m%d).sql
```

### 4. Test Ortamı
Önce **test/staging** ortamında migration'ları test edin.

## 🔍 Migration Doğrulama

### 07 Migration Sonrası Kontroller

```sql
-- 1. Sütunların eklendiğini kontrol et
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'userprofile'
  AND column_name IN ('first_name', 'last_name');

-- Beklenen sonuç:
--  column_name | data_type 
-- -------------+-----------
--  first_name  | varchar
--  last_name   | varchar

-- 2. Index'in oluştuğunu kontrol et
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'userprofile' 
  AND indexname = 'idx_userprofile_names';

-- 3. Mevcut verilerin parse edildiğini kontrol et
SELECT 
  user_id,
  first_name,
  last_name,
  CASE 
    WHEN first_name IS NOT NULL AND last_name IS NOT NULL THEN '✅ Parsed'
    ELSE '⚠️ Not Parsed'
  END as status
FROM userprofile
LIMIT 10;
```

## 🐛 Hata Giderme

### Hata: "relation userprofile does not exist"
**Çözüm:** Önce `userprofile` tablosunu oluşturun (yukarıdaki örneğe bakın)

### Hata: "column already exists"
**Çözüm:** Migration zaten çalıştırılmış. Tekrar çalıştırmaya gerek yok.
```sql
-- Mevcut durumu kontrol et
\d userprofile
```

### Hata: "permission denied"
**Çözüm:** Yeterli yetkiniz olmayabilir. Supabase Dashboard'u kullanın veya admin ile iletişime geçin.

## 📊 Migration Durumunu İzleme

```sql
-- Migration history tablosu oluştur (önerilen)
CREATE TABLE IF NOT EXISTS migration_history (
  id SERIAL PRIMARY KEY,
  migration_name VARCHAR(255) UNIQUE NOT NULL,
  executed_at TIMESTAMP DEFAULT NOW(),
  executed_by VARCHAR(255) DEFAULT current_user,
  status VARCHAR(50) DEFAULT 'success'
);

-- Migration çalıştırdıktan sonra kaydet
INSERT INTO migration_history (migration_name, status)
VALUES ('07_add_name_columns_to_userprofile', 'success');

-- Geçmişi görüntüle
SELECT * FROM migration_history ORDER BY executed_at DESC;
```

## 🔄 Rollback (Geri Alma)

Eğer migration'ı geri almak isterseniz:

```sql
-- 07 Migration Rollback
ALTER TABLE userprofile
  DROP COLUMN IF EXISTS first_name,
  DROP COLUMN IF EXISTS last_name;

DROP INDEX IF EXISTS idx_userprofile_names;
```

⚠️ **Uyarı:** Rollback veri kaybına neden olabilir. Dikkatli olun!

## 📞 Destek

Sorun yaşarsanız:
1. Migration hatasının tam mesajını kopyalayın
2. Supabase logs'u kontrol edin
3. GitHub Issues'da ticket açın
4. Veya doğrudan geliştirici ekiple iletişime geçin

---

**İyi Şanslar! 🚀**
