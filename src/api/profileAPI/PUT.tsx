import { profileHandlers } from '../../mock_backend';
import type { FreelancerProfile, ClientProfile } from '../../types/models/User';

export const profilePutAPI = {
  updateFreelancerProfile: async (userId: string, data: Partial<FreelancerProfile>) => {
    return await profileHandlers.updateFreelancerProfile(userId, data);
  },

  updateClientProfile: async (userId: string, data: Partial<ClientProfile>) => {
    return await profileHandlers.updateClientProfile(userId, data);
  },
};
