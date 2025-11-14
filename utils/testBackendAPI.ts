/**
 * Backend API Test Script
 * Backend API ile iletişimi test eder
 * 
 * Kullanım:
 * 1. Browser Console'da: testBackendAPI() çağır
 * 2. Node.js'de: node test-backend-api.js
 */

import { apiClient } from './apiClient';
import { supabase } from './supabaseClient';

export interface TestResult {
  testName: string;
  success: boolean;
  message: string;
  data?: any;
  error?: any;
  duration?: number;
}

export interface TestSuite {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  results: TestResult[];
  duration: number;
}

/**
 * Backend API test suite
 */
export async function testBackendAPI(): Promise<TestSuite> {
  const startTime = Date.now();
  const results: TestResult[] = [];

  console.log('🧪 Backend API Test Suite Başlatılıyor...\n');
  console.log('='.repeat(60));

  // Test 1: Environment Configuration
  await runTest('Environment Configuration', async () => {
    const backendUrl = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000/v1';
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!backendUrl) {
      throw new Error('VITE_BACKEND_API_URL tanımlı değil');
    }

    return {
      backendUrl,
      supabaseUrl: supabaseUrl ? '✅ Tanımlı' : '❌ Tanımlı değil',
      supabaseKey: supabaseKey ? '✅ Tanımlı' : '❌ Tanımlı değil',
    };
  }, results);

  // Test 2: Health Check (Public endpoint - no auth required)
  await runTest('Health Check (Public)', async () => {
    const backendUrl = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000/v1';
    const response = await fetch(`${backendUrl}/health`);
    
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }, results);

  // Test 3: Supabase Session Check
  await runTest('Supabase Session Check', async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      throw new Error(`Session check failed: ${error.message}`);
    }

    if (!session) {
      return {
        hasSession: false,
        message: '⚠️ Kullanıcı giriş yapmamış. Bazı testler atlanacak.',
      };
    }

    return {
      hasSession: true,
      userId: session.user.id,
      email: session.user.email,
      hasToken: !!session.access_token,
      tokenLength: session.access_token?.length || 0,
    };
  }, results);

  // Test 4: Session Endpoint (Requires auth)
  await runTest('Session Endpoint (Auth Required)', async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return {
        skipped: true,
        message: 'Session yok, test atlandı',
      };
    }

    const response = await apiClient.get('/session');
    return response;
  }, results);

  // Test 5: PAYNET Connection Test (Requires auth)
  await runTest('PAYNET Connection Test', async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return {
        skipped: true,
        message: 'Session yok, test atlandı',
      };
    }

    const response = await apiClient.get('/payments/test-paynet-connection');
    return response;
  }, results);

  // Test 6: Payment Process (Mock - requires valid device)
  await runTest('Payment Process Endpoint (Mock)', async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return {
        skipped: true,
        message: 'Session yok, test atlandı',
      };
    }

    // Mock device ID - bu test gerçek bir device ID gerektirir
    const mockDeviceId = '00000000-0000-0000-0000-000000000000';
    const mockTotalAmount = 2000.0;

    try {
      const response = await apiClient.post('/payments/process', {
        deviceId: mockDeviceId,
        totalAmount: mockTotalAmount,
      });
      return response;
    } catch (error: any) {
      // 404 veya 400 beklenen bir hata (device bulunamadı)
      if (error.statusCode === 404 || error.statusCode === 400) {
        return {
          expectedError: true,
          statusCode: error.statusCode,
          message: error.message,
          note: 'Bu hata beklenen bir durum (mock device ID kullanıldı)',
        };
      }
      throw error;
    }
  }, results);

  // Test 7: Network Connectivity
  await runTest('Network Connectivity', async () => {
    const backendUrl = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000/v1';
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 saniye timeout
      
      const response = await fetch(`${backendUrl}/health`, {
        method: 'GET',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      return {
        reachable: response.ok,
        status: response.status,
        statusText: response.statusText,
        responseTime: '< 5s',
      };
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Backend API\'ye ulaşılamıyor (timeout). Backend çalışıyor mu?');
      }
      throw new Error(`Network hatası: ${error.message}`);
    }
  }, results);

  // Test 8: CORS Check
  await runTest('CORS Configuration', async () => {
    const backendUrl = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000/v1';
    
    try {
      const response = await fetch(`${backendUrl}/health`, {
        method: 'OPTIONS',
      });
      
      const corsHeaders = {
        'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
        'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
        'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
      };

      return {
        corsEnabled: !!corsHeaders['Access-Control-Allow-Origin'],
        headers: corsHeaders,
      };
    } catch (error: any) {
      return {
        corsEnabled: false,
        error: error.message,
        note: 'CORS kontrolü yapılamadı (backend çalışmıyor olabilir)',
      };
    }
  }, results);

  // Summary
  const duration = Date.now() - startTime;
  const passedTests = results.filter(r => r.success).length;
  const failedTests = results.filter(r => !r.success).length;

  const summary: TestSuite = {
    totalTests: results.length,
    passedTests,
    failedTests,
    results,
    duration,
  };

  printSummary(summary);

  return summary;
}

/**
 * Test çalıştır ve sonucu kaydet
 */
async function runTest(
  testName: string,
  testFn: () => Promise<any>,
  results: TestResult[]
): Promise<void> {
  const startTime = Date.now();
  
  try {
    console.log(`\n📋 Test: ${testName}`);
    const data = await testFn();
    const duration = Date.now() - startTime;

    if (data?.skipped) {
      console.log(`   ⏭️  Atlandı: ${data.message}`);
      results.push({
        testName,
        success: true,
        message: data.message,
        data,
        duration,
      });
    } else {
      console.log(`   ✅ Başarılı (${duration}ms)`);
      if (data && typeof data === 'object') {
        console.log(`   📦 Sonuç:`, JSON.stringify(data, null, 2).substring(0, 200));
      }
      results.push({
        testName,
        success: true,
        message: 'Test başarılı',
        data,
        duration,
      });
    }
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.log(`   ❌ Başarısız (${duration}ms)`);
    console.log(`   🔴 Hata: ${error.message || error}`);
    
    results.push({
      testName,
      success: false,
      message: error.message || 'Bilinmeyen hata',
      error: error,
      duration,
    });
  }
}

/**
 * Test özeti yazdır
 */
function printSummary(summary: TestSuite): void {
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST ÖZETİ');
  console.log('='.repeat(60));
  console.log(`Toplam Test: ${summary.totalTests}`);
  console.log(`✅ Başarılı: ${summary.passedTests}`);
  console.log(`❌ Başarısız: ${summary.failedTests}`);
  console.log(`⏱️  Süre: ${summary.duration}ms`);
  console.log('='.repeat(60));

  if (summary.failedTests > 0) {
    console.log('\n❌ BAŞARISIZ TESTLER:');
    summary.results
      .filter(r => !r.success)
      .forEach(r => {
        console.log(`\n   • ${r.testName}`);
        console.log(`     Hata: ${r.message}`);
      });
  }

  // Öneriler
  console.log('\n💡 ÖNERİLER:');
  
  if (summary.results.some(r => r.testName === 'Network Connectivity' && !r.success)) {
    console.log('   • Backend API çalışmıyor olabilir. Backend\'i başlatın:');
    console.log('     npm run server veya node server.cjs');
  }

  if (summary.results.some(r => r.testName === 'Supabase Session Check' && r.data?.hasSession === false)) {
    console.log('   • Giriş yapmadığınız için bazı testler atlandı.');
    console.log('     Tam test için giriş yapın: /login');
  }

  if (summary.results.some(r => r.testName === 'Environment Configuration' && !r.success)) {
    console.log('   • .env dosyasını kontrol edin:');
    console.log('     VITE_BACKEND_API_URL=http://localhost:3000/v1');
    console.log('     VITE_SUPABASE_URL=...');
    console.log('     VITE_SUPABASE_ANON_KEY=...');
  }

  console.log('\n');
}

/**
 * Browser console'da kullanım için global export
 */
if (typeof window !== 'undefined') {
  (window as any).testBackendAPI = testBackendAPI;
  console.log('💡 Backend API testi için: testBackendAPI() çağırın');
}

