import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '@/contexts/AppContext';
import {
  GAME_LEVELS, getDifficulty, getXPForDifficulty, getStarsForScore,
  isLevelUnlocked, setGameLevel, getGameProgress, updateUser, checkAndAwardBadges
} from '@/lib/storage';
import { getGateMatchConfig } from '@/lib/gameLevels';
import { StarRating, DifficultyBadge } from '@/components/ui/PixelComponents';import GateSVG from '@/components/GateSVG';
import type { GateType } from '@/lib/gateData';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

type Screen = 'levels' | 'playing' | 'results';

interface Card { id: number; gateType: GateType; cardType: 'symbol' | 'name'; matched: boolean; flipped: boolean; }

export default function GateMatchGame() {
  const { user, awardXP, refreshUser } = useApp();
  const [screen, setScreen] = useState<Screen>('levels');
  const [levelIdx, setLevelIdx] = useState(0);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [canFlip, setCanFlip] = useState(true);

  const progress = user ? getGameProgress(user, 'gateMatch') : [];

  function startLevel(idx: number) {
    const cfg = getGateMatchConfig(idx + 1);
    const gatePool: GateType[] = cfg.gates;
    const selected: GateType[] = [];
    for (let i = 0; i < cfg.pairs; i++) {
      selected.push(gatePool[i % gatePool.length]);
    }
    const cardList: Card[] = [];
    selected.forEach((g, i) => {
      cardList.push({ id: i * 2, gateType: g, cardType: 'symbol', matched: false, flipped: cfg.previewTime > 0 });
      cardList.push({ id: i * 2 + 1, gateType: g, cardType: 'name', matched: false, flipped: cfg.previewTime > 0 });
    });
    // Shuffle
    for (let i = cardList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardList[i], cardList[j]] = [cardList[j], cardList[i]];
    }

    setCards(cardList);
    setFlippedCards([]);
    setMatchedPairs(0);
    setScore(0);
    setTimeLeft(cfg.timeLimit);
    setStartTime(Date.now());
    setCanFlip(false);
    setLevelIdx(idx);
    setScreen('playing');

    if (cfg.previewTime > 0) {
      setTimeout(() => {
        setCards(prev => prev.map(c => ({ ...c, flipped: false })));
        setCanFlip(true);
      }, cfg.previewTime);
    } else {
      setCanFlip(true);
    }
  }

  useEffect(() => {
    if (screen !== 'playing') return;
    const cfg = getGateMatchConfig(levelIdx + 1);
    if (timeLeft <= 0) {
      finishLevel(matchedPairs, cfg.pairs, 0);
      return;
    }
    const t = setTimeout(() => setTimeLeft(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, screen]);

  const flipCard = useCallback((cardId: number) => {
    if (!canFlip) return;
    setCards(prev => {
      const card = prev.find(c => c.id === cardId);
      if (!card || card.matched || card.flipped) return prev;
      return prev.map(c => c.id === cardId ? { ...c, flipped: true } : c);
    });
    setFlippedCards(prev => {
      const next = [...prev, cardId];
      if (next.length === 2) {
        setCanFlip(false);
        setTimeout(() => checkMatch(next), 600);
        return [];
      }
      return next;
    });
  }, [canFlip]);

  function checkMatch(ids: number[]) {
    setCards(prev => {
      const [c1, c2] = ids.map(id => prev.find(c => c.id === id)!);
      if (c1 && c2 && c1.gateType === c2.gateType && c1.cardType !== c2.cardType) {
        const newPairs = matchedPairs + 1;
        setMatchedPairs(newPairs);
        setScore(s => s + 100 + timeLeft * 2);
        const cfg = getGateMatchConfig(levelIdx + 1);
        if (newPairs === cfg.pairs) {
          setTimeout(() => finishLevel(newPairs, cfg.pairs, timeLeft), 300);
        }
        setCanFlip(true);
        return prev.map(c => ids.includes(c.id) ? { ...c, matched: true } : c);
      }
      setCanFlip(true);
      return prev.map(c => ids.includes(c.id) ? { ...c, flipped: false } : c);
    });
  }

  function finishLevel(pairs: number, totalPairs: number, remaining: number) {
    const cfg = getGateMatchConfig(levelIdx + 1);
    const finalScore = pairs * 100 + remaining * 2;
    const stars = getStarsForScore(finalScore, totalPairs * 100 + cfg.timeLimit * 2);
    const diff = getDifficulty(levelIdx);
    const xpEarned = getXPForDifficulty(diff) + (stars === 3 ? 10 : 0);
    const prev = progress[levelIdx];
    const isNewBest = finalScore > (prev?.bestScore ?? 0);
    const newData = {
      completed: pairs >= totalPairs,
      bestScore: isNewBest ? finalScore : (prev?.bestScore ?? 0),
      stars: Math.max(stars, prev?.stars ?? 0),
    };
    const updatedUser = setGameLevel(user!, 'gateMatch', levelIdx, newData);
    const { user: withBadge } = checkAndAwardBadges(updatedUser);
    updateUser(withBadge);
    refreshUser();
    awardXP(xpEarned, `Gate Match Level ${levelIdx + 1}`);
    setScore(finalScore);
    setScreen('results');
  }

  if (!user) return null;

  if (screen === 'levels') {
    return <LevelSelect
      gameTitle="GATE MATCH"
      progress={progress}
      user={user}
      onSelect={startLevel}
    />;
  }

  if (screen === 'results') {
    const cfg = getGateMatchConfig(levelIdx + 1);
    const finalScore = matchedPairs * 100 + timeLeft * 2;
    const stars = getStarsForScore(finalScore, cfg.pairs * 100 + cfg.timeLimit * 2);
    const diff = getDifficulty(levelIdx);
    return (
      <ResultsScreen
        score={finalScore}
        stars={stars}
        difficulty={diff}
        levelNum={levelIdx + 1}
        xpEarned={getXPForDifficulty(diff) + (stars === 3 ? 10 : 0)}
        onNext={() => levelIdx + 1 < GAME_LEVELS ? startLevel(levelIdx + 1) : setScreen('levels')}
        onRetry={() => startLevel(levelIdx)}
        onHub={() => setScreen('levels')}
      />
    );
  }

  // Playing
  const cfg = getGateMatchConfig(levelIdx + 1);
  const cols = cfg.gridCols;

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      {/* HUD */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <button onClick={() => setScreen('levels')} className="pixel-btn px-3 py-1.5 text-sm flex items-center gap-1">
          <ArrowLeft size={14} /> Levels
        </button>
        <div className="flex gap-3 text-sm items-center">
          <span className="text-foreground font-medium">Level {levelIdx + 1}</span>
          <DifficultyBadge level={levelIdx} />
          <span className="text-accent font-medium">Pairs: {matchedPairs}/{cfg.pairs}</span>
          <span className={`font-bold ${timeLeft <= 10 ? 'text-destructive' : 'text-primary'}`}>⏱ {timeLeft}s</span>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => flipCard(card.id)}
            className={`aspect-square border-2 flex items-center justify-center text-xs transition-all ${
              card.matched ? 'bg-accent/20 border-accent opacity-50 cursor-default' :
              card.flipped ? 'bg-card border-primary' : 'bg-muted border-border hover:border-primary'
            }`}
            disabled={card.matched}
          >
            {card.flipped || card.matched ? (
              card.cardType === 'symbol' ? (
                <GateSVG gate={card.gateType} size={40} active />
              ) : (
                <span className="text-xs font-semibold text-foreground">{card.gateType}</span>
              )
            ) : (
              <span className="text-muted-foreground text-2xl">?</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ──── Shared components ────────────────────────────────────────────────────

export function LevelSelect({ gameTitle, progress, user, onSelect }: {
  gameTitle: string;
  progress: { completed: boolean; bestScore: number; stars: number }[];
  user: { unlockedTopics: string[] };
  onSelect: (idx: number) => void;
}) {
  const isUnlocked = (idx: number) => {
    if (idx === 0) return true;
    return progress[idx - 1]?.completed === true;
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto animate-pixel-fade">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/games" className="pixel-btn px-3 py-1.5 text-sm flex items-center gap-1">
          <ArrowLeft size={14} /> Games
        </Link>
        <h1 className="text-xl font-bold text-foreground">{gameTitle}</h1>
      </div>

      <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
        {Array.from({ length: GAME_LEVELS }).map((_, idx) => {
          const p = progress[idx];
          const diff = getDifficulty(idx);
          const diffColors: Record<string, string> = {
            Easy: 'border-accent', Medium: 'border-amber-400',
            Hard: 'border-orange-400', Expert: 'border-primary',
          };
          return (
            <button key={idx} onClick={() => onSelect(idx)}
              className={`pixel-card p-1.5 flex flex-col items-center gap-0.5 border-2 ${diffColors[diff]} hover:scale-95 active:scale-100 ${p?.completed ? 'bg-muted' : ''}`}
            >
              <span className="text-xs font-bold text-foreground">{idx + 1}</span>
              {p?.stars ? <StarRating stars={p.stars} /> : <span className="text-muted-foreground text-[10px]">☆☆☆</span>}
              {p?.bestScore ? <span className="text-[10px] text-muted-foreground">{p.bestScore}</span> : null}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex gap-4 text-xs flex-wrap">
        {[['Easy', 'text-accent'], ['Medium', 'text-amber-400'], ['Hard', 'text-orange-400'], ['Expert', 'text-primary']].map(([d, c]) => (
          <span key={d}><span className={`${c} font-bold`}>■</span> {d}</span>
        ))}
      </div>
    </div>
  );
}

export function ResultsScreen({ score, stars, difficulty, levelNum, xpEarned, onNext, onRetry, onHub }: {
  score: number; stars: number; difficulty: string; levelNum: number; xpEarned: number;
  onNext: () => void; onRetry: () => void; onHub: () => void;
}) {
  return (
    <div className="p-6 max-w-sm mx-auto mt-10 animate-pixel-fade">
      <div className="pixel-card p-8 text-center">
        <h3 className="font-bold text-foreground text-lg mb-4">Level {levelNum} Complete!</h3>
        <div className="text-4xl mb-3 flex justify-center gap-1">
          <StarRating stars={stars} />
        </div>
        <div className="text-3xl font-bold text-foreground mb-1">{score}</div>
        <p className="text-muted-foreground text-sm mb-2">Score</p>
        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-5">+{xpEarned} XP</span>
        <div className="flex flex-col gap-2">
          <button onClick={onNext} className="pixel-btn-primary py-2.5 w-full">Next Level →</button>
          <button onClick={onRetry} className="pixel-btn py-2 w-full">Retry</button>
          <button onClick={onHub} className="pixel-btn py-2 w-full text-muted-foreground">Level Select</button>
        </div>
      </div>
    </div>
  );
}
