import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Search, ArrowRight, Star, Code, Palette, BarChart2, PenTool, Cpu, Film, Shield, Zap, Bot, Globe } from 'lucide-react';
import { ParticleBackground } from '../../../shared/components/ParticleBackground';
import { GuestLayout } from '../../../shared/components/AppLayout';
import { useApp } from '../../../app/providers/AppProvider';
import { MARKET_INSIGHTS } from '../../../mock_backend';
import '../styles/landing-screen.css';

const CATEGORIES = [
  { name: 'Web Development', icon: <Code size={22} />, jobs: '8,921', color: '#00F0FF' },
  { name: 'UI/UX Design', icon: <Palette size={22} />, jobs: '6,543', color: '#9F4BFF' },
  { name: 'Data Science', icon: <BarChart2 size={22} />, jobs: '4,210', color: '#22C55E' },
  { name: 'AI & ML', icon: <Cpu size={22} />, jobs: '3,842', color: '#F59E0B' },
  { name: 'Content Writing', icon: <PenTool size={22} />, jobs: '5,128', color: '#00F0FF' },
  { name: 'Video & Animation', icon: <Film size={22} />, jobs: '2,341', color: '#9F4BFF' },
];

const TESTIMONIALS = [
  {
    name: 'Jordan Mitchell', role: 'CTO, TechCorp', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=jordan&backgroundColor=b6e3f4',
    quote: 'GigBridge\'s AI matching found us a perfect React developer in under 2 hours. The quality was extraordinary and the AI screening saved us days of interviewing.',
    rating: 5,
  },
  {
    name: 'Alex Johnson', role: 'Senior Developer', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=alex&backgroundColor=c0aede',
    quote: 'The AI Proposal Generator is a game-changer. My proposal acceptance rate went from 15% to 67%. GigBridge has transformed my freelance career.',
    rating: 5,
  },
  {
    name: 'Sarah Chen', role: 'UI/UX Designer', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=sarah&backgroundColor=d1d4f9',
    quote: 'Finally a platform that understands creative work. The AI interview feature lets clients see my personality and expertise before we even start.',
    rating: 5,
  },
];

const STATS = [
  { label: 'Active Freelancers', value: '52,847', icon: <Globe size={20} /> },
  { label: 'Projects Completed', value: '134,562', icon: <Shield size={20} /> },
  { label: 'Total Paid Out', value: '$28.4M', icon: <Zap size={20} /> },
  { label: 'Success Rate', value: '96.4%', icon: <Star size={20} /> },
];

export default function LandingScreen() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Safely get app context
  let appContext;
  try {
    appContext = useApp();
  } catch (e) {
    appContext = null;
  }

  const isAuthenticated = appContext?.isAuthenticated || false;
  const isOnboardingComplete = appContext?.isOnboardingComplete || false;
  const role = appContext?.role || null;

  // Auto-redirect if user is logged in
  useEffect(() => {
    if (isAuthenticated) {
      if (!isOnboardingComplete) {
        navigate('/onboarding/role-selection');
      } else {
        navigate(role === 0 ? '/client/dashboard' : '/freelancer/dashboard');
      }
    }
  }, [isAuthenticated, isOnboardingComplete, role, navigate]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/jobs/browse${search ? `?q=${encodeURIComponent(search)}` : ''}`);
  };

  return (
    <GuestLayout>
      <ParticleBackground />
      <div className="relative z-10">

        {/* ── Hero Section ── */}
        <section className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 text-center overflow-hidden">
          {/* Decorative orbs */}
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-10 blur-3xl landing-hero-orb-cyan" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-10 blur-3xl landing-hero-orb-purple" />

          {/* AI Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 animate-fade-in-up landing-ai-badge">
            <Bot size={14} className="landing-ai-badge-icon" />
            <span className="text-xs font-medium landing-ai-badge-text">
              Powered by Advanced AI Intelligence
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight animate-fade-in-up landing-anim-delay-1">
            <span className="text-white">Connect Talent</span>
            <br />
            <span className="gradient-text-hero">with Intelligence</span>
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mb-10 animate-fade-in-up landing-hero-description landing-anim-delay-2">
            The world's first AI-powered freelance marketplace. Intelligent matching,
            automated interviews, and smart proposals — all in one platform.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="w-full max-w-2xl mb-8 animate-fade-in-up landing-anim-delay-3">
            <div className="relative flex items-center">
              <Search size={20} className="absolute left-5 landing-search-icon" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search for React, Design, ML, Writing..."
                className="input-gb w-full pl-14 pr-40 py-4 text-base rounded-2xl landing-search-input"
              />
              <button type="submit"
                className="btn-cyan absolute right-2 px-6 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
                Find Talent <ArrowRight size={16} />
              </button>
            </div>
          </form>

          {/* Trending Pills */}
          <div className="flex flex-wrap gap-2 justify-center animate-fade-in-up mb-12 landing-anim-delay-4">
            {['React Developer', 'UI Designer', 'Python ML', 'Content Writer', 'DevOps'].map(t => (
              <button key={t} onClick={() => navigate(`/jobs/browse?q=${t}`)}
                className="tag-pill text-sm cursor-pointer">
                {t}
              </button>
            ))}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl w-full animate-fade-in-up landing-anim-delay-5">
            {STATS.map(stat => (
              <div key={stat.label} className="glass-card p-4 text-center">
                <div className="flex justify-center mb-2 landing-stats-icon">{stat.icon}</div>
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-xs mt-1 landing-stats-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="badge-cyan mb-4 inline-block">How It Works</span>
              <h2 className="text-4xl font-black text-white mt-3">AI-Powered Workflow</h2>
              <p className="mt-4 landing-section-desc">From posting to payment — intelligence at every step</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { step: '01', title: 'Post or Find', desc: 'Clients describe their project with AI assistance. Freelancers browse AI-matched opportunities with compatibility scores.', icon: <Search size={28} />, color: 'cyan' },
                { step: '02', title: 'AI Matching', desc: 'Our neural network analyzes 200+ signals to match the perfect talent. AI Instant Interviews replace boring applications.', icon: <Bot size={28} />, color: 'purple' },
                { step: '03', title: 'Build & Pay', desc: 'Collaborate in our secure workspace with milestone payments, real-time chat, and AI work assistance throughout.', icon: <Shield size={28} />, color: 'green' },
              ].map((step, i) => (
                <div key={i} className="glass-card p-6 text-center relative overflow-hidden">
                  <div className="absolute -top-4 -right-4 text-8xl font-black opacity-5 text-white">{step.step}</div>
                  <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center landing-step-icon-bg-${step.color}`}>
                    <span className={`landing-step-icon-${step.color}`}>{step.icon}</span>
                  </div>
                  <div className="badge-cyan mb-3 inline-block text-xs">Step {step.step}</div>
                  <h3 className="text-white text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-sm leading-relaxed landing-step-desc">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Categories ── */}
        <section className="py-20 px-4 landing-section-bg-subtle">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="badge-purple mb-4 inline-block">Top Categories</span>
              <h2 className="text-4xl font-black text-white mt-3">Explore Opportunities</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {CATEGORIES.map((cat, i) => {
                const colorClass = cat.color === '#00F0FF' ? 'cyan' : cat.color === '#9F4BFF' ? 'purple' : cat.color === '#22C55E' ? 'green' : 'amber';
                return (
                  <button key={i} className="glass-card p-6 text-left group" onClick={() => navigate(`/jobs/browse?cat=${cat.name}`)}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all landing-category-icon-bg-${colorClass}`}>
                      <span className={`landing-category-icon-${colorClass}`}>{cat.icon}</span>
                    </div>
                    <h3 className="text-white font-semibold mb-1">{cat.name}</h3>
                    <p className="text-xs landing-category-jobs">{cat.jobs} open jobs</p>
                    <ArrowRight size={14} className={`mt-3 transition-transform group-hover:translate-x-1 landing-category-arrow-${colorClass}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Market Insights Preview ── */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-start gap-12">
              <div className="flex-1">
                <span className="badge-green mb-4 inline-block">Live Market Data</span>
                <h2 className="text-4xl font-black text-white mt-3 mb-4">AI Market Insights</h2>
                <p className="mb-6 landing-market-desc">
                  Make data-driven decisions with real-time market intelligence. See trending skills,
                  average rates, and demand forecasts powered by our AI.
                </p>
                <div className="space-y-4">
                  {MARKET_INSIGHTS.trendingCategories.slice(0, 4).map((cat, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <span className="text-xl">{cat.icon}</span>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-white font-medium">{cat.name}</span>
                          <span className="text-xs font-bold landing-market-growth">{cat.growth}</span>
                        </div>
                        <div className="progress-bar-gb">
                          <div className="progress-bar-gb-fill" style={{ width: `${Math.min((cat.jobs / 10000) * 100, 100)}%` }} />
                        </div>
                      </div>
                      <span className="text-xs font-medium landing-market-jobs-count">{cat.jobs.toLocaleString()} jobs</span>
                    </div>
                  ))}
                </div>
                <button className="btn-ghost-cyan mt-6 px-6 py-2 text-sm" onClick={() => navigate('/market-insights')}>
                  View Full Report →
                </button>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4">
                {MARKET_INSIGHTS.averageRatesBySkill.slice(0, 4).map((skill, i) => (
                  <div key={i} className="glass-card p-5">
                    <p className="text-white font-semibold text-sm mb-1">{skill.skill}</p>
                    <p className="text-2xl font-black mb-1 landing-market-rate">${skill.rate}<span className="text-sm text-white opacity-50">/hr</span></p>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full landing-market-demand-dot" />
                      <span className="text-xs landing-market-demand-text">High Demand {skill.demand}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="py-20 px-4 landing-section-bg-subtle">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <span className="badge-cyan mb-4 inline-block">Testimonials</span>
              <h2 className="text-4xl font-black text-white mt-3">Loved by Thousands</h2>
            </div>

            <div className="glass-card neon-border-cyan p-8 mb-6">
              <div className="flex items-start gap-4">
                <img src={TESTIMONIALS[activeTestimonial].avatar} alt=""
                  className="w-14 h-14 rounded-full avatar-glow flex-shrink-0" />
                <div>
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill="#F59E0B" className="landing-star-icon" />
                    ))}
                  </div>
                  <p className="text-white text-lg leading-relaxed mb-4">"{TESTIMONIALS[activeTestimonial].quote}"</p>
                  <div>
                    <p className="text-white font-semibold">{TESTIMONIALS[activeTestimonial].name}</p>
                    <p className="text-sm landing-testimonial-role">{TESTIMONIALS[activeTestimonial].role}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              {TESTIMONIALS.map((t, i) => (
                <button key={i} onClick={() => setActiveTestimonial(i)}
                  className={`flex items-center gap-2 p-2 rounded-xl transition-all border ${activeTestimonial === i ? 'landing-testimonial-nav-active' : 'landing-testimonial-nav-inactive'}`}>
                  <img src={t.avatar} alt={t.name} className="w-8 h-8 rounded-full" />
                  <span className={`text-sm hidden sm:block ${activeTestimonial === i ? 'landing-ai-badge-text' : 'landing-stats-label'}`}>{t.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-24 px-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 landing-cta-bg" />
          <div className="relative max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Ready to Build the Future?
            </h2>
            <p className="text-lg mb-10 landing-cta-desc">
              Join 52,000+ freelancers and 18,000+ clients on the world's most intelligent marketplace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-cyan px-8 py-4 text-base flex items-center gap-2 justify-center"
                onClick={() => navigate('/auth')}>
                Start as Freelancer <ArrowRight size={18} />
              </button>
              <button className="btn-ghost-cyan px-8 py-4 text-base"
                onClick={() => navigate('/auth')}>
                Hire Top Talent
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-md flex items-center justify-center landing-cta-bg">
              <Zap size={12} style={{ color: '#0A0F1C' }} />
            </div>
            <span className="text-white font-bold">GigBridge</span>
            <span className="badge-cyan">AI</span>
          </div>
          <p className="text-sm landing-footer-copyright">© 2026 GigBridge. All rights reserved. Built with AI intelligence.</p>
        </footer>
      </div>
    </GuestLayout>
  );
}