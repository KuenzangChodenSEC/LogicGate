import { createClient } from '@supabase/supabase-js';
import type { User } from '@/lib/storage';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export function getSupabaseClient() {
  if (!supabase) {
    throw new Error('Cloud accounts are not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }
  return supabase;
}

export async function getAccountProfile(userId: string): Promise<User | null> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('profiles')
    .select('account_data')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const accountData = data.account_data as Omit<User, 'password'>;
  return { ...accountData, id: userId, password: '' };
}

export async function saveAccountProfile(user: User): Promise<void> {
  const client = getSupabaseClient();
  const { password, ...accountData } = user;
  void password;

  const { error } = await client.from('profiles').upsert(
    { id: user.id, account_data: accountData },
    { onConflict: 'id' },
  );
  if (error) throw error;
}
