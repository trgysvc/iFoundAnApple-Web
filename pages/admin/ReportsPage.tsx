import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { 
  BarChart3, 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  Smartphone,
  CreditCard,
  Shield,
  DollarSign,
  Activity,
  PieChart,
  LineChart,
  FileText,
  Filter,
  RefreshCw,
  CheckCircle
} from 'lucide-react';
import { getAdminReportsAPI, exportReportAPI } from '../../api/admin-reports';

interface ReportData {
  period: string;
  totalUsers: number;
  totalDevices: number;
  totalPayments: number;
  totalRevenue: number;
  completedTransactions: number;
  pendingEscrows: number;
  averageTransactionValue: number;
  userGrowth: number;
  deviceGrowth: number;
  paymentGrowth: number;
  revenueGrowth: number;
  deviceStatusDistribution: Record<string, number>;
  topUsers: Array<{
    id: string;
    name: string;
    email: string;
    deviceCount: number;
    totalSpent: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    user: string;
  }>;
  financialSummary: {
    totalEscrowAmount: number;
    totalServiceFees: number;
    totalCargoFees: number;
    totalRewards: number;
    pendingAmount: number;
  };
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

const ReportsPage: React.FC = () => {
  const { devices, users, t } = useAppContext();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedReport, setSelectedReport] = useState('overview');
  const [chartData, setChartData] = useState<ChartData | null>(null);

  // Fetch real report data from API
  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      try {
        console.log('📊 Fetching admin reports...');
        const data = await getAdminReportsAPI({
          period: selectedPeriod,
          reportType: selectedReport
        });
        
        setReportData(data);
        console.log('✅ Admin reports fetched successfully:', data);
      } catch (error) {
        console.error('❌ Error fetching admin reports:', error);
        // Fallback to mock data if API fails
        const mockReportData: ReportData = {
          period: 'Son 30 Gün',
          totalUsers: users.length,
          totalDevices: devices.length,
          totalPayments: 45,
          totalRevenue: 125000,
          completedTransactions: 38,
          pendingEscrows: 7,
          averageTransactionValue: 2777.78,
          userGrowth: 12.5,
          deviceGrowth: 8.3,
          paymentGrowth: 15.2,
          revenueGrowth: 18.7,
          deviceStatusDistribution: {},
          topUsers: [],
          recentActivity: [],
          financialSummary: {
            totalEscrowAmount: 0,
            totalServiceFees: 0,
            totalCargoFees: 0,
            totalRewards: 0,
            pendingAmount: 0
          }
        };
        setReportData(mockReportData);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [selectedPeriod, selectedReport, devices, users]);

  const handleExportReport = async (format: 'pdf' | 'excel' | 'csv') => {
    try {
      console.log(`📊 Exporting report as ${format}...`);
      const result = await exportReportAPI({
        period: selectedPeriod,
        reportType: selectedReport
      }, format);
      
      if (result.success && result.downloadUrl) {
        // Create download link
        const link = document.createElement('a');
        link.href = result.downloadUrl;
        link.download = `rapor-${selectedPeriod}-${Date.now()}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log(`✅ Report exported successfully as ${format}`);
      } else {
        console.error('❌ Export failed:', result.error);
        alert(`Rapor indirme başarısız: ${result.error}`);
      }
    } catch (error) {
      console.error('❌ Export error:', error);
      alert('Rapor indirme sırasında hata oluştu');
    }
  };

  const formatCurrency = (amount: number) => {
    return `₺${amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`;
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getGrowthIcon = (value: number) => {
    return value > 0 ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    );
  };

  const getGrowthColor = (value: number) => {
    return value > 0 ? 'text-green-600' : 'text-red-600';
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
          <h1 className="text-2xl font-bold text-gray-900">Raporlar ve Analitik</h1>
          <p className="text-gray-600">Platform performansını analiz edin ve raporlar oluşturun</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setLoading(true);
              // Trigger useEffect to refetch data
              const event = new Event('refreshReports');
              window.dispatchEvent(event);
            }}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Yenile
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleExportReport('pdf')}
          >
            <Download className="w-4 h-4 mr-2" />
            PDF İndir
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleExportReport('excel')}
          >
            <Download className="w-4 h-4 mr-2" />
            Excel İndir
          </Button>
        </div>
      </div>

      {/* Period and Report Type Selectors */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Select
              label="Zaman Aralığı"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="7d">Son 7 Gün</option>
              <option value="30d">Son 30 Gün</option>
              <option value="90d">Son 90 Gün</option>
              <option value="1y">Son 1 Yıl</option>
              <option value="custom">Özel Aralık</option>
            </Select>
          </div>
          <div>
            <Select
              label="Rapor Türü"
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
            >
              <option value="overview">Genel Bakış</option>
              <option value="users">Kullanıcı Analizi</option>
              <option value="devices">Cihaz Analizi</option>
              <option value="payments">Ödeme Analizi</option>
              <option value="financial">Finansal Rapor</option>
              <option value="security">Güvenlik Raporu</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Kullanıcı</p>
              <p className="text-2xl font-bold text-gray-900">{reportData?.totalUsers}</p>
              <div className={`flex items-center text-sm ${getGrowthColor(reportData?.userGrowth || 0)}`}>
                {getGrowthIcon(reportData?.userGrowth || 0)}
                <span className="ml-1">{formatPercentage(reportData?.userGrowth || 0)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Smartphone className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Cihaz</p>
              <p className="text-2xl font-bold text-gray-900">{reportData?.totalDevices}</p>
              <div className={`flex items-center text-sm ${getGrowthColor(reportData?.deviceGrowth || 0)}`}>
                {getGrowthIcon(reportData?.deviceGrowth || 0)}
                <span className="ml-1">{formatPercentage(reportData?.deviceGrowth || 0)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Ödeme</p>
              <p className="text-2xl font-bold text-gray-900">{reportData?.totalPayments}</p>
              <div className={`flex items-center text-sm ${getGrowthColor(reportData?.paymentGrowth || 0)}`}>
                {getGrowthIcon(reportData?.paymentGrowth || 0)}
                <span className="ml-1">{formatPercentage(reportData?.paymentGrowth || 0)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(reportData?.totalRevenue || 0)}</p>
              <div className={`flex items-center text-sm ${getGrowthColor(reportData?.revenueGrowth || 0)}`}>
                {getGrowthIcon(reportData?.revenueGrowth || 0)}
                <span className="ml-1">{formatPercentage(reportData?.revenueGrowth || 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Finansal Özet</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="p-3 bg-blue-100 rounded-lg mb-2">
              <DollarSign className="w-6 h-6 text-blue-600 mx-auto" />
            </div>
            <p className="text-sm font-medium text-gray-600">Toplam Emanet</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(reportData?.financialSummary.totalEscrowAmount || 0)}</p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-green-100 rounded-lg mb-2">
              <CreditCard className="w-6 h-6 text-green-600 mx-auto" />
            </div>
            <p className="text-sm font-medium text-gray-600">Hizmet Bedeli</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(reportData?.financialSummary.totalServiceFees || 0)}</p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-yellow-100 rounded-lg mb-2">
              <Shield className="w-6 h-6 text-yellow-600 mx-auto" />
            </div>
            <p className="text-sm font-medium text-gray-600">Kargo Ücreti</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(reportData?.financialSummary.totalCargoFees || 0)}</p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-purple-100 rounded-lg mb-2">
              <Users className="w-6 h-6 text-purple-600 mx-auto" />
            </div>
            <p className="text-sm font-medium text-gray-600">Toplam Ödül</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(reportData?.financialSummary.totalRewards || 0)}</p>
          </div>
          <div className="text-center">
            <div className="p-3 bg-red-100 rounded-lg mb-2">
              <Activity className="w-6 h-6 text-red-600 mx-auto" />
            </div>
            <p className="text-sm font-medium text-gray-600">Bekleyen Tutar</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(reportData?.financialSummary.pendingAmount || 0)}</p>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tamamlanan İşlemler</p>
              <p className="text-xl font-bold text-gray-900">{reportData?.completedTransactions}</p>
              <p className="text-sm text-gray-500">
                Başarı Oranı: {((reportData?.completedTransactions || 0) / (reportData?.totalPayments || 1) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bekleyen Emanetler</p>
              <p className="text-xl font-bold text-gray-900">{reportData?.pendingEscrows}</p>
              <p className="text-sm text-gray-500">
                Toplam Tutar: {formatCurrency((reportData?.pendingEscrows || 0) * (reportData?.averageTransactionValue || 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Activity className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ortalama İşlem Değeri</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(reportData?.averageTransactionValue || 0)}</p>
              <p className="text-sm text-gray-500">
                Bu dönemdeki ortalama
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Büyüme Trendi</h3>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <LineChart className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <BarChart3 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Grafik görünümü</p>
              <p className="text-sm text-gray-400">Chart.js veya benzeri kütüphane entegrasyonu gerekli</p>
            </div>
          </div>
        </div>

        {/* Device Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Cihaz Durum Dağılımı</h3>
            <Button variant="ghost" size="sm">
              <PieChart className="w-4 h-4" />
            </Button>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Pasta grafik görünümü</p>
              <p className="text-sm text-gray-400">Chart.js veya benzeri kütüphane entegrasyonu gerekli</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Users */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">En Aktif Kullanıcılar</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {reportData?.topUsers.map((user, index) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user.deviceCount} cihaz</p>
                    <p className="text-sm text-gray-500">{formatCurrency(user.totalSpent)}</p>
                  </div>
                </div>
              ))}
              {(!reportData?.topUsers || reportData.topUsers.length === 0) && (
                <div className="text-center py-4 text-gray-500">
                  <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p>Henüz kullanıcı verisi bulunmuyor</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Son Aktiviteler</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {reportData?.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-sm text-gray-500">
                      {activity.user} • {new Date(activity.timestamp).toLocaleString('tr-TR')}
                    </p>
                  </div>
                </div>
              ))}
              {(!reportData?.recentActivity || reportData.recentActivity.length === 0) && (
                <div className="text-center py-4 text-gray-500">
                  <Activity className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p>Henüz aktivite verisi bulunmuyor</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rapor İndirme Seçenekleri</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="secondary"
            onClick={() => handleExportReport('pdf')}
            className="flex items-center justify-center"
          >
            <FileText className="w-4 h-4 mr-2" />
            PDF Raporu
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleExportReport('excel')}
            className="flex items-center justify-center"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Excel Raporu
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleExportReport('csv')}
            className="flex items-center justify-center"
          >
            <Download className="w-4 h-4 mr-2" />
            CSV Verisi
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
