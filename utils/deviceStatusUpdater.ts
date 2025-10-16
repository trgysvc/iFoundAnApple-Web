import { createClient } from '@supabase/supabase-js';
import { getSecureConfig } from './security';

/**
 * Device status'unu güncellemek için utility fonksiyon
 */
export const updateDeviceStatus = async (
  deviceId: string,
  newStatus: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('[DEVICE_STATUS] Device status güncelleniyor:', { deviceId, newStatus, reason });

    // Supabase client oluştur
    const config = getSecureConfig();
    const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);

    // Device status'unu güncelle
    const { error } = await supabase
      .from('devices')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', deviceId);

    if (error) {
      console.error('[DEVICE_STATUS] Güncelleme hatası:', error);
      return { success: false, error: error.message };
    }

    console.log('[DEVICE_STATUS] ✅ Device status başarıyla güncellendi:', newStatus);
    return { success: true };

  } catch (error) {
    console.error('[DEVICE_STATUS] Genel hata:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Bilinmeyen hata' 
    };
  }
};

/**
 * Seri numarası ile device status'unu güncelle
 */
export const updateDeviceStatusBySerial = async (
  serialNumber: string,
  newStatus: string,
  reason?: string
): Promise<{ success: boolean; error?: string; deviceId?: string }> => {
  try {
    console.log('[DEVICE_STATUS] Seri numarası ile device status güncelleniyor:', { serialNumber, newStatus, reason });

    // Supabase client oluştur
    const config = getSecureConfig();
    const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);

    // Önce device'ı bul
    const { data: deviceData, error: deviceError } = await supabase
      .from('devices')
      .select('id, status')
      .eq('serialNumber', serialNumber)
      .single();

    if (deviceError || !deviceData) {
      console.error('[DEVICE_STATUS] Device bulunamadı:', deviceError);
      return { success: false, error: 'Device bulunamadı' };
    }

    console.log('[DEVICE_STATUS] Device bulundu:', deviceData);

    // Status'unu güncelle
    const { error: updateError } = await supabase
      .from('devices')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', deviceData.id);

    if (updateError) {
      console.error('[DEVICE_STATUS] Güncelleme hatası:', updateError);
      return { success: false, error: updateError.message };
    }

    console.log('[DEVICE_STATUS] ✅ Device status başarıyla güncellendi:', {
      deviceId: deviceData.id,
      oldStatus: deviceData.status,
      newStatus
    });

    return { success: true, deviceId: deviceData.id };

  } catch (error) {
    console.error('[DEVICE_STATUS] Genel hata:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Bilinmeyen hata' 
    };
  }
};
