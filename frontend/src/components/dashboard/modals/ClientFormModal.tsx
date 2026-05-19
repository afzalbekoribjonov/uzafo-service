import { useState } from 'react';
import { X } from 'lucide-react';
import type { Client } from '@/types';
import { useDataStore } from '@/stores/dataStore';
import { useToast } from '@/stores/toastStore';

interface ClientFormModalProps {
  client?: Client | null;
  onClose: () => void;
}

export default function ClientFormModal({ client, onClose }: ClientFormModalProps) {
  const isEdit = !!client;
  const [name, setName] = useState(client?.name || '');
  const [phone, setPhone] = useState(client?.phone || '');
  const [email, setEmail] = useState(client?.email || '');
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [shaking, setShaking] = useState(false);
  const [loading, setLoading] = useState(false);

  const addClient = useDataStore((s) => s.addClient);
  const updateClient = useDataStore((s) => s.updateClient);
  const toast = useToast();

  const validate = () => {
    const newErrors: Record<string, boolean> = {};
    if (!name.trim()) newErrors.name = true;
    if (!phone.trim()) newErrors.phone = true;
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
    try {
      if (isEdit && client) {
        await updateClient(client.id, { name, phone, email: email || undefined });
        toast.success('Mijoz muvaffaqiyatli yangilandi');
      } else {
        await addClient({ name, phone, email: email || undefined });
        toast.success('Yangi mijoz qo\'shildi');
      }
      onClose();
    } catch {
      toast.error('Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Dialog */}
      <div
        className="relative z-10 w-full max-w-[480px] mx-4 p-8 rounded-[20px]"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
          animation: 'modalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            {isEdit ? 'Mijozni tahrirlash' : 'Yangi mijoz qo\'shish'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/5">
            <X size={20} color="#9CA3AF" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Kompaniya nomi <span style={{ color: 'var(--status-danger)' }}>*</span>
            </label>
            <input
              type="text"
              value={name}
              disabled={loading}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: false })); }}
              placeholder="Kompaniya nomini kiriting"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                background: 'var(--bg-space)',
                border: `1px solid ${errors.name ? 'var(--status-danger)' : 'rgba(255,255,255,0.08)'}`,
                color: 'var(--text-primary)',
                animation: shaking && errors.name ? 'shake 0.4s ease' : 'none',
                opacity: loading ? 0.7 : 1
              }}
              onFocus={(e) => !errors.name && (e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)')}
              onBlur={(e) => !errors.name && (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
            {errors.name && <p className="text-xs mt-1" style={{ color: 'var(--status-danger)' }}>Bu maydonni to'ldirish shart</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Telefon <span style={{ color: 'var(--status-danger)' }}>*</span>
            </label>
            <input
              type="text"
              value={phone}
              disabled={loading}
              onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: false })); }}
              placeholder="+998 XX XXX XX XX"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                background: 'var(--bg-space)',
                border: `1px solid ${errors.phone ? 'var(--status-danger)' : 'rgba(255,255,255,0.08)'}`,
                color: 'var(--text-primary)',
                animation: shaking && errors.phone ? 'shake 0.4s ease' : 'none',
                opacity: loading ? 0.7 : 1
              }}
              onFocus={(e) => !errors.phone && (e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)')}
              onBlur={(e) => !errors.phone && (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
            {errors.phone && <p className="text-xs mt-1" style={{ color: 'var(--status-danger)' }}>Bu maydonni to'ldirish shart</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@kompaniya.uz"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                background: 'var(--bg-space)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--text-primary)',
                opacity: loading ? 0.7 : 1
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>
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
