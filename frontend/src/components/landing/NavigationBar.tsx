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
    setMobileOpen(false);
    // Use requestAnimationFrame to ensure the menu close animation doesn't interfere with scrolling
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) {
        const offset = 88; // Height of the fixed navbar
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
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
        <div className="hidden sm:flex items-center gap-10">
          <button
            onClick={() => scrollTo('xizmatlar')}
            className="relative text-[17px] font-semibold transition-colors duration-200 group"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Xizmatlar
            <span className="absolute bottom-[-4px] left-0 h-[2px] w-full origin-center scale-x-0 transition-transform duration-300 group-hover:scale-x-100" style={{ background: 'var(--accent-indigo)' }} />
          </button>
          <button
            onClick={() => scrollTo('biz-haqimizda')}
            className="relative text-[17px] font-semibold transition-colors duration-200 group"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Biz haqimizda
            <span className="absolute bottom-[-4px] left-0 h-[2px] w-full origin-center scale-x-0 transition-transform duration-300 group-hover:scale-x-100" style={{ background: 'var(--accent-indigo)' }} />
          </button>
          <button
            onClick={() => scrollTo('boglanish')}
            className="relative text-[17px] font-semibold transition-colors duration-200 group"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Bog'lanish
            <span className="absolute bottom-[-4px] left-0 h-[2px] w-full origin-center scale-x-0 transition-transform duration-300 group-hover:scale-x-100" style={{ background: 'var(--accent-indigo)' }} />
          </button>
        </div>

        {/* Mobile hamburger */}
        <button className="sm:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={28} color="#F5F5F7" /> : <Menu size={28} color="#F5F5F7" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-[88px] left-0 right-0 sm:hidden overflow-hidden"
            style={{ background: 'rgba(5,5,5,0.98)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex flex-col p-8 gap-6">
              <button onClick={() => scrollTo('xizmatlar')} className="text-left text-lg font-semibold" style={{ color: 'var(--text-secondary)' }}>Xizmatlar</button>
              <button onClick={() => scrollTo('biz-haqimizda')} className="text-left text-lg font-semibold" style={{ color: 'var(--text-secondary)' }}>Biz haqimizda</button>
              <button onClick={() => scrollTo('boglanish')} className="text-left text-lg font-semibold" style={{ color: 'var(--text-secondary)' }}>Bog'lanish</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );

}
