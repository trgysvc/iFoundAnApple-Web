/**
 * İyzico 3D Secure Payment API Endpoint
 * Frontend'den 3D Secure ödeme işlemi başlatma
 */

import { process3DSecurePayment } from "../utils/iyzico3DSecure";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface Iyzico3DSecureRequest {
  amount: number;
  currency: string;
  conversationId: string;
  deviceId: string;
  buyerInfo: {
    id: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
    identityNumber: string;
    city: string;
    country: string;
    address: string;
    zipCode: string;
  };
  shippingAddress: {
    contactName: string;
    city: string;
    country: string;
    address: string;
    zipCode: string;
  };
  billingAddress: {
    contactName: string;
    city: string;
    country: string;
    address: string;
    zipCode: string;
  };
  basketItems: Array<{
    id: string;
    name: string;
    category1: string;
    category2: string;
    itemType: string;
    price: number;
  }>;
  cardInfo: {
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvc: string;
    cardHolderName: string;
  };
}

export async function handleIyzico3DSecurePayment(
  request: Request
): Promise<Response> {
  try {
    console.log("[IYZICO_3DS_API] 3D Secure payment request received");

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Request body'yi al
    const paymentData: Iyzico3DSecureRequest = await request.json();
    console.log("[IYZICO_3DS_API] Payment data:", {
      conversationId: paymentData.conversationId,
      amount: paymentData.amount,
      buyer: paymentData.buyerInfo.email,
      deviceId: paymentData.deviceId,
    });

    // 3D Secure ödeme işlemini başlat
    const result = await process3DSecurePayment(
      paymentData,
      paymentData.cardInfo
    );

    console.log("[IYZICO_3DS_API] 3D Secure payment result:", {
      success: result.success,
      status: result.status,
      paymentId: result.paymentId,
      redirectUrl: result.redirectUrl,
    });

    // Sonucu döndür
    return new Response(
      JSON.stringify({
        success: result.success,
        paymentId: result.paymentId,
        conversationId: paymentData.conversationId,
        status: result.status,
        redirectUrl: result.redirectUrl,
        errorMessage: result.errorMessage,
        providerResponse: result.providerResponse,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[IYZICO_3DS_API] Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        status: "failed",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        error: error,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
}

// Export for Vercel/Netlify
export default handleIyzico3DSecurePayment;
