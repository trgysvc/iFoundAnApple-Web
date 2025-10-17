export const translations = {
  en: {
    // Header & Nav
    appName: "iFoundAnApple",
    home: "Home",
    dashboard: "Dashboard",
    profile: "Profile",
    language: "Language",
    login: "Login",
    logout: "Logout",
    register: "Register",
    reportFoundDevice: "Report a Found Device",
    addLostDevice: "Add a Lost Device",
    adminDashboard: "Admin Panel",
    notifications: {
      title: "Notifications",
      markAllAsRead: "Mark all as read",
      noNotifications: "No new notifications.",
      matchFoundOwner: "Match found for your {model}! Action required.",
      matchFoundFinder: "Match found for the {model} you reported. Waiting for owner's payment.",
      paymentReceivedFinder: "Payment received for {model}! Please proceed with the exchange.",
      exchangeConfirmationNeeded: "The other party confirmed the exchange for {model}. Please confirm to complete.",
      transactionCompletedOwner: "Success! The exchange for your {model} is complete.",
      transactionCompletedFinder: "Success! The reward for {model} is on its way.",
      deviceLostConfirmation: "Your lost device ({model}) has been successfully added.",
      deviceReportedConfirmation: "Your found device ({model}) has been successfully reported.",
    },
    // Home Page
    heroTitle: "Lost your Apple device? Find it securely.",
    heroSubtitle: "We connect you anonymously with the person who found your device. A safe exchange, a fair reward.",
    getStarted: "Get Started",
    howItWorks: "How It Works",
    step1Title: "Owner Reports Lost Device",
    step1Desc: "If you've lost your iPhone, iPad, or Mac, register it on our platform with its serial number.",
    step2Title: "Finder Reports Found Device",
    step2Desc: "Anyone who finds a device can report it anonymously using its serial number.",
    step3Title: "Secure Match & Escrow",
    step3Desc: "Our system automatically matches devices. The owner pays a reward into our secure escrow system.",
    step4Title: "Safe Exchange & Payout",
    step4Desc: "Follow our guidelines for a safe exchange. Once confirmed, the finder receives the reward.",
    // Auth Pages
    loginTitle: "Login to your Account",
    registerTitle: "Create an Account",
    email: "Email",
    password: "Password",
    fullName: "Full Name",
    firstName: "First Name",
    lastName: "Last Name", 
    tcKimlikNo: "TC Identity Number",
    phoneNumber: "Phone Number",
    address: "Address",
    iban: "IBAN Number",
    iAmA: "I am a...",
    deviceOwner: "Device Owner",
    deviceFinder: "Device Finder",
    bankInfo: "Bank Account Information (for reward payout)",
    agreeToTerms: "I agree to the {terms} and {privacy}.",
    termsLink: "Terms of Service",
    privacyLink: "Privacy Policy",
    consentRequired: "You must agree to the terms and privacy policy to continue.",
    alreadyHaveAccount: "Already have an account?",
    dontHaveAccount: "Don't have an account?",
    // Auth errors
    userAlreadyExists: "A user with this email already exists.",
    invalidEmailOrPassword: "Invalid email or password.",
    orContinueWith: "Or continue with",
    loginWithGoogle: "Login with Google",
    loginWithApple: "Login with Apple",
    processingPayment: "Processing payment...",
    // Dashboard
    myDevices: "My Devices",
    status: "Status",
    model: "Model",
    serialNumber: "Serial Number",
    noDevicesReported: "You have not reported any devices yet.",
    // Device Forms
    deviceModelForm: "Device Model (e.g., iPhone 15 Pro)",
    deviceSerialNumber: "Serial Number",
    deviceColor: "Color",
    deviceDescription: "Additional details (optional)",
    deviceInvoice: "Proof of Purchase (Invoice)",
    deviceInvoiceHelper: "Optional. Helps verify ownership.",
    submit: "Submit",
    suggestDescription: "Suggest Description with AI",
    suggestRewardDescription: "Suggest Reward & Description with AI",
    gettingSuggestions: "Getting suggestions...",
    aiSuggestion: "AI Suggestion",
    suggestedReward: "Suggested Reward",
    basedOnValue: "Based on an estimated value of {value}",
    aiError: "Could not get AI suggestions. Please fill in the details manually.",
    // Statuses
    Lost: "Lost",
    Reported: "Reported",
    Matched: "Matched! Awaiting owner payment.",
    PaymentPending: "Matched! Please proceed to payment.",
    PaymentComplete: "Payment Complete! Proceed with exchange.",
    ExchangePending: "Exchange Pending",
    Completed: "Completed",
    // Device Detail Page
    deviceDetails: "Device Details",
    matchFoundDevice: "A match was found for your device!",
    reward: "Reward",
    makePaymentSecurely: "Make Payment Securely",
    waitingForOwnerPayment: "Waiting for the owner to make the payment.",
    matchFoundTitle: "Match Found!",
    paymentReceived: "Payment Received!",
    paymentSecureExchange: "Your payment is held securely. Please follow the instructions to complete the exchange and confirm.",
    finderPaymentSecureExchange: "The payment is held securely. Please follow the instructions to complete the exchange and confirm.",
    confirmExchange: "I Confirm the Exchange",
    waitingForOtherParty: "Waiting for the other party to confirm...",
    secureExchangeGuidelines: "Secure Exchange Guidelines",
    guideline1: "Arrange to meet in a safe, public place like a police station or a well-lit cafe.",
    guideline2: "Alternatively, use a tracked and insured shipping service to exchange the device.",
    guideline3: "Do not share personal contact information. Communicate only through our platform if necessary.",
    guideline4: "Once you have successfully exchanged the device, press the confirmation button below.",
    transactionCompleted: "Transaction Completed!",
    transactionCompletedDesc: "The reward has been transferred to the finder. Thank you for using iFoundAnApple.",
    serviceFeeNotice: "A 5% service fee has been deducted from the reward to cover operational costs.",
    backToDashboard: "Back to Dashboard",
    goBack: "Go Back",
    loading: "Loading...",
    loadingPageContent: "Please wait while the page loads...",
    viewInvoice: "View Invoice",
    failedToAddDevice: "Failed to add device. Please try again.",
    failedToLoadDeviceModels: "Failed to load device models.",
    loadingDeviceModels: "Loading device models...",
    noModelsAvailable: "No models available",
    selectModelFirst: "Select a device model first",
    // Payment related
    paymentSummary: "Payment Summary",
    paymentSummarySubtitle: "Get your device back with secure payment",
    paymentConfirmation: "Payment Confirmation",
    termsAgreement: "I have read and agree to the Terms of Service and Privacy Policy. I understand that my payment will be held in a secure escrow system and transferred to the finder after the device is delivered.",
    securePayment: "Make Secure Payment",
    paymentProcessing: "Payment Processing...",
    paymentSecurityNotice: "🔒 This payment is protected by SSL. Your card information is securely encrypted and not stored.",
    deviceModelNotSpecified: "Device model not specified",
    feeCalculationFailed: "Fee calculation could not be performed",
    feeCalculationError: "An error occurred during fee calculation",
    paymentLoginRequired: "You must be logged in to make a payment",
    missingPaymentInfo: "Missing payment information",
    acceptTermsRequired: "Please accept the terms of service",
    paymentInitiated: "Payment successfully initiated!",
    paymentFailed: "Payment failed",
    paymentError: "An error occurred during payment processing",
    calculatingFees: "Calculating fees...",
    errorOccurred: "An Error Occurred",
    // Cargo related
    cargoTracking: "Cargo Tracking",
    refresh: "Refresh",
    detailedTracking: "Detailed Tracking",
    currentStatus: "Current Status",
    trackingInfo: "Tracking Information",
    anonymousId: "Anonymous ID",
    trackingNumber: "Tracking Number",
    yourRole: "Your Role",
    sender: "Sender",
    receiver: "Receiver",
    deviceInfo: "Device Information",
    estimatedDelivery: "Estimated Delivery",
    cargoHistory: "Cargo History",
    deliveryCompleted: "Delivery Completed",
    confirmDeliveryMessage: "Click the button to confirm that you have received the device",
    confirmDelivery: "Confirm Delivery",
    cargoSupport: "Cargo Support: For cargo-related issues, you can call the cargo company's customer service or contact us with your anonymous ID code.",
    cargoLoadingInfo: "Loading cargo information...",
    cargoTrackingNotFound: "Cargo tracking information not found",
    trackingInfoLoadError: "Error occurred while loading tracking information",
    tryAgain: "Try Again",
    noCargoMovement: "No cargo movement yet",
    // Payment Flow & Match Payment translations
    matchPayment: "Match Payment",
    matchPaymentSubtitle: "Get your device back securely",
    deviceRecoveryPayment: "Device Recovery Payment",
    deviceRecoverySubtitle: "Get your lost device back securely",
    feeDetails: "Fee Details",
    payment: "Payment",
    deviceModel: "Device Model",
    stepIndicatorModel: "Device Model",
    stepIndicatorFees: "Fee Details", 
    stepIndicatorPayment: "Payment",
    matchInfo: "Match Information",
    deviceModelLabel: "Device Model:",
    finderReward: "Reward to Finder:",
    statusLabel: "Status:",
    matchFound: "Match Found",
    proceedToPayment: "Proceed to Payment →",
    customRewardAmount: "Custom Reward Amount",
    customRewardDescription: "Optional: If you want to give a higher reward to the finder, you can set it here.",
    defaultReward: "Default: {amount} TL",
    customRewardSet: "✓ Custom reward amount: {amount} TL",
    changeDeviceModel: "← Change Device Model",
    backToFeeDetails: "← Back to Fee Details",
    finderRewardLabel: "Reward to finder:",
    cargoLabel: "Cargo:",
    serviceFeeLabel: "Service fee:",
    gatewayFeeLabel: "Payment commission:",
    totalLabel: "TOTAL:",
    redirectingToDashboard: "Redirecting to dashboard...",
    // Fee Breakdown Card translations
    category: "Category",
    matchedDevice: "Matched Device",
    matchedWithFinder: "Matched with finder",
    ifoundanappleFeeBreakdown: "iFoundAnApple Fee Breakdown",
    finderRewardDesc: "To be paid to the finder",
    cargoFeeDesc: "For secure delivery",
    serviceFeeDesc: "Platform commission",
    paymentCommissionDesc: "For secure payment",
    totalPayment: "Total Payment",
    paymentDue: "Amount to be paid now",
    finderNetPayment: "Finder Net Payment",
    afterServiceFeeDeduction: "After service fee deduction",
    securePaymentSystem: "Secure Escrow System",
    escrowSystemDesc: "Your payment is held in our secure escrow account and will not be transferred until the device is delivered and confirmed. With secure payment guarantee, you have cancellation and refund rights excluding processing fees.",
    // Payment Method Selector translations
    paymentMethod: "Payment Method",
    securePaymentOptions: "Secure payment options",
    recommended: "RECOMMENDED",
    instant: "Instant",
    free: "Free",
    turkeyTrustedPayment: "Turkey's trusted payment system",
    internationalSecurePayment: "International secure payment",
    developmentTestPayment: "Development test payment",
    turkeyMostTrustedPayment: "Turkey's Most Trusted Payment System",
    worldStandardSecurity: "World Standard Security",
    developmentTestMode: "Development Test Mode",
    securePayment: "3D Secure protected, PCI DSS certified secure payment. All major banks are supported.",
    stripeInternational: "International standard security, protected with 256-bit SSL encryption.",
    testModeDesc: "No real money transfer. Only for development and testing purposes.",
    securityFeatures: "🔒 Security Features",
    sslEncryption: "256-bit SSL Encryption",
    pciCompliance: "PCI DSS Compliance",
    escrowGuarantee: "Escrow Guarantee",
    threeDSecureVerification: "3D Secure Verification",
    commission: "commission",
    // Admin Panel
    totalUsers: "Total Users",
    totalDevices: "Total Devices",
    allUsers: "All Users",
    allDevices: "All Devices",
    user: "User",
    role: "Role",
    owner: "Owner",
    finder: "Finder",
    admin: "Admin",
    // Footer and Static Pages
    faq: "FAQ",
    terms: "Terms",
    privacy: "Privacy",
    contact: "Contact",
    downloadOnAppStore: "Download on the App Store",
    faqTitle: "Frequently Asked Questions",
    termsTitle: "Terms of Service",
    privacyTitle: "Privacy Policy",
    contactTitle: "Contact Us",
    contactIntro: "If you have any questions or need support, please reach out to us. We're here to help!",
    contactEmail: "info@ifoundanapple.com",
    faqIntro: "Find answers to common questions about our platform.",
    faqContent: {
      q1: "How does the matching process work?",
      a1: "Our system automatically and anonymously matches a lost device report from an owner with a found device report from a finder based on the device model and serial number. Both parties are notified instantly when a match is found.",
      q2: "Is my personal information safe?",
      a2: "Absolutely. Your privacy is our top priority. We never share your personal information (name, email, etc.) with the other party. All communication and transactions are handled securely through the platform.",
      q3: "How is the reward amount determined?",
      a3: "When reporting a lost device, the owner sets a reward amount. We also offer an AI-powered suggestion feature that recommends a fair reward based on the device's model and estimated second-hand market value.",
      q4: "What is the secure escrow system?",
      a4: "When a match is found, the owner pays the reward amount into our secure escrow system. We hold the payment safely until both parties confirm that the device has been successfully exchanged. This protects both the owner and the finder.",
      q5: "How does the physical exchange happen?",
      a5: "We provide secure exchange guidelines. We strongly recommend meeting in a safe public place (like a police station) or using a tracked, insured shipping service. The platform is designed to facilitate the return without you needing to share personal contact details.",
      q6: "What are the fees?",
      a6: "We deduct a small 5% service fee from the reward amount paid to the finder. This helps us cover operational costs, maintain the platform, and ensure a secure environment for everyone."
    },
    termsContent: `
      <h3 class="text-xl font-semibold mb-2">1. Introduction</h3>
      <p class="mb-4">Welcome to iFoundAnApple. These Terms of Service ("Terms") govern your use of our website and services. By registering an account or using our platform, you agree to be bound by these Terms.</p>
      <h3 class="text-xl font-semibold mb-2">2. The Service</h3>
      <p class="mb-4">iFoundAnApple provides a platform to connect owners of lost Apple devices with individuals who find them ("Finders"). We facilitate this connection through an anonymous matching system and manage a reward payment through a secure escrow process. We are not a party to the physical exchange of any device.</p>
      <h3 class="text-xl font-semibold mb-2">3. User Obligations</h3>
      <p class="mb-4">You agree to provide accurate and truthful information when registering a device. You must be the legal owner of any device you report as lost. You must have lawfully found any device you report as found. You agree not to use the service for any illegal or unauthorized purpose.</p>
      <h3 class="text-xl font-semibold mb-2">4. Payments and Fees</h3>
      <p class="mb-4">Device Owners agree to pay the stated reward amount into our escrow system upon a successful match. This payment is non-refundable once the exchange is completed. We charge a 5% service fee, which is deducted from the reward paid to the Finder. </p>
      <h3 class="text-xl font-semibold mb-2">5. Limitation of Liability</h3>
      <p class="mb-4">iFoundAnApple is a platform provider. We are not responsible for the condition of any returned device, nor are we liable for any issues arising from the physical exchange between users. We provide guidelines for a safe exchange, but the responsibility lies with the users.</p>
    `,
    privacyContent: `
      <h3 class="text-xl font-semibold mb-2">1. Information We Collect</h3>
      <p class="mb-4">We collect information you provide directly to us, such as your name, email address, and device details (model, serial number). For Finders, we also collect bank information solely for the purpose of transferring the reward.</p>
      <h3 class="text-xl font-semibold mb-2">2. How We Use Your Information</h3>
      <p class="mb-4">Your information is used to operate, maintain, and provide the features of our service. Specifically, we use device information for matching and your contact information for sending service-related notifications. We will never share your personal contact or identity information with other users.</p>
      <h3 class="text-xl font-semibold mb-2">3. Data Security</h3>
      <p class="mb-4">We use commercially reasonable physical, administrative, and technological safeguards to preserve the integrity and security of all information collected. However, no security system is impenetrable, and we cannot guarantee the security of our systems 100%.</p>
      <h3 class="text-xl font-semibold mb-2">4. Data Retention</h3>
      <p class="mb-4">We retain your data for as long as your account is active or as needed to provide you services. We may retain some information for compliance with legal obligations, to resolve disputes, and to enforce our agreements.</p>
      <h3 class="text-xl font-semibold mb-2">5. Your Rights (GDPR)</h3>
      <p class="mb-4">You have the right to access, rectify, or erase your personal data. You also have the right to restrict or object to certain processing. To exercise these rights, please contact us at <a href="mailto:privacy@ifoundanapple.com" class="text-brand-blue underline">privacy@ifoundanapple.app</a>.</p>
    `,
  },
  tr: {
    // Header & Nav
    appName: "iFoundAnApple",
    home: "Anasayfa",
    dashboard: "Panel",
    profile: "Profil",
    language: "Dil",
    login: "Giriş Yap",
    logout: "Çıkış Yap",
    register: "Kayıt Ol",
    reportFoundDevice: "Bulunan Cihazı Bildir",
    addLostDevice: "Kayıp Cihaz Ekle",
    adminDashboard: "Yönetici Paneli",
    notifications: {
      title: "Bildirimler",
      markAllAsRead: "Tümünü okundu olarak işaretle",
      noNotifications: "Yeni bildirim yok.",
      matchFoundOwner: "{model} cihazınız için eşleşme bulundu! İşlem gerekiyor.",
      matchFoundFinder: "Bildirdiğiniz {model} için eşleşme bulundu. Cihaz sahibinin ödemesi bekleniyor.",
      paymentReceivedFinder: "{model} için ödeme alındı! Lütfen takas işlemine devam edin.",
      exchangeConfirmationNeeded: "Karşı taraf {model} için takası onayladı. Lütfen tamamlamak için siz de onaylayın.",
      transactionCompletedOwner: "Başarılı! {model} cihazınız için takas tamamlandı.",
      transactionCompletedFinder: "Başarılı! {model} için ödülünüz yola çıktı.",
      deviceLostConfirmation: "Kayıp cihazınız ({model}) başarıyla eklendi.",
      deviceReportedConfirmation: "Bulunan cihazınız ({model}) başarıyla bildirildi.",
    },
    // Home Page
    heroTitle: "Apple cihazınızı mı kaybettiniz? Güvenle bulun.",
    heroSubtitle: "Sizi, cihazınızı bulan kişiyle anonim olarak bir araya getiriyoruz. Güvenli takas, adil bir ödül.",
    getStarted: "Başla",
    howItWorks: "Nasıl Çalışır?",
    step1Title: "Sahibi Kayıp Cihazı Bildirir",
    step1Desc: "iPhone, iPad veya Mac'inizi kaybettiyseniz, seri numarasıyla platformumuza kaydedin.",
    step2Title: "Bulan Kişi Cihazı Bildirir",
    step2Desc: "Bir cihaz bulan herkes, seri numarasını kullanarak anonim olarak bildirimde bulunabilir.",
    step3Title: "Güvenli Eşleşme ve Ödeme",
    step3Desc: "Sistemimiz cihazları otomatik olarak eşleştirir. Cihaz sahibi, güvenli ödeme sistemimize bir ödül yatırır.",
    step4Title: "Güvenli Takas ve Ödül",
    step4Desc: "Güvenli bir takas için yönergelerimizi izleyin. Takas onaylandığında, bulan kişi ödülü alır.",
    // Auth Pages
    loginTitle: "Hesabınıza Giriş Yapın",
    registerTitle: "Hesap Oluşturun",
    email: "E-posta",
    password: "Şifre",
    fullName: "Ad Soyad",
    firstName: "Ad",
    lastName: "Soyad",
    tcKimlikNo: "TC Kimlik Numarası",
    phoneNumber: "Telefon Numarası",
    address: "Adres",
    iban: "IBAN Numarası",
    iAmA: "Ben bir...",
    deviceOwner: "Cihaz Sahibiyim",
    deviceFinder: "Cihaz Bulanım",
    bankInfo: "Banka Hesap Bilgileri (ödül ödemesi için)",
    agreeToTerms: "{terms} ve {privacy} kabul ediyorum.",
    termsLink: "Hizmet Şartları'nı",
    privacyLink: "Gizlilik Politikası'nı",
    consentRequired: "Devam etmek için hizmet şartlarını ve gizlilik politikasını kabul etmelisiniz.",
    alreadyHaveAccount: "Zaten bir hesabınız var mı?",
    dontHaveAccount: "Hesabınız yok mu?",
    // Auth errors
    userAlreadyExists: "Bu e-posta adresiyle zaten bir kullanıcı mevcut.",
    invalidEmailOrPassword: "Geçersiz e-posta veya şifre.",
    orContinueWith: "Veya şununla devam edin",
    loginWithGoogle: "Google ile Giriş Yap",
    loginWithApple: "Apple ile Giriş Yap",
    processingPayment: "Ödeme işleniyor...",
    // Dashboard
    myDevices: "Cihazlarım",
    status: "Durum",
    model: "Model",
    serialNumber: "Seri Numarası",
    noDevicesReported: "Henüz herhangi bir cihaz bildiriminde bulunmadınız.",
    // Device Forms
    deviceModelForm: "Cihaz Modeli (örn. iPhone 15 Pro)",
    deviceSerialNumber: "Seri Numarası",
    deviceColor: "Renk",
    deviceDescription: "Ek detaylar (isteğe bağlı)",
    deviceInvoice: "Satın Alma Kanıtı (Fatura)",
    deviceInvoiceHelper: "İsteğe bağlı. Sahipliği doğrulamaya yardımcı olur.",
    submit: "Gönder",
    suggestDescription: "Yapay Zeka ile Açıklama Öner",
    suggestRewardDescription: "Yapay Zeka ile Ödül ve Açıklama Öner",
    gettingSuggestions: "Öneriler alınıyor...",
    aiSuggestion: "Yapay Zeka Önerisi",
    suggestedReward: "Önerilen Ödül",
    basedOnValue: "{value} tahmini değere göre",
    aiError: "Yapay zeka önerileri alınamadı. Lütfen detayları manuel olarak doldurun.",
    failedToAddDevice: "Cihaz eklenemedi. Lütfen tekrar deneyin.",
    failedToLoadDeviceModels: "Cihaz modelleri yüklenemedi.",
    loadingDeviceModels: "Cihaz modelleri yükleniyor...",
    noModelsAvailable: "Hiç model yok",
    selectModelFirst: "Önce bir cihaz modeli seçin",
    // Payment related
    paymentSummary: "Ödeme Özeti",
    paymentSummarySubtitle: "Güvenli ödeme ile cihazınızı geri alın",
    paymentConfirmation: "Ödeme Onayı",
    termsAgreement: "Kullanım Koşulları ve Gizlilik Politikası'nı okudum ve kabul ediyorum. Ödememin güvenli escrow sisteminde tutulacağını ve cihaz teslim edildikten sonra bulan kişiye aktarılacağını anlıyorum.",
    securePayment: "Güvenli Ödeme Yap",
    paymentProcessing: "Ödeme İşleniyor...",
    paymentSecurityNotice: "🔒 Bu ödeme SSL ile korunmaktadır. Kart bilgileriniz güvenli şekilde şifrelenir ve saklanmaz.",
    deviceModelNotSpecified: "Cihaz modeli belirtilmemiş",
    feeCalculationFailed: "Ücret hesaplaması yapılamadı",
    feeCalculationError: "Ücret hesaplaması sırasında bir hata oluştu",
    paymentLoginRequired: "Ödeme yapmak için giriş yapmalısınız",
    missingPaymentInfo: "Eksik ödeme bilgileri",
    acceptTermsRequired: "Lütfen kullanım koşullarını kabul edin",
    paymentInitiated: "Ödeme başarıyla başlatıldı!",
    paymentFailed: "Ödeme işlemi başarısız",
    paymentError: "Ödeme işlemi sırasında bir hata oluştu",
    calculatingFees: "Ücret hesaplanıyor...",
    errorOccurred: "Hata Oluştu",
    // Cargo related
    cargoTracking: "Kargo Takip",
    refresh: "Yenile",
    detailedTracking: "Detaylı Takip",
    currentStatus: "Mevcut Durum",
    trackingInfo: "Takip Bilgileri",
    anonymousId: "Anonim Kimlik",
    trackingNumber: "Takip No",
    yourRole: "Rolünüz",
    sender: "Gönderici",
    receiver: "Alıcı",
    deviceInfo: "Cihaz Bilgileri",
    estimatedDelivery: "Tahmini Teslimat",
    cargoHistory: "Kargo Geçmişi",
    deliveryCompleted: "Teslimat Tamamlandı",
    confirmDeliveryMessage: "Cihazı aldığınızı onaylamak için butona tıklayın",
    confirmDelivery: "Teslimatı Onayla",
    cargoSupport: "Kargo Desteği: Kargo ile ilgili sorunlar için kargo firmasının müşteri hizmetlerini arayabilir veya anonim kimlik kodunuz ile bizimle iletişime geçebilirsiniz.",
    cargoLoadingInfo: "Kargo bilgileri yükleniyor...",
    cargoTrackingNotFound: "Kargo takip bilgileri bulunamadı",
    trackingInfoLoadError: "Takip bilgileri yüklenirken hata oluştu",
    tryAgain: "Tekrar Dene",
    noCargoMovement: "Henüz kargo hareketi bulunmuyor",
    // Payment Flow & Match Payment translations
    matchPayment: "Eşleşme Ödemesi",
    matchPaymentSubtitle: "Cihazınızı güvenle geri alın",
    deviceRecoveryPayment: "Cihaz Kurtarma Ödemesi",
    deviceRecoverySubtitle: "Kayıp cihazınızı güvenle geri alın",
    feeDetails: "Ücret Detayları",
    payment: "Ödeme",
    stepIndicatorModel: "Cihaz Modeli",
    stepIndicatorFees: "Ücret Detayları", 
    stepIndicatorPayment: "Ödeme",
    matchInfo: "Eşleşme Bilgileri",
    deviceModelLabel: "Cihaz Modeli:",
    finderReward: "Bulan Kişiye Ödül:",
    statusLabel: "Durum:",
    matchFound: "Eşleşme Bulundu",
    proceedToPayment: "Ödemeye Geç →",
    customRewardAmount: "Özel Ödül Miktarı",
    customRewardDescription: "İsteğe bağlı: Bulan kişiye daha yüksek ödül vermek istiyorsanız buradan belirleyebilirsiniz.",
    defaultReward: "Varsayılan: {amount} TL",
    customRewardSet: "✓ Özel ödül miktarı: {amount} TL",
    changeDeviceModel: "← Cihaz Modelini Değiştir",
    backToFeeDetails: "← Ücret Detaylarına Dön",
    finderRewardLabel: "Bulan kişiye ödül:",
    cargoLabel: "Kargo:",
    serviceFeeLabel: "Hizmet bedeli:",
    gatewayFeeLabel: "Ödeme komisyonu:",
    totalLabel: "TOPLAM:",
    redirectingToDashboard: "Panele yönlendiriliyor...",
    // Fee Breakdown Card translations
    category: "Kategori",
    matchedDevice: "Eşleşen Cihaz",
    matchedWithFinder: "Bulan kişi ile eşleştiniz",
    ifoundanappleFeeBreakdown: "iFoundAnApple Ücret Dağılımı",
    finderRewardDesc: "Cihazı bulan kişiye ödenecek",
    cargoFeeDesc: "Güvenli teslimat için",
    serviceFeeDesc: "Platform komisyonu",
    paymentCommissionDesc: "Güvenli ödeme için",
    totalPayment: "Toplam Ödemeniz",
    paymentDue: "Şimdi ödenecek tutar",
    finderNetPayment: "Bulan Kişiye Net Ödeme",
    afterServiceFeeDeduction: "Hizmet bedeli düşüldükten sonra",
    securePaymentSystem: "Güvenli Emanet (Escrow) Sistemi",
    escrowSystemDesc: "Ödemeniz güvenli escrow hesabımızda tutulur ve cihaz teslim edilip onaylanana kadar karşı tarafa aktarılmaz. Güvenli ödeme güvencesiyle işlem ücreti hariç iptal ve iade hakkınız saklıdır.",
    // Payment Method Selector translations
    paymentMethod: "Ödeme Yöntemi",
    securePaymentOptions: "Güvenli ödeme seçenekleri",
    recommended: "ÖNERİLEN",
    instant: "Anında",
    free: "Ücretsiz",
    turkeyTrustedPayment: "Türkiye'nin güvenilir ödeme sistemi",
    internationalSecurePayment: "Uluslararası güvenli ödeme",
    developmentTestPayment: "Geliştirme amaçlı test ödemesi",
    turkeyMostTrustedPayment: "Türkiye'nin En Güvenilir Ödeme Sistemi",
    worldStandardSecurity: "Dünya Standartında Güvenlik",
    developmentTestMode: "Geliştirme Test Modu",
    securePayment: "3D Secure ile korumalı, PCI DSS sertifikalı güvenli ödeme. Tüm büyük bankalar desteklenir.",
    stripeInternational: "Uluslararası standartlarda güvenlik, 256-bit SSL şifreleme ile korunur.",
    testModeDesc: "Gerçek para transferi olmaz. Sadece geliştirme ve test amaçlıdır.",
    securityFeatures: "🔒 Güvenlik Özellikleri",
    sslEncryption: "256-bit SSL Şifreleme",
    pciCompliance: "PCI DSS Uyumluluk",
    escrowGuarantee: "Escrow Güvencesi",
    threeDSecureVerification: "3D Secure Doğrulama",
    commission: "komisyon",
    // Statuses
    Lost: "Kayıp",
    Reported: "Bildirildi",
    Matched: "Eşleşti! Cihaz sahibi ödemesi bekleniyor.",
    PaymentPending: "Eşleşti! Lütfen ödemeye devam edin.",
    PaymentComplete: "Ödeme Tamamlandı! Takasa devam edin.",
    ExchangePending: "Takas Bekleniyor",
    Completed: "Tamamlandı",
     // Device Detail Page
    deviceDetails: "Cihaz Detayları",
    matchFoundDevice: "Cihazınızla bir eşleşme bulundu!",
    reward: "Ödül",
    makePaymentSecurely: "Ödemeyi Güvenle Yap",
    waitingForOwnerPayment: "Kayıp sahibinin ödeme yapması bekleniyor.",
    matchFoundTitle: "Eşleşme Bulundu!",
    paymentReceived: "Ödeme Alındı!",
    paymentSecureExchange: "Ödemeniz güvende tutuluyor. Lütfen takası tamamlamak ve onaylamak için talimatları izleyin.",
    finderPaymentSecureExchange: "Ödeme güvende tutuluyor. Lütfen takası tamamlamak ve onaylamak için talimatları izleyin.",
    confirmExchange: "Takası Onaylıyorum",
    waitingForOtherParty: "Diğer tarafın onayı bekleniyor...",
    secureExchangeGuidelines: "Güvenli Takas Yönergeleri",
    guideline1: "Karakol veya iyi aydınlatılmış bir kafe gibi güvenli, halka açık bir yerde buluşmayı ayarlayın.",
    guideline2: "Alternatif olarak, cihazı takas etmek için takip edilebilir ve sigortalı bir kargo hizmeti kullanın.",
    guideline3: "Kişisel iletişim bilgilerinizi paylaşmayın. Gerekirse yalnızca platformumuz üzerinden iletişim kurun.",
    guideline4: "Cihazı başarıyla takas ettikten sonra aşağıdaki onay düğmesine basın.",
    transactionCompleted: "İşlem Başarıyla Tamamlandı!",
    transactionCompletedDesc: "Ödül, bulan kişinin hesabına aktarılmıştır. iFoundAnApple'ı kullandığınız için teşekkür ederiz.",
    serviceFeeNotice: "İşletme maliyetlerini karşılamak için ödülden %5'lik bir hizmet bedeli kesilmiştir.",
    backToDashboard: "Panele Geri Dön",
    goBack: "Geri Dön",
    loading: "Yükleniyor...",
    loadingPageContent: "Sayfa yüklenirken lütfen bekleyin...",
    viewInvoice: "Faturayı Görüntüle",
    // Admin Panel
    totalUsers: "Toplam Kullanıcı",
    totalDevices: "Toplam Cihaz",
    allUsers: "Tüm Kullanıcılar",
    allDevices: "Tüm Cihazlar",
    user: "Kullanıcı",
    role: "Rol",
    owner: "Sahip",
    finder: "Bulan",
    admin: "Yönetici",
    // Footer and Static Pages
    faq: "SSS",
    terms: "Şartlar",
    privacy: "Gizlilik",
    contact: "İletişim",
    downloadOnAppStore: "App Store'dan İndir",
    faqTitle: "Sıkça Sorulan Sorular",
    termsTitle: "Hizmet Şartları",
    privacyTitle: "Gizlilik Politikası",
    contactTitle: "Bize Ulaşın",
    contactIntro: "Herhangi bir sorunuz veya desteğe ihtiyacınız olursa, lütfen bize ulaşın. Yardım etmek için buradayız!",
    contactEmail: "info@ifoundanapple.com",
    faqIntro: "Platformumuz hakkında sık sorulan soruların cevaplarını bulun.",
     faqContent: {
      q1: "Eşleştirme süreci nasıl işliyor?",
      a1: "Sistemimiz, bir cihaz sahibinin kayıp cihaz raporu ile bir bulan kişinin bulduğu cihaz raporunu, cihaz modeli ve seri numarasına göre otomatik ve anonim olarak eşleştirir. Bir eşleşme bulunduğunda her iki taraf da anında bilgilendirilir.",
      q2: "Kişisel bilgilerim güvende mi?",
      a2: "Kesinlikle. Gizliliğiniz bizim önceliğimizdir. Kişisel bilgilerinizi (isim, e-posta vb.) asla diğer tarafla paylaşmayız. Tüm iletişim ve işlemler platform üzerinden güvenli bir şekilde yürütülür.",
      q3: "Ödül miktarı nasıl belirleniyor?",
      a3: "Kayıp bir cihazı bildirirken, sahibi bir ödül miktarı belirler. Ayrıca, cihazın modeline ve tahmini ikinci el piyasa değerine göre adil bir ödül öneren yapay zeka destekli bir öneri özelliği de sunuyoruz.",
      q4: "Güvenli emanet (escrow) sistemi nedir?",
      a4: "Bir eşleşme bulunduğunda, cihaz sahibi ödemeyi güvenli emanet sistemimize yapar. Cihazın başarıyla takas edildiği her iki tarafça onaylanana kadar ödemeyi güvenli bir şekilde tutarız. Bu, hem sahibini hem de bulanı korur.",
      q5: "Fiziksel takas nasıl gerçekleşiyor?",
      a5: "Kimlik bilgilerinizi saklayarak kargo firması cihazı; bulan kişiden sahibine ulaştırmaktadır.",
      q6: "Ücretler nelerdir?",
      a6: "Platformu sürdürebilmemiz ve herkes için güvenli bir ortam sağlayabilmek için operasyonel maliyetlerimiz ile güvenli ödeme sistemi ve kargo hizmetleri kesintilerini içerir."
    },
    termsContent: `
      <h1 class="text-2xl font-bold mb-4 text-gray-800">HİZMET ŞARTLARI</h1>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Son Güncelleme: 14 Ekim 2025</strong></p>

      <hr class="my-6 border-gray-300">

      <h2 class="text-xl font-semibold mb-3 text-gray-700 mt-6">1. SÖZLEŞME KAPSAMI</h2>

      <p class="mb-4 leading-relaxed">Bu şartlar, <strong class="font-semibold">iFoundAnApple</strong> platformu ile kullanıcılar arasındaki hukuki ilişkiyi düzenler.</p>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Platform Sahibi:</strong> iFoundAnApple</p>
      <p class="mb-4 leading-relaxed"><strong class="font-semibold">İletişim:</strong> <a href="mailto:support@ifoundanapple.com" class="text-blue-600 hover:text-blue-800">support@ifoundanapple.com</a></p>
      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Hukuk:</strong> Türkiye Cumhuriyeti kanunları</p>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">1.1 Kabulün Anlamı</h3>

      <p class="mb-4 leading-relaxed">Platforma kayıt olarak, hesap oluşturarak veya hizmetleri kullanarak bu Şartları kabul etmiş sayılırsınız.</p>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">1.2 Değişiklik Hakkı</h3>

      <p class="mb-4 leading-relaxed">Bu Şartları <strong class="font-semibold">7 gün önceden</strong> bildirimle değiştirebiliriz. Değişiklikler:</p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">E-posta ile bildirilir</li>
        <li class="mb-1">Web sitesinde duyurulur</li>
        <li class="mb-1">Uygulama içi bildirim gönderilir</li>
      </ul>

      <hr class="my-6 border-gray-300">

      <h2 class="text-xl font-semibold mb-3 text-gray-700 mt-6">2. PLATFORMUN HİZMETLERİ</h2>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">2.1 Sunduğumuz Hizmetler</h3>

      <p class="mb-4 leading-relaxed"><span class="text-green-600">✅</span> <strong class="font-semibold">Kayıp Cihaz Kaydı:</strong> Apple cihazlarını sisteme kaydetme</p>
      <p class="mb-4 leading-relaxed"><span class="text-green-600">✅</span> <strong class="font-semibold">Bulunan Cihaz Bildirimi:</strong> Bulduğunuz cihazları bildirme</p>
      <p class="mb-4 leading-relaxed"><span class="text-green-600">✅</span> <strong class="font-semibold">Otomatik Eşleştirme:</strong> Seri numarası bazlı eşleştirme</p>
      <p class="mb-4 leading-relaxed"><span class="text-green-600">✅</span> <strong class="font-semibold">Anonim Sistem:</strong> Kimlik bilgileriniz gizli tutulur</p>
      <p class="mb-4 leading-relaxed"><span class="text-green-600">✅</span> <strong class="font-semibold">Güvenli Ödeme:</strong> PCI-DSS uyumlu güvenli ödeme</p>
      <p class="mb-4 leading-relaxed"><span class="text-green-600">✅</span> <strong class="font-semibold">Escrow Sistemi:</strong> Para güvende tutulur</p>
      <p class="mb-4 leading-relaxed"><span class="text-green-600">✅</span> <strong class="font-semibold">Kargo Organizasyonu:</strong> Kargo şirketi seçimi ve takip</p>
      <p class="mb-4 leading-relaxed"><span class="text-green-600">✅</span> <strong class="font-semibold">Bildirim Sistemi:</strong> Gerçek zamanlı güncellemeler</p>
      <p class="mb-4 leading-relaxed"><span class="text-green-600">✅</span> <strong class="font-semibold">AI Destekli Öneriler:</strong> Google Gemini ile ödül önerileri</p>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">2.2 Sunmadığımız Hizmetler</h3>

      <p class="mb-4 leading-relaxed"><span class="text-red-600">❌</span> <strong class="font-semibold">Kargo Teslimatı:</strong> Kargo hizmetini biz sağlamıyoruz</p>
      <p class="mb-4 leading-relaxed"><span class="text-red-600">❌</span> <strong class="font-semibold">Fiziksel Buluşma:</strong> Tarafları fiziksel olarak buluşturmuyoruz</p>
      <p class="mb-4 leading-relaxed"><span class="text-red-600">❌</span> <strong class="font-semibold">Cihaz Onarımı:</strong> Teknik destek vermiyoruz</p>
      <p class="mb-4 leading-relaxed"><span class="text-red-600">❌</span> <strong class="font-semibold">Hukuki Temsil:</strong> Avukatlık hizmeti sunmuyoruz</p>
      <p class="mb-4 leading-relaxed"><span class="text-red-600">❌</span> <strong class="font-semibold">Garanti:</strong> Cihazın durumu veya çalışması garantilenmez</p>

      <hr class="my-6 border-gray-300">

      <h2 class="text-xl font-semibold mb-3 text-gray-700 mt-6">3. KAYIT VE HESAP YÖNETİMİ</h2>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">3.1 Kayıt Şartları</h3>

      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">18 yaş ve üzeri olmalısınız</li>
        <li class="mb-1">Geçerli e-posta adresi gereklidir</li>
        <li class="mb-1">Doğru bilgiler vermelisiniz</li>
        <li class="mb-1">Türkiye veya AB ülkelerinde ikamet etmelisiniz</li>
      </ul>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">3.2 Kayıt Yöntemleri</h3>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">E-posta ile Kayıt:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Ad, soyad, e-posta, doğum tarihi ve şifre gereklidir</li>
        <li class="mb-1">E-posta doğrulaması zorunludur</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">OAuth ile Kayıt (Google / Apple):</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Üçüncü taraf kimlik doğrulama</li>
        <li class="mb-1">OAuth sağlayıcısının şartlarına tabi</li>
      </ul>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">3.3 Hesap Güvenliği</h3>

      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Şifrenizi güçlü tutun ve paylaşmayın</li>
        <li class="mb-1">Hesap bilgilerinizi kimseyle paylaşmayın</li>
        <li class="mb-1">Şüpheli aktiviteleri derhal bildirin</li>
        <li class="mb-1">Her kullanıcı sadece <strong class="font-semibold">1 hesap</strong> açabilir</li>
      </ul>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">3.4 Yasak Hesap Faaliyetleri</h3>

      <p class="mb-4 leading-relaxed">Aşağıdaki durumlar hesap kapatmaya yol açar:</p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Sahte kimlik bilgileri kullanma</li>
        <li class="mb-1">Birden fazla hesap açma (aynı kişi için)</li>
        <li class="mb-1">Başkasının hesabını kullanma</li>
        <li class="mb-1">Bot veya otomatik araçlar kullanma</li>
        <li class="mb-1">Sistemi manipüle etmeye çalışma</li>
      </ul>

      <hr class="my-6 border-gray-300">

      <h2 class="text-xl font-semibold mb-3 text-gray-700 mt-6">4. CİHAZ SAHİBİNİN SORUMLULUKLARI</h2>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">4.1 Yasal Sahiplik</h3>

      <p class="mb-4 leading-relaxed">Kayıp cihaz eklerken:</p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Cihazın yasal sahibi olduğunuzu beyan edersiniz</li>
        <li class="mb-1">Sahiplik belgesi (fatura, garanti belgesi) sunabilmelisiniz</li>
        <li class="mb-1">Çalıntı veya sahte cihaz bildirimi yapmadığınızı taahhüt edersiniz</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Önemli:</strong> Cihaz kaydı tamamen ücretsizdir. Ödeme yalnızca cihazınız bulunduğunda ve takas süreci başlatıldığında talep edilir.</p>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">4.2 Doğru Bilgi Verme</h3>

      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Cihaz modeli, seri numarası ve özelliklerini doğru girmelisiniz</li>
        <li class="mb-1">Cihaz durumunu gerçeğe uygun bildirmelisiniz</li>
        <li class="mb-1">Kayıp tarihi ve konumu mümkün olduğunca doğru belirtmelisiniz</li>
      </ul>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">4.3 Ödeme Yükümlülüğü</h3>

      <p class="mb-4 leading-relaxed">Eşleşme gerçekleştiğinde:</p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Belirlenen ödül tutarını ödemeyi taahhüt edersiniz</li>
        <li class="mb-1"><strong class="font-semibold">48 saat içinde</strong> ödeme yapmalısınız</li>
        <li class="mb-1">Ücretlendirme şu kalemleri kapsar:</li>
      </ul>
      <p class="mb-4 leading-relaxed">  - iFoundAnApple Hizmet Bedeli</p>
      <p class="mb-4 leading-relaxed">  - Ödeme Sağlayıcı Komisyonu (Güvenli ödeme altyapısı maliyeti)</p>
      <p class="mb-4 leading-relaxed">  - Kargo Bedeli (Cihazınızın size güvenle ulaştırılması için)</p>
      <p class="mb-4 leading-relaxed">  - Cihazı Bulan Kişiye Verilecek Ödül (Nazik katkısı için teşekkür niteliğinde)</p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Ödeme yapıldıktan sonra iptal edemezsiniz (geçerli sebepler hariç)</li>
      </ul>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">4.4 Kargo Teslim Alma</h3>

      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Kargonun teslim edilmesi için doğru adres bilgisi vermelisiniz</li>
        <li class="mb-1">Kargoyu teslim aldığınızda kontrol etmelisiniz</li>
        <li class="mb-1"><strong class="font-semibold">7 gün içinde</strong> "Teslim Aldım, Onayla" butonuna basmalısınız</li>
        <li class="mb-1">Onay vermezseniz 7 gün sonra otomatik onay verilir</li>
      </ul>

      <hr class="my-6 border-gray-300">

      <h2 class="text-xl font-semibold mb-3 text-gray-700 mt-6">5. CİHAZI BULAN KİŞİNİN SORUMLULUKLARI</h2>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">5.1 Dürüst Bulgu</h3>

      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Cihazı yasalara uygun şekilde bulduğunuzu beyan edersiniz</li>
        <li class="mb-1">Cihazı çalmadığınızı veya yasadışı yollarla edinmediğinizi taahhüt edersiniz</li>
        <li class="mb-1">Bulduğunuz cihazı hasarsız ve eksiksiz teslim etmeyi kabul edersiniz</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Önemli:</strong> Bulunan cihaz kaydı tamamen ücretsizdir. Bu medeni ve onurlu davranış, bizim için paha biçilemez bir değer taşır.</p>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">5.2 Doğru Bilgi Verme</h3>

      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Cihaz bilgilerini doğru girmelisiniz</li>
        <li class="mb-1">Bulunma tarihi ve konumunu gerçeğe uygun bildirmelisiniz</li>
        <li class="mb-1">Cihazın durumu hakkında şeffaf olmalısınız</li>
      </ul>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">5.3 Kargo Gönderimi</h3>

      <p class="mb-4 leading-relaxed">Ödeme tamamlandıktan sonra:</p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1"><strong class="font-semibold">5 iş günü içinde</strong> cihazı kargoya vermelisiniz</li>
        <li class="mb-1">Kargo şirketi seçip takip numarasını sisteme girmelisiniz</li>
        <li class="mb-1">Cihazı orijinal haliyle, hasarsız göndermelisiniz</li>
        <li class="mb-1">Cihaza müdahale etmemeyi (şifre kırma, parça değişimi) taahhüt edersiniz</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Kargo Ücreti:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Kargo ücreti (25 TL) cihaz sahibi tarafından ödenmiştir</li>
        <li class="mb-1">Kargo şirketine "ödemeli gönderi" olarak teslim edebilirsiniz</li>
        <li class="mb-1">Veya önce siz ödeyip sonra ödül ile birlikte geri alabilirsiniz</li>
      </ul>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">5.4 Ödül ve IBAN/Banka Bilgileri</h3>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Ödül Belirleme:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Size iletilecek ödül, bulunan cihazın piyasa değeri üzerinden belirli ve adil bir oran dahilinde belirlenir</li>
        <li class="mb-1">Bu sayede, gösterdiğiniz çabanın ve örnek davranışın karşılığında küçük bir hediye almanızı sağlıyoruz</li>
        <li class="mb-1">iFoundAnApple, cihazın güvenli bir şekilde sahibine ulaşmasını ve sizin ödülünüzü eksiksiz almanızı sağlayacak güvenli bir takas süreci sunar</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">IBAN/Banka Bilgileri:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Ödül ödemesi için geçerli bir IBAN sağlamalısınız</li>
        <li class="mb-1">IBAN'ın size ait olduğunu beyan edersiniz</li>
        <li class="mb-1">Vergi yükümlülüklerinizi yerine getirmeyi kabul edersiniz</li>
      </ul>

      <hr class="my-6 border-gray-300">

      <h2 class="text-xl font-semibold mb-3 text-gray-700 mt-6">6. ÖDEMELER, ÜCRETLER VE ESCROW SİSTEMİ</h2>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">6.1 Ödül Sistemi</h3>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Ödül Belirleme:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Cihaz sahibi ödül tutarını özgürce belirler</li>
        <li class="mb-1">Minimum: 500 TL, Maksimum: 50.000 TL</li>
        <li class="mb-1">AI öneri sistemi kullanılabilir (isteğe bağlı, Google Gemini)</li>
        <li class="mb-1">Ödül, cihazın piyasa değerinin makul bir oranı olmalıdır</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Ödeme Zamanlaması:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Eşleşme gerçekleştiğinde <strong class="font-semibold">48 saat içinde</strong> ödeme yapılmalıdır</li>
        <li class="mb-1">Ödeme yapılmazsa eşleşme iptal edilir</li>
        <li class="mb-1">Ödeme escrow sistemine alınır ve güvende bekletilir</li>
      </ul>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">6.2 Hizmet Bedelleri</h3>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Cihaz Sahibi için Ücretler (v5.0 Formülü):</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1"><strong class="font-semibold">Gross Tutar</strong>: Müşteriden alınan toplam tutar (İyzico komisyonu dahil)</li>
        <li class="mb-1"><strong class="font-semibold">İyzico Komisyonu</strong>: Gross tutarın <strong class="font-semibold">%3.43'ü</strong> (otomatik kesilir)</li>
        <li class="mb-1"><strong class="font-semibold">Net Tutar</strong>: İyzico komisyonu düşüldükten sonra kalan tutar</li>
        <li class="mb-1"><strong class="font-semibold">Kargo Ücreti</strong>: <strong class="font-semibold">250 TL</strong> (sabit)</li>
        <li class="mb-1"><strong class="font-semibold">Bulan Kişi Ödülü</strong>: Net tutarın <strong class="font-semibold">%20'si</strong></li>
        <li class="mb-1"><strong class="font-semibold">Hizmet Bedeli</strong>: Net tutar - kargo - ödül (geriye kalan)</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Örnek Hesaplama (Cihaz Sahibi) - v5.0:</strong></p>
      <pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4"><code class="text-sm">Gross Tutar:              2.000 TL (müşteriden alınan toplam)
├── İyzico Komisyonu:       68.60 TL (%3.43) - Otomatik kesilir
└── Net Tutar:            1.931.40 TL (emanet sisteminde tutulan)
    ├── Kargo Ücreti:       250.00 TL (sabit)
    ├── Bulan Kişi Ödülü:   386.28 TL (%20)
    └── Hizmet Bedeli:    1.295.12 TL (geriye kalan)
─────────────────────────────────────────
TOPLAM: 68.60 + 250 + 386.28 + 1.295.12 = 2.000.00 TL ✅</code></pre>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Bulan Kişi için Ücretler:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1"><strong class="font-semibold">Net Alacak</strong>: Bulan kişiye ödül (net tutarın %20'si)</li>
        <li class="mb-1">Transfer ücreti: Banka transferinde uygulanabilir (yaklaşık 5-10 TL)</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Örnek Hesaplama (Bulan Kişi) - v5.0:</strong></p>
      <pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4"><code class="text-sm">Net Tutar:              1.931.40 TL
Bulan Kişi Ödülü (%20):   386.28 TL
─────────────────────────────────
NET ALACAK:               386.28 TL</code></pre>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">6.3 Escrow (Emanet) Sistemi</h3>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Nasıl Çalışır (v5.0):</strong></p>
      <p class="mb-4 leading-relaxed">1. Eşleşme gerçekleşir</p>
      <p class="mb-4 leading-relaxed">2. Cihaz sahibi <strong class="font-semibold">gross tutarı</strong> öder (48 saat içinde)</p>
      <p class="mb-4 leading-relaxed">3. İyzico komisyonu (%3.43) <strong class="font-semibold">otomatik kesilir</strong></p>
      <p class="mb-4 leading-relaxed">4. <strong class="font-semibold">Net tutar</strong> escrow hesabında <strong class="font-semibold">güvende tutulur</strong> (status: "held")</p>
      <p class="mb-4 leading-relaxed">5. Bulan kişi kargoyu gönderir (5 iş günü içinde)</p>
      <p class="mb-4 leading-relaxed">6. Cihaz sahibi kargoyu alır ve <strong class="font-semibold">"Teslim Aldım, Onayla"</strong> butonuna basar</p>
      <p class="mb-4 leading-relaxed">7. <strong class="font-semibold">Net tutar</strong> şu şekilde dağıtılır:</p>
      <p class="mb-4 leading-relaxed">   - Kargo ücreti (250 TL) → Kargo firması</p>
      <p class="mb-4 leading-relaxed">   - Bulan kişi ödülü (%20) → Bulan kişinin IBAN'ına</p>
      <p class="mb-4 leading-relaxed">   - Hizmet bedeli (geriye kalan) → Platform</p>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Escrow Süresi (v5.0):</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Maksimum bekleme: 30 gün</li>
        <li class="mb-1">Cihaz sahibi onayı: Anında <strong class="font-semibold">net tutar</strong> serbest bırakılır</li>
        <li class="mb-1">Onay verilmezse: <strong class="font-semibold">7 gün sonra otomatik onay</strong></li>
        <li class="mb-1">30 gün içinde teslimat olmazsa: <strong class="font-semibold">Gross tutar</strong> otomatik iade (İyzico komisyonu kesintili)</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Onay Süreci:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Sadece <strong class="font-semibold">cihaz sahibi</strong> onay verir (tek taraflı onay)</li>
        <li class="mb-1">Bulan kişi onay vermez, sadece kargoyu gönderir</li>
        <li class="mb-1">İki taraflı onay sistemi <strong class="font-semibold">yoktur</strong></li>
      </ul>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">6.4 İptal ve İade Politikası</h3>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">İptal Hakkı:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Ödeme yapıldıktan sonra cayma hakkınız yoktur (hizmet başladığı için)</li>
        <li class="mb-1">Kargo gönderilmeden önce karşılıklı anlaşmayla iptal mümkündür</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">İade Koşulları:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Bulan kişi 5 iş günü içinde kargo göndermezse: <strong class="font-semibold">Tam iade</strong></li>
        <li class="mb-1">Teslim edilen cihaz farklıysa: <strong class="font-semibold">Tam iade</strong> + bulan kişiye yaptırım</li>
        <li class="mb-1">Teknik sorunlardan kaynaklanan iptal: <strong class="font-semibold">Tam iade</strong></li>
        <li class="mb-1">Karşılıklı anlaşma ile iptal: <strong class="font-semibold">Tam iade</strong></li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">İade Kesintisi (v5.0):</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Takas sürecinde işlem iptali talep etmeniz halinde, <strong class="font-semibold">İyzico komisyonu (%3.43) kesintili</strong> olarak iade edilir</li>
        <li class="mb-1"><strong class="font-semibold">Gross tutar</strong> ödenmiş, <strong class="font-semibold">net tutar</strong> escrow'da tutulmuşsa: Net tutar tamamen iade edilir</li>
        <li class="mb-1"><strong class="font-semibold">Kargo süreci başlamadan</strong> iptal yapılmalıdır</li>
        <li class="mb-1">İptal sonrası: Gross tutar - İyzico komisyonu = İade tutarı</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">İade Süreci:</strong></p>
      <p class="mb-4 leading-relaxed">1. İptal/iade talebi oluşturulur</p>
      <p class="mb-4 leading-relaxed">2. Platform inceleme yapar (1-3 iş günü)</p>
      <p class="mb-4 leading-relaxed">3. Karar verilir</p>
      <p class="mb-4 leading-relaxed">4. İade onaylanırsa <strong class="font-semibold">5-10 iş günü</strong> içinde hesaba geçer</p>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">6.5 Ödeme Yöntemleri</h3>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Kabul Edilen Ödeme Yöntemleri:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Kredi kartı (Visa, Mastercard, American Express)</li>
        <li class="mb-1">Banka kartı (debit card)</li>
        <li class="mb-1">Sanal kart</li>
        <li class="mb-1"><strong class="font-semibold">Apple Pay</strong> (iPhone, iPad, Mac kullanıcıları için)</li>
        <li class="mb-1"><strong class="font-semibold">3D Secure zorunlu</strong> (güvenlik için)</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Ödeme Güvenliği:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">PCI-DSS Level 1 sertifikalı güvenli ödeme altyapısı</li>
        <li class="mb-1">SSL/TLS şifreleme</li>
        <li class="mb-1">3D Secure doğrulama</li>
        <li class="mb-1">Tokenization (kart bilgileri bizde saklanmaz)</li>
      </ul>

      <hr class="my-6 border-gray-300">

      <h2 class="text-xl font-semibold mb-3 text-gray-700 mt-6">7. KARGO SÜRECİ VE TESLİMAT</h2>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">7.1 Platform'un Rolü</h3>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Önemli:</strong> Platform, kargo teslimatının tarafı değildir. Kargo tamamen kargo şirketleri tarafından gerçekleştirilir.</p>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Platform Sağladıkları:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Kargo şirketi seçenekleri (Aras, MNG, Yurtiçi, PTT)</li>
        <li class="mb-1">Kargo takip sistemi</li>
        <li class="mb-1">Teslimat adresi paylaşımı (anonim sistem)</li>
        <li class="mb-1">Kargo durum bildirimleri</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Platform Sağlamadıkları:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Fiziksel kargo teslimat hizmeti</li>
        <li class="mb-1">Kargo kurye organizasyonu</li>
        <li class="mb-1">Kargo sigortası (kargo şirketinden alınmalı)</li>
        <li class="mb-1">Kargo kayıp/hasar garantisi</li>
      </ul>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">7.2 Kargo Şirketleri</h3>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Desteklenen Kargo Firmaları:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1"><strong class="font-semibold">Aras Kargo</strong></li>
        <li class="mb-1"><strong class="font-semibold">MNG Kargo</strong></li>
        <li class="mb-1"><strong class="font-semibold">Yurtiçi Kargo</strong></li>
        <li class="mb-1"><strong class="font-semibold">PTT Kargo</strong></li>
      </ul>

      <p class="mb-4 leading-relaxed">Cihazı bulan kişi bu firmalardan birini seçer ve sistemden aldığı kargo numarası ile cihazı firmaya teslim eder.</p>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">7.3 Anonim Kimlik Sistemi</h3>

      <p class="mb-4 leading-relaxed">Gizliliğinizi korumak için:</p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Bulan kişiye anonim kod verilir: <strong class="font-semibold">FND-XXX123</strong></li>
        <li class="mb-1">Cihaz sahibine anonim kod verilir: <strong class="font-semibold">OWN-YYY456</strong></li>
        <li class="mb-1">Kargo gönderi bilgilerinde bu kodlar kullanılır</li>
        <li class="mb-1">Gerçek kimlikler kargo şirketiyle paylaşılmaz</li>
      </ul>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">7.4 Kargo Güvenliği Önerileri</h3>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Gönderen İçin (Bulan Kişi):</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Cihazın ve paketin fotoğrafını çekin (teslimat öncesi)</li>
        <li class="mb-1">Takip numarasını mutlaka kaydedin</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Alan İçin (Cihaz Sahibi):</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Paketi teslim alırken kontrol edin</li>
        <li class="mb-1">Hasar varsa hemen tutanak tutturun</li>
        <li class="mb-1">Paket açılışını video/fotoğraf ile belgeleyin</li>
        <li class="mb-1">Cihazın seri numarasını doğrulayın</li>
      </ul>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">7.5 Kargo Takibi</h3>

      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Platform üzerinden kargo durumunu anlık takip edebilirsiniz</li>
        <li class="mb-1">Otomatik durum güncellemeleri alırsınız:</li>
      </ul>
      <p class="mb-4 leading-relaxed">  - Kargo oluşturuldu</p>
      <p class="mb-4 leading-relaxed">  - Kargo toplandı</p>
      <p class="mb-4 leading-relaxed">  - Kargodaki şubede</p>
      <p class="mb-4 leading-relaxed">  - Dağıtıma çıktı</p>
      <p class="mb-4 leading-relaxed">  - Teslim edildi</p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Tahmini teslimat tarihi gösterilir</li>
      </ul>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">7.6 Teslimat Sorunları</h3>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Kargo Kaybolursa:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Hemen kargo şirketiyle iletişime geçin</li>
        <li class="mb-1">Platform destek ekibine bildirin (<a href="mailto:support@ifoundanapple.com" class="text-blue-600 hover:text-blue-800">support@ifoundanapple.com</a>)</li>
        <li class="mb-1">Kargo şirketinin sigortası devreye girer</li>
        <li class="mb-1">Platform arabulucu rolü üstlenebilir</li>
        <li class="mb-1">Escrow'daki para cihaz sahibine iade edilir</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Hasarlı Teslimat:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Kargoyu teslim alırken kontrol edin</li>
        <li class="mb-1">Hasar varsa <strong class="font-semibold">teslim almadan</strong> kargo görevlisine tutanak tutturun</li>
        <li class="mb-1">Platform'u hemen bilgilendirin</li>
        <li class="mb-1">Fotoğraf/video kanıtı sağlayın</li>
        <li class="mb-1">İade süreci başlatılır</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Yanlış/Farklı Cihaz:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Seri numarasını kontrol edin</li>
        <li class="mb-1">Farklıysa <strong class="font-semibold">onaylama</strong>yın</li>
        <li class="mb-1">Destek ekibine bildirin</li>
        <li class="mb-1">Tam iade işlemi başlatılır</li>
        <li class="mb-1">Bulan kişiye yaptırım uygulanır</li>
      </ul>

      <hr class="my-6 border-gray-300">

      <h2 class="text-xl font-semibold mb-3 text-gray-700 mt-6">8. ANONİMLİK VE GİZLİLİK</h2>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">8.1 Kimlik Gizliliği</h3>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Eşleşme Öncesi:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Hiçbir kullanıcı bilgisi paylaşılmaz</li>
        <li class="mb-1">Tamamen anonim sistem</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Eşleşme Sonrası:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1"><strong class="font-semibold">Kimlik:</strong> GİZLİ kalır</li>
        <li class="mb-1"><strong class="font-semibold">E-posta:</strong> GİZLİ kalır</li>
        <li class="mb-1"><strong class="font-semibold">Telefon:</strong> Sadece kargo firması ile teslimat için paylaşılır</li>
        <li class="mb-1"><strong class="font-semibold">Adres:</strong> Sadece kargo firması ile teslimat için paylaşılır</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Kargo İçin Paylaşılan Bilgiler:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Ad-soyad</li>
        <li class="mb-1">Teslimat adresi</li>
        <li class="mb-1">Telefon numarası</li>
        <li class="mb-1">Anonim gönderici/alıcı kodu (FND-XXX, OWN-XXX)</li>
      </ul>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">8.2 İletişim</h3>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Platform İçi Bildirimler:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">E-posta bildirimleri</li>
        <li class="mb-1">Uygulama içi bildirimler</li>
        <li class="mb-1">SMS bildirimleri (kritik durumlar için)</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Direkt İletişim:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Kullanıcılar arasında <strong class="font-semibold">direkt mesajlaşma yoktur</strong></li>
        <li class="mb-1">Tüm iletişim platform üzerinden yönetilir</li>
      </ul>

      <hr class="my-6 border-gray-300">

      <h2 class="text-xl font-semibold mb-3 text-gray-700 mt-6">9. PLATFORM SORUMLULUKLARI VE SINIRLAMALAR</h2>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">9.1 Platform Sorumluluklarımız</h3>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Sağladığımız Hizmetler İçin:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Platform altyapısını çalışır halde tutmak</li>
        <li class="mb-1">Veri güvenliğini sağlamak</li>
        <li class="mb-1">Ödeme sistemini güvenli işletmek</li>
        <li class="mb-1">Escrow'u doğru yönetmek</li>
        <li class="mb-1">Müşteri desteği sunmak</li>
        <li class="mb-1">Dolandırıcılık önlemleri almak</li>
        <li class="mb-1">Yasal yükümlülüklere uymak</li>
      </ul>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">9.2 Sorumluluk Sınırlamaları</h3>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Platform SORUMLU DEĞİLDİR:</strong></p>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Cihaz ve Teslimat:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Teslim edilen cihazın gerçek durumu</li>
        <li class="mb-1">Cihazın çalışır/kullanılabilir olması</li>
        <li class="mb-1">Fiziksel hasarlar veya eksiklikler</li>
        <li class="mb-1">Cihazın orijinal olup olmadığı</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Kargo:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Kargo şirketlerinin hataları, gecikmeler, kayıplar</li>
        <li class="mb-1">Hasarlı teslimat</li>
        <li class="mb-1">Kargo sigortası (kullanıcı sorumluluğu)</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Kullanıcı Davranışları:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Kullanıcıların verdikleri yanlış/eksik bilgiler</li>
        <li class="mb-1">Dolandırıcılık girişimleri (tespit edemediğimiz)</li>
        <li class="mb-1">Sahiplik ihtilafları</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Üçüncü Taraf Hizmetler:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Ödeme sistemi kesintileri</li>
        <li class="mb-1">OAuth sağlayıcılarının sorunları</li>
        <li class="mb-1">İnternet servis sağlayıcılarının kesintileri</li>
      </ul>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">9.3 Tazminat Sınırlaması</h3>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Azami Tazminat:</strong></p>
      <p class="mb-4 leading-relaxed">Herhangi bir durumda platform'un sorumluluğu, ilgili işlemde alınan <strong class="font-semibold">hizmet bedeli tutarı</strong> ile sınırlıdır.</p>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Örnek:</strong> 5.000 TL ödüllü işlemde platform bedeli 150 TL ise, azami tazminat tutarı <strong class="font-semibold">150 TL</strong>'dir.</p>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Kapsam Dışı Zararlar:</strong></p>
      <p class="mb-4 leading-relaxed">Platform aşağıdaki zararlardan sorumlu tutulamaz:</p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Dolaylı zararlar</li>
        <li class="mb-1">Kar kaybı</li>
        <li class="mb-1">İtibar kaybı</li>
        <li class="mb-1">Manevi zararlar</li>
        <li class="mb-1">Veri kaybı</li>
        <li class="mb-1">İş kaybı</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">İstisna:</strong> Platform'un kasıtlı veya ağır kusuru varsa bu sınırlamalar uygulanmaz.</p>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">9.4 Hizmet Garantisi ve Kesintiler</h3>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Garanti Verilmeyen Hususlar:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Kesintisiz hizmet</li>
        <li class="mb-1">Hatasız çalışma</li>
        <li class="mb-1">Mutlaka eşleşme bulunması</li>
        <li class="mb-1">Belirli bir sürede sonuç alınması</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Planlı Bakımlar:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Önceden duyurulur (en az 24 saat)</li>
        <li class="mb-1">Genellikle gece saatlerinde yapılır</li>
        <li class="mb-1">Maksimum 4 saat sürer</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Acil Bakımlar:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Önceden duyurulamayabilir</li>
        <li class="mb-1">Güvenlik veya kritik hatalar için</li>
        <li class="mb-1">En kısa sürede tamamlanır</li>
      </ul>

      <hr class="my-6 border-gray-300">

      <h2 class="text-xl font-semibold mb-3 text-gray-700 mt-6">10. YASAK FAALİYETLER</h2>

      <p class="mb-4 leading-relaxed">Aşağıdaki faaliyetler <strong class="font-semibold">kesinlikle yasaktır:</strong></p>

      <p class="mb-4 leading-relaxed"><span class="text-red-600">❌</span> <strong class="font-semibold">Dolandırıcılık:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Sahte bilgi verme</li>
        <li class="mb-1">Çalıntı cihaz bildirimi</li>
        <li class="mb-1">Başkasının cihazını sahiplenmek</li>
        <li class="mb-1">Sahte seri numarası</li>
      </ul>

      <p class="mb-4 leading-relaxed"><span class="text-red-600">❌</span> <strong class="font-semibold">Hesap İhlalleri:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Sahte kimlik kullanma</li>
        <li class="mb-1">Birden fazla hesap açma</li>
        <li class="mb-1">Başkasının hesabını kullanma</li>
        <li class="mb-1">Bot veya otomatik araçlar</li>
      </ul>

      <p class="mb-4 leading-relaxed"><span class="text-red-600">❌</span> <strong class="font-semibold">Sistem Manipülasyonu:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Platform dışı anlaşma yapma</li>
        <li class="mb-1">Sistemi atlatmaya çalışma</li>
        <li class="mb-1">Escrow'u atlatma girişimi</li>
      </ul>

      <p class="mb-4 leading-relaxed"><span class="text-red-600">❌</span> <strong class="font-semibold">Diğer:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Taciz, tehdit</li>
        <li class="mb-1">Fikri mülkiyet ihlali</li>
        <li class="mb-1">Virüs, zararlı yazılım</li>
        <li class="mb-1">Veri scraping</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Yaptırım:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Hesap kapatma</li>
        <li class="mb-1">Ödeme iptali</li>
        <li class="mb-1">Yasal işlem başlatma</li>
        <li class="mb-1">Hak edilen tutarların iadesi</li>
      </ul>

      <hr class="my-6 border-gray-300">

      <h2 class="text-xl font-semibold mb-3 text-gray-700 mt-6">11. HESAP ASKIYA ALMA VE SONLANDIRMA</h2>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">11.1 Platform Tarafından Kapatma</h3>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Derhal Kapatma Sebepleri:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Dolandırıcılık veya sahte bilgi</li>
        <li class="mb-1">Çalıntı cihaz bildirimi</li>
        <li class="mb-1">Sahte kimlik</li>
        <li class="mb-1">Ödeme dolandırıcılığı</li>
        <li class="mb-1">Yasadışı faaliyetler</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Uyarı Sonrası Kapatma:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Sürekli yanlış bilgi girme</li>
        <li class="mb-1">Platform kurallarını ihlal</li>
        <li class="mb-1">Ödeme yükümlülüğünü yerine getirmeme (tekrarlayan)</li>
        <li class="mb-1">Kargo göndermeme (geçerli sebep olmadan)</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Askıya Alma:</strong></p>
      <p class="mb-4 leading-relaxed">Şüpheli durumlar araştırılırken hesap geçici olarak askıya alınabilir (maksimum 30 gün).</p>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">11.2 Kullanıcı Tarafından Hesap Kapatma</h3>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Kendi Hesabınızı Kapatma:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Profil ayarlarından "Hesabı Sil" seçeneğini kullanabilirsiniz</li>
        <li class="mb-1">Devam eden işlemler varsa tamamlanana kadar kapatma yapılamaz</li>
        <li class="mb-1">Escrow'da bekleyen ödemeler varsa sonuçlanmalıdır</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Hesap Kapatma Sonuçları:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Kişisel verileriniz <strong class="font-semibold">30 gün içinde</strong> silinir</li>
        <li class="mb-1">İşlem geçmişiniz anonimleştirilir</li>
        <li class="mb-1">Kapatılan hesap geri açılamaz</li>
        <li class="mb-1">Mali kayıtlar 10 yıl saklanır (yasal zorunluluk, anonim)</li>
      </ul>

      <hr class="my-6 border-gray-300">

      <h2 class="text-xl font-semibold mb-3 text-gray-700 mt-6">12. MÜCBIR SEBEPLER</h2>

      <p class="mb-4 leading-relaxed">Aşağıdaki mücbir sebep durumlarında platform yükümlülüklerinden sorumlu tutulamaz:</p>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Doğal Afetler:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Deprem, sel, yangın, fırtına</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Toplumsal Olaylar:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Savaş, terör, ayaklanma, sokağa çıkma yasağı</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Teknik Sorunlar:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">İnternet altyapı kesintileri (ISP sorunları)</li>
        <li class="mb-1">Elektrik kesintisi</li>
        <li class="mb-1">Sunucu sağlayıcı (Supabase) kesintileri</li>
        <li class="mb-1">Ödeme sistemleri kesintileri</li>
        <li class="mb-1">DDoS saldırıları, siber saldırılar</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Yasal Değişiklikler:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Ani kanun değişiklikleri, yasaklar, düzenlemeler</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Pandemi/Sağlık Krizi:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Salgın hastalık durumları</li>
        <li class="mb-1">Resmi kısıtlamalar</li>
      </ul>

      <p class="mb-4 leading-relaxed">Mücbir sebep durumunda kullanıcılar derhal bilgilendirilir ve alternatif çözümler sunulur.</p>

      <hr class="my-6 border-gray-300">

      <h2 class="text-xl font-semibold mb-3 text-gray-700 mt-6">13. UYUŞMAZLIK ÇÖZÜMÜ</h2>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">13.1 İletişim ve Destek</h3>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">İlk Adım - Destek Ekibimiz:</strong></p>
      <p class="mb-4 leading-relaxed">Herhangi bir sorun yaşarsanız önce destek ekibimizle iletişime geçin:</p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1"><strong class="font-semibold">E-posta:</strong> <a href="mailto:support@ifoundanapple.com" class="text-blue-600 hover:text-blue-800">support@ifoundanapple.com</a></li>
        <li class="mb-1"><strong class="font-semibold">Yanıt Süresi:</strong> 24-48 saat</li>
        <li class="mb-1"><strong class="font-semibold">Çözüm Süresi:</strong> 5 iş günü (ortalama)</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Arabuluculuk:</strong></p>
      <p class="mb-4 leading-relaxed">Kullanıcılar arasında uyuşmazlık varsa, platform arabulucu rol üstlenebilir (isteğe bağlı).</p>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">13.2 Uygulanacak Hukuk</h3>

      <p class="mb-4 leading-relaxed">İşbu Sözleşme, <strong class="font-semibold">Türkiye Cumhuriyeti kanunlarına</strong> tabidir.</p>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">13.3 Yetkili Mahkeme ve İcra Daireleri</h3>

      <p class="mb-4 leading-relaxed">Bu Sözleşmeden doğan uyuşmazlıklarda:</p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1"><strong class="font-semibold">Türkiye'deki kullanıcılar için:</strong> İstanbul (Çağlayan) Mahkemeleri ve İcra Daireleri yetkilidir</li>
        <li class="mb-1"><strong class="font-semibold">AB'deki kullanıcılar için:</strong> Kullanıcının yerleşim yeri mahkemeleri de yetkilidir (GDPR gereği)</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Tüketici Hakları:</strong></p>
      <p class="mb-4 leading-relaxed">Tüketiciler, Tüketicinin Korunması Hakkında Kanun uyarınca Tüketici Hakem Heyetleri ve Tüketici Mahkemelerine başvurabilir.</p>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Tüketici Hakem Heyeti:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Web: <a href="https://tuketicihakemleri.ticaret.gov.tr" class="text-blue-600 hover:text-blue-800" target="_blank">https://tuketicihakemleri.ticaret.gov.tr</a></li>
        <li class="mb-1">Elektronik başvuru sistemi mevcuttur</li>
      </ul>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">13.4 Alternatif Uyuşmazlık Çözümü</h3>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Online Uyuşmazlık Çözümü (ODR):</strong></p>
      <p class="mb-4 leading-relaxed">AB'de bulunan tüketiciler, AB ODR platformunu kullanabilir:</p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Platform: <a href="https://ec.europa.eu/consumers/odr" class="text-blue-600 hover:text-blue-800" target="_blank">https://ec.europa.eu/consumers/odr</a></li>
        <li class="mb-1">İletişim: <a href="mailto:info@ifoundanapple.com" class="text-blue-600 hover:text-blue-800">info@ifoundanapple.com</a></li>
      </ul>

      <hr class="my-6 border-gray-300">

      <h2 class="text-xl font-semibold mb-3 text-gray-700 mt-6">14. FİKRİ MÜLKİYET HAKLARI</h2>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">14.1 Platform'un Hakları</h3>

      <p class="mb-4 leading-relaxed">Platform'da yer alan tüm içerik, tasarım, logo, yazılım kodu, algoritmalar iFoundAnApple'ın telif hakkı altındadır.</p>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Yasak İşlemler:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">İçerikleri kopyalama veya çoğaltma</li>
        <li class="mb-1">Logoyu izinsiz kullanma</li>
        <li class="mb-1">Kaynak kodunu tersine mühendislik</li>
        <li class="mb-1">Veri scraping (otomatik veri toplama)</li>
        <li class="mb-1">API'yi izinsiz kullanma</li>
      </ul>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">14.2 Kullanıcı İçeriği</h3>

      <p class="mb-4 leading-relaxed">Platforma yüklediğiniz içerik (fotoğraflar, açıklamalar) sizin fikri mülkiyetinizdir.</p>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Platforma Verdiğiniz Lisans:</strong></p>
      <p class="mb-4 leading-relaxed">İçerik yükleyerek, platforma aşağıdaki hakları verirsiniz:</p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">İçeriği platformda gösterme</li>
        <li class="mb-1">İçeriği depolama ve işleme</li>
        <li class="mb-1">İçeriği yedekleme</li>
        <li class="mb-1">Teknik olarak optimize etme (sıkıştırma vb.)</li>
      </ul>

      <p class="mb-4 leading-relaxed">Platform, içeriğinizi başka amaçlarla kullanmaz, satmaz veya paylaşmaz.</p>

      <hr class="my-6 border-gray-300">

      <h2 class="text-xl font-semibold mb-3 text-gray-700 mt-6">15. ÇEŞİTLİ HÜKÜMLER</h2>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">15.1 Bildirimlerin Yapılması</h3>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Platform'dan Size:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">E-posta (kayıtlı e-posta adresiniz)</li>
        <li class="mb-1">Uygulama içi bildirim</li>
        <li class="mb-1">SMS (acil durumlar için)</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Sizden Platform'a:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1"><strong class="font-semibold">Genel:</strong> <a href="mailto:info@ifoundanapple.com" class="text-blue-600 hover:text-blue-800">info@ifoundanapple.com</a></li>
        <li class="mb-1"><strong class="font-semibold">Hukuki:</strong> <a href="mailto:legal@ifoundanapple.com" class="text-blue-600 hover:text-blue-800">legal@ifoundanapple.com</a></li>
        <li class="mb-1"><strong class="font-semibold">Güvenlik:</strong> <a href="mailto:security@ifoundanapple.com" class="text-blue-600 hover:text-blue-800">security@ifoundanapple.com</a></li>
      </ul>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">15.2 Sözleşmenin Bütünlüğü</h3>

      <p class="mb-4 leading-relaxed">Bu Şartlar, taraflar arasındaki tüm anlaşmayı oluşturur.</p>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">15.3 Kısmi Geçersizlik</h3>

      <p class="mb-4 leading-relaxed">Şartların herhangi bir hükmü geçersiz sayılırsa, diğer hükümler geçerliliğini korur.</p>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">15.4 Devir Yasağı</h3>

      <p class="mb-4 leading-relaxed">Kullanıcılar, bu sözleşmeden doğan hak ve yükümlülüklerini üçüncü kişilere devredemez.</p>

      <p class="mb-4 leading-relaxed">Platform, işin devri, birleşme veya satın alma durumunda haklarını devredebilir.</p>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">15.5 Elektronik Kayıtlar</h3>

      <p class="mb-4 leading-relaxed">Platform'un elektronik kayıtları, HMK 297 uyarınca kesin delil teşkil eder.</p>

      <hr class="my-6 border-gray-300">

      <h2 class="text-xl font-semibold mb-3 text-gray-700 mt-6">16. İLETİŞİM BİLGİLERİ</h2>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">iFoundAnApple</strong></p>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Genel Destek:</strong></p>
      <p class="mb-4 leading-relaxed">E-posta: <a href="mailto:info@ifoundanapple.com" class="text-blue-600 hover:text-blue-800">info@ifoundanapple.com</a></p>
      <p class="mb-4 leading-relaxed">Yanıt Süresi: 24-48 saat</p>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Hukuki İşler:</strong></p>
      <p class="mb-4 leading-relaxed">E-posta: <a href="mailto:legal@ifoundanapple.com" class="text-blue-600 hover:text-blue-800">legal@ifoundanapple.com</a></p>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Güvenlik:</strong></p>
      <p class="mb-4 leading-relaxed">E-posta: <a href="mailto:security@ifoundanapple.com" class="text-blue-600 hover:text-blue-800">security@ifoundanapple.com</a></p>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Web Sitesi:</strong></p>
      <p class="mb-4 leading-relaxed"><a href="https://ifoundanapple.com" class="text-blue-600 hover:text-blue-800" target="_blank">https://ifoundanapple.com</a></p>

      <hr class="my-6 border-gray-300">

      <h2 class="text-xl font-semibold mb-3 text-gray-700 mt-6">17. KABUL VE ONAY</h2>

      <p class="mb-4 leading-relaxed"><span class="text-green-600">✅</span> Bu Hizmet Şartlarını okudum, anladım ve kabul ediyorum.</p>

      <p class="mb-4 leading-relaxed"><span class="text-green-600">✅</span> 18 yaşından büyük olduğumu ve yasal ehliyete sahip olduğumu beyan ederim.</p>

      <p class="mb-4 leading-relaxed"><span class="text-green-600">✅</span> Platformu kullanarak, bu Şartlara ve Gizlilik Politikasına bağlı kalmayı kabul ediyorum.</p>

      <p class="mb-4 leading-relaxed"><span class="text-green-600">✅</span> E-posta, SMS ve uygulama içi bildirimlerin gönderilmesine izin veriyorum.</p>

      <hr class="my-6 border-gray-300">

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Son Güncelleme:</strong> 14 Ekim 2025</p>
      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Versiyon:</strong> 2.0</p>
      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Geçerlilik:</strong> Türkiye ve Avrupa Birliği</p>

      <hr class="my-6 border-gray-300">

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">© 2025 iFoundAnApple. Tüm hakları saklıdır.</strong></p>
    `,
    privacyContent: `
      <h1 class="text-2xl font-bold mb-4 text-gray-800">GİZLİLİK POLİTİKASI</h1>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Son Güncelleme: 14 Ekim 2025</strong></p>

      <hr class="my-6 border-gray-300">

      <h2 class="text-xl font-semibold mb-3 text-gray-700 mt-6">1. VERİ SORUMLUSU</h2>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">iFoundAnApple</strong></p>
      <p class="mb-4 leading-relaxed">E-posta: <a href="mailto:privacy@ifoundanapple.com" class="text-blue-600 hover:text-blue-800">privacy@ifoundanapple.com</a></p>
      <p class="mb-4 leading-relaxed">Web: <a href="https://ifoundanapple.com" class="text-blue-600 hover:text-blue-800" target="_blank">https://ifoundanapple.com</a></p>

      <p class="mb-4 leading-relaxed">Bu politika, KVKK ve GDPR uyarınca hazırlanmıştır.</p>

      <hr class="my-6 border-gray-300">

      <h2 class="text-xl font-semibold mb-3 text-gray-700 mt-6">2. TOPLANAN KİŞİSEL VERİLER</h2>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">2.1 Kayıt ve Kimlik Doğrulama</h3>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">E-posta ile Kayıt:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Ad, soyad</li>
        <li class="mb-1">E-posta adresi</li>
        <li class="mb-1">Şifre (şifreli saklanır)</li>
        <li class="mb-1">Doğum tarihi</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">OAuth ile Giriş (Google/Apple):</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">OAuth sağlayıcısından alınan temel profil bilgileri</li>
        <li class="mb-1">Ad, soyad, e-posta</li>
        <li class="mb-1">Şifre oluşturmanıza gerek yoktur</li>
      </ul>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">2.2 Cihaz Bilgileri</h3>

      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Cihaz modeli (iPhone 15 Pro, MacBook Air vb.)</li>
        <li class="mb-1">Seri numarası</li>
        <li class="mb-1">Cihaz rengi ve açıklaması</li>
        <li class="mb-1">Kayıp/bulunma tarihi ve konumu</li>
        <li class="mb-1">Fatura/sahiplik belgesi (görsel - silinebilir şekilde)</li>
      </ul>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">2.3 Ödeme ve Finansal Bilgiler</h3>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Ödeme İşlemleri:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Kredi/banka kartı bilgileri güvenli ödeme sağlayıcısı tarafından işlenir (PCI-DSS uyumlu)</li>
        <li class="mb-1">Kart bilgileriniz bizim sunucularımızda <strong class="font-semibold">saklanmaz</strong></li>
        <li class="mb-1">İşlem geçmişi ve tutarlar kaydedilir</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Banka Bilgileri:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">IBAN numarası (ödül transferi için)</li>
        <li class="mb-1">Hesap sahibi adı</li>
      </ul>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">2.4 Profil ve İletişim Bilgileri</h3>

      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">TC Kimlik Numarası (isteğe bağlı, yüksek tutarlı işlemler için)</li>
        <li class="mb-1">Telefon numarası</li>
        <li class="mb-1">Teslimat adresi (kargo için)</li>
      </ul>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">2.5 Otomatik Toplanan Veriler</h3>

      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">IP adresi</li>
        <li class="mb-1">Tarayıcı ve cihaz bilgileri</li>
        <li class="mb-1">Oturum bilgileri</li>
        <li class="mb-1">Platform kullanım istatistikleri</li>
      </ul>

      <hr class="my-6 border-gray-300">

      <h2 class="text-xl font-semibold mb-3 text-gray-700 mt-6">3. VERİLERİN KULLANIM AMAÇLARI</h2>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">3.1 Hizmet Sunumu</h3>

      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Kayıp ve bulunan cihazları eşleştirme (seri numarası bazlı)</li>
        <li class="mb-1">Kullanıcı hesap yönetimi</li>
        <li class="mb-1">Kargo organizasyonu ve takibi</li>
        <li class="mb-1">Bildirim gönderme</li>
      </ul>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">3.2 Ödeme ve Escrow İşlemleri</h3>

      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Güvenli ödeme işleme</li>
        <li class="mb-1">Escrow (emanet) sistemini işletme</li>
        <li class="mb-1">Ödül ödemelerini IBAN'a transfer etme</li>
        <li class="mb-1">Mali kayıtların tutulması</li>
      </ul>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">3.3 AI Destekli Öneriler</h3>

      <p class="mb-4 leading-relaxed">Bu özellik isteğe bağlıdır</p>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">3.4 Güvenlik</h3>

      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Dolandırıcılık önleme</li>
        <li class="mb-1">Kimlik doğrulama</li>
        <li class="mb-1">Audit log tutma</li>
        <li class="mb-1">Güvenlik ihlali tespiti</li>
      </ul>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">3.5 Yasal Uyumluluk</h3>

      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">KVKK ve GDPR gerekliliklerine uyum</li>
        <li class="mb-1">Vergi mevzuatı yükümlülükleri (10 yıl kayıt tutma)</li>
        <li class="mb-1">Mahkeme kararları ve yasal süreçler</li>
      </ul>

      <hr class="my-6 border-gray-300">

      <h2 class="text-xl font-semibold mb-3 text-gray-700 mt-6">4. VERİLERİN PAYLAŞIMI</h2>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">4.1 Hizmet Sağlayıcılar</h3>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Supabase (Backend Altyapısı):</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Veritabanı, kimlik doğrulama, dosya depolama</li>
        <li class="mb-1">SOC 2 Type II, GDPR uyumlu</li>
        <li class="mb-1">Veri konumu: ABD/AB</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Ödeme Sağlayıcısı:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Ödeme işleme, 3D Secure, escrow</li>
        <li class="mb-1">PCI-DSS Level 1 sertifikalı</li>
        <li class="mb-1">Türkiye merkezli</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Google/Apple (OAuth Kimlik Doğrulama):</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Üçüncü taraf giriş (isteğe bağlı)</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Google Gemini (AI Önerileri):</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Sadece cihaz modeli bilgisi paylaşılır</li>
        <li class="mb-1">Kişisel kimlik bilgisi paylaşılmaz</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Kargo Şirketleri (Aras, MNG, Yurtiçi, PTT):</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Teslimat adresi ve telefon</li>
        <li class="mb-1">Anonim gönderici/alıcı kodları (FND-XXX, OWN-XXX)</li>
        <li class="mb-1">Gerçek kimlikler gizli tutulur</li>
      </ul>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">4.2 Kullanıcılar Arası Paylaşım</h3>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">ÖNEMLİ:</strong> Kimliğiniz, e-postanız ve telefon numaranız <strong class="font-semibold">asla</strong> diğer kullanıcılarla paylaşılmaz.</p>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Eşleşme Sonrası:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Karşı tarafın kimliği anonim kalır</li>
        <li class="mb-1">Sadece "Eşleşme bulundu" bildirimi gönderilir</li>
        <li class="mb-1">Kargo için sadece teslimat adresi paylaşılır (ad-soyad ve adres)</li>
      </ul>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">4.3 Yasal Zorunluluk</h3>

      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Mahkeme kararı veya celp</li>
        <li class="mb-1">Kolluk kuvvetleri talepleri</li>
        <li class="mb-1">Vergi daireleri (mali kayıtlar için)</li>
        <li class="mb-1">KVKK Kurumu talepleri</li>
      </ul>

      <hr class="my-6 border-gray-300">

      <h2 class="text-xl font-semibold mb-3 text-gray-700 mt-6">5. VERİ GÜVENLİĞİ VE SAKLAMA</h2>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">5.1 Güvenlik Önlemleri</h3>

      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">SSL/TLS şifreleme (HTTPS)</li>
        <li class="mb-1">Şifre hash'leme (bcrypt)</li>
        <li class="mb-1">Veritabanı şifreleme</li>
        <li class="mb-1">Row Level Security (RLS) politikaları</li>
        <li class="mb-1">3D Secure ödeme doğrulama</li>
        <li class="mb-1">İki faktörlü kimlik doğrulama (2FA) desteği</li>
        <li class="mb-1">Düzenli güvenlik denetimleri</li>
      </ul>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">5.2 Saklama Süreleri</h3>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Aktif Hesaplar:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Hesabınız aktif olduğu sürece saklanır</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Kapalı Hesaplar:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Hesap kapatma sonrası 30 gün içinde silinir</li>
        <li class="mb-1">Mali kayıtlar 10 yıl saklanır (yasal zorunluluk)</li>
        <li class="mb-1">Anonim istatistikler süresiz saklanabilir</li>
      </ul>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">İşlem Kayıtları:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Mali işlemler: 10 yıl</li>
        <li class="mb-1">Kargo kayıtları: 2 yıl</li>
        <li class="mb-1">Audit loglar: 5 yıl</li>
      </ul>

      <hr class="my-6 border-gray-300">

      <h2 class="text-xl font-semibold mb-3 text-gray-700 mt-6">6. KULLANICI HAKLARI (KVKK & GDPR)</h2>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">6.1 Haklarınız</h3>

      <p class="mb-4 leading-relaxed"><span class="text-green-600">✅</span> <strong class="font-semibold">Bilgi Talep Etme:</strong> Verilerinizin işlenip işlenmediğini öğrenme</p>
      <p class="mb-4 leading-relaxed"><span class="text-green-600">✅</span> <strong class="font-semibold">Erişim Hakkı:</strong> Verilerinizin bir kopyasını alma</p>
      <p class="mb-4 leading-relaxed"><span class="text-green-600">✅</span> <strong class="font-semibold">Düzeltme Hakkı:</strong> Yanlış bilgileri düzeltme</p>
      <p class="mb-4 leading-relaxed"><span class="text-green-600">✅</span> <strong class="font-semibold">Silme Hakkı:</strong> Verilerinizi silme (unutulma hakkı)</p>
      <p class="mb-4 leading-relaxed"><span class="text-green-600">✅</span> <strong class="font-semibold">İtiraz Etme:</strong> Veri işleme faaliyetlerine itiraz</p>
      <p class="mb-4 leading-relaxed"><span class="text-green-600">✅</span> <strong class="font-semibold">Veri Taşınabilirliği:</strong> Verilerinizi başka bir platforma aktarma</p>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">6.2 Başvuru Yöntemi</h3>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">E-posta:</strong> <a href="mailto:privacy@ifoundanapple.com" class="text-blue-600 hover:text-blue-800">privacy@ifoundanapple.com</a></p>
      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Konu:</strong> KVKK/GDPR Başvurusu</p>
      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Yanıt Süresi:</strong> 30 gün (en geç)</p>

      <h3 class="text-lg font-medium mb-2 text-gray-600 mt-4">6.3 Şikayet Hakkı</h3>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Türkiye:</strong></p>
      <p class="mb-4 leading-relaxed">Kişisel Verileri Koruma Kurumu - <a href="https://www.kvkk.gov.tr" class="text-blue-600 hover:text-blue-800" target="_blank">https://www.kvkk.gov.tr</a></p>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">AB:</strong></p>
      <p class="mb-4 leading-relaxed">İlgili ülkenin Veri Koruma Otoritesi</p>

      <hr class="my-6 border-gray-300">

      <h2 class="text-xl font-semibold mb-3 text-gray-700 mt-6">7. ÇOCUKLARIN GİZLİLİĞİ</h2>

      <p class="mb-4 leading-relaxed">Platform <strong class="font-semibold">18 yaş altı</strong> kullanıcılara yönelik değildir. 18 yaş altı kişilerden bilerek veri toplamıyoruz.</p>

      <hr class="my-6 border-gray-300">

      <h2 class="text-xl font-semibold mb-3 text-gray-700 mt-6">8. ÇEREZLER</h2>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Kullandığımız Çerezler:</strong></p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Oturum yönetimi (zorunlu)</li>
        <li class="mb-1">Dil tercihleri (fonksiyonel)</li>
        <li class="mb-1">Güvenlik (zorunlu)</li>
      </ul>

      <p class="mb-4 leading-relaxed">Çerezleri tarayıcı ayarlarınızdan yönetebilirsiniz.</p>

      <hr class="my-6 border-gray-300">

      <h2 class="text-xl font-semibold mb-3 text-gray-700 mt-6">9. ULUSLARARASI VERİ TRANSFERİ</h2>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Supabase:</strong> ABD/AB veri merkezleri (GDPR uyumlu, SCC)</p>
      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Ödeme Sağlayıcısı:</strong> Uluslararası</p>
      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Google:</strong> Küresel (OAuth ve AI için)</p>

      <p class="mb-4 leading-relaxed">Tüm transferler KVKK ve GDPR hükümlerine uygun yapılır.</p>

      <hr class="my-6 border-gray-300">

      <h2 class="text-xl font-semibold mb-3 text-gray-700 mt-6">10. DEĞİŞİKLİKLER VE GÜNCELLEMELER</h2>

      <p class="mb-4 leading-relaxed">Bu Gizlilik Politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler yapıldığında:</p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        <li class="mb-1">Web sitesinde duyuru yayınlarız</li>
        <li class="mb-1">E-posta ile bildirim göndeririz</li>
        <li class="mb-1">"Son Güncelleme" tarihi değiştirilir</li>
      </ul>

      <p class="mb-4 leading-relaxed">Güncellemeler yayınlandığı tarihte yürürlüğe girer.</p>

      <hr class="my-6 border-gray-300">

      <h2 class="text-xl font-semibold mb-3 text-gray-700 mt-6">11. İLETİŞİM</h2>

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Genel:</strong> <a href="mailto:info@ifoundanapple.com" class="text-blue-600 hover:text-blue-800">info@ifoundanapple.com</a></p>
      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Gizlilik:</strong> <a href="mailto:privacy@ifoundanapple.com" class="text-blue-600 hover:text-blue-800">privacy@ifoundanapple.com</a></p>
      <p class="mb-4 leading-relaxed"><strong class="font-semibold">Güvenlik:</strong> <a href="mailto:security@ifoundanapple.com" class="text-blue-600 hover:text-blue-800">security@ifoundanapple.com</a></p>

      <hr class="my-6 border-gray-300">

      <p class="mb-4 leading-relaxed"><strong class="font-semibold">© 2025 iFoundAnApple - Versiyon 2.0</strong></p>
    `,
  },
  fr: {
    // Header & Nav
    appName: "iFoundAnApple",
    home: "Accueil",
    dashboard: "Tableau de bord",
    profile: "Profil",
    language: "Langue",
    login: "Connexion",
    logout: "Déconnexion",
    register: "S'inscrire",
    reportFoundDevice: "Signaler un appareil trouvé",
    addLostDevice: "Ajouter un appareil perdu",
    adminDashboard: "Panneau d'administration",
    notifications: {
      title: "Notifications",
      markAllAsRead: "Tout marquer comme lu",
      noNotifications: "Aucune nouvelle notification.",
      matchFoundOwner: "Correspondance trouvée pour votre {model} ! Action requise.",
      matchFoundFinder: "Correspondance trouvée pour le {model} que vous avez signalé. En attente du paiement du propriétaire.",
      paymentReceivedFinder: "Paiement reçu pour {model} ! Veuillez procéder à l'échange.",
      exchangeConfirmationNeeded: "L'autre partie a confirmé l'échange pour {model}. Veuillez confirmer pour finaliser.",
      transactionCompletedOwner: "Succès ! L'échange de votre {model} est terminé.",
      transactionCompletedFinder: "Succès ! La récompense pour {model} est en route.",
      deviceLostConfirmation: "Votre appareil perdu ({model}) a été ajouté avec succès.",
      deviceReportedConfirmation: "Votre appareil trouvé ({model}) a été signalé avec succès.",
    },
    // Home Page
    heroTitle: "Vous avez perdu votre appareil Apple ? Retrouvez-le en toute sécurité.",
    heroSubtitle: "Nous vous mettons en contact de manière anonyme avec la personne qui a trouvé votre appareil. Un échange sûr, une récompense juste.",
    getStarted: "Commencer",
    howItWorks: "Comment ça marche ?",
    step1Title: "Le propriétaire signale l'appareil perdu",
    step1Desc: "Si vous avez perdu votre iPhone, iPad ou Mac, enregistrez-le sur notre plateforme avec son numéro de série.",
    step2Title: "Le trouveur signale l'appareil trouvé",
    step2Desc: "Toute personne qui trouve un appareil peut le signaler anonymement en utilisant son numéro de série.",
    step3Title: "Correspondance sécurisée et séquestre",
    step3Desc: "Notre système fait correspondre automatiquement les appareils. Le propriétaire paie une récompense dans notre système de séquestre sécurisé.",
    step4Title: "Échange sûr et paiement",
    step4Desc: "Suivez nos directives pour un échange en toute sécurité. Une fois confirmé, le trouveur reçoit la récompense.",
    // Auth Pages
    loginTitle: "Connectez-vous à votre compte",
    registerTitle: "Créer un compte",
    email: "E-mail",
    password: "Mot de passe",
    fullName: "Nom complet",
    firstName: "Prénom",
    lastName: "Nom de famille",
    tcKimlikNo: "Numéro d'identité TC",
    phoneNumber: "Numéro de téléphone",
    address: "Adresse",
    iban: "Numéro IBAN",
    iAmA: "Je suis un(e)...",
    deviceOwner: "Propriétaire d'appareil",
    deviceFinder: "Trouveur d'appareil",
    bankInfo: "Informations de compte bancaire (pour le paiement de la récompense)",
    agreeToTerms: "J'accepte les {terms} et la {privacy}.",
    termsLink: "Conditions d'utilisation",
    privacyLink: "Politique de confidentialité",
    consentRequired: "Vous devez accepter les conditions et la politique de confidentialité pour continuer.",
    alreadyHaveAccount: "Vous avez déjà un compte ?",
    dontHaveAccount: "Vous n'avez pas de compte ?",
    // Auth errors
    userAlreadyExists: "Un utilisateur avec cette adresse e-mail existe déjà.",
    invalidEmailOrPassword: "E-mail ou mot de passe invalide.",
    orContinueWith: "Ou continuer avec",
    loginWithGoogle: "Se connecter avec Google",
    loginWithApple: "Se connecter avec Apple",
    processingPayment: "Traitement du paiement...",
    // Dashboard
    myDevices: "Mes appareils",
    status: "Statut",
    model: "Modèle",
    serialNumber: "Numéro de série",
    noDevicesReported: "Vous n'avez encore signalé aucun appareil.",
    // Device Forms
    deviceModelForm: "Modèle de l'appareil (ex: iPhone 15 Pro)",
    deviceSerialNumber: "Numéro de série",
    deviceColor: "Couleur",
    deviceDescription: "Détails supplémentaires (facultatif)",
    deviceInvoice: "Preuve d'achat (Facture)",
    deviceInvoiceHelper: "Facultatif. Aide à vérifier la propriété.",
    submit: "Soumettre",
    suggestDescription: "Suggérer une description avec l'IA",
    suggestRewardDescription: "Suggérer une récompense et une description avec l'IA",
    gettingSuggestions: "Obtention de suggestions...",
    aiSuggestion: "Suggestion de l'IA",
    suggestedReward: "Récompense suggérée",
    basedOnValue: "Basé sur une valeur estimée de {value}",
    aiError: "Impossible d'obtenir les suggestions de l'IA. Veuillez remplir les détails manuellement.",
    failedToAddDevice: "Échec de l'ajout de l'appareil. Veuillez réessayer.",
    failedToLoadDeviceModels: "Échec du chargement des modèles d'appareils.",
    loadingDeviceModels: "Chargement des modèles d'appareils...",
    noModelsAvailable: "Aucun modèle disponible",
    selectModelFirst: "Sélectionnez d'abord un modèle d'appareil",
    // Payment related
    paymentSummary: "Résumé du paiement",
    paymentSummarySubtitle: "Récupérez votre appareil avec un paiement sécurisé",
    paymentConfirmation: "Confirmation de paiement",
    termsAgreement: "J'ai lu et j'accepte les Conditions d'utilisation et la Politique de confidentialité. Je comprends que mon paiement sera conservé dans un système de séquestre sécurisé et transféré au trouveur après la livraison de l'appareil.",
    securePayment: "Effectuer un paiement sécurisé",
    paymentProcessing: "Traitement du paiement...",
    paymentSecurityNotice: "🔒 Ce paiement est protégé par SSL. Vos informations de carte sont cryptées de manière sécurisée et ne sont pas stockées.",
    deviceModelNotSpecified: "Modèle d'appareil non spécifié",
    feeCalculationFailed: "Le calcul des frais n'a pas pu être effectué",
    feeCalculationError: "Une erreur s'est produite lors du calcul des frais",
    paymentLoginRequired: "Vous devez être connecté pour effectuer un paiement",
    missingPaymentInfo: "Informations de paiement manquantes",
    acceptTermsRequired: "Veuillez accepter les conditions d'utilisation",
    paymentInitiated: "Paiement initié avec succès !",
    paymentFailed: "Échec du paiement",
    paymentError: "Une erreur s'est produite lors du traitement du paiement",
    calculatingFees: "Calcul des frais...",
    errorOccurred: "Une erreur s'est produite",
    // Cargo related
    cargoTracking: "Suivi de colis",
    refresh: "Actualiser",
    detailedTracking: "Suivi détaillé",
    currentStatus: "Statut actuel",
    trackingInfo: "Informations de suivi",
    anonymousId: "ID anonyme",
    trackingNumber: "Numéro de suivi",
    yourRole: "Votre rôle",
    sender: "Expéditeur",
    receiver: "Destinataire",
    deviceInfo: "Informations sur l'appareil",
    estimatedDelivery: "Livraison estimée",
    cargoHistory: "Historique du colis",
    deliveryCompleted: "Livraison terminée",
    confirmDeliveryMessage: "Cliquez sur le bouton pour confirmer que vous avez reçu l'appareil",
    confirmDelivery: "Confirmer la livraison",
    cargoSupport: "Support colis : Pour les problèmes liés au colis, vous pouvez appeler le service client de la société de transport ou nous contacter avec votre code d'ID anonyme.",
    cargoLoadingInfo: "Chargement des informations de colis...",
    cargoTrackingNotFound: "Informations de suivi de colis non trouvées",
    trackingInfoLoadError: "Erreur lors du chargement des informations de suivi",
    tryAgain: "Réessayer",
    noCargoMovement: "Aucun mouvement de colis pour le moment",
    // Payment Flow & Match Payment translations
    matchPayment: "Paiement de Correspondance",
    matchPaymentSubtitle: "Récupérez votre appareil en toute sécurité",
    deviceRecoveryPayment: "Paiement de Récupération d'Appareil",
    deviceRecoverySubtitle: "Récupérez votre appareil perdu en toute sécurité",
    feeDetails: "Détails des Frais",
    payment: "Paiement",
    stepIndicatorModel: "Modèle d'Appareil",
    stepIndicatorFees: "Détails des Frais", 
    stepIndicatorPayment: "Paiement",
    matchInfo: "Informations de Correspondance",
    deviceModelLabel: "Modèle d'Appareil:",
    finderReward: "Récompense au Trouveur:",
    statusLabel: "Statut:",
    matchFound: "Correspondance Trouvée",
    proceedToPayment: "Procéder au Paiement →",
    customRewardAmount: "Montant de Récompense Personnalisé",
    customRewardDescription: "Facultatif : Si vous souhaitez donner une récompense plus élevée au trouveur, vous pouvez la définir ici.",
    defaultReward: "Par défaut : {amount} TL",
    customRewardSet: "✓ Montant de récompense personnalisé : {amount} TL",
    changeDeviceModel: "← Changer le Modèle d'Appareil",
    backToFeeDetails: "← Retour aux Détails des Frais",
    finderRewardLabel: "Récompense au trouveur:",
    cargoLabel: "Colis:",
    serviceFeeLabel: "Frais de service:",
    gatewayFeeLabel: "Commission de paiement:",
    totalLabel: "TOTAL:",
    redirectingToDashboard: "Redirection vers le tableau de bord...",
    // Fee Breakdown Card translations
    category: "Catégorie",
    matchedDevice: "Appareil Correspondant",
    matchedWithFinder: "Associé avec le trouveur",
    ifoundanappleFeeBreakdown: "Répartition des Frais iFoundAnApple",
    finderRewardDesc: "À payer au trouveur",
    cargoFeeDesc: "Pour livraison sécurisée",
    serviceFeeDesc: "Commission de plateforme",
    paymentCommissionDesc: "Pour paiement sécurisé",
    totalPayment: "Votre Paiement Total",
    paymentDue: "Montant à payer maintenant",
    finderNetPayment: "Paiement Net au Trouveur",
    afterServiceFeeDeduction: "Après déduction des frais de service",
    securePaymentSystem: "Système d'Entiercement Sécurisé",
    escrowSystemDesc: "Votre paiement est conservé dans notre compte d'entiercement sécurisé et ne sera pas transféré tant que l'appareil n'est pas livré et confirmé. Avec la garantie de paiement sécurisé, vous disposez de droits d'annulation et de remboursement hors frais de traitement.",
    // Payment Method Selector translations
    paymentMethod: "Méthode de Paiement",
    securePaymentOptions: "Options de paiement sécurisées",
    recommended: "RECOMMANDÉ",
    instant: "Instantané",
    free: "Gratuit",
    turkeyTrustedPayment: "Système de paiement fiable de Turquie",
    internationalSecurePayment: "Paiement sécurisé international",
    developmentTestPayment: "Paiement de test de développement",
    turkeyMostTrustedPayment: "Système de Paiement le Plus Fiable de Turquie",
    worldStandardSecurity: "Sécurité aux Standards Mondiaux",
    developmentTestMode: "Mode Test de Développement",
    securePayment: "Protégé par 3D Secure, paiement sécurisé certifié PCI DSS. Toutes les grandes banques sont supportées.",
    stripeInternational: "Sécurité aux standards internationaux, protégé par chiffrement SSL 256-bit.",
    testModeDesc: "Aucun transfert d'argent réel. Uniquement à des fins de développement et de test.",
    securityFeatures: "🔒 Fonctionnalités de Sécurité",
    sslEncryption: "Chiffrement SSL 256-bit",
    pciCompliance: "Conformité PCI DSS",
    escrowGuarantee: "Garantie d'Entiercement",
    threeDSecureVerification: "Vérification 3D Secure",
    commission: "commission",
    // Statuses
    Lost: "Perdu",
    Reported: "Signalé",
    Matched: "Correspondance ! En attente du paiement du propriétaire.",
    PaymentPending: "Correspondance ! Veuillez procéder au paiement.",
    PaymentComplete: "Paiement effectué ! Procédez à l'échange.",
    ExchangePending: "Échange en attente",
    Completed: "Terminé",
    // Device Detail Page
    deviceDetails: "Détails de l'appareil",
    matchFoundDevice: "Une correspondance a été trouvée pour votre appareil !",
    reward: "Récompense",
    makePaymentSecurely: "Effectuer le paiement en toute sécurité",
    waitingForOwnerPayment: "En attente du paiement du propriétaire.",
    matchFoundTitle: "Correspondance trouvée !",
    paymentReceived: "Paiement reçu !",
    paymentSecureExchange: "Votre paiement est conservé en toute sécurité. Veuillez suivre les instructions pour finaliser l'échange et confirmer.",
    finderPaymentSecureExchange: "Le paiement est conservé en toute sécurité. Veuillez suivre les instructions pour finaliser l'échange et confirmer.",
    confirmExchange: "Je confirme l'échange",
    waitingForOtherParty: "En attente de la confirmation de l'autre partie...",
    secureExchangeGuidelines: "Directives pour un échange sécurisé",
    guideline1: "Organisez une rencontre dans un lieu public sûr comme un poste de police ou un café bien iluminé.",
    guideline2: "Alternativamente, utilisez un service d'expédition avec suivi et assurance pour interchanger l'appareil.",
    guideline3: "Ne partagez pas d'informations de contact personnelles. Communiquez uniquement via notre plateforme si nécessaire.",
    guideline4: "Une fois que vous avez interchangé l'appareil avec succès, appuyez sur le bouton de confirmation ci-dessous.",
    transactionCompleted: "Transaction terminée !",
    transactionCompletedDesc: "La récompense a été transférée au trouveur. Merci d'utiliser iFoundAnApple.",
    serviceFeeNotice: "Des frais de service de 5% ont été déduits de la récompense pour couvrir les frais opérationnels.",
    backToDashboard: "Retour au tableau de bord",
    goBack: "Retour",
    loading: "Chargement...",
    loadingPageContent: "Veuillez patienter pendant le chargement de la page...",
    viewInvoice: "Voir la facture",
    // Admin Panel
    totalUsers: "Utilisateurs totaux",
    totalDevices: "Appareils totaux",
    allUsers: "Tous les utilisateurs",
    allDevices: "Tous les appareils",
    user: "Utilisateur",
    role: "Rôle",
    owner: "Propriétaire",
    finder: "Trouveur",
    admin: "Admin",
    // Footer and Static Pages
    faq: "FAQ",
    terms: "Termes",
    privacy: "Confidentialité",
    contact: "Contact",
    downloadOnAppStore: "Télécharger sur l'App Store",
    faqTitle: "Foire Aux Questions",
    termsTitle: "Conditions d'utilisation",
    privacyTitle: "Politique de confidentialité",
    contactTitle: "Nous contacter",
    contactIntro: "Si vous avez des questions ou avez besoin d'aide, n'hésitez pas à nous contacter. Nous sommes là pour vous aider !",
    contactEmail: "info@ifoundanapple.com",
    faqIntro: "Trouvez les réponses aux questions fréquemment posées sur notre plateforme.",
    faqContent: {
      q1: "Comment fonctionne le processus de correspondance ?",
      a1: "Notre système associe automatiquement et anonymement un rapport d'appareil perdu d'un propriétaire avec un rapport d'appareil trouvé d'un trouveur basé sur le modèle et le numéro de série de l'appareil. Les deux parties sont notifiées instantanément lorsqu'une correspondance est trouvée.",
      q2: "Mes informations personnelles sont-elles sécurisées ?",
      a2: "Absolument. Votre vie privée est notre priorité absolue. Nous ne partageons jamais vos informations personnelles (nom, e-mail, etc.) avec l'autre partie. Toutes les communications et transactions sont gérées en toute sécurité via la plateforme.",
      q3: "Comment le montant de la récompense est-il déterminé ?",
      a3: "Lors du signalement d'un appareil perdu, le propriétaire fixe un montant de récompense. Nous offrons également une fonction de suggestion alimentée par l'IA qui recommande une récompense équitable basée sur le modèle de l'appareil et la valeur marchande d'occasion estimée.",
      q4: "Qu'est-ce que le système de séquestre sécurisé ?",
      a4: "Lorsqu'une correspondance est trouvée, le propriétaire paie le montant de la récompense dans notre système de séquestre sécurisé. Nous conservons le paiement en toute sécurité jusqu'à ce que les deux parties confirment que l'appareil a été échangé avec succès. Cela protège à la fois le propriétaire et le trouveur.",
      q5: "Comment se déroule l'échange physique ?",
      a5: "Nous fournissons des directives d'échange sécurisé. Nous recommandons vivement de se rencontrer dans un lieu public sûr (comme un poste de police) ou d'utiliser un service d'expédition avec suivi et assurance. La plateforme est conçue pour faciliter le retour sans avoir besoin de partager des détails de contact personnels.",
      q6: "Quels sont les frais ?",
      a6: "Nous déduisons des frais de service de 5% du montant de la récompense payée au trouveur. Cela nous aide à couvrir les coûts opérationnels, maintenir la plateforme et assurer un environnement sécurisé pour tous."
    },
    termsContent: `
      <h3 class="text-xl font-semibold mb-2">1. Introduction</h3>
      <p class="mb-4">Bienvenue sur iFoundAnApple. Ces Conditions d'Utilisation ("Conditions") régissent votre utilisation de notre site web et de nos services. En créant un compte ou en utilisant notre plateforme, vous acceptez d'être lié par ces Conditions.</p>
      <h3 class="text-xl font-semibold mb-2">2. Le Service</h3>
      <p class="mb-4">iFoundAnApple fournit une plateforme pour connecter les propriétaires d'appareils Apple perdus avec les personnes qui les trouvent ("Trouveurs"). Nous facilitons cette connexion grâce à un système de correspondance anonyme et gérons un paiement de récompense via un processus d'escrow sécurisé. Nous ne sommes pas partie à l'échange physique d'aucun appareil.</p>
      <h3 class="text-xl font-semibold mb-2">3. Obligations de l'Utilisateur</h3>
      <p class="mb-4">Vous acceptez de fournir des informations exactes et véridiques lors de l'enregistrement d'un appareil. Vous devez être le propriétaire légal de tout appareil que vous signalez comme perdu. Vous devez avoir trouvé légalement tout appareil que vous signalez comme trouvé. Vous acceptez de ne pas utiliser le service à des fins illégales ou non autorisées.</p>
      <h3 class="text-xl font-semibold mb-2">4. Paiements et Frais</h3>
      <p class="mb-4">Les Propriétaires d'Appareils acceptent de payer le montant de récompense indiqué dans notre système d'escrow lors d'une correspondance réussie. Ce paiement n'est pas remboursable une fois l'échange terminé. Nous facturons des frais de service de 5%, qui sont déduits de la récompense payée au Trouveur.</p>
      <h3 class="text-xl font-semibold mb-2">5. Limitation de Responsabilité</h3>
      <p class="mb-4">iFoundAnApple est un fournisseur de plateforme. Nous ne sommes pas responsables de l'état de tout appareil retourné, ni ne sommes-nous responsables de tout problème découlant de l'échange physique entre utilisateurs. Nous fournissons des directives pour un échange sûr, mais la responsabilité incombe aux utilisateurs.</p>
    `,
    privacyContent: `
      <h3 class="text-xl font-semibold mb-2">1. Collecte d'Informations</h3>
      <p class="mb-4">Nous collectons les informations que vous nous fournissez directement, telles que votre nom, adresse e-mail, numéro de téléphone et informations sur les appareils. Nous collectons également automatiquement certaines informations lorsque vous utilisez notre service.</p>
      <h3 class="text-xl font-semibold mb-2">2. Utilisation des Informations</h3>
      <p class="mb-4">Nous utilisons vos informations pour fournir, maintenir et améliorer notre service, traiter les transactions, communiquer avec vous et assurer la sécurité de notre plateforme.</p>
      <h3 class="text-xl font-semibold mb-2">3. Partage d'Informations</h3>
      <p class="mb-4">Nous ne vendons pas vos informations personnelles. Nous pouvons partager vos informations avec des fournisseurs de services tiers qui nous aident à exploiter notre plateforme, mais uniquement dans la mesure nécessaire pour fournir nos services.</p>
      <h3 class="text-xl font-semibold mb-2">4. Vos Droits</h3>
      <p class="mb-4">Vous avez le droit d'accéder, de rectifier ou d'effacer vos données personnelles. Vous avez également le droit de restreindre ou de vous opposer à certains traitements. Pour exercer ces droits, veuillez nous contacter à <a href="mailto:privacy@ifoundanapple.com" class="text-brand-blue underline">privacy@ifoundanapple.app</a>.</p>
    `,
  },
  ja: {
    // Header & Nav
    appName: "iFoundAnApple",
    home: "ホーム",
    dashboard: "ダッシュボード",
    profile: "プロフィール",
    language: "言語",
    login: "ログイン",
    logout: "ログアウト",
    register: "登録",
    reportFoundDevice: "発見したデバイスを報告",
    addLostDevice: "紛失したデバイスを追加",
    adminDashboard: "管理者パネル",
    notifications: {
      title: "通知",
      markAllAsRead: "すべて既読にする",
      noNotifications: "新しい通知はありません。",
      matchFoundOwner: "お使いの{model}に一致するものが見つかりました！対応が必要です。",
      matchFoundFinder: "報告された{model}に一致するものが見つかりました。所有者の支払いを待っています。",
      paymentReceivedFinder: "{model}の支払いを受け取りました！交換手続きに進んでください。",
      exchangeConfirmationNeeded: "相手方が{model}の交換を確認しました。完了するには確認してください。",
      transactionCompletedOwner: "成功！お使いの{model}の交換が完了しました。",
      transactionCompletedFinder: "成功！{model}の報酬が送金中です。",
      deviceLostConfirmation: "紛失したデバイス({model})が正常に追加されました。",
      deviceReportedConfirmation: "発見されたデバイス({model})が正常に報告されました。",
    },
    // Home Page
    heroTitle: "Appleデバイスを紛失しましたか？安全に見つけましょう。",
    heroSubtitle: "デバイスを見つけた人と匿名で安全に連絡を取ります。安全な交換、公正な報酬。",
    getStarted: "始める",
    howItWorks: "仕組み",
    step1Title: "所有者が紛失デバイスを報告",
    step1Desc: "iPhone、iPad、Macを紛失した場合、シリアル番号をプラットフォームに登録します。",
    step2Title: "発見者が発見デバイスを報告",
    step2Desc: "デバイスを見つけた人は誰でも、シリアル番号を使って匿名で報告できます。",
    step3Title: "安全なマッチングとエスクロー",
    step3Desc: "私たちのシステムは自動的にデバイスを照合します。所有者は安全なエスクローシステムに報酬を支払います。",
    step4Title: "安全な交換と支払い",
    step4Desc: "安全な交換のために私たちのガイドラインに従ってください。確認後、発見者は報酬を受け取ります。",
    // Auth Pages
    loginTitle: "アカウントにログイン",
    registerTitle: "アカウントを作成",
    email: "メールアドレス",
    password: "パスワード",
    fullName: "氏名",
    firstName: "名前",
    lastName: "苗字",
    tcKimlikNo: "TC身分証明書番号",
    phoneNumber: "電話番号",
    address: "住所",
    iban: "IBAN番号",
    iAmA: "私は...",
    deviceOwner: "デバイスの所有者",
    deviceFinder: "デバイスの発見者",
    bankInfo: "銀行口座情報（報酬の支払い用）",
    agreeToTerms: "{terms}と{privacy}に同意します。",
    termsLink: "利用規約",
    privacyLink: "プライバシーポリシー",
    consentRequired: "続行するには、利用規約とプライバシーポリシーに同意する必要があります。",
    alreadyHaveAccount: "すでにアカウントをお持ちですか？",
    dontHaveAccount: "アカウントをお持ちではありませんか？",
    // Auth errors
    userAlreadyExists: "このメールアドレスのユーザーは既に存在します。",
    invalidEmailOrPassword: "無効なメールアドレスまたはパスワードです。",
    orContinueWith: "または次で続行",
    loginWithGoogle: "Googleでログイン",
    loginWithApple: "Appleでログイン",
    processingPayment: "支払い処理中...",
    // Dashboard
    myDevices: "私のデバイス",
    status: "ステータス",
    model: "モデル",
    serialNumber: "シリアル番号",
    noDevicesReported: "まだデバイスを報告していません。",
    // Device Forms
    deviceModelForm: "デバイスモデル（例：iPhone 15 Pro）",
    deviceSerialNumber: "シリアル番号",
    deviceColor: "色",
    deviceDescription: "追加情報（任意）",
    deviceInvoice: "購入証明（請求書）",
    deviceInvoiceHelper: "任意。所有権の確認に役立ちます。",
    submit: "送信",
    suggestDescription: "AIで説明を提案",
    suggestRewardDescription: "AIで報酬と説明を提案",
    gettingSuggestions: "提案を取得中...",
    aiSuggestion: "AI提案",
    suggestedReward: "推奨報酬",
    basedOnValue: "推定価値{value}に基づく",
    aiError: "AI提案を取得できませんでした。手動で詳細を入力してください。",
    failedToAddDevice: "デバイスの追加に失敗しました。もう一度お試しください。",
    failedToLoadDeviceModels: "デバイスモデルの読み込みに失敗しました。",
    loadingDeviceModels: "デバイスモデルを読み込み中...",
    noModelsAvailable: "利用可能なモデルはありません",
    selectModelFirst: "最初にデバイスモデルを選択してください",
    // Payment related
    paymentSummary: "支払い概要",
    paymentSummarySubtitle: "安全な支払いでデバイスを取り戻しましょう",
    paymentConfirmation: "支払い確認",
    termsAgreement: "利用規約とプライバシーポリシーを読み、同意します。支払いが安全なエスクローシステムで保管され、デバイス配送後に発見者に転送されることを理解しています。",
    securePayment: "安全な支払いを行う",
    paymentProcessing: "支払い処理中...",
    paymentSecurityNotice: "🔒 この支払いはSSLで保護されています。カード情報は安全に暗号化され、保存されません。",
    deviceModelNotSpecified: "デバイスモデルが指定されていません",
    feeCalculationFailed: "手数料計算を実行できませんでした",
    feeCalculationError: "手数料計算中にエラーが発生しました",
    paymentLoginRequired: "支払いを行うにはログインが必要です",
    missingPaymentInfo: "支払い情報が不足しています",
    acceptTermsRequired: "利用規約に同意してください",
    paymentInitiated: "支払いが正常に開始されました！",
    paymentFailed: "支払いが失敗しました",
    paymentError: "支払い処理中にエラーが発生しました",
    calculatingFees: "手数料計算中...",
    errorOccurred: "エラーが発生しました",
    // Cargo related
    cargoTracking: "荷物追跡",
    refresh: "更新",
    detailedTracking: "詳細追跡",
    currentStatus: "現在のステータス",
    trackingInfo: "追跡情報",
    anonymousId: "匿名ID",
    trackingNumber: "追跡番号",
    yourRole: "あなたの役割",
    sender: "送信者",
    receiver: "受信者",
    deviceInfo: "デバイス情報",
    estimatedDelivery: "配送予定",
    cargoHistory: "荷物履歴",
    deliveryCompleted: "配送完了",
    confirmDeliveryMessage: "デバイスを受け取ったことを確認するボタンをクリックしてください",
    confirmDelivery: "配送を確認",
    cargoSupport: "荷物サポート：荷物に関する問題については、運送会社のカスタマーサービスに電話するか、匿名IDコードで私たちにお問い合わせください。",
    cargoLoadingInfo: "荷物情報を読み込み中...",
    cargoTrackingNotFound: "荷物追跡情報が見つかりません",
    trackingInfoLoadError: "追跡情報の読み込み中にエラーが発生しました",
    tryAgain: "再試行",
    noCargoMovement: "まだ荷物の動きはありません",
    // Payment Flow & Match Payment translations
    matchPayment: "マッチング支払い",
    matchPaymentSubtitle: "デバイスを安全に取り戻しましょう",
    deviceRecoveryPayment: "デバイス回復支払い",
    deviceRecoverySubtitle: "紛失したデバイスを安全に取り戻しましょう",
    feeDetails: "料金詳細",
    payment: "支払い",
    stepIndicatorModel: "デバイスモデル",
    stepIndicatorFees: "料金詳細", 
    stepIndicatorPayment: "支払い",
    matchInfo: "マッチング情報",
    deviceModelLabel: "デバイスモデル:",
    finderReward: "発見者への報酬:",
    statusLabel: "ステータス:",
    matchFound: "マッチング発見",
    proceedToPayment: "支払いに進む →",
    customRewardAmount: "カスタム報酬額",
    customRewardDescription: "オプション：発見者により高い報酬を与えたい場合は、ここで設定できます。",
    defaultReward: "デフォルト：{amount} TL",
    customRewardSet: "✓ カスタム報酬額：{amount} TL",
    changeDeviceModel: "← デバイスモデルを変更",
    backToFeeDetails: "← 料金詳細に戻る",
    finderRewardLabel: "発見者への報酬:",
    cargoLabel: "配送:",
    serviceFeeLabel: "サービス料:",
    gatewayFeeLabel: "支払い手数料:",
    totalLabel: "合計:",
    redirectingToDashboard: "ダッシュボードにリダイレクト中...",
    // Fee Breakdown Card translations
    category: "カテゴリ",
    matchedDevice: "マッチしたデバイス",
    matchedWithFinder: "発見者とマッチしました",
    ifoundanappleFeeBreakdown: "iFoundAnApple料金内訳",
    finderRewardDesc: "発見者に支払われる",
    cargoFeeDesc: "安全な配送のため",
    serviceFeeDesc: "プラットフォーム手数料",
    paymentCommissionDesc: "安全な支払いのため",
    totalPayment: "合計支払額",
    paymentDue: "今すぐ支払う金額",
    finderNetPayment: "発見者への純支払い",
    afterServiceFeeDeduction: "サービス料控除後",
    securePaymentSystem: "安全なエスクローシステム",
    escrowSystemDesc: "お支払いは安全なエスクロー口座で保管され、デバイスが配送・確認されるまで相手に送金されません。安全な支払い保証により、処理手数料を除き、キャンセルと返金の権利が保護されています。",
    // Payment Method Selector translations
    paymentMethod: "支払い方法",
    securePaymentOptions: "安全な支払いオプション",
    recommended: "推奨",
    instant: "即座",
    free: "無料",
    turkeyTrustedPayment: "トルコの信頼できる支払いシステム",
    internationalSecurePayment: "国際的な安全支払い",
    developmentTestPayment: "開発テスト支払い",
    turkeyMostTrustedPayment: "トルコで最も信頼できる支払いシステム",
    worldStandardSecurity: "世界標準のセキュリティ",
    developmentTestMode: "開発テストモード",
    securePayment: "3D Secureで保護、PCI DSS認証の安全な支払い。すべての主要銀行がサポートされています。",
    stripeInternational: "国際標準のセキュリティ、256ビットSSL暗号化で保護。",
    testModeDesc: "実際の送金は行われません。開発・テスト目的のみです。",
    securityFeatures: "🔒 セキュリティ機能",
    sslEncryption: "256ビットSSL暗号化",
    pciCompliance: "PCI DSS準拠",
    escrowGuarantee: "エスクロー保証",
    threeDSecureVerification: "3D Secure認証",
    commission: "手数料",
    // Statuses
    Lost: "紛失",
    Reported: "報告済み",
    Matched: "一致！所有者の支払いを待っています。",
    PaymentPending: "一致！支払いに進んでください。",
    PaymentComplete: "支払い完了！交換に進んでください。",
    ExchangePending: "交換保留中",
    Completed: "完了",
    // Device Detail Page
    deviceDetails: "デバイス詳細",
    matchFoundDevice: "お使いのデバイスに一致するものが見つかりました！",
    reward: "報酬",
    makePaymentSecurely: "安全に支払いを行う",
    waitingForOwnerPayment: "所有者の支払いを待っています。",
    matchFoundTitle: "一致が見つかりました！",
    paymentReceived: "支払いを受け取りました！",
    paymentSecureExchange: "お支払いは安全に保管されています。指示に従って交換を完了し、確認してください。",
    finderPaymentSecureExchange: "支払いは安全に保管されています。指示に従って交換を完了し、確認してください。",
    confirmExchange: "交換を確認します",
    waitingForOtherParty: "相手の確認を待っています...",
    secureExchangeGuidelines: "安全な交換のためのガイドライン",
    guideline1: "警察署や明るいカフェなど、安全な公共の場所で会う約束をしてください。",
    guideline2: "あるいは、追跡・保険付きの配送サービスを利用してデバイスを交換してください。",
    guideline3: "個人の連絡先情報を共有しないでください。必要であれば、私たちのプラットフォームを通じてのみ連絡してください。",
    guideline4: "デバイスの交換が成功したら、下の確認ボタンを押してください。",
    transactionCompleted: "取引完了！",
    transactionCompletedDesc: "報酬は発見者に送金されました。iFoundAnAppleをご利用いただきありがとうございます。",
    serviceFeeNotice: "運営費を賄うため、報酬から5%のサービス手数料が差し引かれました。",
    backToDashboard: "ダッシュボードに戻る",
    goBack: "戻る",
    loading: "読み込み中...",
    loadingPageContent: "ページを読み込み中です。お待ちください...",
    viewInvoice: "請求書を見る",
    // Admin Panel
    totalUsers: "総ユーザー数",
    totalDevices: "総デバイス数",
    allUsers: "すべてのユーザー",
    allDevices: "すべてのデバイス",
    user: "ユーザー",
    role: "役割",
    owner: "所有者",
    finder: "発見者",
    admin: "管理者",
    // Footer and Static Pages
    faq: "よくある質問",
    terms: "利用規約",
    privacy: "プライバシー",
    contact: "お問い合わせ",
    downloadOnAppStore: "App Storeでダウンロード",
    faqTitle: "よくあるご質問",
    termsTitle: "利用規約",
    privacyTitle: "プライバシーポリシー",
    contactTitle: "お問い合わせ",
    contactIntro: "ご質問やサポートが必要な場合は、お気軽にお問い合わせください。お手伝いさせていただきます！",
    contactEmail: "info@ifoundanapple.com",
    faqIntro: "プラットフォームに関するよくある質問の回答をご覧ください。",
    faqContent: {
        q1: "マッチングプロセスはどのように機能しますか？",
        a1: "当社のシステムは、デバイスのモデルとシリアル番号に基づいて、所有者からの紛失デバイスレポートと発見者からの発見デバイスレポートを自動的かつ匿名で照合します。一致が見つかると、両当事者に即座に通知されます。",
        q2: "個人情報は安全ですか？",
        a2: "もちろんです。お客様のプライバシーは当社の最優先事項です。お客様の個人情報（名前、メールアドレスなど）を相手方と共有することはありません。すべての通信と取引は、プラットフォームを介して安全に処理されます。",
        q3: "報酬額はどのように決定されますか？",
        a3: "紛失したデバイスを報告する際、所有者は報酬額を設定します。また、AIを活用した提案機能も提供しており、デバイスのモデルと推定中古市場価値に基づいて公正な報酬を推奨します。",
        q4: "安全なエスクローシステムとは何ですか？",
        a4: "一致が見つかると、所有者は報酬額を当社の安全なエスクローシステムに支払います。デバイスが正常に交換されたことを両当事者が確認するまで、支払いを安全に保管します。これにより、所有者と発見者の両方が保護されます。",
        q5: "物理的な交換はどのように行われますか？",
        a5: "安全な交換ガイドラインを提供しています。安全な公共の場所（警察署など）で会うか、追跡・保険付きの配送サービスを利用することを強くお勧めします。このプラットフォームは、個人連絡先を共有することなく返却を容易にするように設計されています。",
        q6: "手数料はかかりますか？",
        a6: "発見者に支払われる報酬額から5%の少額のサービス手数料を差し引きます。これは、運営費をカバーし、プラットフォームを維持し、すべての人のための安全な環境を確保するのに役立ちます。"
    },
    termsContent: `
      <h3 class="text-xl font-semibold mb-2">1. はじめに</h3>
      <p class="mb-4">iFoundAnAppleへようこそ。これらの利用規約（「規約」）は、当社のウェブサイトとサービスの使用を規定します。アカウントを作成するか、プラットフォームを使用することで、これらの規約に拘束されることに同意したものとみなされます。</p>
      <h3 class="text-xl font-semibold mb-2">2. サービス</h3>
      <p class="mb-4">iFoundAnAppleは、紛失したAppleデバイスの所有者とそれらを見つけた個人（「発見者」）を結ぶプラットフォームを提供します。匿名マッチングシステムを通じてこの接続を促進し、安全なエスクロープロセスを通じて報酬支払いを管理します。私たちは、いかなるデバイスの物理的交換の当事者ではありません。</p>
      <h3 class="text-xl font-semibold mb-2">3. ユーザーの義務</h3>
      <p class="mb-4">デバイスを登録する際は、正確で真実の情報を提供することに同意します。紛失として報告するデバイスの法的所有者である必要があります。発見として報告するデバイスを合法的に見つけた必要があります。違法または無許可の目的でサービスを使用しないことに同意します。</p>
      <h3 class="text-xl font-semibold mb-2">4. 支払いと手数料</h3>
      <p class="mb-4">デバイス所有者は、成功したマッチング時に、記載された報酬額を当社のエスクローシステムに支払うことに同意します。交換が完了すると、この支払いは返金不可となります。発見者に支払われる報酬から差し引かれる5%のサービス手数料を請求します。</p>
      <h3 class="text-xl font-semibold mb-2">5. 責任の制限</h3>
      <p class="mb-4">iFoundAnAppleはプラットフォームプロバイダーです。返却されたデバイスの状態について責任を負いません。また、ユーザー間の物理的交換から生じる問題についても責任を負いません。安全な交換のためのガイドラインを提供しますが、責任はユーザーにあります。</p>
    `,
    privacyContent: `
      <h3 class="text-xl font-semibold mb-2">1. 情報の収集</h3>
      <p class="mb-4">お名前、メールアドレス、電話番号、デバイス情報など、お客様から直接提供される情報を収集します。また、サービスをご利用いただく際に、特定の情報を自動的に収集します。</p>
      <h3 class="text-xl font-semibold mb-2">2. 情報の使用</h3>
      <p class="mb-4">お客様の情報を使用して、サービスを提供、維持、改善し、取引を処理し、お客様とコミュニケーションを取り、プラットフォームのセキュリティを確保します。</p>
      <h3 class="text-xl font-semibold mb-2">3. 情報の共有</h3>
      <p class="mb-4">お客様の個人情報を販売することはありません。プラットフォームの運営を支援する第三者サービスプロバイダーとお客様の情報を共有する場合がありますが、サービスを提供するために必要な範囲でのみです。</p>
      <h3 class="text-xl font-semibold mb-2">4. お客様の権利</h3>
      <p class="mb-4">お客様の個人データにアクセス、訂正、または削除する権利があります。また、特定の処理を制限または異議を唱える権利もあります。これらの権利を行使するには、<a href="mailto:privacy@ifoundanapple.com" class="text-brand-blue underline">privacy@ifoundanapple.app</a>までお問い合わせください。</p>
    `,
  },
  es: {
    // Header & Nav
    appName: "iFoundAnApple",
    home: "Inicio",
    dashboard: "Panel",
    profile: "Perfil",
    language: "Idioma",
    login: "Iniciar Sesión",
    logout: "Cerrar Sesión",
    register: "Registrarse",
    reportFoundDevice: "Reportar un Dispositivo Encontrado",
    addLostDevice: "Añadir un Dispositivo Perdido",
    adminDashboard: "Panel de Admin",
    notifications: {
      title: "Notificaciones",
      markAllAsRead: "Marcar todo como leído",
      noNotifications: "No hay notificaciones nuevas.",
      matchFoundOwner: "¡Se encontró una coincidencia para tu {model}! Se requiere acción.",
      matchFoundFinder: "Se encontró una coincidencia para el {model} que reportaste. Esperando el pago del propietario.",
      paymentReceivedFinder: "¡Pago recibido por {model}! Por favor, procede con el intercambio.",
      exchangeConfirmationNeeded: "La otra parte confirmó el intercambio de {model}. Por favor, confirma para completar.",
      transactionCompletedOwner: "¡Éxito! El intercambio de tu {model} se ha completado.",
      transactionCompletedFinder: "¡Éxito! La recompensa por {model} está en camino.",
      deviceLostConfirmation: "Tu dispositivo perdido ({model}) ha sido añadido con éxito.",
      deviceReportedConfirmation: "Tu dispositivo encontrado ({model}) ha sido reportado con éxito.",
    },
    // Home Page
    heroTitle: "¿Perdiste tu dispositivo Apple? Encuéntralo de forma segura.",
    heroSubtitle: "Te conectamos anónimamente con la persona que encontró tu dispositivo. Un intercambio seguro, una recompensa justa.",
    getStarted: "Comenzar",
    howItWorks: "¿Cómo funciona?",
    step1Title: "El Propietario Reporta el Dispositivo Perdido",
    step1Desc: "Si has perdido tu iPhone, iPad o Mac, regístralo en nuestra plataforma con su número de serie.",
    step2Title: "El Encontrador Reporta el Dispositivo Encontrado",
    step2Desc: "Cualquier persona que encuentre un dispositivo puede reportarlo anónimamente usando su número de serie.",
    step3Title: "Coincidencia Segura y Depósito",
    step3Desc: "Nuestro sistema empareja automáticamente los dispositivos. El propietario paga una recompensa en nuestro sistema de depósito seguro.",
    step4Title: "Intercambio Seguro y Pago",
    step4Desc: "Sigue nuestras pautas para un intercambio seguro. Una vez confirmado, el encontrador recibe la recompensa.",
    // Auth Pages
    loginTitle: "Inicia sesión en tu cuenta",
    registerTitle: "Crear una cuenta",
    email: "Correo electrónico",
    password: "Contraseña",
    fullName: "Nombre completo",
    firstName: "Nombre",
    lastName: "Apellido",
    tcKimlikNo: "Número de identidad TC",
    phoneNumber: "Número de teléfono",
    address: "Dirección",
    iban: "Número IBAN",
    iAmA: "Soy un...",
    deviceOwner: "Propietario de dispositivo",
    deviceFinder: "Encontrador de dispositivo",
    bankInfo: "Información de la cuenta bancaria (para el pago de la recompensa)",
    agreeToTerms: "Acepto los {terms} y la {privacy}.",
    termsLink: "Términos de Servicio",
    privacyLink: "Política de Privacidad",
    consentRequired: "Debes aceptar los términos y la política de privacidad para continuar.",
    alreadyHaveAccount: "¿Ya tienes una cuenta?",
    dontHaveAccount: "¿No tienes una cuenta?",
    // Auth errors
    userAlreadyExists: "Ya existe un usuario con esta dirección de correo electrónico.",
    invalidEmailOrPassword: "Correo electrónico o contraseña inválidos.",
    orContinueWith: "O continuar con",
    loginWithGoogle: "Iniciar sesión con Google",
    loginWithApple: "Iniciar sesión con Apple",
    processingPayment: "Procesando pago...",
    // Dashboard
    myDevices: "Mis Dispositivos",
    status: "Estado",
    model: "Modelo",
    serialNumber: "Número de serie",
    noDevicesReported: "Aún no has reportado ningún dispositivo.",
    // Device Forms
    deviceModelForm: "Modelo del dispositivo (ej: iPhone 15 Pro)",
    deviceSerialNumber: "Número de serie",
    deviceColor: "Color",
    deviceDescription: "Detalles adicionales (opcional)",
    deviceInvoice: "Prueba de compra (Factura)",
    deviceInvoiceHelper: "Opcional. Ayuda a verificar la propiedad.",
    submit: "Enviar",
    suggestDescription: "Sugerir descripción con IA",
    suggestRewardDescription: "Sugerir recompensa y descripción con IA",
    gettingSuggestions: "Obteniendo sugerencias...",
    aiSuggestion: "Sugerencia de IA",
    suggestedReward: "Recompensa sugerida",
    basedOnValue: "Basado en un valor estimado de {value}",
    aiError: "No se pudieron obtener las sugerencias de la IA. Por favor, rellena los detalles manualmente.",
    failedToAddDevice: "No se pudo añadir el dispositivo. Por favor, inténtalo de nuevo.",
    failedToLoadDeviceModels: "No se pudieron cargar los modelos de dispositivos.",
    loadingDeviceModels: "Cargando modelos de dispositivos...",
    noModelsAvailable: "No hay modelos disponibles",
    selectModelFirst: "Selecciona primero un modelo de dispositivo",
    // Payment related
    paymentSummary: "Resumen de Pago",
    paymentSummarySubtitle: "Recupera tu dispositivo con pago seguro",
    paymentConfirmation: "Confirmación de Pago",
    termsAgreement: "He leído y acepto los Términos de Servicio y la Política de Privacidad. Entiendo que mi pago se mantendrá en un sistema de depósito seguro y se transferirá al buscador después de la entrega del dispositivo.",
    securePayment: "Realizar Pago Seguro",
    paymentProcessing: "Procesando Pago...",
    paymentSecurityNotice: "🔒 Este pago está protegido por SSL. Su información de tarjeta está encriptada de forma segura y no se almacena.",
    deviceModelNotSpecified: "Modelo de dispositivo no especificado",
    feeCalculationFailed: "No se pudo realizar el cálculo de tarifas",
    feeCalculationError: "Ocurrió un error durante el cálculo de tarifas",
    paymentLoginRequired: "Debes iniciar sesión para realizar un pago",
    missingPaymentInfo: "Información de pago faltante",
    acceptTermsRequired: "Por favor acepta los términos de servicio",
    paymentInitiated: "¡Pago iniciado exitosamente!",
    paymentFailed: "El pago falló",
    paymentError: "Ocurrió un error durante el procesamiento del pago",
    calculatingFees: "Calculando tarifas...",
    errorOccurred: "Ocurrió un Error",
    // Cargo related
    cargoTracking: "Seguimiento de Envío",
    refresh: "Actualizar",
    detailedTracking: "Seguimiento Detallado",
    currentStatus: "Estado Actual",
    trackingInfo: "Información de Seguimiento",
    anonymousId: "ID Anónimo",
    trackingNumber: "Número de Seguimiento",
    yourRole: "Tu Rol",
    sender: "Remitente",
    receiver: "Destinatario",
    deviceInfo: "Información del Dispositivo",
    estimatedDelivery: "Entrega Estimada",
    cargoHistory: "Historial de Envío",
    deliveryCompleted: "Entrega Completada",
    confirmDeliveryMessage: "Haz clic en el botón para confirmar que has recibido el dispositivo",
    confirmDelivery: "Confirmar Entrega",
    cargoSupport: "Soporte de Envío: Para problemas relacionados con el envío, puedes llamar al servicio al cliente de la empresa de transporte o contactarnos con tu código de ID anónimo.",
    cargoLoadingInfo: "Cargando información de envío...",
    cargoTrackingNotFound: "Información de seguimiento de envío no encontrada",
    trackingInfoLoadError: "Error al cargar la información de seguimiento",
    tryAgain: "Intentar de Nuevo",
    noCargoMovement: "Aún no hay movimiento de envío",
    // Payment Flow & Match Payment translations
    matchPayment: "Pago de Coincidencia",
    matchPaymentSubtitle: "Recupera tu dispositivo de forma segura",
    deviceRecoveryPayment: "Pago de Recuperación de Dispositivo",
    deviceRecoverySubtitle: "Recupera tu dispositivo perdido de forma segura",
    feeDetails: "Detalles de Tarifas",
    payment: "Pago",
    stepIndicatorModel: "Modelo de Dispositivo",
    stepIndicatorFees: "Detalles de Tarifas", 
    stepIndicatorPayment: "Pago",
    matchInfo: "Información de Coincidencia",
    deviceModelLabel: "Modelo de Dispositivo:",
    finderReward: "Recompensa al Buscador:",
    statusLabel: "Estado:",
    matchFound: "Coincidencia Encontrada",
    proceedToPayment: "Proceder al Pago →",
    customRewardAmount: "Cantidad de Recompensa Personalizada",
    customRewardDescription: "Opcional: Si quieres dar una recompensa más alta al buscador, puedes establecerla aquí.",
    defaultReward: "Por defecto: {amount} TL",
    customRewardSet: "✓ Cantidad de recompensa personalizada: {amount} TL",
    changeDeviceModel: "← Cambiar Modelo de Dispositivo",
    backToFeeDetails: "← Volver a Detalles de Tarifas",
    finderRewardLabel: "Recompensa al buscador:",
    cargoLabel: "Envío:",
    serviceFeeLabel: "Tarifa de servicio:",
    gatewayFeeLabel: "Comisión de pago:",
    totalLabel: "TOTAL:",
    redirectingToDashboard: "Redirigiendo al panel...",
    // Fee Breakdown Card translations
    category: "Categoría",
    matchedDevice: "Dispositivo Coincidente",
    matchedWithFinder: "Emparejado con el buscador",
    ifoundanappleFeeBreakdown: "Desglose de Tarifas iFoundAnApple",
    finderRewardDesc: "A pagar al buscador",
    cargoFeeDesc: "Para entrega segura",
    serviceFeeDesc: "Comisión de plataforma",
    paymentCommissionDesc: "Para pago seguro",
    totalPayment: "Su Pago Total",
    paymentDue: "Cantidad a pagar ahora",
    finderNetPayment: "Pago Neto al Buscador",
    afterServiceFeeDeduction: "Después de la deducción de la tarifa de servicio",
    securePaymentSystem: "Sistema de Depósito Seguro (Escrow)",
    escrowSystemDesc: "Su pago se mantiene en nuestra cuenta de depósito segura y no se transferirá hasta que el dispositivo sea entregado y confirmado. Con la garantía de pago seguro, tiene derechos de cancelación y reembolso excluyendo las tarifas de procesamiento.",
    // Payment Method Selector translations
    paymentMethod: "Método de Pago",
    securePaymentOptions: "Opciones de pago seguras",
    recommended: "RECOMENDADO",
    instant: "Instantáneo",
    free: "Gratis",
    turkeyTrustedPayment: "Sistema de pago confiable de Turquía",
    internationalSecurePayment: "Pago seguro internacional",
    developmentTestPayment: "Pago de prueba de desarrollo",
    turkeyMostTrustedPayment: "Sistema de Pago Más Confiable de Turquía",
    worldStandardSecurity: "Seguridad de Estándar Mundial",
    developmentTestMode: "Modo de Prueba de Desarrollo",
    securePayment: "Protegido por 3D Secure, pago seguro certificado PCI DSS. Todos los bancos principales son compatibles.",
    stripeInternational: "Seguridad de estándares internacionales, protegido con cifrado SSL de 256 bits.",
    testModeDesc: "No hay transferencia de dinero real. Solo para fines de desarrollo y prueba.",
    securityFeatures: "🔒 Características de Seguridad",
    sslEncryption: "Cifrado SSL de 256 bits",
    pciCompliance: "Cumplimiento PCI DSS",
    escrowGuarantee: "Garantía de Depósito",
    threeDSecureVerification: "Verificación 3D Secure",
    commission: "comisión",
    // Statuses
    Lost: "Perdido",
    Reported: "Reportado",
    Matched: "¡Coincidencia! Esperando el pago del propietario.",
    PaymentPending: "¡Coincidencia! Por favor procede al pago.",
    PaymentComplete: "¡Pago completado! Procede al intercambio.",
    ExchangePending: "Intercambio pendiente",
    Completed: "Completado",
    // Device Detail Page
    deviceDetails: "Detalles del Dispositivo",
    matchFoundDevice: "¡Se encontró una coincidencia para tu dispositivo!",
    reward: "Recompensa",
    makePaymentSecurely: "Realizar Pago de Forma Segura",
    waitingForOwnerPayment: "Esperando a que el propietario realice el pago.",
    matchFoundTitle: "¡Coincidencia encontrada!",
    paymentReceived: "¡Pago recibido!",
    paymentSecureExchange: "Tu pago se mantiene seguro. Por favor sigue las instrucciones para completar el intercambio y confirmar.",
    finderPaymentSecureExchange: "El pago se mantiene seguro. Por favor sigue las instrucciones para completar el intercambio y confirmar.",
    confirmExchange: "Confirmo el Intercambio",
    waitingForOtherParty: "Esperando la confirmación de la otra parte...",
    secureExchangeGuidelines: "Pautas para un Intercambio Seguro",
    guideline1: "Acuerda reunirte en un lugar público y seguro como una comisaría o una cafetería bien iluminada.",
    guideline2: "Alternativamente, utiliza un servicio de envío con seguimiento y seguro para intercambiar el dispositivo.",
    guideline3: "No compartas información de contacto personal. Comunícate solo a través de nuestra plataforma si es necesario.",
    guideline4: "Una vez que hayas intercambiado exitosamente el dispositivo, presiona el botón de confirmación a continuación.",
    transactionCompleted: "¡Transacción Completada!",
    transactionCompletedDesc: "La recompensa ha sido transferida al encontrador. Gracias por usar iFoundAnApple.",
    serviceFeeNotice: "Se ha deducido una tarifa de servicio del 5% de la recompensa para cubrir los costos operativos.",
    backToDashboard: "Volver al Panel",
    goBack: "Volver",
    loading: "Cargando...",
    loadingPageContent: "Por favor espera mientras se carga la página...",
    viewInvoice: "Ver factura",
    // Admin Panel
    totalUsers: "Usuarios Totales",
    totalDevices: "Dispositivos Totales",
    allUsers: "Todos los Usuarios",
    allDevices: "Todos los Dispositivos",
    user: "Usuario",
    role: "Rol",
    owner: "Propietario",
    finder: "Encontrador",
    admin: "Admin",
    // Footer and Static Pages
    faq: "Preguntas Frecuentes",
    terms: "Términos",
    privacy: "Privacidad",
    contact: "Contacto",
    downloadOnAppStore: "Descargar en la App Store",
    faqTitle: "Preguntas Frecuentes",
    termsTitle: "Términos de Servicio",
    privacyTitle: "Política de Privacidad",
    contactTitle: "Contáctanos",
    contactIntro: "Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos. ¡Estamos aquí para ayudarte!",
    contactEmail: "info@ifoundanapple.com",
    faqIntro: "Encuentra respuestas a las preguntas frecuentes sobre nuestra plataforma.",
    faqContent: {
        q1: "¿Cómo funciona el proceso de emparejamiento?",
        a1: "Nuestro sistema empareja de forma automática y anónima un informe de dispositivo perdido de un propietario con un informe de dispositivo encontrado de un buscador basándose en el modelo y el número de serie del dispositivo. Ambas partes son notificadas al instante cuando se encuentra una coincidencia.",
        q2: "¿Está segura mi información personal?",
        a2: "Absolutamente. Tu privacidad es nuestra máxima prioridad. Nunca compartimos tu información personal (nombre, correo electrónico, etc.) con la otra parte. Todas las comunicaciones y transacciones se manejan de forma segura a través de la plataforma.",
        q3: "¿Cómo se determina el importe de la recompensa?",
        a3: "Al informar de un dispositivo perdido, el propietario establece un importe de recompensa. También ofrecemos una función de sugerencia impulsada por IA que recomienda una recompensa justa basada en el modelo del dispositivo y el valor de mercado de segunda mano estimado.",
        q4: "¿Qué es el sistema de depósito seguro (escrow)?",
        a4: "Cuando se encuentra una coincidencia, el propietario paga el importe de la recompensa en nuestro sistema de depósito seguro. Mantenemos el pago de forma segura hasta que ambas partes confirmen que el dispositivo se ha intercambiado con éxito. Esto protege tanto al propietario como al buscador.",
        q5: "¿Cómo se realiza el intercambio físico?",
        a5: "Proporcionamos pautas de intercambio seguro. Recomendamos encarecidamente reunirse en un lugar público seguro (como una comisaría) o utilizar un servicio de envío con seguimiento y seguro. La plataforma está diseñada para facilitar la devolución sin necesidad de que compartas datos de contacto personales.",
        q6: "¿Cuáles son las tarifas?",
        a6: "Deducimos una pequeña tarifa de servicio del 5% del importe de la recompensa pagada al buscador. Esto nos ayuda a cubrir los costes operativos, mantener la plataforma y garantizar un entorno seguro para todos."
    },
    termsContent: `
      <h3 class="text-xl font-semibold mb-2">1. Introducción</h3>
      <p class="mb-4">Bienvenido a iFoundAnApple. Estos Términos de Servicio ("Términos") rigen el uso de nuestro sitio web y servicios. Al crear una cuenta o usar nuestra plataforma, aceptas estar sujeto a estos Términos.</p>
      <h3 class="text-xl font-semibold mb-2">2. El Servicio</h3>
      <p class="mb-4">iFoundAnApple proporciona una plataforma para conectar a los propietarios de dispositivos Apple perdidos con las personas que los encuentran ("Buscadores"). Facilitamos esta conexión a través de un sistema de coincidencia anónimo y gestionamos un pago de recompensa a través de un proceso de depósito seguro. No somos parte del intercambio físico de ningún dispositivo.</p>
      <h3 class="text-xl font-semibold mb-2">3. Obligaciones del Usuario</h3>
      <p class="mb-4">Aceptas proporcionar información precisa y veraz al registrar un dispositivo. Debes ser el propietario legal de cualquier dispositivo que reportes como perdido. Debes haber encontrado legalmente cualquier dispositivo que reportes como encontrado. Aceptas no usar el servicio para ningún propósito ilegal o no autorizado.</p>
      <h3 class="text-xl font-semibold mb-2">4. Pagos y Tarifas</h3>
      <p class="mb-4">Los Propietarios de Dispositivos aceptan pagar el importe de recompensa indicado en nuestro sistema de depósito tras una coincidencia exitosa. Este pago no es reembolsable una vez completado el intercambio. Cobramos una tarifa de servicio del 5%, que se deduce de la recompensa pagada al Buscador.</p>
      <h3 class="text-xl font-semibold mb-2">5. Limitación de Responsabilidad</h3>
      <p class="mb-4">iFoundAnApple es un proveedor de plataforma. No somos responsables del estado de ningún dispositivo devuelto, ni somos responsables de ningún problema que surja del intercambio físico entre usuarios. Proporcionamos pautas para un intercambio seguro, pero la responsabilidad recae en los usuarios.</p>
    `,
    privacyContent: `
      <h3 class="text-xl font-semibold mb-2">1. Recopilación de Información</h3>
      <p class="mb-4">Recopilamos la información que nos proporcionas directamente, como tu nombre, dirección de correo electrónico, número de teléfono e información del dispositivo. También recopilamos automáticamente cierta información cuando usas nuestro servicio.</p>
      <h3 class="text-xl font-semibold mb-2">2. Uso de la Información</h3>
      <p class="mb-4">Usamos tu información para proporcionar, mantener y mejorar nuestro servicio, procesar transacciones, comunicarnos contigo y asegurar la seguridad de nuestra plataforma.</p>
      <h3 class="text-xl font-semibold mb-2">3. Compartir Información</h3>
      <p class="mb-4">No vendemos tu información personal. Podemos compartir tu información con proveedores de servicios terceros que nos ayudan a operar nuestra plataforma, pero solo en la medida necesaria para proporcionar nuestros servicios.</p>
      <h3 class="text-xl font-semibold mb-2">4. Tus Derechos</h3>
      <p class="mb-4">Tienes derecho a acceder, rectificar o borrar tus datos personales. También tienes derecho a restringir u oponerte a ciertos procesamientos. Para ejercer estos derechos, contáctanos en <a href="mailto:privacy@ifoundanapple.com" class="text-brand-blue underline">privacy@ifoundanapple.app</a>.</p>
    `,
  },
};

// Apple Device Colors - Organized by category
export const APPLE_DEVICE_COLORS = {
  // iPhone Colors (Current and Popular)
  iPhone: [
    'Black',
    'White', 
    'Blue',
    'Pink',
    'Yellow',
    'Green',
    'Purple',
    'Red',
    'Starlight',
    'Midnight',
    'Silver',
    'Gold',
    'Rose Gold',
    'Space Gray',
    'Space Black',
    'Deep Purple',
    'Dynamic Island',
    'Natural Titanium',
    'Blue Titanium',
    'White Titanium',
    'Black Titanium'
  ],
  
  // iPad Colors
  iPad: [
    'Silver',
    'Space Gray',
    'Gold',
    'Rose Gold',
    'Green',
    'Blue',
    'Purple',
    'Pink',
    'Yellow',
    'Starlight',
    'Midnight'
  ],
  
  // Mac Colors
  Mac: [
    'Silver',
    'Space Gray',
    'Gold',
    'Rose Gold',
    'Starlight',
    'Midnight',
    'Space Black'
  ],
  
  // Apple Watch Colors
  AppleWatch: [
    'Silver',
    'Gold',
    'Space Gray',
    'Space Black',
    'Rose Gold',
    'Blue',
    'Green',
    'Red',
    'Purple',
    'Pink',
    'Starlight',
    'Midnight',
    'Natural Titanium',
    'Blue Titanium',
    'White Titanium',
    'Black Titanium'
  ],
  
  // AirPods Colors
  AirPods: [
    'White',
    'Silver',
    'Space Gray',
    'Gold',
    'Rose Gold',
    'Green',
    'Blue',
    'Purple',
    'Pink',
    'Yellow',
    'Orange',
    'Red'
  ],
  
  // General Apple Colors (for other devices)
  General: [
    'Silver',
    'Space Gray',
    'Gold',
    'Rose Gold',
    'White',
    'Black',
    'Blue',
    'Green',
    'Purple',
    'Pink',
    'Red',
    'Yellow',
    'Orange',
    'Starlight',
    'Midnight'
  ]
};

// Function to get colors based on device model
export const getColorsForDevice = (model: string): string[] => {
  if (model.toLowerCase().includes('iphone')) {
    return APPLE_DEVICE_COLORS.iPhone;
  } else if (model.toLowerCase().includes('ipad')) {
    return APPLE_DEVICE_COLORS.iPad;
  } else if (model.toLowerCase().includes('mac') || model.toLowerCase().includes('imac')) {
    return APPLE_DEVICE_COLORS.Mac;
  } else if (model.toLowerCase().includes('watch')) {
    return APPLE_DEVICE_COLORS.AppleWatch;
  } else if (model.toLowerCase().includes('airpods')) {
    return APPLE_DEVICE_COLORS.AirPods;
  } else {
    return APPLE_DEVICE_COLORS.General;
  }
};

/*
export const APPLE_DEVICE_MODELS = [
  'iPhone 15 Pro Max',
  'iPhone 15 Pro',
  'iPhone 15 Plus',
  'iPhone 15',
  'iPhone 14 Pro Max',
  'iPhone 14 Pro',
  'iPhone 14 Plus',
  'iPhone 14',
  'iPhone 13 Pro Max',
  'iPhone 13 Pro',
  'iPhone 13 mini',
  'iPhone 13',
  'iPhone SE (3rd generation)',
  'iPhone 12 Pro Max',
  'iPhone 12 Pro',
  'iPhone 12 mini',
  'iPhone 12',
  'iPhone 11 Pro Max',
  'iPhone 11 Pro',
  'iPhone 11',
  'iPhone XS Max',
  'iPhone XS',
  'iPhone XR',
  'iPhone X',
  'iPhone 8 Plus',
  'iPhone 8',
  'iPhone 7 Plus',
  'iPhone 7',
  'iPhone SE (2nd generation)',
  'iPhone 6s Plus',
  'iPhone 6s',
  'iPhone 6 Plus',
  'iPhone 6',
  'iPhone 5s',
  'iPhone 5c',
  'iPhone 5',
  'iPad Pro 12.9-inch (6th generation)',
  'iPad Pro 11-inch (4th generation)',
  'iPad Air (5th generation)',
  'iPad (10th generation)',
  'iPad mini (6th generation)',
  'iPad Pro 12.9-inch (5th generation)',
  'iPad Pro 11-inch (3rd generation)',
  'iPad Air (4th generation)',
  'iPad (9th generation)',
  'iPad mini (5th generation)',
  'iPad Pro 12.9-inch (4th generation)',
  'iPad Pro 11-inch (2nd generation)',
  'iPad Pro 10.5-inch',
  'iPad Pro 9.7-inch',
  'iPad (7th generation)',
  'iPad (6th generation)',
  'iPad (5th generation)',
  'iPad Air 2',
  'iPad mini 4',
  'iPad mini 3',
  'MacBook Air (M2, 2022)',
  'MacBook Air (M1, 2020)',
  'MacBook Pro 16-inch (M2 Max/Pro, 2023)',
  'MacBook Pro 14-inch (M2 Max/Pro, 2023)',
  'MacBook Pro 13-inch (M2, 2022)',
  'iMac 24-inch (M1, 2021)',
  'Mac mini (M2 Pro/M2, 2023)',
  'Mac Studio (M1 Ultra/Max, 2022)',
  'Mac Pro (2023)',
  'Apple Watch Ultra 2',
  'Apple Watch Series 9',
  'Apple Watch SE (2nd generation)',
  'Apple Watch Ultra',
  'Apple Watch Series 8',
  'Apple Watch Series 7',
  'Apple Watch Series 6',
  'Apple Watch Series 5',
  'Apple Watch Series 4',
  'Apple Watch Series 3',
  'AirPods Pro (2nd generation)',
  'AirPods Pro (1st generation)',
  'AirPods (3rd generation)',
  'AirPods (2nd generation)',
  'AirPods Max',
  'HomePod (2nd generation)',
  'HomePod mini',
  'Apple TV 4K (3rd generation)',
  'Apple TV HD',
  'AirTag',
  'Magic Keyboard',
  'Magic Mouse',
  'Magic Trackpad',
];
*/