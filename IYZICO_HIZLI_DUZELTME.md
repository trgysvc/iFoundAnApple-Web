# 🚨 İYZİCO ACİL DÜZELTME REHBERİ

## ⚠️ KRİTİK SORUN: SDK Uyumsuzluğu

### Sorun
Kodunuz **iyzipay v1.x** için yazılmış ama sisteminizde **v2.0.64** yüklü.

### Belirtiler
```
❌ Iyzipay.Buyer is not a constructor
❌ Iyzipay.CreatePaymentRequest is not a constructor
```

### Çözüm Seçenekleri

#### SEÇENEK 1: Eski SDK'ya Geri Dön (Hızlı Çözüm - 15 dakika)
```bash
cd "c:\Code\Project ELMA\2. WEB\iFoundAnApple-Web"
npm uninstall iyzipay
npm install iyzipay@1.0.54
```

**Artıları:**
- ✅ Kod değişikliği gerektirmez
- ✅ Hızlı çözüm
- ✅ Mevcut kod çalışır

**Eksileri:**
- ⚠️ Eski SDK (güvenlik güncellemeleri olmayabilir)
- ⚠️ Yeni özellikler yok

#### SEÇENEK 2: Kodu Yeni SDK'ya Uyarla (Kalıcı Çözüm - 2-3 saat)

**İyzipay v2.x API Kullanımı:**

```typescript
// ESKİ YOL (v1.x) - ÇALIŞMIYOR ❌
const request = new Iyzipay.CreatePaymentRequest();
const buyer = new Iyzipay.Buyer();

// YENİ YOL (v2.x) - ÇALIŞIR ✅
const request = {
  locale: Iyzipay.LOCALE.TR,
  conversationId: '123456',
  price: '1.0',
  paidPrice: '1.0',
  currency: Iyzipay.CURRENCY.TRY,
  installment: '1',
  basketId: 'B67832',
  paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
  paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT
};
```

**Güncellenecek Dosyalar:**
1. `utils/iyzico3DSecure.ts` (56-133. satırlar)
2. Test dosyaları

---

## 🔧 ADIM ADIM DÜZELTME

### 1. SDK Seçimi Yap (ŞİMDİ!)

**TAVSİYE:** Önce Seçenek 1 ile hızlı düzelt, sonra Seçenek 2'yi planla.

```bash
# Terminalden çalıştır:
npm uninstall iyzipay
npm install iyzipay@1.0.54
```

### 2. .env Dosyası Oluştur

```bash
# env.example'ı kopyala
cp env.example .env
```

`.env` dosyasını düzenle:
```env
# Supabase (kendi credentials'larınız)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# İyzico Sandbox (test için hazır)
VITE_IYZICO_API_KEY=sandbox-xQUfDCNqUzFl3TeQ6TwUxk7QovYnthKL
VITE_IYZICO_SECRET_KEY=sandbox-njCZVrXuJuKXu12mUdjUs4g9sQHy9PqR
VITE_IYZICO_BASE_URL=https://sandbox-api.iyzipay.com
VITE_IYZICO_CALLBACK_URL=http://localhost:5173/api/webhooks/iyzico-callback
```

### 3. Webhook Signature'ı Düzelt

**Dosya:** `utils/iyzicoConfig.ts` (356-368. satırlar)

**Mevcut Kod (TODO):**
```typescript
export const verifyIyzicoWebhook = (signature: string, body: string): boolean => {
  try {
    console.log('[IYZICO] Webhook doğrulaması:', { signature, bodyLength: body.length });
    
    // TODO: Gerçek signature doğrulama algoritması implementasyonu
    return true; // ⚠️ GÜVENLİK RİSKİ!
  } catch (error) {
    console.error('[IYZICO] Webhook doğrulama hatası:', error);
    return false;
  }
};
```

**Düzeltilmiş Kod:**
```typescript
import crypto from 'crypto';

export const verifyIyzicoWebhook = (signature: string, body: string): boolean => {
  try {
    const config = getSecureConfig();
    const secretKey = config.iyzico.secretKey;
    
    // İyzico signature algoritması: HMAC-SHA256
    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(body);
    const expectedSignature = hmac.digest('base64');
    
    const isValid = signature === expectedSignature;
    
    console.log('[IYZICO] Webhook signature doğrulaması:', { 
      isValid,
      signatureLength: signature?.length,
      bodyLength: body?.length 
    });
    
    return isValid;
  } catch (error) {
    console.error('[IYZICO] Webhook doğrulama hatası:', error);
    return false;
  }
};
```

### 4. Test Et

```bash
# Geliştirme sunucusunu başlat
npm run dev

# Browser'da aç:
# http://localhost:5173
```

**Test Adımları:**
1. Sisteme giriş yap
2. Bir cihaz ekle veya seç
3. Ödeme işlemi başlat
4. Test kartı kullan: `5528790000000008`
5. Console'da logları takip et

---

## 🧪 TEST KARTLARI

### Başarılı Ödeme
```
Kart No:       5528 7900 0000 0008
Son Kullanma:  12/2030
CVC:           123
Kart Sahibi:   John Doe
```

### Başarısız Ödeme
```
Kart No:       5528 7900 0000 0016
Son Kullanma:  12/2030
CVC:           123
Kart Sahibi:   John Doe
```

### 3D Secure Test
```
Kart No:       5528 7900 0000 0024
Son Kullanma:  12/2030
CVC:           123
Kart Sahibi:   John Doe
```

---

## 🔍 SORUN GİDERME

### Hata: "Cannot find module 'iyzipay'"
```bash
npm install iyzipay@1.0.54
```

### Hata: "VITE_IYZICO_API_KEY is undefined"
```bash
# .env dosyasını kontrol et
# Sunucuyu yeniden başlat
npm run dev
```

### Hata: "Webhook signature invalid"
```javascript
// utils/iyzicoConfig.ts dosyasında verifyIyzicoWebhook fonksiyonunu güncelle
// (Yukarıdaki Adım 3'e bakın)
```

### Hata: "Payment failed"
```
1. Console loglarını kontrol et
2. İyzico sandbox portal'ına giriş yap
3. Payment logs'u incele
4. API credentials'ları doğrula
```

---

## 📊 KONTROL LİSTESİ

Düzeltmeler tamamlandığında:

- [ ] SDK uyumsuzluğu düzeltildi
- [ ] .env dosyası oluşturuldu
- [ ] Webhook signature implementasyonu yapıldı
- [ ] Test kartı ile başarılı ödeme yapıldı
- [ ] 3D Secure akışı test edildi
- [ ] Webhook callback'ler çalışıyor
- [ ] Console'da hata yok
- [ ] Database'e kayıt düşüyor

---

## 🚀 SONRAKI ADIMLAR

### Kısa Vadeli (Bu Hafta)
1. ✅ SDK düzeltmesi
2. ✅ Webhook signature
3. ✅ Temel testler
4. 📝 Basit dokümantasyon

### Orta Vadeli (Bu Ay)
1. 🔒 Güvenlik audit
2. 🧪 Kapsamlı test senaryoları
3. 📊 Monitoring sistemi
4. 📚 Detaylı dokümantasyon

### Uzun Vadeli (2-3 Ay)
1. 🏢 Production credentials
2. 🌐 SSL sertifikası
3. 🚀 Production deployment
4. 📈 Performance optimization

---

## 📞 YARDIM

### Takıldığınız Yerler İçin

**İyzico Sandbox Portal:**
https://sandbox-merchant.iyzipay.com

**İyzico API Dokümantasyonu:**
https://dev.iyzipay.com

**İyzico Destek:**
destek@iyzico.com

**Test Kartları Listesi:**
https://dev.iyzipay.com/tr/test-kartlari

---

## ⏱️ TAHMİNİ SÜRELER

| Görev | Süre |
|-------|------|
| SDK Düzeltmesi | 15 dakika |
| .env Oluşturma | 5 dakika |
| Webhook Signature | 30 dakika |
| Test | 30-60 dakika |
| **TOPLAM** | **~2 saat** |

---

**SON GÜNCELLENMe:** 8 Ekim 2025  
**DURUM:** 🚨 Acil Aksiyon Gerekli  
**ÖNCELİK:** Yüksek
