import React, { useState, useEffect } from 'react';
import { DisputeForm } from '../components/escrow/DisputeForm';
import { DisputeStatusCard } from '../components/dispute/DisputeStatusCard';
import { Button } from '../components/ui/Button';

interface TestResult {
  test: string;
  status: 'PASS' | 'FAIL' | 'PENDING';
  message: string;
  details?: any;
}

export const DisputeSystemTestPage: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [showDisputeCard, setShowDisputeCard] = useState(false);

  const testData = {
    deviceId: 'test-device-' + Date.now(),
    paymentId: 'test-payment-' + Date.now(),
    cargoShipmentId: 'test-cargo-' + Date.now(),
  };

  const mockDispute = {
    id: 'test-dispute-' + Date.now(),
    device_id: testData.deviceId,
    payment_id: testData.paymentId,
    dispute_reason: 'device_damaged',
    status: 'pending' as const,
    created_at: new Date().toISOString(),
    notes: 'Test dispute notes',
    photos: [],
    admin_notes: undefined,
    resolution: undefined,
  };

  const addTestResult = (test: string, status: 'PASS' | 'FAIL' | 'PENDING', message: string, details?: any) => {
    setTestResults(prev => [...prev, { test, status, message, details }]);
  };

  const runComponentTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    // Test 1: DisputeForm Component
    addTestResult('DisputeForm Component', 'PENDING', 'Test ediliyor...');
    
    try {
      setShowDisputeForm(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Form elementlerinin varlığını kontrol et
      const formElement = document.querySelector('form');
      const reasonSelect = document.querySelector('select');
      const notesTextarea = document.querySelector('textarea');
      const submitButton = document.querySelector('button[type="submit"]');
      
      if (formElement && reasonSelect && notesTextarea && submitButton) {
        addTestResult('DisputeForm Component', 'PASS', 'Tüm form elementleri mevcut');
      } else {
        addTestResult('DisputeForm Component', 'FAIL', 'Form elementleri eksik');
      }
    } catch (error) {
      addTestResult('DisputeForm Component', 'FAIL', `Hata: ${error}`);
    }

    // Test 2: DisputeStatusCard Component
    addTestResult('DisputeStatusCard Component', 'PENDING', 'Test ediliyor...');
    
    try {
      setShowDisputeCard(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const cardElement = document.querySelector('.bg-white.rounded-lg.shadow-md');
      const statusBadge = document.querySelector('.px-3.py-1.rounded-full');
      
      if (cardElement && statusBadge) {
        addTestResult('DisputeStatusCard Component', 'PASS', 'Kart bileşeni doğru render edildi');
      } else {
        addTestResult('DisputeStatusCard Component', 'FAIL', 'Kart bileşeni render edilemedi');
      }
    } catch (error) {
      addTestResult('DisputeStatusCard Component', 'FAIL', `Hata: ${error}`);
    }

    // Test 3: API Endpoints
    addTestResult('API Endpoints', 'PENDING', 'Test ediliyor...');
    
    try {
      // Test raise dispute API
      const response = await fetch('/api/escrow/raise-dispute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': 'test-user-id'
        },
        body: JSON.stringify({
          device_id: testData.deviceId,
          payment_id: testData.paymentId,
          cargo_shipment_id: testData.cargoShipmentId,
          dispute_reason: 'device_damaged',
          notes: 'Test dispute from frontend',
          photos: []
        })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        addTestResult('API Endpoints', 'PASS', 'Raise dispute API çalışıyor', data);
      } else {
        addTestResult('API Endpoints', 'FAIL', `API hatası: ${data.error || 'Bilinmeyen hata'}`);
      }
    } catch (error) {
      addTestResult('API Endpoints', 'FAIL', `API bağlantı hatası: ${error}`);
    }

    // Test 4: User Disputes API
    addTestResult('User Disputes API', 'PENDING', 'Test ediliyor...');
    
    try {
      const response = await fetch('/api/disputes/user-disputes', {
        headers: {
          'user-id': 'test-user-id'
        }
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        addTestResult('User Disputes API', 'PASS', `API çalışıyor, ${data.disputes?.length || 0} dispute bulundu`);
      } else {
        addTestResult('User Disputes API', 'FAIL', `API hatası: ${data.error || 'Bilinmeyen hata'}`);
      }
    } catch (error) {
      addTestResult('User Disputes API', 'FAIL', `API bağlantı hatası: ${error}`);
    }

    // Test 5: Admin Disputes API
    addTestResult('Admin Disputes API', 'PENDING', 'Test ediliyor...');
    
    try {
      const response = await fetch('/api/admin/disputes', {
        headers: {
          'user-id': 'admin-user-id'
        }
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        addTestResult('Admin Disputes API', 'PASS', `API çalışıyor, ${data.disputes?.length || 0} dispute bulundu`);
      } else {
        addTestResult('Admin Disputes API', 'FAIL', `API hatası: ${data.error || 'Bilinmeyen hata'}`);
      }
    } catch (error) {
      addTestResult('Admin Disputes API', 'FAIL', `API bağlantı hatası: ${error}`);
    }

    // Test 6: Form Validation
    addTestResult('Form Validation', 'PENDING', 'Test ediliyor...');
    
    try {
      // Submit button'un disabled olup olmadığını kontrol et (boş form)
      const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
      
      if (submitButton && submitButton.disabled) {
        addTestResult('Form Validation', 'PASS', 'Form validasyonu çalışıyor (boş form submit edilemiyor)');
      } else {
        addTestResult('Form Validation', 'FAIL', 'Form validasyonu çalışmıyor');
      }
    } catch (error) {
      addTestResult('Form Validation', 'FAIL', `Validasyon test hatası: ${error}`);
    }

    setIsRunning(false);
  };

  const clearResults = () => {
    setTestResults([]);
    setShowDisputeForm(false);
    setShowDisputeCard(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PASS': return '✅';
      case 'FAIL': return '❌';
      case 'PENDING': return '⏳';
      default: return '❓';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PASS': return 'text-green-600';
      case 'FAIL': return 'text-red-600';
      case 'PENDING': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const passedTests = testResults.filter(r => r.status === 'PASS').length;
  const failedTests = testResults.filter(r => r.status === 'FAIL').length;
  const pendingTests = testResults.filter(r => r.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dispute System Test Page</h1>
          <p className="mt-2 text-gray-600">
            Dispute/İtiraz Yönetim Sistemi test sayfası
          </p>
        </div>

        {/* Test Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Kontrolleri</h2>
          <div className="flex space-x-4">
            <Button
              onClick={runComponentTests}
              disabled={isRunning}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isRunning ? 'Testler Çalışıyor...' : 'Testleri Başlat'}
            </Button>
            <Button
              onClick={clearResults}
              className="bg-gray-600 hover:bg-gray-700 text-white"
            >
              Sonuçları Temizle
            </Button>
          </div>
        </div>

        {/* Test Results Summary */}
        {testResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Test Sonuçları Özeti</h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{passedTests}</div>
                <div className="text-sm text-gray-600">Başarılı</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{failedTests}</div>
                <div className="text-sm text-gray-600">Başarısız</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{pendingTests}</div>
                <div className="text-sm text-gray-600">Beklemede</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{testResults.length}</div>
                <div className="text-sm text-gray-600">Toplam</div>
              </div>
            </div>
          </div>
        )}

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Detaylı Test Sonuçları</h2>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{getStatusIcon(result.status)}</span>
                    <div>
                      <div className={`font-medium ${getStatusColor(result.status)}`}>
                        {result.test}
                      </div>
                      <div className="text-sm text-gray-600">{result.message}</div>
                    </div>
                  </div>
                  {result.details && (
                    <div className="text-xs text-gray-500">
                      <details>
                        <summary>Detaylar</summary>
                        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Component Tests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* DisputeForm Test */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">DisputeForm Component Test</h2>
            {showDisputeForm ? (
              <DisputeForm
                deviceId={testData.deviceId}
                paymentId={testData.paymentId}
                cargoShipmentId={testData.cargoShipmentId}
                onSuccess={() => {
                  addTestResult('DisputeForm Submit', 'PASS', 'Form başarıyla submit edildi');
                }}
                onError={(error) => {
                  addTestResult('DisputeForm Submit', 'FAIL', `Submit hatası: ${error}`);
                }}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                DisputeForm test etmek için "Testleri Başlat" butonuna tıklayın
              </div>
            )}
          </div>

          {/* DisputeStatusCard Test */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">DisputeStatusCard Component Test</h2>
            {showDisputeCard ? (
              <DisputeStatusCard
                disputeId={mockDispute.id}
                deviceId={mockDispute.device_id}
                paymentId={mockDispute.payment_id}
                disputeReason={mockDispute.dispute_reason}
                status={mockDispute.status}
                createdAt={mockDispute.created_at}
                notes={mockDispute.notes}
                photos={mockDispute.photos}
                adminNotes={mockDispute.admin_notes}
                resolution={mockDispute.resolution}
                onViewDetails={() => {
                  addTestResult('DisputeStatusCard Details', 'PASS', 'Detaylar butonu çalışıyor');
                }}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                DisputeStatusCard test etmek için "Testleri Başlat" butonuna tıklayın
              </div>
            )}
          </div>
        </div>

        {/* Test Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Test Talimatları</h2>
          <div className="text-blue-700 space-y-2">
            <p>1. <strong>"Testleri Başlat"</strong> butonuna tıklayarak otomatik testleri çalıştırın</p>
            <p>2. <strong>DisputeForm</strong> bileşenini manuel olarak test edin:</p>
            <ul className="ml-4 space-y-1">
              <li>• İtiraz nedeni seçin</li>
              <li>• Detaylı açıklama girin</li>
              <li>• Fotoğraf yükleyin (opsiyonel)</li>
              <li>• Form validasyonunu test edin</li>
            </ul>
            <p>3. <strong>DisputeStatusCard</strong> bileşenini kontrol edin:</p>
            <ul className="ml-4 space-y-1">
              <li>• Status renklerini kontrol edin</li>
              <li>• Tüm bilgilerin göründüğünü kontrol edin</li>
              <li>• "Detayları Görüntüle" butonunu test edin</li>
            </ul>
            <p>4. <strong>API testleri</strong> otomatik olarak çalışır ve sonuçları gösterilir</p>
          </div>
        </div>
      </div>
    </div>
  );
};
