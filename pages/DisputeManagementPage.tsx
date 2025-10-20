import React, { useState, useEffect } from 'react';
import { DisputeStatusCard } from '../components/dispute/DisputeStatusCard';
import { Button } from '../components/ui/Button';

interface Dispute {
  id: string;
  device_id: string;
  payment_id: string;
  dispute_reason: string;
  status: 'pending' | 'under_review' | 'resolved' | 'rejected' | 'escalated';
  created_at: string;
  updated_at?: string;
  admin_notes?: string;
  resolution?: string;
  photos?: string[];
  notes: string;
  device_model?: string;
  device_serial?: string;
}

export const DisputeManagementPage: React.FC = () => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'under_review' | 'resolved' | 'rejected'>('all');
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/disputes/user-disputes');
      const data = await response.json();

      if (data.success) {
        setDisputes(data.disputes);
      } else {
        setError(data.error || 'İtirazlar yüklenemedi');
      }
    } catch (error) {
      console.error('Error fetching disputes:', error);
      setError('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const filteredDisputes = disputes.filter(dispute => 
    filter === 'all' || dispute.status === filter
  );

  const getStatusCounts = () => {
    return {
      all: disputes.length,
      pending: disputes.filter(d => d.status === 'pending').length,
      under_review: disputes.filter(d => d.status === 'under_review').length,
      resolved: disputes.filter(d => d.status === 'resolved').length,
      rejected: disputes.filter(d => d.status === 'rejected').length,
    };
  };

  const statusCounts = getStatusCounts();

  const handleViewDetails = (dispute: Dispute) => {
    setSelectedDispute(dispute);
  };

  const handleCloseDetails = () => {
    setSelectedDispute(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">İtirazlar yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800">{error}</p>
              <Button 
                onClick={fetchDisputes}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white"
              >
                Tekrar Dene
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">İtiraz Yönetimi</h1>
          <p className="mt-2 text-gray-600">
            Cihazlarınızla ilgili itirazlarınızı buradan takip edebilirsiniz.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'Tümü', count: statusCounts.all },
                { key: 'pending', label: 'Beklemede', count: statusCounts.pending },
                { key: 'under_review', label: 'İnceleniyor', count: statusCounts.under_review },
                { key: 'resolved', label: 'Çözüldü', count: statusCounts.resolved },
                { key: 'rejected', label: 'Reddedildi', count: statusCounts.rejected },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                      filter === tab.key ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Disputes List */}
        {filteredDisputes.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">İtiraz bulunamadı</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all' 
                ? 'Henüz hiç itirazınız bulunmuyor.'
                : `${filter === 'pending' ? 'Beklemede' : 
                    filter === 'under_review' ? 'İnceleniyor' : 
                    filter === 'resolved' ? 'Çözüldü' : 'Reddedildi'} durumunda itirazınız bulunmuyor.`
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDisputes.map((dispute) => (
              <DisputeStatusCard
                key={dispute.id}
                disputeId={dispute.id}
                deviceId={dispute.device_id}
                paymentId={dispute.payment_id}
                disputeReason={dispute.dispute_reason}
                status={dispute.status}
                createdAt={dispute.created_at}
                updatedAt={dispute.updated_at}
                adminNotes={dispute.admin_notes}
                resolution={dispute.resolution}
                photos={dispute.photos}
                notes={dispute.notes}
                onViewDetails={() => handleViewDetails(dispute)}
              />
            ))}
          </div>
        )}

        {/* Dispute Details Modal */}
        {selectedDispute && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    İtiraz Detayları #{selectedDispute.id.slice(-8)}
                  </h3>
                  <button
                    onClick={handleCloseDetails}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <DisputeStatusCard
                  disputeId={selectedDispute.id}
                  deviceId={selectedDispute.device_id}
                  paymentId={selectedDispute.payment_id}
                  disputeReason={selectedDispute.dispute_reason}
                  status={selectedDispute.status}
                  createdAt={selectedDispute.created_at}
                  updatedAt={selectedDispute.updated_at}
                  adminNotes={selectedDispute.admin_notes}
                  resolution={selectedDispute.resolution}
                  photos={selectedDispute.photos}
                  notes={selectedDispute.notes}
                />

                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={handleCloseDetails}
                    className="bg-gray-600 hover:bg-gray-700 text-white"
                  >
                    Kapat
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
