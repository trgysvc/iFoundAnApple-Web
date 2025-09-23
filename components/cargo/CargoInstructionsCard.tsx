/**
 * Cargo Instructions Card Component
 * Provides detailed instructions for anonymous cargo shipment
 */

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  Shield, 
  Phone, 
  Copy, 
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { CargoCompany, getAvailableCargoCompanies, formatCargoFee } from '../../utils/cargoSystem';

interface CargoInstructionsCardProps {
  deviceModel: string;
  senderAnonymousId: string;
  receiverAnonymousId: string;
  cargoCompany: string;
  trackingNumber?: string;
  userRole: 'sender' | 'receiver';
  cargoFee: number;
  estimatedDelivery?: string;
  className?: string;
}

const CargoInstructionsCard: React.FC<CargoInstructionsCardProps> = ({
  deviceModel,
  senderAnonymousId,
  receiverAnonymousId,
  cargoCompany,
  trackingNumber,
  userRole,
  cargoFee,
  estimatedDelivery,
  className = ''
}) => {
  const [cargoCompanyInfo, setCargoCompanyInfo] = useState<CargoCompany | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load cargo company information
  useEffect(() => {
    const loadCargoCompanyInfo = async () => {
      const companies = await getAvailableCargoCompanies();
      const company = companies.find(c => c.code === cargoCompany);
      setCargoCompanyInfo(company || null);
    };

    loadCargoCompanyInfo();
  }, [cargoCompany]);

  // Copy ID to clipboard
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(type);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const userAnonymousId = userRole === 'sender' ? senderAnonymousId : receiverAnonymousId;
  const otherPartyId = userRole === 'sender' ? receiverAnonymousId : senderAnonymousId;

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Package className="w-5 h-5" />
          <span>Kargo Teslim Yönergeleri</span>
          <Badge variant="outline">
            {userRole === 'sender' ? 'Gönderici' : 'Alıcı'}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Anonymous ID Section */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-3">
            Anonim Kimlik Bilgileriniz
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white p-3 rounded-md">
              <div>
                <p className="font-medium text-gray-900">Sizin Kimlik Kodunuz:</p>
                <p className="text-sm text-gray-600">
                  Kargo işlemlerinde bu kodu kullanın
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="default" className="font-mono text-sm">
                  {userAnonymousId}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(userAnonymousId, 'user')}
                  className="h-8 w-8 p-0"
                >
                  {copiedId === 'user' ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {trackingNumber && (
              <div className="flex items-center justify-between bg-white p-3 rounded-md">
                <div>
                  <p className="font-medium text-gray-900">Kargo Takip Numarası:</p>
                  <p className="text-sm text-gray-600">
                    Kargo durumunu takip etmek için
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="font-mono text-sm">
                    {trackingNumber}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(trackingNumber, 'tracking')}
                    className="h-8 w-8 p-0"
                  >
                    {copiedId === 'tracking' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cargo Company Info */}
        {cargoCompanyInfo && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">
                Kargo Firması: {cargoCompanyInfo.name}
              </h4>
              <Badge variant="outline">
                {formatCargoFee(cargoFee)}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Teslimat Süresi:</span>
                <span className="font-medium">
                  {cargoCompanyInfo.standard_delivery_days} iş günü
                </span>
              </div>
              
              {estimatedDelivery && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Tahmini Teslimat:</span>
                  <span className="font-medium">{estimatedDelivery}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <Separator />

        {/* Instructions based on user role */}
        {userRole === 'sender' ? (
          <SenderInstructions
            deviceModel={deviceModel}
            anonymousId={userAnonymousId}
            cargoCompany={cargoCompanyInfo?.name || cargoCompany}
          />
        ) : (
          <ReceiverInstructions
            deviceModel={deviceModel}
            anonymousId={userAnonymousId}
            trackingNumber={trackingNumber}
            cargoCompany={cargoCompanyInfo?.name || cargoCompany}
          />
        )}

        {/* Security Notice */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Gizlilik Koruması:</strong> Kimlik bilgileriniz hiçbir zaman 
            diğer tarafla paylaşılmaz. Tüm kargo işlemleri anonim kimlik kodları 
            ile gerçekleştirilir.
          </AlertDescription>
        </Alert>

        {/* Important Notes */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-yellow-800 mb-2">
                Önemli Notlar
              </h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Cihazı orijinal kutusunda veya güvenli ambalajda gönderin</li>
                <li>• Kargo ücretini nakit olarak ödeyin (karşı ödemeli)</li>
                <li>• Anonim kimlik kodunuzu kargo görevlisine söyleyin</li>
                <li>• Kargo makbuzunu saklayın</li>
                <li>• Teslimat sonrası uygulamadan onaylayın</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Sender-specific instructions
const SenderInstructions: React.FC<{
  deviceModel: string;
  anonymousId: string;
  cargoCompany: string;
}> = ({ deviceModel, anonymousId, cargoCompany }) => (
  <div className="space-y-4">
    <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
      <Truck className="w-5 h-5" />
      <span>Gönderici Talimatları</span>
    </h4>
    
    <div className="space-y-3">
      <div className="flex items-start space-x-3">
        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-xs font-semibold text-blue-600">1</span>
        </div>
        <div>
          <p className="font-medium text-gray-900">Cihazı Hazırlayın</p>
          <p className="text-sm text-gray-600">
            {deviceModel} cihazını orijinal kutusunda veya güvenli bir ambalajda hazırlayın. 
            Cihazın çalışır durumda olduğundan emin olun.
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-xs font-semibold text-blue-600">2</span>
        </div>
        <div>
          <p className="font-medium text-gray-900">{cargoCompany} Şubesine Gidin</p>
          <p className="text-sm text-gray-600">
            En yakın {cargoCompany} şubesine gidin ve kargo göndermek istediğinizi söyleyin.
            Anonim kimlik kodunuzu (<Badge variant="outline" className="mx-1 text-xs">{anonymousId}</Badge>) 
            görevliye verin.
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-xs font-semibold text-blue-600">3</span>
        </div>
        <div>
          <p className="font-medium text-gray-900">Kargo Ücretini Ödeyin</p>
          <p className="text-sm text-gray-600">
            Kargo ücretini nakit olarak ödeyin. Kargo makbuzunu mutlaka alın ve saklayın.
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-xs font-semibold text-blue-600">4</span>
        </div>
        <div>
          <p className="font-medium text-gray-900">Takip Numarasını Bekleyin</p>
          <p className="text-sm text-gray-600">
            Kargo gönderildikten sonra takip numarası uygulamada görünecektir. 
            Bu numarayla kargo durumunu takip edebilirsiniz.
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Receiver-specific instructions
const ReceiverInstructions: React.FC<{
  deviceModel: string;
  anonymousId: string;
  trackingNumber?: string;
  cargoCompany: string;
}> = ({ deviceModel, anonymousId, trackingNumber, cargoCompany }) => (
  <div className="space-y-4">
    <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
      <MapPin className="w-5 h-5" />
      <span>Alıcı Talimatları</span>
    </h4>
    
    <div className="space-y-3">
      <div className="flex items-start space-x-3">
        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-xs font-semibold text-green-600">1</span>
        </div>
        <div>
          <p className="font-medium text-gray-900">Kargo Durumunu Takip Edin</p>
          <p className="text-sm text-gray-600">
            {trackingNumber ? (
              <>Takip numarası: <Badge variant="outline" className="mx-1 text-xs">{trackingNumber}</Badge> 
              ile kargo durumunu takip edin.</>
            ) : (
              'Kargo gönderildikten sonra takip numarası burada görünecektir.'
            )}
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-xs font-semibold text-green-600">2</span>
        </div>
        <div>
          <p className="font-medium text-gray-900">Teslimat İçin Hazır Olun</p>
          <p className="text-sm text-gray-600">
            Kargo kurye size ulaştığında, anonim kimlik kodunuzu 
            (<Badge variant="outline" className="mx-1 text-xs">{anonymousId}</Badge>) 
            söyleyin ve kimlik belgenizi gösterin.
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-xs font-semibold text-green-600">3</span>
        </div>
        <div>
          <p className="font-medium text-gray-900">Cihazı Kontrol Edin</p>
          <p className="text-sm text-gray-600">
            {deviceModel} cihazını teslim aldığınızda, çalışır durumda olduğunu 
            ve doğru cihaz olduğunu kontrol edin.
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-xs font-semibold text-green-600">4</span>
        </div>
        <div>
          <p className="font-medium text-gray-900">Teslimatı Onaylayın</p>
          <p className="text-sm text-gray-600">
            Cihazı aldıktan sonra uygulamadan teslimatı onaylayın. 
            Bu onay sonrasında bulan kişiye ödeme yapılacaktır.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default CargoInstructionsCard;
