import { lazy } from 'react';

// Public pages - High priority (preload)
export const HomePage = lazy(() => import('../pages/HomePage'));
export const LoginPage = lazy(() => import('../pages/LoginPage'));
export const RegisterPage = lazy(() => import('../pages/RegisterPage'));
export const ForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage'));
export const ResetPasswordPage = lazy(() => import('../pages/ResetPasswordPage'));

// Static/Info pages - Low priority
export const FAQPage = lazy(() => import('../pages/FAQPage'));
export const TermsPage = lazy(() => import('../pages/TermsPage'));
export const PrivacyPage = lazy(() => import('../pages/PrivacyPage'));
export const ContactPage = lazy(() => import('../pages/ContactPage'));

// Dashboard/User pages - Medium priority
export const DashboardPage = lazy(() => import('../pages/DashboardPage'));
export const ProfilePage = lazy(() => import('../pages/ProfilePage'));
export const AddDevicePage = lazy(() => import('../pages/AddDevicePage'));
export const DeviceDetailPage = lazy(() => import('../pages/DeviceDetailPage'));

// Payment pages - High priority (business critical)
export const PaymentFlowPage = lazy(() => import('../pages/PaymentFlowPage'));
export const MatchPaymentPage = lazy(() => import('../pages/MatchPaymentPage'));
export const PaymentSummaryPage = lazy(() => import('../components/payment/PaymentSummaryPage'));
export const PaymentSuccessPage = lazy(() => import('../pages/PaymentSuccessPage'));

// Admin pages - Low priority (restricted access)
export const AdminDashboardPage = lazy(() => import('../pages/AdminDashboardPage'));

// Error pages
export const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Route preloading utility with better error handling
export const preloadRoute = (routeImport: () => Promise<any>) => {
  // Preload the route component with error handling
  routeImport().catch((error) => {
    console.warn('Failed to preload route:', error);
  });
};

// Preload critical routes
export const preloadCriticalRoutes = () => {
  // Preload login/register for quick access
  preloadRoute(() => import('../pages/LoginPage'));
  preloadRoute(() => import('../pages/RegisterPage'));
  
  // Preload dashboard for logged-in users
  preloadRoute(() => import('../pages/DashboardPage'));
  
  // Preload payment pages (business critical)
  preloadRoute(() => import('../pages/PaymentFlowPage'));
  preloadRoute(() => import('../pages/MatchPaymentPage'));
  preloadRoute(() => import('../pages/PaymentSuccessPage'));
};

// Preload routes on user interaction
export const preloadUserRoutes = () => {
  preloadRoute(() => import('../pages/AddDevicePage'));
  preloadRoute(() => import('../pages/ProfilePage'));
  preloadRoute(() => import('../pages/DeviceDetailPage'));
  preloadRoute(() => import('../components/payment/PaymentSummaryPage'));
};

// Preload admin routes (for admin users)
export const preloadAdminRoutes = () => {
  preloadRoute(() => import('../pages/AdminDashboardPage'));
};

// Preload static pages (low priority)
export const preloadStaticRoutes = () => {
  preloadRoute(() => import('../pages/FAQPage'));
  preloadRoute(() => import('../pages/TermsPage'));
  preloadRoute(() => import('../pages/PrivacyPage'));
  preloadRoute(() => import('../pages/ContactPage'));
};
