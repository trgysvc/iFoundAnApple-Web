# 🚀 COOLIFY DEPLOYMENT CHECKLIST

## ✅ PRE-DEPLOYMENT KONTROLLER

### 1. Build Test
- [x] `npm run build` başarılı
- [x] Dist klasörü oluşturuldu
- [x] Chunk'lar optimize edildi
- [x] Gzip sıkıştırma çalışıyor

### 2. Dependencies
- [x] `package.json` güncel
- [x] `package-lock.json` güncel
- [x] Production dependencies doğru
  - [x] express
  - [x] cors
  - [x] iyzipay
  - [x] @supabase/supabase-js
  - [x] concurrently

### 3. Server Konfigürasyonu
- [x] `server.cjs` mevcut
- [x] Production mode desteği var
- [x] Static files serve ediliyor
- [x] Health check endpoint var (`/api/health`)
- [x] İyzico endpoint var (`/api/iyzico-payment`)

### 4. Docker Konfigürasyonu
- [x] `Dockerfile` güncel
- [x] Multi-stage build
- [x] Node.js 22-alpine
- [x] Production dependencies only
- [x] Health check tanımlı
- [x] Port 3001 expose
- [x] `.dockerignore` mevcut

### 5. Environment Variables
- [x] `env.example` güncel
- [x] Tüm gerekli değişkenler tanımlı
- [x] `.gitignore`'da `.env` var

---

## 🔧 COOLIFY AYARLARI

### Resource Settings
```
Type: Application
Build Pack: Dockerfile
Port: 3001
```

### Build Settings
```
Build Command: (Dockerfile kullanıyor, gerek yok)
Start Command: (Dockerfile kullanıyor, gerek yok)
```

### Environment Variables (Coolify'de eklenecek)
```bash
# Node Environment
NODE_ENV=production
PORT=3001

# Supabase
VITE_SUPABASE_URL=https://zokkxkyhabihxjskdcfg.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# İyzico Payment Gateway
VITE_IYZICO_API_KEY=your_iyzico_api_key
VITE_IYZICO_SECRET_KEY=your_iyzico_secret_key
VITE_IYZICO_BASE_URL=https://api.iyzipay.com
VITE_IYZICO_CALLBACK_URL=https://yourdomain.com
```

### Health Check Settings
```
Path: /api/health
Port: 3001
Interval: 30s
Timeout: 10s
Retries: 3
```

---

## 🧪 POST-DEPLOYMENT TESTLER

### 1. Health Check
```bash
curl https://yourdomain.com/api/health
```
**Beklenen:** `{"status":"ok","message":"İyzico API Server çalışıyor"}`

### 2. Frontend Yükleme
```
https://yourdomain.com
```
**Beklenen:** Ana sayfa yüklenmeli

### 3. API Endpoint
```bash
curl -X POST https://yourdomain.com/api/iyzico-payment \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```
**Beklenen:** Hata mesajı (ama 500 değil)

### 4. Static Files
```
https://yourdomain.com/icons/apple.svg
```
**Beklenen:** SVG dosyası yüklenmeli

### 5. Routing
```
https://yourdomain.com/login
https://yourdomain.com/dashboard
```
**Beklenen:** Sayfalar yüklenmeli (SPA routing)

---

## ⚠️ OLASI SORUNLAR VE ÇÖZÜMLER

### Sorun 1: "Cannot find module 'express'"
**Çözüm:** 
```bash
# Coolify'de rebuild edin
# package.json'da express dependencies'de olmalı
```

### Sorun 2: "ENOENT: no such file or directory, open 'dist/index.html'"
**Çözüm:**
```bash
# Build çalışmadı
# Coolify logs'u kontrol edin
# npm run build manuel çalıştırın
```

### Sorun 3: "Port 3001 already in use"
**Çözüm:**
```bash
# Coolify otomatik PORT atar
# Environment variable'da PORT=3001 olmalı
```

### Sorun 4: "İyzico API hatası"
**Çözüm:**
```bash
# Environment variables kontrol edin
# VITE_IYZICO_* değişkenleri doğru mu?
```

### Sorun 5: "Supabase connection error"
**Çözüm:**
```bash
# VITE_SUPABASE_URL doğru mu?
# VITE_SUPABASE_ANON_KEY doğru mu?
# Supabase project aktif mi?
```

---

## 📊 DEPLOYMENT AKIŞI

```
1. GitHub'a Push
   ↓
2. Coolify Webhook Tetiklenir
   ↓
3. Docker Build Başlar
   ├─ Builder Stage: npm ci + npm run build
   └─ Production Stage: Copy dist + server.cjs
   ↓
4. Container Başlatılır
   ├─ node server.cjs
   └─ Port 3001'de dinlemeye başlar
   ↓
5. Health Check
   ├─ GET /api/health
   └─ 200 OK → Deployment başarılı ✅
   ↓
6. Domain'e Yönlendirme
   └─ https://yourdomain.com → Container
```

---

## 🎯 DEPLOYMENT SONRASI

### İlk Test
1. Ana sayfayı açın
2. Login yapın
3. Test modu ile ödeme yapın
4. Console'da hata var mı kontrol edin

### Monitoring
- Coolify logs'u takip edin
- Error rate'i kontrol edin
- Response time'ı ölçün

### Rollback Planı
Eğer sorun çıkarsa:
```bash
# Coolify'de önceki deployment'a dön
# Veya Git'te revert yapın
git revert HEAD
git push origin master
```

---

## ✅ DEPLOYMENT HAZIR!

**Tüm kontroller tamamlandı. Coolify'de deploy edebilirsiniz!** 🚀

**Son Kontrol Tarihi:** 2025-01-08  
**Durum:** ✅ PRODUCTION READY
