/**
 * Cargo Ops Panel (Admin only)
 *
 * There is no real cargo carrier integration (no API, no webhooks). The
 * finder ships the device to the address ops arranges with a real carrier
 * of ops's own choosing (Aras, MNG, PTT, etc.) — the finder never sees the
 * owner's address, only their anonymous delivery code. Once ops has a real
 * tracking number from that carrier, they enter it here so the owner can
 * see it in the app.
 */
import React, { useEffect, useState } from 'react';
import apiClient from '../../utils/apiClient';
import { Package, RefreshCw } from 'lucide-react';

interface AdminCargoShipment {
  id: string;
  device_id: string;
  cargo_company: string;
  tracking_number: string | null;
  status: string;
  cargo_code: string | null;
  cargo_fee: number;
  created_at: string;
  device: { model: string; serialNumber: string } | null;
}

const statusLabels: Record<string, string> = {
  created: 'Teslim kodu üretildi, kargoya veriliyor bekleniyor',
  picked_up: 'Takip no girildi / kargoda',
  in_transit: 'Yolda',
  delivered: 'Sahibi teslim aldı',
};

const CargoOpsPanel: React.FC = () => {
  const [shipments, setShipments] = useState<AdminCargoShipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState<Record<string, { company: string; tracking: string }>>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const loadShipments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiClient.get<AdminCargoShipment[]>('/cargo/shipments');
      setShipments(data);
    } catch (err) {
      console.error('Kargo listesi alınamadı:', err);
      setError(err instanceof Error ? err.message : 'Kargo listesi alınamadı');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadShipments();
  }, []);

  const handleSubmitTracking = async (deviceId: string) => {
    const form = formState[deviceId];
    if (!form?.company || !form?.tracking) return;

    try {
      setSubmittingId(deviceId);
      await apiClient.patch(`/cargo/shipments/${deviceId}/tracking`, {
        cargoCompany: form.company,
        trackingNumber: form.tracking,
      });
      await loadShipments();
      setFormState((prev) => ({ ...prev, [deviceId]: { company: '', tracking: '' } }));
    } catch (err) {
      console.error('Takip no gönderilemedi:', err);
      setError(err instanceof Error ? err.message : 'Takip no gönderilemedi');
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-brand-gray-600 flex items-center gap-2">
          <Package className="w-5 h-5" />
          Kargo Yönetimi
        </h2>
        <button
          onClick={loadShipments}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Yenile
        </button>
      </div>

      <p className="text-sm text-brand-gray-500 mb-4">
        Kargo firması entegrasyonu yok. Bulan kişi cihazı size ait gerçek bir kargo hesabıyla
        oluşturduğunuz gönderiye teslim eder; siz gerçek takip numarasını aşağıdan girin.
      </p>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm p-3 rounded mb-4">{error}</div>
      )}

      {isLoading ? (
        <div className="text-center py-8 text-brand-gray-500">Yükleniyor...</div>
      ) : shipments.length === 0 ? (
        <div className="text-center py-8 text-brand-gray-500">Henüz kargo kaydı yok</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-brand-gray-500">
            <thead className="text-xs text-brand-gray-700 uppercase bg-brand-gray-100">
              <tr>
                <th className="px-4 py-3">Cihaz</th>
                <th className="px-4 py-3">Teslim Kodu</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3">Kargo Firması / Takip No</th>
                <th className="px-4 py-3">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment) => {
                const needsTracking = shipment.cargo_company === 'pending';
                const form = formState[shipment.device_id] || { company: '', tracking: '' };
                return (
                  <tr key={shipment.id} className="bg-white border-b align-top">
                    <td className="px-4 py-3 font-medium text-brand-gray-900 whitespace-nowrap">
                      {shipment.device?.model || shipment.device_id.substring(0, 8)}
                      {shipment.device?.serialNumber && (
                        <div className="text-xs text-brand-gray-400">
                          {shipment.device.serialNumber.substring(0, 8)}...
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono">{shipment.cargo_code || '-'}</td>
                    <td className="px-4 py-3">{statusLabels[shipment.status] || shipment.status}</td>
                    <td className="px-4 py-3">
                      {needsTracking ? (
                        <div className="flex flex-col gap-2 min-w-[220px]">
                          <input
                            type="text"
                            placeholder="Kargo firması (örn: Aras Kargo)"
                            value={form.company}
                            onChange={(e) =>
                              setFormState((prev) => ({
                                ...prev,
                                [shipment.device_id]: { ...form, company: e.target.value },
                              }))
                            }
                            className="border rounded px-2 py-1 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Gerçek takip numarası"
                            value={form.tracking}
                            onChange={(e) =>
                              setFormState((prev) => ({
                                ...prev,
                                [shipment.device_id]: { ...form, tracking: e.target.value },
                              }))
                            }
                            className="border rounded px-2 py-1 text-sm"
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="font-medium text-brand-gray-900">{shipment.cargo_company}</div>
                          <div className="font-mono text-xs">{shipment.tracking_number}</div>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {needsTracking && (
                        <button
                          onClick={() => handleSubmitTracking(shipment.device_id)}
                          disabled={!form.company || !form.tracking || submittingId === shipment.device_id}
                          className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded disabled:opacity-50"
                        >
                          {submittingId === shipment.device_id ? 'Gönderiliyor...' : 'Kaydet'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CargoOpsPanel;
