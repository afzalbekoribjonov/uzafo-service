import { Send, Phone, Mail, Globe, MessageSquare } from 'lucide-react';

export default function FooterSection() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 88;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <footer
      id="boglanish"
      className="w-full pt-16 pb-8 px-6"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(5,5,5,0.4)' }}
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-0 text-2xl font-extrabold tracking-tight">
              <span style={{ color: 'var(--text-primary)' }}>Uza</span>
              <span style={{ color: 'var(--accent-indigo-light)' }}>fo</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--text-secondary)' }}>
              Biznesingizni raqamli kelajakka olib chiqamiz. Sifatli va zamonaviy texnologik yechimlar.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6" style={{ color: 'var(--text-primary)' }}>
              Navigatsiya
            </h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => scrollTo('xizmatlar')} 
                  className="text-sm transition-colors hover:text-indigo-400" 
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Xizmatlar
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollTo('biz-haqimizda')} 
                  className="text-sm transition-colors hover:text-indigo-400" 
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Biz haqimizda
                </button>
              </li>
              <li>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
                  className="text-sm transition-colors hover:text-indigo-400" 
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Bosh sahifa
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6" style={{ color: 'var(--text-primary)' }}>
              Aloqa
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                  <Mail size={16} className="text-indigo-400" />
                </div>
                <a href="mailto:info@uzafo.uz" className="text-sm hover:text-indigo-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                  info@uzafo.uz
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                  <Phone size={16} className="text-indigo-400" />
                </div>
                <a href="tel:+998901234567" className="text-sm hover:text-indigo-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                  +998 (90) 123-45-67
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  <Send size={16} className="text-indigo-400" />
                </div>
                <a 
                  href="https://t.me/uzafo" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm font-medium hover:text-indigo-300 transition-colors flex items-center gap-1"
                  style={{ color: 'var(--accent-indigo-light)' }}
                >
                  Telegram Kanal <MessageSquare size={12} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            &copy; {new Date().getFullYear()} Uzafo.uz. Barcha huquqlar himoyalangan.
          </p>
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            <Globe size={12} />
            <span>uzafo.uz</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
