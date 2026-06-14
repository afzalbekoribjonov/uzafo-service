import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import AuthGuard from '@/components/AuthGuard';
import PageLoader from '@/components/PageLoader';

// Code-split secondary and heavy routes so landing visitors (uzafo.uz) don't
// download the admin dashboard, charts and portal bundles up front.
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const ServiceDetailPage = lazy(() => import('@/pages/services/ServiceDetailPage'));
const ReceiptPage = lazy(() => import('@/pages/ReceiptPage'));
const DashboardLayout = lazy(() => import('@/components/dashboard/DashboardLayout'));
const DashboardHome = lazy(() => import('@/pages/dashboard/DashboardHome'));
const ClientsPage = lazy(() => import('@/pages/dashboard/ClientsPage'));
const ProjectsPage = lazy(() => import('@/pages/dashboard/ProjectsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const ClientPortalPage = lazy(() => import('@/pages/ClientPortalPage'));

export default function App() {
  const hostname = window.location.hostname;
  const parts = hostname.split('.');

  // Detection logic
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  let subdomain: string | null = null;

  if (parts.length >= 3) {
    subdomain = parts[0].toLowerCase();
  } else if (isLocalhost && parts.length >= 2) {
    // For local dev like client1.localhost
    subdomain = parts[0].toLowerCase();
  }

  const isAdmin = subdomain === 'admin';
  const isPayments = subdomain === 'payments';
  const isClientTenant = subdomain && !['www', 'uzafo', 'admin', 'api', 'payments'].includes(subdomain);

  return (
    <Suspense fallback={<PageLoader />}>
      {renderRoutes()}
    </Suspense>
  );

  function renderRoutes() {
    // 1. Payments View (payments.uzafo.uz/receipt/:id)
    if (isPayments) {
      return (
        <Routes>
          <Route path="/receipt/:id" element={<ReceiptPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      );
    }

    // 2. Client Tenant View (mijoz.uzafo.uz)
    if (isClientTenant && subdomain) {
      return (
        <Routes>
          <Route path="/" element={<ClientPortalPage slug={subdomain} />} />
          <Route path="/receipt/:id" element={<ReceiptPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      );
    }

    // 3. Admin Panel (admin.uzafo.uz)
    if (isAdmin) {
      return (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<AuthGuard><DashboardLayout /></AuthGuard>}>
            <Route index element={<DashboardHome />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="projects" element={<ProjectsPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      );
    }

    // 4. Main Landing & Shared Routes (uzafo.uz)
    return (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services/:id" element={<ServiceDetailPage />} />
        <Route path="/receipt/:id" element={<ReceiptPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    );
  }
}
