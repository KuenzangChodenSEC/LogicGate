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
import { getAccountProfile, getSupabaseClient, saveAccountProfile } from '@/lib/supabase';

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
      const email = username.trim().toLowerCase();
      const client = getSupabaseClient();
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (!data.user) throw new Error('Sign-in did not return an account.');

      const remoteAccount = await getAccountProfile(data.user.id);
      const legacyAccount = getUsers().find(user => user.identifier.toLowerCase() === email);
      const found = remoteAccount
        ? { ...remoteAccount, identifier: email, password: '' }
        : {
            ...(legacyAccount ?? createNewUser(
              email,
              '',
              String(data.user.user_metadata.display_name || email),
            )),
            id: data.user.id,
            identifier: email,
            password: '',
          };

      if (!remoteAccount) await saveAccountProfile(found);
      saveUsers([
        ...getUsers().filter(user => user.id !== found.id && user.identifier.toLowerCase() !== email),
        found,
      ]);
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
      const email = username.trim().toLowerCase();
      const client = getSupabaseClient();
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: { data: { display_name: username.trim() } },
      });
      if (error) throw error;
      if (!data.session || !data.user) {
        return { error: new Error('Account created. Confirm your email, then log in.') };
      }

      const legacyAccount = getUsers().find(user => user.identifier.toLowerCase() === email);
      const newUser = legacyAccount
        ? { ...legacyAccount, id: data.user.id, identifier: email, password: '' }
        : createNewUser(email, '', username.trim());
      newUser.id = data.user.id;
      newUser.password = '';
      await saveAccountProfile(newUser);
      saveUsers([
        ...getUsers().filter(user => user.id !== newUser.id && user.identifier.toLowerCase() !== email),
        newUser,
      ]);
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
    const client = getSupabaseClient();
    const { error } = await client.auth.signOut();
    if (error) throw error;
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
