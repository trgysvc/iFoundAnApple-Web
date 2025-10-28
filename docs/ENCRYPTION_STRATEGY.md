# 🔐 Hassas Veri Şifreleme Stratejisi

**Tarih:** 24 Ekim 2025  
**Versiyon:** 1.0  
**Durum:** Onay Bekleniyor

---

## 🎯 Amaç

Kullanıcı hassas verilerini (TC, IBAN, Adres, Telefon) güvenli şekilde:
- ✅ Veritabanına kaydet
- ✅ Veritabanında muhafaza et  
- ✅ Veritabanından oku

**Sadece bu.** Başka bir şey yapma.

---

## 📋 Şifrelenecek Veriler

- `tc_kimlik_no` - TC Kimlik Numarası
- `iban` - IBAN numarası
- `phone_number` - Telefon numarası
- `address` - Adres bilgisi

**Tablo:** `userprofile` (Supabase PostgreSQL)

---

## 🔧 Teknik Yaklaşım

### Encryption Manager
- Dosya: `utils/encryptionManager.ts` ✅ Hazır
- Algoritma: **AES-256-GCM**
- Her kayıt için unique IV
- Key: `VITE_ENCRYPTION_KEY` (environment variable)

### Nasıl Çalışır?

```
1. Kullanıcı veri girdi → "12345678901"
2. Kaydet → Encrypt → "aXc9kL2mN3p..." (DB'ye yazılır)
3. Oku → Decrypt → "12345678901" (kullanıcıya gösterilir)
```

---

## ⚙️ Uygulama

### Adım 1: Environment Variable

`.env` dosyasına ekle:
```bash
VITE_ENCRYPTION_KEY=your-strong-random-key-32-chars-minimum
```

Key oluştur:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Adım 2: AppContext.tsx

**updateUserProfile fonksiyonuna ekle:**
```typescript
import { encryptUserProfile } from '../utils/encryptionManager';

const updateUserProfile = async (profileData) => {
  // Şifrele
  const encrypted = await encryptUserProfile(profileData);
  
  // Supabase'e yaz
  await supabase.from('userprofile').upsert(encrypted);
};
```

**fetchUserProfile fonksiyonuna ekle:**
```typescript
import { decryptUserProfile } from '../utils/encryptionManager';

const fetchUserProfile = async () => {
  // Supabase'den oku
  const { data } = await supabase.from('userprofile').select('*');
  
  // Şifre çöz
  const decrypted = await decryptUserProfile(data);
  return decrypted;
};
```

### Adım 3: ProfilePage.tsx (Opsiyonel)

UI'da maskeleme (güzel görünsün diye):
```typescript
import { maskData } from '../utils/encryptionManager';

// Görüntüleme
<div>{maskData(tcKimlikNo, 4)}</div> // "*******8901"
```

---

## 🔄 Migration (Mevcut Veriler İçin)

**İlk deployment için:**
```typescript
// Tüm plain text verileri şifrele
const migrateExistingData = async () => {
  const { data } = await supabase.from('userprofile').select('*');
  
  for (const profile of data) {
    const encrypted = await encryptFields(profile, ['tc_kimlik_no', 'iban', 'phone_number', 'address']);
    await supabase.from('userprofile').update(encrypted).eq('id', profile.id);
  }
};
```

---

## ✅ Checklist

- [x] `encryptionManager.ts` yazıldı
- [x] `env.example` güncellendi
- [ ] `.env` dosyasına key ekle
- [ ] `AppContext.tsx` güncelle
- [ ] Test et
- [ ] Production deploy

---

## 📝 Notlar

- **Key güvenliği:** Environment variable asla commit etme
- **Performans:** Encryption ~1-2ms per field (minimal impact)
- **Backup:** Key'i güvenli yerde sakla (password manager + encrypted USB)
- **Migration:** İlk deployment'dan önce migration script çalıştır

---

**Hazırlayan:** AI Assistant  
**Durum:** Ready for implementation  
**Onay:** Kullanıcı onayı bekleniyor
