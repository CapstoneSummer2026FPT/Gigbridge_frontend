import { useNavigate, useParams } from 'react-router';
import { Star, MapPin, CheckCircle, Briefcase, DollarSign, Users, TrendingUp, Shield } from 'lucide-react';
import { AppLayout } from '../../../shared/components/AppLayout';
import { DB, SEED_JOBS } from '../../../mock_backend';
import { SEED_CLIENT_PROFILES } from '../../../mock_backend/database/seed';

export default function ClientProfileScreen() {
  const { id } = useParams();
  const navigate = useNavigate();

  const targetId = id || 'u_client_1';
  const user = DB.getUserById(targetId) || DB.getUserById('u_client_1')!;
  const profile = SEED_CLIENT_PROFILES.find(p => p.userId === targetId) || SEED_CLIENT_PROFILES[0];
  const jobs = DB.getJobsByClient(targetId);

  const TRUST_BADGES = [
    { label: 'Identity Verified', icon: <Shield size={14} />, color: '#22C55E' },
    { label: 'Payment Verified', icon: <CheckCircle size={14} />, color: '#00F0FF' },
    { label: 'Top Client', icon: <Star size={14} />, color: '#F59E0B' },
    { label: 'Repeat Hirer', icon: <Users size={14} />, color: '#9F4BFF' },
  ];

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="glass-card overflow-hidden mb-6">
          <div className="h-32 relative"
            style={{ background: 'linear-gradient(135deg, rgba(159,75,255,0.15), rgba(0,240,255,0.1))' }}>
            <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 400 128">
              <circle cx="100" cy="64" r="60" fill="none" stroke="#9F4BFF" strokeWidth="0.5" />
              <circle cx="300" cy="64" r="40" fill="none" stroke="#00F0FF" strokeWidth="0.5" />
              <line x1="0" y1="64" x2="400" y2="64" stroke="#8892A4" strokeWidth="0.3" />
            </svg>
          </div>
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-10 mb-4">
              <img src={user.avatar} alt={user.name}
                className="w-24 h-24 rounded-2xl border-4" style={{ borderColor: '#0A0F1C' }} />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-white">{user.name}</h1>
                  {profile.isVerifiedClient && <CheckCircle size={18} style={{ color: '#00F0FF' }} />}
                </div>
                <p className="font-medium mb-1" style={{ color: '#8892A4' }}>{profile.companyName}</p>
                <div className="flex flex-wrap gap-3">
                  <p className="text-sm" style={{ color: '#8892A4' }}>{profile.industry}</p>
                  <div className="flex items-center gap-1 text-sm" style={{ color: '#8892A4' }}>
                    <MapPin size={12} /> {profile.location}
                  </div>
                  <span className="badge-cyan">Member since {profile.memberSince}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Total Spent', value: `$${(profile.totalSpent / 1000).toFixed(0)}K+`, icon: <DollarSign size={14} />, color: '#22C55E' },
                { label: 'Jobs Posted', value: profile.postedJobs, icon: <Briefcase size={14} />, color: '#00F0FF' },
                { label: 'Freelancers Hired', value: profile.hiredFreelancers, icon: <Users size={14} />, color: '#9F4BFF' },
                { label: 'Avg Rating Given', value: `${profile.rating}/5`, icon: <Star size={14} />, color: '#F59E0B' },
              ].map(stat => (
                <div key={stat.label} className="p-3 rounded-xl text-center"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex justify-center mb-1" style={{ color: stat.color }}>{stat.icon}</div>
                  <p className="text-lg font-black" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-xs" style={{ color: '#8892A4' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-5">
            {/* Bio */}
            <div className="glass-card p-6">
              <h2 className="text-white font-semibold mb-3">About</h2>
              <p className="text-sm leading-relaxed" style={{ color: '#8892A4' }}>{profile.bio}</p>
            </div>

            {/* Recent Job Postings */}
            <div className="glass-card p-6">
              <h2 className="text-white font-semibold mb-4">Recent Job Postings</h2>
              <div className="space-y-3">
                {jobs.slice(0, 4).map(job => (
                  <div key={job.id}
                    className="p-4 rounded-xl cursor-pointer transition-all flex items-center justify-between"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                    onClick={() => navigate(`/jobs/${job.id}`)}>
                    <div>
                      <p className="text-white text-sm font-medium mb-1">{job.title}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-xs" style={{ color: '#8892A4' }}>${job.budgetMin.toLocaleString()}–${job.budgetMax.toLocaleString()}</span>
                        <span className="text-xs" style={{ color: '#8892A4' }}>{job.proposalCount} proposals</span>
                        <span className={`badge-${job.status === 'open' ? 'green' : 'amber'} text-[10px]`}>{job.status}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {job.skills.slice(0, 2).map(s => <span key={s} className="badge-cyan text-[10px]">{s}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Trust Score */}
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-semibold text-sm">Trust Score</h2>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <svg viewBox="0 0 60 60" className="w-14 h-14">
                    <circle cx="30" cy="30" r="24" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                    <circle cx="30" cy="30" r="24" fill="none" stroke="#22C55E" strokeWidth="4"
                      strokeDasharray={`${(profile.trustScore / 100) * 150.8} 150.8`}
                      strokeLinecap="round" transform="rotate(-90 30 30)" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{profile.trustScore}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Excellent</p>
                  <p className="text-xs" style={{ color: '#22C55E' }}>Top 10% Client</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={12} fill={i < Math.floor(profile.rating) ? '#F59E0B' : 'none'} style={{ color: '#F59E0B' }} />
                ))}
                <span className="text-xs text-white ml-1">{profile.rating}</span>
                <span className="text-xs ml-1" style={{ color: '#8892A4' }}>({profile.reviewCount})</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="glass-card p-5">
              <h2 className="text-white font-semibold mb-4 text-sm">Verified Badges</h2>
              <div className="space-y-2">
                {TRUST_BADGES.map(badge => (
                  <div key={badge.label} className="flex items-center gap-2 p-2 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ color: badge.color }}>{badge.icon}</span>
                    <span className="text-sm text-white">{badge.label}</span>
                    <CheckCircle size={12} className="ml-auto" style={{ color: badge.color }} />
                  </div>
                ))}
              </div>
            </div>

            <button className="btn-cyan w-full py-3 text-sm" onClick={() => navigate('/jobs/post')}>
              Work With This Client
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
