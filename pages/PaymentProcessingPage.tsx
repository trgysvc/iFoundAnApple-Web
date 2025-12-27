/**
 * Payment Processing Page
 * Backend 3D Secure sonrası bu sayfaya redirect ediyor
 * Bu sayfa sadece payment status'u polling ile kontrol eder
 * Backend callback'i handle ediyor, frontend sadece status kontrolü yapar
 */

import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { getPaymentStatus } from '../utils/paynetPayment';

const PaymentProcessingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'checking' | 'processing' | 'success' | 'failed'>('checking');
  const [error, setError] = useState<string | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const attemptsRef = useRef(0);
  const maxAttempts = 30; // 30 deneme
  const interval = 2000; // 2 saniye aralık

  useEffect(() => {
    // Önce URL'den paymentId'yi al (backend redirect'ten gelen)
    // Yoksa localStorage'dan al (fallback)
    const paymentId = searchParams.get('paymentId') || 
                     searchParams.get('payment_id') ||
                     localStorage.getItem('currentPaymentId') || 
                     localStorage.getItem('current_payment_id');
    
    // deviceId'yi localStorage'dan al (URL'de olmayabilir)
    const deviceId = localStorage.getItem('currentDeviceId') || 
                    localStorage.getItem('current_payment_device_id');

    if (!paymentId) {
      setError('Ödeme bilgisi bulunamadı');
      setStatus('failed');
      return;
    }

    // Polling başlat - Backend'den payment status kontrol et
    const pollPaymentStatus = async () => {
      const checkStatus = async (): Promise<boolean> => {
        try {
          attemptsRef.current++;
          
          const data = await getPaymentStatus(paymentId);
          
          console.log('[PAYMENT_PROCESSING] Status check:', {
            attempt: attemptsRef.current,
            paymentStatus: data.paymentStatus,
            webhookReceived: data.webhookReceived
          });

          if (data.paymentStatus === 'completed') {
            setStatus('success');
            // Payment ID'yi localStorage'dan temizle
            localStorage.removeItem('currentPaymentId');
            localStorage.removeItem('current_payment_id');
            localStorage.removeItem('currentDeviceId');
            localStorage.removeItem('current_payment_device_id');
            
            // Device detail sayfasına yönlendir
            setTimeout(() => {
              if (deviceId) {
                navigate(`/device/${deviceId}`);
              } else {
                navigate('/dashboard');
              }
            }, 2000);
            return true; // Polling durdur
          }
          
          if (data.paymentStatus === 'failed') {
            setStatus('failed');
            setError('Ödeme başarısız oldu');
            // Payment ID'yi localStorage'dan temizle
            localStorage.removeItem('currentPaymentId');
            localStorage.removeItem('current_payment_id');
            localStorage.removeItem('currentDeviceId');
            localStorage.removeItem('current_payment_device_id');
            
            setTimeout(() => {
              if (deviceId) {
                navigate(`/payment-flow?deviceId=${deviceId}&error=failed`);
              } else {
                navigate('/payment-flow?error=failed');
              }
            }, 2000);
            return true; // Polling durdur
          }
          
          // Hala pending - devam et
          setStatus('processing');
          return false;
        } catch (err) {
          console.error('[PAYMENT_PROCESSING] Payment status check error:', err);
          
          if (attemptsRef.current >= maxAttempts) {
            setStatus('failed');
            setError('Ödeme durumu kontrol edilemedi. Lütfen sayfayı yenileyin.');
            return true; // Polling durdur
          }
          
          return false;
        }
      };

      // İlk kontrol
      const shouldStop = await checkStatus();
      if (shouldStop) {
        return;
      }

      // Polling başlat
      pollingIntervalRef.current = setInterval(async () => {
        const shouldStop = await checkStatus();
        if (shouldStop || attemptsRef.current >= maxAttempts) {
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          
          if (attemptsRef.current >= maxAttempts) {
            // Status'u kontrol etmek için bir callback kullan
            setStatus((currentStatus) => {
              if (currentStatus === 'processing') {
                setError('Ödeme işlemi zaman aşımına uğradı. Lütfen tekrar deneyin.');
                return 'failed';
              }
              return currentStatus;
            });
          }
        }
      }, interval);
    };

    pollPaymentStatus();

    // Cleanup on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === 'checking' && (
          <>
            <LoadingSpinner />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              Ödeme Durumu Kontrol Ediliyor
            </h2>
            <p className="mt-2 text-gray-600">
              Lütfen bekleyin...
            </p>
          </>
        )}

        {status === 'processing' && (
          <>
            <LoadingSpinner />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              Ödeme İşleniyor
            </h2>
            <p className="mt-2 text-gray-600">
              Ödeme işleminiz gerçekleştiriliyor, lütfen bekleyin...
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Bu işlem birkaç saniye sürebilir.
            </p>
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
            <p className="mt-2 text-gray-600">
              Yönlendiriliyorsunuz...
            </p>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-red-900">
              Ödeme Başarısız
            </h2>
            <p className="mt-2 text-gray-600">
              {error || 'Ödeme başarısız oldu'}
            </p>
            <button
              onClick={() => {
                const deviceId = localStorage.getItem('currentDeviceId') || 
                               localStorage.getItem('current_payment_device_id');
                if (deviceId) {
                  navigate(`/payment-flow?deviceId=${deviceId}`);
                } else {
                  navigate('/payment-flow');
                }
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tekrar Dene
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentProcessingPage;
