/**
 * Local API: Calculate Fees
 * Dinamik ücret hesaplama servisi
 */

import { createClient } from "@supabase/supabase-js";
import { getSecureConfig } from "../utils/security.ts";

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
  CARGO_FEE: 25.0,
  SERVICE_FEE_PERCENTAGE: 15,
  GATEWAY_FEE_PERCENTAGE: 2.9,
  MIN_REWARD_AMOUNT: 100,
  MAX_REWARD_AMOUNT: 5000,
};

export async function calculateFeesAPI(
  request: FeeCalculationRequest
): Promise<FeeBreakdown> {
  try {
    // Initialize Supabase client
    const config = getSecureConfig();
    const supabaseClient = createClient(
      config.supabaseUrl,
      config.supabaseServiceKey || config.supabaseAnonKey
    );

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

    // Calculate reward amount
    let rewardAmount = customRewardAmount || deviceModel.repair_price * 0.3;
    rewardAmount = Math.max(
      FIXED_FEES.MIN_REWARD_AMOUNT,
      Math.min(rewardAmount, FIXED_FEES.MAX_REWARD_AMOUNT)
    );

    // Calculate fees
    const cargoFee = FIXED_FEES.CARGO_FEE;
    const serviceFee = rewardAmount * (FIXED_FEES.SERVICE_FEE_PERCENTAGE / 100);
    const gatewayFee = rewardAmount * (FIXED_FEES.GATEWAY_FEE_PERCENTAGE / 100);
    const totalAmount = rewardAmount + cargoFee + serviceFee + gatewayFee;
    const netPayout = rewardAmount - serviceFee;

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
