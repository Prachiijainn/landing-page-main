import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, hasValidSupabaseConfig } from '@/lib/supabase';
import { mockAuthService } from '@/services/mockAuthService';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { emailPrefixToName } from '../utils/userUtils';

interface User {
  id: string;
  email: string;
  name: string;
  displayName: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isAdmin: boolean;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Cache user profile in localStorage for fast access
  const cacheUserProfile = (userProfile: User) => {
    try {
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
    } catch (error) {
      console.warn('Failed to cache user profile');
    }
  };

  const getCachedUserProfile = (): User | null => {
    try {
      const cached = localStorage.getItem('userProfile');
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      return null;
    }
  };

  const clearCachedUserProfile = () => {
    try {
      localStorage.removeItem('userProfile');
    } catch (error) {
      console.warn('Failed to clear cached profile');
    }
  };

  // Get user profile with caching - ultra fast and reliable
  const getUserProfile = async (supabaseUser: SupabaseUser, useCache: boolean = true): Promise<User | null> => {
    // Check cache first for instant loading
    if (useCache) {
      const cached = getCachedUserProfile();
      if (cached && cached.id === supabaseUser.id) {
        console.log('⚡ Using cached profile:', cached.role);
        return cached;
      }
    }

    try {
      // Ultra-fast query - only get role
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', supabaseUser.id)
        .single();

      const userProfile: User = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: emailPrefixToName(supabaseUser.email?.split('@')[0] || ''),
        displayName: emailPrefixToName(supabaseUser.email?.split('@')[0] || ''),
        role: (profile?.role as 'user' | 'admin') || 'user'
      };

      if (error) {
        console.warn('Profile not found, using basic user');
        // Try to create profile in background
        // Create profile in background
        (async () => {
          try {
            await supabase
              .from('profiles')
              .insert({
                id: supabaseUser.id,
                email: supabaseUser.email || '',
                name: emailPrefixToName(supabaseUser.email?.split('@')[0] || ''),
                display_name: emailPrefixToName(supabaseUser.email?.split('@')[0] || ''),
                role: 'user'
              });
            console.log('Profile created in background');
          } catch (err) {
            console.warn('Background profile creation failed:', err);
          }
        })();
      } else {
        console.log('✅ Profile loaded:', userProfile.role);
      }

      // Cache the profile for next time
      cacheUserProfile(userProfile);
      return userProfile;
    } catch (error) {
      console.warn('Profile fetch failed, using fallback');
      const fallbackUser: User = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: emailPrefixToName(supabaseUser.email?.split('@')[0] || ''),
        displayName: emailPrefixToName(supabaseUser.email?.split('@')[0] || ''),
        role: 'user'
      };
      return fallbackUser;
    }
  };

  // Login function - lightning fast with caching
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!hasValidSupabaseConfig) {
      console.log('🔄 Using mock authentication - configure Supabase for real functionality');
      const result = await mockAuthService.login(email, password);
      if (result.success) {
        const mockUser = mockAuthService.getCurrentUser();
        setUser(mockUser);
      }
      return result;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Get profile with caching - super fast
        const userProfile = await getUserProfile(data.user, true);
        if (userProfile) {
          setUser(userProfile);
          console.log('⚡ Login complete with role:', userProfile.role);
          return { success: true };
        }

        // This should never happen with the new implementation
        return { success: false, error: 'Failed to load profile' };
      }

      return { success: false, error: 'Authentication failed' };
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  // Signup function
  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    if (!hasValidSupabaseConfig) {
      const result = await mockAuthService.signup(email, password, name);
      if (result.success) {
        const mockUser = mockAuthService.getCurrentUser();
        setUser(mockUser);
      }
      return result;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Create profile in profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            name,
            display_name: name,
            role: 'user'
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);

          // For now, let's allow signup to succeed even if profile creation fails
          // The user can still use the app, just without the extended profile features
          console.warn('Profile creation failed, but user account was created successfully');

          return {
            success: true,
            error: 'Account created! Note: Some features may be limited until database is fully configured.'
          };
        }

        return { success: true };
      }

      return { success: false, error: 'Failed to create user' };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  // Logout function
  const logout = async () => {
    if (!hasValidSupabaseConfig) {
      await mockAuthService.logout();
      setUser(null);
      clearCachedUserProfile();
      return;
    }

    try {
      await supabase.auth.signOut();
      setUser(null);
      clearCachedUserProfile();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Refresh user profile (useful for admin role updates)
  const refreshUserProfile = async () => {
    if (!hasValidSupabaseConfig || !user) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const userProfile = await getUserProfile(session.user);
        if (userProfile) {
          setUser(userProfile);
          console.log('🔄 User profile refreshed');
        }
      }
    } catch (error) {
      console.warn('Profile refresh failed, keeping current user');
      // Don't log error to reduce console noise
    }
  };

  // Check for existing session and listen for auth changes
  useEffect(() => {
    if (!hasValidSupabaseConfig) {
      // Use mock auth
      const mockUser = mockAuthService.getCurrentUser();
      setUser(mockUser);
      setLoading(false);
      return;
    }

    // Get initial session - instant with caching
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          console.log('🔍 Found existing session');

          // Try cache first for instant loading
          const cachedProfile = getCachedUserProfile();
          if (cachedProfile && cachedProfile.id === session.user.id) {
            console.log('⚡ Restored from cache with role:', cachedProfile.role);
            setUser(cachedProfile);
            setLoading(false);

            // Refresh profile in background
            getUserProfile(session.user, false).then(freshProfile => {
              if (freshProfile && freshProfile.role !== cachedProfile.role) {
                console.log('🔄 Profile updated in background');
                setUser(freshProfile);
              }
            });
            return;
          }

          // No cache, load profile normally
          const userProfile = await getUserProfile(session.user, false);
          if (userProfile) {
            setUser(userProfile);
            console.log('✅ Session restored with role:', userProfile.role);
          }
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes - fast with caching
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const userProfile = await getUserProfile(session.user, true);
          if (userProfile) {
            setUser(userProfile);
            console.log('⚡ Auth state updated with role:', userProfile.role);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          clearCachedUserProfile();
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          // Use cache for token refresh to avoid delays
          const userProfile = await getUserProfile(session.user, true);
          if (userProfile) {
            setUser(userProfile);
          }
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []); // Remove user dependency to prevent multiple intervals

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    refreshProfile: refreshUserProfile,
    isAdmin: user?.role === 'admin',
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};