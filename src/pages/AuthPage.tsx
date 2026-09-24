import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, EyeOff, Zap } from 'lucide-react';
import {
  getUsers, saveUsers, setSession, updateUser,
  createNewUser, checkAndAwardBadges,
} from '@/lib/storage';
import { useApp } from '@/contexts/AppContext';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useApp();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const id = identifier.trim();
    const pw = password.trim();
    if (!id || !pw) { setError('Please fill in all fields.'); return; }
    const users = getUsers();

    if (mode === 'signup') {
      const name = displayName.trim();
      if (!name) { setError('Please enter your display name.'); return; }
      if (users.find(u => u.identifier === id)) {
        setError('Account already exists. Please log in.');
        return;
      }
      const newUser = createNewUser(id, pw, name);
      const { user: withBadge } = checkAndAwardBadges(newUser);
      users.push(withBadge);
      saveUsers(users);
      login(withBadge);
      toast.success('Account created! Welcome to Logic Gate Learning Hub!');
      navigate('/home');
    } else {
      const found = users.find(u => u.identifier === id);
      if (!found) { setError('Account not found. Please sign up.'); return; }
      if (found.password !== pw) { setError('Incorrect password.'); return; }
      login(found);
      toast.success(`Welcome back, ${found.displayName}!`);
      navigate('/home');
    }
  }

  return (
    <div className="min-h-screen flex items-stretch bg-background">
      {/* Left panel — decorative */}
      <div className="hidden md:flex w-1/2 flex-col items-center justify-center bg-foreground px-12 py-16">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-xl mx-auto mb-6 flex items-center justify-center">
            <Zap size={32} className="text-white" />
          </div>
          <h1 className="text-white text-2xl font-bold mb-2 leading-tight">
            Logic Gate<br />Learning Hub
          </h1>
          <p className="text-white/50 text-sm mb-10">Class 9 DTI · Digital Electronics</p>
          <div className="grid grid-cols-2 gap-2 text-left max-w-xs mx-auto">
            {['8 Logic Gates', '6 Interactive Games', '60 Levels Each', '10 Quiz Questions', 'XP & Badges', 'Circuit Builder'].map(f => (
              <div key={f} className="flex items-center gap-2 text-white/70 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="md:hidden text-center mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl mx-auto mb-3 flex items-center justify-center">
              <Zap size={24} className="text-white" />
            </div>
            <h1 className="text-foreground font-bold text-xl">Logic Gate Learning Hub</h1>
            <p className="text-muted-foreground text-sm mt-1">Class 9 DTI</p>
          </div>

          <div className="pixel-card p-6">
            <h2 className="text-foreground font-semibold text-lg mb-5">
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </h2>

            {/* Tabs */}
            <div className="flex mb-5 bg-muted rounded-lg p-1">
              <button
                onClick={() => { setMode('login'); setError(''); }}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === 'login' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Login
              </button>
              <button
                onClick={() => { setMode('signup'); setError(''); }}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === 'signup' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Display Name</label>
                  <input
                    className="pixel-input"
                    placeholder="Your name"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    autoComplete="name"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email or Phone</label>
                <input
                  className="pixel-input"
                  placeholder="email@example.com"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  autoComplete={mode === 'login' ? 'username' : 'email'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                <div className="relative">
                  <input
                    className="pixel-input pr-10"
                    type={showPw ? 'text' : 'password'}
                    placeholder="Enter password..."
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-md border border-destructive bg-destructive/10 text-destructive px-3 py-2 text-sm">
                  {error}
                </div>
              )}

              <button type="submit" className="pixel-btn-primary w-full py-2.5 mt-1">
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <p className="mt-4 text-center text-muted-foreground text-xs">
              Demo: enter any email + password to sign up
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
