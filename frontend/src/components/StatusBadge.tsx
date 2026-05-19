import type { PaymentStatus } from '@/types';
import { PAYMENT_STATUS_LABELS } from '@/types';

const styles: Record<string, { bg: string; color: string; border: string }> = {
  paid: {
    bg: 'rgba(16,185,129,0.15)',
    color: '#10B981',
    border: '1px solid rgba(16,185,129,0.3)',
  },
  'due-soon': {
    bg: 'rgba(245,158,11,0.15)',
    color: '#F59E0B',
    border: '1px solid rgba(245,158,11,0.3)',
  },
  overdue: {
    bg: 'rgba(239,68,68,0.15)',
    color: '#EF4444',
    border: '1px solid rgba(239,68,68,0.3)',
  },
  active: {
    bg: 'rgba(59,130,246,0.15)',
    color: '#3B82F6',
    border: '1px solid rgba(59,130,246,0.3)',
  },
  inactive: {
    bg: 'rgba(255,255,255,0.08)',
    color: '#6B7280',
    border: '1px solid rgba(255,255,255,0.12)',
  },
};

interface StatusBadgeProps {
  status: PaymentStatus | 'active' | 'inactive';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const s = styles[status] || styles.inactive;
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold"
      style={{ background: s.bg, color: s.color, border: s.border }}
    >
      {PAYMENT_STATUS_LABELS[status as PaymentStatus] || (status === 'active' ? 'Faol' : "No faol")}
    </span>
  );
}
