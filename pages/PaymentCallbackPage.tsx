/**
 * İyzico Payment Callback Page
 * İyzico 3D Secure sonrasında buraya yönlendirilir
 */

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export const PaymentCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Ödeme sonucu kontrol ediliyor...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Backend'den gelen parametreleri al
        const paymentId = searchParams.get('paymentId');
        const deviceId = searchParams.get('device_id');
        const amount = searchParams.get('amount');
        const status = searchParams.get('status');
        
        console.log('[CALLBACK] Parametreler alındı:', { paymentId, deviceId, amount, status });
        
        if (!paymentId) {
          throw new Error('Payment ID bulunamadı');
        }

        if (status === 'success') {
          setStatus('success');
          setMessage('Ödeme başarıyla tamamlandı! Yönlendiriliyorsunuz...');
          
          // 1 saniye sonra success sayfasına yönlendir (React Router ile)
          setTimeout(() => {
            console.log('[CALLBACK] Success sayfasına yönlendiriliyor:', `/payment/success?paymentId=${paymentId}`);
            navigate(`/payment/success?paymentId=${paymentId}&device_id=${deviceId}&amount=${amount}`);
          }, 1000);
        } else {
          throw new Error('Ödeme başarısız');
        }

      } catch (error) {
        console.error('[CALLBACK] Hata:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Ödeme doğrulanırken hata oluştu');
        
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
