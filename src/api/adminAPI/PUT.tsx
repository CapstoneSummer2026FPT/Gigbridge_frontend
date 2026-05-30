import { apiService } from '../../service/apiService';
import type { AdminUserDto } from './mapper';
import { mapAdminUserDto } from './mapper';
import type { User } from '../../types/models/User';

export interface UpdateUserPayload {
  fullName?: string;
  phoneNumber?: string;
  avatar?: string;
  preferredLanguage?: string;
  /** Setting isActive = false bans the user. */
  isActive?: boolean;
}

export const adminPutAPI = {
  /**
   * PUT /api/v1/admin/users
   * Updates an existing user identified by their email.
   * Only provided fields are changed (partial update via nullable fields).
   */
  updateUser: async (email: string, payload: UpdateUserPayload): Promise<{ user: User | null; error: string | null }> => {
    const response = await apiService.put<AdminUserDto>('/api/v1/admin/users', {
      email,
      request: {
        fullName: payload.fullName,
        phoneNumber: payload.phoneNumber,
        avatar: payload.avatar,
        preferredLanguage: payload.preferredLanguage,
        isActive: payload.isActive,
      },
    });

    if (!response.status || !response.data) {
      const message = response.error?.response?.data?.message
        || response.error?.message
        || 'Failed to update user';
      return { user: null, error: message };
    }

    return { user: mapAdminUserDto(response.data), error: null };
  },

  /**
   * Convenience: ban a user by setting IsActive = false.
   */
  banUser: async (email: string): Promise<{ user: User | null; error: string | null }> => {
    return adminPutAPI.updateUser(email, { isActive: false });
  },

  /**
   * Convenience: unban a user by setting IsActive = true.
   */
  unbanUser: async (email: string): Promise<{ user: User | null; error: string | null }> => {
    return adminPutAPI.updateUser(email, { isActive: true });
  },
};
