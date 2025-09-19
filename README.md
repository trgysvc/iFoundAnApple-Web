
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
- **React 19.1.0** - Modern React hooks ve özellikleri
- **TypeScript 5.7.2** - Tip güvenliği ve geliştirici deneyimi
- **Tailwind CSS** - Utility-first CSS framework (CDN)
- **React Router DOM 7.6.3** - Client-side routing
- **Lucide React 0.525.0** - Modern ikonlar
- **Vite 6.2.0** - Hızlı build tool ve dev server

### Backend & Database
- **Supabase 2.55.0** - Backend-as-a-Service
  - PostgreSQL veritabanı (cloud-hosted)
  - Real-time subscriptions
  - Authentication & Authorization
  - Row Level Security (RLS)
  - Edge Functions (serverless)

### AI & APIs
- **Google Gemini API** - AI destekli öneriler (@google/genai latest)
  - Gemini 2.5 Flash model
  - Structured JSON responses
  - Akıllı ödül hesaplama
  - Cihaz açıklaması önerileri

### Development & Build Tools
- **Vite** - Module bundler ve dev server
- **TypeScript** - Static type checking
- **ES Modules** - Modern JavaScript modules
- **Environment Variables** - Güvenli API key yönetimi

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
   # .env.local dosyası oluşturun (proje root dizininde)
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_google_gemini_api_key
   ```
   
   **Not**: 
   - Supabase URL'i `https://xyz.supabase.co` formatında olmalıdır
   - Anon key, Supabase dashboard'tan alınır (public key)
   - Gemini API key, Google AI Studio'dan alınır
   - Environment dosyası `.gitignore`'da olduğundan repository'ye commit edilmez

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

#### `auth.users` (Kimlik Doğrulama - Supabase Auth)
```sql
-- Supabase Auth tarafından otomatik yönetilen tablo
-- Kullanıcı kimlik doğrulama bilgileri burada saklanır
-- Email, password hash, metadata vb.
```

#### `public.users` (Kullanıcı Profilleri)
```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `public.userProfile` (Genişletilmiş Kullanıcı Bilgileri)
```sql
CREATE TABLE public.userProfile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  tc_kimlik_no VARCHAR(11), -- TC Kimlik Numarası (Türkiye)
  phone_number VARCHAR(20), -- Telefon numarası
  address TEXT, -- Adres bilgisi
  iban VARCHAR(34), -- Banka IBAN numarası
  bank_info TEXT, -- Legacy field (geriye uyumluluk)
  city VARCHAR(100), -- Şehir bilgisi
  country VARCHAR(100), -- Ülke bilgisi
  postal_code VARCHAR(20), -- Posta kodu
  date_of_birth DATE, -- Doğum tarihi
  emergency_contact TEXT, -- Acil durum iletişim
  preferences JSONB DEFAULT '{}'::jsonb, -- Kullanıcı tercihleri
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler
CREATE INDEX idx_userprofile_user_id ON public.userProfile(user_id);
CREATE INDEX idx_userprofile_updated_at ON public.userProfile(updated_at);
CREATE INDEX idx_userprofile_iban ON public.userProfile(iban);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_userprofile_updated_at
  BEFORE UPDATE ON public.userProfile
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### `public.devices` (Cihazlar)
```sql
CREATE TABLE public.devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  model TEXT NOT NULL, -- Cihaz modeli (iPhone 15 Pro, iPad Air vb.)
  serialNumber TEXT NOT NULL, -- Seri numarası (eşleştirme için kritik)
  color TEXT NOT NULL, -- Cihaz rengi
  description TEXT, -- Ek açıklamalar
  status TEXT NOT NULL CHECK (status IN ('lost', 'reported', 'matched', 'payment_pending', 'payment_complete', 'exchange_pending', 'completed')),
  rewardAmount NUMERIC(10,2), -- Ödül miktarı (TL)
  marketValue NUMERIC(10,2), -- Tahmini piyasa değeri
  invoice_url TEXT, -- Fatura/belge URL'i
  exchangeConfirmedBy TEXT[] DEFAULT '{}', -- Takası onaylayan taraflar
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler
CREATE INDEX idx_devices_user_id ON public.devices(userId);
CREATE INDEX idx_devices_serial_number ON public.devices(serialNumber);
CREATE INDEX idx_devices_status ON public.devices(status);
CREATE INDEX idx_devices_model ON public.devices(model);
CREATE INDEX idx_devices_created_at ON public.devices(created_at);

-- Eşleştirme için composite index
CREATE INDEX idx_devices_matching ON public.devices(model, serialNumber, status);
```

#### `public.notifications` (Bildirimler)
```sql
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message_key TEXT NOT NULL, -- Çeviri anahtarı (notifications.matchFound vb.)
  link TEXT NOT NULL, -- Yönlendirme URL'i
  is_read BOOLEAN DEFAULT FALSE, -- Okundu durumu
  replacements JSONB, -- Dinamik değerler ({model: "iPhone 15"} vb.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at);

-- Kullanıcının okunmamış bildirimleri için composite index
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, is_read, created_at) 
WHERE is_read = FALSE;
```

### Row Level Security (RLS) Politikaları
```sql
-- userProfile tablosu için RLS
ALTER TABLE public.userProfile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.userProfile
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.userProfile
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.userProfile
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- devices tablosu için RLS
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own devices" ON public.devices
  FOR SELECT USING (auth.uid() = userId);

CREATE POLICY "Users can insert own devices" ON public.devices
  FOR INSERT WITH CHECK (auth.uid() = userId);

-- notifications tablosu için RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);
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

### Build ve Deployment
```bash
# Production build
npm run build

# Preview production build locally
npm run preview
```

### Environment Variables
```bash
# Production (.env.production)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
GEMINI_API_KEY=your_google_gemini_api_key

# Development (.env.local)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_development_anon_key
GEMINI_API_KEY=your_google_gemini_api_key
```

### Vite Konfigürasyonu
Proje, Vite build tool kullanır ve environment değişkenlerini şu şekilde yönetir:
```typescript
// vite.config.ts
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    }
  };
});
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

## 🏗️ Sistem Mimarisi

### Frontend Mimarisi
```
React App (SPA)
├── 🎨 UI Layer (Tailwind CSS)
├── 🔄 State Management (React Context)
├── 🛣️ Routing (React Router DOM)
├── 🌐 API Calls (Supabase Client)
└── 🤖 AI Integration (Google Gemini)
```

### Backend Mimarisi
```
Supabase Backend-as-a-Service
├── 🗄️ PostgreSQL Database (Cloud)
├── 🔐 Authentication (JWT + OAuth)
├── 📡 Real-time Subscriptions
├── 🛡️ Row Level Security (RLS)
├── ⚡ Edge Functions (Serverless)
└── 📁 Storage (Dosya yükleme)
```

### Veri Akışı
1. **Kullanıcı Girişi** → Supabase Auth → JWT Token
2. **Cihaz Ekleme** → PostgreSQL → Real-time Notifications
3. **AI Önerileri** → Google Gemini → Structured Response
4. **Eşleştirme** → Database Query → Bildirim Sistemi
5. **Profil Güncelleme** → RLS Kontrolü → Database Update

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
- ✅ **Gerçek Sistem Dokümantasyonu**: README güncel sistemi yansıtacak şekilde güncellendi

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