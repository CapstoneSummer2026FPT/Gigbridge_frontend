import { reviewHandlers } from '../../mock_backend';

export const reviewGetAPI = {
  getReviewsByUser: async (userId: string) => {
    return await reviewHandlers.getReviewsByUser(userId);
  },

  getReviewStats: async (userId: string) => {
    return await reviewHandlers.getReviewStats(userId);
  },
};
