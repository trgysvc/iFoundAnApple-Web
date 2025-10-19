# Admin Panel Test Script

## 🎯 Test Senaryoları

### 1. Admin Giriş Testi
- **Email**: `turgaysavaci@gmail.com`
- **Beklenen**: Super admin olarak giriş yapabilmeli
- **Test URL**: `http://localhost:5173/login`

### 2. Admin Dashboard Erişimi
- **Test URL**: `http://localhost:5173/admin`
- **Beklenen**: Admin dashboard'a erişebilmeli
- **Kontrol**: Dashboard'da kullanıcı ve cihaz sayıları görünmeli

### 3. Admin Panel Navigasyonu
- **Test URL**: `http://localhost:5173/admin/users`
- **Beklenen**: Kullanıcı yönetimi sayfasına erişebilmeli
- **Diğer Sayfalar**:
  - `/admin/devices` - Cihaz yönetimi
  - `/admin/payments` - Ödeme yönetimi
  - `/admin/escrow` - Emanet yönetimi
  - `/admin/cargo` - Kargo yönetimi
  - `/admin/logs` - Sistem logları
  - `/admin/reports` - Raporlar
  - `/admin/permissions` - Yetki yönetimi
  - `/admin/settings` - Sistem ayarları

### 4. Yetki Kontrolü
- **Normal kullanıcı**: `/admin` sayfasına erişememeli
- **Admin kullanıcı**: Tüm admin sayfalarına erişebilmeli

## 🔍 Test Adımları

1. **Browser'da açın**: `http://localhost:5173`
2. **Login sayfasına gidin**: `/login`
3. **Admin olarak giriş yapın**: `turgaysavaci@gmail.com`
4. **Admin panelini test edin**: `/admin`
5. **Tüm admin sayfalarını kontrol edin**

## 📊 Beklenen Sonuçlar

- ✅ Admin dashboard yüklenmeli
- ✅ Sidebar navigasyon çalışmalı
- ✅ Tüm admin sayfaları erişilebilir olmalı
- ✅ Kullanıcı rolü doğru şekilde tanınmalı
- ✅ Normal kullanıcılar admin sayfalarına erişememeli

## 🐛 Olası Sorunlar

1. **Login hatası**: Admin yetkisi veritabanında yok
2. **Erişim hatası**: AdminRoute çalışmıyor
3. **Sayfa yüklenmiyor**: Route tanımları eksik
4. **Navigasyon çalışmıyor**: AdminLayout sorunu

## 🔧 Debug Komutları

```javascript
// Browser console'da çalıştırın
console.log('Current User:', window.currentUser);
console.log('User Role:', window.currentUser?.role);
console.log('Is Admin:', window.currentUser?.role === 'super_admin' || window.currentUser?.role === 'admin');
```
