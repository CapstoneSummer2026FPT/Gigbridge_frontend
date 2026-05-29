export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserDTO {
  userId: string;
  fullName: string;
  email: string;
  avatar?: string | null;
  phoneNumber?: string | null;
  role: number;
  isEmailVerified: boolean;
  isActive: boolean;
  preferredLanguage?: string | null;
  provider?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface LoginResponseDTO {
  user: UserDTO;
  token: string;
  refreshToken?: string;
}
