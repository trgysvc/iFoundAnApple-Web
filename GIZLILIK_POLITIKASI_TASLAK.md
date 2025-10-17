# GİZLİLİK POLİTİKASI

**Son Güncelleme: 14 Ekim 2025**

---

## 1. VERİ SORUMLUSU

**iFoundAnApple**  
E-posta: privacy@ifoundanapple.com
Web: https://ifoundanapple.com

Bu politika, KVKK ve GDPR uyarınca hazırlanmıştır.

---

## 2. TOPLANAN KİŞİSEL VERİLER

### 2.1 Kayıt ve Kimlik Doğrulama

**E-posta ile Kayıt:**
- Ad, soyad
- E-posta adresi
- Şifre (şifreli saklanır)
- Doğum tarihi

**OAuth ile Giriş (Google/Apple):**
- OAuth sağlayıcısından alınan temel profil bilgileri
- Ad, soyad, e-posta
- Şifre oluşturmanıza gerek yoktur

### 2.2 Cihaz Bilgileri

- Cihaz modeli (iPhone 15 Pro, MacBook Air vb.)
- Seri numarası
- Cihaz rengi ve açıklaması
- Kayıp/bulunma tarihi ve konumu
- Fatura/sahiplik belgesi (görsel - silinebilir şekilde)

### 2.3 Ödeme ve Finansal Bilgiler

**Ödeme İşlemleri (Iyzico):**
- Kredi/banka kartı bilgileri **Iyzico** tarafından işlenir (PCI-DSS uyumlu)
- Kart bilgileriniz bizim sunucularımızda **saklanmaz**
- İşlem geçmişi ve tutarlar kaydedilir

**Banka Bilgileri:**
- IBAN numarası (ödül transferi için)
- Hesap sahibi adı

### 2.4 Profil ve İletişim Bilgileri

- TC Kimlik Numarası (isteğe bağlı, yüksek tutarlı işlemler için)
- Telefon numarası
- Teslimat adresi (kargo için)

### 2.5 Otomatik Toplanan Veriler

- IP adresi
- Tarayıcı ve cihaz bilgileri
- Oturum bilgileri
- Platform kullanım istatistikleri

---

## 3. VERİLERİN KULLANIM AMAÇLARI

### 3.1 Hizmet Sunumu
- Kayıp ve bulunan cihazları eşleştirme (seri numarası bazlı)
- Kullanıcı hesap yönetimi
- Kargo organizasyonu ve takibi
- Bildirim gönderme

### 3.2 Ödeme ve Escrow İşlemleri
- Güvenli ödeme işleme (Iyzico)
- Escrow (emanet) sistemini işletme
- Ödül ödemelerini IBAN'a transfer etme
- Mali kayıtların tutulması

### 3.3 AI Destekli Öneriler
- Bu özellik isteğe bağlıdır

### 3.4 Güvenlik
- Dolandırıcılık önleme
- Kimlik doğrulama
- Audit log tutma
- Güvenlik ihlali tespiti

### 3.5 Yasal Uyumluluk
- KVKK ve GDPR gerekliliklerine uyum
- Vergi mevzuatı yükümlülükleri (10 yıl kayıt tutma)
- Mahkeme kararları ve yasal süreçler

---

## 4. VERİLERİN PAYLAŞIMI

### 4.1 Hizmet Sağlayıcılar

**Supabase (Backend Altyapısı):**
- Veritabanı, kimlik doğrulama, dosya depolama
- SOC 2 Type II, GDPR uyumlu
- Veri konumu: ABD/AB

**Iyzico (Ödeme Sağlayıcısı):**
- Ödeme işleme, 3D Secure, escrow
- PCI-DSS Level 1 sertifikalı
- Türkiye merkezli

**Google/Apple (OAuth Kimlik Doğrulama):**
- Üçüncü taraf giriş (isteğe bağlı)

**Google Gemini (AI Önerileri):**
- Sadece cihaz modeli bilgisi paylaşılır
- Kişisel kimlik bilgisi paylaşılmaz

**Kargo Şirketleri (Aras, MNG, Yurtiçi, PTT):**
- Teslimat adresi ve telefon
- Anonim gönderici/alıcı kodları (FND-XXX, OWN-XXX)
- Gerçek kimlikler gizli tutulur

### 4.2 Kullanıcılar Arası Paylaşım

**ÖNEMLİ:** Kimliğiniz, e-postanız ve telefon numaranız **asla** diğer kullanıcılarla paylaşılmaz.

**Eşleşme Sonrası:**
- Karşı tarafın kimliği anonim kalır
- Sadece "Eşleşme bulundu" bildirimi gönderilir
- Kargo için sadece teslimat adresi paylaşılır (ad-soyad ve adres)

### 4.3 Yasal Zorunluluk

- Mahkeme kararı veya celp
- Kolluk kuvvetleri talepleri
- Vergi daireleri (mali kayıtlar için)
- KVKK Kurumu talepleri

---

## 5. VERİ GÜVENLİĞİ VE SAKLAMA

### 5.1 Güvenlik Önlemleri

- SSL/TLS şifreleme (HTTPS)
- Şifre hash'leme (bcrypt)
- Veritabanı şifreleme
- Row Level Security (RLS) politikaları
- 3D Secure ödeme doğrulama
- İki faktörlü kimlik doğrulama (2FA) desteği
- Düzenli güvenlik denetimleri

### 5.2 Saklama Süreleri

**Aktif Hesaplar:**
- Hesabınız aktif olduğu sürece saklanır

**Kapalı Hesaplar:**
- Hesap kapatma sonrası 30 gün içinde silinir
- Mali kayıtlar 10 yıl saklanır (yasal zorunluluk)
- Anonim istatistikler süresiz saklanabilir

**İşlem Kayıtları:**
- Mali işlemler: 10 yıl
- Kargo kayıtları: 2 yıl
- Audit loglar: 5 yıl

---

## 6. KULLANICI HAKLARI (KVKK & GDPR)

### 6.1 Haklarınız

✅ **Bilgi Talep Etme:** Verilerinizin işlenip işlenmediğini öğrenme  
✅ **Erişim Hakkı:** Verilerinizin bir kopyasını alma  
✅ **Düzeltme Hakkı:** Yanlış bilgileri düzeltme  
✅ **Silme Hakkı:** Verilerinizi silme (unutulma hakkı)  
✅ **İtiraz Etme:** Veri işleme faaliyetlerine itiraz  
✅ **Veri Taşınabilirliği:** Verilerinizi başka bir platforma aktarma  

### 6.2 Başvuru Yöntemi

**E-posta:** privacy@ifoundanapple.com  
**Konu:** KVKK/GDPR Başvurusu  
**Yanıt Süresi:** 30 gün (en geç)

### 6.3 Şikayet Hakkı

**Türkiye:**
Kişisel Verileri Koruma Kurumu - https://www.kvkk.gov.tr

**AB:**
İlgili ülkenin Veri Koruma Otoritesi

---

## 7. ÇOCUKLARIN GİZLİLİĞİ

Platform **18 yaş altı** kullanıcılara yönelik değildir. 18 yaş altı kişilerden bilerek veri toplamıyoruz.

---

## 8. ÇEREZLER

**Kullandığımız Çerezler:**
- Oturum yönetimi (zorunlu)
- Dil tercihleri (fonksiyonel)
- Güvenlik (zorunlu)

Çerezleri tarayıcı ayarlarınızdan yönetebilirsiniz.

---

## 9. ULUSLARARASI VERİ TRANSFERİ

**Supabase:** ABD/AB veri merkezleri (GDPR uyumlu, SCC)  
**Iyzico:** Türkiye  
**Google:** Küresel (OAuth ve AI için)

Tüm transferler KVKK ve GDPR hükümlerine uygun yapılır.

---

## 10. DEĞİŞİKLİKLER VE GÜNCELLEMELER

Bu Gizlilik Politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler yapıldığında:
- Web sitesinde duyuru yayınlarız
- E-posta ile bildirim göndeririz
- "Son Güncelleme" tarihi değiştirilir

Güncellemeler yayınlandığı tarihte yürürlüğe girer.

---

## 11. İLETİŞİM

**Genel:** info@ifoundanapple.com  
**Gizlilik:** privacy@ifoundanapple.com  
**Güvenlik:** security@ifoundanapple.com  

---

**© 2025 iFoundAnApple - Versiyon 2.0**



