import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, CheckCircle2, AlertCircle, Clock, ExternalLink } from 'lucide-react';
import api from '@/lib/api';
import { formatDate, formatCurrency } from '@/lib/utils';
import CosmicBackground from '@/components/CosmicBackground';
import StatusBadge from '@/components/StatusBadge';
import { PROJECT_TYPE_LABELS } from '@/types';

export default function ClientPortalPage({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const res = await api.get(`/clients/public/${slug}`);
        setClient(res.data);
      } catch (err) {
        console.error('Portal fetch error:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchClientData();
  }, [slug]);

  const getPaymentStatus = (payments: any[], cycle: string) => {
    if (!payments || payments.length === 0) return 'overdue';
    const sorted = [...payments].sort((a, b) => new Date(b.paid_at).getTime() - new Date(a.paid_at).getTime());
    const lastPayment = sorted[0];
    const nextDue = new Date(lastPayment.paid_at);
    if (cycle === 'monthly') nextDue.setMonth(nextDue.getMonth() + 1);
    else nextDue.setFullYear(nextDue.getFullYear() + 1);

    const now = new Date();
    const diff = nextDue.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return 'overdue';
    if (days <= 5) return 'due-soon';
    return 'paid';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white p-6 text-center">
        <CosmicBackground />
        <div className="glass-panel p-8 max-w-md relative z-10">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Mijoz portali topilmadi</h2>
          <p className="text-gray-400 mb-6">Ushbu manzil noto'g'ri yoki kirish cheklangan bo'lishi mumkin.</p>
          <a href="https://uzafo.uz" className="gradient-btn py-2 px-6 inline-block">Asosiy sahifa</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white py-12 px-4 sm:px-6 relative overflow-hidden">
      <CosmicBackground />
      
      <div className="max-w-[1000px] mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2">Mijoz Portali</p>
            <h1 className="text-4xl font-black tracking-tight">{client.name}</h1>
          </div>
          <div className="flex items-center gap-2 text-2xl font-extrabold tracking-tight opacity-50">
            <span>Uza</span><span className="text-indigo-400">fo</span>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 gap-8">
          {client.projects.map((project: any, i: number) => {
            const status = getPaymentStatus(project.payments, project.payment_cycle);
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                        <Rocket size={24} className="text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{project.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{PROJECT_TYPE_LABELS[project.type as keyof typeof PROJECT_TYPE_LABELS] || project.type}</p>
                      </div>
                    </div>
                    <StatusBadge status={status as any} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">To'lov Sikli</p>
                      <p className="font-medium capitalize">{project.payment_cycle === 'monthly' ? 'Har oyda' : 'Har yilda'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Loyiha Holati</p>
                      <div className="flex items-center gap-2 text-green-400 font-medium">
                        <CheckCircle2 size={16} /> Faol
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">So'nggi To'lov</p>
                      <p className="font-medium">
                        {project.payments.length > 0 
                          ? formatDate(project.payments.sort((a:any, b:any) => new Date(b.paid_at).getTime() - new Date(a.paid_at).getTime())[0].paid_at) 
                          : 'Ma\'lumot yo\'q'}
                      </p>
                    </div>
                  </div>

                  {/* Payment History */}
                  <div className="bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-bold">
                        <Clock size={16} className="text-gray-500" /> To'lovlar Tarixi
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-gray-500">
                            <th className="px-6 py-3 font-medium">Sana</th>
                            <th className="px-6 py-3 font-medium">Summa</th>
                            <th className="px-6 py-3 font-medium">Kvitansiya</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {project.payments.length > 0 ? (
                            project.payments.map((payment: any) => (
                              <tr key={payment.id} className="hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-4 text-gray-300">{formatDate(payment.paid_at)}</td>
                                <td className="px-6 py-4 font-bold">{formatCurrency(payment.amount, payment.currency)}</td>
                                <td className="px-6 py-4">
                                  <a 
                                    href={`/receipt/${payment.id}`} 
                                    target="_blank"
                                    className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                                  >
                                    Ko'rish <ExternalLink size={14} />
                                  </a>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={3} className="px-6 py-8 text-center text-gray-500 italic">Hali to'lovlar amalga oshirilmagan</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Support Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-500 text-sm mb-4">Savollar yoki qo'llab-quvvatlash bo'yicha biz bilan bog'laning:</p>
          <div className="flex justify-center gap-6">
            <a href="https://t.me/uzafo" className="text-indigo-400 hover:underline font-medium">Telegram</a>
            <a href="tel:+998941080916" className="text-indigo-400 hover:underline font-medium">+998 94 108 09 16</a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
