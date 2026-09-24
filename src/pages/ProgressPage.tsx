import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import {
  GATE_TOPICS, GAMES, GameId, getGameProgress,
  XP_THRESHOLDS, getLevelFromXP, getXPForNextLevel, GAME_LEVELS
} from '@/lib/storage';
import { GATES } from '@/lib/gateData';
import { TrendingUp, BookOpen, Gamepad2, HelpCircle } from 'lucide-react';

const GAME_NAMES: Record<GameId, string> = {
  gateMatch: 'Gate Match',
  blitz: 'Truth Table Blitz',
  gatePuzzle: 'Gate Puzzle',
  boolBuilder: 'Bool Builder',
  maze: 'Logic Maze',
  sorter: 'Gate Sorter',
};

export default function ProgressPage() {
  const { user } = useApp();
  if (!user) return null;

  const xp = user.xp;
  const level = getLevelFromXP(xp);
  const prevXP = XP_THRESHOLDS[level - 1] ?? 0;
  const nextXP = getXPForNextLevel(level);
  const xpInLevel = xp - prevXP;
  const xpNeeded = nextXP - prevXP;

  // Compute total quiz completion
  const quizKeys = [...GATE_TOPICS, 'mixed'] as const;
  const quizDone = quizKeys.filter(k => user.quizScores[k] !== undefined).length;
  const quizTotal = quizKeys.length;

  // Topic study completion
  const topicsUnlocked = user.unlockedTopics.length;

  // Game stats
  const gameStats = GAMES.map(gameId => {
    const prog = getGameProgress(user, gameId);
    const completed = prog.filter(p => p.completed).length;
    const stars = prog.reduce((s, p) => s + p.stars, 0);
    return { gameId, completed, stars, total: GAME_LEVELS, maxStars: GAME_LEVELS * 3 };
  });
  const totalGameLevels = gameStats.reduce((s, g) => s + g.completed, 0);
  const totalMaxLevels = GAMES.length * GAME_LEVELS;

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto animate-pixel-fade">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">Progress</h1>
        <p className="text-muted-foreground text-sm">Track your journey through Logic Gate Learning Hub</p>
      </div>

      {/* Overall stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Level', value: level, sub: `${xp} XP total`, color: 'text-primary' },
          { label: 'Topics', value: `${topicsUnlocked}/8`, sub: 'unlocked', color: 'text-accent' },
          { label: 'Quizzes', value: `${quizDone}/${quizTotal}`, sub: 'completed', color: 'text-amber-500' },
          { label: 'Game Levels', value: `${totalGameLevels}/${totalMaxLevels}`, sub: 'completed', color: 'text-foreground' },
        ].map(stat => (
          <div key={stat.label} className="pixel-card p-4 text-center">
            <p className="text-muted-foreground text-xs mb-1">{stat.label}</p>
            <p className={`font-bold text-xl ${stat.color}`}>{stat.value}</p>
            <p className="text-muted-foreground text-xs mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* XP Progress */}
      <div className="pixel-card p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={16} className="text-primary" />
          <h3 className="font-semibold text-foreground text-sm">XP &amp; Level</h3>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Level {level}</span>
          <span>{xpInLevel} / {xpNeeded} XP</span>
          <span>Level {level + 1}</span>
        </div>
        <div className="pixel-progress mb-2">
          <div className="pixel-progress-fill" style={{ width: `${Math.round((xpInLevel / xpNeeded) * 100)}%` }} />
        </div>
        <p className="text-muted-foreground text-xs">
          Total XP: <span className="text-primary font-medium">{xp}</span> · {nextXP - xp} more to next level
        </p>
      </div>

      {/* Quiz scores */}
      <div className="pixel-card p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle size={16} className="text-amber-500" />
          <h3 className="font-semibold text-foreground text-sm">Quiz Scores</h3>
        </div>
        <div className="space-y-2.5">
          {[...GATE_TOPICS, 'mixed' as const].map(gateId => {
            const score = user.quizScores[gateId];
            const passed = score !== undefined && score >= 60;
            return (
              <div key={gateId} className="flex items-center gap-3">
                <span className="w-16 text-sm text-foreground font-medium shrink-0">{gateId}</span>
                <div className="flex-1 pixel-progress">
                  <div className={`pixel-progress-fill ${passed ? 'bg-accent' : score !== undefined ? 'bg-destructive' : ''}`}
                    style={{ width: `${score ?? 0}%` }} />
                </div>
                <span className={`w-10 text-right text-xs shrink-0 ${passed ? 'text-accent' : score !== undefined ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {score !== undefined ? `${score}%` : '—'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Game progress */}
      <div className="pixel-card p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Gamepad2 size={16} className="text-foreground" />
          <h3 className="font-semibold text-foreground text-sm">Game Progress</h3>
        </div>
        <div className="space-y-3">
          {gameStats.map(({ gameId, completed, stars, total, maxStars }) => (
            <div key={gameId}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-foreground font-medium">{GAME_NAMES[gameId]}</span>
                <span className="text-muted-foreground">
                  {completed}/{total} · <span className="text-amber-500">★ {stars}/{maxStars}</span>
                </span>
              </div>
              <div className="pixel-progress">
                <div className="pixel-progress-fill" style={{ width: `${Math.round((completed / total) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Topics grid */}
      <div className="pixel-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={16} className="text-accent" />
          <h3 className="font-semibold text-foreground text-sm">Gate Topics</h3>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {GATE_TOPICS.map(gateId => {
            const unlocked = user.unlockedTopics.includes(gateId);
            return (
              <div key={gateId}
                className={`pixel-card p-2 text-center ${unlocked ? 'border-accent/50' : 'border-border opacity-50'}`}>
                <p className={`text-xs font-bold mb-0.5 ${unlocked ? 'text-accent' : 'text-muted-foreground'}`}>
                  {unlocked ? '✓' : '·'}
                </p>
                <p className="text-foreground text-xs font-medium">{gateId}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
