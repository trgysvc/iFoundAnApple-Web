import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { 
  Settings, 
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Info,
  Shield,
  CreditCard,
  Mail,
  Database,
  Server,
  Globe,
  Bell,
  Lock,
  Key,
  Upload,
  Download
} from 'lucide-react';

interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    defaultLanguage: string;
    timezone: string;
    maintenanceMode: boolean;
  };
  payment: {
    defaultProvider: string;
    iyzicoApiKey: string;
    iyzicoSecretKey: string;
    iyzicoBaseUrl: string;
    stripePublishableKey: string;
    stripeSecretKey: string;
    testMode: boolean;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPass: string;
    fromEmail: string;
    fromName: string;
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    enable2FA: boolean;
    passwordMinLength: number;
    enableAuditLogs: boolean;
  };
  notifications: {
    enableEmailNotifications: boolean;
    enableSMSNotifications: boolean;
    enablePushNotifications: boolean;
    notificationRetentionDays: number;
  };
}

const SystemSettingsPage: React.FC = () => {
  const { t } = useAppContext();
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      siteName: 'iFoundAnApple',
      siteDescription: 'Kayıp Apple cihazlarını bulan kişiler ile cihaz sahiplerini buluşturan platform',
      defaultLanguage: 'tr',
      timezone: 'Europe/Istanbul',
      maintenanceMode: false
    },
    payment: {
      defaultProvider: 'iyzico',
      iyzicoApiKey: '',
      iyzicoSecretKey: '',
      iyzicoBaseUrl: 'https://sandbox-api.iyzipay.com',
      stripePublishableKey: '',
      stripeSecretKey: '',
      testMode: true
    },
    email: {
      smtpHost: '',
      smtpPort: 587,
      smtpUser: '',
      smtpPass: '',
      fromEmail: 'noreply@ifoundanapple.com',
      fromName: 'iFoundAnApple'
    },
    security: {
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      enable2FA: false,
      passwordMinLength: 8,
      enableAuditLogs: true
    },
    notifications: {
      enableEmailNotifications: true,
      enableSMSNotifications: false,
      enablePushNotifications: true,
      notificationRetentionDays: 30
    }
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const tabs = [
    { id: 'general', label: 'Genel', icon: Settings },
    { id: 'payment', label: 'Ödeme', icon: CreditCard },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'security', label: 'Güvenlik', icon: Shield },
    { id: 'notifications', label: 'Bildirimler', icon: Bell },
    { id: 'system', label: 'Sistem', icon: Server }
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      // Mock API call - gerçek uygulamada API'ye gönderilecek
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ type: 'success', text: 'Ayarlar başarıyla kaydedildi!' });
      console.log('Settings saved:', settings);
    } catch (error) {
      setMessage({ type: 'error', text: 'Ayarlar kaydedilirken hata oluştu!' });
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async (type: string) => {
    setLoading(true);
    try {
      // Mock connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMessage({ type: 'success', text: `${type} bağlantısı başarılı!` });
    } catch (error) {
      setMessage({ type: 'error', text: `${type} bağlantısı başarısız!` });
    } finally {
      setLoading(false);
    }
  };

  const handleBackup = async () => {
    setLoading(true);
    try {
      // Mock backup
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMessage({ type: 'success', text: 'Yedekleme başarıyla tamamlandı!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Yedekleme sırasında hata oluştu!' });
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = (section: keyof SystemSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Site Adı"
          value={settings.general.siteName}
          onChange={(e) => updateSettings('general', 'siteName', e.target.value)}
        />
        <Select
          label="Varsayılan Dil"
          value={settings.general.defaultLanguage}
          onChange={(e) => updateSettings('general', 'defaultLanguage', e.target.value)}
        >
          <option value="tr">Türkçe</option>
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="ja">日本語</option>
          <option value="es">Español</option>
        </Select>
      </div>
      
      <div>
        <Input
          label="Site Açıklaması"
          value={settings.general.siteDescription}
          onChange={(e) => updateSettings('general', 'siteDescription', e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Zaman Dilimi"
          value={settings.general.timezone}
          onChange={(e) => updateSettings('general', 'timezone', e.target.value)}
        >
          <option value="Europe/Istanbul">İstanbul (UTC+3)</option>
          <option value="Europe/London">Londra (UTC+0)</option>
          <option value="America/New_York">New York (UTC-5)</option>
          <option value="Asia/Tokyo">Tokyo (UTC+9)</option>
        </Select>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="maintenanceMode"
            checked={settings.general.maintenanceMode}
            onChange={(e) => updateSettings('general', 'maintenanceMode', e.target.checked)}
            className="rounded border-gray-300"
          />
          <label htmlFor="maintenanceMode" className="text-sm font-medium text-gray-700">
            Bakım Modu
          </label>
        </div>
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Varsayılan Ödeme Sağlayıcısı"
          value={settings.payment.defaultProvider}
          onChange={(e) => updateSettings('payment', 'defaultProvider', e.target.value)}
        >
          <option value="iyzico">İyzico</option>
          <option value="stripe">Stripe</option>
          <option value="test">Test Modu</option>
        </Select>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="testMode"
            checked={settings.payment.testMode}
            onChange={(e) => updateSettings('payment', 'testMode', e.target.checked)}
            className="rounded border-gray-300"
          />
          <label htmlFor="testMode" className="text-sm font-medium text-gray-700">
            Test Modu
          </label>
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">İyzico Ayarları</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="API Key"
            type="password"
            value={settings.payment.iyzicoApiKey}
            onChange={(e) => updateSettings('payment', 'iyzicoApiKey', e.target.value)}
          />
          <Input
            label="Secret Key"
            type="password"
            value={settings.payment.iyzicoSecretKey}
            onChange={(e) => updateSettings('payment', 'iyzicoSecretKey', e.target.value)}
          />
        </div>
        <div className="mt-4">
          <Input
            label="Base URL"
            value={settings.payment.iyzicoBaseUrl}
            onChange={(e) => updateSettings('payment', 'iyzicoBaseUrl', e.target.value)}
          />
        </div>
        <div className="mt-4">
          <Button
            variant="secondary"
            onClick={() => handleTestConnection('İyzico')}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Bağlantıyı Test Et
          </Button>
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Stripe Ayarları</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Publishable Key"
            value={settings.payment.stripePublishableKey}
            onChange={(e) => updateSettings('payment', 'stripePublishableKey', e.target.value)}
          />
          <Input
            label="Secret Key"
            type="password"
            value={settings.payment.stripeSecretKey}
            onChange={(e) => updateSettings('payment', 'stripeSecretKey', e.target.value)}
          />
        </div>
        <div className="mt-4">
          <Button
            variant="secondary"
            onClick={() => handleTestConnection('Stripe')}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Bağlantıyı Test Et
          </Button>
        </div>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="SMTP Host"
          value={settings.email.smtpHost}
          onChange={(e) => updateSettings('email', 'smtpHost', e.target.value)}
        />
        <Input
          label="SMTP Port"
          type="number"
          value={settings.email.smtpPort}
          onChange={(e) => updateSettings('email', 'smtpPort', parseInt(e.target.value))}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="SMTP Kullanıcı Adı"
          value={settings.email.smtpUser}
          onChange={(e) => updateSettings('email', 'smtpUser', e.target.value)}
        />
        <Input
          label="SMTP Şifre"
          type="password"
          value={settings.email.smtpPass}
          onChange={(e) => updateSettings('email', 'smtpPass', e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Gönderen Email"
          value={settings.email.fromEmail}
          onChange={(e) => updateSettings('email', 'fromEmail', e.target.value)}
        />
        <Input
          label="Gönderen Adı"
          value={settings.email.fromName}
          onChange={(e) => updateSettings('email', 'fromName', e.target.value)}
        />
      </div>
      
      <div>
        <Button
          variant="secondary"
          onClick={() => handleTestConnection('Email')}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Email Bağlantısını Test Et
        </Button>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Oturum Zaman Aşımı (dakika)"
          type="number"
          value={settings.security.sessionTimeout}
          onChange={(e) => updateSettings('security', 'sessionTimeout', parseInt(e.target.value))}
        />
        <Input
          label="Maksimum Giriş Denemesi"
          type="number"
          value={settings.security.maxLoginAttempts}
          onChange={(e) => updateSettings('security', 'maxLoginAttempts', parseInt(e.target.value))}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Minimum Şifre Uzunluğu"
          type="number"
          value={settings.security.passwordMinLength}
          onChange={(e) => updateSettings('security', 'passwordMinLength', parseInt(e.target.value))}
        />
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="enable2FA"
              checked={settings.security.enable2FA}
              onChange={(e) => updateSettings('security', 'enable2FA', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="enable2FA" className="text-sm font-medium text-gray-700">
              2FA'yı Etkinleştir
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="enableAuditLogs"
              checked={settings.security.enableAuditLogs}
              onChange={(e) => updateSettings('security', 'enableAuditLogs', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="enableAuditLogs" className="text-sm font-medium text-gray-700">
              Denetim Loglarını Etkinleştir
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="enableEmailNotifications"
            checked={settings.notifications.enableEmailNotifications}
            onChange={(e) => updateSettings('notifications', 'enableEmailNotifications', e.target.checked)}
            className="rounded border-gray-300"
          />
          <label htmlFor="enableEmailNotifications" className="text-sm font-medium text-gray-700">
            Email Bildirimlerini Etkinleştir
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="enableSMSNotifications"
            checked={settings.notifications.enableSMSNotifications}
            onChange={(e) => updateSettings('notifications', 'enableSMSNotifications', e.target.checked)}
            className="rounded border-gray-300"
          />
          <label htmlFor="enableSMSNotifications" className="text-sm font-medium text-gray-700">
            SMS Bildirimlerini Etkinleştir
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="enablePushNotifications"
            checked={settings.notifications.enablePushNotifications}
            onChange={(e) => updateSettings('notifications', 'enablePushNotifications', e.target.checked)}
            className="rounded border-gray-300"
          />
          <label htmlFor="enablePushNotifications" className="text-sm font-medium text-gray-700">
            Push Bildirimlerini Etkinleştir
          </label>
        </div>
      </div>
      
      <div>
        <Input
          label="Bildirim Saklama Süresi (gün)"
          type="number"
          value={settings.notifications.notificationRetentionDays}
          onChange={(e) => updateSettings('notifications', 'notificationRetentionDays', parseInt(e.target.value))}
        />
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Sistem İşlemleri</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Bu işlemler sistemin genel durumunu etkileyebilir. Dikkatli olun.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Veritabanı İşlemleri</h4>
          <div className="space-y-3">
            <Button
              variant="secondary"
              onClick={handleBackup}
              disabled={loading}
              className="w-full"
            >
              <Download className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Veritabanı Yedekle
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleTestConnection('Database')}
              disabled={loading}
              className="w-full"
            >
              <Database className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Veritabanı Bağlantısını Test Et
            </Button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Sistem Durumu</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Sistem Durumu</span>
              <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                Aktif
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Veritabanı</span>
              <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                Bağlı
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Ödeme Sistemi</span>
              <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                Aktif
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'payment':
        return renderPaymentSettings();
      case 'email':
        return renderEmailSettings();
      case 'security':
        return renderSecuritySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'system':
        return renderSystemSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sistem Ayarları</h1>
          <p className="text-gray-600">Platform ayarlarını yönetin ve yapılandırın</p>
        </div>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={saving}
        >
          <Save className={`w-4 h-4 mr-2 ${saving ? 'animate-spin' : ''}`} />
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 border border-green-200' :
          message.type === 'error' ? 'bg-red-50 border border-red-200' :
          'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex">
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            ) : message.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            )}
            <div className="ml-3">
              <p className={`text-sm font-medium ${
                message.type === 'success' ? 'text-green-800' :
                message.type === 'error' ? 'text-red-800' :
                'text-blue-800'
              }`}>
                {message.text}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <IconComponent className="w-4 h-4 mr-2" />
                    {tab.label}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsPage;
