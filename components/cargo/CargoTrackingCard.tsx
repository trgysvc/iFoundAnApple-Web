/**
 * Cargo Tracking Card Component
 * Displays real-time cargo tracking information with timeline
 */

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Circle,
  ExternalLink,
  RefreshCw,
  Phone,
  AlertCircle
} from 'lucide-react';
import { 
  ShipmentTrackingInfo, 
  TrackingEvent, 
  CargoStatus,
  getShipmentTracking,
  getCargoTrackingUrl
} from '../../utils/cargoSystem';
import { useAppContext } from '../../contexts/AppContext.tsx';

interface CargoTrackingCardProps {
  shipmentId: string;
  userId: string;
  deviceModel: string;
  className?: string;
  onDeliveryConfirm?: () => void;
}

const CargoTrackingCard: React.FC<CargoTrackingCardProps> = ({
  shipmentId,
  userId,
  deviceModel,
  className = '',
  onDeliveryConfirm
}) => {
  const { t } = useAppContext();
  const [trackingInfo, setTrackingInfo] = useState<ShipmentTrackingInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load tracking information
  const loadTrackingInfo = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setIsRefreshing(true);
      else setIsLoading(true);
      
      setError(null);

      const info = await getShipmentTracking(shipmentId, userId);
      if (!info) {
        setError(t('cargoTrackingNotFound'));
        return;
      }

      setTrackingInfo(info);
    } catch (error) {
      console.error('Error loading tracking info:', error);
      setError(t('trackingInfoLoadError'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadTrackingInfo();
  }, [shipmentId, userId]);

  // Auto-refresh every 30 seconds for active shipments
  useEffect(() => {
    if (!trackingInfo || ['delivered', 'cancelled', 'returned'].includes(trackingInfo.status)) {
      return;
    }

    const interval = setInterval(() => {
      loadTrackingInfo(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [trackingInfo?.status]);

  // Handle external tracking
  const handleExternalTracking = async () => {
    if (!trackingInfo?.trackingNumber) return;

    const externalUrl = await getCargoTrackingUrl('aras', trackingInfo.trackingNumber);
    if (externalUrl) {
      window.open(externalUrl, '_blank');
    }
  };

  // Handle delivery confirmation
  const handleDeliveryConfirmation = () => {
    if (onDeliveryConfirm) {
      onDeliveryConfirm();
    }
  };

  if (isLoading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">{t('cargoLoadingInfo')}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button 
            onClick={() => loadTrackingInfo()} 
            variant="outline" 
            className="mt-4"
          >
            {t('tryAgain')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!trackingInfo) {
    return null;
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Package className="w-5 h-5" />
            <span>{t('cargoTracking')}</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadTrackingInfo(true)}
              disabled={isRefreshing}
              className="flex items-center space-x-1"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{t('refresh')}</span>
            </Button>
            {trackingInfo.trackingNumber && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleExternalTracking}
                className="flex items-center space-x-1"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{t('detailedTracking')}</span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">
                {t('currentStatus')}
              </h4>
              <p className="text-blue-800">
                {trackingInfo.statusDescription}
              </p>
              {trackingInfo.currentLocation && (
                <p className="text-sm text-blue-700 mt-1">
                  <MapPin className="w-3 h-3 inline mr-1" />
                  {trackingInfo.currentLocation}
                </p>
              )}
            </div>
            <StatusBadge status={trackingInfo.status} />
          </div>
        </div>

        {/* Tracking Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h5 className="font-medium text-gray-900">{t('trackingInfo')}</h5>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('anonymousId')}:</span>
                <Badge variant="outline" className="text-xs">
                  {trackingInfo.userAnonymousId}
                </Badge>
              </div>
              {trackingInfo.trackingNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('trackingNumber')}:</span>
                  <span className="font-mono text-xs">
                    {trackingInfo.trackingNumber}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">{t('yourRole')}:</span>
                <Badge variant={trackingInfo.userRole === 'sender' ? 'default' : 'secondary'}>
                  {trackingInfo.userRole === 'sender' ? t('sender') : t('receiver')}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h5 className="font-medium text-gray-900">{t('deviceInfo')}</h5>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Model:</span>
                <span className="font-medium">{deviceModel}</span>
              </div>
              {trackingInfo.estimatedDelivery && (
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('estimatedDelivery')}:</span>
                  <span className="font-medium text-green-700">
                    {trackingInfo.estimatedDelivery}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="space-y-4">
          <h5 className="font-medium text-gray-900">{t('cargoHistory')}</h5>
          <TrackingTimeline events={trackingInfo.trackingEvents} t={t} />
        </div>

        {/* Delivery Confirmation */}
        {trackingInfo.status === 'delivered' && trackingInfo.userRole === 'receiver' && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-green-800 mb-1">
                  {t('deliveryCompleted')}
                </h4>
                <p className="text-sm text-green-700">
                  {t('confirmDeliveryMessage')}
                </p>
              </div>
              <Button
                onClick={handleDeliveryConfirmation}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {t('confirmDelivery')}
              </Button>
            </div>
          </div>
        )}

        {/* Support Information */}
        <Alert>
          <Phone className="h-4 w-4" />
          <AlertDescription>
            {t('cargoSupport')}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

// Status Badge Component
const StatusBadge: React.FC<{ status: CargoStatus }> = ({ status }) => {
  const getStatusConfig = (status: CargoStatus) => {
    switch (status) {
      case 'created':
        return { color: 'bg-gray-100 text-gray-800', text: 'Oluşturuldu' };
      case 'label_printed':
        return { color: 'bg-blue-100 text-blue-800', text: 'Etiket Hazır' };
      case 'picked_up':
        return { color: 'bg-yellow-100 text-yellow-800', text: 'Alındı' };
      case 'in_transit':
        return { color: 'bg-orange-100 text-orange-800', text: 'Yolda' };
      case 'out_for_delivery':
        return { color: 'bg-purple-100 text-purple-800', text: 'Teslimat İçin Çıktı' };
      case 'delivered':
        return { color: 'bg-green-100 text-green-800', text: 'Teslim Edildi' };
      case 'failed_delivery':
        return { color: 'bg-red-100 text-red-800', text: 'Teslimat Başarısız' };
      case 'returned':
        return { color: 'bg-red-100 text-red-800', text: 'İade Edildi' };
      case 'cancelled':
        return { color: 'bg-gray-100 text-gray-800', text: 'İptal Edildi' };
      default:
        return { color: 'bg-gray-100 text-gray-800', text: status };
    }
  };

  const config = getStatusConfig(status);
  
  return (
    <Badge className={`${config.color} px-3 py-1`}>
      {config.text}
    </Badge>
  );
};

// Tracking Timeline Component
const TrackingTimeline: React.FC<{ events: TrackingEvent[], t: (key: string) => string }> = ({ events, t }) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>{t('noCargoMovement')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event, index) => (
        <div key={index} className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            {index === 0 ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-900">
                {event.description}
              </p>
              <time className="text-xs text-gray-500">
                {new Date(event.date).toLocaleDateString('tr-TR', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </time>
            </div>
            {event.location && (
              <p className="text-sm text-gray-600 flex items-center mt-1">
                <MapPin className="w-3 h-3 mr-1" />
                {event.location}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CargoTrackingCard;
