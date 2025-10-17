/**
 * Local API: Calculate Fees
 * Dinamik ücret hesaplama servisi
 */

import { getSecureConfig } from "../utils/security.ts";
import { supabase as defaultSupabase } from "../utils/supabaseClient.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
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
  CARGO_FEE: 250.0, // Kargo ücreti (sabit TL)
  REWARD_PERCENTAGE: 20, // Bulan kişiye ödül (%20 of total)
  GATEWAY_FEE_PERCENTAGE: 3.43, // Ödeme sağlayıcı komisyonu (%3.43 of total)
  MIN_REWARD_AMOUNT: 100,
  MAX_REWARD_AMOUNT: 5000,
  // Hizmet bedeli = total - gateway_fee - cargo_fee - reward_amount (geriye kalan)
};

export async function calculateFeesAPI(
  request: FeeCalculationRequest
): Promise<FeeBreakdown> {
  try {
    // Use the centralized Supabase client
    const supabaseClient = defaultSupabase;

    const { deviceModelId, deviceModelName, customRewardAmount } = request;

    // Validate input
    if (!deviceModelId && !deviceModelName) {
      throw new Error("Either deviceModelId or deviceModelName is required");
    }

    let deviceModel;

    // Get device model from database
    if (deviceModelId) {
      const { data: modelData, error: modelError } = await supabaseClient
        .from("device_models")
        .select("*")
        .eq("id", deviceModelId)
        .single();

      if (modelError || !modelData) {
        throw new Error(`Device model not found: ${modelError?.message}`);
      }
      deviceModel = modelData;
    } else if (deviceModelName) {
      const { data: modelData, error: modelError } = await supabaseClient
        .from("device_models")
        .select("*")
        .eq("model_name", deviceModelName)
        .single();

      if (modelError || !modelData) {
        throw new Error(`Device model not found: ${modelError?.message}`);
      }
      deviceModel = modelData;
    }

    // ifoundanapple_fee = müşteriden alınacak toplam tutar (gross)
    const totalAmount = deviceModel.ifoundanapple_fee || deviceModel.repair_price * 0.4;
    
    // Gateway komisyonu (toplam üzerinden %3.43)
    const gatewayFee = totalAmount * (FIXED_FEES.GATEWAY_FEE_PERCENTAGE / 100);
    
    // Net tutar (gateway komisyonu düşüldükten sonra)
    const netAmount = totalAmount - gatewayFee;
    
    // Sabit kargo ücreti
    const cargoFee = FIXED_FEES.CARGO_FEE;
    
    // Bulan kişiye ödül (net tutarın %20'si)
    const rewardAmount = netAmount * (FIXED_FEES.REWARD_PERCENTAGE / 100);
    
    // Hizmet bedeli (geriye kalan)
    const serviceFee = netAmount - cargoFee - rewardAmount;
    
    // Bulan kişiye net ödeme (ödül)
    const netPayout = rewardAmount;

    const feeBreakdown: FeeBreakdown = {
      rewardAmount,
      cargoFee,
      serviceFee,
      gatewayFee,
      totalAmount,
      netPayout,
      originalRepairPrice: deviceModel.repair_price,
      deviceModel: deviceModel.model_name,
      category: deviceModel.category,
    };

    console.log("[CALCULATE_FEES] Fee calculation completed:", feeBreakdown);
    return feeBreakdown;
  } catch (error) {
    console.error("[CALCULATE_FEES] Error:", error);
    throw error;
  }
}

// For direct function calls (not HTTP)
export async function calculateFeesLocal(
  deviceModelName: string,
  customRewardAmount?: number
): Promise<FeeBreakdown> {
  return await calculateFeesAPI({
    deviceModelName,
    customRewardAmount,
  });
}
