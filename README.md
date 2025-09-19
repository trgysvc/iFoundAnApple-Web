
# iFoundAnApple - Lost & Found Platform for Apple Devices

<div align="center">

![iFoundAnApple](https://via.placeholder.com/200x100/007AFF/FFFFFF?text=iFoundAnApple)

**Kayıp Apple cihazlarının sahipleri ile bulan kişileri güvenli ve anonim bir şekilde buluşturan modern web platformu**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)

</div>

## 📱 Proje Özeti

iFoundAnApple, kayıp Apple cihazlarının sahipleri ile onları bulan kişileri güvenli ve anonim bir şekilde bir araya getiren modern bir web platformudur. Platform, cihazların seri numaraları üzerinden otomatik eşleştirme yapar ve ödül sürecini güvenli bir emanet (escrow) sistemi ile yönetir.

### ✨ Temel Özellikler
- 🔐 **Güvenli Kimlik Doğrulama**: Supabase Auth ile güvenli giriş/kayıt sistemi
- 🎯 **Otomatik Eşleştirme**: Cihaz modeli ve seri numarasına göre akıllı eşleştirme
- 💰 **Güvenli Emanet Sistemi**: Ödemenin güvenli bir şekilde tutulması
- 🤖 **AI Destekli Öneriler**: Google Gemini ile akıllı ödül ve açıklama önerileri
- 🌍 **Çoklu Dil Desteği**: 5 farklı dilde tam destek (EN, TR, FR, JA, ES)
- 👤 **Gelişmiş Profil Yönetimi**: TC Kimlik, telefon, adres ve IBAN bilgileri
- 📱 **Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm
- 🔔 **Gerçek Zamanlı Bildirimler**: Anlık güncellemeler ve bildirimler
- 👨‍💼 **Yönetici Paneli**: Kapsamlı sistem yönetimi
- 🎨 **Modern UI/UX**: Apple tasarım dilinden ilham alan kullanıcı arayüzü
- 🔄 **Otomatik Çeviri Sistemi**: Dinamik dil değiştirme ve tutarlı çeviriler

---

## 🛠 Teknoloji Yığını

### Frontend
- **React 19** - Modern React hooks ve özellikleri
- **TypeScript** - Tip güvenliği ve geliştirici deneyimi
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Lucide React** - Modern ikonlar
- **Vite** - Hızlı build tool

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL veritabanı
  - Real-time subscriptions
  - Authentication
  - Row Level Security (RLS)

### AI & APIs
- **Google Gemini API** - AI destekli öneriler
- **Supabase Edge Functions** - Serverless functions

### Development Tools
- **ESLint & Prettier** - Kod kalitesi
- **TypeScript Strict Mode** - Tip güvenliği
- **Git Hooks** - Pre-commit kontrolleri

---

## 🚀 Hızlı Başlangıç

### Gereksinimler

- Node.js 18+ 
- npm veya yarn
- Modern web tarayıcısı
- Supabase hesabı
- Google Gemini API anahtarı (opsiyonel)

### Kurulum

1. **Projeyi klonlayın:**
    ```bash
   git clone https://github.com/trgysvc/iFoundAnApple-Web.git
   cd iFoundAnApple-Web
   ```

2. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

3. **Environment değişkenlerini ayarlayın:**
   ```bash
   # .env.local dosyası oluşturun
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Geliştirme sunucusunu başlatın:**
   ```bash
   npm run dev
   ```

5. **Tarayıcınızda açın:**
   ```
   http://localhost:5173
   ```

---

## 📁 Proje Yapısı

```
iFoundAnApple-Web/
├── 📁 components/           # Yeniden kullanılabilir UI bileşenleri
│   ├── 📁 ui/              # Temel UI elemanları
│   │   ├── Button.tsx      # Özelleştirilebilir buton bileşeni
│   │   ├── Container.tsx   # Layout container
│   │   ├── Input.tsx       # Form input bileşeni
│   │   └── Select.tsx      # Dropdown seçici
│   ├── DeviceCard.tsx      # Cihaz kartı bileşeni
│   ├── Footer.tsx          # Site altbilgisi
│   └── Header.tsx          # Site başlığı ve navigasyon
├── 📁 contexts/            # Global state yönetimi
│   └── AppContext.tsx      # Ana uygulama context'i
├── 📁 pages/               # Sayfa bileşenleri
│   ├── HomePage.tsx        # Ana sayfa
│   ├── LoginPage.tsx       # Giriş sayfası
│   ├── RegisterPage.tsx    # Kayıt sayfası
│   ├── DashboardPage.tsx   # Kullanıcı paneli
│   ├── ProfilePage.tsx     # Profil yönetimi
│   ├── AddDevicePage.tsx   # Cihaz ekleme
│   ├── DeviceDetailPage.tsx # Cihaz detayları
│   ├── AdminDashboardPage.tsx # Yönetici paneli
│   ├── FAQPage.tsx         # Sıkça sorulan sorular
│   ├── TermsPage.tsx       # Kullanım şartları
│   ├── PrivacyPage.tsx     # Gizlilik politikası
│   ├── ContactPage.tsx     # İletişim sayfası
│   └── NotFoundPage.tsx    # 404 sayfası
├── 📁 public/              # Statik dosyalar
│   └── 📁 icons/           # SVG ikonları
├── App.tsx                 # Ana uygulama bileşeni
├── constants.ts            # Çeviriler ve sabitler
├── index.tsx               # Uygulama giriş noktası
├── types.ts                # TypeScript tip tanımları
├── vite.config.ts          # Vite konfigürasyonu
├── README.md               # Bu dosya
├── USER_GUIDE.md           # Kullanıcı rehberi
├── TESTING.md              # Test dokümantasyonu
└── CHANGELOG.md            # Sürüm geçmişi
```

---

## 🗄 Veritabanı Şeması

### Supabase Tabloları

#### `users` (Kullanıcılar)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `userProfile` (Kullanıcı Profilleri)
```sql
CREATE TABLE userProfile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tc_kimlik_no VARCHAR(11),
  phone_number VARCHAR(20),
  address TEXT,
  iban VARCHAR(34),
  bank_info TEXT, -- Legacy field
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `devices` (Cihazlar)
```sql
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  model TEXT NOT NULL,
  serialNumber TEXT NOT NULL,
  color TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL,
  rewardAmount NUMERIC,
  exchangeConfirmedBy TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `notifications` (Bildirimler)
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message_key TEXT NOT NULL,
  link TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  replacements JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🔐 Güvenlik Özellikleri

### Authentication & Authorization
- **Supabase Auth**: Güvenli kimlik doğrulama
- **Row Level Security (RLS)**: Veritabanı seviyesinde güvenlik
- **JWT Tokens**: Güvenli oturum yönetimi
- **OAuth Providers**: Google ve Apple ile giriş desteği

### Data Protection
- **GDPR Uyumlu**: Avrupa veri koruma standartları
- **Şifreli Veri Saklama**: Hassas bilgilerin şifrelenmesi
- **Anonimlik**: Kullanıcılar arası kişisel bilgi paylaşımı yok
- **Secure Headers**: XSS ve CSRF koruması

### Privacy Features
- **Anonim Eşleştirme**: Kişisel bilgiler paylaşılmaz
- **Güvenli İletişim**: Platform üzerinden kontrollü iletişim
- **Veri Minimizasyonu**: Sadece gerekli veriler toplanır

---

## 🌍 Çoklu Dil Desteği

### Desteklenen Diller
- 🇺🇸 **English** (en) - Varsayılan dil, tam destek
- 🇹🇷 **Türkçe** (tr) - Ana dil, tam destek
- 🇫🇷 **Français** (fr) - Tam destek, güncel çeviriler
- 🇯🇵 **日本語** (ja) - Tam destek, doğal çeviriler
- 🇪🇸 **Español** (es) - Tam destek, tutarlı terminoloji

### Çeviri Özellikleri
- **200+ Çeviri Anahtarı**: Tüm UI elementleri için eksiksiz çeviriler
- **Dinamik Dil Değiştirme**: Sayfa yenilemeden anlık dil değişimi
- **Tutarlı Terminoloji**: Her dilde tutarlı teknik terimler
- **Kültürel Uyum**: Her dile özel ifade tarzları
- **Form Validasyonları**: Dil-spesifik hata mesajları

### Çeviri Kalite Kontrolleri
- ✅ Eksik çeviri anahtarları tespit edildi ve tamamlandı
- ✅ Karışık dil içerikleri düzeltildi (FR, JA, ES)
- ✅ Tüm form alanları ve hata mesajları çevrildi
- ✅ Admin paneli ve bildirim sistemi çevirileri
- ✅ AI öneriler ve durum mesajları çevirileri

### Yeni Dil Ekleme
1. `constants.ts` dosyasına yeni dil çevirilerini ekleyin
2. `AppContext.tsx` içinde `Language` tipini güncelleyin
3. Header bileşenindeki dil seçicisine yeni seçeneği ekleyin
4. Tüm çeviri anahtarlarının eksiksiz olduğundan emin olun

---

## 👤 Gelişmiş Profil Yönetimi

### Kullanıcı Profil Alanları
- **Temel Bilgiler**: Ad, soyad, e-posta
- **Kimlik Bilgileri**: TC Kimlik Numarası (Türkiye için)
- **İletişim**: Telefon numarası ve adres bilgileri
- **Banka Bilgileri**: IBAN numarası (ödül ödemeleri için)

### Profil Güvenliği
- **Veri Şifreleme**: Hassas bilgiler şifreli saklanır
- **Erişim Kontrolü**: Sadece kullanıcı kendi profilini görebilir
- **Opsiyonel Alanlar**: Zorunlu olmayan bilgiler için kullanıcı kontrolü
- **Veri Doğrulama**: Client-side ve server-side validasyon

### Profil Özellikleri
- **Gerçek Zamanlı Güncelleme**: Anında profil değişiklikleri
- **Form Validasyonu**: Akıllı form kontrolleri
  - TC Kimlik: 11 haneli sayı kontrolü
  - IBAN: Format ve uzunluk kontrolü
  - Telefon: Geçerli format kontrolü
- **Otomatik Kaydetme**: Değişikliklerin güvenli saklanması
- **Hata Yönetimi**: Kullanıcı dostu hata mesajları

### Veritabanı Entegrasyonu
```sql
-- Profil güncellemeleri için kullanılan tablo yapısı
ALTER TABLE userProfile 
ADD COLUMN tc_kimlik_no VARCHAR(11),
ADD COLUMN phone_number VARCHAR(20),
ADD COLUMN address TEXT,
ADD COLUMN iban VARCHAR(34);

-- İndeksler ve performans optimizasyonu
CREATE INDEX idx_userprofile_user_id ON userProfile(user_id);
CREATE INDEX idx_userprofile_iban ON userProfile(iban);
```

---

## 🚀 Deployment & DevOps

### Desteklenen Platformlar
- **Vercel** (Önerilen)
- **Netlify**
- **GitHub Pages**
- **AWS S3 + CloudFront**

### Environment Variables
```bash
# Production
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_anon_key
GEMINI_API_KEY=your_gemini_api_key

# Development
VITE_SUPABASE_URL=your_dev_supabase_url
VITE_SUPABASE_ANON_KEY=your_dev_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

---

## 🤝 Katkıda Bulunma

### Development Workflow
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Standards
- **ESLint**: Kod kalitesi kontrolleri
- **Prettier**: Kod formatlama
- **TypeScript**: Strict mode aktif
- **Conventional Commits**: Commit message standardı

### Pull Request Checklist
- [ ] Tests pass
- [ ] Code is properly typed
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] Responsive design tested
- [ ] Accessibility checked

---

## 📚 Dokümantasyon

- [**Kullanıcı Rehberi**](USER_GUIDE.md) - Platform kullanım kılavuzu
- [**Test Dokümantasyonu**](TESTING.md) - Test stratejisi ve senaryoları
- [**Sürüm Geçmişi**](CHANGELOG.md) - Detaylı değişiklik kayıtları

---

## 🆘 Destek

### Community Support
- **GitHub Issues**: Bug reports ve feature requests
- **GitHub Discussions**: Community questions

### Professional Support
- **Email**: support@ifoundanapple.app
- **Response Time**: 24 hours
- **Languages**: Turkish, English

---

## 📄 Lisans

Bu proje [MIT License](LICENSE) altında lisanslanmıştır.

---

## 🔄 Son Güncellemeler (2025)

### v2.1.0 - Çeviri ve Profil Güncellemeleri
- ✅ **Çeviri Sistemi Yenilendi**: 200+ çeviri anahtarı güncellendi
- ✅ **5 Dil Tam Desteği**: EN, TR, FR, JA, ES dillerinde eksiksiz çeviriler
- ✅ **Gelişmiş Profil Yönetimi**: TC Kimlik, telefon, adres ve IBAN alanları
- ✅ **Karışık Çeviri Düzeltmeleri**: Tüm dillerde tutarlı terminoloji
- ✅ **Form Validasyonları**: Akıllı form kontrolleri ve hata mesajları
- ✅ **Veritabanı Şeması Güncellemeleri**: userProfile tablosu genişletildi
- ✅ **UI/UX İyileştirmeleri**: Profil menüsü ve dil seçici yenilendi

### Yaklaşan Özellikler
- 🔄 **Mobil Uygulama**: React Native ile mobil versiyon
- 🔄 **Push Notifications**: Mobil bildirimler
- 🔄 **Gelişmiş AI**: Daha akıllı cihaz eşleştirme
- 🔄 **Blockchain Entegrasyonu**: Güvenli ödeme sistemi

---

## 🙏 Teşekkürler

- **Supabase** - Backend altyapısı için
- **Tailwind CSS** - Harika CSS framework için
- **React Team** - Muhteşem framework için
- **Lucide** - Güzel ikonlar için
- **Vercel** - Hosting ve deployment için
- **Google Gemini** - AI destekli öneriler için

---

<div align="center">

**Made with ❤️ in Turkey**

[Website](https://ifoundanapple.app) • [GitHub](https://github.com/trgysvc/iFoundAnApple-Web) • [Support](mailto:support@ifoundanapple.app)

</div>