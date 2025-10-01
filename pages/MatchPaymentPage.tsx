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

  const finalDeviceId = deviceId || urlDeviceId;
  const finalDeviceModel = deviceModel || urlDeviceModel;

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
      };

      const result = await initiatePayment(
        paymentRequest,
        selectedPaymentMethod
      );

      if (result.success) {
        showNotification(t("paymentInitiated"), "success");

        if (result.redirectUrl) {
          window.location.href = result.redirectUrl;
        } else {
          navigate(`/payment/success?paymentId=${result.paymentId}`);
        }
      } else {
        setError(result.errorMessage || t("paymentFailed"));
        showNotification(t("paymentFailed"), "error");
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
                {/* Match Info */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {t("matchInfo")}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {t("deviceModelLabel")}
                      </span>
                      <span className="font-medium">{finalDeviceModel}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {t("finderReward")}
                      </span>
                      <span className="font-medium text-green-600">500 TL</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {t("statusLabel")}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {t("matchFound")}
                      </span>
                    </div>
                  </div>
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
                    {t("paymentConfirmation")}
                  </h3>

                  <div className="mb-6">
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        checked={agreementAccepted}
                        onChange={(e) => setAgreementAccepted(e.target.checked)}
                        className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700 leading-relaxed">
                        {t("termsAgreement")}
                      </span>
                    </label>
                  </div>

                  {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-red-500 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <p className="text-sm text-red-700">{error}</p>
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
