/**
 * Simple Express Server for Iyzico API
 * Bu server Iyzico SDK'sını kullanarak ödeme işlemlerini yapar
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
const Iyzipay = require('iyzipay');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Form data için

// Production'da static files serve et
if (isProduction) {
  app.use(express.static(path.join(__dirname, 'dist')));
}

// İyzico Configuration
const iyzipay = new Iyzipay({
  apiKey: process.env.VITE_IYZICO_API_KEY || 'sandbox-xQUfDCNqUzFl3TeQ6TwUxk7QovYnthKL',
  secretKey: process.env.VITE_IYZICO_SECRET_KEY || 'sandbox-njCZVrXuJuKXu12mUdjUs4g9sQHy9PqR',
  uri: process.env.VITE_IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com'
});

// Supabase Configuration (Environment'dan alınmalı)
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://zokkxkyhabihxjskdcfg.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpva2t4a3loYWJpaHhqc2tkY2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MTQyMDMsImV4cCI6MjA3MTE5MDIwM30.Dvnl7lUwezVDGY9I6IIgfoJXWtaw1Un_idOxTlI0xwQ';

// Backend anon key kullanır (payer_id device'dan alınacak, RLS uyumlu)
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('[SERVER] İyzico API Server başlatılıyor...');
console.log('[SERVER] API Key:', (process.env.VITE_IYZICO_API_KEY || 'sandbox-xQUfDCNqUzFl3TeQ6TwUxk7QovYnthKL').substring(0, 20) + '...');

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'İyzico API Server çalışıyor' });
});

// İyzico Checkout Form Initialize (Yeni yaklaşım - güvenli)
app.post('/api/iyzico-checkout', async (req, res) => {
  try {
    console.log('[SERVER] Checkout form initialization request received');
    const paymentData = req.body;

    console.log('[SERVER] Payment data:', {
      deviceId: paymentData.deviceId,
      amount: paymentData.amount,
      buyer: paymentData.payerInfo.email
    });

    // Callback URL'i belirle (Backend endpoint'ine yönlendir)
    const baseUrl = isProduction 
      ? (process.env.VITE_APP_URL || 'https://ifoundanapple.com')
      : 'http://localhost:3001';
    const callbackUrl = `${baseUrl}/api/iyzico-callback`;

    // Tutar hesaplama (İyzico için)
    const totalAmount = parseFloat(paymentData.amount.toFixed(2));
    const priceStr = totalAmount.toFixed(2);
    
    // İyzico Checkout Form request oluştur
    const checkoutRequest = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: `${paymentData.deviceId}_${Date.now()}`,
      price: priceStr,
      paidPrice: priceStr,
      currency: Iyzipay.CURRENCY.TRY,
      basketId: paymentData.deviceId,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: callbackUrl,
      enabledInstallments: [1, 2, 3, 6, 9],
      buyer: {
        id: paymentData.payerId.substring(0, 11),
        name: paymentData.payerInfo.name.split(' ')[0] || 'Test',
        surname: paymentData.payerInfo.name.split(' ')[1] || 'User',
        gsmNumber: paymentData.payerInfo.phone || '+905350000000',
        email: paymentData.payerInfo.email,
        identityNumber: '11111111111', // Test için
        lastLoginDate: new Date().toISOString().split('T')[0] + ' 12:00:00',
        registrationDate: new Date().toISOString().split('T')[0] + ' 12:00:00',
        registrationAddress: paymentData.payerInfo.address?.street || 'Address',
        ip: req.ip || '85.34.78.112',
        city: paymentData.payerInfo.address?.city || 'Istanbul',
        country: 'Turkey',
        zipCode: paymentData.payerInfo.address?.postalCode || '34000'
      },
      shippingAddress: {
        contactName: paymentData.payerInfo.name,
        city: paymentData.payerInfo.address?.city || 'Istanbul',
        country: 'Turkey',
        address: paymentData.payerInfo.address?.street || 'Address',
        zipCode: paymentData.payerInfo.address?.postalCode || '34000'
      },
      billingAddress: {
        contactName: paymentData.payerInfo.name,
        city: paymentData.payerInfo.address?.city || 'Istanbul',
        country: 'Turkey',
        address: paymentData.payerInfo.address?.street || 'Address',
        zipCode: paymentData.payerInfo.address?.postalCode || '34000'
      },
      basketItems: (paymentData.basketItems || [{
        id: paymentData.deviceId,
        name: paymentData.deviceInfo?.model || 'Apple Device',
        category1: 'Electronics',
        category2: 'Mobile Phone',
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: priceStr
      }]).map(item => ({
        ...item,
        price: typeof item.price === 'number' ? item.price.toFixed(2) : item.price
      }))
    };

    console.log('[SERVER] Creating checkout form...');
    console.log('[SERVER] Request details:', {
      price: checkoutRequest.price,
      paidPrice: checkoutRequest.paidPrice,
      basketItemPrice: checkoutRequest.basketItems[0].price,
      callbackUrl: checkoutRequest.callbackUrl,
      match: checkoutRequest.price === checkoutRequest.basketItems[0].price
    });

    // İyzico Checkout Form oluştur
    iyzipay.checkoutFormInitialize.create(checkoutRequest, (err, result) => {
      if (err) {
        console.error('[SERVER] İyzico checkout form error:', err);
        return res.status(500).json({
          success: false,
          errorMessage: err.errorMessage || 'Checkout form creation failed',
          error: err
        });
      }

      console.log('[SERVER] Checkout form result:', {
        status: result.status,
        errorMessage: result.errorMessage,
        errorCode: result.errorCode,
        token: result.token?.substring(0, 20)
      });

      if (result.status === 'success') {
        res.json({
          success: true,
          checkoutFormContent: result.checkoutFormContent,
          token: result.token,
          paymentPageUrl: result.paymentPageUrl,
          redirectUrl: result.paymentPageUrl, // Frontend için
          conversationId: checkoutRequest.conversationId
        });
      } else {
        res.json({
          success: false,
          errorMessage: result.errorMessage || 'Checkout form creation failed',
          errorCode: result.errorCode
        });
      }
    });

  } catch (error) {
    console.error('[SERVER] Error:', error);
    res.status(500).json({
      success: false,
      errorMessage: error.message || 'Unknown error',
      error: error
    });
  }
});

// İyzico Callback Handler (GET - İyzico redirect için)
app.get('/api/iyzico-callback', async (req, res) => {
  try {
    console.log('[SERVER] GET Callback received from İyzico');
    console.log('[SERVER] Query params:', req.query);
    const token = req.query.token;

    if (!token) {
      console.error('[SERVER] Token missing in query!');
      const frontendUrl = isProduction 
        ? process.env.VITE_APP_URL || 'https://ifoundanapple.com'
        : 'http://localhost:5173';
      return res.redirect(`${frontendUrl}/payment/callback?error=token_missing`);
    }

    console.log('[SERVER] Verifying payment with token:', token.substring(0, 20) + '...');

    // Token'ı direkt burada doğrula
    iyzipay.checkoutForm.retrieve({ token }, async (err, result) => {
      if (err) {
        console.error('[SERVER] Payment verification error:', err);
        const frontendUrl = isProduction 
          ? process.env.VITE_APP_URL || 'https://ifoundanapple.com'
          : 'http://localhost:5173';
        return res.redirect(`${frontendUrl}/payment/callback?error=verification_failed`);
      }

      console.log('[SERVER] Payment verified:', {
        status: result.status,
        paymentStatus: result.paymentStatus,
        paymentId: result.paymentId
      });

      const frontendUrl = isProduction 
        ? process.env.VITE_APP_URL || 'https://ifoundanapple.com'
        : 'http://localhost:5173';

      // Development test mode
      const isTestSuccess = !isProduction && result.status === 'success';
      const isPaymentSuccess = (result.status === 'success' && result.paymentStatus === 'SUCCESS') || isTestSuccess;

      if (isPaymentSuccess) {
        console.log('[SERVER] ✅ GET Callback - Ödeme başarılı! Database güncelleniyor...');
        
        // ConversationId'den payment'ı bul
        const deviceId = result.basketId;
        
        try {
          // Payment kayıtlarını device_id ile bul (en son kaydı al)
          const { data: paymentRecords, error: findError } = await supabase
            .from('payments')
            .select('*')
            .eq('device_id', deviceId)
            .order('created_at', { ascending: false })
            .limit(1);
          
          console.log('[SERVER] GET - Payment arama sonucu:', { 
            deviceId, 
            found: paymentRecords?.length || 0, 
            error: findError,
            paymentId: paymentRecords?.[0]?.id
          });
          
          // Eğer payment kaydı yoksa, yeni kayıt oluştur
          if (!paymentRecords || paymentRecords.length === 0) {
            console.log('[SERVER] GET - Payment kaydı yok, YENİ KAYIT oluşturuluyor...');
            
            // Önce device'ı al (payer_id için)
            const { data: deviceData, error: deviceError } = await supabase
              .from('devices')
              .select('userId')
              .eq('id', deviceId)
              .single();
            
            if (deviceError || !deviceData) {
              console.error('[SERVER] GET - Device bulunamadı:', deviceError);
              throw new Error('Device not found');
            }
            
            console.log('[SERVER] GET - Device bulundu, payer_id:', deviceData.userId);
            
            // Yeni payment kaydı oluştur
            const newPaymentId = crypto.randomUUID();
            const { data: newPayment, error: insertError } = await supabase
              .from('payments')
              .insert({
                id: newPaymentId,
                device_id: deviceId,
                payer_id: deviceData.userId, // Device sahibi = ödeme yapan
                total_amount: result.paidPrice,
                reward_amount: result.paidPrice * 0.85, // Tahmini
                cargo_fee: 25,
                payment_gateway_fee: result.iyziCommissionRateAmount + result.iyziCommissionFee,
                service_fee: result.paidPrice * 0.15,
                net_payout: result.merchantPayoutAmount || result.paidPrice * 0.85,
                payment_provider: 'iyzico',
                provider_payment_id: result.paymentId,
                status: 'completed',
                payment_status: 'completed',
                currency: 'TRY',
                provider_response: result
              })
              .select()
              .single();
            
            if (insertError) {
              console.error('[SERVER] GET - Payment oluşturma hatası:', insertError);
              throw insertError;
            }
            
            console.log('[SERVER] GET - Yeni payment kaydı oluşturuldu:', newPayment.id);
            paymentRecords = [newPayment];
            
            // Escrow kaydı da oluştur
            const { error: escrowInsertError } = await supabase
              .from('escrow_accounts')
              .insert({
                payment_id: newPaymentId,
                device_id: deviceId,
                holder_user_id: deviceData.userId,
                beneficiary_user_id: deviceData.userId,
                total_amount: newPayment.total_amount,
                reward_amount: newPayment.reward_amount,
                service_fee: newPayment.service_fee,
                gateway_fee: newPayment.payment_gateway_fee,
                cargo_fee: newPayment.cargo_fee,
                net_payout: newPayment.net_payout,
                status: 'pending',
                currency: 'TRY'
              });
            
            if (escrowInsertError) {
              console.error('[SERVER] GET - Escrow oluşturma hatası:', escrowInsertError);
            } else {
              console.log('[SERVER] GET - Escrow kaydı oluşturuldu');
            }
          }
          
          if (paymentRecords && paymentRecords.length > 0) {
            const paymentRecord = paymentRecords[0];
            console.log('[SERVER] GET - Payment kaydı bulundu:', paymentRecord.id);
            
            // Escrow kaydı var mı kontrol et
            const { data: existingEscrow, error: escrowCheckError } = await supabase
              .from('escrow_accounts')
              .select('id')
              .eq('payment_id', paymentRecord.id)
              .maybeSingle();
            
            // Eğer escrow yoksa oluştur
            if (!existingEscrow && !escrowCheckError) {
              console.log('[SERVER] GET - Escrow kaydı yok, oluşturuluyor...');
              const { error: escrowCreateError } = await supabase
                .from('escrow_accounts')
                .insert({
                  payment_id: paymentRecord.id,
                  device_id: deviceId,
                  holder_user_id: paymentRecord.payer_id,
                  beneficiary_user_id: paymentRecord.payer_id,
                  total_amount: paymentRecord.total_amount,
                  reward_amount: paymentRecord.reward_amount,
                  service_fee: paymentRecord.service_fee,
                  gateway_fee: paymentRecord.payment_gateway_fee,
                  cargo_fee: paymentRecord.cargo_fee,
                  net_payout: paymentRecord.net_payout,
                  status: 'pending',
                  currency: 'TRY'
                });
              
              if (escrowCreateError) {
                console.error('[SERVER] GET - Escrow oluşturma hatası:', escrowCreateError);
              } else {
                console.log('[SERVER] GET - Escrow kaydı oluşturuldu');
              }
            }

            // Payment'ı güncelle
            await supabase
              .from('payments')
              .update({
                status: 'completed',
                payment_status: 'completed',
                provider_payment_id: result.paymentId,
                updated_at: new Date().toISOString()
              })
              .eq('id', paymentRecord.id);

            // Escrow'u güncelle
            await supabase
              .from('escrow_accounts')
              .update({
                status: 'held',
                held_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .eq('payment_id', paymentRecord.id);

            // Device status'ü güncelle
            await supabase
              .from('devices')
              .update({
                status: 'payment_completed',
                updated_at: new Date().toISOString()
              })
              .eq('id', deviceId);

            // Financial transactions kayıtları ekle
            await supabase
              .from('financial_transactions')
              .insert([
                {
                  payment_id: paymentRecord.id,
                  device_id: deviceId,
                  from_user_id: paymentRecord.payer_id,
                  to_user_id: null,
                  transaction_type: 'payment_received',
                  amount: paymentRecord.total_amount,
                  status: 'completed',
                  external_transaction_id: result.paymentId,
                  description: 'Payment received from device owner',
                  debit_account: 'customer_payments',
                  credit_account: 'escrow_account',
                  completed_at: new Date().toISOString()
                },
                {
                  payment_id: paymentRecord.id,
                  device_id: deviceId,
                  from_user_id: paymentRecord.payer_id,
                  to_user_id: paymentRecord.receiver_id,
                  transaction_type: 'escrow_hold',
                  amount: paymentRecord.total_amount,
                  status: 'completed',
                  description: 'Payment held in escrow pending exchange completion',
                  debit_account: 'escrow_account',
                  credit_account: 'escrow_held',
                  completed_at: new Date().toISOString()
                }
              ]);

            console.log('[SERVER] ✅ GET - Database güncellendi: payment_completed + financial_transactions');
          }
          
          // Callback sayfasına yönlendir - Frontend navigate yapacak
          const finalPaymentId = paymentRecords?.[0]?.id || result.paymentId;
          console.log('[SERVER] GET - Callback sayfasına yönlendiriliyor:', `${frontendUrl}/payment/callback?paymentId=${finalPaymentId}&device_id=${deviceId}`);
          return res.redirect(`${frontendUrl}/payment/callback?paymentId=${finalPaymentId}&device_id=${deviceId}&amount=${result.paidPrice}&status=success`);
        } catch (err) {
          console.error('[SERVER] GET - Database güncelleme hatası:', err);
          // Hata olsa bile success'e yönlendir (ödeme başarılı)
          return res.redirect(`${frontendUrl}/payment/success?payment_id=${result.paymentId}&device_id=${deviceId}&amount=${result.paidPrice}`);
        }
      } else {
        console.log('[SERVER] ❌ GET - Ödeme başarısız');
        // Başarısız - callback sayfasına hata ile yönlendir
        return res.redirect(`${frontendUrl}/payment/callback?error=payment_failed&message=${encodeURIComponent(result.errorMessage || 'Payment failed')}`);
      }
    });
  } catch (error) {
    console.error('[SERVER] GET Callback error:', error);
    const frontendUrl = isProduction 
      ? process.env.VITE_APP_URL || 'https://ifoundanapple.com'
      : 'http://localhost:5173';
    return res.redirect(`${frontendUrl}/payment/callback?error=callback_failed`);
  }
});

// İyzico Callback Handler (POST - İyzico form submit için)
app.post('/api/iyzico-callback', async (req, res) => {
  try {
    console.log('[SERVER] POST Callback received from İyzico');
    console.log('[SERVER] Request body:', req.body);
    console.log('[SERVER] Request query:', req.query);
    
    // Token body veya query'den gelebilir
    const token = req.body?.token || req.query?.token;

    if (!token) {
      console.error('[SERVER] Token missing! Body:', req.body, 'Query:', req.query);
      const frontendUrl = isProduction 
        ? process.env.VITE_APP_URL || 'https://ifoundanapple.com'
        : 'http://localhost:5173';
      return res.redirect(`${frontendUrl}/payment/callback?error=token_missing`);
    }

    console.log('[SERVER] Verifying payment with token:', token.substring(0, 20) + '...');

    // Ödeme sonucunu retrieve et
    iyzipay.checkoutForm.retrieve({ token }, async (err, result) => {
      if (err) {
        console.error('[SERVER] POST Callback retrieve error:', err);
        const frontendUrl = isProduction 
          ? process.env.VITE_APP_URL || 'https://ifoundanapple.com'
          : 'http://localhost:5173';
        return res.redirect(`${frontendUrl}/payment/callback?error=verification_failed`);
      }

      console.log('[SERVER] POST Payment verified:', {
        status: result.status,
        paymentStatus: result.paymentStatus,
        paymentId: result.paymentId
      });
      
      // İyzico'dan gelen FULL response'u logla
      console.log('[SERVER] Full İyzico Response:', JSON.stringify(result, null, 2));

      const frontendUrl = isProduction 
        ? process.env.VITE_APP_URL || 'https://ifoundanapple.com'
        : 'http://localhost:5173';

      // Development test mode - FAILURE'ı SUCCESS olarak işle
      const isTestSuccess = !isProduction && result.status === 'success';
      const isPaymentSuccess = (result.status === 'success' && result.paymentStatus === 'SUCCESS') || isTestSuccess;
      
      if (isPaymentSuccess) {
        console.log('[SERVER] ✅ POST - Ödeme başarılı! Database güncelleniyor...');
        
        // ConversationId'den payment'ı bul
        const deviceId = result.basketId;
        
        // Yeni Supabase client oluştur (cache sorununu önlemek için)
        const freshSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        try {
          // Payment kayıtlarını device_id ile bul (en son kaydı al)
          const { data: paymentRecords, error: findError } = await freshSupabase
            .from('payments')
            .select('*')
            .eq('device_id', deviceId)
            .order('created_at', { ascending: false })
            .limit(1);
          
          console.log('[SERVER] POST - Payment arama sonucu:', { 
            deviceId, 
            found: paymentRecords?.length || 0, 
            error: findError,
            paymentId: paymentRecords?.[0]?.id
          });
          
          // Eğer payment kaydı yoksa, yeni kayıt oluştur
          if (!paymentRecords || paymentRecords.length === 0) {
            console.log('[SERVER] POST - Payment kaydı yok, YENİ KAYIT oluşturuluyor...');
            
            // Önce device'ı al (payer_id için)
            const { data: deviceData, error: deviceError } = await freshSupabase
              .from('devices')
              .select('userId')
              .eq('id', deviceId)
              .single();
            
            if (deviceError || !deviceData) {
              console.error('[SERVER] POST - Device bulunamadı:', deviceError);
              throw new Error('Device not found');
            }
            
            console.log('[SERVER] POST - Device bulundu, payer_id:', deviceData.userId);
            
            // Yeni payment kaydı oluştur
            const newPaymentId = crypto.randomUUID();
            
            const paymentInsertData = {
              id: newPaymentId,
              device_id: deviceId,
              payer_id: deviceData.userId, // Device sahibi = ödeme yapan
              total_amount: result.paidPrice,
              reward_amount: result.paidPrice * 0.85, // Tahmini
              cargo_fee: 25,
              payment_gateway_fee: result.iyziCommissionRateAmount + result.iyziCommissionFee,
              service_fee: result.paidPrice * 0.15,
              net_payout: result.merchantPayoutAmount || result.paidPrice * 0.85,
              payment_provider: 'iyzico',
              provider_payment_id: result.paymentId,
              status: 'completed',
              payment_status: 'completed',
              currency: 'TRY',
              provider_response: result
            };
            
            console.log('[SERVER] POST - Insert data:', {
              id: newPaymentId,
              device_id: deviceId,
              payer_id: deviceData.userId,
              total_amount: result.paidPrice
            });
            
            const { data: newPayment, error: insertError} = await freshSupabase
              .from('payments')
              .insert(paymentInsertData)
              .select()
              .single();
            
            if (insertError) {
              console.error('[SERVER] POST - Payment oluşturma hatası:', insertError);
              console.error('[SERVER] POST - Insert edilmeye çalışılan data:', paymentInsertData);
              throw insertError;
            }
            
            console.log('[SERVER] POST - Yeni payment kaydı oluşturuldu:', newPayment.id);
            paymentRecords = [newPayment];
            
            // Escrow kaydı da oluştur
            const { error: escrowInsertError } = await freshSupabase
              .from('escrow_accounts')
              .insert({
                payment_id: newPaymentId,
                device_id: deviceId,
                holder_user_id: deviceData.userId,
                beneficiary_user_id: deviceData.userId,
                total_amount: newPayment.total_amount,
                reward_amount: newPayment.reward_amount,
                service_fee: newPayment.service_fee,
                gateway_fee: newPayment.payment_gateway_fee,
                cargo_fee: newPayment.cargo_fee,
                net_payout: newPayment.net_payout,
                status: 'pending',
                currency: 'TRY'
              });
            
            if (escrowInsertError) {
              console.error('[SERVER] POST - Escrow oluşturma hatası:', escrowInsertError);
            } else {
              console.log('[SERVER] POST - Escrow kaydı oluşturuldu');
            }
          }
          
          if (paymentRecords && paymentRecords.length > 0) {
            const paymentRecord = paymentRecords[0];
            console.log('[SERVER] POST - Payment kaydı bulundu:', paymentRecord.id);
            
            // Escrow kaydı var mı kontrol et
            const { data: existingEscrow, error: escrowCheckError } = await freshSupabase
              .from('escrow_accounts')
              .select('id')
              .eq('payment_id', paymentRecord.id)
              .maybeSingle();
            
            // Eğer escrow yoksa oluştur
            if (!existingEscrow && !escrowCheckError) {
              console.log('[SERVER] POST - Escrow kaydı yok, oluşturuluyor...');
              const { error: escrowCreateError } = await freshSupabase
                .from('escrow_accounts')
                .insert({
                  payment_id: paymentRecord.id,
                  device_id: deviceId,
                  holder_user_id: paymentRecord.payer_id,
                  beneficiary_user_id: paymentRecord.payer_id,
                  total_amount: paymentRecord.total_amount,
                  reward_amount: paymentRecord.reward_amount,
                  service_fee: paymentRecord.service_fee,
                  gateway_fee: paymentRecord.payment_gateway_fee,
                  cargo_fee: paymentRecord.cargo_fee,
                  net_payout: paymentRecord.net_payout,
                  status: 'pending',
                  currency: 'TRY'
                });
              
              if (escrowCreateError) {
                console.error('[SERVER] POST - Escrow oluşturma hatası:', escrowCreateError);
              } else {
                console.log('[SERVER] POST - Escrow kaydı oluşturuldu');
              }
            }

            // Payment'ı güncelle
            const { data: paymentUpdate, error: paymentUpdateError } = await freshSupabase
              .from('payments')
              .update({
                status: 'completed',
                payment_status: 'completed',
                provider_payment_id: result.paymentId,
                updated_at: new Date().toISOString()
              })
              .eq('id', paymentRecord.id)
              .select();

            if (paymentUpdateError) {
              console.error('[SERVER] POST - Payment update hatası:', paymentUpdateError);
            } else {
              console.log('[SERVER] POST - Payment güncellendi:', paymentUpdate?.length || 0, 'kayıt');
            }

            // Escrow'u güncelle
            const { data: escrowUpdate, error: escrowUpdateError } = await freshSupabase
              .from('escrow_accounts')
              .update({
                status: 'held',
                held_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .eq('payment_id', paymentRecord.id)
              .select();

            if (escrowUpdateError) {
              console.error('[SERVER] POST - Escrow update hatası:', escrowUpdateError);
            } else {
              console.log('[SERVER] POST - Escrow güncellendi:', escrowUpdate?.length || 0, 'kayıt');
            }

            // Device status'ü güncelle
            const { data: deviceUpdate, error: deviceUpdateError } = await freshSupabase
              .from('devices')
              .update({
                status: 'payment_completed',
                updated_at: new Date().toISOString()
              })
              .eq('id', deviceId)
              .select();

            if (deviceUpdateError) {
              console.error('[SERVER] POST - Device update hatası:', deviceUpdateError);
            } else {
              console.log('[SERVER] POST - Device status güncellendi:', deviceUpdate);
            }

            // Financial transactions kayıtları ekle
            const { data: ftData, error: ftError } = await freshSupabase
              .from('financial_transactions')
              .insert([
                {
                  payment_id: paymentRecord.id,
                  device_id: deviceId,
                  from_user_id: paymentRecord.payer_id,
                  to_user_id: null,
                  transaction_type: 'payment_received',
                  amount: paymentRecord.total_amount,
                  status: 'completed',
                  external_transaction_id: result.paymentId,
                  description: 'Payment received from device owner',
                  debit_account: 'customer_payments',
                  credit_account: 'escrow_account',
                  completed_at: new Date().toISOString()
                },
                {
                  payment_id: paymentRecord.id,
                  device_id: deviceId,
                  from_user_id: paymentRecord.payer_id,
                  to_user_id: paymentRecord.receiver_id,
                  transaction_type: 'escrow_hold',
                  amount: paymentRecord.total_amount,
                  status: 'completed',
                  description: 'Payment held in escrow pending exchange completion',
                  debit_account: 'escrow_account',
                  credit_account: 'escrow_held',
                  completed_at: new Date().toISOString()
                }
              ])
              .select();

            if (ftError) {
              console.error('[SERVER] POST - Financial transactions hatası:', ftError);
            } else {
              console.log('[SERVER] POST - Financial transactions eklendi:', ftData?.length || 0, 'kayıt');
            }

            console.log('[SERVER] ✅ POST - Database güncellendi: payment_completed + financial_transactions');
          }
          
          // Callback sayfasına yönlendir - Frontend navigate yapacak
          const finalPaymentId = paymentRecords?.[0]?.id || result.paymentId;
          console.log('[SERVER] POST - Callback sayfasına yönlendiriliyor:', `${frontendUrl}/payment/callback?paymentId=${finalPaymentId}&device_id=${deviceId}`);
          return res.redirect(`${frontendUrl}/payment/callback?paymentId=${finalPaymentId}&device_id=${deviceId}&amount=${result.paidPrice}&status=success`);
        } catch (err) {
          console.error('[SERVER] POST - Database güncelleme hatası:', err);
          // Hata olsa bile success'e yönlendir (ödeme başarılı)
          return res.redirect(`${frontendUrl}/payment/success?payment_id=${result.paymentId}&device_id=${deviceId}&amount=${result.paidPrice}`);
        }
      } else {
        console.log('[SERVER] ❌ Ödeme başarısız, error sayfasına yönlendiriliyor...');
        // Başarısız - callback sayfasına hata ile yönlendir
        return res.redirect(`${frontendUrl}/payment/callback?error=payment_failed&message=${encodeURIComponent(result.errorMessage || 'Payment failed')}`);
      }
    });

  } catch (error) {
    console.error('[SERVER] POST Callback error:', error);
    const frontendUrl = isProduction 
      ? process.env.VITE_APP_URL || 'https://ifoundanapple.com'
      : 'http://localhost:5173';
    return res.redirect(`${frontendUrl}/payment/callback?error=callback_failed`);
  }
});

// Production'da tüm route'ları index.html'e yönlendir (SPA için)
if (isProduction) {
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ İyzico API Server çalışıyor: http://localhost:${PORT}`);
  console.log(`📊 Mode: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💳 Payment endpoint: http://localhost:${PORT}/api/iyzico-payment\n`);
});
