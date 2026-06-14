import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, ArrowUpRight, MessageCircle } from 'lucide-react';
import CosmicBackground from '@/components/CosmicBackground';
import { getService, services } from '@/data/services';
import ServiceVisual from '@/components/service/ServiceVisual';
import InteractiveDiagram from '@/components/service/InteractiveDiagram';
import ProcessTimeline from '@/components/service/ProcessTimeline';
import LiveStats from '@/components/service/LiveStats';
import ComparisonTable from '@/components/service/ComparisonTable';

const easing = [0.16, 1, 0.3, 1] as const;

function SectionLabel({ children, color }: { children: ReactNode; color: string }) {
  return (
    <p className="text-xs uppercase tracking-[0.18em] mb-3 font-semibold" style={{ color }}>
      {children}
    </p>
  );
}

export default function ServiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const service = getService(id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#050505]">
        <CosmicBackground />
        <div className="relative z-10 text-center">
          <h1 className="text-2xl font-bold mb-4">Xizmat topilmadi</h1>
          <button onClick={() => navigate('/')} className="text-indigo-400 underline">
            Asosiy sahifaga qaytish
          </button>
        </div>
      </div>
    );
  }

  const Icon = service.icon;
  const { color, gradient } = service;
  const otherServices = services.filter((s) => s.id !== service.id);

  const goToContact = () => navigate('/', { state: { scrollTo: 'boglanish' } });

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden">
      <CosmicBackground />

      <div className="relative z-10 max-w-6xl mx-auto pt-10 md:pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Back + breadcrumb */}
        <div className="flex items-center justify-between mb-8 md:mb-10">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 transition-colors group text-white/70 hover:text-white"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Orqaga</span>
          </button>
          <nav className="hidden sm:flex items-center gap-2 text-xs text-white/40">
            <Link to="/" className="hover:text-white/70 transition-colors">Bosh sahifa</Link>
            <span>/</span>
            <span style={{ color }}>{service.title}</span>
          </nav>
        </div>

        {/* Hero */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center mb-20 md:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easing }}
          >
            <div
              className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full mb-6"
              style={{ background: `${color}1a`, border: `1px solid ${color}33` }}
            >
              <Icon size={16} style={{ color }} />
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color }}>
                Xizmat
              </span>
            </div>

            <h1 className="font-extrabold leading-[1.08] tracking-tight" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              {service.title}
            </h1>
            <p className="text-lg md:text-xl mt-5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {service.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-8">
              <button
                onClick={goToContact}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white transition-transform hover:-translate-y-0.5"
                style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`, boxShadow: `0 8px 24px ${color}40` }}
              >
                <MessageCircle size={18} /> Bepul konsultatsiya
              </button>
              <button onClick={() => navigate('/')} className="ghost-btn">
                Boshqa xizmatlar <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easing, delay: 0.1 }}
          >
            <ServiceVisual service={service} />
          </motion.div>
        </div>

        {/* Live stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: easing }}
          className="mb-20 md:mb-28"
        >
          <LiveStats metrics={service.metrics} color={color} gradient={gradient} />
        </motion.div>

        {/* What we do + features */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 mb-20 md:mb-28">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: easing }}
          >
            <SectionLabel color={color}>Biz nima qilamiz</SectionLabel>
            <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-5">
              Jarayonni boshidan oxirigacha biz olib boramiz
            </h2>
            <p className="text-base md:text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {service.details}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: easing }}
            className="grid sm:grid-cols-2 gap-3"
          >
            {service.features.map((f, i) => (
              <motion.div
                key={f}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4, ease: easing }}
                className="flex items-start gap-3 rounded-2xl p-4"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: `${color}22` }}
                >
                  <Check size={14} style={{ color }} />
                </div>
                <span className="text-sm leading-snug text-white/90">{f}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Interactive architecture diagram */}
        <section className="mb-20 md:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: easing }}
            className="text-center mb-10"
          >
            <SectionLabel color={color}>Qanday ishlaydi</SectionLabel>
            <h2 className="text-2xl md:text-3xl font-bold">Jonli tizim arxitekturasi</h2>
            <p className="text-sm mt-3" style={{ color: 'var(--text-muted)' }}>
              Tugunlarni sichqoncha bilan suring — bog'lanishlar real vaqtda kuzatib boradi.
            </p>
          </motion.div>
          <InteractiveDiagram nodes={service.flow} color={color} gradient={gradient} />
        </section>

        {/* Results comparison table */}
        <section className="mb-20 md:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: easing }}
            className="mb-8"
          >
            <SectionLabel color={color}>Natijalar</SectionLabel>
            <h2 className="text-2xl md:text-3xl font-bold">Avval va keyin — farqni ko'ring</h2>
          </motion.div>
          <ComparisonTable rows={service.comparison} color={color} gradient={gradient} />
        </section>

        {/* Process */}
        <section className="mb-20 md:mb-28 grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: easing }}
          >
            <SectionLabel color={color}>Ish jarayoni</SectionLabel>
            <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-4">
              Loyihani 5 bosqichda yetkazamiz
            </h2>
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Har bir bosqichda siz bilan aloqada bo'lamiz — natija aniq va kutilgandek bo'ladi.
            </p>
          </motion.div>
          <ProcessTimeline steps={service.process} color={color} gradient={gradient} />
        </section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: easing }}
          className="relative overflow-hidden rounded-3xl p-8 md:p-14 text-center mb-20"
          style={{ background: `linear-gradient(135deg, ${gradient[0]}26, ${gradient[1]}0d)`, border: `1px solid ${color}33` }}
        >
          <div
            className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${color}33 0%, transparent 70%)` }}
          />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl font-bold leading-tight">Loyihangizni boshlaymizmi?</h2>
            <p className="text-base md:text-lg mt-4 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Bepul konsultatsiya oling — g'oyangizni eshitamiz va aniq yechim taklif qilamiz.
            </p>
            <button
              onClick={goToContact}
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-white mt-8 transition-transform hover:-translate-y-0.5"
              style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`, boxShadow: `0 8px 24px ${color}50` }}
            >
              <MessageCircle size={18} /> Biz bilan bog'laning
            </button>
          </div>
        </motion.section>

        {/* Other services */}
        <section>
          <SectionLabel color={color}>Davom eting</SectionLabel>
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Boshqa xizmatlar</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {otherServices.map((s) => {
              const SIcon = s.icon;
              return (
                <Link
                  key={s.id}
                  to={`/services/${s.id}`}
                  className="group rounded-2xl p-5 transition-all hover:-translate-y-1"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `linear-gradient(135deg, ${s.gradient[0]}26, ${s.gradient[1]}14)`, border: `1px solid ${s.color}33` }}
                  >
                    <SIcon size={20} style={{ color: s.color }} />
                  </div>
                  <h3 className="text-sm font-semibold leading-snug mb-2">{s.title}</h3>
                  <span className="inline-flex items-center gap-1 text-xs font-medium opacity-60 group-hover:opacity-100 transition-opacity" style={{ color: s.color }}>
                    Batafsil <ArrowUpRight size={13} />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
