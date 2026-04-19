import { proposalHandlers } from '../../mock_backend';
import type { Proposal } from '../../types/models/Job';

export const proposalPostAPI = {
  createProposal: async (data: Partial<Proposal>) => {
    return await proposalHandlers.createProposal(data);
  },

  generateAICoverLetter: async (jobTitle: string, freelancerSkills: string[]) => {
    return await proposalHandlers.generateAICoverLetter(jobTitle, freelancerSkills);
  },
};
