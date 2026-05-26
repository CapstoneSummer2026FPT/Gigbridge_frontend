import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { TrendingUp, DollarSign, Briefcase, CheckCircle, Clock, Calendar, Download, Eye, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AppLayout } from '../../../shared/components/AppLayout';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import '../../admin/styles/admin-users-screen.css';

// Mock data for milestones and earnings
const MILESTONE_DATA = [
  { id: 'mil_1', jobTitle: 'E-commerce Website Redesign', client: 'TechCorp Inc.', amount: 1200, status: 'completed', completedAt: '2026-05-10', projectId: 'proj_1' },
  { id: 'mil_2', jobTitle: 'Mobile App Development', client: 'StartupXYZ', amount: 2500, status: 'completed', completedAt: '2026-05-05', projectId: 'proj_2' },
  { id: 'mil_3', jobTitle: 'Logo Design Package', client: 'Brand Studios', amount: 450, status: 'completed', completedAt: '2026-04-28', projectId: 'proj_3' },
  { id: 'mil_4', jobTitle: 'API Integration', client: 'DataFlow Inc.', amount: 800, status: 'pending', dueDate: '2026-05-25', projectId: 'proj_4' },
  { id: 'mil_5', jobTitle: 'Content Writing - 10 Articles', client: 'BlogMaster', amount: 350, status: 'completed', completedAt: '2026-04-20', projectId: 'proj_5' },
  { id: 'mil_6', jobTitle: 'SEO Optimization', client: 'MarketGrowth', amount: 650, status: 'in_progress', projectId: 'proj_6' },
];

const EARNINGS_TREND = [
  { month: 'Jan', earnings: 3200 },
  { month: 'Feb', earnings: 4100 },
  { month: 'Mar', earnings: 3800 },
  { month: 'Apr', earnings: 5200 },
  { month: 'May', earnings: 4950 },
];

const EARNINGS_BY_CATEGORY = [
  { name: 'Web Development', value: 45, color: '#0077FF' },
  { name: 'Mobile Apps', value: 30, color: '#9F4BFF' },
  { name: 'Design', value: 15, color: '#22C55E' },
  { name: 'Writing', value: 10, color: '#F59E0B' },
];

export default function FinancialOverviewScreen() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<'month' | 'quarter' | 'year'>('month');

  const stats = useMemo(() => {
    const completed = MILESTONE_DATA.filter(m => m.status === 'completed');
    const pending = MILESTONE_DATA.filter(m => m.status === 'pending');
    const inProgress = MILESTONE_DATA.filter(m => m.status === 'in_progress');

    const totalEarnings = completed.reduce((sum, m) => sum + m.amount, 0);
    const pendingEarnings = pending.reduce((sum, m) => sum + m.amount, 0);
    const avgPerMilestone = completed.length > 0 ? totalEarnings / completed.length : 0;

    return {
      totalEarnings,
      pendingEarnings,
      completedMilestones: completed.length,
      pendingMilestones: pending.length,
      inProgressMilestones: inProgress.length,
      avgPerMilestone,
      totalMilestones: MILESTONE_DATA.length,
    };
  }, []);

  const getStatusBadge = (status: string) => {
    if (status === 'completed') return <span className="badge-green text-xs">Completed</span>;
    if (status === 'pending') return <span className="badge-amber text-xs">Pending</span>;
    return <span className="badge-cyan text-xs">In Progress</span>;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <AppLayout>
      <div className="w-full max-w-[100vw] overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} className="text-green" />
                <span className="badge-green text-xs">Earnings</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-primary">Financial Overview</h1>
              <p className="text-sm text-secondary mt-1">Track your earnings from milestones</p>
            </div>
            <div className="flex gap-2">
              <button className="btn-ghost-cyan px-4 py-2 text-sm flex items-center gap-2">
                <Download size={14} />
                Export
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
            {[
              { label: 'Total Earnings', value: `$${stats.totalEarnings.toLocaleString()}`, icon: <DollarSign size={16} />, color: 'green', trend: '+18%' },
              { label: 'Pending', value: `$${stats.pendingEarnings.toLocaleString()}`, icon: <Clock size={16} />, color: 'amber', trend: `${stats.pendingMilestones}` },
              { label: 'Completed', value: stats.completedMilestones.toString(), icon: <CheckCircle size={16} />, color: 'green', trend: `${stats.completedMilestones}` },
              { label: 'In Progress', value: stats.inProgressMilestones.toString(), icon: <Briefcase size={16} />, color: 'cyan', trend: `${stats.inProgressMilestones}` },
              { label: 'Avg/Milestone', value: `$${stats.avgPerMilestone.toFixed(0)}`, icon: <TrendingUp size={16} />, color: 'purple', trend: '+12%' },
              { label: 'This Month', value: '$4,950', icon: <Calendar size={16} />, color: 'green', trend: '+8%' },
            ].map(stat => (
              <div key={stat.label} className="stat-card">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-secondary truncate">{stat.label}</p>
                  <span className={`icon-${stat.color} flex-shrink-0`}>{stat.icon}</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-primary mb-1">{stat.value}</p>
                <p className="text-xs text-green">{stat.trend}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Earnings Trend */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-primary">Earnings Trend</h3>
                <div className="role-toggle text-xs">
                  <button
                    onClick={() => setTimeRange('month')}
                    className={`role-toggle-btn text-xs px-3 py-1 ${timeRange === 'month' ? 'active' : ''}`}
                  >
                    Month
                  </button>
                  <button
                    onClick={() => setTimeRange('quarter')}
                    className={`role-toggle-btn text-xs px-3 py-1 ${timeRange === 'quarter' ? 'active' : ''}`}
                  >
                    Quarter
                  </button>
                  <button
                    onClick={() => setTimeRange('year')}
                    className={`role-toggle-btn text-xs px-3 py-1 ${timeRange === 'year' ? 'active' : ''}`}
                  >
                    Year
                  </button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={EARNINGS_TREND}>
                  <XAxis dataKey="month" tick={{ fill: '#8892A4', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#8892A4', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ background: '#0D1526', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 10, color: 'white' }} formatter={(v: number) => [`$${v.toLocaleString()}`, 'Earnings']} />
                  <Line type="monotone" dataKey="earnings" stroke="#22C55E" strokeWidth={3} dot={{ fill: '#22C55E', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Earnings by Category */}
            <div className="glass-card p-6">
              <h3 className="font-semibold text-primary mb-5">Earnings by Category</h3>
              <div className="flex items-center gap-8">
                <div className="flex-shrink-0">
                  <PieChart width={180} height={180}>
                    <Pie data={EARNINGS_BY_CATEGORY} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                      {EARNINGS_BY_CATEGORY.map((entry, i) => (
                        <Cell key={`cell-${i}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </div>
                <div className="flex-1 space-y-3">
                  {EARNINGS_BY_CATEGORY.map(item => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                        <span className="text-sm text-primary">{item.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-primary">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Milestones List */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-primary">Recent Milestones</h3>
              <button
                onClick={() => navigate('/workspace/proj_1')}
                className="text-xs text-cyan hover:underline"
              >
                View All Projects
              </button>
            </div>

            <div className="space-y-3">
              {MILESTONE_DATA.map(milestone => (
                <div key={milestone.id} className="glass-card p-4 hover:border-cyan/30 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-sm font-bold text-primary">{milestone.jobTitle}</p>
                        {getStatusBadge(milestone.status)}
                      </div>
                      <p className="text-xs text-secondary mb-1">{milestone.client}</p>
                      <p className="text-xs text-muted">ID: {milestone.id}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${milestone.status === 'completed' ? 'text-green' : 'text-amber'}`}>
                        ${milestone.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center gap-4 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {milestone.status === 'completed'
                          ? `Completed: ${formatDate(milestone.completedAt!)}`
                          : milestone.status === 'pending'
                          ? `Due: ${formatDate(milestone.dueDate!)}`
                          : 'In Progress'}
                      </span>
                    </div>
                    <button
                      onClick={() => navigate(`/workspace/${milestone.projectId}`)}
                      className="text-xs text-cyan hover:underline flex items-center gap-1"
                    >
                      <Eye size={12} />
                      View Project
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
