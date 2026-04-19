import { notificationHandlers } from '../../mock_backend';

export const notificationGetAPI = {
  getUserNotifications: async (userId: string) => {
    return await notificationHandlers.getUserNotifications(userId);
  },

  getUnreadCount: async (userId: string) => {
    return await notificationHandlers.getUnreadCount(userId);
  },
};
