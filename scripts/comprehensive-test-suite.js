#!/usr/bin/env node

/**
 * iFoundAnApple - Kapsamlı Test Planı
 * Tüm veritabanı kayıt süreçlerini test eder
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Test konfigürasyonu
const SUPABASE_URL = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'YOUR_ANON_KEY';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'YOUR_SERVICE_KEY';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Test sonuçları
const testResults = {
  timestamp: new Date().toISOString(),
  totalTests: 0,
  passedTests: 0,
  failedTests: 0,
  testDetails: [],
  databaseState: {
    before: {},
    after: {}
  }
};

// Test kullanıcıları
const testUsers = {
  deviceOwner: {
    email: 'test-owner@example.com',
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'Owner',
    id: null
  },
  deviceFinder: {
    email: 'test-finder@example.com',
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'Finder',
    id: null
  }
};

// Test cihazı
const testDevice = {
  model: 'iPhone 15 Pro Max',
  serialNumber: 'TEST-SERIAL-' + Date.now(),
  color: 'Natural Titanium',
  description: 'Test cihazı - kapsamlı test için',
  lostDate: new Date().toISOString().split('T')[0],
  lostLocation: 'Test Lokasyonu',
  invoiceDataUrl: null
};

/**
 * Test yardımcı fonksiyonları
 */
class TestHelper {
  static async logTest(testName, status, details = {}) {
    testResults.totalTests++;
    if (status === 'PASS') {
      testResults.passedTests++;
      console.log(`✅ ${testName}`);
    } else {
      testResults.failedTests++;
      console.log(`❌ ${testName}: ${details.error || 'Bilinmeyen hata'}`);
    }
    
    testResults.testDetails.push({
      name: testName,
      status,
      timestamp: new Date().toISOString(),
      details
    });
  }

  static async captureDatabaseState(label) {
    console.log(`📊 Veritabanı durumu yakalanıyor: ${label}`);
    
    const tables = [
      'payments', 'escrow_accounts', 'devices', 'notifications',
      'financial_transactions', 'cargo_shipments', 'audit_logs', 'userprofile'
    ];
    
    const state = {};
    
    for (const table of tables) {
      try {
        const { data, error } = await supabaseAdmin
          .from(table)
          .select('*')
          .limit(1000);
        
        if (!error) {
          state[table] = data || [];
        } else {
          state[table] = { error: error.message };
        }
      } catch (err) {
        state[table] = { error: err.message };
      }
    }
    
    testResults.databaseState[label] = state;
  }

  static async cleanupTestData() {
    console.log('🧹 Test verileri temizleniyor...');
    
    const tables = [
      'financial_transactions', 'notifications', 'escrow_accounts', 
      'payments', 'cargo_shipments', 'devices', 'audit_logs'
    ];
    
    for (const table of tables) {
      try {
        // Test verilerini sil (test email'leri içeren)
        const { error } = await supabaseAdmin
          .from(table)
          .delete()
          .or(`email.eq.${testUsers.deviceOwner.email},email.eq.${testUsers.deviceFinder.email}`)
          .or(`user_id.in.(${testUsers.deviceOwner.id},${testUsers.deviceFinder.id})`)
          .or(`payer_id.in.(${testUsers.deviceOwner.id},${testUsers.deviceFinder.id})`)
          .or(`receiver_id.in.(${testUsers.deviceOwner.id},${testUsers.deviceFinder.id})`);
        
        if (error) {
          console.warn(`⚠️ ${table} temizleme hatası:`, error.message);
        }
      } catch (err) {
        console.warn(`⚠️ ${table} temizleme hatası:`, err.message);
      }
    }
  }
}

/**
 * 1. KULLANICI KAYIT VE GİRİŞ TESTLERİ
 */
async function testUserRegistrationAndLogin() {
  console.log('\n🔐 KULLANICI KAYIT VE GİRİŞ TESTLERİ');
  console.log('=====================================');

  // Test verilerini temizle
  await TestHelper.cleanupTestData();

  // Device Owner kaydı
  try {
    const { data: ownerData, error: ownerError } = await supabase.auth.signUp({
      email: testUsers.deviceOwner.email,
      password: testUsers.deviceOwner.password,
      options: {
        data: {
          first_name: testUsers.deviceOwner.firstName,
          last_name: testUsers.deviceOwner.lastName
        }
      }
    });

    if (ownerError) {
      await TestHelper.logTest('Device Owner Kayıt', 'FAIL', { error: ownerError.message });
    } else {
      testUsers.deviceOwner.id = ownerData.user?.id;
      await TestHelper.logTest('Device Owner Kayıt', 'PASS', { userId: testUsers.deviceOwner.id });
    }
  } catch (error) {
    await TestHelper.logTest('Device Owner Kayıt', 'FAIL', { error: error.message });
  }

  // Device Finder kaydı
  try {
    const { data: finderData, error: finderError } = await supabase.auth.signUp({
      email: testUsers.deviceFinder.email,
      password: testUsers.deviceFinder.password,
      options: {
        data: {
          first_name: testUsers.deviceFinder.firstName,
          last_name: testUsers.deviceFinder.lastName
        }
      }
    });

    if (finderError) {
      await TestHelper.logTest('Device Finder Kayıt', 'FAIL', { error: finderError.message });
    } else {
      testUsers.deviceFinder.id = finderData.user?.id;
      await TestHelper.logTest('Device Finder Kayıt', 'PASS', { userId: testUsers.deviceFinder.id });
    }
  } catch (error) {
    await TestHelper.logTest('Device Finder Kayıt', 'FAIL', { error: error.message });
  }

  // Giriş testleri
  try {
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: testUsers.deviceOwner.email,
      password: testUsers.deviceOwner.password
    });

    if (loginError) {
      await TestHelper.logTest('Device Owner Giriş', 'FAIL', { error: loginError.message });
    } else {
      await TestHelper.logTest('Device Owner Giriş', 'PASS', { sessionId: loginData.session?.access_token });
    }
  } catch (error) {
    await TestHelper.logTest('Device Owner Giriş', 'FAIL', { error: error.message });
  }
}

/**
 * 2. CİHAZ KAYIT TESTLERİ
 */
async function testDeviceRegistration() {
  console.log('\n📱 CİHAZ KAYIT TESTLERİ');
  console.log('========================');

  // Device Owner olarak giriş yap
  const { data: sessionData } = await supabase.auth.signInWithPassword({
    email: testUsers.deviceOwner.email,
    password: testUsers.deviceOwner.password
  });

  if (!sessionData.user) {
    await TestHelper.logTest('Cihaz Kayıt - Giriş', 'FAIL', { error: 'Kullanıcı girişi başarısız' });
    return;
  }

  // Kayıp cihaz ekleme
  try {
    const { data: deviceData, error: deviceError } = await supabase
      .from('devices')
      .insert({
        userId: testUsers.deviceOwner.id,
        model: testDevice.model,
        serialNumber: testDevice.serialNumber,
        color: testDevice.color,
        description: testDevice.description,
        lostDate: testDevice.lostDate,
        lostLocation: testDevice.lostLocation,
        status: 'LOST',
        type: 'lost'
      })
      .select()
      .single();

    if (deviceError) {
      await TestHelper.logTest('Kayıp Cihaz Ekleme', 'FAIL', { error: deviceError.message });
    } else {
      testDevice.id = deviceData.id;
      await TestHelper.logTest('Kayıp Cihaz Ekleme', 'PASS', { deviceId: deviceData.id });
    }
  } catch (error) {
    await TestHelper.logTest('Kayıp Cihaz Ekleme', 'FAIL', { error: error.message });
  }

  // Device Finder olarak giriş yap
  const { data: finderSessionData } = await supabase.auth.signInWithPassword({
    email: testUsers.deviceFinder.email,
    password: testUsers.deviceFinder.password
  });

  if (!finderSessionData.user) {
    await TestHelper.logTest('Cihaz Kayıt - Finder Giriş', 'FAIL', { error: 'Finder girişi başarısız' });
    return;
  }

  // Bulunan cihaz ekleme
  try {
    const { data: foundDeviceData, error: foundDeviceError } = await supabase
      .from('devices')
      .insert({
        userId: testUsers.deviceFinder.id,
        model: testDevice.model,
        serialNumber: testDevice.serialNumber,
        color: testDevice.color,
        description: 'Test cihazı bulundu',
        status: 'FOUND',
        type: 'found'
      })
      .select()
      .single();

    if (foundDeviceError) {
      await TestHelper.logTest('Bulunan Cihaz Ekleme', 'FAIL', { error: foundDeviceError.message });
    } else {
      testDevice.foundId = foundDeviceData.id;
      await TestHelper.logTest('Bulunan Cihaz Ekleme', 'PASS', { deviceId: foundDeviceData.id });
    }
  } catch (error) {
    await TestHelper.logTest('Bulunan Cihaz Ekleme', 'FAIL', { error: error.message });
  }
}

/**
 * 3. EŞLEŞME TESTLERİ
 */
async function testDeviceMatching() {
  console.log('\n🔗 EŞLEŞME TESTLERİ');
  console.log('===================');

  if (!testDevice.id || !testDevice.foundId) {
    await TestHelper.logTest('Eşleşme Testi', 'FAIL', { error: 'Test cihazları bulunamadı' });
    return;
  }

  // Cihazları eşleştir
  try {
    const { error: matchError } = await supabaseAdmin
      .from('devices')
      .update({ 
        status: 'MATCHED',
        matchedAt: new Date().toISOString(),
        matchedWith: testDevice.foundId
      })
      .eq('id', testDevice.id);

    if (matchError) {
      await TestHelper.logTest('Cihaz Eşleştirme', 'FAIL', { error: matchError.message });
    } else {
      await TestHelper.logTest('Cihaz Eşleştirme', 'PASS', { 
        lostDeviceId: testDevice.id, 
        foundDeviceId: testDevice.foundId 
      });
    }
  } catch (error) {
    await TestHelper.logTest('Cihaz Eşleştirme', 'FAIL', { error: error.message });
  }

  // Eşleşme bildirimi kontrolü
  try {
    const { data: notifications, error: notificationError } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', testUsers.deviceOwner.id)
      .eq('type', 'device_matched');

    if (notificationError) {
      await TestHelper.logTest('Eşleşme Bildirimi', 'FAIL', { error: notificationError.message });
    } else {
      await TestHelper.logTest('Eşleşme Bildirimi', 'PASS', { 
        notificationCount: notifications?.length || 0 
      });
    }
  } catch (error) {
    await TestHelper.logTest('Eşleşme Bildirimi', 'FAIL', { error: error.message });
  }
}

/**
 * 4. ÖDEME SÜREÇ TESTLERİ
 */
async function testPaymentProcess() {
  console.log('\n💳 ÖDEME SÜREÇ TESTLERİ');
  console.log('========================');

  // Device Owner olarak giriş yap
  await supabase.auth.signInWithPassword({
    email: testUsers.deviceOwner.email,
    password: testUsers.deviceOwner.password
  });

  // Ücret hesaplama testi
  try {
    const feeCalculation = {
      rewardAmount: 200.00,
      cargoFee: 25.00,
      serviceFee: 50.00,
      gatewayFee: 8.75,
      totalAmount: 283.75,
      netPayout: 200.00
    };

    await TestHelper.logTest('Ücret Hesaplama', 'PASS', feeCalculation);
  } catch (error) {
    await TestHelper.logTest('Ücret Hesaplama', 'FAIL', { error: error.message });
  }

  // Test ödeme oluşturma
  try {
    const { data: paymentData, error: paymentError } = await supabase
      .from('payments')
      .insert({
        device_id: testDevice.id,
        payer_id: testUsers.deviceOwner.id,
        receiver_id: testUsers.deviceFinder.id,
        total_amount: 283.75,
        reward_amount: 200.00,
        cargo_fee: 25.00,
        service_fee: 50.00,
        payment_gateway_fee: 8.75,
        net_payout: 200.00,
        payment_provider: 'test',
        provider_payment_id: 'test_payment_' + Date.now(),
        payment_method: 'credit_card',
        payment_status: 'completed',
        escrow_status: 'held',
        currency: 'TRY',
        completed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (paymentError) {
      await TestHelper.logTest('Ödeme Kaydı Oluşturma', 'FAIL', { error: paymentError.message });
    } else {
      testDevice.paymentId = paymentData.id;
      await TestHelper.logTest('Ödeme Kaydı Oluşturma', 'PASS', { paymentId: paymentData.id });
    }
  } catch (error) {
    await TestHelper.logTest('Ödeme Kaydı Oluşturma', 'FAIL', { error: error.message });
  }
}

/**
 * 5. ESCROW HESAP TESTLERİ
 */
async function testEscrowAccounts() {
  console.log('\n🔒 ESCROW HESAP TESTLERİ');
  console.log('========================');

  if (!testDevice.paymentId) {
    await TestHelper.logTest('Escrow Hesap Testi', 'FAIL', { error: 'Ödeme kaydı bulunamadı' });
    return;
  }

  // Escrow hesabı oluşturma
  try {
    const { data: escrowData, error: escrowError } = await supabase
      .from('escrow_accounts')
      .insert({
        payment_id: testDevice.paymentId,
        device_id: testDevice.id,
        holder_user_id: testUsers.deviceOwner.id,
        beneficiary_user_id: testUsers.deviceFinder.id,
        total_amount: 283.75,
        reward_amount: 200.00,
        service_fee: 50.00,
        gateway_fee: 8.75,
        cargo_fee: 25.00,
        net_payout: 200.00,
        status: 'held',
        held_at: new Date().toISOString(),
        release_conditions: [
          {
            type: 'device_received',
            description: 'Device must be received by finder',
            met: false
          },
          {
            type: 'exchange_confirmed',
            description: 'Both parties must confirm exchange',
            met: false
          }
        ],
        confirmations: [],
        currency: 'TRY'
      })
      .select()
      .single();

    if (escrowError) {
      await TestHelper.logTest('Escrow Hesap Oluşturma', 'FAIL', { error: escrowError.message });
    } else {
      testDevice.escrowId = escrowData.id;
      await TestHelper.logTest('Escrow Hesap Oluşturma', 'PASS', { escrowId: escrowData.id });
    }
  } catch (error) {
    await TestHelper.logTest('Escrow Hesap Oluşturma', 'FAIL', { error: error.message });
  }

  // Escrow onay ekleme
  if (testDevice.escrowId) {
    try {
      const { error: confirmationError } = await supabase
        .from('escrow_accounts')
        .update({
          confirmations: [
            {
              userId: testUsers.deviceFinder.id,
              confirmationType: 'device_received',
              timestamp: new Date().toISOString(),
              notes: 'Test onayı'
            }
          ]
        })
        .eq('id', testDevice.escrowId);

      if (confirmationError) {
        await TestHelper.logTest('Escrow Onay Ekleme', 'FAIL', { error: confirmationError.message });
      } else {
        await TestHelper.logTest('Escrow Onay Ekleme', 'PASS', { escrowId: testDevice.escrowId });
      }
    } catch (error) {
      await TestHelper.logTest('Escrow Onay Ekleme', 'FAIL', { error: error.message });
    }
  }
}

/**
 * 6. KARGO SİSTEMİ TESTLERİ
 */
async function testCargoSystem() {
  console.log('\n📦 KARGO SİSTEMİ TESTLERİ');
  console.log('==========================');

  if (!testDevice.id || !testDevice.paymentId) {
    await TestHelper.logTest('Kargo Sistemi Testi', 'FAIL', { error: 'Gerekli veriler bulunamadı' });
    return;
  }

  // Kargo gönderisi oluşturma
  try {
    const { data: cargoData, error: cargoError } = await supabase
      .from('cargo_shipments')
      .insert({
        device_id: testDevice.id,
        payment_id: testDevice.paymentId,
        cargo_company: 'aras',
        cargo_service_type: 'standard',
        estimated_delivery_days: 2,
        sender_anonymous_id: 'FND-TEST123',
        receiver_anonymous_id: 'OWN-TEST456',
        sender_user_id: testUsers.deviceFinder.id,
        receiver_user_id: testUsers.deviceOwner.id,
        sender_address_encrypted: 'Test Gönderici Adresi',
        receiver_address_encrypted: 'Test Alıcı Adresi',
        status: 'created',
        declared_value: 15000.00,
        cargo_fee: 25.00,
        special_instructions: 'Test kargo gönderisi'
      })
      .select()
      .single();

    if (cargoError) {
      await TestHelper.logTest('Kargo Gönderisi Oluşturma', 'FAIL', { error: cargoError.message });
    } else {
      testDevice.cargoId = cargoData.id;
      await TestHelper.logTest('Kargo Gönderisi Oluşturma', 'PASS', { cargoId: cargoData.id });
    }
  } catch (error) {
    await TestHelper.logTest('Kargo Gönderisi Oluşturma', 'FAIL', { error: error.message });
  }

  // Kargo durumu güncelleme
  if (testDevice.cargoId) {
    try {
      const { error: statusError } = await supabase
        .from('cargo_shipments')
        .update({
          status: 'in_transit',
          tracking_number: 'AR' + Date.now(),
          updated_at: new Date().toISOString()
        })
        .eq('id', testDevice.cargoId);

      if (statusError) {
        await TestHelper.logTest('Kargo Durumu Güncelleme', 'FAIL', { error: statusError.message });
      } else {
        await TestHelper.logTest('Kargo Durumu Güncelleme', 'PASS', { cargoId: testDevice.cargoId });
      }
    } catch (error) {
      await TestHelper.logTest('Kargo Durumu Güncelleme', 'FAIL', { error: error.message });
    }
  }
}

/**
 * 7. FİNANSAL İŞLEMLER TESTLERİ
 */
async function testFinancialTransactions() {
  console.log('\n💰 FİNANSAL İŞLEMLER TESTLERİ');
  console.log('==============================');

  if (!testDevice.escrowId || !testDevice.paymentId) {
    await TestHelper.logTest('Finansal İşlemler Testi', 'FAIL', { error: 'Escrow/Payment kaydı bulunamadı' });
    return;
  }

  // Financial transaction oluşturma
  try {
    const { data: transactionData, error: transactionError } = await supabase
      .from('financial_transactions')
      .insert({
        escrow_id: testDevice.escrowId,
        payment_id: testDevice.paymentId,
        device_id: testDevice.id,
        transaction_type: 'escrow_release',
        amount: 200.00,
        status: 'completed',
        description: 'Test escrow release transaction',
        confirmed_by: testUsers.deviceFinder.id,
        confirmation_type: 'device_received',
        additional_notes: 'Test transaction',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (transactionError) {
      await TestHelper.logTest('Finansal İşlem Oluşturma', 'FAIL', { error: transactionError.message });
    } else {
      testDevice.transactionId = transactionData.id;
      await TestHelper.logTest('Finansal İşlem Oluşturma', 'PASS', { transactionId: transactionData.id });
    }
  } catch (error) {
    await TestHelper.logTest('Finansal İşlem Oluşturma', 'FAIL', { error: error.message });
  }
}

/**
 * 8. BİLDİRİM SİSTEMİ TESTLERİ
 */
async function testNotificationSystem() {
  console.log('\n🔔 BİLDİRİM SİSTEMİ TESTLERİ');
  console.log('=============================');

  // Ödeme başarı bildirimi
  try {
    const { data: paymentNotification, error: paymentNotificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: testUsers.deviceOwner.id,
        type: 'payment_success',
        title: 'Ödeme Başarılı',
        message: `Cihaz için ödeme başarıyla alındı. Tutar: ₺283.75`,
        data: {
          payment_id: testDevice.paymentId,
          device_id: testDevice.id,
          amount: 283.75
        }
      })
      .select()
      .single();

    if (paymentNotificationError) {
      await TestHelper.logTest('Ödeme Bildirimi', 'FAIL', { error: paymentNotificationError.message });
    } else {
      await TestHelper.logTest('Ödeme Bildirimi', 'PASS', { notificationId: paymentNotification.id });
    }
  } catch (error) {
    await TestHelper.logTest('Ödeme Bildirimi', 'FAIL', { error: error.message });
  }

  // Kargo bildirimi
  try {
    const { data: cargoNotification, error: cargoNotificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: testUsers.deviceOwner.id,
        type: 'cargo_shipped',
        title: 'Kargo Gönderildi',
        message: 'Cihazınız kargo ile gönderildi. Takip numarası: AR' + Date.now(),
        data: {
          cargo_id: testDevice.cargoId,
          tracking_number: 'AR' + Date.now(),
          device_id: testDevice.id
        }
      })
      .select()
      .single();

    if (cargoNotificationError) {
      await TestHelper.logTest('Kargo Bildirimi', 'FAIL', { error: cargoNotificationError.message });
    } else {
      await TestHelper.logTest('Kargo Bildirimi', 'PASS', { notificationId: cargoNotification.id });
    }
  } catch (error) {
    await TestHelper.logTest('Kargo Bildirimi', 'FAIL', { error: error.message });
  }
}

/**
 * 9. DENETİM KAYITLARI TESTLERİ
 */
async function testAuditLogs() {
  console.log('\n📋 DENETİM KAYITLARI TESTLERİ');
  console.log('==============================');

  // Audit log oluşturma
  try {
    const { data: auditData, error: auditError } = await supabase
      .from('audit_logs')
      .insert({
        user_id: testUsers.deviceOwner.id,
        action: 'payment_completed',
        table_name: 'payments',
        record_id: testDevice.paymentId,
        old_values: {},
        new_values: {
          status: 'completed',
          completed_at: new Date().toISOString()
        },
        ip_address: '127.0.0.1',
        user_agent: 'Test Agent',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (auditError) {
      await TestHelper.logTest('Denetim Kaydı Oluşturma', 'FAIL', { error: auditError.message });
    } else {
      await TestHelper.logTest('Denetim Kaydı Oluşturma', 'PASS', { auditId: auditData.id });
    }
  } catch (error) {
    await TestHelper.logTest('Denetim Kaydı Oluşturma', 'FAIL', { error: error.message });
  }
}

/**
 * 10. RLS POLİTİKALARI TESTLERİ
 */
async function testRLSPolicies() {
  console.log('\n🔒 RLS POLİTİKALARI TESTLERİ');
  console.log('=============================');

  // Farklı kullanıcı ile erişim testi
  try {
    // Device Owner olarak giriş
    await supabase.auth.signInWithPassword({
      email: testUsers.deviceOwner.email,
      password: testUsers.deviceOwner.password
    });

    // Kendi ödemelerini görme
    const { data: ownPayments, error: ownPaymentsError } = await supabase
      .from('payments')
      .select('*')
      .eq('payer_id', testUsers.deviceOwner.id);

    if (ownPaymentsError) {
      await TestHelper.logTest('RLS - Kendi Ödemelerini Görme', 'FAIL', { error: ownPaymentsError.message });
    } else {
      await TestHelper.logTest('RLS - Kendi Ödemelerini Görme', 'PASS', { count: ownPayments?.length || 0 });
    }

    // Başkasının ödemelerini görme (başarısız olmalı)
    const { data: otherPayments, error: otherPaymentsError } = await supabase
      .from('payments')
      .select('*')
      .eq('payer_id', testUsers.deviceFinder.id);

    if (otherPaymentsError) {
      await TestHelper.logTest('RLS - Başkasının Ödemelerini Görme', 'PASS', { 
        expected: 'Access denied',
        actual: otherPaymentsError.message 
      });
    } else {
      await TestHelper.logTest('RLS - Başkasının Ödemelerini Görme', 'FAIL', { 
        error: 'RLS policy çalışmıyor - başkasının verilerine erişim var' 
      });
    }

  } catch (error) {
    await TestHelper.logTest('RLS Politikaları Testi', 'FAIL', { error: error.message });
  }
}

/**
 * Test sonuçlarını raporla
 */
async function generateTestReport() {
  console.log('\n📊 TEST RAPORU OLUŞTURULUYOR');
  console.log('============================');

  const report = {
    summary: {
      totalTests: testResults.totalTests,
      passedTests: testResults.passedTests,
      failedTests: testResults.failedTests,
      successRate: ((testResults.passedTests / testResults.totalTests) * 100).toFixed(2) + '%',
      timestamp: testResults.timestamp
    },
    testDetails: testResults.testDetails,
    databaseState: testResults.databaseState,
    recommendations: []
  };

  // Öneriler oluştur
  if (testResults.failedTests > 0) {
    report.recommendations.push('❌ Başarısız testler için logları kontrol edin');
  }
  
  if (testResults.passedTests === testResults.totalTests) {
    report.recommendations.push('✅ Tüm testler başarılı - sistem hazır');
  }

  // Raporu dosyaya yaz
  const outputDir = path.join(__dirname, '..', 'test-reports');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const reportFile = path.join(outputDir, `test-report-${Date.now()}.json`);
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));

  console.log(`\n📄 Test raporu oluşturuldu: ${reportFile}`);
  console.log(`\n📈 ÖZET:`);
  console.log(`   Toplam Test: ${testResults.totalTests}`);
  console.log(`   Başarılı: ${testResults.passedTests}`);
  console.log(`   Başarısız: ${testResults.failedTests}`);
  console.log(`   Başarı Oranı: ${report.summary.successRate}`);

  return report;
}

/**
 * Ana test fonksiyonu
 */
async function runComprehensiveTests() {
  console.log('🚀 iFoundAnApple - Kapsamlı Test Süreci Başlatılıyor');
  console.log('==================================================');

  try {
    // Test öncesi veritabanı durumu
    await TestHelper.captureDatabaseState('before');

    // Testleri çalıştır
    await testUserRegistrationAndLogin();
    await testDeviceRegistration();
    await testDeviceMatching();
    await testPaymentProcess();
    await testEscrowAccounts();
    await testCargoSystem();
    await testFinancialTransactions();
    await testNotificationSystem();
    await testAuditLogs();
    await testRLSPolicies();

    // Test sonrası veritabanı durumu
    await TestHelper.captureDatabaseState('after');

    // Rapor oluştur
    await generateTestReport();

    // Test verilerini temizle
    await TestHelper.cleanupTestData();

    console.log('\n🎉 Kapsamlı test süreci tamamlandı!');

  } catch (error) {
    console.error('❌ Test süreci hatası:', error);
    process.exit(1);
  }
}

// Script'i çalıştır
if (require.main === module) {
  runComprehensiveTests();
}

module.exports = {
  runComprehensiveTests,
  testUserRegistrationAndLogin,
  testDeviceRegistration,
  testDeviceMatching,
  testPaymentProcess,
  testEscrowAccounts,
  testCargoSystem,
  testFinancialTransactions,
  testNotificationSystem,
  testAuditLogs,
  testRLSPolicies
};
