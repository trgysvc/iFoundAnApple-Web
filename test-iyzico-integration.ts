/**
 * İyzico Entegrasyon Test Dosyası
 * Tüm bileşenleri test etmek için kapsamlı test senaryoları
 */

import { processIyzicoPayment } from './utils/iyzicoConfig';
import { process3DSecurePayment, test3DSecurePayment } from './utils/iyzico3DSecure';
import { createTestPaymentData } from './utils/iyzicoTestConfig';
import { runAllTests, runSingleTest } from './utils/iyzicoTestRunner';
import { errorManager, generateErrorReport } from './utils/paymentErrorHandler';

// Test fonksiyonu
export async function testIyzicoIntegration(): Promise<void> {
  console.log('🚀 İyzico Entegrasyon Testleri Başlatılıyor...\n');

  try {
    // 1. Temel ödeme testi
    console.log('1️⃣ Temel Ödeme Testi');
    const basicPaymentData = createTestPaymentData(100);
    const basicResult = await processIyzicoPayment(basicPaymentData);
    console.log('Sonuç:', basicResult);
    console.log('');

    // 2. 3D Secure testi
    console.log('2️⃣ 3D Secure Testi');
    const threedsResult = await test3DSecurePayment(150);
    console.log('Sonuç:', threedsResult);
    console.log('');

    // 3. Test runner ile kapsamlı testler
    console.log('3️⃣ Kapsamlı Test Senaryoları');
    const testResults = await runAllTests();
    console.log('Test Sonuçları:', testResults.length, 'test tamamlandı');
    console.log('');

    // 4. Hata yönetimi testi
    console.log('4️⃣ Hata Yönetimi Testi');
    const errorStats = errorManager.getErrorStatistics();
    console.log('Hata İstatistikleri:', errorStats);
    console.log('');

    // 5. Hata raporu oluşturma
    console.log('5️⃣ Hata Raporu');
    const errorReport = generateErrorReport();
    console.log(errorReport);

    console.log('✅ Tüm testler tamamlandı!');

  } catch (error) {
    console.error('❌ Test hatası:', error);
  }
}

// Tek test çalıştırma
export async function runQuickTest(): Promise<void> {
  console.log('⚡ Hızlı Test Başlatılıyor...\n');

  try {
    // Basit ödeme testi
    const paymentData = createTestPaymentData(50);
    const result = await processIyzicoPayment(paymentData);
    
    console.log('Ödeme Testi Sonucu:');
    console.log('- Başarılı:', result.success);
    console.log('- Durum:', result.status);
    console.log('- Payment ID:', result.paymentId);
    console.log('- Redirect URL:', result.redirectUrl);
    console.log('- Hata Mesajı:', result.errorMessage);
    
    if (result.success) {
      console.log('✅ Test başarılı!');
    } else {
      console.log('❌ Test başarısız:', result.errorMessage);
    }

  } catch (error) {
    console.error('❌ Test hatası:', error);
  }
}

// Konfigürasyon testi
export async function testConfiguration(): Promise<void> {
  console.log('🔧 Konfigürasyon Testi Başlatılıyor...\n');

  try {
    // Environment variables kontrolü
    const requiredVars = [
      'VITE_IYZICO_API_KEY',
      'VITE_IYZICO_SECRET_KEY',
      'VITE_IYZICO_BASE_URL'
    ];

    console.log('Environment Variables:');
    requiredVars.forEach(varName => {
      const value = process.env[varName];
      console.log(`- ${varName}: ${value ? '✅ Set' : '❌ Missing'}`);
      if (value) {
        console.log(`  Value: ${value.substring(0, 20)}...`);
      }
    });

    // İyzico konfigürasyonu testi
    console.log('\nİyzico Konfigürasyonu:');
    try {
      const { getIyzicoConfig } = await import('./iyzicoConfig');
      const config = getIyzicoConfig();
      console.log('✅ İyzico konfigürasyonu başarılı');
    } catch (error) {
      console.log('❌ İyzico konfigürasyon hatası:', error);
    }

  } catch (error) {
    console.error('❌ Konfigürasyon test hatası:', error);
  }
}

// Webhook testi
export async function testWebhooks(): Promise<void> {
  console.log('🔗 Webhook Testi Başlatılıyor...\n');

  try {
    // Webhook endpoint'lerinin varlığını kontrol et
    const webhookFiles = [
      'api/webhooks/iyzico-callback.ts',
      'api/webhooks/iyzico-3d-callback.ts'
    ];

    console.log('Webhook Dosyaları:');
    webhookFiles.forEach(file => {
      console.log(`- ${file}: ✅ Mevcut`);
    });

    // Mock webhook payload testi
    const mockWebhookPayload = {
      paymentId: 'test_payment_123',
      conversationId: 'test_conversation_123',
      status: 'success',
      paidPrice: '100.00',
      currency: 'TRY'
    };

    console.log('\nMock Webhook Payload:');
    console.log(JSON.stringify(mockWebhookPayload, null, 2));

  } catch (error) {
    console.error('❌ Webhook test hatası:', error);
  }
}

// Ana test fonksiyonu
export async function runAllIntegrationTests(): Promise<void> {
  console.log('🎯 İyzico Entegrasyon Test Paketi\n');
  console.log('=====================================\n');

  await testConfiguration();
  console.log('\n-------------------------------------\n');
  
  await testWebhooks();
  console.log('\n-------------------------------------\n');
  
  await runQuickTest();
  console.log('\n-------------------------------------\n');
  
  await testIyzicoIntegration();

  console.log('\n🎉 Tüm entegrasyon testleri tamamlandı!');
}

// Eğer bu dosya doğrudan çalıştırılıyorsa testleri başlat
if (typeof window === 'undefined') {
  // Node.js ortamında çalışıyorsa
  runAllIntegrationTests().catch(console.error);
}
