import { motion } from 'framer-motion';
import { ChevronDown, Mail } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

export default function HeroSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScroll, setShowScroll] = useState(true);

  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY < 100);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToServices = () => {
    document.getElementById('xizmatlar')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('boglanish')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={scrollRef}
      className="relative flex flex-col items-center justify-center text-center px-6"
      style={{ minHeight: 'calc(100vh - 88px)' }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, rgba(79,70,229,0.12) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-[800px]">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs uppercase tracking-[0.15em] mb-6"
          style={{ color: 'var(--text-muted)' }}
        >
          UZAFO SERVICE
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-extrabold leading-[1.05] tracking-[-0.03em]"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            color: 'var(--text-primary)',
            textShadow: '0 4px 30px rgba(0,0,0,0.5)',
          }}
        >
          Biznesingizni raqamli kelajakka olib boring
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg font-normal mt-5 mx-auto max-w-[560px]"
          style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}
        >
          Biznesingizni raqamlashtirish, zamonaviy web ilovalar, Telegram botlar va mobil dasturlarni biz bilan yarating.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-4 mt-10"
        >
          <button onClick={scrollToServices} className="gradient-btn">
            Xizmatlarni ko&apos;rish <ChevronDown size={18} />
          </button>
          <button onClick={scrollToContact} className="ghost-btn">
            Bog&apos;lanish <Mail size={18} />
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showScroll ? 0.6 : 0 }}
        transition={{ delay: 1.2, duration: 0.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ChevronDown
          size={28}
          style={{ color: 'var(--text-muted)', animation: 'scrollBounce 2s ease-in-out infinite' }}
        />
      </motion.div>
    </section>
  );
}
