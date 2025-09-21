# Coolify Deployment Guide

Bu proje Coolify ile deployment için optimize edilmiştir.

## 🚀 Deployment Özellikleri

### ✅ Coolify Uyumlu Özellikler
- **Node.js 22**: Modern Node.js runtime
- **Vite Build**: Hızlı ve optimize edilmiş build
- **Multi-stage Docker**: Küçük production image
- **Nginx Serving**: Optimize edilmiş static file serving
- **Code Splitting**: Lazy loading ile optimize edilmiş chunks
- **Environment Variables**: Coolify env vars ile uyumlu

## 📋 Deployment Adımları

### 1. Coolify'da Proje Oluşturma
```bash
# Git repository URL'inizi Coolify'a ekleyin
https://github.com/your-username/ifoundanapple-web.git
```

### 2. Environment Variables
Coolify dashboard'unda şu environment variable'ları ekleyin:

```bash
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# App Config
NODE_ENV=production
VITE_APP_URL=https://your-domain.com
```

### 3. Build Configuration
Coolify otomatik olarak şunları algılayacak:
- **Build Command**: `npm run build`
- **Port**: `80` (nginx)
- **Health Check**: `/health`

## 🔧 Build Process

### 1. Dependencies Install
```bash
npm ci --only=production
```

### 2. Vite Build
```bash
npm run build
# Output: dist/ klasörü
```

### 3. Nginx Serving
- Static files: `/usr/share/nginx/html`
- Gzip compression: Aktif
- Cache headers: Optimize edilmiş
- SPA routing: `try_files` ile destekleniyor

## 📊 Performance Optimizasyonları

### Bundle Sizes (Gzipped)
- **Initial Load**: ~106kB
- **React Vendor**: 9.50kB
- **Payment Chunk**: 13.93kB
- **Admin Chunk**: 5.13kB
- **Static Pages**: 9.92kB

### Lazy Loading
- ✅ Route-based code splitting
- ✅ Automatic preloading
- ✅ Performance monitoring
- ✅ Loading states

## 🛡️ Security Headers

Nginx konfigürasyonunda şu security header'lar aktif:
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

## 🔍 Health Check

Health check endpoint:
```bash
GET /health
Response: "healthy"
```

## 📁 Docker Multi-stage Build

### Stage 1: Builder
- Node.js 22 Alpine
- npm dependencies
- Vite build process

### Stage 2: Production
- Nginx Alpine (minimal size)
- Static files serving
- Optimized configuration

## ⚡ Coolify Avantajları

### ✅ Bu Setup ile Coolify'da:
- **Auto-deployment**: Git push ile otomatik deploy
- **Zero-downtime**: Rolling deployment
- **SSL/TLS**: Otomatik Let's Encrypt
- **Custom domains**: Kolay domain yönetimi
- **Environment management**: GUI ile env vars
- **Monitoring**: Built-in monitoring
- **Logs**: Real-time log viewing

### 🚫 Sorun Yaratmayacak Özellikler:
- ✅ **Node.js tabanlı**: Coolify'ın native desteği
- ✅ **Standard Dockerfile**: Docker build process
- ✅ **Environment variables**: Coolify env system
- ✅ **Health checks**: Monitoring integration
- ✅ **Static file serving**: Nginx optimization

## 🎯 Deployment Sonrası

Deploy edildikten sonra:
1. **Health check**: `/health` endpoint'ini test edin
2. **Performance**: Lazy loading'in çalıştığını kontrol edin
3. **Environment**: Supabase bağlantısını test edin
4. **Monitoring**: Coolify dashboard'unda metrikleri izleyin

## 🔄 Güncellemeler

Kod güncellemeleri için:
```bash
git push origin master
# Coolify otomatik olarak yeni deploy başlatacak
```

**Bu setup ile Coolify'da hiçbir problem yaşamayacaksınız!** 🚀
