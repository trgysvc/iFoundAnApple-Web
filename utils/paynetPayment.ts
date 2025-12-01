/**
 * PAYNET Payment Integration
 * Backend API üzerinden PAYNET 3D Secure ödeme işlemleri
 */

import { apiClient, ApiError } from './apiClient';
import { FeeBreakdown } from './feeCalculation';

export interface PaynetPaymentRequest {
  deviceId: string;
  totalAmount: number;
}

export interface PaynetPaymentResponse {
  id: string;
  deviceId: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  escrowStatus: 'pending' | 'held' | 'released';
  totalAmount: number;
  providerTransactionId?: string;
  publishableKey?: string;
  paymentUrl?: string;
  feeBreakdown?: FeeBreakdown; // Webhook geldiğinde kullanılacak
}

export interface PaynetComplete3DRequest {
  paymentId: string;
  sessionId: string;
  tokenId: string;
}

export interface PaynetComplete3DResponse {
  success: boolean;
  paymentId: string;
  message: string;
}

/**
 * PAYNET ödeme işlemini başlat
 * Backend'e POST /v1/payments/process isteği gönderir
 */
export const initiatePaynetPayment = async (
  deviceId: string,
  totalAmount: number
): Promise<PaynetPaymentResponse> => {
  try {
    console.log('[PAYNET] Ödeme başlatılıyor...', { deviceId, totalAmount });

    const response = await apiClient.post<PaynetPaymentResponse>(
      '/payments/process',
      {
        deviceId,
        totalAmount,
      }
    );

    console.log('[PAYNET] Ödeme başlatıldı:', {
      paymentId: response.id,
      paymentUrl: response.paymentUrl,
      status: response.paymentStatus,
    });

    return response;
  } catch (error) {
    console.error('[PAYNET] Ödeme başlatma hatası:', error);
    
    if (error instanceof Error) {
      // ApiError ise detaylı mesaj göster
      if ('statusCode' in error) {
        const apiError = error as unknown as ApiError;
        throw new Error(apiError.message || 'Ödeme başlatılamadı');
      }
      throw error;
    }
    
    throw new Error('Ödeme başlatılamadı. Lütfen tekrar deneyin.');
  }
};

/**
 * 3D Secure doğrulaması sonrası ödemeyi tamamla
 * Backend'e POST /v1/payments/complete-3d isteği gönderir
 */
export const completePaynet3D = async (
  paymentId: string,
  sessionId: string,
  tokenId: string
): Promise<PaynetComplete3DResponse> => {
  try {
    console.log('[PAYNET] 3D Secure tamamlanıyor...', {
      paymentId,
      sessionId: sessionId.substring(0, 20) + '...',
      tokenId: tokenId.substring(0, 20) + '...',
    });

    const response = await apiClient.post<PaynetComplete3DResponse>(
      '/payments/complete-3d',
      {
        paymentId,
        sessionId,
        tokenId,
      }
    );

    console.log('[PAYNET] 3D Secure tamamlandı:', response);

    return response;
  } catch (error) {
    console.error('[PAYNET] 3D Secure tamamlama hatası:', error);
    
    if (error instanceof Error) {
      if ('statusCode' in error) {
        const apiError = error as unknown as ApiError;
        throw new Error(apiError.message || '3D Secure tamamlanamadı');
      }
      throw error;
    }
    
    throw new Error('3D Secure tamamlanamadı. Lütfen tekrar deneyin.');
  }
};

/**
 * Payment status sorgulama
 * Backend'e GET /v1/payments/{paymentId}/status isteği gönderir
 * 
 * ✅ Backend artık veritabanından okuyor, tüm bilgiler burada
 * Frontend sadece status'u kontrol eder, veritabanına yazmaz
 */
export const getPaymentStatus = async (
  paymentId: string
): Promise<{
  id: string;
  deviceId: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  escrowStatus: 'pending' | 'held' | 'released';
  webhookReceived: boolean;
  totalAmount: number;
  providerTransactionId?: string;
}> => {
  try {
    console.log('[PAYNET] Payment status sorgulanıyor...', { paymentId });

    const response = await apiClient.get<{
      id: string;
      deviceId: string;
      paymentStatus: 'pending' | 'completed' | 'failed';
      escrowStatus: 'pending' | 'held' | 'released';
      webhookReceived: boolean;
      totalAmount: number;
      providerTransactionId?: string;
    }>(`/payments/${paymentId}/status`);

    console.log('[PAYNET] Payment status:', response);

    return response;
  } catch (error) {
    console.error('[PAYNET] Payment status sorgulama hatası:', error);
    throw error;
  }
};

/**
 * PAYNET bağlantı testi
 * Backend'e GET /v1/payments/test-paynet-connection isteği gönderir
 */
export const testPaynetConnection = async (): Promise<any> => {
  try {
    console.log('[PAYNET] Bağlantı testi yapılıyor...');

    const response = await apiClient.get('/payments/test-paynet-connection');

    console.log('[PAYNET] Bağlantı testi sonucu:', response);

    return response;
  } catch (error) {
    console.error('[PAYNET] Bağlantı testi hatası:', error);
    throw error;
  }
};

