import { projectHandlers } from '../../mock_backend';

export const projectGetAPI = {
  getProjects: async (filters?: { clientId?: string; freelancerId?: string; status?: string }) => {
    return await projectHandlers.getProjects(filters);
  },

  getProjectById: async (id: string) => {
    return await projectHandlers.getProjectById(id);
  },
};
