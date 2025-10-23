# Coolify Deployment Guide
# iFoundAnApple Projesi için Coolify.io Kurulum Rehberi

## 🚀 Coolify.io Kurulum Adımları

### 1. Coolify.io Hesabı Oluşturma
1. https://coolify.io adresine gidin
2. "Sign Up" ile hesap oluşturun
3. Email doğrulaması yapın
4. Dashboard'a giriş yapın

### 2. Yeni Proje Oluşturma
1. Dashboard'da "New Project" butonuna tıklayın
2. "From Git Repository" seçin
3. GitHub repository'nizi bağlayın:
   - Repository: `your-username/iFoundAnApple-Web`
   - Branch: `main`
   - Build Pack: `Docker` (otomatik algılanır)

### 3. Environment Variables Ayarlama
Coolify dashboard'da "Environment Variables" bölümüne gidin ve şu değişkenleri ekleyin:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# İyzico Payment Gateway Configuration  
VITE_IYZICO_API_KEY=your-iyzico-api-key
VITE_IYZICO_SECRET_KEY=your-iyzico-secret-key
VITE_IYZICO_BASE_URL=https://sandbox-api.iyzipay.com

# Production Settings
NODE_ENV=production
VITE_APP_ENV=production

# Domain Configuration
VITE_APP_URL=https://ifoundanapple.com
VITE_APP_NAME=iFoundAnApple

# Security Settings
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true

# Feature Flags
VITE_ENABLE_ADMIN_PANEL=true
VITE_ENABLE_RATING_SYSTEM=true
VITE_ENABLE_DISPUTE_SYSTEM=true
```

### 4. Domain Yapılandırması
1. "Domains" bölümüne gidin
2. "Add Domain" ile `ifoundanapple.com` ekleyin
3. SSL sertifikası otomatik oluşturulacak
4. Cloudflare DNS ayarlarını güncelleyin:
   ```
   Type: CNAME
   Name: @
   Value: your-coolify-app.coolify.io
   
   Type: CNAME  
   Name: www
   Value: your-coolify-app.coolify.io
   ```

### 5. Build ve Deploy Ayarları
1. "Build Settings" bölümüne gidin
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Node Version: `22`
5. "Deploy" butonuna tıklayın

### 6. Production Hazırlığı

#### Supabase Production Ayarları
1. Supabase dashboard'da production projesi oluşturun
2. Database schema'yı production'a aktarın
3. RLS politikalarını aktif edin
4. API keys'i güncelleyin

#### İyzico Production Ayarları
1. İyzico'da production hesabı açın
2. API keys'i production değerleriyle değiştirin
3. Webhook URL'lerini güncelleyin:
   - Success: `https://ifoundanapple.com/api/webhooks/iyzico-success`
   - Callback: `https://ifoundanapple.com/api/webhooks/iyzico-callback`

### 7. Monitoring ve Analytics
1. Coolify dashboard'da monitoring ayarlarını aktif edin
2. Error tracking için Sentry entegrasyonu ekleyin
3. Analytics için Google Analytics ekleyin

### 8. Backup ve Güvenlik
1. Supabase'de otomatik backup ayarlayın
2. Environment variables'ları güvenli tutun
3. SSL sertifikalarını kontrol edin

## 🔧 Troubleshooting

### Build Hataları
- Node.js versiyonunu kontrol edin
- Dependencies'leri güncelleyin
- Build loglarını inceleyin

### Domain Sorunları
- DNS propagation'ı bekleyin (24-48 saat)
- Cloudflare proxy'yi geçici olarak kapatın
- SSL sertifikası oluşumunu bekleyin

### Environment Variables
- Tüm gerekli değişkenlerin eklendiğini kontrol edin
- Değerlerin doğru olduğunu kontrol edin
- Restart yapın

## 📞 Destek
- Coolify Documentation: https://coolify.io/docs
- GitHub Issues: Proje repository'sinde
- Email: turgaysavaci@gmail.com

---
**Son Güncelleme:** 19 Ekim 2025
**Versiyon:** 5.2
**Durum:** Production Ready
