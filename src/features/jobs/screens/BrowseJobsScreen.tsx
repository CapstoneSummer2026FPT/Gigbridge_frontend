import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Search, Filter, Bot, Clock, DollarSign, Users, Globe, Bookmark, ChevronDown } from 'lucide-react';
import { AppLayout } from '../../../shared/components/AppLayout';
import { useApp } from '../../../app/providers/AppProvider';
import { jobGetAPI } from '../../../api/jobAPI/GET';
import type { Job } from '../../../types/models/Job';
import '../styles/browse-jobs-screen.css';

const CATEGORIES = ['All', 'Web Development', 'Design', 'Data Science', 'Marketing', 'Writing', 'DevOps', 'Mobile'];
const EXPERIENCE = ['All', 'Entry', 'Intermediate', 'Expert'];
const BUDGET_RANGES = ['All', 'Under $1K', '$1K–$5K', '$5K–$10K', '$10K+'];

export default function BrowseJobsScreen() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { user } = useApp();
  const [search, setSearch] = useState(params.get('q') || '');
  const [category, setCategory] = useState(params.get('cat') || 'All');
  const [experience, setExperience] = useState('All');
  const [budget, setBudget] = useState('All');
  const [aiOnly, setAiOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const data = await jobGetAPI.getJobs();
        setAllJobs(data);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const jobs = useMemo(() => {
    let list = allJobs;
    if (search) list = list.filter(j => j.title.toLowerCase().includes(search.toLowerCase()) || j.skills.some(s => s.toLowerCase().includes(search.toLowerCase())));
    if (category !== 'All') list = list.filter(j => j.category === category);
    if (aiOnly) list = list.filter(j => j.isAiRecommended);
    if (experience !== 'All') list = list.filter(j => j.experienceLevel === experience.toLowerCase());
    return list.sort((a, b) => (b.aiMatchScore || 0) - (a.aiMatchScore || 0));
  }, [allJobs, search, category, experience, budget, aiOnly]);

  const toggleSave = (id: string) => setSaved(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-black text-white mb-2">Browse Jobs</h1>
          <p className="browse-jobs-desc">Discover opportunities matched to your expertise</p>
        </div>

        {/* Search & Filter Row */}
        <div className="glass-card p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 browse-jobs-search-icon" />
              <input
                type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search job titles, skills, keywords..."
                className="input-gb w-full pl-10 pr-4 py-3 text-sm"
              />
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm transition-all browse-jobs-filter-btn">
              <Filter size={16} /> Filters
              {(category !== 'All' || experience !== 'All') && (
                <span className="w-2 h-2 rounded-full browse-jobs-filter-indicator" />
              )}
            </button>

            {/* AI Toggle */}
            <button onClick={() => setAiOnly(!aiOnly)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${aiOnly ? 'browse-jobs-ai-toggle-active' : 'browse-jobs-ai-toggle-inactive'}`}>
              <Bot size={16} />
              AI Recommended
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t browse-jobs-divider">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-white mb-2 block">Experience Level</label>
                  <div className="flex flex-wrap gap-1">
                    {EXPERIENCE.map(e => (
                      <button key={e} onClick={() => setExperience(e)}
                        className={`px-2 py-1 rounded-lg text-xs transition-all ${experience === e ? 'browse-jobs-ai-toggle-active' : 'browse-jobs-ai-toggle-inactive'}`}>
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-white mb-2 block">Budget Range</label>
                  <div className="flex flex-wrap gap-1">
                    {BUDGET_RANGES.map(b => (
                      <button key={b} onClick={() => setBudget(b)}
                        className={`px-2 py-1 rounded-lg text-xs transition-all ${budget === b ? 'browse-jobs-ai-toggle-active' : 'browse-jobs-ai-toggle-inactive'}`}>
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${category === cat ? 'browse-jobs-ai-toggle-active' : 'browse-jobs-ai-toggle-inactive'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm browse-jobs-desc">
            <span className="text-white font-semibold">{jobs.length}</span> jobs found
            {aiOnly && <span className="browse-jobs-ai-toggle-active"> · AI Recommended</span>}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs browse-jobs-desc">Sort by:</span>
            <button className="flex items-center gap-1 text-sm text-white">
              Best Match <ChevronDown size={14} />
            </button>
          </div>
        </div>

        {/* Job Cards */}
        <div className="space-y-4">
          {jobs.map((job, idx) => (
            <div key={job.id}
              className="glass-card p-5 cursor-pointer group"
              style={{ animationDelay: `${idx * 0.05}s` }}
              onClick={() => navigate(`/jobs/${job.id}`)}>
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-2 flex-wrap mb-2">
                    <h2 className="text-white font-semibold group-hover:text-[#00F0FF] transition-colors">
                      {job.title}
                    </h2>
                    {job.isAiRecommended && <span className="badge-purple text-xs flex-shrink-0">⚡ AI Pick</span>}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <div className="flex items-center gap-1 text-xs browse-jobs-job-meta">
                      <DollarSign size={12} />
                      ${job.budgetMin.toLocaleString()}–${job.budgetMax.toLocaleString()} · {job.jobType === 'fixed' ? 'Fixed' : '/hr'}
                    </div>
                    <div className="flex items-center gap-1 text-xs browse-jobs-job-meta">
                      <Globe size={12} /> Remote
                    </div>
                    <div className="flex items-center gap-1 text-xs browse-jobs-job-meta">
                      <Users size={12} /> {job.proposalCount} proposals
                    </div>
                    <div className="flex items-center gap-1 text-xs browse-jobs-job-meta">
                      <Clock size={12} /> {job.postedAt}
                    </div>
                    <span className="tag-pill capitalize text-xs">{job.experienceLevel}</span>
                  </div>

                  <p className="text-sm leading-relaxed mb-3 line-clamp-2 browse-jobs-job-meta">
                    {job.description.slice(0, 150)}...
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {job.skills.map(skill => (
                      <span key={skill} className="tag-pill">{skill}</span>
                    ))}
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end gap-3 flex-shrink-0">
                  {job.aiMatchScore && user && (
                    <div className={`match-score ${job.aiMatchScore >= 90 ? 'high' : job.aiMatchScore >= 70 ? 'medium' : 'low'} flex-shrink-0`}>
                      <Bot size={10} />
                      {job.aiMatchScore}% Match
                    </div>
                  )}
                  <button
                    onClick={e => { e.stopPropagation(); toggleSave(job.id); }}
                    className={`p-2 rounded-lg transition-all ${saved.includes(job.id) ? 'browse-jobs-save-icon-active' : 'browse-jobs-save-icon'}`}
                    style={{ background: saved.includes(job.id) ? 'rgba(0,240,255,0.1)' : 'transparent' }}>
                    <Bookmark size={16} fill={saved.includes(job.id) ? '#00F0FF' : 'none'} />
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); navigate(`/jobs/${job.id}`); }}
                    className="btn-ghost-cyan px-3 py-1.5 text-xs flex-shrink-0">
                    View Job
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {jobs.length === 0 && (
          <div className="text-center py-20">
            <Bot size={48} className="mx-auto mb-4 opacity-30 browse-jobs-job-meta" />
            <p className="text-white font-semibold mb-2">No jobs found</p>
            <p className="text-sm browse-jobs-desc">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}