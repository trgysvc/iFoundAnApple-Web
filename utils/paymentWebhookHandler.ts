/**
 * Payment Webhook Handler
 * Webhook geldiğinde payment ve escrow kayıtlarını oluşturur
 * 
 * ÖNEMLİ: Bu fonksiyonlar sadece webhook geldiğinde çağrılmalıdır.
 * Ödeme başlatıldığında veritabanına kayıt OLUŞTURULMAZ.
 */

import { createClient } from '@supabase/supabase-js';
import { getSecureConfig } from './security';
import { FeeBreakdown } from './feeCalculation';

export interface PaynetWebhookPayload {
  reference_no: string; // Payment ID
  is_succeed: boolean;
  amount: number;
  netAmount?: number;
  comission?: number;
  authorization_code?: string;
  order_id?: string;
  xact_date: string;
}

export interface PaymentRecordData {
  paymentId: string;
  deviceId: string;
  payerId: string;
  receiverId: string;
  webhookData: PaynetWebhookPayload;
  feeBreakdown: FeeBreakdown;
}

/**
 * ⚠️ DEPRECATED - Bu fonksiyon artık kullanılmamalıdır
 * 
 * Backend artık webhook geldiğinde otomatik olarak tüm veritabanı kayıtlarını oluşturuyor:
 * - Payment kaydını günceller
 * - Escrow kaydını oluşturur
 * - Device status'unu günceller
 * - Audit log ve notification kayıtlarını oluşturur
 * 
 * Frontend sadece status kontrolü yapar (`GET /v1/payments/{paymentId}/status`)
 * ve veritabanına yazma işlemi yapmaz.
 * 
 * @deprecated Backend otomatik olarak tüm kayıtları oluşturuyor
 */
export async function createPaymentRecordsFromWebhook(
  data: PaymentRecordData
): Promise<{ success: boolean; paymentId?: string; escrowId?: string; error?: string }> {
  console.warn('[WEBHOOK_HANDLER] ⚠️ DEPRECATED - createPaymentRecordsFromWebhook kullanılmamalıdır.');
  console.warn('[WEBHOOK_HANDLER] Backend otomatik olarak tüm kayıtları oluşturuyor:');
  console.warn('[WEBHOOK_HANDLER] - Payment kaydını günceller');
  console.warn('[WEBHOOK_HANDLER] - Escrow kaydını oluşturur');
  console.warn('[WEBHOOK_HANDLER] - Device status\'unu günceller');
  console.warn('[WEBHOOK_HANDLER] - Audit log ve notification kayıtlarını oluşturur');
  console.warn('[WEBHOOK_HANDLER] Frontend sadece status kontrolü yapmalı: GET /v1/payments/{paymentId}/status');
  
  // Backend zaten tüm kayıtları oluşturdu, bu fonksiyon artık çalışmıyor
  return {
    success: false,
    error: 'This function is deprecated. Backend automatically creates all records when webhook is received. Use GET /v1/payments/{paymentId}/status to check payment status.',
  };
}

/**
 * Payment status'u kontrol et (polling için)
 * ✅ Backend API'den status okur - veritabanı yazma yok
 * 
 * Backend artık veritabanından okuyor ve tüm bilgileri döndürüyor.
 * Frontend sadece status'u kontrol eder, veritabanına yazmaz.
 */
export async function checkPaymentStatus(
  paymentId: string
): Promise<{ 
  status: string; 
  webhookReceived: boolean;
  paymentStatus: 'pending' | 'completed' | 'failed';
  escrowStatus: 'pending' | 'held' | 'released';
} | null> {
  try {
    // Backend API'den status sorgula
    // Backend veritabanından okuyor, tüm bilgiler burada
    const { getPaymentStatus } = await import('./paynetPayment');
    const backendStatus = await getPaymentStatus(paymentId);

    // Backend'den gelen response'u formatla
    return {
      status: backendStatus.paymentStatus,
      webhookReceived: backendStatus.webhookReceived,
      paymentStatus: backendStatus.paymentStatus,
      escrowStatus: backendStatus.escrowStatus,
    };
  } catch (error) {
    console.error('[WEBHOOK_HANDLER] Backend API status sorgulama hatası:', error);
    return {
      status: 'pending',
      webhookReceived: false,
      paymentStatus: 'pending',
      escrowStatus: 'pending',
    };
  }
}

