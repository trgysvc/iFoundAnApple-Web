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

export async function processPaymentAPI(request: PaymentRequest, existingPaymentId?: string): Promise<PaymentResponse> {
  try {
    // Initialize Supabase client
    const config = getSecureConfig();
    const supabaseClient = createClient(config.supabaseUrl, config.supabaseServiceKey || config.supabaseAnonKey);

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

    // Use existing payment ID or generate new one
    const paymentId = existingPaymentId || crypto.randomUUID();
    const escrowId = crypto.randomUUID();

    // Create payment record
    const { data: paymentData, error: paymentError } = await supabaseClient
      .from('payments')
      .insert({
        id: paymentId,
        device_id: deviceId,
        payer_id: payerId,
        receiver_id: receiverId,
        total_amount: feeBreakdown.totalAmount,
        reward_amount: feeBreakdown.rewardAmount,
        cargo_fee: feeBreakdown.cargoFee,
        service_fee: feeBreakdown.serviceFee,
        payment_gateway_fee: feeBreakdown.gatewayFee,
        net_payout: feeBreakdown.netPayout,
        payment_status: 'pending',
        payment_provider: paymentProvider,
        payer_info: payerInfo,
        device_info: deviceInfo,
        billing_address: payerInfo.address,
        shipping_address: payerInfo.address,
        ip_address: '127.0.0.1', // Mock IP - gerçek uygulamada request'ten gelecek
        user_agent: 'Test Payment', // Mock user agent
        risk_level: 'low',
        compliance_status: 'pending',
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
        holder_user_id: payerId,
        beneficiary_user_id: receiverId || payerId, // Eğer receiver yoksa payer'ı beneficiary yap
        total_amount: feeBreakdown.totalAmount,
        reward_amount: feeBreakdown.rewardAmount,
        service_fee: feeBreakdown.serviceFee,
        gateway_fee: feeBreakdown.gatewayFee,
        cargo_fee: feeBreakdown.cargoFee,
        net_payout: feeBreakdown.netPayout,
        status: 'pending',
        escrow_type: 'standard',
        auto_release_days: 30,
        release_conditions: [
          {
            type: 'device_received',
            description: 'Device must be received by finder',
            met: false
          },
          {
            type: 'exchange_confirmed',
            description: 'Both parties must confirm exchange',
            met: false
          }
        ],
        confirmations: [],
        risk_assessment: 'low',
        compliance_verified: false,
        created_by: payerId,
        last_activity_at: new Date().toISOString(),
        activity_log: [
          {
            action: 'escrow_created',
            timestamp: new Date().toISOString(),
            user_id: payerId,
            description: 'Escrow account created for device recovery'
          }
        ],
        metadata: {
          device_model: deviceInfo.model,
          payment_provider: paymentProvider,
          test_mode: paymentProvider === 'test'
        },
        priority: 'normal',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (escrowError) {
      throw new Error(`Failed to create escrow record: ${escrowError.message}`);
    }

    // Payment result should come from the calling function
    // This function only handles database operations
    const paymentResult: PaymentResponse = {
      success: true,
      paymentId: paymentId,
      providerPaymentId: `${paymentProvider}_${paymentId}`,
      status: 'pending',
      providerResponse: { provider: paymentProvider, status: 'processing' }
    };

    // Update payment status
    const { error: updateError } = await supabaseClient
      .from('payments')
      .update({
        payment_status: paymentResult.status,
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
        updated_at: new Date().toISOString()
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
  try {
    console.log('[PROCESS_PAYMENT] Iyzico payment processing started');
    
    // İyzico API entegrasyonu için gerekli veri formatını hazırla
    const iyzicoPaymentData = {
      amount: request.feeBreakdown.totalAmount,
      currency: 'TRY',
      conversationId: paymentId,
      buyerInfo: {
        id: request.payerId,
        name: request.payerInfo.name.split(' ')[0] || 'Unknown',
        surname: request.payerInfo.name.split(' ').slice(1).join(' ') || 'User',
        email: request.payerInfo.email,
        phone: request.payerInfo.phone,
        identityNumber: '11111111111', // Mock TC Kimlik - gerçek uygulamada user profile'dan gelecek
        city: request.payerInfo.address.city,
        country: 'Turkey',
        address: request.payerInfo.address.street,
        zipCode: request.payerInfo.address.postalCode
      },
      shippingAddress: {
        contactName: request.payerInfo.name,
        city: request.payerInfo.address.city,
        country: 'Turkey',
        address: request.payerInfo.address.street,
        zipCode: request.payerInfo.address.postalCode
      },
      billingAddress: {
        contactName: request.payerInfo.name,
        city: request.payerInfo.address.city,
        country: 'Turkey',
        address: request.payerInfo.address.street,
        zipCode: request.payerInfo.address.postalCode
      },
      basketItems: [
        {
          id: request.deviceId,
          name: `${request.deviceInfo.model} Device Recovery`,
          category1: 'Electronics',
          category2: 'Mobile Device',
          itemType: 'PHYSICAL',
          price: request.feeBreakdown.totalAmount
        }
      ]
    };

    // İyzico API çağrısı yap
    const { processIyzicoPayment: iyzicoProcess } = await import('../utils/iyzicoConfig');
    const result = await iyzicoProcess(iyzicoPaymentData);

    console.log('[PROCESS_PAYMENT] Iyzico payment result:', result);

    return {
      success: result.success,
      providerPaymentId: result.paymentId,
      status: result.status as any,
      errorMessage: result.errorMessage,
      redirectUrl: result.redirectUrl,
      providerResponse: result.providerResponse
    };

  } catch (error) {
    console.error('[PROCESS_PAYMENT] Iyzico payment error:', error);
    return {
      success: false,
      providerPaymentId: `iyzico_error_${paymentId}`,
      status: 'failed',
      errorMessage: error instanceof Error ? error.message : 'İyzico ödeme hatası',
      providerResponse: { error: error }
    };
  }
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
    paymentId: paymentId, // UUID formatında
    providerPaymentId: `test_${paymentId}`,
    status: 'completed',
    providerResponse: { provider: 'test', status: 'mock_success' },
  };
}

// For direct function calls (not HTTP) - This should handle both payment processing and database operations
export async function processPaymentLocal(request: PaymentRequest): Promise<PaymentResponse> {
  // First, process the payment with the actual provider
  const paymentResult = await processPaymentWithProvider(request);
  
  // Then, update the database with the result
  await updatePaymentInDatabase(request, paymentResult);
  
  return paymentResult;
}

// Process payment with actual provider (Iyzico, Stripe, etc.)
async function processPaymentWithProvider(request: PaymentRequest): Promise<PaymentResponse> {
  const { paymentProvider = 'test' } = request;
  
  switch (paymentProvider) {
    case 'iyzico':
      return await processIyzicoPayment(request);
    case 'stripe':
      return await processStripePayment(request);
    case 'test':
    default:
      return await processTestPayment(request);
  }
}

// Update payment in database after processing
async function updatePaymentInDatabase(request: PaymentRequest, paymentResult: PaymentResponse): Promise<void> {
  // This will be implemented to update the database with the payment result
  console.log('[PROCESS_PAYMENT] Updating database with payment result:', paymentResult);
}
