import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import LoadingSpinner from './LoadingSpinner';

interface PageLoaderProps {
  message?: string;
}

const PageLoader: React.FC<PageLoaderProps> = ({ message }) => {
  const { t } = useAppContext();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="large" />
        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          {message || t('loading')}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {t('loadingPageContent')}
        </p>
      </div>
    </div>
  );
};

export default PageLoader;
