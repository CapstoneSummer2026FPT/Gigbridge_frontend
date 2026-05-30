import { apiService } from '../../service/apiService';

export const adminDeleteAPI = {
  /**
   * DELETE /api/v1/admin/users
   * Permanently deletes the user with the given email.
   * Returns true on success, false if the user was not found.
   */
  deleteUser: async (email: string): Promise<{ success: boolean; error: string | null }> => {
    const response = await apiService.delete<boolean>('/api/v1/admin/users', { email });

    if (!response.status) {
      const message = response.error?.response?.data?.message
        || response.error?.message
        || 'Failed to delete user';
      return { success: false, error: message };
    }

    return { success: true, error: null };
  },
};
