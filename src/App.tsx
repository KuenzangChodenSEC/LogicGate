import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IntersectObserver from '@/components/common/IntersectObserver';
import { Toaster } from '@/components/ui/sonner';
import { AppProvider } from '@/contexts/AppContext';
import AppLayout from '@/components/AppLayout';
import RouteGuard from '@/components/RouteGuard';

// Pages
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import LearnPage from './pages/LearnPage';
import GateDetailPage from './pages/GateDetailPage';
import TutorialsPage from './pages/TutorialsPage';
import SimulatorPage from './pages/SimulatorPage';
import PracticePage from './pages/PracticePage';
import CircuitBuilderPage from './pages/CircuitBuilderPage';
import GamesHubPage from './pages/GamesHubPage';
import GateMatchGame from './pages/games/GateMatchGame';
import BlitzGame from './pages/games/BlitzGame';
import GatePuzzleGame from './pages/games/GatePuzzleGame';
import BoolBuilderGame from './pages/games/BoolBuilderGame';
import MazeGame from './pages/games/MazeGame';
import SorterGame from './pages/games/SorterGame';
import QuizPage from './pages/QuizPage';
import ProgressPage from './pages/ProgressPage';
import AchievementsPage from './pages/AchievementsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router basename="/LogicGate">
        <IntersectObserver />
        <Routes>
          {/* Public */}
          <Route path="/" element={<AuthPage />} />
          <Route path="/login" element={<Navigate to="/" replace />} />

          {/* Protected — nested under AppLayout shell */}
          <Route element={<RouteGuard><AppLayout /></RouteGuard>}>
            <Route path="/home"             element={<HomePage />} />
            <Route path="/learn"            element={<LearnPage />} />
            <Route path="/learn/:gateId"    element={<GateDetailPage />} />
            <Route path="/tutorials"        element={<TutorialsPage />} />
            <Route path="/simulator"        element={<SimulatorPage />} />
            <Route path="/practice"         element={<PracticePage />} />
            <Route path="/circuit-builder"  element={<CircuitBuilderPage />} />
            <Route path="/games"            element={<GamesHubPage />} />
            <Route path="/games/gate-match" element={<GateMatchGame />} />
            <Route path="/games/blitz"      element={<BlitzGame />} />
            <Route path="/games/gate-puzzle" element={<GatePuzzleGame />} />
            <Route path="/games/bool-builder" element={<BoolBuilderGame />} />
            <Route path="/games/maze"       element={<MazeGame />} />
            <Route path="/games/sorter"     element={<SorterGame />} />
            <Route path="/quiz"             element={<QuizPage />} />
            <Route path="/quiz/:gateId"    element={<QuizPage />} />
            <Route path="/progress"         element={<ProgressPage />} />
            <Route path="/achievements"     element={<AchievementsPage />} />
            <Route path="/profile"          element={<ProfilePage />} />
            <Route path="/settings"         element={<SettingsPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster richColors position="top-right" />
      </Router>
    </AppProvider>
  );
};


export default App;
