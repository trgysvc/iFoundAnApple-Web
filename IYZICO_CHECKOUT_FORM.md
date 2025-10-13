# 🛡️ İyzico Checkout Form Entegrasyonu

## 📋 Özet

Artık **İyzico Checkout Form** kullanıyoruz. Bu yaklaşımda:
- ✅ Kart bilgileri İyzico'nun güvenli sayfasında toplanır
- ✅ 3D Secure İyzico tarafından yapılır  
- ✅ PCI DSS uyumluluğu garanti edilir
- ✅ Frontend ve backend minimal kod
- ✅ Hem local hem production çalışır

---

## 🏗️ Mimari

```
┌─────────────┐
│  Frontend   │
│ (React)     │
└──────┬──────┘
       │ 1. Ödeme başlat
       ▼
┌─────────────┐
│  Backend    │  2. Checkout Form oluştur
│ (server.cjs)│  ──────────────────────────►  ┌──────────────┐
└──────┬──────┘                                 │   İyzico     │
       │ 3. Checkout HTML + token                │   API        │
       ▼                                          └──────────────┘
┌─────────────┐
│   Modal     │  4. Kullanıcı kart bilgilerini girer
│ (iframe)    │  5. 3D Secure
└──────┬──────┘
       │ 6. Callback
       ▼
┌─────────────┐
│  Callback   │  7. Ödeme doğrula
│  Page       │
└──────┬──────┘
       │ 8. Database'e kaydet
       ▼
┌─────────────┐
│  Success    │
│  Page       │
└─────────────┘
```

---

## 🔧 Yapılan Değişiklikler

### 1. **Backend (server.cjs)**

#### ✅ Yeni Endpoint: `/api/iyzico-checkout`
```javascript
POST /api/iyzico-checkout

Request:
{
  "deviceId": "uuid",
  "payerId": "uuid",
  "amount": 5047.19,
  "payerInfo": {...},
  "deviceInfo": {...}
}

Response:
{
  "success": true,
  "checkoutFormContent": "<html>...</html>",
  "token": "checkout-token",
  "paymentPageUrl": "https://sandbox-api.iyzipay.com/..."
}
```

#### ✅ Yeni Endpoint: `/api/iyzico-callback`
```javascript
POST /api/iyzico-callback

Request:
{
  "token": "checkout-token"
}

Response:
{
  "success": true,
  "paymentStatus": "SUCCESS",
  "paymentId": "27349333",
  "price": "5047.19",
  "paidPrice": "5047.19"
}
```

### 2. **Frontend**

#### ✅ Yeni Component: `IyzicoCheckoutModal.tsx`
- İyzico checkout form'unu iframe içinde gösterir
- Modal olarak açılır
- 3D Secure işlemini içerir

#### ✅ Yeni Page: `PaymentCallbackPage.tsx`
- İyzico'dan callback alır
- Ödeme sonucunu doğrular
- Database'e kaydeder
- Success sayfasına yönlendirir

#### ✅ Güncellendi: `paymentGateway.ts`
- `processIyzicoPayment` → Checkout form kullanır
- Kart bilgisi gerektirmez

#### ✅ Güncellendi: `MatchPaymentPage.tsx`
- Modal state ekle

ndi
- Checkout modal gösterir
- Handler fonksiyonları eklendi

#### ✅ Güncellendi: `App.tsx`
- `/payment/callback` route'u eklendi

---

## 🚀 Kullanım

### Local Development

1. **Backend başlat:**
   ```bash
   npm run server
   ```
   → `http://localhost:3001`

2. **Frontend başlat:**
   ```bash
   npm run dev
   ```
   → `http://localhost:5173`

3. **Test ödemesi yap:**
   - Ödeme sayfasına git
   - "Ödeme Yap" butonuna tıkla
   - Modal açılır → Kart bilgilerini gir
   - 3D Secure → Callback → Success

### Production Deployment

1. **Environment Variables:**
   ```bash
   NODE_ENV=production
   PORT=3000
   VITE_APP_URL=https://ifoundanapple.com
   VITE_IYZICO_API_KEY=<production-key>
   VITE_IYZICO_SECRET_KEY=<production-secret>
   VITE_IYZICO_BASE_URL=https://api.iyzipay.com
   ```

2. **Build & Deploy:**
   ```bash
   npm run build
   npm start
   ```

3. **Coolify:**
   - Build Pack: `Dockerfile`
   - Port: `3000`
   - Env variables yukarıdaki gibi ayarla
   - Deploy!

---

## 🧪 Test Kartları (Sandbox)

İyzico sandbox'ta test etmek için:

```
Kart Numarası: 5528 7900 0000 0008
Son Kullanma: 12/2030
CVV: 123
Kart Sahibi: Test User
```

**3D Secure Şifre:** Herhangi bir şey (sandbox'ta kabul edilir)

---

## 📊 Flow Detayları

### 1. Ödeme Başlatma
```typescript
// MatchPaymentPage.tsx
const result = await initiatePayment(paymentRequest, 'iyzico');

if (result.success && result.status === 'processing') {
  // Checkout form içeriği geldi
  setCheckoutFormContent(result.providerResponse.checkoutFormContent);
  setCheckoutToken(result.providerResponse.token);
  setShowCheckoutModal(true); // Modal aç
}
```

### 2. Modal'da Ödeme
```typescript
// IyzicoCheckoutModal.tsx
// İframe'e checkout HTML yüklenir
// Kullanıcı kart bilgilerini girer
// 3D Secure yapılır
// İyzico callback URL'e yönlendirir
```

### 3. Callback İşleme
```typescript
// PaymentCallbackPage.tsx
const token = searchParams.get('token');

// Backend'e doğrulama isteği
const response = await fetch('/api/iyzico-callback', {
  method: 'POST',
  body: JSON.stringify({ token })
});

const result = await response.json();

if (result.success && result.paymentStatus === 'SUCCESS') {
  // Database'e kaydet
  await savePaymentToDatabase(result);
  // Success sayfasına yönlendir
  navigate('/payment/success?payment_id=' + result.paymentId);
}
```

---

## 🔒 Güvenlik

1. **PCI DSS Uyumlu:** Kart bilgileri hiçbir zaman backend'e gelmez
2. **3D Secure:** İyzico tarafından yapılır
3. **Token Bazlı:** Her ödeme için benzersiz token
4. **HTTPS Zorunlu:** Production'da SSL gerekli
5. **Callback Validation:** Token ile ödeme doğrulanır

---

## ❌ Eski Yaklaşım (Silindi)

```diff
- /api/iyzico-payment (Kart bilgisi ile direkt ödeme)
- Kart bilgisi frontend'den backend'e gönderiliyordu
- PCI DSS riski vardı
```

---

## ✅ Yeni Yaklaşım (Şimdi)

```diff
+ /api/iyzico-checkout (Checkout form initialize)
+ /api/iyzico-callback (Ödeme doğrulama)
+ Kart bilgisi sadece İyzico'da
+ PCI DSS uyumlu
+ 3D Secure entegre
```

---

## 🐛 Troubleshooting

### Sorun: Modal açılmıyor
**Çözüm:** 
- Console'da `[PAYMENT] Checkout form modal açılıyor...` var mı?
- Backend'den `checkoutFormContent` geliyor mu?

### Sorun: Callback gelmedi
**Çözüm:**
- İyzico callback URL'i doğru mu? (`VITE_APP_URL` kontrol et)
- Local'de: `http://localhost:5173/payment/callback`
- Production: `https://ifoundanapple.com/payment/callback`

### Sorun: 405 Method Not Allowed
**Çözüm:**
- Backend çalışıyor mu? `http://localhost:3001/api/health` test et
- Production'da Dockerfile kullanıldı mı?

---

## 📚 Kaynaklar

- [İyzico Checkout Form API Docs](https://dev.iyzipay.com/tr/odeme-formu)
- [İyzico Test Kartları](https://dev.iyzipay.com/tr/test-kartlari)
- [PCI DSS Compliance](https://www.pcisecuritystandards.org/)

---

**Son Güncelleme:** 2025-10-08  
**Durum:** Production Ready ✅  
**Test Edildi:** ✅ Local, ⏳ Production






