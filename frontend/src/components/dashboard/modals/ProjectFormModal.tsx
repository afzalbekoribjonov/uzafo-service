import { useState } from 'react';
import { X, ChevronDown, Eye, EyeOff, Calendar, CalendarDays } from 'lucide-react';
import type { Project, ProjectType, PaymentCycle } from '@/types';
import { useDataStore } from '@/stores/dataStore';
import { useToast } from '@/stores/toastStore';

interface ProjectFormModalProps {
  project?: Project | null;
  onClose: () => void;
}

export default function ProjectFormModal({ project, onClose }: ProjectFormModalProps) {
  const isEdit = !!project;
  const clients = useDataStore((s) => s.clients);
  const addProject = useDataStore((s) => s.addProject);
  const updateProject = useDataStore((s) => s.updateProject);
  const toast = useToast();

  const [name, setName] = useState(project?.name || '');
  const [clientId, setClientId] = useState(project?.clientId || '');
  const [type, setType] = useState<ProjectType>(project?.type || 'web');
  const [paymentCycle, setPaymentCycle] = useState<PaymentCycle>(project?.paymentCycle || 'monthly');
  const [leadName, setLeadName] = useState(project?.lead?.name || '');
  const [leadPhone, setLeadPhone] = useState(project?.lead?.phone || '');
  const [serverEmail, setServerEmail] = useState(project?.server?.email || '');
  const [serverPassword, setServerPassword] = useState(project?.server?.password || '');
  const [serverLocation, setServerLocation] = useState(project?.server?.location || '');
  const [repoFrontend, setRepoFrontend] = useState(project?.repos?.frontend || '');
  const [repoBackend, setRepoBackend] = useState(project?.repos?.backend || '');
  const [hostingFrontend, setHostingFrontend] = useState(project?.hosting?.frontend || '');
  const [hostingBackend, setHostingBackend] = useState(project?.hosting?.backend || '');
  const [showTech, setShowTech] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [shaking, setShaking] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, boolean> = {};
    if (!name.trim()) newErrors.name = true;
    if (!clientId) newErrors.clientId = true;
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    const data = {
      name,
      clientId,
      type,
      paymentCycle, // Ensure this property is included
      lead: { name: leadName, phone: leadPhone },
      server: {
        email: serverEmail || undefined,
        password: serverPassword || undefined,
        location: serverLocation || undefined,
      },
      repos: {
        frontend: repoFrontend || undefined,
        backend: repoBackend || undefined,
      },
      hosting: {
        frontend: hostingFrontend || undefined,
        backend: hostingBackend || undefined,
      },
      payments: project?.payments || [],
    };

    try {
      if (isEdit && project) {
        await updateProject(project.id, data);
        toast.success('Loyiha muvaffaqiyatli yangilandi');
      } else {
        await addProject(data);
        toast.success('Yangi loyiha qo\'shildi');
      }
      onClose();
    } catch {
      toast.error('Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (err: boolean) => ({
    background: 'var(--bg-space)',
    border: `1px solid ${err ? 'var(--status-danger)' : 'rgba(255,255,255,0.08)'}`,
    color: 'var(--text-primary)',
    animation: shaking && err ? 'shake 0.4s ease' : 'none',
    opacity: loading ? 0.7 : 1
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative z-10 w-full max-w-[600px] max-h-[85vh] overflow-y-auto rounded-[20px] p-6 lg:p-8"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
          animation: 'modalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            {isEdit ? 'Loyihani tahrirlash' : 'Yangi loyiha qo\'shish'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/5 shrink-0">
            <X size={20} color="#9CA3AF" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Project name */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Loyiha nomi <span style={{ color: 'var(--status-danger)' }}>*</span>
            </label>
            <input
              type="text"
              value={name}
              disabled={loading}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: false })); }}
              placeholder="Loyiha nomini kiriting"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={inputStyle(errors.name)}
              onFocus={(e) => !errors.name && (e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)')}
              onBlur={(e) => !errors.name && (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
            {errors.name && <p className="text-xs mt-1" style={{ color: 'var(--status-danger)' }}>Bu maydonni to'ldirish shart</p>}
          </div>

          {/* Client */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Mijoz <span style={{ color: 'var(--status-danger)' }}>*</span>
            </label>
            <select
              value={clientId}
              disabled={loading}
              onChange={(e) => { setClientId(e.target.value); setErrors((p) => ({ ...p, clientId: false })); }}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all appearance-none"
              style={inputStyle(errors.clientId)}
              onFocus={(e) => !errors.clientId && (e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)')}
              onBlur={(e) => !errors.clientId && (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
            >
              <option value="" style={{ background: 'var(--bg-space)' }}>Mijozni tanlang</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id} style={{ background: 'var(--bg-space)' }}>{c.name}</option>
              ))}
            </select>
            {errors.clientId && <p className="text-xs mt-1" style={{ color: 'var(--status-danger)' }}>Bu maydonni to'ldirish shart</p>}
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Loyiha turi <span style={{ color: 'var(--status-danger)' }}>*</span>
            </label>
            <select
              value={type}
              disabled={loading}
              onChange={(e) => setType(e.target.value as ProjectType)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all appearance-none"
              style={{ background: 'var(--bg-space)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-primary)', opacity: loading ? 0.7 : 1 }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
            >
              <option value="web" style={{ background: 'var(--bg-space)' }}>Web</option>
              <option value="bot" style={{ background: 'var(--bg-space)' }}>Bot</option>
              <option value="mobile" style={{ background: 'var(--bg-space)' }}>Mobil</option>
              <option value="llm" style={{ background: 'var(--bg-space)' }}>LLM</option>
              <option value="other" style={{ background: 'var(--bg-space)' }}>Boshqalar</option>
            </select>
          </div>

          {/* Payment cycle */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
              To&apos;lov sikli
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                disabled={loading}
                onClick={() => setPaymentCycle('monthly')}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: paymentCycle === 'monthly' ? 'rgba(79,70,229,0.15)' : 'var(--bg-space)',
                  border: `1px solid ${paymentCycle === 'monthly' ? 'var(--accent-indigo)' : 'rgba(255,255,255,0.08)'}`,
                  color: paymentCycle === 'monthly' ? 'var(--accent-indigo-light)' : 'var(--text-secondary)',
                  opacity: loading ? 0.7 : 1
                }}
              >
                <Calendar size={16} /> Oylik
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => setPaymentCycle('annual')}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: paymentCycle === 'annual' ? 'rgba(79,70,229,0.15)' : 'var(--bg-space)',
                  border: `1px solid ${paymentCycle === 'annual' ? 'var(--accent-indigo)' : 'rgba(255,255,255,0.08)'}`,
                  color: paymentCycle === 'annual' ? 'var(--accent-indigo-light)' : 'var(--text-secondary)',
                  opacity: loading ? 0.7 : 1
                }}
              >
                <CalendarDays size={16} /> Yillik
              </button>
            </div>
          </div>

          {/* Lead + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Loyiha rahbari</label>
              <input type="text" value={leadName} disabled={loading} onChange={(e) => setLeadName(e.target.value)} placeholder="Ism Familya"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{ background: 'var(--bg-space)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-primary)', opacity: loading ? 0.7 : 1 }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Telefon</label>
              <input type="text" value={leadPhone} disabled={loading} onChange={(e) => setLeadPhone(e.target.value)} placeholder="+998 XX XXX XX XX"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{ background: 'var(--bg-space)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-primary)', opacity: loading ? 0.7 : 1 }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
            </div>
          </div>

          {/* Technical Vault Collapsible */}
          <button
            type="button"
            disabled={loading}
            onClick={() => setShowTech(!showTech)}
            className="flex items-center gap-2 py-2 text-sm font-medium mt-2"
            style={{ color: 'var(--accent-indigo-light)', opacity: loading ? 0.7 : 1 }}
          >
            <ChevronDown size={16} className={`transition-transform ${showTech ? 'rotate-180' : ''}`} />
            Texnik ma&apos;lumotlar
          </button>

          {showTech && (
            <div className="flex flex-col gap-4 pb-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Server email</label>
                  <input type="email" value={serverEmail} disabled={loading} onChange={(e) => setServerEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: 'var(--bg-space)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-primary)', opacity: loading ? 0.7 : 1 }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Server paroli</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} value={serverPassword} disabled={loading} onChange={(e) => setServerPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-10 rounded-xl text-sm outline-none transition-all"
                      style={{ background: 'var(--bg-space)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-primary)', opacity: loading ? 0.7 : 1 }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                    />
                    <button onClick={() => setShowPassword(!showPassword)} disabled={loading} className="absolute right-3 top-1/2 -translate-y-1/2">
                      {showPassword ? <EyeOff size={16} color="#6B7280" /> : <Eye size={16} color="#6B7280" />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Server joylashuvi</label>
                <input type="text" value={serverLocation} disabled={loading} onChange={(e) => setServerLocation(e.target.value)} placeholder="Masalan: USA - Virginia"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{ background: 'var(--bg-space)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-primary)', opacity: loading ? 0.7 : 1 }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Frontend repo</label>
                  <input type="text" value={repoFrontend} disabled={loading} onChange={(e) => setRepoFrontend(e.target.value)} placeholder="https://github.com/..."
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: 'var(--bg-space)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-primary)', opacity: loading ? 0.7 : 1 }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Backend repo</label>
                  <input type="text" value={repoBackend} disabled={loading} onChange={(e) => setRepoBackend(e.target.value)} placeholder="https://github.com/..."
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: 'var(--bg-space)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-primary)', opacity: loading ? 0.7 : 1 }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Frontend hosting</label>
                  <input type="text" value={hostingFrontend} disabled={loading} onChange={(e) => setHostingFrontend(e.target.value)} placeholder="https://..."
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: 'var(--bg-space)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-primary)', opacity: loading ? 0.7 : 1 }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Backend hosting</label>
                  <input type="text" value={hostingBackend} disabled={loading} onChange={(e) => setHostingBackend(e.target.value)} placeholder="https://..."
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: 'var(--bg-space)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-primary)', opacity: loading ? 0.7 : 1 }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} disabled={loading} className="ghost-btn py-2.5 px-5 text-sm">Bekor qilish</button>
          <button onClick={handleSubmit} disabled={loading} className="gradient-btn py-2.5 px-5 text-sm">
            {loading ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
        </div>
      </div>
    </div>
  );
}
