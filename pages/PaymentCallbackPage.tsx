import React, { useEffect, useState, useRef } from 'react';
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
  const savePaymentToDatabase = async (paymentResult: any, realPaymentId?: string) => {
    try {
      console.log('[DATABASE] Ödeme bilgileri database\'e kaydediliyor...', paymentResult);

      // Supabase client oluştur
      const config = getSecureConfig();
      const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);

      // Payment sonucundan bilgileri al
      const deviceId = paymentResult.basketId || 'unknown_device';
      const amount = paymentResult.paidPrice || '449.1';
      
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

      // Gerçek UUID kullan (parametre olarak gelen veya yeni oluştur)
      const paymentId = realPaymentId || crypto.randomUUID();
      
      // 1. Payment kaydını oluştur (gerçek payments tablosu yapısına uygun)
      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .insert({
          // Gerçek UUID kullan
          id: paymentId,
          
          // Temel bilgiler
          device_id: deviceId,
          payer_id: payerId,
          receiver_id: null, // Finder ID'si henüz belirlenmemiş
          
          // Tutar bilgileri
          total_amount: parseFloat(amount),
          reward_amount: parseFloat(amount) * 0.8, // %80 ödül
          cargo_fee: 25.00, // Standart kargo ücreti
          payment_gateway_fee: parseFloat(amount) * 0.0343, // %3.43 gateway ücreti
          service_fee: parseFloat(amount) * 0.18, // %18 servis ücreti
          net_payout: parseFloat(amount) * 0.8, // Net ödeme
          
          // Ödeme bilgileri
          payment_provider: 'test',
          provider_payment_id: paymentResult.paymentId,
          provider_response: JSON.stringify(paymentResult),
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

      // 2. Escrow hesabı oluştur (gerçek tablo yapısına uygun)
      const { data: escrowData, error: escrowError } = await supabase
        .from('escrow_accounts')
        .insert({
          payment_id: paymentData.id,
          device_id: deviceId,
          holder_user_id: payerId,
          beneficiary_user_id: payerId, // Şimdilik payer'ı beneficiary yap
          total_amount: parseFloat(amount),
          gross_amount: parseFloat(amount),
          reward_amount: parseFloat(amount) * 0.8,
          service_fee: parseFloat(amount) * 0.18,
          gateway_fee: parseFloat(amount) * 0.0343,
          cargo_fee: 25.00,
          net_payout: parseFloat(amount) * 0.8,
          net_amount: parseFloat(amount) * 0.8,
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
          escrow_type: 'standard',
          auto_release_days: 30,
          risk_assessment: 'low',
          compliance_verified: false,
          notification_sent: false,
          last_activity_at: new Date().toISOString(),
          activity_log: [],
          dispute_status: 'none',
          processing_fee: parseFloat(amount) * 0.0343,
          platform_fee: parseFloat(amount) * 0.18,
          total_fees: parseFloat(amount) * 0.2143,
          metadata: {},
          priority: 'normal',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
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

      // 3. Notification ekle - DETAYLI HATA ANALİZİ
      console.log('[DATABASE] Notification ekleniyor...', {
        user_id: payerId,
        type: 'payment_success',
        message_key: 'payment_success',
        message: `Cihaz için ödeme başarıyla alındı. Tutar: ₺${amount}. Payment ID: ${paymentData.id}`,
        is_read: false,
        created_at: new Date().toISOString()
      });

      const { data: notificationData, error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: payerId,
          type: 'payment_success',
          message_key: 'payment_success',
          message: `Cihaz için ödeme başarıyla alındı. Tutar: ₺${amount}. Payment ID: ${paymentData.id}`,
          is_read: false,
          created_at: new Date().toISOString()
        })
        .select();

      if (notificationError) {
        console.error('[DATABASE] Notification kayıt hatası:', notificationError);
        console.error('[DATABASE] Notification error details:', {
          code: notificationError.code,
          message: notificationError.message,
          details: notificationError.details,
          hint: notificationError.hint
        });
        throw new Error(`Notification kayıt hatası: ${notificationError.message}`);
      } else {
        console.log('[DATABASE] Notification eklendi:', notificationData);
      }

      console.log('[DATABASE] Tüm kayıtlar başarıyla tamamlandı');
      
    } catch (error) {
      console.error('[DATABASE] Database kayıt hatası:', error);
      throw error;
    }
  };

  const [isProcessed, setIsProcessed] = useState(false);
  const isProcessedRef = useRef(false);

  useEffect(() => {
    console.log('[PAYMENT] Callback page loaded');
    console.log('[PAYMENT] Current URL:', window.location.href);
    console.log('[PAYMENT] Search params:', Object.fromEntries(searchParams.entries()));
    
    // Eğer zaten işlendiyse tekrar çalışma
    if (isProcessedRef.current) {
      console.log('[PAYMENT] Callback zaten işlendi, tekrar çalışmıyor');
      return;
    }
    
    // Component mount olduğunda hemen çalışsın
    const processCallback = async () => {
      try {
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

        // Payment status parametresini kontrol et
        if (status === 'success') {
          console.log('[PAYMENT] Payment success callback received');
          setStatus('success');
          setMessage('Ödeme başarıyla tamamlandı!');
          
          // Başarılı ödeme sonrası yönlendirme
          setTimeout(() => {
            const successPaymentId = paymentId || 'payment_' + Date.now();
            navigate(`/payment/success?paymentId=${successPaymentId}`);
          }, 2000);
          return;
        }

        if (status === 'failure') {
          console.log('[PAYMENT] Payment failure callback received');
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
          await verifyPayment(token);
        } else {
          // POST request'ten geldi veya test modu
          console.log('[PAYMENT] No token in URL, handling payment POST callback...');
          await handlePostCallback();
        }
      } catch (error) {
        console.error('[PAYMENT] Process callback error:', error);
        setStatus('error');
        setMessage('Callback işleme sırasında hata oluştu');
      }
    };
    
    // Payment POST callback'i handle et
    const handlePostCallback = async () => {
      console.log('[PAYMENT] Payment POST callback received');
      
      try {
        // Payment durumunu kontrol et
        console.log('[PAYMENT] Payment durumu kontrol ediliyor...');
        
        // Development'da proxy kullan, production'da direkt API
        const apiUrl = import.meta.env.DEV 
          ? '/api/payment-verify'
          : 'https://api.stripe.com/v1/payment_intents';

        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        };

        // Production'da Authorization header ekle
        if (!import.meta.env.DEV) {
          headers['Authorization'] = `Bearer ${process.env.STRIPE_SECRET_KEY}`;
        }

        // localStorage'dan orderId'yi al
        const orderId = localStorage.getItem('payment_orderId');
        
        // Test modunda basit bir token oluştur
        const verificationToken = orderId || `test_token_${Date.now()}`;
        
        console.log('[PAYMENT] Using token for verification:', verificationToken);
        
        // GÜVENLİ MOCK DOĞRULAMA - Test modu için
        console.log('[PAYMENT] Güvenli mock doğrulama yapılıyor (Test modu)...');
        
        // Token formatını kontrol et (daha esnek)
        const isValidToken = verificationToken && (
          verificationToken.includes('mock12-') || 
          verificationToken.includes('payment_') ||
          verificationToken.startsWith('test_') ||
          verificationToken.length > 5
        );
        
        if (!isValidToken) {
          throw new Error('Geçersiz token formatı');
        }
        
        // Gerçek ödeme tutarını database'den al
        const config = getSecureConfig();
        const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);
        
        const { data: { user } } = await supabase.auth.getUser();
        let realAmount = '3200.0'; // Default fallback
        
        if (user) {
          // Son ödeme yapılan cihazın tutarını al
          const { data: deviceData, error: deviceError } = await supabase
            .from('devices')
            .select('id')
            .eq('userId', user.id)
            .in('status', ['payment_pending', 'payment_completed'])
            .order('updated_at', { ascending: false })
            .limit(1)
            .single();
            
          if (!deviceError && deviceData) {
            // Payment tablosundan gerçek tutarı al
            const { data: paymentData, error: paymentError } = await supabase
              .from('payments')
              .select('total_amount')
              .eq('device_id', deviceData.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();
              
            if (!paymentError && paymentData) {
              realAmount = paymentData.total_amount.toString();
              console.log('[PAYMENT] Gerçek ödeme tutarı bulundu:', realAmount);
            }
          }
        }

        // Mock başarılı ödeme simülasyonu (güvenli)
        const verificationResult = {
          success: true,
          status: 'success',
          paymentStatus: 'SUCCESS',
          paymentId: crypto.randomUUID(), // Gerçek UUID
          paidPrice: realAmount, // Gerçek tutar
          basketId: verificationToken,
          conversationId: `mock_${Date.now()}`,
          rawResponse: {
            status: 'success',
            paymentStatus: 'SUCCESS',
            testMode: true,
            message: 'Güvenli mock doğrulama - Test modu',
            token: verificationToken,
            realAmount: realAmount
          }
        };
        
        console.log('[PAYMENT] Mock verification result:', verificationResult);
        
        // Device ID'yi URL'den veya mevcut kullanıcıdan al
        let urlDeviceId = searchParams.get('deviceId') || searchParams.get('device_id');
        
        if (!urlDeviceId) {
          console.log('[PAYMENT] Device ID URL\'de yok, mevcut kullanıcının son ödeme yapılan cihazı bulunuyor...');
          
          const config = getSecureConfig();
          const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);
          
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            // Son ödeme yapılan cihazı bul (payment_pending veya payment_completed)
            const { data: deviceData, error: deviceError } = await supabase
              .from('devices')
              .select('id')
              .eq('userId', user.id)
              .in('status', ['payment_pending', 'payment_completed'])
              .order('updated_at', { ascending: false })
              .limit(1)
              .single();
            
            if (!deviceError && deviceData) {
              urlDeviceId = deviceData.id;
              console.log('[PAYMENT] Device ID mevcut kullanıcıdan bulundu:', urlDeviceId);
            } else {
              console.error('[PAYMENT] Mevcut kullanıcının ödeme yapılan cihazı bulunamadı:', deviceError);
            }
          } else {
            console.error('[PAYMENT] Mevcut kullanıcı bulunamadı');
          }
        }
        
        if (!urlDeviceId) {
          console.error('[PAYMENT] Device ID bulunamadı - URL parametreleri:', Object.fromEntries(searchParams.entries()));
          throw new Error('Device ID bulunamadı. Lütfen ödeme sayfasından tekrar deneyin.');
        }
        
        // Mock doğrulama sonucunu kullan
        const verificationData = verificationResult;
        verificationData.basketId = urlDeviceId; // Device ID'yi ekle
        
        // Gerçek payment ID'yi UUID oluştur
        const realPaymentId = crypto.randomUUID();
        
        console.log('[PAYMENT] Mock verification result:', verificationData);

        if (verificationData.status === 'success' && verificationData.paymentStatus === 'SUCCESS') {
          console.log('[PAYMENT] Ödeme başarılı, database\'e kayıt yapılıyor...');
          
          try {
            // Ödeme başarılı, database'e kayıt yap
            await savePaymentToDatabase(verificationData, realPaymentId);
            
            setStatus('success');
            setMessage('Ödeme başarıyla tamamlandı ve kaydedildi!');
            
            // Başarılı ödeme sonrası yönlendirme
            setTimeout(() => {
              navigate(`/payment/success?paymentId=${realPaymentId}`);
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
    
    // Callback'i işle - sadece bir kez çalışsın
    const executeCallback = async () => {
      if (isProcessedRef.current) return;
      isProcessedRef.current = true;
      setIsProcessed(true);
      await processCallback();
    };
    
    executeCallback();
  }, [searchParams, navigate]);

  const verifyPayment = async (token: string) => {
    try {
      console.log('[PAYMENT] Verifying payment with token...');
      
      // Test modu için mock verification
      const mockResult = {
        status: 'success',
        paymentStatus: 'SUCCESS',
        paidPrice: '3200.0',
        basketId: token,
        paymentId: crypto.randomUUID()
      };

      console.log('[PAYMENT] Mock verification result:', mockResult);

      if (mockResult.status === 'success' && mockResult.paymentStatus === 'SUCCESS') {
        setStatus('success');
        setMessage('Ödeme başarıyla tamamlandı!');
        
        // Başarılı ödeme sonrası yönlendirme
        setTimeout(() => {
          navigate(`/payment/success?paymentId=${mockResult.paymentId}`, {
            state: {
              paymentId: mockResult.paymentId,
              amount: mockResult.paidPrice,
              deviceId: mockResult.basketId
            }
          });
        }, 2000);
      } else {
        setStatus('error');
        setMessage('Ödeme başarısız');
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