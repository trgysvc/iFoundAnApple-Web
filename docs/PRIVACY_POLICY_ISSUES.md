# 🔍 Privacy Policy - Google Cloud Uyumluluk Analizi

**Tarih:** 24 Ekim 2025  
**Kaynak:** [Google Cloud OAuth Privacy Policy Requirements](https://support.google.com/cloud/answer/13806988)

---

## ⚠️ Tespit Edilen Eksikler

### 1. ❌ Google User Data Kullanım Bildirimi Yok

**Google Gereksinim:** Google OAuth ile giriş yapıldığında Google user data kullanımı açıkça belirtilmeli.

**Mevcut Durum:** Sadece "OAuth Login (Google/Apple)" başlığı altında "Basic profile information from OAuth provider" deniyor ama Google user data'nın **nasıl kullanıldığı** belirtilmiyor.

**Çözüm:** Google user data kullanımını açıkça belirt:
```markdown
### Google User Data Usage
- We use Google OAuth solely for authentication purposes
- We collect: Name, Email, Profile Picture from Google
- We use this data to: Create your account, personalize your experience
- We store this data: Encrypted in our secure database
- We share with third parties: Only for service delivery (Supabase)
```

---

### 2. ⚠️ Sensitive Data (TC, IBAN) Encryption Bildirimi Yok

**Google Gereksinim:** Hassas verilerin (kişisel bilgiler, finansal veriler) nasıl korunduğu açıkça belirtilmeli.

**Mevcut Durum:** 
- "Password hashing (bcrypt)" deniyor ✅
- Ama **TC Kimlik, IBAN, Phone, Address** için encryption belirtilmiyor ❌

**Çözüm:**
```markdown
### Encryption for Sensitive Data
We encrypt the following sensitive data using AES-256-GCM encryption:
- Turkish National ID (TC Kimlik No)
- IBAN numbers
- Phone numbers
- Physical addresses
- All cryptographic keys are stored securely in environment variables
```

---

### 3. ⚠️ Google User Data Sharing Açıklaması Eksik

**Google Gereksinim:** Google user data'nın kimlerle paylaşıldığı, transfer edildiği veya açıklandığı belirtilmeli.

**Mevcut Durum:** 
- Section 5'te "DATA SHARING" var ✅
- Ama Google user data'ya özel açıklama yok ❌

**Çözüm:**
```markdown
### Google User Data Sharing
We only share Google user data (name, email) with:
1. **Supabase** (Backend provider) - Required for platform functionality
2. **Payment Provider** - Required for financial transactions
3. **Cargo Companies** - Required for delivery (address only)

We DO NOT share Google user data with:
- Third-party advertisers
- Data brokers
- Information resellers
- For any marketing purposes
```

---

### 4. ⚠️ Data Protection Mechanisms Eksik

**Google Gereksinim:** "Data protection mechanisms for sensitive data" belirtilmeli.

**Mevcut Durum:** Section 6.1'de genel güvenlik önlemleri var ama Google user data için özel koruma belirtilmemiş.

**Çözüm:**
```markdown
### Google User Data Protection
- Encryption at rest: AES-256-GCM
- Encryption in transit: TLS 1.3 (HTTPS)
- Access control: Row Level Security (RLS)
- Authentication: OAuth 2.0 with secure tokens
- Regular security audits and vulnerability assessments
```

---

### 5. ⚠️ Data Retention for Google User Data Eksik

**Google Gereksinim:** Google user data için retention/deletion politikası belirtilmeli.

**Mevcut Durum:** Genel retention var ama Google user data'ya özel değil.

**Çözüm:**
```markdown
### Google User Data Retention
- **Active accounts:** Retained while account is active
- **Deleted accounts:** Removed within 30 days
- **Financial data:** 10 years (legal requirement - Tax Law)
- **You can request deletion:** Via email at privacy@ifoundanapple.com
```

---

### 6. ⚠️ Data Kullanım Limitasyonları Belirsiz

**Google Gereksinim:** Data sadece "providing or improving application's functionality" için kullanılmalı.

**Mevcut Durum:** Section 4'te kullanım amaçları var ama Google user data için özel limitasyon yok.

**Çözüm:**
```markdown
### Google User Data Usage Limitation
We use Google user data ONLY for:
- ✅ Providing platform functionality (account creation, authentication)
- ✅ Improving user experience (personalization)
- ✅ Security and fraud prevention

We DO NOT use Google user data for:
- ❌ Targeted advertising
- ❌ Selling to data brokers
- ❌ Providing to information resellers
- ❌ Training AI models unrelated to our service
- ❌ Creating databases for other purposes
```

---

## ✅ Uyumluluk Durumu

| Gereksinim | Durum | Açıklama |
|------------|-------|----------|
| Google user data collection | ⚠️ Eksik | Collection belirtilmiş, ama kullanım belirtilmemiş |
| Google user data kullanımı | ❌ Yok | Nasıl kullanıldığı belirtilmemiş |
| Google user data sharing | ⚠️ Kısmi | Genel sharing var, Google özel değil |
| Data protection | ⚠️ Kısmi | Genel encryption var, Google özel değil |
| Data retention | ⚠️ Kısmi | Genel retention var, Google özel değil |
| Data kullanım limitasyonları | ❌ Yok | Prohibited uses belirtilmemiş |
| Domain verification | ✅ Uyumlu | Owned domain'de |
| Format (HTML) | ✅ Uyumlu | HTML format |

---

## 🔧 Önerilen Düzeltmeler

### 1. Privacy Policy'ye "Google OAuth Data" Section Ekle

```markdown
### 12. GOOGLE OAUTH DATA USAGE

#### 12.1 Data Collection
When you sign in with Google, we collect:
- Your name
- Your email address
- Your profile picture (optional)

#### 12.2 Data Usage
We use your Google data solely to:
- Create and manage your account
- Authenticate you securely
- Personalize your platform experience
- Send you important notifications

We DO NOT use your Google data for:
- Advertising or marketing
- Selling to third parties
- Training unrelated AI models
- Any purpose other than platform functionality

#### 12.3 Data Sharing
Your Google data is shared only with:
- **Supabase** (database provider) - Required for account management
- **Payment providers** - Only when you make a transaction (email for receipt)
- **Cargo companies** - Only for device delivery (name and address)

We never share with: advertisers, data brokers, or information resellers.

#### 12.4 Data Protection
Your Google data is protected by:
- AES-256-GCM encryption at rest
- TLS 1.3 encryption in transit
- Row Level Security (RLS) policies
- Secure OAuth 2.0 authentication

#### 12.5 Data Retention
- **Active accounts:** While your account exists
- **Deleted accounts:** Removed within 30 days
- **Financial records:** 10 years (legal requirement)

#### 12.6 Your Rights
You can:
- Request a copy of your Google data
- Request deletion of your Google data
- Object to Google data processing
- Exercise these rights via: privacy@ifoundanapple.com
```

---

### 2. Mevcut Section 3'ü Güncelle

**ÖNCE:**
```markdown
### 3.1 Registration and Authentication
OAuth Login (Google/Apple):
- Basic profile information from OAuth provider
- Name, surname, email
- No need to create a password
```

**SONRA:**
```markdown
### 3.1 Registration and Authentication
OAuth Login (Google/Apple):
- **Google User Data:** Name, Email, Profile Picture
- **Purpose:** Account creation and authentication ONLY
- **Data Protection:** AES-256-GCM encryption
- **Data Sharing:** Only with service providers (see Section 5.1)
- **Data Retention:** Active account lifetime, deleted after 30 days of account deletion
```

---

### 3. Section 5 (DATA SHARING) Başlığını Düzelt

Şu an: "4.2 Inter-User Sharing" - Sayı hatalı (4.2 olmamalı, 5.x olmalı)

---

## 📋 Action Items

1. ✅ Eklemeleri yap
2. ✅ Section numaralarını düzelt
3. ✅ Google OAuth açıklamalarını ekle
4. ✅ Forbidden uses'ı belirt
5. ✅ Test et

---

**Referans:** [Google Cloud OAuth Verification - Privacy Policy](https://support.google.com/cloud/answer/13806988?hl=tr)

