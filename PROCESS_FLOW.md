# iFoundAnApple - Tam Süreç Akışı

Bu dosya, platformun tüm süreç akışını detaylı olarak açıklar. Lütfen eksik veya yanlış kısımları düzeltin.

---

## 🔴 CİHAZ SAHİBİ (DEVICE OWNER) - KAYIP CİHAZ SÜRECİ

### **Adım 1: Kayıt ve Giriş**
```
Kullanıcı → Ana Sayfa → "Kayıt Ol" → Email + Şifre → Email Doğrulama → Giriş
```

**Detaylar:**
- Supabase Auth ile kayıt
- Email doğrulama zorunlu mu?
- Profil bilgileri (ad, soyad, telefon, adres, IBAN) ne zaman zorunlu?
  - Kayıt sırasında mı?
  - Cihaz eklerken mi?
  - Ödeme öncesinde mi?
        AD SOYAD TELEFON EPOSTA DOĞUM TARİHİ KAYIT ESNASINDA ZORUNLU.
        ADRES + IBAN ÖDEME ÖNCESİNDE ZORUNLU. 
---

### **Adım 2: Kayıp Cihaz Ekleme**
```
Dashboard → "Cihaz Ekle" → "Kaybettim" Seçeneği
```

**Girilen Bilgiler:**
- Cihaz Modeli: Dropdown'dan seçim (iPhone 15 Pro Max, vb.)
- Seri Numarası: Manuel giriş (12 haneli)
- Kayıp Tarihi: Tarih seçici
- Kayıp Yeri: Serbest metin
- Açıklama: Opsiyonel
- Ödül Miktarı:
  - Sistem önerisi var mı? (AI ile) YOK
  - Kullanıcı özel miktar girebilir mi? HAYIR
  - Minimum/Maksimum sınır var mı? CİHAZIN FİYAT BİLGİSİ İLE BELİRLENECEK YÜZDELİK KISMI ÖDÜL OLACAK. 

**Database:**
```typescript
devices {
  id: UUID
  user_id: UUID  // Cihaz sahibinin ID'si
  model: string
  serial_number: string
  status: "PENDING"  // İlk durum
  device_type: "lost"  // "lost" veya "found"
  reward_amount: decimal
  lost_date: date
  lost_location: string
  description: text
  created_at: timestamp
}
```

---

### **Adım 3: Eşleşme Bekleme**
```
Status: PENDING → Sistem otomatik eşleştirme yapıyor
```

**Dashboard'da Görünen:**
- Cihaz kartı: "Eşleşme Bekleniyor"
- Durum rengi: ?
- Bildirim: Var mı? VAR

**DeviceDetailPage (Cihaz Detay Sayfası):**
```
Dashboard → Cihaz Kartına Tıkla → DeviceDetailPage açılır
```
- Cihaz detayları görünüyor (Model, Seri No, Tarih, Yer, Açıklama)
- Status: PENDING için ne görünüyor?
  - Mesaj: "Eşleşme bekleniyor" mı?
  - Herhangi bir aksiyon butonu var mı?
  - İptal butonu var mı?

**Eşleştirme Mantığı:**
- Sadece seri numarasına göre mi? ŞİMDİLİK SADECE SERİ NUMARSI İLE EŞLEŞTİRME YAPILACAK.
- Model de kontrol ediliyor mu?
- Başka kriterler var mı? SAHTE SERİ NUMARALARI İÇİN FARKLI BİR YOL İZLENECEK. SONRA YAPILACAK. 

---

### **Adım 4: Eşleşme Bulundu**
```
Sistem → Eşleşme buldu → Status: MATCHED
```

**Database Değişiklikleri:**
```typescript
devices {
  status: "MATCHED"
  matched_with_user_id: UUID  // Bulan kişinin ID'si mi?
  matched_at: timestamp
}
```

**Bildirimler:**
- Email gidiyor mu? E POSTA GÖNDERECEĞİZ. HAZIRLIĞI YAPILSIN. SONRA AKTİF EDİLECEK. SUPABASE İN BU HİZMETİ VAR MI? 
- In-app notification var mı? VAR
- SMS gidiyor mu? HAYIR

**Dashboard'da Görünen:**
- Cihaz kartı mesajı: Eşleşti! Cihaz sahibi ödemesi bekleniyor.
- Durum rengi: ?
- Buton: YOK
- Bulan kişi bilgisi görünüyor mu? (Anonim mi?) BU BİLGİ ANONİM OLARAK KALACAK. 
- Ödül miktarı görünüyor mu? ÖDÜL MİKTARI TOPLAM ÖDEMENİN %10 U GİBİ DÜŞÜNÜLEBİLİR. BU % DİLİMLERİ BELİRLEYECEĞİMİZ KOLAY BİR SİSTEM TASARLANMALI. 

**DeviceDetailPage (Cihaz Detay Sayfası):**
```
Dashboard → Cihaz Kartına Tıkla → DeviceDetailPage açılır
```
- Status: MATCHED için ne görünüyor?
  - Başlık: "Eşleşme Bulundu!" 
  - Mesaj: "Ödeme yaparak cihazınızı geri alabilirsiniz" gibi mi?
  - Ödül miktarı görünüyor mu?
  - Toplam tutar görünüyor mu?
  - Bulan kişi bilgisi: Anonim mi?
  - Buton: "Ödeme Yap" - Bu butona tıklayınca nereye gidiyor?
    - MatchPaymentPage mi?
    - PaymentFlowPage mi?
    - Direkt ödeme sayfası mı?

---

### **Adım 5: Ödeme Yapma**
```
Dashboard → Cihaz Detay → "Ödeme Yap" → Ödeme Sayfası
```

**Ödeme Detayları:**
```
Ödül Miktarı: 1,500.00 TL
Kargo Ücreti: 25.00 TL
Hizmet Bedeli (%15): 225.00 TL
Gateway Ücreti (%2.9): 50.75 TL
─────────────────────────────
TOPLAM: 1,800.75 TL
```

**Sorular:**
- Hizmet bedeli yüzdesi doğru mu?
- Gateway ücreti yüzdesi doğru mu?
- Başka kesinti var mı?

**Ödeme Akışı:**
1. Ödeme yöntemi seçimi (İyzico/Kredi Kartı)
2. Kart bilgileri girişi
3. 3D Secure doğrulama var mı?
4. Ödeme onayı

**Database:**
```typescript
payments {
  id: UUID
  device_id: UUID
  payer_id: UUID  // CİHAZ SAHİBİNİN ID'Sİ (ödemeyi yapan)
  receiver_id: UUID  // BULAN KİŞİNİN ID'Sİ (ödülü alacak) - Ne zaman doluyor?
  total_amount: decimal
  reward_amount: decimal
  cargo_fee: decimal
  service_fee: decimal
  gateway_fee: decimal
  net_payout: decimal  // Bulan kişiye gidecek net tutar
  payment_status: "pending" → "processing" → "completed"
  payment_provider: "iyzico"
  provider_payment_id: string
  created_at: timestamp
  completed_at: timestamp
}

escrow_accounts {
  id: UUID
  payment_id: UUID
  device_id: UUID
  holder_user_id: UUID  // CİHAZ SAHİBİNİN ID'Sİ (parayı yatıran)
  beneficiary_user_id: UUID  // BULAN KİŞİNİN ID'Sİ (parayı alacak)
  total_amount: decimal
  reward_amount: decimal
  net_payout: decimal
  status: "pending" → "held"  // Ödeme başarılı olunca "held"
  held_at: timestamp
  release_conditions: jsonb
  confirmations: jsonb
}

devices {
  status: "MATCHED" → "PAYMENT_COMPLETED"
}
```

---

### **Adım 6: Ödeme Tamamlandı - Kargo Bekleme**
```
Status: PAYMENT_COMPLETED → Bulan kişi cihazı kargolayacak
```

**Dashboard'da Görünen:**
- Cihaz kartı mesajı: ?
- Durum rengi: ?
- Ne görüyor kullanıcı?

**DeviceDetailPage (Cihaz Detay Sayfası):**
```
Dashboard → Cihaz Kartına Tıkla → DeviceDetailPage açılır
```
- Status: PAYMENT_COMPLETED için ne görünüyor?
  - Başlık: "Ödeme Tamamlandı!" mı?
  - Mesaj: "Cihazınız kargoya verilecek, bildirim alacaksınız" gibi mi?
  - Ödeme detayları görünüyor mu? (Tutar, tarih, vb.)
  - Escrow durumu görünüyor mu?
  - Herhangi bir aksiyon butonu var mı?

**Bildirimler:**
- Email: ?
- In-app: ?

---

### **Adım 7: Kargo Gönderildi**
```
Bulan kişi kargo bilgilerini girdi → Status: CARGO_SHIPPED (?)
```

**Database:**
```typescript
cargo_shipments {
  id: UUID
  device_id: UUID
  payment_id: UUID
  sender_user_id: UUID  // Bulan kişi
  receiver_user_id: UUID  // Cihaz sahibi
  tracking_number: string
  carrier: string  // "aras", "yurtici", "mng", "ptt"
  shipped_at: timestamp
  estimated_delivery: timestamp
  delivered_at: timestamp
  status: string
}

devices {
  status: "CARGO_SHIPPED" (?)
}
```

**Dashboard'da Görünen:**
- Kargo takip numarası görünüyor mu?
- Kargo şirketi görünüyor mu?
- Tahmini teslimat tarihi var mı?
- Kargo takip butonu var mı?

**DeviceDetailPage (Cihaz Detay Sayfası):**
```
Dashboard → Cihaz Kartına Tıkla → DeviceDetailPage açılır
```
- Status: CARGO_SHIPPED için ne görünüyor?
  - Başlık: "Kargo Yolda!" mı?
  - Kargo takip numarası görünüyor mu?
  - Kargo şirketi görünüyor mu?
  - Gönderim tarihi görünüyor mu?
  - Tahmini teslimat tarihi görünüyor mu?
  - Buton: "Kargo Takip" - Kargo şirketinin sitesine mi yönlendiriyor?
  - Buton: "Teslim Aldım" var mı? (Yoksa otomatik mı tespit ediliyor?)

**Bildirimler:**
- Email: ?
- SMS: ?

---

### **Adım 8: Kargo Teslim Alındı**
```
Cihaz sahibi kargosunu aldı → Manuel onay bekliyor
```

**Dashboard'da Görünen:**
- Mesaj: ?
- Butonlar:
  - "Cihazımı Teslim Aldım, Onayla" var mı?
  - "Sorun Var, İtiraz Et" var mı?

**DeviceDetailPage (Cihaz Detay Sayfası):**
```
Dashboard → Cihaz Kartına Tıkla → DeviceDetailPage açılır
```
- Status: DELIVERED (?) için ne görünüyor?
  - Başlık: "Cihazınız Teslim Edildi!" mı?
  - Mesaj: "Lütfen cihazınızı kontrol edin ve onaylayın" gibi mi?
  - Kargo bilgileri görünüyor mu?
  - Teslim tarihi görünüyor mu?
  - Butonlar:
    - "Cihazımı Teslim Aldım, Onayla" - Bu butona tıklayınca ne oluyor?
      - Onay formu mu açılıyor?
      - Direkt onay mı veriliyor?
      - Cihaz durumu kontrolü var mı?
    - "Sorun Var, İtiraz Et" - Bu butona tıklayınca ne oluyor?
      - İtiraz formu mu açılıyor?
      - Admin'e mi bildirim gidiyor?

---

### **Adım 9: Onay Verme**
```
Cihaz sahibi → "Onayla" → Escrow serbest bırakılıyor
```

**Database:**
```typescript
escrow_accounts {
  status: "held" → "released"
  released_at: timestamp
  confirmations: [
    {
      user_id: UUID
      confirmation_type: "device_received"
      timestamp: timestamp
    },
    {
      user_id: UUID
      confirmation_type: "exchange_confirmed"
      timestamp: timestamp
    }
  ]
}

financial_transactions {
  id: UUID
  payment_id: UUID
  device_id: UUID
  from_user_id: UUID  // Platform/Escrow
  to_user_id: UUID  // Bulan kişi
  transaction_type: "escrow_release"
  amount: decimal  // Net payout
  status: "completed"
  completed_at: timestamp
}

devices {
  status: "COMPLETED"
}
```

**DeviceDetailPage (Cihaz Detay Sayfası):**
```
Dashboard → Cihaz Kartına Tıkla → DeviceDetailPage açılır
```
- Status: COMPLETED için ne görünüyor?
  - Başlık: "İşlem Tamamlandı!" mı?
  - Mesaj: "Cihazınızı geri aldınız, teşekkürler!" gibi mi?
  - Tüm işlem özeti görünüyor mu?
    - Ödeme detayları
    - Kargo bilgileri
    - Onay tarihi
  - Herhangi bir aksiyon butonu var mı?
  - "Değerlendirme Yap" butonu var mı? (Bulan kişiye puan verme)

**Bildirimler:**
- Cihaz sahibine: ?
- Bulan kişiye: ?

---

## 🟢 CİHAZ BULAN (FINDER) - BULUNAN CİHAZ SÜRECİ

### **Adım 1: Kayıt ve Giriş**
```
Kullanıcı → Ana Sayfa → "Kayıt Ol" → Email + Şifre → Giriş
```

**Sorular:**
- IBAN bilgisi ne zaman zorunlu?
- Kimlik doğrulama var mı?

---

### **Adım 2: Bulunan Cihaz Ekleme**
```
Dashboard → "Cihaz Ekle" → "Buldum" Seçeneği
```

**Girilen Bilgiler:**
- Cihaz Modeli: Dropdown
- Seri Numarası: Manuel giriş
- Bulunma Tarihi: Tarih seçici
- Bulunma Yeri: Serbest metin
- Açıklama: Opsiyonel
- Fotoğraf: Var mı?

**Database:**
```typescript
devices {
  id: UUID
  user_id: UUID  // Bulan kişinin ID'si
  model: string
  serial_number: string
  status: "PENDING"
  device_type: "found"
  found_date: date
  found_location: string
  description: text
  created_at: timestamp
}
```

---

### **Adım 3: Eşleşme Bekleme**
```
Status: PENDING → Sistem otomatik eşleştirme yapıyor
```

**Dashboard'da Görünen:**
- Mesaj: ?
- Durum: ?

**DeviceDetailPage (Cihaz Detay Sayfası):**
```
Dashboard → Cihaz Kartına Tıkla → DeviceDetailPage açılır
```
- Status: PENDING için ne görünüyor?
  - Mesaj: "Cihaz sahibi aranıyor" mı?
  - Cihaz detayları görünüyor mu?
  - Herhangi bir aksiyon butonu var mı?

---

### **Adım 4: Eşleşme Bulundu**
```
Sistem → Eşleşme buldu → Status: MATCHED
```

**Database:**
```typescript
devices {
  status: "MATCHED"
  matched_with_user_id: UUID  // Cihaz sahibinin ID'si mi?
  matched_at: timestamp
}
```

**Dashboard'da Görünen:**
- Mesaj: ?
- Ödül miktarı görünüyor mu?
- Net alacağı tutar görünüyor mu?
- Cihaz sahibi bilgisi görünüyor mu? (Anonim mi?)

**DeviceDetailPage (Cihaz Detay Sayfası):**
```
Dashboard → Cihaz Kartına Tıkla → DeviceDetailPage açılır
```
- Status: MATCHED için ne görünüyor?
  - Başlık: "Eşleşme Bulundu!" mı?
  - Mesaj: "Cihaz sahibi ödeme yapacak, lütfen bekleyin" gibi mi?
  - Ödül miktarı görünüyor mu?
  - Net alacağı tutar görünüyor mu? (Kesintiler sonrası)
  - Cihaz sahibi bilgisi: Anonim mi?
  - Herhangi bir aksiyon butonu var mı?
  - İptal butonu var mı?

**Bildirimler:**
- Email: ?
- In-app: ?

---

### **Adım 5: Ödeme Bekleme**
```
Status: MATCHED → Cihaz sahibi ödeme yapıyor
```

**Dashboard'da Görünen:**
- Mesaj: "Ödeme bekleniyor" mi?
- Zaman sınırı var mı? (Örn: 48 saat içinde ödeme yapılmazsa eşleşme iptal)
- İptal butonu var mı?

---

### **Adım 6: Ödeme Tamamlandı**
```
Cihaz sahibi ödeme yaptı → Status: PAYMENT_COMPLETED
```

**Database:**
```typescript
payments {
  receiver_id: UUID  // BULAN KİŞİNİN ID'Sİ güncellendi
}

escrow_accounts {
  beneficiary_user_id: UUID  // BULAN KİŞİNİN ID'Sİ
  status: "held"
}

devices {
  status: "PAYMENT_COMPLETED"
}
```

**Dashboard'da Görünen:**
- Mesaj: "Ödeme alındı, cihazı kargolayın" mı?
- Kargo adresi görünüyor mu?
  - Tam adres mi?
  - Kargo şubesi mi?
  - Güvenlik nasıl sağlanıyor?
- Buton: "Kargo Bilgilerini Gir" mi?

**DeviceDetailPage (Cihaz Detay Sayfası):**
```
Dashboard → Cihaz Kartına Tıkla → DeviceDetailPage açılır
```
- Status: PAYMENT_COMPLETED için ne görünüyor?
  - Başlık: "Ödeme Alındı!" mı?
  - Mesaj: "Lütfen cihazı kargolayın" gibi mi?
  - Ödeme detayları görünüyor mu?
  - Escrow durumu görünüyor mu?
  - Kargo adresi görünüyor mu?
    - Tam adres mi, yoksa sadece il/ilçe mi?
    - Alıcı adı görünüyor mu?
    - Telefon numarası görünüyor mu?
  - Buton: "Kargo Bilgilerini Gir" - Bu butona tıklayınca ne oluyor?
    - Modal/Form açılıyor mu?
    - Ayrı sayfa mı açılıyor?

**Bildirimler:**
- Email: ?
- In-app: ?

---

### **Adım 7: Kargo Hazırlığı**
```
Bulan kişi → "Kargo Bilgilerini Gir" → Form
```

**Girilen Bilgiler:**
- Kargo Şirketi: Dropdown (Aras, Yurtiçi, MNG, PTT)
- Kargo Takip Numarası: Manuel giriş
- Gönderim Tarihi: Tarih seçici

**Sorular:**
- Kargo ücreti kim ödüyor?
  - Cihaz sahibi zaten ödedi (25 TL)
  - Ama bulan kişi kargoya giderken advance ödüyor mu?
  - Yoksa "ödemeli gönderim" mi yapıyor?
  - Yoksa kargo ücreti sonradan bulan kişiye mi ödeniyor?

**Database:**
```typescript
cargo_shipments {
  id: UUID
  device_id: UUID
  payment_id: UUID
  sender_user_id: UUID  // Bulan kişi
  receiver_user_id: UUID  // Cihaz sahibi
  tracking_number: string
  carrier: string
  shipped_at: timestamp
  status: "shipped"
}

devices {
  status: "CARGO_SHIPPED"
}
```

---

### **Adım 8: Kargo Yolda**
```
Status: CARGO_SHIPPED → Teslimat bekleniyor
```

**Dashboard'da Görünen:**
- Kargo takip numarası görünüyor mu?
- Mesaj: ?

---

### **Adım 9: Teslimat ve Onay Bekleme**
```
Cihaz sahibi teslim aldı → Onay veriyor
```

**Dashboard'da Görünen:**
- Mesaj: "Onay bekleniyor" mi?
- Otomatik onay süresi var mı? (Örn: 7 gün sonra otomatik onay)

---

### **Adım 10: Ödül Alma**
```
Cihaz sahibi onayladı → Escrow released → Para transfer
```

**Database:**
```typescript
escrow_accounts {
  status: "released"
  released_at: timestamp
}

financial_transactions {
  transaction_type: "escrow_release"
  to_user_id: UUID  // Bulan kişi
  amount: decimal  // Net payout
  status: "completed"
}

devices {
  status: "COMPLETED"
}
```

**Dashboard'da Görünen:**
- Mesaj: "Ödülünüz hesabınıza aktarıldı" mı?
- Tutar görünüyor mu?

**Transfer Süreci:**
- IBAN'a otomatik transfer mi?
- Manuel talep mi?
- İyzico ile mi yapılıyor?
- Transfer süresi: Anında mı, 1-3 iş günü mü?

**Bildirimler:**
- Email: ?
- SMS: ?

---

## ❓ EKSİK DETAYLAR VE SORULAR

### **1. Profil Bilgileri**
- IBAN ne zaman zorunlu?
- Kimlik doğrulama var mı?
- TC Kimlik zorunlu mu?
- Telefon zorunlu mu?
- Adres ne zaman gerekli?

### **2. Kargo Detayları**
- Kargo ücreti kim advance ödüyor?
- Kargo adresi nasıl paylaşılıyor?
- Kargo sigortası var mı?
- Kargo takip entegrasyonu var mı?

### **3. İletişim**
- İki taraf mesajlaşabiliyor mu?
- In-app chat var mı?
- Telefon numaraları paylaşılıyor mu?
- Tamamen anonim mi?

### **4. Zaman Sınırları**
- Ödeme için zaman sınırı var mı?
- Kargo için zaman sınırı var mı?
- Onay için otomatik onay süresi var mı?

### **5. İptal/İade**
- Eşleşme iptal edilebiliyor mu?
- Ödeme sonrası iptal olursa ne oluyor?
- Yanlış cihaz gönderilirse ne oluyor?
- İtiraz süreci nasıl?
- Para iadesi nasıl yapılıyor?

### **6. Güvenlik**
- Kimlik doğrulama zorunlu mu?
- Dolandırıcılık önleme var mı?
- Sahte cihaz kontrolü var mı?
- Sahte seri numarası kontrolü var mı?

### **7. Ödeme Transfer**
- Bulan kişiye para nasıl transfer ediliyor?
- İyzico ile mi yapılıyor?
- IBAN'a otomatik transfer mi?
- Transfer süresi ne kadar?
- Transfer ücreti var mı?

### **8. Device Status Değerleri**
Tüm olası status değerleri neler?
```typescript
"PENDING"           // İlk durum
"MATCHED"           // Eşleşme bulundu
"PAYMENT_PENDING"   // Var mı?
"PAYMENT_COMPLETED" // Ödeme tamamlandı
"CARGO_PREPARING"   // Var mı?
"CARGO_SHIPPED"     // Kargo gönderildi
"DELIVERED"         // Var mı?
"AWAITING_CONFIRMATION" // Var mı?
"COMPLETED"         // İşlem tamamlandı
"CANCELLED"         // Var mı?
"DISPUTED"          // Var mı?
```

### **9. Bildirimler**
Hangi aşamalarda hangi bildirimler gidiyor?
- Email
- SMS
- In-app notification
- Push notification (mobil için)

### **10. Ücret Hesaplama**
- Hizmet bedeli yüzdesi: %15 mi?
- Gateway ücreti yüzdesi: %2.9 mi?
- Kargo ücreti sabit: 25 TL mi?
- Başka kesinti var mı?
- Net payout hesaplama formülü:
  ```
  net_payout = reward_amount + cargo_fee - service_fee - gateway_fee
  ```
  Bu doğru mu?

### **11. Escrow Release Conditions**
- Hangi koşullar sağlanmalı?
  - device_received
  - exchange_confirmed
  - Başka koşul var mı?
- Otomatik release süresi var mı?
- Manuel admin onayı gerekiyor mu?

### **12. Eşleşme Mantığı**
- Sadece seri numarasına göre mi?
- Model de kontrol ediliyor mu?
- Birden fazla eşleşme varsa ne oluyor?
- İlk giren mi alıyor?

### **13. Admin Paneli**
- Admin hangi aşamalara müdahale edebiliyor?
- Manuel escrow release yapabiliyor mu?
- İtirazları admin mi çözüyor?
- İptal/iade işlemlerini admin mi yapıyor?

---

## 📊 DATABASE SCHEMA SORULARI

### **devices tablosu:**
```typescript
- matched_with_user_id: Bulan kişinin mi, cihaz sahibinin mi ID'si?
- device_type: "lost" ve "found" dışında değer var mı?
- status: Tüm olası değerler neler?
```

### **payments tablosu:**
```typescript
- payer_id: Cihaz sahibi (doğru mu?)
- receiver_id: Bulan kişi (doğru mu?)
- receiver_id ne zaman doluyor? Eşleşme anında mı, yoksa sonra mı?
```

### **escrow_accounts tablosu:**
```typescript
- holder_user_id: Cihaz sahibi (doğru mu?)
- beneficiary_user_id: Bulan kişi (doğru mu?)
- release_conditions: Hangi koşullar var?
- confirmations: Hangi onaylar gerekli?
```

### **cargo_shipments tablosu:**
```typescript
- Bu tablo var mı?
- Hangi alanlar var?
- Status değerleri neler?
```

### **financial_transactions tablosu:**
```typescript
- Bu tablo var mı?
- Hangi transaction_type değerleri var?
- Transfer işlemleri buradan mı yapılıyor?
```

---

## 🔄 SÜREÇ AKIŞ DİYAGRAMI

```
CİHAZ SAHİBİ                           SİSTEM                           CİHAZ BULAN
─────────────                          ──────                           ───────────

Cihaz Ekle (lost)                                                       
    ↓                                                                    
PENDING ────────────────────────→ Eşleştirme Yap ←──────────────────── Cihaz Ekle (found)
                                        ↓                                      ↓
                                   MATCHED ──────────────────────────────→ MATCHED
    ↓                                   ↓                                      ↓
Ödeme Yap                          Ödeme İşle                            Ödeme Bekle
    ↓                                   ↓                                      ↓
PAYMENT_COMPLETED ←────────────── Escrow HELD ──────────────────────→ PAYMENT_COMPLETED
    ↓                                   ↓                                      ↓
Kargo Bekle                        Kargo Takip                          Kargo Gönder
    ↓                                   ↓                                      ↓
CARGO_SHIPPED ←────────────────── Kargo Bilgisi ←──────────────────── CARGO_SHIPPED
    ↓                                   ↓                                      ↓
Kargo Al                           Teslimat                             Teslimat Bekle
    ↓                                   ↓                                      ↓
Onay Ver ──────────────────────→ Escrow Release ──────────────────────→ Para Al
    ↓                                   ↓                                      ↓
COMPLETED                          COMPLETED                            COMPLETED
```

---

**LÜTFEN BU DOSYAYI DÜZELTIP EKSİK DETAYLARI TAMAMLAYIN! 🙏**

