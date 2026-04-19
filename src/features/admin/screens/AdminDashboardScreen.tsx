import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Users, Briefcase, DollarSign, TrendingUp, Shield, AlertCircle, CheckCircle, XCircle, BarChart2, Activity, Bot, Flag } from 'lucide-react';
import { AppLayout } from '../../../shared/components/AppLayout';
import { DB, MARKET_INSIGHTS } from '../../../mock_backend';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const REVENUE_DATA = [
  { id: 'admin-oct', month: 'Oct', revenue: 124000, users: 3200 },
  { id: 'admin-nov', month: 'Nov', revenue: 178000, users: 4100 },
  { id: 'admin-dec', month: 'Dec', revenue: 145000, users: 3800 },
  { id: 'admin-jan', month: 'Jan', revenue: 234000, users: 5200 },
  { id: 'admin-feb', month: 'Feb', revenue: 289000, users: 6100 },
  { id: 'admin-mar', month: 'Mar', revenue: 342000, users: 7400 },
  { id: 'admin-apr', month: 'Apr', revenue: 398000, users: 8200 },
] as const;

const categoryData = [
  { name: 'Web Dev', value: 35, color: '#00F0FF' },
  { name: 'Design', value: 25, color: '#9F4BFF' },
  { name: 'Data Science', value: 20, color: '#22C55E' },
  { name: 'Writing', value: 12, color: '#F59E0B' },
  { name: 'Other', value: 8, color: '#8892A4' },
];

const PENDING_MODERATION = [
  { id: 1, type: 'Job Post', title: 'Senior Developer Position', user: 'TechCorp Inc.', flagReason: 'Suspicious budget range', risk: 'Low' },
  { id: 2, type: 'Profile', title: 'Marcus Rivera – Data Scientist', user: 'u_freelancer_3', flagReason: 'Unverified credentials', risk: 'Medium' },
  { id: 3, type: 'Proposal', title: 'Content Writing Proposal', user: 'Jane D.', flagReason: 'Potential spam', risk: 'High' },
];

const HEATMAP_SKILLS = [
  ['React', '#00F0FF', 95], ['Python', '#22C55E', 91], ['AI/ML', '#9F4BFF', 88], ['TypeScript', '#00F0FF', 85],
  ['Node.js', '#22C55E', 82], ['Figma', '#9F4BFF', 79], ['AWS', '#F59E0B', 76], ['Docker', '#00F0FF', 72],
  ['Vue.js', '#22C55E', 68], ['Flutter', '#9F4BFF', 65], ['SQL', '#F59E0B', 62], ['Go', '#00F0FF', 58],
];

export default function AdminDashboardScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'moderation' | 'revenue'>('overview');
  const allUsers = DB.getUsers();
  const allJobs = DB.getJobs();

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield size={20} style={{ color: '#9F4BFF' }} />
              <span className="badge-purple text-xs">Admin Panel</span>
            </div>
            <h1 className="text-3xl font-black text-white">GigBridge Admin</h1>
          </div>
          <div className="flex items-center gap-2">
            {PENDING_MODERATION.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#F59E0B' }}>
                <AlertCircle size={14} />
                <span className="text-sm font-medium">{PENDING_MODERATION.length} items need review</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: '71,141', change: '+1,284 this week', icon: <Users size={16} />, color: 'cyan' },
            { label: 'Active Jobs', value: allJobs.filter(j => j.status === 'open').length.toString(), change: '+42 today', icon: <Briefcase size={16} />, color: 'purple' },
            { label: 'Platform Revenue', value: '$398K', change: '+16.4% MoM', icon: <DollarSign size={16} />, color: 'green' },
            { label: 'Success Rate', value: '96.4%', change: '+0.8% this month', icon: <TrendingUp size={16} />, color: 'amber' },
          ].map(stat => (
            <div key={stat.label} className="stat-card">
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm" style={{ color: '#8892A4' }}>{stat.label}</p>
                <div className="p-2 rounded-lg" style={{ background: `rgba(${stat.color === 'cyan' ? '0,240,255' : stat.color === 'purple' ? '159,75,255' : stat.color === 'green' ? '34,197,94' : '245,158,11'},0.1)` }}>
                  <span style={{ color: stat.color === 'cyan' ? '#00F0FF' : stat.color === 'purple' ? '#9F4BFF' : stat.color === 'green' ? '#22C55E' : '#F59E0B' }}>{stat.icon}</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-xs" style={{ color: '#22C55E' }}>↑ {stat.change}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['overview', 'users', 'moderation', 'revenue'].map(t => (
            <button key={t} onClick={() => setActiveTab(t as any)}
              className="px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all"
              style={{ background: activeTab === t ? 'rgba(159,75,255,0.15)' : 'rgba(255,255,255,0.04)', border: activeTab === t ? '1px solid rgba(159,75,255,0.4)' : '1px solid rgba(255,255,255,0.08)', color: activeTab === t ? '#9F4BFF' : '#8892A4' }}>
              {t}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Revenue Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 glass-card p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-white font-semibold">Platform Revenue</h2>
                  <span className="badge-green text-xs">↑ 16.4% MoM</span>
                </div>
                <ResponsiveContainer width="100%" height={220} key="admin-revenue-container">
                  <AreaChart data={REVENUE_DATA}>
                    <defs>
                      <linearGradient id="adminRevGrad2026" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9F4BFF" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#9F4BFF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={{ fill: '#8892A4', fontSize: 12 }} axisLine={false} tickLine={false} interval={0} />
                    <YAxis tick={{ fill: '#8892A4', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={{ background: '#0D1526', border: '1px solid rgba(159,75,255,0.3)', borderRadius: 10, color: 'white' }} formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']} />
                    <Area type="monotone" dataKey="revenue" stroke="#9F4BFF" strokeWidth={2} fill="url(#adminRevGrad2026)" isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="glass-card p-6">
                <h2 className="text-white font-semibold mb-4">Category Distribution</h2>
                <div className="flex justify-center mb-4">
                  <PieChart width={180} height={150}>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value">
                      {categoryData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </div>
                <div className="space-y-2">
                  {categoryData.map(cat => (
                    <div key={cat.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                        <span className="text-xs text-white">{cat.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-white">{cat.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trending Skills Heatmap */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-white font-semibold">Trending Skills Heatmap</h2>
                <span className="badge-cyan text-xs">Real-time Data</span>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {HEATMAP_SKILLS.map(([skill, color, demand]) => (
                  <div key={skill as string} className="heatmap-cell p-3 rounded-xl text-center cursor-pointer"
                    style={{ background: `${color as string}${Math.round((demand as number / 100) * 30).toString(16).padStart(2, '0')}`, border: `1px solid ${color as string}30` }}>
                    <p className="text-xs font-semibold text-white">{skill as string}</p>
                    <div className="progress-bar-gb mt-1">
                      <div className="progress-bar-gb-fill" style={{ width: `${demand as number}%`, background: color as string }} />
                    </div>
                    <p className="text-[10px] mt-1" style={{ color: color as string }}>{demand as number}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="glass-card overflow-hidden">
            <div className="p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <h2 className="text-white font-semibold">User Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {['User', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold" style={{ color: '#8892A4' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map(u => (
                    <tr key={u.id} className="border-b transition-all hover:bg-white/5"
                      style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-lg" />
                          <div>
                            <p className="text-white text-sm font-medium">{u.name}</p>
                            <p className="text-xs" style={{ color: '#8892A4' }}>{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`badge-${u.role === 'admin' ? 'purple' : u.role === 'client' ? 'cyan' : 'green'} capitalize text-xs`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ background: u.isVerified ? '#22C55E' : '#F59E0B' }} />
                          <span className="text-xs" style={{ color: u.isVerified ? '#22C55E' : '#F59E0B' }}>
                            {u.isVerified ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs" style={{ color: '#8892A4' }}>{u.createdAt}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button className="text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(0,240,255,0.08)', color: '#00F0FF' }}>View</button>
                          <button className="text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444' }}>Ban</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'moderation' && (
          <div className="space-y-4">
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Flag size={16} style={{ color: '#F59E0B' }} />
                <h2 className="text-white font-semibold">Moderation Queue</h2>
                <span className="badge-amber text-xs ml-auto">{PENDING_MODERATION.length} Pending</span>
              </div>
              <div className="space-y-3">
                {PENDING_MODERATION.map(item => (
                  <div key={item.id} className="flex items-start justify-between p-4 rounded-xl gap-4"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`badge-${item.risk === 'High' ? 'amber' : item.risk === 'Medium' ? 'purple' : 'cyan'} text-xs`}>
                          {item.risk} Risk
                        </span>
                        <span className="text-xs font-medium text-white">{item.type}</span>
                      </div>
                      <p className="text-white font-medium text-sm">{item.title}</p>
                      <p className="text-xs mt-1" style={{ color: '#8892A4' }}>Flagged: {item.flagReason}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button className="p-2 rounded-lg transition-all"
                        style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#22C55E' }}>
                        <CheckCircle size={14} />
                      </button>
                      <button className="p-2 rounded-lg transition-all"
                        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#EF4444' }}>
                        <XCircle size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dispute Center */}
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={16} style={{ color: '#9F4BFF' }} />
                <h2 className="text-white font-semibold">Dispute Center</h2>
                <span className="badge-green text-xs ml-auto">0 Active</span>
              </div>
              <div className="text-center py-8">
                <CheckCircle size={32} className="mx-auto mb-3" style={{ color: '#22C55E' }} />
                <p className="text-white font-medium">No active disputes</p>
                <p className="text-sm mt-1" style={{ color: '#8892A4' }}>All transactions are running smoothly</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'revenue' && (
          <div className="glass-card p-6">
            <h2 className="text-white font-semibold mb-5">Revenue Analytics</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <XAxis dataKey="month" tick={{ fill: '#8892A4', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8892A4', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: '#0D1526', border: '1px solid rgba(159,75,255,0.3)', borderRadius: 10, color: 'white' }} formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#9F4BFF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </AppLayout>
  );
}