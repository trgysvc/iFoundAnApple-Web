/**
 * İyzico Checkout Form Modal
 * İyzico'nun güvenli ödeme formunu modal içinde gösterir
 */

import { useEffect, useRef } from 'react';

interface IyzicoCheckoutModalProps {
  checkoutFormContent: string;
  token: string;
  onClose: () => void;
  onSuccess: (token: string) => void;
  onError: (error: string) => void;
}

export const IyzicoCheckoutModal = ({
  checkoutFormContent,
  token,
  onClose,
  onSuccess,
  onError
}: IyzicoCheckoutModalProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // İframe'e HTML içeriğini yükle
    if (iframeRef.current && checkoutFormContent) {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(checkoutFormContent);
        iframeDoc.close();
      }
    }

    // Ödeme callback için event listener
    const handleMessage = (event: MessageEvent) => {
      // İyzico'dan gelen mesajları dinle
      if (event.data && typeof event.data === 'string') {
        try {
          const data = JSON.parse(event.data);
          
          if (data.event === 'iyzicoCheckoutSuccess') {
            console.log('[CHECKOUT] Ödeme başarılı, token:', token);
            onSuccess(token);
          } else if (data.event === 'iyzicoCheckoutError') {
            console.error('[CHECKOUT] Ödeme hatası:', data.error);
            onError(data.error || 'Ödeme işlemi başarısız');
          }
        } catch (e) {
          // JSON parse hatası, ignore
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [checkoutFormContent, token, onSuccess, onError]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-4xl h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Güvenli Ödeme</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="Kapat"
          >
            ×
          </button>
        </div>

        {/* İframe - Checkout Form */}
        <iframe
          ref={iframeRef}
          className="w-full h-[calc(100%-60px)]"
          title="İyzico Checkout Form"
          sandbox="allow-same-origin allow-scripts allow-forms allow-top-navigation"
        />
      </div>
    </div>
  );
};

