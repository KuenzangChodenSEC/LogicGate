import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { GAMES, GameId, getGameProgress, GAME_LEVELS } from '@/lib/storage';
import { Play, Puzzle, Timer, Hammer, Map } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const GAME_META: Record<GameId, { title: string; desc: string; accentClass: string; iconBg: string; path: string; Icon: LucideIcon }> = {
  blitz: { title: 'Truth Table Blitz', desc: 'Race the clock and choose the right outputs before time runs out.', accentClass: 'border-l-amber-400', iconBg: 'bg-amber-500/10 text-amber-600', path: '/games/blitz', Icon: Timer },
  maze: { title: 'Logic Maze', desc: 'Find your way through a maze by solving logic-gate challenges.', accentClass: 'border-l-cyan-500', iconBg: 'bg-cyan-500/10 text-cyan-600', path: '/games/maze', Icon: Map },
  boolBuilder: { title: 'Bool Builder', desc: 'Build Boolean expressions that match the target outputs.', accentClass: 'border-l-purple-400', iconBg: 'bg-purple-500/10 text-purple-600', path: '/games/bool-builder', Icon: Hammer },
  gateMatch: { title: 'Gate Match', desc: 'Match gate symbols with their names and train your memory.', accentClass: 'border-l-primary', iconBg: 'bg-primary/10 text-primary', path: '/games/gate-match', Icon: Puzzle },
};

export default function GamesHubPage() {
  const { user } = useApp();
  if (!user) return null;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto animate-pixel-fade">
      <div className="mb-6"><h1 className="text-2xl font-bold text-foreground mb-1">Games</h1><p className="text-muted-foreground text-sm">4 games · 60 levels each · earn XP and stars</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GAMES.map(gameId => {
          const meta = GAME_META[gameId];
          const progress = getGameProgress(user, gameId);
          const completedLevels = progress.filter(p => p.completed).length;
          const totalStars = progress.reduce((s, p) => s + p.stars, 0);
          const pct = Math.round((completedLevels / GAME_LEVELS) * 100);
          const Icon = meta.Icon;

          return (
            <div key={gameId} className={`pixel-card p-5 border-l-4 ${meta.accentClass} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}>
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center border border-current/10 shadow-sm ${meta.iconBg}`}><Icon size={29} strokeWidth={2.2} /></div>
                <div className="flex-1 min-w-0"><h3 className="font-semibold text-foreground mb-0.5">{meta.title}</h3><p className="text-muted-foreground text-sm">{meta.desc}</p></div>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3"><span><span className="text-foreground font-medium">{completedLevels}</span>/{GAME_LEVELS} levels</span><span><span className="text-amber-500 font-medium">★ {totalStars}</span>/{GAME_LEVELS * 3} stars</span></div>
              <div className="pixel-progress mb-4"><div className="pixel-progress-fill" style={{ width: `${pct}%` }} /></div>
              <Link to={meta.path} className="pixel-btn-primary px-4 py-2 inline-flex items-center gap-1.5 text-sm"><Play size={13} /> Play Game</Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
