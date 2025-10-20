import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { 
  Users, 
  Smartphone, 
  CreditCard, 
  Shield, 
  FileText, 
  BarChart3, 
  Settings,
  Menu,
  X,
  Home,
  LogOut,
  Bell,
  Truck,
  Key,
  UserCircle,
  AlertTriangle
} from 'lucide-react';
import Button from '../../components/ui/Button';

interface AdminNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  description: string;
}

const AdminLayout: React.FC = () => {
  const { currentUser, logout, t } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems: AdminNavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="w-5 h-5" />,
      path: '/admin',
      description: 'Genel sistem özeti'
    },
    {
      id: 'users',
      label: 'Kullanıcı Yönetimi',
      icon: <Users className="w-5 h-5" />,
      path: '/admin/users',
      description: 'Kullanıcıları yönet ve düzenle'
    },
    {
      id: 'devices',
      label: 'Cihaz Yönetimi',
      icon: <Smartphone className="w-5 h-5" />,
      path: '/admin/devices',
      description: 'Cihazları görüntüle ve yönet'
    },
    {
      id: 'payments',
      label: 'Ödeme Yönetimi',
      icon: <CreditCard className="w-5 h-5" />,
      path: '/admin/payments',
      description: 'Ödeme işlemlerini takip et'
    },
    {
      id: 'escrow',
      label: 'Emanet Yönetimi',
      icon: <Shield className="w-5 h-5" />,
      path: '/admin/escrow',
      description: 'Emanet hesaplarını yönet'
    },
    {
      id: 'cargo',
      label: 'Kargo Yönetimi',
      icon: <Truck className="w-5 h-5" />,
      path: '/admin/cargo',
      description: 'Kargo gönderilerini takip et'
    },
    {
      id: 'disputes',
      label: 'İtiraz Yönetimi',
      icon: <AlertTriangle className="w-5 h-5" />,
      path: '/admin/disputes',
      description: 'İtirazları yönet ve çöz'
    },
    {
      id: 'logs',
      label: 'Sistem Logları',
      icon: <FileText className="w-5 h-5" />,
      path: '/admin/logs',
      description: 'Sistem aktivitelerini görüntüle'
    },
    {
      id: 'reports',
      label: 'Raporlar',
      icon: <BarChart3 className="w-5 h-5" />,
      path: '/admin/reports',
      description: 'Detaylı analiz ve raporlar'
    },
    {
      id: 'permissions',
      label: 'Yetki Yönetimi',
      icon: <Key className="w-5 h-5" />,
      path: '/admin/permissions',
      description: 'Admin yetkilerini yönet'
    },
    {
      id: 'settings',
      label: 'Sistem Ayarları',
      icon: <Settings className="w-5 h-5" />,
      path: '/admin/settings',
      description: 'Platform ayarlarını yönet'
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="ml-2 text-xl font-bold text-gray-900">Admin Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* User info and logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <UserCircle className="w-5 h-5 text-gray-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{currentUser?.email}</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-600 hover:text-red-600"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Çıkış Yap
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="ml-2 text-xl font-semibold text-gray-900">
                {navItems.find(item => isActive(item.path))?.label || 'Admin Panel'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 rounded-md text-gray-400 hover:text-gray-600 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              {/* User menu */}
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <UserCircle className="w-5 h-5 text-gray-600" />
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:block">
                  {currentUser?.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
