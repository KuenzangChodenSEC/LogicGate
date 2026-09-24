import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import {
  GAME_LEVELS, getDifficulty, getXPForDifficulty,
  getGameProgress, setGameLevel, updateUser, checkAndAwardBadges
} from '@/lib/storage';
import { getSorterConfig } from '@/lib/gameLevels';
import { GateType, evaluateGate } from '@/lib/gateData';
import { LevelSelect, ResultsScreen } from './GateMatchGame';
import { DifficultyBadge } from '@/components/ui/PixelComponents';
import GateSVG from '@/components/GateSVG';
import { ArrowLeft, ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';

type Screen = 'levels' | 'playing' | 'results';

interface SorterItem {
  id: number;
  gate: GateType;
  inputA: number;
  inputB: number;
  output: number;
}

type Criteria = 'output_1' | 'output_0' | 'sequence' | 'pipeline';

interface SorterChallenge {
  items: SorterItem[];
  criteria: Criteria;
  targetSequence?: GateType[];
  inputA: number;
  inputB: number;
  description: string;
}

function genSorterChallenge(cfg: ReturnType<typeof getSorterConfig>): SorterChallenge {
  const inputA = Math.random() > 0.5 ? 1 : 0;
  const inputB = Math.random() > 0.5 ? 1 : 0;
  const pool = cfg.gates;

  const items: SorterItem[] = Array.from({ length: cfg.itemCount }, (_, i) => {
    const g = pool[i % pool.length];
    const isSingle = ['NOT', 'BUFFER'].includes(g);
    const out = isSingle ? evaluateGate(g, inputA) : evaluateGate(g, inputA, inputB);
    return { id: i, gate: g, inputA, inputB, output: out };
  });

  // Shuffle items
  const shuffled = [...items].sort(() => Math.random() - 0.5);

  let description: string;
  let targetSeq: GateType[] | undefined;

  if (cfg.criteria === 'output_1') {
    description = `Sort: gates with output=1 on LEFT, output=0 on RIGHT (A=${inputA}, B=${inputB})`;
  } else if (cfg.criteria === 'output_0') {
    description = `Sort: gates with output=0 on LEFT, output=1 on RIGHT (A=${inputA}, B=${inputB})`;
  } else if (cfg.criteria === 'sequence') {
    targetSeq = [...pool].sort(() => Math.random() - 0.5).slice(0, cfg.itemCount) as GateType[];
    description = `Arrange gates in this sequence: ${targetSeq.join(' → ')}`;
  } else {
    // pipeline: sort by output value ascending (0s first, then 1s)
    description = `Sort gates: outputs ascending (0s before 1s) for A=${inputA}, B=${inputB}`;
  }

  return {
    items: shuffled,
    criteria: cfg.criteria,
    targetSequence: targetSeq,
    inputA,
    inputB,
    description,
  };
}

function checkSolution(items: SorterItem[], challenge: SorterChallenge): boolean {
  if (challenge.criteria === 'output_1') {
    // output=1 items should come before output=0 items
    let foundZero = false;
    for (const item of items) {
      if (item.output === 0) foundZero = true;
      if (foundZero && item.output === 1) return false;
    }
    return true;
  }
  if (challenge.criteria === 'output_0') {
    let foundOne = false;
    for (const item of items) {
      if (item.output === 1) foundOne = true;
      if (foundOne && item.output === 0) return false;
    }
    return true;
  }
  if (challenge.criteria === 'sequence' && challenge.targetSequence) {
    return items.every((item, i) => item.gate === challenge.targetSequence![i]);
  }
  if (challenge.criteria === 'pipeline') {
    // ascending by output
    for (let i = 0; i < items.length - 1; i++) {
      if (items[i].output > items[i + 1].output) return false;
    }
    return true;
  }
  return false;
}

export default function SorterGame() {
  const { user, awardXP, refreshUser } = useApp();
  const [screen, setScreen] = useState<Screen>('levels');
  const [levelIdx, setLevelIdx] = useState(0);
  const [challenge, setChallenge] = useState<SorterChallenge | null>(null);
  const [items, setItems] = useState<SorterItem[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(0);

  const progress = user ? getGameProgress(user, 'sorter') : [];

  function startLevel(idx: number) {
    const cfg = getSorterConfig(idx + 1);
    const ch = genSorterChallenge(cfg);
    setChallenge(ch);
    setItems([...ch.items]);
    setLevelIdx(idx);
    setSelectedIdx(null);
    setMoves(0);
    setAttempts(0);
    setFeedback(null);
    setScore(0);
    setScreen('playing');
  }

  function swapItems(fromIdx: number, toIdx: number) {
    setItems(prev => {
      const next = [...prev];
      [next[fromIdx], next[toIdx]] = [next[toIdx], next[fromIdx]];
      return next;
    });
    setMoves(m => m + 1);
    setSelectedIdx(null);
  }

  function handleItemClick(idx: number) {
    if (selectedIdx === null) {
      setSelectedIdx(idx);
    } else if (selectedIdx === idx) {
      setSelectedIdx(null);
    } else {
      swapItems(selectedIdx, idx);
    }
  }

  function moveUp(idx: number) {
    if (idx === 0) return;
    swapItems(idx, idx - 1);
  }

  function moveDown(idx: number) {
    if (idx === items.length - 1) return;
    swapItems(idx, idx + 1);
  }

  function checkAnswer() {
    if (!challenge) return;
    const cfg = getSorterConfig(levelIdx + 1);
    const att = attempts + 1;
    setAttempts(att);
    const correct = checkSolution(items, challenge);
    if (correct) {
      const s = moves <= Math.ceil(cfg.itemCount / 2) ? 3 : moves <= cfg.moveLimit ? 2 : 1;
      const sc = Math.max(50, 500 - moves * 20);
      setStars(s);
      setScore(sc);
      setFeedback(`✓ Correct arrangement in ${moves} move${moves !== 1 ? 's' : ''}!`);
      finishLevel(sc, s);
    } else {
      setFeedback(`✗ Not quite right. Keep rearranging! (Attempt ${att})`);
    }
  }

  function finishLevel(sc: number, s: number) {
    const diff = getDifficulty(levelIdx);
    const xpEarned = getXPForDifficulty(diff) + (s === 3 ? 10 : 0);
    const prev = progress[levelIdx];
    const newData = { completed: true, bestScore: Math.max(sc, prev?.bestScore ?? 0), stars: Math.max(s, prev?.stars ?? 0) };
    const updatedUser = setGameLevel(user!, 'sorter', levelIdx, newData);
    const { user: withBadge } = checkAndAwardBadges(updatedUser);
    updateUser(withBadge);
    refreshUser();
    awardXP(xpEarned, `Gate Sorter Level ${levelIdx + 1}`);
    setTimeout(() => setScreen('results'), 1200);
  }

  if (screen === 'levels') return <LevelSelect gameTitle="GATE SORTER" progress={progress} user={user!} onSelect={startLevel} />;

  if (!user) return null;
  if (screen === 'results') {
    const diff = getDifficulty(levelIdx);
    return <ResultsScreen score={score} stars={stars} difficulty={diff} levelNum={levelIdx + 1}
      xpEarned={getXPForDifficulty(diff) + (stars === 3 ? 10 : 0)}
      onNext={() => levelIdx + 1 < GAME_LEVELS ? startLevel(levelIdx + 1) : setScreen('levels')}
      onRetry={() => startLevel(levelIdx)} onHub={() => setScreen('levels')} />;
  }

  if (!challenge) return null;
  const cfg = getSorterConfig(levelIdx + 1);

  return (
    <div className="p-4 md:p-8 max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <button onClick={() => setScreen('levels')} className="pixel-btn px-3 py-1.5 text-sm flex items-center gap-1">
          <ArrowLeft size={14} /> Levels
        </button>
        <div className="flex gap-3 text-sm items-center">
          <span className="font-medium text-foreground">Level {levelIdx + 1}</span>
          <DifficultyBadge level={levelIdx} />
          <span className="text-accent font-medium">Moves: {moves}/{cfg.moveLimit}</span>
        </div>
      </div>

      {/* Challenge description */}
      <div className="pixel-card p-4 mb-5">
        <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Goal</p>
        <p className="text-foreground text-sm">{challenge.description}</p>
      </div>

      {/* Target sequence hint */}
      {challenge.targetSequence && (
        <div className="pixel-card p-3 mb-4 bg-amber-50 border-amber-300">
          <p className="text-amber-700 text-xs font-semibold mb-1 uppercase tracking-wide">Target Order:</p>
          <div className="flex flex-wrap gap-2">
            {challenge.targetSequence.map((g, i) => (
              <span key={i} className="text-amber-800 border border-amber-300 bg-amber-100 px-2 py-0.5 text-xs rounded font-medium">
                {i + 1}. {g}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Sortable items */}
      <div className="space-y-2 mb-5">
        {items.map((item, idx) => (
          <div key={item.id}
            className={`pixel-card p-3 flex items-center gap-3 cursor-pointer border-2 transition-all ${
              selectedIdx === idx ? 'border-primary bg-primary/5' : 'border-border hover:border-accent'
            }`}
            onClick={() => handleItemClick(idx)}
          >
            <span className="text-muted-foreground w-5 shrink-0 text-xs">{idx + 1}.</span>
            <div className="shrink-0">
              <GateSVG gate={item.gate} size={36} active />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-foreground font-semibold text-sm">{item.gate}</span>
              <span className="text-muted-foreground text-xs ml-2">
                A={item.inputA}{['NOT','BUFFER'].includes(item.gate) ? '' : ` B=${item.inputB}`} → Y=
                <span className={item.output === 1 ? 'text-accent font-bold' : 'text-muted-foreground font-bold'}>{item.output}</span>
              </span>
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <button onClick={e => { e.stopPropagation(); moveUp(idx); }}
                className="pixel-btn p-1" disabled={idx === 0}>
                <ArrowUp size={12} />
              </button>
              <button onClick={e => { e.stopPropagation(); moveDown(idx); }}
                className="pixel-btn p-1" disabled={idx === items.length - 1}>
                <ArrowDown size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedIdx !== null && (
        <p className="text-primary text-xs mb-3 text-center font-medium">
          Item #{selectedIdx + 1} selected — click another item to swap
        </p>
      )}

      {/* Feedback */}
      {feedback && (
        <div className={`rounded-lg p-3 mb-4 text-sm font-medium ${feedback.startsWith('✓') ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
          {feedback}
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={checkAnswer} className="pixel-btn-primary px-8 py-2.5 text-sm">
          Check Order
        </button>
        <button onClick={() => { setItems([...challenge.items]); setMoves(0); setSelectedIdx(null); setFeedback(null); }}
          className="pixel-btn px-4 py-2.5 text-sm flex items-center gap-1">
          <RotateCcw size={13} /> Reset
        </button>
      </div>
    </div>
  );
}
