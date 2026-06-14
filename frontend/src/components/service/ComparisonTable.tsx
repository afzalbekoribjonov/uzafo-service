import { motion } from 'framer-motion';
import { ArrowRight, X, Check } from 'lucide-react';
import type { ComparisonRow } from '@/data/services';

interface ComparisonTableProps {
  rows: ComparisonRow[];
  color: string;
  gradient: [string, string];
}

export default function ComparisonTable({ rows, color, gradient }: ComparisonTableProps) {
  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{ border: `1px solid ${color}22`, background: 'rgba(10,10,26,0.5)', backdropFilter: 'blur(14px)' }}
    >
      {/* Header */}
      <div
        className="grid grid-cols-[1.2fr_1fr_auto_1fr] sm:grid-cols-[1.4fr_1fr_auto_1fr] gap-2 sm:gap-4 px-4 sm:px-6 py-3.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wide"
        style={{ background: `linear-gradient(135deg, ${gradient[0]}1f, ${gradient[1]}0d)`, color: 'var(--text-secondary)' }}
      >
        <div>Ko'rsatkich</div>
        <div className="text-rose-300/80">Avval</div>
        <div aria-hidden className="w-5" />
        <div style={{ color }}>Keyin</div>
      </div>

      <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        {rows.map((row, i) => (
          <motion.div
            key={row.label}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ delay: i * 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-[1.2fr_1fr_auto_1fr] sm:grid-cols-[1.4fr_1fr_auto_1fr] gap-2 sm:gap-4 px-4 sm:px-6 py-4 items-center transition-colors hover:bg-white/[0.02]"
          >
            <div className="text-[13px] sm:text-sm font-medium text-white">{row.label}</div>

            <div className="flex items-center gap-1.5 text-[12px] sm:text-sm" style={{ color: 'var(--text-muted)' }}>
              <span className="w-4 h-4 rounded-full bg-rose-500/15 flex items-center justify-center shrink-0">
                <X size={10} className="text-rose-400" />
              </span>
              <span className="line-through decoration-rose-400/40">{row.before}</span>
            </div>

            <ArrowRight size={16} style={{ color }} className="shrink-0" />

            <div className="flex items-center gap-1.5 text-[12px] sm:text-sm font-semibold text-white">
              <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: `${color}26` }}>
                <Check size={10} style={{ color }} />
              </span>
              {row.after}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
