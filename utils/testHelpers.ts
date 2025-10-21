/**
 * Test Helper Functions
 * Browser console'da test edilebilir fonksiyonlar
 */

import { 
  getAllDeviceModels, 
  calculateFeesByModelName, 
  getDeviceCategories,
  formatFeeBreakdown,
  DeviceModelData 
} from './feeCalculation';

import { 
  initiatePayment, 
  checkPaymentStatus, 
  createTestPayment,
  validatePCICompliance 
} from './paymentGateway';

/**
 * Browser console'da kullanılabilir test fonksiyonları
 */
export class TestRunner {
  
  /**
   * Tüm cihaz modellerini test et
   */
  static async testDeviceModels(): Promise<void> {
    console.log('🧪 DEVICE MODELS TEST BAŞLATIYOR...\n');
    
    try {
      const result = await getAllDeviceModels();
      
      if (result.success && result.models) {
        console.log(`✅ ${result.models.length} cihaz modeli yüklendi`);
        
        // Kategorileri göster
        const categories = [...new Set(result.models.map(m => m.category))];
        console.log(`📱 Kategoriler: ${categories.join(', ')}`);
        
        // Her kategoriden örnek
        categories.forEach(category => {
          const categoryModels = result.models!.filter(m => m.category === category);
          console.log(`\n${category} (${categoryModels.length} model):`);
          categoryModels.slice(0, 3).forEach(model => {
            console.log(`  - ${model.name}: ${model.repair_price} TL`);
          });
        });
        
        return result.models;
      } else {
        console.error('❌ Device models yüklenemedi:', result.error);
      }
    } catch (error) {
      console.error('❌ Test hatası:', error);
    }
  }

  /**
   * Fee calculation'ı test et
   */
  static async testFeeCalculation(): Promise<void> {
    console.log('🧮 FEE CALCULATION TEST BAŞLATIYOR...\n');
    
    const testModels = [
      'iPhone 15 Pro Max',
      'iPad Pro 13 inch M4', 
      'Apple Watch Ultra 2',
      'AirPods Pro 2nd Gen USB-C'
    ];

    for (const modelName of testModels) {
      try {
        console.log(`\n💰 ${modelName} için ücret hesaplama...`);
        const result = await calculateFeesByModelName(modelName);
        
        if (result.success && result.fees) {
          console.log('✅ Hesaplama başarılı:');
          console.log(formatFeeBreakdown(result.fees));
        } else {
          console.error(`❌ ${modelName} hesaplama hatası:`, result.error);
        }
      } catch (error) {
        console.error(`❌ ${modelName} test hatası:`, error);
      }
    }
  }

  /**
   * Özel ödül miktarı testi
   */
  static async testCustomReward(): Promise<void> {
    console.log('🎁 CUSTOM REWARD TEST BAŞLATIYOR...\n');
    
    const testCases = [
      { model: 'iPhone 15 Pro Max', customReward: 2000 },
      { model: 'iPad Pro 13 inch M4', customReward: 1500 },
      { model: 'Apple Watch Ultra 2', customReward: 800 }
    ];

    for (const testCase of testCases) {
      try {
        console.log(`\n🧮 ${testCase.model} - Özel ödül: ${testCase.customReward} TL`);
        
        // Normal hesaplama
        const normalResult = await calculateFeesByModelName(testCase.model);
        
        // Özel ödül hesaplama
        const customResult = await calculateFeesByModelName(testCase.model, testCase.customReward);
        
        if (normalResult.success && customResult.success && normalResult.fees && customResult.fees) {
          console.log(`📊 Karşılaştırma:`);
          console.log(`   Normal ödül: ${normalResult.fees.rewardAmount} TL → Toplam: ${normalResult.fees.totalAmount} TL`);
          console.log(`   Özel ödül: ${customResult.fees.rewardAmount} TL → Toplam: ${customResult.fees.totalAmount} TL`);
          console.log(`   Fark: +${(customResult.fees.totalAmount - normalResult.fees.totalAmount).toFixed(2)} TL`);
        }
      } catch (error) {
        console.error(`❌ Test hatası:`, error);
      }
    }
  }

  /**
   * Payment gateway testi
   */
  static async testPaymentGateway(): Promise<void> {
    console.log('💳 PAYMENT GATEWAY TEST BAŞLATIYOR...\n');
    
    try {
      // PCI Compliance check
      console.log('🔒 PCI DSS Compliance kontrolü...');
      const isCompliant = validatePCICompliance();
      console.log(isCompliant ? '✅ PCI DSS uyumlu' : '❌ PCI DSS uyumsuz');
      
      // Test payment
      console.log('\n💰 Test ödeme işlemi...');
      const testPayment = await createTestPayment(150);
      
      if (testPayment.success) {
        console.log('✅ Test ödeme başarılı:', testPayment);
        
        // Payment status check
        console.log('\n📊 Ödeme durumu sorgulama...');
        if (testPayment.paymentId) {
          const statusResult = await checkPaymentStatus(testPayment.paymentId, 'test');
          console.log(statusResult.success ? '✅ Durum sorgulaması başarılı' : '❌ Durum sorgulaması başarısız', statusResult);
        }
      } else {
        console.error('❌ Test ödeme başarısız:', testPayment.errorMessage);
      }
    } catch (error) {
      console.error('❌ Payment test hatası:', error);
    }
  }

  /**
   * Comprehensive system test
   */
  static async runAllTests(): Promise<void> {
    console.log('🚀 COMPREHENSIVE SYSTEM TEST BAŞLATIYOR...\n');
    console.log('=' .repeat(50));
    
    // Test 1: Device Models
    await this.testDeviceModels();
    console.log('\n' + '='.repeat(50));
    
    // Test 2: Fee Calculation
    await this.testFeeCalculation();
    console.log('\n' + '='.repeat(50));
    
    // Test 3: Custom Reward
    await this.testCustomReward();
    console.log('\n' + '='.repeat(50));
    
    // Test 4: Payment Gateway
    await this.testPaymentGateway();
    console.log('\n' + '='.repeat(50));
    
    console.log('🎉 TÜM TESTLER TAMAMLANDI!');
  }

  /**
   * Specific model test
   */
  static async testSpecificModel(modelName: string, customReward?: number): Promise<void> {
    console.log(`🔍 ${modelName} DETAYLI TEST...\n`);
    
    try {
      const result = await calculateFeesByModelName(modelName, customReward);
      
      if (result.success && result.fees) {
        console.log('✅ Model bulundu ve hesaplandı:');
        console.log(formatFeeBreakdown(result.fees));
        
        // Detailed breakdown
        const fees = result.fees;
        console.log('\n📊 Detaylı Analiz:');
        console.log(`   💰 Onarım ücreti: ${fees.originalRepairPrice} TL (Apple resmi fiyat)`);
        console.log(`   🎁 iFoundAnApple ödülü: ${fees.rewardAmount} TL`);
        console.log(`   📦 Kargo ücreti: ${fees.cargoFee} TL`);
        console.log(`   🏢 Hizmet bedeli (%15): ${fees.serviceFee} TL`);
        console.log(`   💳 Gateway komisyonu (~%2.9): ${fees.gatewayFee} TL`);
        console.log(`   💵 Kullanıcı ödemesi: ${fees.totalAmount} TL`);
        console.log(`   💚 Bulan kişiye net: ${fees.netPayout} TL`);
        
        // Percentage breakdown
        console.log('\n📈 Yüzde Dağılımı:');
        const total = fees.totalAmount;
        console.log(`   Ödül: %${((fees.rewardAmount / total) * 100).toFixed(1)}`);
        console.log(`   Kargo: %${((fees.cargoFee / total) * 100).toFixed(1)}`);
        console.log(`   Hizmet: %${((fees.serviceFee / total) * 100).toFixed(1)}`);
        console.log(`   Gateway: %${((fees.gatewayFee / total) * 100).toFixed(1)}`);
        
      } else {
        console.error('❌ Model bulunamadı veya hesaplanamadı:', result.error);
      }
    } catch (error) {
      console.error('❌ Test hatası:', error);
    }
  }
}

// Global window'a ekle (browser console'da kullanım için)
// Sessizce ekle - kullanıcı ihtiyaç duyarsa TestRunner komutlarını kullanabilir
if (typeof window !== 'undefined') {
  (window as any).TestRunner = TestRunner;
}

export default TestRunner;
