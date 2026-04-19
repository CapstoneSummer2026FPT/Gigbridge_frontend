import DB from '../database/db';
import type { FreelancerProfile, ClientProfile } from '../../types/models/User';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const profileHandlers = {
  async getFreelancerProfile(userId: string) {
    await delay(200);
    const user = DB.getUserById(userId);
    if (!user) throw new Error('User not found');
    
    const profile = DB.getFreelancerProfile(userId);
    if (!profile) throw new Error('Freelancer profile not found');
    
    const reviews = DB.getReviewsByUser(userId);
    const proposals = DB.getProposalsByFreelancer(userId);
    const projects = DB.getProjectsByFreelancer(userId);
    
    return { user, profile, reviews, proposals, projects };
  },

  async getClientProfile(userId: string) {
    await delay(200);
    const user = DB.getUserById(userId);
    if (!user) throw new Error('User not found');
    
    const profile = DB.getClientProfile(userId);
    if (!profile) throw new Error('Client profile not found');
    
    const jobs = DB.getJobsByClient(userId);
    const projects = DB.getProjectsByClient(userId);
    
    return { user, profile, jobs, projects };
  },

  async updateFreelancerProfile(userId: string, data: Partial<FreelancerProfile>) {
    await delay(500);
    const profile = DB.getFreelancerProfile(userId);
    if (!profile) throw new Error('Profile not found');
    
    Object.assign(profile, data);
    return profile;
  },

  async updateClientProfile(userId: string, data: Partial<ClientProfile>) {
    await delay(500);
    const profile = DB.getClientProfile(userId);
    if (!profile) throw new Error('Profile not found');
    
    Object.assign(profile, data);
    return profile;
  },

  async getAllFreelancers(filters?: { skills?: string[]; availabilityStatus?: string; minRating?: number }) {
    await delay(400);
    let profiles = DB.getAllFreelancerProfiles();
    
    if (filters?.skills?.length) {
      profiles = profiles.filter(p => 
        filters.skills!.some(skill => p.skills.includes(skill))
      );
    }
    
    if (filters?.availabilityStatus) {
      profiles = profiles.filter(p => p.availabilityStatus === filters.availabilityStatus);
    }
    
    if (filters?.minRating) {
      profiles = profiles.filter(p => (p.rating || 0) >= filters.minRating!);
    }
    
    // Enrich with user data
    return profiles.map(profile => {
      const user = DB.getUserById(profile.userId);
      return { ...profile, user };
    });
  },
};
