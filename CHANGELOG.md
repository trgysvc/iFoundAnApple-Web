# iFoundAnApple - Sürüm Geçmişi

Bu proje, [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) formatını takip eder ve bu projedeki önemli değişiklikleri belgeler.

## [2.2.0] - Ödeme Logic Düzeltmeleri ve Sistem İyileştirmeleri

### Düzeltildi
- **Ödeme Ekranı Logic Sorunu**: Cihazı bulan kişilerin ödeme ekranını görmemesi sorunu çözüldü
- **isOriginalOwnerPerspective Logic**: Yanlış kullanıcı perspektifi tespiti düzeltildi
- **MATCHED Status Handling**: Bulan kişiler için uygun bekleme mesajları gösterilmesi sağlandı
- **Test Kodu Temizliği**: Geliştirme sırasında kalan test kodları kaldırıldı

### Değiştirildi
- **DeviceDetailPage.tsx**: Ödeme logic'i yeniden düzenlendi ve test kodları temizlendi
- **Debug Panel**: Kullanıcı perspektifi bilgisi eklendi
- **README.md**: Yeni versiyon bilgileri eklendi

### İyileştirildi
- **Kod Kalitesi**: Linting hataları düzeltildi
- **Kullanıcı Deneyimi**: Doğru kullanıcı perspektifine göre uygun ekranlar gösterilmesi
- **Sistem Kararlılığı**: Test kodlarının kaldırılması ile production-ready kod

## [2.0.0] - Geliştirici Dokümantasyonu

### Eklendi
- **`README.md`**: Projenin özetini, teknoloji yığınını, kurulum adımlarını, mimari detaylarını, kod standartlarını, dağıtım sürecini ve yerelleştirme adımlarını içeren kapsamlı bir geliştirici dokümantasyonu eklendi.
- **`TESTING.md`**: Uygulamanın test stratejisini, test ortamlarını ve birim, entegrasyon, E2E ve UAT için detaylı test senaryolarını özetleyen bir test dokümantasyonu eklendi.

## [1.7.0] - Yönetici Paneli ve GDPR Uyumluluğu

### Eklendi
- **Yönetici Rolü**: Sistemi yönetmek için yeni bir `ADMIN` kullanıcı rolü ve varsayılan bir yönetici hesabı eklendi.
- **Yönetici Paneli**: `/admin` yolunda, tüm kullanıcıları ve cihazları listeleyen, yalnızca yöneticilerin erişebileceği özel bir sayfa oluşturuldu.
- **Güvenli Yönetici Yolu**: Yönetici paneline erişimi yalnızca `ADMIN` rolüne sahip kullanıcılarla kısıtlayan bir `AdminRoute` bileşeni eklendi.
- **GDPR Onayı**: Kayıt sayfasına, kullanıcıların devam etmeden önce Hizmet Şartları ve Gizlilik Politikasını kabul etmelerini gerektiren zorunlu bir onay kutusu eklendi.

### Değiştirildi
- **Header**: Oturum açmış yönetici kullanıcılara "Yönetici Paneli" bağlantısı artık gösteriliyor.

## [1.6.0] - Bilgilendirme Sayfaları ve Gelişmiş Footer

### Eklendi
- **Statik Sayfalar**: SSS (FAQ), Hizmet Şartları, Gizlilik Politikası ve İletişim için yeni sayfalar oluşturuldu.
- **Sayfa Yönlendirme**: Yeni statik sayfalar için `App.tsx` içine yollar (routes) eklendi.
- **Detaylı İçerik**: `constants.ts` dosyasına yeni sayfalar için tüm dillerde kapsamlı metinler ve çeviriler eklendi.

### Değiştirildi
- **Footer**: Sitenin altbilgisi (footer), yeni eklenen bilgilendirme sayfalarına bağlantılar ve bir "App Store'dan İndir" butonu içerecek şekilde yeniden tasarlandı.

## [1.5.0] - Uluslararasılaşma Genişlemesi

### Eklendi
- **Genişletilmiş Dil Desteği**: Fransızca (`fr`), Japonca (`ja`) ve İspanyolca (`es`) için tam arayüz çeviri desteği eklendi.

### Değiştirildi
- **Çeviriler**: `constants.ts` dosyası, yeni eklenen diller için tüm metinleri içerecek şekilde güncellendi.
- **Dil Seçimi**: Header'daki dil seçim menüsü yeni dilleri içerecek şekilde güncellendi.

## [1.4.0] - Uygulama İçi Bildirim Sistemi

### Eklendi
- **Bildirim Merkezi**: Header'a, okunmamış bildirim sayısını gösteren bir rozete sahip bir zil ikonu ve bildirimleri listeleyen bir açılır menü eklendi.
- **Otomatik Bildirimler**: Cihaz eşleşmesi, ödeme alınması ve takas onayı gerekmesi gibi kritik olaylar için otomatik bildirimler oluşturuldu.
- **Otomatik Okundu İşaretleme**: Kullanıcılar bir bildirim bağlantısına tıkladığında, ilgili bildirim otomatik olarak "okundu" olarak işaretlenir.

## [1.3.0] - Güvenli Takas ve Emanet (Escrow) İyileştirmeleri

### Eklendi
- **İki Taraflı Onay**: Takasın tamamlanması için her iki tarafın da işlemi onaylamasını gerektiren bir sistem eklendi.
- **Güvenli Takas Yönergeleri**: Ödeme yapıldıktan sonra cihaz detay sayfasında kullanıcılara güvenli bir takas için yönergeler gösterilmeye başlandı.
- **Şeffaf Komisyon Bilgisi**: İşlem tamamlandığında, platform işletim maliyetleri için %5'lik bir hizmet bedeli kesintisi yapıldığına dair bir not eklendi.

### Değiştirildi
- `Device` veri yapısı, onayları takip etmek için `exchangeConfirmedBy` alanını içerecek şekilde güncellendi.

## [1.2.0] - Satın Alma Kanıtı (Fatura Yükleme)

### Eklendi
- **Fatura Yükleme**: Cihaz sahipleri artık sahipliklerini doğrulamak için "Cihaz Ekle" formuna fatura (resim veya PDF) yükleyebilirler.
- **Fatura Görüntüleme**: Cihaz detay sayfasında, cihaz sahibi için yüklenen faturayı görüntülemesini sağlayan bir buton eklendi.

## [1.1.0] - Yapay Zeka Destekli Öneriler

### Eklendi
- **Gemini API Entegrasyonu**: "Cihaz Ekle" sayfasına Google Gemini API (`gemini-2.5-flash`) entegre edildi.
- **Akıllı Öneriler**: Cihaz modeli ve rengine göre otomatik olarak cihaz açıklaması, adil bir ödül miktarı ve tahmini piyasa değeri öneren "AI ile Öner" butonu eklendi.

## [1.0.0] - İlk Sürüm

### Eklendi
- **Temel Platform**: React, TypeScript ve Tailwind CSS ile projenin ilk kurulumu.
- **Kullanıcı Yönetimi**: "Cihaz Sahibi" ve "Cihaz Bulan" rolleri için kayıt ve giriş işlevselliği.
- **Cihaz Yönetimi**: Kullanıcıların kayıp veya bulunan cihazları eklemesi ve panellerinde görüntülemesi.
- **Otomatik Eşleştirme**: Cihaz modeli ve seri numarasına dayalı temel eşleştirme mantığı.
- **Takas Akışı**: Ödeme ve takas onayı için simüle edilmiş bir akış.
- **Temel Çoklu Dil Desteği**: İngilizce (en) ve Türkçe (tr) için ilk çeviriler.