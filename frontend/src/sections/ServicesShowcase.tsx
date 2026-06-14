import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { services } from '@/data/services';

export default function ServicesShowcase() {
  const navigate = useNavigate();

  const handleServiceClick = (id: string) => {
    navigate(`/services/${id}`);
  };

  return (
    <section id="xizmatlar" className="py-20 px-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <p
            className="text-xs uppercase tracking-[0.12em] mb-3"
            style={{ color: 'var(--accent-indigo-light)' }}
          >
            Xizmatlarimiz
          </p>
          <h2
            className="font-bold leading-[1.1] tracking-[-0.02em]"
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 3rem)',
              color: 'var(--text-primary)',
            }}
          >
            Digital kelajak uchun professional yechimlar
          </h2>
        </motion.div>

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group glass-panel p-8 cursor-pointer transition-all duration-400 relative overflow-hidden"
                onClick={() => handleServiceClick(service.id)}
                style={{
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                whileHover={{
                  y: -4,
                  borderColor: `${service.color}80`,
                  boxShadow: `0 12px 40px ${service.color}22`,
                }}
              >
                {/* Hover glow that adopts the service color */}
                <div
                  className="absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${service.color}33 0%, transparent 70%)` }}
                />

                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-400 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${service.gradient[0]}26, ${service.gradient[1]}14)`,
                    border: `1px solid ${service.color}40`,
                  }}
                >
                  <Icon size={28} color={service.color} />
                </div>

                <h3
                  className="text-lg font-semibold mt-5 tracking-[-0.01em] flex items-center gap-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {service.title}
                </h3>
                <p
                  className="text-sm mt-2 leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {service.desc}
                </p>

                <div
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                  style={{ color: service.color }}
                >
                  Batafsil <ArrowUpRight size={16} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
