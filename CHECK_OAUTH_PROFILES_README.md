# Google OAuth Kullanıcı Profil Kontrol Scripti

Bu script, Google/Apple OAuth ile giriş yapmış kullanıcıların `userprofile` tablosunda kayıtlı olup olmadığını kontrol eder.

## 🎯 Script Ne Yapar?

1. ✅ Tüm Supabase Auth kullanıcılarını listeler
2. ✅ OAuth ile giriş yapmış kullanıcıları tespit eder (Google/Apple)
3. ✅ Bu kullanıcıların `userprofile` tablosunda kaydı var mı kontrol eder
4. ✅ Eksik profilleri raporlar
5. ✅ `--fix` parametresi ile eksik profilleri otomatik oluşturur

## 📋 Gereksinimler

### 1. Environment Variable'lar

Script'in çalışması için `.env` dosyasında aşağıdaki değişkenler olmalı:

```bash
# Mevcut değişkenler (zaten var)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# YENİ: Service Role Key (admin erişimi için gerekli)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. Service Role Key Nasıl Bulunur?

**Supabase Dashboard'dan:**

1. Supabase Dashboard'a giriş yapın: https://supabase.com/dashboard
2. Projenizi seçin
3. Sol menüden **Settings** → **API** sekmesine gidin
4. **Project API keys** bölümünde **service_role key** göreceksiniz
5. Bu key'i kopyalayıp `.env` dosyanıza ekleyin

⚠️ **UYARI**: Service role key, RLS (Row Level Security) politikalarını bypass eder. 
Bu key'i asla frontend kodunda kullanmayın veya public repository'lere commit etmeyin!

## 🚀 Script Nasıl Çalıştırılır?

### Adım 1: Sadece Kontrol Et (Rapor Görüntüle)

```bash
npx tsx check-oauth-profiles.ts
```

Bu komut:
- OAuth kullanıcılarını listeler
- Hangi kullanıcıların profili var/yok gösterir
- **Hiçbir değişiklik yapmaz**, sadece rapor verir

### Adım 2: Eksik Profilleri Oluştur (Fix)

Eğer eksik profiller varsa, bunları otomatik oluşturmak için:

```bash
npx tsx check-oauth-profiles.ts --fix
```

Bu komut:
- Eksik profilleri tespit eder
- Her eksik profil için `userprofile` tablosuna kayıt oluşturur
- OAuth metadata'sından `first_name` ve `last_name` bilgilerini parse eder

## 📊 Örnek Çıktı

### Profili Olan Kullanıcı

```
✅ Profil Mevcut
   Provider: Google
   Email: ahmet@gmail.com
   Ad: Ahmet
   Soyad: Yılmaz
   Profil Oluşturma: 14.10.2025 15:30:45
```

### Profili Olmayan Kullanıcı

```
❌ PROFİL YOK!
   Provider: Google
   Email: mehmet@gmail.com
   User ID: 123e4567-e89b-12d3-a456-426614174000
   Kayıt Tarihi: 14.10.2025 14:20:30
   Metadata: {
     full_name: "Mehmet Demir",
     given_name: "Mehmet",
     family_name: "Demir"
   }
```

### Özet Rapor

```
📊 ÖZET RAPOR
================================================================================

📈 İstatistikler:
   - Toplam Kullanıcı: 25
   - OAuth Kullanıcı: 8
   - Profili Olan: 6 ✅
   - Profili Olmayan: 2 ❌

⚠️  DİKKAT: Profili olmayan OAuth kullanıcıları bulundu!

💡 ÖNERİ: Eksik profilleri oluşturmak ister misiniz?
   Oluşturmak için scripti --fix parametresi ile çalıştırın:
   npx tsx check-oauth-profiles.ts --fix
```

## 🔧 Nasıl Çalışır?

### 1. OAuth Metadata Parse

Script, Google/Apple OAuth'tan gelen kullanıcı bilgilerini şu sırayla parse eder:

**Google OAuth:**
```javascript
{
  given_name: "Ahmet",      // → first_name
  family_name: "Yılmaz",    // → last_name
  full_name: "Ahmet Yılmaz",
  email: "ahmet@gmail.com"
}
```

**Apple OAuth:**
```javascript
{
  name: {
    firstName: "Mehmet",    // → first_name
    lastName: "Demir"       // → last_name
  },
  email: "mehmet@icloud.com"
}
```

### 2. Fallback Mekanizması

Eğer `given_name` veya `family_name` yoksa:

1. ✅ `full_name` alanını boşluğa göre parse eder
2. ✅ Eğer o da yoksa, email'den kullanıcı adını alır

### 3. Profil Oluşturma

```sql
INSERT INTO userprofile (
  user_id,
  first_name,
  last_name,
  created_at,
  updated_at
) VALUES (
  'user_uuid',
  'Ahmet',
  'Yılmaz',
  NOW(),
  NOW()
);
```

## 🔒 Güvenlik

- ✅ Script, **service_role key** kullanır (admin erişimi)
- ✅ RLS politikalarını bypass eder (sadece read/insert için)
- ✅ Sadece `userprofile` tablosuna erişir
- ✅ Hiçbir kullanıcı bilgisini değiştirmez, sadece eksik profilleri oluşturur

## ❓ Sık Sorulan Sorular

### Soru 1: Script hata veriyor - "SUPABASE_SERVICE_ROLE_KEY not found"

**Cevap:** `.env` dosyanıza `SUPABASE_SERVICE_ROLE_KEY` ekleyin. Service role key'i Supabase Dashboard'dan alabilirsiniz.

### Soru 2: "--fix" yaptım ama hala profil yok

**Cevap:** Script'in çıktısını kontrol edin. Hata mesajları varsa, bunlar profil oluşturulamama nedenini gösterir.

### Soru 3: Mevcut profilleri değiştiriyor mu?

**Cevap:** Hayır! Script sadece **eksik** profilleri oluşturur. Mevcut profillere dokunmaz.

### Soru 4: Bu işlemi manuel yapabilir miyim?

**Cevap:** Evet, Supabase SQL Editor'de şu sorguyu çalıştırabilirsiniz:

```sql
-- Profili olmayan OAuth kullanıcılarını bul
SELECT au.id, au.email, au.raw_user_meta_data
FROM auth.users au
LEFT JOIN userprofile up ON au.id = up.user_id
WHERE up.id IS NULL
  AND (
    au.raw_app_meta_data->>'provider' IN ('google', 'apple')
    OR au.raw_app_meta_data->'providers' ?| ARRAY['google', 'apple']
  );

-- Eksik profili oluştur (örnek)
INSERT INTO userprofile (user_id, first_name, last_name, created_at, updated_at)
VALUES (
  'user_uuid_buraya',
  'Ad',
  'Soyad',
  NOW(),
  NOW()
);
```

## 📝 Notlar

- Script, Supabase Auth Admin API kullanır
- OAuth provider bilgisi `app_metadata.providers` array'inde veya `app_metadata.provider` string'inde bulunur
- Profil oluşturma işlemi, `AppContext.tsx`'deki `createUserProfile` fonksiyonu ile aynı mantığı kullanır

## 🆘 Yardım

Sorun yaşarsanız:

1. `.env` dosyasını kontrol edin
2. Service role key'in doğru olduğundan emin olun
3. Script çıktısındaki hata mesajlarını okuyun
4. Gerekirse Supabase Dashboard → Logs bölümünden hataları kontrol edin

