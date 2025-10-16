import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import { createClient } from '@supabase/supabase-js';
import { getSecureConfig } from '../utils/security';

const PaymentCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');

  // Ödeme bilgilerini database'e kaydet
  const savePaymentToDatabase = async (iyzicoResult: any) => {
    try {
      console.log('[DATABASE] Ödeme bilgileri database\'e kaydediliyor...', iyzicoResult);

      // Supabase client oluştur
      const config = getSecureConfig();
      const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);

      // İyzico sonucundan bilgileri al
      const deviceId = iyzicoResult.basketId || 'unknown_device';
      const amount = iyzicoResult.paidPrice || '449.1';
      
      console.log('[DATABASE] Device ID to search:', deviceId);
      
      // Device bilgilerini Supabase'den al
      const { data: deviceData, error: deviceFetchError } = await supabase
        .from('devices')
        .select('id, userId, model, serialNumber')
        .eq('id', deviceId)
        .single();
      
      if (deviceFetchError) {
        console.error('[DATABASE] Device bilgisi alınamadı:', deviceFetchError);
        throw new Error('Device bilgisi bulunamadı');
      }
      
      const payerId = deviceData.userId;

      // 1. Payment kaydını oluştur (gerçek payments tablosu yapısına uygun)
      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .insert({
          // Temel bilgiler
          device_id: deviceId,
          payer_id: payerId,
          receiver_id: null, // Finder ID'si henüz belirlenmemiş
          
          // Tutar bilgileri
          total_amount: parseFloat(amount),
          reward_amount: parseFloat(amount) * 0.8, // %80 ödül
          cargo_fee: 25.00, // Standart kargo ücreti
          payment_gateway_fee: parseFloat(amount) * 0.02, // %2 gateway ücreti
          service_fee: parseFloat(amount) * 0.18, // %18 servis ücreti
          net_payout: parseFloat(amount) * 0.8, // Net ödeme
          
          // Ödeme bilgileri
          payment_provider: 'iyzico',
          provider_payment_id: iyzicoResult.paymentId,
          provider_response: JSON.stringify(iyzicoResult),
          payment_method: 'credit_card', // 3DS credit card
          
          // Durum bilgileri
          payment_status: 'completed',
          escrow_status: 'held',
          
          // Para birimi
          currency: 'TRY',
          
          // Timestamps
          completed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (paymentError) {
        console.error('[DATABASE] Payment kayıt hatası:', paymentError);
        console.error('[DATABASE] Payment kayıt detayı:', JSON.stringify(paymentError, null, 2));
        throw paymentError;
      }

      console.log('[DATABASE] Payment kaydedildi:', paymentData);

      // 2. Escrow hesabı oluştur
      const { data: escrowData, error: escrowError } = await supabase
        .from('escrow_accounts')
        .insert({
          payment_id: paymentData.id,
          device_id: deviceId,
          holder_user_id: payerId,
          beneficiary_user_id: payerId, // Şimdilik payer'ı beneficiary yap
          total_amount: parseFloat(amount),
          reward_amount: parseFloat(amount) * 0.8,
          service_fee: parseFloat(amount) * 0.18,
          gateway_fee: parseFloat(amount) * 0.02,
          cargo_fee: 25.00,
          net_payout: parseFloat(amount) * 0.8,
          status: 'held',
          held_at: new Date().toISOString(),
          release_conditions: [
            {
              type: 'device_received',
              description: 'Device must be received by finder',
              met: false
            },
            {
              type: 'exchange_confirmed',
              description: 'Both parties must confirm exchange',
              met: false
            }
          ],
          confirmations: [],
          currency: 'TRY',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (escrowError) {
        console.error('[DATABASE] Escrow hesabı oluşturma hatası:', escrowError);
        // Escrow oluşturulamadı ama payment kaydedildi, hata fırlatma
      } else {
        console.log('[DATABASE] Escrow hesabı oluşturuldu:', escrowData.id);
      }

      // 3. Device durumunu güncelle (ödeme alındı)
      const { error: deviceError } = await supabase
        .from('devices')
        .update({
          status: 'payment_completed', // Device status'unu güncelle - mevcut sistemle uyumlu
          updated_at: new Date().toISOString()
        })
        .eq('id', deviceId);

      if (deviceError) {
        console.error('[DATABASE] Device güncelleme hatası:', deviceError);
        // Payment kaydedildi ama device güncellenemedi, hata fırlatma
      } else {
        console.log('[DATABASE] Device durumu güncellendi: payment_status = paid');
      }

      // 3. Notification ekle
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: payerId,
          type: 'payment_success',
          title: 'Ödeme Başarılı',
          message: `Cihaz için ödeme başarıyla alındı. Tutar: ₺${amount}`,
          data: {
            payment_id: paymentData.id,
            device_id: deviceId,
            amount: amount
          },
          created_at: new Date().toISOString()
        });

      if (notificationError) {
        console.error('[DATABASE] Notification kayıt hatası:', notificationError);
      } else {
        console.log('[DATABASE] Notification eklendi');
      }

      console.log('[DATABASE] Tüm kayıtlar başarıyla tamamlandı');
      
    } catch (error) {
      console.error('[DATABASE] Database kayıt hatası:', error);
      throw error;
    }
  };

  useEffect(() => {
    console.log('[PAYMENT] Callback page loaded');
    console.log('[PAYMENT] Current URL:', window.location.href);
    console.log('[PAYMENT] Search params:', Object.fromEntries(searchParams.entries()));
    
    // Component mount olduğunda hemen çalışsın
    const processCallback = async () => {
      // URL'den parametreleri al (GET request)
      const token = searchParams.get('token');
      const error = searchParams.get('error');
      const paymentId = searchParams.get('paymentId');
      const deviceId = searchParams.get('device_id');
      const amount = searchParams.get('amount');
      const status = searchParams.get('status'); // success/failure

      console.log('[PAYMENT] Callback received (GET):', {
        token: token?.substring(0, 20) + '...',
        error,
        paymentId,
        deviceId,
        amount,
        status
      });

      // İyzico'dan gelen status parametresini kontrol et
      if (status === 'success') {
        console.log('[PAYMENT] İyzico success callback received');
        setStatus('success');
        setMessage('Ödeme başarıyla tamamlandı!');
        
        // Başarılı ödeme sonrası yönlendirme
        setTimeout(() => {
          const successPaymentId = paymentId || 'iyzico_payment_' + Date.now();
          navigate(`/payment/success?paymentId=${successPaymentId}`);
        }, 2000);
        return;
      }

      if (status === 'failure') {
        console.log('[PAYMENT] İyzico failure callback received');
        setStatus('error');
        setMessage('Ödeme başarısız oldu. Lütfen tekrar deneyin.');
        return;
      }

      if (error) {
        setStatus('error');
        setMessage(error === 'token_missing' ? 'Token bulunamadı' : 
                   error === 'payment_failed' ? 'Ödeme başarısız' :
                   error === 'verification_failed' ? 'Doğrulama başarısız' : 'Bilinmeyen hata');
        return;
      }

      if (token) {
        // GET request'ten token geldi
        verifyPayment(token);
      } else {
        // POST request'ten geldi veya test modu
        console.log('[PAYMENT] No token in URL, handling İyzico POST callback...');
        handlePostCallback();
      }
    };
    
    // İyzico POST callback'i handle et
    const handlePostCallback = async () => {
      console.log('[PAYMENT] İyzico POST callback received');
      
      try {
        // İyzico'dan ödeme durumunu kontrol et
        console.log('[PAYMENT] İyzico\'dan ödeme durumu kontrol ediliyor...');
        
        // Development'da proxy kullan, production'da direkt API
        const apiUrl = import.meta.env.DEV 
          ? '/api/iyzico-verify'
          : 'https://sandbox-api.iyzipay.com/payment/iyzipos/checkoutform/auth/ecom/detail';

        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        };

        // Production'da Authorization header ekle
        if (!import.meta.env.DEV) {
          headers['Authorization'] = `IYZWS sandbox-xQUfDCNqUzFl3TeQ6TwUxk7QovYnthKL:${btoa('sandbox-njCZVrXuJuKXu12mUdjUs4g9sQHy9PqR')}`;
        }

        // localStorage'dan orderId'yi al (3DS form'dan çıkarılan)
        const orderId = localStorage.getItem('iyzico_orderId');
        
        // Test modunda basit bir token oluştur
        const verificationToken = orderId || `test_token_${Date.now()}`;
        
        console.log('[PAYMENT] Using token for verification:', verificationToken);
        
        // Development modunda mock response kullan
        let result;
        if (import.meta.env.DEV) {
          console.log('[PAYMENT] Development modu - Mock başarılı ödeme simüle ediliyor...');
          
          // URL'den device ID'yi al (match-payment sayfasından gelen)
          const urlDeviceId = searchParams.get('deviceId') || 'cd46213e-0d1e-4e8d-a585-87f4977c3552';
          console.log('[PAYMENT] Device ID from URL:', urlDeviceId);
          
          result = {
            status: 'success',
            paymentStatus: 'SUCCESS',
            paymentId: 'mock_payment_' + Date.now(),
            paidPrice: '449.1',
            basketId: urlDeviceId, // URL'den gelen gerçek device ID
            conversationId: `callback_${Date.now()}`
          };
        } else {
          // Production'da gerçek API çağrısı
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              token: verificationToken,
              locale: 'tr',
              conversationId: `callback_${Date.now()}`
            })
          });

          if (!response.ok) {
            throw new Error(`İyzico API error: ${response.status}`);
          }

          result = await response.json();
        }
        
        console.log('[PAYMENT] İyzico verification result:', result);

        if (result.status === 'success' && result.paymentStatus === 'SUCCESS') {
          console.log('[PAYMENT] Ödeme başarılı, database\'e kayıt yapılıyor...');
          
          try {
            // Ödeme başarılı, database'e kayıt yap
            await savePaymentToDatabase(result);
            
            setStatus('success');
            setMessage('Ödeme başarıyla tamamlandı ve kaydedildi!');
            
            // Başarılı ödeme sonrası yönlendirme
            setTimeout(() => {
              const paymentId = result.paymentId || 'iyzico_payment_' + Date.now();
              navigate(`/payment/success?paymentId=${paymentId}`);
            }, 2000);
            
          } catch (dbError) {
            console.error('[PAYMENT] Database kayıt hatası:', dbError);
            setStatus('error');
            setMessage('Ödeme alındı ancak kayıt sırasında hata oluştu. Lütfen destek ile iletişime geçin.');
          }
        } else {
          setStatus('error');
          setMessage(result.errorMessage || 'Ödeme başarısız');
        }
        
      } catch (error) {
        console.error('[PAYMENT] Verification error:', error);
        setStatus('error');
        setMessage('Ödeme doğrulaması sırasında hata oluştu');
      }
    };
    
    // Callback'i işle
    processCallback();
  }, [searchParams, navigate]);

  const verifyPayment = async (token: string) => {
    try {
      console.log('[PAYMENT] Verifying payment with token...');
      
      // İyzico'dan payment bilgilerini al
      const response = await fetch('https://sandbox-api.iyzipay.com/payment/iyzipos/checkoutform/auth/ecom/detail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `IYZWS sandbox-xQUfDCNqUzFl3TeQ6TwUxk7QovYnthKL:${btoa('sandbox-njCZVrXuJuKXu12mUdjUs4g9sQHy9PqR')}`,
        },
        body: JSON.stringify({
          token: token,
          locale: 'tr',
          conversationId: `callback_${Date.now()}`
        })
      });

      if (!response.ok) {
        throw new Error('İyzico API error');
      }

      const result = await response.json();
      console.log('[PAYMENT] İyzico verification result:', result);

      if (result.status === 'success' && result.paymentStatus === 'SUCCESS') {
        setStatus('success');
        setMessage('Ödeme başarıyla tamamlandı!');
        
        // Başarılı ödeme sonrası yönlendirme
        setTimeout(() => {
          navigate('/payment/success', {
            state: {
              paymentId: result.paymentId,
              amount: result.paidPrice,
              deviceId: result.basketId
            }
          });
        }, 2000);
      } else {
        setStatus('error');
        setMessage(result.errorMessage || 'Ödeme başarısız');
      }
    } catch (error) {
      console.error('[PAYMENT] Verification error:', error);
      setStatus('error');
      setMessage('Ödeme doğrulaması sırasında hata oluştu');
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'error':
        return <XCircle className="w-16 h-16 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
    }
  };

  return (
    <Container className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          {getStatusIcon()}
        </div>
        
        <h1 className={`text-2xl font-bold mb-4 ${getStatusColor()}`}>
          {status === 'loading' && 'Ödeme İşleniyor...'}
          {status === 'success' && 'Ödeme Başarılı!'}
          {status === 'error' && 'Ödeme Hatası'}
        </h1>
        
        <p className="text-gray-600 mb-6">
          {status === 'loading' && 'Ödeme bilgileriniz doğrulanıyor, lütfen bekleyin...'}
          {status === 'success' && 'Ödemeniz başarıyla alınmıştır. Yönlendiriliyorsunuz...'}
          {status === 'error' && message}
        </p>

        {status === 'error' && (
          <div className="space-y-4">
            <Button 
              onClick={() => navigate('/dashboard')}
              className="w-full"
            >
              Ana Sayfaya Dön
            </Button>
            <Button 
              onClick={() => navigate(-1)}
              variant="outline"
              className="w-full"
            >
              Geri Dön
            </Button>
          </div>
        )}

        {status === 'loading' && (
          <div className="text-sm text-gray-500">
            Bu işlem birkaç saniye sürebilir...
          </div>
        )}
      </div>
    </Container>
  );
};

export default PaymentCallbackPage;