import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LayoutGrid, Info, ShieldCheck, Mail, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mobileLinks = [
  { id: 'xizmatlar', label: 'Xizmatlar', icon: LayoutGrid },
  { id: 'biz-haqimizda', label: 'Biz haqimizda', icon: Info },
  { id: 'xavfsizlik', label: 'Xavfsizlik', icon: ShieldCheck },
  { id: 'boglanish', label: "Bog'lanish", icon: Mail },
];

export default function NavigationBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const currentScrollPos = window.scrollY;
      
      // Scrolled state for background opacity
      setScrolled(currentScrollPos > 20);
      
      // Visibility logic: hide on scroll down, show on scroll up
      if (currentScrollPos > prevScrollPos && currentScrollPos > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [prevScrollPos]);

  // Lock background scroll while the mobile drawer is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const scrollTo = (id: string) => {
    // If mobile menu is open, close it first
    if (mobileOpen) {
      setMobileOpen(false);
    }

    // Small delay to allow menu animation to complete or at least start closing
    // This is crucial for mobile devices where animations can block scrolling
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const offset = 88; // Height of the fixed navbar
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, mobileOpen ? 300 : 0); // Only delay if menu was open
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ 
        opacity: visible ? 1 : 0.7, 
        y: visible ? 0 : -60,
        background: scrolled ? 'rgba(5,5,5,0.92)' : 'rgba(5,5,5,0.7)',
      }}
      transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
      className="fixed top-0 left-0 right-0 z-20 h-[88px] flex items-center justify-center"
      style={{
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        transition: 'background 0.3s ease',
      }}
    >
      <div className="w-full max-w-[1200px] flex items-center justify-between px-6 md:px-10">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-0 text-2xl font-extrabold tracking-tight">
          <span style={{ color: 'var(--text-primary)', textShadow: '0 0 25px rgba(79,70,229,0.4)' }}>
            Uza
          </span>
          <span style={{ color: 'var(--accent-indigo-light)' }}>fo</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-8 lg:gap-10">
          {[
            { id: 'xizmatlar', label: 'Xizmatlar' },
            { id: 'biz-haqimizda', label: 'Biz haqimizda' },
            { id: 'xavfsizlik', label: 'Xavfsizlik' },
            { id: 'boglanish', label: "Bog'lanish" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="relative text-[17px] font-semibold transition-colors duration-200 group"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              {item.label}
              <span className="absolute bottom-[-4px] left-0 h-[2px] w-full origin-center scale-x-0 transition-transform duration-300 group-hover:scale-x-100" style={{ background: 'var(--accent-indigo)' }} />
            </button>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button className="sm:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={28} color="#F5F5F7" /> : <Menu size={28} color="#F5F5F7" />}
        </button>
      </div>

      {/* Mobile drawer (slides in from the left) */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop — clearly dims the page behind the drawer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 top-[88px] sm:hidden z-30"
              style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
            />

            {/* Panel — distinct elevated surface */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-[88px] left-0 bottom-0 w-[82%] max-w-[320px] sm:hidden z-40 flex flex-col overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, #16162F 0%, #0B0B18 100%)',
                borderRight: '1px solid rgba(129,140,248,0.25)',
                boxShadow: '16px 0 50px rgba(0,0,0,0.7)',
              }}
            >
              {/* Indigo accent glow at the top */}
              <div
                className="absolute -top-16 -left-10 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.35) 0%, transparent 70%)' }}
              />

              {/* Drawer header */}
              <div className="relative flex items-center justify-between px-5 pt-5 pb-4">
                <span className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: 'var(--text-muted)' }}>
                  Menyu
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Yopish"
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <X size={18} color="#F5F5F7" />
                </button>
              </div>

              <nav className="relative flex flex-col px-4 gap-2 mt-1">
                {mobileLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollTo(item.id)}
                      className="group flex items-center gap-3 text-left text-[15px] font-semibold px-3 py-3.5 rounded-xl transition-colors active:scale-[0.99]"
                      style={{ color: 'var(--text-primary)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <span
                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: 'rgba(79,70,229,0.18)', border: '1px solid rgba(129,140,248,0.25)' }}
                      >
                        <Icon size={17} color="#A5B4FC" />
                      </span>
                      <span className="flex-1">{item.label}</span>
                      <ChevronRight size={16} className="opacity-40 group-hover:opacity-80 transition-opacity" />
                    </button>
                  );
                })}
              </nav>

              <div className="relative mt-auto p-5 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <button onClick={() => scrollTo('boglanish')} className="gradient-btn w-full justify-center">
                  Bepul konsultatsiya
                </button>
                <p className="text-xs text-center mt-4" style={{ color: 'var(--text-muted)' }}>
                  &copy; {new Date().getFullYear()} Uzafo.uz
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );

}
