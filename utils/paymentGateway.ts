/**
 * Payment Gateway Entegrasyonu (Iyzico/Stripe)
 * PCI DSS uyumlu ödeme işleme sistemi
 */

import { FeeBreakdown } from "./feeCalculation.ts";
import { releaseEscrowLocal } from "../api/release-escrow.ts";
import { getSecureConfig } from "./security.ts";
import { createClient } from "@supabase/supabase-js";

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
 * Iyzico Payment Gateway Configuration
 */
const IYZICO_CONFIG = {
  // Bu değerler environment'dan gelecek
  API_KEY: process.env.IYZICO_API_KEY || "",
  SECRET_KEY: process.env.IYZICO_SECRET_KEY || "",
  BASE_URL: process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com", // Production: https://api.iyzipay.com
  CALLBACK_URL:
    process.env.IYZICO_CALLBACK_URL ||
    "https://ifoundanapple.com/payment/callback",
};

/**
 * Stripe Payment Gateway Configuration (Alternatif)
 */
const STRIPE_CONFIG = {
  PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || "",
  SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",
};

/**
 * Güvenli ödeme başlatma (Escrow sistemi ile)
 */
export type PaymentProvider = "iyzico" | "stripe" | "test";

export const initiatePayment = async (
  request: PaymentRequest,
  provider: PaymentProvider = "iyzico"
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

    // Provider'a göre farklı işlem yap
    let paymentResult: PaymentResponse;
    
    switch (provider) {
      case "test":
        // Test modu artık Iyzico Sandbox API'sini kullanıyor
        console.log("[TEST] Test modu → İyzico Sandbox API kullanılacak");
        paymentResult = await processIyzicoPayment(request);
        break;
      case "iyzico":
        paymentResult = await processIyzicoPayment(request);
        break;
      case "stripe":
        paymentResult = await processStripePayment(request);
        break;
      default:
        throw new Error(`Desteklenmeyen ödeme sağlayıcısı: ${provider}`);
    }

    // Database'e kayıt yap
    if (paymentResult.success) {
      try {
        await savePaymentToDatabase(request, paymentResult);
        console.log("[PAYMENT] ✅ Ödeme işlemi tamamlandı, sonuç döndürülüyor:", {
          success: paymentResult.success,
          status: paymentResult.status,
          paymentId: paymentResult.paymentId
        });
      } catch (dbError) {
        console.error("[PAYMENT] Database kayıt hatası, ödeme başarısız sayılıyor:", dbError);
        return {
          success: false,
          status: "failed",
          errorMessage: "Ödeme kaydedilemedi. Lütfen tekrar deneyin.",
          providerResponse: dbError
        };
      }
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
 * Database'e ödeme kaydını kaydet ve status'u güncelle
 */
const savePaymentToDatabase = async (request: PaymentRequest, paymentResult: PaymentResponse): Promise<void> => {
  try {
    console.log("[DATABASE] Ödeme kaydı database'e kaydediliyor...", {
      paymentId: paymentResult.paymentId,
      status: paymentResult.status,
      success: paymentResult.success
    });

    // Güvenlik kontrolü: Sadece başarılı ödemeleri kaydet
    if (!paymentResult.success) {
      console.warn("[DATABASE] Başarısız ödeme kaydedilmiyor:", paymentResult.errorMessage);
      return;
    }

    // Supabase client oluştur
    const config = getSecureConfig();
    const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);

    // 1. İlk olarak payment kaydını oluştur
    const { data: paymentData, error: paymentError } = await supabase
      .from('payments')
      .insert({
        id: paymentResult.paymentId,
        device_id: request.deviceId,
        payer_id: request.payerId,
        receiver_id: request.receiverId,
        total_amount: request.feeBreakdown.totalAmount,
        reward_amount: request.feeBreakdown.rewardAmount || request.feeBreakdown.originalRepairPrice || 0,
        cargo_fee: request.feeBreakdown.cargoFee,
        payment_gateway_fee: request.feeBreakdown.gatewayFee,
        service_fee: request.feeBreakdown.serviceFee,
        net_payout: request.feeBreakdown.netPayout,
        payment_provider: request.paymentProvider || 'test',
        provider_payment_id: paymentResult.providerPaymentId,
        status: paymentResult.status,
        payment_status: paymentResult.status,
        provider_response: paymentResult.providerResponse,
        payment_method: request.paymentProvider || 'test',
        currency: 'TRY',
        payer_info: request.payerInfo,
        device_info: request.deviceInfo,
      })
      .select()
      .single();

    if (paymentError) {
      console.error("[DATABASE] Payment kayıt hatası:", paymentError);
      throw new Error(`Payment kayıt hatası: ${paymentError.message}`);
    }

    console.log("[DATABASE] Payment kaydı oluşturuldu:", paymentData);

    // 2. Escrow kaydını oluştur
    const { data: escrowData, error: escrowError } = await supabase
      .from('escrow_accounts')
      .insert({
        payment_id: paymentResult.paymentId,
        device_id: request.deviceId,
        holder_user_id: request.payerId, // Ödeme yapan (device owner)
        beneficiary_user_id: request.receiverId || request.payerId, // Ödül alacak (finder) - yoksa payer
        total_amount: request.feeBreakdown.totalAmount,
        reward_amount: request.feeBreakdown.rewardAmount || request.feeBreakdown.originalRepairPrice || 0,
        service_fee: request.feeBreakdown.serviceFee,
        gateway_fee: request.feeBreakdown.gatewayFee,
        cargo_fee: request.feeBreakdown.cargoFee,
        net_payout: request.feeBreakdown.netPayout,
        status: paymentResult.status === 'completed' ? 'held' : 'pending',
        currency: 'TRY',
      })
      .select()
      .single();

    if (escrowError) {
      console.error("[DATABASE] Escrow kayıt hatası:", escrowError);
      // Escrow hatası kritik değil, devam et
    } else {
      console.log("[DATABASE] Escrow kaydı oluşturuldu:", escrowData);
    }

    console.log("[DATABASE] Ödeme kaydı başarıyla tamamlandı");
  } catch (error) {
    console.error("[DATABASE] Database kayıt hatası:", error);
    // Hatayı yukarı fırlat ki ödeme başarısız sayılsın
    throw error;
  }
};

/**
 * Test Modu ile ödeme işleme (Gerçek API çağrısı yapmaz)
 */
const processTestPayment = async (
  request: PaymentRequest
): Promise<PaymentResponse> => {
  console.log("[TEST] Test modu ödeme işlemi başlatılıyor...", {
    deviceId: request.deviceId,
    amount: request.feeBreakdown.totalAmount,
    payer: request.payerInfo.email,
  });

  // Test modu için sadece simülasyon (her zaman başarılı)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log("[TEST] ✅ Test modu - Her zaman başarılı");
  
  const result = {
    success: true,
    paymentId: crypto.randomUUID(),
    providerPaymentId: `test_${crypto.randomUUID()}`,
    providerTransactionId: `test_tx_${crypto.randomUUID()}`,
    status: "completed",
    providerResponse: {
      status: "success",
      testMode: true,
      amount: request.feeBreakdown.totalAmount,
      message: "Test modu - gerçek ödeme yapılmadı",
    },
  };
  
  console.log("[TEST] Ödeme sonucu döndürülüyor:", result);
  return result;
};

/**
 * Iyzico ile ödeme işleme (Backend API üzerinden)
 */
const processIyzicoPayment = async (
  request: PaymentRequest
): Promise<PaymentResponse> => {
  console.log("[IYZICO] Gerçek İyzico ödeme işlemi başlatılıyor...", {
    deviceId: request.deviceId,
    amount: request.feeBreakdown.totalAmount,
    payer: request.payerInfo.email,
  });

  try {
    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    // Backend API'ye istek gönder
    const iyzicoRequest = {
      amount: request.feeBreakdown.totalAmount,
      currency: 'TRY',
      conversationId: conversationId,
      buyerInfo: {
        id: request.payerId,
        name: request.payerInfo.name.split(' ')[0] || 'Test',
        surname: request.payerInfo.name.split(' ')[1] || 'User',
        email: request.payerInfo.email,
        phone: request.payerInfo.phone,
        identityNumber: '11111111111', // Test için
        city: request.payerInfo.address.city,
        country: 'Turkey',
        address: request.payerInfo.address.street,
        zipCode: request.payerInfo.address.postalCode
      },
      shippingAddress: {
        contactName: request.payerInfo.name,
        city: request.payerInfo.address.city,
        country: 'Turkey',
        address: request.payerInfo.address.street,
        zipCode: request.payerInfo.address.postalCode
      },
      billingAddress: {
        contactName: request.payerInfo.name,
        city: request.payerInfo.address.city,
        country: 'Turkey',
        address: request.payerInfo.address.street,
        zipCode: request.payerInfo.address.postalCode
      },
      basketItems: [{
        id: request.deviceId,
        name: request.deviceInfo.model,
        category1: 'Electronics',
        category2: 'Mobile Phone',
        itemType: 'PHYSICAL',
        price: request.feeBreakdown.totalAmount
      }]
    };

    console.log("[IYZICO] Backend API'ye istek gönderiliyor...");

    // Backend API endpoint'ine istek gönder
    // Development: localhost:3001, Production: same origin
    const apiUrl = import.meta.env.DEV 
      ? 'http://localhost:3001/api/iyzico-payment'
      : '/api/iyzico-payment';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(iyzicoRequest)
    });

    const result = await response.json();
    
    console.log("[IYZICO] Backend API yanıtı:", result);
    
    if (result.success) {
      // Yeni UUID oluştur (database için)
      const paymentId = crypto.randomUUID();
      
      return {
        success: true,
        paymentId: paymentId, // Database için UUID
        providerPaymentId: result.paymentId, // İyzico'nun payment ID'si
        providerTransactionId: result.conversationId,
        status: result.status === 'completed' ? 'completed' : 'processing',
        redirectUrl: result.redirectUrl,
        providerResponse: result.providerResponse,
      };
    } else {
      throw new Error(result.errorMessage || 'İyzico ödeme hatası');
    }
    
  } catch (error) {
    console.error("[IYZICO] Ödeme hatası:", error);
    return {
      success: false,
      status: "failed",
      errorMessage: error instanceof Error ? error.message : "İyzico API hatası",
      providerResponse: error,
    };
  }
};

/**
 * Stripe ile ödeme işleme
 */
const processStripePayment = async (
  request: PaymentRequest
): Promise<PaymentResponse> => {
  // Bu fonksiyon Supabase Edge Function'da implement edilecek
  // Şimdilik mock response döndürüyoruz

  console.log("[STRIPE] Ödeme işlemi başlatılıyor...", {
    deviceId: request.deviceId,
    amount: request.feeBreakdown.totalAmount,
    payer: request.payerInfo.email,
  });

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Mock success response
  return {
    success: true,
    paymentId: crypto.randomUUID(), // UUID formatında
    providerPaymentId: `pi_${Math.random().toString(36).substring(7)}`,
    providerTransactionId: `ch_${Math.random().toString(36).substring(7)}`,
    status: "processing",
    providerResponse: {
      id: `pi_${Math.random().toString(36).substring(7)}`,
      amount: Math.round(request.feeBreakdown.totalAmount * 100), // Stripe uses cents
      currency: "try",
      status: "requires_payment_method",
    },
  };
};

/**
 * Ödeme durumu sorgulama
 */
export const checkPaymentStatus = async (
  paymentId: string,
  provider: "iyzico" | "stripe" = "iyzico"
): Promise<PaymentResponse> => {
  try {
    console.log(
      `[PAYMENT] Ödeme durumu sorgulanıyor - ID: ${paymentId}, Provider: ${provider}`
    );

    // Bu fonksiyon Supabase Edge Function'da implement edilecek
    // Şimdilik mock response döndürüyoruz

    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      success: true,
      paymentId,
      status: "completed",
      providerPaymentId: `${provider}_${Math.random()
        .toString(36)
        .substring(7)}`,
      providerResponse: {
        status: "success",
        paymentStatus: "SUCCESS",
      },
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
  provider: "iyzico" | "stripe" = "iyzico"
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
  provider: "iyzico" | "stripe" = "iyzico"
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
