import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Search, FolderKanban } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDataStore } from '@/stores/dataStore';
import { useToast } from '@/stores/toastStore';
import type { Project } from '@/types';
import { PROJECT_TYPE_LABELS, PAYMENT_CYCLE_LABELS } from '@/types';
import { formatDate } from '@/lib/utils';
import StatusBadge from '@/components/StatusBadge';
import ProjectFormModal from '@/components/dashboard/modals/ProjectFormModal';
import ProjectDetailModal from '@/components/dashboard/modals/ProjectDetailModal';
import DeleteConfirmModal from '@/components/dashboard/modals/DeleteConfirmModal';

export default function ProjectsPage() {
  const projects = useDataStore((s) => s.projects);
  const deleteProject = useDataStore((s) => s.deleteProject);
  const getPaymentStatus = useDataStore((s) => s.getPaymentStatus);
  const getNextDueDate = useDataStore((s) => s.getNextDueDate);
  const getClientName = useDataStore((s) => s.getClientName);
  const toast = useToast();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  const filtered = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || p.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || getPaymentStatus(p.id) === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleDelete = async () => {
    if (deleteTarget) {
      await deleteProject(deleteTarget.id);
      toast.success('Loyiha o\'chirildi');
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Loyihalar</h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>({projects.length} ta loyiha)</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="gradient-btn text-sm py-2.5 px-4 self-start">
          <Plus size={16} /> Yangi loyiha
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" color="#6B7280" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Loyiha nomi bo'yicha qidirish..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: 'var(--bg-space)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-primary)' }}
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm outline-none appearance-none cursor-pointer"
          style={{ background: 'var(--bg-space)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }}
        >
          <option value="all">Barchasi</option>
          <option value="web">Web</option>
          <option value="bot">Bot</option>
          <option value="mobile">Mobil</option>
          <option value="llm">LLM</option>
          <option value="other">Boshqalar</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm outline-none appearance-none cursor-pointer"
          style={{ background: 'var(--bg-space)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }}
        >
          <option value="all">Barchasi</option>
          <option value="paid">To&apos;langan</option>
          <option value="due-soon">Tez orada</option>
          <option value="overdue">Muddati o&apos;tgan</option>
        </select>
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
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>#</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Loyiha nomi</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Mijoz</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Turi</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>To&apos;lov sikli</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Keyingi to&apos;lov</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((project, idx) => {
                const status = getPaymentStatus(project.id);
                const nextDue = getNextDueDate(project.id);
                const rowBorderColor = status === 'overdue' ? 'var(--status-danger)' : status === 'due-soon' ? 'var(--status-warning)' : 'transparent';

                return (
                  <tr
                    key={project.id}
                    className="group transition-colors"
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      borderLeft: `3px solid ${rowBorderColor}`,
                    }}
                  >
                    <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--text-muted)' }}>{idx + 1}</td>
                    <td className="px-4 py-3.5 text-sm font-medium cursor-pointer" style={{ color: 'var(--text-primary)' }} onClick={() => setDetailProject(project)}>
                      {project.name}
                    </td>
                    <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--text-secondary)' }}>{getClientName(project.clientId)}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium"
                        style={{
                          background: project.type === 'web' ? 'rgba(59,130,246,0.15)' : project.type === 'bot' ? 'rgba(124,58,237,0.15)' : project.type === 'mobile' ? 'rgba(16,185,129,0.15)' : project.type === 'llm' ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.08)',
                          color: project.type === 'web' ? '#3B82F6' : project.type === 'bot' ? '#A78BFA' : project.type === 'mobile' ? '#10B981' : project.type === 'llm' ? '#F59E0B' : '#9CA3AF',
                          border: `1px solid ${project.type === 'web' ? 'rgba(59,130,246,0.3)' : project.type === 'bot' ? 'rgba(124,58,237,0.3)' : project.type === 'mobile' ? 'rgba(16,185,129,0.3)' : project.type === 'llm' ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.12)'}`,
                        }}
                      >
                        {PROJECT_TYPE_LABELS[project.type]}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium"
                        style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.12)' }}
                      >
                        {PAYMENT_CYCLE_LABELS[project.paymentCycle]}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm" style={{ color: nextDue ? (status === 'overdue' ? 'var(--status-danger)' : status === 'due-soon' ? 'var(--status-warning)' : 'var(--text-secondary)') : 'var(--text-muted)' }}>
                          {nextDue ? formatDate(nextDue) : '—'}
                        </span>
                        {nextDue && <StatusBadge status={status} />}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setDetailProject(project)} className="p-1.5 rounded-lg hover:bg-white/5" title="Ko'rish">
                          <Eye size={16} color="#9CA3AF" />
                        </button>
                        <button onClick={() => setEditProject(project)} className="p-1.5 rounded-lg hover:bg-white/5" title="Tahrirlash">
                          <Edit size={16} color="#9CA3AF" />
                        </button>
                        <button onClick={() => setDeleteTarget(project)} className="p-1.5 rounded-lg hover:bg-red-500/10" title="O'chirish">
                          <Trash2 size={16} color="#EF4444" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <FolderKanban size={32} color="#6B7280" />
          </div>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Loyihalar topilmadi</p>
          <button onClick={() => setShowCreate(true)} className="gradient-btn text-sm py-2 px-4">
            Yangi loyiha qo&apos;shish
          </button>
        </div>
      )}

      {/* Modals */}
      {showCreate && <ProjectFormModal onClose={() => setShowCreate(false)} />}
      {editProject && <ProjectFormModal project={editProject} onClose={() => setEditProject(null)} />}
      {detailProject && <ProjectDetailModal project={detailProject} onClose={() => setDetailProject(null)} />}
      {deleteTarget && (
        <DeleteConfirmModal
          title="Loyihani o'chirish"
          message={`'${deleteTarget.name}' loyihasini o'chirmoqchimisiz? Bu loyiha bilan bog'liq barcha to'lov ma'lumotlari ham o'chiriladi.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
