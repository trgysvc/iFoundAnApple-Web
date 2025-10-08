# 🚀 Coolify Production Deployment - 405 Hatasının Çözümü

## Sorun
Production'da **405 Method Not Allowed** hatası alıyordunuz çünkü Coolify uygulamanızı static site olarak deploy etmişti.

## Çözüm
Dockerfile ve Coolify ayarları güncellendi. Artık hem frontend hem backend API tek container'da çalışıyor.

---

## ✅ Yapılan Değişiklikler

### 1. **Dockerfile Optimizasyonu**
- Port `3001` → `3000` (standart)
- Health check portu dinamik hale getirildi
- Gereksiz `api` folder kopyalama kaldırıldı
- Multi-stage build optimize edildi

### 2. **COOLIFY_SETUP.md Güncelleme**
- Build Pack: **Dockerfile** kullanımı zorunlu hale getirildi
- Port konfigürasyonu güncellendi
- 405 hatası troubleshooting eklendi
- Health check adımları detaylandırıldı

### 3. **COOLIFY_QUICKFIX.md** (YENİ)
- 405 hatasının hızlı çözüm rehberi
- Adım adım debug kılavuzu
- Coolify logs kontrol talimatları

---

## 🔧 Coolify'da Yapmanız Gerekenler

### 1. Build Settings
```
Build Pack: Dockerfile ✅
Port: 3000
```

### 2. Environment Variables
```bash
NODE_ENV=production
PORT=3000
VITE_IYZICO_API_KEY=<production-key>
VITE_IYZICO_SECRET_KEY=<production-secret>
VITE_IYZICO_BASE_URL=https://api.iyzipay.com
VITE_SUPABASE_URL=<your-url>
VITE_SUPABASE_ANON_KEY=<your-key>
```

### 3. Redeploy
- Git push yapın
- Coolify'da "Redeploy" butonuna basın
- Logs'u izleyin

### 4. Test
```
https://ifoundanapple.com/api/health
```
Beklenen sonuç:
```json
{"status":"ok","message":"İyzico API Server çalışıyor"}
```

---

## 📦 Deployment Flow

```
1. Code Push → GitHub/GitLab
2. Coolify Webhook → Auto Deploy
3. Docker Build → Multi-stage
4. Container Start → node server.cjs
5. Server Ready → Hem Frontend hem API
6. Health Check → /api/health (OK)
7. Production Live! 🎉
```

---

## 🔍 Debug Checklist

- [ ] Coolify Build Pack = "Dockerfile"
- [ ] Environment variables doğru
- [ ] Git push yapıldı
- [ ] Coolify redeploy tamamlandı
- [ ] Health check başarılı (/api/health)
- [ ] Frontend yükleniyor
- [ ] API endpoints çalışıyor (test payment)
- [ ] Logs'da "İyzico API Server" görünüyor

---

## 📚 İlgili Dosyalar

- `Dockerfile` - Production build configuration
- `server.cjs` - Express server (API + Frontend)
- `COOLIFY_SETUP.md` - Detaylı deployment rehberi
- `COOLIFY_QUICKFIX.md` - Hızlı çözüm rehberi
- `package.json` - Start script: `node server.cjs`

---

## 💡 Notlar

1. **Tek Container:** Hem frontend hem backend aynı container'da
2. **Port:** Coolify PORT env variable ile override edilebilir
3. **API Endpoint:** Production'da same-origin (`/api/*`)
4. **No Extra Port:** 3001 portuna ihtiyaç yok, tek port yeterli
5. **Dockerfile kullanımı öneriliyor** (Nixpacks yerine)

---

**Deploy Tarihi:** 2025-10-08  
**Durum:** Production Ready ✅  
**Test:** Pending (Coolify redeploy sonrası)
