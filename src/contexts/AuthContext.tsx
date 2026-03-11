import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '@/lib/firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User as FirebaseUser
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
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


  // Get user profile with MongoDB - ultra fast and reliable
  const getUserProfile = async (firebaseUser: FirebaseUser, useCache: boolean = true): Promise<User | null> => {
    // Check cache first for instant loading
    if (useCache) {
      const cached = getCachedUserProfile();
      if (cached && cached.id === firebaseUser.uid) {
        return cached;
      }
    }

    try {
      const profileRef = doc(db, 'profiles', firebaseUser.uid);
      const profileSnap = await getDoc(profileRef);

      let profileData = profileSnap.exists() ? profileSnap.data() : null;

      if (profileSnap.exists()) {
        console.log(`Profile found for UID ${firebaseUser.uid}. Role: ${profileData?.role}`);
        // If they are a 'user' but might have been an 'admin' in Supabase, try to elevate them
        if (profileData?.role === 'user' && firebaseUser.email) {
          const searchEmail = firebaseUser.email.toLowerCase();
          const q = query(collection(db, 'profiles'), where('email', '==', searchEmail), where('role', '==', 'admin'));
          const qSnap = await getDocs(q);
          if (!qSnap.empty) {
            console.log(`User already had a profile but was found as Admin in migrated data. Elevating...`);
            profileData = { ...profileData, role: 'admin' };
            await setDoc(doc(db, 'profiles', firebaseUser.uid), {
              ...profileData,
              role: 'admin',
              updated_at: serverTimestamp()
            }, { merge: true });
          }
        }
      } else if (firebaseUser.email) {
        // Look up by email for migrated users (from Supabase/MongoDB backup)
        try {
          const searchEmail = firebaseUser.email.toLowerCase();
          console.log(`Searching for migrated profile with email: ${searchEmail}`);
          const q = query(collection(db, 'profiles'), where('email', '==', searchEmail));
          const qSnap = await getDocs(q);

          if (!qSnap.empty) {
            console.log(`Found migrated profile for ${searchEmail}, linking to UID...`);
            profileData = qSnap.docs[0].data();

            // Create/Link the profile to the new Firebase UID
            await setDoc(doc(db, 'profiles', firebaseUser.uid), {
              ...profileData,
              id: firebaseUser.uid, // Update ID to Firebase UID
              auth_uid: firebaseUser.uid,
              updated_at: serverTimestamp()
            });
            console.log('Profile linked successfully. Role:', profileData?.role);
          } else {
            console.warn(`No profile document found for UID ${firebaseUser.uid} AND no migrated profile found for email ${searchEmail}`);
          }
        } catch (searchError) {
          console.warn('Migrated profile search failed:', searchError);
        }
      }

      const userProfile: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: profileData?.name || profileData?.display_name || emailPrefixToName(firebaseUser.email?.split('@')[0] || ''),
        displayName: profileData?.display_name || profileData?.name || emailPrefixToName(firebaseUser.email?.split('@')[0] || ''),
        role: (profileData?.role as 'user' | 'admin') || 'user'
      };

      // Cache the profile for next time
      cacheUserProfile(userProfile);
      return userProfile;
    } catch (error) {
      console.warn('Profile fetch failed, using fallback', error);
      const fallbackUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: emailPrefixToName(firebaseUser.email?.split('@')[0] || ''),
        displayName: emailPrefixToName(firebaseUser.email?.split('@')[0] || ''),
        role: 'user'
      };
      return fallbackUser;
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      if (userCredential.user) {
        const userProfile = await getUserProfile(userCredential.user, false);
        if (userProfile) {
          setUser(userProfile);
          return { success: true };
        }
      }
      return { success: false, error: 'Failed to load profile' };
    } catch (error: any) {
      console.error('❌ Login error:', error);
      let message = 'An error occurred during login';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        message = 'Invalid email or password';
      }
      return { success: false, error: message };
    }
  };

  // Signup function
  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      if (userCredential.user) {
        // First, check if a profile was already linked (migrated profile)
        const userProfile = await getUserProfile(userCredential.user, false);

        // Only create a new profile if one doesn't exist yet
        if (!userProfile || (userProfile.name === emailPrefixToName(userCredential.user.email?.split('@')[0] || '') && userProfile.role === 'user')) {
          // Double check if it actually exists in Firestore to avoid overwriting migrated data
          const profileSnap = await getDoc(doc(db, 'profiles', userCredential.user.uid));

          if (!profileSnap.exists()) {
            await setDoc(doc(db, 'profiles', userCredential.user.uid), {
              id: userCredential.user.uid,
              auth_uid: userCredential.user.uid,
              email: userCredential.user.email!,
              name,
              display_name: name,
              role: 'user',
              created_at: serverTimestamp(),
              updated_at: serverTimestamp()
            });

            // Refresh profile after creation
            const newProfile = await getUserProfile(userCredential.user, false);
            setUser(newProfile);
          } else {
            setUser(userProfile);
          }
        } else {
          setUser(userProfile);
        }

        return { success: true };
      }
      return { success: false, error: 'Failed to create user' };
    } catch (error: any) {
      console.error('❌ Signup error:', error);
      return { success: false, error: error.message || 'An error occurred during signup' };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      clearCachedUserProfile();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Refresh user profile
  const refreshUserProfile = async () => {
    if (auth.currentUser) {
      const userProfile = await getUserProfile(auth.currentUser, false);
      if (userProfile) {
        setUser(userProfile);
      }
    }
  };

  // Listen for auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Bypass cache on initial load to ensure we have the latest role (especially after linking)
        const userProfile = await getUserProfile(firebaseUser, false);
        setUser(userProfile);
      } else {
        setUser(null);
        clearCachedUserProfile();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      console.log('👤 Current User Profile:', user);
      console.log('🛡️ Is Admin:', user.role === 'admin');
    }
  }, [user]);

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
