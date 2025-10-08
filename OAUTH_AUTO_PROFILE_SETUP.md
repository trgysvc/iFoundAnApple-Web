# OAuth Otomatik Profil Doldurma

Bu doküman, Google ve Apple OAuth ile giriş yapan kullanıcıların bilgilerinin otomatik olarak nasıl `userprofile` tablosuna kaydedildiğini açıklar.

## 🎯 Özellikler

OAuth (Google/Apple) ile giriş yapan kullanıcılar için:
- ✅ **Otomatik ad/soyad parse etme**: Provider'dan gelen metadata parse edilir
- ✅ **Otomatik profil oluşturma**: İlk giriş sırasında `userprofile` kaydı otomatik oluşturulur
- ✅ **Akıllı fallback sistemi**: Birden fazla kaynak kontrol edilir
- ✅ **Geriye uyumlu**: Normal email/password kayıtlar da desteklenir

## 🔍 OAuth Metadata Parse Stratejisi

### 1. Google OAuth
Google aşağıdaki alanları sağlar:
```javascript
{
  given_name: "Ahmet",      // Ad
  family_name: "Yılmaz",    // Soyad
  full_name: "Ahmet Yılmaz",
  email: "ahmet@gmail.com",
  picture: "https://..."
}
```

### 2. Apple OAuth
Apple aşağıdaki formatı kullanır:
```javascript
{
  name: {
    firstName: "Mehmet",
    lastName: "Demir"
  },
  email: "mehmet@icloud.com"
}
```

## 📋 Parse Öncelik Sırası

`parseOAuthUserName()` fonksiyonu aşağıdaki sırayla kontrol yapar:

1. **Direct Fields** (Bizim kayıt sistemimiz)
   - `first_name` ve `last_name`

2. **Google OAuth**
   - `given_name` → firstName
   - `family_name` → lastName

3. **Apple OAuth**
   - `name.firstName` veya `name.first`
   - `name.lastName` veya `name.last`

4. **Fallback: full_name Parse**
   - `"Ahmet Yılmaz"` → firstName: "Ahmet", lastName: "Yılmaz"
   - `"Mehmet Ali Demir"` → firstName: "Mehmet", lastName: "Ali Demir"

5. **Last Resort: Email Parse**
   - `"ahmet.yilmaz@gmail.com"` → firstName: "ahmet.yilmaz", lastName: ""

## 🔄 İşleyiş Akışı

### OAuth ile İlk Giriş
```
1. Kullanıcı "Google ile Giriş" butonuna tıklar
   ↓
2. Google OAuth sayfasına yönlendirilir
   ↓
3. Kullanıcı izin verir ve geri dönülür
   ↓
4. Supabase Auth session oluşturur
   ↓
5. onAuthStateChange tetiklenir
   ↓
6. parseOAuthUserName() metadata'yı parse eder
   ↓
7. fetchUserProfile() profil var mı kontrol eder
   ↓
8. Profil yoksa createUserProfile() ile otomatik oluşturulur
   ↓
9. Kullanıcı dashboard'a yönlendirilir
```

### Var Olan OAuth Kullanıcısı Giriş Yapınca
```
1. Kullanıcı OAuth ile giriş yapar
   ↓
2. parseOAuthUserName() metadata'yı parse eder
   ↓
3. fetchUserProfile() mevcut profili bulur
   ↓
4. Profildeki veriler currentUser state'ine yüklenir
   ↓
5. Kullanıcı profilinde ad/soyad görüntülenir
```

## 🧪 Test Senaryoları

### Google ile Test
1. **Yeni Kullanıcı:**
   - Google hesabı: "Ahmet Yılmaz" <ahmet@gmail.com>
   - Beklenen Sonuç: 
     - `first_name`: "Ahmet"
     - `last_name`: "Yılmaz"
     - Profil sayfasında her iki alan da dolu görünür

2. **Tek İsimli Kullanıcı:**
   - Google hesabı: "Cher" <cher@gmail.com>
   - Beklenen Sonuç:
     - `first_name`: "Cher"
     - `last_name`: "" (boş)

### Apple ile Test
1. **Yeni Kullanıcı:**
   - Apple ID: "Mehmet Demir"
   - Beklenen Sonuç:
     - `first_name`: "Mehmet"
     - `last_name`: "Demir"

2. **Email ile Hide My Email:**
   - Apple "Hide My Email" özelliği kullanılırsa
   - Fallback olarak email'den parse edilir

## 📊 Veritabanı Yapısı

### userprofile Tablosu
```sql
CREATE TABLE userprofile (
  id SERIAL PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES auth.users(id),
  first_name VARCHAR(100),        -- OAuth'tan otomatik doldurulur
  last_name VARCHAR(100),          -- OAuth'tan otomatik doldurulur
  tc_kimlik_no VARCHAR(11),
  phone_number VARCHAR(20),
  address TEXT,
  iban VARCHAR(26),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔍 Debug ve Loglama

OAuth giriş sırasında aşağıdaki loglar console'da görünür:

```
[INFO] Auth state change: SIGNED_IN
[INFO] Parsed user metadata
  ├─ provider: "google"
  ├─ hasFirstName: true
  ├─ hasLastName: true
  └─ source: "OAuth"

[INFO] Profile fetch completed
  └─ hasData: false

[INFO] No profile data found - creating profile for new user from OAuth/Auth

[INFO] Profile created successfully with OAuth data
```

## 🛠️ Kod Referansları

### parseOAuthUserName Fonksiyonu
Konum: `contexts/AppContext.tsx` (satır 119-173)

### OAuth Provider Setup
Konum: `contexts/AppContext.tsx`
- `signInWithOAuth()` fonksiyonu (satır ~606)
- `onAuthStateChange` handler (satır ~148)

### Profil Oluşturma
Konum: `contexts/AppContext.tsx`
- `createUserProfile()` fonksiyonu (satır ~1462)

## ⚠️ Önemli Notlar

1. **İlk Giriş Zorunluluğu**: Apple OAuth'ta name bilgisi sadece ilk giriş sırasında gelir. Sonraki girişlerde gelmez, bu yüzden ilk girişte kaydedilmesi kritik.

2. **Email Gizleme**: Apple'ın "Hide My Email" özelliği kullanılırsa, email adresi maskelenmiş olur ama parse işlemi yine de çalışır.

3. **Manuel Düzenleme**: Kullanıcılar Profile sayfasından ad/soyad bilgilerini manuel olarak düzenleyebilir.

4. **Migration Gerekli**: Yeni `first_name` ve `last_name` sütunları için migration çalıştırın:
   ```bash
   # Supabase SQL Editor'da çalıştırın:
   database/07_add_name_columns_to_userprofile.sql
   ```

## 🎓 Kullanım Örnekleri

### React Component'te Kullanım
```typescript
import { useAppContext } from "../contexts/AppContext";

const ProfileComponent = () => {
  const { currentUser } = useAppContext();
  
  return (
    <div>
      <h1>Hoş geldin, {currentUser?.firstName} {currentUser?.lastName}!</h1>
      <p>Email: {currentUser?.email}</p>
    </div>
  );
};
```

### Profile Güncelleme
```typescript
const { updateUserProfile } = useAppContext();

await updateUserProfile({
  firstName: "Ahmet",
  lastName: "Yılmaz",
  phoneNumber: "+905551234567"
});
```

## 🔐 Güvenlik

- OAuth token'ları Supabase tarafından yönetilir
- Kullanıcı metadata'sı güvenli bir şekilde saklanır
- Tüm input'lar sanitize edilir (`sanitizers.text()`)
- RLS policies ile veri güvenliği sağlanır

## 📝 Gelecek Geliştirmeler

- [ ] LinkedIn OAuth desteği
- [ ] Facebook OAuth desteği
- [ ] Profil resmi otomatik senkronizasyonu
- [ ] Telefon numarası otomatik parse (OAuth'tan geliyorsa)

---

**Son Güncelleme:** 2025-10-08
**Geliştirici:** iFoundAnApple Team
