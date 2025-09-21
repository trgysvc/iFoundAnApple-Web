/**
 * Supabase Edge Function: Process Payment
 * Güvenli ödeme işleme ve escrow sistemi
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
  redirectUrl?: string;
  errorMessage?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const paymentRequest: PaymentRequest = await req.json();
    
    console.log('[PROCESS_PAYMENT] Payment request received:', {
      deviceId: paymentRequest.deviceId,
      payerId: paymentRequest.payerId,
      totalAmount: paymentRequest.feeBreakdown.totalAmount,
      provider: paymentRequest.paymentProvider || 'iyzico'
    });

    // Input validation
    if (!paymentRequest.deviceId || !paymentRequest.payerId || !paymentRequest.feeBreakdown) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Eksik ödeme bilgileri' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (paymentRequest.feeBreakdown.totalAmount < 10) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Minimum ödeme tutarı 10 TL' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if device exists and is active
    const { data: device, error: deviceError } = await supabaseClient
      .from('devices')
      .select('*')
      .eq('id', paymentRequest.deviceId)
      .single();

    if (deviceError || !device) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Cihaz bulunamadı' 
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create payment record
    const paymentData = {
      device_id: paymentRequest.deviceId,
      payer_id: paymentRequest.payerId,
      receiver_id: paymentRequest.receiverId || null,
      total_amount: paymentRequest.feeBreakdown.totalAmount,
      reward_amount: paymentRequest.feeBreakdown.rewardAmount,
      cargo_fee: paymentRequest.feeBreakdown.cargoFee,
      payment_gateway_fee: paymentRequest.feeBreakdown.gatewayFee,
      service_fee: paymentRequest.feeBreakdown.serviceFee,
      net_payout: paymentRequest.feeBreakdown.netPayout,
      payment_provider: paymentRequest.paymentProvider || 'iyzico',
      payment_status: 'pending',
      escrow_status: 'pending',
      currency: 'TRY'
    };

    const { data: payment, error: paymentError } = await supabaseClient
      .from('payments')
      .insert([paymentData])
      .select()
      .single();

    if (paymentError || !payment) {
      console.error('[PROCESS_PAYMENT] Payment creation error:', paymentError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Ödeme kaydı oluşturulamadı' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('[PROCESS_PAYMENT] ✅ Payment record created:', payment.id);

    // Create escrow account
    const escrowData = {
      payment_id: payment.id,
      device_id: paymentRequest.deviceId,
      holder_user_id: paymentRequest.payerId,
      beneficiary_user_id: paymentRequest.receiverId || null,
      total_amount: paymentRequest.feeBreakdown.totalAmount,
      reward_amount: paymentRequest.feeBreakdown.rewardAmount,
      service_fee: paymentRequest.feeBreakdown.serviceFee,
      gateway_fee: paymentRequest.feeBreakdown.gatewayFee,
      cargo_fee: paymentRequest.feeBreakdown.cargoFee,
      net_payout: paymentRequest.feeBreakdown.netPayout,
      status: 'pending',
      release_conditions: [
        'device_received_confirmation',
        'exchange_both_parties_confirmed'
      ],
      confirmations: []
    };

    const { data: escrow, error: escrowError } = await supabaseClient
      .from('escrow_accounts')
      .insert([escrowData])
      .select()
      .single();

    if (escrowError || !escrow) {
      console.error('[PROCESS_PAYMENT] Escrow creation error:', escrowError);
      // Rollback payment record
      await supabaseClient
        .from('payments')
        .delete()
        .eq('id', payment.id);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Escrow hesabı oluşturulamadı' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('[PROCESS_PAYMENT] ✅ Escrow account created:', escrow.id);

    // Process payment with selected provider
    let paymentResult: any;
    
    if (paymentRequest.paymentProvider === 'test') {
      // Test mode - simulate successful payment
      paymentResult = await processTestPayment(paymentRequest, payment.id);
    } else if (paymentRequest.paymentProvider === 'stripe') {
      // Stripe integration (to be implemented)
      paymentResult = await processStripePayment(paymentRequest, payment.id);
    } else {
      // Default to Iyzico
      paymentResult = await processIyzicoPayment(paymentRequest, payment.id);
    }

    // Update payment record with provider response
    await supabaseClient
      .from('payments')
      .update({
        provider_payment_id: paymentResult.providerPaymentId,
        provider_transaction_id: paymentResult.providerTransactionId,
        provider_status: paymentResult.status,
        provider_response: paymentResult.providerResponse,
        payment_status: paymentResult.status === 'success' ? 'processing' : 'failed',
        updated_at: new Date().toISOString()
      })
      .eq('id', payment.id);

    // If payment successful, update escrow to held status
    if (paymentResult.success) {
      await supabaseClient
        .from('escrow_accounts')
        .update({
          status: 'held',
          held_at: new Date().toISOString(),
          confirmations: [{
            type: 'payment_confirmed',
            timestamp: new Date().toISOString(),
            paymentData: paymentResult
          }]
        })
        .eq('id', escrow.id);

      console.log('[PROCESS_PAYMENT] ✅ Escrow funds held successfully');
    }

    // Create financial transaction records
    await createFinancialTransactionFlow(
      supabaseClient,
      payment,
      paymentRequest,
      paymentResult
    );

    // Log the payment process for audit
    await supabaseClient
      .from('audit_logs')
      .insert([
        {
          event_type: 'payment_processing',
          event_category: 'payment',
          event_action: 'process_payment',
          event_description: `Payment processing for device ${paymentRequest.deviceId}`,
          user_id: paymentRequest.payerId,
          resource_type: 'payment',
          resource_id: payment.id,
          event_data: {
            deviceId: paymentRequest.deviceId,
            totalAmount: paymentRequest.feeBreakdown.totalAmount,
            provider: paymentRequest.paymentProvider || 'iyzico',
            success: paymentResult.success
          }
        }
      ]);

    const response: PaymentResponse = {
      success: paymentResult.success,
      paymentId: payment.id,
      escrowId: escrow.id,
      providerPaymentId: paymentResult.providerPaymentId,
      status: paymentResult.success ? 'held' : 'failed',
      redirectUrl: paymentResult.redirectUrl,
      errorMessage: paymentResult.success ? undefined : paymentResult.error
    };

    console.log('[PROCESS_PAYMENT] ✅ Payment processing completed:', response);

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('[PROCESS_PAYMENT] Error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Bilinmeyen hata' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Test payment processing
async function processTestPayment(request: PaymentRequest, paymentId: string) {
  console.log('[TEST_PAYMENT] Processing test payment...');
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    providerPaymentId: `test_${Date.now()}`,
    providerTransactionId: `test_tx_${Date.now()}`,
    status: 'success',
    providerResponse: {
      status: 'success',
      testMode: true,
      amount: request.feeBreakdown.totalAmount
    }
  };
}

// Iyzico payment processing (mock implementation)
async function processIyzicoPayment(request: PaymentRequest, paymentId: string) {
  console.log('[IYZICO_PAYMENT] Processing Iyzico payment...');
  
  // In real implementation, this would call Iyzico API
  // For now, return mock success response
  
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    success: true,
    providerPaymentId: `iyzico_${Date.now()}`,
    providerTransactionId: `iyzico_tx_${Date.now()}`,
    status: 'success',
    redirectUrl: `https://sandbox-api.iyzipay.com/3dsecure?token=mock_token_${Date.now()}`,
    providerResponse: {
      status: 'success',
      paymentId: `iyzico_${Date.now()}`,
      conversationId: paymentId,
      currency: 'TRY',
      paidPrice: request.feeBreakdown.totalAmount
    }
  };
}

// Stripe payment processing (mock implementation)
async function processStripePayment(request: PaymentRequest, paymentId: string) {
  console.log('[STRIPE_PAYMENT] Processing Stripe payment...');
  
  // In real implementation, this would call Stripe API
  // For now, return mock success response
  
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    success: true,
    providerPaymentId: `pi_${Date.now()}`,
    providerTransactionId: `ch_${Date.now()}`,
    status: 'success',
    providerResponse: {
      id: `pi_${Date.now()}`,
      amount: Math.round(request.feeBreakdown.totalAmount * 100), // Stripe uses cents
      currency: 'try',
      status: 'succeeded'
    }
  };
}

// Create comprehensive financial transaction flow
async function createFinancialTransactionFlow(
  supabaseClient: any,
  payment: any,
  request: PaymentRequest,
  paymentResult: any
) {
  const transactions = [
    {
      payment_id: payment.id,
      device_id: request.deviceId,
      from_user_id: request.payerId,
      to_user_id: null,
      transaction_type: 'payment_received',
      amount: request.feeBreakdown.totalAmount,
      currency: 'TRY',
      status: paymentResult.success ? 'completed' : 'failed',
      description: 'Payment received from device owner',
      external_transaction_id: paymentResult.providerTransactionId
    },
    {
      payment_id: payment.id,
      device_id: request.deviceId,
      from_user_id: request.payerId,
      to_user_id: request.receiverId,
      transaction_type: 'escrow_hold',
      amount: request.feeBreakdown.totalAmount,
      currency: 'TRY',
      status: paymentResult.success ? 'completed' : 'failed',
      description: 'Payment held in escrow pending exchange completion'
    }
  ];

  // Only create pending deduction records if payment was successful
  if (paymentResult.success) {
    transactions.push(
      {
        payment_id: payment.id,
        device_id: request.deviceId,
        from_user_id: null,
        to_user_id: null,
        transaction_type: 'service_fee_deduction',
        amount: -request.feeBreakdown.serviceFee,
        currency: 'TRY',
        status: 'pending',
        description: 'Platform service fee (15%)'
      },
      {
        payment_id: payment.id,
        device_id: request.deviceId,
        from_user_id: null,
        to_user_id: null,
        transaction_type: 'gateway_fee_deduction',
        amount: -request.feeBreakdown.gatewayFee,
        currency: 'TRY',
        status: 'pending',
        description: 'Payment gateway processing fee'
      },
      {
        payment_id: payment.id,
        device_id: request.deviceId,
        from_user_id: null,
        to_user_id: null,
        transaction_type: 'cargo_fee_deduction',
        amount: -request.feeBreakdown.cargoFee,
        currency: 'TRY',
        status: 'pending',
        description: 'Cargo shipping fee'
      },
      {
        payment_id: payment.id,
        device_id: request.deviceId,
        from_user_id: null,
        to_user_id: request.receiverId,
        transaction_type: 'reward_payout',
        amount: request.feeBreakdown.netPayout,
        currency: 'TRY',
        status: 'pending',
        description: 'Reward payout to finder (after service fee)'
      }
    );
  }

  // Insert all transactions
  const { error } = await supabaseClient
    .from('financial_transactions')
    .insert(transactions);

  if (error) {
    console.error('[PROCESS_PAYMENT] Financial transactions creation error:', error);
  } else {
    console.log('[PROCESS_PAYMENT] ✅ Financial transaction flow created');
  }
}