/**
 * İyzico Test Konfigürasyonu
 * Sandbox credentials ile test ortamı için konfigürasyon
 */

export const IYZICO_TEST_CONFIG = {
  // Sandbox credentials
  apiKey: 'sandbox-xQUfDCNqUzFl3TeQ6TwUxk7QovYnthKL',
  secretKey: 'sandbox-njCZVrXuJuKXu12mUdjUs4g9sQHy9PqR',
  baseUrl: 'https://sandbox-api.iyzipay.com',
  callbackUrl: 'http://localhost:5173/api/webhooks/iyzico-callback',
  
  // Test kartları
  testCards: {
    success: {
      cardNumber: '5528790000000008',
      expiryMonth: '12',
      expiryYear: '2030',
      cvc: '123',
      cardHolderName: 'John Doe'
    },
    failure: {
      cardNumber: '5528790000000016',
      expiryMonth: '12',
      expiryYear: '2030',
      cvc: '123',
      cardHolderName: 'John Doe'
    },
    '3d-secure': {
      cardNumber: '5528790000000024',
      expiryMonth: '12',
      expiryYear: '2030',
      cvc: '123',
      cardHolderName: 'John Doe'
    }
  },
  
  // Test kullanıcı bilgileri
  testBuyer: {
    id: 'test-buyer-001',
    name: 'Test',
    surname: 'User',
    email: 'test@example.com',
    phone: '5555555555',
    identityNumber: '11111111111',
    city: 'İstanbul',
    country: 'Turkey',
    address: 'Test Mahallesi Test Sokak No:1',
    zipCode: '34000'
  }
};

// Test ödeme verisi oluşturucu
export const createTestPaymentData = (amount: number = 100) => ({
  amount,
  currency: 'TRY',
  conversationId: `test_${Date.now()}`,
  buyerInfo: IYZICO_TEST_CONFIG.testBuyer,
  shippingAddress: {
    contactName: `${IYZICO_TEST_CONFIG.testBuyer.name} ${IYZICO_TEST_CONFIG.testBuyer.surname}`,
    city: IYZICO_TEST_CONFIG.testBuyer.city,
    country: IYZICO_TEST_CONFIG.testBuyer.country,
    address: IYZICO_TEST_CONFIG.testBuyer.address,
    zipCode: IYZICO_TEST_CONFIG.testBuyer.zipCode
  },
  billingAddress: {
    contactName: `${IYZICO_TEST_CONFIG.testBuyer.name} ${IYZICO_TEST_CONFIG.testBuyer.surname}`,
    city: IYZICO_TEST_CONFIG.testBuyer.city,
    country: IYZICO_TEST_CONFIG.testBuyer.country,
    address: IYZICO_TEST_CONFIG.testBuyer.address,
    zipCode: IYZICO_TEST_CONFIG.testBuyer.zipCode
  },
  basketItems: [
    {
      id: 'test-device-001',
      name: 'iPhone 15 Pro Max Device Recovery',
      category1: 'Electronics',
      category2: 'Mobile Device',
      itemType: 'PHYSICAL',
      price: amount
    }
  ]
});
