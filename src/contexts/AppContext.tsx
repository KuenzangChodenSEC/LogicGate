import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User, Settings,
  getCurrentUser, updateUser, clearSession, setSession,
  getSettings, saveSettings, storageAvailable,
  checkAndAwardBadges, addXP,
} from '@/lib/storage';
import { toast } from 'sonner';

interface AppContextValue {
  user: User | null;
  settings: Settings;
  storageOk: boolean;
  refreshUser: () => void;
  updateSettings: (s: Partial<Settings>) => void;
  logout: () => void;
  login: (u: User) => void;
  awardXP: (amount: number, reason?: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<Settings>(getSettings());
  const storageOk = storageAvailable();

  const refreshUser = useCallback(() => {
    const u = getCurrentUser();
    setUser(u);
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Play a short, subtle UI tone while sound is enabled (including game interactions).
  useEffect(() => {
    if (!settings.soundEnabled) return;
    const playTone = (frequency = 660) => {
      try {
        const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) return;
        const context = new AudioContextClass();
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.035, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.075);
        oscillator.connect(gain); gain.connect(context.destination);
        oscillator.start(); oscillator.stop(context.currentTime + 0.08);
        oscillator.onended = () => { void context.close(); };
      } catch { /* Audio is optional; never block the game if unavailable. */ }
    };
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('button,[role="button"]')) playTone(720);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [settings.soundEnabled]);

  // Apply dark mode class
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(settings.darkMode ? 'dark' : 'light');
  }, [settings.darkMode]);

  const login = useCallback((u: User) => {
    setSession(u.id);
    const { user: withBadge, newBadges } = checkAndAwardBadges(u);
    updateUser(withBadge);
    setUser(withBadge);
    newBadges.forEach(b => toast.success(`Badge Unlocked: ${b}!`));
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const updateSettings = useCallback((partial: Partial<Settings>) => {
    const next = { ...settings, ...partial };
    setSettings(next);
    saveSettings(next);
  }, [settings]);

  const awardXP = useCallback((amount: number, reason?: string) => {
    // Read the latest saved user so XP updates do not overwrite game progress saved moments earlier.
    const latestUser = getCurrentUser();
    if (!latestUser) return;
    const updated = addXP(latestUser, amount);
    const { user: withBadge, newBadges } = checkAndAwardBadges(updated);
    updateUser(withBadge);
    setUser(withBadge);
    if (reason) toast.success(`+${amount} XP — ${reason}`, { duration: 2000 });
    newBadges.forEach(b => {
      const def = import('@/lib/storage').then(m => m.BADGE_DEFS.find(bd => bd.id === b));
      def.then(bd => {
        if (bd) toast.success(`🏆 Badge Earned: ${bd.name}!`, { duration: 4000 });
      });
    });
  }, [user]);

  return (
    <AppContext.Provider value={{ user, settings, storageOk, refreshUser, updateSettings, logout, login, awardXP }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
