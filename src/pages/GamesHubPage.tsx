import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { GAMES, GameId, getGameProgress, GAME_LEVELS } from '@/lib/storage';
import { Play } from 'lucide-react';

const GAME_META: Record<GameId, { title: string; desc: string; accentClass: string; path: string; icon: string }> = {
  gateMatch:  { title: 'Gate Match',         desc: 'Flip cards to match gate symbols with names. 60 memory levels!',         accentClass: 'border-l-primary',   path: '/games/gate-match',  icon: '🃏' },
  blitz:      { title: 'Truth Table Blitz',  desc: 'Beat the clock answering logic gate outputs before time runs out.',      accentClass: 'border-l-amber-400', path: '/games/blitz',       icon: '⚡' },
  gatePuzzle: { title: 'Gate Puzzle',        desc: 'Identify hidden gates in circuits. 60 increasingly complex puzzles!',    accentClass: 'border-l-accent',    path: '/games/gate-puzzle', icon: '🔮' },
  boolBuilder:{ title: 'Bool Builder',       desc: 'Construct Boolean expressions to match truth tables. 60 challenges!',    accentClass: 'border-l-purple-400',path: '/games/bool-builder',icon: '🔧' },
  maze:       { title: 'Logic Maze',         desc: 'Navigate mazes by solving gate puzzles at every junction.',              accentClass: 'border-l-cyan-500',  path: '/games/maze',        icon: '🗺️' },
  sorter:     { title: 'Gate Sorter',        desc: 'Sort and sequence gates to produce target outputs. 60 challenges!',      accentClass: 'border-l-rose-400',  path: '/games/sorter',      icon: '🔀' },
};

export default function GamesHubPage() {
  const { user } = useApp();
  if (!user) return null;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto animate-pixel-fade">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">Games</h1>
        <p className="text-muted-foreground text-sm">6 games · 60 levels each · earn XP and stars</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GAMES.map(gameId => {
          const meta = GAME_META[gameId];
          const progress = getGameProgress(user, gameId);
          const completedLevels = progress.filter(p => p.completed).length;
          const totalStars = progress.reduce((s, p) => s + p.stars, 0);
          const pct = Math.round((completedLevels / GAME_LEVELS) * 100);

          return (
            <div key={gameId} className={`pixel-card p-5 border-l-4 ${meta.accentClass}`}>
              <div className="flex items-start gap-3 mb-4">
                <span className="text-3xl shrink-0">{meta.icon}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-0.5">{meta.title}</h3>
                  <p className="text-muted-foreground text-sm">{meta.desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <span><span className="text-foreground font-medium">{completedLevels}</span>/{GAME_LEVELS} levels</span>
                <span><span className="text-amber-500 font-medium">★ {totalStars}</span>/{GAME_LEVELS * 3} stars</span>
              </div>

              <div className="pixel-progress mb-4">
                <div className="pixel-progress-fill" style={{ width: `${pct}%` }} />
              </div>

              <Link to={meta.path} className="pixel-btn-primary px-4 py-2 inline-flex items-center gap-1.5 text-sm">
                <Play size={13} /> Play
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
