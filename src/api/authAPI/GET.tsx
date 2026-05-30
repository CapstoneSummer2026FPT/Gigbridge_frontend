import { apiService } from '../../service/apiService';
import type { ApiResponse } from '../../types/common';
import type { VerifyEmailRequest } from '../../types/models/Auth';

export const authGetAPI = {
  /**
   * Verify email with token
   * GET /auth/verify-email?token=xxx
   */
  verifyEmail: async (params: VerifyEmailRequest): Promise<ApiResponse<null>> => {
    return apiService.get<null>('/auth/verify-email', params);
  },

  /**
   * Test auth endpoint (requires authorization)
   * GET /auth/test-auth
   */
  testAuth: async (): Promise<ApiResponse<any>> => {
    return apiService.get<any>('/auth/test-auth');
  },
};
