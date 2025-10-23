/**
 * Dispute Management System - Quick Test Script
 * Bu script ile dispute sistemini hızlıca test edebilirsiniz
 */

import { DisputeManager } from './utils/disputeManager';
import { DisputeStatus, DisputeReason } from './types';

// Test verileri
const TEST_DATA = {
  deviceId: 'test-device-' + Date.now(),
  paymentId: 'test-payment-' + Date.now(),
  cargoShipmentId: 'test-cargo-' + Date.now(),
  userId: 'test-user-' + Date.now(),
  adminUserId: 'admin-user-' + Date.now(),
  disputeId: '' as string
};

class DisputeSystemTester {
  private testResults: Array<{ test: string; status: 'PASS' | 'FAIL'; message: string }> = [];

  async runAllTests() {
    console.log('🧪 Dispute Management System Test Başlatılıyor...\n');

    await this.testDisputeCreation();
    await this.testDisputeStatusUpdate();
    await this.testWorkflowValidation();
    await this.testUserDisputes();
    await this.testAdminDisputes();
    await this.testStatistics();

    this.printResults();
  }

  private async testDisputeCreation() {
    console.log('📝 Test 1: Dispute Oluşturma');
    
    try {
      const result = await DisputeManager.raiseDispute(
        TEST_DATA.deviceId,
        TEST_DATA.paymentId,
        TEST_DATA.cargoShipmentId,
        DisputeReason.DEVICE_DAMAGED,
        'Test dispute notes - cihaz hasarlı teslim edildi',
        [],
        TEST_DATA.userId
      );

      if (result.success && result.disputeId) {
        TEST_DATA.disputeId = result.disputeId;
        this.addResult('Dispute Creation', 'PASS', 'Dispute başarıyla oluşturuldu');
      } else {
        this.addResult('Dispute Creation', 'FAIL', result.error || 'Bilinmeyen hata');
      }
    } catch (error) {
      this.addResult('Dispute Creation', 'FAIL', `Hata: ${error}`);
    }
  }

  private async testDisputeStatusUpdate() {
    console.log('🔄 Test 2: Dispute Status Güncelleme');
    
    if (!TEST_DATA.disputeId) {
      this.addResult('Status Update', 'FAIL', 'Dispute ID bulunamadı');
      return;
    }

    try {
      // PENDING → UNDER_REVIEW
      const result1 = await DisputeManager.updateDisputeStatus(
        TEST_DATA.disputeId,
        DisputeStatus.UNDER_REVIEW,
        'Admin incelemeye aldı',
        undefined,
        TEST_DATA.adminUserId
      );

      if (result1.success) {
        this.addResult('Status Update (PENDING→UNDER_REVIEW)', 'PASS', 'Status başarıyla güncellendi');
        
        // UNDER_REVIEW → RESOLVED
        const result2 = await DisputeManager.updateDisputeStatus(
          TEST_DATA.disputeId,
          DisputeStatus.RESOLVED,
          'Admin çözümü tamamladı',
          'Cihaz değiştirildi ve sorun çözüldü',
          TEST_DATA.adminUserId
        );

        if (result2.success) {
          this.addResult('Status Update (UNDER_REVIEW→RESOLVED)', 'PASS', 'Dispute başarıyla çözüldü');
        } else {
          this.addResult('Status Update (UNDER_REVIEW→RESOLVED)', 'FAIL', result2.error || 'Bilinmeyen hata');
        }
      } else {
        this.addResult('Status Update (PENDING→UNDER_REVIEW)', 'FAIL', result1.error || 'Bilinmeyen hata');
      }
    } catch (error) {
      this.addResult('Status Update', 'FAIL', `Hata: ${error}`);
    }
  }

  private async testWorkflowValidation() {
    console.log('⚡ Test 3: Workflow Validasyonu');
    
    if (!TEST_DATA.disputeId) {
      this.addResult('Workflow Validation', 'FAIL', 'Dispute ID bulunamadı');
      return;
    }

    try {
      // Geçersiz geçiş testi: RESOLVED → PENDING
      const result = await DisputeManager.updateDisputeStatus(
        TEST_DATA.disputeId,
        DisputeStatus.PENDING,
        'Geçersiz geçiş testi',
        undefined,
        TEST_DATA.adminUserId
      );

      if (!result.success && result.error?.includes('Invalid status transition')) {
        this.addResult('Workflow Validation', 'PASS', 'Geçersiz geçişler doğru şekilde engelleniyor');
      } else {
        this.addResult('Workflow Validation', 'FAIL', 'Geçersiz geçiş engellenmedi');
      }
    } catch (error) {
      this.addResult('Workflow Validation', 'FAIL', `Hata: ${error}`);
    }
  }

  private async testUserDisputes() {
    console.log('👤 Test 4: Kullanıcı İtirazları');
    
    try {
      const disputes = await DisputeManager.getUserDisputes(TEST_DATA.userId);
      
      if (Array.isArray(disputes)) {
        this.addResult('User Disputes', 'PASS', `${disputes.length} dispute bulundu`);
      } else {
        this.addResult('User Disputes', 'FAIL', 'Dispute listesi alınamadı');
      }
    } catch (error) {
      this.addResult('User Disputes', 'FAIL', `Hata: ${error}`);
    }
  }

  private async testAdminDisputes() {
    console.log('👨‍💼 Test 5: Admin İtirazları');
    
    try {
      const disputes = await DisputeManager.getAllDisputes();
      
      if (Array.isArray(disputes)) {
        this.addResult('Admin Disputes', 'PASS', `${disputes.length} dispute bulundu`);
      } else {
        this.addResult('Admin Disputes', 'FAIL', 'Dispute listesi alınamadı');
      }
    } catch (error) {
      this.addResult('Admin Disputes', 'FAIL', `Hata: ${error}`);
    }
  }

  private async testStatistics() {
    console.log('📊 Test 6: İstatistikler');
    
    try {
      const stats = await DisputeManager.getDisputeStatistics();
      
      if (stats && typeof stats.total === 'number') {
        this.addResult('Statistics', 'PASS', `Toplam ${stats.total} dispute, ${stats.pending} beklemede`);
      } else {
        this.addResult('Statistics', 'FAIL', 'İstatistikler alınamadı');
      }
    } catch (error) {
      this.addResult('Statistics', 'FAIL', `Hata: ${error}`);
    }
  }

  private addResult(test: string, status: 'PASS' | 'FAIL', message: string) {
    this.testResults.push({ test, status, message });
    console.log(`  ${status === 'PASS' ? '✅' : '❌'} ${test}: ${message}`);
  }

  private printResults() {
    console.log('\n📋 Test Sonuçları:');
    console.log('='.repeat(50));
    
    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const failed = this.testResults.filter(r => r.status === 'FAIL').length;
    
    console.log(`✅ Başarılı: ${passed}`);
    console.log(`❌ Başarısız: ${failed}`);
    console.log(`📊 Toplam: ${this.testResults.length}`);
    
    if (failed > 0) {
      console.log('\n❌ Başarısız Testler:');
      this.testResults
        .filter(r => r.status === 'FAIL')
        .forEach(r => console.log(`  - ${r.test}: ${r.message}`));
    }
    
    console.log('\n🎯 Test Tamamlandı!');
  }
}

// Test çalıştırma
export async function runDisputeSystemTests() {
  const tester = new DisputeSystemTester();
  await tester.runAllTests();
}

// Eğer bu dosya doğrudan çalıştırılırsa testleri başlat
if (require.main === module) {
  runDisputeSystemTests().catch(console.error);
}
