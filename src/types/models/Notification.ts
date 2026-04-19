/**
 * Notification Model - NOTIFICATIONS table
 */

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
}
