# 🧪 MANUAL TEST GUIDE
## iFoundAnApple Payment System Test Rehberi

### 🚀 **BAŞLAMADAN ÖNCE**

1. **Development Server Başlatın:**
   ```bash
   npm run dev
   ```

2. **Browser Console'da Test Fonksiyonları:**
   - F12 açın → Console sekmesi
   - `TestRunner` objesi kullanılabilir olmalı

### 📝 **TEST SENARYOLARI**

---

## **TEST 1: BROWSER CONSOLE TESTLER**

### 1.1 Tüm Sistem Testi
```javascript
TestRunner.runAllTests()
```
**Beklenen Sonuç:** ✅ Tüm testler başarıyla tamamlanmalı

### 1.2 Cihaz Modelleri Testi
```javascript
TestRunner.testDeviceModels()
```
**Beklenen Sonuç:** 
- 200+ cihaz modeli yüklenmeli
- iPhone, iPad, Apple Watch, AirPods kategorileri görünmeli

### 1.3 Ücret Hesaplama Testi
```javascript
TestRunner.testFeeCalculation()
```
**Beklenen Sonuç:**
- iPhone 15 Pro Max, iPad Pro, Apple Watch Ultra, AirPods Pro için ücretler hesaplanmalı
- Her cihaz için detaylı ücret dağılımı görünmeli

### 1.4 Belirli Model Testi
```javascript
TestRunner.testSpecificModel("iPhone 15 Pro Max")
TestRunner.testSpecificModel("iPhone 15 Pro Max", 2000) // Özel ödül ile
```

### 1.5 Payment Gateway Testi
```javascript
TestRunner.testPaymentGateway()
```

---

## **TEST 2: UI NAVIGATION TESTLER**

### 2.1 Ana Sayfa Navigation
1. **Dashboard'a gidin:** `http://localhost:5173/dashboard`
2. **"💳 Cihaz Ödemesi" butonunu** tıklayın
3. **Beklenen:** Payment Flow sayfası açılmalı

### 2.2 Payment Flow - Model Selection
1. **Adım 1: Model Seçimi**
   - Arama kutusuna "iPhone 15" yazın
   - iPhone modelleri filtrelenmeli
   - Kategori butonları çalışmalı
   - Model seçimi yapılabilmeli

### 2.3 Payment Flow - Fee Calculation
1. **Adım 2: Ücret Detayları**
   - Model seçimi sonrası otomatik geçiş
   - Ücret kartında detaylar görünmeli
   - Özel ödül miktarı değiştirilebilmeli
   - "Ödemeye Geç" butonu aktif olmalı

### 2.4 Payment Flow - Payment Method
1. **Adım 3: Ödeme**
   - Payment method seçenekleri görünmeli
   - Iyzico (önerilen), Stripe, Test modu
   - Kullanım koşulları checkbox'ı
   - Ödeme butonu koşullara bağlı aktif olmalı

---

## **TEST 3: ERROR HANDLING TESTLER**

### 3.1 Network Error Simulation
```javascript
// Console'da network'ü kapatın (DevTools → Network → Offline)
TestRunner.testFeeCalculation()
```
**Beklenen:** Hata mesajları düzgün görünmeli

### 3.2 Invalid Model Test
```javascript
TestRunner.testSpecificModel("NonExistentModel")
```
**Beklenen:** "Model bulunamadı" hatası

### 3.3 UI Error States
1. **Payment Flow'da** internet bağlantısını kesin
2. Model seçimi yapmaya çalışın
3. **Beklenen:** Loading state → Error state → Retry button

---

## **TEST 4: RESPONSIVE DESIGN TEST**

### 4.1 Mobile View Test
1. **DevTools'da** mobile view'a geçin (375px width)
2. **Payment Flow** sayfalarında gezinin
3. **Kontrol edilecekler:**
   - Kartlar responsive olmalı
   - Butonlar tıklanabilir boyutta
   - Text okunabilir olmalı
   - Scroll düzgün çalışmalı

### 4.2 Tablet View Test
1. **768px width** ayarlayın
2. **Grid layout** düzgün görünmeli
3. **Cards** uygun şekilde arrange olmalı

---

## **TEST 5: PERFORMANCE TEST**

### 5.1 Loading Times
1. **Network tab** açık tutun
2. **Payment Flow** sayfalarında gezinin
3. **Kontrol edilecekler:**
   - İlk yükleme < 3 saniye
   - Sayfa geçişleri < 1 saniye
   - API çağrıları < 2 saniye

### 5.2 Memory Usage
1. **Performance tab** kullanın
2. **Memory profiling** yapın
3. **Memory leaks** kontrol edin

---

## **TEST 6: ACCESSIBILITY TEST**

### 6.1 Keyboard Navigation
1. **Tab tuşu** ile navigation yapın
2. **Enter/Space** ile butonları aktive edin
3. **Focus indicators** görünmeli

### 6.2 Screen Reader Test
1. **NVDA/JAWS** ile test edin
2. **Alt texts** ve **aria-labels** kontrol edin

---

## **TEST 7: INTEGRATION TEST**

### 7.1 Full Payment Flow
1. **Dashboard** → "💳 Cihaz Ödemesi"
2. **Model seçin:** iPhone 15 Pro Max
3. **Özel ödül:** 2000 TL
4. **Payment method:** Test modu
5. **Koşulları kabul edin**
6. **"Güvenli Ödeme Yap"** tıklayın
7. **Beklenen:** Success mesajı veya redirect

### 7.2 Error Recovery Test
1. **Payment flow** sırasında internet kesin
2. **Hata mesajı** görünmeli
3. **Internet'i açın**
4. **"Tekrar Dene"** çalışmalı
5. **State korunmalı**

---

## **📊 TEST SONUÇLARI KAYDI**

### ✅ Başarılı Testler:
- [ ] Browser Console Tests
- [ ] UI Navigation
- [ ] Error Handling
- [ ] Responsive Design
- [ ] Performance
- [ ] Accessibility
- [ ] Integration Tests

### ❌ Başarısız Testler:
- [ ] Test adı: _______________
- [ ] Hata açıklaması: _______________
- [ ] Çözüm önerisi: _______________

---

## **🔧 DEBUG YARDIMCILARI**

### Console Commands:
```javascript
// Tüm cihaz modellerini listele
TestRunner.testDeviceModels()

// Belirli kategorideki modelleri listele
getAllDeviceModels().then(result => {
  const iphones = result.models.filter(m => m.category === 'iPhone');
  console.table(iphones);
});

// Fee calculation debug
TestRunner.testSpecificModel("iPhone 15 Pro Max", 1500)

// Payment gateway status
validatePCICompliance()
```

### Network Debugging:
1. **DevTools → Network**
2. **Filter:** XHR/Fetch
3. **Supabase requests** kontrol edin
4. **Response codes:** 200 OK olmalı

### Local Storage:
```javascript
// Supabase session kontrol
console.log(localStorage.getItem('supabase.auth.token'))
```

---

## **📞 DESTEK**

Test sırasında sorun yaşarsanız:
1. **Console errors** kontrol edin
2. **Network tab** inceleyin  
3. **Browser version** kontrol edin
4. **Cache temizleyin** (Ctrl+Shift+R)

**Happy Testing! 🚀**
