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
  Edit,
  UserPlus,
  UserMinus,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  User,
  Key,
  RefreshCw,
  Plus,
  Trash2,
  Settings
} from 'lucide-react';

interface AdminPermission {
  id: string;
  user_id: string;
  role: 'admin' | 'super_admin';
  permissions: {
    canManageUsers: boolean;
    canManageDevices: boolean;
    canManagePayments: boolean;
    canManageEscrow: boolean;
    canViewLogs: boolean;
    canManageSettings: boolean;
    canManageCargo: boolean;
    canViewReports: boolean;
  };
  granted_by: string;
  granted_at: string;
  expires_at?: string;
  is_active: boolean;
  notes?: string;
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  granter?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

const AdminPermissionsPage: React.FC = () => {
  const { users, t } = useAppContext();
  const [permissions, setPermissions] = useState<AdminPermission[]>([]);
  const [filteredPermissions, setFilteredPermissions] = useState<AdminPermission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedPermission, setSelectedPermission] = useState<AdminPermission | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Mock admin permissions data - gerçek uygulamada API'den gelecek
  useEffect(() => {
    const mockPermissions: AdminPermission[] = [
      {
        id: 'perm-1',
        user_id: users[0]?.id || 'user-1',
        role: 'super_admin',
        permissions: {
          canManageUsers: true,
          canManageDevices: true,
          canManagePayments: true,
          canManageEscrow: true,
          canViewLogs: true,
          canManageSettings: true,
          canManageCargo: true,
          canViewReports: true
        },
        granted_by: users[0]?.id || 'user-1',
        granted_at: '2024-01-01T00:00:00Z',
        is_active: true,
        notes: 'İlk super admin',
        user: {
          id: users[0]?.id || 'user-1',
          email: users[0]?.email || 'admin@example.com',
          firstName: users[0]?.firstName || 'Admin',
          lastName: users[0]?.lastName || 'User'
        },
        granter: {
          id: users[0]?.id || 'user-1',
          email: users[0]?.email || 'admin@example.com',
          firstName: users[0]?.firstName || 'Admin',
          lastName: users[0]?.lastName || 'User'
        }
      },
      {
        id: 'perm-2',
        user_id: users[1]?.id || 'user-2',
        role: 'admin',
        permissions: {
          canManageUsers: true,
          canManageDevices: true,
          canManagePayments: false,
          canManageEscrow: false,
          canViewLogs: true,
          canManageSettings: false,
          canManageCargo: true,
          canViewReports: true
        },
        granted_by: users[0]?.id || 'user-1',
        granted_at: '2024-01-15T10:00:00Z',
        expires_at: '2024-12-31T23:59:59Z',
        is_active: true,
        notes: 'Sınırlı admin yetkisi',
        user: {
          id: users[1]?.id || 'user-2',
          email: users[1]?.email || 'moderator@example.com',
          firstName: users[1]?.firstName || 'Moderator',
          lastName: users[1]?.lastName || 'User'
        },
        granter: {
          id: users[0]?.id || 'user-1',
          email: users[0]?.email || 'admin@example.com',
          firstName: users[0]?.firstName || 'Admin',
          lastName: users[0]?.lastName || 'User'
        }
      }
    ];

    setPermissions(mockPermissions);
    setFilteredPermissions(mockPermissions);
    setLoading(false);
  }, [users]);

  // Filtreleme
  useEffect(() => {
    let filtered = permissions;

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(permission => 
        permission.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Rol filtresi
    if (roleFilter !== 'all') {
      filtered = filtered.filter(permission => permission.role === roleFilter);
    }

    // Durum filtresi
    if (statusFilter !== 'all') {
      filtered = filtered.filter(permission => {
        if (statusFilter === 'active') return permission.is_active;
        if (statusFilter === 'expired') return permission.expires_at && new Date(permission.expires_at) < new Date();
        if (statusFilter === 'inactive') return !permission.is_active;
        return true;
      });
    }

    setFilteredPermissions(filtered);
  }, [searchTerm, roleFilter, statusFilter, permissions]);

  const handlePermissionAction = async (action: string, permission: AdminPermission) => {
    setActionLoading(action);
    
    try {
      // Mock API call - gerçek uygulamada API'ye istek gönderilecek
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`${action} action for permission:`, permission);
      
      // Mock status update
      if (action === 'revoke') {
        setPermissions(prev => prev.map(p => 
          p.id === permission.id 
            ? { ...p, is_active: false }
            : p
        ));
      }
      
    } catch (error) {
      console.error('Permission action failed:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handlePermissionView = (permission: AdminPermission) => {
    setSelectedPermission(permission);
    setShowPermissionModal(true);
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      'admin': { color: 'bg-blue-100 text-blue-800', icon: Shield, text: 'Admin' },
      'super_admin': { color: 'bg-purple-100 text-purple-800', icon: Key, text: 'Super Admin' }
    };

    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.admin;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const getStatusBadge = (permission: AdminPermission) => {
    if (!permission.is_active) {
      return <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">Pasif</span>;
    }
    
    if (permission.expires_at && new Date(permission.expires_at) < new Date()) {
      return <span className="px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-800 rounded-full">Süresi Dolmuş</span>;
    }
    
    return <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">Aktif</span>;
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

  const getPermissionCount = (permission: AdminPermission) => {
    return Object.values(permission.permissions).filter(Boolean).length;
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
          <h1 className="text-2xl font-bold text-gray-900">Admin Yetki Yönetimi</h1>
          <p className="text-gray-600">Admin yetkilerini yönetin ve kontrol edin</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowGrantModal(true)}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Yetki Ver
          </Button>
          <div className="text-sm text-gray-500">
            Toplam: {permissions.length} yetki
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
              <p className="text-sm font-medium text-gray-600">Toplam Admin</p>
              <p className="text-lg font-semibold text-gray-900">{permissions.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Key className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Super Admin</p>
              <p className="text-lg font-semibold text-gray-900">
                {permissions.filter(p => p.role === 'super_admin').length}
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
              <p className="text-sm font-medium text-gray-600">Aktif</p>
              <p className="text-lg font-semibold text-gray-900">
                {permissions.filter(p => p.is_active).length}
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
              <p className="text-sm font-medium text-gray-600">Süresi Dolacak</p>
              <p className="text-lg font-semibold text-gray-900">
                {permissions.filter(p => 
                  p.expires_at && 
                  new Date(p.expires_at) > new Date() && 
                  new Date(p.expires_at) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                ).length}
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
              placeholder="Email, isim, rol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Select
              label="Rol"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">Tümü</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </Select>
          </div>
          <div>
            <Select
              label="Durum"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tümü</option>
              <option value="active">Aktif</option>
              <option value="expired">Süresi Dolmuş</option>
              <option value="inactive">Pasif</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Permissions Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kullanıcı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yetkiler
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
              {filteredPermissions.map((permission) => (
                <tr key={permission.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {permission.user?.firstName} {permission.user?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {permission.user?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(permission.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {getPermissionCount(permission)}/8 yetki
                    </div>
                    <div className="text-sm text-gray-500">
                      {Object.entries(permission.permissions)
                        .filter(([_, value]) => value)
                        .map(([key, _]) => key.replace('can', '').replace(/([A-Z])/g, ' $1').trim())
                        .slice(0, 3)
                        .join(', ')}
                      {getPermissionCount(permission) > 3 && '...'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(permission)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(permission.granted_at)}
                    </div>
                    {permission.expires_at && (
                      <div className="text-xs text-gray-400">
                        Bitiş: {formatDate(permission.expires_at)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePermissionView(permission)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePermissionAction('edit', permission)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      {permission.role !== 'super_admin' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePermissionAction('revoke', permission)}
                          disabled={actionLoading === 'revoke'}
                        >
                          {actionLoading === 'revoke' ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <UserMinus className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permission Detail Modal */}
      {showPermissionModal && selectedPermission && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowPermissionModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Admin Yetki Detayları
                    </h3>
                    <div className="mt-4 space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Kullanıcı</label>
                          <p className="text-sm text-gray-900">
                            {selectedPermission.user?.firstName} {selectedPermission.user?.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{selectedPermission.user?.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Rol</label>
                          <p className="text-sm text-gray-900">{getRoleBadge(selectedPermission.role)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Durum</label>
                          <p className="text-sm text-gray-900">{getStatusBadge(selectedPermission)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Yetki Sayısı</label>
                          <p className="text-sm text-gray-900">{getPermissionCount(selectedPermission)}/8</p>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500">Yetkiler</label>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          {Object.entries(selectedPermission.permissions).map(([key, value]) => (
                            <div key={key} className="flex items-center">
                              <div className={`w-2 h-2 rounded-full mr-2 ${value ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                              <span className="text-sm text-gray-900">
                                {key.replace('can', '').replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Verilme Tarihi</label>
                          <p className="text-sm text-gray-900">{formatDate(selectedPermission.granted_at)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Bitiş Tarihi</label>
                          <p className="text-sm text-gray-900">
                            {selectedPermission.expires_at ? formatDate(selectedPermission.expires_at) : 'Süresiz'}
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-500">Yetki Veren</label>
                        <p className="text-sm text-gray-900">
                          {selectedPermission.granter?.firstName} {selectedPermission.granter?.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{selectedPermission.granter?.email}</p>
                      </div>

                      {selectedPermission.notes && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Notlar</label>
                          <p className="text-sm text-gray-900">{selectedPermission.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  variant="primary"
                  onClick={() => setShowPermissionModal(false)}
                  className="w-full sm:w-auto"
                >
                  Kapat
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grant Permission Modal */}
      {showGrantModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowGrantModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <UserPlus className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Yeni Admin Yetkisi Ver
                    </h3>
                    <div className="mt-4 space-y-4">
                      <Select label="Kullanıcı Seçin">
                        <option value="">Kullanıcı seçin...</option>
                        {users.filter(u => !permissions.some(p => p.user_id === u.id && p.is_active)).map(user => (
                          <option key={user.id} value={user.id}>
                            {user.firstName} {user.lastName} ({user.email})
                          </option>
                        ))}
                      </Select>
                      
                      <Select label="Rol">
                        <option value="">Rol seçin...</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </Select>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500">Yetkiler</label>
                        <div className="mt-2 space-y-2">
                          {[
                            { key: 'canManageUsers', label: 'Kullanıcı Yönetimi' },
                            { key: 'canManageDevices', label: 'Cihaz Yönetimi' },
                            { key: 'canManagePayments', label: 'Ödeme Yönetimi' },
                            { key: 'canManageEscrow', label: 'Emanet Yönetimi' },
                            { key: 'canViewLogs', label: 'Log Görüntüleme' },
                            { key: 'canManageSettings', label: 'Sistem Ayarları' },
                            { key: 'canManageCargo', label: 'Kargo Yönetimi' },
                            { key: 'canViewReports', label: 'Rapor Görüntüleme' }
                          ].map(permission => (
                            <div key={permission.key} className="flex items-center">
                              <input
                                type="checkbox"
                                id={permission.key}
                                className="rounded border-gray-300"
                              />
                              <label htmlFor={permission.key} className="ml-2 text-sm text-gray-700">
                                {permission.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Input
                        label="Bitiş Tarihi (Opsiyonel)"
                        type="date"
                        placeholder="Süresiz için boş bırakın"
                      />
                      
                      <Input
                        label="Notlar"
                        placeholder="Yetki hakkında notlar..."
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  variant="primary"
                  onClick={() => setShowGrantModal(false)}
                  className="w-full sm:w-auto mr-2"
                >
                  Yetki Ver
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowGrantModal(false)}
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

export default AdminPermissionsPage;
