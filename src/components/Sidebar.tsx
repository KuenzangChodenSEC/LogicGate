import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { useApp } from '@/contexts/AppContext';
import { playNavigationSound } from '@/lib/gameAudio';
import {
  Home, BookOpen, PlayCircle, Zap, Wrench, Cpu, Gamepad2,
  HelpCircle, TrendingUp, Award, User, Settings, ChevronRight, X
} from 'lucide-react';
import { getLevelFromXP, getXPForNextLevel, XP_THRESHOLDS } from '@/lib/storage';

export interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/home', label: 'Home', icon: <Home size={16} /> },
  { path: '/learn', label: 'Learn', icon: <BookOpen size={16} /> },
  { path: '/tutorials', label: 'Tutorials', icon: <PlayCircle size={16} /> },
  { path: '/simulator', label: 'Simulator', icon: <Zap size={16} /> },
  { path: '/practice', label: 'Practice', icon: <Wrench size={16} /> },
  { path: '/circuit-builder', label: 'Circuit Builder', icon: <Cpu size={16} /> },
  { path: '/games', label: 'Games', icon: <Gamepad2 size={16} /> },
  { path: '/quiz', label: 'Quiz', icon: <HelpCircle size={16} /> },
  { path: '/progress', label: 'Progress', icon: <TrendingUp size={16} /> },
  { path: '/achievements', label: 'Achievements', icon: <Award size={16} /> },
  { path: '/profile', label: 'Profile', icon: <User size={16} /> },
  { path: '/settings', label: 'Settings', icon: <Settings size={16} /> },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();
  const { user } = useApp();
  const shouldReduceMotion = useReducedMotion();
  const activeIndicatorId = open !== undefined ? 'sidebar-active-mobile' : 'sidebar-active-desktop';

  const xp = user?.xp ?? 0;
  const level = getLevelFromXP(xp);
  const nextXP = getXPForNextLevel(level);
  const prevXP = XP_THRESHOLDS[level - 1] ?? 0;
  const pct = nextXP > prevXP ? Math.round(((xp - prevXP) / (nextXP - prevXP)) * 100) : 100;

  return (
    <aside
      className={`flex flex-col w-64 shrink-0 h-screen bg-white border-r border-border overflow-y-auto ${
        open !== undefined ? (open ? 'flex' : 'hidden') : 'hidden md:flex'
      }`}
    >
      {/* Logo */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src={`${import.meta.env.BASE_URL}images/logo/logicgate-bhutan-logo.png`} alt="LogicGate logo" className="w-12 h-12 object-contain shrink-0" />
          <div>
            <p className="font-bold text-foreground text-sm leading-tight">LogicGate</p>
            <p className="text-muted-foreground text-xs">Class 9 DTI</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-muted-foreground hover:text-foreground p-1">
            <X size={18} />
          </button>
        )}
      </div>

      {/* User mini profile */}
      {user && (
        <div className="px-4 py-3 border-b border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 shrink-0 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm overflow-hidden">
              {user.avatarImage
                ? <img src={user.avatarImage} alt="" className="w-full h-full object-cover" />
                : user.displayName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-foreground font-medium truncate text-sm">{user.displayName}</p>
              <p className="text-muted-foreground text-xs">Level {level} · {xp} XP</p>
            </div>
          </div>
          <div className="pixel-progress">
            <div className="pixel-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-muted-foreground text-xs mt-1">{xp} / {nextXP} XP</p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 py-2 px-2">
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => {
                if (location.pathname !== item.path) playNavigationSound();
                onClose?.();
              }}
              aria-current={active ? 'page' : undefined}
              className={`sidebar-nav-item relative flex items-center gap-3 px-3 py-2 rounded-md text-sm mb-0.5 transition-all duration-200 ${
                active
                  ? 'text-white font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {active && (
                <motion.span
                  layoutId={activeIndicatorId}
                  className="absolute inset-0 z-0 rounded-md bg-primary"
                  transition={shouldReduceMotion ? { duration: 0 } : { type: 'tween', duration: 0.22, ease: 'easeInOut' }}
                  aria-hidden="true"
                />
              )}
              <span className="relative z-10 shrink-0">{item.icon}</span>
              <span className="relative z-10 flex-1">{item.label}</span>
              {active && <ChevronRight className="relative z-10" size={12} />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border">
        <p className="text-muted-foreground text-xs text-center">Class 9 DTI · Bhutan</p>
      </div>
    </aside>
  );
}
