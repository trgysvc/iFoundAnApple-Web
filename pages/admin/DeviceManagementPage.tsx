import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { DeviceStatus } from '../../types';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { supabase } from '../../utils/supabaseClient';
import { 
  Smartphone, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Calendar,
  MapPin,
  DollarSign
} from 'lucide-react';

interface DeviceWithUser {
  id: string;
  userId: string;
  model: string;
  serialNumber: string;
  status: DeviceStatus;
  color?: string;
  description?: string;
  rewardAmount?: number;
  lostDate?: string;
  lostLocation?: string;
  foundDate?: string;
  foundLocation?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

const DeviceManagementPage: React.FC = () => {
  const { users, t } = useAppContext();
  const [devicesWithUsers, setDevicesWithUsers] = useState<DeviceWithUser[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<DeviceWithUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<DeviceWithUser | null>(null);
  const [showDeviceModal, setShowDeviceModal] = useState(false);

  const fetchDevices = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('devices')
        .select('id, "userId", model, "serialNumber", status, color, description, "rewardAmount", lost_date, lost_location, found_date, found_location, created_at, updated_at')
        .order('created_at', { ascending: false })
        .limit(500);

      if (error) throw error;

      const raw = data || [];
      const mapped: DeviceWithUser[] = raw.map((d: any) => ({
        id: d.id,
        userId: d.userId,
        model: d.model,
        serialNumber: d.serialNumber,
        status: d.status as DeviceStatus,
        color: d.color || undefined,
        description: d.description || undefined,
        rewardAmount: d.rewardAmount || undefined,
        lostDate: d.lost_date || undefined,
        lostLocation: d.lost_location || undefined,
        foundDate: d.found_date || undefined,
        foundLocation: d.found_location || undefined,
        created_at: d.created_at,
        updated_at: d.updated_at,
        user: (() => {
          const u = users.find(u => u.id === d.userId);
          return u ? { id: u.id, email: u.email, firstName: u.firstName, lastName: u.lastName } : undefined;
        })()
      }));

      setDevicesWithUsers(mapped);
      setFilteredDevices(mapped);
    } catch (err) {
      console.error('Failed to fetch devices from Supabase:', err);
      setDevicesWithUsers([]);
      setFilteredDevices([]);
    } finally {
      setLoading(false);
    }
  }, [users]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  // Filtreleme
  useEffect(() => {
    let filtered = devicesWithUsers;

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(device => 
        device.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Durum filtresi
    if (statusFilter !== 'all') {
      filtered = filtered.filter(device => device.status === statusFilter);
    }

    // Tip filtresi (lost/found)
    if (typeFilter !== 'all') {
      filtered = filtered.filter(device => {
        if (typeFilter === 'lost') {
          return device.status === DeviceStatus.LOST || 
                 device.status === DeviceStatus.MATCHED ||
                 device.status === DeviceStatus.PAYMENT_PENDING ||
                 device.status === DeviceStatus.PAYMENT_COMPLETE ||
                 device.status === DeviceStatus.DELIVERED ||
                 device.status === DeviceStatus.CONFIRMED ||
                 device.status === DeviceStatus.COMPLETED;
        } else if (typeFilter === 'found') {
          return device.status === DeviceStatus.REPORTED ||
                 device.status === DeviceStatus.CARGO_SHIPPED;
        }
        return true;
      });
    }

    setFilteredDevices(filtered);
  }, [searchTerm, statusFilter, typeFilter, devicesWithUsers]);

  const handleDeviceAction = (action: string, device: DeviceWithUser) => {
    setSelectedDevice(device);
    setShowDeviceModal(true);
    console.log(`${action} action for device:`, device);
  };

  const getStatusBadge = (status: DeviceStatus) => {
    const statusConfig = {
      [DeviceStatus.LOST]: { color: 'bg-red-100 text-red-800', icon: AlertCircle, text: 'Kayıp' },
      [DeviceStatus.REPORTED]: { color: 'bg-blue-100 text-blue-800', icon: Package, text: 'Bulundu' },
      [DeviceStatus.MATCHED]: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Eşleşti' },
      [DeviceStatus.PAYMENT_PENDING]: { color: 'bg-orange-100 text-orange-800', icon: DollarSign, text: 'Ödeme Bekliyor' },
      [DeviceStatus.PAYMENT_COMPLETE]: { color: 'bg-purple-100 text-purple-800', icon: CheckCircle, text: 'Ödeme Tamamlandı' },
      [DeviceStatus.CARGO_SHIPPED]: { color: 'bg-indigo-100 text-indigo-800', icon: Truck, text: 'Kargo Gönderildi' },
      [DeviceStatus.DELIVERED]: { color: 'bg-green-100 text-green-800', icon: Package, text: 'Teslim Edildi' },
      [DeviceStatus.CONFIRMED]: { color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle, text: 'Onaylandı' },
      [DeviceStatus.COMPLETED]: { color: 'bg-gray-100 text-gray-800', icon: CheckCircle, text: 'Tamamlandı' }
    };

    const config = statusConfig[status];
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const getDeviceType = (device: DeviceWithUser) => {
    if (device.status === DeviceStatus.REPORTED || device.status === DeviceStatus.CARGO_SHIPPED) {
      return 'Bulunan';
    }
    return 'Kayıp';
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
          <h1 className="text-2xl font-bold text-gray-900">Cihaz Yönetimi</h1>
          <p className="text-gray-600">Platform cihazlarını görüntüleyin ve yönetin</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-500">
            Toplam: {devicesWithUsers.length} cihaz
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Smartphone className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Toplam Cihaz</p>
              <p className="text-lg font-semibold text-gray-900">{devicesWithUsers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Kayıp Cihaz</p>
              <p className="text-lg font-semibold text-gray-900">
                {devicesWithUsers.filter(d => d.status === DeviceStatus.LOST).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Bulunan Cihaz</p>
              <p className="text-lg font-semibold text-gray-900">
                {devicesWithUsers.filter(d => d.status === DeviceStatus.REPORTED).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Tamamlanan</p>
              <p className="text-lg font-semibold text-gray-900">
                {devicesWithUsers.filter(d => d.status === DeviceStatus.COMPLETED).length}
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
              placeholder="Model, seri no, kullanıcı..."
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
              <option value={DeviceStatus.LOST}>Kayıp</option>
              <option value={DeviceStatus.REPORTED}>Bulundu</option>
              <option value={DeviceStatus.MATCHED}>Eşleşti</option>
              <option value={DeviceStatus.PAYMENT_PENDING}>Ödeme Bekliyor</option>
              <option value={DeviceStatus.PAYMENT_COMPLETE}>Ödeme Tamamlandı</option>
              <option value={DeviceStatus.CARGO_SHIPPED}>Kargo Gönderildi</option>
              <option value={DeviceStatus.DELIVERED}>Teslim Edildi</option>
              <option value={DeviceStatus.CONFIRMED}>Onaylandı</option>
              <option value={DeviceStatus.COMPLETED}>Tamamlandı</option>
            </Select>
          </div>
          <div>
            <Select
              label="Tip"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">Tümü</option>
              <option value="lost">Kayıp Cihazlar</option>
              <option value="found">Bulunan Cihazlar</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Devices Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cihaz Bilgileri
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kullanıcı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ödül
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
              {filteredDevices.map((device) => (
                <tr key={device.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {device.model}
                        </div>
                        <div className="text-sm text-gray-500">
                          {device.serialNumber}
                        </div>
                        {device.color && (
                          <div className="text-xs text-gray-400">
                            Renk: {device.color}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {device.user?.firstName} {device.user?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {device.user?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      {getStatusBadge(device.status)}
                      <div className="text-xs text-gray-500">
                        {getDeviceType(device)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {device.rewardAmount ? (
                      <div className="text-sm font-medium text-gray-900">
                        ₺{device.rewardAmount.toLocaleString()}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">-</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(device.created_at)}
                    </div>
                    {device.lostDate && (
                      <div className="text-xs text-gray-400">
                        Kayıp: {formatDate(device.lostDate)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeviceAction('view', device)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeviceAction('edit', device)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeviceAction('delete', device)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Device Detail Modal */}
      {showDeviceModal && selectedDevice && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowDeviceModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Smartphone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Cihaz Detayları
                    </h3>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center">
                        <Smartphone className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {selectedDevice.model} - {selectedDevice.serialNumber}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {selectedDevice.user?.firstName} {selectedDevice.user?.lastName}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-900">
                          Durum: {getStatusBadge(selectedDevice.status)}
                        </span>
                      </div>
                      {selectedDevice.rewardAmount && (
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            Ödül: ₺{selectedDevice.rewardAmount.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {selectedDevice.lostLocation && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            Kayıp Yeri: {selectedDevice.lostLocation}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          Kayıt: {formatDate(selectedDevice.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  variant="primary"
                  onClick={() => setShowDeviceModal(false)}
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

export default DeviceManagementPage;
