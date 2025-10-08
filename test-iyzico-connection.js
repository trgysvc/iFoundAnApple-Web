/**
 * İYZİCO BAĞLANTI VE TEST ÖDEMESİ KONTROLÜ
 * 
 * Bu script İyzico API bağlantısını test eder ve test ödemesi gerçekleştirir.
 */

const Iyzipay = require('iyzipay');

// Renkli console output için
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.bright}${colors.cyan}═══ ${msg} ═══${colors.reset}\n`),
  data: (label, data) => console.log(`${colors.magenta}  ${label}:${colors.reset}`, JSON.stringify(data, null, 2))
};

// İyzico Sandbox Credentials
const IYZICO_CONFIG = {
  apiKey: 'sandbox-xQUfDCNqUzFl3TeQ6TwUxk7QovYnthKL',
  secretKey: 'sandbox-njCZVrXuJuKXu12mUdjUs4g9sQHy9PqR',
  uri: 'https://sandbox-api.iyzipay.com'
};

// Test verisi
const TEST_PAYMENT_DATA = {
  locale: Iyzipay.LOCALE.TR,
  conversationId: `test_${Date.now()}`,
  price: '1.0',
  paidPrice: '1.0',
  currency: Iyzipay.CURRENCY.TRY,
  installment: '1',
  basketId: `basket_${Date.now()}`,
  paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
  paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
  paymentCard: {
    cardHolderName: 'Test User',
    cardNumber: '5528790000000008', // İyzico test kartı
    expireMonth: '12',
    expireYear: '2030',
    cvc: '123',
    registerCard: '0'
  },
  buyer: {
    id: 'test_buyer_001',
    name: 'Test',
    surname: 'User',
    gsmNumber: '+905555555555',
    email: 'test@test.com',
    identityNumber: '11111111111',
    lastLoginDate: '2024-01-01 12:00:00',
    registrationDate: '2024-01-01 12:00:00',
    registrationAddress: 'Test Address',
    ip: '85.34.78.112',
    city: 'Istanbul',
    country: 'Turkey',
    zipCode: '34732'
  },
  shippingAddress: {
    contactName: 'Test User',
    city: 'Istanbul',
    country: 'Turkey',
    address: 'Test Shipping Address',
    zipCode: '34732'
  },
  billingAddress: {
    contactName: 'Test User',
    city: 'Istanbul',
    country: 'Turkey',
    address: 'Test Billing Address',
    zipCode: '34732'
  },
  basketItems: [
    {
      id: 'test_item_001',
      name: 'Test Product',
      category1: 'Electronics',
      category2: 'Mobile',
      itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
      price: '1.0'
    }
  ]
};

async function testIyzicoConnection() {
  log.section('İYZİCO BAĞLANTI VE TEST ÖDEMESİ KONTROLÜ');
  
  try {
    // 1. Konfigürasyon Kontrolü
    log.section('1. KONFİGÜRASYON KONTROLÜ');
    log.info('İyzico SDK başlatılıyor...');
    
    const iyzipay = new Iyzipay({
      apiKey: IYZICO_CONFIG.apiKey,
      secretKey: IYZICO_CONFIG.secretKey,
      uri: IYZICO_CONFIG.uri
    });
    
    log.success('İyzico SDK başarıyla oluşturuldu');
    log.data('Konfigürasyon', {
      apiKey: IYZICO_CONFIG.apiKey.substring(0, 20) + '...',
      secretKey: IYZICO_CONFIG.secretKey.substring(0, 20) + '...',
      uri: IYZICO_CONFIG.uri
    });

    // 2. API Bağlantı Testi (BIN Kontrolü)
    log.section('2. API BAĞLANTI TESTİ (BIN Kontrolü)');
    log.info('İyzico API\'ye test isteği gönderiliyor...');
    
    const binCheckResult = await new Promise((resolve, reject) => {
      iyzipay.binNumber.retrieve({
        locale: Iyzipay.LOCALE.TR,
        conversationId: `bin_test_${Date.now()}`,
        binNumber: '552879' // İyzico test kartı BIN
      }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (binCheckResult.status === 'success') {
      log.success('API bağlantısı başarılı!');
      log.data('BIN Kontrolü Sonucu', {
        status: binCheckResult.status,
        cardType: binCheckResult.cardType,
        cardAssociation: binCheckResult.cardAssociation,
        cardFamily: binCheckResult.cardFamily,
        bankName: binCheckResult.bankName
      });
    } else {
      log.error('API bağlantısı başarısız!');
      log.data('Hata', binCheckResult);
      return;
    }

    // 3. Test Ödemesi
    log.section('3. TEST ÖDEMESİ');
    log.info('Test ödemesi başlatılıyor...');
    log.data('Ödeme Verisi', {
      conversationId: TEST_PAYMENT_DATA.conversationId,
      amount: TEST_PAYMENT_DATA.paidPrice + ' TRY',
      cardNumber: TEST_PAYMENT_DATA.paymentCard.cardNumber,
      buyer: TEST_PAYMENT_DATA.buyer.email
    });

    const paymentResult = await new Promise((resolve, reject) => {
      iyzipay.payment.create(TEST_PAYMENT_DATA, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    log.section('4. ÖDEME SONUCU');
    
    if (paymentResult.status === 'success') {
      log.success('✅ ÖDEME BAŞARILI!');
      log.data('Ödeme Detayları', {
        status: paymentResult.status,
        paymentId: paymentResult.paymentId,
        conversationId: paymentResult.conversationId,
        price: paymentResult.price,
        paidPrice: paymentResult.paidPrice,
        currency: paymentResult.currency,
        installment: paymentResult.installment,
        fraudStatus: paymentResult.fraudStatus,
        merchantCommissionRate: paymentResult.merchantCommissionRate,
        merchantCommissionRateAmount: paymentResult.merchantCommissionRateAmount
      });
    } else {
      log.error('❌ ÖDEME BAŞARISIZ!');
      log.data('Hata Detayları', {
        status: paymentResult.status,
        errorCode: paymentResult.errorCode,
        errorMessage: paymentResult.errorMessage,
        errorGroup: paymentResult.errorGroup
      });
    }

    // 5. Özet Rapor
    log.section('5. ÖZET RAPOR');
    log.success('✓ İyzico SDK Başlatma: BAŞARILI');
    log.success('✓ API Bağlantısı (BIN Kontrolü): BAŞARILI');
    
    if (paymentResult.status === 'success') {
      log.success('✓ Test Ödemesi: BAŞARILI');
      log.info('\n🎉 TÜM TESTLER BAŞARILI! İyzico entegrasyonu çalışıyor.');
    } else {
      log.error('✗ Test Ödemesi: BAŞARISIZ');
      log.warning('\n⚠️ API bağlantısı çalışıyor ama ödeme başarısız oldu.');
      log.warning('Muhtemel sebepler:');
      log.warning('  - Test kartı geçersiz olabilir');
      log.warning('  - Sandbox hesabı aktif olmayabilir');
      log.warning('  - API credentials yanlış olabilir');
    }

  } catch (error) {
    log.section('HATA!');
    log.error('Test sırasında hata oluştu:');
    console.error(error);
    
    if (error.message && error.message.includes('ENOTFOUND')) {
      log.error('\n❌ İnternet bağlantısı sorunu veya İyzico API erişilemiyor');
    } else if (error.message && error.message.includes('401')) {
      log.error('\n❌ API credentials hatalı (401 Unauthorized)');
    } else if (error.message && error.message.includes('403')) {
      log.error('\n❌ API erişim izni yok (403 Forbidden)');
    } else {
      log.error('\n❌ Bilinmeyen hata');
    }
  }
}

// Scripti çalıştır
log.info('Script başlatılıyor...\n');
testIyzicoConnection().then(() => {
  log.info('\n✓ Script tamamlandı');
  process.exit(0);
}).catch((error) => {
  log.error('\n✗ Script hatası:');
  console.error(error);
  process.exit(1);
});
