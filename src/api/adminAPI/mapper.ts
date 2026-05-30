import type { User } from '../../types/models/User';
import { UserRole } from '../../types/models/User';

/**
 * Backend AdminUserDto shape returned from api/v1/admin/users
 */
export interface AdminUserDto {
  userId: string;
  fullName: string;
  email: string;
  avatar: string | null;
  phoneNumber: string | null;
  role: number;
  isEmailVerified: boolean;
  isActive: boolean;
  preferredLanguage: string | null;
  provider: string | null;
  createdAt: string;
  updatedAt: string | null;
}

/**
 * Paginated response from GET /api/v1/admin/users
 */
export interface PaginatedUsersResponse {
  items: AdminUserDto[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/**
 * Map backend AdminUserDto (camelCase) to frontend User (snake_case).
 * - FullName is split into first_name / last_name on the first space.
 * - IsActive = false is treated as banned/inactive.
 * - Fields the backend DTO doesn't carry (last_login_at, etc.) get defaults.
 */
export function mapAdminUserDto(dto: AdminUserDto): User {
  const spaceIndex = dto.fullName.indexOf(' ');
  const firstName = spaceIndex >= 0 ? dto.fullName.slice(0, spaceIndex) : dto.fullName;
  const lastName = spaceIndex >= 0 ? dto.fullName.slice(spaceIndex + 1) : '';

  return {
    id: dto.userId,
    email: dto.email,
    first_name: firstName,
    last_name: lastName,
    full_name: dto.fullName,
    phone_number: dto.phoneNumber ?? null,
    role: dto.role as UserRole,
    is_email_verified: dto.isEmailVerified,
    is_active: dto.isActive,
    preferred_language: dto.preferredLanguage || 'en',
    last_login_at: null,
    login_failed_time: null,
    access_failed_count: 0,
    gigcoin_balance: 0,
    created_at: dto.createdAt,
    updated_at: dto.updatedAt || dto.createdAt,
  };
}

/**
 * Map an array of backend DTOs to frontend Users.
 */
export function mapAdminUserList(dtos: AdminUserDto[]): User[] {
  return dtos.map(mapAdminUserDto);
}
