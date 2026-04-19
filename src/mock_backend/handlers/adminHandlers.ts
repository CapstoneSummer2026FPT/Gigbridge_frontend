import DB from '../database/db';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const adminHandlers = {
  async getDashboardStats() {
    await delay(400);
    const users = DB.getUsers();
    const jobs = DB.getJobs();
    const projects = DB.getProjects();
    const proposals = DB.getProposals();
    
    const today = new Date();
    const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const newUsersLast30Days = users.filter(u => new Date(u.createdAt) > last30Days).length;
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const totalRevenue = projects.reduce((sum, p) => sum + p.paidAmount, 0);
    
    return {
      totalUsers: users.length,
      totalJobs: jobs.length,
      activeProjects,
      totalRevenue,
      newUsersLast30Days,
      totalFreelancers: users.filter(u => u.role === 'freelancer').length,
      totalClients: users.filter(u => u.role === 'client').length,
      pendingDisputes: 0, // Would come from disputes data
      averageProjectValue: totalRevenue / projects.length || 0,
    };
  },

  async getRecentUsers(limit: number = 10) {
    await delay(300);
    const users = DB.getUsers();
    return users
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },

  async getRecentProjects(limit: number = 10) {
    await delay(300);
    const projects = DB.getProjects();
    return projects
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
      .slice(0, limit)
      .map(project => {
        const client = DB.getUserById(project.clientId);
        const freelancer = DB.getUserById(project.freelancerId);
        return { ...project, client, freelancer };
      });
  },

  async getUserActivity(days: number = 7) {
    await delay(400);
    const users = DB.getUsers();
    const today = new Date();
    
    const activityData = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      activityData.push({
        date: dateStr,
        newUsers: Math.floor(Math.random() * 20) + 5,
        activeUsers: Math.floor(Math.random() * 100) + 50,
      });
    }
    
    return activityData;
  },

  async getRevenueData(months: number = 6) {
    await delay(400);
    const insights = DB.getMarketInsights();
    return insights.monthlyEarnings.slice(-months);
  },
};
