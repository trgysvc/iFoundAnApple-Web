import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useAppContext } from "./contexts/AppContext.tsx";
import { UserRole } from "./types.ts";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import AddDevicePage from "./pages/AddDevicePage.tsx";
import PaymentFlowPage from "./pages/PaymentFlowPage.tsx";
import MatchPaymentPage from "./pages/MatchPaymentPage.tsx";
import PaymentSummaryPage from "./components/payment/PaymentSummaryPage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import DeviceDetailPage from "./pages/DeviceDetailPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.tsx";
import FAQPage from "./pages/FAQPage.tsx";
import TermsPage from "./pages/TermsPage.tsx";
import PrivacyPage from "./pages/PrivacyPage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
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

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/contact" element={<ContactPage />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-device"
                element={
                  <ProtectedRoute>
                    <AddDevicePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment-flow"
                element={
                  <ProtectedRoute>
                    <PaymentFlowPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/match-payment"
                element={
                  <ProtectedRoute>
                    <MatchPaymentPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment/summary"
                element={
                  <ProtectedRoute>
                    <PaymentSummaryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/device/:deviceId"
                element={
                  <ProtectedRoute>
                    <DeviceDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboardPage />
                  </AdminRoute>
                }
              />

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
