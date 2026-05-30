import { apiService } from '../../service/apiService';
import type { ApiResponse } from '../../types/common';
import type { AdminUserDto, CreateUserPayload } from '../../types/models/User';

const Admin_Api_Base_Url = '/v1/admin';

export const adminPostAPI = {
  /**
   * POST /api/v1/admin/users
   * Creates a new user. The backend hashes the password and sets
   * IsActive = true, IsEmailVerified = false by default.
   */
  createUser: async (payload: CreateUserPayload): Promise<ApiResponse<AdminUserDto>> => {
    return apiService.post<AdminUserDto>(`${Admin_Api_Base_Url}/users`, {
      fullName: payload.fullName,
      email: payload.email,
      password: payload.password,
      role: payload.role,
      phoneNumber: payload.phoneNumber,
    });
  },
};
