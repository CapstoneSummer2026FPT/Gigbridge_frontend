import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, UserRole } from '../../types/models/User';
import type { ClientProfile, FreelancerProfile } from '../../types/models/Profile';
import { authHandlers } from '../../mock_backend/handlers/authHandlers';

export type AppTheme = 'black' | 'white';

/**
 * AppContextValue - Global application state interface
 *
 * Provides authentication, user profile, theme, and loading states
 * to all components within the AppProvider tree.
 */
interface AppContextValue {
  user: User | null;
  role: UserRole | null;
  theme: AppTheme;
  isLoading: boolean;
  isAuthenticated: boolean;
  isOnboardingComplete: boolean;
  clientProfile: ClientProfile | null;
  freelancerProfile: FreelancerProfile | null;
  setRole: (role: UserRole) => void;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
  login: (email: string, password: string) => Promise<UserRole>;
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
  const [theme, setThemeState] = useState<AppTheme>('black');
  const [isLoading, setIsLoading] = useState(true);
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null);
  const [freelancerProfile, setFreelancerProfile] = useState<FreelancerProfile | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    // Load saved theme or default to black
    const savedTheme = localStorage.getItem('gigbridge_theme') as AppTheme;
    const initialTheme = savedTheme && (savedTheme === 'black' || savedTheme === 'white') ? savedTheme : 'black';
    setThemeState(initialTheme);
    document.documentElement.classList.add(initialTheme);

    const initApp = async () => {
      try {
        let savedUser = null;
        let savedRole = null;

        const sessionData = localStorage.getItem('gigbridge_session');
        const gigbridgeUserData = localStorage.getItem('gigbridge_user');

        if (sessionData) {
          const parsed = JSON.parse(sessionData);
          savedUser = parsed.user;
          savedRole = parsed.role;
        } else if (gigbridgeUserData) {
          savedUser = JSON.parse(gigbridgeUserData);
          savedRole = savedUser?.role;
        }

        if (savedUser) {
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
        localStorage.removeItem('gigbridge_user');
        localStorage.removeItem('access_token');
      } finally {
        setIsLoading(false);
      }
    };
    initApp();
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    const allThemes: AppTheme[] = ['black', 'white'];

    // Remove all theme classes
    allThemes.forEach(t => root.classList.remove(t));

    // Add current theme class
    root.classList.add(theme);

    // Save theme to localStorage
    localStorage.setItem('gigbridge_theme', theme);
  }, [theme]);

  const isAuthenticated = !!user;
  const isOnboardingComplete = isAuthenticated && (
    role === 0 ? !!clientProfile : !!freelancerProfile
  );

  const setRole = useCallback(async (newRole: UserRole) => {
    setRoleState(newRole);
  }, []);

  const setTheme = useCallback((newTheme: AppTheme) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => prev === 'black' ? 'white' : 'black');
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<UserRole> => {
    setIsLoading(true);
    try {
      const result = await authHandlers.login({ email, password });
      setUser(result.user);
      setRoleState(result.user.role);
      
      // Save session tokens and user data
      localStorage.setItem('gigbridge_session', JSON.stringify({
        user: result.user,
        role: result.user.role
      }));
      localStorage.setItem('access_token', result.token);
      localStorage.setItem('gigbridge_user', JSON.stringify(result.user));

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
      return result.user.role;
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
    localStorage.removeItem('gigbridge_user');
    localStorage.removeItem('access_token');
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
    setTheme,
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