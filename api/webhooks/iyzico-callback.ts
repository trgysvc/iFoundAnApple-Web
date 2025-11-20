/**
 * İyzico Webhook Handler
 * İyzico'dan gelen ödeme durumu güncellemelerini işler
 */

import { createClient } from '@supabase/supabase-js';
import { getSecureConfig } from '../utils/security';
import { verifyIyzicoWebhook, checkIyzicoPaymentStatus } from '../utils/iyzicoConfig';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface IyzicoWebhookPayload {
  paymentId: string;
  conversationId: string;
  status: string;
  errorMessage?: string;
  paidPrice?: string;
  currency?: string;
  installment?: number;
  paymentChannel?: string;
  paymentGroup?: string;
  fraudStatus?: number;
  merchantCommissionRate?: string;
  merchantCommissionRateAmount?: string;
  iyziCommissionRateAmount?: string;
  iyziCommissionFee?: string;
  cardType?: string;
  cardAssociation?: string;
  cardFamily?: string;
  cardToken?: string;
  cardUserKey?: string;
  binNumber?: string;
  lastFourDigits?: string;
  basketId?: string;
  authCode?: string;
  phase?: string;
  mdStatus?: number;
  hostReference?: string;
  gsmNumber?: string;
  buyerId?: string;
  buyerName?: string;
  buyerSurname?: string;
  buyerEmail?: string;
  buyerIdentityNumber?: string;
  buyerRegistrationAddress?: string;
  buyerCity?: string;
  buyerCountry?: string;
  buyerZipCode?: string;
  buyerIp?: string;
  buyerUserAgent?: string;
  buyerRegistrationDate?: string;
  buyerLastLoginDate?: string;
  shippingContactName?: string;
  shippingCity?: string;
  shippingCountry?: string;
  shippingAddress?: string;
  shippingZipCode?: string;
  billingContactName?: string;
  billingCity?: string;
  billingCountry?: string;
  billingAddress?: string;
  billingZipCode?: string;
  basketItems?: Array<{
    id: string;
    name: string;
    category1: string;
    category2: string;
    itemType: string;
    subMerchantKey?: string;
    subMerchantPrice?: string;
    price: string;
  }>;
}

export async function handleIyzicoWebhook(request: Request): Promise<Response> {
  try {
    console.log('[IYZICO_WEBHOOK] Webhook received');

    // CORS preflight request
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Request body'yi al
    const body = await request.text();
    const signature = request.headers.get('x-iyzico-signature') || '';
    
    console.log('[IYZICO_WEBHOOK] Webhook data:', {
      signature: signature.substring(0, 20) + '...',
      bodyLength: body.length,
      headers: Object.fromEntries(request.headers.entries())
    });

    // Webhook signature doğrulaması
    if (!verifyIyzicoWebhook(signature, body)) {
      console.error('[IYZICO_WEBHOOK] Invalid signature');
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // JSON parse
    let webhookData: IyzicoWebhookPayload;
    try {
      webhookData = JSON.parse(body);
    } catch (error) {
      console.error('[IYZICO_WEBHOOK] Invalid JSON:', error);
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('[IYZICO_WEBHOOK] Processing webhook:', {
      paymentId: webhookData.paymentId,
      conversationId: webhookData.conversationId,
      status: webhookData.status
    });

    // Supabase client
    const config = getSecureConfig();
    const supabaseClient = createClient(config.supabaseUrl, config.supabaseServiceKey || config.supabaseAnonKey);

    // Payment kaydını bul
    const { data: paymentRecord, error: paymentError } = await supabaseClient
      .from('payments')
      .select('*')
      .eq('id', webhookData.conversationId)
      .single();

    if (paymentError || !paymentRecord) {
      console.error('[IYZICO_WEBHOOK] Payment record not found:', paymentError);
      return new Response(JSON.stringify({ error: 'Payment record not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Ödeme durumunu güncelle
    const newStatus = webhookData.status === 'success' ? 'completed' : 'failed';
    
    const { error: updateError } = await supabaseClient
      .from('payments')
      .update({
        status: newStatus,
        payment_status: newStatus, // Her iki kolonu da güncelle
        provider_payment_id: webhookData.paymentId,
        provider_response: webhookData,
        completed_at: newStatus === 'completed' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', webhookData.conversationId);

    if (updateError) {
      console.error('[IYZICO_WEBHOOK] Failed to update payment:', updateError);
      return new Response(JSON.stringify({ error: 'Failed to update payment' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Escrow durumunu güncelle
    if (newStatus === 'completed') {
      const { error: escrowError } = await supabaseClient
        .from('escrow_accounts')
        .update({
          status: 'held',
          held_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('payment_id', webhookData.conversationId);

      if (escrowError) {
        console.error('[IYZICO_WEBHOOK] Failed to update escrow:', escrowError);
      } else {
        console.log('[IYZICO_WEBHOOK] Escrow status updated to held');
      }
    }

    // Financial transaction kaydı oluştur
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const { error: transactionError } = await supabaseClient
      .from('financial_transactions')
      .insert({
        id: transactionId,
        payment_id: webhookData.conversationId,
        device_id: paymentRecord.device_id,
        transaction_type: 'payment_received',
        amount: parseFloat(webhookData.paidPrice || '0'),
        currency: webhookData.currency || 'TRY',
        status: newStatus,
        external_transaction_id: webhookData.paymentId,
        description: `İyzico payment ${newStatus}`,
        created_at: new Date().toISOString(),
      });

    if (transactionError) {
      console.error('[IYZICO_WEBHOOK] Failed to create transaction:', transactionError);
    }

    // Device durumunu güncelle
    if (newStatus === 'completed') {
      const { error: deviceError } = await supabaseClient
        .from('devices')
        .update({
          status: 'payment_completed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', paymentRecord.device_id);

      if (deviceError) {
        console.error('[IYZICO_WEBHOOK] Failed to update device status:', deviceError);
      }
    }

    console.log('[IYZICO_WEBHOOK] Webhook processed successfully');

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Webhook processed successfully',
      paymentId: webhookData.paymentId,
      status: newStatus
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[IYZICO_WEBHOOK] Unexpected error:', error);
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
export async function iyzicoWebhookHandler(request: Request): Promise<Response> {
  return await handleIyzicoWebhook(request);
}
