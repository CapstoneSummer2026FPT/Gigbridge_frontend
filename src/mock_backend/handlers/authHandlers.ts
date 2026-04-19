import DB from '../database/db';
import type { User, UserRole } from '../../types/models/User';
import type { ClientProfile, FreelancerProfile } from '../../types/models/Profile';

export interface LoginPayload { email: string; password: string; }
export interface LoginResult { user: User; token: string; }

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const authHandlers = {
  async login(payload: LoginPayload): Promise<LoginResult> {
    await delay(600);
    let user = DB.getUserByEmail(payload.email);

    // For demo mode: auto-create user if not found
    if (!user) {
      const role: UserRole = 1; // Default to freelancer
      user = {
        id: `u_demo_${Date.now()}`,
        email: payload.email,
        first_name: 'Demo',
        last_name: 'User',
        full_name: 'Demo User',
        phone_number: null,
        role,
        is_email_verified: false,
        is_active: true,
        preferred_language: 'en',
        last_login_at: new Date().toISOString(),
        login_failed_time: null,
        access_failed_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      DB.addUser(user);
    }

    // For demo users, accept any password (including 'demo')
    // In production, you would verify the password hash here

    return { user, token: `mock-jwt-${user.id}-${Date.now()}` };
  },

  async signup(email: string, password: string, firstName: string, lastName: string, role: UserRole): Promise<LoginResult> {
    await delay(800);
    
    // Check if user exists
    const existingUser = DB.getUserByEmail(email);
    if (existingUser) throw new Error('User already exists');

    // Create new user
    const newUser: User = {
      id: `u_${role === 0 ? 'client' : 'freelancer'}_${Date.now()}`,
      email,
      first_name: firstName,
      last_name: lastName,
      full_name: `${firstName} ${lastName}`,
      phone_number: null,
      role,
      is_email_verified: false,
      is_active: true,
      preferred_language: 'en',
      last_login_at: new Date().toISOString(),
      login_failed_time: null,
      access_failed_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    DB.addUser(newUser);
    return { user: newUser, token: `mock-jwt-${newUser.id}-${Date.now()}` };
  },

  async loginAsDemo(role: 'client' | 'freelancer' | 'admin'): Promise<LoginResult> {
    await delay(300);
    const roleMap: Record<string, string> = {
      client: 'demo_client_001',
      freelancer: 'demo_freelancer_001',
      admin: 'demo_admin_001',
    };
    const user = DB.getUserById(roleMap[role]);
    if (!user) throw new Error('User not found');
    return { user, token: `mock-jwt-${user.id}-${Date.now()}` };
  },

  async getProfile(userId: string) {
    await delay(200);
    const user = DB.getUserById(userId);
    if (!user) throw new Error('User not found');
    
    if (user.role === 1) {
      return { user, freelancerProfile: DB.getFreelancerProfile(userId) };
    }
    if (user.role === 0) {
      return { user, clientProfile: DB.getClientProfile(userId) };
    }
    return { user, clientProfile: null, freelancerProfile: null };
  },

  async createClientProfile(userId: string, profileData: Partial<ClientProfile>): Promise<ClientProfile> {
    await delay(500);
    
    const profile: ClientProfile = {
      id: `cp_${Date.now()}`,
      user_id: userId,
      company_name: profileData.company_name || '',
      company_website: profileData.company_website || null,
      company_size: profileData.company_size || 0,
      industry: profileData.industry || '',
      company_description: profileData.company_description || null,
      location: profileData.location || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    DB.addClientProfile(profile);
    return profile;
  },

  async createFreelancerProfile(userId: string, profileData: Partial<FreelancerProfile>): Promise<FreelancerProfile> {
    await delay(500);
    
    const profile: FreelancerProfile = {
      id: `fp_${Date.now()}`,
      user_id: userId,
      title: profileData.title || '',
      bio: profileData.bio || '',
      hourly_rate: profileData.hourly_rate || 0,
      experience_level: profileData.experience_level || 0,
      availability: profileData.availability || 0,
      location: profileData.location || '',
      profile_completion_score: 50,
      rating: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    DB.addFreelancerProfile(profile);
    return profile;
  },
};