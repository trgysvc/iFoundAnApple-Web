/**
 * Payment Webhook Handler
 * Webhook geldiğinde payment ve escrow kayıtlarını oluşturur
 * 
 * ÖNEMLİ: Bu fonksiyonlar sadece webhook geldiğinde çağrılmalıdır.
 * Ödeme başlatıldığında veritabanına kayıt OLUŞTURULMAZ.
 */

import { createClient } from '@supabase/supabase-js';
import { getSecureConfig } from './security';
import { FeeBreakdown } from './feeCalculation';

export interface PaynetWebhookPayload {
  reference_no: string; // Payment ID
  is_succeed: boolean;
  amount: number;
  netAmount?: number;
  comission?: number;
  authorization_code?: string;
  order_id?: string;
  xact_date: string;
}

export interface PaymentRecordData {
  paymentId: string;
  deviceId: string;
  payerId: string;
  receiverId: string;
  webhookData: PaynetWebhookPayload;
  feeBreakdown: FeeBreakdown;
}

/**
 * Webhook geldiğinde payment ve escrow kayıtlarını oluştur
 * 
 * ÖNEMLİ: Bu fonksiyon sadece webhook geldiğinde çağrılmalıdır.
 * Ödeme başarılı olduğunda (is_succeed: true) kayıtlar oluşturulur.
 */
export async function createPaymentRecordsFromWebhook(
  data: PaymentRecordData
): Promise<{ success: boolean; paymentId?: string; escrowId?: string; error?: string }> {
  try {
    console.log('[WEBHOOK_HANDLER] Payment records oluşturuluyor...', {
      paymentId: data.paymentId,
      deviceId: data.deviceId,
      isSuccess: data.webhookData.is_succeed,
    });

    // Ödeme başarısızsa kayıt oluşturma
    if (!data.webhookData.is_succeed) {
      console.log('[WEBHOOK_HANDLER] Ödeme başarısız, kayıt oluşturulmayacak');
      return {
        success: false,
        error: 'Payment failed',
      };
    }

    // Supabase client oluştur
    const config = getSecureConfig();
    const supabaseClient = createClient(
      config.supabaseUrl,
      config.supabaseServiceKey || config.supabaseAnonKey
    );

    // 1. Payment kaydı oluştur
    const paymentData = {
      id: data.paymentId,
      device_id: data.deviceId,
      payer_id: data.payerId,
      receiver_id: data.receiverId,
      total_amount: data.webhookData.amount,
      reward_amount: data.feeBreakdown.rewardAmount,
      cargo_fee: data.feeBreakdown.cargoFee,
      service_fee: data.feeBreakdown.serviceFee,
      payment_gateway_fee: data.feeBreakdown.gatewayFee,
      net_payout: data.feeBreakdown.netPayout,
      payment_provider: 'paynet',
      payment_status: 'completed', // ✅ Sadece başarılı ödemeler için
      provider_payment_id: data.webhookData.order_id,
      provider_transaction_id: data.webhookData.reference_no,
      authorization_code: data.webhookData.authorization_code,
      currency: 'TRY',
      completed_at: data.webhookData.xact_date,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: paymentRecord, error: paymentError } = await supabaseClient
      .from('payments')
      .insert(paymentData)
      .select()
      .single();

    if (paymentError) {
      console.error('[WEBHOOK_HANDLER] Payment kaydı oluşturma hatası:', paymentError);
      return {
        success: false,
        error: `Payment record creation failed: ${paymentError.message}`,
      };
    }

    console.log('[WEBHOOK_HANDLER] ✅ Payment kaydı oluşturuldu:', paymentRecord.id);

    // 2. Escrow kaydı oluştur
    const escrowId = crypto.randomUUID();
    const escrowData = {
      id: escrowId,
      payment_id: data.paymentId,
      device_id: data.deviceId,
      holder_user_id: data.payerId, // Ödeme yapan
      beneficiary_user_id: data.receiverId, // Bulan kişi
      total_amount: data.feeBreakdown.totalAmount,
      reward_amount: data.feeBreakdown.rewardAmount,
      service_fee: data.feeBreakdown.serviceFee,
      gateway_fee: data.feeBreakdown.gatewayFee,
      cargo_fee: data.feeBreakdown.cargoFee,
      net_payout: data.feeBreakdown.netPayout,
      status: 'held', // ✅ Ödeme başarılı olduğu için 'held'
      escrow_type: 'standard',
      auto_release_days: 30,
      release_conditions: [
        {
          type: 'device_received',
          description: 'Device must be received by finder',
          met: false,
        },
        {
          type: 'exchange_confirmed',
          description: 'Both parties must confirm exchange',
          met: false,
        },
      ],
      confirmations: [],
      held_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: escrowRecord, error: escrowError } = await supabaseClient
      .from('escrow_accounts')
      .insert(escrowData)
      .select()
      .single();

    if (escrowError) {
      console.error('[WEBHOOK_HANDLER] Escrow kaydı oluşturma hatası:', escrowError);
      // Payment kaydı oluşturuldu ama escrow oluşturulamadı
      // Bu durumda payment kaydını silmek yerine hata döndür
      return {
        success: false,
        paymentId: paymentRecord.id,
        error: `Escrow record creation failed: ${escrowError.message}`,
      };
    }

    console.log('[WEBHOOK_HANDLER] ✅ Escrow kaydı oluşturuldu:', escrowRecord.id);

    // 3. Device status güncelle
    const { error: deviceError } = await supabaseClient
      .from('devices')
      .update({
        status: 'payment_completed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', data.deviceId);

    if (deviceError) {
      console.error('[WEBHOOK_HANDLER] Device status güncelleme hatası:', deviceError);
      // Kritik değil, devam et
    } else {
      console.log('[WEBHOOK_HANDLER] ✅ Device status güncellendi');
    }

    // 4. Audit log kaydı oluştur
    const auditLogData = {
      event_type: 'payment_completed',
      event_category: 'payment',
      event_action: 'complete',
      event_severity: 'info',
      user_id: data.payerId,
      resource_type: 'payment',
      resource_id: data.paymentId,
      event_description: 'Payment completed successfully via PAYNET',
      event_data: {
        amount: data.webhookData.amount,
        provider: 'paynet',
        authorization_code: data.webhookData.authorization_code,
      },
      created_at: new Date().toISOString(),
    };

    const { error: auditError } = await supabaseClient
      .from('audit_logs')
      .insert(auditLogData);

    if (auditError) {
      console.error('[WEBHOOK_HANDLER] Audit log kaydı oluşturma hatası:', auditError);
      // Kritik değil, devam et
    } else {
      console.log('[WEBHOOK_HANDLER] ✅ Audit log kaydı oluşturuldu');
    }

    return {
      success: true,
      paymentId: paymentRecord.id,
      escrowId: escrowRecord.id,
    };
  } catch (error) {
    console.error('[WEBHOOK_HANDLER] Beklenmeyen hata:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Payment status'u kontrol et (polling için)
 * Önce Supabase'den kontrol eder, yoksa Backend API'den sorgular
 */
export async function checkPaymentStatus(
  paymentId: string
): Promise<{ status: string; webhookReceived: boolean } | null> {
  try {
    const config = getSecureConfig();
    const supabaseClient = createClient(
      config.supabaseUrl,
      config.supabaseServiceKey || config.supabaseAnonKey
    );

    // Önce Supabase'den kontrol et (webhook geldiyse kayıt oluşmuş olur)
    const { data: payment, error } = await supabaseClient
      .from('payments')
      .select('payment_status')
      .eq('id', paymentId)
      .single();

    if (error || !payment) {
      // Payment kaydı henüz oluşturulmamış (webhook gelmemiş)
      // Backend API'den status sorgula
      try {
        const { getPaymentStatus } = await import('./paynetPayment');
        const backendStatus = await getPaymentStatus(paymentId);

        return {
          status: backendStatus.status,
          webhookReceived: backendStatus.webhookReceived,
        };
      } catch (apiError) {
        console.error('[WEBHOOK_HANDLER] Backend API status sorgulama hatası:', apiError);
        return {
          status: 'pending',
          webhookReceived: false,
        };
      }
    }

    return {
      status: payment.payment_status,
      webhookReceived: true,
    };
  } catch (error) {
    console.error('[WEBHOOK_HANDLER] Payment status kontrol hatası:', error);
    return null;
  }
}

