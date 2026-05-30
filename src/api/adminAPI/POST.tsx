import { apiService } from '../../service/apiService';
import type { AdminUserDto } from './mapper';
import { mapAdminUserDto } from './mapper';
import type { User } from '../../types/models/User';

export interface CreateUserPayload {
  fullName: string;
  email: string;
  password: string;
  role: number;
  phoneNumber?: string;
}

export const adminPostAPI = {
  /**
   * POST /api/v1/admin/users
   * Creates a new user. The backend hashes the password and sets
   * IsActive = true, IsEmailVerified = false by default.
   */
  createUser: async (payload: CreateUserPayload): Promise<{ user: User | null; error: string | null }> => {
    const response = await apiService.post<AdminUserDto>('/api/v1/admin/users', {
      fullName: payload.fullName,
      email: payload.email,
      password: payload.password,
      role: payload.role,
      phoneNumber: payload.phoneNumber,
    });

    if (!response.status || !response.data) {
      const message = response.error?.response?.data?.message
        || response.error?.message
        || 'Failed to create user';
      return { user: null, error: message };
    }

    return { user: mapAdminUserDto(response.data), error: null };
  },
};
