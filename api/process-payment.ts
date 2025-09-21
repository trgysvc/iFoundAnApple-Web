/**
 * Local API: Process Payment
 * Güvenli ödeme işleme ve escrow sistemi
 */

import { createClient } from '@supabase/supabase-js';
import { getSecureConfig } from '../utils/security.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  deviceId: string;
  payerId: string;
  receiverId?: string;
  feeBreakdown: {
    rewardAmount: number;
    cargoFee: number;
    serviceFee: number;
    gatewayFee: number;
    totalAmount: number;
    netPayout: number;
  };
  deviceInfo: {
    model: string;
    serialNumber: string;
    description?: string;
  };
  payerInfo: {
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      district: string;
      postalCode: string;
    };
  };
  paymentProvider?: 'iyzico' | 'stripe' | 'test';
}

interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  escrowId?: string;
  providerPaymentId?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'held';
  errorMessage?: string;
  redirectUrl?: string;
  providerResponse?: any;
}

export async function processPaymentAPI(request: PaymentRequest): Promise<PaymentResponse> {
  try {
    // Initialize Supabase client
    const { supabaseUrl, supabaseServiceKey } = getSecureConfig();
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    const {
      deviceId,
      payerId,
      receiverId,
      feeBreakdown,
      deviceInfo,
      payerInfo,
      paymentProvider = 'test'
    } = request;

    console.log('[PROCESS_PAYMENT] Processing payment request:', {
      deviceId,
      payerId,
      receiverId,
      totalAmount: feeBreakdown.totalAmount,
      paymentProvider
    });

    // Generate unique payment ID
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const escrowId = `escrow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create payment record
    const { data: paymentData, error: paymentError } = await supabaseClient
      .from('payments')
      .insert({
        id: paymentId,
        device_id: deviceId,
        payer_id: payerId,
        receiver_id: receiverId,
        amount: feeBreakdown.totalAmount,
        reward_amount: feeBreakdown.rewardAmount,
        cargo_fee: feeBreakdown.cargoFee,
        service_fee: feeBreakdown.serviceFee,
        gateway_fee: feeBreakdown.gatewayFee,
        net_payout: feeBreakdown.netPayout,
        status: 'pending',
        payment_provider: paymentProvider,
        payer_info: payerInfo,
        device_info: deviceInfo,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (paymentError) {
      throw new Error(`Failed to create payment record: ${paymentError.message}`);
    }

    // Create escrow record
    const { data: escrowData, error: escrowError } = await supabaseClient
      .from('escrow_accounts')
      .insert({
        id: escrowId,
        payment_id: paymentId,
        device_id: deviceId,
        amount: feeBreakdown.totalAmount,
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (escrowError) {
      throw new Error(`Failed to create escrow record: ${escrowError.message}`);
    }

    // Process payment based on provider
    let paymentResult: PaymentResponse;

    switch (paymentProvider) {
      case 'iyzico':
        paymentResult = await processIyzicoPayment(request, paymentId);
        break;
      case 'stripe':
        paymentResult = await processStripePayment(request, paymentId);
        break;
      case 'test':
      default:
        paymentResult = await processTestPayment(request, paymentId);
        break;
    }

    // Update payment status
    const { error: updateError } = await supabaseClient
      .from('payments')
      .update({
        status: paymentResult.status,
        provider_payment_id: paymentResult.providerPaymentId,
        provider_response: paymentResult.providerResponse,
        updated_at: new Date().toISOString(),
      })
      .eq('id', paymentId);

    if (updateError) {
      console.error('[PROCESS_PAYMENT] Failed to update payment status:', updateError);
    }

    // Update escrow status
    const { error: escrowUpdateError } = await supabaseClient
      .from('escrow_accounts')
      .update({
        status: paymentResult.status === 'completed' ? 'held' : 'pending',
        updated_at: new Date().toISOString(),
      })
      .eq('id', escrowId);

    if (escrowUpdateError) {
      console.error('[PROCESS_PAYMENT] Failed to update escrow status:', escrowUpdateError);
    }

    const response: PaymentResponse = {
      success: paymentResult.success,
      paymentId,
      escrowId,
      providerPaymentId: paymentResult.providerPaymentId,
      status: paymentResult.status,
      errorMessage: paymentResult.errorMessage,
      redirectUrl: paymentResult.redirectUrl,
      providerResponse: paymentResult.providerResponse,
    };

    console.log('[PROCESS_PAYMENT] Payment processing completed:', response);
    return response;

  } catch (error) {
    console.error('[PROCESS_PAYMENT] Error:', error);
    return {
      success: false,
      status: 'failed',
      errorMessage: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

async function processIyzicoPayment(request: PaymentRequest, paymentId: string): Promise<PaymentResponse> {
  // TODO: Implement Iyzico payment processing
  console.log('[PROCESS_PAYMENT] Iyzico payment processing not implemented yet');
  return {
    success: true,
    providerPaymentId: `iyzico_${paymentId}`,
    status: 'completed',
    providerResponse: { provider: 'iyzico', status: 'mock_success' },
  };
}

async function processStripePayment(request: PaymentRequest, paymentId: string): Promise<PaymentResponse> {
  // TODO: Implement Stripe payment processing
  console.log('[PROCESS_PAYMENT] Stripe payment processing not implemented yet');
  return {
    success: true,
    providerPaymentId: `stripe_${paymentId}`,
    status: 'completed',
    providerResponse: { provider: 'stripe', status: 'mock_success' },
  };
}

async function processTestPayment(request: PaymentRequest, paymentId: string): Promise<PaymentResponse> {
  // Mock test payment - always succeeds
  console.log('[PROCESS_PAYMENT] Test payment processing');
  return {
    success: true,
    providerPaymentId: `test_${paymentId}`,
    status: 'completed',
    providerResponse: { provider: 'test', status: 'mock_success' },
  };
}

// For direct function calls (not HTTP)
export async function processPaymentLocal(request: PaymentRequest): Promise<PaymentResponse> {
  return await processPaymentAPI(request);
}
