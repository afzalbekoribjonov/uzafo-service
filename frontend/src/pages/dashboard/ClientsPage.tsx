import { useState } from 'react';
import { Plus, Edit, Trash2, Users, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDataStore } from '@/stores/dataStore';
import { useToast } from '@/stores/toastStore';
import type { Client } from '@/types';
import ClientFormModal from '@/components/dashboard/modals/ClientFormModal';
import DeleteConfirmModal from '@/components/dashboard/modals/DeleteConfirmModal';

export default function ClientsPage() {
  const clients = useDataStore((s) => s.clients);
  const deleteClient = useDataStore((s) => s.deleteClient);
  const getProjectCountForClient = useDataStore((s) => s.getProjectCountForClient);
  const toast = useToast();

  const [search, setSearch] = useState('');
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = async () => {
    if (deleteTarget) {
      await deleteClient(deleteTarget.id);
      toast.success('Mijoz o\'chirildi');
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Mijozlar</h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>({clients.length} ta mijoz)</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="gradient-btn text-sm py-2.5 px-4 self-start">
          <Plus size={16} /> Yangi mijoz
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" color="#6B7280" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Qidirish..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
          style={{ background: 'var(--bg-space)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-primary)' }}
        />
      </div>

      {/* Table */}
      {filtered.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--bg-space)' }}>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Kompaniya</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Telefon</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Email</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Loyihalar</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((client) => (
                <tr key={client.id} className="group" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="px-5 py-3.5 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{client.name}</td>
                  <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--text-secondary)' }}>{client.phone}</td>
                  <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--text-secondary)' }}>{client.email || '—'}</td>
                  <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--text-secondary)' }}>{getProjectCountForClient(client.id)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditClient(client)} className="p-1.5 rounded-lg hover:bg-white/5" title="Tahrirlash">
                        <Edit size={16} color="#9CA3AF" />
                      </button>
                      <button onClick={() => setDeleteTarget(client)} className="p-1.5 rounded-lg hover:bg-red-500/10" title="O'chirish">
                        <Trash2 size={16} color="#EF4444" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <Users size={32} color="#6B7280" />
          </div>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Hali mijozlar qo&apos;shilmagan</p>
          <button onClick={() => setShowCreate(true)} className="gradient-btn text-sm py-2 px-4">
            Birinchi mijozni qo&apos;shish
          </button>
        </div>
      )}

      {/* Modals */}
      {showCreate && <ClientFormModal onClose={() => setShowCreate(false)} />}
      {editClient && <ClientFormModal client={editClient} onClose={() => setEditClient(null)} />}
      {deleteTarget && (
        <DeleteConfirmModal
          title="O'chirishni tasdiqlang"
          message={`${deleteTarget.name} mijozini o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
