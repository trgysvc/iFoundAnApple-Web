import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { createClient } from '@supabase/supabase-js';
import { getSecureConfig } from '../../utils/security';

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
  const [escrowData, setEscrowData] = useState<EscrowData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEscrowStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Supabase client
      const config = getSecureConfig();
      const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);

      // Escrow hesabını bul
      const { data: escrowAccount, error: escrowError } = await supabase
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
      setEscrowData(escrowAccount);

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
