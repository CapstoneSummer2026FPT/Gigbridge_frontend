import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  LayoutDashboard, Briefcase, Search, FileText, MessageSquare,
  Bot, BarChart2, User, Settings, Shield, Users, Flag,
  TrendingUp, Video, PlusCircle, Zap, ChevronRight, X
} from 'lucide-react';
import { useApp } from '../../app/providers/AppProvider';
import '../styles/Sidebar.css';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: string;
  badgeType?: 'cyan' | 'purple' | 'green';
}

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

function getNavItems(role: number | null): NavItem[] {
  if (role === 0) {
    return [
      { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/client/dashboard' },
      { label: 'Post a Job', icon: <PlusCircle size={18} />, path: '/jobs/post', badge: 'AI', badgeType: 'cyan' },
      { label: 'My Jobs', icon: <Briefcase size={18} />, path: '/jobs/my-jobs' },
      { label: 'Proposals', icon: <FileText size={18} />, path: '/proposals', badge: '5', badgeType: 'purple' },
      { label: 'Projects', icon: <Flag size={18} />, path: '/workspace/proj_1' },
      { label: 'AI Assistant', icon: <Bot size={18} />, path: '/ai-assistant', badge: 'NEW', badgeType: 'cyan' },
      { label: 'Market Insights', icon: <TrendingUp size={18} />, path: '/market-insights' },
      { label: 'Messages', icon: <MessageSquare size={18} />, path: '/notifications' },
    ];
  }

  if (role === 1) {
    return [
      { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/freelancer/dashboard' },
      { label: 'Browse Jobs', icon: <Search size={18} />, path: '/jobs/browse' },
      { label: 'My Proposals', icon: <FileText size={18} />, path: '/proposals' },
      { label: 'Projects', icon: <Flag size={18} />, path: '/workspace/proj_1' },
      { label: 'AI Assistant', icon: <Bot size={18} />, path: '/ai-assistant', badge: 'AI', badgeType: 'cyan' },
      { label: 'AI Interview', icon: <Video size={18} />, path: '/ai-interview', badge: 'NEW', badgeType: 'purple' },
      { label: 'Market Insights', icon: <TrendingUp size={18} />, path: '/market-insights' },
      { label: 'Messages', icon: <MessageSquare size={18} />, path: '/notifications' },
    ];
  }

  // Admin
  return [
    { label: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/admin' },
    { label: 'Users', icon: <Users size={18} />, path: '/admin' },
    { label: 'Jobs', icon: <Briefcase size={18} />, path: '/admin' },
    { label: 'Analytics', icon: <BarChart2 size={18} />, path: '/admin' },
    { label: 'Market Insights', icon: <TrendingUp size={18} />, path: '/market-insights' },
    { label: 'Settings', icon: <Settings size={18} />, path: '/settings' },
  ];
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, role } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = getNavItems(role);
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <aside className={`gb-sidebar ${isOpen ? 'open' : ''}`}>

      {/* User Profile Mini */}
      {user && (
        <div className="sidebar-profile-mini"
          onClick={() => navigate(role === 1 ? `/profile/freelancer/${user.id}` : `/profile/client/${user.id}`)}>
          <div className="sidebar-profile-avatar">
            {user.first_name.charAt(0)}{user.last_name.charAt(0)}
          </div>
          <div className="sidebar-profile-info">
            <p className="sidebar-profile-name">{user.first_name}</p>
            <p className="sidebar-profile-role">{role === 0 ? 'Client' : role === 1 ? 'Freelancer' : 'Admin'}</p>
          </div>
          <ChevronRight size={14} className="sidebar-profile-chevron" />
        </div>
      )}

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map(item => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`sidebar-item w-full relative ${active ? 'active' : ''}`}
            >
              {active && <span className="sidebar-active-indicator" />}
              <span className="ml-1">{item.icon}</span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className={`badge-${item.badgeType || 'cyan'} text-[10px] px-1.5 py-0`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Links */}
      <div className="sidebar-bottom">
        <button
          onClick={() => navigate('/profile/' + (role === 1 ? 'freelancer' : 'client') + '/' + user?.id)}
          className="sidebar-item w-full"
        >
          <User size={18} />
          <span>Profile</span>
        </button>
        <button onClick={() => navigate('/settings')} className="sidebar-item w-full">
          <Settings size={18} />
          <span>Settings</span>
        </button>
        {role === 2 && (
          <button onClick={() => navigate('/admin')} className="sidebar-item w-full">
            <Shield size={18} />
            <span>Admin Panel</span>
          </button>
        )}
      </div>

      {/* AI Pro Badge */}
      <div className="sidebar-pro-badge">
        <div className="sidebar-pro-header">
          <Zap size={14} className="sidebar-pro-icon" />
          <span className="sidebar-pro-title">GigBridge Pro</span>
        </div>
        <p className="sidebar-pro-desc">Unlock AI features, priority matching & more</p>
        <button className="btn-cyan sidebar-pro-button">Upgrade</button>
      </div>

      {/* Close Button */}
      {onClose && (
        <button className="sidebar-close-button" onClick={onClose}>
          <X size={18} />
        </button>
      )}
    </aside>
  );
}