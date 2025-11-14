/**
 * Backend API Test Script (Node.js)
 * 
 * Kullanım:
 *   node test-backend-api.js
 * 
 * Veya environment variable ile:
 *   BACKEND_URL=http://localhost:3000/v1 node test-backend-api.js
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// ES Module için __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env dosyasını manuel olarak yükle (dotenv olmadan)
try {
  const envFile = readFileSync(join(__dirname, '.env'), 'utf-8');
  envFile.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#') && trimmedLine.includes('=')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
      if (key && value) {
        process.env[key.trim()] = value;
      }
    }
  });
} catch (error) {
  // .env dosyası yoksa devam et, environment variable'lar kullanılacak
  console.log('⚠️  .env dosyası bulunamadı, environment variable\'lar kullanılacak');
}

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Test results
const results = [];
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

async function runTest(testName, testFn) {
  totalTests++;
  const startTime = Date.now();
  
  try {
    log(`\n📋 Test: ${testName}`, 'cyan');
    const data = await testFn();
    const duration = Date.now() - startTime;

    if (data?.skipped) {
      log(`   ⏭️  Atlandı: ${data.message}`, 'yellow');
      results.push({ testName, success: true, message: data.message, duration });
    } else {
      log(`   ✅ Başarılı (${duration}ms)`, 'green');
      if (data && typeof data === 'object') {
        const preview = JSON.stringify(data, null, 2).substring(0, 200);
        console.log(`   📦 Sonuç: ${preview}${preview.length >= 200 ? '...' : ''}`);
      }
      results.push({ testName, success: true, message: 'Test başarılı', data, duration });
      passedTests++;
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    log(`   ❌ Başarısız (${duration}ms)`, 'red');
    log(`   🔴 Hata: ${error.message || error}`, 'red');
    
    results.push({
      testName,
      success: false,
      message: error.message || 'Bilinmeyen hata',
      error: error.message,
      duration,
    });
    failedTests++;
  }
}

async function testBackendAPI() {
  const startTime = Date.now();
  
  log('🧪 Backend API Test Suite Başlatılıyor...\n', 'blue');
  log('='.repeat(60), 'blue');

  // Get configuration
  const backendUrl = process.env.VITE_BACKEND_API_URL || process.env.BACKEND_URL || 'http://localhost:3000/v1';
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  // Test 1: Environment Configuration
  await runTest('Environment Configuration', async () => {
    const config = {
      backendUrl,
      supabaseUrl: supabaseUrl || '❌ Tanımlı değil',
      supabaseKey: supabaseKey ? '✅ Tanımlı' : '❌ Tanımlı değil',
    };

    if (!backendUrl) {
      throw new Error('VITE_BACKEND_API_URL veya BACKEND_URL tanımlı değil');
    }

    log(`   Backend URL: ${backendUrl}`, 'cyan');
    log(`   Supabase URL: ${config.supabaseUrl}`, 'cyan');
    log(`   Supabase Key: ${config.supabaseKey}`, 'cyan');

    return config;
  });

  // Test 2: Health Check (Public endpoint)
  await runTest('Health Check (Public)', async () => {
    const response = await fetch(`${backendUrl}/health`);
    
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  });

  // Test 3: Network Connectivity
  await runTest('Network Connectivity', async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
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
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Backend API\'ye ulaşılamıyor (timeout). Backend çalışıyor mu?');
      }
      throw new Error(`Network hatası: ${error.message}`);
    }
  });

  // Test 4: CORS Check
  await runTest('CORS Configuration', async () => {
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
    } catch (error) {
      return {
        corsEnabled: false,
        error: error.message,
        note: 'CORS kontrolü yapılamadı (backend çalışmıyor olabilir)',
      };
    }
  });

  // Test 5: Supabase Session (if credentials provided)
  if (supabaseUrl && supabaseKey) {
    await runTest('Supabase Client Initialization', async () => {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Test connection
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        throw new Error(`Supabase connection failed: ${error.message}`);
      }

      return {
        connected: true,
        hasSession: !!data.session,
        message: data.session 
          ? `Session mevcut: ${data.session.user.email}` 
          : 'Session yok (giriş yapılmamış)',
      };
    });

    // Test 6: Authenticated Endpoint (if session exists)
    await runTest('Session Endpoint (Auth Required)', async () => {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return {
          skipped: true,
          message: 'Session yok, test atlandı. Giriş yapın veya test token kullanın.',
        };
      }

      const token = session.access_token;
      const response = await fetch(`${backendUrl}/session`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Session endpoint failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    });
  } else {
    await runTest('Supabase Session Check', async () => {
      return {
        skipped: true,
        message: 'Supabase credentials tanımlı değil, test atlandı',
      };
    });
  }

  // Summary
  const duration = Date.now() - startTime;
  
  log('\n' + '='.repeat(60), 'blue');
  log('📊 TEST ÖZETİ', 'blue');
  log('='.repeat(60), 'blue');
  log(`Toplam Test: ${totalTests}`, 'cyan');
  log(`✅ Başarılı: ${passedTests}`, 'green');
  log(`❌ Başarısız: ${failedTests}`, failedTests > 0 ? 'red' : 'green');
  log(`⏱️  Süre: ${duration}ms`, 'cyan');
  log('='.repeat(60), 'blue');

  if (failedTests > 0) {
    log('\n❌ BAŞARISIZ TESTLER:', 'red');
    results
      .filter(r => !r.success)
      .forEach(r => {
        log(`\n   • ${r.testName}`, 'red');
        log(`     Hata: ${r.message}`, 'red');
      });
  }

  // Öneriler
  log('\n💡 ÖNERİLER:', 'yellow');
  
  if (results.some(r => r.testName === 'Network Connectivity' && !r.success)) {
    log('   • Backend API çalışmıyor olabilir. Backend\'i başlatın:', 'yellow');
    log('     npm run server veya node server.cjs', 'yellow');
  }

  if (!supabaseUrl || !supabaseKey) {
    log('   • .env dosyasını kontrol edin:', 'yellow');
    log('     VITE_SUPABASE_URL=...', 'yellow');
    log('     VITE_SUPABASE_ANON_KEY=...', 'yellow');
  }

  log('\n');

  return {
    totalTests,
    passedTests,
    failedTests,
    duration,
    results,
  };
}

// Script çalıştır
testBackendAPI()
  .then((summary) => {
    process.exit(summary.failedTests > 0 ? 1 : 0);
  })
  .catch((error) => {
    log(`\n❌ Test suite hatası: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  });

