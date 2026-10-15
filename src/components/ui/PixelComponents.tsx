import React from 'react';
import { getDifficulty } from '@/lib/storage';

interface StarRatingProps {
  stars: number;
  max?: number;
}

export function StarRating({ stars, max = 3 }: StarRatingProps) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={i < stars ? 'star-filled' : 'star-empty'}>★</span>
      ))}
    </span>
  );
}

interface DifficultyBadgeProps {
  level: number; // 0-indexed
}

const DIFF_COLORS: Record<string, string> = {
  Easy: 'bg-accent/20 text-accent border-accent',
  Medium: 'bg-warning/20 text-warning border-warning',
  Hard: 'bg-secondary/20 text-secondary border-secondary',
  Expert: 'bg-primary/20 text-primary border-primary',
};

export function DifficultyBadge({ level }: DifficultyBadgeProps) {
  const diff = getDifficulty(level);
  return (
    <span className={`inline-block text-xs px-1 py-0.5 border ${DIFF_COLORS[diff]}`}
      style={{ fontFamily: "'VT323', monospace", fontSize: '0.85rem' }}>
      {diff.toUpperCase()}
    </span>
  );
}

interface PixelProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  label?: string;
  height?: number;
}

export function PixelProgressBar({ value, max = 100, color, label, height = 12 }: PixelProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div>
      {label && <div className="flex justify-between text-xs text-muted-foreground mb-1" style={{ fontFamily: "'VT323', monospace" }}>
        <span>{label}</span><span>{pct}%</span>
      </div>}
      <div className="pixel-progress border border-border" style={{ height }}>
        <div
          className="h-full transition-all"
          style={{ width: `${pct}%`, background: color || 'hsl(var(--primary))', transition: 'width 0.3s steps(10)' }}
        />
      </div>
    </div>
  );
}

interface XPBadgeProps {
  xp: number;
}

export function XPBadge({ xp }: XPBadgeProps) {
  return (
    <span className="xp-pill">+{xp} XP</span>
  );
}
