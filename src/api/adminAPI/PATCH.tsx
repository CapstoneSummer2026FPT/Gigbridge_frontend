import { apiService } from '../../service/apiService';

export const adminPatchAPI = {
  /**
   * PATCH /api/v1/admin/users/toggle-activity
   * Toggles the IsActive flag for the user with the given email.
   * - If the user was active (IsActive = true), they become inactive (banned).
   * - If the user was inactive (IsActive = false), they become active (unbanned).
   *
   * Returns true on success, false if the user was not found.
   */
  toggleUserActivity: async (email: string): Promise<{ success: boolean; error: string | null }> => {
    const response = await apiService.patch<boolean>('/api/v1/admin/users/toggle-activity', {
      email,
    });

    if (!response.status) {
      const message = response.error?.response?.data?.message
        || response.error?.message
        || 'Failed to toggle user activity';
      return { success: false, error: message };
    }

    return { success: true, error: null };
  },
};
