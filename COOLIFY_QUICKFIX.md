# 🚨 COOLIFY 405 HATASI - HIZLI ÇÖZÜM

## Sorun
```
POST https://ifoundanapple.com/api/iyzico-payment 405 (Method Not Allowed)
```

## Neden?
Coolify uygulamanızı **static site** olarak deploy etmiş. Bunun yerine **Node.js server** çalıştırması gerekiyor.

---

## ✅ ÇÖZÜM (3 Adım)

### 1️⃣ Coolify Dashboard'a Gidin
1. Projenizi seçin
2. **"Settings"** → **"General"** bölümüne gidin

### 2️⃣ Build Pack Değiştirin
```
Build Pack: Dockerfile (önerilen)
```

**VEYA** Nixpacks kullanıyorsanız:
```
Build Pack: Nixpacks
Start Command: node server.cjs
Port: 3000
```

### 3️⃣ Environment Variables Kontrol
```bash
NODE_ENV=production
PORT=3000
VITE_IYZICO_API_KEY=your_production_key
VITE_IYZICO_SECRET_KEY=your_production_secret
VITE_IYZICO_BASE_URL=https://api.iyzipay.com
```

### 4️⃣ Redeploy
- **"Redeploy"** butonuna tıklayın
- Deploy tamamlanınca test edin

---

## 🧪 TEST

### 1. Health Check
Tarayıcıda açın:
```
https://ifoundanapple.com/api/health
```

**Beklenen sonuç:**
```json
{"status":"ok","message":"İyzico API Server çalışıyor"}
```

❌ **Eğer hala 405 alıyorsanız:**
- Coolify logs'u kontrol edin
- "Start Command" doğru mu kontrol edin
- Dockerfile kullandığınızdan emin olun

✅ **200 OK alıyorsanız:**
- Server çalışıyor!
- Ödeme işlemini tekrar deneyin

---

## 📋 COOLIFY LOGS KONTROLÜ

1. Coolify Dashboard → Projeniz → **"Logs"**
2. Şunu görmelisiniz:
```
✅ İyzico API Server çalışıyor: http://localhost:3000
📊 Mode: PRODUCTION
📊 Health check: http://localhost:3000/api/health
💳 Payment endpoint: http://localhost:3000/api/iyzico-payment
```

❌ **Göremiyorsanız:**
- Build Pack yanlış (static site deploy etmiş)
- Start Command yanlış veya eksik
- Dockerfile'ı commit ettiniz mi kontrol edin

---

## 🔍 DEBUG ADIMLARI

### Adım 1: Logs'da ne yazıyor?
```
Coolify → Your Project → Logs
```

**Aranan kelimeler:**
- "İyzico API Server" ✅
- "nginx" ❌ (static site demektir)
- "serve" ❌ (static site demektir)

### Adım 2: Port doğru mu?
```bash
# Coolify'da
Settings → Port Mappings
Container Port: 3000
```

### Adım 3: Dockerfile commit edilmiş mi?
```bash
git log --all --full-history -- Dockerfile
```

---

## 💡 ÖNEMLİ NOTLAR

1. **Build Pack olarak "Dockerfile" kullanın** (en güvenilir yöntem)
2. **PORT env variable** Coolify tarafından override edilebilir
3. **Health check** başarısızsa server çalışmıyor demektir
4. **405 hatası** her zaman static site deploy edildiğini gösterir

---

## 🎯 ÖZET

| Durum | Çözüm |
|-------|-------|
| 405 Method Not Allowed | Build Pack → Dockerfile, Redeploy |
| Health check başarısız | Logs kontrol, Start Command kontrol |
| Environment variables eksik | Settings → Environment Variables |
| Server çalışıyor ama ödeme hatası | İyzico credentials kontrol |

---

**Son Güncelleme:** 2025-10-08  
**Durum:** Çözüldü ✅
