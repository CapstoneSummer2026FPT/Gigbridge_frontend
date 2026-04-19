import { proposalHandlers } from '../../mock_backend';

export const proposalGetAPI = {
  getProposals: async (filters?: { jobId?: string; freelancerId?: string; clientId?: string }) => {
    return await proposalHandlers.getProposals(filters);
  },

  getProposalById: async (id: string) => {
    return await proposalHandlers.getProposalById(id);
  },
};
