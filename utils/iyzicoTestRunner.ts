/**
 * İyzico Test Senaryoları
 * Sandbox ortamında ödeme işlemlerini test etmek için senaryolar
 */

import { processIyzicoPayment, checkIyzicoPaymentStatus, refundIyzicoPayment } from './iyzicoConfig';
import { createTestPaymentData, IYZICO_TEST_CONFIG } from './iyzicoTestConfig';

// Test sonuçları interface'i
interface TestResult {
  testName: string;
  success: boolean;
  duration: number;
  error?: string;
  data?: any;
}

// Test runner
export class IyzicoTestRunner {
  private results: TestResult[] = [];

  async runTest(testName: string, testFunction: () => Promise<any>): Promise<TestResult> {
    console.log(`[TEST] Running: ${testName}`);
    const startTime = Date.now();
    
    try {
      const result = await testFunction();
      const duration = Date.now() - startTime;
      
      const testResult: TestResult = {
        testName,
        success: true,
        duration,
        data: result
      };
      
      this.results.push(testResult);
      console.log(`[TEST] ✅ ${testName} - SUCCESS (${duration}ms)`);
      return testResult;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      
      const testResult: TestResult = {
        testName,
        success: false,
        duration,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      
      this.results.push(testResult);
      console.log(`[TEST] ❌ ${testName} - FAILED (${duration}ms): ${testResult.error}`);
      return testResult;
    }
  }

  getResults(): TestResult[] {
    return this.results;
  }

  getSummary(): { total: number; passed: number; failed: number; totalDuration: number } {
    const total = this.results.length;
    const passed = this.results.filter(r => r.success).length;
    const failed = total - passed;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
    
    return { total, passed, failed, totalDuration };
  }
}

// Test senaryoları
export const testScenarios = {
  // 1. Başarılı ödeme testi
  async successfulPayment(): Promise<any> {
    const paymentData = createTestPaymentData(100);
    return await processIyzicoPayment(paymentData);
  },

  // 2. Başarısız ödeme testi
  async failedPayment(): Promise<any> {
    const paymentData = createTestPaymentData(100);
    // Başarısız kart bilgileri ile test
    paymentData.buyerInfo.email = 'invalid@test.com';
    return await processIyzicoPayment(paymentData);
  },

  // 3. Ödeme durumu sorgulama testi
  async paymentStatusCheck(): Promise<any> {
    // Önce bir ödeme oluştur
    const paymentData = createTestPaymentData(50);
    const paymentResult = await processIyzicoPayment(paymentData);
    
    if (!paymentResult.success || !paymentResult.paymentId) {
      throw new Error('Payment creation failed for status check test');
    }
    
    // Ödeme durumunu sorgula
    return await checkIyzicoPaymentStatus(paymentResult.paymentId);
  },

  // 4. İade testi
  async refundTest(): Promise<any> {
    // Önce başarılı bir ödeme oluştur
    const paymentData = createTestPaymentData(75);
    const paymentResult = await processIyzicoPayment(paymentData);
    
    if (!paymentResult.success || !paymentResult.paymentId) {
      throw new Error('Payment creation failed for refund test');
    }
    
    // İade işlemi yap
    return await refundIyzicoPayment(paymentResult.paymentId, 75, 'Test refund');
  },

  // 5. Büyük tutar testi
  async largeAmountTest(): Promise<any> {
    const paymentData = createTestPaymentData(10000); // 10,000 TL
    return await processIyzicoPayment(paymentData);
  },

  // 6. Küçük tutar testi
  async smallAmountTest(): Promise<any> {
    const paymentData = createTestPaymentData(1); // 1 TL
    return await processIyzicoPayment(paymentData);
  },

  // 7. Geçersiz konfigürasyon testi
  async invalidConfigTest(): Promise<any> {
    // Geçersiz API anahtarı ile test
    const originalConfig = process.env.VITE_IYZICO_API_KEY;
    process.env.VITE_IYZICO_API_KEY = 'invalid-key';
    
    try {
      const paymentData = createTestPaymentData(100);
      return await processIyzicoPayment(paymentData);
    } finally {
      // Orijinal konfigürasyonu geri yükle
      if (originalConfig) {
        process.env.VITE_IYZICO_API_KEY = originalConfig;
      }
    }
  }
};

// Tüm testleri çalıştır
export async function runAllTests(): Promise<TestResult[]> {
  const runner = new IyzicoTestRunner();
  
  console.log('[TEST] Starting İyzico integration tests...');
  
  // Test senaryolarını sırayla çalıştır
  await runner.runTest('Successful Payment', testScenarios.successfulPayment);
  await runner.runTest('Payment Status Check', testScenarios.paymentStatusCheck);
  await runner.runTest('Large Amount Payment', testScenarios.largeAmountTest);
  await runner.runTest('Small Amount Payment', testScenarios.smallAmountTest);
  
  // Başarısız testler (beklenen hatalar)
  await runner.runTest('Failed Payment', testScenarios.failedPayment);
  await runner.runTest('Invalid Config', testScenarios.invalidConfigTest);
  
  // İade testi (son olarak çalıştır çünkü ödeme gerektirir)
  await runner.runTest('Refund Test', testScenarios.refundTest);
  
  const summary = runner.getSummary();
  console.log('[TEST] Test Summary:', summary);
  
  return runner.getResults();
}

// Tek test çalıştırma
export async function runSingleTest(testName: keyof typeof testScenarios): Promise<TestResult> {
  const runner = new IyzicoTestRunner();
  return await runner.runTest(testName, testScenarios[testName]);
}

// Test sonuçlarını HTML formatında raporla
export function generateTestReport(results: TestResult[]): string {
  const summary = results.reduce((acc, result) => {
    acc.total++;
    if (result.success) acc.passed++;
    else acc.failed++;
    acc.totalDuration += result.duration;
    return acc;
  }, { total: 0, passed: 0, failed: 0, totalDuration: 0 });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>İyzico Test Report</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .summary { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
            .test-result { margin: 10px 0; padding: 10px; border-radius: 5px; }
            .success { background: #d4edda; border-left: 4px solid #28a745; }
            .failure { background: #f8d7da; border-left: 4px solid #dc3545; }
            .duration { color: #666; font-size: 0.9em; }
        </style>
    </head>
    <body>
        <h1>İyzico Integration Test Report</h1>
        
        <div class="summary">
            <h2>Test Summary</h2>
            <p><strong>Total Tests:</strong> ${summary.total}</p>
            <p><strong>Passed:</strong> ${summary.passed}</p>
            <p><strong>Failed:</strong> ${summary.failed}</p>
            <p><strong>Total Duration:</strong> ${summary.totalDuration}ms</p>
            <p><strong>Success Rate:</strong> ${((summary.passed / summary.total) * 100).toFixed(1)}%</p>
        </div>
        
        <h2>Test Results</h2>
        ${results.map(result => `
            <div class="test-result ${result.success ? 'success' : 'failure'}">
                <h3>${result.testName}</h3>
                <p class="duration">Duration: ${result.duration}ms</p>
                ${result.error ? `<p><strong>Error:</strong> ${result.error}</p>` : ''}
                ${result.data ? `<pre>${JSON.stringify(result.data, null, 2)}</pre>` : ''}
            </div>
        `).join('')}
    </body>
    </html>
  `;
  
  return html;
}
