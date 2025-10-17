// Environment Variables Test
// Bu dosya environment variables'ların doğru yapılandırılıp yapılandırılmadığını kontrol eder

import { getSecureConfig } from './utils/security.ts';

console.log('🔧 Environment Variables Test');
console.log('============================');

try {
  const config = getSecureConfig();
  
  console.log('✅ Supabase URL:', config.supabaseUrl ? '✓ Set' : '✗ Missing');
  console.log('✅ Supabase Anon Key:', config.supabaseAnonKey ? '✓ Set' : '✗ Missing');
  console.log('✅ Supabase Service Key:', config.supabaseServiceKey ? '✓ Set' : '✗ Missing');
  console.log('✅ Gemini API Key:', config.geminiApiKey ? '✓ Set' : '✗ Missing');
  console.log('✅ Iyzico Configured:', config.iyzico.isConfigured ? '✓ Yes' : '✗ No');
  console.log('✅ Stripe Configured:', config.stripe.isConfigured ? '✓ Yes' : '✗ No');
  console.log('✅ Development Mode:', config.isDevelopment ? '✓ Yes' : '✗ No');
  
  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    console.log('\n❌ CRITICAL ERROR: Supabase configuration is missing!');
    console.log('Please create a .env file with the following variables:');
    console.log('VITE_SUPABASE_URL=your-supabase-url');
    console.log('VITE_SUPABASE_ANON_KEY=your-supabase-anon-key');
    console.log('VITE_SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key');
  } else {
    console.log('\n✅ Environment configuration looks good!');
  }
  
} catch (error) {
  console.error('❌ Error checking environment variables:', error);
}
