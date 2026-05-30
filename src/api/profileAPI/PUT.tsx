import { apiService } from '../../service/apiService';
import type { FreelancerProfileDto, UpdateFreelancerProfileDto } from '../../types/models/Profile';

export const profilePutAPI = {
  updateFreelancerProfile: async (userId: string, data: UpdateFreelancerProfileDto) => {
    return await apiService.put<FreelancerProfileDto>(`/api/freelancerprofile/${userId}`, data);
  },

  updateMyFreelancerProfile: async (data: UpdateFreelancerProfileDto) => {
    return await apiService.put<FreelancerProfileDto>('/api/freelancerprofile/me', data);
  },

  updateClientProfile: async (userId: string, data: any) => {
    return await apiService.put(`/api/clientprofile/${userId}`, data);
  },
};
