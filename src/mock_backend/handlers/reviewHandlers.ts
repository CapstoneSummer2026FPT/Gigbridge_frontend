import DB from '../database/db';
import type { Review } from '../../types/models/Job';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const reviewHandlers = {
  async getReviewsByUser(userId: string) {
    await delay(200);
    const reviews = DB.getReviewsByUser(userId);
    
    // Enrich with reviewer data
    return reviews.map(review => {
      const reviewer = DB.getUserById(review.reviewerId);
      const job = DB.getJobById(review.jobId);
      return { ...review, reviewer, job };
    });
  },

  async createReview(data: Partial<Review>) {
    await delay(600);
    const newReview: Review = {
      id: `rev_${Date.now()}`,
      jobId: data.jobId!,
      reviewerId: data.reviewerId!,
      revieweeId: data.revieweeId!,
      rating: data.rating || 0,
      comment: data.comment || '',
      createdAt: new Date().toISOString().split('T')[0],
      skills: data.skills,
    };
    
    // Add to database (would need DB.addReview method)
    // For now just return the new review
    return newReview;
  },

  async getReviewStats(userId: string) {
    await delay(200);
    const reviews = DB.getReviewsByUser(userId);
    
    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }
    
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      distribution[r.rating] = (distribution[r.rating] || 0) + 1;
    });
    
    return {
      averageRating: total / reviews.length,
      totalReviews: reviews.length,
      ratingDistribution: distribution,
    };
  },
};
