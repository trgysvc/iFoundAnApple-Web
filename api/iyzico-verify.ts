import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token, conversationId } = await request.json();

    console.log('[IYZICO_VERIFY] Backend doğrulama başlatılıyor...', {
      token: token?.substring(0, 20) + '...',
      conversationId
    });

    // İyzico API credentials
    const apiKey = 'sandbox-xQUfDCNqUzFl3TeQ6TwUxk7QovYnthKL';
    const secretKey = 'sandbox-njCZVrXuJuKXu12mUdjUs4g9sQHy9PqR';
    const apiUrl = 'https://sandbox-api.iyzipay.com/payment/iyzipos/checkoutform/auth/ecom/detail';

    // İyzico API request
    const iyzicoRequest = {
      locale: 'tr',
      conversationId: conversationId || `verify_${Date.now()}`,
      token: token
    };

    console.log('[IYZICO_VERIFY] İyzico API\'ye istek gönderiliyor...', {
      token: token?.substring(0, 20) + '...',
      conversationId: iyzicoRequest.conversationId
    });

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `IYZWS ${apiKey}:${btoa(secretKey)}`
      },
      body: JSON.stringify(iyzicoRequest)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[IYZICO_VERIFY] İyzico API hatası:', response.status, errorText);
      throw new Error(`İyzico API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('[IYZICO_VERIFY] İyzico API yanıtı:', result);
    
    // İyzico yanıtını kontrol et
    if (result.status !== 'success') {
      throw new Error(`İyzico doğrulama başarısız: ${result.errorMessage || 'Unknown error'}`);
    }

    return NextResponse.json({
      success: true,
      status: result.status,
      paymentStatus: result.paymentStatus,
      paymentId: result.paymentId,
      paidPrice: result.paidPrice,
      basketId: result.basketId,
      conversationId: result.conversationId,
      rawResponse: result
    });

  } catch (error) {
    console.error('[IYZICO_VERIFY] Backend doğrulama hatası:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'error'
    }, { status: 500 });
  }
}