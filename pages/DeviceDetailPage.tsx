import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext.tsx";
import { Device, DeviceStatus, UserRole } from "../types.ts";
import Container from "../components/ui/Container.tsx";
import Button from "../components/ui/Button.tsx";
import NotFoundPage from "./NotFoundPage.tsx";
import { getSecureInvoiceUrl } from "../utils/fileUpload.ts";
import { supabase as supabaseClient } from "../utils/supabaseClient.ts";
import {
  ArrowLeft,
  ShieldCheck,
  Hourglass,
  ArrowRightLeft,
  PartyPopper,
  Wallet,
  Info,
  Paperclip,
  Check,
  X,
  AlertTriangle,
} from "lucide-react";
import { cancelTransactionLocal } from "../api/cancel-transaction.ts";
import { disputeTransactionLocal } from "../api/dispute-transaction.ts";

// A generic view for displaying status information and actions.
const StatusView: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  children?: React.ReactNode;
}> = ({ icon, title, description, children }) => (
  <div className="bg-white p-8 sm:p-12 rounded-xl shadow-lg text-center flex flex-col items-center">
    <div className="bg-brand-blue-light text-brand-blue p-4 rounded-full mb-6">
      {icon}
    </div>
    <h2 className="text-3xl font-bold text-brand-gray-600">{title}</h2>
    <p className="mt-2 text-brand-gray-500 max-w-lg">{description}</p>
    {children && <div className="mt-6 w-full">{children}</div>}
  </div>
);

const DeviceDetailPage: React.FC = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const {
    currentUser,
    getDeviceById,
    makePayment,
    confirmExchange,
    t,
    notifications,
    markNotificationAsRead,
  } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [device, setDevice] = useState<Device | undefined | null>(undefined);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [secureInvoiceUrl, setSecureInvoiceUrl] = useState<string | null>(null);
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isDisputing, setIsDisputing] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [escrowDetails, setEscrowDetails] = useState<any>(null);
  const [cargoShipment, setCargoShipment] = useState<any>(null);

  console.log("DeviceDetailPage: Component mounted with deviceId:", deviceId);
  console.log("DeviceDetailPage: Current location:", location.pathname);

  const handlePayment = async (deviceId: string) => {
    console.log(
      "DeviceDetailPage: handlePayment called with deviceId:",
      deviceId
    );

    if (!device) {
      console.error("DeviceDetailPage: No device found");
      return;
    }

    // Navigate to new MatchPaymentPage with device details
    navigate(
      `/match-payment?deviceId=${deviceId}&deviceModel=${encodeURIComponent(
        device.model
      )}`
    );
  };

  // Get payment ID for the device
  useEffect(() => {
    const fetchPaymentId = async () => {
      if (device?.id) {
        try {
          const { data, error } = await supabaseClient
            .from('payments')
            .select('id')
            .eq('device_id', device.id)
            .maybeSingle();
          
          if (!error && data) {
            setPaymentId(data.id);
          }
        } catch (error) {
          console.error('Error fetching payment ID:', error);
        }
      }
    };
    fetchPaymentId();
  }, [device?.id]);

  // Fetch payment and escrow details
  useEffect(() => {
    const fetchPaymentAndEscrowDetails = async () => {
      if (device?.id && paymentId) {
        try {
          // Fetch payment details
          const { data: paymentData, error: paymentError } = await supabaseClient
            .from('payments')
            .select('*')
            .eq('id', paymentId)
            .maybeSingle();
          
          if (!paymentError && paymentData) {
            setPaymentDetails(paymentData);
          }

          // Fetch escrow details
          const { data: escrowData, error: escrowError } = await supabaseClient
            .from('escrow_accounts')
            .select('*')
            .eq('payment_id', paymentId)
            .maybeSingle();
          
          if (!escrowError && escrowData) {
            setEscrowDetails(escrowData);
          }

          // Fetch cargo shipment details (for finder - to show delivery code)
          const { data: cargoData, error: cargoError } = await supabaseClient
            .from('cargo_shipments')
            .select('*')
            .eq('payment_id', paymentId)
            .maybeSingle();
          
          if (!cargoError && cargoData) {
            setCargoShipment(cargoData);
          }
        } catch (error) {
          console.error('Error fetching payment and escrow details:', error);
        }
      }
    };
    fetchPaymentAndEscrowDetails();
  }, [device?.id, paymentId]);

  const handleCancelTransaction = async () => {
    if (!device || !paymentId || !currentUser) {
      alert('İptal işlemi için gerekli bilgiler eksik');
      return;
    }

    const reason = prompt('İptal nedeninizi belirtiniz:');
    if (!reason) return;

    if (!confirm('İşlemi iptal etmek istediğinizden emin misiniz? İade işlemi başlatılacaktır.')) {
      return;
    }

    setIsCancelling(true);
    try {
      const result = await cancelTransactionLocal({
        deviceId: device.id,
        paymentId: paymentId,
        reason: reason,
        userId: currentUser.id,
      });

      if (result.success) {
        alert('İptal işlemi başarıyla tamamlandı. Para iadesi işleme alınacaktır.');
        // Refresh device data
        const updatedDevice = await getDeviceById(device.id);
        setDevice(updatedDevice);
        navigate('/dashboard');
      } else {
        alert(`İptal işlemi başarısız: ${result.errorMessage}`);
      }
    } catch (error) {
      console.error('Cancel transaction error:', error);
      alert('İptal işlemi sırasında bir hata oluştu');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleDisputeTransaction = async () => {
    if (!device || !paymentId || !currentUser) {
      alert('İtiraz işlemi için gerekli bilgiler eksik');
      return;
    }

    const reason = prompt('İtiraz nedeninizi belirtiniz (örn: Yanlış cihaz, hasarlı cihaz):');
    if (!reason) return;

    const description = prompt('Detaylı açıklama yapınız:');
    if (!description) return;

    if (!confirm('İtiraz etmek istediğinizden emin misiniz? İtirazınız admin tarafından incelenecektir.')) {
      return;
    }

    setIsDisputing(true);
    try {
      const result = await disputeTransactionLocal({
        deviceId: device.id,
        paymentId: paymentId,
        reason: reason,
        description: description,
        userId: currentUser.id,
      });

      if (result.success) {
        alert('İtirazınız başarıyla kaydedildi. Admin tarafından incelenecektir.');
        // Refresh device data
        const updatedDevice = await getDeviceById(device.id);
        setDevice(updatedDevice);
      } else {
        alert(`İtiraz işlemi başarısız: ${result.errorMessage}`);
      }
    } catch (error) {
      console.error('Dispute transaction error:', error);
      alert('İtiraz işlemi sırasında bir hata oluştu');
    } finally {
      setIsDisputing(false);
    }
  };

  useEffect(() => {
    const fetchDevice = async () => {
      if (deviceId) {
        console.log("DeviceDetailPage: Fetching device with ID:", deviceId);
        const foundDevice = await getDeviceById(deviceId);
        console.log("DeviceDetailPage: Device found:", foundDevice);
        setDevice(foundDevice);

        // Generate secure URL for invoice if it exists
        if (foundDevice?.invoice_url) {
          setIsLoadingInvoice(true);
          try {
            const secureUrl = await getSecureInvoiceUrl(
              foundDevice.invoice_url
            );
            setSecureInvoiceUrl(secureUrl);
          } catch (error) {
            console.error("Failed to generate secure invoice URL:", error);
          } finally {
            setIsLoadingInvoice(false);
          }
        }
      }
    };

    fetchDevice();
  }, [deviceId, getDeviceById, notifications, navigate]); // Rerun if notifications change to update status

  useEffect(() => {
    // Mark notifications for this page as read when the component mounts
    const unreadNotifs = notifications.filter(
      (n) => !n.is_read && n.link === location.pathname
    );
    if (unreadNotifs.length > 0) {
      unreadNotifs.forEach((n) => markNotificationAsRead(n.id));
    }
  }, [location.pathname, notifications, markNotificationAsRead]);

  console.log(
    "DeviceDetailPage: Current state - device:",
    device,
    "currentUser:",
    currentUser
  );

  if (device === undefined) {
    return (
      <Container>
        <div className="text-center">{t("loading")}</div>
      </Container>
    );
  }

  if (device === null || !currentUser || device.userId !== currentUser.id) {
    return <NotFoundPage />;
  }

  // Determine if the perspective is of the original owner (who lost the device)
  // or the finder. 
  // 
  // IMPORTANT: We use device_role column (not status) because:
  // - Status changes throughout the process (LOST → MATCHED → PAYMENT_PENDING → PAYMENT_COMPLETED → etc.)
  // - device_role is set once at device creation and never changes
  // - This ensures correct UI rendering regardless of current status
  //
  // Priority order:
  // 1. device_role column (primary source, set at creation time)
  // 2. lost_date/lost_location and found_date/found_location columns (fallback for edge cases)
  // 3. Status-based logic (last resort fallback - should never be needed after migration)
  const isOriginalOwnerPerspective = 
    device.device_role === 'owner' ? true :
    device.device_role === 'finder' ? false :
    // Fallback for edge cases (should not happen after migration)
    (device.lost_date || device.lost_location) ? true :
    (device.found_date || device.found_location) ? false :
    // Last resort fallback (should rarely be needed)
    device.status === DeviceStatus.PAYMENT_PENDING ||
    device.status === DeviceStatus.PAYMENT_COMPLETED ||
    device.status === DeviceStatus.LOST;
  const hasCurrentUserConfirmed = device.exchangeConfirmedBy?.includes(
    currentUser.id
  );

  // Enhanced logging with device_role information
  console.log("DeviceDetailPage: Device status:", device?.status);
  console.log("DeviceDetailPage: Device role:", device?.device_role);
  console.log("DeviceDetailPage: Device rewardAmount:", device?.rewardAmount);
  console.log(
    "DeviceDetailPage: isOriginalOwnerPerspective:",
    isOriginalOwnerPerspective,
    "(determined from device_role:", device?.device_role, ")"
  );
  console.log("DeviceDetailPage: Device details:", {
    id: device?.id,
    status: device?.status,
    device_role: device?.device_role,
    lost_date: device?.lost_date,
    found_date: device?.found_date,
    userId: device?.userId,
    currentUser: currentUser?.id
  });

  const renderContent = () => {
    console.log(
      "DeviceDetailPage: renderContent called with status:",
      device.status
    );
    console.log("DeviceDetailPage: DeviceStatus values:", {
      PAYMENT_PENDING: DeviceStatus.PAYMENT_PENDING,
      MATCHED: DeviceStatus.MATCHED,
      EXCHANGE_PENDING: DeviceStatus.EXCHANGE_PENDING,
      COMPLETED: DeviceStatus.COMPLETED,
      LOST: DeviceStatus.LOST,
      REPORTED: DeviceStatus.REPORTED,
    });


    switch (device.status) {
      case DeviceStatus.PAYMENT_PENDING:
        console.log("DeviceDetailPage: PAYMENT_PENDING case executed");
        console.log(
          "DeviceDetailPage: isOriginalOwnerPerspective:",
          isOriginalOwnerPerspective
        );

        // Finder perspective - show waiting for payment
        if (!isOriginalOwnerPerspective) {
          console.log("DeviceDetailPage: Finder perspective - payment pending");
          return (
            <div className="min-h-screen bg-gray-50">
              <div className="max-w-2xl mx-auto py-12">
                {/* Success Header */}
                <div className="text-center mb-8">
                  <div className="text-green-500 text-6xl mb-4">🎉</div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Harika Haber! Eşleşme Bulundu!
                  </h1>
                  <p className="text-gray-600">
                    Bulduğun cihazın sahibi ile eşleşme sağlandı. Cihaz sahibinin ödeme yapması bekleniyor.
                  </p>
                </div>

                {/* Bulunan Cihaz Detayları Card */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Bulunan Cihaz Detayları
                  </h2>
                  
                  <div className="space-y-3">
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
                  </div>
                </div>

                {/* İşlem Durumu Card */}
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    İşlem Durumu
                  </h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Durum:</span>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium flex items-center">
                        <Hourglass className="w-4 h-4 mr-2 animate-pulse" />
                        Cihaz sahibinin ödeme yapması bekleniyor
                      </span>
                    </div>
                  </div>
                </div>

                {/* Süreç Bilgisi */}
                <div className="bg-yellow-50 rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Süreç Bilgisi
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        ✓
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">Eşleşme Bulundu</p>
                        <p className="text-gray-600 text-sm">Cihazın sahibi ile eşleşme sağlandı</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">Cihaz Sahibinin Ödeme Yapması Bekleniyor</p>
                        <p className="text-gray-600 text-sm">Cihaz sahibi bilgilendirildi ve ödeme yapması bekleniyor</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">Cihazın Kargo ile Gönderilmesi</p>
                        <p className="text-gray-600 text-sm">Ödeme tamamlandığında kargo detayları paylaşılacak</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                        4
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Ödülünü Al</p>
                        <p className="text-gray-600 text-sm">Takas tamamlandığında ödülün hesabına aktarılacak</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ödül Bilgisi */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200 p-6 mb-6">
                  <div className="text-center mb-3">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center justify-center">
                      <span className="text-2xl mr-2">🎁</span>
                      Ödül Bilgisi
                    </h3>
                  </div>

                  <div className="space-y-3 text-sm text-gray-700">
                    <p className="leading-relaxed">
                      <strong>Harika bir haber!</strong> Eşleşme bulundu ve süreç başladı. Cihaz sahibi ödeme yaptıktan 
                      ve takas tamamlandıktan sonra, ödülün hesabına aktarılacaktır.
                    </p>
                    
                    {device.rewardAmount && (
                      <div className="bg-white rounded-lg p-4 text-center border-2 border-green-300">
                        <p className="text-gray-600 text-xs mb-1">Tahmini Ödül Tutarı</p>
                        <p className="text-2xl font-bold text-green-600">
                          {device.rewardAmount.toFixed(2)} TL
                        </p>
                      </div>
                    )}
                    
                    <p className="leading-relaxed text-gray-600 italic">
                      💡 IBAN bilgilerini profil sayfandan ekleyebilir veya güncelleyebilirsin.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <Button 
                    onClick={() => navigate('/dashboard')} 
                    variant="primary"
                    className="flex-1"
                  >
                    CİHAZLARIM LİSTESİNE GERİ DÖN
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
            </div>
          );
        }

        console.log(
          "DeviceDetailPage: Showing payment form for PAYMENT_PENDING - OWNER PERSPECTIVE"
        );
        
        // Owner perspective - same as MATCHED case
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto py-12">
              {/* Success Header */}
              <div className="text-center mb-8">
                <div className="text-green-500 text-6xl mb-4">✅</div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Eşleşme Bulundu!
                </h1>
                <p className="text-gray-600">
                  Ödeme Bekleniyor
                </p>
              </div>

              {/* Kayıp Cihaz Detayları Card */}
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
                    {isLoadingInvoice ? (
                      <div className="flex items-center text-gray-500">
                        <div className="animate-spin w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                        Yükleniyor...
                      </div>
                    ) : secureInvoiceUrl || device.invoiceDataUrl ? (
                      <a
                        href={secureInvoiceUrl || device.invoiceDataUrl}
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

              {/* İşlem Durumu Card */}
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  İşlem Durumu
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Durum:</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      Kayıtlı {device.serialNumber} seri numaralı {device.model} cihazı eşleşme bulundu. Ödeme Bekleniyor.
                    </span>
                  </div>
                </div>
              </div>

              {/* Durum Bilgisi */}
              <div className="bg-yellow-50 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Durum Bilgisi
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">Cihaz için eşleşme bekleniyor</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">Cihazınız bulundu</p>
                      <div className="flex items-center justify-between">
                        <p className="text-gray-600 text-sm">Ödemenizi yapmak ve takas sürecini tamamlamak için</p>
                        <Button 
                          onClick={() => handlePayment(device.id)}
                          variant="primary" 
                          className="ml-4"
                          disabled={isProcessingPayment}
                        >
                          {isProcessingPayment ? 'İşleniyor...' : 'Ödemeyi Güvenle Yap'}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">Cihazınızın kargo ile teslim edilmesi bekleniyor</p>
                      <p className="text-gray-600 text-sm">Teslim/Takip için kargo numaranız: <span className="font-mono font-semibold">-</span></p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">Cihaz Teslim Alındığında</p>
                      <div className="flex items-center justify-between">
                        <p className="text-gray-600 text-sm">Cihazın seri numarasını kontrol edip teslim aldığınızı onaylayın</p>
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
                      5
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">İşlem Tamamlandı</p>
                      <p className="text-gray-600 text-sm">Cihazınıza kavuştuğunuz için mutluyuz</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-4">
                {paymentId && (
                  <Button 
                    onClick={handleCancelTransaction}
                    variant="secondary"
                    className="w-full"
                    disabled={isCancelling}
                  >
                    <X className="w-4 h-4 mr-2" />
                    {isCancelling ? 'İptal Ediliyor...' : 'İşlemi İptal Et'}
                  </Button>
                )}
                
                <Button 
                  onClick={() => navigate('/dashboard')} 
                  variant="secondary"
                  className="w-full"
                >
                  CİHAZLARIM LİSTESİNE GERİ DÖN
                </Button>
              </div>
            </div>
          </div>
        );

      case DeviceStatus.MATCHED:
        console.log("DeviceDetailPage: MATCHED case executed");
        console.log(
          "DeviceDetailPage: isOriginalOwnerPerspective:",
          isOriginalOwnerPerspective
        );
        
        // Only show the new design for original owners (who lost the device)
        if (isOriginalOwnerPerspective) {
          return (
            <div className="min-h-screen bg-gray-50">
              <div className="max-w-2xl mx-auto py-12">
                {/* Success Header */}
                <div className="text-center mb-8">
                  <div className="text-green-500 text-6xl mb-4">✅</div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Eşleşme Bulundu!
                  </h1>
                  <p className="text-gray-600">
                    Ödeme Bekleniyor
                  </p>
                </div>

                {/* Kayıp Cihaz Detayları Card */}
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
                      {isLoadingInvoice ? (
                        <div className="flex items-center text-gray-500">
                          <div className="animate-spin w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                          Yükleniyor...
                        </div>
                      ) : secureInvoiceUrl || device.invoiceDataUrl ? (
                        <a
                          href={secureInvoiceUrl || device.invoiceDataUrl}
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

                {/* İşlem Durumu Card */}
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    İşlem Durumu
                  </h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Durum:</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        Kayıtlı {device.serialNumber} seri numaralı {device.model} cihazı eşleşme bulundu. Ödeme Bekleniyor.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Durum Bilgisi */}
                <div className="bg-yellow-50 rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Durum Bilgisi
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">Cihaz için eşleşme bekleniyor</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">Cihazınız bulundu</p>
                        <div className="flex items-center justify-between">
                          <p className="text-gray-600 text-sm">Ödemenizi yapmak ve takas sürecini tamamlamak için</p>
                          <Button 
                            onClick={() => handlePayment(device.id)}
                            variant="primary" 
                            className="ml-4"
                            disabled={isProcessingPayment}
                          >
                            {isProcessingPayment ? 'İşleniyor...' : 'Ödemeyi Güvenle Yap'}
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">Cihazınızın kargo ile teslim edilmesi bekleniyor</p>
                        <p className="text-gray-600 text-sm">Teslim/Takip için kargo numaranız: <span className="font-mono font-semibold">-</span></p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                        4
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">Cihaz Teslim Alındığında</p>
                        <div className="flex items-center justify-between">
                          <p className="text-gray-600 text-sm">Cihazın seri numarasını kontrol edip teslim aldığınızı onaylayın</p>
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
                        5
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">İşlem Tamamlandı</p>
                        <p className="text-gray-600 text-sm">Cihazınıza kavuştuğunuz için mutluyuz</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-4">
                {paymentId && (
                  <Button 
                    onClick={handleCancelTransaction}
                    variant="secondary"
                    className="w-full"
                    disabled={isCancelling}
                  >
                    <X className="w-4 h-4 mr-2" />
                    {isCancelling ? 'İptal Ediliyor...' : 'İşlemi İptal Et'}
                  </Button>
                )}
                
                <Button 
                  onClick={() => navigate('/dashboard')} 
                  variant="secondary"
                  className="w-full"
                >
                  CİHAZLARIM LİSTESİNE GERİ DÖN
                </Button>
              </div>
            </div>
        );
      } else {
        console.log("DeviceDetailPage: Showing waiting message for finder - FINDER PERSPECTIVE");
        // Finder (who reported the device) - MATCHED status için
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto py-12">
              {/* Success Header */}
              <div className="text-center mb-8">
                <div className="text-green-500 text-6xl mb-4">✅</div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Eşleşme Bulundu!
                </h1>
                <p className="text-gray-600">
                  Cihaz sahibinin ödeme yapması bekleniyor.
                </p>
              </div>

              {/* Bulunan Cihaz Detayları Card */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Bulunan Cihaz Detayları
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bulunma Tarihi:</span>
                    <span className="font-medium">{device.found_date || 'Belirtilmemiş'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bulunma Yeri:</span>
                    <span className="font-medium">{device.found_location || 'Belirtilmemiş'}</span>
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
                  
                  {device.invoice_url && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bulunan Cihaz Fotoğrafı (Ön ve Arka):</span>
                      <span className="font-medium text-sm text-blue-600">
                        {device.invoice_url.split(',').length} fotoğraf yüklendi
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* İşlem Durumu Card */}
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  İşlem Durumu
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Durum:</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      Kayıtlı {device.serialNumber} seri numaralı {device.model} cihaz için eşleşme bulundu.
                    </span>
                  </div>
                </div>
              </div>

              {/* Durum Bilgisi */}
              <div className="bg-yellow-50 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Durum Bilgisi
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">Cihaz için eşleşme bekleniyor</p>
                      <p className="text-gray-600 text-sm"></p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">Eşleşme bulundu</p>
                      <p className="text-gray-600 text-sm">Cihazın sahibinin ödeme yapması bekleniyor.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">Cihazın Kargo Firmasına Teslim Edilmesi</p>
                      <p className="text-gray-600 text-sm">Teslim/Takip için kargo numaranız: XXX</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">Cihaz Sahibi Teslim Alındığında</p>
                      <p className="text-gray-600 text-sm">Kargo firması cihazı sahibine teslim etti. Onay bekleniyor.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      5
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">İşlem Tamamlandı</p>
                      <p className="text-gray-600 text-sm">Takas tamamlandığında ödülünüz hesabınıza aktarılacak.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ödül Bilgisi */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200 p-6 mb-6">
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">🎁</div>
                  <h3 className="text-xl font-bold text-gray-800">
                    ÇOK TEŞEKKÜR EDERİZ!
                  </h3>
                </div>

                <div className="space-y-4 text-sm text-gray-700">
                  <p className="leading-relaxed text-center">
                    iFoundAnApple olarak, <strong>dürüstlüğünüzü</strong> ve <strong>yardımseverliğinizi</strong> yürekten takdir eder, 
                    bu nazik davranışınız için teşekkür ederiz!
                  </p>
                  
                  <p className="leading-relaxed text-center">
                    Değerli eşyaların sahiplerine ulaşması için şeffaf ve güvenilir bir platform sunmaya özen gösteriyoruz. 
                    Senin gibi insanların varlığı, dünyayı daha iyi bir yer yapıyor.
                  </p>
                  
                  <p className="leading-relaxed text-center">
                    Bulduğunuz cihaz sahibine teslim edildiğinde, gösterdiğiniz çaba ve örnek davranış karşılığında 
                    <strong> küçük bir hediye</strong> almanızı sağlıyoruz.
                  </p>
                  
                  <div className="mt-4 pt-4 border-t border-green-300">
                    <p className="leading-relaxed text-gray-600">
                      💡 <strong>Önemli:</strong> Cihaz eşleşmesi gerçekleştiği zaman lütfen kimlik ve IBAN bilgilerinizin doğruluğunu 
                      profil sayfasından kontrol ediniz.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-4">
                {paymentId && (
                  <Button 
                    onClick={handleCancelTransaction}
                    variant="secondary"
                    className="w-full"
                    disabled={isCancelling}
                  >
                    <X className="w-4 h-4 mr-2" />
                    {isCancelling ? 'İptal Ediliyor...' : 'İşlemi İptal Et'}
                  </Button>
                )}
                
                <Button 
                  onClick={() => navigate('/dashboard')} 
                  variant="secondary"
                  className="w-full"
                >
                  CİHAZLARIM LİSTESİNE GERİ DÖN
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
          </div>
        );
      }

      case DeviceStatus.EXCHANGE_PENDING:
        return (
          <StatusView
            icon={<ArrowRightLeft className="w-10 h-10" />}
            title={t("paymentReceived")}
            description={
              isOriginalOwnerPerspective
                ? t("paymentSecureExchange")
                : t("finderPaymentSecureExchange")
            }
          >
            <div className="mt-8 text-left max-w-lg mx-auto bg-brand-gray-100 p-6 rounded-lg space-y-4">
              <h4 className="text-lg font-semibold text-brand-gray-600 text-center">
                {t("secureExchangeGuidelines")}
              </h4>
              <p className="text-sm text-brand-gray-500">
                1. {t("guideline1")}
              </p>
              <p className="text-sm text-brand-gray-500">
                2. {t("guideline2")}
              </p>
              <p className="text-sm text-brand-gray-500">
                3. {t("guideline3")}
              </p>
              <p className="text-sm text-brand-gray-500">
                4. {t("guideline4")}
              </p>
            </div>

            <div className="mt-8">
              <Button
                onClick={() => confirmExchange(device.id, currentUser.id)}
                size="lg"
                disabled={hasCurrentUserConfirmed}
              >
                {hasCurrentUserConfirmed ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    {t("waitingForOtherParty")}
                  </>
                ) : (
                  t("confirmExchange")
                )}
              </Button>
            </div>
          </StatusView>
        );

      case DeviceStatus.COMPLETED:
        console.log("DeviceDetailPage: COMPLETED case executed");
        console.log("DeviceDetailPage: isOriginalOwnerPerspective:", isOriginalOwnerPerspective);
        console.log("DeviceDetailPage: device_role:", device.device_role);
        
        // Cihaz sahibi perspektifinde - işlem tamamlandı
        if (isOriginalOwnerPerspective) {
          console.log("DeviceDetailPage: COMPLETED - Owner perspective");
          return (
            <div className="min-h-screen bg-gray-50">
              <div className="max-w-2xl mx-auto py-12">
                {/* Success Header */}
                <div className="text-center mb-8">
                  <div className="text-green-500 text-6xl mb-4">🎉</div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Cihazınıza Kavuştuğunuz için Çok Mutluyuz!
                  </h1>
                  <p className="text-gray-600 mb-4">
                    Süreci başarı ile tamamladık.
                  </p>
                </div>

                {/* Kayıp Cihaz Detayları Card */}
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
                      <span className="font-medium">{device.color || 'Belirtilmemiş'}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ek Detaylar:</span>
                      <span className="font-medium">{device.description || 'Belirtilmemiş'}</span>
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600">Satın Alma Kanıtı (Fatura) Dosyası:</span>
                      {device.invoice_url || device.invoiceDataUrl ? (
                        isLoadingInvoice ? (
                          <span className="text-gray-500 text-sm">Yükleniyor...</span>
                        ) : secureInvoiceUrl || device.invoiceDataUrl ? (
                          <a
                            href={secureInvoiceUrl || device.invoiceDataUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline text-sm"
                          >
                            Faturayı Görüntüle
                          </a>
                        ) : (
                          <span className="text-gray-500 text-sm">Yüklenemedi</span>
                        )
                      ) : (
                        <span className="text-gray-500 text-sm">Belirtilmemiş</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* İşlem Durumu Card */}
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    İşlem Durumu
                  </h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Durum:</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        Kayıtlı {device.serialNumber} seri numaralı {device.model} cihaz teslim edildi. Teslim alma onaylandı.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ödeme Detayları Card */}
                {paymentDetails && (
                  <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Ödeme Detayları
                    </h2>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ödeme ID:</span>
                        <span className="font-mono text-sm">{paymentDetails.id}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Toplam Tutar:</span>
                        <span className="font-medium">
                          {paymentDetails.total_amount 
                            ? `${new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(paymentDetails.total_amount)} ${paymentDetails.currency || 'TRY'}`
                            : 'Belirtilmemiş'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ödeme Durumu:</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          Tamamlandı
                        </span>
                      </div>
                      
                      {paymentDetails.payment_provider && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ödeme Sağlayıcı:</span>
                          <span className="font-medium">{paymentDetails.payment_provider}</span>
                        </div>
                      )}
                      
                      {paymentDetails.completed_at && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ödeme Tarihi:</span>
                          <span className="font-medium">
                            {new Date(paymentDetails.completed_at).toLocaleDateString('tr-TR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Escrow Durumu Card */}
                {escrowDetails && (
                  <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Escrow Durumu
                    </h2>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Escrow ID:</span>
                        <span className="font-mono text-sm">{escrowDetails.id}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Durum:</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          Serbest Bırakıldı
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Escrow Tutarı:</span>
                        <span className="font-medium">
                          {escrowDetails.net_payout || escrowDetails.amount
                            ? `${new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(escrowDetails.net_payout || escrowDetails.amount)} ${escrowDetails.currency || 'TRY'}`
                            : 'Belirtilmemiş'}
                        </span>
                      </div>
                      
                      {escrowDetails.released_at && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Serbest Bırakılma Tarihi:</span>
                          <span className="font-medium">
                            {new Date(escrowDetails.released_at).toLocaleDateString('tr-TR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      )}
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
                      <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">Cihaz için eşleşme bekleniyor</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">Cihazınız bulundu</p>
                        <p className="text-gray-600 text-sm">Ödemenizi yapmak ve takas sürecini tamamlamak için "Ödemeyi güvenle yap" Butonu</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">Cihazınızın size teslim edilmesi bekleniyor</p>
                        <p className="text-gray-600 text-sm">
                          Teslim/Takip için kargo numaranız: {cargoShipment?.tracking_number || 'Yükleniyor...'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                        4
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">Cihaz Teslim Alındığında</p>
                        <p className="text-gray-600 text-sm">Cihazın seri numarasını kontrol edip teslim aldığınızı onaylayın "Onay Butonu"</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        5
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">İşlem Tamamlandı</p>
                        <p className="text-gray-600 text-sm">Cihazınıza kavuştuğunuz için mutluyuz</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <Button 
                    onClick={() => navigate('/dashboard')} 
                    variant="primary"
                    className="flex-1"
                  >
                    CİHAZLARIM LİSTESİNE GERİ DÖN
                  </Button>
                </div>
              </div>
            </div>
          );
        }

        // Bulan kişi perspektifinde - ödül transfer edildi
        console.log("DeviceDetailPage: COMPLETED - Finder perspective");
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto py-12">
              {/* Success Header */}
              <div className="text-center mb-8">
                <div className="text-green-500 text-6xl mb-4">🎉</div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  İşlem Başarıyla Tamamlandı!
                </h1>
                <p className="text-gray-600 mb-4">
                  Yardımın için teşekkür ederiz! Ödülün, belirttiğin IBAN adresine transfer edildi.
                </p>
              </div>

              {/* Bulunan Cihaz Detayları Card */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Bulunan Cihaz Detayları
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bulunma Tarihi:</span>
                    <span className="font-medium">
                      {device.found_date ? new Date(device.found_date).toLocaleDateString('tr-TR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      }) : 'Belirtilmemiş'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bulunma Yeri:</span>
                    <span className="font-medium">{device.found_location || 'Belirtilmemiş'}</span>
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
                    <span className="font-medium">{device.color || 'Belirtilmemiş'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ek Detaylar:</span>
                    <span className="font-medium">{device.description || 'Belirtilmemiş'}</span>
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600">Bulunan Cihaz Fotoğrafı (Ön ve Arka):</span>
                    {device.invoice_url ? (
                      <div className="text-right">
                        <span className="font-medium text-sm text-blue-600 block mb-1">
                          {device.invoice_url.split(',').length} fotoğraf yüklendi
                        </span>
                        <div className="flex flex-col gap-1">
                          {device.invoice_url.split(',').map((photoUrl, index) => (
                            <a
                              key={index}
                              href={photoUrl.trim()}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 underline"
                            >
                              Fotoğraf {index + 1}'i Görüntüle
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">Fotoğraf eklenmemiş</span>
                    )}
                  </div>
                </div>
              </div>

              {/* İşlem Durumu Card */}
              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  İşlem Durumu
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Durum:</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      İşlem tamamlandı. Ödülün gönderildi.
                    </span>
                  </div>
                </div>
              </div>

              {/* Durum Bilgisi */}
              <div className="bg-yellow-50 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Durum Bilgisi
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">Cihaz için eşleşme bekleniyor</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">Eşleşme bulundu</p>
                      <p className="text-gray-600 text-sm">Cihazın sahibinin ödeme yapması bekleniyor.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">Cihazın Kargo Firmasına Teslim Edilmesi</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">Cihaz Sahibi Teslim Alındığında</p>
                      <p className="text-gray-600 text-sm">Kargo firması cihazı sahibine teslim edecek. Onay bekleniyor.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      5
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">İşlem Tamamlandı</p>
                      <p className="text-gray-600 text-sm">Takas tamamlandığında ödülünüz hesabınıza aktarıldı.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button 
                  onClick={() => navigate('/dashboard')} 
                  variant="primary"
                  className="flex-1"
                >
                  DASHBOARDA DÖN
                </Button>
              </div>
            </div>
          </div>
        );

      case DeviceStatus.LOST:
        console.log("DeviceDetailPage: LOST case executed");
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto py-12">
              {/* Success Header */}
              <div className="text-center mb-8">
                <div className="text-green-500 text-6xl mb-4">✅</div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Cihazınızın Kaydı Başarıyla Tamamlandı!
                </h1>
                <p className="text-gray-600">
                  Kayıp cihazınız sisteme kaydedildi. Eşleşme bulunduğunda size bildirim gönderilecektir.
                </p>
              </div>

              {/* Kayıp Cihaz Detayları Card */}
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
                    {isLoadingInvoice ? (
                      <div className="flex items-center text-gray-500">
                        <div className="animate-spin w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                        Yükleniyor...
                      </div>
                    ) : secureInvoiceUrl || device.invoiceDataUrl ? (
                      <a
                        href={secureInvoiceUrl || device.invoiceDataUrl}
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

              {/* İşlem Durumu Card */}
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  İşlem Durumu
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Durum:</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      Kayıtlı {device.model} {device.serialNumber} için eşleşme bekleniyor
                    </span>
                  </div>
                </div>
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
                      <p className="font-medium text-gray-900 mb-1">Cihaz için eşleşme bekleniyor</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">Cihazınız bulundu</p>
                      <div className="flex items-center justify-between">
                        <p className="text-gray-600 text-sm">Ödemenizi yapmak ve takas sürecini tamamlamak için</p>
                        <Button 
                          variant="primary" 
                          className="ml-4"
                          disabled
                        >
                          Ödemeyi Güvenle Yap
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">Cihazınızın Kargo ile Teslim Edilmesi Bekleniyor</p>
                      <p className="text-gray-600 text-sm">Takip için kargo numaranız: <span className="font-mono font-semibold">-</span></p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">Cihaz Teslim Alındığında</p>
                      <div className="flex items-center justify-between">
                        <p className="text-gray-600 text-sm">Cihazın seri numarasını kontrol edip teslim aldığınızı onaylayın</p>
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
                      5
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
                  variant="secondary" 
                  className="flex-1"
                  onClick={() => {
                    if (confirm('Bu cihazın kaydını silmek istediğinizden emin misiniz?')) {
                      // TODO: Implement delete device functionality
                      console.log('Delete device:', device.id);
                    }
                  }}
                >
                  KAYDI SİL
                </Button>
                
                <Button 
                  onClick={() => navigate('/dashboard')} 
                  variant="primary"
                  className="flex-1"
                >
                  CİHAZLARIM LİSTESİNE GERİ DÖN
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
          </div>
        );

      case DeviceStatus.REPORTED:
        console.log("DeviceDetailPage: REPORTED case executed");
        // Bulunan cihaz detay sayfası
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto py-12">
              {/* Success Header */}
              <div className="text-center mb-8">
                <div className="text-green-500 text-6xl mb-4">✅</div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Cihazın Kaydı Başarıyla Tamamlandı!
                </h1>
                <p className="text-gray-600">
                  Bulduğun cihaz sisteme kaydedildi. Eşleşme bulunduğunda size bildirim gönderilecektir.
                </p>
              </div>

              {/* Bulunan Cihaz Detayları Card */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Bulunan Cihaz Detayları
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bulunma Tarihi:</span>
                    <span className="font-medium">{device.found_date || 'Belirtilmemiş'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bulunma Yeri:</span>
                    <span className="font-medium">{device.found_location || 'Belirtilmemiş'}</span>
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
                  
                  {device.invoice_url && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bulunan Cihaz Fotoğrafı (Ön ve Arka):</span>
                      <span className="font-medium text-sm text-blue-600">
                        {device.invoice_url.split(',').length} fotoğraf yüklendi
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* İşlem Durumu Card */}
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  İşlem Durumu
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Durum:</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      Kayıtlı {device.serialNumber} seri numaralı {device.model} cihaz için eşleşme bekleniyor.
                    </span>
                  </div>
                </div>
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
                      <p className="font-medium text-gray-900 mb-1">Cihaz için eşleşme bekleniyor</p>
                      <p className="text-gray-600 text-sm"></p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">Eşleşme bulundu</p>
                      <p className="text-gray-600 text-sm">Cihazın sahibinin ödeme yapması bekleniyor.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">Cihazın Kargo Firmasına Teslim Edilmesi</p>
                      <p className="text-gray-600 text-sm">Teslim/Takip için kargo numaranız: XXX</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">Cihaz Sahibi Teslim Alındığında</p>
                      <p className="text-gray-600 text-sm">Kargo firması cihazı sahibine teslim etti. Onay bekleniyor.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      5
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">İşlem Tamamlandı</p>
                      <p className="text-gray-600 text-sm">Takas tamamlandığında ödülünüz hesabınıza aktarılacak.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ödül Bilgisi */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200 p-6 mb-6">
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">🎁</div>
                  <h3 className="text-xl font-bold text-gray-800">
                    ÇOK TEŞEKKÜR EDERİZ!
                  </h3>
                </div>

                <div className="space-y-4 text-sm text-gray-700">
                  <p className="leading-relaxed text-center">
                    iFoundAnApple olarak, <strong>dürüstlüğünüzü</strong> ve <strong>yardımseverliğinizi</strong> yürekten takdir eder, 
                    bu nazik davranışınız için teşekkür ederiz!
                  </p>
                  
                  <p className="leading-relaxed text-center">
                    Değerli eşyaların sahiplerine ulaşması için şeffaf ve güvenilir bir platform sunmaya özen gösteriyoruz. 
                    Senin gibi insanların varlığı, dünyayı daha iyi bir yer yapıyor.
                  </p>
                  
                  <p className="leading-relaxed text-center">
                    Bulduğunuz cihaz sahibine teslim edildiğinde, gösterdiğiniz çaba ve örnek davranış karşılığında 
                    <strong> küçük bir hediye</strong> almanızı sağlıyoruz.
                  </p>
                  
                  <div className="mt-4 pt-4 border-t border-green-300">
                    <p className="leading-relaxed text-gray-600">
                      💡 <strong>Önemli:</strong> Cihaz eşleşmesi gerçekleştiği zaman lütfen kimlik ve IBAN bilgilerinizin doğruluğunu 
                      profil sayfasından kontrol ediniz.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button 
                  variant="secondary" 
                  className="flex-1"
                  onClick={() => {
                    if (confirm('Bu cihazın kaydını silmek istediğinizden emin misiniz?')) {
                      // TODO: Implement delete device functionality
                      console.log('Delete device:', device.id);
                    }
                  }}
                >
                  KAYDI SİL
                </Button>
                
                <Button 
                  onClick={() => navigate('/dashboard')} 
                  variant="primary"
                  className="flex-1"
                >
                  CİHAZLARIM LİSTESİNE GERİ DÖN
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
          </div>
        );

      case DeviceStatus.PAYMENT_COMPLETED:
        console.log("DeviceDetailPage: PAYMENT_COMPLETED case executed");
        console.log("DeviceDetailPage: isOriginalOwnerPerspective:", isOriginalOwnerPerspective);
        
        // Cihaz sahibi perspektifi - ödeme tamamlandı, kargo bekleniyor
        if (isOriginalOwnerPerspective) {
          return (
            <div className="min-h-screen bg-gray-50">
              <div className="max-w-2xl mx-auto py-12">
                {/* Success Header */}
                <div className="text-center mb-8">
                  <div className="text-green-500 text-6xl mb-4">✅</div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Ödemeniz Başarıyla Tamamlandı!
                  </h1>
                  <p className="text-gray-600">
                    Cihazınızın kargo firmasına teslim edilmesi bekleniliyor.
                  </p>
                </div>

                {/* Kayıp Cihaz Detayları Card */}
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
                      <span className="font-medium">{device.color || 'Belirtilmemiş'}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ek Detaylar:</span>
                      <span className="font-medium">{device.description || 'Belirtilmemiş'}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Satın Alma Kanıtı (Fatura) Dosyası:</span>
                      {isLoadingInvoice ? (
                        <div className="flex items-center text-gray-500">
                          <div className="animate-spin w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                          Yükleniyor...
                        </div>
                      ) : secureInvoiceUrl || device.invoiceDataUrl ? (
                        <a
                          href={secureInvoiceUrl || device.invoiceDataUrl}
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

                {/* İşlem Durumu Card */}
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    İşlem Durumu
                  </h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Durum:</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        Kayıtlı {device.serialNumber} seri numaralı {device.model} cihaz ödemesi alındı. Kargo firmasına teslimi bekleniliyor.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ödeme Detayları Card */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Ödeme Detayları
                  </h2>
                  
                  {paymentDetails ? (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ödeme ID:</span>
                        <span className="font-mono text-sm">{paymentDetails.id}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Toplam Tutar:</span>
                        <span className="font-medium">{paymentDetails.total_amount?.toFixed(2)} TL</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ödeme Durumu:</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          Tamamlandı
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ödeme Sağlayıcı:</span>
                        <span className="font-medium">{paymentDetails.payment_provider || 'Belirtilmemiş'}</span>
                      </div>
                      
                      {paymentDetails.completed_at && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ödeme Tarihi:</span>
                          <span className="font-medium">
                            {new Date(paymentDetails.completed_at).toLocaleDateString('tr-TR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      Ödeme detayları yükleniyor...
                    </div>
                  )}
                </div>

                {/* Escrow Durumu Card */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Escrow Durumu
                  </h2>
                  
                  {escrowDetails ? (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Escrow ID:</span>
                        <span className="font-mono text-sm">{escrowDetails.id}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Durum:</span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                          Beklemede
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Escrow Tutarı:</span>
                        <span className="font-medium">{escrowDetails.total_amount?.toFixed(2)} TL</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      Escrow bilgileri yükleniyor...
                    </div>
                  )}
                </div>

                {/* Durum Bilgisi */}
                <div className="bg-yellow-50 rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Durum Bilgisi
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">Cihaz için eşleşme bekleniyor</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">Cihazınız bulundu</p>
                        <p className="text-gray-600 text-sm">Ödemenizi yapmak ve takas sürecini tamamlamak için "Ödemeyi güvenle yap Butonu"</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">Cihazınızın kargo ile teslim edilmesi bekleniyor</p>
                        <p className="text-gray-600 text-sm">Kargoya verildiğinde takip numaranız burada görünecektir.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                        4
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">Cihaz Teslim Alındığında</p>
                        <div className="flex items-center justify-between">
                          <p className="text-gray-600 text-sm">Cihazın seri numarasını kontrol edip teslim aldığınızı onaylayın</p>
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
                        5
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
                    onClick={() => navigate('/dashboard')} 
                    variant="primary"
                    className="flex-1"
                  >
                    CİHAZLARIM LİSTESİNE GERİ DÖN
                  </Button>
                </div>
              </div>
            </div>
          );
        }

        // Bulan kişi perspektifinde - cihazı kargo firmasına teslim edecek
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto py-12">
              {/* Success Header */}
              <div className="text-center mb-8">
                <div className="text-green-500 text-6xl mb-4">✅</div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Ödeme Süreci Tamamlandı!
                </h1>
                <p className="text-gray-600 mb-4">
                  Lütfen en kısa sürede cihazı kargo firmasına teslim edin.
                </p>
                
                {/* Warning about profile info */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                  <p className="text-yellow-800 font-medium mb-2">
                    ⚠️ Ödülünüzü alabilmek için lütfen profil bilgilerinizi tamamlayın:
                  </p>
                  <ul className="text-left text-yellow-700 space-y-1">
                    <li>☐ TC Kimlik Numaranızı girin</li>
                    <li>☐ IBAN bilgilerinizi ekleyin</li>
                  </ul>
                </div>
              </div>

              {/* Bulunan Cihaz Detayları Card */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Bulunan Cihaz Detayları
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bulunma Tarihi:</span>
                    <span className="font-medium">
                      {device.found_date ? new Date(device.found_date).toLocaleDateString('tr-TR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      }) : 'Belirtilmemiş'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bulunma Yeri:</span>
                    <span className="font-medium">{device.found_location || 'Belirtilmemiş'}</span>
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
                    <span className="font-medium">{device.color || 'Belirtilmemiş'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ek Detaylar:</span>
                    <span className="font-medium">{device.description || 'Belirtilmemiş'}</span>
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600">Bulunan Cihaz Fotoğrafı (Ön ve Arka):</span>
                    {device.invoice_url ? (
                      <div className="text-right">
                        <span className="font-medium text-sm text-blue-600 block mb-1">
                          {device.invoice_url.split(',').length} fotoğraf yüklendi
                        </span>
                        <div className="flex flex-col gap-1">
                          {device.invoice_url.split(',').map((photoUrl, index) => (
                            <a
                              key={index}
                              href={photoUrl.trim()}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 underline"
                            >
                              Fotoğraf {index + 1}'i Görüntüle
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">Fotoğraf eklenmemiş</span>
                    )}
                  </div>
                </div>
              </div>

              {/* İşlem Durumu Card */}
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  İşlem Durumu
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Durum:</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      Kayıtlı {device.serialNumber} seri numaralı {device.model} cihaz için ödeme tamamlandı.
                    </span>
                  </div>
                </div>
              </div>

              {/* Durum Bilgisi */}
              <div className="bg-yellow-50 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Durum Bilgisi
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">Cihaz için eşleşme bekleniyor</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">Eşleşme bulundu</p>
                      <p className="text-gray-600 text-sm">Cihazın sahibinin ödeme yapması bekleniyor.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">Cihazın Kargo Firmasına Teslim Edilmesi</p>
                      {cargoShipment?.code ? (
                        <p className="text-gray-600 text-sm">
                          Kargo firmasına vereceğiniz <strong>Teslim Kodunuz:</strong> <span className="font-mono font-bold text-lg text-blue-600">{cargoShipment.code}</span>
                        </p>
                      ) : (
                        <p className="text-gray-600 text-sm">
                          Kargo firmasına vereceğiniz <strong>Teslim Kodunuz:</strong> Kargo kaydı oluşturulduktan sonra burada görünecektir.
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">Cihaz Sahibi Teslim Aldığında</p>
                      <p className="text-gray-600 text-sm">Kargo firması cihazı sahibine teslim edecek. Onay bekleniyor.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      5
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">İşlem Tamamlandı</p>
                      <p className="text-gray-600 text-sm">Takas tamamlandığında ödülünüz hesabınıza aktarılacak.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button 
                  onClick={() => navigate('/profile')} 
                  variant="secondary"
                  className="flex-1"
                >
                  PROFİL BİLGİLERİMİ TAMAMLA
                </Button>
                
                <Button 
                  onClick={() => navigate('/dashboard')} 
                  variant="primary"
                  className="flex-1"
                >
                  DASHBOARDA DÖN
                </Button>
              </div>
            </div>
          </div>
        );

      case DeviceStatus.CARGO_SHIPPED:
        console.log("DeviceDetailPage: CARGO_SHIPPED case executed");
        console.log("DeviceDetailPage: isOriginalOwnerPerspective:", isOriginalOwnerPerspective);
        
        // Cihaz sahibi perspektifinde - kargo yolda, takip numarası gösterilmeli
        if (isOriginalOwnerPerspective) {
          return (
            <div className="min-h-screen bg-gray-50">
              <div className="max-w-2xl mx-auto py-12">
                {/* Success Header */}
                <div className="text-center mb-8">
                  <div className="text-blue-500 text-6xl mb-4">🚚</div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Cihazınız Kargo Firmasına Teslim Edildi!
                  </h1>
                  <p className="text-gray-600 mb-4">
                    Cihazınız yolda! Lütfen takip numarası ile kontrol edin.
                  </p>
                  {cargoShipment?.tracking_number && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                      <p className="text-blue-800 font-semibold">
                        Teslim/Takip için kargo numaranız: <span className="font-mono text-lg">{cargoShipment.tracking_number}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Kayıp Cihaz Detayları Card */}
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
                      <span className="font-medium">{device.color || 'Belirtilmemiş'}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ek Detaylar:</span>
                      <span className="font-medium">{device.description || 'Belirtilmemiş'}</span>
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600">Satın Alma Kanıtı (Fatura) Dosyası:</span>
                      {device.invoice_url || device.invoiceDataUrl ? (
                        isLoadingInvoice ? (
                          <span className="text-gray-500 text-sm">Yükleniyor...</span>
                        ) : secureInvoiceUrl || device.invoiceDataUrl ? (
                          <a
                            href={secureInvoiceUrl || device.invoiceDataUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline text-sm"
                          >
                            Faturayı Görüntüle
                          </a>
                        ) : (
                          <span className="text-gray-500 text-sm">Yüklenemedi</span>
                        )
                      ) : (
                        <span className="text-gray-500 text-sm">Belirtilmemiş</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* İşlem Durumu Card */}
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    İşlem Durumu
                  </h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Durum:</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        Kayıtlı {device.serialNumber} seri numaralı {device.model} cihaz yolda. Kargo firması cihazı teslim edecek.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ödeme Detayları Card */}
                {paymentDetails && (
                  <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Ödeme Detayları
                    </h2>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ödeme ID:</span>
                        <span className="font-mono text-sm">{paymentDetails.id}</span>
                      </div>
                      
                    <div className="flex justify-between">
                      <span className="text-gray-600">Toplam Tutar:</span>
                      <span className="font-medium">
                        {paymentDetails.amount 
                          ? `${new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(paymentDetails.amount)} ${paymentDetails.currency || 'TRY'}`
                          : 'Belirtilmemiş'}
                      </span>
                    </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ödeme Durumu:</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          Tamamlandı
                        </span>
                      </div>
                      
                      {paymentDetails.payment_provider && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ödeme Sağlayıcı:</span>
                          <span className="font-medium">{paymentDetails.payment_provider}</span>
                        </div>
                      )}
                      
                      {paymentDetails.created_at && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ödeme Tarihi:</span>
                          <span className="font-medium">
                            {new Date(paymentDetails.created_at).toLocaleDateString('tr-TR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Escrow Durumu Card */}
                {escrowDetails && (
                  <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Escrow Durumu
                    </h2>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Escrow ID:</span>
                        <span className="font-mono text-sm">{escrowDetails.id}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Durum:</span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                          Beklemede
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Escrow Tutarı:</span>
                        <span className="font-medium">
                          {escrowDetails.amount 
                            ? `${new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(escrowDetails.amount)} ${escrowDetails.currency || 'TRY'}`
                            : 'Belirtilmemiş'}
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
                      <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">Cihaz için eşleşme bekleniyor</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">Cihazınız bulundu</p>
                        <p className="text-gray-600 text-sm">Ödemenizi yapmak ve takas sürecini tamamlamak için "Ödemeyi güvenle yap" Butonu</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">Cihazınızın size teslim edilmesi bekleniyor</p>
                        <p className="text-gray-600 text-sm">
                          Teslim/Takip için kargo numaranız: {cargoShipment?.tracking_number || 'Yükleniyor...'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                        4
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">Cihaz Teslim Alındığında</p>
                        <p className="text-gray-600 text-sm">Cihazın seri numarasını kontrol edip teslim aldığınızı onaylayın "Onay Butonu"</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                        5
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">İşlem Tamamlandı</p>
                        <p className="text-gray-600 text-sm">Cihazınıza kavuştuğunuz için mutluyuz</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <Button 
                    onClick={() => navigate('/dashboard')} 
                    variant="primary"
                    className="flex-1"
                  >
                    DASHBOARDA DÖN
                  </Button>
                </div>
              </div>
            </div>
          );
        }

        // Bulan kişi perspektifinde - cihaz kargoya verildi, yolda
        console.log("DeviceDetailPage: CARGO_SHIPPED - Finder perspective");
        console.log("DeviceDetailPage: isOriginalOwnerPerspective:", isOriginalOwnerPerspective);
        console.log("DeviceDetailPage: device_role:", device.device_role);
        
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto py-12">
              {/* Success Header */}
              <div className="text-center mb-8">
                <div className="text-green-500 text-6xl mb-4">🚚</div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Cihaz Yola Çıktı!
                </h1>
                <p className="text-gray-600 mb-4">
                  Cihazı başarıyla kargoya teslim ettin. Sahibine ulaşması bekleniyor.
                </p>
              </div>

              {/* Bulunan Cihaz Detayları Card */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Bulunan Cihaz Detayları
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bulunma Tarihi:</span>
                    <span className="font-medium">
                      {device.found_date ? new Date(device.found_date).toLocaleDateString('tr-TR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      }) : 'Belirtilmemiş'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bulunma Yeri:</span>
                    <span className="font-medium">{device.found_location || 'Belirtilmemiş'}</span>
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
                    <span className="font-medium">{device.color || 'Belirtilmemiş'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ek Detaylar:</span>
                    <span className="font-medium">{device.description || 'Belirtilmemiş'}</span>
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600">Bulunan Cihaz Fotoğrafı (Ön ve Arka):</span>
                    {device.invoice_url ? (
                      <div className="text-right">
                        <span className="font-medium text-sm text-blue-600 block mb-1">
                          {device.invoice_url.split(',').length} fotoğraf yüklendi
                        </span>
                        <div className="flex flex-col gap-1">
                          {device.invoice_url.split(',').map((photoUrl, index) => (
                            <a
                              key={index}
                              href={photoUrl.trim()}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 underline"
                            >
                              Fotoğraf {index + 1}'i Görüntüle
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">Fotoğraf eklenmemiş</span>
                    )}
                  </div>
                </div>
              </div>

              {/* İşlem Durumu Card */}
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  İşlem Durumu
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Durum:</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      Cihaz kargoya verildi. Sahibine teslim edilmesi bekleniyor.
                    </span>
                  </div>
                </div>
              </div>

              {/* Durum Bilgisi */}
              <div className="bg-yellow-50 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Durum Bilgisi
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">Cihaz için eşleşme bekleniyor</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">Eşleşme bulundu</p>
                      <p className="text-gray-600 text-sm">Cihazın sahibinin ödeme yapması bekleniyor.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">Cihazın Kargo Firmasına Teslim Edilmesi</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">Cihaz Sahibi Teslim Alındığında</p>
                      <p className="text-gray-600 text-sm">Kargo firması cihazı sahibine teslim edecek. Onay bekleniyor.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      5
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">İşlem Tamamlandı</p>
                      <p className="text-gray-600 text-sm">Takas tamamlandığında ödülünüz hesabınıza aktarılacak.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button 
                  onClick={() => navigate('/dashboard')} 
                  variant="primary"
                  className="flex-1"
                >
                  DASHBOARDA DÖN
                </Button>
              </div>
            </div>
          </div>
        );

      case DeviceStatus.DELIVERED:
        console.log("DeviceDetailPage: DELIVERED case executed");
        console.log("DeviceDetailPage: isOriginalOwnerPerspective:", isOriginalOwnerPerspective);
        console.log("DeviceDetailPage: device_role:", device.device_role);
        
        // Cihaz sahibi perspektifinde - cihaz teslim edildi, onay veya itiraz
        if (isOriginalOwnerPerspective) {
          console.log("DeviceDetailPage: DELIVERED - Owner perspective");
          return (
            <div className="min-h-screen bg-gray-50">
              <div className="max-w-2xl mx-auto py-12">
                {/* Success Header */}
                <div className="text-center mb-8">
                  <div className="text-green-500 text-6xl mb-4">📦</div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Cihazınız Size Teslim Edildi!
                  </h1>
                  <p className="text-gray-600 mb-4">
                    Cihazınız teslim edildi. Lütfen Seri Numarasını Kontrol Edin ve Onaylayın.
                  </p>
                </div>

                {/* Kayıp Cihaz Detayları Card */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Kayıp Cihaz Detayları
                  </h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kayıp Tarihi:</span>
                      <span className="font-medium">
                        {device.lost_date ? new Date(device.lost_date).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}
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
                      <span className="font-medium">{device.color || 'Belirtilmemiş'}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ek Detaylar:</span>
                      <span className="font-medium">{device.description || 'Belirtilmemiş'}</span>
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600">Satın Alma Kanıtı (Fatura) Dosyası:</span>
                      {device.invoice_url || device.invoiceDataUrl ? (
                        isLoadingInvoice ? (
                          <span className="text-gray-500 text-sm">Yükleniyor...</span>
                        ) : secureInvoiceUrl || device.invoiceDataUrl ? (
                          <a
                            href={secureInvoiceUrl || device.invoiceDataUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline text-sm"
                          >
                            Faturayı Görüntüle
                          </a>
                        ) : (
                          <span className="text-gray-500 text-sm">Yüklenemedi</span>
                        )
                      ) : (
                        <span className="text-gray-500 text-sm">Belirtilmemiş</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* İşlem Durumu Card */}
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    İşlem Durumu
                  </h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Durum:</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        Kayıtlı {device.serialNumber} seri numaralı {device.model} cihaz teslim edildi. Teslim almayı onaylayın.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ödeme Detayları Card */}
                {paymentDetails && (
                  <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Ödeme Detayları
                    </h2>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ödeme ID:</span>
                        <span className="font-mono text-sm">{paymentDetails.id}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Toplam Tutar:</span>
                        <span className="font-medium">
                          {paymentDetails.amount 
                            ? `${new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(paymentDetails.amount)} ${paymentDetails.currency || 'TRY'}`
                            : 'Belirtilmemiş'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ödeme Durumu:</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          Tamamlandı
                        </span>
                      </div>
                      
                      {paymentDetails.payment_provider && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ödeme Sağlayıcı:</span>
                          <span className="font-medium">{paymentDetails.payment_provider}</span>
                        </div>
                      )}
                      
                      {paymentDetails.created_at && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ödeme Tarihi:</span>
                          <span className="font-medium">
                            {new Date(paymentDetails.created_at).toLocaleDateString('tr-TR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Escrow Durumu Card */}
                {escrowDetails && (
                  <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Escrow Durumu
                    </h2>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Escrow ID:</span>
                        <span className="font-mono text-sm">{escrowDetails.id}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Durum:</span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                          Beklemede
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Escrow Tutarı:</span>
                        <span className="font-medium">
                          {escrowDetails.amount 
                            ? `${new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(escrowDetails.amount)} ${escrowDetails.currency || 'TRY'}`
                            : 'Belirtilmemiş'}
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
                      <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">Cihaz için eşleşme bekleniyor</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">Cihazınız bulundu</p>
                        <p className="text-gray-600 text-sm">Ödemenizi yapmak ve takas sürecini tamamlamak için "Ödemeyi güvenle yap" Butonu</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">Cihazınızın size teslim edilmesi bekleniyor</p>
                        <p className="text-gray-600 text-sm">
                          Teslim/Takip için kargo numaranız: {cargoShipment?.tracking_number || 'Yükleniyor...'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        4
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">Cihaz Teslim Alındığında</p>
                        <p className="text-gray-600 text-sm">Cihazın seri numarasını kontrol edip teslim aldığınızı onaylayın "Onay Butonu"</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                        5
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">İşlem Tamamlandı</p>
                        <p className="text-gray-600 text-sm">Cihazınıza kavuştuğunuz için mutluyuz</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                  <div className="flex flex-col space-y-4">
                    <Button 
                      onClick={async () => {
                        // TODO: Implement confirmDelivery call
                        alert('Teslimat onaylama işlemi yakında eklenecek');
                      }}
                      variant="primary"
                      className="w-full"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Cihazımı Teslim Aldım, Onayla
                    </Button>
                    
                    <Button 
                      onClick={handleDisputeTransaction}
                      variant="secondary"
                      className="w-full"
                      disabled={isDisputing}
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      {isDisputing ? 'İtiraz Gönderiliyor...' : 'Sorun Var, İtiraz Et'}
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <Button 
                    onClick={() => navigate('/dashboard')} 
                    variant="secondary"
                    className="flex-1"
                  >
                    CİHAZLARIM LİSTESİNE GERİ DÖN
                  </Button>
                </div>
              </div>
            </div>
          );
        }
        
        // Bulan kişi perspektifinde - cihaz sahibine teslim edildi, onay bekleniyor
        console.log("DeviceDetailPage: DELIVERED - Finder perspective");
        console.log("DeviceDetailPage: isOriginalOwnerPerspective:", isOriginalOwnerPerspective);
        console.log("DeviceDetailPage: device_role:", device.device_role);
        
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto py-12">
              {/* Success Header */}
              <div className="text-center mb-8">
                <div className="text-green-500 text-6xl mb-4">✅</div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Teslimat Tamamlandı! Onay Bekleniyor.
                </h1>
                <p className="text-gray-600 mb-4">
                  Kargo firması cihazı sahibine teslim etti. Ödülünün serbest bırakılması için cihaz sahibinin teslimatı onaylaması bekleniyor.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  (Not: Cihaz sahibi 48 saat içinde onaylamazsa, sistem işlemi otomatik olarak onaylayacaktır.)
                </p>
              </div>

              {/* Bulunan Cihaz Detayları Card */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Bulunan Cihaz Detayları
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bulunma Tarihi:</span>
                    <span className="font-medium">
                      {device.found_date ? new Date(device.found_date).toLocaleDateString('tr-TR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      }) : 'Belirtilmemiş'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bulunma Yeri:</span>
                    <span className="font-medium">{device.found_location || 'Belirtilmemiş'}</span>
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
                    <span className="font-medium">{device.color || 'Belirtilmemiş'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ek Detaylar:</span>
                    <span className="font-medium">{device.description || 'Belirtilmemiş'}</span>
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600">Bulunan Cihaz Fotoğrafı (Ön ve Arka):</span>
                    {device.invoice_url ? (
                      <div className="text-right">
                        <span className="font-medium text-sm text-blue-600 block mb-1">
                          {device.invoice_url.split(',').length} fotoğraf yüklendi
                        </span>
                        <div className="flex flex-col gap-1">
                          {device.invoice_url.split(',').map((photoUrl, index) => (
                            <a
                              key={index}
                              href={photoUrl.trim()}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 underline"
                            >
                              Fotoğraf {index + 1}'i Görüntüle
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">Fotoğraf eklenmemiş</span>
                    )}
                  </div>
                </div>
              </div>

              {/* İşlem Durumu Card */}
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  İşlem Durumu
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Durum:</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      Cihaz sahibine teslim edildi. Onay bekleniyor.
                    </span>
                  </div>
                </div>
              </div>

              {/* Durum Bilgisi */}
              <div className="bg-yellow-50 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Durum Bilgisi
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">Cihaz için eşleşme bekleniyor</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">Eşleşme bulundu</p>
                      <p className="text-gray-600 text-sm">Cihazın sahibinin ödeme yapması bekleniyor.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">Cihazın Kargo Firmasına Teslim Edilmesi</p>
                      <p className="text-gray-600 text-sm">Cihaz kargo firmasına teslim edildi.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">Cihaz Sahibi Teslim Alındığında</p>
                      <p className="text-gray-600 text-sm">Kargo firması cihazı sahibine teslim etti. Onay bekleniyor.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      5
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">İşlem Tamamlandı</p>
                      <p className="text-gray-600 text-sm">Takas tamamlandığında ödülünüz hesabınıza aktarılacak.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button 
                  onClick={() => navigate('/dashboard')} 
                  variant="primary"
                  className="flex-1"
                >
                  DASHBOARDA DÖN
                </Button>
              </div>
            </div>
          </div>
        );

      default: // Other statuses
        console.log(
          "DeviceDetailPage: Default case executed - status not matched:",
          device.status
        );
        return (
          <StatusView
            icon={<Info className="w-10 h-10" />}
            title={isOriginalOwnerPerspective ? t("Lost") : t("Reported")}
            description="The device is registered in the system. We will notify you when a match is found."
          >
            {isOriginalOwnerPerspective &&
              (device.invoice_url || device.invoiceDataUrl) && (
                <div className="border-t border-brand-gray-200 mt-6 pt-6 w-full max-w-sm">
                  {isLoadingInvoice ? (
                    <Button variant="secondary" className="w-full" disabled>
                      <div className="animate-spin w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                      Loading invoice...
                    </Button>
                  ) : secureInvoiceUrl || device.invoiceDataUrl ? (
                    <a
                      href={secureInvoiceUrl || device.invoiceDataUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button variant="secondary" className="w-full">
                        <Paperclip className="w-4 h-4 mr-2" />
                        {t("viewInvoice")}
                      </Button>
                    </a>
                  ) : (
                    <Button variant="secondary" className="w-full" disabled>
                      <Paperclip className="w-4 h-4 mr-2" />
                      Invoice unavailable
                    </Button>
                  )}
                </div>
              )}
          </StatusView>
        );
    }
  };

  return (
    <Container>
      <div className="mb-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-sm font-medium text-brand-blue hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("backToDashboard")}
        </Link>
      </div>


      {renderContent()}
    </Container>
  );
};

export default DeviceDetailPage;
