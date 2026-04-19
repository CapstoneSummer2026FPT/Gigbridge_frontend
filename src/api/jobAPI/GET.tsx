import { jobHandlers } from '../../mock_backend';

export const jobGetAPI = {
  getJobs: async (filters?: { category?: string; search?: string; aiRecommended?: boolean }) => {
    return await jobHandlers.getJobs(filters);
  },

  getJobById: async (id: string) => {
    return await jobHandlers.getJobById(id);
  },

  getClientJobs: async (clientId: string) => {
    return await jobHandlers.getClientJobs(clientId);
  },
};
