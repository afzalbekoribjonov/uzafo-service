import { Routes, Route } from 'react-router-dom';
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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/services/:id" element={<ServiceDetailPage />} />
      <Route path="/receipt/:id" element={<ReceiptPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<AuthGuard><DashboardLayout /></AuthGuard>}>
        <Route index element={<DashboardHome />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="projects" element={<ProjectsPage />} />
      </Route>
      {/* Catch-all 404 route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
