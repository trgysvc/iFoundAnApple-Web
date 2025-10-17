/**
 * 3D Secure Payment Test Page
 * Frontend'den 3D Secure ödeme testi
 */

import React, { useState } from "react";
import {
  initiate3DSecurePayment,
  test3DSecurePayment,
  TEST_CARDS,
  Payment3DSecureData,
} from "../utils/frontend3DSecure";

const Payment3DSecureTestPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [cardType, setCardType] =
    useState<keyof typeof TEST_CARDS>("3d-secure");

  const handleTestPayment = async () => {
    setLoading(true);
    setResult(null);

    try {
      const testResult = await test3DSecurePayment(100);
      setResult(testResult);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCustomPayment = async () => {
    setLoading(true);
    setResult(null);

    try {
      const customPaymentData: Payment3DSecureData = {
        amount: 150,
        currency: "TRY",
        conversationId: `custom_3ds_${Date.now()}`,
        deviceId: "custom-device-001",
        buyerInfo: {
          id: "custom-buyer-001",
          name: "Custom",
          surname: "User",
          email: "custom@example.com",
          phone: "5555555555",
          identityNumber: "11111111111",
          city: "İstanbul",
          country: "Turkey",
          address: "Custom Mahallesi Custom Sokak No:1",
          zipCode: "34000",
        },
        shippingAddress: {
          contactName: "Custom User",
          city: "İstanbul",
          country: "Turkey",
          address: "Custom Mahallesi Custom Sokak No:1",
          zipCode: "34000",
        },
        billingAddress: {
          contactName: "Custom User",
          city: "İstanbul",
          country: "Turkey",
          address: "Custom Mahallesi Custom Sokak No:1",
          zipCode: "34000",
        },
        basketItems: [
          {
            id: "custom-device-001",
            name: "iPhone 15 Pro Max Device Recovery",
            category1: "Electronics",
            category2: "Mobile Device",
            itemType: "PHYSICAL",
            price: 150,
          },
        ],
        cardInfo: TEST_CARDS[cardType],
      };

      const customResult = await initiate3DSecurePayment(customPaymentData);
      setResult(customResult);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            3D Secure Payment Test
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Test Payment */}
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Quick Test Payment</h2>
              <p className="text-gray-600 mb-4">
                Test the 3D Secure payment with predefined test data (100 TRY)
              </p>
              <button
                onClick={handleTestPayment}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Test Payment (100 TRY)"}
              </button>
            </div>

            {/* Custom Payment */}
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Custom Payment</h2>
              <p className="text-gray-600 mb-4">
                Test with custom amount and card type
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Card Type:
                </label>
                <select
                  value={cardType}
                  onChange={(e) =>
                    setCardType(e.target.value as keyof typeof TEST_CARDS)
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="success">Success Card</option>
                  <option value="failure">Failure Card</option>
                  <option value="3d-secure">3D Secure Card</option>
                  <option value="3d-secure-success">3D Secure Success</option>
                  <option value="3d-secure-failure">3D Secure Failure</option>
                </select>
              </div>

              <button
                onClick={handleCustomPayment}
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Custom Payment (150 TRY)"}
              </button>
            </div>
          </div>

          {/* Result Display */}
          {result && (
            <div className="mt-6 border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Payment Result:</h3>
              <div
                className={`p-3 rounded ${
                  result.success
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                <pre className="whitespace-pre-wrap text-sm">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Instructions:
            </h3>
            <ul className="text-yellow-700 space-y-1">
              <li>• Click "Test Payment" for a quick test with 100 TRY</li>
              <li>• Click "Custom Payment" for a custom test with 150 TRY</li>
              <li>
                • If successful, you'll be redirected to Iyzico's 3D Secure page
              </li>
              <li>
                • Use SMS code "123456" for successful 3D Secure verification
              </li>
              <li>• Use SMS code "000000" for failed 3D Secure verification</li>
              <li>
                • After verification, you'll be redirected back to the callback
                page
              </li>
            </ul>
          </div>

          {/* Test Cards Info */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Test Cards:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                <strong>Success Card:</strong> 5528790000000008
                <br />
                <strong>Failure Card:</strong> 5528790000000016
                <br />
                <strong>3D Secure Card:</strong> 5528790000000024
              </div>
              <div>
                <strong>3D Success:</strong> 5528790000000032
                <br />
                <strong>3D Failure:</strong> 5528790000000040
                <br />
                <strong>All cards:</strong> Expiry 12/2030, CVC 123
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment3DSecureTestPage;
