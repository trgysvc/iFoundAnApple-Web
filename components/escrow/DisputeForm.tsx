import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { FileUpload } from '../ui/FileUpload';

interface DisputeFormProps {
  deviceId: string;
  paymentId: string;
  cargoShipmentId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}


export const DisputeForm: React.FC<DisputeFormProps> = ({
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

      const response = await fetch('/api/escrow/raise-dispute', {
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
        onError?.(data.error || 'İtiraz başarısız');
      }
    } catch (error) {
      console.error('Error raising dispute:', error);
      onError?.('Bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-red-600">Sorun Bildir</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Fotoğraf Yükleme */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sorun Fotoğrafları
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
                    alt={`Sorun fotoğrafı ${index + 1}`}
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

        {/* Detaylı Açıklama */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Detaylı Açıklama *
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Sorunu detaylı olarak açıklayın..."
            rows={4}
            required
          />
        </div>

        {/* Uyarı */}
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">
                <strong>Dikkat:</strong> İtirazınız alındıktan sonra admin tarafından incelenecek ve gerekli işlemler yapılacaktır. Bu süreçte emanet serbest bırakılmayacaktır.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isLoading || !notes.trim()}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? 'İtiraz Gönderiliyor...' : 'İtiraz Et'}
          </Button>
        </div>
      </form>
    </div>
  );
};


