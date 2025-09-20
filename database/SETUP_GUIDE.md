# 🚀 SUPABASE TABLOLARI KURULUM REHBERİ

Bu rehber, ödeme ve takas sistemi için gereken tüm tabloları adım adım oluşturmanızı sağlar.

## 📋 KURULUM SIRASI

Tabloları **mutlaka bu sırayla** oluşturun (bağımlılıklar nedeniyle):

1. ✅ **device_models** - Cihaz fiyatları ve ödül hesaplaması
2. ✅ **payments** - Ödeme işlemleri
3. ✅ **cargo_shipments** - Kargo teslimat sistemi  
4. ✅ **financial_transactions** - Mali işlem kayıtları
5. ✅ **escrow_accounts** - Emanet hesap yönetimi
6. ✅ **audit_logs** - Audit trail sistemi

---

## 🎯 ADIM 1: MEVCUT DURUMU KONTROL EDIN

**Supabase SQL Editor'da çalıştırın:**

```sql
-- Mevcut tabloları listele
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Beklenen mevcut tablolar:**
- `devices`
- `userProfile`
- `device_models` (varsa)

---

## 🏗️ ADIM 2: YENİ TABLOLARI OLUŞTURUN

### **2.1. Device Models Tablosu**

**Dosya:** `01_create_device_models_table.sql`

```sql
-- Bu dosyanın içeriğini kopyalayıp SQL Editor'da çalıştırın
```

**Kontrol:** Tablo oluştu mu?
```sql
SELECT COUNT(*) as model_count FROM device_models;
-- Sonuç: 20+ Apple model olmalı
```

### **2.2. Payments Tablosu**

**Dosya:** `02_create_payments_table.sql`

```sql
-- Bu dosyanın içeriğini kopyalayıp SQL Editor'da çalıştırın
```

**Kontrol:** Tablo oluştu mu?
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'payments' ORDER BY ordinal_position;
```

### **2.3. Cargo Shipments Tablosu**

**Dosya:** `03_create_cargo_shipments_table.sql`

```sql
-- Bu dosyanın içeriğini kopyalayıp SQL Editor'da çalıştırın
```

**Kontrol:** Kargo firmaları eklendi mi?
```sql
SELECT name, code FROM cargo_companies;
-- Sonuç: Aras, MNG, Yurtiçi, PTT olmalı
```

### **2.4. Financial Transactions Tablosu**

**Dosya:** `04_create_financial_transactions_table.sql`

```sql
-- Bu dosyanın içeriğini kopyalayıp SQL Editor'da çalıştırın
```

### **2.5. Escrow Accounts Tablosu**

**Dosya:** `05_create_escrow_accounts_table.sql`

```sql
-- Bu dosyanın içeriğini kopyalayıp SQL Editor'da çalıştırın
```

### **2.6. Audit Logs Tablosu**

**Dosya:** `06_create_audit_logs_table.sql`

```sql
-- Bu dosyanın içeriğini kopyalayıp SQL Editor'da çalıştırın
```

---

## ✅ ADIM 3: KURULUM DOĞRULAMA

Tüm tablolar oluşturulduktan sonra bu kontrolü yapın:

```sql
-- Tüm yeni tabloları listele
SELECT table_name, 
       (SELECT COUNT(*) FROM information_schema.columns 
        WHERE table_name = t.table_name AND table_schema = 'public') as column_count
FROM information_schema.tables t
WHERE t.table_schema = 'public' 
  AND t.table_name IN (
    'device_models', 'payments', 'cargo_shipments', 
    'financial_transactions', 'escrow_accounts', 'audit_logs'
  )
ORDER BY t.table_name;
```

**Beklenen sonuç:**
- device_models: ~15 sütun
- payments: ~20 sütun  
- cargo_shipments: ~25 sütun
- financial_transactions: ~15 sütun
- escrow_accounts: ~20 sütun
- audit_logs: ~25 sütun

---

## 🔧 ADIM 4: RLS POLİTİKALARI KONTROL

```sql
-- RLS politikalarını kontrol et
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

---

## 🚨 HATA GİDERME

### **Hata: "relation already exists"**
```sql
-- Tabloyu silip tekrar oluştur
DROP TABLE IF EXISTS [table_name] CASCADE;
-- Sonra tekrar oluştur
```

### **Hata: "permission denied"**
- Supabase'de **Service Role Key** kullandığınızdan emin olun
- SQL Editor'da **"Run as service role"** seçeneğini işaretleyin

### **Hata: "foreign key constraint"**
- Tabloları **doğru sırayla** oluşturun
- Bağımlı tablolar önce oluşturulmalı

---

## 📞 DESTEK

Sorun yaşarsanız:
1. **Hata mesajını** tam olarak kopyalayın
2. **Hangi adımda** hata aldığınızı belirtin  
3. **Mevcut tablo listesini** paylaşın

---

## 🎉 TAMAMLANDIKTAN SONRA

Tüm tablolar oluşturulduktan sonra:
1. **Frontend uygulamasını** yeniden başlatın
2. **Ödeme test** işlemlerini deneyin
3. **Kargo sistemi** test edin
4. **Admin dashboard** kontrol edin

**Başarılar! 🚀**
