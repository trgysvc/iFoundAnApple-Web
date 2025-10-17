/**
 * Escrow Create API Endpoint
 * Yeni escrow hesabı oluşturma
 */

import { createClient } from '@supabase/supabase-js';
import { getSecureConfig } from '../../utils/security';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EscrowCreateRequest {
  paymentId: string;
  deviceId: string;
  userId: string;
  amount: number;
  currency: string;
}

interface EscrowCreateResponse {
  success: boolean;
  data?: {
    escrowId: string;
    paymentId: string;
    status: string;
    amount: number;
    currency: string;
    createdAt: string;
  };
  error?: string;
}

export async function createEscrowAccount(request: EscrowCreateRequest): Promise<EscrowCreateResponse> {
  try {
    console.log('[ESCROW_CREATE] Yeni escrow hesabı oluşturuluyor:', request);

    // Supabase client
    const config = getSecureConfig();
    const supabaseClient = createClient(config.supabaseUrl, config.supabaseServiceKey || config.supabaseAnonKey);

    // Ödeme kaydını kontrol et
    const { data: paymentRecord, error: paymentError } = await supabaseClient
      .from('payments')
      .select('*')
      .eq('id', request.paymentId)
      .single();

    if (paymentError || !paymentRecord) {
      console.error('[ESCROW_CREATE] Ödeme kaydı bulunamadı:', paymentError);
      return {
        success: false,
        error: 'Ödeme kaydı bulunamadı'
      };
    }

    // Escrow hesabı oluştur
    const { data: escrowAccount, error: escrowError } = await supabaseClient
      .from('escrow_accounts')
      .insert({
        payment_id: request.paymentId,
        device_id: request.deviceId,
        user_id: request.userId,
        amount: request.amount,
        currency: request.currency,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (escrowError) {
      console.error('[ESCROW_CREATE] Escrow hesabı oluşturma hatası:', escrowError);
      return {
        success: false,
        error: 'Escrow hesabı oluşturulamadı'
      };
    }

    // Audit log ekle
    const { error: auditError } = await supabaseClient
      .from('audit_logs')
      .insert({
        event_type: 'escrow_created',
        event_severity: 'info',
        user_id: request.userId,
        resource_type: 'escrow',
        resource_id: escrowAccount.id,
        event_description: 'Escrow account created',
        event_data: {
          payment_id: request.paymentId,
          device_id: request.deviceId,
          amount: request.amount,
          currency: request.currency,
          created_at: new Date().toISOString()
        }
      });

    if (auditError) {
      console.error('[ESCROW_CREATE] Audit log hatası:', auditError);
    }

    console.log('[ESCROW_CREATE] Escrow hesabı başarıyla oluşturuldu:', escrowAccount);

    return {
      success: true,
      data: {
        escrowId: escrowAccount.id,
        paymentId: request.paymentId,
        status: 'pending',
        amount: request.amount,
        currency: request.currency,
        createdAt: escrowAccount.created_at
      }
    };

  } catch (error) {
    console.error('[ESCROW_CREATE] Unexpected error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// HTTP endpoint handler
export async function handleEscrowCreateRequest(request: Request): Promise<Response> {
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
    const { paymentId, deviceId, userId, amount, currency } = body;

    if (!paymentId || !deviceId || !userId || !amount || !currency) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing required fields: paymentId, deviceId, userId, amount, currency' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const result = await createEscrowAccount({
      paymentId,
      deviceId,
      userId,
      amount,
      currency
    });

    return new Response(JSON.stringify(result), {
      status: result.success ? 201 : 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[ESCROW_CREATE] HTTP handler error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}