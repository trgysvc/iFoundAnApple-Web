import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { supabase } from '../../utils/supabaseClient';
import { 
  FileText, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Info,
  Calendar,
  User,
  Smartphone,
  Shield,
  CreditCard,
  Activity,
  Database,
  Server
} from 'lucide-react';

interface LogEntry {
  id: string;
  event_type: string;
  event_category: string;
  event_action: string;
  event_severity: string;
  user_id?: string;
  session_id?: string;
  ip_address?: string;
  user_agent?: string;
  resource_type?: string;
  resource_id?: string;
  event_description: string;
  event_data?: any;
  error_details?: any;
  created_at: string;
  request_id?: string;
  correlation_id?: string;
  is_sensitive: boolean;
  environment: string;
  application_version?: string;
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

const SystemLogsPage: React.FC = () => {
  const { users, t } = useAppContext();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Supabase'ten gerçek log verilerini çek
  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('audit_logs')
        .select(`*`)
        .order('created_at', { ascending: false })
        .limit(200);

      if (severityFilter !== 'all') {
        query = query.eq('event_severity', severityFilter);
      }
      if (categoryFilter !== 'all') {
        query = query.eq('event_category', categoryFilter);
      }

      const { data, error } = await query;
      if (error) throw error;

      const logsRaw = data || [];

      // userprofile join'ı REST ile yapılamıyorsa, kullanıcı profillerini ikinci sorguda çek
      const userIds = Array.from(
        new Set(
          logsRaw
            .map((r: any) => r.user_id)
            .filter((id: string | null) => Boolean(id))
        )
      ) as string[];

      let profilesByUserId: Record<string, any> = {};
      if (userIds.length > 0) {
        const { data: profiles, error: profileErr } = await supabase
          .from('userprofile')
          .select('id, user_id, first_name, last_name, email')
          .in('user_id', userIds);
        if (profileErr) {
          console.warn('Failed to fetch user profiles for logs:', profileErr);
        } else {
          profilesByUserId = (profiles || []).reduce((acc: any, p: any) => {
            acc[p.user_id] = p;
            return acc;
          }, {});
        }
      }

      const mapped: LogEntry[] = logsRaw.map((row: any) => ({
        id: row.id,
        event_type: row.event_type,
        event_category: row.event_category,
        event_action: row.event_action,
        event_severity: row.event_severity,
        user_id: row.user_id || undefined,
        session_id: row.session_id || undefined,
        ip_address: row.ip_address || undefined,
        user_agent: row.user_agent || undefined,
        resource_type: row.resource_type || undefined,
        resource_id: row.resource_id || undefined,
        event_description: row.event_description,
        event_data: row.event_data || undefined,
        error_details: row.error_details || undefined,
        created_at: row.created_at,
        request_id: row.request_id || undefined,
        correlation_id: row.correlation_id || undefined,
        is_sensitive: Boolean(row.is_sensitive),
        environment: row.environment || 'production',
        application_version: row.application_version || undefined,
        user: row.user_id && profilesByUserId[row.user_id]
          ? {
              id: profilesByUserId[row.user_id].id,
              email: profilesByUserId[row.user_id].email,
              firstName: profilesByUserId[row.user_id].first_name || undefined,
              lastName: profilesByUserId[row.user_id].last_name || undefined,
            }
          : undefined,
      }));

      setLogs(mapped);
      setFilteredLogs(mapped);
    } catch (err) {
      console.error('Failed to fetch logs from Supabase:', err);
      setLogs([]);
      setFilteredLogs([]);
    } finally {
      setLoading(false);
    }
  }, [severityFilter, categoryFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchLogs();
    }, 30000); // 30 saniyede bir

    return () => clearInterval(interval);
  }, [autoRefresh, fetchLogs]);

  // Filtreleme
  useEffect(() => {
    let filtered = logs;

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.event_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.event_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ip_address?.includes(searchTerm)
      );
    }

    // Severity filtresi
    if (severityFilter !== 'all') {
      filtered = filtered.filter(log => log.event_severity === severityFilter);
    }

    // Category filtresi
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(log => log.event_category === categoryFilter);
    }

    setFilteredLogs(filtered);
  }, [searchTerm, severityFilter, categoryFilter, logs]);

  const handleLogView = (log: LogEntry) => {
    setSelectedLog(log);
    setShowLogModal(true);
  };

  const getSeverityBadge = (severity: string) => {
    const severityConfig = {
      'info': { color: 'bg-blue-100 text-blue-800', icon: Info, text: 'Bilgi' },
      'warning': { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, text: 'Uyarı' },
      'error': { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Hata' },
      'critical': { color: 'bg-red-200 text-red-900', icon: AlertCircle, text: 'Kritik' },
      'debug': { color: 'bg-gray-100 text-gray-800', icon: Activity, text: 'Debug' }
    };

    const config = severityConfig[severity as keyof typeof severityConfig] || severityConfig.info;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const getCategoryIcon = (category: string) => {
    const categoryIcons = {
      'authentication': User,
      'device': Smartphone,
      'payment': CreditCard,
      'security': Shield,
      'system': Server,
      'database': Database,
      'api': Activity
    };

    const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || FileText;
    return <IconComponent className="w-4 h-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
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
          <h1 className="text-2xl font-bold text-gray-900">Sistem Logları</h1>
          <p className="text-gray-600">Sistem aktivitelerini görüntüleyin ve takip edin</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={autoRefresh ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Otomatik Yenileme Açık' : 'Otomatik Yenileme'}
          </Button>
          <div className="text-sm text-gray-500">
            Toplam: {logs.length} log kaydı
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Toplam Log</p>
              <p className="text-lg font-semibold text-gray-900">{logs.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Hatalar</p>
              <p className="text-lg font-semibold text-gray-900">
                {logs.filter(l => l.event_severity === 'error' || l.event_severity === 'critical').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Uyarılar</p>
              <p className="text-lg font-semibold text-gray-900">
                {logs.filter(l => l.event_severity === 'warning').length}
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
              <p className="text-sm font-medium text-gray-600">Başarılı</p>
              <p className="text-lg font-semibold text-gray-900">
                {logs.filter(l => l.event_severity === 'info').length}
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
              placeholder="Event type, açıklama, kullanıcı..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Select
              label="Severity"
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
            >
              <option value="all">Tümü</option>
              <option value="info">Bilgi</option>
              <option value="warning">Uyarı</option>
              <option value="error">Hata</option>
              <option value="critical">Kritik</option>
              <option value="debug">Debug</option>
            </Select>
          </div>
          <div>
            <Select
              label="Kategori"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">Tümü</option>
              <option value="authentication">Kimlik Doğrulama</option>
              <option value="device">Cihaz</option>
              <option value="payment">Ödeme</option>
              <option value="security">Güvenlik</option>
              <option value="system">Sistem</option>
              <option value="database">Veritabanı</option>
              <option value="api">API</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kullanıcı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Açıklama
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
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        {getCategoryIcon(log.event_category)}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {log.event_type}
                        </div>
                        <div className="text-sm text-gray-500">
                          {log.event_action}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">
                      {log.event_category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {log.user ? (
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="w-3 h-3 text-gray-600" />
                        </div>
                        <div className="ml-2">
                          <div className="text-sm font-medium text-gray-900">
                            {log.user.firstName} {log.user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {log.user.email}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">Sistem</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getSeverityBadge(log.event_severity)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {truncateText(log.event_description, 60)}
                    </div>
                    {log.is_sensitive && (
                      <div className="text-xs text-red-600 flex items-center">
                        <Shield className="w-3 h-3 mr-1" />
                        Hassas
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(log.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLogView(log)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Detail Modal */}
      {showLogModal && selectedLog && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowLogModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Log Detayları
                    </h3>
                    <div className="mt-4 space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Event Type</label>
                          <p className="text-sm text-gray-900">{selectedLog.event_type}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Event Action</label>
                          <p className="text-sm text-gray-900">{selectedLog.event_action}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Category</label>
                          <p className="text-sm text-gray-900">{selectedLog.event_category}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Severity</label>
                          <p className="text-sm text-gray-900">{getSeverityBadge(selectedLog.event_severity)}</p>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500">Description</label>
                        <p className="text-sm text-gray-900 mt-1">{selectedLog.event_description}</p>
                      </div>

                      {selectedLog.user && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">User</label>
                          <p className="text-sm text-gray-900">
                            {selectedLog.user.firstName} {selectedLog.user.lastName} ({selectedLog.user.email})
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">IP Address</label>
                          <p className="text-sm text-gray-900">{selectedLog.ip_address || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Session ID</label>
                          <p className="text-sm text-gray-900">{selectedLog.session_id || 'N/A'}</p>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-500">Timestamp</label>
                        <p className="text-sm text-gray-900">{formatDate(selectedLog.created_at)}</p>
                      </div>

                      {selectedLog.event_data && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Event Data</label>
                          <pre className="text-xs text-gray-900 bg-gray-50 p-2 rounded mt-1 overflow-auto">
                            {JSON.stringify(selectedLog.event_data, null, 2)}
                          </pre>
                        </div>
                      )}

                      {selectedLog.error_details && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Error Details</label>
                          <pre className="text-xs text-red-900 bg-red-50 p-2 rounded mt-1 overflow-auto">
                            {JSON.stringify(selectedLog.error_details, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  variant="primary"
                  onClick={() => setShowLogModal(false)}
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

export default SystemLogsPage;
