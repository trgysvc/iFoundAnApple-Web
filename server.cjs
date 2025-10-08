/**
 * Simple Express Server for Iyzico API
 * Bu server Iyzico SDK'sını kullanarak ödeme işlemlerini yapar
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const Iyzipay = require('iyzipay');

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(cors());
app.use(express.json());

// Production'da static files serve et
if (isProduction) {
  app.use(express.static(path.join(__dirname, 'dist')));
}

// İyzico Configuration
const iyzipay = new Iyzipay({
  apiKey: process.env.VITE_IYZICO_API_KEY || 'sandbox-xQUfDCNqUzFl3TeQ6TwUxk7QovYnthKL',
  secretKey: process.env.VITE_IYZICO_SECRET_KEY || 'sandbox-njCZVrXuJuKXu12mUdjUs4g9sQHy9PqR',
  uri: process.env.VITE_IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com'
});

console.log('[SERVER] İyzico API Server başlatılıyor...');
console.log('[SERVER] API Key:', (process.env.VITE_IYZICO_API_KEY || 'sandbox-xQUfDCNqUzFl3TeQ6TwUxk7QovYnthKL').substring(0, 20) + '...');

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'İyzico API Server çalışıyor' });
});

// İyzico Payment Endpoint
app.post('/api/iyzico-payment', async (req, res) => {
  try {
    console.log('[SERVER] Payment request received');
    const paymentData = req.body;

    console.log('[SERVER] Payment data:', {
      conversationId: paymentData.conversationId,
      amount: paymentData.amount,
      buyer: paymentData.buyerInfo.email
    });

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

    console.log('[SERVER] İyzico\'ya istek gönderiliyor...');

    // İyzico'ya ödeme isteği gönder
    iyzipay.payment.create(iyzicoRequest, (err, result) => {
      if (err) {
        console.error('[SERVER] İyzico hatası:', err);
        return res.status(500).json({
          success: false,
          status: 'failed',
          errorMessage: err.errorMessage || 'İyzico API hatası',
          error: err
        });
      }

      console.log('[SERVER] İyzico yanıtı:', {
        status: result.status,
        paymentId: result.paymentId,
        errorCode: result.errorCode
      });

      // Sonucu döndür
      if (result.status === 'success') {
        res.json({
          success: true,
          paymentId: result.paymentId,
          conversationId: result.conversationId,
          status: 'completed',
          providerResponse: result
        });
      } else {
        res.json({
          success: false,
          status: 'failed',
          errorMessage: result.errorMessage || 'Payment failed',
          errorCode: result.errorCode,
          providerResponse: result
        });
      }
    });

  } catch (error) {
    console.error('[SERVER] Error:', error);
    res.status(500).json({
      success: false,
      status: 'failed',
      errorMessage: error.message || 'Unknown error',
      error: error
    });
  }
});

// Production'da tüm route'ları index.html'e yönlendir (SPA için)
if (isProduction) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ İyzico API Server çalışıyor: http://localhost:${PORT}`);
  console.log(`📊 Mode: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💳 Payment endpoint: http://localhost:${PORT}/api/iyzico-payment\n`);
});
