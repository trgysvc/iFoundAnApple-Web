/**
 * PAYNET Payment Callback Page
 * PAYNET 3D Secure sonrasında buraya yönlendirilir
 * POST isteği veya URL parametrelerinden session_id ve token_id alır ve backend'e gönderir
 */

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { completePaynet3D } from '../utils/paynetPayment';

export const PaymentCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Ödeme sonucu kontrol ediliyor...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // PAYNET'ten gelen parametreleri al - öncelik sırası:
        // 1. URL parametrelerinden (GET)
        // 2. Form input'larından (POST form submit durumu)
        // 3. POST body'den (eğer JSON ise)
        
        let sessionId = searchParams.get('session_id');
        let tokenId = searchParams.get('token_id');
        
        // Eğer URL'de yoksa, form input'larından kontrol et (POST form submit durumu)
        if (!sessionId || !tokenId) {
          const sessionInput = document.querySelector('input[name="session_id"]') as HTMLInputElement;
          const tokenInput = document.querySelector('input[name="token_id"]') as HTMLInputElement;
          
          if (sessionInput?.value) {
            sessionId = sessionInput.value;
          }
          if (tokenInput?.value) {
            tokenId = tokenInput.value;
          }
        }
        
        // Payment ID'yi localStorage'dan al
        const paymentId = localStorage.getItem('current_payment_id') || 
                         localStorage.getItem('currentPaymentId'); // Fallback için eski key'i de kontrol et
        
        console.log('[CALLBACK] PAYNET parametreleri alındı:', { 
          paymentId, 
          hasSessionId: !!sessionId, 
          hasTokenId: !!tokenId,
          sessionIdSource: sessionId ? (searchParams.get('session_id') ? 'URL' : 'Form') : 'none',
          tokenIdSource: tokenId ? (searchParams.get('token_id') ? 'URL' : 'Form') : 'none'
        });
        
        if (!paymentId) {
          throw new Error('Payment ID bulunamadı. Lütfen ödeme sayfasından tekrar deneyin.');
        }

        if (!sessionId || !tokenId) {
          throw new Error('Ödeme doğrulama bilgileri eksik. Lütfen tekrar deneyin.');
        }

        // Backend'e 3D Secure tamamlama isteği gönder
        setMessage('3D Secure doğrulaması tamamlanıyor...');
        
        const result = await completePaynet3D(paymentId, sessionId, tokenId);
        
        if (result.success) {
          // Payment ID'yi localStorage'da tut (webhook bekleniyor)
          // localStorage'dan temizleme - webhook geldiğinde kullanılacak
          
          setStatus('success');
          setMessage('Ödeme başarıyla tamamlandı! Webhook bekleniyor...');
          
          // 2 saniye sonra success sayfasına yönlendir
          // Success sayfasında polling başlatılacak
          setTimeout(() => {
            console.log('[CALLBACK] Success sayfasına yönlendiriliyor:', `/payment/success?paymentId=${paymentId}`);
            navigate(`/payment/success?paymentId=${paymentId}`);
          }, 2000);
        } else {
          throw new Error('3D Secure tamamlanamadı');
        }

      } catch (error) {
        console.error('[CALLBACK] Hata:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Ödeme doğrulanırken hata oluştu');
        
        // Payment ID'yi localStorage'dan temizle
        localStorage.removeItem('current_payment_id');
        localStorage.removeItem('currentPaymentId'); // Eski key'i de temizle
        
        // 3 saniye sonra dashboard'a yönlendir
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'processing' && (
          <>
            <LoadingSpinner />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              Ödeme İşleniyor
            </h2>
            <p className="mt-2 text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-green-900">
              Ödeme Başarılı!
            </h2>
            <p className="mt-2 text-gray-600">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-red-900">
              Ödeme Başarısız
            </h2>
            <p className="mt-2 text-gray-600">{message}</p>
          </>
        )}
      </div>
    </div>
  );
};
