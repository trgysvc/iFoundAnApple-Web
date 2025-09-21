/**
 * Supabase Edge Function: Release Escrow
 * Escrow fonlarını serbest bırakma ve bulan kişiye ödeme yapma
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EscrowReleaseRequest {
  escrowId?: string;
  paymentId?: string;
  deviceId?: string;
  releaseReason: string;
  confirmationType: 'device_received' | 'exchange_confirmed' | 'manual_release' | 'timeout_release';
  confirmedBy: string; // User ID who is confirming
  additionalNotes?: string;
}

interface EscrowReleaseResponse {
  success: boolean;
  transactionId?: string;
  status: 'released' | 'failed' | 'pending';
  netPayoutAmount?: number;
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

    const releaseRequest: EscrowReleaseRequest = await req.json();
    
    console.log('[RELEASE_ESCROW] Escrow release request received:', {
      escrowId: releaseRequest.escrowId,
      paymentId: releaseRequest.paymentId,
      deviceId: releaseRequest.deviceId,
      confirmationType: releaseRequest.confirmationType,
      confirmedBy: releaseRequest.confirmedBy
    });

    // Input validation
    if (!releaseRequest.escrowId && !releaseRequest.paymentId && !releaseRequest.deviceId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'escrowId, paymentId veya deviceId gerekli' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!releaseRequest.confirmedBy || !releaseRequest.releaseReason) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'confirmedBy ve releaseReason gerekli' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Find escrow account
    let escrowQuery = supabaseClient
      .from('escrow_accounts')
      .select(`
        *,
        payments!escrow_accounts_payment_id_fkey(*),
        devices!escrow_accounts_device_id_fkey(*)
      `);

    if (releaseRequest.escrowId) {
      escrowQuery = escrowQuery.eq('id', releaseRequest.escrowId);
    } else if (releaseRequest.paymentId) {
      escrowQuery = escrowQuery.eq('payment_id', releaseRequest.paymentId);
    } else if (releaseRequest.deviceId) {
      escrowQuery = escrowQuery.eq('device_id', releaseRequest.deviceId);
    }

    const { data: escrowAccounts, error: escrowError } = await escrowQuery;

    if (escrowError || !escrowAccounts || escrowAccounts.length === 0) {
      console.error('[RELEASE_ESCROW] Escrow account not found:', escrowError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Escrow hesabı bulunamadı' 
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const escrowAccount = escrowAccounts[0];

    // Check if escrow is in valid state for release
    if (escrowAccount.status !== 'held') {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Escrow durumu serbest bırakma için uygun değil: ${escrowAccount.status}` 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verify user authorization
    const isAuthorized = await verifyReleaseAuthorization(
      supabaseClient,
      escrowAccount,
      releaseRequest.confirmedBy,
      releaseRequest.confirmationType
    );

    if (!isAuthorized.success) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: isAuthorized.error || 'Yetkisiz erişim' 
        }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Add confirmation to escrow account
    const existingConfirmations = escrowAccount.confirmations || [];
    const newConfirmation = {
      type: releaseRequest.confirmationType,
      userId: releaseRequest.confirmedBy,
      timestamp: new Date().toISOString(),
      notes: releaseRequest.additionalNotes
    };

    const updatedConfirmations = [...existingConfirmations, newConfirmation];

    // Check if all required confirmations are received
    const releaseConditions = escrowAccount.release_conditions || [];
    const confirmationTypes = updatedConfirmations.map(c => c.type);
    
    const requiredConfirmations = [
      'device_received',
      'exchange_confirmed'
    ];

    const allConditionsMet = requiredConfirmations.every(
      required => confirmationTypes.includes(required) || releaseRequest.confirmationType === 'manual_release'
    );

    let escrowStatus = 'held';
    let shouldReleaseFunds = false;

    if (allConditionsMet || releaseRequest.confirmationType === 'manual_release' || releaseRequest.confirmationType === 'timeout_release') {
      escrowStatus = 'released';
      shouldReleaseFunds = true;
      console.log('[RELEASE_ESCROW] 🚀 All conditions met, releasing funds...');
    } else {
      console.log('[RELEASE_ESCROW] ⏳ Additional confirmations needed:', {
        required: requiredConfirmations,
        received: confirmationTypes
      });
    }

    // Update escrow account
    const escrowUpdateData: any = {
      confirmations: updatedConfirmations,
      status: escrowStatus
    };

    if (shouldReleaseFunds) {
      escrowUpdateData.released_at = new Date().toISOString();
      escrowUpdateData.release_reason = releaseRequest.releaseReason;
    }

    const { error: updateError } = await supabaseClient
      .from('escrow_accounts')
      .update(escrowUpdateData)
      .eq('id', escrowAccount.id);

    if (updateError) {
      console.error('[RELEASE_ESCROW] Escrow update error:', updateError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Escrow güncelleme hatası' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    let transactionId: string | undefined;
    let netPayoutAmount = 0;

    // If funds should be released, process the payout
    if (shouldReleaseFunds) {
      // Update payment status
      await supabaseClient
        .from('payments')
        .update({
          escrow_status: 'released',
          escrow_released_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', escrowAccount.payment_id);

      // Complete all pending financial transactions
      await supabaseClient
        .from('financial_transactions')
        .update({
          status: 'completed',
          processed_at: new Date().toISOString(),
          completed_at: new Date().toISOString()
        })
        .eq('payment_id', escrowAccount.payment_id)
        .eq('status', 'pending');

      // Create final payout transaction record
      const payoutTransactionData = {
        payment_id: escrowAccount.payment_id,
        device_id: escrowAccount.device_id,
        from_user_id: escrowAccount.holder_user_id,
        to_user_id: escrowAccount.beneficiary_user_id,
        transaction_type: 'reward_payout_completed',
        amount: escrowAccount.net_payout,
        currency: 'TRY',
        status: 'completed',
        description: `Final reward payout: ${releaseRequest.releaseReason}`,
        completed_at: new Date().toISOString()
      };

      const { data: payoutTransaction, error: payoutError } = await supabaseClient
        .from('financial_transactions')
        .insert([payoutTransactionData])
        .select()
        .single();

      if (payoutError) {
        console.error('[RELEASE_ESCROW] Payout transaction creation error:', payoutError);
      } else {
        transactionId = payoutTransaction.id;
        netPayoutAmount = escrowAccount.net_payout;
        console.log('[RELEASE_ESCROW] ✅ Payout transaction created:', transactionId);
      }

      // In a real implementation, here you would:
      // 1. Call payment provider API to transfer funds to finder's account
      // 2. Send notification to both parties
      // 3. Update device status if needed

      console.log('[RELEASE_ESCROW] ✅ Escrow funds released successfully');
    }

    // Create audit log
    await supabaseClient
      .from('audit_logs')
      .insert([
        {
          event_type: 'escrow_management',
          event_category: 'payment',
          event_action: shouldReleaseFunds ? 'escrow_released' : 'escrow_confirmation_added',
          event_description: `Escrow ${shouldReleaseFunds ? 'released' : 'confirmation added'}: ${releaseRequest.releaseReason}`,
          user_id: releaseRequest.confirmedBy,
          resource_type: 'escrow_account',
          resource_id: escrowAccount.id,
          event_data: {
            escrowId: escrowAccount.id,
            paymentId: escrowAccount.payment_id,
            deviceId: escrowAccount.device_id,
            confirmationType: releaseRequest.confirmationType,
            released: shouldReleaseFunds,
            netPayoutAmount: shouldReleaseFunds ? escrowAccount.net_payout : 0
          }
        }
      ]);

    const response: EscrowReleaseResponse = {
      success: true,
      transactionId,
      status: shouldReleaseFunds ? 'released' : 'pending',
      netPayoutAmount: shouldReleaseFunds ? netPayoutAmount : undefined
    };

    console.log('[RELEASE_ESCROW] ✅ Escrow release process completed:', response);

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('[RELEASE_ESCROW] Error:', error);
    
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

// Verify if user is authorized to release escrow
async function verifyReleaseAuthorization(
  supabaseClient: any,
  escrowAccount: any,
  userId: string,
  confirmationType: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Device owner can confirm device received
    if (confirmationType === 'device_received' && escrowAccount.holder_user_id === userId) {
      return { success: true };
    }

    // Finder can confirm exchange completed
    if (confirmationType === 'exchange_confirmed' && escrowAccount.beneficiary_user_id === userId) {
      return { success: true };
    }

    // Check if user is involved in the transaction
    if (escrowAccount.holder_user_id === userId || escrowAccount.beneficiary_user_id === userId) {
      return { success: true };
    }

    // Check if user is admin (in real implementation, check admin role)
    if (confirmationType === 'manual_release') {
      // For now, allow manual release for any authenticated user
      // In production, implement proper admin role checking
      return { success: true };
    }

    // Timeout release can be triggered by system or admin
    if (confirmationType === 'timeout_release') {
      return { success: true };
    }

    return { success: false, error: 'Bu işlem için yetkiniz bulunmamaktadır' };
  } catch (error) {
    return { success: false, error: 'Yetki kontrolü hatası' };
  }
}