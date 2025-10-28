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
} from "lucide-react";

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
  // or the finder. This is based on the device's current status after matching:
  // - If device status is PAYMENT_PENDING, this user is the original owner who needs to pay
  // - If device status is MATCHED, this user is the finder who should receive payment
  // - If device status is LOST, this user is the original owner waiting for a match
  const isOriginalOwnerPerspective = 
    device.status === DeviceStatus.PAYMENT_PENDING ||
    device.status === DeviceStatus.LOST;
  const hasCurrentUserConfirmed = device.exchangeConfirmedBy?.includes(
    currentUser.id
  );

  console.log("DeviceDetailPage: Device status:", device?.status);
  console.log("DeviceDetailPage: Device rewardAmount:", device?.rewardAmount);
  console.log(
    "DeviceDetailPage: isOriginalOwnerPerspective:",
    isOriginalOwnerPerspective
  );
  console.log("DeviceDetailPage: Full device object:", device);
  console.log("DeviceDetailPage: DeviceStatus.LOST value:", DeviceStatus.LOST);
  console.log(
    "DeviceDetailPage: Status comparison:",
    device?.status === DeviceStatus.LOST
  );

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
        return (
          <StatusView
            icon={<PartyPopper className="w-10 h-10" />}
            title={t("transactionCompleted")}
            description={t("transactionCompletedDesc")}
          >
            {!isOriginalOwnerPerspective && (
              <p className="mt-4 text-sm text-brand-gray-400">
                {t("serviceFeeNotice")}
              </p>
            )}
            <div className="mt-8">
              <Button
                onClick={() => navigate("/dashboard")}
                variant="secondary"
              >
                {t("backToDashboard")}
              </Button>
            </div>
          </StatusView>
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
                  Süreç Bilgisi
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">Kayıp cihaz sahibi ile eşleşme bekleniyor</p>
                      <p className="text-gray-600 text-sm">Sistemde kayıtlı kayıp cihazlarla eşleşme aranıyor</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">Eşleşme bulunduğunda bildirim alacaksın</p>
                      <p className="text-gray-600 text-sm">Kayıp cihaz sahibinin ödeme yapması beklenecek</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">Cihazın Kargo ile Teslim Edilmesi</p>
                      <p className="text-gray-600 text-sm">Kargo bilgileri sistemde paylaşılacak</p>
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
                    Ödül Hakkında Bilgi
                  </h3>
                </div>

                <div className="space-y-3 text-sm text-gray-700">
                  <p className="leading-relaxed">
                    <strong>Bu nazik davranışın için teşekkür ederiz!</strong> Bulduğun cihaz sahibine teslim edildiğinde, 
                    cihazın piyasa değerine göre belirlenen bir ödül tarafına ödenecektir.
                  </p>
                  
                  <p className="leading-relaxed">
                    <strong>Ödül Tutarı:</strong> Cihazın modelinden otomatik olarak hesaplanacak ve takas tamamlandığında 
                    belirttiğin IBAN numarasına aktarılacaktır.
                  </p>
                  
                  <p className="leading-relaxed text-gray-600 italic">
                    💡 IBAN bilgilerini profil sayfandan ekleyebilir veya güncelleyebilirsin.
                  </p>
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
                      <p className="text-gray-600 text-sm">Kargo firmasına vereceğiniz <strong>Teslim Kodunuz: [TESLİM_KODU]</strong></p>
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
