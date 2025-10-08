/**
 * İyzico 3D Secure Entegrasyonu
 * 3D Secure doğrulama ve callback işlemleri
 */

import * as Iyzipay from 'iyzipay';
import { getIyzicoConfig } from './iyzicoConfig';
import { withErrorHandling, createPaymentError, ErrorLevel, ErrorCategory } from './paymentErrorHandler';

// 3D Secure ödeme isteği oluşturma
export const create3DSecurePaymentRequest = (paymentData: {
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
  cardInfo: {
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvc: string;
    cardHolderName: string;
  };
}) => {
  const iyzico = getIyzicoConfig();
  
  // v2.0.64 API - Düz obje kullanımı
  const request = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: paymentData.conversationId,
    price: paymentData.amount.toFixed(2),
    paidPrice: paymentData.amount.toFixed(2),
    currency: paymentData.currency,
    installment: 1,
    basketId: paymentData.conversationId,
    paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    
    // Callback URL
    callbackUrl: `${process.env.VITE_IYZICO_CALLBACK_URL || 'http://localhost:5173'}/api/webhooks/iyzico-3d-callback?conversationId=${paymentData.conversationId}`,
    
    // Kart bilgileri
    paymentCard: {
      cardHolderName: paymentData.cardInfo.cardHolderName,
      cardNumber: paymentData.cardInfo.cardNumber,
      expireMonth: paymentData.cardInfo.expiryMonth,
      expireYear: paymentData.cardInfo.expiryYear,
      cvc: paymentData.cardInfo.cvc,
      registerCard: 0
    },
    
    // Alıcı bilgileri
    buyer: {
      id: paymentData.buyerInfo.id,
      name: paymentData.buyerInfo.name,
      surname: paymentData.buyerInfo.surname,
      email: paymentData.buyerInfo.email,
      gsmNumber: paymentData.buyerInfo.phone,
      identityNumber: paymentData.buyerInfo.identityNumber,
      lastLoginDate: new Date().toISOString().split('T')[0] + ' 12:00:00',
      registrationDate: new Date().toISOString().split('T')[0] + ' 12:00:00',
      registrationAddress: paymentData.buyerInfo.address,
      ip: '127.0.0.1',
      city: paymentData.buyerInfo.city,
      country: paymentData.buyerInfo.country,
      zipCode: paymentData.buyerInfo.zipCode
    },
    
    // Fatura adresi
    billingAddress: {
      contactName: paymentData.billingAddress.contactName,
      city: paymentData.billingAddress.city,
      country: paymentData.billingAddress.country,
      address: paymentData.billingAddress.address,
      zipCode: paymentData.billingAddress.zipCode
    },
    
    // Kargo adresi
    shippingAddress: {
      contactName: paymentData.shippingAddress.contactName,
      city: paymentData.shippingAddress.city,
      country: paymentData.shippingAddress.country,
      address: paymentData.shippingAddress.address,
      zipCode: paymentData.shippingAddress.zipCode
    },
    
    // Sepet ürünleri
    basketItems: paymentData.basketItems.map(item => ({
      id: item.id,
      name: item.name,
      category1: item.category1,
      category2: item.category2,
      itemType: item.itemType,
      price: item.price.toFixed(2)
    }))
  };

  return { iyzico, request };
};

// 3D Secure ödeme işlemi
export const process3DSecurePayment = async (paymentData: any, cardInfo: any): Promise<{
  success: boolean;
  paymentId?: string;
  status: string;
  redirectUrl?: string;
  errorMessage?: string;
  providerResponse?: any;
}> => {
  return await withErrorHandling(async () => {
    console.log('[3D_SECURE] 3D Secure ödeme işlemi başlatılıyor...', {
      conversationId: paymentData.conversationId,
      amount: paymentData.amount,
      cardNumber: cardInfo.cardNumber.substring(0, 6) + '****' + cardInfo.cardNumber.substring(cardInfo.cardNumber.length - 4)
    });

    const { iyzico, request } = create3DSecurePaymentRequest({
      ...paymentData,
      cardInfo
    });

    return new Promise((resolve) => {
      iyzico.threedsPayment.create(request, (err: any, result: any) => {
        if (err) {
          console.error('[3D_SECURE] Ödeme hatası:', err);
          
          createPaymentError(
            err.errorCode || '2005',
            '3D Secure doğrulama hatası',
            ErrorLevel.ERROR,
            ErrorCategory.PAYMENT,
            {
              originalError: err,
              paymentData: {
                conversationId: paymentData.conversationId,
                amount: paymentData.amount
              }
            }
          );
          
          resolve({
            success: false,
            status: 'failed',
            errorMessage: '3D Secure doğrulama hatası',
            providerResponse: err
          });
          return;
        }

        console.log('[3D_SECURE] 3D Secure sonucu:', result);

        if (result.status === 'success') {
          // 3D Secure sayfasına yönlendirme
          resolve({
            success: true,
            paymentId: result.paymentId,
            status: 'processing',
            redirectUrl: result.paymentPageUrl,
            providerResponse: result
          });
        } else {
          createPaymentError(
            result.errorCode || '2006',
            '3D Secure ödeme başarısız',
            ErrorLevel.WARNING,
            ErrorCategory.PAYMENT,
            {
              result,
              paymentData: {
                conversationId: paymentData.conversationId,
                amount: paymentData.amount
              }
            }
          );
          
          resolve({
            success: false,
            status: 'failed',
            errorMessage: '3D Secure ödeme başarısız',
            providerResponse: result
          });
        }
      });
    });
  }, {
    operation: 'process3DSecurePayment',
    paymentId: paymentData.conversationId
  }).then(result => {
    if (result.success) {
      return result.data!;
    } else {
      return {
        success: false,
        status: 'failed',
        errorMessage: result.error?.message || '3D Secure hatası',
        providerResponse: result.error
      };
    }
  });
};

// 3D Secure callback işleme
export const handle3DSecureCallback = async (callbackData: {
  token: string;
  conversationId: string;
  status: string;
  paymentId?: string;
  errorMessage?: string;
}): Promise<{
  success: boolean;
  paymentId?: string;
  status: string;
  errorMessage?: string;
  providerResponse?: any;
}> => {
  return await withErrorHandling(async () => {
    console.log('[3D_SECURE_CALLBACK] Callback işleniyor:', callbackData);

    const iyzico = getIyzicoConfig();
    
    // v2.0.64 API - Düz obje kullanımı
    const request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: callbackData.conversationId,
      paymentId: callbackData.paymentId,
      conversationData: callbackData.token
    };

    return new Promise((resolve) => {
      iyzico.threedsPayment.create(request, (err: any, result: any) => {
        if (err) {
          console.error('[3D_SECURE_CALLBACK] Callback hatası:', err);
          
          createPaymentError(
            err.errorCode || '2005',
            '3D Secure callback hatası',
            ErrorLevel.ERROR,
            ErrorCategory.PAYMENT,
            {
              originalError: err,
              callbackData
            }
          );
          
          resolve({
            success: false,
            status: 'failed',
            errorMessage: '3D Secure callback hatası',
            providerResponse: err
          });
          return;
        }

        console.log('[3D_SECURE_CALLBACK] Callback sonucu:', result);

        if (result.status === 'success') {
          resolve({
            success: true,
            paymentId: result.paymentId,
            status: 'completed',
            providerResponse: result
          });
        } else {
          createPaymentError(
            result.errorCode || '2006',
            '3D Secure callback başarısız',
            ErrorLevel.WARNING,
            ErrorCategory.PAYMENT,
            {
              result,
              callbackData
            }
          );
          
          resolve({
            success: false,
            status: 'failed',
            errorMessage: '3D Secure callback başarısız',
            providerResponse: result
          });
        }
      });
    });
  }, {
    operation: 'handle3DSecureCallback',
    paymentId: callbackData.conversationId
  }).then(result => {
    if (result.success) {
      return result.data!;
    } else {
      return {
        success: false,
        status: 'failed',
        errorMessage: result.error?.message || '3D Secure callback hatası',
        providerResponse: result.error
      };
    }
  });
};

// 3D Secure test kartları
export const THREEDS_TEST_CARDS = {
  success: {
    cardNumber: '5528790000000008',
    expiryMonth: '12',
    expiryYear: '2030',
    cvc: '123',
    cardHolderName: 'John Doe'
  },
  failure: {
    cardNumber: '5528790000000016',
    expiryMonth: '12',
    expiryYear: '2030',
    cvc: '123',
    cardHolderName: 'John Doe'
  },
  '3d-secure': {
    cardNumber: '5528790000000024',
    expiryMonth: '12',
    expiryYear: '2030',
    cvc: '123',
    cardHolderName: 'John Doe'
  }
};

// 3D Secure test fonksiyonu
export const test3DSecurePayment = async (amount: number = 100): Promise<any> => {
  const paymentData = {
    amount,
    currency: 'TRY',
    conversationId: `test_3ds_${Date.now()}`,
    buyerInfo: {
      id: 'test-buyer-001',
      name: 'Test',
      surname: 'User',
      email: 'test@example.com',
      phone: '5555555555',
      identityNumber: '11111111111',
      city: 'İstanbul',
      country: 'Turkey',
      address: 'Test Mahallesi Test Sokak No:1',
      zipCode: '34000'
    },
    shippingAddress: {
      contactName: 'Test User',
      city: 'İstanbul',
      country: 'Turkey',
      address: 'Test Mahallesi Test Sokak No:1',
      zipCode: '34000'
    },
    billingAddress: {
      contactName: 'Test User',
      city: 'İstanbul',
      country: 'Turkey',
      address: 'Test Mahallesi Test Sokak No:1',
      zipCode: '34000'
    },
    basketItems: [
      {
        id: 'test-device-001',
        name: 'iPhone 15 Pro Max Device Recovery',
        category1: 'Electronics',
        category2: 'Mobile Device',
        itemType: 'PHYSICAL',
        price: amount
      }
    ]
  };

  return await process3DSecurePayment(paymentData, THREEDS_TEST_CARDS['3d-secure']);
};
