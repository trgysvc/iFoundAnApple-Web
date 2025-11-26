import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { checkPaymentStatus, createPaymentRecordsFromWebhook } from '../utils/paymentWebhookHandler';
import { FeeBreakdown } from '../utils/feeCalculation';
import { supabase } from '../utils/supabaseClient';

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
  const [polling, setPolling] = useState(false);
  const [webhookReceived, setWebhookReceived] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollingAttemptsRef = useRef(0);
  const maxPollingAttempts = 30; // 5 dakika (10 saniye * 30)

  useEffect(() => {
    if (paymentId) {
      fetchPaymentData();
    }
    
    // Cleanup polling on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
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
        // Payment kaydı henüz oluşturulmamış (webhook gelmemiş)
        // Polling başlat
        console.log('[PAYMENT_SUCCESS] Payment kaydı henüz oluşturulmamış, polling başlatılıyor...');
        startPolling();
        return;
      }

      // Güvenlik kontrolü: Ödeme gerçekten başarılı mı?
      if (!paymentData) {
        throw new Error('Ödeme bilgileri bulunamadı. Lütfen ödeme sayfasına dönün.');
      }

      // Ödeme durumu kontrolü - completed veya processing olabilir
      if (paymentData.payment_status !== 'completed' && paymentData.payment_status !== 'processing') {
        throw new Error('Ödeme henüz tamamlanmamış veya başarısız. Lütfen ödeme sayfasına dönün.');
      }

      setPayment(paymentData);
      setWebhookReceived(true);

      // Fetch escrow data
      const { data: escrowData, error: escrowError } = await supabaseClient
        .from('escrow_accounts')
        .select('*')
        .eq('payment_id', paymentId)
        .single();

      if (escrowError) {
        // Escrow henüz oluşturulmamış olabilir, kritik değil
        console.warn('[PAYMENT_SUCCESS] Escrow kaydı bulunamadı:', escrowError.message);
      } else {
        setEscrow(escrowData);
      }

    } catch (err) {
      console.error('Error fetching payment data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const startPolling = async () => {
    if (!paymentId || !currentUser) {
      return;
    }

    setPolling(true);
    pollingAttemptsRef.current = 0;

    const poll = async () => {
      if (pollingAttemptsRef.current >= maxPollingAttempts) {
        console.log('[PAYMENT_SUCCESS] Polling maksimum deneme sayısına ulaştı');
        setPolling(false);
        setError('Webhook gecikmesi. Lütfen birkaç dakika sonra tekrar kontrol edin.');
        return;
      }

      pollingAttemptsRef.current += 1;
      console.log(`[PAYMENT_SUCCESS] Polling denemesi ${pollingAttemptsRef.current}/${maxPollingAttempts}`);

      try {
        const status = await checkPaymentStatus(paymentId!);

        if (status && status.webhookReceived && status.status === 'completed') {
          // Webhook geldi, kayıtları oluştur
          console.log('[PAYMENT_SUCCESS] Webhook geldi, kayıtlar oluşturuluyor...');
          await createPaymentRecordsFromWebhookData();
          
          // Polling'i durdur ve verileri yeniden yükle
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          setPolling(false);
          setWebhookReceived(true);
          await fetchPaymentData();
        }
      } catch (error) {
        console.error('[PAYMENT_SUCCESS] Polling hatası:', error);
      }
    };

    // İlk kontrol
    await poll();

    // Her 10 saniyede bir kontrol et
    pollingIntervalRef.current = setInterval(poll, 10000);
  };

  const createPaymentRecordsFromWebhookData = async () => {
    if (!paymentId || !currentUser || !supabaseClient) {
      return;
    }

    try {
      // Device ID'yi localStorage'dan al
      const deviceIdStr = localStorage.getItem('current_payment_device_id');
      if (!deviceIdStr) {
        console.error('[PAYMENT_SUCCESS] Device ID bulunamadı');
        return;
      }

      // Fee breakdown'ı localStorage'dan al
      const feeBreakdownStr = localStorage.getItem('current_payment_fee_breakdown');
      if (!feeBreakdownStr) {
        console.error('[PAYMENT_SUCCESS] Fee breakdown bulunamadı');
        return;
      }

      const feeBreakdown: FeeBreakdown = JSON.parse(feeBreakdownStr);

      // Device bilgilerini al
      const { data: device, error: deviceError } = await supabaseClient
        .from('devices')
        .select('id, user_id, matched_device_id')
        .eq('id', deviceIdStr)
        .single();

      if (deviceError || !device) {
        console.error('[PAYMENT_SUCCESS] Device bulunamadı:', deviceError);
        return;
      }

      // Matched user ID'yi bul
      let receiverId = currentUser.id; // Varsayılan (eğer matched device yoksa)
      if (device.matched_device_id) {
        const { data: matchedDevice, error: matchedError } = await supabaseClient
          .from('devices')
          .select('user_id')
          .eq('id', device.matched_device_id)
          .single();
        
        if (!matchedError && matchedDevice) {
          receiverId = matchedDevice.user_id;
        }
      }

      // Webhook payload'ı oluştur
      // NOT: Gerçek webhook payload'ı backend'den gelecek
      // Şimdilik fee breakdown'dan webhook data'sını oluşturuyoruz
      // Backend webhook'u işlediğinde Supabase Realtime üzerinden bildirim gönderebilir
      // veya frontend polling yaparak payment kaydının oluşup oluşmadığını kontrol edebilir
      const webhookData = {
        reference_no: paymentId,
        is_succeed: true,
        amount: feeBreakdown.totalAmount,
        netAmount: feeBreakdown.totalAmount - feeBreakdown.gatewayFee,
        comission: feeBreakdown.gatewayFee,
        authorization_code: 'AUTH_' + Date.now(), // Gerçek webhook'tan gelecek
        order_id: 'ORDER_' + Date.now(), // Gerçek webhook'tan gelecek
        xact_date: new Date().toISOString(),
      };

      // Payment ve escrow kayıtlarını oluştur
      const result = await createPaymentRecordsFromWebhook({
        paymentId: paymentId!,
        deviceId: deviceIdStr,
        payerId: currentUser.id,
        receiverId: receiverId,
        webhookData: webhookData,
        feeBreakdown: feeBreakdown,
      });

      if (result.success) {
        console.log('[PAYMENT_SUCCESS] ✅ Payment ve escrow kayıtları oluşturuldu');
        // localStorage'dan temizle
        localStorage.removeItem('current_payment_id');
        localStorage.removeItem('current_payment_fee_breakdown');
        localStorage.removeItem('current_payment_device_id');
      } else {
        console.error('[PAYMENT_SUCCESS] Kayıt oluşturma hatası:', result.error);
      }
    } catch (error) {
      console.error('[PAYMENT_SUCCESS] Webhook kayıt oluşturma hatası:', error);
    }
  };

  const handleGoToDashboard = () => {
    // Polling'i durdur
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    navigate('/dashboard');
  };

  const handleCancelPayment = () => {
    // Ödeme iptal işlemi (şimdilik sadece dashboard'a yönlendir)
    // TODO: İleride gerçek iptal işlemi eklenecek
    if (confirm('Ödemeyi iptal etmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      // Polling'i durdur
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      navigate('/dashboard');
    }
  };

  if (loading || polling) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="text-gray-600 mt-4">
            {polling 
              ? `Webhook bekleniyor... (${pollingAttemptsRef.current}/${maxPollingAttempts})`
              : 'Ödeme bilgileri yükleniyor...'}
          </p>
          {polling && (
            <p className="text-gray-500 text-sm mt-2">
              Ödeme kayıtları oluşturuluyor, lütfen bekleyin...
            </p>
          )}
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
                  {(payment.payment_status === 'completed' || payment.payment_status === 'processing') ? 'Tamamlandı' : payment.payment_status}
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

          {/* Durum Bilgisi */}
          <div className="bg-yellow-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Durum Bilgisi
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 mb-1">Cihazınızın Kargo ile Teslim Edilmesi Bekleniyor</p>
                  <p className="text-gray-600 text-sm">Takip için kargo numaranız: <span className="font-mono font-semibold">-</span></p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 mb-1">Cihaz Teslim Alındığında</p>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600 text-sm">Teslim aldığınızı onaylayın</p>
                    <Button 
                      variant="primary" 
                      className="ml-4"
                      disabled
                    >
                      Onay
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-900">İşlem Tamamlandı</p>
                  <p className="text-gray-600 text-sm">Cihazınıza kavuştuğunuz için mutluyuz</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button 
              onClick={handleCancelPayment} 
              variant="secondary"
              className="flex-1"
            >
              Ödemeyi İptal Et
            </Button>
            
            <Button 
              onClick={handleGoToDashboard} 
              variant="primary"
              className="flex-1"
            >
              Cihazlarım Listesine Dön
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
