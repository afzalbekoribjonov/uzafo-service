import { motion } from 'framer-motion';
import { Briefcase, Globe, Smartphone, Brain, BotMessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import BlackHoleTransition from '@/components/BlackHoleTransition';

const services = [
  {
    id: 'biznesni-avtomatlashtirish',
    icon: Briefcase,
    title: 'Biznesni avtomatlashtirish',
    desc: 'Biznes jarayonlarini raqamli tizimga o\'tkazish va kundalik ishlarni avtomatlashtirish orqali samaradorlikni oshirish.',
  },
  {
    id: 'telegram-ekotizimlari',
    icon: BotMessageSquare,
    title: 'Telegram Ekotizimlari',
    desc: 'Murakkab Telegram botlar va WebApp ilovalar orqali mijozlarga xizmat ko\'rsatishni yangi bosqichga olib chiqish.',
  },
  {
    id: 'ai-yechimlar',
    icon: Brain,
    title: 'Sun\'iy Intellekt Yechimlari',
    desc: 'Loyiha va biznes jarayonlariga aqlli modellar va AI yordamchilarini integratsiya qilish.',
  },
  {
    id: 'veb-saytlar',
    icon: Globe,
    title: 'Yuqori Sifatli Veb-saytlar',
    desc: 'Har qanday qurilmaga moslashuvchan, tezkor va qidiruv tizimlarida (SEO) yaxshi chiquvchi professional veb-platformalar.',
  },
  {
    id: 'mobil-ilovalar',
    icon: Smartphone,
    title: 'Mobil Ilovalar',
    desc: 'iOS va Android qurilmalari uchun bir vaqtning o\'zida ishlovchi mukammal va qulay mobil dasturlar yaratish.',
  },
];

export default function ServicesShowcase() {
  const navigate = useNavigate();
  const [transitioning, setTransitioning] = useState<{ active: boolean; targetId: string | null }>({
    active: false,
    targetId: null
  });

  const handleServiceClick = (id: string) => {
    setTransitioning({ active: true, targetId: id });
  };

  const handleAnimationFinished = () => {
    if (transitioning.targetId) {
      navigate(`/services/${transitioning.targetId}`);
    }
  };

  return (
    <section id="xizmatlar" className="py-20 px-6">
      <BlackHoleTransition 
        isExiting={transitioning.active} 
        onFinished={handleAnimationFinished} 
      />
      
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
                className="glass-panel p-8 cursor-pointer transition-all duration-400"
                onClick={() => handleServiceClick(service.id)}
                style={{
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                whileHover={{
                  y: -4,
                  borderColor: 'rgba(129,140,248,0.5)',
                  boxShadow: '0 12px 40px rgba(79,70,229,0.15)',
                }}
              >
                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(79,70,229,0.15)',
                    border: '1px solid rgba(79,70,229,0.3)',
                  }}
                >
                  <Icon size={28} color="#818CF8" />
                </div>

                <h3
                  className="text-lg font-semibold mt-5 tracking-[-0.01em]"
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
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
