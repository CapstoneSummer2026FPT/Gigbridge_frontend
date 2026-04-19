import DB from '../database/db';
import type { Proposal } from '../../types/models/Job';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const proposalHandlers = {
  async getProposals(filters?: { jobId?: string; freelancerId?: string; clientId?: string }) {
    await delay(300);
    let proposals = DB.getProposals();
    if (filters?.jobId) proposals = proposals.filter(p => p.jobId === filters.jobId);
    if (filters?.freelancerId) proposals = proposals.filter(p => p.freelancerId === filters.freelancerId);
    if (filters?.clientId) proposals = proposals.filter(p => p.clientId === filters.clientId);
    
    // Enrich proposals with freelancer and job data
    return proposals.map(proposal => {
      const freelancer = DB.getUserById(proposal.freelancerId);
      const freelancerProfile = DB.getFreelancerProfile(proposal.freelancerId);
      const job = DB.getJobById(proposal.jobId);
      return { ...proposal, freelancer, freelancerProfile, job };
    });
  },

  async getProposalById(id: string) {
    await delay(200);
    const proposal = DB.getProposalById(id);
    if (!proposal) throw new Error('Proposal not found');
    
    const freelancer = DB.getUserById(proposal.freelancerId);
    const freelancerProfile = DB.getFreelancerProfile(proposal.freelancerId);
    const job = DB.getJobById(proposal.jobId);
    const client = DB.getUserById(proposal.clientId);
    
    return { proposal, freelancer, freelancerProfile, job, client };
  },

  async createProposal(data: Partial<Proposal>) {
    await delay(800);
    const newProposal: Proposal = {
      id: `prop_${Date.now()}`,
      jobId: data.jobId!,
      freelancerId: data.freelancerId!,
      clientId: data.clientId!,
      coverLetter: data.coverLetter || '',
      bidAmount: data.bidAmount || 0,
      deliveryDays: data.deliveryDays || 0,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      aiScore: Math.floor(Math.random() * 30) + 70, // 70-99
      aiSummary: 'AI analysis completed. This proposal shows relevant experience and competitive pricing.',
      milestones: data.milestones || [],
    };
    return DB.addProposal(newProposal);
  },

  async updateProposalStatus(id: string, status: string) {
    await delay(400);
    const proposal = DB.getProposalById(id);
    if (!proposal) throw new Error('Proposal not found');
    proposal.status = status;
    return proposal;
  },

  async generateAICoverLetter(jobTitle: string, freelancerSkills: string[]): Promise<string> {
    await delay(1000);
    return `Dear Hiring Manager,

I am excited to submit my proposal for the ${jobTitle} position. With extensive experience in ${freelancerSkills.slice(0, 3).join(', ')}, I am confident I can deliver exceptional results for your project.

**Why I'm the right fit:**
- **Proven expertise**: My portfolio demonstrates successful projects using ${freelancerSkills[0]} and ${freelancerSkills[1] || 'related technologies'}
- **Quality focus**: I prioritize clean, maintainable code and thorough testing
- **Clear communication**: I provide regular updates and am responsive to feedback
- **On-time delivery**: I consistently meet deadlines without compromising quality

I would love to discuss how my skills align with your project needs. I'm available for a quick call at your convenience to dive deeper into the requirements.

Looking forward to working together!

Best regards`;
  },
};
