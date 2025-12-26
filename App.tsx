import React, { Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider, useAppContext } from "./contexts/AppContext";
import { UserRole } from "./types";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LazyRouteWrapper from "./components/routing/LazyRouteWrapper";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import {
  HomePage,
  LoginPage,
  RegisterPage,
  ResetPasswordPage,
  DashboardPage,
  AddDevicePage,
  PaymentFlowPage,
  MatchPaymentPage,
  PaymentSummaryPage,
  PaymentSuccessPage,
  PaymentProcessingPage,
  PaymentErrorPage,
  NotFoundPage,
  DeviceDetailPage,
  ProfilePage,
  AdminDashboardPage,
  FAQPage,
  TermsPage,
  PrivacyPage,
  ContactPage,
  preloadCriticalRoutes,
  preloadUserRoutes,
  preloadAdminRoutes,
  preloadStaticRoutes
} from "./utils/lazyRoutes";
import "./utils/testHelpers"; // Test helpers for browser console

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser } = useAppContext();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AdminRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser } = useAppContext();
  if (!currentUser || currentUser.role !== UserRole.ADMIN) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { currentUser } = useAppContext();

  // Preload routes based on user state
  useEffect(() => {
    // Always preload critical routes
    preloadCriticalRoutes();

    // Preload user-specific routes if logged in
    if (currentUser) {
      preloadUserRoutes();
      
      // Preload admin routes if user is admin
      if (currentUser.role === UserRole.ADMIN) {
        preloadAdminRoutes();
      }
    }

    // Preload static pages with delay (low priority)
    const staticTimeout = setTimeout(() => {
      preloadStaticRoutes();
    }, 2000); // 2 second delay

    return () => clearTimeout(staticTimeout);
  }, [currentUser]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <LazyRouteWrapper>
              <HomePage />
            </LazyRouteWrapper>
          } />
          <Route path="/login" element={
            <LazyRouteWrapper>
              <LoginPage />
            </LazyRouteWrapper>
          } />
          <Route path="/register" element={
            <LazyRouteWrapper>
              <RegisterPage />
            </LazyRouteWrapper>
          } />
          <Route path="/reset-password" element={
            <LazyRouteWrapper>
              <ResetPasswordPage />
            </LazyRouteWrapper>
          } />
          
          {/* Info Pages */}
          <Route path="/faq" element={
            <LazyRouteWrapper>
              <FAQPage />
            </LazyRouteWrapper>
          } />
          <Route path="/terms" element={
            <LazyRouteWrapper>
              <TermsPage />
            </LazyRouteWrapper>
          } />
          <Route path="/privacy" element={
            <LazyRouteWrapper>
              <PrivacyPage />
            </LazyRouteWrapper>
          } />
          <Route path="/contact" element={
            <LazyRouteWrapper>
              <ContactPage />
            </LazyRouteWrapper>
          } />

          {/* Protected User Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <LazyRouteWrapper>
                <DashboardPage />
              </LazyRouteWrapper>
            </ProtectedRoute>
          } />
          <Route path="/add-device" element={
            <ProtectedRoute>
              <LazyRouteWrapper>
                <AddDevicePage />
              </LazyRouteWrapper>
            </ProtectedRoute>
          } />
          <Route path="/device/:deviceId" element={
            <ProtectedRoute>
              <LazyRouteWrapper>
                <DeviceDetailPage />
              </LazyRouteWrapper>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <LazyRouteWrapper>
                <ProfilePage />
              </LazyRouteWrapper>
            </ProtectedRoute>
          } />
          
          {/* Payment Routes - High Priority */}
          <Route path="/payment-flow" element={
            <ProtectedRoute>
              <LazyRouteWrapper fallbackMessage="Loading payment flow...">
                <PaymentFlowPage />
              </LazyRouteWrapper>
            </ProtectedRoute>
          } />
          <Route path="/match-payment" element={
            <ProtectedRoute>
              <LazyRouteWrapper fallbackMessage="Loading payment page...">
                <MatchPaymentPage />
              </LazyRouteWrapper>
            </ProtectedRoute>
          } />
          <Route path="/payment/summary" element={
            <ProtectedRoute>
              <LazyRouteWrapper fallbackMessage="Loading payment summary...">
                <PaymentSummaryPage />
              </LazyRouteWrapper>
            </ProtectedRoute>
          } />
          <Route path="/payment/processing" element={
            <LazyRouteWrapper fallbackMessage="Loading payment processing...">
              <PaymentProcessingPage />
            </LazyRouteWrapper>
          } />
          <Route path="/payment/error" element={
            <LazyRouteWrapper fallbackMessage="Loading payment error...">
              <PaymentErrorPage />
            </LazyRouteWrapper>
          } />
          <Route path="/payment/success" element={
            <ProtectedRoute>
              <LazyRouteWrapper fallbackMessage="Loading payment success...">
                <PaymentSuccessPage />
              </LazyRouteWrapper>
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <LazyRouteWrapper fallbackMessage="Loading admin dashboard...">
                <AdminDashboardPage />
              </LazyRouteWrapper>
            </AdminRoute>
          } />

          {/* 404 Route */}
          <Route path="*" element={
            <LazyRouteWrapper>
              <NotFoundPage />
            </LazyRouteWrapper>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

// React Query client configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000, // Data is considered fresh for 5 seconds
      gcTime: 10 * 60 * 1000, // Cache for 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false, // Don't refetch on window focus
      retry: 1, // Retry failed requests once
    },
  },
});

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </AppProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
