import { marketInsightsHandlers } from '../../mock_backend';

export const marketInsightsGetAPI = {
  getMarketInsights: async () => {
    return await marketInsightsHandlers.getMarketInsights();
  },

  getSkillTrends: async () => {
    return await marketInsightsHandlers.getSkillTrends();
  },

  getEarningsData: async () => {
    return await marketInsightsHandlers.getEarningsData();
  },

  getTrendingCategories: async () => {
    return await marketInsightsHandlers.getTrendingCategories();
  },

  getPlatformStats: async () => {
    return await marketInsightsHandlers.getPlatformStats();
  },
};
