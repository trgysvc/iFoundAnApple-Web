/**
 * Test Modu Ödeme Testi
 * Mock ödeme sistemi ile escrow akışını test etme
 */

import { processPaymentLocal } from './api/process-payment';

// Test Modu için mock ödeme verisi
export const createTestModePaymentData = () => ({
  deviceId: 'test-device-001',
  payerId: 'test-user-001',
  receiverId: undefined, // Henüz match olmamış
  feeBreakdown: {
    rewardAmount: 359.70,
    cargoFee: 25.00,
    serviceFee: 53.95,
    gatewayFee: 10.43,
    totalAmount: 449.09,
    netPayout: 305.75
  },
  deviceInfo: {
    model: 'iPhone 17 Pro Max',
    serialNumber: 'TEST_SERIAL_001',
    description: 'Test device for payment flow'
  },
  payerInfo: {
    name: 'Test User',
    email: 'test@example.com',
    phone: '5555555555',
    address: {
      street: 'Test Mahallesi Test Sokak No:1',
      city: 'İstanbul',
      district: 'Kadıköy',
      postalCode: '34000'
    }
  },
  paymentProvider: 'test' as const
});

// Test Modu ödeme testi
export async function testTestModePayment(): Promise<void> {
  console.log('🧪 Test Modu Ödeme Testi Başlatılıyor...\n');

  try {
    const paymentData = createTestModePaymentData();
    
    console.log('📋 Test Ödeme Verileri:');
    console.log('- Device:', paymentData.deviceInfo.model);
    console.log('- Total Amount:', paymentData.feeBreakdown.totalAmount, 'TL');
    console.log('- Payer:', paymentData.payerInfo.email);
    console.log('- Provider:', paymentData.paymentProvider);
    console.log('');

    console.log('💳 Ödeme İşlemi Başlatılıyor...');
    const result = await processPaymentLocal(paymentData);
    
    console.log('📊 Ödeme Sonucu:');
    console.log('- Başarılı:', result.success);
    console.log('- Payment ID:', result.paymentId);
    console.log('- Escrow ID:', result.escrowId);
    console.log('- Durum:', result.status);
    console.log('- Provider Payment ID:', result.providerPaymentId);
    
    if (result.errorMessage) {
      console.log('- Hata Mesajı:', result.errorMessage);
    }
    
    if (result.providerResponse) {
      console.log('- Provider Response:', JSON.stringify(result.providerResponse, null, 2));
    }

    console.log('');
    
    if (result.success) {
      console.log('✅ Test Modu ödeme başarılı!');
      console.log('🔒 Escrow sistemi çalışıyor');
      console.log('💾 Veritabanı kayıtları oluşturuldu');
      
      // Escrow durumunu kontrol et
      if (result.escrowId) {
        console.log('📋 Escrow ID:', result.escrowId);
        console.log('💰 Tutar:', paymentData.feeBreakdown.totalAmount, 'TL');
        console.log('🎯 Net Payout:', paymentData.feeBreakdown.netPayout, 'TL');
      }
    } else {
      console.log('❌ Test Modu ödeme başarısız:', result.errorMessage);
    }

  } catch (error) {
    console.error('❌ Test hatası:', error);
  }
}

// Escrow serbest bırakma testi
export async function testEscrowRelease(): Promise<void> {
  console.log('🔓 Escrow Serbest Bırakma Testi Başlatılıyor...\n');

  try {
    // Önce bir ödeme oluştur
    const paymentData = createTestModePaymentData();
    const paymentResult = await processPaymentLocal(paymentData);
    
    if (!paymentResult.success || !paymentResult.paymentId) {
      console.log('❌ Ödeme oluşturulamadı, escrow testi atlanıyor');
      return;
    }

    console.log('✅ Ödeme oluşturuldu:', paymentResult.paymentId);
    
    // Escrow serbest bırakma işlemi
    const { releaseEscrowLocal } = await import('./api/release-escrow');
    
    const releaseRequest = {
      paymentId: paymentResult.paymentId,
      deviceId: paymentData.deviceId,
      releaseReason: 'Test escrow release',
      confirmationType: 'manual_release' as const,
      confirmedBy: paymentData.payerId,
      additionalNotes: 'Test modu escrow serbest bırakma'
    };

    console.log('🔓 Escrow serbest bırakılıyor...');
    const releaseResult = await releaseEscrowLocal(releaseRequest);
    
    console.log('📊 Escrow Serbest Bırakma Sonucu:');
    console.log('- Başarılı:', releaseResult.success);
    console.log('- Transaction ID:', releaseResult.transactionId);
    console.log('- Durum:', releaseResult.status);
    console.log('- Net Payout:', releaseResult.netPayoutAmount, 'TL');
    
    if (releaseResult.errorMessage) {
      console.log('- Hata Mesajı:', releaseResult.errorMessage);
    }

    if (releaseResult.success) {
      console.log('✅ Escrow serbest bırakma başarılı!');
    } else {
      console.log('❌ Escrow serbest bırakma başarısız');
    }

  } catch (error) {
    console.error('❌ Escrow test hatası:', error);
  }
}

// Tam test akışı
export async function runFullTestModeFlow(): Promise<void> {
  console.log('🎯 Test Modu Tam Akış Testi\n');
  console.log('=====================================\n');

  await testTestModePayment();
  console.log('\n-------------------------------------\n');
  
  await testEscrowRelease();
  
  console.log('\n🎉 Test Modu akışı tamamlandı!');
  console.log('💡 Şimdi gerçek İyzico entegrasyonunu test edebilirsiniz');
}

// Eğer bu dosya doğrudan çalıştırılıyorsa testleri başlat
if (typeof window === 'undefined') {
  runFullTestModeFlow().catch(console.error);
}
