/**
 * İyzico Payment Gateway Konfigürasyonu ve API Entegrasyonu
 * Gerçek İyzico API çağrıları için konfigürasyon ve yardımcı fonksiyonlar
 */

import Iyzipay from 'iyzipay';
import { getSecureConfig } from './security';
import { withErrorHandling, createPaymentError, ErrorLevel, ErrorCategory, translateIyzicoError } from './paymentErrorHandler';

// İyzico konfigürasyonu
export const getIyzicoConfig = () => {
  const config = getSecureConfig();
  
  // Test ortamı için sandbox credentials kullan
  const apiKey = config.iyzico.apiKey || 'sandbox-xQUfDCNqUzFl3TeQ6TwUxk7QovYnthKL';
  const secretKey = config.iyzico.secretKey || 'sandbox-njCZVrXuJuKXu12mUdjUs4g9sQHy9PqR';
  const baseUrl = config.iyzico.baseUrl || 'https://sandbox-api.iyzipay.com';
  
  console.log('[IYZICO_CONFIG] Using credentials:', {
    apiKey: apiKey.substring(0, 20) + '...',
    secretKey: secretKey.substring(0, 20) + '...',
    baseUrl
  });

  return new Iyzipay({
    apiKey,
    secretKey,
    uri: baseUrl
  });
};

// İyzico ödeme isteği oluşturma
export const createIyzicoPaymentRequest = (paymentData: {
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
}) => {
  const iyzico = getIyzicoConfig();
  
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
    callbackUrl: `${getSecureConfig().iyzico.callbackUrl}?conversationId=${paymentData.conversationId}`,
  
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

// İyzico ödeme işlemi
export const processIyzicoPayment = async (paymentData: any): Promise<{
  success: boolean;
  paymentId?: string;
  status: string;
  redirectUrl?: string;
  errorMessage?: string;
  providerResponse?: any;
}> => {
  return await withErrorHandling(async () => {
    console.log('[IYZICO] Ödeme işlemi başlatılıyor...', {
      conversationId: paymentData.conversationId,
      amount: paymentData.amount,
      buyer: paymentData.buyerInfo.email
    });

    const { iyzico, request } = createIyzicoPaymentRequest(paymentData);

    return new Promise((resolve, reject) => {
      iyzico.payment.create(request, (err: any, result: any) => {
        if (err) {
          console.error('[IYZICO] Ödeme hatası:', err);
          
          // İyzico hata kodunu çevir
          const errorCode = err.errorCode || '1001';
          const userFriendlyMessage = translateIyzicoError(errorCode, err.errorMessage);
          
          createPaymentError(
            errorCode,
            userFriendlyMessage,
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
            errorMessage: userFriendlyMessage,
            providerResponse: err
          });
          return;
        }

        console.log('[IYZICO] Ödeme sonucu:', result);

        if (result.status === 'success') {
          // 3D Secure gerekli mi kontrol et
          if (result.paymentId && result.status === 'success') {
            resolve({
              success: true,
              paymentId: result.paymentId,
              status: 'completed',
              providerResponse: result
            });
          } else {
            // 3D Secure gerekli
            resolve({
              success: true,
              paymentId: result.paymentId,
              status: 'processing',
              redirectUrl: result.paymentPageUrl,
              providerResponse: result
            });
          }
        } else {
          const errorCode = result.errorCode || '2006';
          const userFriendlyMessage = translateIyzicoError(errorCode, result.errorMessage);
          
          createPaymentError(
            errorCode,
            userFriendlyMessage,
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
            errorMessage: userFriendlyMessage,
            providerResponse: result
          });
        }
      });
    });
  }, {
    operation: 'processIyzicoPayment',
    paymentId: paymentData.conversationId
  }).then(result => {
    if (result.success) {
      return result.data!;
    } else {
      return {
        success: false,
        status: 'failed',
        errorMessage: result.error?.message || 'Bilinmeyen hata',
        providerResponse: result.error
      };
    }
  });
};

// İyzico ödeme durumu sorgulama
export const checkIyzicoPaymentStatus = async (paymentId: string): Promise<{
  success: boolean;
  status: string;
  errorMessage?: string;
  providerResponse?: any;
}> => {
  try {
    console.log('[IYZICO] Ödeme durumu sorgulanıyor:', paymentId);

    const iyzico = getIyzicoConfig();
    const request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: paymentId,
      paymentId: paymentId
    };

    return new Promise((resolve) => {
      iyzico.payment.retrieve(request, (err: any, result: any) => {
        if (err) {
          console.error('[IYZICO] Durum sorgulama hatası:', err);
          resolve({
            success: false,
            status: 'failed',
            errorMessage: err.message || 'Durum sorgulama hatası',
            providerResponse: err
          });
          return;
        }

        console.log('[IYZICO] Ödeme durumu:', result);

        resolve({
          success: result.status === 'success',
          status: result.status === 'success' ? 'completed' : 'failed',
          providerResponse: result
        });
      });
    });

  } catch (error) {
    console.error('[IYZICO] Durum sorgulama beklenmeyen hatası:', error);
    return {
      success: false,
      status: 'failed',
      errorMessage: error instanceof Error ? error.message : 'Bilinmeyen hata',
      providerResponse: error
    };
  }
};

// İyzico iade işlemi
export const refundIyzicoPayment = async (paymentId: string, amount: number, reason: string): Promise<{
  success: boolean;
  refundId?: string;
  status: string;
  errorMessage?: string;
  providerResponse?: any;
}> => {
  try {
    console.log('[IYZICO] İade işlemi başlatılıyor:', { paymentId, amount, reason });

    const iyzico = getIyzicoConfig();
    const request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: paymentId,
      paymentId: paymentId,
      ip: '127.0.0.1'
    };

    return new Promise((resolve) => {
      iyzico.cancel.create(request, (err: any, result: any) => {
        if (err) {
          console.error('[IYZICO] İade hatası:', err);
          resolve({
            success: false,
            status: 'failed',
            errorMessage: err.message || 'İade hatası',
            providerResponse: err
          });
          return;
        }

        console.log('[IYZICO] İade sonucu:', result);

        resolve({
          success: result.status === 'success',
          refundId: result.paymentId,
          status: result.status === 'success' ? 'refunded' : 'failed',
          providerResponse: result
        });
      });
    });

  } catch (error) {
    console.error('[IYZICO] İade beklenmeyen hatası:', error);
    return {
      success: false,
      status: 'failed',
      errorMessage: error instanceof Error ? error.message : 'Bilinmeyen hata',
      providerResponse: error
    };
  }
};

// İyzico webhook doğrulama
export const verifyIyzicoWebhook = (signature: string, body: string): boolean => {
  try {
    const config = getSecureConfig();
    const secretKey = config.iyzico.secretKey;
    
    // İyzico signature algoritması: HMAC-SHA256
    // Node.js ortamında crypto kullan
    if (typeof window === 'undefined') {
      const crypto = require('crypto');
      const hmac = crypto.createHmac('sha256', secretKey);
      hmac.update(body);
      const expectedSignature = hmac.digest('base64');
      
      const isValid = signature === expectedSignature;
      
      console.log('[IYZICO] Webhook signature doğrulaması:', { 
        isValid,
        signatureLength: signature?.length,
        bodyLength: body?.length 
      });
      
      return isValid;
    }
    
    // Browser ortamında SubtleCrypto kullan
    console.warn('[IYZICO] Webhook doğrulaması browser ortamında çalışmaz');
    return false;
  } catch (error) {
    console.error('[IYZICO] Webhook doğrulama hatası:', error);
    return false;
  }
};
