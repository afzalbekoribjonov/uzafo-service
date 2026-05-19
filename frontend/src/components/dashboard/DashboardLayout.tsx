import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';
import Toast from '@/components/Toast';
import MessagesModal from './modals/MessagesModal';
import { useDataStore } from '@/stores/dataStore';

export default function DashboardLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const location = useLocation();
  const fetchData = useDataStore((state) => state.fetchData);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-void)' }}>
      {/* Desktop Sidebar */}
      <Sidebar className="hidden lg:flex" />

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed left-0 top-0 z-50 h-screen lg:hidden">
          <Sidebar 
            className="flex" 
            onClose={() => setMobileSidebarOpen(false)} 
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <TopHeader 
          onMenuClick={() => setMobileSidebarOpen(true)} 
          onNotificationClick={() => setShowMessages(true)}
        />
        <main className="flex-1 overflow-y-auto p-6" style={{ background: 'var(--bg-void)' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {showMessages && <MessagesModal onClose={() => setShowMessages(false)} />}
      </AnimatePresence>

      <Toast />
    </div>
  );
}
