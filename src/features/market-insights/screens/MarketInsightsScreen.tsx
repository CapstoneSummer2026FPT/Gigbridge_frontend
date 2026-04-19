import { useState, useMemo } from 'react';
import { TrendingUp, DollarSign, BarChart2, ArrowUpRight, Bot, Globe, Zap } from 'lucide-react';
import { AppLayout } from '../../../shared/components/AppLayout';
import { MARKET_INSIGHTS } from '../../../mock_backend';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const RADAR_DATA = [
  { category: 'React', demand: 88, rate: 95 }, { category: 'Python', demand: 91, rate: 100 },
  { category: 'AI/ML', demand: 95, rate: 125 }, { category: 'Design', demand: 76, rate: 82 },
  { category: 'DevOps', demand: 78, rate: 110 }, { category: 'Flutter', demand: 80, rate: 85 },
];

export default function MarketInsightsScreen() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const { averageRatesBySkill, monthlyEarnings, trendingCategories, platformStats } = MARKET_INSIGHTS;

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Bot size={16} style={{ color: '#00F0FF' }} />
              <span className="badge-cyan text-xs">AI-Powered Data</span>
            </div>
            <h1 className="text-3xl font-black text-white">Market Insights</h1>
            <p className="mt-1" style={{ color: '#8892A4' }}>Real-time freelance market intelligence — updated daily</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{ background: 'rgba(0,240,255,0.06)', border: '1px solid rgba(0,240,255,0.15)' }}>
            <div className="notif-dot" />
            <span className="text-sm" style={{ color: '#00F0FF' }}>Live Data · Last updated 2m ago</span>
          </div>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Freelancers', value: platformStats.totalFreelancers.toLocaleString(), icon: <Globe size={16} />, color: '#00F0FF', change: '+2,847 this month' },
            { label: 'Completed Projects', value: platformStats.totalProjects.toLocaleString(), icon: <BarChart2 size={16} />, color: '#9F4BFF', change: '+1,284 this week' },
            { label: 'Total Paid Out', value: `$${(platformStats.totalPaid / 1000000).toFixed(1)}M`, icon: <DollarSign size={16} />, color: '#22C55E', change: '+$1.2M this month' },
            { label: 'Platform Success Rate', value: `${platformStats.successRate}%`, icon: <TrendingUp size={16} />, color: '#F59E0B', change: '+0.8% vs last month' },
          ].map(stat => (
            <div key={stat.label} className="stat-card">
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-lg" style={{ background: stat.color + '15', color: stat.color }}>{stat.icon}</span>
                <ArrowUpRight size={14} style={{ color: '#22C55E' }} />
              </div>
              <p className="text-2xl font-black text-white mb-1">{stat.value}</p>
              <p className="text-xs mb-0.5" style={{ color: '#8892A4' }}>{stat.label}</p>
              <p className="text-xs font-medium" style={{ color: '#22C55E' }}>↑ {stat.change}</p>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Average Rates by Skill */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold">Average Hourly Rates</h2>
              <span className="badge-cyan text-xs">$/hr</span>
            </div>
            <ResponsiveContainer width="100%" height={240} key="market-rates-container">
              <BarChart data={averageRatesBySkill} layout="vertical">
                <defs>
                  <linearGradient id="marketBarGrad2026" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#9F4BFF" />
                    <stop offset="100%" stopColor="#00F0FF" />
                  </linearGradient>
                </defs>
                <XAxis type="number" tick={{ fill: '#8892A4', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                <YAxis type="category" dataKey="skill" tick={{ fill: '#8892A4', fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={{ background: '#0D1526', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 10, color: 'white' }} formatter={(v: number) => [`$${v}/hr`, 'Rate']} />
                <Bar dataKey="rate" radius={[0, 4, 4, 0]} fill="url(#marketBarGrad2026)" isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Earnings Trend */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold">Earnings Trend</h2>
              <div className="flex gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-1 rounded-full" style={{ background: '#00F0FF' }} />
                  <span className="text-xs" style={{ color: '#8892A4' }}>Freelancers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-1 rounded-full" style={{ background: '#9F4BFF' }} />
                  <span className="text-xs" style={{ color: '#8892A4' }}>Clients</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240} key="market-earnings-container">
              <AreaChart data={monthlyEarnings}>
                <defs>
                  <linearGradient id="marketFlGrad2026" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#00F0FF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="marketClGrad2026" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9F4BFF" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#9F4BFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: '#8892A4', fontSize: 12 }} axisLine={false} tickLine={false} interval={0} />
                <YAxis tick={{ fill: '#8892A4', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: '#0D1526', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 10, color: 'white' }} />
                <Area type="monotone" dataKey="freelancer" stroke="#00F0FF" strokeWidth={2} fill="url(#marketFlGrad2026)" isAnimationActive={false} />
                <Area type="monotone" dataKey="client" stroke="#9F4BFF" strokeWidth={2} fill="url(#marketClGrad2026)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trending Categories */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Zap size={18} style={{ color: '#F59E0B' }} />
              <h2 className="text-white font-semibold">Trending Categories</h2>
            </div>
            <span className="badge-amber text-xs">↑ Growing Fast</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingCategories.map((cat, i) => (
              <div key={i} className="p-4 rounded-xl cursor-pointer group transition-all"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,240,255,0.2)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(34,197,94,0.12)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.25)' }}>
                    {cat.growth}
                  </span>
                </div>
                <h3 className="text-white font-semibold mb-1">{cat.name}</h3>
                <p className="text-xs" style={{ color: '#8892A4' }}>{cat.jobs.toLocaleString()} open positions</p>
                <div className="progress-bar-gb mt-3">
                  <div className="progress-bar-gb-fill" style={{ width: `${Math.min((cat.jobs / 10000) * 100, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demand vs Rate Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h2 className="text-white font-semibold mb-4">Skills: Demand vs Rate Radar</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis dataKey="category" tick={{ fill: '#8892A4', fontSize: 11 }} />
                <PolarRadiusAxis tick={false} axisLine={false} />
                <Radar name="Demand" dataKey="demand" stroke="#00F0FF" fill="#00F0FF" fillOpacity={0.15} />
                <Radar name="Rate Index" dataKey="rate" stroke="#9F4BFF" fill="#9F4BFF" fillOpacity={0.15} />
                <Tooltip contentStyle={{ background: '#0D1526', border: '1px solid rgba(0,240,255,0.2)', borderRadius: 10, color: 'white' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* AI Report Card */}
          <div className="glass-card p-6"
            style={{ background: 'linear-gradient(135deg, rgba(159,75,255,0.06), rgba(0,240,255,0.04))', border: '1px solid rgba(159,75,255,0.2)' }}>
            <div className="flex items-center gap-2 mb-5">
              <Bot size={18} style={{ color: '#9F4BFF' }} />
              <h2 className="text-white font-semibold">AI Market Intelligence Report</h2>
              <span className="badge-purple text-xs ml-auto">Q2 2026</span>
            </div>
            <div className="space-y-4">
              {[
                { title: '🚀 Hottest Skill: AI/ML Integration', body: 'Demand surged 142% YoY. Average rate reached $125/hr. Expected to grow another 60% by Q4 2026.', color: '#9F4BFF' },
                { title: '📈 Fastest Growing: React + AI Skills', body: 'Developers combining React with AI integration command 35% higher rates than React-only developers.', color: '#00F0FF' },
                { title: '💡 Career Advice', body: 'Top earners in 2026 combine core programming skills with domain expertise in AI, fintech, or healthcare.', color: '#22C55E' },
                { title: '⚠️ Market Watch', body: 'Pure frontend roles declining 8% as AI tools automate routine UI tasks. Focus on architecture and AI integration.', color: '#F59E0B' },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${item.color}20` }}>
                  <p className="text-white text-sm font-semibold mb-1">{item.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: '#8892A4' }}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}