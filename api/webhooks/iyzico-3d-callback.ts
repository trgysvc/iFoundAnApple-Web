/**
 * İyzico 3D Secure Callback Handler
 * 3D Secure doğrulama sonrası kullanıcıyı yönlendirme
 */

import { createClient } from '@supabase/supabase-js';
import { getSecureConfig } from '../../utils/security';
import { checkIyzicoPaymentStatus } from '../../utils/iyzicoConfig';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CallbackParams {
  token: string;
  conversationId: string;
  status: string;
  paymentId?: string;
  errorMessage?: string;
}

export async function handleIyzicoCallback(request: Request): Promise<Response> {
  try {
    console.log('[IYZICO_CALLBACK] 3D Secure callback received');

    // URL parametrelerini al
    const url = new URL(request.url);
    const params: CallbackParams = {
      token: url.searchParams.get('token') || '',
      conversationId: url.searchParams.get('conversationId') || '',
      status: url.searchParams.get('status') || '',
      paymentId: url.searchParams.get('paymentId') || undefined,
      errorMessage: url.searchParams.get('errorMessage') || undefined,
    };

    console.log('[IYZICO_CALLBACK] Callback parameters:', params);

    if (!params.conversationId) {
      console.error('[IYZICO_CALLBACK] Missing conversationId');
      return new Response(JSON.stringify({ error: 'Missing conversationId' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Supabase client
    const config = getSecureConfig();
    const supabaseClient = createClient(config.supabaseUrl, config.supabaseServiceKey || config.supabaseAnonKey);

    // Payment kaydını bul
    const { data: paymentRecord, error: paymentError } = await supabaseClient
      .from('payments')
      .select('*')
      .eq('id', params.conversationId)
      .single();

    if (paymentError || !paymentRecord) {
      console.error('[IYZICO_CALLBACK] Payment record not found:', paymentError);
      return new Response(JSON.stringify({ error: 'Payment record not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // İyzico'dan ödeme durumunu tekrar sorgula
    if (params.paymentId) {
      const statusResult = await checkIyzicoPaymentStatus(params.paymentId);
      
      if (statusResult.success) {
        // Ödeme başarılı, durumu güncelle
        const { error: updateError } = await supabaseClient
          .from('payments')
          .update({
            status: 'completed',
            provider_payment_id: params.paymentId,
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', params.conversationId);

        if (updateError) {
          console.error('[IYZICO_CALLBACK] Failed to update payment:', updateError);
        } else {
          // Escrow durumunu güncelle
          const { error: escrowError } = await supabaseClient
            .from('escrow_accounts')
            .update({
              status: 'held',
              held_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('payment_id', params.conversationId);

          if (escrowError) {
            console.error('[IYZICO_CALLBACK] Failed to update escrow:', escrowError);
          }

          // Device durumunu güncelle
          const { error: deviceError } = await supabaseClient
            .from('devices')
            .update({
              status: 'payment_completed',
              updated_at: new Date().toISOString(),
            })
            .eq('id', paymentRecord.device_id);

          if (deviceError) {
            console.error('[IYZICO_CALLBACK] Failed to update device status:', deviceError);
          }

          console.log('[IYZICO_CALLBACK] Payment completed successfully');
        }
      } else {
        // Ödeme başarısız
        const { error: updateError } = await supabaseClient
          .from('payments')
          .update({
            status: 'failed',
            provider_payment_id: params.paymentId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', params.conversationId);

        if (updateError) {
          console.error('[IYZICO_CALLBACK] Failed to update payment status:', updateError);
        }

        console.log('[IYZICO_CALLBACK] Payment failed');
      }
    }

    // Kullanıcıyı uygun sayfaya yönlendir
    const redirectUrl = params.status === 'success' 
      ? `${config.iyzico.callbackUrl}/payment/success?paymentId=${params.conversationId}`
      : `${config.iyzico.callbackUrl}/payment/failure?paymentId=${params.conversationId}&error=${encodeURIComponent(params.errorMessage || 'Payment failed')}`;

    console.log('[IYZICO_CALLBACK] Redirecting to:', redirectUrl);

    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': redirectUrl,
      },
    });

  } catch (error) {
    console.error('[IYZICO_CALLBACK] Unexpected error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// HTTP endpoint wrapper
export async function iyzicoCallbackHandler(request: Request): Promise<Response> {
  return await handleIyzicoCallback(request);
}
