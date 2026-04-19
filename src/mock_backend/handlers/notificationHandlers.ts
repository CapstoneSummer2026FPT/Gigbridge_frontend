import DB from '../database/db';
import type { Notification } from '../../types/models/Message';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const notificationHandlers = {
  async getUserNotifications(userId: string) {
    await delay(200);
    return DB.getNotificationsByUser(userId);
  },

  async markNotificationRead(notificationId: string) {
    await delay(150);
    DB.markNotificationRead(notificationId);
    return { success: true };
  },

  async markAllRead(userId: string) {
    await delay(200);
    const notifications = DB.getNotificationsByUser(userId);
    notifications.forEach(n => {
      n.isRead = true;
    });
    return { success: true };
  },

  async getUnreadCount(userId: string) {
    await delay(100);
    const notifications = DB.getNotificationsByUser(userId);
    return { count: notifications.filter(n => !n.isRead).length };
  },
};
