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
    // Password Reset
    forgotPassword: "Forgot Password?",
    forgotPasswordDesc: "Enter your email address and we'll send you a link to reset your password.",
    resetPassword: "Reset Password",
    resetPasswordDesc: "Enter your new password below.",
    resetPasswordError: "An error occurred. Please try again.",
    emailSent: "Email Sent!",
    resetPasswordEmailSent: "We've sent a password reset link to your email. Please check your inbox.",
    sendResetLink: "Send Reset Link",
    sending: "Sending...",
    rememberPassword: "Remember your password?",
    backToLogin: "Back to Login",
    passwordResetSuccess: "Password Reset Successful!",
    passwordResetSuccessDesc: "Your password has been reset successfully. You can now log in with your new password.",
    invalidResetLink: "Invalid or expired reset link. Please request a new one.",
    passwordTooShort: "Password must be at least 6 characters long.",
    passwordsDoNotMatch: "Passwords do not match.",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    passwordMinLength: "Password must be at least 6 characters.",
    updatePassword: "Update Password",
    updating: "Updating...",
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
    escrowSystemDesc: "Your payment is held in our secure escrow account and will not be transferred until the device is delivered and confirmed. With Iyzico guarantee, you have cancellation and refund rights excluding 3.43% fee.",
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
    iyzico3DSecure: "3D Secure protected, PCI DSS certified secure payment. All Turkish banks are supported.",
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
      a2: "Absolutely. Your privacy is our top priority. We never share your personal information (name, email, etc.) with the other party. All communication and transactions are carried out anonymously and encrypted through the platform.",
      q3: "How is the reward amount determined?",
      a3: "We use an AI-powered mechanism that recommends a fair reward based on the device model and estimated second-hand market value.",
      q4: "What is the secure escrow system?",
      a4: "When a match is found, the device owner makes the payment. The payment is held in our secure escrow system. We securely hold the payment until the device's successful exchange is confirmed. This protects both the owner and the finder.",
      q5: "How does the physical exchange happen?",
      a5: "We carry out secure exchange processes with our partner cargo companies. The platform is designed to facilitate the process without requiring you to share personal contact information.",
      q6: "What are the fees?",
      a6: "Total fee breakdowns are as follows;\n\nSecure payment provider fee + Cargo company fee + Finder's reward + Service fee.\n\nThis helps us cover operational costs, maintain the platform, and ensure a secure environment for everyone."
    },
    termsContent: `
      <h2 class="text-2xl font-bold mb-4">TERMS OF SERVICE</h2>
      <p class="mb-4"><strong>Last Updated:</strong> October 14, 2025</p>

      <h3 class="text-xl font-semibold mb-2">1. CONTRACT SCOPE</h3>
      <p class="mb-4">These terms govern the legal relationship between the iFoundAnApple platform and users.</p>
      
      <p class="mb-4"><strong>Platform Owner:</strong> iFoundAnApple</p>
      <p class="mb-4"><strong>Contact:</strong> support@ifoundanapple.com</p>
      <p class="mb-4"><strong>Law:</strong> Republic of Turkey laws</p>

      <h4 class="text-lg font-semibold mb-2">1.1 Meaning of Acceptance</h4>
      <p class="mb-4">By registering on the platform, creating an account, or using the services, you are deemed to have accepted these Terms.</p>

      <h4 class="text-lg font-semibold mb-2">1.2 Right to Modify</h4>
      <p class="mb-4">We may modify these Terms with 7 days' notice. Changes are:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Communicated via email</li>
        <li>Announced on the website</li>
        <li>Sent as in-app notifications</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">2. PLATFORM SERVICES</h3>
      
      <h4 class="text-lg font-semibold mb-2">2.1 Services We Provide</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>✅ Lost Device Registration: Register Apple devices in the system</li>
        <li>✅ Found Device Notification: Report devices you found</li>
        <li>✅ Automatic Matching: Serial number-based matching</li>
        <li>✅ Anonymous System: Your identity information is kept confidential</li>
        <li>✅ Secure Payment: PCI-DSS compliant secure payment</li>
        <li>✅ Escrow System: Money is kept secure</li>
        <li>✅ Cargo Organization: Cargo company selection and tracking</li>
        <li>✅ Notification System: Real-time updates</li>
        <li>✅ AI-Powered Suggestions: Reward suggestions with Google Gemini</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">2.2 Services We Don't Provide</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>❌ Cargo Delivery: We don't provide cargo services</li>
        <li>❌ Physical Meetings: We don't physically bring parties together</li>
        <li>❌ Device Repair: We don't provide technical support</li>
        <li>❌ Legal Representation: We don't provide legal services</li>
        <li>❌ Warranty: Device condition or functionality is not guaranteed</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">3. REGISTRATION AND ACCOUNT MANAGEMENT</h3>
      
      <h4 class="text-lg font-semibold mb-2">3.1 Registration Requirements</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Must be 18 years or older</li>
        <li>Valid email address required</li>
        <li>Must provide accurate information</li>
        <li>Must reside in Turkey or EU countries</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.2 Registration Methods</h4>
      <p class="mb-2"><strong>Email Registration:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Name, surname, email, birth date, and password required</li>
        <li>Email verification mandatory</li>
      </ul>
      
      <p class="mb-2"><strong>OAuth Registration (Google / Apple):</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Third-party identity authentication</li>
        <li>Subject to OAuth provider terms</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.3 Account Security</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Keep your password strong and don't share it</li>
        <li>Don't share your account information with anyone</li>
        <li>Report suspicious activities immediately</li>
        <li>Each user can only open 1 account</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.4 Prohibited Account Activities</h4>
      <p class="mb-2">The following situations lead to account closure:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Using fake identity information</li>
        <li>Opening multiple accounts (for the same person)</li>
        <li>Using someone else's account</li>
        <li>Using bots or automated tools</li>
        <li>Attempting to manipulate the system</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">4. DEVICE OWNER RESPONSIBILITIES</h3>
      
      <h4 class="text-lg font-semibold mb-2">4.1 Legal Ownership</h4>
      <p class="mb-2">When adding a lost device:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>You declare that you are the legal owner of the device</li>
        <li>You must be able to provide ownership documents (invoice, warranty certificate)</li>
        <li>You commit that you are not reporting a stolen or fake device</li>
      </ul>
      <p class="mb-4"><strong>Important:</strong> Device registration is completely free. Payment is only requested when your device is found and the exchange process begins.</p>

      <h4 class="text-lg font-semibold mb-2">4.2 Providing Accurate Information</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>You must enter device model, serial number, and features correctly</li>
        <li>You must report device condition truthfully</li>
        <li>You must specify loss date and location as accurately as possible</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.3 Payment Obligation</h4>
      <p class="mb-2">When a match occurs:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>You commit to pay the determined reward amount</li>
        <li>You must make payment within 48 hours</li>
        <li>Fees include the following items:
          <ul class="list-disc pl-6 mt-2">
            <li>iFoundAnApple Service Fee</li>
            <li>Payment Provider Commission (Secure payment infrastructure cost)</li>
            <li>Cargo Fee (For your device to reach you safely)</li>
            <li>Reward for Device Finder (As a token of appreciation for their kind contribution)</li>
          </ul>
        </li>
        <li>You cannot cancel after payment is made (except for valid reasons)</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.4 Receiving Cargo</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>You must provide correct address information for cargo delivery</li>
        <li>You must check the cargo when you receive it</li>
        <li>You must press the "I Received, Confirm" button within 7 days</li>
        <li>If you don't confirm, automatic confirmation is given after 7 days</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">5. DEVICE FINDER RESPONSIBILITIES</h3>
      
      <h4 class="text-lg font-semibold mb-2">5.1 Honest Finding</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>You declare that you found the device in accordance with the law</li>
        <li>You commit that you did not steal the device or acquire it through illegal means</li>
        <li>You agree to deliver the device you found undamaged and complete</li>
      </ul>
      <p class="mb-4"><strong>Important:</strong> Found device registration is completely free. This civil and honorable behavior is invaluable to us.</p>

      <h4 class="text-lg font-semibold mb-2">5.2 Providing Accurate Information</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>You must enter device information correctly</li>
        <li>You must report finding date and location truthfully</li>
        <li>You must be transparent about the device's condition</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">5.3 Cargo Shipment</h4>
      <p class="mb-2">After payment is completed:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>You must deliver the device to cargo within 5 business days</li>
        <li>You must select a cargo company and enter the tracking number into the system</li>
        <li>You must send the device in its original condition, undamaged</li>
        <li>You commit not to interfere with the device (password cracking, part replacement)</li>
      </ul>
      
      <p class="mb-2"><strong>Cargo Fee:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Cargo fee (25 TL) is paid by the device owner</li>
        <li>You can deliver it to the cargo company as "cash on delivery"</li>
        <li>Or you can pay first and get it back together with the reward</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">5.4 Reward and IBAN/Bank Information</h4>
      <p class="mb-2"><strong>Reward Determination:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>The reward to be given to you is determined at a certain and fair rate based on the market value of the found device</li>
        <li>This way, we ensure you receive a small gift in return for your effort and exemplary behavior</li>
        <li>iFoundAnApple provides a secure exchange process to ensure the device reaches its owner safely and you receive your reward completely</li>
      </ul>
      
      <p class="mb-2"><strong>IBAN/Bank Information:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>You must provide a valid IBAN for reward payment</li>
        <li>You declare that the IBAN belongs to you</li>
        <li>You accept to fulfill your tax obligations</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">6. PAYMENTS, FEES AND ESCROW SYSTEM</h3>
      
      <h4 class="text-lg font-semibold mb-2">6.1 Reward System</h4>
      <p class="mb-2"><strong>Reward Determination:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Device owner freely determines the reward amount</li>
        <li>Minimum: 500 TL, Maximum: 50,000 TL</li>
        <li>AI suggestion system can be used (optional, Google Gemini)</li>
        <li>Reward should be a reasonable percentage of the device's market value</li>
      </ul>
      
      <p class="mb-2"><strong>Payment Timing:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Payment must be made within 48 hours when a match occurs</li>
        <li>If payment is not made, the match is cancelled</li>
        <li>Payment is taken into the escrow system and kept secure</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">6.2 Service Fees</h4>
      <p class="mb-2"><strong>Fees for Device Owner (v5.0 Formula):</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Gross Amount:</strong> Total amount received from customer (including Iyzico commission)</li>
        <li><strong>Iyzico Commission:</strong> 3.43% of gross amount (automatically deducted)</li>
        <li><strong>Net Amount:</strong> Amount remaining after Iyzico commission deduction</li>
        <li><strong>Cargo Fee:</strong> 250 TL (fixed)</li>
        <li><strong>Finder Reward:</strong> 20% of net amount</li>
        <li><strong>Service Fee:</strong> Net amount - cargo - reward (remaining)</li>
      </ul>

      <p class="mb-2"><strong>Example Calculation (Device Owner) - v5.0:</strong></p>
      <div class="bg-gray-100 p-4 rounded mb-4">
        <p><strong>Gross Amount:</strong> 2,000 TL (total received from customer)</p>
        <p>├── <strong>Iyzico Commission:</strong> 68.60 TL (3.43%) - Automatically deducted</p>
        <p>└── <strong>Net Amount:</strong> 1,931.40 TL (held in escrow system)</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;├── <strong>Cargo Fee:</strong> 250.00 TL (fixed)</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;├── <strong>Finder Reward:</strong> 386.28 TL (20%)</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;└── <strong>Service Fee:</strong> 1,295.12 TL (remaining)</p>
        <p>─────────────────────────────────────────</p>
        <p><strong>TOTAL:</strong> 68.60 + 250 + 386.28 + 1,295.12 = 2,000.00 TL ✅</p>
      </div>

      <p class="mb-2"><strong>Fees for Finder:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Net Receivable:</strong> Reward to finder (20% of net amount)</li>
        <li><strong>Transfer fee:</strong> May apply in bank transfer (approximately 5-10 TL)</li>
      </ul>

      <p class="mb-2"><strong>Example Calculation (Finder) - v5.0:</strong></p>
      <div class="bg-gray-100 p-4 rounded mb-4">
        <p><strong>Net Amount:</strong> 1,931.40 TL</p>
        <p><strong>Finder Reward (20%):</strong> 386.28 TL</p>
        <p>─────────────────────────────────────────</p>
        <p><strong>NET RECEIVABLE:</strong> 386.28 TL</p>
      </div>

      <h4 class="text-lg font-semibold mb-2">6.3 Escrow System</h4>
      <p class="mb-2"><strong>How It Works (v5.0):</strong></p>
      <ol class="list-decimal pl-6 mb-4">
        <li>Match occurs</li>
        <li>Device owner pays gross amount (within 48 hours)</li>
        <li>Iyzico commission (3.43%) is automatically deducted</li>
        <li>Net amount is held securely in escrow account (status: "held")</li>
        <li>Finder sends cargo (within 5 business days)</li>
        <li>Device owner receives cargo and presses "I Received, Confirm" button</li>
        <li>Net amount is distributed as follows:
          <ul class="list-disc pl-6 mt-2">
            <li>Cargo fee (250 TL) → Cargo company</li>
            <li>Finder reward (20%) → Finder's IBAN</li>
            <li>Service fee (remaining) → Platform</li>
          </ul>
        </li>
      </ol>

      <p class="mb-2"><strong>Escrow Duration (v5.0):</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Maximum waiting: 30 days</li>
        <li>Device owner confirmation: Net amount is released immediately</li>
        <li>If no confirmation: Automatic confirmation after 7 days</li>
        <li>If no delivery within 30 days: Gross amount automatically refunded (Iyzico commission deducted)</li>
      </ul>

      <p class="mb-2"><strong>Confirmation Process:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Only device owner gives confirmation (unilateral confirmation)</li>
        <li>Finder doesn't confirm, only sends cargo</li>
        <li>No bilateral confirmation system</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">6.4 Cancellation and Refund Policy</h4>
      <p class="mb-2"><strong>Right to Cancel:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>You have no right of withdrawal after payment is made (because service has started)</li>
        <li>Cancellation is possible by mutual agreement before cargo is sent</li>
      </ul>
      
      <p class="mb-2"><strong>Refund Conditions:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>If finder doesn't send cargo within 5 business days: Full refund</li>
        <li>If delivered device is different: Full refund + penalty to finder</li>
        <li>Cancellation due to technical issues: Full refund</li>
        <li>Cancellation by mutual agreement: Full refund</li>
      </ul>
      
      <p class="mb-2"><strong>Refund Deduction (v5.0):</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>If you request transaction cancellation during the exchange process, Iyzico commission (3.43%) is refunded with deduction</li>
        <li>If gross amount is paid and net amount is held in escrow: Net amount is fully refunded</li>
        <li>Cancellation must be made before cargo process begins</li>
        <li>After cancellation: Gross amount - Iyzico commission = Refund amount</li>
      </ul>
      
      <p class="mb-2"><strong>Refund Process:</strong></p>
      <ol class="list-decimal pl-6 mb-4">
        <li>Cancellation/refund request is created</li>
        <li>Platform reviews (1-3 business days)</li>
        <li>Decision is made</li>
        <li>If refund is approved, it is credited to account within 5-10 business days</li>
      </ol>

      <h4 class="text-lg font-semibold mb-2">6.5 Payment Methods</h4>
      <p class="mb-2"><strong>Accepted Payment Methods:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Credit card (Visa, Mastercard, American Express)</li>
        <li>Debit card</li>
        <li>Virtual card</li>
        <li>Apple Pay (for iPhone, iPad, Mac users)</li>
        <li>3D Secure mandatory (for security)</li>
      </ul>
      
      <p class="mb-2"><strong>Payment Security:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>PCI-DSS Level 1 certified secure payment infrastructure</li>
        <li>SSL/TLS encryption</li>
        <li>3D Secure verification</li>
        <li>Tokenization (card information is not stored with us)</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">7. CARGO PROCESS AND DELIVERY</h3>
      
      <h4 class="text-lg font-semibold mb-2">7.1 Platform's Role</h4>
      <p class="mb-4"><strong>Important:</strong> The platform is not a party to cargo delivery. Cargo is entirely handled by cargo companies.</p>
      
      <p class="mb-2"><strong>What Platform Provides:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Cargo company options (Aras, MNG, Yurtiçi, PTT)</li>
        <li>Cargo tracking system</li>
        <li>Delivery address sharing (anonymous system)</li>
        <li>Cargo status notifications</li>
      </ul>
      
      <p class="mb-2"><strong>What Platform Doesn't Provide:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Physical cargo delivery service</li>
        <li>Cargo courier organization</li>
        <li>Cargo insurance (must be obtained from cargo company)</li>
        <li>Cargo loss/damage guarantee</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">7.2 Cargo Companies</h4>
      <p class="mb-2"><strong>Supported Cargo Companies:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Aras Cargo</li>
        <li>MNG Cargo</li>
        <li>Yurtiçi Cargo</li>
        <li>PTT Cargo</li>
      </ul>
      <p class="mb-4">The person who finds the device selects one of these companies and delivers the device to the company with the cargo number received from the system.</p>

      <h4 class="text-lg font-semibold mb-2">7.3 Anonymous Identity System</h4>
      <p class="mb-2">To protect your privacy:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Anonymous code is given to finder: FND-XXX123</li>
        <li>Anonymous code is given to device owner: OWN-YYY456</li>
        <li>These codes are used in cargo shipment information</li>
        <li>Real identities are not shared with cargo company</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">7.4 Cargo Security Recommendations</h4>
      <p class="mb-2"><strong>For Sender (Finder):</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Take photos of device and package (before delivery)</li>
        <li>Always record tracking number</li>
      </ul>
      
      <p class="mb-2"><strong>For Receiver (Device Owner):</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Check package when receiving</li>
        <li>If there's damage, immediately file a report</li>
        <li>Document package opening with video/photos</li>
        <li>Verify device serial number</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">7.5 Cargo Tracking</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>You can track cargo status in real-time through the platform</li>
        <li>You receive automatic status updates:
          <ul class="list-disc pl-6 mt-2">
            <li>Cargo created</li>
            <li>Cargo collected</li>
            <li>At cargo branch</li>
            <li>Out for delivery</li>
            <li>Delivered</li>
          </ul>
        </li>
        <li>Estimated delivery date is shown</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">7.6 Delivery Issues</h4>
      <p class="mb-2"><strong>If Cargo is Lost:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Immediately contact cargo company</li>
        <li>Report to platform support team (support@ifoundanapple.com)</li>
        <li>Cargo company's insurance comes into effect</li>
        <li>Platform can take mediator role</li>
        <li>Money in escrow is refunded to device owner</li>
      </ul>
      
      <p class="mb-2"><strong>Damaged Delivery:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Check cargo when receiving</li>
        <li>If there's damage, file a report with cargo officer before receiving</li>
        <li>Immediately inform platform</li>
        <li>Provide photo/video evidence</li>
        <li>Refund process is initiated</li>
      </ul>
      
      <p class="mb-2"><strong>Wrong/Different Device:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Check serial number</li>
        <li>If different, don't confirm</li>
        <li>Report to support team</li>
        <li>Full refund process is initiated</li>
        <li>Penalty is applied to finder</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">8. ANONYMITY AND PRIVACY</h3>
      
      <h4 class="text-lg font-semibold mb-2">8.1 Identity Privacy</h4>
      <p class="mb-2"><strong>Before Match:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>No user information is shared</li>
        <li>Completely anonymous system</li>
      </ul>
      
      <p class="mb-2"><strong>After Match:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Identity:</strong> Remains HIDDEN</li>
        <li><strong>Email:</strong> Remains HIDDEN</li>
        <li><strong>Phone:</strong> Only shared with cargo company for delivery</li>
        <li><strong>Address:</strong> Only shared with cargo company for delivery</li>
      </ul>
      
      <p class="mb-2"><strong>Information Shared for Cargo:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Full name</li>
        <li>Delivery address</li>
        <li>Phone number</li>
        <li>Anonymous sender/receiver code (FND-XXX, OWN-XXX)</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">8.2 Communication</h4>
      <p class="mb-2"><strong>Platform Notifications:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Email notifications</li>
        <li>In-app notifications</li>
        <li>SMS notifications (for critical situations)</li>
      </ul>
      
      <p class="mb-2"><strong>Direct Communication:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>No direct messaging between users</li>
        <li>All communication is managed through the platform</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">9. PLATFORM RESPONSIBILITIES AND LIMITATIONS</h3>
      
      <h4 class="text-lg font-semibold mb-2">9.1 Our Platform Responsibilities</h4>
      <p class="mb-2"><strong>For Services We Provide:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Keep platform infrastructure operational</li>
        <li>Ensure data security</li>
        <li>Operate payment system securely</li>
        <li>Manage escrow correctly</li>
        <li>Provide customer support</li>
        <li>Take fraud prevention measures</li>
        <li>Comply with legal obligations</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">9.2 Liability Limitations</h4>
      <p class="mb-4"><strong>Platform is NOT RESPONSIBLE for:</strong></p>
      
      <p class="mb-2"><strong>Device and Delivery:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Actual condition of delivered device</li>
        <li>Device being functional/usable</li>
        <li>Physical damages or missing parts</li>
        <li>Whether device is original</li>
      </ul>
      
      <p class="mb-2"><strong>Cargo:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Cargo companies' errors, delays, losses</li>
        <li>Damaged delivery</li>
        <li>Cargo insurance (user responsibility)</li>
      </ul>
      
      <p class="mb-2"><strong>User Behavior:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Users providing wrong/incomplete information</li>
        <li>Fraud attempts (that we couldn't detect)</li>
        <li>Ownership disputes</li>
      </ul>
      
      <p class="mb-2"><strong>Third-Party Services:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Payment system interruptions</li>
        <li>OAuth provider issues</li>
        <li>Internet service provider interruptions</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">9.3 Compensation Limitation</h4>
      <p class="mb-2"><strong>Maximum Compensation:</strong></p>
      <p class="mb-4">In any case, the platform's responsibility is limited to the service fee amount received in the relevant transaction.</p>
      <p class="mb-4"><strong>Example:</strong> In a 5,000 TL reward transaction where platform fee is 150 TL, maximum compensation amount is 150 TL.</p>
      
      <p class="mb-2"><strong>Excluded Damages:</strong></p>
      <p class="mb-2">Platform cannot be held responsible for the following damages:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Indirect damages</li>
        <li>Loss of profit</li>
        <li>Reputation loss</li>
        <li>Moral damages</li>
        <li>Data loss</li>
        <li>Business loss</li>
      </ul>
      <p class="mb-4"><strong>Exception:</strong> These limitations don't apply if platform has intentional or gross negligence.</p>

      <h4 class="text-lg font-semibold mb-2">9.4 Service Guarantee and Interruptions</h4>
      <p class="mb-2"><strong>What We Don't Guarantee:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Uninterrupted service</li>
        <li>Error-free operation</li>
        <li>Guaranteed match finding</li>
        <li>Results within a specific time</li>
      </ul>
      
      <p class="mb-2"><strong>Planned Maintenance:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Announced in advance (at least 24 hours)</li>
        <li>Usually done during night hours</li>
        <li>Maximum 4 hours duration</li>
      </ul>
      
      <p class="mb-2"><strong>Emergency Maintenance:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>May not be announced in advance</li>
        <li>For security or critical errors</li>
        <li>Completed as soon as possible</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">10. PROHIBITED ACTIVITIES</h3>
      <p class="mb-2">The following activities are strictly prohibited:</p>
      
      <p class="mb-2"><strong>❌ Fraud:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Providing fake information</li>
        <li>Reporting stolen device</li>
        <li>Claiming someone else's device</li>
        <li>Fake serial number</li>
      </ul>
      
      <p class="mb-2"><strong>❌ Account Violations:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Using fake identity</li>
        <li>Opening multiple accounts</li>
        <li>Using someone else's account</li>
        <li>Bots or automated tools</li>
      </ul>
      
      <p class="mb-2"><strong>❌ System Manipulation:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Making off-platform agreements</li>
        <li>Attempting to bypass system</li>
        <li>Attempting to bypass escrow</li>
      </ul>
      
      <p class="mb-2"><strong>❌ Others:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Harassment, threats</li>
        <li>Intellectual property violation</li>
        <li>Virus, malicious software</li>
        <li>Data scraping</li>
      </ul>
      
      <p class="mb-2"><strong>Penalties:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Account closure</li>
        <li>Payment cancellation</li>
        <li>Legal action initiation</li>
        <li>Refund of earned amounts</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">11. ACCOUNT SUSPENSION AND TERMINATION</h3>
      
      <h4 class="text-lg font-semibold mb-2">11.1 Platform-Initiated Closure</h4>
      <p class="mb-2"><strong>Immediate Closure Reasons:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Fraud or fake information</li>
        <li>Stolen device report</li>
        <li>Fake identity</li>
        <li>Payment fraud</li>
        <li>Illegal activities</li>
      </ul>
      
      <p class="mb-2"><strong>Closure After Warning:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Continuously providing wrong information</li>
        <li>Violating platform rules</li>
        <li>Not fulfilling payment obligation (repeated)</li>
        <li>Not sending cargo (without valid reason)</li>
      </ul>
      
      <p class="mb-4"><strong>Suspension:</strong> Account may be temporarily suspended while investigating suspicious situations (maximum 30 days).</p>

      <h4 class="text-lg font-semibold mb-2">11.2 User-Initiated Account Closure</h4>
      <p class="mb-2"><strong>Closing Your Own Account:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>You can use "Delete Account" option from profile settings</li>
        <li>If there are ongoing transactions, closure cannot be done until completion</li>
        <li>If there are pending payments in escrow, they must be finalized</li>
      </ul>
      
      <p class="mb-2"><strong>Account Closure Results:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Your personal data is deleted within 30 days</li>
        <li>Your transaction history is anonymized</li>
        <li>Closed account cannot be reopened</li>
        <li>Financial records are kept for 10 years (legal requirement, anonymous)</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">12. FORCE MAJEURE</h3>
      <p class="mb-2">In the following force majeure situations, platform cannot be held responsible for its obligations:</p>
      
      <p class="mb-2"><strong>Natural Disasters:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Earthquake, flood, fire, storm</li>
      </ul>
      
      <p class="mb-2"><strong>Social Events:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>War, terrorism, uprising, curfew</li>
      </ul>
      
      <p class="mb-2"><strong>Technical Issues:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Internet infrastructure interruptions (ISP issues)</li>
        <li>Power outage</li>
        <li>Server provider (Supabase) interruptions</li>
        <li>Payment system interruptions</li>
        <li>DDoS attacks, cyber attacks</li>
      </ul>
      
      <p class="mb-2"><strong>Legal Changes:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Sudden law changes, bans, regulations</li>
      </ul>
      
      <p class="mb-2"><strong>Pandemic/Health Crisis:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Epidemic disease situations</li>
        <li>Official restrictions</li>
      </ul>
      
      <p class="mb-4">In force majeure situations, users are immediately informed and alternative solutions are provided.</p>

      <h3 class="text-xl font-semibold mb-2">13. DISPUTE RESOLUTION</h3>
      
      <h4 class="text-lg font-semibold mb-2">13.1 Communication and Support</h4>
      <p class="mb-2"><strong>First Step - Our Support Team:</strong></p>
      <p class="mb-2">If you experience any problem, first contact our support team:</p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Email:</strong> support@ifoundanapple.com</li>
        <li><strong>Response Time:</strong> 24-48 hours</li>
        <li><strong>Resolution Time:</strong> 5 business days (average)</li>
      </ul>
      
      <p class="mb-4"><strong>Mediation:</strong> If there's a dispute between users, platform can take mediator role (optional).</p>

      <h4 class="text-lg font-semibold mb-2">13.2 Applicable Law</h4>
      <p class="mb-4">This Agreement is subject to Republic of Turkey laws.</p>

      <h4 class="text-lg font-semibold mb-2">13.3 Competent Court and Enforcement Offices</h4>
      <p class="mb-2">For disputes arising from this Agreement:</p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>For users in Turkey:</strong> Istanbul (Çağlayan) Courts and Enforcement Offices are competent</li>
        <li><strong>For users in EU:</strong> Courts of user's residence are also competent (due to GDPR)</li>
      </ul>
      
      <p class="mb-2"><strong>Consumer Rights:</strong></p>
      <p class="mb-4">Consumers can apply to Consumer Arbitration Committees and Consumer Courts under the Law on Protection of Consumers.</p>
      
      <p class="mb-2"><strong>Consumer Arbitration Committee:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Web:</strong> https://tuketicihakemleri.ticaret.gov.tr</li>
        <li>Electronic application system is available</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">13.4 Alternative Dispute Resolution</h4>
      <p class="mb-2"><strong>Online Dispute Resolution (ODR):</strong></p>
      <p class="mb-2">Consumers in EU can use EU ODR platform:</p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Platform:</strong> https://ec.europa.eu/consumers/odr</li>
        <li><strong>Contact:</strong> info@ifoundanapple.com</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">14. INTELLECTUAL PROPERTY RIGHTS</h3>
      
      <h4 class="text-lg font-semibold mb-2">14.1 Platform's Rights</h4>
      <p class="mb-4">All content, design, logo, software code, algorithms on the platform are under iFoundAnApple's copyright.</p>
      
      <p class="mb-2"><strong>Prohibited Actions:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Copying or reproducing content</li>
        <li>Unauthorized use of logo</li>
        <li>Reverse engineering source code</li>
        <li>Data scraping (automatic data collection)</li>
        <li>Unauthorized use of API</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">14.2 User Content</h4>
      <p class="mb-4">Content you upload to the platform (photos, descriptions) is your intellectual property.</p>
      
      <p class="mb-2"><strong>License You Give to Platform:</strong></p>
      <p class="mb-2">By uploading content, you give the platform the following rights:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Display content on platform</li>
        <li>Store and process content</li>
        <li>Backup content</li>
        <li>Technically optimize (compression etc.)</li>
      </ul>
      <p class="mb-4">Platform doesn't use, sell, or share your content for other purposes.</p>

      <h3 class="text-xl font-semibold mb-2">15. MISCELLANEOUS PROVISIONS</h3>
      
      <h4 class="text-lg font-semibold mb-2">15.1 Making Notifications</h4>
      <p class="mb-2"><strong>From Platform to You:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Email (your registered email address)</li>
        <li>In-app notification</li>
        <li>SMS (for emergency situations)</li>
      </ul>
      
      <p class="mb-2"><strong>From You to Platform:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>General:</strong> info@ifoundanapple.com</li>
        <li><strong>Legal:</strong> legal@ifoundanapple.com</li>
        <li><strong>Security:</strong> security@ifoundanapple.com</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">15.2 Integrity of Agreement</h4>
      <p class="mb-4">These Terms constitute the entire agreement between the parties.</p>

      <h4 class="text-lg font-semibold mb-2">15.3 Partial Invalidity</h4>
      <p class="mb-4">If any provision of the Terms is deemed invalid, other provisions remain valid.</p>

      <h4 class="text-lg font-semibold mb-2">15.4 Prohibition of Assignment</h4>
      <p class="mb-4">Users cannot assign rights and obligations arising from this agreement to third parties.</p>
      <p class="mb-4">Platform can assign its rights in case of business transfer, merger, or acquisition.</p>

      <h4 class="text-lg font-semibold mb-2">15.5 Electronic Records</h4>
      <p class="mb-4">Platform's electronic records constitute definitive evidence under CCP 297.</p>

      <h3 class="text-xl font-semibold mb-2">16. CONTACT INFORMATION</h3>
      <p class="mb-2"><strong>iFoundAnApple</strong></p>
      
      <p class="mb-2"><strong>General Support:</strong></p>
      <p class="mb-4"><strong>Email:</strong> info@ifoundanapple.com</p>
      <p class="mb-4"><strong>Response Time:</strong> 24-48 hours</p>
      
      <p class="mb-2"><strong>Legal Affairs:</strong></p>
      <p class="mb-4"><strong>Email:</strong> legal@ifoundanapple.com</p>
      
      <p class="mb-2"><strong>Security:</strong></p>
      <p class="mb-4"><strong>Email:</strong> security@ifoundanapple.com</p>
      
      <p class="mb-2"><strong>Website:</strong></p>
      <p class="mb-4">https://ifoundanapple.com</p>

      <h3 class="text-xl font-semibold mb-2">17. ACCEPTANCE AND APPROVAL</h3>
      <ul class="list-disc pl-6 mb-4">
        <li>✅ I have read, understood, and accept these Terms of Service.</li>
        <li>✅ I declare that I am over 18 years old and have legal capacity.</li>
        <li>✅ By using the platform, I agree to comply with these Terms and Privacy Policy.</li>
        <li>✅ I consent to receiving email, SMS, and in-app notifications.</li>
      </ul>

      <div class="bg-gray-100 p-4 rounded mt-6">
        <p><strong>Last Updated:</strong> October 14, 2025</p>
        <p><strong>Version:</strong> 2.0</p>
        <p><strong>Validity:</strong> Turkey and European Union</p>
        <p><strong>© 2025 iFoundAnApple. All rights reserved.</strong></p>
      </div>
    `,
    privacyContent: `
      <h2 class="text-2xl font-bold mb-4">PRIVACY POLICY</h2>
      <p class="mb-4"><strong>Last Updated:</strong> October 14, 2025</p>

      <h3 class="text-xl font-semibold mb-2">1. DATA CONTROLLER</h3>
      <p class="mb-4"><strong>iFoundAnApple</strong></p>
      <p class="mb-4"><strong>Email:</strong> privacy@ifoundanapple.com</p>
      <p class="mb-4"><strong>Web:</strong> https://ifoundanapple.com</p>
      <p class="mb-4">This policy is prepared in accordance with KVKK and GDPR.</p>

      <h3 class="text-xl font-semibold mb-2">2. HOSTING AND DOMAIN INFORMATION</h3>
      <p class="mb-4"><strong>Domain Owner:</strong> iFoundAnApple</p>
      <p class="mb-4"><strong>Hosting Provider:</strong> Hetzner</p>
      <p class="mb-4"><strong>SSL Certificate:</strong> Active (HTTPS)</p>
      <p class="mb-4"><strong>Domain Verification:</strong> Hosted on our owned domain</p>
      <p class="mb-4"><strong>IMPORTANT:</strong> This privacy policy is hosted on our owned domain, not on third-party platforms such as Google Sites, Facebook, Instagram, Twitter.</p>

      <h3 class="text-xl font-semibold mb-2">3. COLLECTED PERSONAL DATA</h3>
      
      <h4 class="text-lg font-semibold mb-2">3.1 Registration and Authentication</h4>
      <p class="mb-2"><strong>Email Registration:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>First name, last name</li>
        <li>Email address</li>
        <li>Password (stored encrypted with bcrypt)</li>
        <li>Date of birth</li>
      </ul>
      
      <p class="mb-2"><strong>OAuth Login (Google/Apple):</strong></p>
      <p class="mb-2">When you sign in with Google or Apple, we collect the following user data:</p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Google User Data:</strong> Name, Email, Profile Picture (optional)</li>
        <li><strong>Purpose:</strong> Account creation and authentication ONLY</li>
        <li><strong>Data Protection:</strong> AES-256-GCM encryption at rest</li>
        <li><strong>Data Storage:</strong> Encrypted in our secure database (Supabase)</li>
        <li><strong>Data Sharing:</strong> Only with service providers for platform functionality (see Section 5.1)</li>
        <li><strong>Data Retention:</strong> Active account lifetime, deleted within 30 days after account deletion</li>
        <li>No need to create a password</li>
      </ul>
      <p class="mb-4"><strong>IMPORTANT:</strong> We use Google user data ONLY for providing platform functionality. We DO NOT use it for advertising, selling to third parties, or any other purpose.</p>

      <h4 class="text-lg font-semibold mb-2">3.2 Device Information</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Device model (iPhone 15 Pro, MacBook Air, etc.)</li>
        <li>Serial number</li>
        <li>Device color and description</li>
        <li>Lost/found date and location</li>
        <li>Invoice/ownership document (visual - can be deleted)</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.3 Payment and Financial Information</h4>
      <p class="mb-2"><strong>Payment Transactions:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Credit/bank card information processed by secure payment provider (PCI-DSS compliant)</li>
        <li>Your card information is not stored on our servers</li>
        <li>Transaction history and amounts are recorded</li>
      </ul>
      
      <p class="mb-2"><strong>Bank Information:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>IBAN number (for reward transfer)</li>
        <li>Account holder name</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.4 Profile and Contact Information</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>National ID Number (optional, for high-value transactions)</li>
        <li>Phone number</li>
        <li>Delivery address (for cargo)</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.5 Automatically Collected Data</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>IP address</li>
        <li>Browser and device information</li>
        <li>Session information</li>
        <li>Platform usage statistics</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">4. DATA USAGE PURPOSES</h3>
      
      <h4 class="text-lg font-semibold mb-2">4.1 Service Provision</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Matching lost and found devices (serial number based)</li>
        <li>User account management</li>
        <li>Cargo organization and tracking</li>
        <li>Sending notifications</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.2 Payment and Escrow Operations</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Secure payment processing</li>
        <li>Operating escrow system</li>
        <li>Transferring reward payments to IBAN</li>
        <li>Maintaining financial records</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.3 AI-Powered Recommendations</h4>
      <p class="mb-4">This feature is optional. We use device model information only for AI recommendations. Personal identity data is never shared.</p>

      <h4 class="text-lg font-semibold mb-2">4.4 Data Usage Limitations</h4>
      <p class="mb-2"><strong>Google User Data and Personal Data Usage:</strong></p>
      <p class="mb-2">We use your Google user data and personal information ONLY for:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>✅ Providing platform functionality (authentication, account management)</li>
        <li>✅ Processing transactions and payments</li>
        <li>✅ Organizing device delivery</li>
        <li>✅ Sending important service notifications</li>
        <li>✅ Improving user experience</li>
        <li>✅ Security and fraud prevention</li>
      </ul>
      <p class="mb-2"><strong>We DO NOT use your data for:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>❌ Targeted advertising or marketing</li>
        <li>❌ Selling to data brokers or information resellers</li>
        <li>❌ Determining credit-worthiness or lending purposes</li>
        <li>❌ User advertisements or personalized advertising</li>
        <li>❌ Training AI models unrelated to our service</li>
        <li>❌ Creating databases for other purposes</li>
        <li>❌ Any other purpose beyond providing or improving platform functionality</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.5 Security</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Fraud prevention</li>
        <li>Identity verification</li>
        <li>Audit log maintenance</li>
        <li>Security breach detection</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.6 Legal Compliance</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Compliance with KVKK and GDPR requirements</li>
        <li>Tax legislation obligations (10-year record keeping)</li>
        <li>Court decisions and legal processes</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">5. DATA SHARING</h3>
      
      <h4 class="text-lg font-semibold mb-2">5.1 Service Providers</h4>
      <p class="mb-2"><strong>Supabase (Backend Infrastructure):</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Database, authentication, file storage</li>
        <li>SOC 2 Type II, GDPR compliant</li>
        <li>Data location: USA/EU</li>
        <li><strong>Google User Data Shared:</strong> Name, Email (encrypted)</li>
      </ul>
      
      <p class="mb-2"><strong>Payment Provider:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Payment processing, 3D Secure, escrow</li>
        <li>PCI-DSS Level 1 certified</li>
        <li>Turkey-based</li>
        <li><strong>Google User Data Shared:</strong> Email (for transaction receipts only)</li>
      </ul>
      
      <p class="mb-2"><strong>Google/Apple (OAuth Authentication):</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Third-party login (optional)</li>
        <li>Used for authentication only</li>
      </ul>
      
      <p class="mb-2"><strong>Google Gemini (AI Recommendations):</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Only device model information is shared</li>
        <li>No Google user data (name, email) is shared</li>
        <li>No personal identity information is shared</li>
      </ul>
      
      <p class="mb-2"><strong>Cargo Companies (Aras, MNG, Yurtiçi, PTT):</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Delivery address and phone</li>
        <li>Anonymous sender/recipient codes (FND-XXX, OWN-XXX)</li>
        <li>Real identities (name, email) are kept confidential</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">5.2 Inter-User Sharing</h4>
      <p class="mb-4"><strong>IMPORTANT:</strong> Your identity, email, and phone number are never shared with other users.</p>
      
      <p class="mb-2"><strong>After Matching:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>The other party's identity remains anonymous</li>
        <li>Only "Match found" notification is sent</li>
        <li>Only delivery address is shared for cargo (name-surname and address)</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">5.3 Legal Obligation</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Court order or subpoena</li>
        <li>Law enforcement requests</li>
        <li>Tax authorities (for financial records)</li>
        <li>KVKK Institution requests</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">6. DATA SECURITY AND RETENTION</h3>
      
      <h4 class="text-lg font-semibold mb-2">6.1 Security Measures</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>SSL/TLS encryption (HTTPS) - TLS 1.3</li>
        <li>Password hashing (bcrypt)</li>
        <li><strong>Database encryption at rest (AES-256-GCM)</strong></li>
        <li><strong>Application-level encryption for sensitive data:</strong></li>
        <ul class="list-disc pl-6 mb-4">
          <li>Turkish National ID (TC Kimlik No)</li>
          <li>IBAN numbers</li>
          <li>Phone numbers</li>
          <li>Physical addresses</li>
          <li>Google user data (name, email)</li>
        </ul>
        <li>Row Level Security (RLS) policies</li>
        <li>OAuth 2.0 secure authentication tokens</li>
        <li>3D Secure payment verification</li>
        <li>Two-factor authentication (2FA) support</li>
        <li>Regular security audits and vulnerability assessments</li>
        <li>Access control logs and monitoring</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">6.2 Retention Periods</h4>
      
      <p class="mb-2"><strong>Google User Data Retention:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Active accounts:</strong> Retained while your account is active</li>
        <li><strong>Deleted accounts:</strong> Google user data (name, email) removed within 30 days</li>
        <li><strong>Financial data:</strong> 10 years (legal requirement - Tax Law)</li>
        <li><strong>You can request deletion:</strong> Email us at privacy@ifoundanapple.com</li>
      </ul>
      
      <p class="mb-2"><strong>Active Accounts:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Retained as long as your account is active</li>
      </ul>
      
      <p class="mb-2"><strong>Closed Accounts:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Deleted within 30 days after account closure</li>
        <li>Financial records retained for 10 years (legal obligation)</li>
        <li>Anonymous statistics can be retained indefinitely</li>
      </ul>
      
      <p class="mb-2"><strong>Transaction Records:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Financial transactions: 10 years</li>
        <li>Cargo records: 2 years</li>
        <li>Audit logs: 5 years</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">7. USER RIGHTS (KVKK & GDPR)</h3>
      
      <h4 class="text-lg font-semibold mb-2">7.1 Your Rights</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>✅ <strong>Right to Information:</strong> Learn whether your data is being processed</li>
        <li>✅ <strong>Right of Access:</strong> Obtain a copy of your data</li>
        <li>✅ <strong>Right to Rectification:</strong> Correct incorrect information</li>
        <li>✅ <strong>Right to Erasure:</strong> Delete your data (right to be forgotten)</li>
        <li>✅ <strong>Right to Object:</strong> Object to data processing activities</li>
        <li>✅ <strong>Data Portability:</strong> Transfer your data to another platform</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">6.2 Application Method</h4>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Email:</strong> privacy@ifoundanapple.com</li>
        <li><strong>Subject:</strong> KVKK/GDPR Application</li>
        <li><strong>Response Time:</strong> 30 days (maximum)</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">6.3 Right to Complain</h4>
      <p class="mb-2"><strong>Turkey:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Personal Data Protection Authority - https://www.kvkk.gov.tr</li>
      </ul>
      
      <p class="mb-2"><strong>EU:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Relevant country's Data Protection Authority</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">8. CHILDREN'S PRIVACY</h3>
      <p class="mb-4">The platform is not intended for users under 18. We do not knowingly collect data from persons under 18.</p>

      <h3 class="text-xl font-semibold mb-2">9. COOKIES</h3>
      <p class="mb-2"><strong>Cookies We Use:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Session management (mandatory)</li>
        <li>Language preferences (functional)</li>
        <li>Security (mandatory)</li>
      </ul>
      <p class="mb-4">You can manage cookies from your browser settings.</p>

      <h3 class="text-xl font-semibold mb-2">10. INTERNATIONAL DATA TRANSFER</h3>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Supabase:</strong> USA/EU data centers (GDPR compliant, SCC)</li>
        <li><strong>Payment Provider:</strong> International</li>
        <li><strong>Google:</strong> Global (for OAuth and AI)</li>
      </ul>
      <p class="mb-4">All transfers are made in accordance with KVKK and GDPR provisions.</p>

      <h3 class="text-xl font-semibold mb-2">11. CHANGES AND UPDATES</h3>
      <p class="mb-2">We may update this Privacy Policy from time to time. When important changes are made:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>We publish announcements on the website</li>
        <li>We send notifications via email</li>
        <li>"Last Updated" date is changed</li>
      </ul>
      <p class="mb-4">Updates take effect on the date they are published.</p>

      <h3 class="text-xl font-semibold mb-2">12. CONTACT</h3>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>General:</strong> info@ifoundanapple.com</li>
        <li><strong>Privacy:</strong> privacy@ifoundanapple.com</li>
        <li><strong>Security:</strong> security@ifoundanapple.com</li>
      </ul>

      <div class="bg-gray-100 p-4 rounded mt-6">
        <p><strong>© 2025 iFoundAnApple - Version 2.0</strong></p>
      </div>
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
    // Password Reset
    forgotPassword: "Şifrenizi Mi Unuttunuz?",
    forgotPasswordDesc: "E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.",
    resetPassword: "Şifre Sıfırla",
    resetPasswordDesc: "Yeni şifrenizi aşağıya girin.",
    resetPasswordError: "Bir hata oluştu. Lütfen tekrar deneyin.",
    emailSent: "E-posta Gönderildi!",
    resetPasswordEmailSent: "E-posta adresinize bir şifre sıfırlama bağlantısı gönderdik. Lütfen gelen kutunuzu kontrol edin.",
    sendResetLink: "Sıfırlama Bağlantısı Gönder",
    sending: "Gönderiliyor...",
    rememberPassword: "Şifrenizi hatırladınız mı?",
    backToLogin: "Girişe Dön",
    passwordResetSuccess: "Şifre Başarıyla Sıfırlandı!",
    passwordResetSuccessDesc: "Şifreniz başarıyla sıfırlandı. Artık yeni şifrenizle giriş yapabilirsiniz.",
    invalidResetLink: "Geçersiz veya süresi dolmuş sıfırlama bağlantısı. Lütfen yeni bir tane isteyin.",
    passwordTooShort: "Şifre en az 6 karakter uzunluğunda olmalıdır.",
    passwordsDoNotMatch: "Şifreler eşleşmiyor.",
    newPassword: "Yeni Şifre",
    confirmPassword: "Şifreyi Onayla",
    passwordMinLength: "Şifre en az 6 karakter olmalıdır.",
    updatePassword: "Şifreyi Güncelle",
    updating: "Güncelleniyor...",
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
    escrowSystemDesc: "Ödemeniz güvenli escrow hesabımızda tutulur ve cihaz teslim edilip onaylanana kadar karşı tarafa aktarılmaz. Ödeme altyapısı güvencesiyle iptal ve iade hakkınız saklıdır.",
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
    iyzico3DSecure: "3D Secure ile korumalı, PCI DSS sertifikalı güvenli ödeme. Tüm Türk bankaları desteklenir.",
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
      a2: "Kesinlikle. Gizliliğiniz bizim önceliğimizdir. Kişisel bilgilerinizi (isim, e-posta vb.) asla diğer tarafla paylaşmayız. Tüm iletişim ve işlemler platform üzerinden anonim ve şifreli olarak yürütülür.",
      q3: "Ödül miktarı nasıl belirleniyor?",
      a3: "Cihazın modeline ve tahmini ikinci el piyasa değerine göre adil bir ödül öneren yapay zeka destekli bir mekanizma kullanıyoruz.",
      q4: "Güvenli emanet (escrow) sistemi nedir?",
      a4: "Bir eşleşme bulunduğunda, cihaz sahibi ödemesini yapar. Ödeme güvenli emanet sisteminde bekletilir. Cihazın başarıyla takas edildiği onaylanana kadar ödemeyi güvenli bir şekilde tutarız. Bu, hem sahibini hem de bulanı korur.",
      q5: "Fiziksel takas nasıl gerçekleşiyor?",
      a5: "Güvenli takas süreçlerini anlaşmalı olduğumuz kargo firmaları ile yürütüyoruz. Platform, kişisel iletişim bilgilerinizi paylaşmanıza gerek kalmadan süreci kolaylaştırmak için tasarlanmıştır.",
      q6: "Ücretler nelerdir?",
      a6: "Toplam ücret kırılımları aşağıdaki gibidir;\n\nGüvenli ödeme sağlayıcı ücreti + Kargo firması ücreti + Bulan kişinin ödülü + Hizmet bedeli.\n\nBu, operasyonel maliyetleri karşılamamıza, platformu sürdürmemize ve herkes için güvenli bir ortam sağlamamıza yardımcı olur."
    },
    termsContent: `
      <h2 class="text-2xl font-bold mb-4">HİZMET ŞARTLARI</h2>
      <p class="mb-4"><strong>Son Güncelleme:</strong> 14 Ekim 2025</p>

      <h3 class="text-xl font-semibold mb-2">1. SÖZLEŞME KAPSAMI</h3>
      <p class="mb-4">Bu şartlar, iFoundAnApple platformu ile kullanıcılar arasındaki hukuki ilişkiyi düzenler.</p>
      
      <p class="mb-4"><strong>Platform Sahibi:</strong> iFoundAnApple</p>
      <p class="mb-4"><strong>İletişim:</strong> support@ifoundanapple.com</p>
      <p class="mb-4"><strong>Hukuk:</strong> Türkiye Cumhuriyeti kanunları</p>

      <h4 class="text-lg font-semibold mb-2">1.1 Kabulün Anlamı</h4>
      <p class="mb-4">Platforma kayıt olarak, hesap oluşturarak veya hizmetleri kullanarak bu Şartları kabul etmiş sayılırsınız.</p>

      <h4 class="text-lg font-semibold mb-2">1.2 Değişiklik Hakkı</h4>
      <p class="mb-4">Bu Şartları 7 gün önceden bildirimle değiştirebiliriz. Değişiklikler:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>E-posta ile bildirilir</li>
        <li>Web sitesinde duyurulur</li>
        <li>Uygulama içi bildirim gönderilir</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">2. PLATFORMUN HİZMETLERİ</h3>
      
      <h4 class="text-lg font-semibold mb-2">2.1 Sunduğumuz Hizmetler</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>✅ Kayıp Cihaz Kaydı: Apple cihazlarını sisteme kaydetme</li>
        <li>✅ Bulunan Cihaz Bildirimi: Bulduğunuz cihazları bildirme</li>
        <li>✅ Otomatik Eşleştirme: Seri numarası bazlı eşleştirme</li>
        <li>✅ Anonim Sistem: Kimlik bilgileriniz gizli tutulur</li>
        <li>✅ Güvenli Ödeme: PCI-DSS uyumlu güvenli ödeme</li>
        <li>✅ Escrow Sistemi: Para güvende tutulur</li>
        <li>✅ Kargo Organizasyonu: Kargo şirketi seçimi ve takip</li>
        <li>✅ Bildirim Sistemi: Gerçek zamanlı güncellemeler</li>
        <li>✅ AI Destekli Öneriler: Google Gemini ile ödül önerileri</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">2.2 Sunmadığımız Hizmetler</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>❌ Kargo Teslimatı: Kargo hizmetini biz sağlamıyoruz</li>
        <li>❌ Fiziksel Buluşma: Tarafları fiziksel olarak buluşturmuyoruz</li>
        <li>❌ Cihaz Onarımı: Teknik destek vermiyoruz</li>
        <li>❌ Hukuki Temsil: Avukatlık hizmeti sunmuyoruz</li>
        <li>❌ Garanti: Cihazın durumu veya çalışması garantilenmez</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">3. KAYIT VE HESAP YÖNETİMİ</h3>
      
      <h4 class="text-lg font-semibold mb-2">3.1 Kayıt Şartları</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>18 yaş ve üzeri olmalısınız</li>
        <li>Geçerli e-posta adresi gereklidir</li>
        <li>Doğru bilgiler vermelisiniz</li>
        <li>Türkiye veya AB ülkelerinde ikamet etmelisiniz</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.2 Kayıt Yöntemleri</h4>
      <p class="mb-2"><strong>E-posta ile Kayıt:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Ad, soyad, e-posta, doğum tarihi ve şifre gereklidir</li>
        <li>E-posta doğrulaması zorunludur</li>
      </ul>
      
      <p class="mb-2"><strong>OAuth ile Kayıt (Google / Apple):</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Üçüncü taraf kimlik doğrulama</li>
        <li>OAuth sağlayıcısının şartlarına tabi</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.3 Hesap Güvenliği</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Şifrenizi güçlü tutun ve paylaşmayın</li>
        <li>Hesap bilgilerinizi kimseyle paylaşmayın</li>
        <li>Şüpheli aktiviteleri derhal bildirin</li>
        <li>Her kullanıcı sadece 1 hesap açabilir</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.4 Yasak Hesap Faaliyetleri</h4>
      <p class="mb-2">Aşağıdaki durumlar hesap kapatmaya yol açar:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Sahte kimlik bilgileri kullanma</li>
        <li>Birden fazla hesap açma (aynı kişi için)</li>
        <li>Başkasının hesabını kullanma</li>
        <li>Bot veya otomatik araçlar kullanma</li>
        <li>Sistemi manipüle etmeye çalışma</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">4. CİHAZ SAHİBİNİN SORUMLULUKLARI</h3>
      
      <h4 class="text-lg font-semibold mb-2">4.1 Yasal Sahiplik</h4>
      <p class="mb-2">Kayıp cihaz eklerken:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Cihazın yasal sahibi olduğunuzu beyan edersiniz</li>
        <li>Sahiplik belgesi (fatura, garanti belgesi) sunabilmelisiniz</li>
        <li>Çalıntı veya sahte cihaz bildirimi yapmadığınızı taahhüt edersiniz</li>
      </ul>
      <p class="mb-4"><strong>Önemli:</strong> Cihaz kaydı tamamen ücretsizdir. Ödeme yalnızca cihazınız bulunduğunda ve takas süreci başlatıldığında talep edilir.</p>

      <h4 class="text-lg font-semibold mb-2">4.2 Doğru Bilgi Verme</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Cihaz modeli, seri numarası ve özelliklerini doğru girmelisiniz</li>
        <li>Cihaz durumunu gerçeğe uygun bildirmelisiniz</li>
        <li>Kayıp tarihi ve konumu mümkün olduğunca doğru belirtmelisiniz</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.3 Ödeme Yükümlülüğü</h4>
      <p class="mb-2">Eşleşme gerçekleştiğinde:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Belirlenen ödül tutarını ödemeyi taahhüt edersiniz</li>
        <li>48 saat içinde ödeme yapmalısınız</li>
        <li>Ücretlendirme şu kalemleri kapsar:
          <ul class="list-disc pl-6 mt-2">
            <li>iFoundAnApple Hizmet Bedeli</li>
            <li>Ödeme Sağlayıcı Komisyonu (Güvenli ödeme altyapısı maliyeti)</li>
            <li>Kargo Bedeli (Cihazınızın size güvenle ulaştırılması için)</li>
            <li>Cihazı Bulan Kişiye Verilecek Ödül (Nazik katkısı için teşekkür niteliğinde)</li>
          </ul>
        </li>
        <li>Ödeme yapıldıktan sonra iptal edemezsiniz (geçerli sebepler hariç)</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.4 Kargo Teslim Alma</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Kargonun teslim edilmesi için doğru adres bilgisi vermelisiniz</li>
        <li>Kargoyu teslim aldığınızda kontrol etmelisiniz</li>
        <li>7 gün içinde "Teslim Aldım, Onayla" butonuna basmalısınız</li>
        <li>Onay vermezseniz 7 gün sonra otomatik onay verilir</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">5. CİHAZI BULAN KİŞİNİN SORUMLULUKLARI</h3>
      
      <h4 class="text-lg font-semibold mb-2">5.1 Dürüst Bulgu</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Cihazı yasalara uygun şekilde bulduğunuzu beyan edersiniz</li>
        <li>Cihazı çalmadığınızı veya yasadışı yollarla edinmediğinizi taahhüt edersiniz</li>
        <li>Bulduğunuz cihazı hasarsız ve eksiksiz teslim etmeyi kabul edersiniz</li>
      </ul>
      <p class="mb-4"><strong>Önemli:</strong> Bulunan cihaz kaydı tamamen ücretsizdir. Bu medeni ve onurlu davranış, bizim için paha biçilemez bir değer taşır.</p>

      <h4 class="text-lg font-semibold mb-2">5.2 Doğru Bilgi Verme</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Cihaz bilgilerini doğru girmelisiniz</li>
        <li>Bulunma tarihi ve konumunu gerçeğe uygun bildirmelisiniz</li>
        <li>Cihazın durumu hakkında şeffaf olmalısınız</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">5.3 Kargo Gönderimi</h4>
      <p class="mb-2">Ödeme tamamlandıktan sonra:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>5 iş günü içinde cihazı kargoya vermelisiniz</li>
        <li>Kargo şirketi seçip takip numarasını sisteme girmelisiniz</li>
        <li>Cihazı orijinal haliyle, hasarsız göndermelisiniz</li>
        <li>Cihaza müdahale etmemeyi (şifre kırma, parça değişimi) taahhüt edersiniz</li>
      </ul>
      
      <p class="mb-2"><strong>Kargo Ücreti:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Kargo ücreti (25 TL) cihaz sahibi tarafından ödenmiştir</li>
        <li>Kargo şirketine "ödemeli gönderi" olarak teslim edebilirsiniz</li>
        <li>Veya önce siz ödeyip sonra ödül ile birlikte geri alabilirsiniz</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">5.4 Ödül ve IBAN/Banka Bilgileri</h4>
      <p class="mb-2"><strong>Ödül Belirleme:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Size iletilecek ödül, bulunan cihazın piyasa değeri üzerinden belirli ve adil bir oran dahilinde belirlenir</li>
        <li>Bu sayede, gösterdiğiniz çabanın ve örnek davranışın karşılığında küçük bir hediye almanızı sağlıyoruz</li>
        <li>iFoundAnApple, cihazın güvenli bir şekilde sahibine ulaşmasını ve sizin ödülünüzü eksiksiz almanızı sağlayacak güvenli bir takas süreci sunar</li>
      </ul>
      
      <p class="mb-2"><strong>IBAN/Banka Bilgileri:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Ödül ödemesi için geçerli bir IBAN sağlamalısınız</li>
        <li>IBAN'ın size ait olduğunu beyan edersiniz</li>
        <li>Vergi yükümlülüklerinizi yerine getirmeyi kabul edersiniz</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">6. ÖDEMELER, ÜCRETLER VE ESCROW SİSTEMİ</h3>
      
      <h4 class="text-lg font-semibold mb-2">6.1 Ödül Sistemi</h4>
      <p class="mb-2"><strong>Ödül Belirleme:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Cihaz sahibi ödül tutarını özgürce belirler</li>
        <li>Minimum: 500 TL, Maksimum: 50.000 TL</li>
        <li>AI öneri sistemi kullanılabilir (isteğe bağlı, Google Gemini)</li>
        <li>Ödül, cihazın piyasa değerinin makul bir oranı olmalıdır</li>
      </ul>
      
      <p class="mb-2"><strong>Ödeme Zamanlaması:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Eşleşme gerçekleştiğinde 48 saat içinde ödeme yapılmalıdır</li>
        <li>Ödeme yapılmazsa eşleşme iptal edilir</li>
        <li>Ödeme escrow sistemine alınır ve güvende bekletilir</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">6.2 Hizmet Bedelleri</h4>
      <p class="mb-2"><strong>Cihaz Sahibi için Ücretler (v5.0 Formülü):</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Gross Tutar:</strong> Müşteriden alınan toplam tutar (İyzico komisyonu dahil)</li>
        <li><strong>İyzico Komisyonu:</strong> Gross tutarın %3.43'ü (otomatik kesilir)</li>
        <li><strong>Net Tutar:</strong> İyzico komisyonu düşüldükten sonra kalan tutar</li>
        <li><strong>Kargo Ücreti:</strong> 250 TL (sabit)</li>
        <li><strong>Bulan Kişi Ödülü:</strong> Net tutarın %20'si</li>
        <li><strong>Hizmet Bedeli:</strong> Net tutar - kargo - ödül (geriye kalan)</li>
      </ul>

      <p class="mb-2"><strong>Örnek Hesaplama (Cihaz Sahibi) - v5.0:</strong></p>
      <div class="bg-gray-100 p-4 rounded mb-4">
        <p><strong>Gross Tutar:</strong> 2.000 TL (müşteriden alınan toplam)</p>
        <p>├── <strong>İyzico Komisyonu:</strong> 68.60 TL (%3.43) - Otomatik kesilir</p>
        <p>└── <strong>Net Tutar:</strong> 1.931.40 TL (emanet sisteminde tutulan)</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;├── <strong>Kargo Ücreti:</strong> 250.00 TL (sabit)</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;├── <strong>Bulan Kişi Ödülü:</strong> 386.28 TL (%20)</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;└── <strong>Hizmet Bedeli:</strong> 1.295.12 TL (geriye kalan)</p>
        <p>─────────────────────────────────────────</p>
        <p><strong>TOPLAM:</strong> 68.60 + 250 + 386.28 + 1.295.12 = 2.000.00 TL ✅</p>
      </div>

      <p class="mb-2"><strong>Bulan Kişi için Ücretler:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Net Alacak:</strong> Bulan kişiye ödül (net tutarın %20'si)</li>
        <li><strong>Transfer ücreti:</strong> Banka transferinde uygulanabilir (yaklaşık 5-10 TL)</li>
      </ul>

      <p class="mb-2"><strong>Örnek Hesaplama (Bulan Kişi) - v5.0:</strong></p>
      <div class="bg-gray-100 p-4 rounded mb-4">
        <p><strong>Net Tutar:</strong> 1.931.40 TL</p>
        <p><strong>Bulan Kişi Ödülü (%20):</strong> 386.28 TL</p>
        <p>─────────────────────────────────────────</p>
        <p><strong>NET ALACAK:</strong> 386.28 TL</p>
      </div>

      <h4 class="text-lg font-semibold mb-2">6.3 Escrow (Emanet) Sistemi</h4>
      <p class="mb-2"><strong>Nasıl Çalışır (v5.0):</strong></p>
      <ol class="list-decimal pl-6 mb-4">
        <li>Eşleşme gerçekleşir</li>
        <li>Cihaz sahibi gross tutarı öder (48 saat içinde)</li>
        <li>İyzico komisyonu (%3.43) otomatik kesilir</li>
        <li>Net tutar escrow hesabında güvende tutulur (status: "held")</li>
        <li>Bulan kişi kargoyu gönderir (5 iş günü içinde)</li>
        <li>Cihaz sahibi kargoyu alır ve "Teslim Aldım, Onayla" butonuna basar</li>
        <li>Net tutar şu şekilde dağıtılır:
          <ul class="list-disc pl-6 mt-2">
            <li>Kargo ücreti (250 TL) → Kargo firması</li>
            <li>Bulan kişi ödülü (%20) → Bulan kişinin IBAN'ına</li>
            <li>Hizmet bedeli (geriye kalan) → Platform</li>
          </ul>
        </li>
      </ol>

      <p class="mb-2"><strong>Escrow Süresi (v5.0):</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Maksimum bekleme: 30 gün</li>
        <li>Cihaz sahibi onayı: Anında net tutar serbest bırakılır</li>
        <li>Onay verilmezse: 7 gün sonra otomatik onay</li>
        <li>30 gün içinde teslimat olmazsa: Gross tutar otomatik iade (İyzico komisyonu kesintili)</li>
      </ul>

      <p class="mb-2"><strong>Onay Süreci:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Sadece cihaz sahibi onay verir (tek taraflı onay)</li>
        <li>Bulan kişi onay vermez, sadece kargoyu gönderir</li>
        <li>İki taraflı onay sistemi yoktur</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">6.4 İptal ve İade Politikası</h4>
      <p class="mb-2"><strong>İptal Hakkı:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Ödeme yapıldıktan sonra cayma hakkınız yoktur (hizmet başladığı için)</li>
        <li>Kargo gönderilmeden önce karşılıklı anlaşmayla iptal mümkündür</li>
      </ul>
      
      <p class="mb-2"><strong>İade Koşulları:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Bulan kişi 5 iş günü içinde kargo göndermezse: Tam iade</li>
        <li>Teslim edilen cihaz farklıysa: Tam iade + bulan kişiye yaptırım</li>
        <li>Teknik sorunlardan kaynaklanan iptal: Tam iade</li>
        <li>Karşılıklı anlaşma ile iptal: Tam iade</li>
      </ul>
      
      <p class="mb-2"><strong>İade Kesintisi (v5.0):</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Takas sürecinde işlem iptali talep etmeniz halinde, İyzico komisyonu (%3.43) kesintili olarak iade edilir</li>
        <li>Gross tutar ödenmiş, net tutar escrow'da tutulmuşsa: Net tutar tamamen iade edilir</li>
        <li>Kargo süreci başlamadan iptal yapılmalıdır</li>
        <li>İptal sonrası: Gross tutar - İyzico komisyonu = İade tutarı</li>
      </ul>
      
      <p class="mb-2"><strong>İade Süreci:</strong></p>
      <ol class="list-decimal pl-6 mb-4">
        <li>İptal/iade talebi oluşturulur</li>
        <li>Platform inceleme yapar (1-3 iş günü)</li>
        <li>Karar verilir</li>
        <li>İade onaylanırsa 5-10 iş günü içinde hesaba geçer</li>
      </ol>

      <h4 class="text-lg font-semibold mb-2">6.5 Ödeme Yöntemleri</h4>
      <p class="mb-2"><strong>Kabul Edilen Ödeme Yöntemleri:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Kredi kartı (Visa, Mastercard, American Express)</li>
        <li>Banka kartı (debit card)</li>
        <li>Sanal kart</li>
        <li>Apple Pay (iPhone, iPad, Mac kullanıcıları için)</li>
        <li>3D Secure zorunlu (güvenlik için)</li>
      </ul>
      
      <p class="mb-2"><strong>Ödeme Güvenliği:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>PCI-DSS Level 1 sertifikalı güvenli ödeme altyapısı</li>
        <li>SSL/TLS şifreleme</li>
        <li>3D Secure doğrulama</li>
        <li>Tokenization (kart bilgileri bizde saklanmaz)</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">7. KARGO SÜRECİ VE TESLİMAT</h3>
      
      <h4 class="text-lg font-semibold mb-2">7.1 Platform'un Rolü</h4>
      <p class="mb-4"><strong>Önemli:</strong> Platform, kargo teslimatının tarafı değildir. Kargo tamamen kargo şirketleri tarafından gerçekleştirilir.</p>
      
      <p class="mb-2"><strong>Platform Sağladıkları:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Kargo şirketi seçenekleri (Aras, MNG, Yurtiçi, PTT)</li>
        <li>Kargo takip sistemi</li>
        <li>Teslimat adresi paylaşımı (anonim sistem)</li>
        <li>Kargo durum bildirimleri</li>
      </ul>
      
      <p class="mb-2"><strong>Platform Sağlamadıkları:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Fiziksel kargo teslimat hizmeti</li>
        <li>Kargo kurye organizasyonu</li>
        <li>Kargo sigortası (kargo şirketinden alınmalı)</li>
        <li>Kargo kayıp/hasar garantisi</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">7.2 Kargo Şirketleri</h4>
      <p class="mb-2"><strong>Desteklenen Kargo Firmaları:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Aras Kargo</li>
        <li>MNG Kargo</li>
        <li>Yurtiçi Kargo</li>
        <li>PTT Kargo</li>
      </ul>
      <p class="mb-4">Cihazı bulan kişi bu firmalardan birini seçer ve sistemden aldığı kargo numarası ile cihazı firmaya teslim eder.</p>

      <h4 class="text-lg font-semibold mb-2">7.3 Anonim Kimlik Sistemi</h4>
      <p class="mb-2">Gizliliğinizi korumak için:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Bulan kişiye anonim kod verilir: FND-XXX123</li>
        <li>Cihaz sahibine anonim kod verilir: OWN-YYY456</li>
        <li>Kargo gönderi bilgilerinde bu kodlar kullanılır</li>
        <li>Gerçek kimlikler kargo şirketiyle paylaşılmaz</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">7.4 Kargo Güvenliği Önerileri</h4>
      <p class="mb-2"><strong>Gönderen İçin (Bulan Kişi):</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Cihazın ve paketin fotoğrafını çekin (teslimat öncesi)</li>
        <li>Takip numarasını mutlaka kaydedin</li>
      </ul>
      
      <p class="mb-2"><strong>Alan İçin (Cihaz Sahibi):</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Paketi teslim alırken kontrol edin</li>
        <li>Hasar varsa hemen tutanak tutturun</li>
        <li>Paket açılışını video/fotoğraf ile belgeleyin</li>
        <li>Cihazın seri numarasını doğrulayın</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">7.5 Kargo Takibi</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Platform üzerinden kargo durumunu anlık takip edebilirsiniz</li>
        <li>Otomatik durum güncellemeleri alırsınız:
          <ul class="list-disc pl-6 mt-2">
            <li>Kargo oluşturuldu</li>
            <li>Kargo toplandı</li>
            <li>Kargodaki şubede</li>
            <li>Dağıtıma çıktı</li>
            <li>Teslim edildi</li>
          </ul>
        </li>
        <li>Tahmini teslimat tarihi gösterilir</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">7.6 Teslimat Sorunları</h4>
      <p class="mb-2"><strong>Kargo Kaybolursa:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Hemen kargo şirketiyle iletişime geçin</li>
        <li>Platform destek ekibine bildirin (support@ifoundanapple.com)</li>
        <li>Kargo şirketinin sigortası devreye girer</li>
        <li>Platform arabulucu rolü üstlenebilir</li>
        <li>Escrow'daki para cihaz sahibine iade edilir</li>
      </ul>
      
      <p class="mb-2"><strong>Hasarlı Teslimat:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Kargoyu teslim alırken kontrol edin</li>
        <li>Hasar varsa teslim almadan kargo görevlisine tutanak tutturun</li>
        <li>Platform'u hemen bilgilendirin</li>
        <li>Fotoğraf/video kanıtı sağlayın</li>
        <li>İade süreci başlatılır</li>
      </ul>
      
      <p class="mb-2"><strong>Yanlış/Farklı Cihaz:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Seri numarasını kontrol edin</li>
        <li>Farklıysa onaylamayın</li>
        <li>Destek ekibine bildirin</li>
        <li>Tam iade işlemi başlatılır</li>
        <li>Bulan kişiye yaptırım uygulanır</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">8. ANONİMLİK VE GİZLİLİK</h3>
      
      <h4 class="text-lg font-semibold mb-2">8.1 Kimlik Gizliliği</h4>
      <p class="mb-2"><strong>Eşleşme Öncesi:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Hiçbir kullanıcı bilgisi paylaşılmaz</li>
        <li>Tamamen anonim sistem</li>
      </ul>
      
      <p class="mb-2"><strong>Eşleşme Sonrası:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Kimlik:</strong> GİZLİ kalır</li>
        <li><strong>E-posta:</strong> GİZLİ kalır</li>
        <li><strong>Telefon:</strong> Sadece kargo firması ile teslimat için paylaşılır</li>
        <li><strong>Adres:</strong> Sadece kargo firması ile teslimat için paylaşılır</li>
      </ul>
      
      <p class="mb-2"><strong>Kargo İçin Paylaşılan Bilgiler:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Ad-soyad</li>
        <li>Teslimat adresi</li>
        <li>Telefon numarası</li>
        <li>Anonim gönderici/alıcı kodu (FND-XXX, OWN-XXX)</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">8.2 İletişim</h4>
      <p class="mb-2"><strong>Platform İçi Bildirimler:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>E-posta bildirimleri</li>
        <li>Uygulama içi bildirimler</li>
        <li>SMS bildirimleri (kritik durumlar için)</li>
      </ul>
      
      <p class="mb-2"><strong>Direkt İletişim:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Kullanıcılar arasında direkt mesajlaşma yoktur</li>
        <li>Tüm iletişim platform üzerinden yönetilir</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">9. PLATFORM SORUMLULUKLARI VE SINIRLAMALAR</h3>
      
      <h4 class="text-lg font-semibold mb-2">9.1 Platform Sorumluluklarımız</h4>
      <p class="mb-2"><strong>Sağladığımız Hizmetler İçin:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Platform altyapısını çalışır halde tutmak</li>
        <li>Veri güvenliğini sağlamak</li>
        <li>Ödeme sistemini güvenli işletmek</li>
        <li>Escrow'u doğru yönetmek</li>
        <li>Müşteri desteği sunmak</li>
        <li>Dolandırıcılık önlemleri almak</li>
        <li>Yasal yükümlülüklere uymak</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">9.2 Sorumluluk Sınırlamaları</h4>
      <p class="mb-4"><strong>Platform SORUMLU DEĞİLDİR:</strong></p>
      
      <p class="mb-2"><strong>Cihaz ve Teslimat:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Teslim edilen cihazın gerçek durumu</li>
        <li>Cihazın çalışır/kullanılabilir olması</li>
        <li>Fiziksel hasarlar veya eksiklikler</li>
        <li>Cihazın orijinal olup olmadığı</li>
      </ul>
      
      <p class="mb-2"><strong>Kargo:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Kargo şirketlerinin hataları, gecikmeler, kayıplar</li>
        <li>Hasarlı teslimat</li>
        <li>Kargo sigortası (kullanıcı sorumluluğu)</li>
      </ul>
      
      <p class="mb-2"><strong>Kullanıcı Davranışları:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Kullanıcıların verdikleri yanlış/eksik bilgiler</li>
        <li>Dolandırıcılık girişimleri (tespit edemediğimiz)</li>
        <li>Sahiplik ihtilafları</li>
      </ul>
      
      <p class="mb-2"><strong>Üçüncü Taraf Hizmetler:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Ödeme sistemi kesintileri</li>
        <li>OAuth sağlayıcılarının sorunları</li>
        <li>İnternet servis sağlayıcılarının kesintileri</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">9.3 Tazminat Sınırlaması</h4>
      <p class="mb-2"><strong>Azami Tazminat:</strong></p>
      <p class="mb-4">Herhangi bir durumda platform'un sorumluluğu, ilgili işlemde alınan hizmet bedeli tutarı ile sınırlıdır.</p>
      <p class="mb-4"><strong>Örnek:</strong> 5.000 TL ödüllü işlemde platform bedeli 150 TL ise, azami tazminat tutarı 150 TL'dir.</p>
      
      <p class="mb-2"><strong>Kapsam Dışı Zararlar:</strong></p>
      <p class="mb-2">Platform aşağıdaki zararlardan sorumlu tutulamaz:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Dolaylı zararlar</li>
        <li>Kar kaybı</li>
        <li>İtibar kaybı</li>
        <li>Manevi zararlar</li>
        <li>Veri kaybı</li>
        <li>İş kaybı</li>
      </ul>
      <p class="mb-4"><strong>İstisna:</strong> Platform'un kasıtlı veya ağır kusuru varsa bu sınırlamalar uygulanmaz.</p>

      <h4 class="text-lg font-semibold mb-2">9.4 Hizmet Garantisi ve Kesintiler</h4>
      <p class="mb-2"><strong>Garanti Verilmeyen Hususlar:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Kesintisiz hizmet</li>
        <li>Hatasız çalışma</li>
        <li>Mutlaka eşleşme bulunması</li>
        <li>Belirli bir sürede sonuç alınması</li>
      </ul>
      
      <p class="mb-2"><strong>Planlı Bakımlar:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Önceden duyurulur (en az 24 saat)</li>
        <li>Genellikle gece saatlerinde yapılır</li>
        <li>Maksimum 4 saat sürer</li>
      </ul>
      
      <p class="mb-2"><strong>Acil Bakımlar:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Önceden duyurulamayabilir</li>
        <li>Güvenlik veya kritik hatalar için</li>
        <li>En kısa sürede tamamlanır</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">10. YASAK FAALİYETLER</h3>
      <p class="mb-2">Aşağıdaki faaliyetler kesinlikle yasaktır:</p>
      
      <p class="mb-2"><strong>❌ Dolandırıcılık:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Sahte bilgi verme</li>
        <li>Çalıntı cihaz bildirimi</li>
        <li>Başkasının cihazını sahiplenmek</li>
        <li>Sahte seri numarası</li>
      </ul>
      
      <p class="mb-2"><strong>❌ Hesap İhlalleri:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Sahte kimlik kullanma</li>
        <li>Birden fazla hesap açma</li>
        <li>Başkasının hesabını kullanma</li>
        <li>Bot veya otomatik araçlar</li>
      </ul>
      
      <p class="mb-2"><strong>❌ Sistem Manipülasyonu:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Platform dışı anlaşma yapma</li>
        <li>Sistemi atlatmaya çalışma</li>
        <li>Escrow'u atlatma girişimi</li>
      </ul>
      
      <p class="mb-2"><strong>❌ Diğer:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Taciz, tehdit</li>
        <li>Fikri mülkiyet ihlali</li>
        <li>Virüs, zararlı yazılım</li>
        <li>Veri scraping</li>
      </ul>
      
      <p class="mb-2"><strong>Yaptırım:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Hesap kapatma</li>
        <li>Ödeme iptali</li>
        <li>Yasal işlem başlatma</li>
        <li>Hak edilen tutarların iadesi</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">11. HESAP ASKIYA ALMA VE SONLANDIRMA</h3>
      
      <h4 class="text-lg font-semibold mb-2">11.1 Platform Tarafından Kapatma</h4>
      <p class="mb-2"><strong>Derhal Kapatma Sebepleri:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Dolandırıcılık veya sahte bilgi</li>
        <li>Çalıntı cihaz bildirimi</li>
        <li>Sahte kimlik</li>
        <li>Ödeme dolandırıcılığı</li>
        <li>Yasadışı faaliyetler</li>
      </ul>
      
      <p class="mb-2"><strong>Uyarı Sonrası Kapatma:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Sürekli yanlış bilgi girme</li>
        <li>Platform kurallarını ihlal</li>
        <li>Ödeme yükümlülüğünü yerine getirmeme (tekrarlayan)</li>
        <li>Kargo göndermeme (geçerli sebep olmadan)</li>
      </ul>
      
      <p class="mb-4"><strong>Askıya Alma:</strong> Şüpheli durumlar araştırılırken hesap geçici olarak askıya alınabilir (maksimum 30 gün).</p>

      <h4 class="text-lg font-semibold mb-2">11.2 Kullanıcı Tarafından Hesap Kapatma</h4>
      <p class="mb-2"><strong>Kendi Hesabınızı Kapatma:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Profil ayarlarından "Hesabı Sil" seçeneğini kullanabilirsiniz</li>
        <li>Devam eden işlemler varsa tamamlanana kadar kapatma yapılamaz</li>
        <li>Escrow'da bekleyen ödemeler varsa sonuçlanmalıdır</li>
      </ul>
      
      <p class="mb-2"><strong>Hesap Kapatma Sonuçları:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Kişisel verileriniz 30 gün içinde silinir</li>
        <li>İşlem geçmişiniz anonimleştirilir</li>
        <li>Kapatılan hesap geri açılamaz</li>
        <li>Mali kayıtlar 10 yıl saklanır (yasal zorunluluk, anonim)</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">12. MÜCBIR SEBEPLER</h3>
      <p class="mb-2">Aşağıdaki mücbir sebep durumlarında platform yükümlülüklerinden sorumlu tutulamaz:</p>
      
      <p class="mb-2"><strong>Doğal Afetler:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Deprem, sel, yangın, fırtına</li>
      </ul>
      
      <p class="mb-2"><strong>Toplumsal Olaylar:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Savaş, terör, ayaklanma, sokağa çıkma yasağı</li>
      </ul>
      
      <p class="mb-2"><strong>Teknik Sorunlar:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>İnternet altyapı kesintileri (ISP sorunları)</li>
        <li>Elektrik kesintisi</li>
        <li>Sunucu sağlayıcı (Supabase) kesintileri</li>
        <li>Ödeme sistemleri kesintileri</li>
        <li>DDoS saldırıları, siber saldırılar</li>
      </ul>
      
      <p class="mb-2"><strong>Yasal Değişiklikler:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Ani kanun değişiklikleri, yasaklar, düzenlemeler</li>
      </ul>
      
      <p class="mb-2"><strong>Pandemi/Sağlık Krizi:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Salgın hastalık durumları</li>
        <li>Resmi kısıtlamalar</li>
      </ul>
      
      <p class="mb-4">Mücbir sebep durumunda kullanıcılar derhal bilgilendirilir ve alternatif çözümler sunulur.</p>

      <h3 class="text-xl font-semibold mb-2">13. UYUŞMAZLIK ÇÖZÜMÜ</h3>
      
      <h4 class="text-lg font-semibold mb-2">13.1 İletişim ve Destek</h4>
      <p class="mb-2"><strong>İlk Adım - Destek Ekibimiz:</strong></p>
      <p class="mb-2">Herhangi bir sorun yaşarsanız önce destek ekibimizle iletişime geçin:</p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>E-posta:</strong> support@ifoundanapple.com</li>
        <li><strong>Yanıt Süresi:</strong> 24-48 saat</li>
        <li><strong>Çözüm Süresi:</strong> 5 iş günü (ortalama)</li>
      </ul>
      
      <p class="mb-4"><strong>Arabuluculuk:</strong> Kullanıcılar arasında uyuşmazlık varsa, platform arabulucu rol üstlenebilir (isteğe bağlı).</p>

      <h4 class="text-lg font-semibold mb-2">13.2 Uygulanacak Hukuk</h4>
      <p class="mb-4">İşbu Sözleşme, Türkiye Cumhuriyeti kanunlarına tabidir.</p>

      <h4 class="text-lg font-semibold mb-2">13.3 Yetkili Mahkeme ve İcra Daireleri</h4>
      <p class="mb-2">Bu Sözleşmeden doğan uyuşmazlıklarda:</p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Türkiye'deki kullanıcılar için:</strong> İstanbul (Çağlayan) Mahkemeleri ve İcra Daireleri yetkilidir</li>
        <li><strong>AB'deki kullanıcılar için:</strong> Kullanıcının yerleşim yeri mahkemeleri de yetkilidir (GDPR gereği)</li>
      </ul>
      
      <p class="mb-2"><strong>Tüketici Hakları:</strong></p>
      <p class="mb-4">Tüketiciler, Tüketicinin Korunması Hakkında Kanun uyarınca Tüketici Hakem Heyetleri ve Tüketici Mahkemelerine başvurabilir.</p>
      
      <p class="mb-2"><strong>Tüketici Hakem Heyeti:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Web:</strong> https://tuketicihakemleri.ticaret.gov.tr</li>
        <li>Elektronik başvuru sistemi mevcuttur</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">13.4 Alternatif Uyuşmazlık Çözümü</h4>
      <p class="mb-2"><strong>Online Uyuşmazlık Çözümü (ODR):</strong></p>
      <p class="mb-2">AB'de bulunan tüketiciler, AB ODR platformunu kullanabilir:</p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Platform:</strong> https://ec.europa.eu/consumers/odr</li>
        <li><strong>İletişim:</strong> info@ifoundanapple.com</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">14. FİKRİ MÜLKİYET HAKLARI</h3>
      
      <h4 class="text-lg font-semibold mb-2">14.1 Platform'un Hakları</h4>
      <p class="mb-4">Platform'da yer alan tüm içerik, tasarım, logo, yazılım kodu, algoritmalar iFoundAnApple'ın telif hakkı altındadır.</p>
      
      <p class="mb-2"><strong>Yasak İşlemler:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>İçerikleri kopyalama veya çoğaltma</li>
        <li>Logoyu izinsiz kullanma</li>
        <li>Kaynak kodunu tersine mühendislik</li>
        <li>Veri scraping (otomatik veri toplama)</li>
        <li>API'yi izinsiz kullanma</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">14.2 Kullanıcı İçeriği</h4>
      <p class="mb-4">Platforma yüklediğiniz içerik (fotoğraflar, açıklamalar) sizin fikri mülkiyetinizdir.</p>
      
      <p class="mb-2"><strong>Platforma Verdiğiniz Lisans:</strong></p>
      <p class="mb-2">İçerik yükleyerek, platforma aşağıdaki hakları verirsiniz:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>İçeriği platformda gösterme</li>
        <li>İçeriği depolama ve işleme</li>
        <li>İçeriği yedekleme</li>
        <li>Teknik olarak optimize etme (sıkıştırma vb.)</li>
      </ul>
      <p class="mb-4">Platform, içeriğinizi başka amaçlarla kullanmaz, satmaz veya paylaşmaz.</p>

      <h3 class="text-xl font-semibold mb-2">15. ÇEŞİTLİ HÜKÜMLER</h3>
      
      <h4 class="text-lg font-semibold mb-2">15.1 Bildirimlerin Yapılması</h4>
      <p class="mb-2"><strong>Platform'dan Size:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>E-posta (kayıtlı e-posta adresiniz)</li>
        <li>Uygulama içi bildirim</li>
        <li>SMS (acil durumlar için)</li>
      </ul>
      
      <p class="mb-2"><strong>Sizden Platform'a:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Genel:</strong> info@ifoundanapple.com</li>
        <li><strong>Hukuki:</strong> legal@ifoundanapple.com</li>
        <li><strong>Güvenlik:</strong> security@ifoundanapple.com</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">15.2 Sözleşmenin Bütünlüğü</h4>
      <p class="mb-4">Bu Şartlar, taraflar arasındaki tüm anlaşmayı oluşturur.</p>

      <h4 class="text-lg font-semibold mb-2">15.3 Kısmi Geçersizlik</h4>
      <p class="mb-4">Şartların herhangi bir hükmü geçersiz sayılırsa, diğer hükümler geçerliliğini korur.</p>

      <h4 class="text-lg font-semibold mb-2">15.4 Devir Yasağı</h4>
      <p class="mb-4">Kullanıcılar, bu sözleşmeden doğan hak ve yükümlülüklerini üçüncü kişilere devredemez.</p>
      <p class="mb-4">Platform, işin devri, birleşme veya satın alma durumunda haklarını devredebilir.</p>

      <h4 class="text-lg font-semibold mb-2">15.5 Elektronik Kayıtlar</h4>
      <p class="mb-4">Platform'un elektronik kayıtları, HMK 297 uyarınca kesin delil teşkil eder.</p>

      <h3 class="text-xl font-semibold mb-2">16. İLETİŞİM BİLGİLERİ</h3>
      <p class="mb-2"><strong>iFoundAnApple</strong></p>
      
      <p class="mb-2"><strong>Genel Destek:</strong></p>
      <p class="mb-4"><strong>E-posta:</strong> info@ifoundanapple.com</p>
      <p class="mb-4"><strong>Yanıt Süresi:</strong> 24-48 saat</p>
      
      <p class="mb-2"><strong>Hukuki İşler:</strong></p>
      <p class="mb-4"><strong>E-posta:</strong> legal@ifoundanapple.com</p>
      
      <p class="mb-2"><strong>Güvenlik:</strong></p>
      <p class="mb-4"><strong>E-posta:</strong> security@ifoundanapple.com</p>
      
      <p class="mb-2"><strong>Web Sitesi:</strong></p>
      <p class="mb-4">https://ifoundanapple.com</p>

      <h3 class="text-xl font-semibold mb-2">17. KABUL VE ONAY</h3>
      <ul class="list-disc pl-6 mb-4">
        <li>✅ Bu Hizmet Şartlarını okudum, anladım ve kabul ediyorum.</li>
        <li>✅ 18 yaşından büyük olduğumu ve yasal ehliyete sahip olduğumu beyan ederim.</li>
        <li>✅ Platformu kullanarak, bu Şartlara ve Gizlilik Politikasına bağlı kalmayı kabul ediyorum.</li>
        <li>✅ E-posta, SMS ve uygulama içi bildirimlerin gönderilmesine izin veriyorum.</li>
      </ul>

      <div class="bg-gray-100 p-4 rounded mt-6">
        <p><strong>Son Güncelleme:</strong> 14 Ekim 2025</p>
        <p><strong>Versiyon:</strong> 2.0</p>
        <p><strong>Geçerlilik:</strong> Türkiye ve Avrupa Birliği</p>
        <p><strong>© 2025 iFoundAnApple. Tüm hakları saklıdır.</strong></p>
      </div>
    `,
    privacyContent: `
      <h2 class="text-2xl font-bold mb-4">GİZLİLİK POLİTİKASI</h2>
      <p class="mb-4"><strong>Son Güncelleme:</strong> 14 Ekim 2025</p>

      <h3 class="text-xl font-semibold mb-2">1. VERİ SORUMLUSU</h3>
      <p class="mb-4"><strong>iFoundAnApple</strong></p>
      <p class="mb-4"><strong>E-posta:</strong> privacy@ifoundanapple.com</p>
      <p class="mb-4"><strong>Web:</strong> https://ifoundanapple.com</p>
      <p class="mb-4">Bu politika, KVKK ve GDPR uyarınca hazırlanmıştır.</p>

      <h3 class="text-xl font-semibold mb-2">2. HOSTING VE DOMAIN BİLGİLERİ</h3>
      <p class="mb-4"><strong>Domain Sahibi:</strong> iFoundAnApple</p>
      <p class="mb-4"><strong>Hosting Sağlayıcısı:</strong> Hetzner</p>
      <p class="mb-4"><strong>SSL Sertifikası:</strong> Aktif (HTTPS)</p>
      <p class="mb-4"><strong>Domain Doğrulama:</strong> Sahibi olduğumuz domainimizde barındırılmaktadır</p>
      <p class="mb-4"><strong>ÖNEMLİ:</strong> Bu gizlilik politikası, Google Sites, Facebook, Instagram, Twitter gibi üçüncü taraf platformlarda değil, sahibi olduğumuz domainimizde barındırılmaktadır.</p>

      <h3 class="text-xl font-semibold mb-2">3. TOPLANAN KİŞİSEL VERİLER</h3>
      
      <h4 class="text-lg font-semibold mb-2">3.1 Kayıt ve Kimlik Doğrulama</h4>
      <p class="mb-2"><strong>E-posta ile Kayıt:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Ad, soyad</li>
        <li>E-posta adresi</li>
        <li>Şifre (şifreli saklanır)</li>
        <li>Doğum tarihi</li>
      </ul>
      
      <p class="mb-2"><strong>OAuth ile Giriş (Google/Apple):</strong></p>
      <p class="mb-2">Google veya Apple ile giriş yaptığınızda, aşağıdaki kullanıcı verilerini topluyoruz:</p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Google Kullanıcı Verileri:</strong> Ad, E-posta, Profil Resmi (isteğe bağlı)</li>
        <li><strong>Amaç:</strong> Sadece hesap oluşturma ve kimlik doğrulama</li>
        <li><strong>Veri Koruması:</strong> AES-256-GCM şifreleme</li>
        <li><strong>Veri Saklama:</strong> Güvenli veritabanımızda şifreli (Supabase)</li>
        <li><strong>Veri Paylaşımı:</strong> Sadece platform işlevselliği için hizmet sağlayıcılarla (Bölüm 5.1'e bakın)</li>
        <li><strong>Veri Saklama Süresi:</strong> Aktif hesap süresi boyunca, hesap silindikten 30 gün sonra silinir</li>
        <li>Şifre oluşturmanıza gerek yoktur</li>
      </ul>
      <p class="mb-4"><strong>ÖNEMLİ:</strong> Google kullanıcı verilerinizi SADECE platform işlevselliğini sağlamak için kullanırız. Reklam, üçüncü taraflara satış veya başka amaçlar için kullanmayız.</p>

      <h4 class="text-lg font-semibold mb-2">3.2 Cihaz Bilgileri</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Cihaz modeli (iPhone 15 Pro, MacBook Air vb.)</li>
        <li>Seri numarası</li>
        <li>Cihaz rengi ve açıklaması</li>
        <li>Kayıp/bulunma tarihi ve konumu</li>
        <li>Fatura/sahiplik belgesi (görsel - silinebilir şekilde)</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.3 Ödeme ve Finansal Bilgiler</h4>
      <p class="mb-2"><strong>Ödeme İşlemleri:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Kredi/banka kartı bilgileri güvenli ödeme sağlayıcısı tarafından işlenir (PCI-DSS uyumlu)</li>
        <li>Kart bilgileriniz bizim sunucularımızda saklanmaz</li>
        <li>İşlem geçmişi ve tutarlar kaydedilir</li>
      </ul>
      
      <p class="mb-2"><strong>Banka Bilgileri:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>IBAN numarası (ödül transferi için)</li>
        <li>Hesap sahibi adı</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.4 Profil ve İletişim Bilgileri</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>TC Kimlik Numarası (isteğe bağlı, yüksek tutarlı işlemler için)</li>
        <li>Telefon numarası</li>
        <li>Teslimat adresi (kargo için)</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.5 Otomatik Toplanan Veriler</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>IP adresi</li>
        <li>Tarayıcı ve cihaz bilgileri</li>
        <li>Oturum bilgileri</li>
        <li>Platform kullanım istatistikleri</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">4. VERİLERİN KULLANIM AMAÇLARI</h3>
      
      <h4 class="text-lg font-semibold mb-2">4.1 Hizmet Sunumu</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Kayıp ve bulunan cihazları eşleştirme (seri numarası bazlı)</li>
        <li>Kullanıcı hesap yönetimi</li>
        <li>Kargo organizasyonu ve takibi</li>
        <li>Bildirim gönderme</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.2 Ödeme ve Escrow İşlemleri</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Güvenli ödeme işleme</li>
        <li>Escrow (emanet) sistemini işletme</li>
        <li>Ödül ödemelerini IBAN'a transfer etme</li>
        <li>Mali kayıtların tutulması</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.3 AI Destekli Öneriler</h4>
      <p class="mb-4">Bu özellik isteğe bağlıdır. AI önerileri için yalnızca cihaz modeli bilgisi kullanılır. Kişisel kimlik verileri paylaşılmaz.</p>

      <h4 class="text-lg font-semibold mb-2">4.4 Veri Kullanım Kısıtlamaları</h4>
      <p class="mb-2"><strong>Google Kullanıcı Verileri ve Kişisel Veri Kullanımı:</strong></p>
      <p class="mb-2">Verilerinizi SADECE şu amaçlarla kullanırız:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>✅ Platform işlevselliğini sağlama (kimlik doğrulama, hesap yönetimi)</li>
        <li>✅ İşlemleri ve ödemeleri işleme</li>
        <li>✅ Cihaz teslimatını organize etme</li>
        <li>✅ Önemli hizmet bildirimleri gönderme</li>
        <li>✅ Kullanıcı deneyimini iyileştirme</li>
        <li>✅ Güvenlik ve dolandırıcılık önleme</li>
      </ul>
      <p class="mb-2"><strong>Verilerinizi ŞUNLAR İÇİN KULLANMAYIZ:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>❌ Hedefli reklam veya pazarlama</li>
        <li>❌ Veri broker'larına veya bilgi satıcılarına satış</li>
        <li>❌ Kredi uygunluğu belirleme veya kredi amaçları</li>
        <li>❌ Kullanıcı reklamları veya kişiselleştirilmiş reklam</li>
        <li>❌ Hizmetimizle ilgisiz AI modeli eğitimi</li>
        <li>❌ Diğer amaçlar için veritabanı oluşturma</li>
        <li>❌ Platform işlevselliğini sağlama veya iyileştirme dışındaki herhangi bir amaç</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.5 Güvenlik</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Dolandırıcılık önleme</li>
        <li>Kimlik doğrulama</li>
        <li>Audit log tutma</li>
        <li>Güvenlik ihlali tespiti</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.6 Yasal Uyumluluk</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>KVKK ve GDPR gerekliliklerine uyum</li>
        <li>Vergi mevzuatı yükümlülükleri (10 yıl kayıt tutma)</li>
        <li>Mahkeme kararları ve yasal süreçler</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">5. VERİLERİN PAYLAŞIMI</h3>
      
      <h4 class="text-lg font-semibold mb-2">5.1 Hizmet Sağlayıcılar</h4>
      <p class="mb-2"><strong>Supabase (Backend Altyapısı):</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Veritabanı, kimlik doğrulama, dosya depolama</li>
        <li>SOC 2 Type II, GDPR uyumlu</li>
        <li>Veri konumu: ABD/AB</li>
        <li><strong>Paylaşılan Google Verileri:</strong> Ad, E-posta (şifreli)</li>
      </ul>
      
      <p class="mb-2"><strong>Ödeme Sağlayıcısı:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Ödeme işleme, 3D Secure, escrow</li>
        <li>PCI-DSS Level 1 sertifikalı</li>
        <li>Türkiye merkezli</li>
        <li><strong>Paylaşılan Google Verileri:</strong> E-posta (sadece işlem makbuzları için)</li>
      </ul>
      
      <p class="mb-2"><strong>Google/Apple (OAuth Kimlik Doğrulama):</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Üçüncü taraf giriş (isteğe bağlı)</li>
        <li>Sadece kimlik doğrulama için kullanılır</li>
      </ul>
      
      <p class="mb-2"><strong>Google Gemini (AI Önerileri):</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Sadece cihaz modeli bilgisi paylaşılır</li>
        <li>Google kullanıcı verileri (ad, e-posta) paylaşılmaz</li>
        <li>Kişisel kimlik bilgisi paylaşılmaz</li>
      </ul>
      
      <p class="mb-2"><strong>Kargo Şirketleri (Aras, MNG, Yurtiçi, PTT):</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Teslimat adresi ve telefon</li>
        <li>Anonim gönderici/alıcı kodları (FND-XXX, OWN-XXX)</li>
        <li>Gerçek kimlikler (ad, e-posta) gizli tutulur</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">5.2 Kullanıcılar Arası Paylaşım</h4>
      <p class="mb-4"><strong>ÖNEMLİ:</strong> Kimliğiniz, e-postanız ve telefon numaranız asla diğer kullanıcılarla paylaşılmaz.</p>
      
      <p class="mb-2"><strong>Eşleşme Sonrası:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Karşı tarafın kimliği anonim kalır</li>
        <li>Sadece "Eşleşme bulundu" bildirimi gönderilir</li>
        <li>Kargo için sadece teslimat adresi paylaşılır (ad-soyad ve adres)</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">5.3 Yasal Zorunluluk</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Mahkeme kararı veya celp</li>
        <li>Kolluk kuvvetleri talepleri</li>
        <li>Vergi daireleri (mali kayıtlar için)</li>
        <li>KVKK Kurumu talepleri</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">6. VERİ GÜVENLİĞİ VE SAKLAMA</h3>
      
      <h4 class="text-lg font-semibold mb-2">6.1 Güvenlik Önlemleri</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>SSL/TLS şifreleme (HTTPS) - TLS 1.3</li>
        <li>Şifre hash'leme (bcrypt)</li>
        <li><strong>Veritabanı şifreleme (AES-256-GCM)</strong></li>
        <li><strong>Uygulama seviyesi hassas veri şifrelemesi:</strong></li>
        <ul class="list-disc pl-6 mb-4">
          <li>TC Kimlik Numarası</li>
          <li>IBAN numaraları</li>
          <li>Telefon numaraları</li>
          <li>Fiziksel adresler</li>
          <li>Google kullanıcı verileri (ad, e-posta)</li>
        </ul>
        <li>Row Level Security (RLS) politikaları</li>
        <li>OAuth 2.0 güvenli kimlik doğrulama token'ları</li>
        <li>3D Secure ödeme doğrulama</li>
        <li>İki faktörlü kimlik doğrulama (2FA) desteği</li>
        <li>Düzenli güvenlik denetimleri ve güvenlik açığı değerlendirmeleri</li>
        <li>Erişim kontrol logları ve izleme</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">6.2 Saklama Süreleri</h4>
      
      <p class="mb-2"><strong>Google Kullanıcı Verileri Saklama:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Aktif hesaplar:</strong> Hesabınız aktif olduğu sürece saklanır</li>
        <li><strong>Silinen hesaplar:</strong> Google kullanıcı verileri (ad, e-posta) 30 gün içinde kaldırılır</li>
        <li><strong>Mali veriler:</strong> 10 yıl (yasal gereklilik - Vergi Yasası)</li>
        <li><strong>Silme talebi:</strong> Bizimle privacy@ifoundanapple.com adresinden iletişime geçebilirsiniz</li>
      </ul>
      
      <p class="mb-2"><strong>Aktif Hesaplar:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Hesabınız aktif olduğu sürece saklanır</li>
      </ul>
      
      <p class="mb-2"><strong>Kapalı Hesaplar:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Hesap kapatma sonrası 30 gün içinde silinir</li>
        <li>Mali kayıtlar 10 yıl saklanır (yasal zorunluluk)</li>
        <li>Anonim istatistikler süresiz saklanabilir</li>
      </ul>
      
      <p class="mb-2"><strong>İşlem Kayıtları:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Mali işlemler: 10 yıl</li>
        <li>Kargo kayıtları: 2 yıl</li>
        <li>Audit loglar: 5 yıl</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">7. KULLANICI HAKLARI (KVKK & GDPR)</h3>
      
      <h4 class="text-lg font-semibold mb-2">7.1 Haklarınız</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>✅ <strong>Bilgi Talep Etme:</strong> Verilerinizin işlenip işlenmediğini öğrenme</li>
        <li>✅ <strong>Erişim Hakkı:</strong> Verilerinizin bir kopyasını alma</li>
        <li>✅ <strong>Düzeltme Hakkı:</strong> Yanlış bilgileri düzeltme</li>
        <li>✅ <strong>Silme Hakkı:</strong> Verilerinizi silme (unutulma hakkı)</li>
        <li>✅ <strong>İtiraz Etme:</strong> Veri işleme faaliyetlerine itiraz</li>
        <li>✅ <strong>Veri Taşınabilirliği:</strong> Verilerinizi başka bir platforma aktarma</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">7.2 Başvuru Yöntemi</h4>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>E-posta:</strong> privacy@ifoundanapple.com</li>
        <li><strong>Konu:</strong> KVKK/GDPR Başvurusu</li>
        <li><strong>Yanıt Süresi:</strong> 30 gün (en geç)</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">7.3 Şikayet Hakkı</h4>
      <p class="mb-2"><strong>Türkiye:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Kişisel Verileri Koruma Kurumu - https://www.kvkk.gov.tr</li>
      </ul>
      
      <p class="mb-2"><strong>AB:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>İlgili ülkenin Veri Koruma Otoritesi</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">8. ÇOCUKLARIN GİZLİLİĞİ</h3>
      <p class="mb-4">Platform 18 yaş altı kullanıcılara yönelik değildir. 18 yaş altı kişilerden bilerek veri toplamıyoruz.</p>

      <h3 class="text-xl font-semibold mb-2">9. ÇEREZLER</h3>
      <p class="mb-2"><strong>Kullandığımız Çerezler:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Oturum yönetimi (zorunlu)</li>
        <li>Dil tercihleri (fonksiyonel)</li>
        <li>Güvenlik (zorunlu)</li>
      </ul>
      <p class="mb-4">Çerezleri tarayıcı ayarlarınızdan yönetebilirsiniz.</p>

      <h3 class="text-xl font-semibold mb-2">10. ULUSLARARASI VERİ TRANSFERİ</h3>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Supabase:</strong> ABD/AB veri merkezleri (GDPR uyumlu, SCC)</li>
        <li><strong>Ödeme Sağlayıcısı:</strong> Uluslararası</li>
        <li><strong>Google:</strong> Küresel (OAuth ve AI için)</li>
      </ul>
      <p class="mb-4">Tüm transferler KVKK ve GDPR hükümlerine uygun yapılır.</p>

      <h3 class="text-xl font-semibold mb-2">11. DEĞİŞİKLİKLER VE GÜNCELLEMELER</h3>
      <p class="mb-2">Bu Gizlilik Politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler yapıldığında:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Web sitesinde duyuru yayınlarız</li>
        <li>E-posta ile bildirim göndeririz</li>
        <li>"Son Güncelleme" tarihi değiştirilir</li>
      </ul>
      <p class="mb-4">Güncellemeler yayınlandığı tarihte yürürlüğe girer.</p>

      <h3 class="text-xl font-semibold mb-2">12. İLETİŞİM</h3>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Genel:</strong> info@ifoundanapple.com</li>
        <li><strong>Gizlilik:</strong> privacy@ifoundanapple.com</li>
        <li><strong>Güvenlik:</strong> security@ifoundanapple.com</li>
      </ul>

      <div class="bg-gray-100 p-4 rounded mt-6">
        <p><strong>© 2025 iFoundAnApple - Versiyon 2.0</strong></p>
      </div>
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
    escrowSystemDesc: "Votre paiement est conservé dans notre compte d'entiercement sécurisé et ne sera pas transféré tant que l'appareil n'est pas livré et confirmé. Avec la garantie Iyzico, vous disposez de droits d'annulation et de remboursement hors frais de 3,43%.",
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
    iyzico3DSecure: "Protégé par 3D Secure, paiement sécurisé certifié PCI DSS. Toutes les banques turques sont supportées.",
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
      a2: "Absolument. Votre vie privée est notre priorité absolue. Nous ne partageons jamais vos informations personnelles (nom, e-mail, etc.) avec l'autre partie. Toutes les communications et transactions sont effectuées de manière anonyme et cryptée via la plateforme.",
      q3: "Comment le montant de la récompense est-il déterminé ?",
      a3: "Nous utilisons un mécanisme alimenté par l'IA qui recommande une récompense équitable basée sur le modèle de l'appareil et la valeur marchande d'occasion estimée.",
      q4: "Qu'est-ce que le système de séquestre sécurisé ?",
      a4: "Lorsqu'une correspondance est trouvée, le propriétaire effectue le paiement. Le paiement est conservé dans notre système de séquestre sécurisé. Nous conservons le paiement en toute sécurité jusqu'à ce que l'échange réussi de l'appareil soit confirmé. Cela protège à la fois le propriétaire et le trouveur.",
      q5: "Comment se déroule l'échange physique ?",
      a5: "Nous effectuons des processus d'échange sécurisés avec nos compagnies de transport partenaires. La plateforme est conçue pour faciliter le processus sans nécessiter le partage d'informations de contact personnelles.",
      q6: "Quels sont les frais ?",
      a6: "Le détail total des frais est le suivant ;\n\nFrais du fournisseur de paiement sécurisé + Frais de la compagnie de transport + Récompense du trouveur + Frais de service.\n\nCela nous aide à couvrir les coûts opérationnels, maintenir la plateforme et assurer un environnement sécurisé pour tous."
    },
    termsContent: `...`, // Content should be translated
    privacyContent: `
      <h2 class="text-2xl font-bold mb-4">POLITIQUE DE CONFIDENTIALITÉ</h2>
      <p class="mb-4"><strong>Dernière mise à jour :</strong> 14 octobre 2025</p>

      <h3 class="text-xl font-semibold mb-2">1. RESPONSABLE DU TRAITEMENT DES DONNÉES</h3>
      <p class="mb-4"><strong>iFoundAnApple</strong></p>
      <p class="mb-4"><strong>E-mail :</strong> privacy@ifoundanapple.com</p>
      <p class="mb-4"><strong>Web :</strong> https://ifoundanapple.com</p>
      <p class="mb-4">Cette politique est préparée conformément à la KVKK et au RGPD.</p>

      <h3 class="text-xl font-semibold mb-2">2. INFORMATIONS D'HÉBERGEMENT ET DE DOMAINE</h3>
      <p class="mb-4"><strong>Propriétaire du domaine :</strong> iFoundAnApple</p>
      <p class="mb-4"><strong>Fournisseur d'hébergement :</strong> Hetzner</p>
      <p class="mb-4"><strong>Certificat SSL :</strong> Actif (HTTPS)</p>
      <p class="mb-4"><strong>Vérification du domaine :</strong> Hébergé sur notre domaine propriétaire</p>
      <p class="mb-4"><strong>IMPORTANT :</strong> Cette politique de confidentialité est hébergée sur notre domaine propriétaire, et non sur des plateformes tierces telles que Google Sites, Facebook, Instagram, Twitter.</p>

      <h3 class="text-xl font-semibold mb-2">3. DONNÉES PERSONNELLES COLLECTÉES</h3>
      
      <h4 class="text-lg font-semibold mb-2">3.1 Inscription et Authentification</h4>
      <p class="mb-2"><strong>Inscription par E-mail :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Prénom, nom de famille</li>
        <li>Adresse e-mail</li>
        <li>Mot de passe (stocké chiffré)</li>
        <li>Date de naissance</li>
      </ul>
      
      <p class="mb-2"><strong>Connexion OAuth (Google/Apple) :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Informations de profil de base du fournisseur OAuth</li>
        <li>Nom, prénom, e-mail</li>
        <li>Aucun besoin de créer un mot de passe</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.2 Informations sur l'Appareil</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Modèle d'appareil (iPhone 15 Pro, MacBook Air, etc.)</li>
        <li>Numéro de série</li>
        <li>Couleur et description de l'appareil</li>
        <li>Date et lieu de perte/trouvaille</li>
        <li>Document de facture/propriété (visuel - peut être supprimé)</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.3 Informations de Paiement et Financières</h4>
      <p class="mb-2"><strong>Transactions de Paiement :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Informations de carte de crédit/bancaire traitées par un fournisseur de paiement sécurisé (conforme PCI-DSS)</li>
        <li>Vos informations de carte ne sont pas stockées sur nos serveurs</li>
        <li>L'historique des transactions et les montants sont enregistrés</li>
      </ul>
      
      <p class="mb-2"><strong>Informations Bancaires :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Numéro IBAN (pour le transfert de récompense)</li>
        <li>Nom du titulaire du compte</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.4 Informations de Profil et de Contact</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Numéro d'identité national (optionnel, pour les transactions de haute valeur)</li>
        <li>Numéro de téléphone</li>
        <li>Adresse de livraison (pour le fret)</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.5 Données Collectées Automatiquement</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Adresse IP</li>
        <li>Informations sur le navigateur et l'appareil</li>
        <li>Informations de session</li>
        <li>Statistiques d'utilisation de la plateforme</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">4. OBJECTIFS D'UTILISATION DES DONNÉES</h3>
      
      <h4 class="text-lg font-semibold mb-2">4.1 Fourniture de Services</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Correspondance des appareils perdus et trouvés (basée sur le numéro de série)</li>
        <li>Gestion des comptes utilisateurs</li>
        <li>Organisation et suivi du fret</li>
        <li>Envoi de notifications</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.2 Opérations de Paiement et d'Escrow</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Traitement sécurisé des paiements</li>
        <li>Fonctionnement du système d'escrow</li>
        <li>Transfert des paiements de récompense vers l'IBAN</li>
        <li>Maintien des enregistrements financiers</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.3 Recommandations Assistées par IA</h4>
      <p class="mb-4">Cette fonctionnalité est optionnelle</p>

      <h4 class="text-lg font-semibold mb-2">4.4 Sécurité</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Prévention de la fraude</li>
        <li>Vérification d'identité</li>
        <li>Maintien des journaux d'audit</li>
        <li>Détection des violations de sécurité</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.5 Conformité Légale</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Conformité aux exigences KVKK et RGPD</li>
        <li>Obligations de la législation fiscale (conservation des enregistrements pendant 10 ans)</li>
        <li>Décisions judiciaires et processus légaux</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">5. PARTAGE DES DONNÉES</h3>
      
      <h4 class="text-lg font-semibold mb-2">5.1 Fournisseurs de Services</h4>
      <p class="mb-2"><strong>Supabase (Infrastructure Backend) :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Base de données, authentification, stockage de fichiers</li>
        <li>SOC 2 Type II, conforme RGPD</li>
        <li>Emplacement des données : États-Unis/UE</li>
      </ul>
      
      <p class="mb-2"><strong>Fournisseur de Paiement :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Traitement des paiements, 3D Secure, escrow</li>
        <li>Certifié PCI-DSS Level 1</li>
        <li>Basé en Turquie</li>
      </ul>
      
      <p class="mb-2"><strong>Google/Apple (Authentification OAuth) :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Connexion tierce (optionnelle)</li>
      </ul>
      
      <p class="mb-2"><strong>Google Gemini (Recommandations IA) :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Seules les informations sur le modèle d'appareil sont partagées</li>
        <li>Aucune information d'identité personnelle n'est partagée</li>
      </ul>
      
      <p class="mb-2"><strong>Sociétés de Fret (Aras, MNG, Yurtiçi, PTT) :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Adresse de livraison et téléphone</li>
        <li>Codes d'expéditeur/destinataire anonymes (FND-XXX, OWN-XXX)</li>
        <li>Les identités réelles sont gardées confidentielles</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">5.2 Partage Entre Utilisateurs</h4>
      <p class="mb-4"><strong>IMPORTANT :</strong> Votre identité, e-mail et numéro de téléphone ne sont jamais partagés avec d'autres utilisateurs.</p>
      
      <p class="mb-2"><strong>Après Correspondance :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>L'identité de l'autre partie reste anonyme</li>
        <li>Seule la notification "Correspondance trouvée" est envoyée</li>
        <li>Seule l'adresse de livraison est partagée pour le fret (nom-prénom et adresse)</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">5.3 Obligation Légale</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Ordre du tribunal ou assignation</li>
        <li>Demandes des forces de l'ordre</li>
        <li>Administrations fiscales (pour les enregistrements financiers)</li>
        <li>Demandes de l'Institution KVKK</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">6. SÉCURITÉ ET CONSERVATION DES DONNÉES</h3>
      
      <h4 class="text-lg font-semibold mb-2">6.1 Mesures de Sécurité</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Chiffrement SSL/TLS (HTTPS)</li>
        <li>Hachage des mots de passe (bcrypt)</li>
        <li>Chiffrement de la base de données</li>
        <li>Politiques de sécurité au niveau des lignes (RLS)</li>
        <li>Vérification de paiement 3D Secure</li>
        <li>Support d'authentification à deux facteurs (2FA)</li>
        <li>Audits de sécurité réguliers</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">6.2 Périodes de Conservation</h4>
      <p class="mb-2"><strong>Comptes Actifs :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Conservés tant que votre compte est actif</li>
      </ul>
      
      <p class="mb-2"><strong>Comptes Fermés :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Supprimés dans les 30 jours suivant la fermeture du compte</li>
        <li>Enregistrements financiers conservés pendant 10 ans (obligation légale)</li>
        <li>Les statistiques anonymes peuvent être conservées indéfiniment</li>
      </ul>
      
      <p class="mb-2"><strong>Enregistrements de Transactions :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Transactions financières : 10 ans</li>
        <li>Enregistrements de fret : 2 ans</li>
        <li>Journaux d'audit : 5 ans</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">7. DROITS DES UTILISATEURS (KVKK & RGPD)</h3>
      
      <h4 class="text-lg font-semibold mb-2">7.1 Vos Droits</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>✅ <strong>Droit à l'Information :</strong> Savoir si vos données sont traitées</li>
        <li>✅ <strong>Droit d'Accès :</strong> Obtenir une copie de vos données</li>
        <li>✅ <strong>Droit de Rectification :</strong> Corriger les informations incorrectes</li>
        <li>✅ <strong>Droit à l'Effacement :</strong> Supprimer vos données (droit à l'oubli)</li>
        <li>✅ <strong>Droit d'Opposition :</strong> S'opposer aux activités de traitement des données</li>
        <li>✅ <strong>Portabilité des Données :</strong> Transférer vos données vers une autre plateforme</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">7.2 Méthode de Demande</h4>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>E-mail :</strong> privacy@ifoundanapple.com</li>
        <li><strong>Sujet :</strong> Demande KVKK/RGPD</li>
        <li><strong>Délai de Réponse :</strong> 30 jours (maximum)</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">7.3 Droit de Plainte</h4>
      <p class="mb-2"><strong>Turquie :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Autorité de Protection des Données Personnelles - https://www.kvkk.gov.tr</li>
      </ul>
      
      <p class="mb-2"><strong>UE :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Autorité de Protection des Données du pays concerné</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">8. CONFIDENTIALITÉ DES ENFANTS</h3>
      <p class="mb-4">La plateforme n'est pas destinée aux utilisateurs de moins de 18 ans. Nous ne collectons pas sciemment de données auprès de personnes de moins de 18 ans.</p>

      <h3 class="text-xl font-semibold mb-2">9. COOKIES</h3>
      <p class="mb-2"><strong>Cookies que Nous Utilisons :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Gestion de session (obligatoire)</li>
        <li>Préférences linguistiques (fonctionnel)</li>
        <li>Sécurité (obligatoire)</li>
      </ul>
      <p class="mb-4">Vous pouvez gérer les cookies depuis les paramètres de votre navigateur.</p>

      <h3 class="text-xl font-semibold mb-2">10. TRANSFERT INTERNATIONAL DE DONNÉES</h3>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Supabase :</strong> Centres de données États-Unis/UE (conforme RGPD, SCC)</li>
        <li><strong>Fournisseur de Paiement :</strong> International</li>
        <li><strong>Google :</strong> Mondial (pour OAuth et IA)</li>
      </ul>
      <p class="mb-4">Tous les transferts sont effectués conformément aux dispositions KVKK et RGPD.</p>

      <h3 class="text-xl font-semibold mb-2">11. CHANGEMENTS ET MISES À JOUR</h3>
      <p class="mb-2">Nous pouvons mettre à jour cette Politique de Confidentialité de temps à autre. Lorsque des changements importants sont apportés :</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Nous publions des annonces sur le site web</li>
        <li>Nous envoyons des notifications par e-mail</li>
        <li>La date "Dernière mise à jour" est modifiée</li>
      </ul>
      <p class="mb-4">Les mises à jour prennent effet à la date de leur publication.</p>

      <h3 class="text-xl font-semibold mb-2">12. CONTACT</h3>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Général :</strong> info@ifoundanapple.com</li>
        <li><strong>Confidentialité :</strong> privacy@ifoundanapple.com</li>
        <li><strong>Sécurité :</strong> security@ifoundanapple.com</li>
      </ul>

      <div class="bg-gray-100 p-4 rounded mt-6">
        <p><strong>© 2025 iFoundAnApple - Version 2.0</strong></p>
      </div>
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
    escrowSystemDesc: "お支払いは安全なエスクロー口座で保管され、デバイスが配送・確認されるまで相手に送金されません。Iyzicoの保証により、3.43%の手数料を除き、キャンセルと返金の権利が保護されています。",
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
    iyzico3DSecure: "3D Secureで保護、PCI DSS認証の安全な支払い。すべてのトルコの銀行がサポートされています。",
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
        a2: "もちろんです。お客様のプライバシーは当社の最優先事項です。お客様の個人情報（名前、メールアドレスなど）を相手方と共有することはありません。すべての通信と取引は、プラットフォームを介して匿名かつ暗号化されて処理されます。",
        q3: "報酬額はどのように決定されますか？",
        a3: "デバイスのモデルと推定中古市場価値に基づいて公正な報酬を推奨するAI搭載のメカニズムを使用しています。",
        q4: "安全なエスクローシステムとは何ですか？",
        a4: "一致が見つかると、デバイスの所有者が支払いを行います。支払いは安全なエスクローシステムで保持されます。デバイスの交換が成功したことが確認されるまで、支払いを安全に保持します。これにより、所有者と発見者の両方が保護されます。",
        q5: "物理的な交換はどのように行われますか？",
        a5: "パートナー運輸会社と安全な交換プロセスを実施しています。このプラットフォームは、個人の連絡先情報を共有する必要なくプロセスを促進するように設計されています。",
        q6: "手数料はかかりますか？",
        a6: "総手数料の内訳は以下の通りです；\n\n安全な支払いプロバイダーの手数料 + 運輸会社の手数料 + 発見者の報酬 + サービス料金。\n\nこれは、運営費をカバーし、プラットフォームを維持し、すべての人のための安全な環境を確保するのに役立ちます。"
    },
    termsContent: `...`, // Content should be translated
    privacyContent: `
      <h2 class="text-2xl font-bold mb-4">プライバシーポリシー</h2>
      <p class="mb-4"><strong>最終更新日：</strong> 2025年10月14日</p>

      <h3 class="text-xl font-semibold mb-2">1. データ管理者</h3>
      <p class="mb-4"><strong>iFoundAnApple</strong></p>
      <p class="mb-4"><strong>メール：</strong> privacy@ifoundanapple.com</p>
      <p class="mb-4"><strong>ウェブ：</strong> https://ifoundanapple.com</p>
      <p class="mb-4">このポリシーは、KVKKおよびGDPRに従って作成されています。</p>

      <h3 class="text-xl font-semibold mb-2">2. ホスティングおよびドメイン情報</h3>
      <p class="mb-4"><strong>ドメイン所有者：</strong> iFoundAnApple</p>
      <p class="mb-4"><strong>ホスティングプロバイダー：</strong> Hetzner</p>
      <p class="mb-4"><strong>SSL証明書：</strong> アクティブ（HTTPS）</p>
      <p class="mb-4"><strong>ドメイン検証：</strong> 当社が所有するドメインでホスティングされています</p>
      <p class="mb-4"><strong>重要：</strong> このプライバシーポリシーは、Google Sites、Facebook、Instagram、Twitterなどの第三者プラットフォームではなく、当社が所有するドメインでホスティングされています。</p>

      <h3 class="text-xl font-semibold mb-2">3. 収集される個人データ</h3>
      
      <h4 class="text-lg font-semibold mb-2">3.1 登録と認証</h4>
      <p class="mb-2"><strong>メール登録：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>名前、姓</li>
        <li>メールアドレス</li>
        <li>パスワード（暗号化して保存）</li>
        <li>生年月日</li>
      </ul>
      
      <p class="mb-2"><strong>OAuthログイン（Google/Apple）：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>OAuthプロバイダーから取得した基本プロフィール情報</li>
        <li>名前、姓、メール</li>
        <li>パスワードを作成する必要はありません</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.2 デバイス情報</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>デバイスモデル（iPhone 15 Pro、MacBook Airなど）</li>
        <li>シリアル番号</li>
        <li>デバイスの色と説明</li>
        <li>紛失/発見日と場所</li>
        <li>請求書/所有権書類（視覚的 - 削除可能）</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.3 支払いと金融情報</h4>
      <p class="mb-2"><strong>支払い取引：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>クレジット/銀行カード情報は安全な支払いプロバイダーによって処理されます（PCI-DSS準拠）</li>
        <li>カード情報は当社のサーバーに保存されません</li>
        <li>取引履歴と金額が記録されます</li>
      </ul>
      
      <p class="mb-2"><strong>銀行情報：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>IBAN番号（報酬転送用）</li>
        <li>口座名義人</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.4 プロフィールと連絡先情報</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>国民ID番号（オプション、高額取引用）</li>
        <li>電話番号</li>
        <li>配送先住所（貨物用）</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.5 自動収集データ</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>IPアドレス</li>
        <li>ブラウザとデバイス情報</li>
        <li>セッション情報</li>
        <li>プラットフォーム使用統計</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">4. データの使用目的</h3>
      
      <h4 class="text-lg font-semibold mb-2">4.1 サービス提供</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>紛失・発見デバイスのマッチング（シリアル番号ベース）</li>
        <li>ユーザーアカウント管理</li>
        <li>貨物の組織化と追跡</li>
        <li>通知の送信</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.2 支払いとエスクロー操作</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>安全な支払い処理</li>
        <li>エスクローシステムの運営</li>
        <li>IBANへの報酬支払い転送</li>
        <li>金融記録の維持</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.3 AI支援推奨</h4>
      <p class="mb-4">この機能はオプションです</p>

      <h4 class="text-lg font-semibold mb-2">4.4 セキュリティ</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>詐欺防止</li>
        <li>身元確認</li>
        <li>監査ログの維持</li>
        <li>セキュリティ侵害の検出</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.5 法的コンプライアンス</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>KVKKおよびGDPR要件への準拠</li>
        <li>税務法規の義務（10年間の記録保持）</li>
        <li>裁判所の決定と法的プロセス</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">5. データの共有</h3>
      
      <h4 class="text-lg font-semibold mb-2">5.1 サービスプロバイダー</h4>
      <p class="mb-2"><strong>Supabase（バックエンドインフラ）：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>データベース、認証、ファイルストレージ</li>
        <li>SOC 2 Type II、GDPR準拠</li>
        <li>データの場所：米国/EU</li>
      </ul>
      
      <p class="mb-2"><strong>支払いプロバイダー：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>支払い処理、3D Secure、エスクロー</li>
        <li>PCI-DSS Level 1認定</li>
        <li>トルコ拠点</li>
      </ul>
      
      <p class="mb-2"><strong>Google/Apple（OAuth認証）：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>サードパーティログイン（オプション）</li>
      </ul>
      
      <p class="mb-2"><strong>Google Gemini（AI推奨）：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>デバイスモデル情報のみが共有されます</li>
        <li>個人身元情報は共有されません</li>
      </ul>
      
      <p class="mb-2"><strong>貨物会社（Aras、MNG、Yurtiçi、PTT）：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>配送先住所と電話</li>
        <li>匿名送信者/受信者コード（FND-XXX、OWN-XXX）</li>
        <li>実際の身元は機密保持されます</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">5.2 ユーザー間共有</h4>
      <p class="mb-4"><strong>重要：</strong> あなたの身元、メール、電話番号は他のユーザーと共有されることはありません。</p>
      
      <p class="mb-2"><strong>マッチング後：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>相手の身元は匿名のままです</li>
        <li>「マッチが見つかりました」通知のみが送信されます</li>
        <li>貨物には配送先住所のみが共有されます（名前と住所）</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">5.3 法的義務</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>裁判所命令または召喚状</li>
        <li>法執行機関の要求</li>
        <li>税務当局（金融記録用）</li>
        <li>KVKK機関の要求</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">6. データセキュリティと保存</h3>
      
      <h4 class="text-lg font-semibold mb-2">6.1 セキュリティ対策</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>SSL/TLS暗号化（HTTPS）</li>
        <li>パスワードハッシュ化（bcrypt）</li>
        <li>データベース暗号化</li>
        <li>行レベルセキュリティ（RLS）ポリシー</li>
        <li>3D Secure支払い検証</li>
        <li>二要素認証（2FA）サポート</li>
        <li>定期的なセキュリティ監査</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">6.2 保存期間</h4>
      <p class="mb-2"><strong>アクティブアカウント：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>アカウントがアクティブな間は保存されます</li>
      </ul>
      
      <p class="mb-2"><strong>閉鎖アカウント：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>アカウント閉鎖後30日以内に削除されます</li>
        <li>金融記録は10年間保存されます（法的義務）</li>
        <li>匿名統計は無期限に保存される場合があります</li>
      </ul>
      
      <p class="mb-2"><strong>取引記録：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>金融取引：10年</li>
        <li>貨物記録：2年</li>
        <li>監査ログ：5年</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">7. ユーザーの権利（KVKK & GDPR）</h3>
      
      <h4 class="text-lg font-semibold mb-2">7.1 あなたの権利</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>✅ <strong>情報権：</strong> あなたのデータが処理されているかどうかを知る</li>
        <li>✅ <strong>アクセス権：</strong> あなたのデータのコピーを取得する</li>
        <li>✅ <strong>訂正権：</strong> 間違った情報を訂正する</li>
        <li>✅ <strong>削除権：</strong> あなたのデータを削除する（忘れられる権利）</li>
        <li>✅ <strong>異議権：</strong> データ処理活動に異議を唱える</li>
        <li>✅ <strong>データポータビリティ：</strong> あなたのデータを別のプラットフォームに転送する</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">7.2 申請方法</h4>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>メール：</strong> privacy@ifoundanapple.com</li>
        <li><strong>件名：</strong> KVKK/GDPR申請</li>
        <li><strong>回答時間：</strong> 30日（最大）</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">7.3 苦情権</h4>
      <p class="mb-2"><strong>トルコ：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>個人データ保護機関 - https://www.kvkk.gov.tr</li>
      </ul>
      
      <p class="mb-2"><strong>EU：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>関連国のデータ保護機関</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">8. 子供のプライバシー</h3>
      <p class="mb-4">このプラットフォームは18歳未満のユーザー向けではありません。18歳未満の人から意図的にデータを収集することはありません。</p>

      <h3 class="text-xl font-semibold mb-2">9. クッキー</h3>
      <p class="mb-2"><strong>使用するクッキー：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>セッション管理（必須）</li>
        <li>言語設定（機能）</li>
        <li>セキュリティ（必須）</li>
      </ul>
      <p class="mb-4">ブラウザの設定からクッキーを管理できます。</p>

      <h3 class="text-xl font-semibold mb-2">10. 国際データ転送</h3>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Supabase：</strong> 米国/EUデータセンター（GDPR準拠、SCC）</li>
        <li><strong>支払いプロバイダー：</strong> 国際</li>
        <li><strong>Google：</strong> グローバル（OAuthとAI用）</li>
      </ul>
      <p class="mb-4">すべての転送はKVKKおよびGDPRの規定に従って行われます。</p>

      <h3 class="text-xl font-semibold mb-2">11. 変更と更新</h3>
      <p class="mb-2">このプライバシーポリシーを随時更新する場合があります。重要な変更が行われる場合：</p>
      <ul class="list-disc pl-6 mb-4">
        <li>ウェブサイトでお知らせを公開します</li>
        <li>メールで通知を送信します</li>
        <li>「最終更新日」が変更されます</li>
      </ul>
      <p class="mb-4">更新は公開日から有効になります。</p>

      <h3 class="text-xl font-semibold mb-2">12. お問い合わせ</h3>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>一般：</strong> info@ifoundanapple.com</li>
        <li><strong>プライバシー：</strong> privacy@ifoundanapple.com</li>
        <li><strong>セキュリティ：</strong> security@ifoundanapple.com</li>
      </ul>

      <div class="bg-gray-100 p-4 rounded mt-6">
        <p><strong>© 2025 iFoundAnApple - バージョン 2.0</strong></p>
      </div>
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
    escrowSystemDesc: "Su pago se mantiene en nuestra cuenta de depósito segura y no se transferirá hasta que el dispositivo sea entregado y confirmado. Con la garantía de Iyzico, tiene derechos de cancelación y reembolso excluyendo una tarifa del 3.43%.",
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
    iyzico3DSecure: "Protegido por 3D Secure, pago seguro certificado PCI DSS. Todos los bancos turcos son compatibles.",
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
        a2: "Absolutamente. Tu privacidad es nuestra máxima prioridad. Nunca compartimos tu información personal (nombre, correo electrónico, etc.) con la otra parte. Todas las comunicaciones y transacciones se llevan a cabo de forma anónima y encriptada a través de la plataforma.",
        q3: "¿Cómo se determina el importe de la recompensa?",
        a3: "Utilizamos un mecanismo impulsado por IA que recomienda una recompensa justa basada en el modelo del dispositivo y el valor de mercado de segunda mano estimado.",
        q4: "¿Qué es el sistema de depósito seguro (escrow)?",
        a4: "Cuando se encuentra una coincidencia, el propietario realiza el pago. El pago se mantiene en nuestro sistema de depósito seguro. Mantenemos el pago de forma segura hasta que se confirme el intercambio exitoso del dispositivo. Esto protege tanto al propietario como al buscador.",
        q5: "¿Cómo se realiza el intercambio físico?",
        a5: "Realizamos procesos de intercambio seguros con nuestras empresas de transporte asociadas. La plataforma está diseñada para facilitar el proceso sin requerir que compartas información de contacto personal.",
        q6: "¿Cuáles son las tarifas?",
        a6: "El desglose total de tarifas es el siguiente;\n\nTarifa del proveedor de pago seguro + Tarifa de la empresa de transporte + Recompensa del buscador + Tarifa de servicio.\n\nEsto nos ayuda a cubrir los costes operativos, mantener la plataforma y garantizar un entorno seguro para todos."
    },
    termsContent: `...`, // Content should be translated
    privacyContent: `
      <h2 class="text-2xl font-bold mb-4">POLÍTICA DE PRIVACIDAD</h2>
      <p class="mb-4"><strong>Última actualización:</strong> 14 de octubre de 2025</p>

      <h3 class="text-xl font-semibold mb-2">1. RESPONSABLE DEL TRATAMIENTO DE DATOS</h3>
      <p class="mb-4"><strong>iFoundAnApple</strong></p>
      <p class="mb-4"><strong>Correo electrónico:</strong> privacy@ifoundanapple.com</p>
      <p class="mb-4"><strong>Web:</strong> https://ifoundanapple.com</p>
      <p class="mb-4">Esta política está preparada de acuerdo con KVKK y GDPR.</p>

      <h3 class="text-xl font-semibold mb-2">2. INFORMACIÓN DE HOSTING Y DOMINIO</h3>
      <p class="mb-4"><strong>Propietario del Dominio:</strong> iFoundAnApple</p>
      <p class="mb-4"><strong>Proveedor de Hosting:</strong> Hetzner</p>
      <p class="mb-4"><strong>Certificado SSL:</strong> Activo (HTTPS)</p>
      <p class="mb-4"><strong>Verificación del Dominio:</strong> Alojado en nuestro dominio propio</p>
      <p class="mb-4"><strong>IMPORTANTE:</strong> Esta política de privacidad está alojada en nuestro dominio propio, no en plataformas de terceros como Google Sites, Facebook, Instagram, Twitter.</p>

      <h3 class="text-xl font-semibold mb-2">3. DATOS PERSONALES RECOPILADOS</h3>
      
      <h4 class="text-lg font-semibold mb-2">3.1 Registro y Autenticación</h4>
      <p class="mb-2"><strong>Registro por Correo Electrónico:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Nombre, apellido</li>
        <li>Dirección de correo electrónico</li>
        <li>Contraseña (almacenada encriptada)</li>
        <li>Fecha de nacimiento</li>
      </ul>
      
      <p class="mb-2"><strong>Inicio de Sesión OAuth (Google/Apple):</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Información básica del perfil del proveedor OAuth</li>
        <li>Nombre, apellido, correo electrónico</li>
        <li>No es necesario crear una contraseña</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.2 Información del Dispositivo</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Modelo del dispositivo (iPhone 15 Pro, MacBook Air, etc.)</li>
        <li>Número de serie</li>
        <li>Color y descripción del dispositivo</li>
        <li>Fecha y lugar de pérdida/encuentro</li>
        <li>Documento de factura/propiedad (visual - puede ser eliminado)</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.3 Información de Pago y Financiera</h4>
      <p class="mb-2"><strong>Transacciones de Pago:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Información de tarjeta de crédito/bancaria procesada por proveedor de pago seguro (cumple PCI-DSS)</li>
        <li>Su información de tarjeta no se almacena en nuestros servidores</li>
        <li>Se registran el historial de transacciones y los montos</li>
      </ul>
      
      <p class="mb-2"><strong>Información Bancaria:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Número IBAN (para transferencia de recompensa)</li>
        <li>Nombre del titular de la cuenta</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.4 Información de Perfil y Contacto</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Número de identidad nacional (opcional, para transacciones de alto valor)</li>
        <li>Número de teléfono</li>
        <li>Dirección de entrega (para carga)</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.5 Datos Recopilados Automáticamente</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Dirección IP</li>
        <li>Información del navegador y dispositivo</li>
        <li>Información de sesión</li>
        <li>Estadísticas de uso de la plataforma</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">4. PROPÓSITOS DE USO DE DATOS</h3>
      
      <h4 class="text-lg font-semibold mb-2">4.1 Prestación de Servicios</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Emparejamiento de dispositivos perdidos y encontrados (basado en número de serie)</li>
        <li>Gestión de cuentas de usuario</li>
        <li>Organización y seguimiento de carga</li>
        <li>Envío de notificaciones</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.2 Operaciones de Pago y Escrow</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Procesamiento seguro de pagos</li>
        <li>Operación del sistema de escrow</li>
        <li>Transferencia de pagos de recompensa a IBAN</li>
        <li>Mantenimiento de registros financieros</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.3 Recomendaciones Asistidas por IA</h4>
      <p class="mb-4">Esta característica es opcional</p>

      <h4 class="text-lg font-semibold mb-2">4.4 Seguridad</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Prevención de fraude</li>
        <li>Verificación de identidad</li>
        <li>Mantenimiento de registros de auditoría</li>
        <li>Detección de violaciones de seguridad</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.5 Cumplimiento Legal</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Cumplimiento de requisitos KVKK y GDPR</li>
        <li>Obligaciones de legislación fiscal (mantenimiento de registros por 10 años)</li>
        <li>Decisiones judiciales y procesos legales</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">5. COMPARTIR DATOS</h3>
      
      <h4 class="text-lg font-semibold mb-2">5.1 Proveedores de Servicios</h4>
      <p class="mb-2"><strong>Supabase (Infraestructura Backend):</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Base de datos, autenticación, almacenamiento de archivos</li>
        <li>SOC 2 Type II, cumple GDPR</li>
        <li>Ubicación de datos: EE.UU./UE</li>
      </ul>
      
      <p class="mb-2"><strong>Proveedor de Pago:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Procesamiento de pagos, 3D Secure, escrow</li>
        <li>Certificado PCI-DSS Level 1</li>
        <li>Basado en Turquía</li>
      </ul>
      
      <p class="mb-2"><strong>Google/Apple (Autenticación OAuth):</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Inicio de sesión de terceros (opcional)</li>
      </ul>
      
      <p class="mb-2"><strong>Google Gemini (Recomendaciones IA):</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Solo se comparte información del modelo del dispositivo</li>
        <li>No se comparte información de identidad personal</li>
      </ul>
      
      <p class="mb-2"><strong>Empresas de Carga (Aras, MNG, Yurtiçi, PTT):</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Dirección de entrega y teléfono</li>
        <li>Códigos anónimos de remitente/destinatario (FND-XXX, OWN-XXX)</li>
        <li>Las identidades reales se mantienen confidenciales</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">5.2 Compartir Entre Usuarios</h4>
      <p class="mb-4"><strong>IMPORTANTE:</strong> Su identidad, correo electrónico y número de teléfono nunca se comparten con otros usuarios.</p>
      
      <p class="mb-2"><strong>Después del Emparejamiento:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>La identidad de la otra parte permanece anónima</li>
        <li>Solo se envía la notificación "Emparejamiento encontrado"</li>
        <li>Solo se comparte la dirección de entrega para carga (nombre-apellido y dirección)</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">5.3 Obligación Legal</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Orden judicial o citación</li>
        <li>Solicitudes de fuerzas del orden</li>
        <li>Autoridades fiscales (para registros financieros)</li>
        <li>Solicitudes de la Institución KVKK</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">6. SEGURIDAD Y RETENCIÓN DE DATOS</h3>
      
      <h4 class="text-lg font-semibold mb-2">6.1 Medidas de Seguridad</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Cifrado SSL/TLS (HTTPS)</li>
        <li>Hash de contraseñas (bcrypt)</li>
        <li>Cifrado de base de datos</li>
        <li>Políticas de seguridad a nivel de fila (RLS)</li>
        <li>Verificación de pago 3D Secure</li>
        <li>Soporte de autenticación de dos factores (2FA)</li>
        <li>Auditorías de seguridad regulares</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">6.2 Períodos de Retención</h4>
      <p class="mb-2"><strong>Cuentas Activas:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Se mantienen mientras su cuenta esté activa</li>
      </ul>
      
      <p class="mb-2"><strong>Cuentas Cerradas:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Se eliminan dentro de 30 días después del cierre de cuenta</li>
        <li>Los registros financieros se mantienen por 10 años (obligación legal)</li>
        <li>Las estadísticas anónimas pueden mantenerse indefinidamente</li>
      </ul>
      
      <p class="mb-2"><strong>Registros de Transacciones:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Transacciones financieras: 10 años</li>
        <li>Registros de carga: 2 años</li>
        <li>Registros de auditoría: 5 años</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">7. DERECHOS DEL USUARIO (KVKK & GDPR)</h3>
      
      <h4 class="text-lg font-semibold mb-2">7.1 Sus Derechos</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>✅ <strong>Derecho a la Información:</strong> Saber si sus datos están siendo procesados</li>
        <li>✅ <strong>Derecho de Acceso:</strong> Obtener una copia de sus datos</li>
        <li>✅ <strong>Derecho de Rectificación:</strong> Corregir información incorrecta</li>
        <li>✅ <strong>Derecho al Borrado:</strong> Eliminar sus datos (derecho al olvido)</li>
        <li>✅ <strong>Derecho de Oposición:</strong> Oponerse a las actividades de procesamiento de datos</li>
        <li>✅ <strong>Portabilidad de Datos:</strong> Transferir sus datos a otra plataforma</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">7.2 Método de Solicitud</h4>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Correo electrónico:</strong> privacy@ifoundanapple.com</li>
        <li><strong>Asunto:</strong> Solicitud KVKK/GDPR</li>
        <li><strong>Tiempo de respuesta:</strong> 30 días (máximo)</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">7.3 Derecho a Quejarse</h4>
      <p class="mb-2"><strong>Turquía:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Autoridad de Protección de Datos Personales - https://www.kvkk.gov.tr</li>
      </ul>
      
      <p class="mb-2"><strong>UE:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Autoridad de Protección de Datos del país relevante</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">8. PRIVACIDAD DE NIÑOS</h3>
      <p class="mb-4">La plataforma no está dirigida a usuarios menores de 18 años. No recopilamos datos de personas menores de 18 años a sabiendas.</p>

      <h3 class="text-xl font-semibold mb-2">9. COOKIES</h3>
      <p class="mb-2"><strong>Cookies que Utilizamos:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Gestión de sesión (obligatorio)</li>
        <li>Preferencias de idioma (funcional)</li>
        <li>Seguridad (obligatorio)</li>
      </ul>
      <p class="mb-4">Puede gestionar las cookies desde la configuración de su navegador.</p>

      <h3 class="text-xl font-semibold mb-2">10. TRANSFERENCIA INTERNACIONAL DE DATOS</h3>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Supabase:</strong> Centros de datos EE.UU./UE (cumple GDPR, SCC)</li>
        <li><strong>Proveedor de Pago:</strong> Internacional</li>
        <li><strong>Google:</strong> Global (para OAuth e IA)</li>
      </ul>
      <p class="mb-4">Todas las transferencias se realizan de acuerdo con las disposiciones KVKK y GDPR.</p>

      <h3 class="text-xl font-semibold mb-2">11. CAMBIOS Y ACTUALIZACIONES</h3>
      <p class="mb-2">Podemos actualizar esta Política de Privacidad de vez en cuando. Cuando se realicen cambios importantes:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Publicamos anuncios en el sitio web</li>
        <li>Enviamos notificaciones por correo electrónico</li>
        <li>Se cambia la fecha de "Última actualización"</li>
      </ul>
      <p class="mb-4">Las actualizaciones entran en vigor en la fecha de su publicación.</p>

      <h3 class="text-xl font-semibold mb-2">12. CONTACTO</h3>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>General:</strong> info@ifoundanapple.com</li>
        <li><strong>Privacidad:</strong> privacy@ifoundanapple.com</li>
        <li><strong>Seguridad:</strong> security@ifoundanapple.com</li>
      </ul>

      <div class="bg-gray-100 p-4 rounded mt-6">
        <p><strong>© 2025 iFoundAnApple - Versión 2.0</strong></p>
      </div>
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