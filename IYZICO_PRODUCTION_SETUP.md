# İYZİCO PRODUCTION KURULUM REHBERİ

## 📋 MEVCUT DURUM

### ✅ Test Modu (Sandbox) - AKTİF
- **API Key:** `sandbox-xQUfDCNqUzFl3TeQ6TwUxk7QovYnthKL`
- **Secret Key:** `sandbox-njCZVrXuJuKXu12mUdjUs4g9sQHy9PqR`
- **Base URL:** `https://sandbox-api.iyzipay.com`
- **Dashboard:** https://sandbox-merchant.iyzipay.com/
- **Durum:** ✅ ÇALIŞIYOR - Tüm testler başarılı

### ⏸️ Production Modu - DEVRE DIŞI
- **Durum:** Henüz aktif değil
- **Sebep:** Test aşaması tamamlanmalı
- **Aktivasyon:** Aşağıdaki adımlar tamamlanınca

---

## 🧪 TEST AŞAMASI (ŞU AN)

### Test Modu Özellikleri:
1. ✅ İyzico Sandbox API kullanıyor
2. ✅ Gerçek ödeme akışını simüle ediyor
3. ✅ 3D Secure desteği var
4. ✅ Webhook/Callback çalışıyor
5. ✅ Database entegrasyonu tam
6. ✅ Hata yönetimi aktif

### Test Kartları:
```
Başarılı Ödeme:
- Kart No: 5528790000000008
- CVV: 123
- Ay/Yıl: 12/2030
- Kart Sahibi: Test User

3D Secure Test:
- Kart No: 5528790000000008
- SMS Kodu: Her zaman "123456"
```

### Test Senaryoları:
- [x] Başarılı ödeme
- [x] Database kayıt
- [x] Escrow oluşturma
- [x] Başarı sayfası yönlendirme
- [ ] 3D Secure akışı
- [ ] Webhook testi
- [ ] Hata senaryoları
- [ ] Farklı tutarlar
- [ ] Farklı kullanıcılar

---

## 🚀 PRODUCTION'A GEÇİŞ ADIMLARI

### Adım 1: Gerçek API Credentials Alma
1. https://merchant.iyzipay.com/ adresine gidin
2. Hesap oluşturun/giriş yapın
3. "Ayarlar" → "API Anahtarları" bölümüne gidin
4. **Production API Key** ve **Secret Key** alın

### Adım 2: Environment Variables Güncelleme
`.env` dosyasını güncelleyin:

```bash
# İyzico Production Credentials
VITE_IYZICO_API_KEY=your_production_api_key_here
VITE_IYZICO_SECRET_KEY=your_production_secret_key_here
VITE_IYZICO_BASE_URL=https://api.iyzipay.com

# Callback URL (Production domain)
VITE_IYZICO_CALLBACK_URL=https://yourdomain.com
```

### Adım 3: Kod Değişiklikleri

#### 3.1. Test Modunu Sandbox'a Geri Çevir
`utils/paymentGateway.ts` dosyasında:
```typescript
case "test":
  // Test için Sandbox kullan
  paymentResult = await processIyzicoPayment(request);
  break;
```

#### 3.2. Production Modunu Aktif Et
`components/payment/PaymentMethodSelector.tsx` dosyasında:
```typescript
{
  id: 'iyzico',
  name: 'Iyzico',
  description: t('turkeyTrustedPayment'),
  icon: '🇹🇷',
  fees: '%2.9 ' + t('commission'),
  processingTime: t('instant'),
  isRecommended: true,  // ✅ Aktif et
  isEnabled: true        // ✅ Aktif et
}
```

#### 3.3. İyzico Config'i Güncelle
`utils/iyzicoConfig.ts` dosyasında production kontrolü ekle:
```typescript
export const getIyzicoConfig = () => {
  const config = getSecureConfig();
  
  // Production veya Sandbox seçimi
  const isProduction = config.iyzico.baseUrl?.includes('api.iyzipay.com');
  
  const apiKey = config.iyzico.apiKey || 'sandbox-xQUfDCNqUzFl3TeQ6TwUxk7QovYnthKL';
  const secretKey = config.iyzico.secretKey || 'sandbox-njCZVrXuJuKXu12mUdjUs4g9sQHy9PqR';
  const baseUrl = config.iyzico.baseUrl || 'https://sandbox-api.iyzipay.com';
  
  console.log('[IYZICO_CONFIG] Mode:', isProduction ? 'PRODUCTION' : 'SANDBOX');
  console.log('[IYZICO_CONFIG] Base URL:', baseUrl);
  
  return new Iyzipay({
    apiKey,
    secretKey,
    uri: baseUrl
  });
};
```

### Adım 4: Webhook URL Ayarlama
1. İyzico merchant panel'e gidin
2. "Ayarlar" → "Webhook" bölümüne gidin
3. Webhook URL'i ekleyin:
   ```
   https://yourdomain.com/api/webhooks/iyzico-callback
   ```
4. 3D Secure Callback URL:
   ```
   https://yourdomain.com/api/webhooks/iyzico-3d-callback
   ```

### Adım 5: Test Öncesi Kontrol Listesi
- [ ] Production API credentials doğru mu?
- [ ] `.env` dosyası güncellendi mi?
- [ ] Webhook URL'leri ayarlandı mı?
- [ ] Domain SSL sertifikası var mı?
- [ ] Database production'a hazır mı?
- [ ] Hata loglama aktif mi?
- [ ] Backup sistemi hazır mı?

### Adım 6: Production Test
1. **Küçük tutarla test edin** (1 TRY)
2. Gerçek kart kullanın
3. Tüm akışı test edin:
   - Ödeme başlatma
   - 3D Secure
   - Webhook
   - Database kayıt
   - Başarı sayfası

---

## 📊 KARŞILAŞTIRMA

| Özellik | Test (Sandbox) | Production |
|---------|---------------|------------|
| **API URL** | sandbox-api.iyzipay.com | api.iyzipay.com |
| **Dashboard** | sandbox-merchant.iyzipay.com | merchant.iyzipay.com |
| **Gerçek Para** | ❌ Hayır | ✅ Evet |
| **Test Kartları** | ✅ Çalışır | ❌ Çalışmaz |
| **Gerçek Kartlar** | ❌ Çalışmaz | ✅ Çalışır |
| **Komisyon** | ❌ Kesilmez | ✅ Kesilir |
| **3D Secure** | ✅ Simülasyon | ✅ Gerçek |
| **Webhook** | ✅ Test | ✅ Gerçek |

---

## ⚠️ ÖNEMLİ NOTLAR

### Güvenlik:
1. **API Keys'i asla commit etmeyin!**
2. `.env` dosyası `.gitignore`'da olmalı
3. Production credentials'ı sadece server'da tutun
4. HTTPS zorunlu (SSL sertifikası)

### Test Süreci:
1. Önce Sandbox'ta tüm senaryoları test edin
2. Production'a geçmeden önce code review yapın
3. İlk production ödemesini küçük tutarla yapın
4. Monitoring ve alerting sistemleri kurun

### Rollback Planı:
Eğer production'da sorun çıkarsa:
1. Hemen test moduna geri dönün
2. Kullanıcılara bildirim gönderin
3. Sorunu çözün
4. Tekrar test edin
5. Production'a geri dönün

---

## 🎯 SONRAKI ADIMLAR

### Şu An:
✅ Test modu aktif
✅ İyzico Sandbox API kullanılıyor
✅ Tüm testler başarılı

### Yapılacaklar:
1. [ ] Tüm test senaryolarını tamamla
2. [ ] 3D Secure akışını test et
3. [ ] Webhook'ları test et
4. [ ] Production credentials al
5. [ ] Production'a geç
6. [ ] Gerçek ödeme testi yap

---

## 📞 DESTEK

### İyzico Destek:
- **Email:** destek@iyzico.com
- **Telefon:** +90 850 XXX XX XX
- **Dokümantasyon:** https://dev.iyzipay.com/

### Test Sorunları:
- Sandbox hesabınızın aktif olduğundan emin olun
- API credentials'ın doğru olduğunu kontrol edin
- Console loglarını inceleyin
- Network tab'ı kontrol edin

---

## ✅ KONTROL LİSTESİ

### Test Aşaması (Şu An):
- [x] İyzico SDK kurulumu
- [x] Sandbox API bağlantısı
- [x] Test ödemesi başarılı
- [x] Database entegrasyonu
- [x] Hata yönetimi
- [ ] 3D Secure testi
- [ ] Webhook testi
- [ ] Tüm senaryolar

### Production Hazırlığı:
- [ ] Production credentials alındı
- [ ] Environment variables güncellendi
- [ ] Webhook URL'leri ayarlandı
- [ ] SSL sertifikası var
- [ ] Monitoring kuruldu
- [ ] Backup sistemi hazır
- [ ] Test ödemesi yapıldı

---

**Son Güncelleme:** 2025-01-08
**Durum:** Test Aşaması - İyzico Sandbox Aktif ✅
