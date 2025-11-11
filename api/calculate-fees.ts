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
  CARGO_FEE: 250.0,
  REWARD_PERCENTAGE: 20,
  GATEWAY_FEE_PERCENTAGE: 3.43,
  MIN_TOTAL_AMOUNT: 500,
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

    const totalAmountRaw =
      customRewardAmount && customRewardAmount > 0
        ? customRewardAmount
        : deviceModel.ifoundanapple_fee || deviceModel.repair_price || 0;

    const totalAmount = Math.max(
      Math.round(totalAmountRaw * 100) / 100,
      FIXED_FEES.MIN_TOTAL_AMOUNT
    );

    const rewardAmount =
      Math.round(
        totalAmount * (FIXED_FEES.REWARD_PERCENTAGE / 100) * 100
      ) / 100;
    const cargoFee = FIXED_FEES.CARGO_FEE;
    const gatewayFee =
      Math.round(
        totalAmount * (FIXED_FEES.GATEWAY_FEE_PERCENTAGE / 100) * 100
      ) / 100;
    const serviceFee = Math.max(
      Math.round((totalAmount - rewardAmount - cargoFee - gatewayFee) * 100) /
        100,
      0
    );
    const netPayout = rewardAmount;

    const feeBreakdown: FeeBreakdown = {
      rewardAmount,
      cargoFee,
      serviceFee,
      gatewayFee,
      totalAmount,
      netPayout: rewardAmount,
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
