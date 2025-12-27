import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext.tsx";
import { Device, DeviceStatus } from "../types.ts";
import Container from "../components/ui/Container.tsx";
import Button from "../components/ui/Button.tsx";
import NotFoundPage from "./NotFoundPage.tsx";
import { getSecureInvoiceUrl, getSecureFileUrl } from "../utils/fileUpload.ts";
import { supabase as supabaseClient } from "../utils/supabaseClient.ts";
import {
  ArrowLeft,
  Hourglass,
  ArrowRightLeft,
  PartyPopper,
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
    confirmExchange,
    t,
    notifications,
    markNotificationAsRead,
  } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [device, setDevice] = useState<Device | undefined | null>(undefined);
  const [secureInvoiceUrl, setSecureInvoiceUrl] = useState<string | null>(null);
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(false);
  const [secureFinderPhotoUrls, setSecureFinderPhotoUrls] = useState<string[]>(
    []
  );
  const [isLoadingFinderPhotos, setIsLoadingFinderPhotos] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewInvoiceUrl, setPreviewInvoiceUrl] = useState<string | null>(null);
  const [invoiceFileType, setInvoiceFileType] = useState<'image' | 'pdf' | null>(null);
  const [payment, setPayment] = useState<any | null>(null);
  const [escrow, setEscrow] = useState<any | null>(null);
  const [isLoadingPaymentData, setIsLoadingPaymentData] = useState(false);

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
        setSecureFinderPhotoUrls([]);
        setSecureInvoiceUrl(null);

        // Eğer cihazın ödemesi tamamlandıysa, payment ve escrow bilgilerini çek
        if (foundDevice && (foundDevice.status === DeviceStatus.PAYMENT_COMPLETE || foundDevice.status === 'payment_completed')) {
          console.log("DeviceDetailPage: Ödeme tamamlanmış, payment ve escrow bilgileri çekiliyor");
          setIsLoadingPaymentData(true);
          
          try {
            // Payment bilgilerini çek
            const { data: paymentData, error: paymentError } = await supabaseClient
              .from('payments')
              .select('*')
              .eq('device_id', deviceId)
              .eq('payment_status', 'completed')
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();
            
            if (!paymentError && paymentData) {
              setPayment(paymentData);
              
              // Escrow bilgilerini çek
              const { data: escrowData, error: escrowError } = await supabaseClient
                .from('escrow_accounts')
                .select('*')
                .eq('payment_id', paymentData.id)
                .maybeSingle();
              
              if (!escrowError && escrowData) {
                setEscrow(escrowData);
              } else if (escrowError) {
                console.warn("Escrow kaydı bulunamadı:", escrowError.message);
              }
            } else if (paymentError) {
              console.warn("Payment kaydı bulunamadı:", paymentError.message);
            }
          } catch (error) {
            console.error("Failed to fetch payment/escrow data:", error);
          } finally {
            setIsLoadingPaymentData(false);
          }
        }

        // Generate secure URL for invoice if it exists
        if (foundDevice?.invoice_url) {
          if (
            (foundDevice.device_role === "owner" ||
              (!foundDevice.device_role &&
                foundDevice.status !== DeviceStatus.REPORTED))
          ) {
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
          } else {
            const photoPaths = foundDevice.invoice_url
              .split(",")
              .map((path) => path.trim())
              .filter(Boolean);

            if (photoPaths.length > 0) {
              setIsLoadingFinderPhotos(true);
              try {
                const signedUrls = await Promise.all(
                  photoPaths.map((path) =>
                    getSecureFileUrl(path, "device-pics", 3600)
                  )
                );
                setSecureFinderPhotoUrls(
                  signedUrls.filter(
                    (url): url is string => typeof url === "string"
                  )
                );
              } catch (error) {
                console.error("Failed to generate finder photo URLs:", error);
              } finally {
                setIsLoadingFinderPhotos(false);
              }
            }
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPreviewImage(null);
        setPreviewInvoiceUrl(null);
      }
    };

    if (previewImage || previewInvoiceUrl) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [previewImage, previewInvoiceUrl]);

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

  const deviceRole = device.device_role;
  const isOwnerPerspective =
    deviceRole === "owner" ||
    (!deviceRole && device.status !== DeviceStatus.REPORTED);
  const isFinderPerspective =
    deviceRole === "finder" ||
    (!deviceRole && device.status === DeviceStatus.REPORTED);
  const hasCurrentUserConfirmed = device.exchangeConfirmedBy?.includes(
    currentUser.id
  );
  const finderPhotoUrls =
    device.invoice_url && device.invoice_url.length > 0
      ? device.invoice_url
          .split(",")
          .map((url) => url.trim())
          .filter(Boolean)
      : [];

  console.log("DeviceDetailPage: Device status:", device?.status);
  console.log("DeviceDetailPage: Device rewardAmount:", device?.rewardAmount);
  console.log(
    "DeviceDetailPage: isOwnerPerspective:",
    isOwnerPerspective
  );
  console.log("DeviceDetailPage: Full device object:", device);
  console.log("DeviceDetailPage: DeviceStatus.LOST value:", DeviceStatus.LOST);
  console.log(
    "DeviceDetailPage: Status comparison:",
    device?.status === DeviceStatus.LOST
  );

  const renderContent = () => {
    const renderOwnerMatchView = () => (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto py-12">
          <div className="text-center mb-8">
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Eşleşme Bulundu!
            </h1>
            <p className="text-lg font-semibold text-brand-blue">
              Eşleşme bulundu, ödeme bekleniyor.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Kayıp Cihaz Detayları
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Kayıp Tarihi:</span>
                <span className="font-medium">
                  {device.lost_date
                    ? new Date(device.lost_date).toLocaleDateString("tr-TR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "Belirtilmemiş"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Kayıp Yeri:</span>
                <span className="font-medium">
                  {device.lost_location || "Belirtilmemiş"}
                </span>
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
                <span className="font-medium">
                  {device.description || "Belirtilmemiş"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">
                  Satın Alma Kanıtı (Fatura) Dosyası:
                </span>
                {isLoadingInvoice ? (
                  <div className="flex items-center text-gray-500">
                    <div className="animate-spin w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                    Yükleniyor...
                  </div>
                ) : secureInvoiceUrl || device.invoiceDataUrl ? (
                  <button
                    onClick={() => {
                      const url = secureInvoiceUrl || device.invoiceDataUrl || null;
                      if (url) {
                        // Determine file type from original invoice_url path
                        const isPdf = device?.invoice_url?.toLowerCase().endsWith('.pdf') || 
                                    url.toLowerCase().includes('.pdf');
                        setInvoiceFileType(isPdf ? 'pdf' : 'image');
                        setPreviewInvoiceUrl(url);
                      }
                    }}
                    className="text-blue-600 hover:text-blue-800 font-medium underline cursor-pointer"
                  >
                    Ekli Dosyayı Gör
                  </button>
                ) : (
                  <span className="text-gray-500">Dosya eklenmemiş</span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              İşlem Durumu
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Durum:</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  Kayıtlı {device.serialNumber} seri numaralı {device.model} cihaz
                  için eşleşme bulundu. Ödeme bekleniyor.
                </span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Durum Bilgisi
            </h2>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium text-gray-900">
                    Cihaz için eşleşme bekleniyor
                  </p>
                  <p className="text-gray-600 text-sm">
                    Kayıtlı cihazınız uygun eşleştirme bulunana kadar sistemde
                    bekledi.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div className="flex-1 space-y-2">
                  <p className="font-medium text-gray-900">
                    Cihazınız bulundu
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="text-gray-600 text-sm">
                      Ödemenizi yapmak ve takas sürecini tamamlamak için
                      aşağıdaki butonu kullanabilirsiniz.
                    </p>
                    <Button
                      onClick={() => handlePayment(device.id)}
                      variant="primary"
                      className="sm:ml-4 sm:w-auto w-full"
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
                  <p className="font-medium text-gray-900">
                    Cihazınızın kargo ile teslim edilmesi bekleniyor
                  </p>
                  <p className="text-gray-600 text-sm">
                    Takas süreci başladığında takip numaranız burada yer alacak.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    Cihaz teslim alındığında
                  </p>
                  <p className="text-gray-600 text-sm">
                    Cihazın seri numarasını kontrol ederek teslim aldığınızı
                    onaylayın.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                  5
                </div>
                <div>
                  <p className="font-medium text-gray-900">İşlem tamamlandı</p>
                  <p className="text-gray-600 text-sm">
                    Cihazınıza kavuştuğunuzda ödemeniz emanet hesabından otomatik
                    olarak serbest bırakılacaktır.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                if (
                  confirm(
                    "Bu cihazın kaydını silmek istediğinizden emin misiniz?"
                  )
                ) {
                  console.log("Delete device:", device.id);
                }
              }}
            >
              KAYDI SİL
            </Button>

            <Button
              onClick={() => navigate("/dashboard")}
              variant="primary"
              className="flex-1"
            >
              CİHAZLARIM LİSTESİNE GERİ DÖN
            </Button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Sorularınız için{" "}
              <a
                href="/contact"
                className="text-blue-600 hover:text-blue-800"
              >
                iletişim sayfamızı
              </a>{" "}
              ziyaret edebilirsiniz.
            </p>
          </div>
        </div>
      </div>
    );

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
          "DeviceDetailPage: isOwnerPerspective:",
          isOwnerPerspective
        );

        // Finder perspective - show waiting for payment
        if (!isOwnerPerspective) {
          console.log("DeviceDetailPage: Finder perspective - payment pending");
          return (
            <div className="min-h-screen bg-gray-50">
              <div className="max-w-2xl mx-auto py-12">
                {/* Success Header */}
                <div className="text-center mb-8">
                  <div className="text-green-500 text-6xl mb-4">✅</div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">
                    Eşleşme Bulundu!
                  </h1>
                  <p className="text-lg font-semibold text-brand-blue">
                    Cihaz sahibinin ödeme yapması bekleniyor.
                  </p>
                </div>

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
                      <span className="text-gray-600">Bulunma Tarihi:</span>
                      <span className="font-medium">
                        {device.found_date
                          ? new Date(device.found_date).toLocaleDateString("tr-TR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          : "Belirtilmemiş"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Bulunma Yeri:</span>
                      <span className="font-medium">
                        {device.found_location || "Belirtilmemiş"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Ek Detaylar:</span>
                      <span className="font-medium">{device.description || 'Belirtilmemiş'}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-gray-600">
                        Bulunan Cihaz Fotoğrafı (Ön ve Arka):
                      </span>
                      <div className="mt-2 sm:mt-0 flex-1 sm:text-right">
                        {isLoadingFinderPhotos ? (
                          <div className="inline-flex items-center text-gray-500">
                            <div className="animate-spin w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                            Yükleniyor...
                          </div>
                        ) : secureFinderPhotoUrls.length > 0 ? (
                          <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
                            {secureFinderPhotoUrls.map((url, index) => (
                              <button
                                key={url}
                                type="button"
                                onClick={() => setPreviewImage(url)}
                                className="inline-flex items-center px-3 py-1 bg-brand-blue text-white text-xs rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
                              >
                                Fotoğraf {index + 1}
                              </button>
                            ))}
                          </div>
                        ) : finderPhotoUrls.length > 0 ? (
                          <span className="text-xs text-brand-gray-500">
                            Fotoğraflar kaydedildi ancak görüntüleme bağlantısı oluşturulamadı.
                          </span>
                        ) : (
                          <span className="text-gray-500 text-sm">
                            Fotoğraf eklenmemiş
                          </span>
                        )}
                      </div>
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
                        Kayıtlı {device.serialNumber} seri numaralı {device.model} cihaz için eşleşme bulundu.
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
                      <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Cihaz için eşleşme bekleniyor</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium text-gray-900">Eşleşme bulundu</p>
                        <p className="text-gray-600 text-sm">
                          Cihaz sahibinin ödeme yapması bekleniyor.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium text-gray-900">Cihazın Kargo Firmasına Teslim Edilmesi</p>
                        <p className="text-gray-600 text-sm">
                          Teslim/Takip için kargo numaranız: XXX
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                        4
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900">Cihaz Sahibi Teslim Alındığında</p>
                        <p className="text-gray-600 text-sm">
                          Kargo firması cihazı sahibine teslim etti. Onay bekleniyor.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                        5
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900">İşlem Tamamlandı</p>
                        <p className="text-gray-600 text-sm">
                          Takas tamamlandığında ödülünüz hesabınıza aktarılacak.
                        </p>
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
          "DeviceDetailPage: Showing payment form for PAYMENT_PENDING"
        );
        
        // Owner perspektifi için standart ekran
        return renderOwnerMatchView();

      case DeviceStatus.MATCHED:
        console.log("DeviceDetailPage: MATCHED case executed");
        console.log(
          "DeviceDetailPage: isOwnerPerspective:",
          isOwnerPerspective
        );
        
        // Only show the new design for original owners (who lost the device)
        if (isOwnerPerspective) {
          return renderOwnerMatchView();
        } else {
          console.log("DeviceDetailPage: Showing waiting message for finder");
          // Finder (who reported the device) - show detailed waiting page
          return (
            <div className="min-h-screen bg-gray-50">
              <div className="max-w-2xl mx-auto py-12">
                {/* Success Header */}
                <div className="text-center mb-8">
                  <div className="text-green-500 text-6xl mb-4">✅</div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">
                    Eşleşme Bulundu!
                  </h1>
                  <p className="text-lg font-semibold text-brand-blue">
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
                      <span className="font-medium">
                        {device.found_date
                          ? new Date(device.found_date).toLocaleDateString("tr-TR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          : "Belirtilmemiş"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Bulunma Yeri:</span>
                      <span className="font-medium">
                        {device.found_location || "Belirtilmemiş"}
                      </span>
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

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-gray-600">
                        Bulunan Cihaz Fotoğrafı (Ön ve Arka):
                      </span>
                      <div className="mt-2 sm:mt-0 flex-1 sm:text-right">
                        {isLoadingFinderPhotos ? (
                          <div className="inline-flex items-center text-gray-500">
                            <div className="animate-spin w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                            Yükleniyor...
                          </div>
                        ) : secureFinderPhotoUrls.length > 0 ? (
                          <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
                            {secureFinderPhotoUrls.map((url, index) => (
                              <button
                                key={url}
                                type="button"
                                onClick={() => setPreviewImage(url)}
                                className="inline-flex items-center px-3 py-1 bg-brand-blue text-white text-xs rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
                              >
                                Fotoğraf {index + 1}
                              </button>
                            ))}
                          </div>
                        ) : finderPhotoUrls.length > 0 ? (
                          <span className="text-xs text-brand-gray-500">
                            Fotoğraflar kaydedildi ancak görüntüleme bağlantısı oluşturulamadı.
                          </span>
                        ) : (
                          <span className="text-gray-500 text-sm">
                            Fotoğraf eklenmemiş
                          </span>
                        )}
                      </div>
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
                        Kayıtlı {device.serialNumber} seri numaralı {device.model} cihaz için eşleşme bulundu.
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
                      <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Cihaz için eşleşme bekleniyor</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium text-gray-900">Eşleşme bulundu</p>
                        <p className="text-gray-600 text-sm">
                          Cihaz sahibinin ödeme yapması bekleniyor.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium text-gray-900">Cihazın Kargo Firmasına Teslim Edilmesi</p>
                        <p className="text-gray-600 text-sm">Teslim/Takip için kargo numaranız: XXX</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                        4
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900">Cihaz Sahibi Teslim Alındığında</p>
                        <p className="text-gray-600 text-sm">
                          Kargo firması cihazı sahibine teslim etti. Onay bekleniyor.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                        5
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900">İşlem Tamamlandı</p>
                        <p className="text-gray-600 text-sm">
                          Takas tamamlandığında ödülünüz hesabınıza aktarılacak.
                        </p>
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

      case DeviceStatus.PAYMENT_COMPLETE:
      case 'payment_completed':
        console.log("DeviceDetailPage: PAYMENT_COMPLETE case executed");
        // Sadece owner perspektifi için özel görünüm göster
        if (!isOwnerPerspective) {
          // Finder perspektifi için basit mesaj göster
          return (
            <StatusView
              icon={<Info className="w-10 h-10" />}
              title="Ödeme Tamamlandı"
              description="Cihaz sahibi ödemeyi tamamladı. Kargo sürecine geçiliyor."
            >
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
        }

        // Owner perspektifi için detaylı görünüm
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto py-12">
              {/* Başlık */}
              <div className="text-center mb-8">
                <div className="bg-brand-blue-light text-brand-blue p-4 rounded-full mb-6 inline-flex">
                  <Check className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-bold text-brand-gray-600 mb-2">
                  Ödemeniz Başarıyla Tamamlandı!
                </h1>
                <p className="text-lg text-brand-gray-500">
                  Cihazınızın kargo firmasına teslim edilmesi bekleniliyor.
                </p>
              </div>

              {/* Kayıp Cihaz Detayları Kartı */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Kayıp Cihaz Detayları
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kayıp Tarihi:</span>
                    <span className="font-medium">
                      {device.lost_date
                        ? new Date(device.lost_date).toLocaleDateString("tr-TR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "Belirtilmemiş"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kayıp Yeri:</span>
                    <span className="font-medium">
                      {device.lost_location || "Belirtilmemiş"}
                    </span>
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
                    <span className="font-medium">
                      {device.description || "Belirtilmemiş"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Satın Alma Kanıtı (Fatura) Dosyası:
                    </span>
                    {isLoadingInvoice ? (
                      <div className="flex items-center text-gray-500">
                        <div className="animate-spin w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                        Yükleniyor...
                      </div>
                    ) : secureInvoiceUrl || device.invoiceDataUrl ? (
                      <button
                        onClick={() => {
                          const url = secureInvoiceUrl || device.invoiceDataUrl || null;
                          if (url) {
                            const isPdf = device?.invoice_url?.toLowerCase().endsWith('.pdf') || 
                                        url.toLowerCase().includes('.pdf');
                            setInvoiceFileType(isPdf ? 'pdf' : 'image');
                            setPreviewInvoiceUrl(url);
                          }
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium underline cursor-pointer"
                      >
                        Ekli Dosyayı Gör
                      </button>
                    ) : (
                      <span className="text-gray-500">Dosya eklenmemiş</span>
                    )}
                  </div>
                </div>
              </div>

              {/* İşlem Durumu Kartı */}
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  İşlem Durumu
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Durum:</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                      Kayıtlı {device.serialNumber} seri numaralı {device.model} cihaz ödemesi alındı. Kargo firmasına teslimi bekleniliyor.
                    </span>
                  </div>
                </div>
              </div>

              {/* Ödeme Detayları Kartı */}
              {payment && (
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
                      <span className="font-medium">
                        {payment.total_amount?.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }) || 'N/A'}
                      </span>
                    </div>
                    {payment.reward_amount && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bulan Kişi Ödülü:</span>
                        <span className="font-medium">
                          {payment.reward_amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                        </span>
                      </div>
                    )}
                    {payment.cargo_fee && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Kargo Ücreti:</span>
                        <span className="font-medium">
                          {payment.cargo_fee.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                        </span>
                      </div>
                    )}
                    {payment.service_fee && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hizmet Bedeli:</span>
                        <span className="font-medium">
                          {payment.service_fee.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                        </span>
                      </div>
                    )}
                    {payment.payment_gateway_fee && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gateway Komisyonu:</span>
                        <span className="font-medium">
                          {payment.payment_gateway_fee.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                        </span>
                      </div>
                    )}
                    {payment.net_payout && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Net Ödeme:</span>
                        <span className="font-medium">
                          {payment.net_payout.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ödeme Durumu:</span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                        Tamamlandı
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ödeme Sağlayıcı:</span>
                      <span className="font-medium">{payment.payment_provider || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ödeme Tarihi:</span>
                      <span className="font-medium">
                        {payment.completed_at
                          ? new Date(payment.completed_at).toLocaleDateString("tr-TR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : payment.created_at
                          ? new Date(payment.created_at).toLocaleDateString("tr-TR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Escrow Durumu Kartı */}
              {escrow && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
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
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                        {escrow.status === 'held' ? 'Beklemede' : escrow.status === 'pending' ? 'Beklemede' : escrow.status || 'Beklemede'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Escrow Tutarı:</span>
                      <span className="font-medium">
                        {escrow.total_amount?.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }) || 'N/A'}
                      </span>
                    </div>
                    {escrow.held_at && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tutulma Tarihi:</span>
                        <span className="font-medium">
                          {new Date(escrow.held_at).toLocaleDateString("tr-TR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Durum Bilgisi Kartı */}
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
                      <p className="font-medium text-gray-900">
                        Cihaz için eşleşme bekleniyor
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        Cihazınız bulundu
                      </p>
                      <p className="text-gray-600 text-sm">
                        Ödemenizi yapmak ve takas sürecini tamamlamak için "Ödemeyi güvenle yap" Butonu
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        Cihazınızın kargo ile teslim edilmesi bekleniyor
                      </p>
                      <p className="text-gray-600 text-sm">
                        Kargoya verildiğinde takip numaranız burada görünecektir.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        Cihaz Teslim Alındığında
                      </p>
                      <p className="text-gray-600 text-sm">
                        Cihazın seri numarasını kontrol edip teslim aldığınızı onaylayın "Onay Butonu"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      5
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">İşlem Tamamlandı</p>
                      <p className="text-gray-600 text-sm">
                        Cihazınıza kavuştuğunuz için mutluyuz.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button
                  onClick={() => navigate("/dashboard")}
                  variant="primary"
                  className="flex-1"
                >
                  CİHAZLARIM LİSTESİNE GERİ DÖN
                </Button>
              </div>

              {/* Contact Info */}
              <div className="mt-8 text-center">
                <p className="text-gray-600 text-sm">
                  Sorularınız için{" "}
                  <a
                    href="/contact"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    iletişim sayfamızı
                  </a>{" "}
                  ziyaret edebilirsiniz.
                </p>
              </div>
            </div>
          </div>
        );

      case DeviceStatus.EXCHANGE_PENDING:
        return (
          <StatusView
            icon={<ArrowRightLeft className="w-10 h-10" />}
            title={t("paymentReceived")}
            description={
              isOwnerPerspective
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
            {!isOwnerPerspective && (
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
                      <button
                        onClick={() => {
                          const url = secureInvoiceUrl || device.invoiceDataUrl || null;
                          if (url) {
                            // Determine file type from original invoice_url path
                            const isPdf = device?.invoice_url?.toLowerCase().endsWith('.pdf') || 
                                        url.toLowerCase().includes('.pdf');
                            setInvoiceFileType(isPdf ? 'pdf' : 'image');
                            setPreviewInvoiceUrl(url);
                          }
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium underline cursor-pointer"
                      >
                        Ekli Dosyayı Gör
                      </button>
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
                    <div className="flex-1 space-y-1">
                      <p className="font-medium text-gray-900">Cihaz için eşleşme bekleniyor</p>
                      <p className="text-gray-600 text-sm">
                        Sistemde kayıtlı kayıp cihazlarla eşleşme aranıyor. Eşleşme bulunduğunda bildirim alacaksınız.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium text-gray-900">Eşleşme bulundu</p>
                      <p className="text-gray-600 text-sm">
                        Cihaz sahibinin ödeme yapması bekleniyor. Ödeme tamamlandığında e-posta ve bildirim alacaksınız.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium text-gray-900">Cihazın Kargo Firmasına Teslim Edilmesi</p>
                      <p className="text-gray-600 text-sm">
                        Teslim/Takip için kargo numaranız burada görünecek.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium text-gray-900">Cihaz Sahibi Teslim Alındığında</p>
                      <p className="text-gray-600 text-sm">
                        Kargo firması cihazı sahibine teslim ettiğinde onay bekleniyor.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                      5
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">İşlem Tamamlandı</p>
                      <p className="text-gray-600 text-sm">
                        Takas tamamlandığında ödülünüz hesabınıza aktarılacak.
                      </p>
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
        if (!isFinderPerspective) {
          return (
            <StatusView
              icon={<Info className="w-10 h-10" />}
              title={t("Lost")}
              description="Cihaz kaydı sistemde bulunuyor. Eşleşme sağlandığında bilgilendirileceksiniz."
            >
              <div className="mt-6 text-sm text-brand-gray-500">
                Mevcut kayıt cihaz sahibi perspektifinde görüntüleniyor. Finder akışı bu kayıt için uygulanmıyor.
              </div>
            </StatusView>
          );
        }
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
                    <span className="text-gray-600">Bulunan Tarih:</span>
                    <span className="font-medium">
                      {device.found_date
                        ? new Date(device.found_date).toLocaleDateString(
                            "tr-TR",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )
                        : "Belirtilmemiş"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Bulunan Yer:</span>
                    <span className="font-medium">
                      {device.found_location || "Belirtilmemiş"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ek Detaylar:</span>
                    <span className="font-medium">{device.description || 'Belirtilmemiş'}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-gray-600">
                      Bulunan Cihaz Fotoğrafı (Ön ve Arka):
                    </span>
                    <div className="mt-2 sm:mt-0 flex-1 sm:text-right">
                      {isLoadingFinderPhotos ? (
                        <div className="inline-flex items-center text-gray-500">
                          <div className="animate-spin w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                          Yükleniyor...
                        </div>
                      ) : secureFinderPhotoUrls.length > 0 ? (
                        <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
                          {secureFinderPhotoUrls.map((url, index) => (
                            <button
                              key={url}
                              type="button"
                              onClick={() => setPreviewImage(url)}
                              className="inline-flex items-center px-3 py-1 bg-brand-blue text-white text-xs rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
                            >
                              Fotoğraf {index + 1}
                            </button>
                          ))}
                        </div>
                      ) : finderPhotoUrls.length > 0 ? (
                        <span className="text-xs text-brand-gray-500">
                          Fotoğraflar kaydedildi ancak görüntüleme bağlantısı oluşturulamadı.
                        </span>
                      ) : (
                        <span className="text-gray-500 text-sm">Fotoğraf eklenmemiş</span>
                      )}
                    </div>
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
                      <p className="font-medium text-gray-900 mb-1">Cihaz için eşleşme bekleniyor</p>
                      <p className="text-gray-600 text-sm">Sistemde kayıtlı kayıp cihazlarla eşleşme aranıyor.</p>
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
                    <div>
                      <p className="font-medium text-gray-900">Cihaz Sahibi Teslim Alındığında</p>
                      <p className="text-gray-600 text-sm">Kargo firması cihazı sahibine teslim ettiğinde onay bekleniyor.</p>
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

              <div className="bg-white border border-brand-gray-200 rounded-lg p-6 mb-6">
                <div className="text-3xl mb-4">🎁</div>
                <h3 className="text-lg font-semibold text-brand-gray-700 mb-2">
                  ÇOK TEŞEKKÜR EDERİZ!
                </h3>
                <p className="text-brand-gray-600 text-sm leading-relaxed mb-3">
                  iFoundAnApple olarak, dürüstlüğünüzü ve yardımseverliğinizi yürekten takdir eder, bu nazik davranışınız için teşekkür ederiz! Değerli eşyaların sahiplerine ulaşması için şeffaf ve güvenilir bir platform sunmaya özen gösteriyoruz. Senin gibi insanların varlığı, dünyayı daha iyi bir yer yapıyor.
                </p>
                <p className="text-brand-gray-600 text-sm leading-relaxed">
                  Bulduğunuz cihaz sahibine teslim edildiğinde, gösterdiğiniz çaba ve örnek davranış karşılığında küçük bir hediye almanızı sağlıyoruz.
                  <br />
                  <span className="font-semibold text-brand-blue">
                    💡 Önemli:
                  </span>{" "}
                  Cihaz eşleşmesi gerçekleştiği zaman lütfen kimlik ve IBAN bilgilerinizin doğruluğunu profil sayfasından kontrol ediniz.
                </p>
              </div>

              {/* Ödül Bilgisi */}
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

      default: // Other statuses
        console.log(
          "DeviceDetailPage: Default case executed - status not matched:",
          device.status
        );
        return (
          <StatusView
            icon={<Info className="w-10 h-10" />}
            title={isOwnerPerspective ? t("Lost") : t("Reported")}
            description="The device is registered in the system. We will notify you when a match is found."
          >
            {isOwnerPerspective &&
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
    <>
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

      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Fotoğrafı kapat"
              className="absolute -top-4 right-0 text-white bg-black/60 rounded-full p-2 hover:bg-black focus:outline-none focus:ring-2 focus:ring-white"
              onClick={() => setPreviewImage(null)}
            >
              ✕
            </button>
            <img
              src={previewImage}
              alt="Bulunan cihaz fotoğrafı"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {previewInvoiceUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          onClick={() => {
            setPreviewInvoiceUrl(null);
            setInvoiceFileType(null);
          }}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full h-full"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Dosyayı kapat"
              className="absolute -top-4 right-0 z-10 text-white bg-black/60 rounded-full p-2 hover:bg-black focus:outline-none focus:ring-2 focus:ring-white"
              onClick={() => {
                setPreviewInvoiceUrl(null);
                setInvoiceFileType(null);
              }}
            >
              ✕
            </button>
            {invoiceFileType === 'pdf' ? (
              <iframe
                src={previewInvoiceUrl}
                className="w-full h-full rounded-lg bg-white"
                title="Satın alma kanıtı dosyası"
              />
            ) : (
              <img
                src={previewInvoiceUrl}
                alt="Satın alma kanıtı dosyası"
                className="w-full h-full object-contain rounded-lg bg-white"
                onError={(e) => {
                  // If image fails to load, try as PDF
                  setInvoiceFileType('pdf');
                }}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DeviceDetailPage;
