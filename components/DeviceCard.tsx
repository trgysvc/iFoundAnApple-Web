import React from 'react';
import { Link } from 'react-router-dom';
import { Device, DeviceStatus } from '../types';
import { useAppContext } from '../contexts/AppContext.tsx';
import { Smartphone, Laptop, CheckCircle, Clock, AlertTriangle, Package, ChevronRight, ShieldCheck } from 'lucide-react';

interface DeviceCardProps {
  device: Device;
}

const statusConfigMap = {
  [DeviceStatus.LOST]: { color: 'bg-red-100 text-red-800', icon: <AlertTriangle className="w-4 h-4" /> },
  [DeviceStatus.REPORTED]: { color: 'bg-yellow-100 text-yellow-800', icon: <Smartphone className="w-4 h-4" /> },
  [DeviceStatus.MATCHED]: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-4 h-4" /> },
  [DeviceStatus.PAYMENT_PENDING]: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" /> },
  [DeviceStatus.PAYMENT_COMPLETE]: { color: 'bg-indigo-100 text-indigo-800', icon: <Package className="w-4 h-4" /> },
  ['payment_completed']: { color: 'bg-indigo-100 text-indigo-800', icon: <Package className="w-4 h-4" /> },
  [DeviceStatus.EXCHANGE_PENDING]: { color: 'bg-purple-100 text-purple-800', icon: <Package className="w-4 h-4" /> },
  [DeviceStatus.COMPLETED]: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" /> },
};

const DeviceCard: React.FC<DeviceCardProps> = ({ device }) => {
  const { t } = useAppContext();
  const isFinderPerspective = device.device_role === 'finder';
  const normalizedStatus = device.status.toLowerCase() as DeviceStatus | keyof typeof statusConfigMap;
  const config =
    statusConfigMap[normalizedStatus as DeviceStatus] ||
    statusConfigMap[DeviceStatus.LOST];

  const getStatusText = (status: DeviceStatus | string): string => {
      switch (status) {
          case DeviceStatus.LOST:
            return t('statusAwaitingMatchOwner');
          case DeviceStatus.REPORTED:
            return t('statusAwaitingMatchFinder');
          case DeviceStatus.MATCHED: return t('Matched');
          case DeviceStatus.PAYMENT_PENDING: return t('PaymentPending');
          case DeviceStatus.PAYMENT_COMPLETE: return t('PaymentComplete');
          case 'payment_completed': return 'Ödeme Alındı, Kargo Bekleniyor';
          case DeviceStatus.EXCHANGE_PENDING: return t('ExchangePending');
          case DeviceStatus.COMPLETED: return t('Completed');
          default: return status;
      }
  }

  return (
    <Link to={`/device/${device.id}`} className="block bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg hover:ring-2 hover:ring-brand-blue">
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
            {device.model.toLowerCase().includes('mac') ? <Laptop className="w-10 h-10 text-brand-gray-400 flex-shrink-0" /> : <Smartphone className="w-10 h-10 text-brand-gray-400 flex-shrink-0" />}
            <div>
                <h3 className="text-lg font-semibold text-brand-gray-600">{device.model}</h3>
                {!isFinderPerspective && (
                  <p className="text-sm text-brand-gray-400">
                    {t('serialNumber')}: {device.serialNumber}
                  </p>
                )}
                {device.description && !isFinderPerspective && (
                  <p className="mt-1 text-sm text-brand-gray-500 truncate">
                    {device.description}
                  </p>
                )}
                <div className="mt-2 inline-flex items-center space-x-2 text-xs font-medium text-brand-gray-500 bg-brand-gray-100 px-2 py-1 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-brand-blue" />
                  <span>{isFinderPerspective ? t('roleFinder') : t('roleOwner')}</span>
                </div>
            </div>
        </div>
        <div className="flex items-center space-x-4">
            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.icon}
                <span>{getStatusText(normalizedStatus as DeviceStatus)}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-brand-gray-300"/>
        </div>
      </div>
    </Link>
  );
};

export default DeviceCard;
