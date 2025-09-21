import { lazy } from 'react';

// Public pages - High priority (preload)
export const HomePage = lazy(() => import('../pages/HomePage.tsx'));
export const LoginPage = lazy(() => import('../pages/LoginPage.tsx'));
export const RegisterPage = lazy(() => import('../pages/RegisterPage.tsx'));

// Static/Info pages - Low priority
export const FAQPage = lazy(() => import('../pages/FAQPage.tsx'));
export const TermsPage = lazy(() => import('../pages/TermsPage.tsx'));
export const PrivacyPage = lazy(() => import('../pages/PrivacyPage.tsx'));
export const ContactPage = lazy(() => import('../pages/ContactPage.tsx'));

// Dashboard/User pages - Medium priority
export const DashboardPage = lazy(() => import('../pages/DashboardPage.tsx'));
export const ProfilePage = lazy(() => import('../pages/ProfilePage.tsx'));
export const AddDevicePage = lazy(() => import('../pages/AddDevicePage.tsx'));
export const DeviceDetailPage = lazy(() => import('../pages/DeviceDetailPage.tsx'));

// Payment pages - High priority (business critical)
export const PaymentFlowPage = lazy(() => import('../pages/PaymentFlowPage.tsx'));
export const MatchPaymentPage = lazy(() => import('../pages/MatchPaymentPage.tsx'));
export const PaymentSummaryPage = lazy(() => import('../components/payment/PaymentSummaryPage.tsx'));

// Admin pages - Low priority (restricted access)
export const AdminDashboardPage = lazy(() => import('../pages/AdminDashboardPage.tsx'));

// Error pages
export const NotFoundPage = lazy(() => import('../pages/NotFoundPage.tsx'));

// Route preloading utility
export const preloadRoute = (routeImport: () => Promise<any>) => {
  // Preload the route component
  routeImport();
};

// Preload critical routes
export const preloadCriticalRoutes = () => {
  // Preload login/register for quick access
  preloadRoute(() => import('../pages/LoginPage.tsx'));
  preloadRoute(() => import('../pages/RegisterPage.tsx'));
  
  // Preload dashboard for logged-in users
  preloadRoute(() => import('../pages/DashboardPage.tsx'));
};

// Preload routes on user interaction
export const preloadUserRoutes = () => {
  preloadRoute(() => import('../pages/AddDevicePage.tsx'));
  preloadRoute(() => import('../pages/ProfilePage.tsx'));
  preloadRoute(() => import('../pages/PaymentFlowPage.tsx'));
};
