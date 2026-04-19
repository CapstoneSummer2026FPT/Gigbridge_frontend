import DB from '../database/db';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const marketInsightsHandlers = {
  async getMarketInsights() {
    await delay(500);
    return DB.getMarketInsights();
  },

  async getSkillTrends() {
    await delay(300);
    const insights = DB.getMarketInsights();
    return insights.averageRatesBySkill;
  },

  async getEarningsData() {
    await delay(300);
    const insights = DB.getMarketInsights();
    return insights.monthlyEarnings;
  },

  async getTrendingCategories() {
    await delay(300);
    const insights = DB.getMarketInsights();
    return insights.trendingCategories;
  },

  async getPlatformStats() {
    await delay(200);
    const insights = DB.getMarketInsights();
    return insights.platformStats;
  },
};
