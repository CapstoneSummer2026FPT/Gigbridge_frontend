import { notificationHandlers } from '../../mock_backend';

export const notificationPutAPI = {
  markNotificationRead: async (notificationId: string) => {
    return await notificationHandlers.markNotificationRead(notificationId);
  },

  markAllRead: async (userId: string) => {
    return await notificationHandlers.markAllRead(userId);
  },
};
