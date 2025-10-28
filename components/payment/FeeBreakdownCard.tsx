import React from 'react';
import { useAppContext } from '../../contexts/AppContext.tsx';

export interface FeeBreakdown {
  rewardAmount: number;
  cargoFee: number;
  serviceFee: number;
  gatewayFee: number;
  totalAmount: number;
  netPayout: number;
  originalRepairPrice: number;
  deviceModel: string;
  category: string;
}

interface FeeBreakdownCardProps {
  fees: FeeBreakdown;
  showDetailedBreakdown?: boolean;
  className?: string;
}

const FeeBreakdownCard: React.FC<FeeBreakdownCardProps> = ({
  fees,
  showDetailedBreakdown = true,
  className = ""
}) => {
  const { t } = useAppContext();
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2
    }).format(price);
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold text-lg">{t('feeDetails')}</h3>
            <p className="text-blue-100 text-sm">{fees.deviceModel}</p>
          </div>
          <div className="text-right">
            <p className="text-white text-xs opacity-75">{t('category')}</p>
            <span className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-xs font-medium">
              {fees.category}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Device Info */}
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-green-900">{t('matchedDevice')}</p>
                <p className="text-xs text-green-700">{t('matchedWithFinder')}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-green-900">{fees.deviceModel}</p>
              <p className="text-xs text-green-700">{fees.category}</p>
            </div>
          </div>
        </div>

        {/* Fee Breakdown */}
        {showDetailedBreakdown && (
          <div className="space-y-4 mb-6">
            <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">
              {t('ifoundanappleFeeBreakdown')}
            </h4>
            
            {/* Reward Amount */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{t('finderReward')}</p>
                  <p className="text-xs text-gray-500">{t('finderRewardDesc')}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-green-600">
                {formatPrice(fees.rewardAmount)}
              </span>
            </div>

            {/* Cargo Fee */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{t('cargoLabel').replace(':', '')}</p>
                  <p className="text-xs text-gray-500">{t('cargoFeeDesc')}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-blue-600">
                {formatPrice(fees.cargoFee)}
              </span>
            </div>

            {/* Service Fee */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{t('serviceFeeLabel').replace(':', '')}</p>
                  <p className="text-xs text-gray-500">{t('serviceFeeDesc')}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-purple-600">
                {formatPrice(fees.serviceFee)}
              </span>
            </div>

            {/* Gateway Fee */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{t('gatewayFeeLabel').replace(':', '')}</p>
                  <p className="text-xs text-gray-500">{t('paymentCommissionDesc')}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-orange-600">
                {formatPrice(fees.gatewayFee)}
              </span>
            </div>
          </div>
        )}

        {/* Total Amount */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-lg font-bold text-gray-900">{t('totalPayment')}</p>
              <p className="text-sm text-gray-500">{t('paymentDue')}</p>
            </div>
            <span className="text-2xl font-bold text-red-600">
              {formatPrice(fees.totalAmount)}
            </span>
          </div>

        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">{t('securePaymentSystem')}</p>
              <p className="text-xs text-blue-700 leading-relaxed">
                {t('escrowSystemDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeBreakdownCard;