import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import CosmicBackground from '@/components/CosmicBackground';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/stores/toastStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const toast = useToast();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [shaking, setShaking] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const newErrors: Record<string, boolean> = {};
    if (!username.trim()) newErrors.username = true;
    if (!password.trim()) newErrors.password = true;
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const success = await login(username, password);
      if (success) {
        navigate('/dashboard');
      } else {
        toast.error("Login yoki parol noto'g'ri");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (err: boolean) => ({
    background: 'var(--bg-space)',
    border: `1px solid ${err ? 'var(--status-danger)' : 'rgba(255,255,255,0.08)'}`,
    color: 'var(--text-primary)',
    animation: shaking && err ? 'shake 0.4s ease' : 'none',
  });

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4">
      <CosmicBackground />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
        className="relative z-10 w-full max-w-[420px]"
      >
        <div
          className="p-10 lg:p-12 rounded-3xl"
          style={{
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid var(--accent-border)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 60px rgba(79,70,229,0.1)',
          }}
        >
          {/* Back to Home Button */}
          <Link
            to="/"
            className="absolute top-4 right-4 p-2 rounded-xl transition-all duration-300 group"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
            }}
            title="Asosiy sahifaga qaytish"
          >
            <Home size={18} className="text-gray-400 group-hover:text-indigo-400" />
          </Link>

          {/* Brand */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold tracking-tight">
              <span style={{ color: 'var(--text-primary)' }}>Uza</span>
              <span style={{ color: 'var(--accent-indigo-light)' }}>fo</span>
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Admin Panel</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Login */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Login</label>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setErrors((p) => ({ ...p, username: false })); }}
                placeholder="Login kiriting"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={inputStyle(errors.username)}
                onFocus={(e) => !errors.username && (e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)')}
                onBlur={(e) => !errors.username && (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
              {errors.username && <p className="text-xs mt-1" style={{ color: 'var(--status-danger)' }}>Bu maydonni to'ldirish shart</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>Parol</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: false })); }}
                  placeholder="Parol kiriting"
                  className="w-full px-4 py-3 pr-10 rounded-xl text-sm outline-none transition-all"
                  style={inputStyle(errors.password)}
                  onFocus={(e) => !errors.password && (e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)')}
                  onBlur={(e) => !errors.password && (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={18} color="#6B7280" /> : <Eye size={18} color="#6B7280" />}
                </button>
              </div>
              {errors.password && <p className="text-xs mt-1" style={{ color: 'var(--status-danger)' }}>Bu maydonni to'ldirish shart</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="gradient-btn w-full justify-center mt-2"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <span
                  className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  style={{ animation: 'spin 0.8s linear infinite' }}
                />
              ) : (
                <Lock size={16} />
              )}
              {loading ? " Kirish..." : " Kirish"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
