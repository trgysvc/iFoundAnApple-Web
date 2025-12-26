/**
 * PAYNET Payment Integration
 * Backend API üzerinden PAYNET 3D Secure ödeme işlemleri
 */

import { apiClient, ApiError } from './apiClient';
import { FeeBreakdown } from './feeCalculation';

export interface PaynetPaymentRequest {
  deviceId: string;
  totalAmount: number;
  // Kart bilgileri root seviyesinde camelCase formatında (backend DTO formatı)
  pan: string;           // Kart numarası (13-19 haneli, sadece rakam, boşluk yok)
  month: string;         // Son kullanma ayı (MM formatı, 01-12)
  year: string;          // Son kullanma yılı (YY veya YYYY formatı)
  cvc: string;           // CVV/CVC kodu (3-4 haneli, sadece rakam)
  cardHolder: string;    // Kart sahibi adı (boş olamaz)
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
  totalAmount: number,
  feeBreakdown: FeeBreakdown,
  cardData: {
    pan: string;
    month: string;
    year: string;
    cvc: string;
    cardHolder: string;
  }
): Promise<PaynetPaymentResponse> => {
  try {
    console.log('[PAYNET] Ödeme başlatılıyor...', { 
      deviceId, 
      totalAmount, 
      hasFeeBreakdown: !!feeBreakdown,
      hasCardData: !!cardData
    });

    // Kart numarasından boşlukları temizle
    const cleanedPan = cardData.pan.replace(/\s/g, '');
    
    // Yıl formatını kontrol et ve normalize et (2 haneli ise 4 haneliye çevir)
    let normalizedYear = cardData.year;
    if (normalizedYear.length === 2) {
      // YY formatından YYYY formatına çevir (2000+ varsayarak)
      const year2Digit = parseInt(normalizedYear, 10);
      normalizedYear = (2000 + year2Digit).toString();
    }

    // Backend'in beklediği format: kart bilgileri root seviyesinde camelCase
    const requestBody: PaynetPaymentRequest = {
      deviceId,
      totalAmount,
      // Kart bilgileri root seviyesinde (backend camelCase formatı bekliyor)
      pan: cleanedPan, // Boşluk olmadan, sadece rakam (13-19 haneli)
      month: cardData.month.padStart(2, '0'), // MM formatı (01-12), 2 haneli garantisi
      year: normalizedYear, // YYYY formatı (backend YY veya YYYY kabul eder)
      cvc: cardData.cvc, // 3-4 haneli, sadece rakam
      cardHolder: cardData.cardHolder.toUpperCase().trim(), // Boş olamaz
    };

    // Backend feeBreakdown bekliyor - sadece backend'in beklediği alanları gönder
    // Backend originalRepairPrice, deviceModel ve category alanlarını kabul etmiyor
    const requestBodyWithFeeBreakdown: any = {
      ...requestBody,
    };
    
    if (feeBreakdown) {
      requestBodyWithFeeBreakdown.feeBreakdown = {
        rewardAmount: feeBreakdown.rewardAmount,
        cargoFee: feeBreakdown.cargoFee,
        serviceFee: feeBreakdown.serviceFee,
        gatewayFee: feeBreakdown.gatewayFee,
        totalAmount: feeBreakdown.totalAmount,
        netPayout: feeBreakdown.netPayout,
        // originalRepairPrice, deviceModel ve category alanları gönderilmiyor
      };
      console.log('[PAYNET] Fee breakdown gönderiliyor:', JSON.stringify(requestBodyWithFeeBreakdown.feeBreakdown, null, 2));
    }

    // Güvenlik: Kart bilgilerini log'da maskele
    const maskedRequestBody = {
      ...requestBodyWithFeeBreakdown,
      pan: `${cleanedPan.substring(0, 4)}****${cleanedPan.substring(cleanedPan.length - 4)}`,
      cvc: '***'
    };
    console.log('[PAYNET] Backend\'e gönderilecek request body (maskelenmiş):', JSON.stringify(maskedRequestBody, null, 2));

    const response = await apiClient.post<PaynetPaymentResponse>(
      '/payments/process',
      requestBodyWithFeeBreakdown
    );

    console.log('[PAYNET] Backend\'den gelen response:', JSON.stringify(response, null, 2));

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
 * ⚠️ DEPRECATED - Artık kullanılmıyor
 * 
 * Backend artık callback'i handle ediyor ve webhook ile işlemi tamamlıyor.
 * Frontend'de bu fonksiyon çağrılmamalı.
 * 
 * 3D Secure doğrulaması sonrası ödemeyi tamamla
 * Backend'e POST /v1/payments/complete-3d isteği gönderir
 * 
 * @deprecated Backend callback'i handle ediyor, bu fonksiyon artık kullanılmıyor
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
 * Cihaz için mevcut pending payment kontrolü
 * Backend'e GET /v1/payments/device/:deviceId/pending isteği gönderir
 */
export const checkPendingPaymentForDevice = async (
  deviceId: string
): Promise<{
  exists: boolean;
  paymentId?: string;
  createdAt?: string;
  canRetry: boolean;
}> => {
  try {
    console.log('[PAYNET] Pending payment kontrolü yapılıyor...', { deviceId });

    const response = await apiClient.get<{
      exists: boolean;
      paymentId?: string;
      createdAt?: string;
      canRetry: boolean;
    }>(`/payments/device/${deviceId}/pending`);

    console.log('[PAYNET] Pending payment kontrolü sonucu:', response);

    return response;
  } catch (error) {
    console.error('[PAYNET] Pending payment kontrolü hatası:', error);
    // Hata durumunda varsayılan olarak pending yok kabul et
    return {
      exists: false,
      canRetry: false,
    };
  }
};

/**
 * Pending payment'ı iptal et
 * Backend'e POST /v1/payments/:paymentId/cancel isteği gönderir
 */
export const cancelPendingPayment = async (
  paymentId: string,
  reason?: string
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    console.log('[PAYNET] Pending payment iptal ediliyor...', { paymentId, reason });

    const response = await apiClient.post<{
      success: boolean;
      message: string;
    }>(`/payments/${paymentId}/cancel`, {
      reason: reason || 'Kullanıcı tarafından iptal edildi',
    });

    console.log('[PAYNET] Pending payment iptal sonucu:', response);

    return response;
  } catch (error) {
    console.error('[PAYNET] Pending payment iptal hatası:', error);
    
    if (error instanceof Error) {
      if ('statusCode' in error) {
        const apiError = error as unknown as ApiError;
        throw new Error(apiError.message || 'Pending payment iptal edilemedi');
      }
      throw error;
    }
    
    throw new Error('Pending payment iptal edilemedi. Lütfen tekrar deneyin.');
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

