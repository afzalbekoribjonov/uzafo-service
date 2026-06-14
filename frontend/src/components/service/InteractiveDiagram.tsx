import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { GripVertical, Move, Wifi } from 'lucide-react';
import type { FlowNode } from '@/data/services';

interface InteractiveDiagramProps {
  nodes: FlowNode[];
  color: string;
  gradient: [string, string];
}

interface Pos {
  x: number;
  y: number;
}

const PAD = 16;

export default function InteractiveDiagram({ nodes, color, gradient }: InteractiveDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 320 });
  const [positions, setPositions] = useState<Pos[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [moved, setMoved] = useState(false);
  const dragRef = useRef<{ i: number; sx: number; sy: number; ox: number; oy: number } | null>(null);

  const isMobile = size.w > 0 && size.w < 560;
  const nodeW = isMobile ? 156 : 184;
  const nodeH = 74;

  // Measure container width responsively.
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      setSize((s) => ({ ...s, w }));
    });
    ro.observe(el);
    setSize((s) => ({ ...s, w: el.clientWidth }));
    return () => ro.disconnect();
  }, []);

  // Lay the nodes out whenever the geometry changes (resets manual drags).
  useEffect(() => {
    if (size.w === 0) return;
    const n = nodes.length;
    if (isMobile) {
      const stepY = nodeH + 40;
      const h = PAD * 2 + stepY * (n - 1) + nodeH;
      const next: Pos[] = nodes.map((_, i) => ({
        x: i % 2 === 0 ? PAD : size.w - nodeW - PAD,
        y: PAD + i * stepY,
      }));
      setPositions(next);
      setSize((s) => (s.h === h ? s : { ...s, h }));
    } else {
      const h = 320;
      const usable = size.w - PAD * 2 - nodeW;
      const stepX = n > 1 ? usable / (n - 1) : 0;
      const topY = PAD + 8;
      const botY = h - PAD - nodeH - 8;
      const next: Pos[] = nodes.map((_, i) => ({
        x: PAD + i * stepX,
        y: i % 2 === 0 ? topY : botY,
      }));
      setPositions(next);
      setSize((s) => (s.h === h ? s : { ...s, h }));
    }
  }, [size.w, isMobile, nodes, nodeW]);

  function clamp(v: number, min: number, max: number) {
    return Math.max(min, Math.min(max, v));
  }

  function onPointerDown(e: ReactPointerEvent, i: number) {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { i, sx: e.clientX, sy: e.clientY, ox: positions[i].x, oy: positions[i].y };
    setActive(i);
  }

  function onPointerMove(e: ReactPointerEvent) {
    const d = dragRef.current;
    if (!d) return;
    const nx = clamp(d.ox + (e.clientX - d.sx), 0, size.w - nodeW);
    const ny = clamp(d.oy + (e.clientY - d.sy), 0, size.h - nodeH);
    setPositions((p) => p.map((pos, idx) => (idx === d.i ? { x: nx, y: ny } : pos)));
    if (!moved && (Math.abs(e.clientX - d.sx) > 4 || Math.abs(e.clientY - d.sy) > 4)) setMoved(true);
  }

  function onPointerUp() {
    dragRef.current = null;
    setActive(null);
  }

  // Build a smooth connector path between two node centers.
  function edgePath(a: Pos, b: Pos) {
    const x1 = a.x + nodeW / 2;
    const y1 = a.y + nodeH / 2;
    const x2 = b.x + nodeW / 2;
    const y2 = b.y + nodeH / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    if (Math.abs(dx) >= Math.abs(dy)) {
      const cx = x1 + dx * 0.5;
      return `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;
    }
    const cy = y1 + dy * 0.5;
    return `M ${x1} ${y1} C ${x1} ${cy}, ${x2} ${cy}, ${x2} ${y2}`;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden select-none"
      style={{
        height: size.h,
        background:
          'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.04), transparent 60%), #0A0A18',
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
        backgroundSize: '26px 26px, 26px 26px',
        border: `1px solid ${color}22`,
      }}
    >
      {/* Hint */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full pointer-events-none"
        style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <Move size={12} /> {moved ? 'Jonli tizim' : 'Tugunlarni suring'}
      </div>

      {/* Live status */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full pointer-events-none"
        style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}>
        <Wifi size={12} /> Real vaqt
      </div>

      {/* Edges */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id={`edge-${color.replace('#', '')}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={gradient[0]} />
            <stop offset="100%" stopColor={gradient[1]} />
          </linearGradient>
        </defs>
        {positions.length === nodes.length &&
          positions.slice(0, -1).map((a, i) => {
            const d = edgePath(a, positions[i + 1]);
            return (
              <g key={i}>
                <path d={d} fill="none" stroke={`${color}33`} strokeWidth={2.5} strokeLinecap="round" />
                <path
                  d={d}
                  fill="none"
                  stroke={`url(#edge-${color.replace('#', '')})`}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeDasharray="5 11"
                  style={{ animation: 'diagramFlow 0.9s linear infinite', filter: `drop-shadow(0 0 4px ${color})` }}
                />
              </g>
            );
          })}
      </svg>

      {/* Nodes */}
      {positions.length === nodes.length &&
        nodes.map((node, i) => {
          const Icon = node.icon;
          const pos = positions[i];
          const isActive = active === i;
          return (
            <div
              key={node.label}
              onPointerDown={(e) => onPointerDown(e, i)}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              className="absolute z-10 rounded-xl px-3 py-2.5 flex items-center gap-2.5 cursor-grab active:cursor-grabbing"
              style={{
                left: pos.x,
                top: pos.y,
                width: nodeW,
                height: nodeH,
                touchAction: 'none',
                background: 'rgba(17,17,34,0.92)',
                border: `1px solid ${isActive ? color : color + '44'}`,
                boxShadow: isActive
                  ? `0 12px 30px ${color}44, 0 0 0 3px ${color}22`
                  : `0 6px 18px rgba(0,0,0,0.35)`,
                transition: dragRef.current ? 'none' : 'box-shadow 0.2s, border-color 0.2s',
                backdropFilter: 'blur(6px)',
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 relative"
                style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
              >
                <Icon size={17} color="#fff" />
                <span
                  className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400"
                  style={{ animation: 'nodePulse 1.8s ease-in-out infinite', boxShadow: '0 0 6px #34d399' }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[12px] font-semibold text-white leading-tight line-clamp-2">{node.label}</div>
                {node.sub && (
                  <div className="text-[10px] truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {node.sub}
                  </div>
                )}
              </div>
              <GripVertical size={13} className="shrink-0 self-center" style={{ color: `${color}88` }} />
            </div>
          );
        })}
    </div>
  );
}
