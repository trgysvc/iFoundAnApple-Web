# iFoundAnApple - Test Dokümantasyonu

Bu doküman, iFoundAnApple platformunun kalitesini, kararlılığını ve güvenliğini sağlamak için uygulanacak test stratejilerini, ortamlarını ve senaryolarını özetlemektedir.

## 1. Test Planı

### 1.1. Test Stratejisi

Uygulamanın tüm katmanlarını kapsayacak çok aşamalı bir test stratejisi benimsenecektir.

-   **Birim Testleri (Unit Tests):**
    -   **Amaç:** Tek tek fonksiyonların ve React bileşenlerinin (component) izole bir şekilde doğru çalıştığını doğrulamak.
    -   **Kapsam:** `AppContext.tsx` içindeki yardımcı fonksiyonlar (`checkForMatches`, `confirmExchange` vb.), UI bileşenleri (`Button`, `Input` vb.).
    -   **Araçlar:** Jest, React Testing Library.

-   **Entegrasyon Testleri (Integration Tests):**
    -   **Amaç:** Birden fazla bileşenin bir araya geldiğinde uyum içinde çalıştığını test etmek.
    -   **Kapsam:** Kullanıcı kayıt formunun state yönetimi ile etkileşimi, cihaz ekleme sayfasının `AppContext` ile veri alışverişi.
    -   **Araçlar:** Jest, React Testing Library.

-   **Uçtan Uca Testler (End-to-End - E2E):**
    -   **Amaç:** Gerçek bir kullanıcının yapacağı gibi, tüm uygulama akışlarını baştan sona test etmek.
    -   **Kapsam:** Bir kullanıcının kaydolması, cihazını kaybetmesi, başka bir kullanıcının onu bulması, ödeme yapılması ve takasın onaylanması gibi kritik kullanıcı yolculukları.
    -   **Araçlar:** Cypress, Playwright.

-   **Kullanıcı Kabul Testleri (User Acceptance Testing - UAT):**
    -   **Amaç:** Uygulamanın iş gereksinimlerini karşıladığını ve son kullanıcı için hazır olduğunu doğrulamak.
    -   **Kapsam:** Proje paydaşları veya hedef kitle içinden seçilen bir test grubu tarafından gerçek senaryoların manuel olarak test edilmesi.

### 1.2. Test Ortamları

-   **Yerel (Local):** Geliştiricilerin kendi makinelerinde birim ve entegrasyon testlerini çalıştırdığı ortam.
-   **Geliştirme/Entegrasyon (Staging):** Her kod birleştirmesinden sonra otomatik E2E testlerinin çalıştığı, üretim ortamının bir kopyası olan sunucu.
-   **Üretim (Production):** Canlı kullanıcıların kullandığı, yalnızca stabil ve test edilmiş kodun dağıtıldığı ortam.

### 1.3. Test Edilecek Ana Senaryolar

Aşağıdaki kritik kullanıcı akışları E2E testleri ile kapsamlı bir şekilde doğrulanacaktır:
1.  Yeni bir "Cihaz Sahibi" kullanıcısının başarıyla kaydolması.
2.  Yeni bir "Cihaz Bulan" kullanıcısının başarıyla kaydolması.
3.  Kullanıcının başarıyla giriş ve çıkış yapması.
4.  Cihaz Sahibinin kayıp bir cihazı bildirmesi (AI önerileri dahil).
5.  Cihaz Bulan'ın bulunan bir cihazı bildirmesi.
6.  Sistemin iki cihazı otomatik olarak eşleştirmesi ve bildirim göndermesi.
7.  Cihaz Sahibinin ödeme yapması.
8.  Her iki kullanıcının da takası onaylaması ve işlemin tamamlanması.
9.  Yönetici kullanıcısının Yönetici Paneli'ne erişip verileri görüntülemesi.
10. Kullanıcının arayüz dilini başarıyla değiştirmesi.
11. Kullanıcının statik sayfalara (SSS, Şartlar vb.) erişebilmesi.

---

## 2. Test Senaryoları (Test Cases)

### 2.1. Fonksiyonel Test Senaryoları

| Test ID | Özellik | Test Adımları | Beklenen Sonuç |
| :------ | :------ | :------------ | :------------- |
| TC-001 | Kullanıcı Kaydı (Sahip) | 1. Kayıt sayfasına git. 2. "Cihaz Sahibi" rolünü seç. 3. Tüm bilgileri geçerli formatta doldur. 4. Şartları kabul et. 5. "Kayıt Ol" butonuna tıkla. | Kullanıcı başarıyla kaydolur ve Panele yönlendirilir. `users` listesine yeni kullanıcı eklenir. |
| TC-002 | Kullanıcı Kaydı (Mevcut E-posta) | 1. Kayıt sayfasına git. 2. Sistemde zaten kayıtlı bir e-posta adresi gir. 3. Diğer alanları doldur. 4. "Kayıt Ol" butonuna tıkla. | "Bu e-posta ile zaten bir kullanıcı mevcut" hatası gösterilir. Kayıt işlemi başarısız olur. |
| TC-003 | Cihaz Ekleme (AI ile) | 1. Cihaz Sahibi olarak giriş yap. 2. "Kayıp Cihaz Ekle" sayfasına git. 3. Cihaz modelini gir. 4. "AI ile Öner" butonuna tıkla. | Ödül ve açıklama alanları AI tarafından önerilen verilerle doldurulur. |
| TC-004 | Eşleştirme | 1. Sahip olarak giriş yap, "A" seri numaralı bir cihazı "Kayıp" olarak ekle. 2. Bulan olarak giriş yap, "a" seri numaralı (küçük harf) aynı modeli "Bulundu" olarak ekle. | Her iki kullanıcının cihaz durumu güncellenir ("Payment Pending" ve "Matched"). Her iki kullanıcıya da bildirim gönderilir. |
| TC-005 | Takas Onayı | 1. Eşleşmiş bir cihaz için ödeme yap. 2. Sahip olarak "Takası Onayla" butonuna tıkla. 3. Bulan olarak giriş yap, aynı cihaz için "Takası Onayla" butonuna tıkla. | Cihaz durumu "Completed" olarak güncellenir. Her iki tarafa da işlemin tamamlandığına dair bildirim gönderilir. |
| TC-006 | Erişim Kontrolü (Admin) | 1. Normal bir kullanıcı olarak giriş yap. 2. Tarayıcı adres çubuğuna `/admin` yolunu yaz. | Kullanıcı anasayfaya yönlendirilir ve Yönetici Paneli'ni göremez. |

### 2.2. Kenar Durumlar (Edge Cases)

-   Formları zorunlu alanlar boşken göndermeye çalışmak (doğrulama mesajları gösterilmelidir).
-   Fatura yükleme alanına çok büyük (>10MB) veya desteklenmeyen formatta (.txt) bir dosya yüklemeye çalışmak.
-   Bir kullanıcı aynı takas için onay butonuna birden fazla kez tıklamaya çalıştığında (UI bunu engellemelidir).
-   Ağ bağlantısı yokken AI önerisi almaya çalışmak.
-   Çok uzun metinlerin (cihaz modeli, isim vb.) arayüzü bozup bozmadığının kontrolü.

### 2.3. Güvenlik Testleri (Kavramsal)

-   **Veri Gizliliği:** Bir kullanıcının, tarayıcı araçları veya başka yöntemlerle başka bir kullanıcının kişisel bilgilerine (banka bilgisi, e-posta, tam ad) erişemediği doğrulanmalıdır.
-   **Siteler Arası Komut Dosyası Çalıştırma (XSS):** Cihaz açıklaması gibi metin giriş alanlarına `<script>alert('XSS')</script>` gibi zararlı kodlar girilerek bu kodların render edilmediği, metin olarak gösterildiği doğrulanmalıdır.
-   **Oturum Yönetimi:** `localStorage`'daki `current-user` verisi manuel olarak değiştirildiğinde uygulamanın nasıl tepki verdiği kontrol edilmelidir. Uygulama, tutarsız durumlara karşı dayanıklı olmalı ve kullanıcıyı çıkışa zorlamalıdır.

### 2.4. Performans Testleri (Kavramsal)

-   **Yükleme Hızı:** Google Lighthouse gibi araçlarla ana sayfanın ve panelin ilk yüklenme süreleri ölçülmelidir.
-   **Liste Performansı:** Panele 100'den fazla cihaz eklendiğinde arayüzün yavaşlayıp yavaşlamadığı test edilmelidir.
-   **API Yanıt Süresi:** Google Gemini API'sinden gelen yanıtların makul bir sürede (örn. < 3 saniye) işlenip işlenmediği kontrol edilmelidir.