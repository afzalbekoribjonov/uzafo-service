import { useToastStore } from '@/stores/toastStore';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors = {
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
};

export default function Toast() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2" style={{ maxWidth: 360 }}>
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-start gap-3 p-4 rounded-xl shadow-lg"
              style={{
                background: '#11112A',
                borderLeft: `4px solid ${colors[toast.type]}`,
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              <Icon size={20} color={colors[toast.type]} className="mt-0.5 shrink-0" />
              <p className="text-sm flex-1" style={{ color: '#F5F5F7' }}>{toast.message}</p>
              <button onClick={() => removeToast(toast.id)} className="shrink-0 mt-0.5">
                <X size={16} color="#6B7280" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
