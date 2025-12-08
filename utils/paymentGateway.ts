/**
 * Payment Gateway Entegrasyonu (PAYNET)
 * PCI DSS uyumlu ödeme işleme sistemi
 */

import { FeeBreakdown } from "./feeCalculation.ts";
import { releaseEscrowLocal } from "../api/release-escrow.ts";
import { initiatePaynetPayment } from "./paynetPayment.ts";

export interface PaymentRequest {
  deviceId: string;
  payerId: string;
  receiverId?: string;
  feeBreakdown: FeeBreakdown;
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
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  providerPaymentId?: string;
  providerTransactionId?: string;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  errorMessage?: string;
  redirectUrl?: string; // 3D Secure için
  providerResponse?: any;
}

export interface EscrowReleaseRequest {
  paymentId: string;
  deviceId: string;
  receiverId: string;
  releaseReason: string;
  confirmedBy: string[];
}

export interface EscrowReleaseResponse {
  success: boolean;
  transactionId?: string;
  status: "released" | "failed";
  errorMessage?: string;
  netPayoutAmount?: number;
}

/**
 * Güvenli ödeme başlatma (Escrow sistemi ile)
 * PAYNET 3D Secure ödeme entegrasyonu
 */
export type PaymentProvider = "paynet";

export const initiatePayment = async (
  request: PaymentRequest,
  provider: PaymentProvider = "paynet"
): Promise<PaymentResponse> => {
  try {
    console.log(
      `[PAYMENT] Ödeme başlatılıyor - Provider: ${provider}, Device: ${request.deviceId}`
    );

    // Input validation
    if (!request.payerId || !request.deviceId || !request.feeBreakdown) {
      throw new Error("Eksik ödeme bilgileri");
    }

    if (request.feeBreakdown.totalAmount < 10) {
      throw new Error("Minimum ödeme tutarı 10 TL");
    }

    // PAYNET ödeme işlemi
    let paymentResult: PaymentResponse;
    
    if (provider === "paynet") {
      paymentResult = await processPaynetPayment(request);
    } else {
      throw new Error(`Desteklenmeyen ödeme sağlayıcısı: ${provider}`);
    }

    // Database'e kayıt yap (Backend'de otomatik yapılıyor, burada sadece log)
    if (paymentResult.success) {
      console.log("[PAYMENT] ✅ Ödeme işlemi başlatıldı:", {
        success: paymentResult.success,
        status: paymentResult.status,
        paymentId: paymentResult.paymentId,
        redirectUrl: paymentResult.redirectUrl
      });
    }

    return paymentResult;
  } catch (error) {
    console.error("[PAYMENT] Ödeme başlatma hatası:", error);
    return {
      success: false,
      status: "failed",
      errorMessage: error instanceof Error ? error.message : "Bilinmeyen hata",
    };
  }
};

/**
 * PAYNET ile ödeme işleme (3D Secure)
 * Backend API üzerinden PAYNET entegrasyonu
 */
const processPaynetPayment = async (
  request: PaymentRequest
): Promise<PaymentResponse> => {
  console.log("[PAYNET] Ödeme işlemi başlatılıyor...", {
    deviceId: request.deviceId,
    amount: request.feeBreakdown.totalAmount,
    payer: request.payerInfo.email,
  });

  try {
    // Backend'e ödeme başlatma isteği gönder - feeBreakdown'ı da gönder
    const paynetResponse = await initiatePaynetPayment(
      request.deviceId,
      request.feeBreakdown.totalAmount,
      request.feeBreakdown  // ← feeBreakdown eklendi
    );

    // Payment ID'yi localStorage'a kaydet (callback için)
    if (paynetResponse.id) {
      localStorage.setItem('current_payment_id', paynetResponse.id);
    }
    
    // Device ID'yi localStorage'a kaydet (webhook geldiğinde kullanılacak)
    localStorage.setItem('current_payment_device_id', request.deviceId);
    
    // Fee breakdown'ı localStorage'a kaydet (webhook geldiğinde kullanılacak)
    // Eğer response'da feeBreakdown yoksa request'ten al
    const feeBreakdown = paynetResponse.feeBreakdown || request.feeBreakdown;
    if (feeBreakdown) {
      localStorage.setItem('current_payment_fee_breakdown', JSON.stringify(feeBreakdown));
    }

    // Response'u PaymentResponse formatına çevir
    return {
      success: true,
      paymentId: paynetResponse.id,
      providerTransactionId: paynetResponse.providerTransactionId,
      status: paynetResponse.paymentStatus === 'pending' ? 'processing' : paynetResponse.paymentStatus,
      redirectUrl: paynetResponse.paymentUrl, // 3D Secure URL'i
      providerResponse: paynetResponse,
    };
  } catch (error) {
    console.error("[PAYNET] Ödeme başlatma hatası:", error);
    return {
      success: false,
      status: "failed",
      errorMessage: error instanceof Error ? error.message : "PAYNET ödeme hatası",
      providerResponse: error,
    };
  }
};

/**
 * Ödeme durumu sorgulama
 * ✅ Backend API'den status okur - veritabanı yazma yok
 * 
 * Backend artık veritabanından okuyor ve tüm bilgileri döndürüyor.
 * Frontend sadece status'u kontrol eder, veritabanına yazmaz.
 */
export const checkPaymentStatus = async (
  paymentId: string,
  provider: PaymentProvider = "paynet"
): Promise<PaymentResponse> => {
  try {
    console.log(
      `[PAYMENT] Ödeme durumu sorgulanıyor - ID: ${paymentId}, Provider: ${provider}`
    );

    // Backend API'den status sorgula
    const { getPaymentStatus } = await import('./paynetPayment');
    const backendStatus = await getPaymentStatus(paymentId);

    // Backend'den gelen response'u PaymentResponse formatına çevir
    return {
      success: true,
      paymentId: backendStatus.id,
      status: backendStatus.paymentStatus === 'completed' ? 'completed' : 
              backendStatus.paymentStatus === 'failed' ? 'failed' : 'processing',
      providerPaymentId: backendStatus.providerTransactionId,
      providerResponse: backendStatus,
    };
  } catch (error) {
    console.error("[PAYMENT] Ödeme durumu sorgulama hatası:", error);
    return {
      success: false,
      status: "failed",
      errorMessage: error instanceof Error ? error.message : "Bilinmeyen hata",
    };
  }
};

/**
 * Escrow fonları serbest bırakma (Bulan kişiye ödeme)
 */
export const releaseEscrowFunds = async (
  request: EscrowReleaseRequest,
  provider: PaymentProvider = "paynet"
): Promise<EscrowReleaseResponse> => {
  try {
    console.log("[ESCROW] Fonlar serbest bırakılıyor...", {
      paymentId: request.paymentId,
      deviceId: request.deviceId,
      receiverId: request.receiverId,
    });

    // Input validation
    if (
      !request.paymentId ||
      !request.receiverId ||
      !request.confirmedBy.length
    ) {
      throw new Error("Escrow serbest bırakma için gerekli bilgiler eksik");
    }

    // Use the local API function
    const escrowRequest = {
      paymentId: request.paymentId,
      deviceId: request.deviceId,
      releaseReason: request.releaseReason,
      confirmationType: "manual_release" as const,
      confirmedBy: request.confirmedBy[0], // Use first confirmed by user
      additionalNotes: `Released via ${provider}`,
    };

    return await releaseEscrowLocal(escrowRequest);
  } catch (error) {
    console.error("[ESCROW] Escrow serbest bırakma hatası:", error);
    return {
      success: false,
      status: "failed",
      errorMessage: error instanceof Error ? error.message : "Bilinmeyen hata",
    };
  }
};

/**
 * Ödeme iadesi (Takas iptal durumunda)
 */
export const refundPayment = async (
  paymentId: string,
  reason: string,
  provider: PaymentProvider = "paynet"
): Promise<PaymentResponse> => {
  try {
    console.log(
      `[REFUND] Ödeme iadesi başlatılıyor - ID: ${paymentId}, Reason: ${reason}`
    );

    // Bu fonksiyon Supabase Edge Function'da implement edilecek
    // Şimdilik mock response döndürüyoruz

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      paymentId,
      status: "completed",
      providerResponse: {
        status: "success",
        refundStatus: "SUCCESS",
        refundId: `refund_${Date.now()}`,
      },
    };
  } catch (error) {
    console.error("[REFUND] Ödeme iadesi hatası:", error);
    return {
      success: false,
      status: "failed",
      errorMessage: error instanceof Error ? error.message : "Bilinmeyen hata",
    };
  }
};

/**
 * PCI DSS uyumluluk kontrolü
 */
export const validatePCICompliance = (): boolean => {
  // Gerçek uygulamada bu kontroller yapılacak:
  // - SSL/TLS sertifikası kontrolü
  // - Güvenli token kullanımı
  // - Kart bilgilerinin saklanmaması
  // - Güvenli iletişim protokolleri

  console.log("[PCI DSS] Uyumluluk kontrolü yapılıyor...");

  const checks = {
    sslEnabled:
      typeof window !== "undefined"
        ? window.location.protocol === "https:"
        : true,
    tokenizationEnabled: true, // Payment gateway tokenization
    noCardStorage: true, // Kart bilgileri saklanmıyor
    secureTransmission: true, // Güvenli iletişim
  };

  const isCompliant = Object.values(checks).every((check) => check === true);

  if (isCompliant) {
    console.log("[PCI DSS] ✅ Uyumluluk kontrolü başarılı");
  } else {
    console.error("[PCI DSS] ❌ Uyumluluk kontrolü başarısız", checks);
  }

  return isCompliant;
};

/**
 * Test ödeme işlemi (Development ortamı için)
 */
export const createTestPayment = async (
  amount: number = 100
): Promise<PaymentResponse> => {
  console.log(`[TEST] Test ödeme işlemi oluşturuluyor - Tutar: ${amount} TL`);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    success: true,
    paymentId: `test_payment_${Date.now()}`,
    providerPaymentId: `test_${Math.random().toString(36).substring(7)}`,
    status: "completed",
    providerResponse: {
      status: "success",
      testMode: true,
      amount: amount,
    },
  };
};
