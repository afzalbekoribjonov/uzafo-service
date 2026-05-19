import { motion } from 'framer-motion';
import { Users, FolderKanban, AlertTriangle, AlertCircle, ArrowRight } from 'lucide-react';
import { useDataStore } from '@/stores/dataStore';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '@/components/StatusBadge';
import { PROJECT_TYPE_LABELS } from '@/types';
import { formatDate } from '@/lib/utils';

export default function DashboardHome() {
  const clients = useDataStore((s) => s.clients);
  const projects = useDataStore((s) => s.projects);
  const getOverdueProjects = useDataStore((s) => s.getOverdueProjects);
  const getDueSoonProjects = useDataStore((s) => s.getDueSoonProjects);
  const getPaymentStatus = useDataStore((s) => s.getPaymentStatus);
  const getNextDueDate = useDataStore((s) => s.getNextDueDate);
  const getClientName = useDataStore((s) => s.getClientName);
  const navigate = useNavigate();

  const overdueCount = getOverdueProjects().length;
  const dueSoonCount = getDueSoonProjects().length;

  const stats = [
    { icon: Users, iconBg: 'rgba(79,70,229,0.15)', value: clients.length, label: 'Jami mijozlar' },
    { icon: FolderKanban, iconBg: 'rgba(59,130,246,0.15)', value: projects.length, label: 'Jami loyihalar' },
    { icon: AlertTriangle, iconBg: 'rgba(245,158,11,0.15)', value: dueSoonCount, label: "Tez orada to'lov" },
    { icon: AlertCircle, iconBg: 'rgba(239,68,68,0.15)', value: overdueCount, label: "Muddati o'tgan" },
  ];

  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="dashboard-card"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: stat.iconBg }}
              >
                <Icon size={20} color={stat.iconBg === 'rgba(239,68,68,0.15)' ? '#EF4444' : stat.iconBg === 'rgba(245,158,11,0.15)' ? '#F59E0B' : stat.iconBg === 'rgba(59,130,246,0.15)' ? '#3B82F6' : '#818CF8'} />
              </div>
              <p className="text-2xl font-bold mt-3" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Payment Alert Banner */}
      {(overdueCount > 0 || dueSoonCount > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-5 py-4 rounded-xl"
          style={{
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.2)',
          }}
        >
          <AlertTriangle size={20} color="#F59E0B" />
          <p className="text-sm flex-1" style={{ color: 'var(--text-secondary)' }}>
            {dueSoonCount + overdueCount} ta loyiha to&apos;lovni talab qiladi
          </p>
          <button
            onClick={() => navigate('/dashboard/projects')}
            className="text-sm font-medium hover:underline shrink-0"
            style={{ color: 'var(--accent-indigo-light)' }}
          >
            Ko&apos;rish <ArrowRight size={14} className="inline" />
          </button>
        </motion.div>
      )}

      {/* Recent Projects Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>So&apos;nggi loyihalar</h3>
          <button
            onClick={() => navigate('/dashboard/projects')}
            className="text-sm font-medium hover:underline"
            style={{ color: 'var(--accent-indigo-light)' }}
          >
            Barchasini ko&apos;rish <ArrowRight size={14} className="inline" />
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--bg-space)' }}>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Loyiha nomi</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Mijoz</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Turi</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Holati</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>Keyingi to&apos;lov</th>
              </tr>
            </thead>
            <tbody>
              {recentProjects.map((project) => {
                const status = getPaymentStatus(project.id);
                const nextDue = getNextDueDate(project.id);
                return (
                  <tr key={project.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td className="px-5 py-3.5 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{project.name}</td>
                    <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--text-secondary)' }}>{getClientName(project.clientId)}</td>
                    <td className="px-5 py-3.5">
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
                    <td className="px-5 py-3.5"><StatusBadge status={status} /></td>
                    <td className="px-5 py-3.5 text-sm" style={{ color: nextDue ? (status === 'overdue' ? 'var(--status-danger)' : status === 'due-soon' ? 'var(--status-warning)' : 'var(--text-secondary)') : 'var(--text-muted)' }}>
                      {nextDue ? formatDate(nextDue) : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
