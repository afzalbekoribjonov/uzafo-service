import { motion } from 'framer-motion';

function OrbitDecoration() {
  return (
    <div className="relative w-[300px] h-[300px] mx-auto">
      {/* Ring 1 */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: '1px dashed rgba(129,140,248,0.2)',
          animation: 'orbit1 30s linear infinite',
        }}
      >
        <div
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: 'var(--accent-indigo)',
            boxShadow: '0 0 12px rgba(79,70,229,0.6)',
            top: '50%',
            left: '-4px',
            transform: 'translateY(-50%)',
          }}
        />
      </div>
      {/* Ring 2 */}
      <div
        className="absolute inset-8 rounded-full"
        style={{
          border: '1px dashed rgba(129,140,248,0.15)',
          animation: 'orbit2 45s linear infinite',
        }}
      >
        <div
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: 'var(--accent-indigo-light)',
            boxShadow: '0 0 12px rgba(129,140,248,0.6)',
            top: '-4px',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        />
        <div
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            background: 'var(--accent-electric)',
            boxShadow: '0 0 10px rgba(59,130,246,0.6)',
            bottom: '15%',
            right: '5%',
          }}
        />
      </div>
      {/* Ring 3 */}
      <div
        className="absolute inset-16 rounded-full"
        style={{
          border: '1px dashed rgba(129,140,248,0.1)',
          animation: 'orbit3 60s linear infinite',
        }}
      >
        <div
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            background: '#7C3AED',
            boxShadow: '0 0 10px rgba(124,58,237,0.6)',
            bottom: '50%',
            right: '-3px',
            transform: 'translateY(50%)',
          }}
        />
      </div>
      {/* Center */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
        style={{
          background: 'var(--accent-indigo)',
          boxShadow: '0 0 30px rgba(79,70,229,0.5)',
        }}
      />
    </div>
  );
}

export default function AboutSection() {
  return (
    <section id="biz-haqimizda" className="py-20 px-6">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p
            className="text-xs uppercase tracking-[0.12em] mb-3"
            style={{ color: 'var(--accent-indigo-light)' }}
          >
            Biz haqimizda
          </p>
          <h2
            className="font-bold leading-[1.1] tracking-[-0.02em] mb-6"
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 3rem)',
              color: 'var(--text-primary)',
            }}
          >
            Raqamli o&apos;zgarishlarga yetaklovchi hamkoringiz
          </h2>
          <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
            Uzafo Service — bu bizneslarni raqamlashtirish va zamonaviy texnologiyalar orqali rivojlantirish maqsadida yaratilgan xizmat. Biz har bir mijoz uchun individual yondashuv va eng yaxshi texnologik yechimlarni taqdim etamiz.
          </p>
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Bizning jamoamiz tajribali dasturchilar va dizaynerlardan iborat bo&apos;lib, har bir loyihaga maksimal professionalizm bilan yondashadi. Zamonaviy texnologiyalar va eng yaxshi amaliyotlardan foydalanib, biznesingizni yangi bosqichga olib chiqamiz.
          </p>
        </motion.div>

        {/* Right: Orbit decoration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex justify-center"
        >
          <OrbitDecoration />
        </motion.div>
      </div>
    </section>
  );
}
