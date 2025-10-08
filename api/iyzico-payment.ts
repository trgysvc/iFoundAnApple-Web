/**
 * İyzico Payment API Endpoint (Server-side)
 * Bu endpoint server-side çalışır ve Iyzico SDK'sını kullanır
 */

import Iyzipay from 'iyzipay';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface IyzicoPaymentRequest {
  amount: number;
  currency: string;
  conversationId: string;
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
}

export async function handleIyzicoPayment(request: Request): Promise<Response> {
  try {
    console.log('[IYZICO_API] Payment request received');

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Request body'yi al
    const paymentData: IyzicoPaymentRequest = await request.json();
    console.log('[IYZICO_API] Payment data:', {
      conversationId: paymentData.conversationId,
      amount: paymentData.amount,
      buyer: paymentData.buyerInfo.email
    });

    // İyzico SDK'sını başlat (server-side)
    const iyzipay = new Iyzipay({
      apiKey: process.env.VITE_IYZICO_API_KEY || 'sandbox-xQUfDCNqUzFl3TeQ6TwUxk7QovYnthKL',
      secretKey: process.env.VITE_IYZICO_SECRET_KEY || 'sandbox-njCZVrXuJuKXu12mUdjUs4g9sQHy9PqR',
      uri: process.env.VITE_IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com'
    });

    console.log('[IYZICO_API] SDK initialized');

    // İyzico payment request oluştur
    const iyzicoRequest = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: paymentData.conversationId,
      price: paymentData.amount.toFixed(2),
      paidPrice: paymentData.amount.toFixed(2),
      currency: Iyzipay.CURRENCY.TRY,
      installment: '1',
      basketId: paymentData.conversationId,
      paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      paymentCard: {
        cardHolderName: 'Test User',
        cardNumber: '5528790000000008',
        expireMonth: '12',
        expireYear: '2030',
        cvc: '123',
        registerCard: '0'
      },
      buyer: {
        id: paymentData.buyerInfo.id,
        name: paymentData.buyerInfo.name,
        surname: paymentData.buyerInfo.surname,
        gsmNumber: paymentData.buyerInfo.phone,
        email: paymentData.buyerInfo.email,
        identityNumber: paymentData.buyerInfo.identityNumber,
        lastLoginDate: new Date().toISOString().split('T')[0] + ' 12:00:00',
        registrationDate: new Date().toISOString().split('T')[0] + ' 12:00:00',
        registrationAddress: paymentData.buyerInfo.address,
        ip: '85.34.78.112',
        city: paymentData.buyerInfo.city,
        country: paymentData.buyerInfo.country,
        zipCode: paymentData.buyerInfo.zipCode
      },
      shippingAddress: {
        contactName: paymentData.shippingAddress.contactName,
        city: paymentData.shippingAddress.city,
        country: paymentData.shippingAddress.country,
        address: paymentData.shippingAddress.address,
        zipCode: paymentData.shippingAddress.zipCode
      },
      billingAddress: {
        contactName: paymentData.billingAddress.contactName,
        city: paymentData.billingAddress.city,
        country: paymentData.billingAddress.country,
        address: paymentData.billingAddress.address,
        zipCode: paymentData.billingAddress.zipCode
      },
      basketItems: paymentData.basketItems.map(item => ({
        id: item.id,
        name: item.name,
        category1: item.category1,
        category2: item.category2,
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: item.price.toFixed(2)
      }))
    };

    console.log('[IYZICO_API] Sending payment request to Iyzico...');

    // İyzico'ya ödeme isteği gönder
    const result = await new Promise<any>((resolve, reject) => {
      iyzipay.payment.create(iyzicoRequest, (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    console.log('[IYZICO_API] Payment result:', {
      status: result.status,
      paymentId: result.paymentId,
      errorCode: result.errorCode,
      errorMessage: result.errorMessage
    });

    // Sonucu döndür
    if (result.status === 'success') {
      return new Response(JSON.stringify({
        success: true,
        paymentId: result.paymentId,
        conversationId: result.conversationId,
        status: 'completed',
        providerResponse: result
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        status: 'failed',
        errorMessage: result.errorMessage || 'Payment failed',
        errorCode: result.errorCode,
        providerResponse: result
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('[IYZICO_API] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      status: 'failed',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      error: error
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Export for Vercel/Netlify
export default handleIyzicoPayment;