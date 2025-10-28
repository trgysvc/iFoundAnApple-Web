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
  CARGO_FEE: 250.0, // PROCESS_FLOW'a göre 250.00 TL
  GATEWAY_FEE_PERCENTAGE: 3.43, // PROCESS_FLOW'a göre %3.43
  REWARD_PERCENTAGE: 20, // PROCESS_FLOW'a göre %20
  MIN_REWARD_AMOUNT: 100,
  MAX_REWARD_AMOUNT: 5000,
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

    // Database'den ifoundanapple_fee çek
    const ifoundanappleFee = deviceModel.ifoundanapple_fee || 0;
    
    if (ifoundanappleFee <= 0) {
      // Fallback: repair_price varsa onu kullan
      const totalAmount = deviceModel.repair_price || 1000;
      const gatewayFee = Math.round(totalAmount * 0.0343 * 100) / 100;
      const cargoFee = FIXED_FEES.CARGO_FEE;
      const rewardAmount = Math.round(totalAmount * 0.20 * 100) / 100;
      const serviceFee = Math.round((totalAmount - gatewayFee - cargoFee - rewardAmount) * 100) / 100;
      const netPayout = rewardAmount;
      
      return {
        rewardAmount,
        cargoFee,
        serviceFee,
        gatewayFee,
        totalAmount,
        netPayout,
        originalRepairPrice: deviceModel.repair_price || 0,
        deviceModel: deviceModel.model_name,
        category: deviceModel.category || 'Unknown',
      };
    }

    // PROCESS_FLOW.md formülüne göre hesaplama:
    // totalAmount = ifoundanapple_fee (müşteriden alınacak toplam)
    // gatewayFee = totalAmount * 0.0343 (%3.43)
    // cargoFee = 250.00 TL (sabit)
    // rewardAmount = totalAmount * 0.20 (%20)
    // serviceFee = totalAmount - gatewayFee - cargoFee - rewardAmount
    // netPayout = rewardAmount
    
    const totalAmount = ifoundanappleFee;
    const gatewayFee = Math.round(totalAmount * 0.0343 * 100) / 100;
    const cargoFee = FIXED_FEES.CARGO_FEE; // 250.00 TL
    const rewardAmount = Math.round(totalAmount * 0.20 * 100) / 100;
    const serviceFee = Math.round((totalAmount - gatewayFee - cargoFee - rewardAmount) * 100) / 100;
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
