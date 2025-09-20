/**
 * Dinamik Ücret Hesaplama Sistemi (Database-driven)
 * Apple cihaz onarım ücretleri ve komisyon hesaplamaları
 */

import { createClient } from '@supabase/supabase-js';
import { getSecureConfig } from './security';

const { supabaseUrl, supabaseAnonKey } = getSecureConfig();
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface FeeBreakdown {
  rewardAmount: number;          // Bulan kişiye ödenecek ödül (iFoundAnApple ücreti)
  cargoFee: number;             // Kargo ücreti
  serviceFee: number;           // Platform hizmet bedeli (%15 of reward)
  gatewayFee: number;           // Ödeme sağlayıcı komisyonu (~%2.9)
  totalAmount: number;          // Toplam ödenecek tutar
  netPayout: number;            // Bulan kişiye net ödeme (reward - service fee)
  originalRepairPrice: number;   // Orijinal onarım ücreti
  deviceModel: string;          // Cihaz modeli
  category: string;             // Cihaz kategorisi
}

export interface DeviceModelData {
  id: string;
  name: string;
  category: string;
  model_name: string;
  specifications?: string;
  repair_price: number;
  ifoundanapple_fee: number;
  fee_percentage: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Ücret yapısı - Database'den ifoundanapple_fee çekilerek hesaplanır
export const FEE_STRUCTURE = {
  CARGO_FEE: 150.00,             // Kargo ücreti (sabit TL)
  REWARD_PERCENTAGE: 20,         // Bulan kişiye ödül (%20 of ifoundanapple_fee)
  SERVICE_FEE_PERCENTAGE: 20,    // Platform hizmet bedeli (%20 of ifoundanapple_fee)  
  GATEWAY_FEE_PERCENTAGE: 5.5,   // Ödeme sağlayıcı komisyonu (%5.5 of total)
};

/**
 * Database'den tüm aktif cihaz modellerini getir
 */
export const getAllDeviceModels = async (): Promise<{
  success: boolean;
  models?: DeviceModelData[];
  error?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from('device_models')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true })
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('[FEE_CALC] Cihaz modelleri getirme hatası:', error);
      return { success: false, error: error.message };
    }

    return { success: true, models: data };
  } catch (error) {
    console.error('[FEE_CALC] Database bağlantı hatası:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    };
  }
};

/**
 * Kategoriye göre cihaz modellerini getir
 */
export const getDeviceModelsByCategory = async (category: string): Promise<{
  success: boolean;
  models?: DeviceModelData[];
  error?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from('device_models')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, models: data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    };
  }
};

/**
 * Specific model ID'ye göre cihaz bilgilerini getir
 */
export const getDeviceModelById = async (modelId: string): Promise<{
  success: boolean;
  model?: DeviceModelData;
  error?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from('device_models')
      .select('*')
      .eq('id', modelId)
      .eq('is_active', true)
      .limit(1);

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data || data.length === 0) {
      return { success: false, error: 'Model bulunamadı' };
    }

    return { success: true, model: data[0] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    };
  }
};

/**
 * Model ismine göre cihaz bilgilerini getir
 */
export const getDeviceModelByName = async (modelName: string): Promise<{
  success: boolean;
  model?: DeviceModelData;
  error?: string;
}> => {
  try {
    console.log('[FEE_CALC] Aranan model:', modelName);
    
    // İlk önce tam eşleşme dene
    let { data, error } = await supabase
      .from('device_models')
      .select('*')
      .eq('name', modelName)
      .eq('is_active', true)
      .limit(1);

    if (error) {
      console.error('[FEE_CALC] Database hatası:', error);
      return { success: false, error: error.message };
    }

    // Tam eşleşme bulunamazsa, kısmi eşleşme dene
    if (!data || data.length === 0) {
      console.log('[FEE_CALC] Tam eşleşme bulunamadı, kısmi eşleşme deneniyor...');
      
      const { data: partialData, error: partialError } = await supabase
        .from('device_models')
        .select('*')
        .ilike('name', `%${modelName}%`)
        .eq('is_active', true)
        .limit(1);

      if (partialError) {
        console.error('[FEE_CALC] Kısmi eşleşme hatası:', partialError);
        return { success: false, error: partialError.message };
      }

      if (!partialData || partialData.length === 0) {
        // Tüm modelleri listele (debug için)
        const { data: allModels } = await supabase
          .from('device_models')
          .select('name')
          .eq('is_active', true)
          .limit(10);
        
        console.log('[FEE_CALC] Mevcut modeller:', allModels?.map(m => m.name));
        return { success: false, error: `Model "${modelName}" bulunamadı` };
      }

      data = partialData;
      console.log('[FEE_CALC] Kısmi eşleşme bulundu:', data[0].name);
    }

    return { success: true, model: data[0] };
  } catch (error) {
    console.error('[FEE_CALC] Genel hata:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    };
  }
};

/**
 * Cihaz modeline göre ücret hesaplama (Sabit ödül sistemi)
 */
export const calculateFees = async (
  deviceModelId: string,
  customRewardAmount?: number
): Promise<{
  success: boolean;
  fees?: FeeBreakdown;
  error?: string;
}> => {
  try {
    console.log('[FEE_CALC] Ücret hesaplama başlatılıyor...', { deviceModelId });

    // Cihaz modelini database'den getir
    const { success, model, error } = await getDeviceModelById(deviceModelId);
    
    if (!success || !model) {
      return { success: false, error: error || 'Cihaz modeli bulunamadı' };
    }

    // Database'den ifoundanapple_fee çek
    const ifoundappleFee = model.ifoundanapple_fee || 0;
    console.log('[FEE_CALC] Database\'den ifoundanapple_fee:', ifoundappleFee);

    if (ifoundappleFee <= 0) {
      console.warn('[FEE_CALC] ifoundanapple_fee 0 veya null, fallback hesaplama yapılıyor');
      return calculateFallbackFees(model);
    }

    // Yeni ücret yapısına göre hesaplama
    const rewardAmount = Math.round(ifoundappleFee * (FEE_STRUCTURE.REWARD_PERCENTAGE / 100) * 100) / 100;
    const serviceFee = Math.round(ifoundappleFee * (FEE_STRUCTURE.SERVICE_FEE_PERCENTAGE / 100) * 100) / 100;
    const cargoFee = FEE_STRUCTURE.CARGO_FEE;
    
    // Subtotal (ifoundanapple_fee + kargo)
    const subtotal = ifoundappleFee + cargoFee;
    
    // Gateway komisyonu (toplam üzerinden %5.5)
    const gatewayFee = Math.round(subtotal * (FEE_STRUCTURE.GATEWAY_FEE_PERCENTAGE / 100) * 100) / 100;
    
    // Final toplam (ifoundanapple_fee + kargo + gateway)
    const totalAmount = subtotal + gatewayFee;
    
    // Bulan kişiye net ödeme (ödül)
    const netPayout = rewardAmount;

    const feeBreakdown: FeeBreakdown = {
      rewardAmount,
      cargoFee,
      serviceFee,
      gatewayFee,
      totalAmount,
      netPayout,
      originalRepairPrice: model.repair_price || 0,
      deviceModel: model.name,
      category: model.category
    };

    console.log('[FEE_CALC] ✅ Database-driven ücret hesaplama tamamlandı:', feeBreakdown);
    return { success: true, fees: feeBreakdown };

  } catch (error) {
    console.error('[FEE_CALC] Ücret hesaplama hatası:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    };
  }
};

/**
 * Fallback ücret hesaplama (ifoundanapple_fee 0 veya null olduğunda)
 */
const calculateFallbackFees = (model: DeviceModelData): {
  success: boolean;
  fees?: FeeBreakdown;
  error?: string;
} => {
  console.log('[FEE_CALC] Fallback hesaplama yapılıyor:', model.name);
  
  // Varsayılan ifoundanapple_fee (kategori bazlı)
  let defaultFee = 1000; // Varsayılan 1000 TL
  
  switch (model.category.toLowerCase()) {
    case 'iphone':
      defaultFee = 2000;
      break;
    case 'ipad':
      defaultFee = 1500;
      break;
    case 'macbook':
      defaultFee = 3000;
      break;
    case 'apple watch':
      defaultFee = 800;
      break;
    case 'airpods':
      defaultFee = 500;
      break;
    default:
      defaultFee = 1000;
  }

  const rewardAmount = Math.round(defaultFee * (FEE_STRUCTURE.REWARD_PERCENTAGE / 100) * 100) / 100;
  const serviceFee = Math.round(defaultFee * (FEE_STRUCTURE.SERVICE_FEE_PERCENTAGE / 100) * 100) / 100;
  const cargoFee = FEE_STRUCTURE.CARGO_FEE;
  
  const subtotal = defaultFee + cargoFee;
  const gatewayFee = Math.round(subtotal * (FEE_STRUCTURE.GATEWAY_FEE_PERCENTAGE / 100) * 100) / 100;
  const totalAmount = subtotal + gatewayFee;
  const netPayout = rewardAmount;

  const feeBreakdown: FeeBreakdown = {
    rewardAmount,
    cargoFee,
    serviceFee,
    gatewayFee,
    totalAmount,
    netPayout,
    originalRepairPrice: model.repair_price || 0,
    deviceModel: model.name,
    category: model.category
  };

  console.log('[FEE_CALC] ✅ Fallback hesaplama tamamlandı:', feeBreakdown);
  return { success: true, fees: feeBreakdown };
};

/**
 * Model ismine göre ücret hesaplama
 */
export const calculateFeesByModelName = async (
  modelName: string,
  customRewardAmount?: number
): Promise<{
  success: boolean;
  fees?: FeeBreakdown;
  error?: string;
}> => {
  try {
    console.log('[FEE_CALC] Model ismi ile hesaplama:', modelName);
    const { success, model, error } = await getDeviceModelByName(modelName);
    
    if (!success || !model) {
      console.warn('[FEE_CALC] Model bulunamadı, sabit hesaplama kullanılıyor:', error);
      
      // Model bulunamazsa sabit hesaplama yap
      return calculateFixedFees(modelName);
    }

    console.log('[FEE_CALC] Model bulundu:', model.name);
    return await calculateFees(model.id, customRewardAmount);
  } catch (error) {
    console.error('[FEE_CALC] Hesaplama hatası, sabit hesaplamaya geçiliyor:', error);
    return calculateFixedFees(modelName);
  }
};

/**
 * Model bulunamadığında sabit hesaplama yap
 */
const calculateFixedFees = (modelName: string): {
  success: boolean;
  fees?: FeeBreakdown;
  error?: string;
} => {
  console.log('[FEE_CALC] Sabit hesaplama yapılıyor:', modelName);
  
  // Kategori tahmin et
  let category = 'Unknown';
  let defaultFee = 1000;
  
  if (modelName.toLowerCase().includes('iphone')) {
    category = 'iPhone';
    defaultFee = 2000;
  } else if (modelName.toLowerCase().includes('ipad')) {
    category = 'iPad';
    defaultFee = 1500;
  } else if (modelName.toLowerCase().includes('watch')) {
    category = 'Apple Watch';
    defaultFee = 800;
  } else if (modelName.toLowerCase().includes('airpods')) {
    category = 'AirPods';
    defaultFee = 500;
  } else if (modelName.toLowerCase().includes('macbook')) {
    category = 'MacBook';
    defaultFee = 3000;
  }

  const rewardAmount = Math.round(defaultFee * (FEE_STRUCTURE.REWARD_PERCENTAGE / 100) * 100) / 100;
  const serviceFee = Math.round(defaultFee * (FEE_STRUCTURE.SERVICE_FEE_PERCENTAGE / 100) * 100) / 100;
  const cargoFee = FEE_STRUCTURE.CARGO_FEE;
  
  const subtotal = defaultFee + cargoFee;
  const gatewayFee = Math.round(subtotal * (FEE_STRUCTURE.GATEWAY_FEE_PERCENTAGE / 100) * 100) / 100;
  const totalAmount = subtotal + gatewayFee;
  const netPayout = rewardAmount;

  const feeBreakdown: FeeBreakdown = {
    rewardAmount,
    cargoFee,
    serviceFee,
    gatewayFee,
    totalAmount,
    netPayout,
    originalRepairPrice: 0,
    deviceModel: modelName,
    category
  };

  console.log('[FEE_CALC] ✅ Sabit hesaplama tamamlandı:', feeBreakdown);
  return { success: true, fees: feeBreakdown };
};

/**
 * Ücret detaylarını kullanıcı dostu formatta göster
 */
export const formatFeeBreakdown = (fees: FeeBreakdown): string => {
  return `
${fees.deviceModel} (${fees.category})
─────────────────────────────────────
Onarım Ücreti: ${fees.originalRepairPrice.toFixed(2)} TL
iFoundAnApple Ödülü: ${fees.rewardAmount.toFixed(2)} TL
Kargo Ücreti: ${fees.cargoFee.toFixed(2)} TL
Hizmet Bedeli (%15): ${fees.serviceFee.toFixed(2)} TL
Ödeme Komisyonu (%2.9): ${fees.gatewayFee.toFixed(2)} TL
─────────────────────────────────────
TOPLAM ÖDEMENİZ: ${fees.totalAmount.toFixed(2)} TL

Bulan kişiye ödenecek: ${fees.netPayout.toFixed(2)} TL
  `.trim();
};

/**
 * Kategorilerin listesini getir
 */
export const getDeviceCategories = async (): Promise<{
  success: boolean;
  categories?: string[];
  error?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from('device_models')
      .select('category')
      .eq('is_active', true);

    if (error) {
      return { success: false, error: error.message };
    }

    // Unique kategorileri al
    const uniqueCategories = [...new Set(data.map(item => item.category))].sort();
    
    return { success: true, categories: uniqueCategories };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    };
  }
};

/**
 * Ücret hesaplama örneği (Test için)
 */
export const calculateFeesExample = async () => {
  console.log('=== ÜCRET HESAPLAMA ÖRNEKLERİ ===\n');
  
  const testModels = [
    'iPhone 15 Pro Max',
    'iPad Pro 13 inch M4',
    'Apple Watch Ultra 2',
    'AirPods Pro 2nd Gen USB-C'
  ];
  
  for (const modelName of testModels) {
    const result = await calculateFeesByModelName(modelName);
    if (result.success && result.fees) {
      console.log(formatFeeBreakdown(result.fees));
      console.log('');
    } else {
      console.log(`❌ ${modelName}: ${result.error}`);
    }
  }
};

/**
 * Admin için fiyat güncelleme fonksiyonu
 */
export const updateDeviceModelPricing = async (
  modelId: string,
  repairPrice: number,
  feePercentage: number = 10
): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const ifoundappleFee = Math.round(repairPrice * (feePercentage / 100) * 100) / 100;
    
    const { error } = await supabase
      .from('device_models')
      .update({
        repair_price: repairPrice,
        ifoundanapple_fee: ifoundappleFee,
        fee_percentage: feePercentage,
        updated_at: new Date().toISOString()
      })
      .eq('id', modelId);

    if (error) {
      return { success: false, error: error.message };
    }

    console.log('[FEE_CALC] ✅ Model fiyatı güncellendi:', { modelId, repairPrice, ifoundappleFee });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    };
  }
};

/**
 * Toplu fiyat güncelleme (CSV import için)
 */
export const bulkUpdateDeviceModelPricing = async (
  updates: Array<{
    modelName: string;
    repairPrice: number;
    feePercentage?: number;
  }>
): Promise<{
  success: boolean;
  successCount?: number;
  errorCount?: number;
  errors?: string[];
}> => {
  let successCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  console.log('[FEE_CALC] Toplu fiyat güncelleme başlatılıyor...', updates.length, 'model');

  for (const update of updates) {
    try {
      const { success, model } = await getDeviceModelByName(update.modelName);
      
      if (!success || !model) {
        errors.push(`Model bulunamadı: ${update.modelName}`);
        errorCount++;
        continue;
      }

      const result = await updateDeviceModelPricing(
        model.id,
        update.repairPrice,
        update.feePercentage || 10
      );

      if (result.success) {
        successCount++;
      } else {
        errors.push(`${update.modelName}: ${result.error}`);
        errorCount++;
      }
    } catch (error) {
      errors.push(`${update.modelName}: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
      errorCount++;
    }
  }

  console.log('[FEE_CALC] ✅ Toplu güncelleme tamamlandı:', { successCount, errorCount });
  
  return {
    success: errorCount === 0,
    successCount,
    errorCount,
    errors: errors.length > 0 ? errors : undefined
  };
};