import { motion } from 'framer-motion';
import { Mail, Globe, Send } from 'lucide-react';
import { useState } from 'react';
import { useDataStore } from '@/stores/dataStore';
import { useToast } from '@/stores/toastStore';

export default function ContactSection() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const addMessage = useDataStore((s) => s.addMessage);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!email.trim() || !message.trim()) {
      toast.error("Iltimos, barcha maydonlarni to'ldiring");
      return;
    }

    setIsSubmitting(true);
    try {
      await addMessage({ email: email.trim(), content: message.trim() });
      setEmail('');
      setMessage('');
      toast.success("Xabaringiz yuborildi. Tez orada bog'lanamiz!");
    } catch {
      toast.error("Xabar yuborilmadi. Iltimos, keyinroq qayta urinib ko'ring.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="boglanish" className="py-20 px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(79,70,229,0.05) 0%, transparent 70%)' }} />

      <div className="max-w-[1000px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2
            className="font-bold leading-[1.1] tracking-[-0.02em] mb-6 text-left"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              color: 'var(--text-primary)',
            }}
          >
            Biz bilan bog&apos;laning
          </h2>
          <p className="text-lg mb-10 text-left" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Savollaringiz bormi? Biznesingizni raqamli kelajakka olib borishda biz sizga yordam beramiz. Formani to&apos;ldiring va biz siz bilan bog&apos;lanamiz.
          </p>

          <div className="flex flex-col gap-4">
            <a
              href="mailto:info@uzafo.uz"
              className="flex items-center gap-4 p-4 rounded-2xl glass-panel transition-all hover:border-indigo-500/50 group"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors">
                <Mail size={22} color="#818CF8" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: 'var(--text-muted)' }}>Email</p>
                <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>info@uzafo.uz</p>
              </div>
            </a>

            <a
              href="https://uzafo.uz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-2xl glass-panel transition-all hover:border-indigo-500/50 group"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors">
                <Globe size={22} color="#818CF8" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: 'var(--text-muted)' }}>Veb-sayt</p>
                <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>uzafo.uz</p>
              </div>
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="glass-panel p-8 lg:p-10"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium tracking-wide" style={{ color: 'var(--text-secondary)' }}>Email manzilingiz</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="misol@pochta.uz"
                className="w-full px-4 py-3.5 rounded-xl outline-none transition-all text-sm"
                style={{ 
                  background: 'var(--bg-space)', 
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'var(--text-primary)'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(129,140,248,0.4)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium tracking-wide" style={{ color: 'var(--text-secondary)' }}>Xabaringiz</label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Loyihangiz haqida qisqacha yozing..."
                className="w-full px-4 py-3.5 rounded-xl outline-none transition-all text-sm resize-none"
                style={{ 
                  background: 'var(--bg-space)', 
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'var(--text-primary)'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(129,140,248,0.4)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="gradient-btn w-full justify-center py-4 rounded-xl text-base mt-2"
              style={{ opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? "Yuborilmoqda..." : (
                <>
                  Xabarni yuborish <Send size={18} />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

