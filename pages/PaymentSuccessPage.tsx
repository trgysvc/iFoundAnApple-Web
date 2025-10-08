import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface PaymentSuccessPageProps {}

interface PaymentData {
  id: string;
  device_id: string;
  total_amount: number;
  payment_status: string;
  payment_provider: string;
  created_at: string;
}

interface EscrowData {
  id: string;
  payment_id: string;
  device_id: string;
  status: string;
  total_amount: number;
  created_at: string;
}

const PaymentSuccessPage: React.FC<PaymentSuccessPageProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, supabaseClient, t } = useAppContext();
  
  // Get paymentId from query parameters
  const queryParams = new URLSearchParams(location.search);
  const paymentId = queryParams.get('paymentId');
  
  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [escrow, setEscrow] = useState<EscrowData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (paymentId) {
      fetchPaymentData();
    }
  }, [paymentId]);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      
      // Check if supabaseClient is available
      if (!supabaseClient) {
        throw new Error('Supabase client is not available');
      }
      
      console.log('Fetching payment data for ID:', paymentId);
      
      // Fetch payment data
      const { data: paymentData, error: paymentError } = await supabaseClient
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .single();

      if (paymentError) {
        throw new Error(`Payment fetch error: ${paymentError.message}`);
      }

      // Güvenlik kontrolü: Ödeme gerçekten başarılı mı?
      if (!paymentData || paymentData.status !== 'completed') {
        throw new Error('Ödeme henüz tamamlanmamış veya başarısız. Lütfen ödeme sayfasına dönün.');
      }

      setPayment(paymentData);

      // Fetch escrow data
      const { data: escrowData, error: escrowError } = await supabaseClient
        .from('escrow_accounts')
        .select('*')
        .eq('payment_id', paymentId)
        .single();

      if (escrowError) {
        throw new Error(`Escrow fetch error: ${escrowError.message}`);
      }

      setEscrow(escrowData);

    } catch (err) {
      console.error('Error fetching payment data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleTrackPayment = () => {
    navigate(`/payment/track/${paymentId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="text-gray-600 mt-4">Ödeme bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Ödeme Bilgileri Bulunamadı</h1>
          <p className="text-gray-600 mb-6">{error || 'Ödeme kaydı bulunamadı.'}</p>
          <Button onClick={handleGoToDashboard} variant="primary">
            Ana Sayfaya Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Container>
        <div className="max-w-2xl mx-auto py-12">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Ödeme Başarıyla Tamamlandı!
            </h1>
            <p className="text-gray-600">
              Ödemeniz güvenli escrow sisteminde bekletiliyor.
            </p>
          </div>

          {/* Payment Details Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Ödeme Detayları
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Ödeme ID:</span>
                <span className="font-mono text-sm">{payment.id}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Toplam Tutar:</span>
                <span className="font-semibold text-lg text-green-600">
                  {payment.total_amount.toFixed(2)} TL
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Ödeme Durumu:</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {payment.payment_status === 'completed' ? 'Tamamlandı' : payment.payment_status}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Ödeme Sağlayıcısı:</span>
                <span className="capitalize">{payment.payment_provider}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Ödeme Tarihi:</span>
                <span>{new Date(payment.created_at).toLocaleString('tr-TR')}</span>
              </div>
            </div>
          </div>

          {/* Escrow Status Card */}
          {escrow && (
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Escrow Durumu
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Escrow ID:</span>
                  <span className="font-mono text-sm">{escrow.id}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Durum:</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {escrow.status === 'held' ? 'Beklemede' : escrow.status}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Escrow Tutarı:</span>
                  <span className="font-semibold text-lg text-blue-600">
                    {escrow.total_amount.toFixed(2)} TL
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-yellow-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Sonraki Adımlar
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-900">Cihazınızın Kargo ile Teslim Edilmesi Bekleniyor</p>
                  <p className="text-gray-600 text-sm">Bulucu kişi cihazınızı kargo ile gönderecek.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-900">Cihaz Teslim Alındığında</p>
                  <p className="text-gray-600 text-sm">Cihazınızı teslim aldığınızda ödeme bulucuya aktarılacak.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-900">İşlem Tamamlanır</p>
                  <p className="text-gray-600 text-sm">Tüm süreç tamamlandığında bildirim alacaksınız.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button 
              onClick={handleTrackPayment} 
              variant="secondary"
              className="flex-1"
            >
              Ödeme Durumunu Takip Et
            </Button>
            
            <Button 
              onClick={handleGoToDashboard} 
              variant="primary"
              className="flex-1"
            >
              Ana Sayfaya Dön
            </Button>
          </div>

          {/* Contact Info */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Sorularınız için{' '}
              <a href="/contact" className="text-blue-600 hover:text-blue-800">
                iletişim sayfamızı
              </a>{' '}
              ziyaret edebilirsiniz.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PaymentSuccessPage;
