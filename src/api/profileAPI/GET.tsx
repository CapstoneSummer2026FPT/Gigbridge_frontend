import { profileHandlers } from '../../mock_backend';

export const profileGetAPI = {
  getFreelancerProfile: async (userId: string) => {
    return await profileHandlers.getFreelancerProfile(userId);
  },

  getClientProfile: async (userId: string) => {
    return await profileHandlers.getClientProfile(userId);
  },

  getAllFreelancers: async (filters?: { skills?: string[]; availabilityStatus?: string; minRating?: number }) => {
    return await profileHandlers.getAllFreelancers(filters);
  },
};
