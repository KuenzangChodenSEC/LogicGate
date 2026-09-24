import React, { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import {
  GAME_LEVELS, getDifficulty, getXPForDifficulty,
  getGameProgress, setGameLevel, updateUser, checkAndAwardBadges
} from '@/lib/storage';
import { getPuzzleConfig } from '@/lib/gameLevels';
import { GateType, evaluateGate } from '@/lib/gateData';
import { LevelSelect, ResultsScreen } from './GateMatchGame';
import { DifficultyBadge } from '@/components/ui/PixelComponents';
import GateSVG from '@/components/GateSVG';
import { ArrowLeft } from 'lucide-react';

type Screen = 'levels' | 'playing' | 'results';

const ALL_GATES: GateType[] = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR', 'BUFFER'];

interface Puzzle {
  circuit: GateType[];
  hiddenIndices: number[];
  inputA: number;
  inputB: number;
  targetOutput: number;
  options: GateType[];
}

function generatePuzzle(cfg: ReturnType<typeof getPuzzleConfig>): Puzzle {
  const circuit: GateType[] = [];
  for (let i = 0; i < cfg.totalGates; i++) {
    circuit.push(cfg.gates[Math.floor(Math.random() * cfg.gates.length)]);
  }
  const inputA = Math.random() > 0.5 ? 1 : 0;
  const inputB = Math.random() > 0.5 ? 1 : 0;

  // Compute output by chaining gates
  let val = evaluateGate(circuit[0], inputA, inputB);
  for (let i = 1; i < circuit.length; i++) {
    const g = circuit[i];
    if (['NOT', 'BUFFER'].includes(g)) val = evaluateGate(g, val);
    else val = evaluateGate(g, val, inputA);
  }

  // Choose hidden indices
  const hiddenIndices: number[] = [];
  const indices = circuit.map((_, i) => i);
  for (let i = 0; i < cfg.hiddenCount && indices.length > 0; i++) {
    const pick = Math.floor(Math.random() * indices.length);
    hiddenIndices.push(indices.splice(pick, 1)[0]);
  }

  // Build options
  const correctGates = hiddenIndices.map(i => circuit[i]);
  const optionSet = new Set<GateType>(correctGates);
  while (optionSet.size < cfg.options) {
    optionSet.add(ALL_GATES[Math.floor(Math.random() * ALL_GATES.length)]);
  }
  const options = Array.from(optionSet).sort(() => Math.random() - 0.5);

  return { circuit, hiddenIndices, inputA, inputB, targetOutput: val, options };
}

export default function GatePuzzleGame() {
  const { user, awardXP, refreshUser } = useApp();
  const [screen, setScreen] = useState<Screen>('levels');
  const [levelIdx, setLevelIdx] = useState(0);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [answers, setAnswers] = useState<Record<number, GateType>>({});
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(0);

  const progress = user ? getGameProgress(user, 'gatePuzzle') : [];

  function startLevel(idx: number) {
    const cfg = getPuzzleConfig(idx + 1);
    setPuzzle(generatePuzzle(cfg));
    setLevelIdx(idx);
    setAnswers({});
    setAttempts(0);
    setFeedback(null);
    setScore(0);
    setScreen('playing');
  }

  function checkAnswers() {
    if (!puzzle) return;
    const allCorrect = puzzle.hiddenIndices.every(idx => answers[idx] === puzzle.circuit[idx]);
    const att = attempts + 1;
    setAttempts(att);
    if (allCorrect) {
      const s = att === 1 ? 3 : att === 2 ? 2 : 1;
      const sc = (4 - att) * 100;
      setStars(s);
      setScore(sc);
      setFeedback(`Correct! All gates identified in ${att} attempt${att > 1 ? 's' : ''}.`);
      finishLevel(sc, s);
    } else {
      setFeedback(`Not quite! Check your selections and try again. Attempt ${att}.`);
    }
  }

  function finishLevel(sc: number, s: number) {
    const diff = getDifficulty(levelIdx);
    const xpEarned = getXPForDifficulty(diff) + (s === 3 ? 10 : 0);
    const prev = progress[levelIdx];
    const newData = { completed: true, bestScore: Math.max(sc, prev?.bestScore ?? 0), stars: Math.max(s, prev?.stars ?? 0) };
    const updatedUser = setGameLevel(user!, 'gatePuzzle', levelIdx, newData);
    const { user: withBadge } = checkAndAwardBadges(updatedUser);
    updateUser(withBadge);
    refreshUser();
    awardXP(xpEarned, `Gate Puzzle Level ${levelIdx + 1}`);
    setTimeout(() => setScreen('results'), 1500);
  }

  if (screen === 'levels') return <LevelSelect gameTitle="GATE PUZZLE" progress={progress} user={user!} onSelect={startLevel} />;

  if (!user) return null;

  if (screen === 'results') {
    const diff = getDifficulty(levelIdx);
    return <ResultsScreen score={score} stars={stars} difficulty={diff} levelNum={levelIdx + 1}
      xpEarned={getXPForDifficulty(diff) + (stars === 3 ? 10 : 0)}
      onNext={() => levelIdx + 1 < GAME_LEVELS ? startLevel(levelIdx + 1) : setScreen('levels')}
      onRetry={() => startLevel(levelIdx)} onHub={() => setScreen('levels')} />;
  }

  if (!puzzle) return null;

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <button onClick={() => setScreen('levels')} className="pixel-btn px-3 py-1.5 text-sm flex items-center gap-1">
          <ArrowLeft size={14} /> Levels
        </button>
        <div className="flex gap-3 text-sm items-center">
          <span className="font-medium text-foreground">Level {levelIdx + 1}</span>
          <DifficultyBadge level={levelIdx} />
        </div>
      </div>

      {/* Goal */}
      <div className="pixel-card p-4 mb-5">
        <p className="text-muted-foreground text-xs uppercase tracking-wide mb-2">Target Output</p>
        <div className="flex items-center gap-3">
          <span className="text-sm text-foreground">A={puzzle.inputA} B={puzzle.inputB} →</span>
          <div className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center font-bold text-xl ${puzzle.targetOutput === 1 ? 'border-accent bg-accent/20 text-accent' : 'border-border bg-muted text-foreground'}`}>
            {puzzle.targetOutput}
          </div>
          <span className="text-muted-foreground text-sm">Find the hidden gate{puzzle.hiddenIndices.length > 1 ? 's' : ''}!</span>
        </div>
      </div>

      {/* Circuit display */}
      <div className="pixel-card p-5 mb-5">
        <p className="text-muted-foreground text-xs uppercase tracking-wide mb-4">Circuit (left → right)</p>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 rounded border border-border px-3 py-2 bg-muted text-sm">
            <span>A={puzzle.inputA}</span>
            <span>B={puzzle.inputB}</span>
          </div>
          <span className="text-primary font-bold">→</span>
          {puzzle.circuit.map((gate, idx) => {
            const isHidden = puzzle.hiddenIndices.includes(idx);
            const selected = answers[idx];
            return (
              <React.Fragment key={idx}>
                <div className={`rounded-lg border-2 p-2 text-center min-w-[64px] ${isHidden ? 'border-primary bg-primary/10' : 'border-border bg-muted'}`}>
                  {isHidden ? (
                    selected ? (
                      <div className="flex flex-col items-center">
                        <GateSVG gate={selected} size={36} active />
                        <span className="text-primary text-xs mt-1 font-medium">{selected}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-12">
                        <span className="text-primary text-2xl font-bold">?</span>
                      </div>
                    )
                  ) : (
                    <div className="flex flex-col items-center">
                      <GateSVG gate={gate} size={36} />
                      <span className="text-xs mt-1 text-muted-foreground">{gate}</span>
                    </div>
                  )}
                </div>
                {idx < puzzle.circuit.length - 1 && <span className="text-primary font-bold">→</span>}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Answer selection per hidden gate */}
      {puzzle.hiddenIndices.map(hidIdx => (
        <div key={hidIdx} className="pixel-card p-4 mb-4">
          <p className="text-foreground text-sm font-medium mb-3">Gate #{hidIdx + 1} options:</p>
          <div className="flex flex-wrap gap-2">
            {puzzle.options.map(opt => (
              <button key={opt}
                onClick={() => setAnswers(prev => ({ ...prev, [hidIdx]: opt }))}
                className={`px-3 py-2 rounded-lg border-2 flex items-center gap-2 text-sm font-medium transition-colors ${answers[hidIdx] === opt ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-foreground border-border hover:border-primary'}`}>
                <GateSVG gate={opt} size={28} active={answers[hidIdx] === opt} />
                <span>{opt}</span>
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Feedback */}
      {feedback && (
        <div className={`rounded-lg p-3 mb-4 text-sm font-medium ${feedback.includes('Correct') ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-amber-50 border border-amber-200 text-amber-800'}`}>
          {feedback}
        </div>
      )}

      <button onClick={checkAnswers}
        disabled={puzzle.hiddenIndices.some(idx => !answers[idx]) || screen !== 'playing'}
        className="pixel-btn-primary px-8 py-3 text-sm disabled:opacity-50">
        Check Answers
      </button>
    </div>
  );
}
