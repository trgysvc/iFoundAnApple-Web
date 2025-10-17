/**
 * 3D Secure Payment Integration Example
 * How to integrate 3D Secure payments into your existing payment flow
 */

import {
  initiate3DSecurePayment,
  Payment3DSecureData,
} from "../utils/frontend3DSecure";

// Example: How to integrate 3D Secure payment into your payment component
export const PaymentIntegrationExample = () => {
  const handlePayment = async (paymentData: {
    deviceId: string;
    amount: number;
    buyerInfo: any;
    cardInfo: any;
  }) => {
    try {
      // Prepare 3D Secure payment data
      const securePaymentData: Payment3DSecureData = {
        amount: paymentData.amount,
        currency: "TRY",
        conversationId: `payment_${Date.now()}`, // Unique conversation ID
        deviceId: paymentData.deviceId,
        buyerInfo: {
          id: paymentData.buyerInfo.id,
          name: paymentData.buyerInfo.name,
          surname: paymentData.buyerInfo.surname,
          email: paymentData.buyerInfo.email,
          phone: paymentData.buyerInfo.phone,
          identityNumber: paymentData.buyerInfo.identityNumber || "11111111111",
          city: paymentData.buyerInfo.city,
          country: paymentData.buyerInfo.country || "Turkey",
          address: paymentData.buyerInfo.address,
          zipCode: paymentData.buyerInfo.zipCode,
        },
        shippingAddress: {
          contactName: `${paymentData.buyerInfo.name} ${paymentData.buyerInfo.surname}`,
          city: paymentData.buyerInfo.city,
          country: paymentData.buyerInfo.country || "Turkey",
          address: paymentData.buyerInfo.address,
          zipCode: paymentData.buyerInfo.zipCode,
        },
        billingAddress: {
          contactName: `${paymentData.buyerInfo.name} ${paymentData.buyerInfo.surname}`,
          city: paymentData.buyerInfo.city,
          country: paymentData.buyerInfo.country || "Turkey",
          address: paymentData.buyerInfo.address,
          zipCode: paymentData.buyerInfo.zipCode,
        },
        basketItems: [
          {
            id: paymentData.deviceId,
            name: "Device Recovery Service",
            category1: "Electronics",
            category2: "Mobile Device",
            itemType: "PHYSICAL",
            price: paymentData.amount,
          },
        ],
        cardInfo: {
          cardNumber: paymentData.cardInfo.cardNumber,
          expiryMonth: paymentData.cardInfo.expiryMonth,
          expiryYear: paymentData.cardInfo.expiryYear,
          cvc: paymentData.cardInfo.cvc,
          cardHolderName: paymentData.cardInfo.cardHolderName,
        },
      };

      // Initiate 3D Secure payment
      const result = await initiate3DSecurePayment(securePaymentData);

      if (result.success) {
        console.log("Payment initiated successfully:", result);
        // User will be redirected to 3D Secure page automatically
        // After verification, they'll be redirected back to your callback page
      } else {
        console.error("Payment failed:", result.errorMessage);
        // Handle payment failure
      }
    } catch (error) {
      console.error("Payment error:", error);
      // Handle error
    }
  };

  return null; // This is just an example component
};

/**
 * Usage in your existing payment component:
 *
 * 1. Import the utility:
 *    import { initiate3DSecurePayment, Payment3DSecureData } from '../utils/frontend3DSecure';
 *
 * 2. Prepare your payment data:
 *    const paymentData: Payment3DSecureData = {
 *      amount: 100,
 *      currency: 'TRY',
 *      conversationId: `payment_${Date.now()}`,
 *      deviceId: 'device-123',
 *      buyerInfo: { ... },
 *      shippingAddress: { ... },
 *      billingAddress: { ... },
 *      basketItems: [ ... ],
 *      cardInfo: { ... }
 *    };
 *
 * 3. Call the payment function:
 *    const result = await initiate3DSecurePayment(paymentData);
 *
 * 4. Handle the result:
 *    if (result.success) {
 *      // User will be redirected to 3D Secure page
 *      // After verification, they'll return to your callback page
 *    } else {
 *      // Handle payment failure
 *    }
 *
 * 5. Handle the callback in your PaymentCallbackPage:
 *    - The callback URL is automatically set to: /api/webhooks/iyzico-3d-callback
 *    - After 3D Secure verification, user is redirected to: /payment/callback
 *    - You can check the payment status in your PaymentCallbackPage component
 */
