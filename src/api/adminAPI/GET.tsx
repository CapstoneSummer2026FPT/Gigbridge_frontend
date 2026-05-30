import { apiService } from '../../service/apiService';
import type { PaginatedUsersResponse } from './mapper';
import { mapAdminUserList } from './mapper';
import type { User } from '../../types/models/User';

export interface GetUsersParams {
  Page?: number;
  PageSize?: number;
  Search?: string;
  /** 1 = active, 0 = inactive/banned, omit = all */
  Status?: number;
}

export interface GetUsersResult {
  users: User[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export const adminGetAPI = {
  /**
   * GET /api/v1/admin/users
   * Returns a paginated, searchable list of users.
   * Backend Status: 1 = active, 0 = inactive (banned), null = all.
   */
  getUsers: async (params: GetUsersParams = {}): Promise<GetUsersResult> => {
    const response = await apiService.get<PaginatedUsersResponse>('/api/v1/admin/users', params);

    if (!response.status || !response.data) {
      return { users: [], page: 1, pageSize: 20, totalItems: 0, totalPages: 0 };
    }

    return {
      users: mapAdminUserList(response.data.items),
      page: response.data.page,
      pageSize: response.data.pageSize,
      totalItems: response.data.totalItems,
      totalPages: response.data.totalPages,
    };
  },

  /**
   * Fetch all users matching the given search/filter by requesting page 1
   * with a high page size.
   */
  getAllUsers: async (search?: string, status?: number): Promise<User[]> => {
    const result = await adminGetAPI.getUsers({
      Page: 1,
      PageSize: 200,
      Search: search,
      Status: status,
    });
    return result.users;
  },
};
