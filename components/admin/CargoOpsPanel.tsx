/**
 * Cargo Ops Panel (Admin only)
 *
 * There is no real cargo carrier integration (no API, no webhooks). The
 * finder ships the device to the address ops arranges with a real carrier
 * of ops's own choosing (Aras, MNG, PTT, etc.) — the finder never sees the
 * owner's address, only their anonymous delivery code. Ops advances each
 * shipment's status here as the carrier reports it (phone, tracking page).
 *
 * "Delivered" here just means the carrier reported the package arrived —
 * it is separate from the device owner's own in-app confirmation, which is
 * what actually releases the escrowed reward. That confirmation happens on
 * the device detail page, not here.
 */
import React, { useEffect, useState } from 'react';
import apiClient from '../../utils/apiClient';
import { Package, RefreshCw } from 'lucide-react';

interface AdminCargoShipment {
  id: string;
  device_id: string;
  payment_id: string | null;
  cargo_company: string;
  tracking_number: string | null;
  status: string;
  cargo_status: string;
  code: string | null;
  cargo_fee: number;
  notes: string | null;
  created_at: string;
  device: { model: string; serialNumber: string; status: string } | null;
}

const STATUS_FLOW = ['created', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'] as const;
type FlowStatus = (typeof STATUS_FLOW)[number];

const statusLabels: Record<string, string> = {
  created: 'Teslim kodu üretildi',
  picked_up: 'Paket kargo firmasına teslim edildi',
  in_transit: 'Paket yolda',
  out_for_delivery: 'Dağıtıma çıktı',
  delivered: 'Kargo firması teslim etti (sahip onayı bekleniyor)',
  failed_delivery: 'Teslimat başarısız',
  returned: 'Bulan kişiye iade edildi',
  cancelled: 'İptal edildi',
};

const nextAction: Partial<Record<FlowStatus, { label: string; next: FlowStatus }>> = {
  created: { label: 'İşaretle: Kargoya Verildi', next: 'picked_up' },
  picked_up: { label: 'İşaretle: Yolda', next: 'in_transit' },
  in_transit: { label: 'İşaretle: Dağıtıma Çıktı', next: 'out_for_delivery' },
  out_for_delivery: { label: 'İşaretle: Teslim Edildi', next: 'delivered' },
};

type ExceptionTarget = 'failed_delivery' | 'returned' | 'cancelled';

const exceptionActions = (status: string): { label: string; target: ExceptionTarget; needsNote?: boolean }[] => {
  if (status === 'returned' || status === 'cancelled') return [];
  const actions: { label: string; target: ExceptionTarget; needsNote?: boolean }[] = [];
  if (status === 'out_for_delivery' || status === 'delivered') {
    actions.push({ label: 'Teslimat Başarısız', target: 'failed_delivery', needsNote: true });
  }
  if (status === 'failed_delivery') {
    actions.push({ label: 'Bulan Kişiye İade Et', target: 'returned' });
  }
  if (status !== 'delivered' && status !== 'failed_delivery') {
    actions.push({ label: 'İptal Et', target: 'cancelled', needsNote: true });
  }
  return actions;
};

const CargoOpsPanel: React.FC = () => {
  const [shipments, setShipments] = useState<AdminCargoShipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [carrierForm, setCarrierForm] = useState<Record<string, { company: string; tracking: string }>>({});
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

  const handleAdvanceStatus = async (deviceId: string, nextStatus: FlowStatus) => {
    const form = carrierForm[deviceId];
    try {
      setSubmittingId(deviceId);
      await apiClient.patch(`/cargo/shipments/${deviceId}/status`, {
        status: nextStatus,
        ...(form?.company ? { cargoCompany: form.company } : {}),
        ...(form?.tracking ? { trackingNumber: form.tracking } : {}),
      });
      await loadShipments();
    } catch (err) {
      console.error('Durum güncellenemedi:', err);
      setError(err instanceof Error ? err.message : 'Durum güncellenemedi');
    } finally {
      setSubmittingId(null);
    }
  };

  const handleExceptionAction = async (deviceId: string, target: ExceptionTarget, needsNote?: boolean) => {
    let note: string | undefined;
    if (needsNote) {
      const input = window.prompt('Sebep (opsiyonel, ilgili taraflara bildirimde kullanılmaz, sadece kayıt için):');
      if (input && input.trim()) note = input.trim();
    }
    try {
      setSubmittingId(deviceId);
      await apiClient.patch(`/cargo/shipments/${deviceId}/status`, {
        status: target,
        ...(note ? { note } : {}),
      });
      await loadShipments();
    } catch (err) {
      console.error('Durum güncellenemedi:', err);
      setError(err instanceof Error ? err.message : 'Durum güncellenemedi');
    } finally {
      setSubmittingId(null);
    }
  };

  const handleResolveDispute = async (deviceId: string, resolution: 'confirmed' | 'returned') => {
    try {
      setSubmittingId(deviceId);
      await apiClient.patch(`/cargo/shipments/${deviceId}/resolve-dispute`, { resolution });
      await loadShipments();
    } catch (err) {
      console.error('Anlaşmazlık çözülemedi:', err);
      setError(err instanceof Error ? err.message : 'Anlaşmazlık çözülemedi');
    } finally {
      setSubmittingId(null);
    }
  };

  const handleReleaseEscrow = async (shipment: AdminCargoShipment) => {
    try {
      setSubmittingId(shipment.device_id);
      await apiClient.patch(`/cargo/shipments/${shipment.device_id}/admin-release-escrow`, {});
      await loadShipments();
    } catch (err) {
      console.error('Escrow serbest bırakılamadı:', err);
      setError(err instanceof Error ? err.message : 'Escrow serbest bırakılamadı');
    } finally {
      setSubmittingId(null);
    }
  };

  const disputedShipments = shipments.filter((s) => s.device?.status === 'disputed');
  const pendingEscrowShipments = shipments.filter((s) => s.device?.status === 'confirmed');

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
        oluşturduğunuz gönderiye teslim eder; kargo firmasından aldığınız durum bilgisini
        aşağıdan işleyin. "Teslim edildi" cihaz sahibinin ödülün serbest kalmasını tetikleyen
        kendi onayından ayrıdır — burada sadece kargo firmasının teslimat bilgisini kaydedersiniz.
      </p>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm p-3 rounded mb-4">{error}</div>
      )}

      {disputedShipments.length > 0 && (
        <div className="mb-6 border border-red-200 rounded-lg overflow-hidden">
          <div className="bg-red-50 px-4 py-3">
            <h3 className="text-red-800 font-semibold">Anlaşmazlıklar ({disputedShipments.length})</h3>
            <p className="text-red-700 text-sm mt-1">
              Cihaz sahibi teslim aldığı cihazla ilgili itirazda bulundu. Durumu inceleyip (telefon, fotoğraf vb.)
              aşağıdan çözün.
            </p>
          </div>
          <table className="w-full text-sm text-left text-brand-gray-500">
            <tbody>
              {disputedShipments.map((shipment) => (
                <tr key={`dispute-${shipment.id}`} className="bg-white border-b align-top">
                  <td className="px-4 py-3 font-medium text-brand-gray-900 whitespace-nowrap">
                    {shipment.device?.model || shipment.device_id.substring(0, 8)}
                    {shipment.device?.serialNumber && (
                      <div className="text-xs text-brand-gray-400">
                        {shipment.device.serialNumber.substring(0, 8)}...
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 max-w-md">{shipment.notes || 'Sebep belirtilmemiş'}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleResolveDispute(shipment.device_id, 'confirmed')}
                        disabled={submittingId === shipment.device_id}
                        className="bg-green-600 text-white text-sm px-3 py-1.5 rounded disabled:opacity-50 whitespace-nowrap"
                      >
                        Onayla (Teslim Alındı Sayılsın)
                      </button>
                      <button
                        onClick={() => handleResolveDispute(shipment.device_id, 'returned')}
                        disabled={submittingId === shipment.device_id}
                        className="bg-red-50 text-red-700 border border-red-200 text-sm px-3 py-1.5 rounded disabled:opacity-50 whitespace-nowrap hover:bg-red-100"
                      >
                        Bulan Kişiye İade Et
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pendingEscrowShipments.length > 0 && (
        <div className="mb-6 border border-amber-200 rounded-lg overflow-hidden">
          <div className="bg-amber-50 px-4 py-3">
            <h3 className="text-amber-800 font-semibold">
              Escrow Serbest Bırakma Bekliyor ({pendingEscrowShipments.length})
            </h3>
            <p className="text-amber-700 text-sm mt-1">
              Sahip teslim aldığını onayladı ama escrow otomatik serbest bırakılmadı (hata oluşmuş olabilir).
              Elle serbest bırakabilirsiniz.
            </p>
          </div>
          <table className="w-full text-sm text-left text-brand-gray-500">
            <tbody>
              {pendingEscrowShipments.map((shipment) => (
                <tr key={`escrow-${shipment.id}`} className="bg-white border-b align-top">
                  <td className="px-4 py-3 font-medium text-brand-gray-900 whitespace-nowrap">
                    {shipment.device?.model || shipment.device_id.substring(0, 8)}
                    {shipment.device?.serialNumber && (
                      <div className="text-xs text-brand-gray-400">
                        {shipment.device.serialNumber.substring(0, 8)}...
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleReleaseEscrow(shipment)}
                      disabled={submittingId === shipment.device_id}
                      className="bg-green-600 text-white text-sm px-3 py-1.5 rounded disabled:opacity-50 whitespace-nowrap"
                    >
                      {submittingId === shipment.device_id ? 'Serbest bırakılıyor...' : 'Escrow Serbest Bırak'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
                <th className="px-4 py-3">Kargo Firması / Takip No (isteğe bağlı)</th>
                <th className="px-4 py-3">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment) => {
                const form = carrierForm[shipment.device_id] || { company: '', tracking: '' };
                const action = nextAction[shipment.status as FlowStatus];
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
                    <td className="px-4 py-3 font-mono">{shipment.code || '-'}</td>
                    <td className="px-4 py-3">{statusLabels[shipment.status] || shipment.status}</td>
                    <td className="px-4 py-3">
                      {shipment.cargo_company && shipment.cargo_company !== 'pending' ? (
                        <div>
                          <div className="font-medium text-brand-gray-900">{shipment.cargo_company}</div>
                          {shipment.tracking_number && (
                            <div className="font-mono text-xs">{shipment.tracking_number}</div>
                          )}
                        </div>
                      ) : action ? (
                        <div className="flex flex-col gap-2 min-w-[220px]">
                          <input
                            type="text"
                            placeholder="Kargo firması (örn: Aras Kargo)"
                            value={form.company}
                            onChange={(e) =>
                              setCarrierForm((prev) => ({
                                ...prev,
                                [shipment.device_id]: { ...form, company: e.target.value },
                              }))
                            }
                            className="border rounded px-2 py-1 text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Takip numarası"
                            value={form.tracking}
                            onChange={(e) =>
                              setCarrierForm((prev) => ({
                                ...prev,
                                [shipment.device_id]: { ...form, tracking: e.target.value },
                              }))
                            }
                            className="border rounded px-2 py-1 text-sm"
                          />
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {action && (
                          <button
                            onClick={() => handleAdvanceStatus(shipment.device_id, action.next)}
                            disabled={submittingId === shipment.device_id}
                            className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded disabled:opacity-50 whitespace-nowrap"
                          >
                            {submittingId === shipment.device_id ? 'Kaydediliyor...' : action.label}
                          </button>
                        )}
                        {exceptionActions(shipment.status).map((ex) => (
                          <button
                            key={ex.target}
                            onClick={() => handleExceptionAction(shipment.device_id, ex.target, ex.needsNote)}
                            disabled={submittingId === shipment.device_id}
                            className="bg-red-50 text-red-700 border border-red-200 text-sm px-3 py-1.5 rounded disabled:opacity-50 whitespace-nowrap hover:bg-red-100"
                          >
                            {ex.label}
                          </button>
                        ))}
                      </div>
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
