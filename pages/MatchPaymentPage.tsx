import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext.tsx";
import FeeBreakdownCard, {
  FeeBreakdown,
} from "../components/payment/FeeBreakdownCard.tsx";
import PaymentMethodSelector, {
  PaymentProvider,
} from "../components/payment/PaymentMethodSelector.tsx";
import { calculateFeesByModelName } from "../utils/feeCalculation.ts";
import { initiatePayment, PaymentRequest } from "../utils/paymentGateway.ts";
import { supabase } from "../utils/supabaseClient.ts";
import { Device } from "../types.ts";

interface MatchPaymentPageProps {
  deviceId?: string;
  deviceModel?: string;
}

const MatchPaymentPage: React.FC<MatchPaymentPageProps> = ({
  deviceId,
  deviceModel,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, showNotification, t } = useAppContext();

  // URL'den parametreleri al
  const queryParams = new URLSearchParams(location.search);
  const urlDeviceId = queryParams.get("deviceId") || "";
  const urlDeviceModel = queryParams.get("deviceModel") || "";

  // State management
  const [step, setStep] = useState<"fees" | "payment">("fees");
  const [fees, setFees] = useState<FeeBreakdown | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentProvider>("iyzico");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [device, setDevice] = useState<Device | null>(null);
  const [loadingDevice, setLoadingDevice] = useState(true);

  const finalDeviceId = deviceId || urlDeviceId;
  const finalDeviceModel = deviceModel || urlDeviceModel;

  // Fetch device details
  useEffect(() => {
    const fetchDevice = async () => {
      if (!finalDeviceId) {
        setLoadingDevice(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("devices")
          .select("*")
          .eq("id", finalDeviceId)
          .single();

        if (error) {
          console.error("Error fetching device:", error);
        } else {
          setDevice(data);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoadingDevice(false);
      }
    };

    fetchDevice();
  }, [finalDeviceId]);

  // Auto-calculate fees when component mounts
  useEffect(() => {
    if (finalDeviceModel) {
      calculateFees();
    } else {
      setError(t("deviceModelNotSpecified"));
      setLoading(false);
    }
  }, [finalDeviceModel]);

  const calculateFees = async () => {
    if (!finalDeviceModel) return;

    try {
      setLoading(true);
      setError(null);

      const result = await calculateFeesByModelName(finalDeviceModel);

      if (result.success && result.fees) {
        setFees(result.fees);
      } else {
        setError(result.error || t("feeCalculationFailed"));
      }
    } catch (err) {
      console.error("Fee calculation error:", err);
      setError(t("feeCalculationError"));
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToPayment = () => {
    if (!fees) {
      setError(t("feeCalculationFailed"));
      return;
    }
    setStep("payment");
  };

  const handlePayment = async () => {
    if (!currentUser) {
      showNotification(t("paymentLoginRequired"), "error");
      navigate("/login");
      return;
    }

    if (!fees || !finalDeviceId || !finalDeviceModel) {
      showNotification(t("missingPaymentInfo"), "error");
      return;
    }

    if (!agreementAccepted) {
      showNotification(t("acceptTermsRequired"), "error");
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      const paymentRequest: PaymentRequest = {
        deviceId: finalDeviceId,
        payerId: currentUser.id,
        receiverId: undefined,
        feeBreakdown: fees,
        deviceInfo: {
          model: finalDeviceModel,
          serialNumber: "PENDING", // Will be updated when device is found
          description: `Payment for ${finalDeviceModel} device recovery`,
        },
        payerInfo: {
          name: currentUser.email, // Should come from user profile
          email: currentUser.email,
          phone: "5555555555", // Should come from user profile
          address: {
            street: "Mock Street 123",
            city: "İstanbul",
            district: "Kadıköy",
            postalCode: "34000",
          },
        },
        paymentProvider: selectedPaymentMethod,
      };

      const result = await initiatePayment(
        paymentRequest,
        selectedPaymentMethod
      );

      // Ödeme durumuna göre yönlendirme
      if (result.success) {
        if (result.status === 'completed') {
          // Ödeme başarıyla tamamlandı - DeviceDetailPage'e yönlendir
          showNotification(t("paymentInitiated"), "success");
          navigate(`/device/${finalDeviceId}`);
        } else if (result.status === 'processing' && result.redirectUrl) {
          // 3D Secure veya ödeme sayfasına yönlendir
          console.log('[PAYMENT] 3D Secure/Ödeme sayfasına yönlendiriliyor:', result.redirectUrl);
          showNotification('Ödeme sayfasına yönlendiriliyorsunuz...', "info");
          window.location.href = result.redirectUrl;
        } else {
          // Beklenmeyen durum
          setError('⏳ Ödeme işlemi devam ediyor. Lütfen bekleyin...');
          showNotification('Ödeme işlemi devam ediyor...', "info");
        }
      } else {
        // Ödeme başarısız
        const errorMsg = result.errorMessage || '❌ Ödeme işlemi başarısız oldu. Lütfen tekrar deneyin.';
        
        setError(errorMsg);
        showNotification(errorMsg, "error");
        console.log('[PAYMENT] Ödeme başarısız:', { status: result.status, error: errorMsg });
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(t("paymentError"));
      showNotification(t("paymentFailed"), "error");
    } finally {
      setProcessing(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {/* Step 1 */}
        <div
          className={`flex items-center ${
            step === "fees"
              ? "text-blue-600"
              : step === "payment"
              ? "text-green-600"
              : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
              step === "fees"
                ? "bg-blue-600 text-white"
                : step === "payment"
                ? "bg-green-600 text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            {step === "payment" ? "✓" : "1"}
          </div>
          <span className="ml-2 font-medium">{t("feeDetails")}</span>
        </div>

        <div className="w-8 h-0.5 bg-gray-300"></div>

        {/* Step 2 */}
        <div
          className={`flex items-center ${
            step === "payment" ? "text-blue-600" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
              step === "payment"
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            2
          </div>
          <span className="ml-2 font-medium">{t("payment")}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t("matchPayment")}
              </h1>
              <p className="text-gray-600 mt-1">{t("matchPaymentSubtitle")}</p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              {t("goBack")}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {renderStepIndicator()}

        {/* Step 1: Fee Breakdown */}
        {step === "fees" && (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Fee Breakdown */}
              <div>
                {loading ? (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">{t("calculatingFees")}</p>
                  </div>
                ) : fees ? (
                  <FeeBreakdownCard fees={fees} />
                ) : error ? (
                  <div className="bg-white rounded-xl shadow-lg border border-red-200 p-8 text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-6 h-6 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                      onClick={calculateFees}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      {t("tryAgain")}
                    </button>
                  </div>
                ) : null}
              </div>

              {/* Actions */}
              <div className="space-y-6">
                {/* Kayıp Cihaz Detayları */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Kayıp Cihaz Detayları
                  </h3>
                  {loadingDevice ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                  ) : device ? (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Kayıp Tarihi:</span>
                        <span className="font-medium text-sm">
                          {device.lost_date ? new Date(device.lost_date).toLocaleDateString('tr-TR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          }) : 'Belirtilmemiş'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Kayıp Yeri:</span>
                        <span className="font-medium text-sm">{device.lost_location || 'Belirtilmemiş'}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Cihaz Modeli:</span>
                        <span className="font-medium text-sm">{device.model}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Cihaz Seri Numarası:</span>
                        <span className="font-mono text-xs">Gizli bilgi</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Cihaz Rengi:</span>
                        <span className="font-medium text-sm">{device.color}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Ek Detaylar:</span>
                        <span className="font-medium text-sm">{device.description || 'Belirtilmemiş'}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Cihaz bilgisi yüklenemedi</p>
                  )}
                </div>

                {/* Actions */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                  <div className="space-y-4">
                    <button
                      onClick={handleProceedToPayment}
                      disabled={!fees}
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                        fees
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {t("proceedToPayment")}
                    </button>
                  </div>
                </div>

                {/* Güvenli Ödeme Sistemi Açıklaması */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
                  <div className="text-center mb-4">
                    <svg className="w-12 h-12 mx-auto text-blue-600 mb-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <h4 className="text-base font-bold text-gray-800">
                      iFoundAnApple'da ödeme sürecin tamamen güvenliğinizi düşünerek tasarlandı.
                    </h4>
                  </div>

                  <div className="space-y-4 text-sm text-gray-700">
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-1 flex items-start">
                        <span className="text-blue-600 mr-2">🔒</span>
                        Güvenli Emanet (Escrow) Sistemi:
                      </h5>
                      <p className="leading-relaxed ml-6">
                        Ödemeniz, doğrudan cihaz sahibine veya bulan kişiye iletilmez. Takas süreci tamamlanana kadar 
                        güvenli emanet (escrow) hesabımızda tutulur. Cihazınız size ulaşmadan ve takas işlemini 
                        onaylamadan hiçbir ödeme karşı tarafa aktarılmaz.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-800 mb-1 flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        Ödeme Altyapısı Güvencesiyle:
                      </h5>
                      <p className="leading-relaxed ml-6">
                        Tüm finansal işlemleriniz Türkiye'nin önde gelen güvenli 
                        ödeme sistemlerinden PAYNET güvencesi altındadır. Kart 
                        bilgileriniz ve ödeme detaylarınız PAYNET'in yüksek 
                        güvenlik standartları ile korunmaktadır.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-800 mb-1 flex items-start">
                        <span className="text-purple-600 mr-2">⚖️</span>
                        İptal Hakkınız Saklıdır:
                      </h5>
                      <p className="leading-relaxed ml-6">
                        Takas süreci başlamadan veya cihaz size ulaşmadan önce herhangi bir nedenle işlemden vazgeçmeniz 
                        durumunda, ödemeyi iptal etme hakkınız bulunmaktadır.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-800 mb-1 flex items-start">
                        <span className="text-orange-600 mr-2">↩️</span>
                        Şeffaf İade Politikası:
                      </h5>
                      <p className="leading-relaxed ml-6">
                        İşlem iptali talep etmeniz halinde, ödediğiniz tüm ücret anında tarafınıza iade edilecektir.
                      </p>
                    </div>

                    <div className="pt-3 border-t border-blue-200">
                      <p className="leading-relaxed text-center italic font-medium text-gray-800">
                        iFoundAnApple olarak amacımız, kayıp eşyaların güvenli, şeffaf ve sorunsuz bir şekilde 
                        sahipleriyle buluşmasını sağlamaktır. Ödemenizi güvenle tamamlayabilirsiniz.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === "payment" && fees && (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Payment Method */}
              <div>
                <PaymentMethodSelector
                  selectedMethod={selectedPaymentMethod}
                  onMethodChange={setSelectedPaymentMethod}
                />
              </div>

              {/* Final Summary & Checkout */}
              <div className="space-y-6">
                {/* Quick Fee Summary */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {t("paymentSummary")}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t("deviceModel")}:</span>
                      <span className="font-medium">{fees.deviceModel}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {t("finderRewardLabel")}
                      </span>
                      <span className="font-medium">
                        {fees.rewardAmount.toFixed(2)} TL
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t("cargoLabel")}</span>
                      <span className="font-medium">
                        {fees.cargoFee.toFixed(2)} TL
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {t("serviceFeeLabel")}:
                      </span>
                      <span className="font-medium">
                        {fees.serviceFee.toFixed(2)} TL
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {t("gatewayFeeLabel")}:
                      </span>
                      <span className="font-medium">
                        {fees.gatewayFee.toFixed(2)} TL
                      </span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">
                          {t("totalLabel")}
                        </span>
                        <span className="font-bold text-xl text-red-600">
                          {fees.totalAmount.toFixed(2)} TL
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Agreement & Checkout */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Ödeme Onayı
                  </h3>

                  <div className="mb-6">
                    <label className="flex items-start cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={agreementAccepted}
                        onChange={(e) => setAgreementAccepted(e.target.checked)}
                        className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                      />
                      <span className="text-sm text-gray-700 leading-relaxed">
                        Kullanım Koşulları ve Gizlilik Politikası'nı okudum ve kabul ediyorum. Ödememin güvenli escrow sisteminde tutulacağını ve cihaz tarafıma teslim edildikten sonra alınacağını anlıyorum.
                      </span>
                    </label>
                  </div>

                  {error && (
                    <div className="mb-6 p-5 bg-red-50 border-2 border-red-300 rounded-xl shadow-sm animate-shake">
                      <div className="flex items-start">
                        <svg
                          className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div className="flex-1">
                          <h4 className="text-base font-semibold text-red-800 mb-1">
                            ⚠️ Ödeme Başarısız
                          </h4>
                          <p className="text-sm text-red-700 leading-relaxed">{error}</p>
                        </div>
                        <button
                          onClick={() => setError(null)}
                          className="ml-2 text-red-400 hover:text-red-600 transition-colors"
                          aria-label="Kapat"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <button
                      onClick={() => setStep("fees")}
                      className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                    >
                      {t("backToFeeDetails")}
                    </button>

                    <button
                      onClick={handlePayment}
                      disabled={!agreementAccepted || processing}
                      className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
                        agreementAccepted && !processing
                          ? "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {processing ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          {t("paymentProcessing")}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {t("securePayment")} ({fees.totalAmount.toFixed(2)}{" "}
                          TL)
                        </div>
                      )}
                    </button>
                  </div>

                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {t("paymentSecurityNotice")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchPaymentPage;
