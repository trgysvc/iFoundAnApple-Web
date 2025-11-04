/**
 * API: Dispute Transaction
 * Cihaz sahibinin itirazı (cihaz teslim edildikten sonra)
 */

import { createClient } from '@supabase/supabase-js';
import { getSecureConfig } from '../utils/security.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DisputeTransactionRequest {
  deviceId: string;
  paymentId: string;
  reason: string;
  description: string; // Detailed description of the issue
  userId: string; // Disputing user ID
}

interface DisputeTransactionResponse {
  success: boolean;
  errorMessage?: string;
  disputeId?: string;
}

export async function disputeTransactionAPI(request: DisputeTransactionRequest): Promise<DisputeTransactionResponse> {
  try {
    const config = getSecureConfig();
    const supabaseClient = createClient(config.supabaseUrl, config.supabaseServiceKey || config.supabaseAnonKey);

    const { deviceId, paymentId, reason, description, userId } = request;

    console.log('[DISPUTE_TRANSACTION] İtiraz talebi alındı:', {
      deviceId,
      paymentId,
      userId,
      reason
    });

    // 1. Get device info
    const { data: deviceData, error: deviceError } = await supabaseClient
      .from('devices')
      .select('status, userId')
      .eq('id', deviceId)
      .single();

    if (deviceError || !deviceData) {
      throw new Error(`Device not found: ${deviceError?.message}`);
    }

    // 2. Check if dispute is allowed (only after delivery)
    if (deviceData.status !== 'delivered') {
      throw new Error(`İtiraz işlemi sadece teslim edildikten sonra yapılabilir. Mevcut durum: ${deviceData.status}`);
    }

    // 3. Check if user has permission (only device owner can dispute)
    if (deviceData.userId !== userId) {
      throw new Error('Sadece cihaz sahibi itiraz işlemi yapabilir');
    }

    // 4. Update device status to DISPUTED
    const { error: deviceUpdateError } = await supabaseClient
      .from('devices')
      .update({
        status: 'disputed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', deviceId);

    if (deviceUpdateError) {
      throw new Error(`Device status update failed: ${deviceUpdateError.message}`);
    }

    // 5. Update escrow account status
    const { data: escrowData, error: escrowError } = await supabaseClient
      .from('escrow_accounts')
      .select('id')
      .eq('payment_id', paymentId)
      .single();

    if (!escrowError && escrowData) {
      await supabaseClient
        .from('escrow_accounts')
        .update({
          dispute_status: 'pending',
          dispute_reason: reason,
          updated_at: new Date().toISOString(),
        })
        .eq('id', escrowData.id);
    }

    // 6. Create audit log
    try {
      await supabaseClient.from('audit_logs').insert({
        event_type: 'transaction_disputed',
        event_category: 'transaction',
        event_action: 'dispute',
        event_severity: 'warning',
        user_id: userId,
        resource_type: 'device',
        resource_id: deviceId,
        event_description: `Transaction disputed by user: ${reason}`,
        event_data: {
          payment_id: paymentId,
          device_id: deviceId,
          reason: reason,
          description: description,
        },
      });
    } catch (auditError) {
      console.error('[DISPUTE_TRANSACTION] Audit log error:', auditError);
    }

    // 7. Send notifications
    try {
      // Notify finder about dispute
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
          message_key: 'transaction_disputed_finder',
          link: `/device/${deviceId}`,
          is_read: false,
          created_at: new Date().toISOString(),
        });
      }

      // Notify admin (admin panel notification)
      const { data: adminUsers } = await supabaseClient
        .from('users')
        .select('id')
        .eq('role', 'admin');

      if (adminUsers) {
        const adminNotifications = adminUsers.map(admin => ({
          user_id: admin.id,
          message_key: 'transaction_disputed_admin',
          link: `/admin/device/${deviceId}`,
          is_read: false,
          created_at: new Date().toISOString(),
        }));

        await supabaseClient.from('notifications').insert(adminNotifications);
      }
    } catch (notificationError) {
      console.error('[DISPUTE_TRANSACTION] Notification error:', notificationError);
    }

    console.log('[DISPUTE_TRANSACTION] İtiraz işlemi tamamlandı:', {
      deviceId,
      paymentId,
    });

    return {
      success: true,
      disputeId: deviceId, // Using deviceId as dispute reference
    };

  } catch (error) {
    console.error('[DISPUTE_TRANSACTION] Error:', error);
    return {
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// For direct function calls (not HTTP)
export async function disputeTransactionLocal(request: DisputeTransactionRequest): Promise<DisputeTransactionResponse> {
  return await disputeTransactionAPI(request);
}


