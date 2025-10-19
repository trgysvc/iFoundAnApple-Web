import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { 
  Shield, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Calendar,
  User,
  Smartphone,
  Lock,
  Unlock,
  RotateCcw,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface EscrowData {
  id: string;
  payment_id: string;
  device_id: string;
  holder_user_id: string;
  beneficiary_user_id: string;
  total_amount: number;
  reward_amount: number;
  service_fee: number;
  cargo_fee: number;
  net_payout: number;
  status: string;
  created_at: string;
  held_at?: string;
  released_at?: string;
  refunded_at?: string;
  currency: string;
  notes?: string;
  admin_notes?: string;
  device?: {
    id: string;
    model: string;
    serialNumber: string;
  };
  holder?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  beneficiary?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

const EscrowManagementPage: React.FC = () => {
  const { devices, users, t } = useAppContext();
  const [escrows, setEscrows] = useState<EscrowData[]>([]);
  const [filteredEscrows, setFilteredEscrows] = useState<EscrowData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedEscrow, setSelectedEscrow] = useState<EscrowData | null>(null);
  const [showEscrowModal, setShowEscrowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Mock escrow data - gerçek uygulamada API'den gelecek
  useEffect(() => {
    const mockEscrows: EscrowData[] = [
      {
        id: 'escrow-1',
        payment_id: 'payment-1',
        device_id: devices[0]?.id || 'device-1',
        holder_user_id: users[0]?.id || 'user-1',
        beneficiary_user_id: users[1]?.id || 'user-2',
        total_amount: 1250,
        reward_amount: 1000,
        service_fee: 50,
        cargo_fee: 25,
        net_payout: 887.5,
        status: 'held',
        created_at: '2024-01-15T10:30:00Z',
        held_at: '2024-01-15T10:35:00Z',
        currency: 'TRY',
        notes: 'Cihaz teslim edildi, ödeme bekleniyor',
        device: {
          id: devices[0]?.id || 'device-1',
          model: 'iPhone 15 Pro Max',
          serialNumber: 'ABC123456789'
        },
        holder: {
          id: users[0]?.id || 'user-1',
          email: users[0]?.email || 'holder@example.com',
          firstName: users[0]?.firstName || 'Ahmet',
          lastName: users[0]?.lastName || 'Yılmaz'
        },
        beneficiary: {
          id: users[1]?.id || 'user-2',
          email: users[1]?.email || 'beneficiary@example.com',
          firstName: users[1]?.firstName || 'Mehmet',
          lastName: users[1]?.lastName || 'Kaya'
        }
      },
      {
        id: 'escrow-2',
        payment_id: 'payment-2',
        device_id: devices[1]?.id || 'device-2',
        holder_user_id: users[1]?.id || 'user-2',
        beneficiary_user_id: users[0]?.id || 'user-1',
        total_amount: 850,
        reward_amount: 700,
        service_fee: 35,
        cargo_fee: 25,
        net_payout: 614.5,
        status: 'released',
        created_at: '2024-01-16T14:20:00Z',
        held_at: '2024-01-16T14:25:00Z',
        released_at: '2024-01-16T16:30:00Z',
        currency: 'TRY',
        notes: 'İşlem başarıyla tamamlandı',
        device: {
          id: devices[1]?.id || 'device-2',
          model: 'iPhone 14 Pro',
          serialNumber: 'DEF987654321'
        },
        holder: {
          id: users[1]?.id || 'user-2',
          email: users[1]?.email || 'holder2@example.com',
          firstName: users[1]?.firstName || 'Mehmet',
          lastName: users[1]?.lastName || 'Kaya'
        },
        beneficiary: {
          id: users[0]?.id || 'user-1',
          email: users[0]?.email || 'beneficiary2@example.com',
          firstName: users[0]?.firstName || 'Ahmet',
          lastName: users[0]?.lastName || 'Yılmaz'
        }
      }
    ];
    
    setEscrows(mockEscrows);
    setFilteredEscrows(mockEscrows);
    setLoading(false);
  }, [devices, users]);

  // Filtreleme
  useEffect(() => {
    let filtered = escrows;

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(escrow => 
        escrow.device?.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        escrow.device?.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        escrow.holder?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        escrow.beneficiary?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        escrow.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Durum filtresi
    if (statusFilter !== 'all') {
      filtered = filtered.filter(escrow => escrow.status === statusFilter);
    }

    setFilteredEscrows(filtered);
  }, [searchTerm, statusFilter, escrows]);

  const handleEscrowAction = async (action: string, escrow: EscrowData) => {
    setActionLoading(action);
    
    try {
      // Mock API call - gerçek uygulamada API'ye istek gönderilecek
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`${action} action for escrow:`, escrow);
      
      // Mock status update
      setEscrows(prev => prev.map(e => 
        e.id === escrow.id 
          ? { 
              ...e, 
              status: action === 'release' ? 'released' : 
                     action === 'refund' ? 'refunded' : e.status,
              released_at: action === 'release' ? new Date().toISOString() : e.released_at,
              refunded_at: action === 'refund' ? new Date().toISOString() : e.refunded_at
            }
          : e
      ));
      
    } catch (error) {
      console.error('Escrow action failed:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleEscrowView = (escrow: EscrowData) => {
    setSelectedEscrow(escrow);
    setShowEscrowModal(true);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { color: 'bg-gray-100 text-gray-800', icon: Clock, text: 'Bekliyor' },
      'held': { color: 'bg-blue-100 text-blue-800', icon: Lock, text: 'Emanette' },
      'released': { color: 'bg-green-100 text-green-800', icon: Unlock, text: 'Serbest Bırakıldı' },
      'refunded': { color: 'bg-red-100 text-red-800', icon: RotateCcw, text: 'İade Edildi' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return `₺${amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Emanet Yönetimi</h1>
          <p className="text-gray-600">Emanet hesaplarını yönetin ve kontrol edin</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-500">
            Toplam: {escrows.length} emanet hesabı
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Toplam Emanet</p>
              <p className="text-lg font-semibold text-gray-900">{escrows.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Toplam Tutar</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(escrows.reduce((sum, e) => sum + e.total_amount, 0))}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Lock className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Emanette</p>
              <p className="text-lg font-semibold text-gray-900">
                {escrows.filter(e => e.status === 'held').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Bekleyen</p>
              <p className="text-lg font-semibold text-gray-900">
                {escrows.filter(e => e.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Ara"
              placeholder="Cihaz, kullanıcı, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Select
              label="Durum"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tümü</option>
              <option value="pending">Bekliyor</option>
              <option value="held">Emanette</option>
              <option value="released">Serbest Bırakıldı</option>
              <option value="refunded">İade Edildi</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Escrows Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Emanet Bilgileri
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cihaz
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tutarlar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEscrows.map((escrow) => (
                <tr key={escrow.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <Shield className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {escrow.id.slice(0, 12)}...
                        </div>
                        <div className="text-sm text-gray-500">
                          {escrow.currency}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <Smartphone className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {escrow.device?.model}
                        </div>
                        <div className="text-sm text-gray-500">
                          {escrow.device?.serialNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      Toplam: {formatCurrency(escrow.total_amount)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Net: {formatCurrency(escrow.net_payout)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(escrow.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(escrow.created_at)}
                    </div>
                    {escrow.held_at && (
                      <div className="text-xs text-gray-400">
                        Emanet: {formatDate(escrow.held_at)}
                      </div>
                    )}
                    {escrow.released_at && (
                      <div className="text-xs text-green-600">
                        Serbest: {formatDate(escrow.released_at)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEscrowView(escrow)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {escrow.status === 'held' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEscrowAction('release', escrow)}
                            disabled={actionLoading === 'release'}
                          >
                            {actionLoading === 'release' ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            ) : (
                              <Unlock className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEscrowAction('refund', escrow)}
                            disabled={actionLoading === 'refund'}
                          >
                            {actionLoading === 'refund' ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                            ) : (
                              <RotateCcw className="w-4 h-4" />
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Escrow Detail Modal */}
      {showEscrowModal && selectedEscrow && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowEscrowModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Emanet Detayları
                    </h3>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          ID: {selectedEscrow.id}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Smartphone className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {selectedEscrow.device?.model} - {selectedEscrow.device?.serialNumber}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          Toplam: {formatCurrency(selectedEscrow.total_amount)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900">
                          Ödül: {formatCurrency(selectedEscrow.reward_amount)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900">
                          Net Ödeme: {formatCurrency(selectedEscrow.net_payout)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900">
                          Durum: {getStatusBadge(selectedEscrow.status)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          Sahip: {selectedEscrow.holder?.firstName} {selectedEscrow.holder?.lastName}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          Bulan: {selectedEscrow.beneficiary?.firstName} {selectedEscrow.beneficiary?.lastName}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          Tarih: {formatDate(selectedEscrow.created_at)}
                        </span>
                      </div>
                      {selectedEscrow.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md">
                          <p className="text-sm text-gray-700">
                            <strong>Notlar:</strong> {selectedEscrow.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  variant="primary"
                  onClick={() => setShowEscrowModal(false)}
                  className="w-full sm:w-auto"
                >
                  Kapat
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EscrowManagementPage;
