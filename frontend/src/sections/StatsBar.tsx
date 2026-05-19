import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { useRef, useEffect } from 'react';

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.floor(v));
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionVal, value, { duration: 1.5, ease: 'easeOut' });
      return controls.stop;
    }
  }, [isInView, value, motionVal]);

  useEffect(() => {
    const unsubscribe = rounded.on('change', (v) => {
      if (ref.current) ref.current.textContent = v + suffix;
    });
    return unsubscribe;
  }, [rounded, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

const stats = [
  { value: 50, suffix: '+', label: 'Muvaffaqiyatli loyihalar' },
  { value: 30, suffix: '+', label: 'Mamnun mijozlar' },
  { value: 5, suffix: '+', label: 'Yillik tajriba' },
];

export default function StatsBar() {
  return (
    <section
      className="w-full py-12 px-6"
      style={{
        background: 'transparent',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="max-w-[1000px] mx-auto flex flex-wrap justify-center gap-12 md:gap-16">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <div
              className="font-extrabold"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--accent-indigo-light)' }}
            >
              <AnimatedNumber value={stat.value} suffix={stat.suffix} />
            </div>
            <div className="text-sm font-medium mt-1" style={{ color: 'var(--text-muted)' }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
