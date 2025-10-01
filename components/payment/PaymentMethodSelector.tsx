import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext.tsx';

export type PaymentProvider = 'iyzico' | 'stripe' | 'test';

export interface PaymentMethod {
  id: PaymentProvider;
  name: string;
  description: string;
  icon: string;
  fees: string;
  processingTime: string;
  isRecommended?: boolean;
  isEnabled: boolean;
}

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentProvider;
  onMethodChange: (method: PaymentProvider) => void;
  className?: string;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange,
  className = ""
}) => {
  const { t } = useAppContext();
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'iyzico',
      name: 'Iyzico',
      description: t('turkeyTrustedPayment'),
      icon: '🇹🇷',
      fees: '%2.9 ' + t('commission'),
      processingTime: t('instant'),
      isRecommended: true,
      isEnabled: true
    },
    {
      id: 'stripe',
      name: 'Stripe',
      description: t('internationalSecurePayment'),
      icon: '💳',
      fees: '%2.9 ' + t('commission'),
      processingTime: t('instant'),
      isRecommended: false,
      isEnabled: true
    },
    {
      id: 'test',
      name: 'Test Modu',
      description: t('developmentTestPayment'),
      icon: '🧪',
      fees: t('free'),
      processingTime: t('instant'),
      isRecommended: false,
      isEnabled: process.env.NODE_ENV === 'development'
    }
  ];

  const enabledMethods = paymentMethods.filter(method => method.isEnabled);

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/>
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">{t('paymentMethod')}</h3>
            <p className="text-green-100 text-sm">{t('securePaymentOptions')}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {enabledMethods.map((method) => (
            <div
              key={method.id}
              className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                selectedMethod === method.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => onMethodChange(method.id)}
            >
              {/* Recommended Badge */}
              {method.isRecommended && (
                <div className="absolute -top-2 left-4">
                  <span className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    {t('recommended')}
                  </span>
                </div>
              )}

              <div className="flex items-center">
                {/* Radio Button */}
                <div className="flex-shrink-0 mr-4">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedMethod === method.id
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedMethod === method.id && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>

                {/* Method Icon */}
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                    {method.icon}
                  </div>
                </div>

                {/* Method Details */}
                <div className="flex-grow">
                  <div className="flex items-center mb-1">
                    <h4 className="text-lg font-semibold text-gray-900 mr-2">
                      {method.name}
                    </h4>
                    {selectedMethod === method.id && (
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{method.description}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                      </svg>
                      {method.processingTime}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-6-8a6 6 0 1112 0 6 6 0 01-12 0zm3-2a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H7z" clipRule="evenodd"/>
                      </svg>
                      {method.fees}
                    </div>
                  </div>
                </div>
              </div>

              {/* Method Specific Info */}
              {selectedMethod === method.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-start">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-blue-900 mb-1">
                          {method.id === 'iyzico' && t('turkeyMostTrustedPayment')}
                          {method.id === 'stripe' && t('worldStandardSecurity')}
                          {method.id === 'test' && t('developmentTestMode')}
                        </p>
                        <p className="text-xs text-blue-700 leading-relaxed">
                          {method.id === 'iyzico' && t('iyzico3DSecure')}
                          {method.id === 'stripe' && t('stripeInternational')}
                          {method.id === 'test' && t('testModeDesc')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Security Features */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">{t('securityFeatures')}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              {t('sslEncryption')}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              {t('pciCompliance')}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              {t('escrowGuarantee')}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              {t('threeDSecureVerification')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;