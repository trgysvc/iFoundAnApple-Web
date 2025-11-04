/**
 * API: Refund Transaction
 * Admin tarafından iade işlemi (RETURNED durumu için)
 */

import { createClient } from '@supabase/supabase-js';
import { getSecureConfig } from '../utils/security.ts';
import { refundEscrowFunds } from '../utils/escrowManager.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RefundTransactionRequest {
  deviceId: string;
  paymentId: string;
  refundReason: string;
  refundAmount?: number; // Partial refund amount (optional, defaults to full refund)
  adminUserId: string; // Admin user ID
}

interface RefundTransactionResponse {
  success: boolean;
  errorMessage?: string;
}

export async function refundTransactionAPI(request: RefundTransactionRequest): Promise<RefundTransactionResponse> {
  try {
    const config = getSecureConfig();
    const supabaseClient = createClient(config.supabaseUrl, config.supabaseServiceKey || config.supabaseAnonKey);

    const { deviceId, paymentId, refundReason, refundAmount, adminUserId } = request;

    console.log('[REFUND_TRANSACTION] İade talebi alındı:', {
      deviceId,
      paymentId,
      adminUserId,
      refundReason,
      refundAmount
    });

    // 1. Verify admin user
    const { data: adminUser, error: adminError } = await supabaseClient
      .from('users')
      .select('role')
      .eq('id', adminUserId)
      .single();

    if (adminError || !adminUser || adminUser.role !== 'admin') {
      throw new Error('Sadece admin kullanıcılar iade işlemi yapabilir');
    }

    // 2. Get device info
    const { data: deviceData, error: deviceError } = await supabaseClient
      .from('devices')
      .select('status, userId')
      .eq('id', deviceId)
      .single();

    if (deviceError || !deviceData) {
      throw new Error(`Device not found: ${deviceError?.message}`);
    }

    // 3. Check if refund is allowed (only for RETURNED or FAILED_DELIVERY status)
    if (!['returned', 'failed_delivery', 'disputed'].includes(deviceData.status)) {
      throw new Error(`İade işlemi bu durum için yapılamaz. Mevcut durum: ${deviceData.status}`);
    }

    // 4. Get payment and escrow info
    const { data: paymentData, error: paymentError } = await supabaseClient
      .from('payments')
      .select('*, escrow_accounts(*)')
      .eq('id', paymentId)
      .single();

    if (paymentError || !paymentData) {
      throw new Error(`Payment not found: ${paymentError?.message}`);
    }

    const escrowAccount = paymentData.escrow_accounts?.[0];
    if (!escrowAccount) {
      throw new Error('Escrow hesabı bulunamadı');
    }

    // 5. Calculate refund amount (full refund if not specified, otherwise partial)
    const finalRefundAmount = refundAmount || paymentData.total_amount;

    // 6. TODO: Refund payment via payment gateway (iyzico/stripe)
    // Bu kısım ödeme gateway entegrasyonu yapıldığında tamamlanacak
    console.log('[REFUND_TRANSACTION] Ödeme iadesi yapılacak (entegrasyon bekleniyor):', {
      paymentId: paymentData.id,
      provider: paymentData.payment_provider,
      amount: finalRefundAmount,
      originalAmount: paymentData.total_amount
    });

    // 7. Update escrow account
    const escrowUpdateResult = await refundEscrowFunds(escrowAccount.id, refundReason);
    if (!escrowUpdateResult.success) {
      console.error('[REFUND_TRANSACTION] Escrow iade hatası:', escrowUpdateResult.error);
    }

    // 8. Update device status
    const { error: deviceUpdateError } = await supabaseClient
      .from('devices')
      .update({
        status: 'cancelled', // After refund, transaction is cancelled
        updated_at: new Date().toISOString(),
      })
      .eq('id', deviceId);

    if (deviceUpdateError) {
      console.error('[REFUND_TRANSACTION] Device status update error:', deviceUpdateError);
    }

    // 9. Update payment status
    const { error: paymentUpdateError } = await supabaseClient
      .from('payments')
      .update({
        status: 'refunded',
        refunded_at: new Date().toISOString(),
        refund_reason: refundReason,
        refunded_by: adminUserId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', paymentId);

    if (paymentUpdateError) {
      console.error('[REFUND_TRANSACTION] Payment status update error:', paymentUpdateError);
    }

    // 10. Create audit log
    try {
      await supabaseClient.from('audit_logs').insert({
        event_type: 'transaction_refunded',
        event_category: 'transaction',
        event_action: 'refund',
        event_severity: 'info',
        user_id: adminUserId,
        resource_type: 'device',
        resource_id: deviceId,
        event_description: `Transaction refunded by admin: ${refundReason}`,
        event_data: {
          payment_id: paymentId,
          device_id: deviceId,
          refund_amount: finalRefundAmount,
          reason: refundReason,
        },
      });
    } catch (auditError) {
      console.error('[REFUND_TRANSACTION] Audit log error:', auditError);
    }

    // 11. Send notifications
    try {
      // Notify device owner
      await supabaseClient.from('notifications').insert({
        user_id: deviceData.userId,
        message_key: 'transaction_refunded_owner',
        link: `/device/${deviceId}`,
        is_read: false,
        created_at: new Date().toISOString(),
      });

      // Notify finder
      const { data: matchedDevice } = await supabaseClient
        .from('devices')
        .select('userId')
        .eq('serialNumber', deviceData.serialNumber)
        .eq('model', deviceData.model)
        .neq('id', deviceId)
        .maybeSingle();

      if (matchedDevice) {
        await supabaseClient.from('notifications').insert({
          user_id: matchedDevice.userId,
          message_key: 'transaction_refunded_finder',
          link: `/device/${deviceId}`,
          is_read: false,
          created_at: new Date().toISOString(),
        });
      }
    } catch (notificationError) {
      console.error('[REFUND_TRANSACTION] Notification error:', notificationError);
    }

    console.log('[REFUND_TRANSACTION] İade işlemi tamamlandı:', {
      deviceId,
      paymentId,
      refundAmount: finalRefundAmount,
    });

    return {
      success: true,
    };

  } catch (error) {
    console.error('[REFUND_TRANSACTION] Error:', error);
    return {
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// For direct function calls (not HTTP)
export async function refundTransactionLocal(request: RefundTransactionRequest): Promise<RefundTransactionResponse> {
  return await refundTransactionAPI(request);
}

