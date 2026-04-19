import { proposalHandlers } from '../../mock_backend';

export const proposalPutAPI = {
  updateProposalStatus: async (id: string, status: string) => {
    return await proposalHandlers.updateProposalStatus(id, status);
  },
};
