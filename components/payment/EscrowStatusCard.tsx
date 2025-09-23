import React from 'react';

export interface EscrowStatus {
  id: string;
  paymentId: string;
  deviceId: string;
  deviceModel: string;
  totalAmount: number;
  netPayout: number;
  status: 'pending' | 'held' | 'released' | 'refunded' | 'failed';
  createdAt: string;
  heldAt?: string;
  releasedAt?: string;
  refundedAt?: string;
  confirmations: Array<{
    type: string;
    userId: string;
    timestamp: string;
    notes?: string;
  }>;
  releaseConditions: string[];
}

interface EscrowStatusCardProps {
  escrow: EscrowStatus;
  userRole: 'payer' | 'receiver' | 'other';
  onConfirm?: (confirmationType: string) => void;
  className?: string;
}

const EscrowStatusCard: React.FC<EscrowStatusCardProps> = ({
  escrow,
  userRole,
  onConfirm,
  className = ""
}) => {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2
    }).format(price);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          color: 'yellow',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600',
          title: 'Beklemede',
          description: 'Ödeme işlemi tamamlanıyor'
        };
      case 'held':
        return {
          color: 'blue',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-600',
          title: 'Bloke Edildi',
          description: 'Para güvenli şekilde tutulmaktadır'
        };
      case 'released':
        return {
          color: 'green',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          iconColor: 'text-green-600',
          title: 'Serbest Bırakıldı',
          description: 'Para bulan kişiye aktarıldı'
        };
      case 'refunded':
        return {
          color: 'purple',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          textColor: 'text-purple-800',
          iconColor: 'text-purple-600',
          title: 'İade Edildi',
          description: 'Para geri iade edildi'
        };
      case 'failed':
        return {
          color: 'red',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          iconColor: 'text-red-600',
          title: 'Başarısız',
          description: 'İşlem başarısız oldu'
        };
      default:
        return {
          color: 'gray',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          iconColor: 'text-gray-600',
          title: 'Bilinmeyen',
          description: 'Durum bilinmiyor'
        };
    }
  };

  const statusInfo = getStatusInfo(escrow.status);
  
  // Check which confirmations are received
  const confirmationTypes = escrow.confirmations.map(c => c.type);
  const hasDeviceReceived = confirmationTypes.includes('device_received');
  const hasExchangeConfirmed = confirmationTypes.includes('exchange_confirmed');

  // Check if user can perform actions
  const canConfirmReceived = userRole === 'payer' && escrow.status === 'held' && !hasDeviceReceived;
  const canConfirmExchange = userRole === 'receiver' && escrow.status === 'held' && !hasExchangeConfirmed;

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden ${className}`}>
      {/* Header */}
      <div className={`${statusInfo.bgColor} ${statusInfo.borderColor} border-b px-6 py-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-10 h-10 ${statusInfo.bgColor} rounded-full flex items-center justify-center mr-4`}>
              {escrow.status === 'pending' && (
                <svg className={`w-5 h-5 ${statusInfo.iconColor}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                </svg>
              )}
              {escrow.status === 'held' && (
                <svg className={`w-5 h-5 ${statusInfo.iconColor}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
              )}
              {escrow.status === 'released' && (
                <svg className={`w-5 h-5 ${statusInfo.iconColor}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              )}
              {escrow.status === 'refunded' && (
                <svg className={`w-5 h-5 ${statusInfo.iconColor}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
                </svg>
              )}
              {escrow.status === 'failed' && (
                <svg className={`w-5 h-5 ${statusInfo.iconColor}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
              )}
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${statusInfo.textColor}`}>
                Escrow Durumu: {statusInfo.title}
              </h3>
              <p className={`text-sm ${statusInfo.textColor} opacity-75`}>
                {statusInfo.description}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-xs ${statusInfo.textColor} opacity-75`}>İşlem ID</p>
            <p className={`text-sm font-mono ${statusInfo.textColor}`}>
              {escrow.id.substring(0, 8)}...
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Device and Amount Info */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">{escrow.deviceModel}</h4>
              <p className="text-sm text-gray-600">Escrow ID: {escrow.id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Toplam Tutar</p>
              <p className="text-xl font-bold text-gray-900">{formatPrice(escrow.totalAmount)}</p>
            </div>
          </div>

          {escrow.status === 'held' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-green-900">Bulan Kişiye Ödenecek</p>
                  <p className="text-xs text-green-700">Onay sonrası aktarılacak</p>
                </div>
                <span className="text-lg font-bold text-green-700">
                  {formatPrice(escrow.netPayout)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">İşlem Geçmişi</h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <div className="flex-grow">
                <p className="text-sm font-medium text-gray-900">Escrow Oluşturuldu</p>
                <p className="text-xs text-gray-500">{formatDate(escrow.createdAt)}</p>
              </div>
            </div>
            
            {escrow.heldAt && (
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <div className="flex-grow">
                  <p className="text-sm font-medium text-gray-900">Para Bloke Edildi</p>
                  <p className="text-xs text-gray-500">{formatDate(escrow.heldAt)}</p>
                </div>
              </div>
            )}

            {escrow.releasedAt && (
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <div className="flex-grow">
                  <p className="text-sm font-medium text-gray-900">Para Serbest Bırakıldı</p>
                  <p className="text-xs text-gray-500">{formatDate(escrow.releasedAt)}</p>
                </div>
              </div>
            )}

            {escrow.refundedAt && (
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                <div className="flex-grow">
                  <p className="text-sm font-medium text-gray-900">Para İade Edildi</p>
                  <p className="text-xs text-gray-500">{formatDate(escrow.refundedAt)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Confirmations Status */}
        {escrow.status === 'held' && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Onay Durumu</h4>
            <div className="space-y-2">
              <div className={`flex items-center p-3 rounded-lg ${
                hasDeviceReceived ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
              }`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${
                  hasDeviceReceived ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  {hasDeviceReceived && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  )}
                </div>
                <div className="flex-grow">
                  <p className={`text-sm font-medium ${hasDeviceReceived ? 'text-green-900' : 'text-gray-700'}`}>
                    Cihaz Teslim Alındı
                  </p>
                  <p className={`text-xs ${hasDeviceReceived ? 'text-green-700' : 'text-gray-500'}`}>
                    {hasDeviceReceived ? 'Onaylandı' : 'Cihaz sahibi onayı bekleniyor'}
                  </p>
                </div>
              </div>

              <div className={`flex items-center p-3 rounded-lg ${
                hasExchangeConfirmed ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
              }`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${
                  hasExchangeConfirmed ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  {hasExchangeConfirmed && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  )}
                </div>
                <div className="flex-grow">
                  <p className={`text-sm font-medium ${hasExchangeConfirmed ? 'text-green-900' : 'text-gray-700'}`}>
                    Takas Tamamlandı
                  </p>
                  <p className={`text-xs ${hasExchangeConfirmed ? 'text-green-700' : 'text-gray-500'}`}>
                    {hasExchangeConfirmed ? 'Onaylandı' : 'Bulan kişi onayı bekleniyor'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {escrow.status === 'held' && onConfirm && (
          <div className="space-y-3">
            {canConfirmReceived && (
              <button
                onClick={() => onConfirm('device_received')}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                ✅ Cihazımı Teslim Aldım
              </button>
            )}
            
            {canConfirmExchange && (
              <button
                onClick={() => onConfirm('exchange_confirmed')}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                🤝 Takası Tamamladım
              </button>
            )}

            {!canConfirmReceived && !canConfirmExchange && (
              <div className="text-center py-4">
                <p className="text-sm text-gray-600">
                  {userRole === 'payer' && hasDeviceReceived && 'Cihaz teslim alımınızı onayladınız'}
                  {userRole === 'receiver' && hasExchangeConfirmed && 'Takas tamamlandığını onayladınız'}
                  {userRole === 'other' && 'Bu işlemde onay yetkiniz bulunmamaktadır'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Status Message */}
        {escrow.status === 'released' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
            </div>
            <p className="text-green-900 font-semibold">Takas Başarıyla Tamamlandı!</p>
            <p className="text-sm text-green-700">
              Para bulan kişiye aktarıldı: {formatPrice(escrow.netPayout)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EscrowStatusCard;
