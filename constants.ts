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
    forgotPassword: "Forgot Password?",
    forgotPasswordTitle: "Reset Password",
    forgotPasswordDescription: "Enter your email address and we'll send you a link to reset your password.",
    passwordResetEmailSent: "Password reset email sent! Please check your inbox.",
    passwordResetError: "Error sending password reset email. Please try again.",
    sendResetLink: "Send Reset Link",
    sending: "Sending...",
    cancel: "Cancel",
    passwordResetTitle: "Reset Your Password",
    passwordResetDescription: "Please enter your new password below.",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    resetting: "Resetting...",
    resetPassword: "Reset Password",
    passwordResetSuccess: "Password Reset Successful!",
    passwordResetSuccessMessage: "Your password has been successfully reset. Redirecting to login...",
    passwordResetLinkExpired: "Password reset link is invalid or has expired.",
    passwordResetLinkInvalid: "Invalid password reset link.",
    passwordResetLinkExpiredMessage: "The password reset link is invalid or has expired. Please request a new one.",
    backToLogin: "Back to Login",
    passwordTooShort: "Password must be at least 6 characters long.",
    passwordsDoNotMatch: "Passwords do not match.",
    checkingResetLink: "Checking reset link...",
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
    PaymentPending: "Match found! Waiting for owner payment.",
    PaymentComplete: "Payment Complete! Proceed with exchange.",
    ExchangePending: "Exchange Pending",
    Completed: "Completed",
    statusAwaitingMatch: "Match pending",
    statusAwaitingMatchOwner: "Match pending",
    statusAwaitingMatchFinder: "Match pending for the found device",
    roleOwner: "Lost Device (Owner)",
    roleFinder: "Found Device (Finder)",
    finderRegistrationSuccess: "Match pending for the found device.",
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
    hiddenForSecurity: "Hidden for security",
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
    matchPaymentSubtitleFees: "Secure payment guarantee",
    matchPaymentSubtitlePayment: "Secure payment options",
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
    escrowSystemDesc: "Your payment is held in our secure escrow account and will not be transferred until the device is delivered and confirmed. Our payment infrastructure guarantees your right to cancellation and refund.",
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
    paynet3DSecure: "3D Secure protected, PCI DSS certified secure payment. All Turkish banks are supported.",
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
      a6: "Total fee breakdowns are as follows;\\n\\nSecure payment provider fee + Cargo company fee + Finder's reward + Service fee.\\n\\nThis helps us cover operational costs, maintain the platform, and ensure a secure environment for everyone."
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
        <li><strong>Gross Amount:</strong> Total amount received from customer (including PAYNET commission)</li>
        <li><strong>PAYNET Commission:</strong> 3.43% of gross amount (automatically deducted)</li>
        <li><strong>Net Amount:</strong> Amount remaining after PAYNET commission deduction</li>
        <li><strong>Cargo Fee:</strong> 250 TL (fixed)</li>
        <li><strong>Finder Reward:</strong> 20% of net amount</li>
        <li><strong>Service Fee:</strong> Net amount - cargo - reward (remaining)</li>
      </ul>

      <p class="mb-2"><strong>Example Calculation (Device Owner) - v5.0:</strong></p>
      <div class="bg-gray-100 p-4 rounded mb-4">
        <p><strong>Gross Amount:</strong> 2,000 TL (total received from customer)</p>
        <p>├── <strong>PAYNET Commission:</strong> 68.60 TL (3.43%) - Automatically deducted</p>
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
        <li>PAYNET commission (3.43%) is automatically deducted</li>
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
        <li>If no delivery within 30 days: Gross amount automatically refunded (PAYNET commission deducted)</li>
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
        <li>If you request transaction cancellation during the exchange process, payment gateway commission (3.43%) is refunded with deduction</li>
        <li>If gross amount is paid and net amount is held in escrow: Net amount is fully refunded</li>
        <li>Cancellation must be made before cargo process begins</li>
        <li>After cancellation: Gross amount - Payment gateway commission = Refund amount</li>
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
    forgotPassword: "Şifremi Unuttum",
    forgotPasswordTitle: "Şifre Sıfırlama",
    forgotPasswordDescription: "E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.",
    passwordResetEmailSent: "Şifre sıfırlama e-postası gönderildi! Lütfen gelen kutunuzu kontrol edin.",
    passwordResetError: "Şifre sıfırlama e-postası gönderilirken hata oluştu. Lütfen tekrar deneyin.",
    sendResetLink: "Sıfırlama Bağlantısı Gönder",
    sending: "Gönderiliyor...",
    cancel: "İptal",
    passwordResetTitle: "Şifrenizi Sıfırlayın",
    passwordResetDescription: "Lütfen yeni şifrenizi aşağıya girin.",
    newPassword: "Yeni Şifre",
    confirmPassword: "Şifreyi Onayla",
    resetting: "Sıfırlanıyor...",
    resetPassword: "Şifreyi Sıfırla",
    passwordResetSuccess: "Şifre Sıfırlama Başarılı!",
    passwordResetSuccessMessage: "Şifreniz başarıyla sıfırlandı. Giriş sayfasına yönlendiriliyorsunuz...",
    passwordResetLinkExpired: "Şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş.",
    passwordResetLinkInvalid: "Geçersiz şifre sıfırlama bağlantısı.",
    passwordResetLinkExpiredMessage: "Şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş. Lütfen yeni bir tane isteyin.",
    backToLogin: "Giriş Sayfasına Dön",
    passwordTooShort: "Şifre en az 6 karakter uzunluğunda olmalıdır.",
    passwordsDoNotMatch: "Şifreler eşleşmiyor.",
    checkingResetLink: "Sıfırlama bağlantısı kontrol ediliyor...",
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
    hiddenForSecurity: "Gizli bilgi",
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
    matchPaymentSubtitleFees: "Güvenli ödeme garantisi",
    matchPaymentSubtitlePayment: "Güvenli ödeme seçenekleri",
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
    Reported: "Eşleşme Bekleniyor",
    Matched: "Eşleşti! Cihaz sahibi ödemesi bekleniyor.",
    PaymentPending: "Eşleşti! Cihaz sahibi ödemesi bekleniyor.",
    PaymentComplete: "Ödeme Tamamlandı! Takasa devam edin.",
    ExchangePending: "Takas Bekleniyor",
    Completed: "Tamamlandı",
    statusAwaitingMatch: "Eşleşme bekleniyor",
    statusAwaitingMatchOwner: "Eşleşme bekleniyor",
    statusAwaitingMatchFinder: "Bulunan Cihaz için Eşleşme Bekleniyor",
    roleOwner: "Kayıp Cihaz (Sahibi)",
    roleFinder: "Bulunan Cihaz (Finder)",
    finderRegistrationSuccess: "Bulunan cihaz için eşleşme bekleniyor.",
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
      a6: "Toplam ücret kırılımları aşağıdaki gibidir;\\n\\nGüvenli ödeme sağlayıcı ücreti + Kargo firması ücreti + Bulan kişinin ödülü + Hizmet bedeli.\\n\\nBu, operasyonel maliyetleri karşılamamıza, platformu sürdürmemize ve herkes için güvenli bir ortam sağlamamıza yardımcı olur."
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
        <li>Hasar varsa teslim almadan kargo görevlisine tutanak tutturun</li>
        <li>Platform'u hemen bilgilendirin</li>
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
        <li><strong>Telefon:</strong> Sadece kargo şirketiyle paylaşılır</li>
        <li><strong>Adres:</strong> Sadece kargo şirketiyle paylaşılır</li>
      </ul>
      
      <p class="mb-2"><strong>Kargo için Paylaşılan Bilgiler:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Ad Soyad</li>
        <li>Teslimat adresi</li>
        <li>Telefon numarası</li>
        <li>Anonim gönderici/alıcı kodu (FND-XXX, OWN-XXX)</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">8.2 İletişim</h4>
      <p class="mb-2"><strong>Platform Bildirimleri:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>E-posta bildirimleri</li>
        <li>Uygulama içi bildirimler</li>
        <li>SMS bildirimleri (kritik durumlar için)</li>
      </ul>
      
      <p class="mb-2"><strong>Doğrudan İletişim:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Kullanıcılar arasında doğrudan mesajlaşma yoktur</li>
        <li>Tüm iletişim platform üzerinden yönetilir</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">9. PLATFORMUN SORUMLULUKLARI VE SINIRLILIKLARI</h3>
      
      <h4 class="text-lg font-semibold mb-2">9.1 Platformun Sorumlulukları</h4>
      <p class="mb-2"><strong>Sunduğumuz Hizmetler İçin:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Platform altyapısını çalışır durumda tutmak</li>
        <li>Veri güvenliğini sağlamak</li>
        <li>Ödeme sistemini güvenli şekilde işletmek</li>
        <li>Escrow yönetimini doğru yapmak</li>
        <li>Müşteri desteği sunmak</li>
        <li>Dolandırıcılık önleme tedbirleri almak</li>
        <li>Yasal yükümlülüklere uymak</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">9.2 Sorumluluk Sınırları</h4>
      <p class="mb-4"><strong>Platform ŞUNLARDAN SORUMLU DEĞİLDİR:</strong></p>
      
      <p class="mb-2"><strong>Cihaz ve Teslimat:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Teslim edilen cihazın gerçek durumu</li>
        <li>Cihazın çalışır/işlevsel olması</li>
        <li>Fiziksel hasar veya eksik parçalar</li>
        <li>Cihazın orijinal olup olmadığı</li>
      </ul>
      
      <p class="mb-2"><strong>Kargo:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Kargo firmalarının hataları, gecikmeleri, kayıpları</li>
        <li>Hasarlı teslimat</li>
        <li>Kargo sigortası (kullanıcı sorumluluğundadır)</li>
      </ul>
      
      <p class="mb-2"><strong>Kullanıcı Davranışları:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Kullanıcıların yanlış/eksik bilgi vermesi</li>
        <li>Tespit edilemeyen dolandırıcılık girişimleri</li>
        <li>Mülkiyet anlaşmazlıkları</li>
      </ul>
      
      <p class="mb-2"><strong>Üçüncü Taraf Hizmetler:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Ödeme sistemi kesintileri</li>
        <li>OAuth sağlayıcı sorunları</li>
        <li>İnternet servis sağlayıcı kesintileri</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">9.3 Tazminat Sınırı</h4>
      <p class="mb-2"><strong>Maksimum Tazminat:</strong></p>
      <p class="mb-4">Her durumda platformun sorumluluğu, ilgili işlemde alınan hizmet bedeli ile sınırlıdır.</p>
      <p class="mb-4"><strong>Örnek:</strong> Platform hizmet bedelinin 150 TL olduğu 5.000 TL ödüllü bir işlemde maksimum tazminat 150 TL'dir.</p>
      
      <p class="mb-2"><strong>Dahil Olmayan Zararlar:</strong></p>
      <p class="mb-2">Platform aşağıdaki zararlardan sorumlu tutulamaz:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Dolaylı zararlar</li>
        <li>Kar kaybı</li>
        <li>İtibar kaybı</li>
        <li>Manevi zarar</li>
        <li>Veri kaybı</li>
        <li>İş kaybı</li>
      </ul>
      <p class="mb-4"><strong>İstisna:</strong> Platformun kastı veya ağır kusuru varsa bu sınırlamalar uygulanmaz.</p>

      <h4 class="text-lg font-semibold mb-2">9.4 Hizmet Garantisi ve Kesintiler</h4>
      <p class="mb-2"><strong>Garantilemediklerimiz:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Kesintisiz hizmet</li>
        <li>Hatasız çalışma</li>
        <li>Garantili eşleşme bulunması</li>
        <li>Belli bir sürede sonuç</li>
      </ul>
      
      <p class="mb-2"><strong>Planlı Bakım:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Önceden duyurulur (en az 24 saat)</li>
        <li>Genellikle gece saatlerinde yapılır</li>
        <li>Maksimum 4 saat sürer</li>
      </ul>
      
      <p class="mb-2"><strong>Acil Bakım:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Önceden duyurulmayabilir</li>
        <li>Güvenlik veya kritik hatalar için yapılır</li>
        <li>En kısa sürede tamamlanır</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">10. YASAKLI FAALİYETLER</h3>
      <p class="mb-2">Aşağıdaki faaliyetler kesinlikle yasaktır:</p>
      
      <p class="mb-2"><strong>❌ Dolandırıcılık:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Sahte bilgi verme</li>
        <li>Çalıntı cihaz bildirimi</li>
        <li>Başkasının cihazını sahiplenme</li>
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
        <li>Platform dışı anlaşmalar yapma</li>
        <li>Sistemi atlatmaya çalışma</li>
        <li>Escrow sistemini devre dışı bırakmaya çalışma</li>
      </ul>
      
      <p class="mb-2"><strong>❌ Diğerleri:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Hakaret, tehdit</li>
        <li>Fikri mülkiyet ihlali</li>
        <li>Virüs, zararlı içerik</li>
        <li>Veri kazıma</li>
      </ul>
      
      <p class="mb-2"><strong>Yaptırımlar:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Hesap kapatma</li>
        <li>Ödeme iptali</li>
        <li>Hukuki işlem başlatılması</li>
        <li>Elde edilen tutarların iadesi</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">11. HESAP ASKISI VE SONLANDIRMA</h3>
      
      <h4 class="text-lg font-semibold mb-2">11.1 Platform Tarafından Kapatma</h4>
      <p class="mb-2"><strong>Anında Kapatma Sebepleri:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Dolandırıcılık veya sahte bilgi</li>
        <li>Çalıntı cihaz bildirimi</li>
        <li>Sahte kimlik</li>
        <li>Ödeme dolandırıcılığı</li>
        <li>Yasadışı faaliyetler</li>
      </ul>
      
      <p class="mb-2"><strong>Uyarı Sonrası Kapatma:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Sürekli yanlış bilgi verme</li>
        <li>Platform kurallarını ihlal</li>
        <li>Ödeme yükümlülüğünü yerine getirmeme (tekrarlı)</li>
        <li>Geçerli sebep olmadan kargo göndermeme</li>
      </ul>
      
      <p class="mb-4"><strong>Askıya Alma:</strong> Şüpheli durumlar incelenirken hesap geçici olarak askıya alınabilir (maksimum 30 gün).</p>

      <h4 class="text-lg font-semibold mb-2">11.2 Kullanıcı Tarafından Hesap Kapatma</h4>
      <p class="mb-2"><strong>Hesabınızı Kapatma:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Profil ayarlarından "Hesabı Sil" seçeneğini kullanabilirsiniz</li>
        <li>Devam eden işlemler varsa tamamlanana kadar kapatma yapılamaz</li>
        <li>Escrow'da bekleyen ödemeler varsa sonuçlandırılmalıdır</li>
      </ul>
      
      <p class="mb-2"><strong>Hesap Kapatmanın Sonuçları:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Kişisel verileriniz 30 gün içinde silinir</li>
        <li>İşlem geçmişiniz anonimleştirilir</li>
        <li>Kapatılan hesap yeniden açılamaz</li>
        <li>Finansal kayıtlar 10 yıl saklanır (yasal zorunluluk, anonim)</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">12. MÜCBİR SEBEPLER</h3>
      <p class="mb-2">Aşağıdaki mücbir sebep durumlarında platform yükümlülüklerinden sorumlu tutulamaz:</p>
      
      <p class="mb-2"><strong>Doğal Afetler:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Deprem, sel, yangın, fırtına</li>
      </ul>
      
      <p class="mb-2"><strong>Sosyal Olaylar:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Savaş, terör, ayaklanma, sokağa çıkma yasağı</li>
      </ul>
      
      <p class="mb-2"><strong>Teknik Sorunlar:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>İnternet altyapı kesintileri (ISS sorunları)</li>
        <li>Elektrik kesintisi</li>
        <li>Sunucu sağlayıcı (Supabase) kesintileri</li>
        <li>Ödeme sistemi kesintileri</li>
        <li>DDoS saldırıları, siber saldırılar</li>
      </ul>
      
      <p class="mb-2"><strong>Hukuki Değişiklikler:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Ani yasa değişiklikleri, yasaklar, düzenlemeler</li>
      </ul>
      
      <p class="mb-2"><strong>Pandemi/Sağlık Krizi:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Salgın hastalık durumları</li>
        <li>Resmi kısıtlamalar</li>
      </ul>
      
      <p class="mb-4">Mücbir sebep durumlarında kullanıcılar derhal bilgilendirilir ve alternatif çözümler sunulur.</p>

      <h3 class="text-xl font-semibold mb-2">13. UYUŞMAZLIK ÇÖZÜMÜ</h3>
      
      <h4 class="text-lg font-semibold mb-2">13.1 İletişim ve Destek</h4>
      <p class="mb-2"><strong>İlk Adım - Destek Ekibimiz:</strong></p>
      <p class="mb-2">Herhangi bir sorun yaşarsanız öncelikle destek ekibimizle iletişime geçin:</p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>E-posta:</strong> support@ifoundanapple.com</li>
        <li><strong>Yanıt Süresi:</strong> 24-48 saat</li>
        <li><strong>Çözüm Süresi:</strong> Ortalama 5 iş günü</li>
      </ul>
      
      <p class="mb-4"><strong>Arabuculuk:</strong> Kullanıcılar arasında uyuşmazlık olması durumunda platform arabulucu rolü üstlenebilir (isteğe bağlı).</p>

      <h4 class="text-lg font-semibold mb-2">13.2 Uygulanacak Hukuk</h4>
      <p class="mb-4">Bu Sözleşme Türkiye Cumhuriyeti kanunlarına tabidir.</p>

      <h4 class="text-lg font-semibold mb-2">13.3 Yetkili Mahkeme ve İcra Daireleri</h4>
      <p class="mb-2">Bu Sözleşmeden doğan uyuşmazlıklarda:</p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Türkiye'deki kullanıcılar için:</strong> İstanbul (Çağlayan) Mahkemeleri ve İcra Daireleri yetkilidir</li>
        <li><strong>AB kullanıcıları için:</strong> Kullanıcının ikamet ettiği ülkenin mahkemeleri de yetkilidir (GDPR gereği)</li>
      </ul>
      
      <p class="mb-2"><strong>Tüketici Hakları:</strong></p>
      <p class="mb-4">Tüketiciler, Tüketicinin Korunması Hakkında Kanun kapsamında Tüketici Hakem Heyetleri ve Tüketici Mahkemelerine başvurabilir.</p>
      
      <p class="mb-2"><strong>Tüketici Hakem Heyeti:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Web:</strong> https://tuketicihakemleri.ticaret.gov.tr</li>
        <li>Elektronik başvuru sistemi mevcuttur</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">13.4 Alternatif Uyuşmazlık Çözümü</h4>
      <p class="mb-2"><strong>Online Uyuşmazlık Çözümü (ODR):</strong></p>
      <p class="mb-2">AB'deki tüketiciler, AB ODR platformunu kullanabilir:</p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Platform:</strong> https://ec.europa.eu/consumers/odr</li>
        <li><strong>İletişim:</strong> info@ifoundanapple.com</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">14. FİKRİ MÜLKİYET HAKLARI</h3>
      
      <h4 class="text-lg font-semibold mb-2">14.1 Platform Hakları</h4>
      <p class="mb-4">Platformdaki tüm içerik, tasarım, logo, yazılım kodları, algoritmalar iFoundAnApple'ın telif hakkına tabidir.</p>
      
      <p class="mb-2"><strong>Yasaklanan Eylemler:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>İçeriği kopyalama veya çoğaltma</li>
        <li>Logonun izinsiz kullanımı</li>
        <li>Kaynak kodun tersine mühendisliği</li>
        <li>Veri kazıma (otomatik veri toplama)</li>
        <li>API'nin izinsiz kullanımı</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">14.2 Kullanıcı İçerikleri</h4>
      <p class="mb-4">Platforma yüklediğiniz içerikler (fotoğraflar, açıklamalar) sizin fikri mülkiyetinizdir.</p>
      
      <p class="mb-2"><strong>Platforma Verdiğiniz Lisans:</strong></p>
      <p class="mb-2">İçerik yükleyerek platforma şu hakları verirsiniz:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>İçeriği platformda görüntüleme</li>
        <li>İçeriği saklama ve işleme</li>
        <li>İçeriğin yedeğini alma</li>
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
  ru: {
    // Header & Nav
    appName: "iFoundAnApple",
    home: "Главная",
    dashboard: "Панель",
    profile: "Профиль",
    language: "Язык",
    login: "Войти",
    logout: "Выйти",
    register: "Регистрация",
    reportFoundDevice: "Сообщить о найденном устройстве",
    addLostDevice: "Добавить потерянное устройство",
    adminDashboard: "Админ-панель",
    notifications: {
      title: "Уведомления",
      markAllAsRead: "Отметить все как прочитанные",
      noNotifications: "Нет новых уведомлений.",
      matchFoundOwner: "Найдено совпадение для вашего {model}! Требуется действие.",
      matchFoundFinder: "Найдено совпадение для {model}, о котором вы сообщили. Ожидается оплата владельца.",
      paymentReceivedFinder: "Оплата за {model} получена! Пожалуйста, продолжайте обмен.",
      exchangeConfirmationNeeded: "Другая сторона подтвердила обмен по {model}. Подтвердите, чтобы завершить.",
      transactionCompletedOwner: "Готово! Обмен вашего {model} завершён.",
      transactionCompletedFinder: "Готово! Вознаграждение за {model} уже в пути.",
      deviceLostConfirmation: "Ваше потерянное устройство ({model}) успешно добавлено.",
      deviceReportedConfirmation: "Ваше найденное устройство ({model}) успешно зарегистрировано.",
      packageDeliveredConfirm: "Ваше устройство доставлено. Пожалуйста, проверьте и подтвердите.",
      autoConfirmReminder: "Если вы не подтвердите в течение 48 часов, система сделает это автоматически.",
    },
    // Home Page
    heroTitle: "Потеряли устройство Apple? Найдите его безопасно.",
    heroSubtitle: "Мы анонимно связываем вас с человеком, который нашёл ваше устройство. Безопасный обмен — честное вознаграждение.",
    getStarted: "Начать",
    howItWorks: "Как это работает",
    step1Title: "Владелец сообщает о потере",
    step1Desc: "Если вы потеряли iPhone, iPad или Mac, зарегистрируйте его на нашей платформе по серийному номеру.",
    step2Title: "Нашедший сообщает о находке",
    step2Desc: "Любой, кто нашёл устройство, может анонимно сообщить о нём, используя серийный номер.",
    step3Title: "Безопасное совпадение и эскроу",
    step3Desc: "Наша система автоматически сопоставляет устройства. Владелец вносит вознаграждение в защищённый эскроу.",
    step4Title: "Безопасный обмен и выплата",
    step4Desc: "Следуйте нашим рекомендациям для безопасного обмена. После подтверждения нашедший получает вознаграждение.",
    // Auth Pages
    loginTitle: "Войдите в свой аккаунт",
    registerTitle: "Создайте аккаунт",
    email: "Email",
    password: "Пароль",
    fullName: "ФИО",
    firstName: "Имя",
    lastName: "Фамилия",
    tcKimlikNo: "Номер удостоверения личности",
    phoneNumber: "Номер телефона",
    address: "Адрес",
    iban: "IBAN",
    iAmA: "Я...",
    deviceOwner: "Владелец устройства",
    deviceFinder: "Нашедший устройство",
    bankInfo: "Банковские реквизиты (для выплаты вознаграждения)",
    agreeToTerms: "Я принимаю {terms} и {privacy}.",
    termsLink: "Условия использования",
    privacyLink: "Политику конфиденциальности",
    consentRequired: "Чтобы продолжить, необходимо согласиться с условиями и политикой конфиденциальности.",
    alreadyHaveAccount: "Уже есть аккаунт?",
    dontHaveAccount: "Нет аккаунта?",
    // Auth errors
    userAlreadyExists: "Пользователь с таким email уже существует.",
    invalidEmailOrPassword: "Неверный email или пароль.",
    orContinueWith: "Или продолжить с помощью",
    loginWithGoogle: "Войти через Google",
    loginWithApple: "Войти через Apple",
    processingPayment: "Обработка платежа...",
    forgotPassword: "Забыли пароль?",
    forgotPasswordTitle: "Сброс пароля",
    forgotPasswordDescription: "Введите свой email адрес, и мы отправим вам ссылку для сброса пароля.",
    passwordResetEmailSent: "Письмо для сброса пароля отправлено! Пожалуйста, проверьте свою почту.",
    passwordResetError: "Ошибка при отправке письма для сброса пароля. Пожалуйста, попробуйте снова.",
    sendResetLink: "Отправить ссылку",
    sending: "Отправка...",
    cancel: "Отмена",
    passwordResetTitle: "Сбросить пароль",
    passwordResetDescription: "Пожалуйста, введите новый пароль ниже.",
    newPassword: "Новый пароль",
    confirmPassword: "Подтвердите пароль",
    resetting: "Сброс...",
    resetPassword: "Сбросить пароль",
    passwordResetSuccess: "Пароль успешно сброшен!",
    passwordResetSuccessMessage: "Ваш пароль успешно сброшен. Перенаправление на страницу входа...",
    passwordResetLinkExpired: "Ссылка для сброса пароля недействительна или истекла.",
    passwordResetLinkInvalid: "Недействительная ссылка для сброса пароля.",
    passwordResetLinkExpiredMessage: "Ссылка для сброса пароля недействительна или истекла. Пожалуйста, запросите новую.",
    backToLogin: "Вернуться к входу",
    passwordTooShort: "Пароль должен содержать не менее 6 символов.",
    passwordsDoNotMatch: "Пароли не совпадают.",
    checkingResetLink: "Проверка ссылки для сброса...",
    // Dashboard
    myDevices: "Мои устройства",
    status: "Статус",
    model: "Модель",
    serialNumber: "Серийный номер",
    noDevicesReported: "Вы ещё не зарегистрировали ни одного устройства.",
    // Device Forms
    deviceModelForm: "Модель устройства (например, iPhone 15 Pro)",
    deviceSerialNumber: "Серийный номер",
    deviceColor: "Цвет",
    deviceDescription: "Дополнительные сведения (по желанию)",
    deviceInvoice: "Подтверждение покупки (счёт)",
    deviceInvoiceHelper: "Необязательно. Помогает подтвердить владение.",
    submit: "Отправить",
    suggestDescription: "Предложить описание с помощью ИИ",
    suggestRewardDescription: "Предложить вознаграждение и описание с помощью ИИ",
    gettingSuggestions: "Получение предложений...",
    aiSuggestion: "Предложение ИИ",
    suggestedReward: "Предложенное вознаграждение",
    basedOnValue: "На основе примерной стоимости {value}",
    aiError: "Не удалось получить предложения ИИ. Заполните данные вручную.",
    // Statuses
    Lost: "Потеряно",
    Reported: "Зарегистрировано",
    Matched: "Совпадение! Ожидается оплата владельца.",
    PaymentPending: "Совпадение! Пожалуйста, выполните оплату.",
    PaymentComplete: "Оплата завершена! Приступайте к обмену.",
    ExchangePending: "Ожидание обмена",
    Completed: "Завершено",
    // Device Detail Page
    deviceDetails: "Детали устройства",
    matchFoundDevice: "Для вашего устройства найдено совпадение!",
    reward: "Вознаграждение",
    makePaymentSecurely: "Оплатить безопасно",
    waitingForOwnerPayment: "Ожидание оплаты владельца.",
    matchFoundTitle: "Совпадение найдено!",
    paymentReceived: "Оплата получена!",
    paymentSecureExchange: "Ваш платеж надёжно удерживается. Следуйте инструкции, чтобы завершить обмен и подтвердить его.",
    finderPaymentSecureExchange: "Платёж безопасно удерживается. Следуйте инструкции, чтобы завершить обмен и подтвердить его.",
    confirmExchange: "Я подтверждаю обмен",
    waitingForOtherParty: "Ожидание подтверждения другой стороны...",
    secureExchangeGuidelines: "Рекомендации по безопасному обмену",
    guideline1: "Договоритесь о встрече в безопасном общественном месте, например в отделении полиции или хорошо освещённом кафе.",
    guideline2: "Либо используйте отслеживаемую и застрахованную службу доставки для обмена устройством.",
    guideline3: "Не делитесь личными контактами. При необходимости общайтесь только через нашу платформу.",
    guideline4: "После успешного обмена нажмите кнопку подтверждения ниже.",
    transactionCompleted: "Сделка завершена!",
    transactionCompletedDesc: "Вознаграждение переведено нашедшему. Спасибо, что используете iFoundAnApple.",
    serviceFeeNotice: "Из вознаграждения удержана комиссия сервиса 5% для покрытия операционных расходов.",
    backToDashboard: "Назад к панели",
    goBack: "Назад",
    loading: "Загрузка...",
    loadingPageContent: "Пожалуйста, подождите, страница загружается...",
    viewInvoice: "Посмотреть счёт",
    failedToAddDevice: "Не удалось добавить устройство. Попробуйте снова.",
    failedToLoadDeviceModels: "Не удалось загрузить модели устройств.",
    loadingDeviceModels: "Загрузка моделей устройств...",
    noModelsAvailable: "Доступных моделей нет",
    selectModelFirst: "Сначала выберите модель устройства",
    // Payment related
    paymentSummary: "Сводка платежа",
    paymentSummarySubtitle: "Верните устройство с безопасным платежом",
    paymentConfirmation: "Подтверждение оплаты",
    termsAgreement: "Я прочитал и соглашаюсь c Условиями и Политикой конфиденциальности. Я понимаю, что мой платеж будет храниться в безопасном эскроу и будет передан нашедшему после доставки устройства.",
    securePayment: "Совершить безопасный платёж",
    paymentProcessing: "Обработка платежа...",
    paymentSecurityNotice: "🔒 Этот платёж защищён SSL. Данные карты надёжно шифруются и не сохраняются.",
    deviceModelNotSpecified: "Модель устройства не указана",
    feeCalculationFailed: "Не удалось рассчитать комиссии",
    feeCalculationError: "Ошибка при расчёте комиссий",
    paymentLoginRequired: "Для оплаты необходимо войти в систему",
    missingPaymentInfo: "Отсутствует платёжная информация",
    acceptTermsRequired: "Пожалуйста, примите условия использования",
    paymentInitiated: "Платёж успешно инициирован!",
    paymentFailed: "Платёж не выполнен",
    paymentError: "Произошла ошибка при обработке платежа",
    calculatingFees: "Расчёт комиссий...",
    errorOccurred: "Произошла ошибка",
    // Cargo related
    cargoTracking: "Отслеживание доставки",
    refresh: "Обновить",
    detailedTracking: "Подробное отслеживание",
    currentStatus: "Текущий статус",
    trackingInfo: "Информация по отслеживанию",
    anonymousId: "Анонимный ID",
    trackingNumber: "Трек-номер",
    yourRole: "Ваша роль",
    sender: "Отправитель",
    receiver: "Получатель",
    deviceInfo: "Информация об устройстве",
    estimatedDelivery: "Ожидаемая доставка",
    cargoHistory: "История доставки",
    deliveryCompleted: "Доставка завершена",
    confirmDeliveryMessage: "Нажмите кнопку, чтобы подтвердить получение устройства",
    confirmDelivery: "Подтвердить получение",
    cargoSupport: "Поддержка доставки: при проблемах обратитесь в службу поддержки перевозчика или свяжитесь с нами, указав свой анонимный код.",
    cargoLoadingInfo: "Загрузка информации о доставке...",
    cargoTrackingNotFound: "Информация об отслеживании не найдена",
    trackingInfoLoadError: "Ошибка при загрузке информации об отслеживании",
    tryAgain: "Повторить",
    noCargoMovement: "Движение по доставке ещё не началось",
    // Payment Flow & Match Payment translations
    matchPayment: "Оплата совпадения",
    matchPaymentSubtitle: "Верните устройство безопасно",
    deviceRecoveryPayment: "Платёж за возврат устройства",
    deviceRecoverySubtitle: "Верните потерянное устройство безопасным способом",
    feeDetails: "Детали комиссий",
    payment: "Оплата",
    deviceModel: "Модель устройства",
    stepIndicatorModel: "Модель устройства",
    stepIndicatorFees: "Детали комиссий",
    stepIndicatorPayment: "Оплата",
    matchInfo: "Информация о совпадении",
    deviceModelLabel: "Модель устройства:",
    finderReward: "Вознаграждение нашедшему:",
    statusLabel: "Статус:",
    matchFound: "Совпадение найдено",
    proceedToPayment: "Перейти к оплате →",
    customRewardAmount: "Произвольное вознаграждение",
    customRewardDescription: "Необязательно: при желании вы можете назначить более высокое вознаграждение.",
    defaultReward: "По умолчанию: {amount} TL",
    customRewardSet: "✓ Назначено индивидуальное вознаграждение: {amount} TL",
    changeDeviceModel: "← Изменить модель устройства",
    backToFeeDetails: "← Назад к деталям комиссий",
    finderRewardLabel: "Вознаграждение нашедшему:",
    cargoLabel: "Доставка:",
    serviceFeeLabel: "Комиссия сервиса:",
    gatewayFeeLabel: "Комиссия платежного шлюза:",
    totalLabel: "ИТОГО:",
    redirectingToDashboard: "Переход к панели...",
    // Fee Breakdown Card translations
    category: "Категория",
    matchedDevice: "Совпавшее устройство",
    matchedWithFinder: "Совпадение с нашедшим",
    ifoundanappleFeeBreakdown: "Разбивка комиссий iFoundAnApple",
    finderRewardDesc: "Выплачивается нашедшему",
    cargoFeeDesc: "За безопасную доставку",
    serviceFeeDesc: "Комиссия платформы",
    paymentCommissionDesc: "За безопасный платёж",
    totalPayment: "Общая сумма",
    paymentDue: "Сумма к оплате сейчас",
    finderNetPayment: "Чистый платёж нашедшему",
    afterServiceFeeDeduction: "После удержания комиссии сервиса",
    securePaymentSystem: "Безопасная эскроу-система",
    escrowSystemDesc: "Ваш платёж хранится на защищённом эскроу-счёте и переводится только после подтверждения доставки. С гарантией PAYNET у вас есть право отмены и возврата (за вычетом 3,43%).",
    // Payment Method Selector translations
    paymentMethod: "Способ оплаты",
    securePaymentOptions: "Безопасные варианты оплаты",
    recommended: "РЕКОМЕНДУЕМО",
    instant: "Мгновенно",
    free: "Бесплатно",
    turkeyTrustedPayment: "Надёжная платёжная система Турции",
    internationalSecurePayment: "Международный безопасный платёж",
    developmentTestPayment: "Тестовый платёж (dev)",
    turkeyMostTrustedPayment: "Самая надёжная платёжная система Турции",
    worldStandardSecurity: "Мировой стандарт безопасности",
    developmentTestMode: "Тестовый режим для разработки",
    stripeInternational: "Международный стандарт безопасности, шифрование SSL 256-бит.",
    testModeDesc: "Без реальных транзакций. Только для разработки и теста.",
    securityFeatures: "🔒 Функции безопасности",
    sslEncryption: "Шифрование SSL 256-бит",
    pciCompliance: "Соответствие PCI DSS",
    escrowGuarantee: "Гарантия эскроу",
    threeDSecureVerification: "Проверка 3D Secure",
    commission: "комиссия",
    // Admin Panel
    totalUsers: "Всего пользователей",
    totalDevices: "Всего устройств",
    allUsers: "Все пользователи",
    allDevices: "Все устройства",
    user: "Пользователь",
    role: "Роль",
    owner: "Владелец",
    finder: "Нашедший",
    admin: "Админ",
    // Footer and Static Pages
    faq: "FAQ",
    terms: "Условия",
    privacy: "Конфиденциальность",
    contact: "Контакты",
    downloadOnAppStore: "Скачать в App Store",
    faqTitle: "Часто задаваемые вопросы",
    termsTitle: "Условия использования",
    privacyTitle: "Политика конфиденциальности",
    contactTitle: "Свяжитесь с нами",
    contactIntro: "Если у вас есть вопросы или нужна помощь, напишите нам. Мы рады помочь!",
    contactEmail: "info@ifoundanapple.com",
    faqIntro: "Ответы на популярные вопросы о нашей платформе.",
    faqContent: {
      q1: "Как работает процесс сопоставления?",
      a1: "Наша система автоматически и анонимно сопоставляет отчёт о потерянном устройстве владельца с отчётом о найденном устройстве по модели и серийному номеру. Обе стороны получают моментальное уведомление.",
      q2: "Насколько безопасны мои личные данные?",
      a2: "Абсолютно. Ваша конфиденциальность - наш главный приоритет. Мы никогда не делимся вашей личной информацией (имя, email и т.д.) с другой стороной. Вся коммуникация и транзакции осуществляются анонимно и зашифрованы через платформу.",
      q3: "Как определяется сумма вознаграждения?",
      a3: "Мы используем механизм на основе ИИ, который рекомендует справедливое вознаграждение на основе модели устройства и оценочной стоимости на вторичном рынке.",
      q4: "Что такое безопасная система эскроу?",
      a4: "Когда найдено совпадение, владелец устройства совершает платеж. Платеж хранится в нашей безопасной системе эскроу. Мы безопасно храним платеж до подтверждения успешного обмена устройством. Это защищает как владельца, так и нашедшего.",
      q5: "Как происходит физический обмен?",
      a5: "Мы осуществляем безопасные процессы обмена с нашими партнерскими грузовыми компаниями. Платформа разработана для облегчения процесса без необходимости делиться личной контактной информацией.",
      q6: "Каковы комиссии?",
      a6: "Общие комиссии распределяются следующим образом;\\n\\nКомиссия безопасного платежного провайдера + Комиссия грузовой компании + Вознаграждение нашедшего + Комиссия сервиса.\\n\\nЭто помогает нам покрывать операционные расходы, поддерживать платформу и обеспечивать безопасную среду для всех.",
    },
    termsContent: "<p>Полная версия условий на русском языке будет доступна позже.</p>",
    privacyContent: "<p>Полная версия политики конфиденциальности на русском языке будет доступна позже.</p>",
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
    forgotPassword: "Mot de passe oublié ?",
    forgotPasswordTitle: "Réinitialiser le mot de passe",
    forgotPasswordDescription: "Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.",
    passwordResetEmailSent: "E-mail de réinitialisation envoyé ! Veuillez vérifier votre boîte de réception.",
    passwordResetError: "Erreur lors de l'envoi de l'e-mail de réinitialisation. Veuillez réessayer.",
    sendResetLink: "Envoyer le lien",
    sending: "Envoi...",
    cancel: "Annuler",
    passwordResetTitle: "Réinitialiser votre mot de passe",
    passwordResetDescription: "Veuillez entrer votre nouveau mot de passe ci-dessous.",
    newPassword: "Nouveau mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    resetting: "Réinitialisation...",
    resetPassword: "Réinitialiser le mot de passe",
    passwordResetSuccess: "Mot de passe réinitialisé avec succès !",
    passwordResetSuccessMessage: "Votre mot de passe a été réinitialisé avec succès. Redirection vers la page de connexion...",
    passwordResetLinkExpired: "Le lien de réinitialisation est invalide ou a expiré.",
    passwordResetLinkInvalid: "Lien de réinitialisation invalide.",
    passwordResetLinkExpiredMessage: "Le lien de réinitialisation est invalide ou a expiré. Veuillez en demander un nouveau.",
    backToLogin: "Retour à la connexion",
    passwordTooShort: "Le mot de passe doit contenir au moins 6 caractères.",
    passwordsDoNotMatch: "Les mots de passe ne correspondent pas.",
    checkingResetLink: "Vérification du lien de réinitialisation...",
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
    escrowSystemDesc: "Votre paiement est conservé dans notre compte d'entiercement sécurisé et ne sera pas transféré tant que l'appareil n'est pas livré et confirmé. Avec la garantie PAYNET, vous disposez de droits d'annulation et de remboursement hors frais de 3,43%.",
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
      a6: "Le détail total des frais est le suivant ;\\n\\nFrais du fournisseur de paiement sécurisé + Frais de la compagnie de transport + Récompense du trouveur + Frais de service.\\n\\nCela nous aide à couvrir les coûts opérationnels, maintenir la plateforme et assurer un environnement sécurisé pour tous."
    },
    termsContent: `
      <h2 class="text-2xl font-bold mb-4">CONDITIONS D'UTILISATION</h2>
      <p class="mb-4"><strong>Dernière mise à jour :</strong> 14 octobre 2025</p>

      <h3 class="text-xl font-semibold mb-2">1. PORTÉE DU CONTRAT</h3>
      <p class="mb-4">Ces conditions régissent la relation juridique entre la plateforme iFoundAnApple et les utilisateurs.</p>
      
      <p class="mb-4"><strong>Propriétaire de la plateforme :</strong> iFoundAnApple</p>
      <p class="mb-4"><strong>Contact :</strong> support@ifoundanapple.com</p>
      <p class="mb-4"><strong>Droit :</strong> Lois de la République de Turquie</p>

      <h4 class="text-lg font-semibold mb-2">1.1 Signification de l'acceptation</h4>
      <p class="mb-4">En vous inscrivant sur la plateforme, en créant un compte ou en utilisant les services, vous êtes réputé avoir accepté ces conditions.</p>

      <h4 class="text-lg font-semibold mb-2">1.2 Droit de modification</h4>
      <p class="mb-4">Nous pouvons modifier ces conditions avec un préavis de 7 jours. Les modifications sont :</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Communiquées par e-mail</li>
        <li>Annoncées sur le site web</li>
        <li>Envoyées comme notifications dans l'application</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">2. SERVICES DE LA PLATEFORME</h3>
      
      <h4 class="text-lg font-semibold mb-2">2.1 Services que nous fournissons</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>✅ Enregistrement d'appareil perdu : Enregistrer les appareils Apple dans le système</li>
        <li>✅ Notification d'appareil trouvé : Signaler les appareils que vous avez trouvés</li>
        <li>✅ Appariement automatique : Appariement basé sur le numéro de série</li>
        <li>✅ Système anonyme : Vos informations d'identité sont tenues confidentielles</li>
        <li>✅ Paiement sécurisé : Paiement sécurisé conforme PCI-DSS</li>
        <li>✅ Système de séquestre : L'argent est conservé en sécurité</li>
        <li>✅ Organisation du transport : Sélection et suivi des compagnies de transport</li>
        <li>✅ Système de notifications : Mises à jour en temps réel</li>
        <li>✅ Suggestions alimentées par l'IA : Suggestions de récompense avec Google Gemini</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">2.2 Services que nous ne fournissons pas</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>❌ Livraison de transport : Nous ne fournissons pas de services de transport</li>
        <li>❌ Rencontres physiques : Nous ne réunissons pas physiquement les parties</li>
        <li>❌ Réparation d'appareil : Nous ne fournissons pas de support technique</li>
        <li>❌ Représentation légale : Nous ne fournissons pas de services juridiques</li>
        <li>❌ Garantie : L'état ou la fonctionnalité de l'appareil n'est pas garanti</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">3. INSCRIPTION ET GESTION DE COMPTE</h3>
      
      <h4 class="text-lg font-semibold mb-2">3.1 Exigences d'inscription</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Doit avoir 18 ans ou plus</li>
        <li>Adresse e-mail valide requise</li>
        <li>Doit fournir des informations exactes</li>
        <li>Doit résider en Turquie ou dans les pays de l'UE</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.2 Méthodes d'inscription</h4>
      <p class="mb-2"><strong>Inscription par e-mail :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Nom, prénom, e-mail, date de naissance et mot de passe requis</li>
        <li>Vérification par e-mail obligatoire</li>
      </ul>
      
      <p class="mb-2"><strong>Inscription OAuth (Google / Apple) :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Authentification d'identité tierce</li>
        <li>Soumis aux conditions du fournisseur OAuth</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.3 Sécurité du compte</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Gardez votre mot de passe fort et ne le partagez pas</li>
        <li>Ne partagez pas vos informations de compte avec qui que ce soit</li>
        <li>Signalez immédiatement les activités suspectes</li>
        <li>Chaque utilisateur ne peut ouvrir qu'un seul compte</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.4 Activités de compte interdites</h4>
      <p class="mb-2">Les situations suivantes entraînent la fermeture du compte :</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Utilisation de fausses informations d'identité</li>
        <li>Ouverture de comptes multiples (pour la même personne)</li>
        <li>Utilisation du compte d'une autre personne</li>
        <li>Utilisation de robots ou d'outils automatisés</li>
        <li>Tentative de manipulation du système</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">4. RESPONSABILITÉS DU PROPRIÉTAIRE D'APPAREIL</h3>
      
      <h4 class="text-lg font-semibold mb-2">4.1 Propriété légale</h4>
      <p class="mb-2">Lors de l'ajout d'un appareil perdu :</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Vous déclarez être le propriétaire légal de l'appareil</li>
        <li>Vous devez être en mesure de fournir des documents de propriété (facture, certificat de garantie)</li>
        <li>Vous vous engagez à ne pas signaler un appareil volé ou faux</li>
      </ul>
      <p class="mb-4"><strong>Important :</strong> L'enregistrement de l'appareil est entièrement gratuit. Le paiement n'est demandé que lorsque votre appareil est trouvé et que le processus d'échange commence.</p>

      <h4 class="text-lg font-semibold mb-2">4.2 Fourniture d'informations exactes</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Vous devez saisir correctement le modèle de l'appareil, le numéro de série et les caractéristiques</li>
        <li>Vous devez signaler honnêtement l'état de l'appareil</li>
        <li>Vous devez spécifier la date et le lieu de perte aussi précisément que possible</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.3 Obligation de paiement</h4>
      <p class="mb-2">Lorsqu'une correspondance se produit :</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Vous vous engagez à payer le montant de la récompense déterminé</li>
        <li>Vous devez effectuer le paiement dans les 48 heures</li>
        <li>Les frais comprennent les éléments suivants :
          <ul class="list-disc pl-6 mt-2">
            <li>Frais de service iFoundAnApple</li>
            <li>Commission du fournisseur de paiement (coût de l'infrastructure de paiement sécurisée)</li>
            <li>Frais de transport (pour que votre appareil vous parvienne en toute sécurité)</li>
            <li>Récompense pour le trouveur d'appareil (en signe d'appréciation pour leur contribution bienveillante)</li>
          </ul>
        </li>
        <li>Vous ne pouvez pas annuler après le paiement (sauf pour des raisons valables)</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.4 Réception du transport</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Vous devez fournir des informations d'adresse correctes pour la livraison</li>
        <li>Vous devez vérifier le colis à la réception</li>
        <li>Vous devez appuyer sur le bouton "J'ai reçu, confirmer" dans les 7 jours</li>
        <li>Si vous ne confirmez pas, une confirmation automatique est donnée après 7 jours</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">5. RESPONSABILITÉS DU TROUVeur D'APPAREIL</h3>
      
      <h4 class="text-lg font-semibold mb-2">5.1 Découverte honnête</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Vous déclarez avoir trouvé l'appareil conformément à la loi</li>
        <li>Vous vous engagez à ne pas avoir volé l'appareil ou à l'avoir acquis par des moyens illégaux</li>
        <li>Vous acceptez de livrer l'appareil trouvé intact et complet</li>
      </ul>
      <p class="mb-4"><strong>Important :</strong> L'enregistrement d'un appareil trouvé est entièrement gratuit. Ce comportement civil et honorable est inestimable pour nous.</p>

      <h4 class="text-lg font-semibold mb-2">5.2 Fourniture d'informations exactes</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Vous devez saisir correctement les informations de l'appareil</li>
        <li>Vous devez signaler honnêtement la date et le lieu de la découverte</li>
        <li>Vous devez être transparent sur l'état de l'appareil</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">5.3 Expédition du transport</h4>
      <p class="mb-2">Une fois le paiement terminé :</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Vous devez livrer l'appareil au transporteur dans les 5 jours ouvrables</li>
        <li>Vous devez sélectionner une compagnie de transport et saisir le numéro de suivi dans le système</li>
        <li>Vous devez envoyer l'appareil dans son état d'origine, non endommagé</li>
        <li>Vous vous engagez à ne pas interférer avec l'appareil (cassage de mot de passe, remplacement de pièce)</li>
      </ul>
      
      <p class="mb-2"><strong>Frais de transport :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Les frais de transport (250 TL) sont payés par le propriétaire de l'appareil</li>
        <li>Vous pouvez le livrer à la compagnie de transport comme "paiement à la livraison"</li>
        <li>Ou vous pouvez payer d'abord et le récupérer avec la récompense</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">5.4 Récompense et informations IBAN/Banque</h4>
      <p class="mb-2"><strong>Détermination de la récompense :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>La récompense qui vous sera donnée est déterminée à un taux certain et équitable basé sur la valeur marchande de l'appareil trouvé</li>
        <li>De cette façon, nous nous assurons que vous recevez un petit cadeau en retour de votre effort et comportement exemplaire</li>
        <li>iFoundAnApple fournit un processus d'échange sécurisé pour garantir que l'appareil atteint son propriétaire en toute sécurité et que vous recevez votre récompense complètement</li>
      </ul>
      
      <p class="mb-2"><strong>Informations IBAN/Banque :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Vous devez fournir un IBAN valide pour le paiement de la récompense</li>
        <li>Vous déclarez que l'IBAN vous appartient</li>
        <li>Vous acceptez de remplir vos obligations fiscales</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">6. PAIEMENTS, FRAIS ET SYSTÈME DE SÉQUESTRE</h3>
      
      <h4 class="text-lg font-semibold mb-2">6.1 Système de récompense</h4>
      <p class="mb-2"><strong>Détermination de la récompense :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Le propriétaire de l'appareil détermine librement le montant de la récompense</li>
        <li>Minimum : 500 TL, Maximum : 50 000 TL</li>
        <li>Le système de suggestion IA peut être utilisé (optionnel, Google Gemini)</li>
        <li>La récompense doit être un pourcentage raisonnable de la valeur marchande de l'appareil</li>
      </ul>
      
      <p class="mb-2"><strong>Moment du paiement :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Le paiement doit être effectué dans les 48 heures lorsqu'une correspondance se produit</li>
        <li>Si le paiement n'est pas effectué, la correspondance est annulée</li>
        <li>Le paiement est pris dans le système de séquestre et conservé en sécurité</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">6.2 Frais de service</h4>
      <p class="mb-2"><strong>Frais pour le propriétaire de l'appareil (formule v5.0) :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Montant brut :</strong> Montant total reçu du client (y compris la commission PAYNET)</li>
        <li><strong>Commission PAYNET :</strong> 3,43% du montant brut (déduite automatiquement)</li>
        <li><strong>Montant net :</strong> Montant restant après déduction de la commission PAYNET</li>
        <li><strong>Frais de transport :</strong> 250 TL (fixe)</li>
        <li><strong>Récompense du trouveur :</strong> 20% du montant net</li>
        <li><strong>Frais de service :</strong> Montant net - transport - récompense (reste)</li>
      </ul>

      <p class="mb-2"><strong>Exemple de calcul (propriétaire d'appareil) - v5.0 :</strong></p>
      <div class="bg-gray-100 p-4 rounded mb-4">
        <p><strong>Montant brut :</strong> 2 000 TL (total reçu du client)</p>
        <p>├── <strong>Commission PAYNET :</strong> 68,60 TL (3,43%) - Déduite automatiquement</p>
        <p>└── <strong>Montant net :</strong> 1 931,40 TL (conservé dans le système de séquestre)</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;├── <strong>Frais de transport :</strong> 250,00 TL (fixe)</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;├── <strong>Récompense du trouveur :</strong> 386,28 TL (20%)</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;└── <strong>Frais de service :</strong> 1 295,12 TL (reste)</p>
        <p>─────────────────────────────────────────</p>
        <p><strong>TOTAL :</strong> 68,60 + 250 + 386,28 + 1 295,12 = 2 000,00 TL ✅</p>
      </div>

      <p class="mb-2"><strong>Frais pour le trouveur :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Net à recevoir :</strong> Récompense au trouveur (20% du montant net)</li>
        <li><strong>Frais de transfert :</strong> Peut s'appliquer dans le virement bancaire (environ 5-10 TL)</li>
      </ul>

      <p class="mb-2"><strong>Exemple de calcul (trouveur) - v5.0 :</strong></p>
      <div class="bg-gray-100 p-4 rounded mb-4">
        <p><strong>Montant net :</strong> 1 931,40 TL</p>
        <p><strong>Récompense du trouveur (20%) :</strong> 386,28 TL</p>
        <p>─────────────────────────────────────────</p>
        <p><strong>NET À RECEVOIR :</strong> 386,28 TL</p>
      </div>

      <h4 class="text-lg font-semibold mb-2">6.3 Système de séquestre</h4>
      <p class="mb-2"><strong>Comment ça fonctionne (v5.0) :</strong></p>
      <ol class="list-decimal pl-6 mb-4">
        <li>Une correspondance se produit</li>
        <li>Le propriétaire de l'appareil paie le montant brut (dans les 48 heures)</li>
        <li>La commission PAYNET (3,43%) est déduite automatiquement</li>
        <li>Le montant net est conservé en sécurité dans le compte de séquestre (statut : "conservé")</li>
        <li>Le trouveur envoie le transport (dans les 5 jours ouvrables)</li>
        <li>Le propriétaire de l'appareil reçoit le transport et appuie sur le bouton "J'ai reçu, confirmer"</li>
        <li>Le montant net est distribué comme suit :
          <ul class="list-disc pl-6 mt-2">
            <li>Frais de transport (250 TL) → Compagnie de transport</li>
            <li>Récompense du trouveur (20%) → IBAN du trouveur</li>
            <li>Frais de service (reste) → Plateforme</li>
          </ul>
        </li>
      </ol>

      <p class="mb-2"><strong>Durée du séquestre (v5.0) :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Attente maximale : 30 jours</li>
        <li>Confirmation du propriétaire : Le montant net est libéré immédiatement</li>
        <li>Si pas de confirmation : Confirmation automatique après 7 jours</li>
        <li>Si pas de livraison dans les 30 jours : Montant brut automatiquement remboursé (commission PAYNET déduite)</li>
      </ul>

      <p class="mb-2"><strong>Processus de confirmation :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Seul le propriétaire de l'appareil donne la confirmation (confirmation unilatérale)</li>
        <li>Le trouveur ne confirme pas, envoie uniquement le transport</li>
        <li>Pas de système de confirmation bilatérale</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">6.4 Politique d'annulation et de remboursement</h4>
      <p class="mb-2"><strong>Droit d'annulation :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Vous n'avez pas de droit de rétractation après le paiement (car le service a commencé)</li>
        <li>L'annulation est possible par accord mutuel avant l'envoi du transport</li>
      </ul>
      
      <p class="mb-2"><strong>Conditions de remboursement :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Si le trouveur n'envoie pas le transport dans les 5 jours ouvrables : Remboursement complet</li>
        <li>Si l'appareil livré est différent : Remboursement complet + pénalité au trouveur</li>
        <li>Annulation due à des problèmes techniques : Remboursement complet</li>
        <li>Annulation par accord mutuel : Remboursement complet</li>
      </ul>
      
      <p class="mb-2"><strong>Déduction de remboursement (v5.0) :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Si vous demandez l'annulation de la transaction pendant le processus d'échange, la commission de la passerelle de paiement (3,43%) est remboursée avec déduction</li>
        <li>Si le montant brut est payé et le montant net est conservé en séquestre : Le montant net est entièrement remboursé</li>
        <li>L'annulation doit être effectuée avant le début du processus de transport</li>
        <li>Après annulation : Montant brut - Commission de la passerelle de paiement = Montant du remboursement</li>
      </ul>
      
      <p class="mb-2"><strong>Processus de remboursement :</strong></p>
      <ol class="list-decimal pl-6 mb-4">
        <li>La demande d'annulation/remboursement est créée</li>
        <li>La plateforme examine (1-3 jours ouvrables)</li>
        <li>Une décision est prise</li>
        <li>Si le remboursement est approuvé, il est crédité au compte dans les 5-10 jours ouvrables</li>
      </ol>

      <h4 class="text-lg font-semibold mb-2">6.5 Méthodes de paiement</h4>
      <p class="mb-2"><strong>Méthodes de paiement acceptées :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Carte de crédit (Visa, Mastercard, American Express)</li>
        <li>Carte de débit</li>
        <li>Carte virtuelle</li>
        <li>Apple Pay (pour les utilisateurs iPhone, iPad, Mac)</li>
        <li>3D Secure obligatoire (pour la sécurité)</li>
      </ul>
      
      <p class="mb-2"><strong>Sécurité des paiements :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Infrastructure de paiement sécurisée certifiée PCI-DSS niveau 1</li>
        <li>Chiffrement SSL/TLS</li>
        <li>Vérification 3D Secure</li>
        <li>Tokenisation (les informations de carte ne sont pas stockées chez nous)</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">7. PROCESSUS DE TRANSPORT ET LIVRAISON</h3>
      
      <h4 class="text-lg font-semibold mb-2">7.1 Rôle de la plateforme</h4>
      <p class="mb-4"><strong>Important :</strong> La plateforme n'est pas partie à la livraison. Le transport est entièrement géré par les compagnies de transport.</p>
      
      <p class="mb-2"><strong>Ce que la plateforme fournit :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Options de compagnies de transport (Aras, MNG, Yurtiçi, PTT)</li>
        <li>Système de suivi du transport</li>
        <li>Partage d'adresse de livraison (système anonyme)</li>
        <li>Notifications de statut de transport</li>
      </ul>
      
      <p class="mb-2"><strong>Ce que la plateforme ne fournit pas :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Service de livraison physique</li>
        <li>Organisation de coursier</li>
        <li>Assurance transport (doit être obtenue auprès de la compagnie de transport)</li>
        <li>Garantie de perte/dommage du transport</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">7.2 Compagnies de transport</h4>
      <p class="mb-2"><strong>Compagnies de transport prises en charge :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Aras Cargo</li>
        <li>MNG Cargo</li>
        <li>Yurtiçi Cargo</li>
        <li>PTT Cargo</li>
      </ul>
      <p class="mb-4">La personne qui trouve l'appareil sélectionne l'une de ces compagnies et livre l'appareil à la compagnie avec le numéro de transport reçu du système.</p>

      <h4 class="text-lg font-semibold mb-2">7.3 Système d'identité anonyme</h4>
      <p class="mb-2">Pour protéger votre vie privée :</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Un code anonyme est donné au trouveur : FND-XXX123</li>
        <li>Un code anonyme est donné au propriétaire : OWN-YYY456</li>
        <li>Ces codes sont utilisés dans les informations d'expédition</li>
        <li>Les identités réelles ne sont pas partagées avec la compagnie de transport</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">7.4 Recommandations de sécurité du transport</h4>
      <p class="mb-2"><strong>Pour l'expéditeur (trouveur) :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Prenez des photos de l'appareil et du colis (avant la livraison)</li>
        <li>Notez toujours le numéro de suivi</li>
      </ul>
      
      <p class="mb-2"><strong>Pour le destinataire (propriétaire) :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Vérifiez le colis à la réception</li>
        <li>En cas de dommage, déposez immédiatement une réclamation</li>
        <li>Documentez l'ouverture du colis avec vidéo/photos</li>
        <li>Vérifiez le numéro de série de l'appareil</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">7.5 Suivi du transport</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Vous pouvez suivre le statut du transport en temps réel via la plateforme</li>
        <li>Vous recevez des mises à jour de statut automatiques :
          <ul class="list-disc pl-6 mt-2">
            <li>Transport créé</li>
            <li>Transport collecté</li>
            <li>À l'agence de transport</li>
            <li>En cours de livraison</li>
            <li>Livré</li>
          </ul>
        </li>
        <li>La date de livraison estimée est affichée</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">7.6 Problèmes de livraison</h4>
      <p class="mb-2"><strong>Si le transport est perdu :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Contactez immédiatement la compagnie de transport</li>
        <li>Signalez à l'équipe de support de la plateforme (support@ifoundanapple.com)</li>
        <li>L'assurance de la compagnie de transport entre en vigueur</li>
        <li>La plateforme peut jouer le rôle de médiateur</li>
        <li>L'argent en séquestre est remboursé au propriétaire</li>
      </ul>
      
      <p class="mb-2"><strong>Livraison endommagée :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Vérifiez le transport à la réception</li>
        <li>En cas de dommage, déposez une réclamation auprès de l'agent de transport avant la réception</li>
        <li>Informez immédiatement la plateforme</li>
        <li>Fournissez des preuves photo/vidéo</li>
        <li>Le processus de remboursement est initié</li>
      </ul>
      
      <p class="mb-2"><strong>Mauvais/appareil différent :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Vérifiez le numéro de série</li>
        <li>Si différent, ne confirmez pas</li>
        <li>Signalez à l'équipe de support</li>
        <li>Le processus de remboursement complet est initié</li>
        <li>Une pénalité est appliquée au trouveur</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">8. ANONYMAT ET CONFIDENTIALITÉ</h3>
      
      <h4 class="text-lg font-semibold mb-2">8.1 Confidentialité de l'identité</h4>
      <p class="mb-2"><strong>Avant la correspondance :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Aucune information utilisateur n'est partagée</li>
        <li>Système complètement anonyme</li>
      </ul>
      
      <p class="mb-2"><strong>Après la correspondance :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Identité :</strong> Reste CACHÉE</li>
        <li><strong>E-mail :</strong> Reste CACHÉ</li>
        <li><strong>Téléphone :</strong> Partagé uniquement avec la compagnie de transport pour la livraison</li>
        <li><strong>Adresse :</strong> Partagée uniquement avec la compagnie de transport pour la livraison</li>
      </ul>
      
      <p class="mb-2"><strong>Informations partagées pour le transport :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Nom complet</li>
        <li>Adresse de livraison</li>
        <li>Numéro de téléphone</li>
        <li>Code expéditeur/destinataire anonyme (FND-XXX, OWN-XXX)</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">8.2 Communication</h4>
      <p class="mb-2"><strong>Notifications de la plateforme :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Notifications par e-mail</li>
        <li>Notifications dans l'application</li>
        <li>Notifications SMS (pour les situations critiques)</li>
      </ul>
      
      <p class="mb-2"><strong>Communication directe :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Pas de messagerie directe entre utilisateurs</li>
        <li>Toute communication est gérée via la plateforme</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">9. RESPONSABILITÉS ET LIMITATIONS DE LA PLATEFORME</h3>
      
      <h4 class="text-lg font-semibold mb-2">9.1 Responsabilités de notre plateforme</h4>
      <p class="mb-2"><strong>Pour les services que nous fournissons :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Maintenir l'infrastructure de la plateforme opérationnelle</li>
        <li>Assurer la sécurité des données</li>
        <li>Exploiter le système de paiement en toute sécurité</li>
        <li>Gérer le séquestre correctement</li>
        <li>Fournir le support client</li>
        <li>Prendre des mesures de prévention de la fraude</li>
        <li>Se conformer aux obligations légales</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">9.2 Limitations de responsabilité</h4>
      <p class="mb-4"><strong>La plateforme N'EST PAS RESPONSABLE de :</strong></p>
      
      <p class="mb-2"><strong>Appareil et livraison :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>L'état réel de l'appareil livré</li>
        <li>Le fait que l'appareil soit fonctionnel/utilisable</li>
        <li>Dommages physiques ou pièces manquantes</li>
        <li>Si l'appareil est original</li>
      </ul>
      
      <p class="mb-2"><strong>Transport :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Erreurs, retards, pertes des compagnies de transport</li>
        <li>Livraison endommagée</li>
        <li>Assurance transport (responsabilité de l'utilisateur)</li>
      </ul>
      
      <p class="mb-2"><strong>Comportement de l'utilisateur :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Utilisateurs fournissant de fausses/informations incomplètes</li>
        <li>Tentatives de fraude (que nous n'avons pas pu détecter)</li>
        <li>Litiges de propriété</li>
      </ul>
      
      <p class="mb-2"><strong>Services tiers :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Interruptions du système de paiement</li>
        <li>Problèmes du fournisseur OAuth</li>
        <li>Interruptions du fournisseur d'accès Internet</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">9.3 Limitation de compensation</h4>
      <p class="mb-2"><strong>Compensation maximale :</strong></p>
      <p class="mb-4">Dans tous les cas, la responsabilité de la plateforme est limitée au montant des frais de service reçu dans la transaction concernée.</p>
      <p class="mb-4"><strong>Exemple :</strong> Dans une transaction de récompense de 5 000 TL où les frais de plateforme sont de 150 TL, le montant maximum de compensation est de 150 TL.</p>
      
      <p class="mb-2"><strong>Dommages exclus :</strong></p>
      <p class="mb-2">La plateforme ne peut être tenue responsable des dommages suivants :</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Dommages indirects</li>
        <li>Perte de profit</li>
        <li>Perte de réputation</li>
        <li>Dommages moraux</li>
        <li>Perte de données</li>
        <li>Perte d'activité</li>
      </ul>
      <p class="mb-4"><strong>Exception :</strong> Ces limitations ne s'appliquent pas si la plateforme a une négligence intentionnelle ou grave.</p>

      <h4 class="text-lg font-semibold mb-2">9.4 Garantie de service et interruptions</h4>
      <p class="mb-2"><strong>Ce que nous ne garantissons pas :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Service sans interruption</li>
        <li>Fonctionnement sans erreur</li>
        <li>Garantie de trouver une correspondance</li>
        <li>Résultats dans un délai spécifique</li>
      </ul>
      
      <p class="mb-2"><strong>Maintenance planifiée :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Annoncée à l'avance (au moins 24 heures)</li>
        <li>Généralement effectuée pendant les heures de nuit</li>
        <li>Durée maximale de 4 heures</li>
      </ul>
      
      <p class="mb-2"><strong>Maintenance d'urgence :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Peut ne pas être annoncée à l'avance</li>
        <li>Pour la sécurité ou les erreurs critiques</li>
        <li>Terminée dès que possible</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">10. ACTIVITÉS INTERDITES</h3>
      <p class="mb-2">Les activités suivantes sont strictement interdites :</p>
      
      <p class="mb-2"><strong>❌ Fraude :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Fourniture de fausses informations</li>
        <li>Signalement d'appareil volé</li>
        <li>Revendication de l'appareil d'une autre personne</li>
        <li>Faux numéro de série</li>
      </ul>
      
      <p class="mb-2"><strong>❌ Violations de compte :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Utilisation de fausse identité</li>
        <li>Ouverture de comptes multiples</li>
        <li>Utilisation du compte d'une autre personne</li>
        <li>Robots ou outils automatisés</li>
      </ul>
      
      <p class="mb-2"><strong>❌ Manipulation du système :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Conclure des accords hors plateforme</li>
        <li>Tentative de contournement du système</li>
        <li>Tentative de contournement du séquestre</li>
      </ul>
      
      <p class="mb-2"><strong>❌ Autres :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Harcèlement, menaces</li>
        <li>Violation de propriété intellectuelle</li>
        <li>Virus, logiciels malveillants</li>
        <li>Extraction de données</li>
      </ul>
      
      <p class="mb-2"><strong>Pénalités :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Fermeture de compte</li>
        <li>Annulation de paiement</li>
        <li>Initiation d'action légale</li>
        <li>Remboursement des montants gagnés</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">11. SUSPENSION ET RÉSILIATION DE COMPTE</h3>
      
      <h4 class="text-lg font-semibold mb-2">11.1 Fermeture initiée par la plateforme</h4>
      <p class="mb-2"><strong>Raisons de fermeture immédiate :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Fraude ou fausses informations</li>
        <li>Signalement d'appareil volé</li>
        <li>Fausse identité</li>
        <li>Fraude de paiement</li>
        <li>Activités illégales</li>
      </ul>
      
      <p class="mb-2"><strong>Fermeture après avertissement :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Fourniture continue de fausses informations</li>
        <li>Violation des règles de la plateforme</li>
        <li>Non-respect de l'obligation de paiement (répété)</li>
        <li>Non-envoi du transport (sans raison valable)</li>
      </ul>
      
      <p class="mb-4"><strong>Suspension :</strong> Le compte peut être temporairement suspendu pendant l'enquête sur des situations suspectes (maximum 30 jours).</p>

      <h4 class="text-lg font-semibold mb-2">11.2 Fermeture de compte initiée par l'utilisateur</h4>
      <p class="mb-2"><strong>Fermeture de votre propre compte :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Vous pouvez utiliser l'option "Supprimer le compte" dans les paramètres du profil</li>
        <li>S'il y a des transactions en cours, la fermeture ne peut pas être effectuée avant leur achèvement</li>
        <li>S'il y a des paiements en attente en séquestre, ils doivent être finalisés</li>
      </ul>
      
      <p class="mb-2"><strong>Résultats de la fermeture de compte :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Vos données personnelles sont supprimées dans les 30 jours</li>
        <li>Votre historique de transactions est anonymisé</li>
        <li>Le compte fermé ne peut pas être rouvert</li>
        <li>Les dossiers financiers sont conservés pendant 10 ans (exigence légale, anonyme)</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">12. FORCE MAJEURE</h3>
      <p class="mb-2">Dans les situations de force majeure suivantes, la plateforme ne peut être tenue responsable de ses obligations :</p>
      
      <p class="mb-2"><strong>Catastrophes naturelles :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Tremblement de terre, inondation, incendie, tempête</li>
      </ul>
      
      <p class="mb-2"><strong>Événements sociaux :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Guerre, terrorisme, soulèvement, couvre-feu</li>
      </ul>
      
      <p class="mb-2"><strong>Problèmes techniques :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Interruptions de l'infrastructure Internet (problèmes FAI)</li>
        <li>Panne de courant</li>
        <li>Interruptions du fournisseur de serveurs (Supabase)</li>
        <li>Interruptions du système de paiement</li>
        <li>Attaques DDoS, cyberattaques</li>
      </ul>
      
      <p class="mb-2"><strong>Changements légaux :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Changements de loi soudains, interdictions, réglementations</li>
      </ul>
      
      <p class="mb-2"><strong>Pandémie/Crise sanitaire :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Situations de maladie épidémique</li>
        <li>Restrictions officielles</li>
      </ul>
      
      <p class="mb-4">En cas de force majeure, les utilisateurs sont immédiatement informés et des solutions alternatives sont fournies.</p>

      <h3 class="text-xl font-semibold mb-2">13. RÉSOLUTION DES LITIGES</h3>
      
      <h4 class="text-lg font-semibold mb-2">13.1 Communication et support</h4>
      <p class="mb-2"><strong>Première étape - Notre équipe de support :</strong></p>
      <p class="mb-2">Si vous rencontrez un problème, contactez d'abord notre équipe de support :</p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>E-mail :</strong> support@ifoundanapple.com</li>
        <li><strong>Temps de réponse :</strong> 24-48 heures</li>
        <li><strong>Temps de résolution :</strong> 5 jours ouvrables (moyenne)</li>
      </ul>
      
      <p class="mb-4"><strong>Médiation :</strong> S'il y a un litige entre utilisateurs, la plateforme peut jouer le rôle de médiateur (optionnel).</p>

      <h4 class="text-lg font-semibold mb-2">13.2 Droit applicable</h4>
      <p class="mb-4">Cet accord est soumis aux lois de la République de Turquie.</p>

      <h4 class="text-lg font-semibold mb-2">13.3 Tribunal compétent et bureaux d'exécution</h4>
      <p class="mb-2">Pour les litiges découlant de cet accord :</p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Pour les utilisateurs en Turquie :</strong> Les tribunaux et bureaux d'exécution d'Istanbul (Çağlayan) sont compétents</li>
        <li><strong>Pour les utilisateurs dans l'UE :</strong> Les tribunaux de résidence de l'utilisateur sont également compétents (en raison du GDPR)</li>
      </ul>
      
      <p class="mb-2"><strong>Droits des consommateurs :</strong></p>
      <p class="mb-4">Les consommateurs peuvent s'adresser aux comités d'arbitrage des consommateurs et aux tribunaux des consommateurs en vertu de la loi sur la protection des consommateurs.</p>
      
      <p class="mb-2"><strong>Comité d'arbitrage des consommateurs :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Web :</strong> https://tuketicihakemleri.ticaret.gov.tr</li>
        <li>Le système de demande électronique est disponible</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">13.4 Résolution alternative des litiges</h4>
      <p class="mb-2"><strong>Résolution en ligne des litiges (ODR) :</strong></p>
      <p class="mb-2">Les consommateurs dans l'UE peuvent utiliser la plateforme ODR de l'UE :</p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Plateforme :</strong> https://ec.europa.eu/consumers/odr</li>
        <li><strong>Contact :</strong> info@ifoundanapple.com</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">14. DROITS DE PROPRIÉTÉ INTELLECTUELLE</h3>
      
      <h4 class="text-lg font-semibold mb-2">14.1 Droits de la plateforme</h4>
      <p class="mb-4">Tout le contenu, le design, le logo, le code logiciel, les algorithmes sur la plateforme sont sous le droit d'auteur d'iFoundAnApple.</p>
      
      <p class="mb-2"><strong>Actions interdites :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Copie ou reproduction de contenu</li>
        <li>Utilisation non autorisée du logo</li>
        <li>Rétro-ingénierie du code source</li>
        <li>Extraction de données (collecte automatique de données)</li>
        <li>Utilisation non autorisée de l'API</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">14.2 Contenu utilisateur</h4>
      <p class="mb-4">Le contenu que vous téléchargez sur la plateforme (photos, descriptions) est votre propriété intellectuelle.</p>
      
      <p class="mb-2"><strong>Licence que vous donnez à la plateforme :</strong></p>
      <p class="mb-2">En téléchargeant du contenu, vous donnez à la plateforme les droits suivants :</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Afficher le contenu sur la plateforme</li>
        <li>Stocker et traiter le contenu</li>
        <li>Sauvegarder le contenu</li>
        <li>Optimiser techniquement (compression etc.)</li>
      </ul>
      <p class="mb-4">La plateforme n'utilise, ne vend ni ne partage votre contenu à d'autres fins.</p>

      <h3 class="text-xl font-semibold mb-2">15. DISPOSITIONS DIVERSES</h3>
      
      <h4 class="text-lg font-semibold mb-2">15.1 Faire des notifications</h4>
      <p class="mb-2"><strong>De la plateforme à vous :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>E-mail (votre adresse e-mail enregistrée)</li>
        <li>Notification dans l'application</li>
        <li>SMS (pour les situations d'urgence)</li>
      </ul>
      
      <p class="mb-2"><strong>De vous à la plateforme :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Général :</strong> info@ifoundanapple.com</li>
        <li><strong>Juridique :</strong> legal@ifoundanapple.com</li>
        <li><strong>Sécurité :</strong> security@ifoundanapple.com</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">15.2 Intégrité de l'accord</h4>
      <p class="mb-4">Ces conditions constituent l'accord complet entre les parties.</p>

      <h4 class="text-lg font-semibold mb-2">15.3 Invalidité partielle</h4>
      <p class="mb-4">Si une disposition des conditions est jugée invalide, les autres dispositions restent valides.</p>

      <h4 class="text-lg font-semibold mb-2">15.4 Interdiction de cession</h4>
      <p class="mb-4">Les utilisateurs ne peuvent pas céder les droits et obligations découlant de cet accord à des tiers.</p>
      <p class="mb-4">La plateforme peut céder ses droits en cas de transfert d'entreprise, fusion ou acquisition.</p>

      <h4 class="text-lg font-semibold mb-2">15.5 Dossiers électroniques</h4>
      <p class="mb-4">Les dossiers électroniques de la plateforme constituent une preuve définitive en vertu de l'article 297 du CPC.</p>

      <h3 class="text-xl font-semibold mb-2">16. INFORMATIONS DE CONTACT</h3>
      <p class="mb-2"><strong>iFoundAnApple</strong></p>
      
      <p class="mb-2"><strong>Support général :</strong></p>
      <p class="mb-4"><strong>E-mail :</strong> info@ifoundanapple.com</p>
      <p class="mb-4"><strong>Temps de réponse :</strong> 24-48 heures</p>
      
      <p class="mb-2"><strong>Affaires juridiques :</strong></p>
      <p class="mb-4"><strong>E-mail :</strong> legal@ifoundanapple.com</p>
      
      <p class="mb-2"><strong>Sécurité :</strong></p>
      <p class="mb-4"><strong>E-mail :</strong> security@ifoundanapple.com</p>
      
      <p class="mb-2"><strong>Site web :</strong></p>
      <p class="mb-4">https://ifoundanapple.com</p>

      <h3 class="text-xl font-semibold mb-2">17. ACCEPTATION ET APPROBATION</h3>
      <ul class="list-disc pl-6 mb-4">
        <li>✅ J'ai lu, compris et accepté ces conditions d'utilisation.</li>
        <li>✅ Je déclare avoir plus de 18 ans et avoir la capacité juridique.</li>
        <li>✅ En utilisant la plateforme, j'accepte de respecter ces conditions et la politique de confidentialité.</li>
        <li>✅ Je consens à recevoir des notifications par e-mail, SMS et dans l'application.</li>
      </ul>

      <div class="bg-gray-100 p-4 rounded mt-6">
        <p><strong>Dernière mise à jour :</strong> 14 octobre 2025</p>
        <p><strong>Version :</strong> 2.0</p>
        <p><strong>Validité :</strong> Turquie et Union européenne</p>
        <p><strong>© 2025 iFoundAnApple. Tous droits réservés.</strong></p>
      </div>
    `,
    privacyContent: `
      <h2 class="text-2xl font-bold mb-4">POLITIQUE DE CONFIDENTIALITÉ</h2>
      <p class="mb-4"><strong>Dernière mise à jour :</strong> 14 octobre 2025</p>

      <h3 class="text-xl font-semibold mb-2">1. RESPONSABLE DES DONNÉES</h3>
      <p class="mb-4"><strong>iFoundAnApple</strong></p>
      <p class="mb-4"><strong>E-mail :</strong> privacy@ifoundanapple.com</p>
      <p class="mb-4"><strong>Web :</strong> https://ifoundanapple.com</p>
      <p class="mb-4">Cette politique est préparée conformément à la KVKK et au GDPR.</p>

      <h3 class="text-xl font-semibold mb-2">2. INFORMATIONS SUR L'HÉBERGEMENT ET LE DOMAINE</h3>
      <p class="mb-4"><strong>Propriétaire du domaine :</strong> iFoundAnApple</p>
      <p class="mb-4"><strong>Fournisseur d'hébergement :</strong> Hetzner</p>
      <p class="mb-4"><strong>Certificat SSL :</strong> Actif (HTTPS)</p>
      <p class="mb-4"><strong>Vérification du domaine :</strong> Hébergé sur notre propre domaine</p>
      <p class="mb-4"><strong>IMPORTANT :</strong> Cette politique de confidentialité est hébergée sur notre propre domaine, et non sur des plateformes tierces telles que Google Sites, Facebook, Instagram, Twitter.</p>

      <h3 class="text-xl font-semibold mb-2">3. DONNÉES PERSONNELLES COLLECTÉES</h3>
      
      <h4 class="text-lg font-semibold mb-2">3.1 Inscription et authentification</h4>
      <p class="mb-2"><strong>Inscription par e-mail :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Prénom, nom</li>
        <li>Adresse e-mail</li>
        <li>Mot de passe (stocké chiffré avec bcrypt)</li>
        <li>Date de naissance</li>
      </ul>
      
      <p class="mb-2"><strong>Connexion OAuth (Google/Apple) :</strong></p>
      <p class="mb-2">Lorsque vous vous connectez avec Google ou Apple, nous collectons les données utilisateur suivantes :</p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Données utilisateur Google :</strong> Nom, E-mail, Photo de profil (optionnel)</li>
        <li><strong>Objectif :</strong> Création de compte et authentification UNIQUEMENT</li>
        <li><strong>Protection des données :</strong> Chiffrement AES-256-GCM au repos</li>
        <li><strong>Stockage des données :</strong> Chiffré dans notre base de données sécurisée (Supabase)</li>
        <li><strong>Partage des données :</strong> Uniquement avec les fournisseurs de services pour la fonctionnalité de la plateforme (voir section 5.1)</li>
        <li><strong>Rétention des données :</strong> Durée de vie du compte actif, supprimé dans les 30 jours après la suppression du compte</li>
        <li>Pas besoin de créer un mot de passe</li>
      </ul>
      <p class="mb-4"><strong>IMPORTANT :</strong> Nous utilisons les données utilisateur Google UNIQUEMENT pour fournir la fonctionnalité de la plateforme. Nous NE les utilisons PAS à des fins publicitaires, de vente à des tiers ou à tout autre usage.</p>

      <h4 class="text-lg font-semibold mb-2">3.2 Informations sur l'appareil</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Modèle de l'appareil (iPhone 15 Pro, MacBook Air, etc.)</li>
        <li>Numéro de série</li>
        <li>Couleur et description de l'appareil</li>
        <li>Date et lieu de perte/trouvaille</li>
        <li>Document de facture/propriété (visuel - peut être supprimé)</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.3 Informations de paiement et financières</h4>
      <p class="mb-2"><strong>Transactions de paiement :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Informations de carte de crédit/bancaire traitées par un fournisseur de paiement sécurisé (conforme PCI-DSS)</li>
        <li>Vos informations de carte ne sont pas stockées sur nos serveurs</li>
        <li>L'historique et les montants des transactions sont enregistrés</li>
      </ul>
      
      <p class="mb-2"><strong>Informations bancaires :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Numéro IBAN (pour le transfert de récompense)</li>
        <li>Nom du titulaire du compte</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.4 Informations de profil et de contact</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Numéro d'identité nationale (optionnel, pour transactions à haute valeur)</li>
        <li>Numéro de téléphone</li>
        <li>Adresse de livraison (pour le transport)</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.5 Données collectées automatiquement</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Adresse IP</li>
        <li>Informations sur le navigateur et l'appareil</li>
        <li>Informations de session</li>
        <li>Statistiques d'utilisation de la plateforme</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">4. FINALITÉS D'UTILISATION DES DONNÉES</h3>
      
      <h4 class="text-lg font-semibold mb-2">4.1 Fourniture de services</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Appariement des appareils perdus et trouvés (basé sur le numéro de série)</li>
        <li>Gestion du compte utilisateur</li>
        <li>Organisation et suivi du transport</li>
        <li>Envoi de notifications</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.2 Opérations de paiement et de séquestre</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Traitement sécurisé des paiements</li>
        <li>Exploitation du système de séquestre</li>
        <li>Transfert des paiements de récompense vers IBAN</li>
        <li>Maintien des dossiers financiers</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.3 Recommandations alimentées par l'IA</h4>
      <p class="mb-4">Cette fonctionnalité est optionnelle. Nous utilisons uniquement les informations sur le modèle d'appareil pour les recommandations IA. Les données d'identité personnelle ne sont jamais partagées.</p>

      <h4 class="text-lg font-semibold mb-2">4.4 Limitations d'utilisation des données</h4>
      <p class="mb-2"><strong>Utilisation des données utilisateur Google et des données personnelles :</strong></p>
      <p class="mb-2">Nous utilisons vos données utilisateur Google et vos informations personnelles UNIQUEMENT pour :</p>
      <ul class="list-disc pl-6 mb-4">
        <li>✅ Fournir la fonctionnalité de la plateforme (authentification, gestion de compte)</li>
        <li>✅ Traiter les transactions et paiements</li>
        <li>✅ Organiser la livraison de l'appareil</li>
        <li>✅ Envoyer des notifications de service importantes</li>
        <li>✅ Améliorer l'expérience utilisateur</li>
        <li>✅ Sécurité et prévention de la fraude</li>
      </ul>
      <p class="mb-2"><strong>Nous N'utilisons PAS vos données pour :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>❌ Publicité ciblée ou marketing</li>
        <li>❌ Vente à des courtiers de données ou revendeurs d'informations</li>
        <li>❌ Détermination de la solvabilité ou objectifs de prêt</li>
        <li>❌ Publicités utilisateur ou publicité personnalisée</li>
        <li>❌ Formation de modèles IA non liés à notre service</li>
        <li>❌ Création de bases de données à d'autres fins</li>
        <li>❌ Tout autre objectif au-delà de la fourniture ou l'amélioration de la fonctionnalité de la plateforme</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.5 Sécurité</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Prévention de la fraude</li>
        <li>Vérification d'identité</li>
        <li>Maintien des journaux d'audit</li>
        <li>Détection de violation de sécurité</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.6 Conformité légale</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Conformité aux exigences KVKK et GDPR</li>
        <li>Obligations de la législation fiscale (conservation des dossiers pendant 10 ans)</li>
        <li>Décisions judiciaires et processus légaux</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">5. PARTAGE DE DONNÉES</h3>
      
      <h4 class="text-lg font-semibold mb-2">5.1 Fournisseurs de services</h4>
      <p class="mb-2"><strong>Supabase (Infrastructure backend) :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Base de données, authentification, stockage de fichiers</li>
        <li>SOC 2 Type II, conforme GDPR</li>
        <li>Emplacement des données : USA/UE</li>
        <li><strong>Données utilisateur Google partagées :</strong> Nom, E-mail (chiffré)</li>
      </ul>
      
      <p class="mb-2"><strong>Fournisseur de paiement :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Traitement des paiements, 3D Secure, séquestre</li>
        <li>Certifié PCI-DSS niveau 1</li>
        <li>Basé en Turquie</li>
        <li><strong>Données utilisateur Google partagées :</strong> E-mail (pour les reçus de transaction uniquement)</li>
      </ul>
      
      <p class="mb-2"><strong>Google/Apple (Authentification OAuth) :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Connexion tierce (optionnel)</li>
        <li>Utilisé uniquement pour l'authentification</li>
      </ul>
      
      <p class="mb-2"><strong>Google Gemini (Recommandations IA) :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Seules les informations sur le modèle d'appareil sont partagées</li>
        <li>Aucune donnée utilisateur Google (nom, e-mail) n'est partagée</li>
        <li>Aucune information d'identité personnelle n'est partagée</li>
      </ul>
      
      <p class="mb-2"><strong>Compagnies de transport (Aras, MNG, Yurtiçi, PTT) :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Adresse de livraison et téléphone</li>
        <li>Codes expéditeur/destinataire anonymes (FND-XXX, OWN-XXX)</li>
        <li>Les identités réelles (nom, e-mail) sont tenues confidentielles</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">5.2 Partage inter-utilisateurs</h4>
      <p class="mb-4"><strong>IMPORTANT :</strong> Votre identité, votre e-mail et votre numéro de téléphone ne sont jamais partagés avec d'autres utilisateurs.</p>
      
      <p class="mb-2"><strong>Après l'appariement :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>L'identité de l'autre partie reste anonyme</li>
        <li>Seule la notification "Correspondance trouvée" est envoyée</li>
        <li>Seule l'adresse de livraison est partagée pour le transport (nom-prénom et adresse)</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">5.3 Obligation légale</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Ordre judiciaire ou assignation</li>
        <li>Demandes des forces de l'ordre</li>
        <li>Autorités fiscales (pour les dossiers financiers)</li>
        <li>Demandes de l'institution KVKK</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">6. SÉCURITÉ ET CONSERVATION DES DONNÉES</h3>
      
      <h4 class="text-lg font-semibold mb-2">6.1 Mesures de sécurité</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Chiffrement SSL/TLS (HTTPS) - TLS 1.3</li>
        <li>Hachage des mots de passe (bcrypt)</li>
        <li><strong>Chiffrement de la base de données au repos (AES-256-GCM)</strong></li>
        <li><strong>Chiffrement au niveau de l'application pour les données sensibles :</strong></li>
        <ul class="list-disc pl-6 mb-4">
          <li>Numéro d'identité nationale turque (TC Kimlik No)</li>
          <li>Numéros IBAN</li>
          <li>Numéros de téléphone</li>
          <li>Adresses physiques</li>
          <li>Données utilisateur Google (nom, e-mail)</li>
        </ul>
        <li>Politiques de sécurité au niveau des lignes (RLS)</li>
        <li>Jetons d'authentification sécurisés OAuth 2.0</li>
        <li>Vérification de paiement 3D Secure</li>
        <li>Support d'authentification à deux facteurs (2FA)</li>
        <li>Audits de sécurité réguliers et évaluations de vulnérabilité</li>
        <li>Journaux de contrôle d'accès et surveillance</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">6.2 Périodes de conservation</h4>
      
      <p class="mb-2"><strong>Conservation des données utilisateur Google :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Comptes actifs :</strong> Conservées tant que votre compte est actif</li>
        <li><strong>Comptes supprimés :</strong> Données utilisateur Google (nom, e-mail) supprimées dans les 30 jours</li>
        <li><strong>Données financières :</strong> 10 ans (exigence légale - Loi fiscale)</li>
        <li><strong>Vous pouvez demander la suppression :</strong> Envoyez-nous un e-mail à privacy@ifoundanapple.com</li>
      </ul>
      
      <p class="mb-2"><strong>Comptes actifs :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Conservées tant que votre compte est actif</li>
      </ul>
      
      <p class="mb-2"><strong>Comptes fermés :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Supprimées dans les 30 jours après la fermeture du compte</li>
        <li>Dossiers financiers conservés pendant 10 ans (obligation légale)</li>
        <li>Statistiques anonymes peuvent être conservées indéfiniment</li>
      </ul>
      
      <p class="mb-2"><strong>Dossiers de transaction :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Transactions financières : 10 ans</li>
        <li>Dossiers de transport : 2 ans</li>
        <li>Journaux d'audit : 5 ans</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">7. DROITS DES UTILISATEURS (KVKK & GDPR)</h3>
      
      <h4 class="text-lg font-semibold mb-2">7.1 Vos droits</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>✅ <strong>Droit à l'information :</strong> Savoir si vos données sont traitées</li>
        <li>✅ <strong>Droit d'accès :</strong> Obtenir une copie de vos données</li>
        <li>✅ <strong>Droit de rectification :</strong> Corriger les informations incorrectes</li>
        <li>✅ <strong>Droit à l'effacement :</strong> Supprimer vos données (droit à l'oubli)</li>
        <li>✅ <strong>Droit d'opposition :</strong> Vous opposer aux activités de traitement des données</li>
        <li>✅ <strong>Portabilité des données :</strong> Transférer vos données vers une autre plateforme</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">7.2 Méthode de demande</h4>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>E-mail :</strong> privacy@ifoundanapple.com</li>
        <li><strong>Sujet :</strong> Demande KVKK/GDPR</li>
        <li><strong>Temps de réponse :</strong> 30 jours (maximum)</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">7.3 Droit de plainte</h4>
      <p class="mb-2"><strong>Turquie :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Autorité de protection des données personnelles - https://www.kvkk.gov.tr</li>
      </ul>
      
      <p class="mb-2"><strong>UE :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Autorité de protection des données du pays concerné</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">8. CONFIDENTIALITÉ DES ENFANTS</h3>
      <p class="mb-4">La plateforme n'est pas destinée aux utilisateurs de moins de 18 ans. Nous ne collectons pas sciemment de données auprès de personnes de moins de 18 ans.</p>

      <h3 class="text-xl font-semibold mb-2">9. COOKIES</h3>
      <p class="mb-2"><strong>Cookies que nous utilisons :</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Gestion de session (obligatoire)</li>
        <li>Préférences linguistiques (fonctionnel)</li>
        <li>Sécurité (obligatoire)</li>
      </ul>
      <p class="mb-4">Vous pouvez gérer les cookies depuis les paramètres de votre navigateur.</p>

      <h3 class="text-xl font-semibold mb-2">10. TRANSFERT INTERNATIONAL DE DONNÉES</h3>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Supabase :</strong> Centres de données USA/UE (conforme GDPR, SCC)</li>
        <li><strong>Fournisseur de paiement :</strong> International</li>
        <li><strong>Google :</strong> Global (pour OAuth et IA)</li>
      </ul>
      <p class="mb-4">Tous les transferts sont effectués conformément aux dispositions KVKK et GDPR.</p>

      <h3 class="text-xl font-semibold mb-2">11. CHANGEMENTS ET MISES À JOUR</h3>
      <p class="mb-2">Nous pouvons mettre à jour cette politique de confidentialité de temps en temps. Lorsque des modifications importantes sont apportées :</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Nous publions des annonces sur le site web</li>
        <li>Nous envoyons des notifications par e-mail</li>
        <li>La date de "Dernière mise à jour" est modifiée</li>
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
    forgotPassword: "パスワードをお忘れですか？",
    forgotPasswordTitle: "パスワードのリセット",
    forgotPasswordDescription: "メールアドレスを入力してください。パスワードリセット用のリンクをお送りします。",
    passwordResetEmailSent: "パスワードリセットメールを送信しました！受信トレイを確認してください。",
    passwordResetError: "パスワードリセットメールの送信中にエラーが発生しました。もう一度お試しください。",
    sendResetLink: "リセットリンクを送信",
    sending: "送信中...",
    cancel: "キャンセル",
    passwordResetTitle: "パスワードをリセット",
    passwordResetDescription: "新しいパスワードを以下に入力してください。",
    newPassword: "新しいパスワード",
    confirmPassword: "パスワードを確認",
    resetting: "リセット中...",
    resetPassword: "パスワードをリセット",
    passwordResetSuccess: "パスワードリセット成功！",
    passwordResetSuccessMessage: "パスワードが正常にリセットされました。ログインページにリダイレクトしています...",
    passwordResetLinkExpired: "パスワードリセットリンクが無効または期限切れです。",
    passwordResetLinkInvalid: "無効なパスワードリセットリンクです。",
    passwordResetLinkExpiredMessage: "パスワードリセットリンクが無効または期限切れです。新しいリンクをリクエストしてください。",
    backToLogin: "ログインに戻る",
    passwordTooShort: "パスワードは6文字以上である必要があります。",
    passwordsDoNotMatch: "パスワードが一致しません。",
    checkingResetLink: "リセットリンクを確認中...",
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
    escrowSystemDesc: "お支払いは安全なエスクロー口座で保管され、デバイスが配送・確認されるまで相手に送金されません。PAYNETの保証により、3.43%の手数料を除き、キャンセルと返金の権利が保護されています。",
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
        a6: "総手数料の内訳は以下の通りです；\\n\\n安全な支払いプロバイダーの手数料 + 運輸会社の手数料 + 発見者の報酬 + サービス料金。\\n\\nこれは、運営費をカバーし、プラットフォームを維持し、すべての人のための安全な環境を確保するのに役立ちます。"
    },
    termsContent: `
      <h2 class="text-2xl font-bold mb-4">利用規約</h2>
      <p class="mb-4"><strong>最終更新日：</strong> 2025年10月14日</p>

      <h3 class="text-xl font-semibold mb-2">1. 契約範囲</h3>
      <p class="mb-4">本規約は、iFoundAnAppleプラットフォームとユーザー間の法的関係を規律します。</p>
      
      <p class="mb-4"><strong>プラットフォーム所有者：</strong> iFoundAnApple</p>
      <p class="mb-4"><strong>連絡先：</strong> support@ifoundanapple.com</p>
      <p class="mb-4"><strong>適用法：</strong> トルコ共和国法</p>

      <h4 class="text-lg font-semibold mb-2">1.1 承認の意味</h4>
      <p class="mb-4">プラットフォームに登録し、アカウントを作成し、またはサービスを使用することで、本規約を承認したものとみなされます。</p>

      <h4 class="text-lg font-semibold mb-2">1.2 変更権</h4>
      <p class="mb-4">7日前の通知により本規約を変更することができます。変更は以下の方法で通知されます：</p>
      <ul class="list-disc pl-6 mb-4">
        <li>メールで通知</li>
        <li>ウェブサイトで発表</li>
        <li>アプリ内通知として送信</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">2. プラットフォームサービス</h3>
      
      <h4 class="text-lg font-semibold mb-2">2.1 提供するサービス</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>✅ 紛失デバイス登録：Appleデバイスをシステムに登録</li>
        <li>✅ 発見デバイス通知：発見したデバイスを報告</li>
        <li>✅ 自動マッチング：シリアル番号ベースのマッチング</li>
        <li>✅ 匿名システム：身元情報は機密保持</li>
        <li>✅ 安全な支払い：PCI-DSS準拠の安全な支払い</li>
        <li>✅ エスクローシステム：資金は安全に保管</li>
        <li>✅ 運輸組織：運輸会社の選択と追跡</li>
        <li>✅ 通知システム：リアルタイム更新</li>
        <li>✅ AI による提案：Google Gemini による報酬提案</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">2.2 提供しないサービス</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>❌ 運輸配送：運輸サービスは提供しません</li>
        <li>❌ 物理的な会合：当事者を物理的に集めません</li>
        <li>❌ デバイス修理：技術サポートは提供しません</li>
        <li>❌ 法的代理：法的サービスは提供しません</li>
        <li>❌ 保証：デバイスの状態や機能は保証されません</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">3. 登録とアカウント管理</h3>
      
      <h4 class="text-lg font-semibold mb-2">3.1 登録要件</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>18歳以上である必要があります</li>
        <li>有効なメールアドレスが必要です</li>
        <li>正確な情報を提供する必要があります</li>
        <li>トルコまたはEU諸国に居住する必要があります</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.2 登録方法</h4>
      <p class="mb-2"><strong>メール登録：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>名前、姓、メール、生年月日、パスワードが必要です</li>
        <li>メール確認が必須です</li>
      </ul>
      
      <p class="mb-2"><strong>OAuth登録（Google / Apple）：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>サードパーティの身元認証</li>
        <li>OAuthプロバイダーの規約に準拠</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.3 アカウントセキュリティ</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>パスワードを強力に保ち、共有しないでください</li>
        <li>アカウント情報を誰とも共有しないでください</li>
        <li>不審な活動をすぐに報告してください</li>
        <li>各ユーザーは1つのアカウントのみ開設可能です</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.4 禁止されるアカウント活動</h4>
      <p class="mb-2">以下の状況はアカウント閉鎖につながります：</p>
      <ul class="list-disc pl-6 mb-4">
        <li>偽の身元情報の使用</li>
        <li>複数のアカウント開設（同一人物の場合）</li>
        <li>他人のアカウントの使用</li>
        <li>ボットや自動化ツールの使用</li>
        <li>システム操作の試み</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">4. デバイス所有者の責任</h3>
      
      <h4 class="text-lg font-semibold mb-2">4.1 法的所有権</h4>
      <p class="mb-2">紛失デバイスを追加する際：</p>
      <ul class="list-disc pl-6 mb-4">
        <li>デバイスの法的所有者であることを宣言します</li>
        <li>所有証明書（請求書、保証書）を提供できる必要があります</li>
        <li>盗難または偽のデバイスを報告していないことを約束します</li>
      </ul>
      <p class="mb-4"><strong>重要：</strong> デバイス登録は完全に無料です。お支払いは、デバイスが見つかり交換プロセスが開始された場合にのみ請求されます。</p>

      <h4 class="text-lg font-semibold mb-2">4.2 正確な情報の提供</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>デバイスのモデル、シリアル番号、機能を正確に入力する必要があります</li>
        <li>デバイスの状態を正直に報告する必要があります</li>
        <li>紛失日と場所を可能な限り正確に指定する必要があります</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.3 支払い義務</h4>
      <p class="mb-2">マッチングが発生した場合：</p>
      <ul class="list-disc pl-6 mb-4">
        <li>決定された報酬額を支払うことを約束します</li>
        <li>48時間以内に支払いを行う必要があります</li>
        <li>手数料には以下の項目が含まれます：
          <ul class="list-disc pl-6 mt-2">
            <li>iFoundAnAppleサービス料</li>
            <li>支払いプロバイダー手数料（安全な支払いインフラコスト）</li>
            <li>運輸料（デバイスを安全に受け取るため）</li>
            <li>デバイス発見者への報酬（親切な貢献への感謝の印として）</li>
          </ul>
        </li>
        <li>支払い後は（正当な理由がない限り）キャンセルできません</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.4 運輸の受領</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>配送のため正しい住所情報を提供する必要があります</li>
        <li>受け取った際に運輸を確認する必要があります</li>
        <li>7日以内に「受領済み、確認」ボタンを押す必要があります</li>
        <li>確認しない場合、7日後に自動確認が与えられます</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">5. デバイス発見者の責任</h3>
      
      <h4 class="text-lg font-semibold mb-2">5.1 誠実な発見</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>法律に従ってデバイスを発見したことを宣言します</li>
        <li>デバイスを盗んだり、違法な手段で取得したりしていないことを約束します</li>
        <li>発見したデバイスを損傷なく完全に配送することに同意します</li>
      </ul>
      <p class="mb-4"><strong>重要：</strong> 発見デバイス登録は完全に無料です。この市民的で高潔な行動は非常に価値があります。</p>

      <h4 class="text-lg font-semibold mb-2">5.2 正確な情報の提供</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>デバイス情報を正確に入力する必要があります</li>
        <li>発見日と場所を正直に報告する必要があります</li>
        <li>デバイスの状態について透明である必要があります</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">5.3 運輸出荷</h4>
      <p class="mb-2">支払いが完了した後：</p>
      <ul class="list-disc pl-6 mb-4">
        <li>営業日5日以内にデバイスを運輸に引き渡す必要があります</li>
        <li>運輸会社を選択し、追跡番号をシステムに入力する必要があります</li>
        <li>デバイスを元の状態で損傷なく送付する必要があります</li>
        <li>デバイスに干渉しないことを約束します（パスワード解析、部品交換など）</li>
      </ul>
      
      <p class="mb-2"><strong>運輸料：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>運輸料（250 TL）はデバイス所有者が支払います</li>
        <li>運輸会社に「代金引換」として引き渡すことができます</li>
        <li>または先に支払い、報酬と一緒に返金を受けることができます</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">5.4 報酬とIBAN/銀行情報</h4>
      <p class="mb-2"><strong>報酬の決定：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>お支払いする報酬は、発見されたデバイスの市場価値に基づいて一定かつ公正な率で決定されます</li>
        <li>これにより、努力と模範的な行動への見返りとして小さな贈り物を受け取ることができます</li>
        <li>iFoundAnAppleは、デバイスが所有者に安全に届き、報酬を完全に受け取れるよう安全な交換プロセスを提供します</li>
      </ul>
      
      <p class="mb-2"><strong>IBAN/銀行情報：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>報酬支払いのために有効なIBANを提供する必要があります</li>
        <li>IBANが自分に属することを宣言します</li>
        <li>税務義務を履行することに同意します</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">6. 支払い、手数料、エスクローシステム</h3>
      
      <h4 class="text-lg font-semibold mb-2">6.1 報酬システム</h4>
      <p class="mb-2"><strong>報酬の決定：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>デバイス所有者が自由に報酬額を決定します</li>
        <li>最小：500 TL、最大：50,000 TL</li>
        <li>AI提案システムを使用できます（オプション、Google Gemini）</li>
        <li>報酬はデバイスの市場価値の合理的な割合であるべきです</li>
      </ul>
      
      <p class="mb-2"><strong>支払いタイミング：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>マッチングが発生した場合、48時間以内に支払いを行う必要があります</li>
        <li>支払いが行われない場合、マッチングはキャンセルされます</li>
        <li>支払いはエスクローシステムに預けられ、安全に保管されます</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">6.2 サービス料</h4>
      <p class="mb-2"><strong>デバイス所有者の手数料（v5.0式）：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>総額：</strong> 顧客から受け取った総額（PAYNET手数料含む）</li>
        <li><strong>PAYNET手数料：</strong> 総額の3.43%（自動控除）</li>
        <li><strong>正味額：</strong> PAYNET手数料控除後の残額</li>
        <li><strong>運輸料：</strong> 250 TL（固定）</li>
        <li><strong>発見者報酬：</strong> 正味額の20%</li>
        <li><strong>サービス料：</strong> 正味額 - 運輸 - 報酬（残り）</li>
      </ul>

      <p class="mb-2"><strong>計算例（デバイス所有者）- v5.0：</strong></p>
      <div class="bg-gray-100 p-4 rounded mb-4">
        <p><strong>総額：</strong> 2,000 TL（顧客から受け取った合計）</p>
        <p>├── <strong>PAYNET手数料：</strong> 68.60 TL（3.43%）- 自動控除</p>
        <p>└── <strong>正味額：</strong> 1,931.40 TL（エスクローシステムで保管）</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;├── <strong>運輸料：</strong> 250.00 TL（固定）</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;├── <strong>発見者報酬：</strong> 386.28 TL（20%）</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;└── <strong>サービス料：</strong> 1,295.12 TL（残り）</p>
        <p>─────────────────────────────────────────</p>
        <p><strong>合計：</strong> 68.60 + 250 + 386.28 + 1,295.12 = 2,000.00 TL ✅</p>
      </div>

      <p class="mb-2"><strong>発見者の手数料：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>正味受取額：</strong> 発見者への報酬（正味額の20%）</li>
        <li><strong>振込手数料：</strong> 銀行振込で適用される場合があります（約5-10 TL）</li>
      </ul>

      <p class="mb-2"><strong>計算例（発見者）- v5.0：</strong></p>
      <div class="bg-gray-100 p-4 rounded mb-4">
        <p><strong>正味額：</strong> 1,931.40 TL</p>
        <p><strong>発見者報酬（20%）：</strong> 386.28 TL</p>
        <p>─────────────────────────────────────────</p>
        <p><strong>正味受取額：</strong> 386.28 TL</p>
      </div>

      <h4 class="text-lg font-semibold mb-2">6.3 エスクローシステム</h4>
      <p class="mb-2"><strong>仕組み（v5.0）：</strong></p>
      <ol class="list-decimal pl-6 mb-4">
        <li>マッチングが発生</li>
        <li>デバイス所有者が総額を支払う（48時間以内）</li>
        <li>PAYNET手数料（3.43%）が自動的に控除される</li>
        <li>正味額がエスクロー口座に安全に保管される（ステータス：「保管中」）</li>
        <li>発見者が運輸を送る（営業日5日以内）</li>
        <li>デバイス所有者が運輸を受け取り、「受領済み、確認」ボタンを押す</li>
        <li>正味額が以下のように分配される：
          <ul class="list-disc pl-6 mt-2">
            <li>運輸料（250 TL）→ 運輸会社</li>
            <li>発見者報酬（20%）→ 発見者のIBAN</li>
            <li>サービス料（残り）→ プラットフォーム</li>
          </ul>
        </li>
      </ol>

      <p class="mb-2"><strong>エスクロー期間（v5.0）：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>最大待機：30日</li>
        <li>デバイス所有者確認：正味額はすぐに解放される</li>
        <li>確認がない場合：7日後に自動確認</li>
        <li>30日以内に配送がない場合：総額が自動返金される（PAYNET手数料控除）</li>
      </ul>

      <p class="mb-2"><strong>確認プロセス：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>デバイス所有者のみが確認を行う（一方的な確認）</li>
        <li>発見者は確認せず、運輸を送るのみ</li>
        <li>双方向確認システムはない</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">6.4 キャンセルと返金ポリシー</h4>
      <p class="mb-2"><strong>キャンセル権：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>支払い後は撤回権はありません（サービスが開始されたため）</li>
        <li>運輸が送られる前の相互合意によるキャンセルが可能です</li>
      </ul>
      
      <p class="mb-2"><strong>返金条件：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>発見者が営業日5日以内に運輸を送らない場合：全額返金</li>
        <li>配送されたデバイスが異なる場合：全額返金 + 発見者への罰金</li>
        <li>技術的問題によるキャンセル：全額返金</li>
        <li>相互合意によるキャンセル：全額返金</li>
      </ul>
      
      <p class="mb-2"><strong>返金控除（v5.0）：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>交換プロセス中に取引キャンセルを要求する場合、支払いゲートウェイ手数料（3.43%）は控除されて返金されます</li>
        <li>総額が支払われ、正味額がエスクローで保管されている場合：正味額は全額返金されます</li>
        <li>キャンセルは運輸プロセス開始前に行う必要があります</li>
        <li>キャンセル後：総額 - 支払いゲートウェイ手数料 = 返金額</li>
      </ul>
      
      <p class="mb-2"><strong>返金プロセス：</strong></p>
      <ol class="list-decimal pl-6 mb-4">
        <li>キャンセル/返金リクエストが作成される</li>
        <li>プラットフォームが審査（営業日1-3日）</li>
        <li>決定が行われる</li>
        <li>返金が承認された場合、営業日5-10日以内にアカウントにクレジットされます</li>
      </ol>

      <h4 class="text-lg font-semibold mb-2">6.5 支払い方法</h4>
      <p class="mb-2"><strong>受け入れられる支払い方法：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>クレジットカード（Visa、Mastercard、American Express）</li>
        <li>デビットカード</li>
        <li>仮想カード</li>
        <li>Apple Pay（iPhone、iPad、Macユーザー向け）</li>
        <li>3D Secure必須（セキュリティのため）</li>
      </ul>
      
      <p class="mb-2"><strong>支払いセキュリティ：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>PCI-DSSレベル1認定の安全な支払いインフラ</li>
        <li>SSL/TLS暗号化</li>
        <li>3D Secure認証</li>
        <li>トークン化（カード情報は当社に保存されません）</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">7. 運輸プロセスと配送</h3>
      
      <h4 class="text-lg font-semibold mb-2">7.1 プラットフォームの役割</h4>
      <p class="mb-4"><strong>重要：</strong> プラットフォームは運輸配送の当事者ではありません。運輸は完全に運輸会社によって処理されます。</p>
      
      <p class="mb-2"><strong>プラットフォームが提供するもの：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>運輸会社の選択肢（Aras、MNG、Yurtiçi、PTT）</li>
        <li>運輸追跡システム</li>
        <li>配送住所共有（匿名システム）</li>
        <li>運輸ステータス通知</li>
      </ul>
      
      <p class="mb-2"><strong>プラットフォームが提供しないもの：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>物理的な運輸配送サービス</li>
        <li>運輸配送員組織</li>
        <li>運輸保険（運輸会社から取得する必要があります）</li>
        <li>運輸紛失/損傷保証</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">7.2 運輸会社</h4>
      <p class="mb-2"><strong>サポートされる運輸会社：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Aras Cargo</li>
        <li>MNG Cargo</li>
        <li>Yurtiçi Cargo</li>
        <li>PTT Cargo</li>
      </ul>
      <p class="mb-4">デバイスを発見した人は、これらの会社のいずれかを選択し、システムから受け取った運輸番号とともにデバイスを会社に引き渡します。</p>

      <h4 class="text-lg font-semibold mb-2">7.3 匿名身元システム</h4>
      <p class="mb-2">プライバシーを保護するために：</p>
      <ul class="list-disc pl-6 mb-4">
        <li>発見者に匿名コードが与えられる：FND-XXX123</li>
        <li>デバイス所有者に匿名コードが与えられる：OWN-YYY456</li>
        <li>これらのコードは運輸出荷情報で使用されます</li>
        <li>実際の身元は運輸会社と共有されません</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">7.4 運輸セキュリティ推奨事項</h4>
      <p class="mb-2"><strong>送信者（発見者）向け：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>デバイスとパッケージの写真を撮る（配送前）</li>
        <li>常に追跡番号を記録する</li>
      </ul>
      
      <p class="mb-2"><strong>受信者（デバイス所有者）向け：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>受け取った際にパッケージを確認する</li>
        <li>損傷がある場合、すぐに報告する</li>
        <li>パッケージ開封を動画/写真で記録する</li>
        <li>デバイスのシリアル番号を確認する</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">7.5 運輸追跡</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>プラットフォームを通じてリアルタイムで運輸ステータスを追跡できます</li>
        <li>自動ステータス更新を受け取ります：
          <ul class="list-disc pl-6 mt-2">
            <li>運輸作成</li>
            <li>運輸収集</li>
            <li>運輸支店に到着</li>
            <li>配送中</li>
            <li>配送済み</li>
          </ul>
        </li>
        <li>推定配送日が表示されます</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">7.6 配送の問題</h4>
      <p class="mb-2"><strong>運輸が紛失した場合：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>すぐに運輸会社に連絡する</li>
        <li>プラットフォームサポートチームに報告する（support@ifoundanapple.com）</li>
        <li>運輸会社の保険が発動する</li>
        <li>プラットフォームが調停役を務めることができます</li>
        <li>エスクロー内の資金はデバイス所有者に返金される</li>
      </ul>
      
      <p class="mb-2"><strong>損傷配送：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>受け取った際に運輸を確認する</li>
        <li>損傷がある場合、受け取る前に運輸担当者に報告する</li>
        <li>すぐにプラットフォームに通知する</li>
        <li>写真/動画の証拠を提供する</li>
        <li>返金プロセスが開始される</li>
      </ul>
      
      <p class="mb-2"><strong>間違った/異なるデバイス：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>シリアル番号を確認する</li>
        <li>異なる場合、確認しない</li>
        <li>サポートチームに報告する</li>
        <li>全額返金プロセスが開始される</li>
        <li>発見者に罰金が適用される</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">8. 匿名性とプライバシー</h3>
      
      <h4 class="text-lg font-semibold mb-2">8.1 身元のプライバシー</h4>
      <p class="mb-2"><strong>マッチング前：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>ユーザー情報は共有されません</li>
        <li>完全に匿名のシステム</li>
      </ul>
      
      <p class="mb-2"><strong>マッチング後：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>身元：</strong> 非表示のまま</li>
        <li><strong>メール：</strong> 非表示のまま</li>
        <li><strong>電話：</strong> 配送のため運輸会社とのみ共有</li>
        <li><strong>住所：</strong> 配送のため運輸会社とのみ共有</li>
      </ul>
      
      <p class="mb-2"><strong>運輸で共有される情報：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>氏名</li>
        <li>配送住所</li>
        <li>電話番号</li>
        <li>匿名送信者/受信者コード（FND-XXX、OWN-XXX）</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">8.2 通信</h4>
      <p class="mb-2"><strong>プラットフォーム通知：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>メール通知</li>
        <li>アプリ内通知</li>
        <li>SMS通知（重要な状況の場合）</li>
      </ul>
      
      <p class="mb-2"><strong>直接通信：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>ユーザー間の直接メッセージングはありません</li>
        <li>すべての通信はプラットフォームを通じて管理されます</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">9. プラットフォームの責任と制限</h3>
      
      <h4 class="text-lg font-semibold mb-2">9.1 当プラットフォームの責任</h4>
      <p class="mb-2"><strong>提供するサービスについて：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>プラットフォームインフラを運用可能に保つ</li>
        <li>データセキュリティを確保する</li>
        <li>支払いシステムを安全に運用する</li>
        <li>エスクローを正しく管理する</li>
        <li>カスタマーサポートを提供する</li>
        <li>不正防止対策を講じる</li>
        <li>法的義務を遵守する</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">9.2 責任の制限</h4>
      <p class="mb-4"><strong>プラットフォームは以下について責任を負いません：</strong></p>
      
      <p class="mb-2"><strong>デバイスと配送：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>配送されたデバイスの実際の状態</li>
        <li>デバイスが機能/使用可能であること</li>
        <li>物理的損傷や欠落部品</li>
        <li>デバイスがオリジナルであるかどうか</li>
      </ul>
      
      <p class="mb-2"><strong>運輸：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>運輸会社の誤り、遅延、紛失</li>
        <li>損傷配送</li>
        <li>運輸保険（ユーザーの責任）</li>
      </ul>
      
      <p class="mb-2"><strong>ユーザーの行動：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>ユーザーが誤った/不完全な情報を提供すること</li>
        <li>不正行為の試み（検出できなかったもの）</li>
        <li>所有権の紛争</li>
      </ul>
      
      <p class="mb-2"><strong>サードパーティサービス：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>支払いシステムの中断</li>
        <li>OAuthプロバイダーの問題</li>
        <li>インターネットサービスプロバイダーの中断</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">9.3 補償制限</h4>
      <p class="mb-2"><strong>最大補償：</strong></p>
      <p class="mb-4">いかなる場合でも、プラットフォームの責任は、関連する取引で受け取ったサービス料額に限定されます。</p>
      <p class="mb-4"><strong>例：</strong> プラットフォーム料が150 TLの5,000 TLの報酬取引では、最大補償額は150 TLです。</p>
      
      <p class="mb-2"><strong>除外される損害：</strong></p>
      <p class="mb-2">プラットフォームは以下の損害について責任を負えません：</p>
      <ul class="list-disc pl-6 mb-4">
        <li>間接的損害</li>
        <li>利益の損失</li>
        <li>評判の損失</li>
        <li>精神的損害</li>
        <li>データの損失</li>
        <li>事業の損失</li>
      </ul>
      <p class="mb-4"><strong>例外：</strong> プラットフォームに故意または重大な過失がある場合、これらの制限は適用されません。</p>

      <h4 class="text-lg font-semibold mb-2">9.4 サービスの保証と中断</h4>
      <p class="mb-2"><strong>保証しないもの：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>中断のないサービス</li>
        <li>エラーのない動作</li>
        <li>マッチング発見の保証</li>
        <li>特定時間内の結果</li>
      </ul>
      
      <p class="mb-2"><strong>計画メンテナンス：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>事前に発表される（少なくとも24時間前）</li>
        <li>通常は夜間に行われる</li>
        <li>最大4時間の期間</li>
      </ul>
      
      <p class="mb-2"><strong>緊急メンテナンス：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>事前に発表されない場合がある</li>
        <li>セキュリティまたは重要なエラーのため</li>
        <li>可能な限り早く完了</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">10. 禁止される活動</h3>
      <p class="mb-2">以下の活動は厳しく禁止されています：</p>
      
      <p class="mb-2"><strong>❌ 不正行為：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>偽の情報の提供</li>
        <li>盗難デバイスの報告</li>
        <li>他人のデバイスの主張</li>
        <li>偽のシリアル番号</li>
      </ul>
      
      <p class="mb-2"><strong>❌ アカウント違反：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>偽の身元の使用</li>
        <li>複数のアカウント開設</li>
        <li>他人のアカウントの使用</li>
        <li>ボットや自動化ツール</li>
      </ul>
      
      <p class="mb-2"><strong>❌ システム操作：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>プラットフォーム外での合意の作成</li>
        <li>システムのバイパスの試み</li>
        <li>エスクローのバイパスの試み</li>
      </ul>
      
      <p class="mb-2"><strong>❌ その他：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>嫌がらせ、脅迫</li>
        <li>知的財産権の侵害</li>
        <li>ウイルス、悪意のあるソフトウェア</li>
        <li>データスクレイピング</li>
      </ul>
      
      <p class="mb-2"><strong>ペナルティ：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>アカウント閉鎖</li>
        <li>支払いキャンセル</li>
        <li>法的措置の開始</li>
        <li>獲得金額の返金</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">11. アカウントの停止と終了</h3>
      
      <h4 class="text-lg font-semibold mb-2">11.1 プラットフォームによる閉鎖</h4>
      <p class="mb-2"><strong>即座に閉鎖される理由：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>不正行為または偽の情報</li>
        <li>盗難デバイスの報告</li>
        <li>偽の身元</li>
        <li>支払い不正</li>
        <li>違法活動</li>
      </ul>
      
      <p class="mb-2"><strong>警告後の閉鎖：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>継続的に誤った情報を提供すること</li>
        <li>プラットフォームルールの違反</li>
        <li>支払い義務の履行不足（繰り返し）</li>
        <li>運輸を送らないこと（正当な理由なし）</li>
      </ul>
      
      <p class="mb-4"><strong>停止：</strong> 不審な状況の調査中、アカウントは一時的に停止される場合があります（最大30日）。</p>

      <h4 class="text-lg font-semibold mb-2">11.2 ユーザーによるアカウント閉鎖</h4>
      <p class="mb-2"><strong>自分のアカウントを閉鎖する：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>プロフィール設定から「アカウント削除」オプションを使用できます</li>
        <li>進行中の取引がある場合、完了まで閉鎖できません</li>
        <li>エスクローに保留中の支払いがある場合、それらを完了する必要があります</li>
      </ul>
      
      <p class="mb-2"><strong>アカウント閉鎖の結果：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>個人データは30日以内に削除されます</li>
        <li>取引履歴は匿名化されます</li>
        <li>閉鎖されたアカウントは再開できません</li>
        <li>財務記録は10年間保持されます（法的要件、匿名）</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">12. 不可抗力</h3>
      <p class="mb-2">以下の不可抗力状況では、プラットフォームはその義務について責任を負えません：</p>
      
      <p class="mb-2"><strong>自然災害：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>地震、洪水、火災、嵐</li>
      </ul>
      
      <p class="mb-2"><strong>社会的事件：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>戦争、テロ、暴動、外出禁止令</li>
      </ul>
      
      <p class="mb-2"><strong>技術的問題：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>インターネットインフラの中断（ISPの問題）</li>
        <li>停電</li>
        <li>サーバープロバイダー（Supabase）の中断</li>
        <li>支払いシステムの中断</li>
        <li>DDoS攻撃、サイバー攻撃</li>
      </ul>
      
      <p class="mb-2"><strong>法的変更：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>突然の法律変更、禁止、規制</li>
      </ul>
      
      <p class="mb-2"><strong>パンデミック/健康危機：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>伝染病の状況</li>
        <li>公式制限</li>
      </ul>
      
      <p class="mb-4">不可抗力状況では、ユーザーはすぐに通知され、代替解決策が提供されます。</p>

      <h3 class="text-xl font-semibold mb-2">13. 紛争解決</h3>
      
      <h4 class="text-lg font-semibold mb-2">13.1 通信とサポート</h4>
      <p class="mb-2"><strong>第一歩 - サポートチーム：</strong></p>
      <p class="mb-2">問題が発生した場合、まずサポートチームに連絡してください：</p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>メール：</strong> support@ifoundanapple.com</li>
        <li><strong>応答時間：</strong> 24-48時間</li>
        <li><strong>解決時間：</strong> 営業日5日（平均）</li>
      </ul>
      
      <p class="mb-4"><strong>調停：</strong> ユーザー間に紛争がある場合、プラットフォームが調停役を務めることができます（オプション）。</p>

      <h4 class="text-lg font-semibold mb-2">13.2 適用法</h4>
      <p class="mb-4">本契約はトルコ共和国法に準拠します。</p>

      <h4 class="text-lg font-semibold mb-2">13.3 管轄裁判所と執行事務所</h4>
      <p class="mb-2">本契約から生じる紛争について：</p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>トルコのユーザー：</strong> イスタンブール（Çağlayan）の裁判所と執行事務所が管轄権を有します</li>
        <li><strong>EUのユーザー：</strong> ユーザーの居住地の裁判所も管轄権を有します（GDPRのため）</li>
      </ul>
      
      <p class="mb-2"><strong>消費者権利：</strong></p>
      <p class="mb-4">消費者は消費者保護法に基づき消費者仲裁委員会と消費者裁判所に申し立てることができます。</p>
      
      <p class="mb-2"><strong>消費者仲裁委員会：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>ウェブ：</strong> https://tuketicihakemleri.ticaret.gov.tr</li>
        <li>電子申請システムが利用可能です</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">13.4 代替紛争解決</h4>
      <p class="mb-2"><strong>オンライン紛争解決（ODR）：</strong></p>
      <p class="mb-2">EUの消費者はEU ODRプラットフォームを使用できます：</p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>プラットフォーム：</strong> https://ec.europa.eu/consumers/odr</li>
        <li><strong>連絡先：</strong> info@ifoundanapple.com</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">14. 知的財産権</h3>
      
      <h4 class="text-lg font-semibold mb-2">14.1 プラットフォームの権利</h4>
      <p class="mb-4">プラットフォーム上のすべてのコンテンツ、デザイン、ロゴ、ソフトウェアコード、アルゴリズムは、iFoundAnAppleの著作権の下にあります。</p>
      
      <p class="mb-2"><strong>禁止される行為：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>コンテンツのコピーや複製</li>
        <li>ロゴの無断使用</li>
        <li>ソースコードのリバースエンジニアリング</li>
        <li>データスクレイピング（自動データ収集）</li>
        <li>APIの無断使用</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">14.2 ユーザーコンテンツ</h4>
      <p class="mb-4">プラットフォームにアップロードするコンテンツ（写真、説明）は、あなたの知的財産です。</p>
      
      <p class="mb-2"><strong>プラットフォームに与えるライセンス：</strong></p>
      <p class="mb-2">コンテンツをアップロードすることで、プラットフォームに以下の権利を与えます：</p>
      <ul class="list-disc pl-6 mb-4">
        <li>プラットフォーム上でコンテンツを表示する</li>
        <li>コンテンツを保存および処理する</li>
        <li>コンテンツをバックアップする</li>
        <li>技術的に最適化する（圧縮など）</li>
      </ul>
      <p class="mb-4">プラットフォームは、他の目的のためにコンテンツを使用、販売、または共有しません。</p>

      <h3 class="text-xl font-semibold mb-2">15. その他の規定</h3>
      
      <h4 class="text-lg font-semibold mb-2">15.1 通知の作成</h4>
      <p class="mb-2"><strong>プラットフォームからあなたへ：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>メール（登録メールアドレス）</li>
        <li>アプリ内通知</li>
        <li>SMS（緊急状況の場合）</li>
      </ul>
      
      <p class="mb-2"><strong>あなたからプラットフォームへ：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>一般：</strong> info@ifoundanapple.com</li>
        <li><strong>法的：</strong> legal@ifoundanapple.com</li>
        <li><strong>セキュリティ：</strong> security@ifoundanapple.com</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">15.2 契約の完全性</h4>
      <p class="mb-4">本規約は当事者間の完全な合意を構成します。</p>

      <h4 class="text-lg font-semibold mb-2">15.3 部分的な無効性</h4>
      <p class="mb-4">規約のいずれかの規定が無効とみなされた場合でも、他の規定は有効のままです。</p>

      <h4 class="text-lg font-semibold mb-2">15.4 譲渡の禁止</h4>
      <p class="mb-4">ユーザーは、本契約から生じる権利と義務を第三者に譲渡することはできません。</p>
      <p class="mb-4">プラットフォームは、事業譲渡、合併、または買収の場合に権利を譲渡することができます。</p>

      <h4 class="text-lg font-semibold mb-2">15.5 電子記録</h4>
      <p class="mb-4">プラットフォームの電子記録は、CCP第297条の下で決定的な証拠を構成します。</p>

      <h3 class="text-xl font-semibold mb-2">16. 連絡先情報</h3>
      <p class="mb-2"><strong>iFoundAnApple</strong></p>
      
      <p class="mb-2"><strong>一般サポート：</strong></p>
      <p class="mb-4"><strong>メール：</strong> info@ifoundanapple.com</p>
      <p class="mb-4"><strong>応答時間：</strong> 24-48時間</p>
      
      <p class="mb-2"><strong>法的問題：</strong></p>
      <p class="mb-4"><strong>メール：</strong> legal@ifoundanapple.com</p>
      
      <p class="mb-2"><strong>セキュリティ：</strong></p>
      <p class="mb-4"><strong>メール：</strong> security@ifoundanapple.com</p>
      
      <p class="mb-2"><strong>ウェブサイト：</strong></p>
      <p class="mb-4">https://ifoundanapple.com</p>

      <h3 class="text-xl font-semibold mb-2">17. 承認と承認</h3>
      <ul class="list-disc pl-6 mb-4">
        <li>✅ 本利用規約を読み、理解し、承認しました。</li>
        <li>✅ 18歳以上であり、法的能力を有することを宣言します。</li>
        <li>✅ プラットフォームを使用することで、本規約とプライバシーポリシーを遵守することに同意します。</li>
        <li>✅ メール、SMS、アプリ内通知の受信に同意します。</li>
      </ul>

      <div class="bg-gray-100 p-4 rounded mt-6">
        <p><strong>最終更新日：</strong> 2025年10月14日</p>
        <p><strong>バージョン：</strong> 2.0</p>
        <p><strong>有効性：</strong> トルコと欧州連合</p>
        <p><strong>© 2025 iFoundAnApple. 全著作権所有。</strong></p>
      </div>
    `,
    privacyContent: `
      <h2 class="text-2xl font-bold mb-4">プライバシーポリシー</h2>
      <p class="mb-4"><strong>最終更新日：</strong> 2025年10月14日</p>

      <h3 class="text-xl font-semibold mb-2">1. データ管理者</h3>
      <p class="mb-4"><strong>iFoundAnApple</strong></p>
      <p class="mb-4"><strong>メール：</strong> privacy@ifoundanapple.com</p>
      <p class="mb-4"><strong>ウェブ：</strong> https://ifoundanapple.com</p>
      <p class="mb-4">本ポリシーはKVKKとGDPRに従って作成されています。</p>

      <h3 class="text-xl font-semibold mb-2">2. ホスティングとドメイン情報</h3>
      <p class="mb-4"><strong>ドメイン所有者：</strong> iFoundAnApple</p>
      <p class="mb-4"><strong>ホスティングプロバイダー：</strong> Hetzner</p>
      <p class="mb-4"><strong>SSL証明書：</strong> アクティブ（HTTPS）</p>
      <p class="mb-4"><strong>ドメイン確認：</strong> 所有ドメインにホスティング</p>
      <p class="mb-4"><strong>重要：</strong> 本プライバシーポリシーは、Google Sites、Facebook、Instagram、Twitterなどのサードパーティプラットフォームではなく、所有ドメインにホスティングされています。</p>

      <h3 class="text-xl font-semibold mb-2">3. 収集される個人データ</h3>
      
      <h4 class="text-lg font-semibold mb-2">3.1 登録と認証</h4>
      <p class="mb-2"><strong>メール登録：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>名、姓</li>
        <li>メールアドレス</li>
        <li>パスワード（bcryptで暗号化して保存）</li>
        <li>生年月日</li>
      </ul>
      
      <p class="mb-2"><strong>OAuthログイン（Google/Apple）：</strong></p>
      <p class="mb-2">GoogleまたはAppleでサインインする際、以下のユーザーデータを収集します：</p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Googleユーザーデータ：</strong> 名前、メール、プロフィール写真（オプション）</li>
        <li><strong>目的：</strong> アカウント作成と認証のみ</li>
        <li><strong>データ保護：</strong> 保存時のAES-256-GCM暗号化</li>
        <li><strong>データストレージ：</strong> 安全なデータベース（Supabase）に暗号化して保存</li>
        <li><strong>データ共有：</strong> プラットフォーム機能のためのサービスプロバイダーとのみ（セクション5.1を参照）</li>
        <li><strong>データ保持：</strong> アカウント有効期間中、アカウント削除後30日以内に削除</li>
        <li>パスワードを作成する必要はありません</li>
      </ul>
      <p class="mb-4"><strong>重要：</strong> Googleユーザーデータはプラットフォーム機能を提供するためのみに使用します。広告、第三者への販売、またはその他の目的には使用しません。</p>

      <h4 class="text-lg font-semibold mb-2">3.2 デバイス情報</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>デバイスモデル（iPhone 15 Pro、MacBook Airなど）</li>
        <li>シリアル番号</li>
        <li>デバイスの色と説明</li>
        <li>紛失/発見日と場所</li>
        <li>請求書/所有証明書（視覚的 - 削除可能）</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.3 支払いと財務情報</h4>
      <p class="mb-2"><strong>支払い取引：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>安全な支払いプロバイダーによって処理されるクレジット/銀行カード情報（PCI-DSS準拠）</li>
        <li>カード情報は当社のサーバーに保存されません</li>
        <li>取引履歴と金額が記録されます</li>
      </ul>
      
      <p class="mb-2"><strong>銀行情報：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>IBAN番号（報酬振込用）</li>
        <li>口座名義人名</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.4 プロフィールと連絡先情報</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>国民ID番号（オプション、高額取引の場合）</li>
        <li>電話番号</li>
        <li>配送住所（運輸用）</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.5 自動収集されるデータ</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>IPアドレス</li>
        <li>ブラウザとデバイス情報</li>
        <li>セッション情報</li>
        <li>プラットフォーム使用統計</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">4. データ使用目的</h3>
      
      <h4 class="text-lg font-semibold mb-2">4.1 サービス提供</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>紛失デバイスと発見デバイスのマッチング（シリアル番号ベース）</li>
        <li>ユーザーアカウント管理</li>
        <li>運輸組織と追跡</li>
        <li>通知の送信</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.2 支払いとエスクロー操作</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>安全な支払い処理</li>
        <li>エスクローシステムの運用</li>
        <li>IBANへの報酬支払いの振込</li>
        <li>財務記録の維持</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.3 AI による推奨事項</h4>
      <p class="mb-4">この機能はオプションです。AI推奨事項にはデバイスモデル情報のみを使用します。個人身元データは共有されません。</p>

      <h4 class="text-lg font-semibold mb-2">4.4 データ使用の制限</h4>
      <p class="mb-2"><strong>Googleユーザーデータと個人データの使用：</strong></p>
      <p class="mb-2">Googleユーザーデータと個人情報は以下の目的でのみ使用します：</p>
      <ul class="list-disc pl-6 mb-4">
        <li>✅ プラットフォーム機能の提供（認証、アカウント管理）</li>
        <li>✅ 取引と支払いの処理</li>
        <li>✅ デバイス配送の組織化</li>
        <li>✅ 重要なサービス通知の送信</li>
        <li>✅ ユーザー体験の向上</li>
        <li>✅ セキュリティと不正防止</li>
      </ul>
      <p class="mb-2"><strong>データを以下の目的で使用することはありません：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>❌ ターゲット広告やマーケティング</li>
        <li>❌ データブローカーや情報再販業者への販売</li>
        <li>❌ 信用価値の判断や貸付目的</li>
        <li>❌ ユーザー広告やパーソナライズ広告</li>
        <li>❌ 当社のサービスに関連しないAIモデルの訓練</li>
        <li>❌ 他の目的のためのデータベース作成</li>
        <li>❌ プラットフォーム機能の提供または改善を超えるその他の目的</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.5 セキュリティ</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>不正防止</li>
        <li>身元確認</li>
        <li>監査ログの維持</li>
        <li>セキュリティ侵害の検出</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.6 法的遵守</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>KVKKとGDPR要件の遵守</li>
        <li>税務法規の義務（10年間の記録保持）</li>
        <li>裁判所の決定と法的プロセス</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">5. データ共有</h3>
      
      <h4 class="text-lg font-semibold mb-2">5.1 サービスプロバイダー</h4>
      <p class="mb-2"><strong>Supabase（バックエンドインフラ）：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>データベース、認証、ファイルストレージ</li>
        <li>SOC 2 Type II、GDPR準拠</li>
        <li>データの場所：米国/EU</li>
        <li><strong>共有されるGoogleユーザーデータ：</strong> 名前、メール（暗号化）</li>
      </ul>
      
      <p class="mb-2"><strong>支払いプロバイダー：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>支払い処理、3D Secure、エスクロー</li>
        <li>PCI-DSSレベル1認定</li>
        <li>トルコベース</li>
        <li><strong>共有されるGoogleユーザーデータ：</strong> メール（取引領収書のみ）</li>
      </ul>
      
      <p class="mb-2"><strong>Google/Apple（OAuth認証）：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>サードパーティログイン（オプション）</li>
        <li>認証のみに使用</li>
      </ul>
      
      <p class="mb-2"><strong>Google Gemini（AI推奨事項）：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>デバイスモデル情報のみが共有されます</li>
        <li>Googleユーザーデータ（名前、メール）は共有されません</li>
        <li>個人身元情報は共有されません</li>
      </ul>
      
      <p class="mb-2"><strong>運輸会社（Aras、MNG、Yurtiçi、PTT）：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>配送住所と電話</li>
        <li>匿名送信者/受信者コード（FND-XXX、OWN-XXX）</li>
        <li>実際の身元（名前、メール）は機密保持</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">5.2 ユーザー間共有</h4>
      <p class="mb-4"><strong>重要：</strong> 身元、メール、電話番号は他のユーザーと共有されることはありません。</p>
      
      <p class="mb-2"><strong>マッチング後：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>相手方の身元は匿名のまま</li>
        <li>「マッチングが見つかりました」通知のみ送信</li>
        <li>運輸のための配送住所のみ共有（氏名と住所）</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">5.3 法的義務</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>裁判所命令または召喚状</li>
        <li>法執行機関の要求</li>
        <li>税務当局（財務記録の場合）</li>
        <li>KVKK機関の要求</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">6. データセキュリティと保持</h3>
      
      <h4 class="text-lg font-semibold mb-2">6.1 セキュリティ対策</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>SSL/TLS暗号化（HTTPS）- TLS 1.3</li>
        <li>パスワードハッシュ化（bcrypt）</li>
        <li><strong>保存時のデータベース暗号化（AES-256-GCM）</strong></li>
        <li><strong>機密データのアプリケーションレベル暗号化：</strong></li>
        <ul class="list-disc pl-6 mb-4">
          <li>トルコ国民ID（TC Kimlik No）</li>
          <li>IBAN番号</li>
          <li>電話番号</li>
          <li>物理的住所</li>
          <li>Googleユーザーデータ（名前、メール）</li>
        </ul>
        <li>行レベルセキュリティ（RLS）ポリシー</li>
        <li>OAuth 2.0安全認証トークン</li>
        <li>3D Secure支払い認証</li>
        <li>二要素認証（2FA）サポート</li>
        <li>定期的なセキュリティ監査と脆弱性評価</li>
        <li>アクセス制御ログと監視</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">6.2 保持期間</h4>
      
      <p class="mb-2"><strong>Googleユーザーデータの保持：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>アクティブなアカウント：</strong> アカウントがアクティブな間保持</li>
        <li><strong>削除されたアカウント：</strong> Googleユーザーデータ（名前、メール）は30日以内に削除</li>
        <li><strong>財務データ：</strong> 10年（法的要件 - 税法）</li>
        <li><strong>削除を要求できます：</strong> privacy@ifoundanapple.com にメール</li>
      </ul>
      
      <p class="mb-2"><strong>アクティブなアカウント：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>アカウントがアクティブな間保持</li>
      </ul>
      
      <p class="mb-2"><strong>閉鎖されたアカウント：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>アカウント閉鎖後30日以内に削除</li>
        <li>財務記録は10年間保持（法的義務）</li>
        <li>匿名統計は無期限に保持可能</li>
      </ul>
      
      <p class="mb-2"><strong>取引記録：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>財務取引：10年</li>
        <li>運輸記録：2年</li>
        <li>監査ログ：5年</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">7. ユーザーの権利（KVKK & GDPR）</h3>
      
      <h4 class="text-lg font-semibold mb-2">7.1 あなたの権利</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>✅ <strong>情報権：</strong> データが処理されているかどうかを知る</li>
        <li>✅ <strong>アクセス権：</strong> データのコピーを取得する</li>
        <li>✅ <strong>訂正権：</strong> 誤った情報を訂正する</li>
        <li>✅ <strong>削除権：</strong> データを削除する（忘れられる権利）</li>
        <li>✅ <strong>異議権：</strong> データ処理活動に異議を唱える</li>
        <li>✅ <strong>データポータビリティ：</strong> データを別のプラットフォームに転送する</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">7.2 申請方法</h4>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>メール：</strong> privacy@ifoundanapple.com</li>
        <li><strong>件名：</strong> KVKK/GDPR申請</li>
        <li><strong>応答時間：</strong> 30日（最大）</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">7.3 苦情を申し立てる権利</h4>
      <p class="mb-2"><strong>トルコ：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>個人データ保護機関 - https://www.kvkk.gov.tr</li>
      </ul>
      
      <p class="mb-2"><strong>EU：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>関連国のデータ保護機関</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">8. 子供のプライバシー</h3>
      <p class="mb-4">プラットフォームは18歳未満のユーザーを対象としていません。18歳未満の者から意図的にデータを収集することはありません。</p>

      <h3 class="text-xl font-semibold mb-2">9. クッキー</h3>
      <p class="mb-2"><strong>使用するクッキー：</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>セッション管理（必須）</li>
        <li>言語設定（機能）</li>
        <li>セキュリティ（必須）</li>
      </ul>
      <p class="mb-4">ブラウザ設定からクッキーを管理できます。</p>

      <h3 class="text-xl font-semibold mb-2">10. 国際データ転送</h3>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Supabase：</strong> 米国/EUデータセンター（GDPR準拠、SCC）</li>
        <li><strong>支払いプロバイダー：</strong> 国際</li>
        <li><strong>Google：</strong> グローバル（OAuthとIA用）</li>
      </ul>
      <p class="mb-4">すべての転送はKVKKとGDPR規定に従って行われます。</p>

      <h3 class="text-xl font-semibold mb-2">11. 変更と更新</h3>
      <p class="mb-2">本プライバシーポリシーを随時更新する場合があります。重要な変更が行われた場合：</p>
      <ul class="list-disc pl-6 mb-4">
        <li>ウェブサイトで発表</li>
        <li>メールで通知</li>
        <li>「最終更新日」が変更される</li>
      </ul>
      <p class="mb-4">更新は公開日に発効します。</p>

      <h3 class="text-xl font-semibold mb-2">12. 連絡先</h3>
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
    forgotPassword: "¿Olvidaste tu contraseña?",
    forgotPasswordTitle: "Restablecer contraseña",
    forgotPasswordDescription: "Ingresa tu dirección de correo electrónico y te enviaremos un enlace para restablecer tu contraseña.",
    passwordResetEmailSent: "¡Correo de restablecimiento enviado! Por favor, revisa tu bandeja de entrada.",
    passwordResetError: "Error al enviar el correo de restablecimiento. Por favor, inténtalo de nuevo.",
    sendResetLink: "Enviar enlace",
    sending: "Enviando...",
    cancel: "Cancelar",
    passwordResetTitle: "Restablecer tu contraseña",
    passwordResetDescription: "Por favor, ingresa tu nueva contraseña a continuación.",
    newPassword: "Nueva contraseña",
    confirmPassword: "Confirmar contraseña",
    resetting: "Restableciendo...",
    resetPassword: "Restablecer contraseña",
    passwordResetSuccess: "¡Contraseña restablecida con éxito!",
    passwordResetSuccessMessage: "Tu contraseña ha sido restablecida con éxito. Redirigiendo a la página de inicio de sesión...",
    passwordResetLinkExpired: "El enlace de restablecimiento es inválido o ha expirado.",
    passwordResetLinkInvalid: "Enlace de restablecimiento inválido.",
    passwordResetLinkExpiredMessage: "El enlace de restablecimiento es inválido o ha expirado. Por favor, solicita uno nuevo.",
    backToLogin: "Volver al inicio de sesión",
    passwordTooShort: "La contraseña debe tener al menos 6 caracteres.",
    passwordsDoNotMatch: "Las contraseñas no coinciden.",
    checkingResetLink: "Verificando enlace de restablecimiento...",
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
    escrowSystemDesc: "Su pago se mantiene en nuestra cuenta de depósito segura y no se transferirá hasta que el dispositivo sea entregado y confirmado. Con la garantía de PAYNET, tiene derechos de cancelación y reembolso excluyendo una tarifa del 3.43%.",
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
        a6: "El desglose total de tarifas es el siguiente;\\n\\nTarifa del proveedor de pago seguro + Tarifa de la empresa de transporte + Recompensa del buscador + Tarifa de servicio.\\n\\nEsto nos ayuda a cubrir los costes operativos, mantener la plataforma y garantizar un entorno seguro para todos."
    },
    termsContent: `
      <h2 class="text-2xl font-bold mb-4">TÉRMINOS DE SERVICIO</h2>
      <p class="mb-4"><strong>Última actualización:</strong> 14 de octubre de 2025</p>

      <h3 class="text-xl font-semibold mb-2">1. ÁMBITO DEL CONTRATO</h3>
      <p class="mb-4">Estos términos rigen la relación legal entre la plataforma iFoundAnApple y los usuarios.</p>
      
      <p class="mb-4"><strong>Propietario de la plataforma:</strong> iFoundAnApple</p>
      <p class="mb-4"><strong>Contacto:</strong> support@ifoundanapple.com</p>
      <p class="mb-4"><strong>Ley:</strong> Leyes de la República de Turquía</p>

      <h4 class="text-lg font-semibold mb-2">1.1 Significado de la aceptación</h4>
      <p class="mb-4">Al registrarse en la plataforma, crear una cuenta o utilizar los servicios, se considera que ha aceptado estos Términos.</p>

      <h4 class="text-lg font-semibold mb-2">1.2 Derecho a modificar</h4>
      <p class="mb-4">Podemos modificar estos Términos con un aviso de 7 días. Los cambios se:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Comunican por correo electrónico</li>
        <li>Anuncian en el sitio web</li>
        <li>Envían como notificaciones en la aplicación</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">2. SERVICIOS DE LA PLATAFORMA</h3>
      
      <h4 class="text-lg font-semibold mb-2">2.1 Servicios que proporcionamos</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>✅ Registro de dispositivo perdido: Registrar dispositivos Apple en el sistema</li>
        <li>✅ Notificación de dispositivo encontrado: Reportar dispositivos encontrados</li>
        <li>✅ Emparejamiento automático: Emparejamiento basado en número de serie</li>
        <li>✅ Sistema anónimo: Su información de identidad se mantiene confidencial</li>
        <li>✅ Pago seguro: Pago seguro compatible con PCI-DSS</li>
        <li>✅ Sistema de depósito en garantía: El dinero se mantiene seguro</li>
        <li>✅ Organización de transporte: Selección y seguimiento de empresas de transporte</li>
        <li>✅ Sistema de notificaciones: Actualizaciones en tiempo real</li>
        <li>✅ Sugerencias impulsadas por IA: Sugerencias de recompensa con Google Gemini</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">2.2 Servicios que no proporcionamos</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>❌ Entrega de transporte: No proporcionamos servicios de transporte</li>
        <li>❌ Reuniones físicas: No reunimos físicamente a las partes</li>
        <li>❌ Reparación de dispositivo: No proporcionamos soporte técnico</li>
        <li>❌ Representación legal: No proporcionamos servicios legales</li>
        <li>❌ Garantía: No se garantiza el estado o la funcionalidad del dispositivo</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">3. REGISTRO Y GESTIÓN DE CUENTA</h3>
      
      <h4 class="text-lg font-semibold mb-2">3.1 Requisitos de registro</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Debe tener 18 años o más</li>
        <li>Se requiere una dirección de correo electrónico válida</li>
        <li>Debe proporcionar información precisa</li>
        <li>Debe residir en Turquía o países de la UE</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.2 Métodos de registro</h4>
      <p class="mb-2"><strong>Registro por correo electrónico:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Se requiere nombre, apellido, correo electrónico, fecha de nacimiento y contraseña</li>
        <li>Verificación por correo electrónico obligatoria</li>
      </ul>
      
      <p class="mb-2"><strong>Registro OAuth (Google / Apple):</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Autenticación de identidad de terceros</li>
        <li>Sujeto a los términos del proveedor OAuth</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.3 Seguridad de la cuenta</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Mantenga su contraseña segura y no la comparta</li>
        <li>No comparta la información de su cuenta con nadie</li>
        <li>Reporte actividades sospechosas inmediatamente</li>
        <li>Cada usuario solo puede abrir 1 cuenta</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.4 Actividades de cuenta prohibidas</h4>
      <p class="mb-2">Las siguientes situaciones conducen al cierre de cuenta:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Uso de información de identidad falsa</li>
        <li>Apertura de múltiples cuentas (para la misma persona)</li>
        <li>Uso de la cuenta de otra persona</li>
        <li>Uso de bots o herramientas automatizadas</li>
        <li>Intento de manipular el sistema</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">4. RESPONSABILIDADES DEL PROPIETARIO DEL DISPOSITIVO</h3>
      
      <h4 class="text-lg font-semibold mb-2">4.1 Propiedad legal</h4>
      <p class="mb-2">Al agregar un dispositivo perdido:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Declara que es el propietario legal del dispositivo</li>
        <li>Debe poder proporcionar documentos de propiedad (factura, certificado de garantía)</li>
        <li>Se compromete a no reportar un dispositivo robado o falso</li>
      </ul>
      <p class="mb-4"><strong>Importante:</strong> El registro del dispositivo es completamente gratuito. El pago solo se solicita cuando se encuentra su dispositivo y comienza el proceso de intercambio.</p>

      <h4 class="text-lg font-semibold mb-2">4.2 Proporcionar información precisa</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Debe ingresar correctamente el modelo del dispositivo, número de serie y características</li>
        <li>Debe reportar honestamente el estado del dispositivo</li>
        <li>Debe especificar la fecha y ubicación de la pérdida con la mayor precisión posible</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.3 Obligación de pago</h4>
      <p class="mb-2">Cuando ocurre un emparejamiento:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Se compromete a pagar el monto de la recompensa determinado</li>
        <li>Debe realizar el pago dentro de 48 horas</li>
        <li>Las tarifas incluyen los siguientes elementos:
          <ul class="list-disc pl-6 mt-2">
            <li>Tarifa de servicio iFoundAnApple</li>
            <li>Comisión del proveedor de pago (costo de infraestructura de pago seguro)</li>
            <li>Tarifa de transporte (para que su dispositivo llegue de forma segura)</li>
            <li>Recompensa para el buscador de dispositivo (como muestra de agradecimiento por su amable contribución)</li>
          </ul>
        </li>
        <li>No puede cancelar después de realizar el pago (excepto por razones válidas)</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.4 Recibir transporte</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Debe proporcionar información de dirección correcta para la entrega</li>
        <li>Debe verificar el transporte cuando lo recibe</li>
        <li>Debe presionar el botón "Recibí, Confirmar" dentro de 7 días</li>
        <li>Si no confirma, se da confirmación automática después de 7 días</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">5. RESPONSABILIDADES DEL BUSCADOR DE DISPOSITIVO</h3>
      
      <h4 class="text-lg font-semibold mb-2">5.1 Búsqueda honesta</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Declara que encontró el dispositivo de acuerdo con la ley</li>
        <li>Se compromete a no haber robado el dispositivo ni haberlo adquirido por medios ilegales</li>
        <li>Acepta entregar el dispositivo encontrado intacto y completo</li>
      </ul>
      <p class="mb-4"><strong>Importante:</strong> El registro de dispositivo encontrado es completamente gratuito. Este comportamiento civil y honorable es invaluable para nosotros.</p>

      <h4 class="text-lg font-semibold mb-2">5.2 Proporcionar información precisa</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Debe ingresar correctamente la información del dispositivo</li>
        <li>Debe reportar honestamente la fecha y ubicación del hallazgo</li>
        <li>Debe ser transparente sobre el estado del dispositivo</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">5.3 Envío de transporte</h4>
      <p class="mb-2">Después de completar el pago:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Debe entregar el dispositivo al transporte dentro de 5 días hábiles</li>
        <li>Debe seleccionar una empresa de transporte e ingresar el número de seguimiento en el sistema</li>
        <li>Debe enviar el dispositivo en su estado original, sin daños</li>
        <li>Se compromete a no interferir con el dispositivo (descifrado de contraseña, reemplazo de piezas)</li>
      </ul>
      
      <p class="mb-2"><strong>Tarifa de transporte:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>La tarifa de transporte (250 TL) la paga el propietario del dispositivo</li>
        <li>Puede entregarlo a la empresa de transporte como "contra reembolso"</li>
        <li>O puede pagar primero y recuperarlo junto con la recompensa</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">5.4 Recompensa e información IBAN/Banco</h4>
      <p class="mb-2"><strong>Determinación de recompensa:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>La recompensa que se le dará se determina a una tasa cierta y justa basada en el valor de mercado del dispositivo encontrado</li>
        <li>De esta manera, nos aseguramos de que reciba un pequeño regalo a cambio de su esfuerzo y comportamiento ejemplar</li>
        <li>iFoundAnApple proporciona un proceso de intercambio seguro para garantizar que el dispositivo llegue a su propietario de forma segura y que reciba su recompensa por completo</li>
      </ul>
      
      <p class="mb-2"><strong>Información IBAN/Banco:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Debe proporcionar un IBAN válido para el pago de recompensa</li>
        <li>Declara que el IBAN le pertenece</li>
        <li>Acepta cumplir con sus obligaciones fiscales</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">6. PAGOS, TARIFAS Y SISTEMA DE DEPÓSITO EN GARANTÍA</h3>
      
      <h4 class="text-lg font-semibold mb-2">6.1 Sistema de recompensa</h4>
      <p class="mb-2"><strong>Determinación de recompensa:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>El propietario del dispositivo determina libremente el monto de la recompensa</li>
        <li>Mínimo: 500 TL, Máximo: 50,000 TL</li>
        <li>Se puede usar el sistema de sugerencias IA (opcional, Google Gemini)</li>
        <li>La recompensa debe ser un porcentaje razonable del valor de mercado del dispositivo</li>
      </ul>
      
      <p class="mb-2"><strong>Momento del pago:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>El pago debe realizarse dentro de 48 horas cuando ocurre un emparejamiento</li>
        <li>Si no se realiza el pago, se cancela el emparejamiento</li>
        <li>El pago se toma en el sistema de depósito en garantía y se mantiene seguro</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">6.2 Tarifas de servicio</h4>
      <p class="mb-2"><strong>Tarifas para el propietario del dispositivo (fórmula v5.0):</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Monto bruto:</strong> Monto total recibido del cliente (incluyendo comisión PAYNET)</li>
        <li><strong>Comisión PAYNET:</strong> 3.43% del monto bruto (deducida automáticamente)</li>
        <li><strong>Monto neto:</strong> Monto restante después de la deducción de la comisión PAYNET</li>
        <li><strong>Tarifa de transporte:</strong> 250 TL (fija)</li>
        <li><strong>Recompensa del buscador:</strong> 20% del monto neto</li>
        <li><strong>Tarifa de servicio:</strong> Monto neto - transporte - recompensa (resto)</li>
      </ul>

      <p class="mb-2"><strong>Ejemplo de cálculo (propietario del dispositivo) - v5.0:</strong></p>
      <div class="bg-gray-100 p-4 rounded mb-4">
        <p><strong>Monto bruto:</strong> 2,000 TL (total recibido del cliente)</p>
        <p>├── <strong>Comisión PAYNET:</strong> 68.60 TL (3.43%) - Deducida automáticamente</p>
        <p>└── <strong>Monto neto:</strong> 1,931.40 TL (retenido en sistema de depósito en garantía)</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;├── <strong>Tarifa de transporte:</strong> 250.00 TL (fija)</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;├── <strong>Recompensa del buscador:</strong> 386.28 TL (20%)</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;└── <strong>Tarifa de servicio:</strong> 1,295.12 TL (resto)</p>
        <p>─────────────────────────────────────────</p>
        <p><strong>TOTAL:</strong> 68.60 + 250 + 386.28 + 1,295.12 = 2,000.00 TL ✅</p>
      </div>

      <p class="mb-2"><strong>Tarifas para el buscador:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Neto a recibir:</strong> Recompensa al buscador (20% del monto neto)</li>
        <li><strong>Tarifa de transferencia:</strong> Puede aplicarse en transferencia bancaria (aproximadamente 5-10 TL)</li>
      </ul>

      <p class="mb-2"><strong>Ejemplo de cálculo (buscador) - v5.0:</strong></p>
      <div class="bg-gray-100 p-4 rounded mb-4">
        <p><strong>Monto neto:</strong> 1,931.40 TL</p>
        <p><strong>Recompensa del buscador (20%):</strong> 386.28 TL</p>
        <p>─────────────────────────────────────────</p>
        <p><strong>NETO A RECIBIR:</strong> 386.28 TL</p>
      </div>

      <h4 class="text-lg font-semibold mb-2">6.3 Sistema de depósito en garantía</h4>
      <p class="mb-2"><strong>Cómo funciona (v5.0):</strong></p>
      <ol class="list-decimal pl-6 mb-4">
        <li>Ocurre un emparejamiento</li>
        <li>El propietario del dispositivo paga el monto bruto (dentro de 48 horas)</li>
        <li>La comisión PAYNET (3.43%) se deduce automáticamente</li>
        <li>El monto neto se mantiene de forma segura en la cuenta de depósito en garantía (estado: "retenido")</li>
        <li>El buscador envía el transporte (dentro de 5 días hábiles)</li>
        <li>El propietario del dispositivo recibe el transporte y presiona el botón "Recibí, Confirmar"</li>
        <li>El monto neto se distribuye de la siguiente manera:
          <ul class="list-disc pl-6 mt-2">
            <li>Tarifa de transporte (250 TL) → Empresa de transporte</li>
            <li>Recompensa del buscador (20%) → IBAN del buscador</li>
            <li>Tarifa de servicio (resto) → Plataforma</li>
          </ul>
        </li>
      </ol>

      <p class="mb-2"><strong>Duración del depósito en garantía (v5.0):</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Espera máxima: 30 días</li>
        <li>Confirmación del propietario: El monto neto se libera inmediatamente</li>
        <li>Si no hay confirmación: Confirmación automática después de 7 días</li>
        <li>Si no hay entrega dentro de 30 días: Monto bruto reembolsado automáticamente (comisión PAYNET deducida)</li>
      </ul>

      <p class="mb-2"><strong>Proceso de confirmación:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Solo el propietario del dispositivo da confirmación (confirmación unilateral)</li>
        <li>El buscador no confirma, solo envía el transporte</li>
        <li>No hay sistema de confirmación bilateral</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">6.4 Política de cancelación y reembolso</h4>
      <p class="mb-2"><strong>Derecho a cancelar:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>No tiene derecho de retractación después de realizar el pago (porque el servicio ha comenzado)</li>
        <li>La cancelación es posible por acuerdo mutuo antes de enviar el transporte</li>
      </ul>
      
      <p class="mb-2"><strong>Condiciones de reembolso:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Si el buscador no envía el transporte dentro de 5 días hábiles: Reembolso completo</li>
        <li>Si el dispositivo entregado es diferente: Reembolso completo + penalización al buscador</li>
        <li>Cancelación debido a problemas técnicos: Reembolso completo</li>
        <li>Cancelación por acuerdo mutuo: Reembolso completo</li>
      </ul>
      
      <p class="mb-2"><strong>Deducción de reembolso (v5.0):</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Si solicita la cancelación de la transacción durante el proceso de intercambio, la comisión de la pasarela de pago (3.43%) se reembolsa con deducción</li>
        <li>Si se paga el monto bruto y el monto neto se retiene en depósito en garantía: El monto neto se reembolsa por completo</li>
        <li>La cancelación debe realizarse antes de que comience el proceso de transporte</li>
        <li>Después de la cancelación: Monto bruto - Comisión de la pasarela de pago = Monto del reembolso</li>
      </ul>
      
      <p class="mb-2"><strong>Proceso de reembolso:</strong></p>
      <ol class="list-decimal pl-6 mb-4">
        <li>Se crea una solicitud de cancelación/reembolso</li>
        <li>La plataforma revisa (1-3 días hábiles)</li>
        <li>Se toma una decisión</li>
        <li>Si se aprueba el reembolso, se acredita a la cuenta dentro de 5-10 días hábiles</li>
      </ol>

      <h4 class="text-lg font-semibold mb-2">6.5 Métodos de pago</h4>
      <p class="mb-2"><strong>Métodos de pago aceptados:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Tarjeta de crédito (Visa, Mastercard, American Express)</li>
        <li>Tarjeta de débito</li>
        <li>Tarjeta virtual</li>
        <li>Apple Pay (para usuarios de iPhone, iPad, Mac)</li>
        <li>3D Secure obligatorio (por seguridad)</li>
      </ul>
      
      <p class="mb-2"><strong>Seguridad del pago:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Infraestructura de pago seguro certificada PCI-DSS nivel 1</li>
        <li>Cifrado SSL/TLS</li>
        <li>Verificación 3D Secure</li>
        <li>Tokenización (la información de la tarjeta no se almacena con nosotros)</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">7. PROCESO DE TRANSPORTE Y ENTREGA</h3>
      
      <h4 class="text-lg font-semibold mb-2">7.1 Rol de la plataforma</h4>
      <p class="mb-4"><strong>Importante:</strong> La plataforma no es parte en la entrega de transporte. El transporte es manejado completamente por empresas de transporte.</p>
      
      <p class="mb-2"><strong>Lo que proporciona la plataforma:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Opciones de empresas de transporte (Aras, MNG, Yurtiçi, PTT)</li>
        <li>Sistema de seguimiento de transporte</li>
        <li>Compartir dirección de entrega (sistema anónimo)</li>
        <li>Notificaciones de estado de transporte</li>
      </ul>
      
      <p class="mb-2"><strong>Lo que no proporciona la plataforma:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Servicio de entrega física de transporte</li>
        <li>Organización de mensajeros de transporte</li>
        <li>Seguro de transporte (debe obtenerse de la empresa de transporte)</li>
        <li>Garantía de pérdida/daño del transporte</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">7.2 Empresas de transporte</h4>
      <p class="mb-2"><strong>Empresas de transporte soportadas:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Aras Cargo</li>
        <li>MNG Cargo</li>
        <li>Yurtiçi Cargo</li>
        <li>PTT Cargo</li>
      </ul>
      <p class="mb-4">La persona que encuentra el dispositivo selecciona una de estas empresas y entrega el dispositivo a la empresa con el número de transporte recibido del sistema.</p>

      <h4 class="text-lg font-semibold mb-2">7.3 Sistema de identidad anónima</h4>
      <p class="mb-2">Para proteger su privacidad:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Se le da un código anónimo al buscador: FND-XXX123</li>
        <li>Se le da un código anónimo al propietario: OWN-YYY456</li>
        <li>Estos códigos se usan en la información de envío</li>
        <li>Las identidades reales no se comparten con la empresa de transporte</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">7.4 Recomendaciones de seguridad del transporte</h4>
      <p class="mb-2"><strong>Para el remitente (buscador):</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Tome fotos del dispositivo y el paquete (antes de la entrega)</li>
        <li>Siempre registre el número de seguimiento</li>
      </ul>
      
      <p class="mb-2"><strong>Para el receptor (propietario):</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Verifique el paquete al recibirlo</li>
        <li>Si hay daños, presente un informe inmediatamente</li>
        <li>Documente la apertura del paquete con video/fotos</li>
        <li>Verifique el número de serie del dispositivo</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">7.5 Seguimiento del transporte</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Puede rastrear el estado del transporte en tiempo real a través de la plataforma</li>
        <li>Recibe actualizaciones de estado automáticas:
          <ul class="list-disc pl-6 mt-2">
            <li>Transporte creado</li>
            <li>Transporte recolectado</li>
            <li>En sucursal de transporte</li>
            <li>En camino para entrega</li>
            <li>Entregado</li>
          </ul>
        </li>
        <li>Se muestra la fecha estimada de entrega</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">7.6 Problemas de entrega</h4>
      <p class="mb-2"><strong>Si se pierde el transporte:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Contacte inmediatamente a la empresa de transporte</li>
        <li>Reporte al equipo de soporte de la plataforma (support@ifoundanapple.com)</li>
        <li>Entra en vigor el seguro de la empresa de transporte</li>
        <li>La plataforma puede tomar el rol de mediador</li>
        <li>El dinero en depósito en garantía se reembolsa al propietario</li>
      </ul>
      
      <p class="mb-2"><strong>Entrega dañada:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Verifique el transporte al recibirlo</li>
        <li>Si hay daños, presente un informe con el oficial de transporte antes de recibirlo</li>
        <li>Informe inmediatamente a la plataforma</li>
        <li>Proporcione evidencia de foto/video</li>
        <li>Se inicia el proceso de reembolso</li>
      </ul>
      
      <p class="mb-2"><strong>Dispositivo incorrecto/diferente:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Verifique el número de serie</li>
        <li>Si es diferente, no confirme</li>
        <li>Reporte al equipo de soporte</li>
        <li>Se inicia el proceso de reembolso completo</li>
        <li>Se aplica una penalización al buscador</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">8. ANONIMATO Y PRIVACIDAD</h3>
      
      <h4 class="text-lg font-semibold mb-2">8.1 Privacidad de identidad</h4>
      <p class="mb-2"><strong>Antes del emparejamiento:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>No se comparte información del usuario</li>
        <li>Sistema completamente anónimo</li>
      </ul>
      
      <p class="mb-2"><strong>Después del emparejamiento:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Identidad:</strong> Permanece OCULTA</li>
        <li><strong>Correo electrónico:</strong> Permanece OCULTO</li>
        <li><strong>Teléfono:</strong> Solo se comparte con la empresa de transporte para entrega</li>
        <li><strong>Dirección:</strong> Solo se comparte con la empresa de transporte para entrega</li>
      </ul>
      
      <p class="mb-2"><strong>Información compartida para transporte:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Nombre completo</li>
        <li>Dirección de entrega</li>
        <li>Número de teléfono</li>
        <li>Código remitente/receptor anónimo (FND-XXX, OWN-XXX)</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">8.2 Comunicación</h4>
      <p class="mb-2"><strong>Notificaciones de la plataforma:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Notificaciones por correo electrónico</li>
        <li>Notificaciones en la aplicación</li>
        <li>Notificaciones SMS (para situaciones críticas)</li>
      </ul>
      
      <p class="mb-2"><strong>Comunicación directa:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>No hay mensajería directa entre usuarios</li>
        <li>Toda la comunicación se gestiona a través de la plataforma</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">9. RESPONSABILIDADES Y LIMITACIONES DE LA PLATAFORMA</h3>
      
      <h4 class="text-lg font-semibold mb-2">9.1 Responsabilidades de nuestra plataforma</h4>
      <p class="mb-2"><strong>Para los servicios que proporcionamos:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Mantener la infraestructura de la plataforma operativa</li>
        <li>Asegurar la seguridad de los datos</li>
        <li>Operar el sistema de pago de forma segura</li>
        <li>Gestionar el depósito en garantía correctamente</li>
        <li>Proporcionar soporte al cliente</li>
        <li>Tomar medidas de prevención de fraude</li>
        <li>Cumplir con las obligaciones legales</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">9.2 Limitaciones de responsabilidad</h4>
      <p class="mb-4"><strong>La plataforma NO ES RESPONSABLE de:</strong></p>
      
      <p class="mb-2"><strong>Dispositivo y entrega:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Estado real del dispositivo entregado</li>
        <li>Que el dispositivo sea funcional/usable</li>
        <li>Daños físicos o piezas faltantes</li>
        <li>Si el dispositivo es original</li>
      </ul>
      
      <p class="mb-2"><strong>Transporte:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Errores, retrasos, pérdidas de empresas de transporte</li>
        <li>Entrega dañada</li>
        <li>Seguro de transporte (responsabilidad del usuario)</li>
      </ul>
      
      <p class="mb-2"><strong>Comportamiento del usuario:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Usuarios que proporcionan información incorrecta/incompleta</li>
        <li>Intentos de fraude (que no pudimos detectar)</li>
        <li>Disputas de propiedad</li>
      </ul>
      
      <p class="mb-2"><strong>Servicios de terceros:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Interrupciones del sistema de pago</li>
        <li>Problemas del proveedor OAuth</li>
        <li>Interrupciones del proveedor de servicios de Internet</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">9.3 Limitación de compensación</h4>
      <p class="mb-2"><strong>Compensación máxima:</strong></p>
      <p class="mb-4">En cualquier caso, la responsabilidad de la plataforma está limitada al monto de la tarifa de servicio recibida en la transacción relevante.</p>
      <p class="mb-4"><strong>Ejemplo:</strong> En una transacción de recompensa de 5,000 TL donde la tarifa de plataforma es 150 TL, el monto máximo de compensación es 150 TL.</p>
      
      <p class="mb-2"><strong>Daños excluidos:</strong></p>
      <p class="mb-2">La plataforma no puede ser considerada responsable de los siguientes daños:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Daños indirectos</li>
        <li>Pérdida de ganancias</li>
        <li>Pérdida de reputación</li>
        <li>Daños morales</li>
        <li>Pérdida de datos</li>
        <li>Pérdida de negocio</li>
      </ul>
      <p class="mb-4"><strong>Excepción:</strong> Estas limitaciones no se aplican si la plataforma tiene negligencia intencional o grave.</p>

      <h4 class="text-lg font-semibold mb-2">9.4 Garantía de servicio e interrupciones</h4>
      <p class="mb-2"><strong>Lo que no garantizamos:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Servicio sin interrupciones</li>
        <li>Funcionamiento sin errores</li>
        <li>Garantía de encontrar emparejamiento</li>
        <li>Resultados dentro de un tiempo específico</li>
      </ul>
      
      <p class="mb-2"><strong>Mantenimiento planificado:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Anunciado con anticipación (al menos 24 horas)</li>
        <li>Generalmente realizado durante las horas nocturnas</li>
        <li>Duración máxima de 4 horas</li>
      </ul>
      
      <p class="mb-2"><strong>Mantenimiento de emergencia:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Puede no ser anunciado con anticipación</li>
        <li>Para seguridad o errores críticos</li>
        <li>Completado lo antes posible</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">10. ACTIVIDADES PROHIBIDAS</h3>
      <p class="mb-2">Las siguientes actividades están estrictamente prohibidas:</p>
      
      <p class="mb-2"><strong>❌ Fraude:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Proporcionar información falsa</li>
        <li>Reportar dispositivo robado</li>
        <li>Reclamar el dispositivo de otra persona</li>
        <li>Número de serie falso</li>
      </ul>
      
      <p class="mb-2"><strong>❌ Violaciones de cuenta:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Uso de identidad falsa</li>
        <li>Apertura de múltiples cuentas</li>
        <li>Uso de la cuenta de otra persona</li>
        <li>Bots o herramientas automatizadas</li>
      </ul>
      
      <p class="mb-2"><strong>❌ Manipulación del sistema:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Hacer acuerdos fuera de la plataforma</li>
        <li>Intentar eludir el sistema</li>
        <li>Intentar eludir el depósito en garantía</li>
      </ul>
      
      <p class="mb-2"><strong>❌ Otros:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Acoso, amenazas</li>
        <li>Violación de propiedad intelectual</li>
        <li>Virus, software malicioso</li>
        <li>Extracción de datos</li>
      </ul>
      
      <p class="mb-2"><strong>Penalizaciones:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Cierre de cuenta</li>
        <li>Cancelación de pago</li>
        <li>Iniciación de acción legal</li>
        <li>Reembolso de montos ganados</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">11. SUSPENSIÓN Y TERMINACIÓN DE CUENTA</h3>
      
      <h4 class="text-lg font-semibold mb-2">11.1 Cierre iniciado por la plataforma</h4>
      <p class="mb-2"><strong>Razones de cierre inmediato:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Fraude o información falsa</li>
        <li>Reporte de dispositivo robado</li>
        <li>Identidad falsa</li>
        <li>Fraude de pago</li>
        <li>Actividades ilegales</li>
      </ul>
      
      <p class="mb-2"><strong>Cierre después de advertencia:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Proporcionar continuamente información incorrecta</li>
        <li>Violar las reglas de la plataforma</li>
        <li>No cumplir con la obligación de pago (repetido)</li>
        <li>No enviar transporte (sin razón válida)</li>
      </ul>
      
      <p class="mb-4"><strong>Suspensión:</strong> La cuenta puede ser suspendida temporalmente mientras se investigan situaciones sospechosas (máximo 30 días).</p>

      <h4 class="text-lg font-semibold mb-2">11.2 Cierre de cuenta iniciado por el usuario</h4>
      <p class="mb-2"><strong>Cerrar su propia cuenta:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Puede usar la opción "Eliminar cuenta" desde la configuración del perfil</li>
        <li>Si hay transacciones en curso, el cierre no puede realizarse hasta su finalización</li>
        <li>Si hay pagos pendientes en depósito en garantía, deben finalizarse</li>
      </ul>
      
      <p class="mb-2"><strong>Resultados del cierre de cuenta:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Sus datos personales se eliminan dentro de 30 días</li>
        <li>Su historial de transacciones se anonimiza</li>
        <li>La cuenta cerrada no se puede reabrir</li>
        <li>Los registros financieros se conservan durante 10 años (requisito legal, anónimo)</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">12. FUERZA MAYOR</h3>
      <p class="mb-2">En las siguientes situaciones de fuerza mayor, la plataforma no puede ser considerada responsable de sus obligaciones:</p>
      
      <p class="mb-2"><strong>Desastres naturales:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Terremoto, inundación, incendio, tormenta</li>
      </ul>
      
      <p class="mb-2"><strong>Eventos sociales:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Guerra, terrorismo, levantamiento, toque de queda</li>
      </ul>
      
      <p class="mb-2"><strong>Problemas técnicos:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Interrupciones de infraestructura de Internet (problemas de ISP)</li>
        <li>Corte de energía</li>
        <li>Interrupciones del proveedor de servidores (Supabase)</li>
        <li>Interrupciones del sistema de pago</li>
        <li>Ataques DDoS, ataques cibernéticos</li>
      </ul>
      
      <p class="mb-2"><strong>Cambios legales:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Cambios repentinos de ley, prohibiciones, regulaciones</li>
      </ul>
      
      <p class="mb-2"><strong>Pandemia/Crisis de salud:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Situaciones de enfermedad epidémica</li>
        <li>Restricciones oficiales</li>
      </ul>
      
      <p class="mb-4">En situaciones de fuerza mayor, los usuarios son informados inmediatamente y se proporcionan soluciones alternativas.</p>

      <h3 class="text-xl font-semibold mb-2">13. RESOLUCIÓN DE DISPUTAS</h3>
      
      <h4 class="text-lg font-semibold mb-2">13.1 Comunicación y soporte</h4>
      <p class="mb-2"><strong>Primer paso - Nuestro equipo de soporte:</strong></p>
      <p class="mb-2">Si experimenta algún problema, primero contacte a nuestro equipo de soporte:</p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Correo electrónico:</strong> support@ifoundanapple.com</li>
        <li><strong>Tiempo de respuesta:</strong> 24-48 horas</li>
        <li><strong>Tiempo de resolución:</strong> 5 días hábiles (promedio)</li>
      </ul>
      
      <p class="mb-4"><strong>Mediación:</strong> Si hay una disputa entre usuarios, la plataforma puede tomar el rol de mediador (opcional).</p>

      <h4 class="text-lg font-semibold mb-2">13.2 Ley aplicable</h4>
      <p class="mb-4">Este Acuerdo está sujeto a las leyes de la República de Turquía.</p>

      <h4 class="text-lg font-semibold mb-2">13.3 Tribunal competente y oficinas de ejecución</h4>
      <p class="mb-2">Para disputas que surjan de este Acuerdo:</p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Para usuarios en Turquía:</strong> Los tribunales y oficinas de ejecución de Estambul (Çağlayan) son competentes</li>
        <li><strong>Para usuarios en la UE:</strong> Los tribunales de residencia del usuario también son competentes (debido al GDPR)</li>
      </ul>
      
      <p class="mb-2"><strong>Derechos del consumidor:</strong></p>
      <p class="mb-4">Los consumidores pueden solicitar a los Comités de Arbitraje de Consumidores y los Tribunales de Consumidores bajo la Ley de Protección del Consumidor.</p>
      
      <p class="mb-2"><strong>Comité de Arbitraje del Consumidor:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Web:</strong> https://tuketicihakemleri.ticaret.gov.tr</li>
        <li>El sistema de solicitud electrónica está disponible</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">13.4 Resolución alternativa de disputas</h4>
      <p class="mb-2"><strong>Resolución de disputas en línea (ODR):</strong></p>
      <p class="mb-2">Los consumidores en la UE pueden usar la plataforma ODR de la UE:</p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Plataforma:</strong> https://ec.europa.eu/consumers/odr</li>
        <li><strong>Contacto:</strong> info@ifoundanapple.com</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">14. DERECHOS DE PROPIEDAD INTELECTUAL</h3>
      
      <h4 class="text-lg font-semibold mb-2">14.1 Derechos de la plataforma</h4>
      <p class="mb-4">Todo el contenido, diseño, logo, código de software, algoritmos en la plataforma están bajo el copyright de iFoundAnApple.</p>
      
      <p class="mb-2"><strong>Acciones prohibidas:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Copiar o reproducir contenido</li>
        <li>Uso no autorizado del logo</li>
        <li>Ingeniería inversa del código fuente</li>
        <li>Extracción de datos (recolección automática de datos)</li>
        <li>Uso no autorizado de la API</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">14.2 Contenido del usuario</h4>
      <p class="mb-4">El contenido que carga en la plataforma (fotos, descripciones) es su propiedad intelectual.</p>
      
      <p class="mb-2"><strong>Licencia que otorga a la plataforma:</strong></p>
      <p class="mb-2">Al cargar contenido, otorga a la plataforma los siguientes derechos:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Mostrar contenido en la plataforma</li>
        <li>Almacenar y procesar contenido</li>
        <li>Respaldar contenido</li>
        <li>Optimizar técnicamente (compresión, etc.)</li>
      </ul>
      <p class="mb-4">La plataforma no usa, vende ni comparte su contenido para otros propósitos.</p>

      <h3 class="text-xl font-semibold mb-2">15. DISPOSICIONES VARIAS</h3>
      
      <h4 class="text-lg font-semibold mb-2">15.1 Hacer notificaciones</h4>
      <p class="mb-2"><strong>De la plataforma a usted:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Correo electrónico (su dirección de correo electrónico registrada)</li>
        <li>Notificación en la aplicación</li>
        <li>SMS (para situaciones de emergencia)</li>
      </ul>
      
      <p class="mb-2"><strong>De usted a la plataforma:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>General:</strong> info@ifoundanapple.com</li>
        <li><strong>Legal:</strong> legal@ifoundanapple.com</li>
        <li><strong>Seguridad:</strong> security@ifoundanapple.com</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">15.2 Integridad del acuerdo</h4>
      <p class="mb-4">Estos Términos constituyen el acuerdo completo entre las partes.</p>

      <h4 class="text-lg font-semibold mb-2">15.3 Nulidad parcial</h4>
      <p class="mb-4">Si alguna disposición de los Términos se considera inválida, las demás disposiciones permanecen válidas.</p>

      <h4 class="text-lg font-semibold mb-2">15.4 Prohibición de cesión</h4>
      <p class="mb-4">Los usuarios no pueden ceder los derechos y obligaciones derivados de este acuerdo a terceros.</p>
      <p class="mb-4">La plataforma puede ceder sus derechos en caso de transferencia comercial, fusión o adquisición.</p>

      <h4 class="text-lg font-semibold mb-2">15.5 Registros electrónicos</h4>
      <p class="mb-4">Los registros electrónicos de la plataforma constituyen evidencia definitiva bajo el artículo 297 del CPC.</p>

      <h3 class="text-xl font-semibold mb-2">16. INFORMACIÓN DE CONTACTO</h3>
      <p class="mb-2"><strong>iFoundAnApple</strong></p>
      
      <p class="mb-2"><strong>Soporte general:</strong></p>
      <p class="mb-4"><strong>Correo electrónico:</strong> info@ifoundanapple.com</p>
      <p class="mb-4"><strong>Tiempo de respuesta:</strong> 24-48 horas</p>
      
      <p class="mb-2"><strong>Asuntos legales:</strong></p>
      <p class="mb-4"><strong>Correo electrónico:</strong> legal@ifoundanapple.com</p>
      
      <p class="mb-2"><strong>Seguridad:</strong></p>
      <p class="mb-4"><strong>Correo electrónico:</strong> security@ifoundanapple.com</p>
      
      <p class="mb-2"><strong>Sitio web:</strong></p>
      <p class="mb-4">https://ifoundanapple.com</p>

      <h3 class="text-xl font-semibold mb-2">17. ACEPTACIÓN Y APROBACIÓN</h3>
      <ul class="list-disc pl-6 mb-4">
        <li>✅ He leído, entendido y aceptado estos Términos de Servicio.</li>
        <li>✅ Declaro que tengo más de 18 años y tengo capacidad legal.</li>
        <li>✅ Al usar la plataforma, acepto cumplir con estos Términos y la Política de Privacidad.</li>
        <li>✅ Consiento en recibir notificaciones por correo electrónico, SMS y en la aplicación.</li>
      </ul>

      <div class="bg-gray-100 p-4 rounded mt-6">
        <p><strong>Última actualización:</strong> 14 de octubre de 2025</p>
        <p><strong>Versión:</strong> 2.0</p>
        <p><strong>Validez:</strong> Turquía y Unión Europea</p>
        <p><strong>© 2025 iFoundAnApple. Todos los derechos reservados.</strong></p>
      </div>
    `,
    privacyContent: `
      <h2 class="text-2xl font-bold mb-4">POLÍTICA DE PRIVACIDAD</h2>
      <p class="mb-4"><strong>Última actualización:</strong> 14 de octubre de 2025</p>

      <h3 class="text-xl font-semibold mb-2">1. CONTROLADOR DE DATOS</h3>
      <p class="mb-4"><strong>iFoundAnApple</strong></p>
      <p class="mb-4"><strong>Correo electrónico:</strong> privacy@ifoundanapple.com</p>
      <p class="mb-4"><strong>Web:</strong> https://ifoundanapple.com</p>
      <p class="mb-4">Esta política está preparada de acuerdo con KVKK y GDPR.</p>

      <h3 class="text-xl font-semibold mb-2">2. INFORMACIÓN DE ALOJAMIENTO Y DOMINIO</h3>
      <p class="mb-4"><strong>Propietario del dominio:</strong> iFoundAnApple</p>
      <p class="mb-4"><strong>Proveedor de alojamiento:</strong> Hetzner</p>
      <p class="mb-4"><strong>Certificado SSL:</strong> Activo (HTTPS)</p>
      <p class="mb-4"><strong>Verificación del dominio:</strong> Alojado en nuestro dominio propio</p>
      <p class="mb-4"><strong>IMPORTANTE:</strong> Esta política de privacidad está alojada en nuestro dominio propio, no en plataformas de terceros como Google Sites, Facebook, Instagram, Twitter.</p>

      <h3 class="text-xl font-semibold mb-2">3. DATOS PERSONALES RECOPILADOS</h3>
      
      <h4 class="text-lg font-semibold mb-2">3.1 Registro y autenticación</h4>
      <p class="mb-2"><strong>Registro por correo electrónico:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Nombre, apellido</li>
        <li>Dirección de correo electrónico</li>
        <li>Contraseña (almacenada encriptada con bcrypt)</li>
        <li>Fecha de nacimiento</li>
      </ul>
      
      <p class="mb-2"><strong>Inicio de sesión OAuth (Google/Apple):</strong></p>
      <p class="mb-2">Cuando inicia sesión con Google o Apple, recopilamos los siguientes datos de usuario:</p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Datos de usuario de Google:</strong> Nombre, Correo electrónico, Foto de perfil (opcional)</li>
        <li><strong>Propósito:</strong> Creación de cuenta y autenticación SOLAMENTE</li>
        <li><strong>Protección de datos:</strong> Cifrado AES-256-GCM en reposo</li>
        <li><strong>Almacenamiento de datos:</strong> Cifrado en nuestra base de datos segura (Supabase)</li>
        <li><strong>Compartir datos:</strong> Solo con proveedores de servicios para la funcionalidad de la plataforma (ver Sección 5.1)</li>
        <li><strong>Retención de datos:</strong> Duración de la cuenta activa, eliminado dentro de 30 días después de la eliminación de la cuenta</li>
        <li>No es necesario crear una contraseña</li>
      </ul>
      <p class="mb-4"><strong>IMPORTANTE:</strong> Usamos los datos de usuario de Google SOLAMENTE para proporcionar la funcionalidad de la plataforma. NO los usamos para publicidad, venta a terceros o cualquier otro propósito.</p>

      <h4 class="text-lg font-semibold mb-2">3.2 Información del dispositivo</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Modelo del dispositivo (iPhone 15 Pro, MacBook Air, etc.)</li>
        <li>Número de serie</li>
        <li>Color y descripción del dispositivo</li>
        <li>Fecha y ubicación de pérdida/hallazgo</li>
        <li>Documento de factura/propiedad (visual - puede eliminarse)</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.3 Información de pago y financiera</h4>
      <p class="mb-2"><strong>Transacciones de pago:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Información de tarjeta de crédito/bancaria procesada por un proveedor de pago seguro (compatible con PCI-DSS)</li>
        <li>Su información de tarjeta no se almacena en nuestros servidores</li>
        <li>Se registran el historial y los montos de las transacciones</li>
      </ul>
      
      <p class="mb-2"><strong>Información bancaria:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Número IBAN (para transferencia de recompensa)</li>
        <li>Nombre del titular de la cuenta</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.4 Información de perfil y contacto</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Número de identificación nacional (opcional, para transacciones de alto valor)</li>
        <li>Número de teléfono</li>
        <li>Dirección de entrega (para transporte)</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">3.5 Datos recopilados automáticamente</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Dirección IP</li>
        <li>Información del navegador y dispositivo</li>
        <li>Información de sesión</li>
        <li>Estadísticas de uso de la plataforma</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">4. FINALIDADES DE USO DE DATOS</h3>
      
      <h4 class="text-lg font-semibold mb-2">4.1 Prestación de servicios</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Emparejamiento de dispositivos perdidos y encontrados (basado en número de serie)</li>
        <li>Gestión de cuenta de usuario</li>
        <li>Organización y seguimiento del transporte</li>
        <li>Envío de notificaciones</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.2 Operaciones de pago y depósito en garantía</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Procesamiento seguro de pagos</li>
        <li>Operación del sistema de depósito en garantía</li>
        <li>Transferencia de pagos de recompensa a IBAN</li>
        <li>Mantenimiento de registros financieros</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.3 Recomendaciones impulsadas por IA</h4>
      <p class="mb-4">Esta característica es opcional. Usamos solo información del modelo del dispositivo para recomendaciones IA. Los datos de identidad personal nunca se comparten.</p>

      <h4 class="text-lg font-semibold mb-2">4.4 Limitaciones de uso de datos</h4>
      <p class="mb-2"><strong>Uso de datos de usuario de Google y datos personales:</strong></p>
      <p class="mb-2">Usamos sus datos de usuario de Google e información personal SOLAMENTE para:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>✅ Proporcionar funcionalidad de la plataforma (autenticación, gestión de cuenta)</li>
        <li>✅ Procesar transacciones y pagos</li>
        <li>✅ Organizar la entrega del dispositivo</li>
        <li>✅ Enviar notificaciones importantes del servicio</li>
        <li>✅ Mejorar la experiencia del usuario</li>
        <li>✅ Seguridad y prevención de fraude</li>
      </ul>
      <p class="mb-2"><strong>NO usamos sus datos para:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>❌ Publicidad dirigida o marketing</li>
        <li>❌ Venta a corredores de datos o revendedores de información</li>
        <li>❌ Determinación de solvencia o propósitos de préstamo</li>
        <li>❌ Anuncios de usuario o publicidad personalizada</li>
        <li>❌ Entrenamiento de modelos IA no relacionados con nuestro servicio</li>
        <li>❌ Creación de bases de datos para otros propósitos</li>
        <li>❌ Cualquier otro propósito más allá de proporcionar o mejorar la funcionalidad de la plataforma</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.5 Seguridad</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Prevención de fraude</li>
        <li>Verificación de identidad</li>
        <li>Mantenimiento de registros de auditoría</li>
        <li>Detección de violación de seguridad</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">4.6 Cumplimiento legal</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Cumplimiento de los requisitos KVKK y GDPR</li>
        <li>Obligaciones de la legislación fiscal (conservación de registros durante 10 años)</li>
        <li>Decisiones judiciales y procesos legales</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">5. COMPARTIR DATOS</h3>
      
      <h4 class="text-lg font-semibold mb-2">5.1 Proveedores de servicios</h4>
      <p class="mb-2"><strong>Supabase (Infraestructura backend):</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Base de datos, autenticación, almacenamiento de archivos</li>
        <li>SOC 2 Tipo II, compatible con GDPR</li>
        <li>Ubicación de datos: EE. UU./UE</li>
        <li><strong>Datos de usuario de Google compartidos:</strong> Nombre, Correo electrónico (cifrado)</li>
      </ul>
      
      <p class="mb-2"><strong>Proveedor de pago:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Procesamiento de pagos, 3D Secure, depósito en garantía</li>
        <li>Certificado PCI-DSS nivel 1</li>
        <li>Con sede en Turquía</li>
        <li><strong>Datos de usuario de Google compartidos:</strong> Correo electrónico (solo para recibos de transacción)</li>
      </ul>
      
      <p class="mb-2"><strong>Google/Apple (Autenticación OAuth):</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Inicio de sesión de terceros (opcional)</li>
        <li>Usado solo para autenticación</li>
      </ul>
      
      <p class="mb-2"><strong>Google Gemini (Recomendaciones IA):</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Solo se comparte información del modelo del dispositivo</li>
        <li>No se comparten datos de usuario de Google (nombre, correo electrónico)</li>
        <li>No se comparte información de identidad personal</li>
      </ul>
      
      <p class="mb-2"><strong>Empresas de transporte (Aras, MNG, Yurtiçi, PTT):</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Dirección de entrega y teléfono</li>
        <li>Códigos remitente/receptor anónimos (FND-XXX, OWN-XXX)</li>
        <li>Las identidades reales (nombre, correo electrónico) se mantienen confidenciales</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">5.2 Compartir entre usuarios</h4>
      <p class="mb-4"><strong>IMPORTANTE:</strong> Su identidad, correo electrónico y número de teléfono nunca se comparten con otros usuarios.</p>
      
      <p class="mb-2"><strong>Después del emparejamiento:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>La identidad de la otra parte permanece anónima</li>
        <li>Solo se envía la notificación "Emparejamiento encontrado"</li>
        <li>Solo se comparte la dirección de entrega para transporte (nombre-apellido y dirección)</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">5.3 Obligación legal</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Orden judicial o citación</li>
        <li>Solicitudes de aplicación de la ley</li>
        <li>Autoridades fiscales (para registros financieros)</li>
        <li>Solicitudes de la Institución KVKK</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">6. SEGURIDAD Y RETENCIÓN DE DATOS</h3>
      
      <h4 class="text-lg font-semibold mb-2">6.1 Medidas de seguridad</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>Cifrado SSL/TLS (HTTPS) - TLS 1.3</li>
        <li>Hash de contraseñas (bcrypt)</li>
        <li><strong>Cifrado de base de datos en reposo (AES-256-GCM)</strong></li>
        <li><strong>Cifrado a nivel de aplicación para datos sensibles:</strong></li>
        <ul class="list-disc pl-6 mb-4">
          <li>ID Nacional Turco (TC Kimlik No)</li>
          <li>Números IBAN</li>
          <li>Números de teléfono</li>
          <li>Direcciones físicas</li>
          <li>Datos de usuario de Google (nombre, correo electrónico)</li>
        </ul>
        <li>Políticas de seguridad a nivel de fila (RLS)</li>
        <li>Tokens de autenticación seguros OAuth 2.0</li>
        <li>Verificación de pago 3D Secure</li>
        <li>Soporte de autenticación de dos factores (2FA)</li>
        <li>Auditorías de seguridad regulares y evaluaciones de vulnerabilidad</li>
        <li>Registros de control de acceso y monitoreo</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">6.2 Períodos de retención</h4>
      
      <p class="mb-2"><strong>Retención de datos de usuario de Google:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Cuentas activas:</strong> Retenidas mientras su cuenta esté activa</li>
        <li><strong>Cuentas eliminadas:</strong> Datos de usuario de Google (nombre, correo electrónico) eliminados dentro de 30 días</li>
        <li><strong>Datos financieros:</strong> 10 años (requisito legal - Ley Fiscal)</li>
        <li><strong>Puede solicitar eliminación:</strong> Envíenos un correo a privacy@ifoundanapple.com</li>
      </ul>
      
      <p class="mb-2"><strong>Cuentas activas:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Retenidas mientras su cuenta esté activa</li>
      </ul>
      
      <p class="mb-2"><strong>Cuentas cerradas:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Eliminadas dentro de 30 días después del cierre de cuenta</li>
        <li>Registros financieros retenidos durante 10 años (obligación legal)</li>
        <li>Las estadísticas anónimas pueden retenerse indefinidamente</li>
      </ul>
      
      <p class="mb-2"><strong>Registros de transacciones:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Transacciones financieras: 10 años</li>
        <li>Registros de transporte: 2 años</li>
        <li>Registros de auditoría: 5 años</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">7. DERECHOS DEL USUARIO (KVKK & GDPR)</h3>
      
      <h4 class="text-lg font-semibold mb-2">7.1 Sus derechos</h4>
      <ul class="list-disc pl-6 mb-4">
        <li>✅ <strong>Derecho a la información:</strong> Saber si sus datos están siendo procesados</li>
        <li>✅ <strong>Derecho de acceso:</strong> Obtener una copia de sus datos</li>
        <li>✅ <strong>Derecho de rectificación:</strong> Corregir información incorrecta</li>
        <li>✅ <strong>Derecho al borrado:</strong> Eliminar sus datos (derecho al olvido)</li>
        <li>✅ <strong>Derecho de oposición:</strong> Oponerse a las actividades de procesamiento de datos</li>
        <li>✅ <strong>Portabilidad de datos:</strong> Transferir sus datos a otra plataforma</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">7.2 Método de solicitud</h4>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Correo electrónico:</strong> privacy@ifoundanapple.com</li>
        <li><strong>Asunto:</strong> Solicitud KVKK/GDPR</li>
        <li><strong>Tiempo de respuesta:</strong> 30 días (máximo)</li>
      </ul>

      <h4 class="text-lg font-semibold mb-2">7.3 Derecho a presentar quejas</h4>
      <p class="mb-2"><strong>Turquía:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Autoridad de Protección de Datos Personales - https://www.kvkk.gov.tr</li>
      </ul>
      
      <p class="mb-2"><strong>UE:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Autoridad de Protección de Datos del país relevante</li>
      </ul>

      <h3 class="text-xl font-semibold mb-2">8. PRIVACIDAD DE NIÑOS</h3>
      <p class="mb-4">La plataforma no está destinada a usuarios menores de 18 años. No recopilamos intencionalmente datos de personas menores de 18 años.</p>

      <h3 class="text-xl font-semibold mb-2">9. COOKIES</h3>
      <p class="mb-2"><strong>Cookies que usamos:</strong></p>
      <ul class="list-disc pl-6 mb-4">
        <li>Gestión de sesión (obligatorio)</li>
        <li>Preferencias de idioma (funcional)</li>
        <li>Seguridad (obligatorio)</li>
      </ul>
      <p class="mb-4">Puede administrar las cookies desde la configuración de su navegador.</p>

      <h3 class="text-xl font-semibold mb-2">10. TRANSFERENCIA INTERNACIONAL DE DATOS</h3>
      <ul class="list-disc pl-6 mb-4">
        <li><strong>Supabase:</strong> Centros de datos EE. UU./UE (compatible con GDPR, SCC)</li>
        <li><strong>Proveedor de pago:</strong> Internacional</li>
        <li><strong>Google:</strong> Global (para OAuth e IA)</li>
      </ul>
      <p class="mb-4">Todas las transferencias se realizan de acuerdo con las disposiciones KVKK y GDPR.</p>

      <h3 class="text-xl font-semibold mb-2">11. CAMBIOS Y ACTUALIZACIONES</h3>
      <p class="mb-2">Podemos actualizar esta Política de Privacidad de vez en cuando. Cuando se realizan cambios importantes:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Publicamos anuncios en el sitio web</li>
        <li>Enviamos notificaciones por correo electrónico</li>
        <li>Se cambia la fecha de "Última actualización"</li>
      </ul>
      <p class="mb-4">Las actualizaciones entran en vigor en la fecha en que se publican.</p>

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
  }
  if (model.toLowerCase().includes('ipad')) {
    return APPLE_DEVICE_COLORS.iPad;
  }
  if (model.toLowerCase().includes('mac') || model.toLowerCase().includes('imac')) {
    return APPLE_DEVICE_COLORS.Mac;
  }
  if (model.toLowerCase().includes('watch')) {
    return APPLE_DEVICE_COLORS.AppleWatch;
  }
  if (model.toLowerCase().includes('airpods')) {
    return APPLE_DEVICE_COLORS.AirPods;
  }
  return APPLE_DEVICE_COLORS.General;
};

// End of localization constants


