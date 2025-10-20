import React from 'react';

export interface DisputeStatusCardProps {
  disputeId: string;
  deviceId: string;
  paymentId: string;
  disputeReason: string;
  status: 'pending' | 'under_review' | 'resolved' | 'rejected' | 'escalated';
  createdAt: string;
  updatedAt?: string;
  adminNotes?: string;
  resolution?: string;
  photos?: string[];
  notes: string;
  onViewDetails?: () => void;
}

export const DisputeStatusCard: React.FC<DisputeStatusCardProps> = ({
  disputeId,
  deviceId,
  paymentId,
  disputeReason,
  status,
  createdAt,
  updatedAt,
  adminNotes,
  resolution,
  photos,
  notes,
  onViewDetails
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'escalated':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Beklemede';
      case 'under_review':
        return 'İnceleniyor';
      case 'resolved':
        return 'Çözüldü';
      case 'rejected':
        return 'Reddedildi';
      case 'escalated':
        return 'Üst Seviyeye Taşındı';
      default:
        return 'Bilinmeyen';
    }
  };

  const getDisputeReasonText = (reason: string) => {
    const reasons: Record<string, string> = {
      'device_damaged': 'Cihaz hasarlı teslim edildi',
      'wrong_device': 'Yanlış cihaz gönderildi',
      'not_delivered': 'Cihaz teslim edilmedi',
      'delivery_delay': 'Teslimat gecikmesi',
      'communication_issue': 'İletişim sorunu',
      'payment_issue': 'Ödeme sorunu',
      'other': 'Diğer'
    };
    return reasons[reason] || reason;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            İtiraz #{disputeId.slice(-8)}
          </h3>
          <p className="text-sm text-gray-600">
            Cihaz ID: {deviceId.slice(-8)} | Ödeme ID: {paymentId.slice(-8)}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
          {getStatusText(status)}
        </span>
      </div>

      <div className="space-y-3">
        {/* İtiraz Nedeni */}
        <div>
          <label className="text-sm font-medium text-gray-700">İtiraz Nedeni:</label>
          <p className="text-sm text-gray-900">{getDisputeReasonText(disputeReason)}</p>
        </div>

        {/* Açıklama */}
        <div>
          <label className="text-sm font-medium text-gray-700">Açıklama:</label>
          <p className="text-sm text-gray-900">{notes}</p>
        </div>

        {/* Fotoğraflar */}
        {photos && photos.length > 0 && (
          <div>
            <label className="text-sm font-medium text-gray-700">Eklenen Fotoğraflar:</label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`İtiraz fotoğrafı ${index + 1}`}
                  className="w-full h-20 object-cover rounded border"
                />
              ))}
            </div>
          </div>
        )}

        {/* Admin Notları */}
        {adminNotes && (
          <div>
            <label className="text-sm font-medium text-gray-700">Admin Notları:</label>
            <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">{adminNotes}</p>
          </div>
        )}

        {/* Çözüm */}
        {resolution && (
          <div>
            <label className="text-sm font-medium text-gray-700">Çözüm:</label>
            <p className="text-sm text-gray-900 bg-green-50 p-3 rounded">{resolution}</p>
          </div>
        )}

        {/* Tarihler */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t">
          <div>
            <label className="text-sm font-medium text-gray-700">Oluşturulma Tarihi:</label>
            <p className="text-sm text-gray-900">{formatDate(createdAt)}</p>
          </div>
          {updatedAt && (
            <div>
              <label className="text-sm font-medium text-gray-700">Son Güncelleme:</label>
              <p className="text-sm text-gray-900">{formatDate(updatedAt)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Aksiyon Butonu */}
      {onViewDetails && (
        <div className="mt-4 pt-4 border-t">
          <button
            onClick={onViewDetails}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
          >
            Detayları Görüntüle
          </button>
        </div>
      )}
    </div>
  );
};
