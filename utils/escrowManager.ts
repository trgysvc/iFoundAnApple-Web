/**
 * Escrow (Emanet) Yönetim Sistemi
 * Güvenli ödeme blokajı ve serbest bırakma işlemleri
 */

import { supabase } from "./supabaseClient.ts";
import { FeeBreakdown } from "./feeCalculation.ts";

export interface EscrowAccount {
  id: string;
  paymentId: string;
  deviceId: string;
  holderUserId: string; // Ödemeyi yapan (cihaz sahibi)
  beneficiaryUserId: string; // Ödemeyi alacak (bulan kişi)
  totalAmount: number;
  rewardAmount: number;
  serviceFee: number;
  gatewayFee: number;
  cargoFee: number;
  netPayout: number;
  status: "pending" | "held" | "released" | "refunded" | "failed";
  releaseConditions: string[];
  confirmations: string[];
  createdAt: string;
  heldAt?: string;
  releasedAt?: string;
  refundedAt?: string;
}

export interface EscrowReleaseCondition {
  type:
    | "device_received"
    | "exchange_confirmed"
    | "manual_approval"
    | "time_based";
  description: string;
  requiredConfirmations: number;
  timeoutHours?: number;
}

export interface EscrowConfirmation {
  userId: string;
  confirmationType:
    | "device_received"
    | "exchange_confirmed"
    | "identity_verified";
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  notes?: string;
}

/**
 * ⚠️ DEPRECATED - Backend otomatik olarak escrow kaydını oluşturuyor
 * 
 * Backend, webhook geldiğinde otomatik olarak escrow kaydını oluşturuyor.
 * Bu fonksiyon artık kullanılmamalıdır.
 * 
 * @deprecated Backend otomatik olarak escrow kaydını oluşturuyor
 */
export const createEscrowAccount = async (
  paymentId: string,
  deviceId: string,
  holderUserId: string,
  beneficiaryUserId: string,
  feeBreakdown: FeeBreakdown
): Promise<{ success: boolean; escrowId?: string; error?: string }> => {
  try {
    console.log("[ESCROW] Yeni escrow hesabı oluşturuluyor...", {
      paymentId,
      deviceId,
      totalAmount: feeBreakdown.totalAmount,
    });

    // Varsayılan serbest bırakma koşulları
    const defaultReleaseConditions = [
      "device_received_confirmation",
      "exchange_both_parties_confirmed",
      "identity_verification_completed",
    ];

    const escrowData = {
      payment_id: paymentId,
      device_id: deviceId,
      holder_user_id: holderUserId,
      beneficiary_user_id: beneficiaryUserId,
      total_amount: feeBreakdown.totalAmount,
      reward_amount: feeBreakdown.rewardAmount,
      service_fee: feeBreakdown.serviceFee,
      gateway_fee: feeBreakdown.gatewayFee,
      cargo_fee: feeBreakdown.cargoFee,
      net_payout: feeBreakdown.netPayout,
      status: "pending",
      release_conditions: defaultReleaseConditions,
      confirmations: [],
    };

    const { data, error } = await supabase
      .from("escrow_accounts")
      .insert([escrowData])
      .select()
      .single();

    if (error) {
      console.error("[ESCROW] Escrow hesabı oluşturma hatası:", error);
      return { success: false, error: error.message };
    }

    console.log("[ESCROW] ✅ Escrow hesabı oluşturuldu:", data.id);
    return { success: true, escrowId: data.id };
  } catch (error) {
    console.error("[ESCROW] Escrow hesabı oluşturma hatası:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Bilinmeyen hata",
    };
  }
};

/**
 * ⚠️ DEPRECATED - Backend otomatik olarak escrow status'unu güncelliyor
 * 
 * Backend, webhook geldiğinde otomatik olarak escrow status'unu 'held' yapıyor.
 * Bu fonksiyon artık kullanılmamalıdır.
 * 
 * @deprecated Backend otomatik olarak escrow status'unu güncelliyor
 */
export const holdEscrowFunds = async (
  escrowId: string,
  paymentConfirmation: any
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log("[ESCROW] Escrow fonları bloke ediliyor...", escrowId);

    const { data, error } = await supabase
      .from("escrow_accounts")
      .update({
        status: "held",
        held_at: new Date().toISOString(),
        // Payment confirmation bilgilerini metadata olarak sakla
        confirmations: [
          {
            type: "payment_confirmed",
            timestamp: new Date().toISOString(),
            paymentData: paymentConfirmation,
          },
        ],
      })
      .eq("id", escrowId)
      .select()
      .single();

    if (error) {
      console.error("[ESCROW] Escrow blokaj hatası:", error);
      return { success: false, error: error.message };
    }

    console.log("[ESCROW] ✅ Fonlar başarıyla bloke edildi");
    return { success: true };
  } catch (error) {
    console.error("[ESCROW] Escrow blokaj hatası:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Bilinmeyen hata",
    };
  }
};

/**
 * Escrow onayı ekle (cihaz teslim alındı, takas tamamlandı, vb.)
 */
export const addEscrowConfirmation = async (
  escrowId: string,
  confirmation: EscrowConfirmation
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log("[ESCROW] Escrow onayı ekleniyor...", {
      escrowId,
      type: confirmation.confirmationType,
      userId: confirmation.userId,
    });

    // Mevcut escrow hesabını getir
    const { data: escrowAccount, error: fetchError } = await supabase
      .from("escrow_accounts")
      .select("*")
      .eq("id", escrowId)
      .single();

    if (fetchError || !escrowAccount) {
      return { success: false, error: "Escrow hesabı bulunamadı" };
    }

    // Mevcut onayları al ve yenisini ekle
    const existingConfirmations = escrowAccount.confirmations || [];
    const updatedConfirmations = [
      ...existingConfirmations,
      {
        ...confirmation,
        timestamp: new Date().toISOString(),
      },
    ];

    // Escrow hesabını güncelle
    const { error: updateError } = await supabase
      .from("escrow_accounts")
      .update({
        confirmations: updatedConfirmations,
      })
      .eq("id", escrowId);

    if (updateError) {
      console.error("[ESCROW] Onay ekleme hatası:", updateError);
      return { success: false, error: updateError.message };
    }

    console.log("[ESCROW] ✅ Onay başarıyla eklendi");

    // Tüm koşullar sağlandıysa otomatik serbest bırakma kontrolü yap
    await checkAutoReleaseConditions(escrowId);

    return { success: true };
  } catch (error) {
    console.error("[ESCROW] Onay ekleme hatası:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Bilinmeyen hata",
    };
  }
};

/**
 * Otomatik serbest bırakma koşullarını kontrol et
 */
const checkAutoReleaseConditions = async (escrowId: string): Promise<void> => {
  try {
    console.log(
      "[ESCROW] Otomatik serbest bırakma koşulları kontrol ediliyor...",
      escrowId
    );

    const { data: escrowAccount, error } = await supabase
      .from("escrow_accounts")
      .select("*")
      .eq("id", escrowId)
      .single();

    if (error || !escrowAccount || escrowAccount.status !== "held") {
      return;
    }

    const confirmations = escrowAccount.confirmations || [];
    const confirmationTypes = confirmations.map(
      (c: any) => c.confirmationType || c.type
    );

    // Gerekli onay türleri
    const requiredConfirmations = ["device_received", "exchange_confirmed"];

    // Tüm gerekli onaylar var mı kontrol et
    const allConfirmationsReceived = requiredConfirmations.every((required) =>
      confirmationTypes.includes(required)
    );

    if (allConfirmationsReceived) {
      console.log(
        "[ESCROW] 🚀 Tüm koşullar sağlandı, otomatik serbest bırakma başlatılıyor..."
      );
      await releaseEscrowFunds(escrowId, "Tüm onay koşulları sağlandı");
    } else {
      console.log("[ESCROW] ⏳ Henüz tüm koşullar sağlanmadı:", {
        required: requiredConfirmations,
        received: confirmationTypes,
      });
    }
  } catch (error) {
    console.error("[ESCROW] Otomatik serbest bırakma kontrol hatası:", error);
  }
};

/**
 * ⚠️ DEPRECATED - Backend API'yi kullan
 * 
 * Escrow fonlarını serbest bırakma işlemi artık backend API üzerinden yapılıyor.
 * Backend otomatik olarak tüm veritabanı güncellemelerini yapar.
 * 
 * Yeni kullanım: `POST /v1/payments/release-escrow`
 * 
 * @deprecated Backend API kullanılmalı: POST /v1/payments/release-escrow
 */
export const releaseEscrowFunds = async (
  escrowId: string,
  releaseReason: string
): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
  console.warn('[ESCROW] ⚠️ DEPRECATED - releaseEscrowFunds kullanılmamalıdır.');
  console.warn('[ESCROW] Backend API kullanılmalı: POST /v1/payments/release-escrow');
  
  // Backend API'yi kullan
  const { releaseEscrowLocal } = await import('../api/release-escrow');
  
  // Escrow ID'den payment ID'yi bul (okuma işlemi - hala yapılabilir)
  try {
    const { data: escrow } = await supabase
      .from('escrow_accounts')
      .select('payment_id, device_id')
      .eq('id', escrowId)
      .single();
    
    if (!escrow) {
      return { success: false, error: 'Escrow record not found' };
    }
    
    // Backend API'ye yönlendir
    const result = await releaseEscrowLocal({
      paymentId: escrow.payment_id,
      deviceId: escrow.device_id,
      releaseReason: releaseReason,
      confirmationType: 'manual_release',
      confirmedBy: '', // Backend'den alınacak
    });
    
    return {
      success: result.success,
      transactionId: result.transactionId,
      error: result.errorMessage,
    };
  } catch (error) {
    console.error('[ESCROW] Backend API hatası:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Escrow fonlarını iade et (takas iptal durumunda)
 */
export const refundEscrowFunds = async (
  escrowId: string,
  refundReason: string
): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
  try {
    console.log("[ESCROW] Escrow fonları iade ediliyor...", {
      escrowId,
      refundReason,
    });

    // Escrow hesabını güncelle
    const { data, error } = await supabase
      .from("escrow_accounts")
      .update({
        status: "refunded",
        refunded_at: new Date().toISOString(),
        refund_reason: refundReason,
      })
      .eq("id", escrowId)
      .select()
      .single();

    if (error) {
      console.error("[ESCROW] İade hatası:", error);
      return { success: false, error: error.message };
    }

    // Financial transaction kaydı oluştur
    const transactionId = await createFinancialTransaction(
      data,
      "refund_issued"
    );

    console.log("[ESCROW] ✅ Fonlar başarıyla iade edildi");
    return { success: true, transactionId };
  } catch (error) {
    console.error("[ESCROW] İade hatası:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Bilinmeyen hata",
    };
  }
};

/**
 * ⚠️ DEPRECATED - Backend otomatik olarak financial transaction kaydını oluşturuyor
 * 
 * Backend, escrow release işlemi sırasında otomatik olarak financial transaction kaydını oluşturuyor.
 * Bu fonksiyon artık kullanılmamalıdır.
 * 
 * @deprecated Backend otomatik olarak financial transaction kaydını oluşturuyor
 */
const createFinancialTransaction = async (
  escrowAccount: any,
  transactionType: string
): Promise<string> => {
  console.warn('[ESCROW] ⚠️ DEPRECATED - createFinancialTransaction kullanılmamalıdır.');
  throw new Error('This function is deprecated. Backend automatically creates financial transaction records.');
};

/**
 * Kullanıcının escrow hesaplarını getir
 */
export const getUserEscrowAccounts = async (
  userId: string
): Promise<{
  success: boolean;
  accounts?: EscrowAccount[];
  error?: string;
}> => {
  try {
    const { data, error } = await supabase
      .from("escrow_accounts")
      .select(
        `
        *,
        devices!escrow_accounts_device_id_fkey(model, serialNumber),
        payments!escrow_accounts_payment_id_fkey(status, created_at)
      `
      )
      .or(`holder_user_id.eq.${userId},beneficiary_user_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, accounts: data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Bilinmeyen hata",
    };
  }
};

/**
 * Escrow hesap detaylarını getir
 */
export const getEscrowAccountDetails = async (
  escrowId: string
): Promise<{ success: boolean; account?: EscrowAccount; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from("escrow_accounts")
      .select(
        `
        *,
        devices!escrow_accounts_device_id_fkey(*),
        payments!escrow_accounts_payment_id_fkey(*)
      `
      )
      .eq("id", escrowId)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, account: data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Bilinmeyen hata",
    };
  }
};
