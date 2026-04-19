import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'cyan' | 'purple' | 'green' | 'none';
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className = '', glow = 'none', hover = true, onClick }: GlassCardProps) {
  const glowClass = glow === 'cyan' ? 'neon-border-cyan' : glow === 'purple' ? 'neon-border-purple' : glow === 'green' ? 'neon-border-green' : '';
  const hoverClass = hover ? 'glass-card' : 'glass-card-dark';

  return (
    <div className={`${hoverClass} ${glowClass} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  accentColor?: 'cyan' | 'purple' | 'green' | 'amber';
}

export function StatCard({ label, value, change, changeType = 'up', icon, accentColor = 'cyan' }: StatCardProps) {
  const colorMap = {
    cyan: { bg: 'rgba(0,240,255,0.08)', color: '#00F0FF', border: 'rgba(0,240,255,0.15)' },
    purple: { bg: 'rgba(159,75,255,0.08)', color: '#9F4BFF', border: 'rgba(159,75,255,0.15)' },
    green: { bg: 'rgba(34,197,94,0.08)', color: '#22C55E', border: 'rgba(34,197,94,0.15)' },
    amber: { bg: 'rgba(245,158,11,0.08)', color: '#F59E0B', border: 'rgba(245,158,11,0.15)' },
  };
  const c = colorMap[accentColor];
  const changeColor = changeType === 'up' ? '#22C55E' : changeType === 'down' ? '#EF4444' : '#8892A4';
  const changePrefix = changeType === 'up' ? '↑' : changeType === 'down' ? '↓' : '';

  return (
    <div className="stat-card">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm" style={{ color: '#8892A4' }}>{label}</p>
        {icon && (
          <div className="p-2 rounded-lg" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
            <span style={{ color: c.color }}>{icon}</span>
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      {change && (
        <p className="text-xs font-medium" style={{ color: changeColor }}>
          {changePrefix} {change}
        </p>
      )}
    </div>
  );
}

export function AIOrb({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <div
      className={`ai-orb flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        <svg width={size * 0.4} height={size * 0.4} viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#0A0F1C" strokeWidth="2" strokeLinejoin="round" />
          <path d="M2 17L12 22L22 17" stroke="#0A0F1C" strokeWidth="2" strokeLinejoin="round" />
          <path d="M2 12L12 17L22 12" stroke="#0A0F1C" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
