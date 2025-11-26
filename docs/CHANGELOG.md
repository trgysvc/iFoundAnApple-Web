# iFoundAnApple - Sürüm Geçmişi

Bu proje, [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) formatını takip eder ve bu projedeki önemli değişiklikleri belgeler.

## [2.6.0] - Paynet Ödeme Süreci Mimari Düzeltmeleri

### Değiştirildi
- **Ödeme Başlatma Süreci:** Ödeme başlatıldığında veritabanına kayıt oluşturulmuyor. Backend sadece Paynet API ile iletişim kuruyor ve veritabanına yazmıyor.
- **Webhook İşleme:** Tüm veritabanı kayıtları (payments, escrow_accounts) webhook geldiğinde ve ödeme başarılı olduğunda frontend/iOS tarafından oluşturuluyor.
- **Backend Rolü:** Backend artık sadece Paynet API ile iletişim kuruyor, webhook'u alıyor ve saklıyor. Veritabanına yazma işlemleri frontend/iOS tarafından yapılıyor.
- **Payment Success Page:** Webhook gelene kadar polling mekanizması eklendi. Webhook geldiğinde veritabanı kayıtları oluşturuluyor.
- **Payment Callback Page:** Webhook bekleme mesajı eklendi ve PaymentSuccessPage'e yönlendirme yapılıyor.

### Eklendi
- **`utils/paymentWebhookHandler.ts`:** Webhook geldiğinde payment ve escrow kayıtlarını oluşturan merkezi fonksiyon eklendi.
- **`getPaymentStatus` Fonksiyonu:** Backend API'den payment status kontrolü için yeni fonksiyon eklendi (`utils/paynetPayment.ts`).
- **`getPaynetWebhookData` Fonksiyonu:** Backend'den webhook data çekme fonksiyonu eklendi (`utils/paynetPayment.ts`).
- **Polling Mekanizması:** PaymentSuccessPage'de webhook gelene kadar polling yapılıyor (30 deneme, 10 saniye aralık).
- **LocalStorage Yönetimi:** Device ID ve fee breakdown localStorage'da saklanıyor ve webhook geldiğinde kullanılıyor.
- **`docs/PAYNET_PAYMENT_PROCESS.md`:** Backend ve iOS için kapsamlı ödeme süreci dokümantasyonu eklendi.

### Kaldırıldı
- **`api/process-payment.ts`:** Deprecate edildi. Bu dosya ödeme başlatıldığında veritabanına yazıyordu, artık kullanılmıyor.

### İyileştirildi
- **Güvenlik:** Ödeme tamamlanmadan veritabanına kayıt oluşturulmaması garantilendi.
- **Veri Tutarlılığı:** Webhook geldiğinde ve ödeme başarılı olduğunda kayıtlar oluşturuluyor.
- **Mimari:** Backend ve frontend/iOS sorumlulukları net bir şekilde ayrıldı.
- **Dokümantasyon:** Tüm ödeme süreci dokümantasyonları güncellendi (PROCESS_FLOW.md, BACKEND_INTEGRATION.md, PROJECT_DESIGN_DOCUMENTATION.md).

### Düzeltildi
- **Ödeme Başlatma:** Ödeme başlatıldığında veritabanına kayıt oluşturulması sorunu çözüldü.
- **Webhook İşleme:** Webhook geldiğinde frontend/iOS tarafından kayıtların oluşturulması sağlandı.
- **Device ID ve Receiver ID:** PaymentSuccessPage'de device ID ve receiver ID bulma mekanizması düzeltildi.

## [2.5.0] - device_role Kolonu ve Status Test Yol Haritası

### Eklendi
- **device_role Column**: `devices` tablosuna `device_role` kolonu eklendi. Bu kolon, cihaz kaydının sahibi mi ('owner') yoksa bulan kişi mi ('finder') olduğunu açıkça belirtir
- **Financial Transactions Escrow Fields**: `financial_transactions` tablosuna `escrow_id`, `confirmed_by`, ve `confirmation_type` kolonları eklendi. Bu kolonlar escrow release işlemlerini takip etmek için kullanılır
- **Transaction Type Constraint Update**: `financial_transactions.transaction_type` CHECK constraint'i güncellendi ve `escrow_release` değeri eklendi
- **Migration Scripts**: 
  - `database/migrations/add_device_role_column.sql` - device_role kolonu için migration
  - `database/migrations/add_escrow_fields_to_financial_transactions.sql` - escrow alanları için migration
  - `database/migrations/add_escrow_release_to_transaction_type.sql` - transaction_type constraint güncellemesi
  - `database/migrations/manual_fix_transaction_type_constraint.sql` - manuel constraint düzeltme script'i
- **STATUS_TEST_YOL_HARITASI.md**: Kapsamlı status test yol haritası dokümantasyonu eklendi. Bu dokümantasyon, Supabase'de status değiştirerek tüm sürecin test edilmesi için adım adım rehber içerir
- **PROJECT_DESIGN_DOCUMENTATION.md**: Kapsamlı proje tasarım dokümantasyonu eklendi
- **PROCESS_FLOW_EKSIKLER_RAPORU.md**: Süreç akışı eksikleri raporu eklendi

### Değiştirildi
- **DeviceDetailPage.tsx**: `device_role` kolonu kullanılarak owner/finder ayrımı yapılıyor. Status değişse bile doğru ekran gösterilir
- **AppContext.tsx**: `addDevice` fonksiyonu güncellendi. Yeni cihaz kaydı oluşturulurken `device_role` otomatik olarak set ediliyor ('owner' veya 'finder')
- **isOriginalOwnerPerspective Logic**: `DeviceDetailPage.tsx` içindeki `isOriginalOwnerPerspective` mantığı güncellendi. Artık öncelik sırası:
  1. `device_role` kolonu (en güvenilir)
  2. `lost_date`/`found_date` kontrolü (fallback)
  3. Status kontrolü (son çare)
- **UI Rendering**: Her status için owner ve finder ekranları ayrı ayrı implement edildi:
  - PAYMENT_COMPLETED: Owner ve finder için ayrı ekranlar
  - CARGO_SHIPPED: Owner ve finder için ayrı ekranlar (Satın Alma Kanıtı, formatlanmış tutarlar eklendi)
  - DELIVERED: Owner ve finder için ayrı ekranlar (Durum Bilgisi, Ödeme Detayları, Escrow Durumu eklendi)
  - COMPLETED: Owner ve finder için ayrı ekranlar
- **Payment Amount Display**: Ödeme tutarları ve escrow tutarları `Intl.NumberFormat` ile Türk Lirası formatında gösteriliyor
- **ADIM 6 SQL Queries**: STATUS_TEST_YOL_HARITASI.md içindeki ADIM 6 SQL sorguları düzeltildi ve sadeleştirildi

### İyileştirildi
- **UI Consistency**: Status değişse bile doğru ekran gösterilmesi garantilendi
- **Code Maintainability**: `device_role` kolonu ile daha net ve bakımı kolay kod yapısı
- **Testing**: Kapsamlı status test yol haritası ile sistem testi kolaylaştırıldı
- **Documentation**: Tüm değişiklikler için detaylı dokümantasyon eklendi
- **Database Schema**: Veritabanı şeması güncellendi ve dokümante edildi

### Düzeltildi
- **PAYMENT_COMPLETED Screen**: Cihaz sahibi için doğru ekran gösterilmesi sorunu çözüldü
- **CARGO_SHIPPED Screen**: Satın Alma Kanıtı (Fatura) Dosyası ve formatlanmış tutarlar eklendi
- **DELIVERED Screen**: Durum Bilgisi, Ödeme Detayları ve Escrow Durumu kartları eklendi
- **ADIM 6 SQL Errors**: Constraint hataları ve syntax hataları düzeltildi
- **Financial Transactions Constraint**: `escrow_release` transaction_type değeri için CHECK constraint hatası çözüldü

## [2.4.0] - Backend Ödeme Altyapısının Frontend'e Taşınması

### Kaldırıldı
- **Backend Payment Endpoints**: Express.js server'daki `/api/process-payment`, `/api/calculate-fees`, `/api/release-escrow` endpoint'leri kaldırıldı
- **Backend İyzico SDK Entegrasyonu**: `server.cjs` içindeki ödeme işleme kodları kaldırıldı
- **Backend API Dependencies**: Express route handler'ları ve backend ödeme mantığı kaldırıldı

### Değiştirildi
- **Payment Architecture**: Tüm ödeme işlemleri frontend'e taşındı
- **API Klasörü**: `api/` klasöründeki dosyalar artık frontend utility fonksiyonları olarak çalışıyor
- **Server Architecture**: `server.cjs` sadeleştirildi - artık sadece static file serving yapıyor
- **Payment Processing**: `utils/paymentGateway.ts` ve `api/process-payment.ts` direkt frontend'den çağrılıyor
- **Deployment Model**: Backend API server gereksinimi kaldırıldı, pure frontend deployment mümkün

### İyileştirildi
- **Deployment Basitliği**: Tek bir frontend deployment yeterli
- **Kod Organizasyonu**: Ödeme mantığı frontend'de daha merkezi ve erişilebilir
- **Development Experience**: Backend server gereksinimi olmadan geliştirme yapılabilir

## [2.3.0] - İyzico Payment Gateway Entegrasyonu

### Eklendi
- **İyzico Sandbox API Entegrasyonu**: Gerçek ödeme gateway entegrasyonu tamamlandı
- **Payment Processing Functions**: `api/process-payment.ts` ile frontend ödeme işleme
- **İyzico Webhook Handlers**: 3D Secure callback ve normal callback işleme sistemleri (`api/webhooks/`)
- **Test Modu**: İyzico Sandbox API ile tam test ortamı
- **Payment Flow**: Baştan sona ödeme akışı çalışıyor
- **Database Sync**: Payment, Escrow ve Device status senkronize
- **Device Status Tracking**: Ödeme sonrası otomatik durum güncelleme
- **Payment Success Page**: Detaylı durum bilgisi ve takip sistemi
- **Payment Callback Page**: Ödeme sonrası yönlendirme ve durum kontrolü
- **Error Handling**: Güvenli hata yönetimi ve kullanıcı bildirimleri
- **UUID Compatibility**: İyzico payment ID'leri ile database UUID uyumu
- **CSP Security**: Content Security Policy güncellemeleri
- **Coolify Ready**: Production deployment hazır
- **Docker Multi-stage Build**: Optimize edilmiş container image
- **Full Documentation**: Deployment ve setup rehberleri

### Değiştirildi
- **Payment Gateway**: Simüle edilmiş ödeme akışı yerine İyzico entegrasyonu
- **Payment Processing**: `utils/paymentGateway.ts` ve `api/process-payment.ts` ile gerçek gateway entegrasyonu
- **Deployment Strategy**: Production-ready Docker ve Coolify konfigürasyonu

### İyileştirildi
- **Güvenlik**: CSP headers ve secure payment flow
- **Performans**: Multi-stage Docker build ile optimize edilmiş container
- **Dokümantasyon**: Comprehensive deployment ve setup guides
- **Payment Error Recovery**: Daha iyi hata yönetimi ve kullanıcı geri bildirimi

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

## [2.1.0] - Çeviri, Profil Güncellemeleri ve Veri Şifreleme

### Eklendi
- **Genişletilmiş Çeviri Sistemi**: 200+ çeviri anahtarı ile kapsamlı dil desteği
- **5 Dil Tam Desteği**: EN, TR, FR, JA, ES dillerinde eksiksiz çeviriler
- **Gelişmiş Profil Yönetimi**: TC Kimlik, telefon, adres ve IBAN alanları
- **Veri Şifreleme Sistemi**: Hassas veriler için AES-256-GCM şifreleme
- **Encryption Manager**: `utils/encryptionManager.ts` ile güvenli şifreleme/çözme
- **Akıllı Form Validasyonları**: Kapsamlı form kontrolleri ve hata mesajları
- **TC Kimlik Validasyonu**: Gerçek zamanlı algoritma kontrolü
- **Veritabanı Şeması Güncellemeleri**: userProfile tablosu genişletildi
- **Database Migration Scripts**: Şifreleme için kolon tipleri güncellendi

### Değiştirildi
- **Çeviri Sistemi**: Tamamen yenilenen ve genişletilmiş çeviri yapısı
- **Profil Menüsü**: Yenilenen UI/UX ile daha kullanıcı dostu profil yönetimi
- **Dil Seçici**: İyileştirilmiş dil seçim deneyimi
- **Karışık Çeviri Düzeltmeleri**: Tüm dillerde tutarlı terminoloji
- **Database Schema**: Hassas alanlar TEXT tipine çevrildi (encryption için)
- **AppContext.tsx**: Şifreleme/çözme fonksiyonları entegre edildi

### İyileştirildi
- **Uluslararasılaşma**: 200+ çeviri anahtarı ile profesyonel dil desteği
- **Kullanıcı Profili**: Tam kapsamlı profil bilgisi yönetimi
- **Form Güvenliği**: Gelişmiş validasyon ve hata yönetimi
- **Veri Güvenliği**: KVKK/GDPR uyumlu şifreleme sistemi
- **Backward Compatibility**: Mevcut plain text veriler otomatik okunuyor

## [2.0.0] - Geliştirici Dokümantasyonu ve Kargo Yönetimi

### Eklendi
- **`README.md`**: Projenin özetini, teknoloji yığınını, kurulum adımlarını, mimari detaylarını, kod standartlarını, dağıtım sürecini ve yerelleştirme adımlarını içeren kapsamlı bir geliştirici dokümantasyonu eklendi
- **`TESTING.md`**: Uygulamanın test stratejisini, test ortamlarını ve birim, entegrasyon, E2E ve UAT için detaylı test senaryolarını özetleyen bir test dokümantasyonu eklendi
- **`PROCESS_FLOW.md`**: Tam süreç akışı dokümantasyonu - cihaz sahibi ve bulan kişi akışları
- **Kargo Yönetim Sistemi**: Kargo takip ve teslim sistemi implementasyonu
- **Cargo Management Page**: Kargo yönetimi için özel sayfa
- **Cargo System Utilities**: `utils/cargoSystem.ts` ile kargo işlemleri
- **Cargo Status Tracking**: Kargo durumu takip enum'ları ve iş mantığı

### Değiştirildi
- **Database Schema**: Cargo shipments tablosu ve ilişkiler eklendi
- **Device Status Flow**: Kargo adımları entegre edildi

### İyileştirildi
- **Dokümantasyon**: Kapsamlı süreç akışı ve teknik dokümantasyon
- **Kargo Entegrasyonu**: API hazırlığı ve kargo firması entegrasyon yapısı

## [1.9.0] - Ücret Hesaplama ve Escrow Yönetimi

### Eklendi
- **Fee Calculation System**: Detaylı ücret hesaplama sistemi
- **Fee Breakdown Display**: Ücret döküm kartı bileşeni
- **Escrow Manager**: Escrow hesap yönetimi utilities
- **Financial Transaction Tracking**: Mali işlem takibi
- **Payment Summary System**: Ödeme özeti görüntüleme

### Değiştirildi
- **Payment Flow**: Ücret hesaplama entegrasyonu
- **Escrow Logic**: Daha gelişmiş escrow yönetimi

### İyileştirildi
- **Şeffaflık**: Kullanıcılara net ücret bilgisi gösterimi
- **Mali Yönetim**: Gelişmiş finansal işlem takibi

## [1.8.0] - Güvenlik ve Denetim Sistemleri

### Eklendi
- **Audit Logging System**: Kapsamlı denetim kayıt sistemi
- **Security Utilities**: Güvenlik fonksiyonları (`utils/security.ts`)
- **Security Compliance**: GDPR/KVKK uyumluluk araçları
- **File Security**: Dosya güvenliği ve validasyon
- **Upload Rate Limiting**: Dosya yükleme hız sınırlaması
- **Performance Monitoring**: Performans izleme araçları

### Değiştirildi
- **Security Architecture**: Güvenlik katmanları güçlendirildi

### İyileştirildi
- **Güvenlik**: Çok katmanlı güvenlik yaklaşımı
- **Denetim**: Detaylı loglama ve izleme

## [1.7.0] - Yönetici Paneli ve GDPR Uyumluluğu

### Eklendi
- **Yönetici Rolü**: Sistemi yönetmek için yeni bir `ADMIN` kullanıcı rolü ve varsayılan bir yönetici hesabı eklendi
- **Yönetici Paneli**: `/admin` yolunda, tüm kullanıcıları ve cihazları listeleyen, yalnızca yöneticilerin erişebileceği özel bir sayfa oluşturuldu
- **Security Dashboard**: Yöneticiler için güvenlik dashboard'u
- **Güvenli Yönetici Yolu**: Yönetici paneline erişimi yalnızca `ADMIN` rolüne sahip kullanıcılarla kısıtlayan bir `AdminRoute` bileşeni eklendi
- **GDPR Onayı**: Kayıt sayfasına, kullanıcıların devam etmeden önce Hizmet Şartları ve Gizlilik Politikasını kabul etmelerini gerektiren zorunlu bir onay kutusu eklendi

### Değiştirildi
- **Header**: Oturum açmış yönetici kullanıcılara "Yönetici Paneli" bağlantısı artık gösteriliyor

### İyileştirildi
- **Yönetim**: Merkezi yönetim sistemi
- **Uyumluluk**: GDPR/KVKK gereksinimlerine uyum

## [1.6.0] - Bilgilendirme Sayfaları ve Gelişmiş Footer

### Eklendi
- **Statik Sayfalar**: SSS (FAQ), Hizmet Şartları, Gizlilik Politikası ve İletişim için yeni sayfalar oluşturuldu
- **Sayfa Yönlendirme**: Yeni statik sayfalar için `App.tsx` içine yollar (routes) eklendi
- **Detaylı İçerik**: `constants.ts` dosyasına yeni sayfalar için tüm dillerde kapsamlı metinler ve çeviriler eklendi
- **Sitemap Generator**: Otomatik sitemap oluşturma scripti

### Değiştirildi
- **Footer**: Sitenin altbilgisi (footer), yeni eklenen bilgilendirme sayfalarına bağlantılar ve bir "App Store'dan İndir" butonu içerecek şekilde yeniden tasarlandı

### İyileştirildi
- **SEO**: Sitemap ve robots.txt desteği
- **Kullanıcı Bilgilendirme**: Kapsamlı bilgilendirme sayfaları

## [1.5.0] - Uluslararasılaşma Genişlemesi

### Eklendi
- **Genişletilmiş Dil Desteği**: Fransızca (`fr`), Japonca (`ja`) ve İspanyolca (`es`) için tam arayüz çeviri desteği eklendi

### Değiştirildi
- **Çeviriler**: `constants.ts` dosyası, yeni eklenen diller için tüm metinleri içerecek şekilde güncellendi
- **Dil Seçimi**: Header'daki dil seçim menüsü yeni dilleri içerecek şekilde güncellendi

### İyileştirildi
- **Uluslararasılaşma**: 5 dilde tam destek

## [1.4.0] - Uygulama İçi Bildirim Sistemi

### Eklendi
- **Bildirim Merkezi**: Header'a, okunmamış bildirim sayısını gösteren bir rozete sahip bir zil ikonu ve bildirimleri listeleyen bir açılır menü eklendi
- **Otomatik Bildirimler**: Cihaz eşleşmesi, ödeme alınması ve takas onayı gerekmesi gibi kritik olaylar için otomatik bildirimler oluşturuldu
- **Otomatik Okundu İşaretleme**: Kullanıcılar bir bildirim bağlantısına tıkladığında, ilgili bildirim otomatik olarak "okundu" olarak işaretlenir
- **Bildirim Matrisi**: Tüm olaylar için bildirim sistemi

### İyileştirildi
- **Kullanıcı Deneyimi**: Gerçek zamanlı bildirimler ile kullanıcı bilgilendirmesi

## [1.3.0] - Güvenli Takas ve Emanet (Escrow) İyileştirmeleri

### Eklendi
- **İki Taraflı Onay**: Takasın tamamlanması için her iki tarafın da işlemi onaylamasını gerektiren bir sistem eklendi
- **Güvenli Takas Yönergeleri**: Ödeme yapıldıktan sonra cihaz detay sayfasında kullanıcılara güvenli bir takas için yönergeler gösterilmeye başlandı
- **Şeffaf Komisyon Bilgisi**: İşlem tamamlandığında, platform işletim maliyetleri için hizmet bedeli kesintisi bilgisi eklendi
- **Escrow Status Tracking**: Emanet durumu takip sistemi

### Değiştirildi
- `Device` veri yapısı, onayları takip etmek için `exchangeConfirmedBy` alanını içerecek şekilde güncellendi

### İyileştirildi
- **Güvenlik**: İki taraflı onay sistemi
- **Şeffaflık**: Komisyon bilgisi gösterimi

## [1.2.0] - Satın Alma Kanıtı (Fatura Yükleme)

### Eklendi
- **Fatura Yükleme**: Cihaz sahipleri artık sahipliklerini doğrulamak için "Cihaz Ekle" formuna fatura (resim veya PDF) yükleyebilirler
- **Fatura Görüntüleme**: Cihaz detay sayfasında, cihaz sahibi için yüklenen faturayı görüntülemesini sağlayan bir buton eklendi
- **File Upload System**: Güvenli dosya yükleme sistemi
- **Invoice Logging**: Fatura doğrulama logları

### İyileştirildi
- **Güvenlik**: Sahte cihaz kayıtlarının önlenmesi
- **Doğrulama**: Sahiplik kanıtı sistemi

## [1.1.0] - Yapay Zeka Destekli Öneriler

### Eklendi
- **Gemini API Entegrasyonu**: "Cihaz Ekle" sayfasına Google Gemini API (`gemini-2.5-flash`) entegre edildi
- **Akıllı Öneriler**: Cihaz modeli ve rengine göre otomatik olarak cihaz açıklaması, adil bir ödül miktarı ve tahmini piyasa değeri öneren "AI ile Öner" butonu eklendi
- **Structured JSON Responses**: AI'dan yapılandırılmış veri alımı

### İyileştirildi
- **Kullanıcı Deneyimi**: AI destekli otomatik öneriler
- **Doğruluk**: AI ile daha adil ödül önerileri

## [1.0.0] - İlk Sürüm

### Eklendi
- **Temel Platform**: React 19.1.0, TypeScript 5.7.2 ve Tailwind CSS ile projenin ilk kurulumu
- **Kullanıcı Yönetimi**: "Cihaz Sahibi" ve "Cihaz Bulan" rolleri için kayıt ve giriş işlevselliği
- **Supabase Auth**: JWT tabanlı kimlik doğrulama ve OAuth desteği
- **Cihaz Yönetimi**: Kullanıcıların kayıp veya bulunan cihazları eklemesi ve panellerinde görüntülemesi
- **Otomatik Eşleştirme**: Cihaz modeli ve seri numarasına dayalı temel eşleştirme mantığı
- **Takas Akışı**: Ödeme ve takas onayı için temel akış
- **Temel Çoklu Dil Desteği**: İngilizce (en) ve Türkçe (tr) için ilk çeviriler
- **Device Status System**: Cihaz durumu takip enum'ları
- **Dashboard**: Kullanıcı dashboard sayfası
- **Responsive Design**: Mobil uyumlu tasarım