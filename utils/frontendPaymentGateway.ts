/**
 * Frontend-Only İyzico Payment Gateway
 * Backend olmadan direkt İyzico API ile çalışır
 */

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

interface IyzicoResponse {
  status: string;
  errorMessage?: string;
  errorCode?: string;
  token?: string;
  paymentPageUrl?: string;
  checkoutFormContent?: string;
}

// İyzico Sandbox Credentials (Frontend'de güvenli değil ama test için)
const IYZICO_CONFIG = {
  apiKey: 'sandbox-xQUfDCNqUzFl3TeQ6TwUxk7QovYnthKL',
  secretKey: 'sandbox-njCZVrXuJuKXu12mUdjUs4g9sQHy9PqR',
  baseUrl: 'https://sandbox-api.iyzipay.com'
};

// İyzico signature hesaplama fonksiyonları (frontend uyumlu)
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
  
  const authorizationParams = [
    "apiKey" + ":" + apiKey,
    "randomKey" + ":" + randomString,
    "signature" + ":" + signatureHex,
  ];
  
  // Türkçe karakterleri encode et
  const encodeToBase64 = (str: string) => {
    return btoa(unescape(encodeURIComponent(str)));
  };
  
  return encodeToBase64(authorizationParams.join("&"));
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
  
  headers["Authorization"] = "IYZWSv2 " + authHash;
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

    // Callback URL (HashRouter için hash gerekli)
    const callbackUrl = `${window.location.origin}/#/payment/callback`;

    // İyzico 3DS Initialize request (örnek koduna göre)
    const conversationId = crypto.randomUUID();
    const basketId = "SB" + Math.floor(Date.now() / 1000);
    
    const checkoutRequest = {
      locale: 'tr',
      conversationId: conversationId,
      price: paymentData.amount.toFixed(1),
      paidPrice: paymentData.amount.toFixed(1),
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
      buyer: {
        id: 'BY' + Math.random().toString(36).substring(2, 8),
        name: paymentData.payerInfo.name || 'John',
        surname: paymentData.payerInfo.surname || 'Doe',
        identityNumber: '1234512345123125213125213',
        email: paymentData.payerInfo.email,
        gsmNumber: (paymentData.payerInfo.phone || '+905350000000').toString(),
        registrationAddress: 'Altunizade Mah. İnci Çıkmazı Sokak No: 3 İç Kapı No: 10 Üsküdar İstanbul',
        city: 'İstanbul',
        country: 'Turkey',
        zipCode: '34732',
        ip: '85.34.78.112'
      },
      shippingAddress: {
        address: 'Altunizade Mah. İnci Çıkmazı Sokak No: 3 İç Kapı No: 10 Üsküdar İstanbul',
        zipCode: '34742',
        contactName: (paymentData.payerInfo.name || 'John') + ' ' + (paymentData.payerInfo.surname || 'Doe'),
        city: 'Istanbul',
        country: 'Turkey'
      },
      billingAddress: {
        address: 'Altunizade Mah. İnci Çıkmazı Sokak No: 3 İç Kapı No: 10 Üsküdar İstanbul',
        zipCode: '34742',
        contactName: (paymentData.payerInfo.name || 'John') + ' ' + (paymentData.payerInfo.surname || 'Doe'),
        city: 'Istanbul',
        country: 'Turkey'
      },
      basketItems: [
        {
          id: paymentData.deviceId,
          price: paymentData.amount.toFixed(1),
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

    // Development'da mock response döndür (gerçek İyzico API'si yerine)
    const apiUrl = import.meta.env.DEV 
      ? '/api/iyzico'  // Vite proxy
      : `${IYZICO_CONFIG.baseUrl}/payment/3dsecure/initialize`;  // 3DS Initialize endpoint

    // Gerçek İyzico signature ile headers oluştur
    const uri = '/payment/3dsecure/initialize';
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
        errorMessage: result.errorMessage || '3DS initialization failed',
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
    
    // Yeni window'da 3DS sayfasını aç
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(decodedHtml);
      newWindow.document.close();
    } else {
      // Popup engellenmişse, mevcut sayfada göster
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
