/**
 * API: Cancel Transaction
 * Kullanıcı kaynaklı iptal işlemi (kargo öncesi)
 */

import { createClient } from '@supabase/supabase-js';
import { getSecureConfig } from '../utils/security.ts';
import { refundEscrowFunds } from '../utils/escrowManager.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CancelTransactionRequest {
  deviceId: string;
  paymentId: string;
  reason: string;
  userId: string; // Cancelling user ID
}

interface CancelTransactionResponse {
  success: boolean;
  errorMessage?: string;
}

export async function cancelTransactionAPI(request: CancelTransactionRequest): Promise<CancelTransactionResponse> {
  try {
    const config = getSecureConfig();
    const supabaseClient = createClient(config.supabaseUrl, config.supabaseServiceKey || config.supabaseAnonKey);

    const { deviceId, paymentId, reason, userId } = request;

    console.log('[CANCEL_TRANSACTION] İptal talebi alındı:', {
      deviceId,
      paymentId,
      userId,
      reason
    });

    // 1. Get device and payment info
    const { data: deviceData, error: deviceError } = await supabaseClient
      .from('devices')
      .select('status, userId')
      .eq('id', deviceId)
      .single();

    if (deviceError || !deviceData) {
      throw new Error(`Device not found: ${deviceError?.message}`);
    }

    // 2. Check if cancellation is allowed (only before cargo is shipped)
    if (!['payment_pending', 'payment_completed'].includes(deviceData.status)) {
      throw new Error(`İptal işlemi bu aşamada yapılamaz. Mevcut durum: ${deviceData.status}`);
    }

    // 3. Check if user has permission (only device owner can cancel)
    if (deviceData.userId !== userId) {
      throw new Error('Sadece cihaz sahibi iptal işlemi yapabilir');
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

    // 5. TODO: Refund payment via payment gateway (iyzico/stripe)
    // Bu kısım ödeme gateway entegrasyonu yapıldığında tamamlanacak
    console.log('[CANCEL_TRANSACTION] Ödeme iadesi yapılacak (entegrasyon bekleniyor):', {
      paymentId: paymentData.id,
      provider: paymentData.payment_provider,
      amount: paymentData.total_amount
    });

    // 6. Update escrow account
    const escrowUpdateResult = await refundEscrowFunds(escrowAccount.id, reason);
    if (!escrowUpdateResult.success) {
      console.error('[CANCEL_TRANSACTION] Escrow iade hatası:', escrowUpdateResult.error);
      // Continue even if escrow update fails
    }

    // 7. Update device status
    const { error: deviceUpdateError } = await supabaseClient
      .from('devices')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', deviceId);

    if (deviceUpdateError) {
      console.error('[CANCEL_TRANSACTION] Device status update error:', deviceUpdateError);
    }

    // 8. Update payment status
    const { error: paymentUpdateError } = await supabaseClient
      .from('payments')
      .update({
        status: 'refunded',
        refunded_at: new Date().toISOString(),
        refund_reason: reason,
        updated_at: new Date().toISOString(),
      })
      .eq('id', paymentId);

    if (paymentUpdateError) {
      console.error('[CANCEL_TRANSACTION] Payment status update error:', paymentUpdateError);
    }

    // 9. Create audit log
    try {
      await supabaseClient.from('audit_logs').insert({
        event_type: 'transaction_cancelled',
        event_category: 'transaction',
        event_action: 'cancel',
        event_severity: 'info',
        user_id: userId,
        resource_type: 'device',
        resource_id: deviceId,
        event_description: `Transaction cancelled by user: ${reason}`,
        event_data: {
          payment_id: paymentId,
          device_id: deviceId,
          reason: reason,
        },
      });
    } catch (auditError) {
      console.error('[CANCEL_TRANSACTION] Audit log error:', auditError);
    }

    // 10. Send notifications
    try {
      // Notify finder about cancellation
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
          message_key: 'transaction_cancelled_finder',
          link: `/device/${deviceId}`,
          is_read: false,
          created_at: new Date().toISOString(),
        });
      }

      // Notify owner
      await supabaseClient.from('notifications').insert({
        user_id: userId,
        message_key: 'transaction_cancelled_owner',
        link: `/device/${deviceId}`,
        is_read: false,
        created_at: new Date().toISOString(),
      });
    } catch (notificationError) {
      console.error('[CANCEL_TRANSACTION] Notification error:', notificationError);
    }

    console.log('[CANCEL_TRANSACTION] İptal işlemi tamamlandı:', {
      deviceId,
      paymentId,
    });

    return {
      success: true,
    };

  } catch (error) {
    console.error('[CANCEL_TRANSACTION] Error:', error);
    return {
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// For direct function calls (not HTTP)
export async function cancelTransactionLocal(request: CancelTransactionRequest): Promise<CancelTransactionResponse> {
  return await cancelTransactionAPI(request);
}

