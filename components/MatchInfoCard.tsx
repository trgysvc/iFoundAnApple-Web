import React, { useState, useEffect } from 'react';
import { calculateFeesByModelName, FeeBreakdown } from '../utils/feeCalculation';

interface MatchInfoCardProps {
  deviceModel: string;
  matchStatus: string;
  className?: string;
}

const MatchInfoCard: React.FC<MatchInfoCardProps> = ({
  deviceModel,
  matchStatus,
  className = ""
}) => {
  const [feeBreakdown, setFeeBreakdown] = useState<FeeBreakdown | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeeBreakdown = async () => {
      if (!deviceModel) return;
      
      setLoading(true);
      try {
        const result = await calculateFeesByModelName(deviceModel);
        if (result.success && result.fees) {
          setFeeBreakdown(result.fees);
        }
      } catch (error) {
        console.error('Fee calculation error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeeBreakdown();
  }, [deviceModel]);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Eşleşme Bilgileri</h3>
      
      <div className="space-y-4">
        {/* Cihaz Modeli */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Cihaz Modeli:</span>
          <span className="font-medium text-gray-900">{deviceModel}</span>
        </div>

        {/* Bulan Kişiye Ödül */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Bulan Kişiye Ödül:</span>
          <span className="font-bold text-green-600">
            {loading ? 'Hesaplanıyor...' : 
             feeBreakdown ? formatPrice(feeBreakdown.rewardAmount) : '500 TL'}
          </span>
        </div>

        {/* Durum */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Durum:</span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            matchStatus === 'Eşleşme Bulundu' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {matchStatus}
          </span>
        </div>
      </div>

      {/* Ücret Detayları */}
      {feeBreakdown && !loading && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Ücret Dağılımı</h4>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>• Kargo Ücreti:</span>
              <span>{formatPrice(feeBreakdown.cargoFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>• Hizmet Bedeli (%20):</span>
              <span>{formatPrice(feeBreakdown.serviceFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>• Ödeme Komisyonu (%5.5):</span>
              <span>{formatPrice(feeBreakdown.gatewayFee)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t font-medium text-gray-900">
              <span>Toplam Ödeme:</span>
              <span className="text-red-600">{formatPrice(feeBreakdown.totalAmount)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchInfoCard;
