import { motion } from 'framer-motion';
import type { ProcessStep } from '@/data/services';

interface ProcessTimelineProps {
  steps: ProcessStep[];
  color: string;
  gradient: [string, string];
}

export default function ProcessTimeline({ steps, color, gradient }: ProcessTimelineProps) {
  return (
    <div className="relative">
      {/* Vertical spine */}
      <div
        className="absolute left-[19px] top-2 bottom-2 w-px"
        style={{ background: `linear-gradient(180deg, ${color}66, ${color}11)` }}
      />

      <div className="space-y-6">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex gap-4 items-start"
          >
            <div
              className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-white"
              style={{
                background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
                boxShadow: `0 4px 14px ${color}40`,
              }}
            >
              {i + 1}
            </div>
            <div className="pt-1">
              <h4 className="text-base font-semibold text-white">{step.title}</h4>
              <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {step.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
