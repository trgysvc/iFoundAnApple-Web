/**
 * Cargo Management Page
 * Central page for managing all cargo shipments and tracking
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import CargoTrackingCard from '../components/cargo/CargoTrackingCard';
import CargoInstructionsCard from '../components/cargo/CargoInstructionsCard';
import { 
  Package, 
  Truck, 
  Search, 
  Filter, 
  Plus, 
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { CargoShipment, CargoStatus } from '../utils/cargoSystem';

interface CargoManagementPageProps {
  className?: string;
}

const CargoManagementPage: React.FC<CargoManagementPageProps> = ({ className = '' }) => {
  const { currentUser, t } = useAppContext();
  const navigate = useNavigate();

  // State
  const [shipments, setShipments] = useState<CargoShipment[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<CargoShipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Load user's shipments
  useEffect(() => {
    const loadShipments = async () => {
      if (!currentUser) return;

      try {
        setIsLoading(true);
        setError(null);

        // TODO: Replace with actual API call
        // const userShipments = await getUserShipments(currentUser.id);
        
        // Mock data for development
        const mockShipments: CargoShipment[] = [
          {
            id: '1',
            device_id: 'device-1',
            payment_id: 'payment-1',
            cargo_company: 'aras',
            tracking_number: 'AR123456789',
            cargo_service_type: 'standard',
            estimated_delivery_days: 2,
            sender_anonymous_id: 'FND-ABC123',
            receiver_anonymous_id: 'OWN-XYZ789',
            sender_user_id: 'user-1',
            receiver_user_id: currentUser.id,
            status: 'in_transit',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            declared_value: 15000,
            cargo_fee: 25,
            delivery_confirmed_by_receiver: false
          },
          {
            id: '2',
            device_id: 'device-2',
            payment_id: 'payment-2',
            cargo_company: 'mng',
            cargo_service_type: 'express',
            estimated_delivery_days: 1,
            sender_anonymous_id: 'FND-DEF456',
            receiver_anonymous_id: 'OWN-UVW012',
            sender_user_id: currentUser.id,
            receiver_user_id: 'user-2',
            status: 'delivered',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            updated_at: new Date().toISOString(),
            delivered_at: new Date().toISOString(),
            declared_value: 8000,
            cargo_fee: 35,
            delivery_confirmed_by_receiver: true
          }
        ];

        setShipments(mockShipments);
        setFilteredShipments(mockShipments);

      } catch (error) {
        console.error('Error loading shipments:', error);
        setError('Kargo bilgileri yüklenirken hata oluştu');
      } finally {
        setIsLoading(false);
      }
    };

    loadShipments();
  }, [currentUser]);

  // Filter shipments based on search and filters
  useEffect(() => {
    let filtered = shipments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(shipment => 
        shipment.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.sender_anonymous_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.receiver_anonymous_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(shipment => shipment.status === statusFilter);
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(shipment => {
        if (roleFilter === 'sender') {
          return shipment.sender_user_id === currentUser?.id;
        } else if (roleFilter === 'receiver') {
          return shipment.receiver_user_id === currentUser?.id;
        }
        return true;
      });
    }

    setFilteredShipments(filtered);
  }, [shipments, searchTerm, statusFilter, roleFilter, currentUser]);

  // Get shipment statistics
  const getShipmentStats = () => {
    const total = shipments.length;
    const active = shipments.filter(s => !['delivered', 'cancelled', 'returned'].includes(s.status)).length;
    const delivered = shipments.filter(s => s.status === 'delivered').length;
    const pending = shipments.filter(s => ['created', 'label_printed'].includes(s.status)).length;

    return { total, active, delivered, pending };
  };

  const stats = getShipmentStats();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Giriş Gerekli
            </h3>
            <p className="text-gray-600 mb-4">
              Kargo yönetimi için giriş yapmanız gerekiyor
            </p>
            <Button onClick={() => navigate('/login')}>
              Giriş Yap
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Kargo bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/devices')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Cihazlarım</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Kargo Yönetimi
                </h1>
                <p className="text-gray-600">
                  Tüm kargo gönderilerinizi takip edin
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Package className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-gray-600">Toplam Kargo</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Truck className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                  <p className="text-gray-600">Aktif Kargo</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.delivered}</p>
                  <p className="text-gray-600">Teslim Edildi</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                  <p className="text-gray-600">Beklemede</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Filtrele ve Ara</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Takip numarası veya kimlik kodu ile ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Durum Filtresi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="created">Oluşturuldu</SelectItem>
                  <SelectItem value="picked_up">Alındı</SelectItem>
                  <SelectItem value="in_transit">Yolda</SelectItem>
                  <SelectItem value="out_for_delivery">Teslimat İçin Çıktı</SelectItem>
                  <SelectItem value="delivered">Teslim Edildi</SelectItem>
                </SelectContent>
              </Select>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Rol Filtresi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Roller</SelectItem>
                  <SelectItem value="sender">Gönderici</SelectItem>
                  <SelectItem value="receiver">Alıcı</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Shipments List */}
        {filteredShipments.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || statusFilter !== 'all' || roleFilter !== 'all'
                    ? 'Filtre kriterlerine uygun kargo bulunamadı'
                    : 'Henüz kargo gönderiniz bulunmuyor'
                  }
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== 'all' || roleFilter !== 'all'
                    ? 'Farklı filtre seçeneklerini deneyebilirsiniz'
                    : 'Cihaz eşleşmesi gerçekleştiğinde kargo süreci başlayacaktır'
                  }
                </p>
                {!searchTerm && statusFilter === 'all' && roleFilter === 'all' && (
                  <Button onClick={() => navigate('/devices')}>
                    Cihazlarıma Dön
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredShipments.map((shipment) => (
              <ShipmentCard
                key={shipment.id}
                shipment={shipment}
                currentUserId={currentUser.id}
                onViewDetails={(id) => navigate(`/cargo/${id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Individual Shipment Card Component
interface ShipmentCardProps {
  shipment: CargoShipment;
  currentUserId: string;
  onViewDetails: (id: string) => void;
}

const ShipmentCard: React.FC<ShipmentCardProps> = ({
  shipment,
  currentUserId,
  onViewDetails
}) => {
  const userRole = shipment.sender_user_id === currentUserId ? 'sender' : 'receiver';
  const userAnonymousId = userRole === 'sender' 
    ? shipment.sender_anonymous_id 
    : shipment.receiver_anonymous_id;

  const getStatusColor = (status: CargoStatus) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'out_for_delivery': return 'bg-purple-100 text-purple-800';
      case 'failed_delivery': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Package className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">
                Kargo #{shipment.id.substring(0, 8)}
              </p>
              <p className="text-sm text-gray-600">
                {new Date(shipment.created_at).toLocaleDateString('tr-TR')}
              </p>
            </div>
          </div>
          <Badge className={getStatusColor(shipment.status)}>
            {shipment.status === 'delivered' ? 'Teslim Edildi' : 
             shipment.status === 'in_transit' ? 'Yolda' :
             shipment.status === 'out_for_delivery' ? 'Teslimat İçin Çıktı' :
             shipment.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Anonim Kimlik</p>
            <p className="font-medium">{userAnonymousId}</p>
          </div>
          
          {shipment.tracking_number && (
            <div>
              <p className="text-sm text-gray-600">Takip Numarası</p>
              <p className="font-mono text-sm">{shipment.tracking_number}</p>
            </div>
          )}
          
          <div>
            <p className="text-sm text-gray-600">Rol</p>
            <Badge variant={userRole === 'sender' ? 'default' : 'secondary'}>
              {userRole === 'sender' ? 'Gönderici' : 'Alıcı'}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Kargo Firması: <span className="font-medium capitalize">{shipment.cargo_company}</span>
            </div>
            <div className="text-sm text-gray-600">
              Ücret: <span className="font-medium">{shipment.cargo_fee} TL</span>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(shipment.id)}
          >
            Detayları Gör
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CargoManagementPage;
