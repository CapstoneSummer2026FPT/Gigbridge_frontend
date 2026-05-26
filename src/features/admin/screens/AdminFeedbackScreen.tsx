import { useState, useMemo } from 'react';
import { Star, AlertTriangle, Trash2, Eye, Filter, Search, MessageSquare, TrendingUp, TrendingDown, Flag, CheckCircle, XCircle, User, Calendar, MoreVertical } from 'lucide-react';
import { AppLayout } from '../../../shared/components/AppLayout';
import { DB } from '../../../mock_backend';
import type { Review } from '../../../mock_backend/types/legacy';
import '../styles/admin-feedback-screen.css';

type FeedbackFilter = 'all' | 'high' | 'low' | 'flagged';
type FeedbackSort = 'recent' | 'rating' | 'reviewer';

// Enhanced Review with flag status
interface EnhancedReview extends Review {
  isFlagged?: boolean;
  flagReason?: string;
  reviewerName?: string;
  revieweeName?: string;
}

export default function AdminFeedbackScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FeedbackFilter>('all');
  const [sortBy, setSortBy] = useState<FeedbackSort>('recent');
  const [selectedFeedback, setSelectedFeedback] = useState<EnhancedReview | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<EnhancedReview | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  // Get all reviews and enrich with user data
  const allReviews: EnhancedReview[] = useMemo(() => {
    const reviews = DB.getReviewsByUser('all') as unknown as Review[];

    // For demo purposes, flag some low-rated reviews as violations
    return reviews.map(review => {
      const reviewer = DB.getUserById(review.reviewerId);
      const reviewee = DB.getUserById(review.revieweeId);

      return {
        ...review,
        isFlagged: review.rating <= 2 && Math.random() > 0.5, // Flag some low ratings
        flagReason: review.rating <= 2 ? 'Potentially inappropriate content or spam' : undefined,
        reviewerName: reviewer?.full_name || 'Unknown User',
        revieweeName: reviewee?.full_name || 'Unknown User',
      };
    });
  }, []);

  // Filter and sort reviews
  const filteredReviews = useMemo(() => {
    let filtered = allReviews.filter(review => {
      const matchesSearch = searchQuery === '' ||
        review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.reviewerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.revieweeName?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        filterType === 'all' ? true :
        filterType === 'high' ? review.rating >= 4 :
        filterType === 'low' ? review.rating <= 2 :
        filterType === 'flagged' ? review.isFlagged : true;

      return matchesSearch && matchesFilter;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviewer') return (a.reviewerName || '').localeCompare(b.reviewerName || '');
      return 0;
    });

    return filtered;
  }, [allReviews, searchQuery, filterType, sortBy]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = allReviews.length;
    const high = allReviews.filter(r => r.rating >= 4).length;
    const low = allReviews.filter(r => r.rating <= 2).length;
    const flagged = allReviews.filter(r => r.isFlagged).length;
    const avgRating = total > 0 ? allReviews.reduce((sum, r) => sum + r.rating, 0) / total : 0;

    return { total, high, low, flagged, avgRating };
  }, [allReviews]);

  const handleDeleteFeedback = (reviewId: string) => {
    // In real implementation, this would call an API
    const index = allReviews.findIndex(r => r.id === reviewId);
    if (index !== -1) {
      allReviews.splice(index, 1);
      alert('Feedback deleted successfully');
      setConfirmDelete(null);
      setSelectedFeedback(null);
    }
  };

  const handleToggleFlag = (review: EnhancedReview) => {
    review.isFlagged = !review.isFlagged;
    if (review.isFlagged) {
      review.flagReason = 'Flagged by administrator for review';
    } else {
      review.flagReason = undefined;
    }
    setShowActionMenu(null);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? 'text-amber fill-amber' : 'text-gray-400'}
          />
        ))}
      </div>
    );
  };

  const getRatingBadge = (rating: number) => {
    if (rating >= 4) return <span className="badge-green text-xs">Positive</span>;
    if (rating === 3) return <span className="badge-amber text-xs">Neutral</span>;
    return <span className="badge-red text-xs">Negative</span>;
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare size={20} className="text-purple" />
              <span className="badge-purple text-xs">Feedback Management</span>
            </div>
            <h1 className="text-3xl font-black text-primary">Manage User Feedback</h1>
            <p className="text-sm text-secondary mt-1">Monitor and moderate all user reviews and feedback</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Reviews', value: stats.total.toLocaleString(), icon: <MessageSquare size={16} />, color: 'cyan' },
            { label: 'Positive', value: stats.high.toLocaleString(), icon: <TrendingUp size={16} />, color: 'green' },
            { label: 'Negative', value: stats.low.toLocaleString(), icon: <TrendingDown size={16} />, color: 'red' },
            { label: 'Flagged', value: stats.flagged.toString(), icon: <Flag size={16} />, color: 'amber' },
            { label: 'Avg Rating', value: stats.avgRating.toFixed(1), icon: <Star size={16} />, color: 'purple' },
          ].map(stat => (
            <div key={stat.label} className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-secondary">{stat.label}</p>
                <span className={`icon-${stat.color}`}>{stat.icon}</span>
              </div>
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="glass-card overflow-hidden mb-6">
          {/* Header */}
          <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5 bg-gradient-to-r from-purple/5 to-cyan/5">
            <Filter size={18} className="text-purple" />
            <h3 className="font-semibold text-primary">Search & Filters</h3>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex flex-col gap-6">
              {/* Search Bar */}
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by comment, reviewer, or reviewee..."
                  className="input-gb w-full py-3 text-sm"
                  style={{ paddingLeft: '3rem', paddingRight: '1rem' }}
                />
              </div>

              {/* Filters Row */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                {/* Filter Label */}
                <div className="flex items-center gap-2 min-w-fit">
                  <span className="text-sm font-medium text-secondary">Filter by:</span>
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2 flex-wrap flex-1">
                  {[
                    { type: 'all', label: 'All Reviews', icon: <MessageSquare size={16} />, color: 'cyan' },
                    { type: 'high', label: 'Positive', icon: <TrendingUp size={16} />, color: 'green' },
                    { type: 'low', label: 'Negative', icon: <TrendingDown size={16} />, color: 'red' },
                    { type: 'flagged', label: 'Flagged', icon: <Flag size={16} />, color: 'amber' },
                  ].map(filter => (
                    <button
                      key={filter.type}
                      onClick={() => setFilterType(filter.type as FeedbackFilter)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                        filterType === filter.type
                          ? `bg-${filter.color}/20 text-${filter.color} border border-${filter.color} shadow-lg shadow-${filter.color}/20`
                          : 'glass-button text-secondary hover:text-primary hover:border-white/20'
                      }`}
                    >
                      <span className={filterType === filter.type ? `text-${filter.color}` : 'text-muted'}>
                        {filter.icon}
                      </span>
                      <span className="hidden sm:inline">{filter.label}</span>
                    </button>
                  ))}
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 min-w-fit">
                  <span className="text-sm font-medium text-secondary hidden sm:block">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as FeedbackSort)}
                    className="input-gb px-4 py-2.5 pr-10 min-w-[160px] text-sm font-medium cursor-pointer"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="rating">Highest Rating</option>
                    <option value="reviewer">Reviewer Name</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-secondary">
            Showing <span className="text-primary font-semibold">{filteredReviews.length}</span> of <span className="text-primary font-semibold">{allReviews.length}</span> reviews
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid gap-4 mb-8">
          {filteredReviews.map(review => (
            <div key={review.id} className="glass-card p-6 hover:border-purple/30 transition-all">
              <div className="flex items-start justify-between gap-4">
                {/* Left: Review Content */}
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan to-purple flex items-center justify-center text-sm font-bold text-white">
                      {review.reviewerName?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-primary">{review.reviewerName}</p>
                        <span className="text-xs text-muted">reviewed</span>
                        <p className="text-sm font-semibold text-secondary">{review.revieweeName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {renderStars(review.rating)}
                        {getRatingBadge(review.rating)}
                        {review.isFlagged && (
                          <span className="badge-red text-xs flex items-center gap-1">
                            <Flag size={12} />
                            Flagged
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-sm text-secondary mb-3 leading-relaxed">
                    {review.comment}
                  </p>

                  {/* Flag Reason */}
                  {review.isFlagged && review.flagReason && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-red/10 border border-red/20 mb-3">
                      <AlertTriangle size={16} className="text-red mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-red mb-1">Violation Flag</p>
                        <p className="text-xs text-secondary">{review.flagReason}</p>
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center gap-4 text-xs text-muted">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-1">
                      <User size={12} />
                      ID: {review.id}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-start gap-2">
                  <button
                    onClick={() => setSelectedFeedback(review)}
                    className="p-2 rounded-lg glass-button hover:bg-cyan/10 transition-colors"
                    title="View Details"
                  >
                    <Eye size={16} className="text-cyan" />
                  </button>

                  <button
                    onClick={() => setConfirmDelete(review)}
                    className="p-2 rounded-lg glass-button hover:bg-red/10 transition-colors"
                    title="Delete Feedback"
                  >
                    <Trash2 size={16} className="text-red" />
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setShowActionMenu(showActionMenu === review.id ? null : review.id)}
                      className="p-2 rounded-lg glass-button hover:bg-amber/10 transition-colors"
                      title="More Actions"
                    >
                      <MoreVertical size={16} className="text-amber" />
                    </button>

                    {showActionMenu === review.id && (
                      <div className="absolute right-0 top-full mt-2 w-48 dropdown-menu p-2 z-50">
                        <button
                          onClick={() => handleToggleFlag(review)}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all hover:bg-white/5 text-secondary"
                        >
                          <Flag size={14} />
                          {review.isFlagged ? 'Unflag Review' : 'Flag as Violation'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <div className="text-center py-16 glass-card">
            <MessageSquare size={48} className="mx-auto mb-4 text-muted" />
            <p className="text-primary font-medium mb-2">No feedback found</p>
            <p className="text-sm text-secondary">Try adjusting your search or filters</p>
          </div>
        )}

        {/* View Details Modal */}
        {selectedFeedback && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedFeedback(null)}>
            <div className="glass-card max-w-2xl w-full p-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-primary">Feedback Details</h2>
                <button
                  onClick={() => setSelectedFeedback(null)}
                  className="p-2 rounded-lg glass-button hover:bg-red-500/10 transition-colors"
                >
                  <XCircle size={20} className="text-red" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Rating */}
                <div className="glass-card p-4">
                  <p className="text-sm text-secondary mb-3">Rating</p>
                  <div className="flex items-center gap-3">
                    {renderStars(selectedFeedback.rating)}
                    <span className="text-3xl font-bold text-primary">{selectedFeedback.rating}.0</span>
                    {getRatingBadge(selectedFeedback.rating)}
                  </div>
                </div>

                {/* Users */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card p-4">
                    <p className="text-sm text-secondary mb-3">Reviewer</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan to-purple flex items-center justify-center text-sm font-bold text-white">
                        {selectedFeedback.reviewerName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-primary">{selectedFeedback.reviewerName}</p>
                        <p className="text-xs text-muted">{selectedFeedback.reviewerId}</p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card p-4">
                    <p className="text-sm text-secondary mb-3">Reviewee</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple to-pink-500 flex items-center justify-center text-sm font-bold text-white">
                        {selectedFeedback.revieweeName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-primary">{selectedFeedback.revieweeName}</p>
                        <p className="text-xs text-muted">{selectedFeedback.revieweeId}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comment */}
                <div className="glass-card p-4">
                  <p className="text-sm text-secondary mb-3">Comment</p>
                  <p className="text-sm text-primary leading-relaxed">{selectedFeedback.comment}</p>
                </div>

                {/* Flag Status */}
                {selectedFeedback.isFlagged && selectedFeedback.flagReason && (
                  <div className="glass-card p-4 border border-red/20 bg-red/5">
                    <div className="flex items-start gap-2 mb-2">
                      <AlertTriangle size={16} className="text-red mt-0.5" />
                      <p className="text-sm font-semibold text-red">Flagged as Violation</p>
                    </div>
                    <p className="text-sm text-secondary ml-6">{selectedFeedback.flagReason}</p>
                  </div>
                )}

                {/* Metadata */}
                <div className="glass-card p-4">
                  <p className="text-sm text-secondary mb-3">System Information</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted mb-1">Review ID</p>
                      <p className="text-primary font-mono text-xs">{selectedFeedback.id}</p>
                    </div>
                    <div>
                      <p className="text-muted mb-1">Job ID</p>
                      <p className="text-primary font-mono text-xs">{selectedFeedback.jobId}</p>
                    </div>
                    <div>
                      <p className="text-muted mb-1">Created Date</p>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-cyan" />
                        <p className="text-primary">{new Date(selectedFeedback.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setSelectedFeedback(null)}
                  className="btn-ghost-cyan px-6 py-2"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setConfirmDelete(selectedFeedback);
                  }}
                  className="bg-red/20 text-red border border-red px-6 py-2 rounded-lg font-semibold hover:bg-red/30 transition-all flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete Feedback
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {confirmDelete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4" onClick={() => setConfirmDelete(null)}>
            <div className="glass-card max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-primary">Delete Feedback</h3>
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="p-2 rounded-lg glass-button hover:bg-red-500/10 transition-colors"
                >
                  <XCircle size={18} className="text-red" />
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-start gap-3 p-4 glass-card mb-4">
                  <AlertTriangle size={20} className="text-red mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-red mb-1">Warning: This action cannot be undone</p>
                    <p className="text-xs text-secondary">You are about to permanently delete this feedback from the system.</p>
                  </div>
                </div>

                <div className="glass-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(confirmDelete.rating)}
                  </div>
                  <p className="text-sm text-secondary mb-2">{confirmDelete.comment}</p>
                  <p className="text-xs text-muted">
                    By <span className="text-primary">{confirmDelete.reviewerName}</span> for <span className="text-primary">{confirmDelete.revieweeName}</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 btn-ghost-cyan px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteFeedback(confirmDelete.id)}
                  className="flex-1 bg-red/20 text-red border border-red px-4 py-2 rounded-lg font-semibold hover:bg-red/30 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete Forever
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Click outside to close action menu */}
        {showActionMenu && (
          <div className="fixed inset-0 z-40" onClick={() => setShowActionMenu(null)} />
        )}
      </div>
    </AppLayout>
  );
}
