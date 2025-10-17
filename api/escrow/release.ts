/**
 * Escrow Release API Endpoint
 * Escrow hesabından ödeme serbest bırakma
 */

import { createClient } from '@supabase/supabase-js';
import { getSecureConfig } from '../../utils/security';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EscrowReleaseRequest {
  paymentId: string;
  releaseReason: string;
  releasedBy: string; // User ID who is releasing
}

interface EscrowReleaseResponse {
  success: boolean;
  data?: {
    paymentId: string;
    status: string;
    releasedAt: string;
    releaseReason: string;
    releasedBy: string;
  };
  error?: string;
}

export async function releaseEscrowPayment(request: EscrowReleaseRequest): Promise<EscrowReleaseResponse> {
  try {
    console.log('[ESCROW_RELEASE] Escrow serbest bırakılıyor:', request);

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
      .eq('payment_id', request.paymentId)
      .single();

    if (escrowError || !escrowAccount) {
      console.error('[ESCROW_RELEASE] Escrow hesabı bulunamadı:', escrowError);
      return {
        success: false,
        error: 'Escrow hesabı bulunamadı'
      };
    }

    // Escrow durumunu kontrol et
    if (escrowAccount.status !== 'held') {
      return {
        success: false,
        error: 'Escrow hesabı serbest bırakılamaz. Durum: ' + escrowAccount.status
      };
    }

    // Escrow hesabını güncelle
    const { error: updateError } = await supabaseClient
      .from('escrow_accounts')
      .update({
        status: 'released',
        released_at: new Date().toISOString(),
        release_reason: request.releaseReason,
        released_by: request.releasedBy,
        updated_at: new Date().toISOString(),
      })
      .eq('payment_id', request.paymentId);

    if (updateError) {
      console.error('[ESCROW_RELEASE] Escrow güncelleme hatası:', updateError);
      return {
        success: false,
        error: 'Escrow güncelleme hatası'
      };
    }

    // Device durumunu güncelle
    const { error: deviceError } = await supabaseClient
      .from('devices')
      .update({
        status: 'cargo_shipped',
        updated_at: new Date().toISOString(),
      })
      .eq('id', escrowAccount.payments?.device_id);

    if (deviceError) {
      console.error('[ESCROW_RELEASE] Device güncelleme hatası:', deviceError);
    }

    // Audit log ekle
    const { error: auditError } = await supabaseClient
      .from('audit_logs')
      .insert({
        event_type: 'escrow_released',
        event_severity: 'info',
        user_id: request.releasedBy,
        resource_type: 'escrow',
        resource_id: escrowAccount.id,
        event_description: 'Escrow payment released',
        event_data: {
          payment_id: request.paymentId,
          release_reason: request.releaseReason,
          released_at: new Date().toISOString()
        }
      });

    if (auditError) {
      console.error('[ESCROW_RELEASE] Audit log hatası:', auditError);
    }

    console.log('[ESCROW_RELEASE] Escrow başarıyla serbest bırakıldı');

    return {
      success: true,
      data: {
        paymentId: request.paymentId,
        status: 'released',
        releasedAt: new Date().toISOString(),
        releaseReason: request.releaseReason,
        releasedBy: request.releasedBy
      }
    };

  } catch (error) {
    console.error('[ESCROW_RELEASE] Unexpected error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// HTTP endpoint handler
export async function handleEscrowReleaseRequest(request: Request): Promise<Response> {
  try {
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Method not allowed' 
      }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { paymentId, releaseReason, releasedBy } = body;

    if (!paymentId || !releaseReason || !releasedBy) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing required fields: paymentId, releaseReason, releasedBy' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const result = await releaseEscrowPayment({
      paymentId,
      releaseReason,
      releasedBy
    });

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[ESCROW_RELEASE] HTTP handler error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
