import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, UserRole } from '../../types/models/User';
import type { ClientProfile, FreelancerProfile } from '../../types/models/Profile';
import { authHandlers } from '../../mock_backend/handlers/authHandlers';

/**
 * AppContextValue - Global application state interface
 * 
 * Provides authentication, user profile, theme, and loading states
 * to all components within the AppProvider tree.
 */
interface AppContextValue {
  user: User | null;
  role: UserRole | null;
  theme: 'dark' | 'light';
  isLoading: boolean;
  isAuthenticated: boolean;
  isOnboardingComplete: boolean;
  clientProfile: ClientProfile | null;
  freelancerProfile: FreelancerProfile | null;
  setRole: (role: UserRole) => void;
  toggleTheme: () => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string, role: UserRole) => Promise<void>;
  logout: () => void;
  completeOnboarding: (profileData: any) => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

/**
 * AppProvider - Global application state provider
 * 
 * Must be placed inside React Router tree (via RootLayout in router.tsx)
 * to ensure context propagates correctly to all route components.
 * 
 * Usage:
 * ```tsx
 * function RootLayout() {
 *   return (
 *     <AppProvider>
 *       <Outlet />  // All routes render here
 *     </AppProvider>
 *   );
 * }
 * ```
 */
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRoleState] = useState<UserRole | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isLoading, setIsLoading] = useState(true);
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null);
  const [freelancerProfile, setFreelancerProfile] = useState<FreelancerProfile | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    document.documentElement.classList.add('dark');

    const initApp = async () => {
      try {
        const sessionData = localStorage.getItem('gigbridge_session');
        if (sessionData) {
          const { user: savedUser, role: savedRole } = JSON.parse(sessionData);
          setUser(savedUser);
          setRoleState(savedRole);
          
          // Load profile data
          if (savedRole === 0) {
            // Load client profile
            const profile = await authHandlers.getProfile(savedUser.id);
            setClientProfile(profile?.clientProfile || null);
          } else {
            // Load freelancer profile
            const profile = await authHandlers.getProfile(savedUser.id);
            setFreelancerProfile(profile?.freelancerProfile || null);
          }
        }
      } catch (_e) {
        localStorage.removeItem('gigbridge_session');
      } finally {
        setIsLoading(false);
      }
    };
    initApp();
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const isAuthenticated = !!user;
  const isOnboardingComplete = isAuthenticated && (
    role === 0 ? !!clientProfile : !!freelancerProfile
  );

  const setRole = useCallback(async (newRole: UserRole) => {
    setRoleState(newRole);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await authHandlers.login({ email, password });
      setUser(result.user);
      setRoleState(result.user.role);
      
      // Save session
      localStorage.setItem('gigbridge_session', JSON.stringify({
        user: result.user,
        role: result.user.role
      }));

      // Load profile based on role
      try {
        const profileData = await authHandlers.getProfile(result.user.id);
        if (result.user.role === 0) {
          setClientProfile(profileData?.clientProfile || null);
        } else if (result.user.role === 1) {
          setFreelancerProfile(profileData?.freelancerProfile || null);
        }
      } catch (profileErr) {
        console.warn('Could not load profile:', profileErr);
        // Profile might not exist yet for new users
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, firstName: string, lastName: string, role: UserRole) => {
    setIsLoading(true);
    try {
      const result = await authHandlers.signup(email, password, firstName, lastName, role);
      setUser(result.user);
      setRoleState(result.user.role);
      
      // Save session
      localStorage.setItem('gigbridge_session', JSON.stringify({
        user: result.user,
        role: result.user.role
      }));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setRoleState(null);
    setClientProfile(null);
    setFreelancerProfile(null);
    localStorage.removeItem('gigbridge_session');
  }, []);

  const completeOnboarding = useCallback(async (profileData: any) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      if (user.role === 0) {
        const profile = await authHandlers.createClientProfile(user.id, profileData);
        setClientProfile(profile);
      } else {
        const profile = await authHandlers.createFreelancerProfile(user.id, profileData);
        setFreelancerProfile(profile);
      }
      
      // Update session to mark onboarding as complete
      localStorage.setItem('gigbridge_session', JSON.stringify({
        user,
        role: user.role
      }));
      
      // Reload profile to ensure it's fully synced
      try {
        const reloadedProfile = await authHandlers.getProfile(user.id);
        if (user.role === 0) {
          setClientProfile(reloadedProfile?.clientProfile || null);
        } else {
          setFreelancerProfile(reloadedProfile?.freelancerProfile || null);
        }
      } catch (err) {
        console.warn('Could not reload profile:', err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const value: AppContextValue = { 
    user, 
    role, 
    theme, 
    isLoading, 
    isAuthenticated,
    isOnboardingComplete,
    clientProfile,
    freelancerProfile,
    setRole, 
    toggleTheme, 
    login,
    signup,
    logout,
    completeOnboarding
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (ctx === undefined) {
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
}