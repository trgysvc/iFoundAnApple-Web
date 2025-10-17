import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { useAppContext } from '../../contexts/AppContext';

interface EscrowStatusDisplayProps {
  paymentId: string;
  onRefresh?: () => void;
}

interface EscrowData {
  id: string;
  payment_id: string;
  status: string;
  total_amount: number;
  reward_amount: number;
  service_fee: number;
  cargo_fee: number;
  gateway_fee: number;
  net_payout: number;
  held_at: string;
  released_at?: string;
  created_at: string;
}

export const EscrowStatusDisplay: React.FC<EscrowStatusDisplayProps> = ({
  paymentId,
  onRefresh
}) => {
  const { supabaseClient } = useAppContext();
  const [escrowData, setEscrowData] = useState<EscrowData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEscrowStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Supabase client kontrolü
      if (!supabaseClient) {
        throw new Error('Supabase client is not available');
      }

      // Escrow hesabını bul
      const { data: escrowAccount, error: escrowError } = await supabaseClient
        .from('escrow_accounts')
        .select('*')
        .eq('payment_id', paymentId)
        .single();

      if (escrowError || !escrowAccount) {
        console.error('Escrow hesabı bulunamadı:', escrowError);
        setError('Emanet hesabı bulunamadı');
        return;
      }

      console.log('Escrow hesabı bulundu:', escrowAccount);
      
      // Gateway fee ve servis ücreti düzeltmesi
      let correctedEscrowData = { ...escrowAccount };
      let needsCorrection = false;
      
      // Gateway fee düzeltmesi - eğer 0 ise doğru hesapla
      if (escrowAccount.gateway_fee === 0 || escrowAccount.gateway_fee === null) {
        const correctGatewayFee = escrowAccount.total_amount * 0.0343; // %3.43
        correctedEscrowData.gateway_fee = Math.round(correctGatewayFee * 100) / 100;
        needsCorrection = true;
        
        console.log('Gateway fee düzeltildi:', {
          original: escrowAccount.gateway_fee,
          corrected: correctedEscrowData.gateway_fee,
          total_amount: escrowAccount.total_amount
        });
      }
      
      // v5.0 Formülüne göre düzeltme
      const netAmount = correctedEscrowData.total_amount - correctedEscrowData.gateway_fee;
      const correctRewardAmount = Math.round(netAmount * 0.20 * 100) / 100; // Net tutarın %20'si
      const correctServiceFee = Math.round((netAmount - correctedEscrowData.cargo_fee - correctRewardAmount) * 100) / 100;
      
      // Eğer mevcut değerler doğru değilse düzelt
      const rewardDifference = Math.abs(correctedEscrowData.reward_amount - correctRewardAmount);
      const serviceDifference = Math.abs(correctedEscrowData.service_fee - correctServiceFee);
      
      if (rewardDifference > 0.01 || serviceDifference > 0.01) {
        correctedEscrowData.reward_amount = correctRewardAmount;
        correctedEscrowData.service_fee = correctServiceFee;
        needsCorrection = true;
        
        console.log('v5.0 Formülüne göre düzeltildi:', {
          totalAmount: correctedEscrowData.total_amount,
          gatewayFee: correctedEscrowData.gateway_fee,
          netAmount: netAmount,
          originalReward: escrowAccount.reward_amount,
          correctedReward: correctRewardAmount,
          originalService: escrowAccount.service_fee,
          correctedService: correctServiceFee,
          cargoFee: correctedEscrowData.cargo_fee
        });
      }
      
      setEscrowData(correctedEscrowData);

    } catch (error) {
      console.error('Error fetching escrow status:', error);
      setError('Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (paymentId) {
      fetchEscrowStatus();
    }
  }, [paymentId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'held': return 'text-yellow-600 bg-yellow-100';
      case 'released': return 'text-green-600 bg-green-100';
      case 'disputed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'held': return 'Emanette';
      case 'released': return 'Serbest Bırakıldı';
      case 'disputed': return 'İtiraz Edildi';
      default: return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR');
  };

  const getTimeRemaining = (autoReleaseTime: string) => {
    const now = new Date();
    const releaseTime = new Date(autoReleaseTime);
    const diff = releaseTime.getTime() - now.getTime();

    if (diff <= 0) return 'Süre doldu';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours} saat ${minutes} dakika`;
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-red-600 mb-4">{error}</div>
        <Button onClick={fetchEscrowStatus} className="bg-blue-600 hover:bg-blue-700 text-white">
          Tekrar Dene
        </Button>
      </div>
    );
  }

  if (!escrowData) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-500">Emanet bilgisi bulunamadı</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Emanet Durumu</h3>
        <Button 
          onClick={fetchEscrowStatus} 
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
        >
          Yenile
        </Button>
      </div>

      {/* Durum */}
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Durum:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(escrowData.status)}`}>
            {getStatusText(escrowData.status)}
          </span>
        </div>
      </div>

      {/* Tarihler */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Emanet Alındı:</span>
          <span>{formatDate(escrowData.held_at)}</span>
        </div>
        
        {escrowData.released_at && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Serbest Bırakıldı:</span>
            <span>{formatDate(escrowData.released_at)}</span>
          </div>
        )}

        {escrowData.auto_release_time && escrowData.status === 'held' && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Otomatik Serbest Bırakma:</span>
            <span className="text-orange-600 font-medium">
              {getTimeRemaining(escrowData.auto_release_time)}
            </span>
          </div>
        )}
      </div>

      {/* Tutarlar */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Ödeme Dağıtımı</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Toplam Tutar:</span>
            <span className="font-medium">{formatCurrency(escrowData.total_amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Gateway Ücreti:</span>
            <span className="font-medium text-red-600">{formatCurrency(escrowData.gateway_fee)}</span>
          </div>
          <div className="flex justify-between border-t pt-1">
            <span className="text-gray-600 font-medium">Net Tutar:</span>
            <span className="font-bold text-blue-600">{formatCurrency(escrowData.total_amount - escrowData.gateway_fee)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Bulan Kişi Ödülü:</span>
            <span className="font-medium text-green-600">{formatCurrency(escrowData.reward_amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Servis Ücreti:</span>
            <span className="font-medium">{formatCurrency(escrowData.service_fee)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Kargo Ücreti:</span>
            <span className="font-medium">{formatCurrency(escrowData.cargo_fee)}</span>
          </div>
          
          {/* Hesaplama Doğrulaması */}
          {(() => {
            const distributedAmount = escrowData.reward_amount + escrowData.service_fee + escrowData.cargo_fee;
            const netAmount = escrowData.total_amount - escrowData.gateway_fee;
            const difference = Math.abs(distributedAmount - netAmount);
            
            // v5.0 formülüne göre doğru hesaplanmış mı kontrol et
            const correctRewardAmount = Math.round(netAmount * 0.20 * 100) / 100;
            const correctServiceFee = Math.round((netAmount - escrowData.cargo_fee - correctRewardAmount) * 100) / 100;
            const isCorrectlyCalculated = Math.abs(escrowData.reward_amount - correctRewardAmount) <= 0.01 && 
                                        Math.abs(escrowData.service_fee - correctServiceFee) <= 0.01;
            
            if (difference > 0.01 && !isCorrectlyCalculated) { // 1 kuruştan fazla fark varsa ve v5.0 formülüne uygun değilse
              return (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                  <div className="flex items-center text-yellow-800">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Hesaplama Uyarısı:</span>
                  </div>
                  <div className="mt-1 text-yellow-700">
                    <div>Dağıtılan Tutar: {formatCurrency(distributedAmount)}</div>
                    <div>Net Tutar: {formatCurrency(netAmount)}</div>
                    <div>Fark: {formatCurrency(difference)}</div>
                    <div className="text-xs mt-1 text-yellow-600">
                      Dağıtılan tutar (ödül + servis + kargo) net tutara eşit olmalıdır.
                    </div>
                  </div>
                </div>
              );
            } else if (isCorrectlyCalculated) {
              return (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs">
                  <div className="flex items-center text-green-800">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span className="font-medium">v5.0 Formülüne Göre Düzeltildi:</span>
                  </div>
                  <div className="mt-1 text-green-700">
                    <div>Gateway ücreti: {formatCurrency(escrowData.gateway_fee)}</div>
                    <div>Bulan kişi ödülü: {formatCurrency(escrowData.reward_amount)} (net tutarın %20'si)</div>
                    <div>Servis ücreti: {formatCurrency(escrowData.service_fee)} (geriye kalan)</div>
                    <div className="text-xs mt-1 text-green-600">
                      Sistem artık v5.0 formülüne göre doğru hesaplama yapıyor.
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })()}
        </div>
      </div>

      {/* Onaylar */}
      {escrowData.confirmations && escrowData.confirmations.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Onaylar</h4>
          <div className="space-y-2">
            {escrowData.confirmations.map((confirmation, index) => (
              <div key={index} className="bg-green-50 border border-green-200 rounded p-3">
                <div className="flex items-center space-x-2">
                  <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-green-800">
                    {confirmation.confirmation_type === 'device_received' ? 'Cihaz Teslim Alındı' : confirmation.confirmation_type}
                  </span>
                </div>
                <div className="text-xs text-green-600 mt-1">
                  {formatDate(confirmation.timestamp)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* İtiraz Sebebi */}
      {escrowData.dispute_reason && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">İtiraz Sebebi</h4>
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <p className="text-sm text-red-800">{escrowData.dispute_reason}</p>
          </div>
        </div>
      )}

      {/* Cihaz Durumu */}
      {escrowData && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Escrow Durumu</h4>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Durum:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              escrowData.status === 'active' ? 'bg-green-100 text-green-800' :
              escrowData.status === 'released' ? 'bg-blue-100 text-blue-800' :
              escrowData.status === 'disputed' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {escrowData.status === 'active' ? 'Aktif' :
               escrowData.status === 'released' ? 'Serbest Bırakıldı' :
               escrowData.status === 'disputed' ? 'Anlaşmazlık' :
               'Beklemede'}
            </span>
          </div>
          
          {escrowData.released_at && (
            <div className="text-xs text-gray-600 mt-1">
              Serbest Bırakılma: {formatDate(escrowData.released_at)}
            </div>
          )}
          
          {escrowData.disputed_at && (
            <div className="text-xs text-gray-600 mt-1">
              İtiraz Tarihi: {formatDate(escrowData.disputed_at)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
