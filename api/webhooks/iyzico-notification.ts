/**
 * İyzico Webhook/Notification Handler
 * İyzico'dan gelen ödeme durumu bildirimlerini handle eder
 */

import { createClient } from '@supabase/supabase-js';
import { getSecureConfig } from '../../utils/security';

export const handleIyzicoNotification = async (notificationData: any) => {
  try {
    console.log('[WEBHOOK] İyzico notification received:', notificationData);

    // Supabase client oluştur
    const config = getSecureConfig();
    const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);

    // Ödeme durumunu güncelle
    const { data, error } = await supabase
      .from('payments')
      .update({
        status: notificationData.paymentStatus,
        updated_at: new Date().toISOString(),
        iyzico_notification: notificationData
      })
      .eq('provider_payment_id', notificationData.paymentId);

    if (error) {
      console.error('[WEBHOOK] Database update error:', error);
      return { success: false, error: error.message };
    }

    console.log('[WEBHOOK] Payment status updated successfully');
    return { success: true, data };

  } catch (error) {
    console.error('[WEBHOOK] Notification handling error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Webhook endpoint (Express.js route olarak kullanılabilir)
export const iyzicoWebhookRoute = async (req: any, res: any) => {
  try {
    const notificationData = req.body;
    
    // İyzico signature verification (güvenlik için)
    // Bu kısım İyzico'nun signature'ını doğrulamak için gerekli
    
    const result = await handleIyzicoNotification(notificationData);
    
    if (result.success) {
      res.status(200).json({ status: 'success' });
    } else {
      res.status(400).json({ status: 'error', message: result.error });
    }
    
  } catch (error) {
    console.error('[WEBHOOK] Route error:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
