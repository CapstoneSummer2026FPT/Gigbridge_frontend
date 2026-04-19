import { authHandlers } from '../../mock_backend';

export const userGetAPI = {
  getProfile: async (userId: string) => {
    return await authHandlers.getProfile(userId);
  },
};
