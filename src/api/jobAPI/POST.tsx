import { jobHandlers } from '../../mock_backend';
import type { Job } from '../../types/models/Job';

export const jobPostAPI = {
  createJob: async (data: Partial<Job>) => {
    return await jobHandlers.createJob(data);
  },

  generateAIDescription: async (title: string, category: string, skills: string[]) => {
    return await jobHandlers.generateAIDescription(title, category, skills);
  },
};
