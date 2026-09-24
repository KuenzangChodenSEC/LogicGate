import React from 'react';
import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

import AppLayout from './components/AppLayout';
import RouteGuard from './components/RouteGuard';

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

export interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
  public?: boolean;
}

// Wrap protected pages with RouteGuard + AppLayout
function Protected({ children }: { children: ReactNode }) {
  return (
    <RouteGuard>
      <AppLayout />
    </RouteGuard>
  );
}

export const routes: RouteConfig[] = [
  // Public
  { name: 'Auth',     path: '/',    element: <AuthPage />, public: true },
  // Redirect legacy root to auth
  { name: 'Redirect', path: '/login', element: <Navigate to="/" replace />, public: true },

  // Protected layout shell — all children rendered via <Outlet> in AppLayout
  {
    name: 'App',
    path: '/',
    element: (
      <RouteGuard>
        <AppLayout />
      </RouteGuard>
    ),
    visible: false,
  },

  // Protected pages (individual route entries; App.tsx nests these under AppLayout)
  { name: 'Home',            path: '/home',             element: <HomePage />,         visible: true },
  { name: 'Learn',           path: '/learn',            element: <LearnPage />,        visible: true },
  { name: 'Gate Detail',     path: '/learn/:gateId',    element: <GateDetailPage />,   visible: false },
  { name: 'Tutorials',       path: '/tutorials',        element: <TutorialsPage />,    visible: true },
  { name: 'Simulator',       path: '/simulator',        element: <SimulatorPage />,    visible: true },
  { name: 'Practice',        path: '/practice',         element: <PracticePage />,     visible: true },
  { name: 'Circuit Builder', path: '/circuit-builder',  element: <CircuitBuilderPage />, visible: true },
  { name: 'Games',           path: '/games',            element: <GamesHubPage />,     visible: true },
  { name: 'Gate Match',      path: '/games/gate-match', element: <GateMatchGame />,    visible: false },
  { name: 'Blitz',           path: '/games/blitz',      element: <BlitzGame />,        visible: false },
  { name: 'Gate Puzzle',     path: '/games/gate-puzzle',element: <GatePuzzleGame />,   visible: false },
  { name: 'Bool Builder',    path: '/games/bool-builder',element: <BoolBuilderGame />, visible: false },
  { name: 'Maze',            path: '/games/maze',       element: <MazeGame />,         visible: false },
  { name: 'Sorter',          path: '/games/sorter',     element: <SorterGame />,       visible: false },
  { name: 'Quiz',            path: '/quiz',             element: <QuizPage />,         visible: true },
  { name: 'Quiz Gate',       path: '/quiz/:gateId',     element: <QuizPage />,         visible: false },
  { name: 'Progress',        path: '/progress',         element: <ProgressPage />,     visible: true },
  { name: 'Achievements',    path: '/achievements',     element: <AchievementsPage />, visible: true },
  { name: 'Profile',         path: '/profile',          element: <ProfilePage />,      visible: true },
  { name: 'Settings',        path: '/settings',         element: <SettingsPage />,     visible: true },
  { name: '404',             path: '*',                 element: <NotFound />,         visible: false, public: true },
];
