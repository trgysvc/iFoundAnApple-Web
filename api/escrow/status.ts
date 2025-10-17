/**
 * Escrow Status API Endpoint
 * Escrow hesap durumunu sorgulama
 */

import { createClient } from '@supabase/supabase-js';
import { getSecureConfig } from '../../utils/security';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EscrowStatusResponse {
  success: boolean;
  data?: {
    paymentId: string;
    status: string;
    amount: number;
    currency: string;
    heldAt?: string;
    releasedAt?: string;
    deviceId: string;
    userId: string;
  };
  error?: string;
}

export async function getEscrowStatus(paymentId: string): Promise<EscrowStatusResponse> {
  try {
    console.log('[ESCROW_STATUS] Escrow durumu sorgulanıyor:', paymentId);

    // Supabase client
    const config = getSecureConfig();
    const supabaseClient = createClient(config.supabaseUrl, config.supabaseServiceKey || config.supabaseAnonKey);

    // Escrow hesabını bul
    const { data: escrowAccount, error: escrowError } = await supabaseClient
      .from('escrow_accounts')
      .select(`
        *,
        payments (
          id,
          amount,
          currency,
          device_id,
          user_id,
          status
        )
      `)
      .eq('payment_id', paymentId)
      .single();

    if (escrowError || !escrowAccount) {
      console.error('[ESCROW_STATUS] Escrow hesabı bulunamadı:', escrowError);
      return {
        success: false,
        error: 'Escrow hesabı bulunamadı'
      };
    }

    console.log('[ESCROW_STATUS] Escrow hesabı bulundu:', escrowAccount);

    return {
      success: true,
      data: {
        paymentId: escrowAccount.payment_id,
        status: escrowAccount.status,
        amount: escrowAccount.payments?.amount || 0,
        currency: escrowAccount.payments?.currency || 'TRY',
        heldAt: escrowAccount.held_at,
        releasedAt: escrowAccount.released_at,
        deviceId: escrowAccount.payments?.device_id || '',
        userId: escrowAccount.payments?.user_id || ''
      }
    };

  } catch (error) {
    console.error('[ESCROW_STATUS] Unexpected error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// HTTP endpoint handler
export async function handleEscrowStatusRequest(request: Request): Promise<Response> {
  try {
    // URL'den paymentId'yi al
    const url = new URL(request.url);
    const paymentId = url.pathname.split('/').pop();

    if (!paymentId) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Payment ID is required' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const result = await getEscrowStatus(paymentId);

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[ESCROW_STATUS] HTTP handler error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}