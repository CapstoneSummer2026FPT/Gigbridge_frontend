import { authHandlers } from '../../mock_backend';

export const authGetAPI = {
  checkEmailExists: async (email: string) => {
    const user = await authHandlers.getProfile(email);
    return { exists: !!user };
  },
};