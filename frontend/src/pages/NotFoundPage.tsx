import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import CosmicBackground from '@/components/CosmicBackground';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 overflow-hidden">
      <CosmicBackground />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center max-w-md"
      >
        <div className="mb-8 relative inline-block">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full"
          />
          <div className="relative bg-white/5 border border-white/10 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto backdrop-blur-xl">
            <AlertCircle size={48} className="text-indigo-400" />
          </div>
        </div>

        <h1 className="text-6xl font-black mb-4 tracking-tighter" style={{ color: 'var(--text-primary)' }}>
          404
        </h1>
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-secondary)' }}>
          Sahifa topilmadi
        </h2>
        <p className="text-gray-400 mb-10 leading-relaxed">
          Siz qidirayotgan sahifa mavjud emas, o'chirilgan yoki manzili o'zgartirilgan bo'lishi mumkin.
        </p>

        <button
          onClick={() => navigate('/')}
          className="gradient-btn inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold group"
        >
          <Home size={20} className="transition-transform group-hover:-translate-y-0.5" />
          Bosh sahifaga qaytish
        </button>
      </motion.div>

      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
}
