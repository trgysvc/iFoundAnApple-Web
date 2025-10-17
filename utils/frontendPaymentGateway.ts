/**
 * Frontend-Only Payment Gateway
 * Backend olmadan direkt payment API ile çalışır
 */

import { createClient } from './supabaseClient';
import { getSecureConfig } from './security';

interface PaymentData {
  deviceId: string;
  amount: number;
  payerInfo: {
    email: string;
    name: string;
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      postalCode?: string;
    };
  };
  payerId: string;
  deviceInfo?: {
    model: string;
  };
}

interface PaymentResponse {
  status: string;
  errorMessage?: string;
  errorCode?: string;
  token?: string;
  paymentPageUrl?: string;
  checkoutFormContent?: string;
}

// Test Payment Config (Frontend'de güvenli değil ama test için)
const TEST_CONFIG = {
  apiKey: 'test-api-key',
  secretKey: 'test-secret-key',
  baseUrl: 'https://test-api.example.com'
};

// Payment signature hesaplama fonksiyonları (frontend uyumlu)
const createRandomString = () => {
  return Date.now().toString() + Math.random().toString().substring(2, 8);
};

const generateHashV2 = async (apiKey: string, randomString: string, secretKey: string, body: string, uri: string) => {
  // Gerçek HMAC-SHA256 signature hesaplama
  const data = randomString + uri + body;
  
  // Web Crypto API ile HMAC-SHA256 hesapla
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secretKey);
  const messageData = encoder.encode(data);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  const signatureHex = Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  // İyzico'nun beklediği format: IYZWS apiKey:signature
  const authorization = apiKey + ":" + signatureHex;
  
  return btoa(authorization);
};

const createHeaders = async (body: any, uri: string) => {
  const randomString = createRandomString();
  const headers: { [key: string]: string } = {};
  
  const authHash = await generateHashV2(
    IYZICO_CONFIG.apiKey,
    randomString,
    IYZICO_CONFIG.secretKey,
    JSON.stringify(body),
    uri
  );
  
  headers["Authorization"] = "IYZWS " + authHash;
  headers["x-iyzi-rnd"] = randomString;
  headers["x-iyzi-client-version"] = "iyzipay-frontend-1.0.0";
  
  return headers;
};

export const createIyzicoCheckoutForm = async (paymentData: PaymentData): Promise<IyzicoResponse> => {
  try {
    console.log('[FRONTEND] İyzico Checkout Form oluşturuluyor...', {
      deviceId: paymentData.deviceId,
      amount: paymentData.amount,
      payer: paymentData.payerInfo.email
    });

    // Gerçek kullanıcı bilgilerini Supabase'den al
    const config = getSecureConfig();
    const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);
    
    const { data: { user } } = await supabase.auth.getUser();
    let userProfile = null;
    
    if (user) {
      const { data: profileData } = await supabase
        .from('userprofile')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      userProfile = profileData;
      console.log('[FRONTEND] Kullanıcı profili alındı:', userProfile);
    }

    // Callback URL (HashRouter için hash gerekli) - Device ID ile
    const callbackUrl = `${window.location.origin}/#/payment/callback?deviceId=${paymentData.deviceId}`;

    // İyzico 3DS Initialize request (örnek koduna göre)
    const conversationId = crypto.randomUUID();
    const basketId = "SB" + Math.floor(Date.now() / 1000);
    
    // Profil bilgileri kontrolü - ödeme için gerekli tüm bilgiler mevcut olmalı
    if (!userProfile?.first_name || !userProfile?.last_name || !userProfile?.tc_kimlik_no || 
        !userProfile?.phone_number || !userProfile?.address) {
      throw new Error('Profil bilgilerinizi tamamlayınız. Lütfen tekrar deneyin.');
    }

    // Gerçek kullanıcı bilgilerini kullan
    const buyerInfo = {
      id: user?.id?.substring(0, 8) || 'BY' + Math.random().toString(36).substring(2, 8),
      name: userProfile.first_name,
      surname: userProfile.last_name,
      identityNumber: userProfile.tc_kimlik_no,
      email: userProfile.email || paymentData.payerInfo.email,
      gsmNumber: userProfile.phone_number,
      registrationAddress: userProfile.address,
      city: userProfile.city || 'İstanbul',
      country: userProfile.country || 'Turkey',
      zipCode: userProfile.zip_code || '34732',
      ip: window.location.hostname === 'localhost' ? '127.0.0.1' : '85.34.78.112' // Gerçek IP için backend gerekli
    };

    console.log('[FRONTEND] Gerçek kullanıcı bilgileri İyzico\'ya gönderiliyor:', {
      name: buyerInfo.name,
      surname: buyerInfo.surname,
      identityNumber: buyerInfo.identityNumber?.substring(0, 3) + '***', // Güvenlik için maskelenmiş
      email: buyerInfo.email,
      phone: buyerInfo.gsmNumber?.substring(0, 3) + '***' // Güvenlik için maskelenmiş
    });
    
    const checkoutRequest = {
      locale: 'tr',
      conversationId: conversationId,
      price: paymentData.amount.toFixed(2),
      paidPrice: paymentData.amount.toFixed(2),
      installment: 1,
      paymentChannel: 'WEB',
      basketId: basketId,
      paymentGroup: 'PRODUCT',
      paymentCard: {
        cardHolderName: 'John Doe',
        cardNumber: '5528790000000008',
        expireYear: '28',
        expireMonth: '12',
        cvc: '123'
      },
      buyer: buyerInfo,
      shippingAddress: {
        address: buyerInfo.registrationAddress,
        zipCode: buyerInfo.zipCode,
        contactName: `${buyerInfo.name} ${buyerInfo.surname}`,
        city: buyerInfo.city,
        country: buyerInfo.country
      },
      billingAddress: {
        address: buyerInfo.registrationAddress,
        zipCode: buyerInfo.zipCode,
        contactName: `${buyerInfo.name} ${buyerInfo.surname}`,
        city: buyerInfo.city,
        country: buyerInfo.country
      },
      basketItems: [
        {
          id: paymentData.deviceId,
          price: paymentData.amount.toFixed(2),
          name: paymentData.deviceInfo.model || 'iPhone',
          category1: 'Electronics',
          itemType: 'PHYSICAL'
        }
      ],
      currency: 'TRY',
      callbackUrl: callbackUrl
    };

    console.log('[FRONTEND] Creating checkout form...');
    console.log('[FRONTEND] Request data:', JSON.stringify(checkoutRequest, null, 2));

    // Gerçek İyzico API'sini kullan
    const apiUrl = `${IYZICO_CONFIG.baseUrl}/payment/iyzipos/checkoutform/auth/ecom/initialize`;
    console.log('[FRONTEND] Gerçek İyzico API\'sine istek gönderiliyor...', apiUrl);

    // Gerçek İyzico signature ile headers oluştur
    const uri = '/payment/iyzipos/checkoutform/auth/ecom/initialize';
    const headers = await createHeaders(checkoutRequest, uri);
    headers['Content-Type'] = 'application/json';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(checkoutRequest)
    });

    if (!response.ok) {
      throw new Error(`İyzico API error: ${response.status}`);
    }

    const result = await response.json();
    console.log('[FRONTEND] İyzico response:', result);

    if (result.status === 'success') {
      return {
        success: true,
        threeDSHtmlContent: result.threeDSHtmlContent,
        paymentId: result.paymentId,
        conversationId: checkoutRequest.conversationId,
        redirectUrl: callbackUrl
      };
    } else {
      return {
        success: false,
        errorMessage: result.errorMessage || 'Checkout form initialization failed',
        errorCode: result.errorCode
      };
    }

  } catch (error) {
    console.error('[FRONTEND] İyzico checkout error:', error);
    return {
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const verifyPayment = async (token: string): Promise<IyzicoResponse> => {
  try {
    console.log('[FRONTEND] Verifying payment with token...');

    // Development'da proxy kullan, production'da direkt API
    const apiUrl = import.meta.env.DEV 
      ? '/api/iyzico-verify'  // Vite proxy
      : `${IYZICO_CONFIG.baseUrl}/payment/iyzipos/checkoutform/auth/ecom/detail`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    // Production'da Authorization header ekle
    if (!import.meta.env.DEV) {
      headers['Authorization'] = `IYZWS ${IYZICO_CONFIG.apiKey}:${btoa(IYZICO_CONFIG.secretKey)}`;
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        token: token,
        locale: 'tr',
        conversationId: `verify_${Date.now()}`
      })
    });

    if (!response.ok) {
      throw new Error(`İyzico API error: ${response.status}`);
    }

    const result = await response.json();
    console.log('[FRONTEND] Payment verification result:', result);

    return result;

  } catch (error) {
    console.error('[FRONTEND] Payment verification error:', error);
    return {
      status: 'failure',
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// 3DS HTML Content'i decode et ve kullanıcıyı yönlendir
export const handle3DSRedirect = (threeDSHtmlContent: string) => {
  try {
    console.log('[FRONTEND] 3DS HTML content decode ediliyor...');
    
    // Base64 decode
    const decodedHtml = atob(threeDSHtmlContent);
    console.log('[FRONTEND] Decoded HTML:', decodedHtml);
    
    // İyzico'nun form'undan token bilgilerini çıkar
    const parser = new DOMParser();
    const doc = parser.parseFromString(decodedHtml, 'text/html');
    const form = doc.getElementById('iyzico-3ds-form');
    
    if (form) {
      const orderIdInput = form.querySelector('input[name="orderId"]');
      const orderId = orderIdInput ? orderIdInput.getAttribute('value') : null;
      
      console.log('[FRONTEND] İyzico orderId extracted:', orderId);
      
      // OrderId'yi localStorage'a kaydet (callback'te kullanmak için)
      if (orderId) {
        localStorage.setItem('iyzico_orderId', orderId);
      }
    }
    
    // İyzico'nun orijinal form'unu kullan (callbackUrl zaten doğru)
    console.log('[FRONTEND] İyzico 3DS form açılıyor...');
    
    // Aynı pencerede 3DS sayfasını aç - window.location.href ile
    const newForm = document.createElement('form');
    newForm.method = 'POST';
    newForm.action = 'https://sandbox-api.iyzipay.com/payment/3dsecure/initialize';
    newForm.target = '_self';
    
    // HTML content'i parse et ve form'a ekle
    const newParser = new DOMParser();
    const newDoc = newParser.parseFromString(decodedHtml, 'text/html');
    const originalForm = newDoc.querySelector('form');
    
    if (originalForm) {
      // Orijinal form'dan input'ları al
      const inputs = originalForm.querySelectorAll('input');
      inputs.forEach(input => {
        const newInput = document.createElement('input');
        newInput.type = 'hidden';
        newInput.name = input.name;
        newInput.value = input.value;
        newForm.appendChild(newInput);
      });
      
      // Form'u submit et
      document.body.appendChild(newForm);
      newForm.submit();
    } else {
      // Fallback: Mevcut sayfada göster
      const container = document.getElementById('3ds-container');
      if (container) {
        container.innerHTML = decodedHtml;
      } else {
        console.error('[FRONTEND] 3DS container bulunamadı');
      }
    }
    
    return true;
  } catch (error) {
    console.error('[FRONTEND] 3DS HTML decode error:', error);
    return false;
  }
};
