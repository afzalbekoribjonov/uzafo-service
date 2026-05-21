import { useState } from 'react';
import { X, Mail, MapPin, ExternalLink, Eye, EyeOff, Edit, Trash2, Copy } from 'lucide-react';
import type { Project, Payment } from '@/types';
import { PAYMENT_CYCLE_LABELS } from '@/types';
import { useDataStore } from '@/stores/dataStore';
import { useToast } from '@/stores/toastStore';
import { formatDate, formatCurrency } from '@/lib/utils';
import StatusBadge from '@/components/StatusBadge';

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
}

export default function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'payments' | 'technical'>('general');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [showServerPassword, setShowServerPassword] = useState(false);

  const getClientName = useDataStore((s) => s.getClientName);
  const getNextDueDate = useDataStore((s) => s.getNextDueDate);
  const getPaymentStatus = useDataStore((s) => s.getPaymentStatus);
  const getPaymentsForProject = useDataStore((s) => s.getPaymentsForProject);
  const addPayment = useDataStore((s) => s.addPayment);
  const updatePayment = useDataStore((s) => s.updatePayment);
  const deletePayment = useDataStore((s) => s.deletePayment);
  const toast = useToast();

  const clientName = getClientName(project.clientId);
  const nextDueDate = getNextDueDate(project.id);
  const paymentStatus = getPaymentStatus(project.id);
  const payments = getPaymentsForProject(project.id);

  const handleCopyReceiptLink = (paymentId: string) => {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    const url = isLocalhost 
      ? `${window.location.origin}/receipt/${paymentId}`
      : `https://payments.uzafo.uz/receipt/${paymentId}`;
      
    navigator.clipboard.writeText(url);
    toast.success("Chek havolasi nusxalandi");
  };

  const handleMarkPaid = async () => {
    if (!paymentAmount || Number(paymentAmount) <= 0) return;
    
    if (editingPayment) {
      const paymentData = {
        amount: Number(paymentAmount),
        currency: editingPayment.currency,
        cycle: editingPayment.cycle,
        paidAt: new Date(paymentDate).toISOString(),
      };
      await updatePayment(editingPayment.id, project.id, paymentData);
      toast.success("To'lov muvaffaqiyatli tahrirlandi");
      setEditingPayment(null);
    } else {
      const paymentData = {
        amount: Number(paymentAmount),
        currency: 'UZS',
        cycle: project.paymentCycle,
        paidAt: new Date(paymentDate).toISOString(),
      };
      await addPayment(project.id, paymentData);
      const newNextDue = getNextDueDate(project.id);
      toast.success(`To'lov muvaffaqiyatli qayd etildi. Keyingi to'lov: ${newNextDue ? formatDate(newNextDue) : 'Noma\'lum'}`);
    }
    
    setShowPaymentForm(false);
    setPaymentAmount('');
    setPaymentDate(new Date().toISOString().split('T')[0]);
  };

  const handleEditPayment = (payment: Payment) => {
    setEditingPayment(payment);
    setPaymentAmount(payment.amount.toString());
    setPaymentDate(new Date(payment.paidAt).toISOString().split('T')[0]);
    setShowPaymentForm(true);
    setActiveTab('payments');
  };

  const handleDeletePayment = async (id: string) => {
    if (confirm("Haqiqatan ham ushbu to'lovni o'chirmoqchimisiz?")) {
      await deletePayment(id, project.id);
      toast.success("To'lov o'chirildi");
    }
  };

  const tabs = [
    { key: 'general' as const, label: 'Umumiy' },
    { key: 'payments' as const, label: "To'lovlar" },
    { key: 'technical' as const, label: 'Texnik ma\'lumotlar' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative z-10 w-full max-w-[720px] max-h-[85vh] overflow-y-auto rounded-[20px] p-6 lg:p-8"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
          animation: 'modalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            {project.name} — Tafsilotlar
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/5 shrink-0">
            <X size={20} color="#9CA3AF" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 rounded-xl" style={{ background: 'var(--bg-space)' }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all"
              style={{
                background: activeTab === tab.key ? 'rgba(79,70,229,0.2)' : 'transparent',
                color: activeTab === tab.key ? 'var(--accent-indigo-light)' : 'var(--text-muted)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab: General */}
        {activeTab === 'general' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Loyiha nomi</p>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{project.name}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Mijoz</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{clientName}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Loyiha turi</p>
                <StatusBadge status={paymentStatus === 'paid' ? 'active' : paymentStatus as 'overdue' | 'due-soon'} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Loyiha rahbari</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{project.lead?.name || '—'}</p>
                {project.lead?.phone && (
                  <a href={`tel:${project.lead.phone}`} className="text-xs" style={{ color: 'var(--accent-indigo-light)' }}>
                    {project.lead.phone}
                  </a>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>To&apos;lov sikli</p>
                <span
                  className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold"
                  style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.3)' }}
                >
                  {PAYMENT_CYCLE_LABELS[project.paymentCycle]}
                </span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Keyingi to&apos;lov sanasi</p>
                <p className="text-sm" style={{ color: nextDueDate ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
                  {nextDueDate ? formatDate(nextDueDate) : "Belgilanmagan"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>So&apos;nggi to&apos;lov</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {payments.length > 0 ? `${formatDate(payments[0].paidAt)} — ${formatCurrency(payments[0].amount, payments[0].currency)}` : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Holati</p>
                <StatusBadge status={paymentStatus} />
              </div>
            </div>

            {/* Mark as Paid */}
            <div className="sm:col-span-2 pt-2">
              {!showPaymentForm ? (
                <button onClick={() => { setEditingPayment(null); setShowPaymentForm(true); }} className="gradient-btn text-sm py-2.5 px-5">
                  To&apos;landi deb belgilash
                </button>
              ) : (
                <div className="flex flex-wrap items-end gap-3 p-4 rounded-xl" style={{ background: 'var(--bg-space)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                      {editingPayment ? "Tahrirlash" : "To'lov"} Summasi
                    </label>
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="Summani kiriting"
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: 'var(--bg-void)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-primary)' }}
                      autoFocus
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Sana</label>
                    <input
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: 'var(--bg-void)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <button onClick={handleMarkPaid} className="gradient-btn text-sm py-2.5 px-4">Tasdiqlash</button>
                  <button onClick={() => { setShowPaymentForm(false); setEditingPayment(null); setPaymentAmount(''); }} className="ghost-btn text-sm py-2.5 px-4">Bekor</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Payments */}
        {activeTab === 'payments' && (
          <div>
            <div className="mb-4">
              {!showPaymentForm ? (
                <button onClick={() => { setEditingPayment(null); setShowPaymentForm(true); }} className="gradient-btn text-sm py-2 px-4">
                  Yangi to&apos;lov qo&apos;shish
                </button>
              ) : (
                <div className="flex flex-wrap items-end gap-3 p-4 rounded-xl" style={{ background: 'var(--bg-space)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                      {editingPayment ? "Tahrirlash" : "To'lov"} Summasi
                    </label>
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="Summani kiriting"
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: 'var(--bg-void)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-primary)' }}
                      autoFocus
                    />
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Sana</label>
                    <input
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: 'var(--bg-void)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <button onClick={handleMarkPaid} className="gradient-btn text-sm py-2.5 px-4">Tasdiqlash</button>
                  <button onClick={() => { setShowPaymentForm(false); setEditingPayment(null); setPaymentAmount(''); }} className="ghost-btn text-sm py-2.5 px-4">Bekor</button>
                </div>
              )}
            </div>

            {payments.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Hali to&apos;lovlar amalga oshirilmagan</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                <table className="w-full">
                  <thead>
                    <tr style={{ background: 'var(--bg-space)' }}>
                      <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Sana</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Summa</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Sikli</th>
                      <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Amallar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--text-secondary)' }}>{formatDate(payment.paidAt)}</td>
                        <td className="px-5 py-3.5 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{formatCurrency(payment.amount, payment.currency)}</td>
                        <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--text-secondary)' }}>{PAYMENT_CYCLE_LABELS[payment.cycle]}</td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleCopyReceiptLink(payment.id)}
                              className="p-1.5 rounded-lg hover:bg-white/5 text-emerald-400 transition-colors"
                              title="Chek linkini nusxalash"
                            >
                              <Copy size={16} />
                            </button>
                            <button 
                              onClick={() => handleEditPayment(payment)}
                              className="p-1.5 rounded-lg hover:bg-white/5 text-indigo-400 transition-colors"
                              title="Tahrirlash"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeletePayment(payment.id)}
                              className="p-1.5 rounded-lg hover:bg-white/5 text-red-400 transition-colors"
                              title="O'chirish"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab: Technical */}
        {activeTab === 'technical' && (
          <div className="space-y-6">
            {/* Server Info */}
            <div>
              <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Server ma&apos;lumotlari</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail size={16} color="#6B7280" />
                  <span className="text-xs uppercase tracking-wider w-32 shrink-0" style={{ color: 'var(--text-muted)' }}>Email</span>
                  <span className="text-sm" style={{ color: project.server?.email ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
                    {project.server?.email || '—'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Eye size={16} color="#6B7280" />
                  <span className="text-xs uppercase tracking-wider w-32 shrink-0" style={{ color: 'var(--text-muted)' }}>Parol</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm" style={{ color: project.server?.password ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
                      {project.server?.password ? (showServerPassword ? project.server.password : '••••••••') : '—'}
                    </span>
                    {project.server?.password && (
                      <button onClick={() => setShowServerPassword(!showServerPassword)}>
                        {showServerPassword ? <EyeOff size={14} color="#6B7280" /> : <Eye size={14} color="#6B7280" />}
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} color="#6B7280" />
                  <span className="text-xs uppercase tracking-wider w-32 shrink-0" style={{ color: 'var(--text-muted)' }}>Joylashuv</span>
                  <span className="text-sm" style={{ color: project.server?.location ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
                    {project.server?.location || '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* Repos */}
            <div>
              <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Repository havolalari</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <ExternalLink size={16} color="#6B7280" />
                  <span className="text-xs uppercase tracking-wider w-24 shrink-0" style={{ color: 'var(--text-muted)' }}>Frontend</span>
                  {project.repos?.frontend ? (
                    <a href={project.repos.frontend} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline" style={{ color: 'var(--accent-indigo-light)' }}>
                      {project.repos.frontend}
                    </a>
                  ) : (
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>—</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <ExternalLink size={16} color="#6B7280" />
                  <span className="text-xs uppercase tracking-wider w-24 shrink-0" style={{ color: 'var(--text-muted)' }}>Backend</span>
                  {project.repos?.backend ? (
                    <a href={project.repos.backend} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline" style={{ color: 'var(--accent-indigo-light)' }}>
                      {project.repos.backend}
                    </a>
                  ) : (
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>—</span>
                  )}
                </div>
              </div>
            </div>

            {/* Hosting */}
            <div>
              <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Hosting havolalari</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <ExternalLink size={16} color="#6B7280" />
                  <span className="text-xs uppercase tracking-wider w-24 shrink-0" style={{ color: 'var(--text-muted)' }}>Frontend</span>
                  {project.hosting?.frontend ? (
                    <a href={project.hosting.frontend} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline" style={{ color: 'var(--accent-indigo-light)' }}>
                      {project.hosting.frontend}
                    </a>
                  ) : (
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>—</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <ExternalLink size={16} color="#6B7280" />
                  <span className="text-xs uppercase tracking-wider w-24 shrink-0" style={{ color: 'var(--text-muted)' }}>Backend</span>
                  {project.hosting?.backend ? (
                    <a href={project.hosting.backend} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline" style={{ color: 'var(--accent-indigo-light)' }}>
                      {project.hosting.backend}
                    </a>
                  ) : (
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>—</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
