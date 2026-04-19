import { authHandlers } from '../../mock_backend';
import type { LoginPayload } from '../../mock_backend/handlers/authHandlers';

export const userPostAPI = {
  login: async (payload: LoginPayload) => {
    return await authHandlers.login(payload);
  },

  loginAsDemo: async (role: 'client' | 'freelancer' | 'admin') => {
    return await authHandlers.loginAsDemo(role);
  },
};
