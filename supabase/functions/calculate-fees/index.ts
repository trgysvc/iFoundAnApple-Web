/**
 * Supabase Edge Function: Calculate Fees
 * Dinamik ücret hesaplama servisi
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FeeCalculationRequest {
  deviceModelId?: string;
  deviceModelName?: string;
  customRewardAmount?: number;
}

interface FeeBreakdown {
  rewardAmount: number;
  cargoFee: number;
  serviceFee: number;
  gatewayFee: number;
  totalAmount: number;
  netPayout: number;
  originalRepairPrice: number;
  deviceModel: string;
  category: string;
}

const FIXED_FEES = {
  CARGO_FEE: 25.00,
  SERVICE_FEE_PERCENTAGE: 15,
  GATEWAY_FEE_PERCENTAGE: 2.9,
  MIN_REWARD_AMOUNT: 100,
  MAX_REWARD_AMOUNT: 5000,
};

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

    const { deviceModelId, deviceModelName, customRewardAmount }: FeeCalculationRequest = await req.json();

    console.log('[CALCULATE_FEES] Request received:', { deviceModelId, deviceModelName, customRewardAmount });

    // Input validation
    if (!deviceModelId && !deviceModelName) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'deviceModelId veya deviceModelName gerekli' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get device model from database
    let query = supabaseClient
      .from('device_models')
      .select('*')
      .eq('is_active', true);

    if (deviceModelId) {
      query = query.eq('id', deviceModelId);
    } else if (deviceModelName) {
      query = query.eq('name', deviceModelName);
    }

    const { data: deviceModel, error: modelError } = await query.single();

    if (modelError || !deviceModel) {
      console.error('[CALCULATE_FEES] Model not found:', modelError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Cihaz modeli bulunamadı' 
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Calculate fees
    let rewardAmount: number;
    
    if (customRewardAmount && customRewardAmount > 0) {
      // Use custom reward amount (within limits)
      rewardAmount = Math.max(
        FIXED_FEES.MIN_REWARD_AMOUNT,
        Math.min(customRewardAmount, FIXED_FEES.MAX_REWARD_AMOUNT)
      );
      console.log('[CALCULATE_FEES] Using custom reward amount:', rewardAmount);
    } else {
      // Use database iFoundAnApple fee
      rewardAmount = deviceModel.ifoundanapple_fee;
      console.log('[CALCULATE_FEES] Using database reward amount:', rewardAmount);
    }

    // Calculate other fees
    const cargoFee = FIXED_FEES.CARGO_FEE;
    const serviceFee = Math.round(rewardAmount * (FIXED_FEES.SERVICE_FEE_PERCENTAGE / 100) * 100) / 100;
    
    // Calculate total (reward + cargo + service fee)
    const subtotal = rewardAmount + cargoFee + serviceFee;
    
    // Calculate gateway fee
    const gatewayFee = Math.round(subtotal * (FIXED_FEES.GATEWAY_FEE_PERCENTAGE / 100) * 100) / 100;
    
    // Final total
    const totalAmount = subtotal + gatewayFee;
    
    // Net payout to finder (reward - service fee)
    const netPayout = rewardAmount - serviceFee;

    const feeBreakdown: FeeBreakdown = {
      rewardAmount,
      cargoFee,
      serviceFee,
      gatewayFee,
      totalAmount,
      netPayout,
      originalRepairPrice: deviceModel.repair_price,
      deviceModel: deviceModel.name,
      category: deviceModel.category
    };

    console.log('[CALCULATE_FEES] ✅ Fee calculation completed:', feeBreakdown);

    // Log the calculation for audit purposes
    await supabaseClient
      .from('audit_logs')
      .insert([
        {
          event_type: 'fee_calculation',
          event_category: 'payment',
          event_action: 'calculate_fees',
          event_description: `Fee calculation for ${deviceModel.name}`,
          resource_type: 'device_model',
          resource_id: deviceModel.id,
          event_data: {
            deviceModel: deviceModel.name,
            customRewardAmount,
            calculatedFees: feeBreakdown
          }
        }
      ]);

    return new Response(
      JSON.stringify({ 
        success: true, 
        fees: feeBreakdown,
        deviceModel: {
          id: deviceModel.id,
          name: deviceModel.name,
          category: deviceModel.category,
          repairPrice: deviceModel.repair_price,
          specifications: deviceModel.specifications
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('[CALCULATE_FEES] Error:', error);
    
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