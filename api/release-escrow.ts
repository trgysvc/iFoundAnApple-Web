/**
 * Local API: Release Escrow
 * Escrow fonlarını serbest bırakma ve bulan kişiye ödeme yapma
 */

import { createClient } from '@supabase/supabase-js';
import { getSecureConfig } from '../utils/security.ts';

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

export async function releaseEscrowAPI(request: EscrowReleaseRequest): Promise<EscrowReleaseResponse> {
  try {
    // Initialize Supabase client
    const { supabaseUrl, supabaseServiceKey } = getSecureConfig();
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    const {
      escrowId,
      paymentId,
      deviceId,
      releaseReason,
      confirmationType,
      confirmedBy,
      additionalNotes
    } = request;

    console.log('[RELEASE_ESCROW] Escrow release request received:', {
      escrowId,
      paymentId,
      deviceId,
      confirmationType,
      confirmedBy
    });

    // Find escrow record
    let escrowRecord;
    if (escrowId) {
      const { data, error } = await supabaseClient
        .from('escrow_accounts')
        .select('*')
        .eq('id', escrowId)
        .single();

      if (error || !data) {
        throw new Error(`Escrow record not found: ${error?.message}`);
      }
      escrowRecord = data;
    } else if (paymentId) {
      const { data, error } = await supabaseClient
        .from('escrow_accounts')
        .select('*')
        .eq('payment_id', paymentId)
        .single();

      if (error || !data) {
        throw new Error(`Escrow record not found for payment: ${error?.message}`);
      }
      escrowRecord = data;
    } else if (deviceId) {
      const { data, error } = await supabaseClient
        .from('escrow_accounts')
        .select('*')
        .eq('device_id', deviceId)
        .eq('status', 'held')
        .single();

      if (error || !data) {
        throw new Error(`Escrow record not found for device: ${error?.message}`);
      }
      escrowRecord = data;
    } else {
      throw new Error('Either escrowId, paymentId, or deviceId is required');
    }

    // Check if escrow is in correct status
    if (escrowRecord.status !== 'held') {
      throw new Error(`Escrow is not in 'held' status. Current status: ${escrowRecord.status}`);
    }

    // Get payment details
    const { data: paymentData, error: paymentError } = await supabaseClient
      .from('payments')
      .select('*')
      .eq('id', escrowRecord.payment_id)
      .single();

    if (paymentError || !paymentData) {
      throw new Error(`Payment record not found: ${paymentError?.message}`);
    }

    // Validate release conditions
    const canRelease = await validateReleaseConditions(
      escrowRecord,
      paymentData,
      confirmationType,
      confirmedBy,
      supabaseClient
    );

    if (!canRelease) {
      throw new Error('Release conditions not met');
    }

    // Calculate net payout
    const netPayoutAmount = paymentData.net_payout || paymentData.reward_amount;

    // Create financial transaction record
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const { data: transactionData, error: transactionError } = await supabaseClient
      .from('financial_transactions')
      .insert({
        id: transactionId,
        escrow_id: escrowRecord.id,
        payment_id: paymentData.id,
        device_id: escrowRecord.device_id,
        transaction_type: 'escrow_release',
        amount: netPayoutAmount,
        status: 'completed',
        description: `Escrow release: ${releaseReason}`,
        confirmed_by: confirmedBy,
        confirmation_type: confirmationType,
        additional_notes: additionalNotes,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (transactionError) {
      throw new Error(`Failed to create transaction record: ${transactionError.message}`);
    }

    // Update escrow status
    const { error: escrowUpdateError } = await supabaseClient
      .from('escrow_accounts')
      .update({
        status: 'released',
        released_at: new Date().toISOString(),
        release_reason: releaseReason,
        released_by: confirmedBy,
        updated_at: new Date().toISOString(),
      })
      .eq('id', escrowRecord.id);

    if (escrowUpdateError) {
      throw new Error(`Failed to update escrow status: ${escrowUpdateError.message}`);
    }

    // Update payment status
    const { error: paymentUpdateError } = await supabaseClient
      .from('payments')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', paymentData.id);

    if (paymentUpdateError) {
      console.error('[RELEASE_ESCROW] Failed to update payment status:', paymentUpdateError);
    }

    // Update device status
    const { error: deviceUpdateError } = await supabaseClient
      .from('devices')
      .update({
        status: 'payment_completed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', escrowRecord.device_id);

    if (deviceUpdateError) {
      console.error('[RELEASE_ESCROW] Failed to update device status:', deviceUpdateError);
    }

    const response: EscrowReleaseResponse = {
      success: true,
      transactionId,
      status: 'released',
      netPayoutAmount,
    };

    console.log('[RELEASE_ESCROW] Escrow release completed:', response);
    return response;

  } catch (error) {
    console.error('[RELEASE_ESCROW] Error:', error);
    return {
      success: false,
      status: 'failed',
      errorMessage: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

async function validateReleaseConditions(
  escrowRecord: any,
  paymentData: any,
  confirmationType: string,
  confirmedBy: string,
  supabaseClient: any
): Promise<boolean> {
  // Check if user has permission to release
  if (confirmationType === 'manual_release') {
    // Only admin users can manually release
    const { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select('role')
      .eq('id', confirmedBy)
      .single();

    if (userError || !userData || userData.role !== 'admin') {
      return false;
    }
  }

  // Check if device is in correct status
  if (confirmationType === 'device_received') {
    const { data: deviceData, error: deviceError } = await supabaseClient
      .from('devices')
      .select('status')
      .eq('id', escrowRecord.device_id)
      .single();

    if (deviceError || !deviceData || deviceData.status !== 'matched') {
      return false;
    }
  }

  // Check timeout conditions
  if (confirmationType === 'timeout_release') {
    const escrowCreatedAt = new Date(escrowRecord.created_at);
    const now = new Date();
    const daysDiff = (now.getTime() - escrowCreatedAt.getTime()) / (1000 * 60 * 60 * 24);
    
    // Release after 30 days if no action taken
    if (daysDiff < 30) {
      return false;
    }
  }

  return true;
}

// For direct function calls (not HTTP)
export async function releaseEscrowLocal(request: EscrowReleaseRequest): Promise<EscrowReleaseResponse> {
  return await releaseEscrowAPI(request);
}
