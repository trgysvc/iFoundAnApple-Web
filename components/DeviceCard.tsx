import React from 'react';
import { Link } from 'react-router-dom';
import { Device, DeviceStatus } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { Smartphone, Laptop, CheckCircle, Clock, AlertTriangle, CreditCard, Package, ChevronRight } from 'lucide-react';

interface DeviceCardProps {
  device: Device;
}

const statusConfig = {
    [DeviceStatus.LOST]: { color: 'bg-red-100 text-red-800', icon: <AlertTriangle className="w-4 h-4" /> },
    [DeviceStatus.REPORTED]: { color: 'bg-blue-100 text-blue-800', icon: <Smartphone className="w-4 h-4" /> },
    [DeviceStatus.MATCHED]: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-4 h-4" /> },
    [DeviceStatus.PAYMENT_PENDING]: { color: 'bg-yellow-100 text-yellow-800', icon: <CreditCard className="w-4 h-4" /> },
    [DeviceStatus.PAYMENT_COMPLETE]: { color: 'bg-indigo-100 text-indigo-800', icon: <Package className="w-4 h-4" /> },
    [DeviceStatus.EXCHANGE_PENDING]: { color: 'bg-purple-100 text-purple-800', icon: <Package className="w-4 h-4" /> },
    [DeviceStatus.COMPLETED]: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" /> },
};


const DeviceCard: React.FC<DeviceCardProps> = ({ device }) => {
    const { t } = useAppContext();
    const config = statusConfig[device.status];

    const getStatusText = (status: DeviceStatus): string => {
        switch (status) {
            case DeviceStatus.LOST: return t('Lost');
            case DeviceStatus.REPORTED: return t('Reported');
            case DeviceStatus.MATCHED: return t('Matched');
            case DeviceStatus.PAYMENT_PENDING: return t('PaymentPending');
            case DeviceStatus.PAYMENT_COMPLETE: return t('ExchangePending');
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
                <p className="text-sm text-brand-gray-400">{t('serialNumber')}: {device.serialNumber}</p>
                 {device.description && (
                    <p className="mt-1 text-sm text-brand-gray-500 truncate">{device.description}</p>
                )}
            </div>
        </div>
        <div className="flex items-center space-x-4">
            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.icon}
                <span>{getStatusText(device.status)}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-brand-gray-300"/>
        </div>
      </div>
    </Link>
  );
};

export default DeviceCard;
