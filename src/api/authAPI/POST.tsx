import { apiService } from '../../service/apiService';
import type { ApiResponse } from '../../types/common';
import type {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  EmailResendConfirmationRequest,
  ValidateResetTokenRequest,
  LoginResponse,
  UserDTO,
} from '../../types/models/Auth';

export const authPostAPI = {
  /**
   * Login with email and password
   * POST /auth/login
   */
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return apiService.post<LoginResponse>('/auth/login', credentials);
  },

  /**
   * Register new user
   * POST /auth/register
   */
  register: async (data: RegisterRequest): Promise<ApiResponse<UserDTO>> => {
    return apiService.post<UserDTO>('/auth/register', data);
  },

  /**
   * Refresh access token
   * POST /auth/refresh
   */
  refreshToken: async (accessToken: string): Promise<ApiResponse<LoginResponse>> => {
    return apiService.post<LoginResponse>('/auth/refresh', { accessToken });
  },

  /**
   * Forgot password - send reset email
   * POST /auth/forgot-password
   */
  forgotPassword: async (data: ForgotPasswordRequest): Promise<ApiResponse<null>> => {
    return apiService.post<null>('/auth/forgot-password', data);
  },

  /**
   * Reset password with token
   * POST /auth/password-reset
   */
  resetPassword: async (data: ResetPasswordRequest): Promise<ApiResponse<null>> => {
    return apiService.post<null>('/auth/password-reset', data);
  },

  /**
   * Resend email confirmation
   * POST /auth/resend-email
   */
  resendEmailConfirmation: async (data: EmailResendConfirmationRequest): Promise<ApiResponse<null>> => {
    return apiService.post<null>('/auth/resend-email', data);
  },

  /**
   * Validate reset token
   * POST /auth/validate-reset-token
   */
  validateResetToken: async (data: ValidateResetTokenRequest): Promise<ApiResponse<null>> => {
    return apiService.post<null>('/auth/validate-reset-token', data);
  },

  /**
   * Google login
   * POST /auth/google
   */
  googleLogin: async (authCode: string): Promise<ApiResponse<LoginResponse>> => {
    return apiService.post<LoginResponse>('/auth/google', { authCode });
  },
};
