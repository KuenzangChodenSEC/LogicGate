import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  createNewUser,
  getCurrentUser,
  getUsers,
  saveUsers,
  setSession,
  clearSession,
  type User,
} from '@/lib/storage';

export interface Profile {
  id: string;
  displayName: string;
  identifier: string;
  avatar: number;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signInWithUsername: (username: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithUsername: (username: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setProfile(currentUser ? {
      id: currentUser.id,
      displayName: currentUser.displayName,
      identifier: currentUser.identifier,
      avatar: currentUser.avatar,
    } : null);
  };

  useEffect(() => {
    refreshProfile().finally(() => setLoading(false));
  }, []);

  const signInWithUsername = async (username: string, password: string) => {
    try {
      const users = getUsers();
      const found = users.find(u => u.identifier.toLowerCase() === username.toLowerCase());

      if (!found) {
        throw new Error('Account not found. Please sign up.');
      }

      if (found.password !== password) {
        throw new Error('Incorrect password.');
      }

      setSession(found.id);
      setUser(found);
      setProfile({
        id: found.id,
        displayName: found.displayName,
        identifier: found.identifier,
        avatar: found.avatar,
      });
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUpWithUsername = async (username: string, password: string) => {
    try {
      const users = getUsers();
      if (users.some(u => u.identifier.toLowerCase() === username.toLowerCase())) {
        throw new Error('Account already exists. Please log in.');
      }

      const newUser = createNewUser(username, password, username);
      users.push(newUser);
      saveUsers(users);
      setSession(newUser.id);
      setUser(newUser);
      setProfile({
        id: newUser.id,
        displayName: newUser.displayName,
        identifier: newUser.identifier,
        avatar: newUser.avatar,
      });
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    clearSession();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithUsername, signUpWithUsername, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
