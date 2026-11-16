
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Eye,
  EyeOff,
  BookOpen,
  Gamepad2,
  BrainCircuit,
  Sparkles,
  ArrowLeft,
  KeyRound,
  Check,
} from 'lucide-react';

import {
  getUsers,
  saveUsers,
  createNewUser,
  checkAndAwardBadges,
  getPasswordRequirements,
  isStrongPassword,
} from '@/lib/storage';
import { getAccountProfile, getSupabaseClient, saveAccountProfile, supabase } from '@/lib/supabase';

import { useApp } from '@/contexts/AppContext';

const FEATURES = [
  { icon: <BookOpen size={17} />, text: 'Step-by-step lessons' },
  { icon: <BrainCircuit size={17} />, text: 'Interactive simulators' },
  { icon: <Gamepad2 size={17} />, text: 'Learning games & quizzes' },
];

function PasswordChecklist({ password }: { password: string }) {
  const rules = getPasswordRequirements(password);

  const items = [
    ['length', 'At least 8 characters'],
    ['uppercase', '1 uppercase letter (A-Z)'],
    ['lowercase', '1 lowercase letter (a-z)'],
    ['number', '1 number (0-9)'],
    ['special', '1 special character (! @ # $ %)'],
  ] as const;

  return (
    <div className="rounded-lg bg-muted/50 border border-border p-3 text-xs space-y-1.5">
      <p className="font-semibold text-foreground mb-1">
        Password must have:
      </p>

      {items.map(([key, label]) => {
        const valid = rules[key];

        return (
          <div
            key={key}
            className={`flex items-center gap-2 ${
              valid
                ? 'text-green-600 dark:text-green-400'
                : 'text-muted-foreground'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                valid ? 'border-current' : 'border-border'
              }`}
            >
              {valid && <Check size={11} />}
            </span>

            <span>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'reset'>('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useApp();

  React.useEffect(() => {
    if (!supabase) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setMode('reset');
    });
    return () => subscription.unsubscribe();
  }, []);

  function switchMode(next: 'login' | 'signup' | 'forgot') {
    setMode(next);
    setError('');
    setPassword('');
    setConfirmPassword('');
  }

  function handlePasswordChange(value: string) {
    setPassword(value);

    if (
      error === 'New passwords do not match.' &&
      value === confirmPassword
    ) {
      setError('');
    }
  }

  function handleConfirmPasswordChange(value: string) {
    setConfirmPassword(value);

    if (
      error === 'New passwords do not match.' &&
      value === password
    ) {
      setError('');
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    const id = identifier.trim().toLowerCase();
    const client = (() => {
      try {
        return getSupabaseClient();
      } catch (reason) {
        setError(reason instanceof Error ? reason.message : 'Cloud accounts are not configured.');
        return null;
      }
    })();
    if (!client) return;

    if (mode === 'forgot') {
      if (!id) {
        setError('Please enter your email.');
        return;
      }
      const { error: resetError } = await client.auth.resetPasswordForEmail(id, {
        redirectTo: `${window.location.origin}${window.location.pathname}`,
      });
      if (resetError) {
        setError(resetError.message);
        return;
      }
      toast.success('If an account exists for that email, a password reset link has been sent.');
      setMode('login');
      setPassword('');
      setConfirmPassword('');
      return;
    }

    if (mode === 'reset') {
      if (!isStrongPassword(password)) {
        setError('Please meet all password requirements below.');
        return;
      }
      if (password !== confirmPassword) {
        setError('New passwords do not match.');
        return;
      }
      const { error: updateError } = await client.auth.updateUser({ password });
      if (updateError) {
        setError(updateError.message);
        return;
      }
      toast.success('Password changed successfully! You can now log in.');
      setMode('login');
      setPassword('');
      setConfirmPassword('');
      return;
    }

    if (!id) {
      setError('Please enter your email.');
      return;
    }

    const pw = password;

    if (!pw) {
      setError('Please enter your password.');
      return;
    }

    try {
      const legacyUser = getUsers().find(
        (localUser) => localUser.identifier.toLowerCase() === id
      );

      if (mode === 'signup') {
        const name = displayName.trim();
        if (!name) {
          setError('Please enter your display name.');
          return;
        }
        if (!isStrongPassword(pw)) {
          setError('Please meet all password requirements below.');
          return;
        }

        const { data, error: signUpError } = await client.auth.signUp({
          email: id,
          password: pw,
          options: { data: { display_name: name } },
        });
        if (signUpError) throw signUpError;
        if (!data.session || !data.user) {
          toast.success(
            legacyUser
              ? 'Check your email, then log in on this device to migrate your saved progress.'
              : 'Account created. Check your email to confirm it, then log in.',
          );
          setMode('login');
          return;
        }

        const account = legacyUser
          ? { ...legacyUser, id: data.user.id, identifier: id, password: '' }
          : createNewUser(id, '', name);
        account.id = data.user.id;
        account.password = '';
        const { user: withBadge } = checkAndAwardBadges(account);
        await saveAccountProfile(withBadge);
        saveUsers([
          ...getUsers().filter((user) =>
            user.id !== withBadge.id && user.identifier.toLowerCase() !== id
          ),
          withBadge,
        ]);
        login(withBadge);
        toast.success('Account created! Welcome to Logic Gate Learning Hub!');
        navigate('/home');
        return;
      }

      const { data, error: signInError } = await client.auth.signInWithPassword({
        email: id,
        password: pw,
      });
      if (signInError) throw signInError;
      if (!data.user) throw new Error('Sign-in did not return an account.');

      const remoteAccount = await getAccountProfile(data.user.id);
      const account = remoteAccount
        ? { ...remoteAccount, identifier: id, password: '' }
        : {
            ...(legacyUser ?? createNewUser(
              id,
              '',
              String(data.user.user_metadata.display_name || id),
            )),
            id: data.user.id,
            identifier: id,
            password: '',
          };
      if (!remoteAccount) await saveAccountProfile(account);
      saveUsers([
        ...getUsers().filter((user) =>
          user.id !== account.id && user.identifier.toLowerCase() !== id
        ),
        account,
      ]);
      login(account);
      toast.success(`Welcome back, ${account.displayName}!`);
      navigate('/home');
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : '';
      setError(
        message === 'Invalid login credentials'
          ? 'No matching account and password were found in this Supabase project. Confirm your email, password, and that both devices use the same deployed app configuration.'
          : message || 'Unable to sign in. Please try again.',
      );
    }
  }

  const title =
    mode === 'login'
      ? 'Welcome back'
      : mode === 'signup'
        ? 'Begin your journey'
        : mode === 'reset'
          ? 'Choose a new password'
          : 'Reset your password';

  const subtitle =
    mode === 'login'
      ? 'Continue learning where you left off.'
      : mode === 'signup'
        ? 'Create an account to save your learning progress.'
        : mode === 'reset'
          ? 'Choose a new password for your account.'
          : 'Enter your email and we will send you a secure reset link.';

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.08fr_.92fr] bg-background">
      {/* Left panel: Bhutan-inspired design */}
      <section className="relative hidden lg:flex min-h-screen overflow-hidden bg-[#5f1d1b] text-white">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage:
              "url('https://commons.wikimedia.org/wiki/Special:Redirect/file/Taktsang%20Monastery%2C%20Bhutan%2001.jpg')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-br from-[#4b1515]/90 via-[#6f2520]/70 to-[#a86c21]/55" />

        <div className="absolute inset-0 opacity-25 bhutan-pattern" />

        <div className="relative z-10 flex flex-col justify-between w-full p-10 xl:p-14">
          {/* Logo and brand */}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 flex items-center justify-center">
              <img
                src={`${import.meta.env.BASE_URL}images/logo/logicgate-bhutan-logo.png`}
                alt="LogicGate Logo"
                className="w-full h-full object-contain"
                />
            </div>

            <div>
              <div className="font-extrabold tracking-wide">
                LOGIC GATE
              </div>

              <div className="text-xs text-white/75 tracking-[.18em]">
                LEARNING HUB
              </div>
            </div>
          </div>

          {/* Introduction */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-xs mb-5">
              <Sparkles size={14} />
              A Bhutan-inspired learning experience
            </div>

            <h1 className="text-5xl xl:text-6xl font-extrabold leading-tight">
              Learn logic.
              <br />
              <span className="text-[#e8b34c]">
                Build circuits.
              </span>
              <br />
              Play &amp; discover.
            </h1>

            <p className="mt-5 max-w-lg text-white/80 leading-7">
              A friendly digital space for understanding logic gates
              through lessons, simulations, practice, games and quizzes.
            </p>

            <div className="grid sm:grid-cols-3 gap-3 mt-8">
              {FEATURES.map((feature) => (
                <div
                  key={feature.text}
                  className="rounded-xl bg-black/20 border border-white/15 p-3 backdrop-blur-sm"
                >
                  <div className="text-[#e8b34c] mb-2">
                    {feature.icon}
                  </div>

                  <div className="text-sm font-medium">
                    {feature.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-white/55">
            A learning interface inspired by Bhutanese colours,
            landscapes and architectural details.
          </p>
        </div>
      </section>

      {/* Right panel: Login, signup and password recovery */}
      <section className="relative flex items-center justify-center px-5 py-10 sm:px-8 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[.10]"
          style={{
            backgroundImage:
              "url('https://commons.wikimedia.org/wiki/Special:Redirect/file/Window%20Samten-Ch%C3%B6ling%20Tsakaling.jpg')",
          }}
        />

        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#5f1d1b] via-[#d99a2b] to-[#5f1d1b]" />

        {/* Keep all right-panel content inside this wrapper */}
        <div className="relative z-10 w-full max-w-md">
          {/* Mobile logo and heading */}
          <div className="lg:hidden text-center mb-7">
            <div className="mx-auto w-16 h-16 flex items-center justify-center mb-3">
              <img
                src={`${import.meta.env.BASE_URL}images/logo/logicgate-bhutan-logo.png`}
                alt="LogicGate Logo"
                className="w-full h-full object-contain"
                />
            </div>

            <h1 className="font-extrabold text-xl">
              Logic Gate Learning Hub
            </h1>

            <p className="text-muted-foreground text-sm">
              Learn • Practice • Explore
            </p>
          </div>

          {/* Authentication card */}
          <div className="pixel-card bhutan-frame p-6 sm:p-8 bg-card/95 backdrop-blur-sm">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[.18em] text-accent font-semibold mb-1">
                {mode === 'forgot' || mode === 'reset' ? 'Account Recovery' : 'Welcome'}
              </p>

              <h2 className="text-2xl font-extrabold">
                {title}
              </h2>

              <p className="text-muted-foreground text-sm mt-1">
                {subtitle}
              </p>
            </div>

            {/* Login and signup tabs */}
            {(mode === 'login' || mode === 'signup') && (
              <div className="flex mb-6 rounded-lg p-1 bg-secondary">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${
                    mode === 'login'
                      ? 'bg-card text-primary shadow-sm'
                      : 'text-muted-foreground'
                  }`}
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${
                    mode === 'signup'
                      ? 'bg-card text-primary shadow-sm'
                      : 'text-muted-foreground'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Display name */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-semibold mb-1.5">
                    Display Name
                  </label>

                  <input
                    className="pixel-input"
                    placeholder="Your name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    autoComplete="name"
                  />
                </div>
              )}

              {/* Email */}
              {mode !== 'reset' && (
              <div>
                <label className="block text-sm font-semibold mb-1.5">
                  Email
                </label>

                <input
                  className="pixel-input"
                  placeholder="email@example.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="email"
                  type="email"
                />
              </div>
              )}

              {/* Password */}
              {mode !== 'forgot' && (
              <div>
                <label className="block text-sm font-semibold mb-1.5">
                  {mode === 'login' ? 'Password' : 'New Password'}
                </label>

                <div className="relative">
                  <input
                    className="pixel-input pr-10"
                    type={showPw ? 'text' : 'password'}
                    placeholder="Enter password..."
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    autoComplete={
                      mode === 'login'
                        ? 'current-password'
                        : 'new-password'
                    }
                  />

                  <button
                    type="button"
                    onClick={() => setShowPw((value) => !value)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>
              )}

              {/* Password requirements */}
              {(mode === 'signup' || mode === 'reset') && (
                <PasswordChecklist password={password} />
              )}

              {/* Confirm new password during recovery */}
              {mode === 'reset' && (
                <div>
                  <label className="block text-sm font-semibold mb-1.5">
                    Confirm New Password
                  </label>

                  <div className="relative">
                    <input
                      className="pixel-input pr-10"
                      type={showConfirmPw ? 'text' : 'password'}
                      placeholder="Repeat new password..."
                      value={confirmPassword}
                      onChange={(e) =>
                        handleConfirmPasswordChange(e.target.value)
                      }
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPw((value) => !value)
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                      aria-label={
                        showConfirmPw
                          ? 'Hide confirmation password'
                          : 'Show confirmation password'
                      }
                    >
                      {showConfirmPw ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div
                  role="alert"
                  className="rounded-md border border-destructive bg-destructive/10 text-destructive px-3 py-2 text-sm"
                >
                  {error}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                className="pixel-btn-primary w-full py-3 mt-1 flex items-center justify-center gap-2"
              >
                {mode === 'login' ? (
                  'Enter Learning Hub'
                ) : mode === 'signup' ? (
                  'Create My Account'
                ) : mode === 'forgot' ? (
                  'Send Reset Link'
                ) : (
                  <>
                    <KeyRound size={16} />
                    Save New Password
                  </>
                )}
              </button>
            </form>

            {/* Forgot password or return to login */}
            {mode === 'login' ? (
              <button
                type="button"
                onClick={() => switchMode('forgot')}
                className="w-full mt-4 text-sm text-primary font-semibold hover:underline"
              >
                Forgot Password?
              </button>
            ) : (
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="w-full mt-4 text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-1.5"
              >
                <ArrowLeft size={14} />
                Back to Login
              </button>
            )}

            <p className="mt-5 text-center text-muted-foreground text-xs">
              Your account and learning progress sync across your devices.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
