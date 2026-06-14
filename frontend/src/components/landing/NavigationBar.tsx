import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 top-[88px] sm:hidden z-30"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-[88px] left-0 bottom-0 w-[80%] max-w-[300px] sm:hidden z-40 flex flex-col"
              style={{ background: 'rgba(8,8,16,0.98)', backdropFilter: 'blur(16px)', borderRight: '1px solid rgba(255,255,255,0.08)' }}
            >
              <nav className="flex flex-col p-6 gap-1">
                {[
                  { id: 'xizmatlar', label: 'Xizmatlar' },
                  { id: 'biz-haqimizda', label: 'Biz haqimizda' },
                  { id: 'xavfsizlik', label: 'Xavfsizlik' },
                  { id: 'boglanish', label: "Bog'lanish" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className="text-left text-base font-semibold px-3 py-3.5 rounded-xl transition-colors hover:bg-white/5"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="mt-auto p-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
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
