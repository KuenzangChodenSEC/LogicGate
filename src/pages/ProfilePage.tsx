import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { updateUser } from '@/lib/storage';
import { getLevelFromXP, BADGE_DEFS } from '@/lib/storage';
import { toast } from 'sonner';
import { Edit2, Check, X, LogOut } from 'lucide-react';

const AVATARS = ['🤖', '🦊', '🐱', '🐸', '🐼', '🐉', '👾', '🎮'];

export default function ProfilePage() {
  const { user, logout, refreshUser } = useApp();
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');

  if (!user) return null;

  const level = getLevelFromXP(user.xp);
  const earnedBadges = BADGE_DEFS.filter(b => user.badges.includes(b.id));

  function saveName() {
    const trimmed = newName.trim();
    if (!trimmed || trimmed.length < 2) {
      toast.error('Name must be at least 2 characters.');
      return;
    }
    updateUser({ ...user!, displayName: trimmed });
    refreshUser();
    toast.success('Name updated!');
    setEditingName(false);
  }

  function selectAvatar(idx: number) {
    updateUser({ ...user!, avatar: idx });
    refreshUser();
    toast.success('Avatar updated!');
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto animate-pixel-fade">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">Profile</h1>
      </div>

      {/* Avatar & name card */}
      <div className="pixel-card p-6 mb-4">
        <div className="flex items-start gap-5 flex-wrap">
          <div className="text-5xl rounded-lg border-2 border-primary p-3 bg-primary/5 shrink-0">
            {AVATARS[user.avatar] ?? '🤖'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="mb-3">
              {editingName ? (
                <div className="flex gap-2 items-center">
                  <input className="pixel-input flex-1" value={newName}
                    onChange={e => setNewName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && saveName()}
                    autoFocus maxLength={24} placeholder="Enter display name" />
                  <button onClick={saveName} className="pixel-btn-primary px-2 py-1.5 rounded"><Check size={15} /></button>
                  <button onClick={() => setEditingName(false)} className="pixel-btn px-2 py-1.5 rounded"><X size={15} /></button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h3 className="text-foreground text-xl font-bold">{user.displayName}</h3>
                  <button onClick={() => { setNewName(user.displayName); setEditingName(true); }}
                    className="pixel-btn px-2 py-1 rounded text-muted-foreground hover:text-foreground">
                    <Edit2 size={13} />
                  </button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              {[
                { label: 'Level', value: level, color: 'text-primary' },
                { label: 'Total XP', value: user.xp, color: 'text-amber-500' },
                { label: 'Badges', value: earnedBadges.length, color: 'text-accent' },
              ].map(s => (
                <div key={s.label} className="text-center bg-muted rounded-md py-2">
                  <p className={`font-bold text-lg ${s.color}`}>{s.value}</p>
                  <p className="text-muted-foreground text-xs">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="text-muted-foreground text-xs space-y-0.5">
              <p>Account: <span className="text-foreground">{user.identifier}</span></p>
              <p>Joined: <span className="text-foreground">{new Date(user.createdAt).toLocaleDateString()}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar selection */}
      <div className="pixel-card p-5 mb-4">
        <h3 className="font-semibold text-foreground text-sm mb-3">Select Avatar</h3>
        <div className="flex gap-2 flex-wrap">
          {AVATARS.map((emoji, idx) => (
            <button key={idx} onClick={() => selectAvatar(idx)}
              className={`text-3xl p-2 rounded-lg border-2 transition-all ${user.avatar === idx ? 'border-primary bg-primary/10' : 'border-border bg-muted hover:border-primary/50'}`}>
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Earned badges */}
      {earnedBadges.length > 0 && (
        <div className="pixel-card p-5 mb-4">
          <h3 className="font-semibold text-foreground text-sm mb-3">Earned Badges ({earnedBadges.length})</h3>
          <div className="flex flex-wrap gap-3">
            {earnedBadges.map(b => (
              <div key={b.id} className="pixel-card p-2 text-center border-primary/40" title={b.desc}>
                <span className="text-2xl">{b.icon}</span>
                <p className="text-primary text-xs mt-1 font-medium">{b.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logout */}
      <button onClick={logout}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-destructive/40 text-destructive bg-destructive/5 hover:bg-destructive/10 text-sm font-medium transition-colors">
        <LogOut size={15} /> Sign Out
      </button>
    </div>
  );
}
