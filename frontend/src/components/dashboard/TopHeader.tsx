import { useLocation } from 'react-router-dom';
import { Search, Menu, Mail } from 'lucide-react';
import { useState } from 'react';
import { formatUzbekDate } from '@/lib/utils';
import { useDataStore } from '@/stores/dataStore';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Bosh sahifa',
  '/dashboard/clients': 'Mijozlar',
  '/dashboard/projects': 'Loyihalar',
};

interface TopHeaderProps {
  onMenuClick: () => void;
  onNotificationClick: () => void;
}

export default function TopHeader({ onMenuClick, onNotificationClick }: TopHeaderProps) {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Dashboard';
  const [searchVal, setSearchVal] = useState('');
  const unreadCount = useDataStore((s) => s.getUnreadMessageCount());

  return (
    <header
      className="h-16 flex items-center justify-between px-6 shrink-0 sticky top-0 z-10"
      style={{
        background: 'rgba(5,5,5,0.9)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-white/5">
          <Menu size={20} color="#9CA3AF" />
        </button>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden sm:flex items-center relative">
          <Search size={16} className="absolute left-3 pointer-events-none" color="#6B7280" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Qidirish..."
            className="pl-10 pr-4 py-2 rounded-xl text-sm w-[220px] lg:w-[280px] outline-none transition-all"
            style={{
              background: 'var(--bg-space)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--text-primary)',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(129,140,248,0.5)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
          />
        </div>

        {/* Notification */}
        <button 
          onClick={onNotificationClick}
          className="relative p-2 rounded-xl hover:bg-white/5 transition-colors group"
          title="Xabarlar"
        >
          <Mail size={20} className={unreadCount > 0 ? "text-indigo-400" : "text-gray-400"} />
          {unreadCount > 0 && (
            <span
              className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg"
              style={{ background: 'var(--status-danger)' }}
            >
              {unreadCount}
            </span>
          )}
        </button>

        {/* Date */}
        <span className="hidden md:block text-sm" style={{ color: 'var(--text-muted)' }}>
          {formatUzbekDate()}
        </span>
      </div>
    </header>
  );
}

