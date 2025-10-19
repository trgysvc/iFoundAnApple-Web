import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { 
  CreditCard, 
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
  Shield,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface PaymentData {
  id: string;
  device_id: string;
  payer_id: string;
  receiver_id?: string;
  total_amount: number;
  reward_amount: number;
  cargo_fee: number;
  service_fee: number;
  gateway_fee: number;
  net_payout: number;
  payment_provider: string;
  payment_status: string;
  escrow_status: string;
  created_at: string;
  completed_at?: string;
  device?: {
    id: string;
    model: string;
    serialNumber: string;
  };
  payer?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  receiver?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

const PaymentManagementPage: React.FC = () => {
  const { devices, users, t } = useAppContext();
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<PaymentData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [providerFilter, setProviderFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<PaymentData | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Mock payment data - gerçek uygulamada API'den gelecek
  useEffect(() => {
    const mockPayments: PaymentData[] = [
      {
        id: 'payment-1',
        device_id: devices[0]?.id || 'device-1',
        payer_id: users[0]?.id || 'user-1',
        receiver_id: users[1]?.id || 'user-2',
        total_amount: 1250,
        reward_amount: 1000,
        cargo_fee: 25,
        service_fee: 50,
        gateway_fee: 37.5,
        net_payout: 887.5,
        payment_provider: 'iyzico',
        payment_status: 'completed',
        escrow_status: 'held',
        created_at: '2024-01-15T10:30:00Z',
        completed_at: '2024-01-15T10:35:00Z',
        device: {
          id: devices[0]?.id || 'device-1',
          model: 'iPhone 15 Pro Max',
          serialNumber: 'ABC123456789'
        },
        payer: {
          id: users[0]?.id || 'user-1',
          email: users[0]?.email || 'payer@example.com',
          firstName: users[0]?.firstName || 'Ahmet',
          lastName: users[0]?.lastName || 'Yılmaz'
        },
        receiver: {
          id: users[1]?.id || 'user-2',
          email: users[1]?.email || 'receiver@example.com',
          firstName: users[1]?.firstName || 'Mehmet',
          lastName: users[1]?.lastName || 'Kaya'
        }
      },
      {
        id: 'payment-2',
        device_id: devices[1]?.id || 'device-2',
        payer_id: users[1]?.id || 'user-2',
        receiver_id: users[0]?.id || 'user-1',
        total_amount: 850,
        reward_amount: 700,
        cargo_fee: 25,
        service_fee: 35,
        gateway_fee: 25.5,
        net_payout: 614.5,
        payment_provider: 'stripe',
        payment_status: 'pending',
        escrow_status: 'pending',
        created_at: '2024-01-16T14:20:00Z',
        device: {
          id: devices[1]?.id || 'device-2',
          model: 'iPhone 14 Pro',
          serialNumber: 'DEF987654321'
        },
        payer: {
          id: users[1]?.id || 'user-2',
          email: users[1]?.email || 'payer2@example.com',
          firstName: users[1]?.firstName || 'Mehmet',
          lastName: users[1]?.lastName || 'Kaya'
        },
        receiver: {
          id: users[0]?.id || 'user-1',
          email: users[0]?.email || 'receiver2@example.com',
          firstName: users[0]?.firstName || 'Ahmet',
          lastName: users[0]?.lastName || 'Yılmaz'
        }
      }
    ];
    
    setPayments(mockPayments);
    setFilteredPayments(mockPayments);
    setLoading(false);
  }, [devices, users]);

  // Filtreleme
  useEffect(() => {
    let filtered = payments;

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(payment => 
        payment.device?.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.device?.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.payer?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.receiver?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Durum filtresi
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.payment_status === statusFilter);
    }

    // Provider filtresi
    if (providerFilter !== 'all') {
      filtered = filtered.filter(payment => payment.payment_provider === providerFilter);
    }

    setFilteredPayments(filtered);
  }, [searchTerm, statusFilter, providerFilter, payments]);

  const handlePaymentAction = (action: string, payment: PaymentData) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
    console.log(`${action} action for payment:`, payment);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Bekliyor' },
      'completed': { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Tamamlandı' },
      'failed': { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Başarısız' },
      'refunded': { color: 'bg-gray-100 text-gray-800', icon: RefreshCw, text: 'İade Edildi' },
      'cancelled': { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'İptal Edildi' }
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

  const getEscrowStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { color: 'bg-gray-100 text-gray-800', icon: Clock, text: 'Bekliyor' },
      'held': { color: 'bg-blue-100 text-blue-800', icon: Shield, text: 'Emanette' },
      'released': { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Serbest Bırakıldı' },
      'refunded': { color: 'bg-red-100 text-red-800', icon: RefreshCw, text: 'İade Edildi' }
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
          <h1 className="text-2xl font-bold text-gray-900">Ödeme Yönetimi</h1>
          <p className="text-gray-600">Ödeme işlemlerini takip edin ve yönetin</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-500">
            Toplam: {payments.length} ödeme
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Toplam Ödeme</p>
              <p className="text-lg font-semibold text-gray-900">{payments.length}</p>
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
                {formatCurrency(payments.reduce((sum, p) => sum + p.total_amount, 0))}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Emanette</p>
              <p className="text-lg font-semibold text-gray-900">
                {payments.filter(p => p.escrow_status === 'held').length}
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
                {payments.filter(p => p.payment_status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <option value="completed">Tamamlandı</option>
              <option value="failed">Başarısız</option>
              <option value="refunded">İade Edildi</option>
              <option value="cancelled">İptal Edildi</option>
            </Select>
          </div>
          <div>
            <Select
              label="Ödeme Sağlayıcısı"
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
            >
              <option value="all">Tümü</option>
              <option value="iyzico">İyzico</option>
              <option value="stripe">Stripe</option>
              <option value="test">Test</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ödeme Bilgileri
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cihaz
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tutarlar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durumlar
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
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.id.slice(0, 12)}...
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.payment_provider.toUpperCase()}
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
                          {payment.device?.model}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.device?.serialNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      Toplam: {formatCurrency(payment.total_amount)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Net: {formatCurrency(payment.net_payout)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      {getStatusBadge(payment.payment_status)}
                      {getEscrowStatusBadge(payment.escrow_status)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(payment.created_at)}
                    </div>
                    {payment.completed_at && (
                      <div className="text-xs text-gray-400">
                        Tamamlandı: {formatDate(payment.completed_at)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePaymentAction('view', payment)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePaymentAction('refresh', payment)}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePaymentAction('more', payment)}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Detail Modal */}
      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowPaymentModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Ödeme Detayları
                    </h3>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center">
                        <CreditCard className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          ID: {selectedPayment.id}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Smartphone className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {selectedPayment.device?.model} - {selectedPayment.device?.serialNumber}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          Toplam: {formatCurrency(selectedPayment.total_amount)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900">
                          Ödül: {formatCurrency(selectedPayment.reward_amount)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900">
                          Net Ödeme: {formatCurrency(selectedPayment.net_payout)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900">
                          Durum: {getStatusBadge(selectedPayment.payment_status)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900">
                          Emanet: {getEscrowStatusBadge(selectedPayment.escrow_status)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          Tarih: {formatDate(selectedPayment.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  variant="primary"
                  onClick={() => setShowPaymentModal(false)}
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

export default PaymentManagementPage;
