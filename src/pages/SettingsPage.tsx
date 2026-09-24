import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { updateUser, createNewUser, GATE_TOPICS } from '@/lib/storage';
import { toast } from 'sonner';
import { Moon, Sun, Volume2, VolumeX, RotateCcw, Lock, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  const { user, settings, updateSettings, refreshUser } = useApp();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [changePwMode, setChangePwMode] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  if (!user) return null;

  function handleReset() {
    if (!user) return;
    // Reset all progress but keep account
    const reset = {
      ...user,
      xp: 0,
      level: 1,
      badges: [],
      unlockedTopics: ['AND'],
      quizScores: {},
      practiceStreak: 0,
      lastPracticeDate: '',
      gameProgress: {},
      circuitSave: null,
    };
    updateUser(reset);
    refreshUser();
    toast.success('Progress reset! Starting fresh.', { duration: 4000 });
    setShowResetConfirm(false);
  }

  function handleChangePassword() {
    if (!user) return;
    if (currentPw !== user.password) {
      toast.error('Current password is incorrect.');
      return;
    }
    if (newPw.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }
    if (newPw !== confirmPw) {
      toast.error('New passwords do not match.');
      return;
    }
    updateUser({ ...user, password: newPw });
    refreshUser();
    toast.success('Password changed successfully!');
    setChangePwMode(false);
    setCurrentPw('');
    setNewPw('');
    setConfirmPw('');
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto animate-pixel-fade">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">Settings</h1>
      </div>

      {/* Display */}
      <div className="pixel-card p-5 mb-4">
        <h3 className="font-semibold text-foreground text-sm mb-4">Display</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {settings.darkMode ? <Moon size={17} className="text-primary" /> : <Sun size={17} className="text-amber-500" />}
            <div>
              <p className="text-foreground text-sm font-medium">Dark Mode</p>
              <p className="text-muted-foreground text-xs">{settings.darkMode ? 'Dark theme active' : 'Light theme active'}</p>
            </div>
          </div>
          <button onClick={() => updateSettings({ darkMode: !settings.darkMode })}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${settings.darkMode ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-border'}`}>
            {settings.darkMode ? 'On' : 'Off'}
          </button>
        </div>
      </div>

      {/* Audio */}
      <div className="pixel-card p-5 mb-4">
        <h3 className="font-semibold text-foreground text-sm mb-4">Audio</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {settings.soundEnabled ? <Volume2 size={17} className="text-accent" /> : <VolumeX size={17} className="text-muted-foreground" />}
            <div>
              <p className="text-foreground text-sm font-medium">Sound Effects</p>
              <p className="text-muted-foreground text-xs">Game and quiz feedback sounds</p>
            </div>
          </div>
          <button onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${settings.soundEnabled ? 'bg-accent text-accent-foreground border-accent' : 'bg-muted text-muted-foreground border-border'}`}>
            {settings.soundEnabled ? 'On' : 'Off'}
          </button>
        </div>
      </div>

      {/* Security */}
      <div className="pixel-card p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground text-sm">Security</h3>
          {!changePwMode && (
            <button onClick={() => setChangePwMode(true)}
              className="pixel-btn px-3 py-1.5 text-xs flex items-center gap-1.5">
              <Lock size={12} /> Change Password
            </button>
          )}
        </div>
        {changePwMode && (
          <div className="space-y-3">
            {[
              { label: 'Current Password', val: currentPw, set: setCurrentPw, ph: 'Enter current password' },
              { label: 'New Password', val: newPw, set: setNewPw, ph: 'Min 6 characters' },
              { label: 'Confirm New Password', val: confirmPw, set: setConfirmPw, ph: 'Repeat new password' },
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs font-medium text-muted-foreground block mb-1">{f.label}</label>
                <input type="password" className="pixel-input" value={f.val}
                  onChange={e => f.set(e.target.value)} placeholder={f.ph} />
              </div>
            ))}
            <div className="flex gap-2 pt-1">
              <button onClick={handleChangePassword} className="pixel-btn-primary px-4 py-2 text-sm">Save</button>
              <button onClick={() => { setChangePwMode(false); setCurrentPw(''); setNewPw(''); setConfirmPw(''); }}
                className="pixel-btn px-4 py-2 text-sm">Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* Danger zone */}
      <div className="pixel-card p-5 border border-destructive/30">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle size={15} className="text-destructive" />
          <h3 className="font-semibold text-destructive text-sm">Danger Zone</h3>
        </div>
        <p className="text-muted-foreground text-xs mb-4">
          Reset all progress: XP, quizzes, unlocks, badges, and game levels. Your account stays, but everything else resets to zero.
        </p>
        {!showResetConfirm ? (
          <button onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-destructive/40 bg-destructive/5 text-destructive text-sm hover:bg-destructive/10 transition-colors">
            <RotateCcw size={13} /> Reset All Progress
          </button>
        ) : (
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4">
            <p className="text-destructive font-semibold text-sm mb-3">⚠ This cannot be undone. Are you sure?</p>
            <div className="flex gap-2">
              <button onClick={handleReset}
                className="px-4 py-2 rounded bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                Yes, Reset
              </button>
              <button onClick={() => setShowResetConfirm(false)} className="pixel-btn px-4 py-2 text-sm">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
