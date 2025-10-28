
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

Bu repository' nin sadece frontend olduğu unutulmamalıdır. Aşağıdaki özellikler bütün projeyi kapsamaktadır. 

### ✨ Temel Özellikler
- 🔐 **Güvenli Kimlik Doğrulama**: Supabase Auth ile güvenli giriş/kayıt sistemi
- 🎯 **Otomatik Eşleştirme**: Cihaz modeli ve seri numarasına göre akıllı eşleştirme
- 💰 **Güvenli Emanet Sistemi**: Ödemenin güvenli bir şekilde tutulması [backend]
- 🤖 **AI Destekli Öneriler**: Google Gemini ile akıllı açıklama önerileri
- 🌍 **Çoklu Dil Desteği**: 5 farklı dilde tam destek (EN, TR, FR, JA, ES)
- 👤 **Gelişmiş Profil Yönetimi**: Şifrelenmiş TC Kimlik, telefon, adres ve IBAN bilgileri
- 📱 **Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm
- 🔔 **Gerçek Zamanlı Bildirimler**: Anlık güncellemeler ve bildirimler
- 👨‍💼 **Yönetici Paneli**: Kapsamlı sistem yönetimi [Backend]
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

### Database
- **Supabase 2.55.0** - Backend-as-a-Service
  - PostgreSQL veritabanı (cloud-hosted)
  - Real-time subscriptions
  - Authentication & Authorization
  - Row Level Security (RLS)
  - CORS desteği


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
   # .env dosyası oluşturun (proje root dizininde)
   
   # Supabase
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Google Gemini AI
   GEMINI_API_KEY=your_google_gemini_api_key
   
   
   **Not**: 
   - Anon key, Supabase dashboard'tan alınır (public key)
   - Gemini API key, Google AI Studio'dan alınır
   - Environment dosyası `.gitignore`'da olduğundan repository'ye commit edilmez

4. **Geliştirme sunucusunu başlatın:**
    ```bash
   # Terminal 2 - Frontend
   npm run dev
   
   # Veya tek komutla ikisini birden
   npm run dev:full
   ```

5. **Tarayıcınızda açın:**
   ```
   Frontend: http://localhost:5173
   Backend API: http://localhost:3001
   ```

---

## 📁 Proje Yapısı

```
iFoundAnApple-Web/
├── 📁 api/                 # Backend API endpoints
│   ├── calculate-fees.ts   # Ücret hesaplama API
│   ├── process-payment.ts  # Ödeme işleme API
│   ├── release-escrow.ts   # Escrow serbest bırakma
├── 📁 components/          # Yeniden kullanılabilir UI bileşenleri
│   ├── 📁 ui/             # Temel UI elemanları
│   │   ├── Button.tsx     # Özelleştirilebilir buton bileşeni
│   │   ├── Container.tsx  # Layout container
│   │   ├── Input.tsx      # Form input bileşeni
│   │   └── Select.tsx     # Dropdown seçici
│   ├── 📁 payment/        # Ödeme bileşenleri
│   │   ├── PaymentMethodSelector.tsx  # Ödeme yöntemi seçici
│   │   ├── FeeBreakdownCard.tsx       # Ücret detayları
│   │   └── EscrowStatusCard.tsx       # Escrow durumu
│   ├── DeviceCard.tsx     # Cihaz kartı bileşeni
│   ├── Footer.tsx         # Site altbilgisi
│   └── Header.tsx         # Site başlığı ve navigasyon
├── 📁 contexts/           # Global state yönetimi
│   └── AppContext.tsx     # Ana uygulama context'i
├── 📁 pages/              # Sayfa bileşenleri
│   ├── HomePage.tsx       # Ana sayfa
│   ├── LoginPage.tsx      # Giriş sayfası
│   ├── RegisterPage.tsx   # Kayıt sayfası
│   ├── DashboardPage.tsx  # Kullanıcı paneli
│   ├── ProfilePage.tsx    # Profil yönetimi
│   ├── AddDevicePage.tsx  # Cihaz ekleme
│   ├── DeviceDetailPage.tsx # Cihaz detayları
│   ├── MatchPaymentPage.tsx # Eşleşme ödemesi
│   ├── PaymentFlowPage.tsx  # Ödeme akışı
│   ├── PaymentSuccessPage.tsx # Ödeme başarı sayfası
│   ├── AdminDashboardPage.tsx # Yönetici paneli
│   ├── FAQPage.tsx        # Sıkça sorulan sorular
│   ├── TermsPage.tsx      # Kullanım şartları
│   ├── PrivacyPage.tsx    # Gizlilik politikası
│   ├── ContactPage.tsx    # İletişim sayfası
│   └── NotFoundPage.tsx   # 404 sayfası
├── 📁 utils/              # Yardımcı fonksiyonlar
│   ├── paymentGateway.ts  # Ödeme gateway entegrasyonu
│   ├── iyzicoConfig.ts    # İyzico konfigürasyonu
│   ├── feeCalculation.ts  # Ücret hesaplama
│   ├── escrowManager.ts   # Escrow yönetimi
│   ├── security.ts        # Güvenlik fonksiyonları
│   └── auditLogger.ts     # Audit log sistemi
├── 📁 database/           # Database migration scripts

├── 📁 public/             # Statik dosyalar
│   └── 📁 icons/          # SVG ikonları
├── server.cjs             # Express backend server
├── App.tsx                # Ana uygulama bileşeni
├── constants.ts           # Çeviriler ve sabitler
├── index.tsx              # Uygulama giriş noktası
├── types.ts               # TypeScript tip tanımları
├── vite.config.ts         # Vite konfigürasyonu
├── README.md              # Bu dosya
└── CHANGELOG.md           # Sürüm geçmişi
```

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
---

## 🚀 Deployment & DevOps

### Desteklenen Platformlar
- **Coolify** (Önerilen - Backend + Frontend)
- **Vercel** (Frontend + Serverless Functions)
- **Railway** (Full-stack)
- **Render** (Full-stack)

### Build ve Deployment
```bash
# Production build
npm run build

# Start production server (Backend + Frontend)
npm start

# Preview production build locally
npm run preview
```

### Environment Variables
```bash
# Production (.env)
NODE_ENV=production
PORT=3001

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key

# Google Gemini AI
GEMINI_API_KEY=your_google_gemini_api_key

# Development (.env.local)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_development_anon_key
GEMINI_API_KEY=your_google_gemini_api_key

# Encryption Key for Sensitive Data (TC, IBAN, Address, Phone)
VITE_ENCRYPTION_KEY=
```

**Hızlı Başlangıç:**
```bash
# Build command
npm install && npm run build

# Start command
npm start

# Port
3001
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
- **Email**: support@ifoundanapple.com
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

### Veritabanı Mimarisi
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


## 🙏 Teşekkürler

- **Supabase** - Backend altyapısı için
- **        ** - Güvenli ödeme altyapısı için
- **Tailwind CSS** - Harika CSS framework için
- **React Team** - Muhteşem framework için
- **Lucide** - Güzel ikonlar için
- **Coolify** - Self-hosted deployment platformu için
- **Google Gemini** - AI destekli öneriler için

---

<div align="center">

**Made with ❤️ in Turkey**

[Website](https://ifoundanapple.com) • [GitHub](https://github.com/trgysvc/iFoundAnApple-Web) • [Support](mailto:support@ifoundanapple.com)

</div>
