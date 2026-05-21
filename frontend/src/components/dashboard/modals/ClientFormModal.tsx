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
  const [slug, setSlug] = useState(client?.slug || '');
  const [phone, setPhone] = useState(client?.phone || '');
  const [email, setEmail] = useState(client?.email || '');
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [shaking, setShaking] = useState(false);
  const [loading, setLoading] = useState(false);

  const addClient = useDataStore((s) => s.addClient);
  const updateClient = useDataStore((s) => s.updateClient);
  const toast = useToast();

  const generateSlug = (val: string) => {
    return val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEdit) {
      setSlug(generateSlug(val));
    }
  };

  const validate = () => {
    const newErrors: Record<string, boolean> = {};
    if (!name.trim()) newErrors.name = true;
    if (!slug.trim()) newErrors.slug = true;
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
      const payload = { name, slug, phone, email: email || undefined };
      if (isEdit && client) {
        await updateClient(client.id, payload);
        toast.success('Mijoz muvaffaqiyatli yangilandi');
      } else {
        await addClient(payload);
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
              onChange={(e) => { handleNameChange(e.target.value); setErrors((p) => ({ ...p, name: false })); }}
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

          {/* Slug */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Subdomain (Slug) <span style={{ color: 'var(--status-danger)' }}>*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={slug}
                disabled={loading}
                onChange={(e) => { setSlug(generateSlug(e.target.value)); setErrors((p) => ({ ...p, slug: false })); }}
                placeholder="it-academy"
                className="w-full px-4 py-3 pr-24 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: 'var(--bg-space)',
                  border: `1px solid ${errors.slug ? 'var(--status-danger)' : 'rgba(255,255,255,0.08)'}`,
                  color: 'var(--accent-indigo-light)',
                  animation: shaking && errors.slug ? 'shake 0.4s ease' : 'none',
                  opacity: loading ? 0.7 : 1
                }}
                onFocus={(e) => !errors.slug && (e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)')}
                onBlur={(e) => !errors.slug && (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500">.uzafo.uz</span>
            </div>
            {errors.slug && <p className="text-xs mt-1" style={{ color: 'var(--status-danger)' }}>Slug to'ldirilishi shart</p>}
            <p className="text-[10px] mt-1.5 text-gray-500">Ushbu nom mijoz uchun shaxsiy subdomain sifatida ishlatiladi.</p>
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
