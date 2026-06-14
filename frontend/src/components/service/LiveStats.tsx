import { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { TrendingUp, Activity } from 'lucide-react';
import type { Metric } from '@/data/services';

/* Deterministic pseudo-random so the sparkline is stable across renders. */
function rand(seed: number) {
  const x = Math.sin(seed * 999.13) * 43758.5453;
  return x - Math.floor(x);
}

function buildSeries(seed: number, points = 14) {
  const out: number[] = [];
  let v = 0.35;
  for (let i = 0; i < points; i++) {
    v += (1 - v) * 0.14 + (rand(seed + i) - 0.45) * 0.16;
    out.push(Math.max(0.05, Math.min(1, v)));
  }
  out[points - 1] = Math.max(out[points - 1], 0.88);
  return out;
}

function toPath(series: number[], w: number, h: number) {
  const step = w / (series.length - 1);
  const pts = series.map((v, i) => [i * step, h - v * (h - 6) - 3] as const);
  const line = pts.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(' ');
  const area = `${line} L ${w} ${h} L 0 ${h} Z`;
  return { line, area, last: pts[pts.length - 1] };
}

function AnimatedNumber({ metric }: { metric: Metric }) {
  const ref = useRef<HTMLSpanElement>(null);
  const mv = useMotionValue(0);
  const isDecimal = !Number.isInteger(metric.value);
  const rounded = useTransform(mv, (v) => (isDecimal ? v.toFixed(1) : Math.floor(v).toString()));
  const inView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!inView) return;
    const c = animate(mv, metric.value, { duration: 1.6, ease: [0.16, 1, 0.3, 1] });
    return c.stop;
  }, [inView, metric.value, mv]);

  useEffect(() => {
    const text = `${metric.prefix ?? ''}{v}${metric.suffix ?? ''}`;
    return rounded.on('change', (v) => {
      if (ref.current) ref.current.textContent = text.replace('{v}', v);
    });
  }, [rounded, metric.prefix, metric.suffix]);

  return <span ref={ref}>{`${metric.prefix ?? ''}${isDecimal ? '0.0' : '0'}${metric.suffix ?? ''}`}</span>;
}

function Sparkline({ seed, color, gradient }: { seed: number; color: string; gradient: [string, string] }) {
  const W = 120;
  const H = 44;
  const pathRef = useRef<SVGPathElement>(null);
  const series = buildSeries(seed);
  const { line, area, last } = toPath(series, W, H);
  const id = `spark-${seed}`;

  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    const len = el.getTotalLength();
    el.style.strokeDasharray = `${len}`;
    el.style.strokeDashoffset = `${len}`;
    const c = animate(len, 0, {
      duration: 1.6,
      delay: 0.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.style.strokeDashoffset = `${v}`;
      },
    });
    return c.stop;
  }, []);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-l`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={gradient[0]} />
          <stop offset="100%" stopColor={gradient[1]} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} opacity={0.9} />
      <path ref={pathRef} d={line} fill="none" stroke={`url(#${id}-l)`} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r={3} fill={color} />
      <circle cx={last[0]} cy={last[1]} r={3} fill={color} style={{ transformOrigin: `${last[0]}px ${last[1]}px`, animation: 'nodePulse 1.6s ease-in-out infinite' }} />
    </svg>
  );
}

interface LiveStatsProps {
  metrics: Metric[];
  color: string;
  gradient: [string, string];
}

export default function LiveStats({ metrics, color, gradient }: LiveStatsProps) {
  return (
    <div
      className="rounded-3xl p-5 md:p-6"
      style={{ background: 'rgba(10,10,26,0.5)', border: `1px solid ${color}22`, backdropFilter: 'blur(14px)' }}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Activity size={16} style={{ color }} /> Jonli ko'rsatkichlar
        </div>
        <div className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full" style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Yangilanmoqda
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-2xl p-4"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            {/* sweeping shimmer */}
            <div
              className="absolute top-0 bottom-0 w-1/3 pointer-events-none"
              style={{ background: `linear-gradient(90deg, transparent, ${color}14, transparent)`, animation: `cardSweep 4.5s ease-in-out ${i * 0.6}s infinite` }}
            />
            <div className="flex items-center justify-between mb-1.5 relative">
              <span className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>{metric.label}</span>
              <span className="flex items-center gap-0.5 text-[10px] font-semibold" style={{ color: '#34d399' }}>
                <TrendingUp size={11} /> +{8 + i * 5}%
              </span>
            </div>
            <div className="font-extrabold tracking-tight relative" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.1rem)', color }}>
              <AnimatedNumber metric={metric} />
            </div>
            <div className="mt-2 relative">
              <Sparkline seed={i * 7 + metric.label.length} color={color} gradient={gradient} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
