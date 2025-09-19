# 🔐 Güvenlik Rehberi - iFoundAnApple

Bu rehber, iFoundAnApple projesinin güvenlik açıklarını ve çözümlerini açıklar.

## 🚨 Tespit Edilen Güvenlik Riskleri

### 1. 🔑 API Anahtarları Güvenliği (KRİTİK)

#### **Sorun:**
- Supabase API anahtarları kodda hardcoded
- Environment variables kullanılmıyor
- Production ve development anahtarları ayrılmamış

#### **Çözüm:**
```bash
# .env dosyası oluşturun
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

#### **Güvenli Kullanım:**
```typescript
// ❌ GÜVENSİZ
const supabaseUrl = "https://zokkxkyhabihxjskdcfg.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

// ✅ GÜVENLİ
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

### 2. 🎯 XSS (Cross-Site Scripting) Açıkları (YÜKSEK)

#### **Sorun:**
- `dangerouslySetInnerHTML` kullanımı
- Kullanıcı girdilerinin sanitize edilmemesi
- HTML injection riski

#### **Etkilenen Dosyalar:**
- `pages/TermsPage.tsx`
- `pages/PrivacyPage.tsx`
- `pages/RegisterPage.tsx` (terms checkbox)

#### **Çözüm:**
```typescript
// ❌ GÜVENSİZ
<div dangerouslySetInnerHTML={{ __html: content }} />

// ✅ GÜVENLİ - DOMPurify kullanın
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(content) 
}} />
```

### 3. 📝 Hassas Veri Loglaması (ORTA)

#### **Sorun:**
- Kullanıcı bilgileri console.log'da
- Production'da debug logları aktif
- Hassas verilerin tarayıcı konsolunda görünmesi

#### **Etkilenen Dosyalar:**
- `contexts/AppContext.tsx`
- `pages/ProfilePage.tsx`
- `pages/DeviceDetailPage.tsx`
- `pages/DashboardPage.tsx`

#### **Çözüm:**
```typescript
// ❌ GÜVENSİZ
console.log("User data:", { email, password, bankInfo });

// ✅ GÜVENLİ
const isDev = import.meta.env.DEV;
if (isDev) {
  console.log("User data:", { email: "***", id: user.id });
}
```

### 4. 🔓 Input Validation Eksiklikleri (ORTA)

#### **Sorun:**
- Form inputlarında yeterli validasyon yok
- TC Kimlik No format kontrolü eksik
- IBAN validasyonu eksik
- File upload validasyonu yetersiz

#### **Çözüm:**
```typescript
// TC Kimlik No validasyonu
const validateTCKimlik = (tcNo: string): boolean => {
  if (!/^\d{11}$/.test(tcNo)) return false;
  // TC Kimlik algoritması...
  return true;
};

// IBAN validasyonu
const validateIBAN = (iban: string): boolean => {
  const ibanRegex = /^TR\d{24}$/;
  return ibanRegex.test(iban.replace(/\s/g, ''));
};
```

### 5. 🌐 CORS ve CSP Eksiklikleri (ORTA)

#### **Sorun:**
- Content Security Policy tanımlı değil
- CORS headers yeterli değil
- Inline scripts güvenlik riski

#### **Çözüm:**
```html
<!-- index.html'e ekleyin -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
               font-src 'self' https://fonts.gstatic.com;
               connect-src 'self' https://*.supabase.co https://generativelanguage.googleapis.com;">
```

## 🛡️ Güvenlik En İyi Uygulamaları

### 1. Environment Variables
```bash
# Development
VITE_NODE_ENV=development
VITE_SUPABASE_URL=https://dev.supabase.co
VITE_SUPABASE_ANON_KEY=dev_key

# Production
VITE_NODE_ENV=production
VITE_SUPABASE_URL=https://prod.supabase.co
VITE_SUPABASE_ANON_KEY=prod_key
```

### 2. Logging Best Practices
```typescript
const logger = {
  info: (message: string, data?: any) => {
    if (import.meta.env.DEV) {
      console.log(message, data);
    }
  },
  error: (message: string, error?: any) => {
    console.error(message, error?.message || error);
  },
  warn: (message: string, data?: any) => {
    console.warn(message, data);
  }
};
```

### 3. Input Sanitization
```typescript
import DOMPurify from 'dompurify';

const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input.trim());
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
```

### 4. File Upload Security
```typescript
const validateFile = (file: File): boolean => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (!allowedTypes.includes(file.type)) return false;
  if (file.size > maxSize) return false;
  
  return true;
};
```

## 🔍 Güvenlik Testleri

### 1. XSS Test
```javascript
// Bu inputları test edin
"<script>alert('XSS')</script>"
"javascript:alert('XSS')"
"<img src=x onerror=alert('XSS')>"
```

### 2. Input Validation Test
```javascript
// Geçersiz TC Kimlik No
"12345678901" // Algoritma hatası
"1234567890a" // Harf içeriyor
"123456789" // 11 haneden az

// Geçersiz IBAN
"TR123456789012345678901234" // Yanlış format
"US123456789012345678901234" // Türkiye dışı
```

### 3. Authentication Test
```javascript
// localStorage manipulation
localStorage.setItem('current-user', JSON.stringify({
  id: 'fake-user-id',
  email: 'fake@email.com'
}));
```

## 📋 Güvenlik Checklist

### Geliştirme Öncesi
- [ ] Environment variables kurulumu
- [ ] .gitignore güncellemesi
- [ ] API anahtarları güvenliği
- [ ] Input validation planlaması

### Geliştirme Sırasında
- [ ] XSS koruması implementasyonu
- [ ] SQL injection koruması
- [ ] File upload validasyonu
- [ ] Error handling güvenliği
- [ ] Logging sanitizasyonu

### Deployment Öncesi
- [ ] Production environment variables
- [ ] HTTPS konfigürasyonu
- [ ] CSP headers
- [ ] Rate limiting
- [ ] Security headers

### Production Sonrası
- [ ] Security monitoring
- [ ] Log analizi
- [ ] Vulnerability scanning
- [ ] Penetration testing
- [ ] Security updates

## 🚨 Acil Müdahale

### API Key Sızıntısı Durumunda
1. **Anında key'leri rotate edin**
2. **Git history'yi temizleyin**
3. **Affected services'leri restart edin**
4. **Monitoring'i artırın**

### XSS Saldırısı Tespit Edilirse
1. **Affected sayfaları disable edin**
2. **Input validation'ı strengthen edin**
3. **CSP headers ekleyin**
4. **User sessions'ları invalidate edin**

---

**⚠️ UYARI:** Bu güvenlik açıkları derhal düzeltilmelidir. Production'a çıkmadan önce tüm kritik ve yüksek riskli sorunlar çözülmelidir.

**📞 Güvenlik Desteği:** Güvenlik konularında yardım için güvenlik ekibine başvurun.

---

**Oluşturulma:** Ocak 2025  
**Son Güncelleme:** Ocak 2025  
**Versiyon:** 1.0.0
