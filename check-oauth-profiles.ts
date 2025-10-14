/**
 * Google OAuth Kullanıcı Profil Kontrol Script
 * 
 * Bu script:
 * 1. Tüm auth.users'ları listeler
 * 2. OAuth ile giriş yapmış kullanıcıları tespit eder (provider: google/apple)
 * 3. Bu kullanıcıların userprofile tablosunda kaydı var mı kontrol eder
 * 4. Eksik profilleri raporlar
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service role key gerekli - admin erişimi için

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: VITE_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY environment variable\'ları gerekli!');
  console.log('\n.env dosyasında şunlar olmalı:');
  console.log('VITE_SUPABASE_URL=your_supabase_url');
  console.log('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
  process.exit(1);
}

// Service role key ile Supabase client oluştur (RLS bypass için)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  app_metadata: {
    provider?: string;
    providers?: string[];
  };
  user_metadata: {
    full_name?: string;
    given_name?: string;
    family_name?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    [key: string]: any;
  };
}

interface UserProfile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  tc_kimlik_no: string | null;
  address: string | null;
  iban: string | null;
  created_at: string;
  updated_at: string;
}

async function checkOAuthProfiles() {
  console.log('🔍 Google OAuth Kullanıcı Profil Kontrol Script Başlatılıyor...\n');
  console.log('=' .repeat(80));

  try {
    // 1. Tüm auth.users'ları listele
    console.log('\n📋 Step 1: Tüm kullanıcılar getiriliyor...');
    
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Auth kullanıcıları alınamadı:', authError);
      return;
    }

    console.log(`✅ Toplam ${authUsers.users.length} kullanıcı bulundu`);

    // 2. OAuth kullanıcılarını filtrele
    console.log('\n📋 Step 2: OAuth kullanıcıları filtreleniyor...');
    
    const oauthUsers = authUsers.users.filter(user => {
      const providers = user.app_metadata?.providers || [];
      const provider = user.app_metadata?.provider;
      
      return providers.includes('google') || 
             providers.includes('apple') || 
             provider === 'google' || 
             provider === 'apple';
    });

    console.log(`✅ ${oauthUsers.length} OAuth kullanıcısı bulundu (Google/Apple)`);

    // 3. Her OAuth kullanıcısı için profil kontrolü
    console.log('\n📋 Step 3: OAuth kullanıcılarının profilleri kontrol ediliyor...');
    console.log('=' .repeat(80));

    const missingProfiles: AuthUser[] = [];
    const existingProfiles: { user: AuthUser; profile: UserProfile }[] = [];

    for (const user of oauthUsers) {
      const { data: profile, error: profileError } = await supabase
        .from('userprofile')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error(`❌ Profil kontrolü hatası (user: ${user.email}):`, profileError);
        continue;
      }

      const providers = user.app_metadata?.providers || [user.app_metadata?.provider];
      const providerName = providers.includes('google') ? 'Google' : 
                          providers.includes('apple') ? 'Apple' : 
                          'Unknown';

      if (!profile) {
        console.log(`\n❌ PROFİL YOK!`);
        console.log(`   Provider: ${providerName}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   User ID: ${user.id}`);
        console.log(`   Kayıt Tarihi: ${new Date(user.created_at).toLocaleString('tr-TR')}`);
        console.log(`   Metadata:`, {
          full_name: user.user_metadata.full_name,
          given_name: user.user_metadata.given_name,
          family_name: user.user_metadata.family_name,
          first_name: user.user_metadata.first_name,
          last_name: user.user_metadata.last_name,
        });
        missingProfiles.push(user as AuthUser);
      } else {
        console.log(`\n✅ Profil Mevcut`);
        console.log(`   Provider: ${providerName}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Ad: ${profile.first_name || '(boş)'}`);
        console.log(`   Soyad: ${profile.last_name || '(boş)'}`);
        console.log(`   Profil Oluşturma: ${new Date(profile.created_at).toLocaleString('tr-TR')}`);
        existingProfiles.push({ user: user as AuthUser, profile });
      }
    }

    // 4. Özet Rapor
    console.log('\n' + '=' .repeat(80));
    console.log('\n📊 ÖZET RAPOR');
    console.log('=' .repeat(80));
    console.log(`\n📈 İstatistikler:`);
    console.log(`   - Toplam Kullanıcı: ${authUsers.users.length}`);
    console.log(`   - OAuth Kullanıcı: ${oauthUsers.length}`);
    console.log(`   - Profili Olan: ${existingProfiles.length} ✅`);
    console.log(`   - Profili Olmayan: ${missingProfiles.length} ❌`);

    if (missingProfiles.length > 0) {
      console.log('\n⚠️  DİKKAT: Profili olmayan OAuth kullanıcıları bulundu!');
      console.log('\n📝 Eksik Profiller:');
      missingProfiles.forEach((user, index) => {
        const providers = user.app_metadata?.providers || [user.app_metadata?.provider];
        const providerName = providers.includes('google') ? 'Google' : 
                            providers.includes('apple') ? 'Apple' : 
                            'Unknown';
        console.log(`\n   ${index + 1}. ${user.email}`);
        console.log(`      Provider: ${providerName}`);
        console.log(`      User ID: ${user.id}`);
        console.log(`      Metadata: ${JSON.stringify({
          full_name: user.user_metadata.full_name,
          given_name: user.user_metadata.given_name,
          family_name: user.user_metadata.family_name,
        })}`);
      });

      console.log('\n\n💡 ÖNERİ: Eksik profilleri oluşturmak ister misiniz?');
      console.log('   Oluşturmak için scripti --fix parametresi ile çalıştırın:');
      console.log('   npx tsx check-oauth-profiles.ts --fix');
    } else {
      console.log('\n✅ Tüm OAuth kullanıcılarının profilleri mevcut! 🎉');
    }

    // 5. --fix parametresi varsa, eksik profilleri oluştur
    if (process.argv.includes('--fix') && missingProfiles.length > 0) {
      console.log('\n' + '=' .repeat(80));
      console.log('\n🔧 EKSİK PROFİLLER OLUŞTURULUYOR...');
      console.log('=' .repeat(80));

      for (const user of missingProfiles) {
        await createMissingProfile(user);
      }

      console.log('\n✅ Tüm eksik profiller oluşturuldu!');
    }

    console.log('\n' + '=' .repeat(80));
    console.log('✨ Script tamamlandı!\n');

  } catch (error) {
    console.error('\n❌ Script çalıştırılırken hata oluştu:', error);
    process.exit(1);
  }
}

async function createMissingProfile(user: AuthUser) {
  console.log(`\n   📝 Profil oluşturuluyor: ${user.email}`);

  // Parse user name from metadata
  const firstName = user.user_metadata.first_name || 
                   user.user_metadata.given_name || 
                   (user.user_metadata.full_name ? user.user_metadata.full_name.split(' ')[0] : null) ||
                   (user.email ? user.email.split('@')[0] : null);

  const lastName = user.user_metadata.last_name || 
                  user.user_metadata.family_name || 
                  (user.user_metadata.full_name && user.user_metadata.full_name.split(' ').length > 1 
                    ? user.user_metadata.full_name.split(' ').slice(1).join(' ') 
                    : '');

  const profileData = {
    user_id: user.id,
    first_name: firstName,
    last_name: lastName,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  console.log(`      Ad: ${firstName}`);
  console.log(`      Soyad: ${lastName}`);

  const { data, error } = await supabase
    .from('userprofile')
    .insert([profileData])
    .select()
    .single();

  if (error) {
    console.error(`   ❌ Profil oluşturulamadı:`, error);
  } else {
    console.log(`   ✅ Profil başarıyla oluşturuldu!`);
  }
}

// Script'i çalıştır
checkOAuthProfiles().catch(console.error);

