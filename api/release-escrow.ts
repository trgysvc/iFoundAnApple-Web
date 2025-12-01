/**
 * Local API: Release Escrow
 * 
 * ⚠️ DEPRECATED - Bu dosya sadece test amaçlı kullanılmaktadır.
 * 
 * ÖNEMLİ: Tüm escrow release işlemleri artık Backend API üzerinden yapılıyor.
 * Veritabanı yazma işlemleri backend tarafından otomatik olarak yapılıyor.
 * 
 * Yeni escrow release akışı için:
 * - Backend API: POST /v1/payments/release-escrow
 * - Backend otomatik olarak tüm veritabanı güncellemelerini yapar:
 *   - Escrow status'unu 'released' yapar
 *   - Payment status'unu günceller
 *   - Device status'unu günceller
 *   - Financial transaction kaydı oluşturur
 * 
 * Bu dosya sadece test modu için backend API'yi wrap eder.
 */

import { apiClient } from '../utils/apiClient';

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

/**
 * ⚠️ DEPRECATED - Backend API'yi kullan
 * 
 * Bu fonksiyon sadece test modu için backend API'yi wrap eder.
 * Veritabanı yazma işlemleri backend tarafından yapılıyor.
 */
export async function releaseEscrowAPI(request: EscrowReleaseRequest): Promise<EscrowReleaseResponse> {
  try {
    console.log('[RELEASE_ESCROW] ⚠️ DEPRECATED - Backend API kullanılmalı');
    console.log('[RELEASE_ESCROW] Backend API\'ye yönlendiriliyor...', {
      paymentId: request.paymentId,
      deviceId: request.deviceId,
      releaseReason: request.releaseReason,
    });

    // Backend API'ye istek gönder
    // Backend otomatik olarak tüm veritabanı güncellemelerini yapar
    const backendResponse = await apiClient.post<{
      success: boolean;
      transactionId?: string;
      status: 'released' | 'failed' | 'pending';
      netPayoutAmount?: number;
      errorMessage?: string;
    }>('/payments/release-escrow', {
      paymentId: request.paymentId,
      deviceId: request.deviceId,
      releaseReason: request.releaseReason,
    });

    // Backend'den gelen response'u EscrowReleaseResponse formatına çevir
    const response: EscrowReleaseResponse = {
      success: backendResponse.success,
      transactionId: backendResponse.transactionId,
      status: backendResponse.status,
      netPayoutAmount: backendResponse.netPayoutAmount,
      errorMessage: backendResponse.errorMessage,
    };

    console.log('[RELEASE_ESCROW] ✅ Backend API çağrısı başarılı:', response);
    return response;

  } catch (error) {
    console.error('[RELEASE_ESCROW] Backend API hatası:', error);
    return {
      success: false,
      status: 'failed',
      errorMessage: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// ❌ KALDIRILDI - Backend artık tüm validasyonları yapıyor

// For direct function calls (not HTTP)
export async function releaseEscrowLocal(request: EscrowReleaseRequest): Promise<EscrowReleaseResponse> {
  return await releaseEscrowAPI(request);
}
