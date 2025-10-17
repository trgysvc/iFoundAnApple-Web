/**
 * Frontend 3D Secure Payment Utility
 * Frontend'den 3D Secure ödeme işlemi başlatma
 */

export interface Payment3DSecureData {
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

export interface Payment3DSecureResponse {
  success: boolean;
  paymentId?: string;
  conversationId: string;
  status: string;
  redirectUrl?: string;
  errorMessage?: string;
  providerResponse?: any;
}

/**
 * 3D Secure ödeme işlemini başlat
 */
export async function initiate3DSecurePayment(
  paymentData: Payment3DSecureData
): Promise<Payment3DSecureResponse> {
  try {
    console.log("[FRONTEND_3DS] Initiating 3D Secure payment:", {
      conversationId: paymentData.conversationId,
      amount: paymentData.amount,
      deviceId: paymentData.deviceId,
    });

    const response = await fetch("/api/iyzico-3d-secure", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: Payment3DSecureResponse = await response.json();

    console.log("[FRONTEND_3DS] Payment response:", result);

    if (result.success && result.redirectUrl) {
      // 3D Secure sayfasına yönlendir
      console.log(
        "[FRONTEND_3DS] Redirecting to 3D Secure page:",
        result.redirectUrl
      );
      window.location.href = result.redirectUrl;
    }

    return result;
  } catch (error) {
    console.error("[FRONTEND_3DS] Payment error:", error);
    return {
      success: false,
      conversationId: paymentData.conversationId,
      status: "failed",
      errorMessage:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Test kartları ile 3D Secure ödeme testi
 */
export async function test3DSecurePayment(
  amount: number = 100
): Promise<Payment3DSecureResponse> {
  const testPaymentData: Payment3DSecureData = {
    amount,
    currency: "TRY",
    conversationId: `test_3ds_${Date.now()}`,
    deviceId: "test-device-001",
    buyerInfo: {
      id: "test-buyer-001",
      name: "Test",
      surname: "User",
      email: "test@example.com",
      phone: "5555555555",
      identityNumber: "11111111111",
      city: "İstanbul",
      country: "Turkey",
      address: "Test Mahallesi Test Sokak No:1",
      zipCode: "34000",
    },
    shippingAddress: {
      contactName: "Test User",
      city: "İstanbul",
      country: "Turkey",
      address: "Test Mahallesi Test Sokak No:1",
      zipCode: "34000",
    },
    billingAddress: {
      contactName: "Test User",
      city: "İstanbul",
      country: "Turkey",
      address: "Test Mahallesi Test Sokak No:1",
      zipCode: "34000",
    },
    basketItems: [
      {
        id: "test-device-001",
        name: "iPhone 15 Pro Max Device Recovery",
        category1: "Electronics",
        category2: "Mobile Device",
        itemType: "PHYSICAL",
        price: amount,
      },
    ],
    cardInfo: {
      cardNumber: "5528790000000024", // 3D Secure test kartı
      expiryMonth: "12",
      expiryYear: "2030",
      cvc: "123",
      cardHolderName: "John Doe",
    },
  };

  return await initiate3DSecurePayment(testPaymentData);
}

/**
 * Test kartları
 */
export const TEST_CARDS = {
  // Başarılı ödeme kartı
  success: {
    cardNumber: "5528790000000008",
    expiryMonth: "12",
    expiryYear: "2030",
    cvc: "123",
    cardHolderName: "John Doe",
  },
  // Başarısız ödeme kartı
  failure: {
    cardNumber: "5528790000000016",
    expiryMonth: "12",
    expiryYear: "2030",
    cvc: "123",
    cardHolderName: "John Doe",
  },
  // 3D Secure doğrulama kartı (SMS kodu: 123456)
  "3d-secure": {
    cardNumber: "5528790000000024",
    expiryMonth: "12",
    expiryYear: "2030",
    cvc: "123",
    cardHolderName: "John Doe",
  },
  // 3D Secure başarılı kartı (SMS kodu: 123456)
  "3d-secure-success": {
    cardNumber: "5528790000000032",
    expiryMonth: "12",
    expiryYear: "2030",
    cvc: "123",
    cardHolderName: "John Doe",
  },
  // 3D Secure başarısız kartı (SMS kodu: 000000)
  "3d-secure-failure": {
    cardNumber: "5528790000000040",
    expiryMonth: "12",
    expiryYear: "2030",
    cvc: "123",
    cardHolderName: "John Doe",
  },
};
