import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Bell, Search, ChevronDown, Sun, Moon, LogOut, Settings, User, Zap, Menu } from 'lucide-react';
import { useApp } from '../../app/providers/AppProvider';
import { UserRole } from '../../types/models/User';
import { DB } from '../../mock_backend';

interface TopNavProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function TopNav({ onMenuClick, showMenuButton = false }: TopNavProps = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  // Safely get app context - might be null for guest users
  let appContext;
  try {
    appContext = useApp();
  } catch (e) {
    appContext = null;
  }

  const user = appContext?.user || null;
  const role = appContext?.role || null;
  const theme = appContext?.theme || 'dark';
  const setRole = appContext?.setRole || (() => {});
  const toggleTheme = appContext?.toggleTheme || (() => {});
  const logout = appContext?.logout || (() => {});

  const notifications = user ? DB.getNotificationsByUser(user.id) : [];
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleRoleSwitch = (newRole: 0 | 1) => {
    setRole(newRole);
    if (newRole === 0) navigate('/client/dashboard');
    else navigate('/freelancer/dashboard');
    setShowUserMenu(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) navigate(`/jobs/browse?q=${encodeURIComponent(searchVal.trim())}`);
  };

  const isLanding = location.pathname === '/';

  return (
    <header className="glass-nav fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-4 md:px-6 gap-4">
      {/* Hamburger Menu Button - Show on both mobile and desktop when logged in */}
      {showMenuButton && (
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg transition-all hover:bg-white/10"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#8892A4' }}
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
      )}
      
      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => navigate('/')}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #00F0FF, #9F4BFF)' }}>
          <Zap size={18} className="text-[#0A0F1C]" />
        </div>
        <span className="text-white font-bold text-lg hidden sm:block">GigBridge</span>
        <span className="text-xs font-bold px-1.5 py-0.5 rounded hidden sm:block"
          style={{ background: 'rgba(0,240,255,0.12)', color: '#00F0FF', border: '1px solid rgba(0,240,255,0.25)' }}>
          AI
        </span>
      </div>

      {/* Search Bar */}
      {!isLanding && (
        <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:flex">
          <div className="relative w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8892A4' }} />
            <input
              type="text"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder="Search jobs, freelancers, skills..."
              className="input-gb w-full pl-9 pr-4 py-2 text-sm"
            />
          </div>
        </form>
      )}

      {/* Nav Links (Guest) */}
      {isLanding && (
        <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
          {['How It Works', 'Browse Jobs', 'Market Insights'].map(link => (
            <span key={link}
              className="text-sm cursor-pointer transition-colors"
              style={{ color: '#8892A4' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#00F0FF')}
              onMouseLeave={e => (e.currentTarget.style.color = '#8892A4')}
              onClick={() => {
                if (link === 'Browse Jobs') navigate('/jobs/browse');
                if (link === 'Market Insights') navigate('/market-insights');
              }}
            >
              {link}
            </span>
          ))}
        </nav>
      )}

      <div className="flex items-center gap-2 ml-auto">
        {/* Role Switcher (logged in) */}
        {user && role !== null && role !== UserRole.Admin && (
          <div className="role-toggle hidden sm:flex">
            <button
              className={`role-toggle-btn ${(role as number) === 0 ? 'active' : ''}`}
              onClick={() => handleRoleSwitch(0)}
            >
              Client
            </button>
            <button
              className={`role-toggle-btn ${(role as number) === 1 ? 'active' : ''}`}
              onClick={() => handleRoleSwitch(1)}
            >
              Freelancer
            </button>
          </div>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg transition-all"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#8892A4' }}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notifications */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => { setShowNotifs(!showNotifs); setShowUserMenu(false); }}
              className="p-2 rounded-lg transition-all relative"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#8892A4' }}
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                  style={{ background: '#00F0FF', color: '#0A0F1C' }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifs && (
              <div className="absolute right-0 top-12 w-80 rounded-2xl p-3 z-50"
                style={{ background: 'rgba(13,21,38,0.98)', border: '1px solid rgba(0,240,255,0.15)', backdropFilter: 'blur(24px)' }}>
                <div className="flex items-center justify-between mb-3 px-2">
                  <p className="text-white font-semibold text-sm">Notifications</p>
                  <button onClick={() => navigate('/notifications')} className="text-xs" style={{ color: '#00F0FF' }}>See all</button>
                </div>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {notifications.slice(0, 5).map(n => (
                    <div key={n.id} className="p-3 rounded-xl cursor-pointer transition-all"
                      style={{ background: n.isRead ? 'transparent' : 'rgba(0,240,255,0.05)', border: n.isRead ? 'transparent' : '1px solid rgba(0,240,255,0.1)' }}
                      onClick={() => { setShowNotifs(false); navigate(n.actionUrl || '/notifications'); }}>
                      <p className="text-white text-xs font-medium">{n.title}</p>
                      <p className="text-xs mt-0.5 line-clamp-2" style={{ color: '#8892A4' }}>{n.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}

        {/* User Menu / Auth Buttons */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifs(false); }}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="w-7 h-7 rounded-full avatar-glow flex items-center justify-center text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #00F0FF, #9F4BFF)' }}>
                {user.first_name.charAt(0)}{user.last_name.charAt(0)}
              </div>
              <span className="text-white text-sm font-medium hidden md:block">{user.first_name}</span>
              <ChevronDown size={14} style={{ color: '#8892A4' }} />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-12 w-56 rounded-2xl p-2 z-50"
                style={{ background: 'rgba(13,21,38,0.98)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(24px)' }}>
                <div className="px-3 py-2 mb-1">
                  <p className="text-white text-sm font-semibold">{user.full_name}</p>
                  <p className="text-xs" style={{ color: '#8892A4' }}>{user.email}</p>
                </div>
                <div className="h-px mb-1" style={{ background: 'rgba(255,255,255,0.06)' }} />

                {role !== null && role !== UserRole.Admin && (
                  <>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all hover:bg-white/5"
                      style={{ color: '#8892A4' }}
                      onClick={() => { handleRoleSwitch((role as number) === 0 ? 1 : 0); }}>
                      <User size={14} />
                      Switch to {(role as number) === 0 ? 'Freelancer' : 'Client'}
                    </button>
                  </>
                )}

                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all hover:bg-white/5"
                  style={{ color: '#8892A4' }}
                  onClick={() => { navigate('/settings'); setShowUserMenu(false); }}>
                  <Settings size={14} />
                  Settings
                </button>

                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all hover:bg-white/5"
                  style={{ color: '#8892A4' }}
                  onClick={toggleTheme}>
                  {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>

                <div className="h-px my-1" style={{ background: 'rgba(255,255,255,0.06)' }} />

                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all hover:bg-red-500/10"
                  style={{ color: '#EF4444' }}
                  onClick={() => { logout(); navigate('/'); setShowUserMenu(false); }}>
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{ color: '#8892A4', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              onClick={() => navigate('/auth')}>
              Log in
            </button>
            <button className="btn-cyan px-4 py-2 text-sm hidden sm:block"
              onClick={() => navigate('/auth')}>
              Get Started
            </button>
          </div>
        )}
      </div>

      {/* Click outside to close menus */}
      {(showUserMenu || showNotifs) && (
        <div className="fixed inset-0 z-40" onClick={() => { setShowUserMenu(false); setShowNotifs(false); }} />
      )}
    </header>
  );
}