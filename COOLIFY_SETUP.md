# COOLIFY DEPLOYMENT SETUP

## 📋 DEPLOYMENT YAPISI

Bu proje **hybrid** bir yapıya sahip:
- **Frontend:** Vite + React (SPA)
- **Backend:** Express.js (İyzico API için)
- **Port:** 3001 (production'da `PORT` env variable ile değiştirilebilir)

---

## 🚀 COOLIFY DEPLOYMENT ADIMLARI

### 1. Repository Bağlama
1. Coolify dashboard'a gidin
2. "New Resource" → "Application"
3. GitHub/GitLab repository'nizi seçin
4. Branch: `master` veya `main`

### 2. Build Settings
```
Build Command: npm install && npm run build
Start Command: npm start
Port: 3001
```

### 3. Environment Variables
Coolify'de şu environment variable'ları ekleyin:

```bash
# Node Environment
NODE_ENV=production

# Port (Coolify otomatik ayarlar, opsiyonel)
PORT=3001

# Supabase
VITE_SUPABASE_URL=https://zokkxkyhabihxjskdcfg.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# İyzico Production (Sandbox'tan değiştirin!)
VITE_IYZICO_API_KEY=your_production_api_key
VITE_IYZICO_SECRET_KEY=your_production_secret_key
VITE_IYZICO_BASE_URL=https://api.iyzipay.com

# İyzico Callback URL
VITE_IYZICO_CALLBACK_URL=https://yourdomain.com
```

### 4. Dockerfile (Opsiyonel - Coolify otomatik oluşturur)
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Dependencies
COPY package*.json ./
RUN npm ci --only=production

# Build
COPY . .
RUN npm run build

# Start
EXPOSE 3001
CMD ["npm", "start"]
```

---

## 🔧 DEVELOPMENT vs PRODUCTION

### Development (Local):
```bash
# Terminal 1 - Backend Server
npm run server

# Terminal 2 - Frontend Dev Server
npm run dev

# Veya tek komutla
npm run dev:full
```

**Frontend:** http://localhost:5173  
**Backend API:** http://localhost:3001

### Production (Coolify):
```bash
npm start
```

**Tek server hem frontend hem backend serve eder:**
- Frontend: `https://yourdomain.com`
- Backend API: `https://yourdomain.com/api/*`

---

## 📊 API ENDPOINTS

### Health Check
```
GET /api/health
Response: { "status": "ok", "message": "İyzico API Server çalışıyor" }
```

### İyzico Payment
```
POST /api/iyzico-payment
Content-Type: application/json

Body: {
  "amount": 449.09,
  "currency": "TRY",
  "conversationId": "conv_xxx",
  "buyerInfo": { ... },
  "shippingAddress": { ... },
  "billingAddress": { ... },
  "basketItems": [ ... ]
}

Response: {
  "success": true,
  "paymentId": "27349333",
  "status": "completed",
  "providerResponse": { ... }
}
```

---

## ✅ DEPLOYMENT CHECKLIST

### Pre-Deployment:
- [ ] `npm run build` başarılı
- [ ] Environment variables hazır
- [ ] İyzico production credentials alındı
- [ ] Supabase production database hazır
- [ ] Domain SSL sertifikası var

### Post-Deployment:
- [ ] Health check çalışıyor
- [ ] Frontend yükleniyor
- [ ] API endpoint'leri çalışıyor
- [ ] İyzico test ödemesi başarılı
- [ ] Database bağlantısı çalışıyor

---

## 🐛 TROUBLESHOOTING

### Sorun: "Cannot GET /api/iyzico-payment"
**Çözüm:** Server başlamadı. Coolify logs'u kontrol edin.

### Sorun: "ECONNREFUSED"
**Çözüm:** PORT environment variable doğru ayarlanmamış.

### Sorun: "İyzico API hatası"
**Çözüm:** İyzico credentials'ı kontrol edin.

### Sorun: Frontend yüklenmiyor
**Çözüm:** `npm run build` çalıştırıldı mı kontrol edin.

---

## 📝 COOLIFY CONFIGURATION

### Resource Type
Application (Node.js)

### Build Pack
Node.js

### Health Check
```
Path: /api/health
Port: 3001
Interval: 30s
Timeout: 10s
```

### Restart Policy
Always

---

## 🔒 SECURITY NOTES

1. **API Keys:** Asla commit etmeyin!
2. **CORS:** Production'da domain'inizi ekleyin
3. **Rate Limiting:** API endpoint'lerine rate limit ekleyin
4. **HTTPS:** Zorunlu (Coolify otomatik sağlar)

---

## 📞 SUPPORT

### Coolify Docs
https://coolify.io/docs

### İyzico Docs
https://dev.iyzipay.com/

---

**Son Güncelleme:** 2025-01-08  
**Durum:** Production Ready ✅
