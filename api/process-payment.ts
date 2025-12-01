/**
 * Local API: Process Payment
 * 
 * ⚠️ DEPRECATED - Bu dosya sadece test amaçlı kullanılmaktadır.
 * 
 * ÖNEMLİ: Tüm ödeme işlemleri artık Backend API üzerinden yapılıyor.
 * Veritabanı yazma işlemleri backend tarafından otomatik olarak yapılıyor.
 * 
 * Yeni ödeme akışı için:
 * - Backend API: POST /v1/payments/process
 * - Backend otomatik olarak payment kaydı oluşturur (status='pending')
 * - Webhook geldiğinde backend tüm kayıtları oluşturur
 * 
 * Bu dosya sadece test modu için backend API'yi wrap eder.
 */

import { apiClient } from '../utils/apiClient';

interface PaymentRequest {
  deviceId: string;
  payerId: string;
  receiverId?: string;
  feeBreakdown: {
    rewardAmount: number;
    cargoFee: number;
    serviceFee: number;
    gatewayFee: number;
    totalAmount: number;
    netPayout: number;
  };
  deviceInfo: {
    model: string;
    serialNumber: string;
    description?: string;
  };
  payerInfo: {
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      district: string;
      postalCode: string;
    };
  };
  paymentProvider?: 'paynet';
}

interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  escrowId?: string;
  providerPaymentId?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'held';
  errorMessage?: string;
  redirectUrl?: string;
  providerResponse?: any;
}

/**
 * ⚠️ DEPRECATED - Backend API'yi kullan
 * 
 * Bu fonksiyon sadece test modu için backend API'yi wrap eder.
 * Veritabanı yazma işlemleri backend tarafından yapılıyor.
 */
export async function processPaymentAPI(request: PaymentRequest, existingPaymentId?: string): Promise<PaymentResponse> {
  try {
    console.log('[PROCESS_PAYMENT] ⚠️ DEPRECATED - Backend API kullanılmalı');
    console.log('[PROCESS_PAYMENT] Backend API\'ye yönlendiriliyor...', {
      deviceId: request.deviceId,
      totalAmount: request.feeBreakdown.totalAmount,
    });

    // Backend API'ye istek gönder
    // Backend otomatik olarak payment kaydı oluşturur (status='pending')
    const backendResponse = await apiClient.post<{
      id: string;
      deviceId: string;
      paymentStatus: 'pending' | 'completed' | 'failed';
      escrowStatus: 'pending' | 'held' | 'released';
      totalAmount: number;
      providerTransactionId?: string;
      paymentUrl?: string;
    }>('/payments/process', {
      deviceId: request.deviceId,
      totalAmount: request.feeBreakdown.totalAmount,
      // Backend feeBreakdown'ı validate eder
    });

    // Backend'den gelen response'u PaymentResponse formatına çevir
    const response: PaymentResponse = {
      success: true,
      paymentId: backendResponse.id,
      providerTransactionId: backendResponse.providerTransactionId,
      status: backendResponse.paymentStatus === 'pending' ? 'processing' : backendResponse.paymentStatus,
      redirectUrl: backendResponse.paymentUrl,
      providerResponse: backendResponse,
    };

    console.log('[PROCESS_PAYMENT] ✅ Backend API çağrısı başarılı:', response);
    return response;

  } catch (error) {
    console.error('[PROCESS_PAYMENT] Backend API hatası:', error);
    return {
      success: false,
      status: 'failed',
      errorMessage: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * ⚠️ DEPRECATED - Backend API'yi kullan
 * 
 * Bu fonksiyon sadece test modu için backend API'yi wrap eder.
 * Veritabanı yazma işlemleri backend tarafından yapılıyor.
 */
export async function processPaymentLocal(request: PaymentRequest): Promise<PaymentResponse> {
  // Backend API'ye yönlendir
  return await processPaymentAPI(request);
}
