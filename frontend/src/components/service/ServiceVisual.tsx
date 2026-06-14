import type { CSSProperties } from 'react';
import { TrendingUp, ArrowUpRight, Activity, Bell, Home, Search, User, ShoppingBag } from 'lucide-react';
import type { ServiceData } from '@/data/services';
import ChatDemo from './ChatDemo';

interface ServiceVisualProps {
  service: ServiceData;
}

export default function ServiceVisual({ service }: ServiceVisualProps) {
  switch (service.demo) {
    case 'ai-chat':
      return service.chat ? (
        <ChatDemo turns={service.chat} variant="ai" gradient={service.gradient} subtitle="bilim bazasiga ulangan" />
      ) : null;
    case 'telegram-bot':
      return service.chat ? (
        <ChatDemo turns={service.chat} variant="telegram" gradient={service.gradient} subtitle="darhol javob beradi" />
      ) : null;
    case 'dashboard':
      return <DashboardDemo gradient={service.gradient} color={service.color} />;
    case 'web':
      return <WebDemo gradient={service.gradient} color={service.color} />;
    case 'mobile':
      return <MobileDemo gradient={service.gradient} color={service.color} />;
    default:
      return null;
  }
}

/* ----------------------------- Dashboard demo ----------------------------- */

function DashboardDemo({ gradient, color }: { gradient: [string, string]; color: string }) {
  const bars = [42, 64, 38, 78, 52, 88, 60, 72];
  const tiles = [
    { label: 'Sotuvlar', value: '₿ 48.2M', up: '+12.4%' },
    { label: 'Buyurtmalar', value: '1 284', up: '+8.1%' },
    { label: 'Konversiya', value: '6.7%', up: '+1.3%' },
  ];

  return (
    <div
      className="rounded-3xl overflow-hidden shadow-2xl border p-5"
      style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(10,10,26,0.6)', backdropFilter: 'blur(14px)' }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-sm font-semibold text-white">Savdo paneli</div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-300/80 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Real-time
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg text-white/70" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <Activity size={13} /> Bu oy
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5 mb-5">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>{t.label}</div>
            <div className="text-sm font-bold text-white mt-1">{t.value}</div>
            <div className="flex items-center gap-0.5 text-[10px] text-emerald-400 mt-0.5">
              <ArrowUpRight size={11} /> {t.up}
            </div>
          </div>
        ))}
      </div>

      {/* Animated bar chart */}
      <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-white/70 flex items-center gap-1.5"><TrendingUp size={13} /> Haftalik daromad</span>
          <span className="text-[11px]" style={{ color }}>↑ 23% o'sish</span>
        </div>
        <div className="flex items-end justify-between gap-2 h-28">
          {bars.map((h, i) => (
            <div key={i} className="flex-1 rounded-t-md relative overflow-hidden" style={{ height: '100%' }}>
              <div
                className="absolute bottom-0 left-0 right-0 rounded-t-md"
                style={{
                  height: `${h}%`,
                  background: `linear-gradient(180deg, ${gradient[0]}, ${gradient[1]})`,
                  transformOrigin: 'bottom',
                  animation: `barPulse 2.8s ease-in-out ${i * 0.16}s infinite`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- Web demo -------------------------------- */

function WebDemo({ gradient, color }: { gradient: [string, string]; color: string }) {
  const radius = 52;
  const circ = 2 * Math.PI * radius;
  const ringStyle: CSSProperties = {
    animation: 'gaugeFill 4s ease-in-out infinite',
    ['--circ' as string]: `${circ}`,
    ['--target' as string]: `${circ * (1 - 0.98)}`,
  };
  const scores = [
    { label: 'SEO', value: 100 },
    { label: 'Best Practices', value: 96 },
    { label: 'Accessibility', value: 98 },
  ];

  return (
    <div className="rounded-3xl overflow-hidden shadow-2xl border" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-3" style={{ background: '#1B1B2E' }}>
        <span className="w-3 h-3 rounded-full bg-red-400/80" />
        <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
        <span className="w-3 h-3 rounded-full bg-green-400/80" />
        <div className="flex-1 mx-3 px-3 py-1.5 rounded-lg text-xs text-white/60 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <span className="text-emerald-400">🔒</span> uzafo.uz
        </div>
      </div>

      {/* Body — Lighthouse-style report */}
      <div className="p-6 flex flex-col items-center" style={{ background: 'rgba(10,10,26,0.6)', backdropFilter: 'blur(14px)' }}>
        <div className="relative w-[140px] h-[140px]">
          <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
            <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
            <circle
              cx="70" cy="70" r={radius} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
              strokeDasharray={circ}
              style={ringStyle}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold" style={{ color }}>98</span>
            <span className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Performance</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 w-full mt-6">
          {scores.map((s, i) => (
            <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-lg font-bold text-emerald-400">{s.value}</div>
              <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
              <div className="h-1 rounded-full mt-2 overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div className="h-full rounded-full" style={{ width: `${s.value}%`, background: `linear-gradient(90deg, ${gradient[0]}, ${gradient[1]})`, animation: `growBar 1.4s ease-out ${i * 0.2}s both` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- Mobile demo ------------------------------ */

function MobileDemo({ gradient, color }: { gradient: [string, string]; color: string }) {
  const items = [
    { icon: ShoppingBag, title: 'Yangi buyurtma', sub: '#1042 · 320 000 so\'m' },
    { icon: TrendingUp, title: 'Kunlik hisobot', sub: '+18% o\'sish' },
    { icon: User, title: 'Yangi mijoz', sub: 'Akmal R. qo\'shildi' },
  ];
  const nav = [Home, Search, ShoppingBag, User];

  return (
    <div className="flex justify-center">
      <div
        className="relative rounded-[2.5rem] p-3 shadow-2xl"
        style={{ width: 280, background: '#0B0B16', border: '1px solid rgba(255,255,255,0.1)', boxShadow: `0 30px 60px ${color}22, 0 0 0 1px rgba(255,255,255,0.04)` }}
      >
        {/* Notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 rounded-full bg-black z-10" />

        <div className="rounded-[2rem] overflow-hidden" style={{ background: 'linear-gradient(180deg, #0E0E1F, #0A0A14)', height: 480 }}>
          {/* Header */}
          <div className="px-5 pt-9 pb-5" style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}>
            <div className="text-white/80 text-xs">Xush kelibsiz 👋</div>
            <div className="text-white text-lg font-bold mt-0.5">Uzafo App</div>
            <div className="mt-4 rounded-2xl p-3.5 flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.16)', backdropFilter: 'blur(4px)' }}>
              <div>
                <div className="text-white/70 text-[10px]">Umumiy balans</div>
                <div className="text-white text-xl font-extrabold">12 480 000</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <TrendingUp size={18} color="#fff" />
              </div>
            </div>
          </div>

          {/* Push notification */}
          <div
            className="mx-4 -mt-3 rounded-xl px-3 py-2.5 flex items-center gap-2.5 shadow-lg relative z-10"
            style={{ background: 'rgba(255,255,255,0.95)', animation: 'pushIn 4.5s ease-in-out infinite' }}
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}>
              <Bell size={14} color="#fff" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-gray-900 truncate">Yangi to'lov qabul qilindi</div>
              <div className="text-[10px] text-gray-500 truncate">+450 000 so'm · hozir</div>
            </div>
          </div>

          {/* List */}
          <div className="px-4 pt-4 space-y-2.5">
            {items.map((it, i) => {
              const Icon = it.icon;
              return (
                <div
                  key={it.title}
                  className="flex items-center gap-3 rounded-xl p-3"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', animation: `slideUpFade 0.6s ease-out ${0.3 + i * 0.2}s both` }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}22` }}>
                    <Icon size={16} color={color} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[12px] font-semibold text-white truncate">{it.title}</div>
                    <div className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{it.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom nav */}
          <div className="absolute bottom-3 left-3 right-3 rounded-2xl px-5 py-3 flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {nav.map((Icon, i) => (
              <div key={i} className="relative">
                <Icon size={20} color={i === 0 ? color : 'rgba(255,255,255,0.4)'} />
                {i === 0 && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: color }} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
