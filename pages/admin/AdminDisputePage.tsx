import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { DisputeStatus, DisputeReason } from '../../types';
import { Button } from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowUpCircle,
  Filter,
  Search,
  Eye,
  MessageSquare,
  Calendar,
  User,
  Smartphone
} from 'lucide-react';

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
  user_email?: string;
  user_name?: string;
}

interface DisputeResolution {
  status: 'resolved' | 'rejected' | 'escalated';
  admin_notes: string;
  resolution?: string;
}

export const AdminDisputePage: React.FC = () => {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'under_review' | 'resolved' | 'rejected' | 'escalated'>('all');
  const [selectedDispute, setSelectedDispute] = useState<any | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [resolution, setResolution] = useState('');
  const [newStatus, setNewStatus] = useState<string>('pending');
  const [isResolving, setIsResolving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/disputes');
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
      escalated: disputes.filter(d => d.status === 'escalated').length,
    };
  };

  const statusCounts = getStatusCounts();

  const handleViewDetails = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setResolutionForm({
      status: dispute.status === 'pending' ? 'under_review' : dispute.status,
      admin_notes: dispute.admin_notes || '',
      resolution: dispute.resolution || ''
    });
  };

  const handleCloseDetails = () => {
    setSelectedDispute(null);
    setResolutionForm({
      status: 'resolved',
      admin_notes: '',
      resolution: ''
    });
  };

  const handleResolveDispute = async () => {
    if (!selectedDispute) return;

    if (!resolutionForm.admin_notes.trim()) {
      alert('Lütfen admin notları girin');
      return;
    }

    if (resolutionForm.status === 'resolved' && !resolutionForm.resolution?.trim()) {
      alert('Çözüm durumu için çözüm açıklaması gerekli');
      return;
    }

    try {
      setIsResolving(true);
      const response = await fetch(`/api/admin/disputes/${selectedDispute.id}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resolutionForm),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setDisputes(prev => prev.map(dispute => 
          dispute.id === selectedDispute.id 
            ? { ...dispute, ...resolutionForm, updated_at: new Date().toISOString() }
            : dispute
        ));
        handleCloseDetails();
        alert('İtiraz başarıyla güncellendi');
      } else {
        alert(data.error || 'İtiraz güncellenemedi');
      }
    } catch (error) {
      console.error('Error resolving dispute:', error);
      alert('Bir hata oluştu');
    } finally {
      setIsResolving(false);
    }
  };

  const handleStartReview = async (disputeId: string) => {
    try {
      const response = await fetch(`/api/admin/disputes/${disputeId}/start-review`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setDisputes(prev => prev.map(dispute => 
          dispute.id === disputeId 
            ? { ...dispute, status: 'under_review', updated_at: new Date().toISOString() }
            : dispute
        ));
        alert('İtiraz inceleme durumuna alındı');
      } else {
        alert(data.error || 'İtiraz güncellenemedi');
      }
    } catch (error) {
      console.error('Error starting review:', error);
      alert('Bir hata oluştu');
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Admin İtiraz Yönetimi</h1>
          <p className="mt-2 text-gray-600">
            Tüm kullanıcı itirazlarını buradan yönetebilirsiniz.
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
                { key: 'escalated', label: 'Üst Seviye', count: statusCounts.escalated },
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
                ? 'Henüz hiç itiraz bulunmuyor.'
                : `${filter === 'pending' ? 'Beklemede' : 
                    filter === 'under_review' ? 'İnceleniyor' : 
                    filter === 'resolved' ? 'Çözüldü' : 
                    filter === 'rejected' ? 'Reddedildi' : 'Üst Seviyeye Taşınan'} durumunda itiraz bulunmuyor.`
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDisputes.map((dispute) => (
              <div key={dispute.id} className="relative">
                <DisputeStatusCard
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
                
                {/* Quick Actions */}
                {dispute.status === 'pending' && (
                  <div className="absolute top-2 right-2">
                    <Button
                      onClick={() => handleStartReview(dispute.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1"
                    >
                      İncelemeye Al
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Dispute Resolution Modal */}
        {selectedDispute && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    İtiraz Çözümü #{selectedDispute.id.slice(-8)}
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

                <div className="space-y-6">
                  {/* Dispute Info */}
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

                  {/* Resolution Form */}
                  <div className="border-t pt-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">İtiraz Çözümü</h4>
                    
                    <div className="space-y-4">
                      {/* Status */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Durum *
                        </label>
                        <select
                          value={resolutionForm.status}
                          onChange={(e) => setResolutionForm(prev => ({ 
                            ...prev, 
                            status: e.target.value as any 
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="resolved">Çözüldü</option>
                          <option value="rejected">Reddedildi</option>
                          <option value="escalated">Üst Seviyeye Taşı</option>
                        </select>
                      </div>

                      {/* Admin Notes */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Admin Notları *
                        </label>
                        <Textarea
                          value={resolutionForm.admin_notes}
                          onChange={(e) => setResolutionForm(prev => ({ 
                            ...prev, 
                            admin_notes: e.target.value 
                          }))}
                          placeholder="İtiraz hakkında admin notlarınızı girin..."
                          rows={3}
                          required
                        />
                      </div>

                      {/* Resolution */}
                      {resolutionForm.status === 'resolved' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Çözüm Açıklaması *
                          </label>
                          <Textarea
                            value={resolutionForm.resolution || ''}
                            onChange={(e) => setResolutionForm(prev => ({ 
                              ...prev, 
                              resolution: e.target.value 
                            }))}
                            placeholder="İtirazın nasıl çözüldüğünü açıklayın..."
                            rows={3}
                            required
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-3 pt-6 border-t">
                    <Button
                      onClick={handleCloseDetails}
                      className="bg-gray-600 hover:bg-gray-700 text-white"
                    >
                      İptal
                    </Button>
                    <Button
                      onClick={handleResolveDispute}
                      disabled={isResolving}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isResolving ? 'Kaydediliyor...' : 'Çözümü Kaydet'}
                    </Button>
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
