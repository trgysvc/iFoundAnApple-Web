import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { EscrowStatusDisplay } from '../components/escrow/EscrowStatusDisplay.tsx';
import { DeliveryConfirmationForm } from '../components/escrow/DeliveryConfirmationForm.tsx';
import { DisputeForm } from '../components/escrow/DisputeForm.tsx';

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

interface DeviceData {
  id: string;
  model: string;
  serialNumber: string;
  color: string;
  description?: string;
  lost_date?: string;
  lost_location?: string;
  invoiceDataUrl?: string;
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
  const [device, setDevice] = useState<DeviceData | null>(null);
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
      if (!paymentData) {
        throw new Error('Ödeme bilgileri bulunamadı. Lütfen ödeme sayfasına dönün.');
      }

      // Ödeme durumu kontrolü - completed veya processing olabilir
      if (paymentData.payment_status !== 'completed' && paymentData.payment_status !== 'processing') {
        throw new Error('Ödeme henüz tamamlanmamış veya başarısız. Lütfen ödeme sayfasına dönün.');
      }

      setPayment(paymentData);

      // Fetch device data using device_id from payment
      const { data: deviceData, error: deviceError } = await supabaseClient
        .from('devices')
        .select('*')
        .eq('id', paymentData.device_id)
        .single();

      if (deviceError) {
        console.warn('Device data not found for payment:', paymentData.device_id, deviceError.message);
        setDevice(null);
      } else {
        setDevice(deviceData);
      }

      // Fetch escrow data - optional, might not exist for older payments
      const { data: escrowData, error: escrowError } = await supabaseClient
        .from('escrow_accounts')
        .select('*')
        .eq('payment_id', paymentId)
        .single();

      if (escrowError) {
        // Escrow kaydı bulunamadı - bu eski ödemeler için normal olabilir
        console.warn('Escrow data not found for payment:', paymentId, escrowError.message);
        setEscrow(null);
      } else {
        // Escrow verisi mevcut, status ne olursa olsun işleyelim
        setEscrow(escrowData);
      }

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

  const handleCancelPayment = () => {
    // Ödeme iptal işlemi (şimdilik sadece dashboard'a yönlendir)
    // TODO: İleride gerçek iptal işlemi eklenecek
    if (confirm('Ödemeyi iptal etmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      navigate('/dashboard');
    }
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

          {/* Kayıp Cihaz Detayları Card */}
          {device && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Kayıp Cihaz Detayları
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Kayıp Tarihi:</span>
                  <span className="font-medium">
                    {device.lost_date ? new Date(device.lost_date).toLocaleDateString('tr-TR', {
                      day: '2-digit',
                      month: '2-digit', 
                      year: 'numeric'
                    }) : 'Belirtilmemiş'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Kayıp Yeri:</span>
                  <span className="font-medium">{device.lost_location || 'Belirtilmemiş'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Cihaz Modeli:</span>
                  <span className="font-medium">{device.model}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Cihaz Seri Numarası:</span>
                  <span className="font-mono text-sm">{device.serialNumber}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Cihaz Rengi:</span>
                  <span className="font-medium">{device.color}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Ek Detaylar:</span>
                  <span className="font-medium">{device.description || 'Belirtilmemiş'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Satın Alma Kanıtı (Fatura) Dosyası:</span>
                  {device.invoiceDataUrl ? (
                    <a
                      href={device.invoiceDataUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium underline"
                    >
                      EKLENEN DOSYA LİNKİ
                    </a>
                  ) : (
                    <span className="text-gray-500">Dosya eklenmemiş</span>
                  )}
                </div>
              </div>
            </div>
          )}

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

          {/* Emanet Durumu */}
          <EscrowStatusDisplay 
            paymentId={payment.id} 
            onRefresh={() => window.location.reload()}
          />

          {/* Teslimat Onay Formu */}
          <div className="mt-6">
            <DeliveryConfirmationForm
              deviceId={device?.id || ''}
              paymentId={payment.id}
              cargoShipmentId={device?.cargoShipmentId || ''}
              onSuccess={() => {
                alert('Teslimat onayı başarıyla alındı!');
                window.location.reload();
              }}
              onError={(error) => {
                alert('Hata: ' + error);
              }}
            />
          </div>

          {/* İtiraz Formu */}
          <div className="mt-6 mb-6">
            <DisputeForm
              deviceId={device?.id || ''}
              paymentId={payment.id}
              cargoShipmentId={device?.cargoShipmentId || ''}
              onSuccess={() => {
                alert('İtirazınız başarıyla alındı!');
                window.location.reload();
              }}
              onError={(error) => {
                alert('Hata: ' + error);
              }}
            />
          </div>

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
              
              {escrow ? (
                <>
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
                </>
              ) : (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-1">Ödeme Tamamlandı</p>
                    <p className="text-gray-600 text-sm">Ödemeniz başarıyla alınmıştır. Cihazınız için gerekli işlemler yapılacaktır.</p>
                  </div>
                </div>
              )}
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
