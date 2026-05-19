import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, Download, Share2, Rocket, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { formatDate, formatCurrency } from '@/lib/utils';
import CosmicBackground from '@/components/CosmicBackground';

export default function ReceiptPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [receipt, setReceipt] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const res = await api.get(`/payments/receipt/${id}`);
        setReceipt(res.data);
      } catch (_err) {
        setError(true);
      } finally {        setLoading(false);
      }
    };
    fetchReceipt();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !receipt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white p-6">
        <CosmicBackground />
        <div className="glass-panel p-8 text-center max-w-md relative z-10">
          <h2 className="text-2xl font-bold mb-4">Chek topilmadi</h2>
          <p className="text-gray-400 mb-6">Ushbu havola noto'g'ri yoki chek o'chirib tashlangan bo'lishi mumkin.</p>
          <a href="/" className="gradient-btn py-2 px-6 inline-block">Asosiy sahifa</a>
        </div>
      </div>
    );
  }

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-[#050505] text-white py-12 px-4 sm:px-6 relative overflow-hidden">
      <CosmicBackground />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[600px] mx-auto relative z-10"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="flex items-center gap-1 text-3xl font-extrabold tracking-tight mb-2">
            <span style={{ color: 'var(--text-primary)' }}>Uza</span>
            <span style={{ color: 'var(--accent-indigo-light)' }}>fo</span>
          </div>
          <p className="text-gray-400 text-sm tracking-[0.2em] uppercase">Digital Solutions</p>
        </div>

        {/* Main Receipt Card */}
        <div className="glass-panel overflow-hidden border-indigo-500/20 shadow-[0_0_50px_rgba(79,70,229,0.1)] print:shadow-none print:border-gray-200 print:text-black print:bg-white">
          {/* Status Header */}
          <div className="bg-indigo-500/10 border-b border-indigo-500/20 p-8 text-center print:bg-gray-50 print:border-gray-200">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 mb-4 print:border-green-600">
              <CheckCircle2 size={32} className="text-green-400 print:text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-1">To'lov muvaffaqiyatli!</h1>
            <p className="text-indigo-300 font-medium print:text-indigo-700">Rasmiy kvitansiya</p>
          </div>

          {/* Details Body */}
          <div className="p-8 space-y-8">
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Kimga</p>
                <h2 className="text-lg font-bold">{receipt.projects.clients.name}</h2>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Sana</p>
                <p className="font-medium">{formatDate(receipt.paid_at)}</p>
              </div>
            </div>

            <div className="border-t border-dashed border-white/10 pt-8 print:border-gray-200">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-4">Loyiha tafsilotlari</p>
              <div className="flex justify-between items-center py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                    <Rocket size={16} className="text-indigo-400" />
                  </div>
                  <span className="font-medium">{receipt.projects.name}</span>
                </div>
                <span className="text-gray-400 text-sm capitalize">{receipt.cycle} to'lov</span>
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 flex flex-col items-center justify-center border border-white/5 print:bg-gray-50 print:border-gray-200">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">To'lov summasi</p>
              <div className="text-4xl font-black tracking-tight text-white print:text-black">
                {formatCurrency(receipt.amount, receipt.currency)}
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Chek ID:</span>
                <span className="text-gray-300 font-mono">{receipt.id.split('-')[0].toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status:</span>
                <span className="text-green-400 font-bold uppercase tracking-widest text-[10px]">Tasdiqlangan</span>
              </div>
            </div>
          </div>

          {/* Footer with website */}
          <div className="border-t border-white/5 p-6 bg-white/[0.02] flex items-center justify-center gap-2 print:border-gray-200">
            <Globe size={14} className="text-gray-500" />
            <span className="text-xs text-gray-500 font-medium tracking-wider">uzafo.uz</span>
          </div>
        </div>

        {/* Action Buttons (Hidden on print) */}
        <div className="flex gap-4 mt-8 print:hidden">
          <button 
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-medium"
          >
            <Download size={18} /> Yuklab olish (PDF)
          </button>
          <button 
            onClick={() => {
              navigator.share?.({ title: 'Uzafo To\'lov Cheki', url: window.location.href });
            }}
            className="flex items-center justify-center w-14 h-14 rounded-xl bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"
          >
            <Share2 size={20} className="text-indigo-400" />
          </button>
        </div>

        <p className="text-center text-gray-600 text-[10px] mt-12 uppercase tracking-[0.3em] print:hidden">
          Powered by Uzafo Service System
        </p>
      </motion.div>
    </div>
  );
}
