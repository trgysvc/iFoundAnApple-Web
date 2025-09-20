/**
 * Security Dashboard Component
 * Admin dashboard for monitoring security compliance and threats
 */

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Activity,
  Lock,
  Eye,
  Download,
  RefreshCw,
  TrendingUp,
  Users,
  CreditCard,
  FileText
} from 'lucide-react';
import { 
  PCIDSSCompliance, 
  ComplianceReport, 
  SecurityCheckResult,
  generateSecuritySummary
} from '../../utils/securityCompliance';
import { getAuditStatistics, AuditStatistics } from '../../utils/auditLogger';

interface SecurityDashboardProps {
  className?: string;
}

const SecurityDashboard: React.FC<SecurityDashboardProps> = ({ className = '' }) => {
  const [complianceReport, setComplianceReport] = useState<ComplianceReport | null>(null);
  const [auditStats, setAuditStats] = useState<AuditStatistics | null>(null);
  const [securitySummary, setSecuritySummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load security data
  const loadSecurityData = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setIsRefreshing(true);
      else setIsLoading(true);
      
      setError(null);

      // Load all security data in parallel
      const [compliance, audit, summary] = await Promise.all([
        PCIDSSCompliance.generateComplianceReport(),
        getAuditStatistics(30), // Last 30 days
        generateSecuritySummary()
      ]);

      setComplianceReport(compliance);
      setAuditStats(audit);
      setSecuritySummary(summary);

    } catch (error) {
      console.error('Error loading security data:', error);
      setError('Güvenlik verileri yüklenirken hata oluştu');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadSecurityData();
  }, []);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      loadSecurityData(true);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'non_compliant': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      case 'info': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-gray-50 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Güvenlik verileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen bg-gray-50 flex items-center justify-center ${className}`}>
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
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
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Güvenlik Dashboard
                </h1>
                <p className="text-gray-600">
                  PCI DSS uyumluluk ve güvenlik izleme
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadSecurityData(true)}
                disabled={isRefreshing}
                className="flex items-center space-x-1"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Yenile</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <Download className="w-4 h-4" />
                <span>Rapor İndir</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-md ${getStatusColor(complianceReport?.overallStatus || '')}`}>
                  {complianceReport?.overallStatus === 'compliant' ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : complianceReport?.overallStatus === 'warning' ? (
                    <AlertTriangle className="w-6 h-6" />
                  ) : (
                    <XCircle className="w-6 h-6" />
                  )}
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {complianceReport?.overallStatus === 'compliant' ? 'Uyumlu' :
                     complianceReport?.overallStatus === 'warning' ? 'Uyarı' : 'Uyumsuz'}
                  </p>
                  <p className="text-gray-600">PCI DSS Durumu</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Activity className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {auditStats?.totalEvents || 0}
                  </p>
                  <p className="text-gray-600">Güvenlik Olayları</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {auditStats?.uniqueUsers || 0}
                  </p>
                  <p className="text-gray-600">Aktif Kullanıcılar</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Eye className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {securitySummary?.criticalIssues || 0}
                  </p>
                  <p className="text-gray-600">Kritik Sorunlar</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="compliance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="compliance">PCI DSS Uyumluluk</TabsTrigger>
            <TabsTrigger value="monitoring">Güvenlik İzleme</TabsTrigger>
            <TabsTrigger value="audit">Audit Logları</TabsTrigger>
            <TabsTrigger value="recommendations">Öneriler</TabsTrigger>
          </TabsList>

          {/* PCI DSS Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <ComplianceOverview report={complianceReport} />
            <ComplianceChecks checks={complianceReport?.checks || []} />
          </TabsContent>

          {/* Security Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            <SecurityMetrics auditStats={auditStats} />
            <ThreatAnalysis />
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="audit" className="space-y-6">
            <AuditLogsSummary auditStats={auditStats} />
            <RecentActivity activity={auditStats?.recentActivity || []} />
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <SecurityRecommendations recommendations={securitySummary?.recommendations || []} />
            <ComplianceActions />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Compliance Overview Component
const ComplianceOverview: React.FC<{ report: ComplianceReport | null }> = ({ report }) => {
  if (!report) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="w-5 h-5" />
          <span>PCI DSS Uyumluluk Özeti</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {report.passedChecks}
            </div>
            <div className="text-sm text-gray-600">Başarılı Kontroller</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {report.failedChecks}
            </div>
            <div className="text-sm text-gray-600">Başarısız Kontroller</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {report.warningChecks}
            </div>
            <div className="text-sm text-gray-600">Uyarı Kontrolleri</div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Son Kontrol:</span>
            <span className="font-medium">
              {new Date(report.generatedAt).toLocaleDateString('tr-TR')}
            </span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-600">Sonraki Kontrol:</span>
            <span className="font-medium">
              {new Date(report.nextReviewDate).toLocaleDateString('tr-TR')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Compliance Checks Component
const ComplianceChecks: React.FC<{ checks: SecurityCheckResult[] }> = ({ checks }) => (
  <Card>
    <CardHeader>
      <CardTitle>Detaylı Kontroller</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {checks.map((check, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {check.passed ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="font-medium">{check.message}</span>
              </div>
              <Badge className={getSeverityColor(check.level)}>
                {check.level.toUpperCase()}
              </Badge>
            </div>
            {check.recommendation && (
              <div className="text-sm text-gray-600 mt-2">
                <strong>Öneri:</strong> {check.recommendation}
              </div>
            )}
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// Security Metrics Component
const SecurityMetrics: React.FC<{ auditStats: AuditStatistics | null }> = ({ auditStats }) => {
  if (!auditStats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Olay Kategorileri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(auditStats.eventsByCategory).map(([category, count]) => (
              <div key={category} className="flex justify-between items-center">
                <span className="capitalize">{category}</span>
                <Badge variant="outline">{count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Önem Seviyeleri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(auditStats.eventsBySeverity).map(([severity, count]) => (
              <div key={severity} className="flex justify-between items-center">
                <span className="capitalize">{severity}</span>
                <Badge className={getSeverityColor(severity)}>{count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Threat Analysis Component
const ThreatAnalysis: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <AlertTriangle className="w-5 h-5" />
        <span>Tehdit Analizi</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-center py-8">
        <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Gelişmiş Tehdit Analizi
        </h3>
        <p className="text-gray-600">
          Bu özellik geliştirilme aşamasındadır. Yakında gerçek zamanlı tehdit 
          analizi ve anomali tespiti sunulacaktır.
        </p>
      </div>
    </CardContent>
  </Card>
);

// Audit Logs Summary Component
const AuditLogsSummary: React.FC<{ auditStats: AuditStatistics | null }> = ({ auditStats }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <FileText className="w-5 h-5" />
        <span>Audit Log Özeti</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">
            {auditStats?.totalEvents || 0}
          </div>
          <div className="text-sm text-gray-600">Toplam Olay</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 mb-2">
            {auditStats?.sensitiveEvents || 0}
          </div>
          <div className="text-sm text-gray-600">Hassas Olay</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">
            {auditStats?.uniqueUsers || 0}
          </div>
          <div className="text-sm text-gray-600">Benzersiz Kullanıcı</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Recent Activity Component
const RecentActivity: React.FC<{ activity: any[] }> = ({ activity }) => (
  <Card>
    <CardHeader>
      <CardTitle>Son Aktiviteler</CardTitle>
    </CardHeader>
    <CardContent>
      {activity.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Henüz aktivite bulunmuyor
        </div>
      ) : (
        <div className="space-y-3">
          {activity.slice(0, 10).map((event, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Activity className="w-4 h-4 text-gray-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {event.eventDescription}
                </p>
                <p className="text-xs text-gray-500">
                  {event.eventCategory} • {event.eventType}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

// Security Recommendations Component
const SecurityRecommendations: React.FC<{ recommendations: string[] }> = ({ recommendations }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <Lock className="w-5 h-5" />
        <span>Güvenlik Önerileri</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      {recommendations.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Tüm Güvenlik Kontrolleri Başarılı
          </h3>
          <p className="text-gray-600">
            Şu anda herhangi bir güvenlik önerisi bulunmuyor.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-900">{recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

// Compliance Actions Component
const ComplianceActions: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Uyumluluk Eylemleri</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <Button className="w-full justify-start" variant="outline">
          <FileText className="w-4 h-4 mr-2" />
          Uyumluluk Raporunu İndir
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Manuel Güvenlik Taraması Başlat
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <CreditCard className="w-4 h-4 mr-2" />
          PCI DSS Sertifikasyonu Yenile
        </Button>
      </div>
    </CardContent>
  </Card>
);

// Helper function to get severity color
const getSeverityColor = (level: string) => {
  switch (level) {
    case 'critical': return 'bg-red-100 text-red-800';
    case 'high': return 'bg-orange-100 text-orange-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-blue-100 text-blue-800';
    case 'info': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default SecurityDashboard;
