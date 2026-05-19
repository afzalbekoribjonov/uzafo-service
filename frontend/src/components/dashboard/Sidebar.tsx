import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FolderKanban, LogOut, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { to: '/dashboard', label: 'Bosh sahifa', icon: LayoutDashboard },
  { to: '/dashboard/clients', label: 'Mijozlar', icon: Users },
  { to: '/dashboard/projects', label: 'Loyihalar', icon: FolderKanban },
];

interface SidebarProps {
  onClose?: () => void;
  className?: string;
}

export default function Sidebar({ onClose, className = '' }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (onClose) onClose();
  };

  return (
    <aside
      className={`flex flex-col h-screen sticky top-0 shrink-0 transition-all duration-300 ${className}`}
      style={{
        width: collapsed ? 70 : 260,
        background: 'var(--bg-space)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Brand */}
      <div className="flex items-center justify-between px-6 h-16 shrink-0">
        {!collapsed && (
          <span className="text-lg font-extrabold tracking-tight">
            <span style={{ color: 'var(--text-primary)' }}>Uza</span>
            <span style={{ color: 'var(--accent-indigo-light)' }}>fo</span>
          </span>
        )}
        {collapsed && (
          <span className="text-lg font-extrabold mx-auto" style={{ color: 'var(--accent-indigo)' }}>U</span>
        )}
        
        {/* Mobile close button */}
        <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-white/5">
          <X size={20} color="#9CA3AF" />
        </button>
      </div>

      {/* Collapse toggle (visible on tablet/desktop) */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex absolute -right-3 top-16 w-6 h-6 rounded-full items-center justify-center cursor-pointer"
        style={{ background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        {collapsed ? <ChevronRight size={12} color="#9CA3AF" /> : <ChevronLeft size={12} color="#9CA3AF" />}
      </button>

      {/* Nav items */}
      <nav className="flex-1 px-3 pt-4 flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-[#818CF8]'
                    : 'text-[#9CA3AF] hover:text-[#F5F5F7]'
                }`
              }
              style={({ isActive }) => ({
                background: isActive ? 'rgba(79,70,229,0.15)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--accent-indigo)' : '3px solid transparent',
              })}
            >
              <Icon size={20} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom: User + Logout */}
      <div className="px-4 pb-4 shrink-0">
        <div
          className="mb-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        />
        <div className="flex items-center gap-3 px-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #3B82F6)' }}
          >
            AO
          </div>
          {!collapsed && (
            <>
              <span className="text-sm font-medium flex-1 overflow-hidden text-ellipsis" style={{ color: 'var(--text-secondary)' }}>Admin</span>
              <button onClick={handleLogout} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                <LogOut size={16} color="#6B7280" />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
