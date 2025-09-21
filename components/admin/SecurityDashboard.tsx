/**
 * Security Dashboard Component
 * Admin dashboard for monitoring security compliance and threats
 */

import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { useAppContext } from '../../contexts/AppContext';

interface SecurityDashboardProps {
  className?: string;
}

interface SecurityMetrics {
  totalUsers: number;
  activeUsers: number;
  totalTransactions: number;
  securityIncidents: number;
  complianceScore: number;
}

const SecurityDashboard: React.FC<SecurityDashboardProps> = ({ className = '' }) => {
  const { t } = useAppContext();
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalUsers: 0,
    activeUsers: 0,
    totalTransactions: 0,
    securityIncidents: 0,
    complianceScore: 95
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading metrics
    const timer = setTimeout(() => {
      setMetrics({
        totalUsers: 1247,
        activeUsers: 89,
        totalTransactions: 3456,
        securityIncidents: 2,
        complianceScore: 95
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className={`min-h-screen bg-gray-50 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading security dashboard...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'compliance', label: 'Compliance', icon: '🛡️' },
    { id: 'monitoring', label: 'Monitoring', icon: '👁️' },
    { id: 'reports', label: 'Reports', icon: '📋' }
  ];

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Security Dashboard</h1>
          <p className="text-gray-600">Monitor security compliance and system health</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-md">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-md">
                <span className="text-2xl">📈</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.activeUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-md">
                <span className="text-2xl">💳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalTransactions.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-md ${metrics.securityIncidents === 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <span className="text-2xl">{metrics.securityIncidents === 0 ? '✅' : '⚠️'}</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Security Incidents</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.securityIncidents}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Compliance Score</h3>
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-green-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${metrics.complianceScore}%` }}
                        ></div>
                      </div>
                      <span className="ml-4 text-xl font-bold text-green-600">{metrics.complianceScore}%</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">PCI DSS Compliance Level</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">System Status</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>SSL Certificate</span>
                        <span className="text-green-600 font-medium">✓ Valid</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Firewall</span>
                        <span className="text-green-600 font-medium">✓ Active</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Encryption</span>
                        <span className="text-green-600 font-medium">✓ AES-256</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'compliance' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">PCI DSS Compliance</h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <span className="text-green-600 text-xl mr-3">✅</span>
                    <div>
                      <h4 className="font-semibold text-green-800">Compliance Status: COMPLIANT</h4>
                      <p className="text-green-700">All security requirements are met</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'monitoring' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Security Monitoring</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Recent Activity</h4>
                    <div className="space-y-2 text-sm">
                      <p>✅ User login: admin@example.com</p>
                      <p>✅ Payment processed: $150.00</p>
                      <p>✅ System backup completed</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Alerts</h4>
                    <p className="text-green-600 text-sm">No active security alerts</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Security Reports</h3>
                <div className="space-y-4">
                  <Button className="w-full md:w-auto">
                    📊 Generate Compliance Report
                  </Button>
                  <Button className="w-full md:w-auto">
                    📈 Export Security Metrics
                  </Button>
                  <Button className="w-full md:w-auto">
                    🔍 Audit Log Export
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;