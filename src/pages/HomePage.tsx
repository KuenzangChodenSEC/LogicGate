import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { GATE_TOPICS } from '@/lib/storage';
import { getLevelFromXP, getXPForNextLevel, XP_THRESHOLDS, BADGE_DEFS } from '@/lib/storage';
import GateSVG from '@/components/GateSVG';
import { BookOpen, Zap, Gamepad2, HelpCircle, Trophy, Star, TrendingUp } from 'lucide-react';

const QUICK_ACCESS = [
  { to: '/learn', icon: <BookOpen size={20} />, label: 'Learn', desc: 'Study all 8 gates' },
  { to: '/simulator', icon: <Zap size={20} />, label: 'Simulate', desc: 'Interactive gate sim' },
  { to: '/games', icon: <Gamepad2 size={20} />, label: 'Games', desc: '6 games, 60 levels' },
  { to: '/quiz', icon: <HelpCircle size={20} />, label: 'Quiz', desc: '10 questions each' },
];

export default function HomePage() {
  const { user } = useApp();
  if (!user) return null;

  const xp = user.xp;
  const level = getLevelFromXP(xp);
  const nextXP = getXPForNextLevel(level);
  const prevXP = XP_THRESHOLDS[level - 1] ?? 0;
  const xpPct = nextXP > prevXP ? Math.round(((xp - prevXP) / (nextXP - prevXP)) * 100) : 100;

  const quizDone = Object.keys(user.quizScores).length;
  const totalTopics = GATE_TOPICS.length;
  const badgesCount = user.badges.length;
  const recentBadges = BADGE_DEFS.filter(b => user.badges.includes(b.id)).slice(-3);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-pixel-fade">

      {/* Welcome banner */}
      <div className="pixel-card p-6 bg-gradient-to-br from-primary to-primary/80 text-white rounded-xl border-0">
        <p className="text-white/70 text-sm mb-1">Welcome back</p>
        <h1 className="text-2xl font-bold mb-3">{user.displayName}</h1>
        <div className="flex items-center gap-3 text-sm mb-3">
          <span className="bg-white/20 px-3 py-1 rounded-full">Level {level}</span>
          <span className="text-white/80">{xp} XP total</span>
        </div>
        <div className="max-w-xs">
          <div className="flex items-center justify-between text-xs text-white/70 mb-1">
            <span>XP Progress</span>
            <span>{xp}/{nextXP}</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all" style={{ width: `${xpPct}%` }} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Level', value: level, icon: <Star size={16} />, color: 'text-primary' },
          { label: 'Total XP', value: xp, icon: <TrendingUp size={16} />, color: 'text-amber-500' },
          { label: 'Badges', value: badgesCount, icon: <Trophy size={16} />, color: 'text-purple-500' },
          { label: 'Quizzes Done', value: `${quizDone}/${totalTopics}`, icon: <HelpCircle size={16} />, color: 'text-green-600' },
        ].map(stat => (
          <div key={stat.label} className="pixel-card p-4 text-center">
            <div className={`flex justify-center mb-2 ${stat.color}`}>{stat.icon}</div>
            <div className="text-xl font-bold text-foreground mb-0.5">{stat.value}</div>
            <div className="text-muted-foreground text-xs">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick access */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-3">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {QUICK_ACCESS.map(item => (
            <Link key={item.to} to={item.to}
              className="pixel-card p-4 flex flex-col gap-2 hover:shadow-md transition-shadow">
              <div className="text-primary">{item.icon}</div>
              <div>
                <div className="font-semibold text-foreground text-sm">{item.label}</div>
                <div className="text-muted-foreground text-xs">{item.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Gate topics grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-foreground">Gate Topics</h2>
          <Link to="/learn" className="text-primary text-sm hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {GATE_TOPICS.map((gate) => {
            const score = user.quizScores[gate];
            const passed = score !== undefined && score >= 60;
            return (
              <Link key={gate} to={`/learn/${gate.toLowerCase()}`}
                className="pixel-card p-3 text-center hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-2">
                  <GateSVG gate={gate} size={36} active />
                </div>
                <div className="text-foreground font-semibold text-sm mb-1">{gate}</div>
                {score !== undefined ? (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${passed ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {score}%
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">Not taken</span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent badges */}
      {recentBadges.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-foreground mb-3">Recent Badges</h2>
          <div className="flex gap-3 flex-wrap">
            {recentBadges.map(b => (
              <div key={b.id} className="pixel-card px-4 py-3 flex items-center gap-3 badge-earned">
                <span className="text-2xl">{b.icon}</span>
                <div>
                  <div className="text-foreground font-semibold text-sm">{b.name}</div>
                  <div className="text-muted-foreground text-xs">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quiz progress */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-foreground">Quiz Progress</h2>
          <Link to="/quiz" className="text-primary text-sm hover:underline">Take a quiz</Link>
        </div>
        <div className="pixel-card p-4 space-y-3">
          {GATE_TOPICS.map(gate => {
            const score = user.quizScores[gate];
            const passed = score !== undefined && score >= 60;
            return (
              <div key={gate} className="flex items-center gap-3">
                <span className="w-16 text-sm text-foreground font-medium shrink-0">{gate}</span>
                <div className="flex-1 pixel-progress">
                  <div className={`pixel-progress-fill ${passed ? 'bg-accent' : score !== undefined ? 'bg-primary' : ''}`}
                    style={{ width: score !== undefined ? `${score}%` : '0%' }} />
                </div>
                <span className="w-10 text-right text-muted-foreground text-xs shrink-0">
                  {score !== undefined ? `${score}%` : '—'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
