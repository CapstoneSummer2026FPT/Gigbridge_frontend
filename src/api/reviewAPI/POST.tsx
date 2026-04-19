import { reviewHandlers } from '../../mock_backend';
import type { Review } from '../../types/models/Job';

export const reviewPostAPI = {
  createReview: async (data: Partial<Review>) => {
    return await reviewHandlers.createReview(data);
  },
};
