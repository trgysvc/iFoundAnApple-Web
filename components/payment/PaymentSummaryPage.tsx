import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FeeBreakdownCard, { FeeBreakdown } from './FeeBreakdownCard';
import PaymentMethodSelector, { PaymentProvider } from './PaymentMethodSelector.tsx';
import { calculateFeesByModelName } from '../../utils/feeCalculation';
import { initiatePayment } from '../../utils/paymentGateway';
import { useAppContext } from '../../contexts/AppContext.tsx';

interface PaymentSummaryPageProps {
  deviceId?: string;
  deviceModel?: string;
  customRewardAmount?: number;
}

const PaymentSummaryPage: React.FC<PaymentSummaryPageProps> = ({
  deviceId,
  deviceModel,
  customRewardAmount
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, showNotification, t } = useAppContext();
  
  // URL'den parametreleri al
  const queryParams = new URLSearchParams(location.search);
  const urlDeviceId = queryParams.get('deviceId') || '';
  const urlDeviceModel = queryParams.get('deviceModel') || '';
  const urlCustomReward = queryParams.get('customReward') ? Number(queryParams.get('customReward')) : undefined;
  
  // State management
  const [fees, setFees] = useState<FeeBreakdown | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentProvider>('paynet');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreementAccepted, setAgreementAccepted] = useState(false);

  // Use props or URL parameters
  const finalDeviceId = deviceId || urlDeviceId;
  const finalDeviceModel = deviceModel || urlDeviceModel;
  const finalCustomReward = customRewardAmount || urlCustomReward;

  // Load fee calculation on component mount
  useEffect(() => {
    if (finalDeviceModel) {
      loadFeeCalculation();
    } else {
      setError(t('deviceModelNotSpecified'));
      setLoading(false);
    }
  }, [finalDeviceModel, finalCustomReward]);

  const loadFeeCalculation = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await calculateFeesByModelName(finalDeviceModel, finalCustomReward);
      
      if (result.success && result.fees) {
        setFees(result.fees);
      } else {
        setError(result.error || t('feeCalculationFailed'));
      }
    } catch (err) {
      console.error('Fee calculation error:', err);
      setError(t('feeCalculationError'));
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!currentUser) {
      showNotification(t('paymentLoginRequired'), 'error');
      navigate('/login');
      return;
    }

    if (!fees || !finalDeviceId) {
      showNotification(t('missingPaymentInfo'), 'error');
      return;
    }

    if (!agreementAccepted) {
      showNotification(t('acceptTermsRequired'), 'error');
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      // Mock user info - in real app, get from user profile
      const paymentRequest = {
        deviceId: finalDeviceId,
        payerId: currentUser.id,
        receiverId: undefined, // Will be set when device is matched
        feeBreakdown: {
          rewardAmount: fees.rewardAmount,
          cargoFee: fees.cargoFee,
          serviceFee: fees.serviceFee,
          gatewayFee: fees.gatewayFee,
          totalAmount: fees.totalAmount,
          netPayout: fees.netPayout,
          originalRepairPrice: fees.originalRepairPrice,
          deviceModel: fees.deviceModel,
          category: fees.category
        },
        deviceInfo: {
          model: fees.deviceModel,
          serialNumber: 'PENDING', // Will be updated when device is found
          description: `Payment for ${fees.deviceModel} device recovery`
        },
        payerInfo: {
          name: currentUser.email, // Should come from user profile
          email: currentUser.email,
          phone: '5555555555', // Should come from user profile
          address: {
            street: 'Mock Street 123',
            city: 'İstanbul',
            district: 'Kadıköy',
            postalCode: '34000'
          }
        },
        paymentProvider: selectedPaymentMethod
      };

      const result = await initiatePayment(paymentRequest, selectedPaymentMethod);

      if (result.success) {
        showNotification(t('paymentInitiated'), 'success');
        
        // Redirect to payment gateway if there's a redirect URL
        if (result.redirectUrl) {
          window.location.href = result.redirectUrl;
        } else {
          // Redirect to success page
          navigate(`/payment/success?paymentId=${result.paymentId}`);
        }
      } else {
        setError(result.errorMessage || t('paymentFailed'));
        showNotification(t('paymentFailed'), 'error');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(t('paymentError'));
      showNotification(t('paymentFailed'), 'error');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('calculatingFees')}</p>
        </div>
      </div>
    );
  }

  if (error && !fees) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('errorOccurred')}</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('goBack')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('paymentSummary')}</h1>
              <p className="text-gray-600 mt-1">{t('paymentSummarySubtitle')}</p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
              </svg>
              {t('goBack')}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Fee Breakdown */}
          <div>
            {fees && <FeeBreakdownCard fees={fees} />}
          </div>

          {/* Right Column - Payment Method & Checkout */}
          <div className="space-y-6">
            {/* Payment Method Selector */}
            <PaymentMethodSelector
              selectedMethod={selectedPaymentMethod}
              onMethodChange={setSelectedPaymentMethod}
            />

            {/* Agreement & Checkout */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('paymentConfirmation')}</h3>
              
              {/* Terms Agreement */}
              <div className="mb-6">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={agreementAccepted}
                    onChange={(e) => setAgreementAccepted(e.target.checked)}
                    className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700 leading-relaxed">
                    {t('termsAgreement')}
                  </span>
                </label>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={!agreementAccepted || processing}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
                  agreementAccepted && !processing
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {processing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    {t('paymentProcessing')}
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                    </svg>
                    {t('securePayment')}
                    {fees && (
                      <span className="ml-2 font-bold">
                        {new Intl.NumberFormat('tr-TR', {
                          style: 'currency',
                          currency: 'TRY'
                        }).format(fees.totalAmount)}
                      </span>
                    )}
                  </div>
                )}
              </button>

              {/* Security Notice */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500 leading-relaxed">
                  {t('paymentSecurityNotice')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummaryPage;