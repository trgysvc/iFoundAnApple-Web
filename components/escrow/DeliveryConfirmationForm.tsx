import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { FileUpload } from '../ui/FileUpload';

interface DeliveryConfirmationFormProps {
  deviceId: string;
  paymentId: string;
  cargoShipmentId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const DeliveryConfirmationForm: React.FC<DeliveryConfirmationFormProps> = ({
  deviceId,
  paymentId,
  cargoShipmentId,
  onSuccess,
  onError
}) => {
  const [photos, setPhotos] = useState<File[]>([]);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePhotoUpload = (files: File[]) => {
    setPhotos(prev => [...prev, ...files]);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Fotoğrafları base64'e çevir
      const photoPromises = photos.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      const photoBase64s = await Promise.all(photoPromises);

      const response = await fetch('/api/escrow/confirm-delivery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          device_id: deviceId,
          payment_id: paymentId,
          cargo_shipment_id: cargoShipmentId,
          photos: photoBase64s,
          notes: notes
        }),
      });

      const data = await response.json();

      if (data.success) {
        onSuccess?.();
        // Form'u temizle
        setPhotos([]);
        setNotes('');
      } else {
        onError?.(data.error || 'Teslimat onayı başarısız');
      }
    } catch (error) {
      console.error('Error confirming delivery:', error);
      onError?.('Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Cihaz Teslimat Onayı</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Fotoğraf Yükleme */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cihaz Fotoğrafları
          </label>
          <FileUpload
            onUpload={handlePhotoUpload}
            accept="image/*"
            multiple
            maxFiles={5}
          />
          
          {/* Yüklenen Fotoğraflar */}
          {photos.length > 0 && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              {photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Fotoğraf ${index + 1}`}
                    className="w-full h-24 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notlar */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notlar (İsteğe bağlı)
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Cihaz hakkında ek bilgiler..."
            rows={3}
          />
        </div>

        {/* Uyarı */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-800">
                <strong>Önemli:</strong> Cihazınızı teslim aldığınızı onayladıktan sonra 48 saat içinde para otomatik olarak serbest bırakılacaktır.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isLoading || photos.length === 0}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading ? 'Onaylanıyor...' : 'Teslimat Onayla'}
          </Button>
        </div>
      </form>
    </div>
  );
};


