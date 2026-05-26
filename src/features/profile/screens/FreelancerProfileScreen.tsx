import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Star, MapPin, Clock, DollarSign, CheckCircle, Globe, Video, MessageSquare, Bot, ExternalLink, Award } from 'lucide-react';
import { AppLayout } from '../../../shared/components/AppLayout';
import { useApp } from '../../../app/providers/AppProvider';
import { DB } from '../../../mock_backend';
import { SEED_FREELANCER_PROFILES, SEED_REVIEWS } from '../../../mock_backend/database/seed';

// Extended profile interface with mock data fields
interface ExtendedProfile {
  userId: string;
  title: string;
  bio: string;
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  location: string;
  timezone: string;
  languages: string[];
  skills: string[];
  completedProjects: number;
  totalEarnings: number;
  responseTime: string;
  availabilityStatus: 'available' | 'busy';
  profileStrength: number;
  portfolioItems: Array<{
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    projectUrl?: string;
    tags: string[];
  }>;
}

export default function FreelancerProfileScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useApp();
  const [activeTab, setActiveTab] = useState<'portfolio' | 'reviews' | 'about'>('portfolio');

  const targetId = id || 'u_freelancer_1';
  const user = DB.getUserById(targetId) || DB.getUserById('u_freelancer_1')!;
  const dbProfile = SEED_FREELANCER_PROFILES.find(p => p.user_id === targetId) || SEED_FREELANCER_PROFILES[1];
  const reviews = SEED_REVIEWS.filter(r => r.revieweeId === targetId);

  // Generate avatar URL and display name from user data
  const userName = user.full_name || `${user.first_name} ${user.last_name}`;
  const avatarUrl = `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.id}`;
  const isVerified = user.is_email_verified;

  // Create extended profile with mock data
  const profile: ExtendedProfile = {
    userId: dbProfile.user_id,
    title: dbProfile.title,
    bio: dbProfile.bio,
    hourlyRate: dbProfile.hourly_rate,
    rating: dbProfile.rating,
    reviewCount: reviews.length,
    location: dbProfile.location,
    timezone: 'PST (UTC-8)',
    languages: ['English', 'Spanish'],
    skills: ['React', 'TypeScript', 'Node.js', 'Next.js', 'GraphQL', 'PostgreSQL', 'AWS', 'Docker'],
    completedProjects: 47,
    totalEarnings: 128000,
    responseTime: '2 hours',
    availabilityStatus: dbProfile.availability === 0 ? 'available' : 'busy',
    profileStrength: dbProfile.profile_completion_score,
    portfolioItems: [
      {
        id: '1',
        title: 'E-commerce Platform',
        description: 'Full-stack marketplace with React & Node.js',
        imageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400',
        projectUrl: 'https://example.com',
        tags: ['React', 'Node.js', 'Stripe']
      },
      {
        id: '2',
        title: 'SaaS Dashboard',
        description: 'Analytics dashboard with real-time data',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
        tags: ['Next.js', 'D3.js', 'WebSocket']
      }
    ]
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        {/* Hero Banner */}
        <div className="glass-card overflow-hidden mb-6">
          {/* Cover Banner */}
          <div className="h-40 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(0,240,255,0.15) 0%, rgba(159,75,255,0.2) 50%, rgba(0,240,255,0.08) 100%)' }}>
            {/* Neural network decorative lines */}
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 160">
              <line x1="0" y1="40" x2="400" y2="120" stroke="#0077FF" strokeWidth="0.5" />
              <line x1="0" y1="80" x2="400" y2="40" stroke="#9F4BFF" strokeWidth="0.5" />
              <line x1="100" y1="0" x2="300" y2="160" stroke="#0077FF" strokeWidth="0.5" />
              <circle cx="200" cy="80" r="40" fill="none" stroke="#0077FF" strokeWidth="0.5" />
            </svg>
          </div>

          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-14 mb-4">
              <div className="relative">
                <img src={avatarUrl} alt={userName}
                  className="w-28 h-28 rounded-2xl border-4 avatar-glow"
                  style={{ borderColor: '#0A0F1C' }} />
                <div className="absolute bottom-2 right-2 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                  style={{ background: profile.availabilityStatus === 'available' ? '#22C55E' : '#F59E0B', borderColor: '#0A0F1C' }} />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-primary">{userName}</h1>
                  {isVerified && <CheckCircle size={18} className="text-cyan" />}
                </div>
                <p className="text-base font-medium mb-2 text-secondary">{profile.title}</p>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill={i < Math.floor(profile.rating) ? '#F59E0B' : 'none'} className="text-amber" />
                    ))}
                    <span className="text-primary text-sm font-semibold ml-1">{profile.rating}</span>
                    <span className="text-xs text-secondary">({profile.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-secondary">
                    <MapPin size={14} /> {profile.location}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-secondary">
                    <Globe size={14} /> {profile.timezone}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                {role === 'client' && (
                  <>
                    <button className="btn-purple px-4 py-2.5 text-sm flex items-center gap-2"
                      onClick={() => navigate('/ai-interview')}>
                      <Video size={16} />
                      AI Interview
                    </button>
                    <button className="btn-cyan px-4 py-2.5 text-sm flex items-center gap-2"
                      onClick={() => navigate('/workspace/proj_1')}>
                      <MessageSquare size={16} />
                      Invite
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {[
                { label: 'Hourly Rate', value: `$${profile.hourlyRate}/hr`, color: '#0077FF' },
                { label: 'Projects Done', value: profile.completedProjects, color: '#9F4BFF' },
                { label: 'Total Earned', value: `$${(profile.totalEarnings / 1000).toFixed(0)}K+`, color: '#22C55E' },
                { label: 'Response Time', value: profile.responseTime, color: '#F59E0B' },
              ].map(stat => (
                <div key={stat.label} className="p-3 rounded-xl text-center"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-lg font-black" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-xs mt-0.5 text-secondary">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">
            {/* AI-Optimized Bio */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-primary font-semibold">About Me</h2>
                <span className="badge-purple text-xs">AI Optimized</span>
              </div>
              <p className="text-sm leading-relaxed text-secondary">{profile.bio}</p>

              <div className="flex flex-wrap gap-2 mt-4">
                {profile.languages.map(lang => (
                  <span key={lang} className="tag-pill text-xs">{lang}</span>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="glass-card p-6">
              <h2 className="text-primary font-semibold mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, i) => (
                  <span key={skill} className="px-3 py-2 rounded-xl text-sm font-medium"
                    style={{
                      background: i < 3 ? 'rgba(0,240,255,0.1)' : 'rgba(255,255,255,0.04)',
                      border: i < 3 ? '1px solid rgba(0,240,255,0.25)' : '1px solid rgba(255,255,255,0.08)',
                      color: i < 3 ? '#0077FF' : '#8892A4',
                    }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="glass-card overflow-hidden">
              <div className="flex border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                {(['portfolio', 'reviews', 'about'] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className="flex-1 py-4 text-sm font-medium capitalize transition-all"
                    style={{
                      color: activeTab === tab ? '#0077FF' : '#8892A4',
                      borderBottom: activeTab === tab ? '2px solid #0077FF' : '2px solid transparent',
                    }}>
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'portfolio' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {profile.portfolioItems.map(item => (
                      <div key={item.id} className="rounded-xl overflow-hidden cursor-pointer group"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        {item.imageUrl && (
                          <div className="h-40 overflow-hidden">
                            <img src={item.imageUrl} alt={item.title}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                          </div>
                        )}
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-primary font-medium text-sm">{item.title}</h3>
                            {item.projectUrl && (
                              <ExternalLink size={14} className="text-secondary flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs mt-1 mb-3 text-secondary">{item.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {item.tags.map(tag => <span key={tag} className="badge-cyan text-[10px]">{tag}</span>)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    {reviews.length > 0 ? reviews.map(review => (
                      <div key={review.id} className="p-4 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={12} fill={i < review.rating ? '#F59E0B' : 'none'} className="text-amber" />
                            ))}
                          </div>
                          <span className="text-xs text-secondary">{review.createdAt}</span>
                        </div>
                        <p className="text-sm leading-relaxed text-secondary">"{review.comment}"</p>
                        {review.skills && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {review.skills.map(sk => (
                              <span key={sk.name} className="badge-green text-[10px]">{sk.name}: {sk.rating}/5</span>
                            ))}
                          </div>
                        )}
                      </div>
                    )) : (
                      <p className="text-center py-8 text-secondary">No reviews yet</p>
                    )}
                  </div>
                )}

                {activeTab === 'about' && (
                  <div className="space-y-4">
                    {[
                      { label: 'Location', value: profile.location },
                      { label: 'Timezone', value: profile.timezone },
                      { label: 'Languages', value: profile.languages.join(', ') },
                      { label: 'Response Time', value: profile.responseTime },
                      { label: 'Availability', value: profile.availabilityStatus.charAt(0).toUpperCase() + profile.availabilityStatus.slice(1) },
                    ].map(item => (
                      <div key={item.label} className="flex justify-between py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                        <span className="text-sm text-secondary">{item.label}</span>
                        <span className="text-sm font-medium text-primary">{item.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Invite Button */}
            {role === 'client' && (
              <div className="glass-card p-5 text-center"
                style={{ background: 'linear-gradient(135deg, rgba(0,240,255,0.06), rgba(159,75,255,0.06))', border: '1px solid rgba(0,240,255,0.15)' }}>
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center animate-orb"
                  style={{ background: 'linear-gradient(135deg, #0077FF, #9F4BFF)' }}>
                  <Bot size={20} style={{ color: '#0A0F1C' }} />
                </div>
                <p className="text-primary font-semibold mb-1 text-sm">Invite to AI Interview</p>
                <p className="text-xs mb-3 text-secondary">Let AI assess their fit for your project</p>
                <button className="btn-purple w-full py-2.5 text-sm" onClick={() => navigate('/ai-interview')}>
                  Start AI Interview
                </button>
              </div>
            )}

            {/* Badges */}
            <div className="glass-card p-5">
              <h2 className="text-primary font-semibold mb-4 text-sm">Achievements</h2>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Top Rated', icon: '⭐', color: '#F59E0B' },
                  { label: 'Pro Builder', icon: '🏆', color: '#0077FF' },
                  { label: 'Fast Deliver', icon: '⚡', color: '#9F4BFF' },
                  { label: '5-Star', icon: '💫', color: '#22C55E' },
                  { label: 'AI Expert', icon: '🤖', color: '#0077FF' },
                  { label: 'Top 5%', icon: '🚀', color: '#F59E0B' },
                ].map(badge => (
                  <div key={badge.label} className="p-2 rounded-xl text-center"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="text-xl">{badge.icon}</span>
                    <p className="text-[10px] mt-1" style={{ color: badge.color }}>{badge.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}