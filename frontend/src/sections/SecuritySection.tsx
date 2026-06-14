import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ShieldCheck, Zap, Bug, Lock, EyeOff, RefreshCw, KeyRound } from 'lucide-react';

const protections = [
  { icon: Zap, title: 'DDoS hujumlaridan himoya', desc: "Ortiqcha va zararli so'rovlar avtomatik aniqlanib bloklanadi." },
  { icon: Bug, title: 'SQL Injection himoyasi', desc: "Ma'lumotlar bazasiga zararli so'rovlar o'tkazib yuborilmaydi." },
  { icon: Lock, title: "Ma'lumotlar shifrlanishi", desc: 'Barcha aloqa SSL/TLS bilan uchdan-uchgacha shifrlanadi.' },
  { icon: EyeOff, title: 'Yashirin infratuzilma', desc: "Server va ma'lumotlar bazasi tashqaridan ko'rinmaydi." },
  { icon: RefreshCw, title: 'Avtomatik zaxira', desc: "Ma'lumotlar muntazam zaxiralanib, yo'qolishdan saqlanadi." },
  { icon: KeyRound, title: 'Kirish nazorati', desc: 'Faqat ruxsat etilgan foydalanuvchilar tizimga kira oladi.' },
];

const threatAngles = [0, 45, 90, 135, 180, 225, 270, 315];

function BlockedCounter() {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [count, setCount] = useState(18_402);

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => {
      setCount((c) => c + Math.floor(Math.random() * 3) + 1);
    }, 900);
    return () => clearInterval(id);
  }, [inView]);

  return <span ref={ref}>{count.toLocaleString('ru-RU')}</span>;
}

export default function SecuritySection() {
  return (
    <section id="xavfsizlik" className="py-20 px-6 relative overflow-hidden">
      <div
        className="absolute top-1/4 right-0 w-[600px] h-[600px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)' }}
      />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <p className="text-xs uppercase tracking-[0.12em] mb-3" style={{ color: '#34d399' }}>
            Xavfsizlik
          </p>
          <h2 className="font-bold leading-[1.1] tracking-[-0.02em]" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', color: 'var(--text-primary)' }}>
            Loyihangiz qal'a kabi himoyalangan
          </h2>
          <p className="text-base mt-4 max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Har bir tizim ko'p qatlamli himoya bilan quriladi — hujumlar mijozlaringizga yetib bormaydi.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Shield visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[320px] flex items-center justify-center"
          >
            {/* Incoming threats */}
            {threatAngles.map((angle, i) => (
              <div
                key={angle}
                className="absolute left-1/2 top-1/2 pointer-events-none"
                style={{ transform: `rotate(${angle}deg)` }}
              >
                <span
                  className="block w-2.5 h-2.5 rounded-full"
                  style={{
                    background: '#f43f5e',
                    boxShadow: '0 0 8px #f43f5e',
                    animation: `threatIn 2.4s ease-in ${i * 0.3}s infinite`,
                  }}
                />
              </div>
            ))}

            {/* Expanding rings */}
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute rounded-full border"
                style={{
                  width: 120, height: 120,
                  borderColor: 'rgba(16,185,129,0.4)',
                  animation: `shieldRing 2.6s ease-out ${i * 0.85}s infinite`,
                }}
              />
            ))}

            {/* Shield core */}
            <div
              className="relative w-28 h-28 rounded-3xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #059669, #34d399)',
                boxShadow: '0 0 50px rgba(16,185,129,0.5)',
                animation: 'floatY 4s ease-in-out infinite',
              }}
            >
              <ShieldCheck size={52} color="#fff" />
            </div>

            {/* Blocked counter chip */}
            <div
              className="absolute bottom-2 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl text-center whitespace-nowrap"
              style={{ background: 'rgba(5,5,5,0.7)', border: '1px solid rgba(16,185,129,0.25)', backdropFilter: 'blur(8px)' }}
            >
              <div className="text-lg font-bold text-white tabular-nums">
                <BlockedCounter />
              </div>
              <div className="text-[10px] uppercase tracking-wide" style={{ color: '#34d399' }}>
                Bloklangan hujumlar
              </div>
            </div>
          </motion.div>

          {/* Protections grid */}
          <div className="grid sm:grid-cols-2 gap-3">
            {protections.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: i * 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-2xl p-4 group"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div className="flex items-start justify-between mb-2.5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)' }}>
                      <Icon size={18} className="text-emerald-400" />
                    </div>
                    <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399' }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Faol
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">{p.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{p.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
