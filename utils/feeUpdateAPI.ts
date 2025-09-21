/**
 * Ücret Güncelleme API'si
 * Database'deki ifoundanapple_fee değerlerini dinamik olarak günceller
 */

import { createClient } from "@supabase/supabase-js";
import { getSecureConfig } from "./security.ts";

const { supabaseUrl, supabaseAnonKey } = getSecureConfig();
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface FeeUpdateRequest {
  deviceModelId?: string;
  deviceModelName?: string;
  newIfoundappleFee: number;
  newFeePercentage?: number;
  reason?: string;
}

export interface BulkFeeUpdateRequest {
  updates: Array<{
    deviceModelName: string;
    newIfoundappleFee: number;
    newFeePercentage?: number;
  }>;
  reason?: string;
}

/**
 * Tek bir cihaz modelinin ücretini güncelle
 */
export const updateDeviceModelFee = async (
  request: FeeUpdateRequest
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> => {
  try {
    console.log("[FEE_UPDATE] Ücret güncelleme başlatılıyor:", request);

    let query = supabase.from("device_models");

    // ID veya isim ile filtreleme
    if (request.deviceModelId) {
      query = query.eq("id", request.deviceModelId);
    } else if (request.deviceModelName) {
      query = query.eq("name", request.deviceModelName);
    } else {
      return {
        success: false,
        error: "Device model ID veya name belirtilmeli",
      };
    }

    // Güncelleme verilerini hazırla
    const updateData: any = {
      ifoundanapple_fee: request.newIfoundappleFee,
      updated_at: new Date().toISOString(),
    };

    if (request.newFeePercentage !== undefined) {
      updateData.fee_percentage = request.newFeePercentage;
    }

    const { data, error } = await query.update(updateData);

    if (error) {
      console.error("[FEE_UPDATE] Database güncelleme hatası:", error);
      return { success: false, error: error.message };
    }

    // Audit log kaydet
    await logFeeUpdate({
      action: "UPDATE_SINGLE",
      deviceModelId: request.deviceModelId,
      deviceModelName: request.deviceModelName,
      oldFee: null, // Eski değeri almak için ek sorgu gerekir
      newFee: request.newIfoundappleFee,
      reason: request.reason,
    });

    console.log("[FEE_UPDATE] ✅ Ücret başarıyla güncellendi");
    return {
      success: true,
      message: `${
        request.deviceModelName || request.deviceModelId
      } modeli için ücret ${request.newIfoundappleFee} TL olarak güncellendi`,
    };
  } catch (error) {
    console.error("[FEE_UPDATE] Genel hata:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Bilinmeyen hata",
    };
  }
};

/**
 * Toplu ücret güncelleme
 */
export const bulkUpdateDeviceModelFees = async (
  request: BulkFeeUpdateRequest
): Promise<{
  success: boolean;
  successCount?: number;
  failureCount?: number;
  errors?: string[];
  message?: string;
}> => {
  try {
    console.log(
      "[FEE_UPDATE] Toplu ücret güncelleme başlatılıyor:",
      request.updates.length,
      "model"
    );

    const results = [];
    const errors = [];

    for (const update of request.updates) {
      try {
        const result = await updateDeviceModelFee({
          deviceModelName: update.deviceModelName,
          newIfoundappleFee: update.newIfoundappleFee,
          newFeePercentage: update.newFeePercentage,
          reason: request.reason,
        });

        results.push(result);
        if (!result.success) {
          errors.push(`${update.deviceModelName}: ${result.error}`);
        }
      } catch (error) {
        errors.push(
          `${update.deviceModelName}: ${
            error instanceof Error ? error.message : "Bilinmeyen hata"
          }`
        );
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.filter((r) => !r.success).length;

    console.log("[FEE_UPDATE] ✅ Toplu güncelleme tamamlandı:", {
      successCount,
      failureCount,
    });

    return {
      success: failureCount === 0,
      successCount,
      failureCount,
      errors: errors.length > 0 ? errors : undefined,
      message: `${successCount} model başarıyla güncellendi${
        failureCount > 0 ? `, ${failureCount} model başarısız` : ""
      }`,
    };
  } catch (error) {
    console.error("[FEE_UPDATE] Toplu güncelleme genel hatası:", error);
    return {
      success: false,
      errors: [error instanceof Error ? error.message : "Bilinmeyen hata"],
      message: "Toplu güncelleme başarısız",
    };
  }
};

/**
 * Kategori bazlı ücret güncelleme
 */
export const updateCategoryFees = async (
  category: string,
  multiplier: number,
  reason?: string
): Promise<{
  success: boolean;
  updatedCount?: number;
  message?: string;
  error?: string;
}> => {
  try {
    console.log("[FEE_UPDATE] Kategori bazlı güncelleme:", {
      category,
      multiplier,
    });

    // Önce kategorideki tüm modelleri al
    const { data: models, error: fetchError } = await supabase
      .from("device_models")
      .select("id, name, ifoundanapple_fee")
      .eq("category", category)
      .eq("is_active", true);

    if (fetchError) {
      return { success: false, error: fetchError.message };
    }

    if (!models || models.length === 0) {
      return {
        success: false,
        error: `${category} kategorisinde aktif model bulunamadı`,
      };
    }

    // Her model için yeni ücreti hesapla ve güncelle
    const updates = models.map((model) => ({
      id: model.id,
      newFee:
        Math.round((model.ifoundanapple_fee || 0) * multiplier * 100) / 100,
    }));

    let updatedCount = 0;
    for (const update of updates) {
      const { error } = await supabase
        .from("device_models")
        .update({
          ifoundanapple_fee: update.newFee,
          updated_at: new Date().toISOString(),
        })
        .eq("id", update.id);

      if (!error) {
        updatedCount++;
      }
    }

    // Audit log kaydet
    await logFeeUpdate({
      action: "UPDATE_CATEGORY",
      category,
      multiplier,
      updatedCount,
      reason,
    });

    console.log(
      "[FEE_UPDATE] ✅ Kategori güncelleme tamamlandı:",
      updatedCount
    );
    return {
      success: true,
      updatedCount,
      message: `${category} kategorisindeki ${updatedCount} model güncellendi (${multiplier}x çarpan)`,
    };
  } catch (error) {
    console.error("[FEE_UPDATE] Kategori güncelleme hatası:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Bilinmeyen hata",
    };
  }
};

/**
 * Ücret güncelleme loglarını kaydet
 */
const logFeeUpdate = async (logData: {
  action: string;
  deviceModelId?: string;
  deviceModelName?: string;
  category?: string;
  multiplier?: number;
  oldFee?: number | null;
  newFee?: number;
  updatedCount?: number;
  reason?: string;
}): Promise<void> => {
  try {
    const { error } = await supabase.from("fee_update_logs").insert({
      action: logData.action,
      device_model_id: logData.deviceModelId,
      device_model_name: logData.deviceModelName,
      category: logData.category,
      multiplier: logData.multiplier,
      old_fee: logData.oldFee,
      new_fee: logData.newFee,
      updated_count: logData.updatedCount,
      reason: logData.reason,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("[FEE_UPDATE] Log kaydetme hatası:", error);
    }
  } catch (error) {
    console.error("[FEE_UPDATE] Log kaydetme genel hatası:", error);
  }
};

/**
 * Tüm kategorilerin mevcut ücret istatistiklerini getir
 */
export const getFeeStatistics = async (): Promise<{
  success: boolean;
  statistics?: Array<{
    category: string;
    modelCount: number;
    avgFee: number;
    minFee: number;
    maxFee: number;
    totalFee: number;
  }>;
  error?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from("device_models")
      .select("category, ifoundanapple_fee")
      .eq("is_active", true);

    if (error) {
      return { success: false, error: error.message };
    }

    // Kategori bazlı istatistikleri hesapla
    const categoryStats = new Map();

    data?.forEach((model) => {
      const category = model.category;
      const fee = model.ifoundanapple_fee || 0;

      if (!categoryStats.has(category)) {
        categoryStats.set(category, {
          category,
          modelCount: 0,
          totalFee: 0,
          fees: [],
        });
      }

      const stats = categoryStats.get(category);
      stats.modelCount++;
      stats.totalFee += fee;
      stats.fees.push(fee);
    });

    const statistics = Array.from(categoryStats.values()).map((stats) => ({
      category: stats.category,
      modelCount: stats.modelCount,
      avgFee: Math.round((stats.totalFee / stats.modelCount) * 100) / 100,
      minFee: Math.min(...stats.fees),
      maxFee: Math.max(...stats.fees),
      totalFee: stats.totalFee,
    }));

    return { success: true, statistics };
  } catch (error) {
    console.error("[FEE_UPDATE] İstatistik getirme hatası:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Bilinmeyen hata",
    };
  }
};

/**
 * API anahtarı ile korumalı ücret güncelleme endpoint'i
 */
export const apiUpdateFees = async (
  apiKey: string,
  updates: BulkFeeUpdateRequest
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> => {
  // API anahtarı kontrolü (environment variable'dan)
  const validApiKey =
    process.env.VITE_FEE_UPDATE_API_KEY || "your-secure-api-key";

  if (apiKey !== validApiKey) {
    return { success: false, error: "Geçersiz API anahtarı" };
  }

  return await bulkUpdateDeviceModelFees(updates);
};
