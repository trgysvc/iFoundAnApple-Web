import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { 
  Truck, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye,
  Edit,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  User,
  Smartphone,
  RefreshCw,
  Plus,
  Download,
  Upload
} from 'lucide-react';

interface CargoShipment {
  id: string;
  device_id: string;
  cargo_code: string;
  cargo_company: string;
  cargo_status: string;
  tracking_number?: string;
  pickup_date?: string;
  delivery_date?: string;
  estimated_delivery?: string;
  pickup_address?: string;
  delivery_address?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  device?: {
    id: string;
    model: string;
    serialNumber: string;
    status: string;
  };
  sender?: {
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

interface CargoCompany {
  id: string;
  name: string;
  code: string;
  contact_phone: string;
  contact_email: string;
  is_active: boolean;
}

const CargoManagementPage: React.FC = () => {
  const { devices, users, t } = useAppContext();
  const [shipments, setShipments] = useState<CargoShipment[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<CargoShipment[]>([]);
  const [cargoCompanies, setCargoCompanies] = useState<CargoCompany[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState<CargoShipment | null>(null);
  const [showShipmentModal, setShowShipmentModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock cargo data - gerçek uygulamada API'den gelecek
  useEffect(() => {
    const mockShipments: CargoShipment[] = [
      {
        id: 'cargo-1',
        device_id: devices[0]?.id || 'device-1',
        cargo_code: 'CARGO001',
        cargo_company: 'Aras Kargo',
        cargo_status: 'in_transit',
        tracking_number: 'AR123456789',
        pickup_date: '2024-01-15T10:00:00Z',
        estimated_delivery: '2024-01-17T18:00:00Z',
        pickup_address: 'İstanbul, Kadıköy',
        delivery_address: 'Ankara, Çankaya',
        notes: 'Cihaz güvenli paketleme ile gönderildi',
        created_at: '2024-01-15T09:30:00Z',
        updated_at: '2024-01-15T10:00:00Z',
        device: {
          id: devices[0]?.id || 'device-1',
          model: 'iPhone 15 Pro Max',
          serialNumber: 'ABC123456789',
          status: 'cargo_shipped'
        },
        sender: {
          id: users[1]?.id || 'user-2',
          email: users[1]?.email || 'sender@example.com',
          firstName: users[1]?.firstName || 'Mehmet',
          lastName: users[1]?.lastName || 'Kaya'
        },
        receiver: {
          id: users[0]?.id || 'user-1',
          email: users[0]?.email || 'receiver@example.com',
          firstName: users[0]?.firstName || 'Ahmet',
          lastName: users[0]?.lastName || 'Yılmaz'
        }
      },
      {
        id: 'cargo-2',
        device_id: devices[1]?.id || 'device-2',
        cargo_code: 'CARGO002',
        cargo_company: 'MNG Kargo',
        cargo_status: 'delivered',
        tracking_number: 'MN987654321',
        pickup_date: '2024-01-16T14:00:00Z',
        delivery_date: '2024-01-18T16:30:00Z',
        pickup_address: 'İzmir, Konak',
        delivery_address: 'Bursa, Osmangazi',
        notes: 'Teslim edildi ve imza alındı',
        created_at: '2024-01-16T13:30:00Z',
        updated_at: '2024-01-18T16:30:00Z',
        device: {
          id: devices[1]?.id || 'device-2',
          model: 'iPhone 14 Pro',
          serialNumber: 'DEF987654321',
          status: 'delivered'
        },
        sender: {
          id: users[0]?.id || 'user-1',
          email: users[0]?.email || 'sender2@example.com',
          firstName: users[0]?.firstName || 'Ahmet',
          lastName: users[0]?.lastName || 'Yılmaz'
        },
        receiver: {
          id: users[1]?.id || 'user-2',
          email: users[1]?.email || 'receiver2@example.com',
          firstName: users[1]?.firstName || 'Mehmet',
          lastName: users[1]?.lastName || 'Kaya'
        }
      }
    ];

    const mockCompanies: CargoCompany[] = [
      {
        id: 'company-1',
        name: 'Aras Kargo',
        code: 'ARAS',
        contact_phone: '+90 444 0 727',
        contact_email: 'info@araskargo.com.tr',
        is_active: true
      },
      {
        id: 'company-2',
        name: 'MNG Kargo',
        code: 'MNG',
        contact_phone: '+90 444 4 646',
        contact_email: 'info@mngkargo.com.tr',
        is_active: true
      },
      {
        id: 'company-3',
        name: 'Yurtiçi Kargo',
        code: 'YURTICI',
        contact_phone: '+90 444 0 987',
        contact_email: 'info@yurticikargo.com',
        is_active: true
      }
    ];

    setShipments(mockShipments);
    setFilteredShipments(mockShipments);
    setCargoCompanies(mockCompanies);
    setLoading(false);
  }, [devices, users]);

  // Filtreleme
  useEffect(() => {
    let filtered = shipments;

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(shipment => 
        shipment.cargo_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.device?.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.device?.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.sender?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.receiver?.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Durum filtresi
    if (statusFilter !== 'all') {
      filtered = filtered.filter(shipment => shipment.cargo_status === statusFilter);
    }

    // Şirket filtresi
    if (companyFilter !== 'all') {
      filtered = filtered.filter(shipment => shipment.cargo_company === companyFilter);
    }

    setFilteredShipments(filtered);
  }, [searchTerm, statusFilter, companyFilter, shipments]);

  const handleShipmentAction = (action: string, shipment: CargoShipment) => {
    setSelectedShipment(shipment);
    setShowShipmentModal(true);
    console.log(`${action} action for shipment:`, shipment);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { color: 'bg-gray-100 text-gray-800', icon: Clock, text: 'Bekliyor' },
      'picked_up': { color: 'bg-blue-100 text-blue-800', icon: Package, text: 'Alındı' },
      'in_transit': { color: 'bg-yellow-100 text-yellow-800', icon: Truck, text: 'Yolda' },
      'delivered': { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Teslim Edildi' },
      'confirmed': { color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle, text: 'Onaylandı' },
      'failed': { color: 'bg-red-100 text-red-800', icon: AlertCircle, text: 'Başarısız' }
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

  const getDeliveryProgress = (shipment: CargoShipment) => {
    const statuses = ['pending', 'picked_up', 'in_transit', 'delivered', 'confirmed'];
    const currentIndex = statuses.indexOf(shipment.cargo_status);
    return ((currentIndex + 1) / statuses.length) * 100;
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
          <h1 className="text-2xl font-bold text-gray-900">Kargo Yönetimi</h1>
          <p className="text-gray-600">Kargo gönderilerini takip edin ve yönetin</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Yeni Gönderi
          </Button>
          <div className="text-sm text-gray-500">
            Toplam: {shipments.length} gönderi
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Truck className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Toplam Gönderi</p>
              <p className="text-lg font-semibold text-gray-900">{shipments.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Yolda</p>
              <p className="text-lg font-semibold text-gray-900">
                {shipments.filter(s => s.cargo_status === 'in_transit').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Teslim Edildi</p>
              <p className="text-lg font-semibold text-gray-900">
                {shipments.filter(s => s.cargo_status === 'delivered').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Bekleyen</p>
              <p className="text-lg font-semibold text-gray-900">
                {shipments.filter(s => s.cargo_status === 'pending').length}
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
              placeholder="Kargo kodu, takip no, cihaz..."
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
              <option value="picked_up">Alındı</option>
              <option value="in_transit">Yolda</option>
              <option value="delivered">Teslim Edildi</option>
              <option value="confirmed">Onaylandı</option>
              <option value="failed">Başarısız</option>
            </Select>
          </div>
          <div>
            <Select
              label="Kargo Şirketi"
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
            >
              <option value="all">Tümü</option>
              {cargoCompanies.map(company => (
                <option key={company.id} value={company.name}>
                  {company.name}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gönderi Bilgileri
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cihaz
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Takip
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
              {filteredShipments.map((shipment) => (
                <tr key={shipment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <Truck className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {shipment.cargo_code}
                        </div>
                        <div className="text-sm text-gray-500">
                          {shipment.cargo_company}
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
                          {shipment.device?.model}
                        </div>
                        <div className="text-sm text-gray-500">
                          {shipment.device?.serialNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      {getStatusBadge(shipment.cargo_status)}
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-blue-600 h-1 rounded-full" 
                          style={{ width: `${getDeliveryProgress(shipment)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {shipment.tracking_number ? (
                      <div className="text-sm font-medium text-gray-900">
                        {shipment.tracking_number}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">-</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(shipment.created_at)}
                    </div>
                    {shipment.pickup_date && (
                      <div className="text-xs text-gray-400">
                        Alım: {formatDate(shipment.pickup_date)}
                      </div>
                    )}
                    {shipment.delivery_date && (
                      <div className="text-xs text-green-600">
                        Teslim: {formatDate(shipment.delivery_date)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShipmentAction('view', shipment)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShipmentAction('edit', shipment)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShipmentAction('track', shipment)}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shipment Detail Modal */}
      {showShipmentModal && selectedShipment && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowShipmentModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Truck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Kargo Detayları
                    </h3>
                    <div className="mt-4 space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Kargo Kodu</label>
                          <p className="text-sm text-gray-900">{selectedShipment.cargo_code}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Takip Numarası</label>
                          <p className="text-sm text-gray-900">{selectedShipment.tracking_number || '-'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Kargo Şirketi</label>
                          <p className="text-sm text-gray-900">{selectedShipment.cargo_company}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Durum</label>
                          <p className="text-sm text-gray-900">{getStatusBadge(selectedShipment.cargo_status)}</p>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500">Cihaz Bilgileri</label>
                        <p className="text-sm text-gray-900">
                          {selectedShipment.device?.model} - {selectedShipment.device?.serialNumber}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Gönderen</label>
                          <p className="text-sm text-gray-900">
                            {selectedShipment.sender?.firstName} {selectedShipment.sender?.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{selectedShipment.sender?.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Alıcı</label>
                          <p className="text-sm text-gray-900">
                            {selectedShipment.receiver?.firstName} {selectedShipment.receiver?.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{selectedShipment.receiver?.email}</p>
                        </div>
                      </div>

                      {selectedShipment.pickup_address && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Alım Adresi</label>
                          <p className="text-sm text-gray-900">{selectedShipment.pickup_address}</p>
                        </div>
                      )}

                      {selectedShipment.delivery_address && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Teslimat Adresi</label>
                          <p className="text-sm text-gray-900">{selectedShipment.delivery_address}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Alım Tarihi</label>
                          <p className="text-sm text-gray-900">
                            {selectedShipment.pickup_date ? formatDate(selectedShipment.pickup_date) : '-'}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Teslimat Tarihi</label>
                          <p className="text-sm text-gray-900">
                            {selectedShipment.delivery_date ? formatDate(selectedShipment.delivery_date) : '-'}
                          </p>
                        </div>
                      </div>

                      {selectedShipment.notes && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Notlar</label>
                          <p className="text-sm text-gray-900">{selectedShipment.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  variant="primary"
                  onClick={() => setShowShipmentModal(false)}
                  className="w-full sm:w-auto"
                >
                  Kapat
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Shipment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowAddModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Plus className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Yeni Kargo Gönderisi
                    </h3>
                    <div className="mt-4 space-y-4">
                      <Select label="Cihaz Seçin">
                        <option value="">Cihaz seçin...</option>
                        {devices.map(device => (
                          <option key={device.id} value={device.id}>
                            {device.model} - {device.serialNumber}
                          </option>
                        ))}
                      </Select>
                      
                      <Select label="Kargo Şirketi">
                        <option value="">Kargo şirketi seçin...</option>
                        {cargoCompanies.map(company => (
                          <option key={company.id} value={company.name}>
                            {company.name}
                          </option>
                        ))}
                      </Select>
                      
                      <Input
                        label="Takip Numarası"
                        placeholder="Takip numarası girin..."
                      />
                      
                      <Input
                        label="Alım Adresi"
                        placeholder="Alım adresi..."
                      />
                      
                      <Input
                        label="Teslimat Adresi"
                        placeholder="Teslimat adresi..."
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  variant="primary"
                  onClick={() => setShowAddModal(false)}
                  className="w-full sm:w-auto mr-2"
                >
                  Gönderi Oluştur
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowAddModal(false)}
                  className="w-full sm:w-auto"
                >
                  İptal
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CargoManagementPage;
