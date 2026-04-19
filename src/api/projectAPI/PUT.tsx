import { projectHandlers } from '../../mock_backend';

export const projectPutAPI = {
  updateMilestone: async (projectId: string, milestoneId: string, data: { status?: string; completedAt?: string }) => {
    return await projectHandlers.updateMilestone(projectId, milestoneId, data);
  },

  updateProjectStatus: async (id: string, status: string) => {
    return await projectHandlers.updateProjectStatus(id, status);
  },
};
