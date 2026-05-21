import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import ServiceDetailPage from '@/pages/services/ServiceDetailPage';
import ReceiptPage from '@/pages/ReceiptPage';
import AuthGuard from '@/components/AuthGuard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardHome from '@/pages/dashboard/DashboardHome';
import ClientsPage from '@/pages/dashboard/ClientsPage';
import ProjectsPage from '@/pages/dashboard/ProjectsPage';
import NotFoundPage from '@/pages/NotFoundPage';
import ClientPortalPage from '@/pages/ClientPortalPage';

export default function App() {
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  
  // Detection logic
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  let subdomain = null;
  
  if (parts.length >= 3) {
    subdomain = parts[0].toLowerCase();
  } else if (isLocalhost && parts.length >= 2) {
    // For local dev like client1.localhost
    subdomain = parts[0].toLowerCase();
  }

  const isAdmin = subdomain === 'admin';
  const isClientTenant = subdomain && !['www', 'uzafo', 'admin', 'api'].includes(subdomain);

  // 1. Client Tenant View (Legacy subdomain logic)
  if (isClientTenant && subdomain) {
    return (
      <Routes>
        <Route path="/" element={<ClientPortalPage slug={subdomain} />} />
        <Route path="/receipt/:id" element={<ReceiptPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    );
  }

  // 2. Admin Panel (admin.uzafo.uz)
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

  // 3. Main Landing & Shared Routes (uzafo.uz)
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* Client Portal on main domain for Render Free compatibility */}
      <Route path="/p/:slug" element={<ClientPortalSlugWrapper />} />
      <Route path="/services/:id" element={<ServiceDetailPage />} />
      <Route path="/receipt/:id" element={<ReceiptPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
  }


// Helper to get slug from URL params
function ClientPortalSlugWrapper() {
  const { slug } = useParams();
  return <ClientPortalPage slug={slug || ''} />;
}
