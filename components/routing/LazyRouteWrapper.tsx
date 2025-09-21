import React, { Suspense, useEffect } from 'react';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useAppContext } from '../../contexts/AppContext';
import { performanceMonitor } from '../../utils/performanceMonitor';

interface LazyRouteWrapperProps {
  children: React.ReactNode;
  fallbackMessage?: string;
  minHeight?: string;
  routeName?: string;
}

const LazyRouteWrapper: React.FC<LazyRouteWrapperProps> = ({ 
  children, 
  fallbackMessage,
  minHeight = 'min-h-[400px]',
  routeName
}) => {
  const { t } = useAppContext();

  // Performance monitoring
  useEffect(() => {
    if (routeName) {
      performanceMonitor.startRouteLoad(routeName);
      return () => {
        performanceMonitor.endRouteLoad(routeName);
      };
    }
  }, [routeName]);

  const fallbackComponent = (
    <div className={`flex items-center justify-center ${minHeight} bg-gray-50`}>
      <div className="text-center">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-sm text-gray-600">
          {fallbackMessage || t('loadingPageContent')}
        </p>
      </div>
    </div>
  );

  return (
    <Suspense fallback={fallbackComponent}>
      {children}
    </Suspense>
  );
};

export default LazyRouteWrapper;
