import React, { Suspense, useEffect } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
  DashboardPage,
  AddDevicePage,
  PaymentFlowPage,
  MatchPaymentPage,
  PaymentSummaryPage,
  PaymentSuccessPage,
  PaymentCallbackPage,
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
  preloadStaticRoutes,
} from "./utils/lazyRoutes";

// Admin pages
import AdminLayout from "./pages/admin/AdminLayout";
import UserManagementPage from "./pages/admin/UserManagementPage";
import DeviceManagementPage from "./pages/admin/DeviceManagementPage";
import PaymentManagementPage from "./pages/admin/PaymentManagementPage";
import EscrowManagementPage from "./pages/admin/EscrowManagementPage";
import CargoManagementPage from "./pages/admin/CargoManagementPage";
import SystemLogsPage from "./pages/admin/SystemLogsPage";
import ReportsPage from "./pages/admin/ReportsPage";
import AdminPermissionsPage from "./pages/admin/AdminPermissionsPage";
import SystemSettingsPage from "./pages/admin/SystemSettingsPage";
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
  // TEMPORARY: Bypass admin check for testing
  console.log('AdminRoute: Bypassing admin check for testing');
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
          <Route
            path="/"
            element={
              <LazyRouteWrapper>
                <HomePage />
              </LazyRouteWrapper>
            }
          />
          <Route
            path="/login"
            element={
              <LazyRouteWrapper>
                <LoginPage />
              </LazyRouteWrapper>
            }
          />
          <Route
            path="/register"
            element={
              <LazyRouteWrapper>
                <RegisterPage />
              </LazyRouteWrapper>
            }
          />

          {/* Info Pages */}
          <Route
            path="/faq"
            element={
              <LazyRouteWrapper>
                <FAQPage />
              </LazyRouteWrapper>
            }
          />
          <Route
            path="/terms"
            element={
              <LazyRouteWrapper>
                <TermsPage />
              </LazyRouteWrapper>
            }
          />
          <Route
            path="/privacy"
            element={
              <LazyRouteWrapper>
                <PrivacyPage />
              </LazyRouteWrapper>
            }
          />
          <Route
            path="/contact"
            element={
              <LazyRouteWrapper>
                <ContactPage />
              </LazyRouteWrapper>
            }
          />

          {/* Protected User Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <LazyRouteWrapper>
                  <DashboardPage />
                </LazyRouteWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-device"
            element={
              <ProtectedRoute>
                <LazyRouteWrapper>
                  <AddDevicePage />
                </LazyRouteWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/device/:deviceId"
            element={
              <ProtectedRoute>
                <LazyRouteWrapper>
                  <DeviceDetailPage />
                </LazyRouteWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <LazyRouteWrapper>
                  <ProfilePage />
                </LazyRouteWrapper>
              </ProtectedRoute>
            }
          />

          {/* Payment Routes - High Priority */}
          <Route
            path="/payment-flow"
            element={
              <ProtectedRoute>
                <LazyRouteWrapper fallbackMessage="Loading payment flow...">
                  <PaymentFlowPage />
                </LazyRouteWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/match-payment"
            element={
              <ProtectedRoute>
                <LazyRouteWrapper fallbackMessage="Loading payment page...">
                  <MatchPaymentPage />
                </LazyRouteWrapper>
              </ProtectedRoute>
            }
          />
          {/* Payment Callback - Public route (no auth required) */}
          <Route
            path="/payment/callback"
            element={
              <LazyRouteWrapper fallbackMessage="Loading payment callback...">
                <PaymentCallbackPage />
              </LazyRouteWrapper>
            }
          />
          <Route
            path="/payment/callback/*"
            element={
              <LazyRouteWrapper fallbackMessage="Loading payment callback...">
                <PaymentCallbackPage />
              </LazyRouteWrapper>
            }
          />

          <Route
            path="/payment/summary"
            element={
              <ProtectedRoute>
                <LazyRouteWrapper fallbackMessage="Loading payment summary...">
                  <PaymentSummaryPage />
                </LazyRouteWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/success"
            element={
              <ProtectedRoute>
                <LazyRouteWrapper fallbackMessage="Loading payment success...">
                  <PaymentSuccessPage />
                </LazyRouteWrapper>
              </ProtectedRoute>
            }
          />

          {/* Payment Test Route - Development Only - REMOVED */}
          {/* <Route
            path="/payment/test-3ds"
            element={<Payment3DSecureTestPage />}
          /> */}

          {/* Admin Panel Routes */}
          <Route
            path="/admin"
            element={
              <LazyRouteWrapper fallbackMessage="Loading admin dashboard...">
                <AdminDashboardPage />
              </LazyRouteWrapper>
            }
          />
          <Route
            path="/admin/*"
            element={<AdminLayout />}
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="devices" element={<DeviceManagementPage />} />
            <Route path="payments" element={<PaymentManagementPage />} />
            <Route path="escrow" element={<EscrowManagementPage />} />
            <Route path="cargo" element={<CargoManagementPage />} />
            <Route path="logs" element={<SystemLogsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="permissions" element={<AdminPermissionsPage />} />
            <Route path="settings" element={<SystemSettingsPage />} />
          </Route>

          {/* 404 Route */}
          <Route
            path="*"
            element={
              <LazyRouteWrapper>
                <NotFoundPage />
              </LazyRouteWrapper>
            }
          />
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
          <HashRouter>
            <AppContent />
          </HashRouter>
        </AppProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
