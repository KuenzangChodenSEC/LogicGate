import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import IntersectObserver from '@/components/common/IntersectObserver';
import { Toaster } from '@/components/ui/sonner';
import { AppProvider } from '@/contexts/AppContext';
import AppLayout from '@/components/AppLayout';
import RouteGuard from '@/components/RouteGuard';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Pages
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import InstructionsPage from './pages/InstructionsPage';
import LearnPage from './pages/LearnPage';
import GateDetailPage from './pages/GateDetailPage';
import TutorialsPage from './pages/TutorialsPage';
import SimulatorPage from './pages/SimulatorPage';
import PracticePage from './pages/PracticePage';
import CircuitBuilderPage from './pages/CircuitBuilderPage';
import GamesHubPage from './pages/GamesHubPage';
import GateMatchGame from './pages/games/GateMatchGame';
import BlitzGame from './pages/games/BlitzGame';
import BoolBuilderGame from './pages/games/BoolBuilderGame';
import MazeGame from './pages/games/MazeGame';
import QuizPage from './pages/QuizPage';
import ProgressPage from './pages/ProgressPage';
import AchievementsPage from './pages/AchievementsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import NotFound from './pages/NotFound';

function SupabaseAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    async function completeAuthCallback() {
      try {
        if (!supabase) throw new Error('Cloud accounts are not configured.');
        const { error } = await supabase.auth.getSession();
        if (error) throw error;
      } catch {
        if (active) {
          toast.error('The email link could not finish sign-in here. Your email may still be verified; try logging in.');
        }
      }

      if (active) navigate('/', { replace: true });
    }

    void completeAuthCallback();
    return () => { active = false; };
  }, [navigate]);

  return <p role="status" className="min-h-screen flex items-center justify-center text-muted-foreground">Completing email verification...</p>;
}

const App: React.FC = () => {
  const [authReady, setAuthReady] = useState(false);
  const [authInitError, setAuthInitError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function initializeAuth() {
      try {
        if (supabase) {
          const { error } = await supabase.auth.getSession();
          if (error) throw error;
        }
      } catch (reason) {
        if (active) {
          setAuthInitError(
            reason instanceof Error ? reason.message : 'Could not initialize Supabase authentication.',
          );
        }
      } finally {
        if (active) setAuthReady(true);
      }
    }

    void initializeAuth();
    return () => { active = false; };
  }, []);

  if (!authReady) {
    return <p role="status" className="min-h-screen flex items-center justify-center text-muted-foreground">Loading your account...</p>;
  }

  const hasSupabaseCallbackHash =
    /(?:access_token|refresh_token|type|error)=/i.test(window.location.hash);

  return (
    <AppProvider>
      {authInitError && (
        <div role="alert" className="fixed top-3 inset-x-3 z-50 mx-auto max-w-xl rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
          Authentication initialization failed: {authInitError}
        </div>
      )}
      <Router>
        <IntersectObserver />
        <Routes>
          {/* Public */}
          <Route path="/" element={<AuthPage />} />
          <Route path="/login" element={<Navigate to="/" replace />} />

          {/* Protected — nested under AppLayout shell */}
          <Route element={<RouteGuard><AppLayout /></RouteGuard>}>
            <Route path="/home"             element={<HomePage />} />
            <Route path="/instructions" element={<InstructionsPage />} />
            <Route path="/learn"            element={<LearnPage />} />
            <Route path="/learn/:gateId"    element={<GateDetailPage />} />
            <Route path="/tutorials"        element={<TutorialsPage />} />
            <Route path="/simulator"        element={<SimulatorPage />} />
            <Route path="/practice"         element={<PracticePage />} />
            <Route path="/circuit-builder"  element={<CircuitBuilderPage />} />
            <Route path="/games"            element={<GamesHubPage />} />
            <Route path="/games/gate-match" element={<GateMatchGame />} />
            <Route path="/games/blitz"      element={<BlitzGame />} />
            <Route path="/games/bool-builder" element={<BoolBuilderGame />} />
            <Route path="/games/maze"       element={<MazeGame />} />
            <Route path="/quiz"             element={<QuizPage />} />
            <Route path="/quiz/:gateId"    element={<QuizPage />} />
            <Route path="/progress"         element={<ProgressPage />} />
            <Route path="/achievements"     element={<AchievementsPage />} />
            <Route path="/profile"          element={<ProfilePage />} />
            <Route path="/settings"         element={<SettingsPage />} />
          </Route>

          <Route
            path="*"
            element={hasSupabaseCallbackHash ? <SupabaseAuthCallback /> : <NotFound />}
          />
        </Routes>
        <Toaster richColors position="top-right" />
      </Router>
    </AppProvider>
  );
};


export default App;
