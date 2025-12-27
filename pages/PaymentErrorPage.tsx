/**
 * Payment Error Page
 * Ödeme hatalarını gösterir
 */

import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentErrorPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason');

  const getErrorMessage = () => {
    switch (reason) {
      case 'missing_params':
        return 'Ödeme bilgileri eksik. Lütfen tekrar deneyin.';
      case 'failed':
        return 'Ödeme işlemi başarısız oldu. Lütfen tekrar deneyin.';
      case 'timeout':
        return 'Ödeme işlemi zaman aşımına uğradı. Lütfen tekrar deneyin.';
      case 'cancelled':
        return 'Ödeme işlemi iptal edildi.';
      default:
        return 'Ödeme işlemi sırasında bir hata oluştu.';
    }
  };

  const getDeviceId = () => {
    return localStorage.getItem('currentDeviceId') || 
           localStorage.getItem('current_payment_device_id') ||
           searchParams.get('deviceId');
  };

  const handleRetry = () => {
    const deviceId = getDeviceId();
    
    // localStorage'dan temizle
    localStorage.removeItem('currentPaymentId');
    localStorage.removeItem('current_payment_id');
    localStorage.removeItem('currentDeviceId');
    localStorage.removeItem('current_payment_device_id');
    
    if (deviceId) {
      navigate(`/payment-flow?deviceId=${deviceId}`);
    } else {
      navigate('/payment-flow');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
          <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-red-900">
          Ödeme Hatası
        </h1>
        <p className="mt-2 text-gray-600">
          {getErrorMessage()}
        </p>
        <div className="mt-6 flex gap-4 justify-center">
          <button
            onClick={handleRetry}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tekrar Dene
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentErrorPage;
