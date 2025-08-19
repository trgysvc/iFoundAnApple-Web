
# iFoundAnApple - Lost & Found Platform

## 1. Proje Özeti

iFoundAnApple, kaybedilen Apple cihazlarının sahipleri ile onları bulan kişileri güvenli ve anonim bir şekilde bir araya getiren modern bir web platformudur. Sistem, cihazların seri numaraları üzerinden otomatik eşleştirme yapar ve ödül sürecini güvenli bir emanet (escrow) sistemi ile yönetir. Bu proje, React, TypeScript ve Tailwind CSS kullanılarak oluşturulmuş, sunucusuz (serverless) bir ön uç (frontend) uygulamasıdır. Veri kalıcılığı prototip amacıyla tarayıcının `localStorage`'ı kullanılarak sağlanmaktadır.

### Temel Özellikler
- **Kullanıcı Rolleri:** Cihaz Sahibi (Owner) ve Cihaz Bulan (Finder) olmak üzere iki ana rol.
- **Anonim Eşleştirme:** Cihaz modeli ve seri numarasına göre kayıp ve bulunan cihazları otomatik eşleştirir.
- **Güvenli Takas Süreci:** Ödemenin bir emanet sisteminde tutulması ve her iki tarafın onayıyla takasın tamamlanması.
- **Yapay Zeka Desteği:** Google Gemini API kullanarak cihaz açıklaması ve ödül miktarı için akıllı öneriler sunar.
- **Çoklu Dil Desteği:** İngilizce, Türkçe, Fransızca, Japonca ve İspanyolca dillerini destekler.
- **Yönetici Paneli:** Sistem yöneticilerinin kullanıcıları ve cihazları izleyebileceği bir arayüz.

---

## 2. Teknoloji Yığını

- **Frontend:** React 19, TypeScript
- **Yönlendirme (Routing):** React Router
- **Stil (Styling):** Tailwind CSS
- **İkonlar (Icons):** Lucide React
- **Yapay Zeka (AI):** Google Gemini API (`@google/genai`)
- **Veri Kalıcılığı:** Tarayıcı `localStorage` (Prototip için)
- **Paket Yönetimi:** Yok (ESM via import maps from esm.sh)

---

## 3. Geliştirme Ortamı Kurulumu

Bu proje, modern JavaScript özellikleri (ESM, Import Maps) sayesinde herhangi bir paket yöneticisi (`npm`, `yarn`) veya derleme adımı gerektirmeden doğrudan tarayıcıda çalışır.

### Gereksinimler
- Modern bir web tarayıcısı (Chrome, Firefox, Edge).
- Kod düzenleyici (örn. VS Code).
- Canlı sunucu (Live Server) eklentisi (VS Code için önerilir).

### Kurulum Adımları

1.  **Projeyi Klonlayın:**
    ```bash
    git clone <repository-url>
    cd <repository-folder>
    ```

2.  **Environment Değişkenleri:**
    Bu proje, yapay zeka özelliklerini kullanmak için bir Google Gemini API anahtarına ihtiyaç duyar.
    - Proje, API anahtarını `process.env.API_KEY` ortam değişkeninden almaya çalışır.
    - Gerçek bir dağıtım ortamında (Netlify, Vercel vb.), bu değişkeni platformun ayarlarından eklemeniz gerekir.
    - **Yerel geliştirme için**, `index.html` dosyasını geçici olarak düzenleyerek API anahtarınızı ekleyebilirsiniz. `<body>` etiketinin başına aşağıdaki script'i ekleyin:
      ```html
      <script>
        // YALNIZCA YEREL GELİŞTİRME İÇİN!
        // BU KODU COMMITLEMEYİN!
        var process = {
          env: {
            API_KEY: 'SIZIN_GEMINI_API_ANAHTARINIZ'
          }
        };
      </script>
      ```
    **ÖNEMLİ:** API anahtarınızı asla Git repozitorisine commit'lemeyin.

---

## 4. Projeyi Çalıştırma

1.  VS Code kullanıyorsanız, `Go Live` butonuna tıklayarak projenizi `Live Server` ile başlatın.
2.  Alternatif olarak, proje klasöründeki `index.html` dosyasını doğrudan tarayıcınızda açın. (Bazı özellikler `file://` protokolü ile çalışmayabilir, bu yüzden canlı sunucu önerilir).

Uygulama artık tarayıcınızda çalışıyor olmalıdır.

---

## 5. Temel Kod Yapısı ve Klasör Organizasyonu

```
/
├── components/         # Tekrar kullanılabilir UI bileşenleri (Button, Input vb.)
│   ├── ui/             # Genel UI elemanları
│   └── *.tsx           # Uygulamaya özel bileşenler (Header, Footer, DeviceCard)
├── contexts/           # Global state yönetimi
│   └── AppContext.tsx  # Ana uygulama state'i, fonksiyonları ve context'i
├── pages/              # Her bir rota için sayfa bileşenleri
│   ├── AdminDashboardPage.tsx
│   ├── LoginPage.tsx
│   └── ...
├── App.tsx             # Ana uygulama bileşeni ve yönlendirme (routing) mantığı
├── constants.ts        # Tüm metinler ve çeviriler
├── index.html          # Uygulamanın giriş noktası (HTML iskeleti ve import map)
├── index.tsx           # React uygulamasını DOM'a bağlayan dosya
├── metadata.json       # Uygulama meta verileri
├── README.md           # Bu dosya
└── types.ts            # Tüm TypeScript arayüzleri ve enum'ları
```

---

## 6. API Referansı (Kavramsal)

Bu proje bir backend API'sine sahip olmasa da, `AppContext.tsx` içindeki fonksiyonlar bir API gibi davranır. Aşağıda bu fonksiyonların kavramsal API endpoint karşılıkları bulunmaktadır. Tüm veriler `localStorage` üzerinde işlenir.

**Veri Modelleri:** `User`, `Device`, `AppNotification` (Detaylar için `types.ts` dosyasına bakın).

- **`POST /register`** -> `register(user, pass)`
  - Yeni bir kullanıcı oluşturur ve giriş yapar.
- **`POST /login`** -> `login(email, pass)`
  - Kullanıcıyı doğrular ve oturum başlatır.
- **`POST /devices`** -> `addDevice(device)`
  - Yeni bir kayıp/bulunan cihaz ekler ve eşleşme kontrolü yapar.
- **`GET /devices`** -> `getUserDevices(userId)`
  - Belirli bir kullanıcının tüm cihazlarını listeler.
- **`GET /devices/:id`** -> `getDeviceById(deviceId)`
  - Tek bir cihazın detaylarını getirir.
- **`POST /devices/:id/pay`** -> `makePayment(deviceId)`
  - Cihaz sahibi ödeme yaptığında cihaz durumunu günceller.
- **`POST /devices/:id/confirm-exchange`** -> `confirmExchange(deviceId, userId)`
  - İki taraflı takas onayı mekanizmasını yönetir.

---

## 7. Mimari Detayları

### Mevcut Mimari (Prototip)
- **Client-Side Rendering (CSR):** Uygulama tamamen tarayıcıda çalışır.
- **State Yönetimi:** React Context API (`AppContext.tsx`) kullanılır. Tüm uygulama durumu, kullanıcı bilgileri, cihazlar ve bildirimler burada merkezi olarak yönetilir.
- **Veri Kalıcılığı:** Tüm veriler (`users`, `devices`, `notifications`) tarayıcının `localStorage`'ında JSON string olarak saklanır. Bu, sayfa yenilemelerinde durumun korunmasını sağlar ancak güvensizdir ve ölçeklenebilir değildir.

### Önerilen Üretim Mimarisi
- **Backend:** Node.js (Express/NestJS) veya başka bir backend teknolojisi ile bir RESTful veya GraphQL API'si oluşturulmalıdır.
- **Veritabanı:** PostgreSQL veya MongoDB gibi güvenli ve ölçeklenebilir bir veritabanı kullanılmalıdır.
- **Kimlik Doğrulama:** JWT (JSON Web Tokens) gibi standart bir kimlik doğrulama mekanizması uygulanmalıdır. Şifreler asla düz metin olarak saklanmamalı, `bcrypt` gibi algoritmalarla hash'lenmelidir.
- **Güvenlik:** Tüm kullanıcı verileri (özellikle banka bilgileri) veritabanında şifrelenerek saklanmalıdır.

---

## 8. Veritabanı Şeması (Kavramsal)

`localStorage`'da kullanılan veri yapıları, `types.ts` dosyasında tanımlanan arayüzlere dayanmaktadır.

- **`User` Tablosu:**
  - `id: string` (Primary Key)
  - `fullName: string`
  - `email: string` (Unique)
  - `password_hash: string`
  - `role: UserRole` ('owner', 'finder', 'admin')
  - `bankInfo?: string` (Finder için)

- **`Device` Tablosu:**
  - `id: string` (Primary Key)
  - `userId: string` (Foreign Key -> User)
  - `model: string`
  - `serialNumber: string`
  - `color: string`
  - `invoiceDataUrl?: string` (Base64 data)
  - `description?: string`
  - `status: DeviceStatus` ('Lost', 'Matched', 'Completed' vb.)
  - `rewardAmount?: number`
  - `exchangeConfirmedBy?: string[]` (Onaylayan kullanıcı ID'leri)

---

## 9. Kod Standartları ve Yönergeler

- **TypeScript:** Tüm projede statik tipleme kullanılır. `any` tipinden kaçınılmalıdır.
- **React:** Fonksiyonel bileşenler ve hook'lar kullanılır.
- **İsimlendirme:** Bileşenler `PascalCase`, değişkenler ve fonksiyonlar `camelCase` olarak isimlendirilir.
- **Stil:** Tüm stiller Tailwind CSS utility sınıfları ile yazılır. Özel CSS'ten kaçınılır.
- **Yorumlar:** Karmaşık veya anlaşılması zor olan mantık blokları için açıklayıcı yorumlar eklenir.

---

## 10. Dağıtım (Deployment) Süreci

### Web Sayfası (Frontend)
Bu statik bir site olduğu için dağıtımı çok basittir.
1.  Proje klasörünün içeriğini Netlify, Vercel, veya GitHub Pages gibi bir statik site hosting sağlayıcısına sürükleyip bırakın veya Git reponuzu bağlayın.
2.  **Önemli:** Dağıtım platformunun ayarlarında `API_KEY` environment değişkenini (Google Gemini API anahtarınız) ayarladığınızdan emin olun.

### CI/CD Süreci (Öneri)
- GitHub Actions gibi bir CI/CD aracı kurularak, `main` branch'ine yapılan her push'ta projenin otomatik olarak test edilip dağıtılması sağlanabilir.

---

## 11. Çeviri (Localization/Internationalization) Süreci

Uygulama, `constants.ts` dosyasında yönetilen merkezi bir çeviri sistemi kullanır. Yeni bir dil eklemek için aşağıdaki adımları izleyin:

1.  **Dil Tipini Güncelleyin:**
    `contexts/AppContext.tsx` dosyasında, `Language` türüne yeni dilin iki harfli kodunu ekleyin.
    ```typescript
    type Language = 'en' | 'tr' | 'fr' | 'ja' | 'es' | 'de'; // Örnek: Almanca (de) eklendi
    ```

2.  **Dil Seçeneğini Ekleyin:**
    `components/Header.tsx` dosyasındaki dil seçim menüsüne yeni dil seçeneğini ekleyin.
    ```html
    <option value="de">Deutsch</option>
    ```

3.  **Çeviri Metinlerini Ekleyin:**
    `constants.ts` dosyasındaki `translations` nesnesine yeni dil için bir anahtar ekleyin. `en` nesnesini kopyalayıp tüm metinleri yeni dile çevirin.
    ```javascript
    export const translations = {
      en: { ... },
      tr: { ... },
      // ... diğer diller
      de: {
        appName: "iFoundAnApple",
        home: "Startseite",
        // ... tüm diğer anahtarları çevirin
      }
    };
    ```

Uygulama artık yeni dili otomatik olarak destekleyecektir.

---

## 12. Lisans Bilgisi

Bu proje MIT Lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.