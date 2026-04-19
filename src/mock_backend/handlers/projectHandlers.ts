import DB from '../database/db';
import type { Project } from '../../types/models/Project';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const projectHandlers = {
  async getProjects(filters?: { clientId?: string; freelancerId?: string; status?: string }) {
    await delay(300);
    let projects = DB.getProjects();
    if (filters?.clientId) projects = DB.getProjectsByClient(filters.clientId);
    if (filters?.freelancerId) projects = DB.getProjectsByFreelancer(filters.freelancerId);
    if (filters?.status) projects = projects.filter(p => p.status === filters.status);
    
    // Enrich with user data
    return projects.map(project => {
      const client = DB.getUserById(project.clientId);
      const freelancer = DB.getUserById(project.freelancerId);
      const job = DB.getJobById(project.jobId);
      return { ...project, client, freelancer, job };
    });
  },

  async getProjectById(id: string) {
    await delay(200);
    const project = DB.getProjectById(id);
    if (!project) throw new Error('Project not found');
    
    const client = DB.getUserById(project.clientId);
    const freelancer = DB.getUserById(project.freelancerId);
    const freelancerProfile = DB.getFreelancerProfile(project.freelancerId);
    const job = DB.getJobById(project.jobId);
    const messages = DB.getMessagesByConversation(project.conversationId);
    
    return { project, client, freelancer, freelancerProfile, job, messages };
  },

  async updateMilestone(projectId: string, milestoneId: string, data: { status?: string; completedAt?: string }) {
    await delay(400);
    const project = DB.getProjectById(projectId);
    if (!project) throw new Error('Project not found');
    
    const milestone = project.milestones.find(m => m.id === milestoneId);
    if (!milestone) throw new Error('Milestone not found');
    
    if (data.status) milestone.status = data.status;
    if (data.completedAt) milestone.completedAt = data.completedAt;
    
    // Update project paid amount if milestone is paid
    if (data.status === 'paid') {
      project.paidAmount += milestone.amount;
    }
    
    // Calculate progress
    const completedMilestones = project.milestones.filter(m => m.status === 'paid' || m.status === 'completed').length;
    project.progress = Math.round((completedMilestones / project.milestones.length) * 100);
    
    return project;
  },

  async updateProjectStatus(id: string, status: string) {
    await delay(300);
    const project = DB.getProjectById(id);
    if (!project) throw new Error('Project not found');
    project.status = status;
    if (status === 'completed') {
      project.endDate = new Date().toISOString();
    }
    return project;
  },
};
